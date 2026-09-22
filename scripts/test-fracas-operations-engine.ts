import assert from 'node:assert/strict'
import {
  appendGateDecision,
  currentGateDecision,
  deriveNotificationRecipients,
  deriveQueueIds,
  detectRecurrence,
  getRoleQueue,
} from '../src/domains/fracas/fracas-operations-engine.ts'

const now = new Date('2026-09-22T02:00:00Z')
const record = {
  id: 'INC-000042',
  reporterId: 'reporter-1',
  assignedUserId: 'tech-1',
  phase: 5 as const,
  phase1Complete: false,
  safetyImpact: true,
  g1Decision: 'yes' as const,
  hazardReviewComplete: false,
  rootCause: '',
  correctiveActionOpen: true,
  correctiveActionDueAt: '2026-09-21T00:00:00Z',
  g2Decision: 'yes' as const,
  verificationStatus: 'pending' as const,
  verificationWindowEndAt: '2026-09-26T00:00:00Z',
  g3Decision: 'yes' as const,
  frbDecision: 'return-for-action' as const,
}

const queues = deriveQueueIds(record, now)
assert.ok(queues.includes('phase-1-missing-data'))
assert.ok(queues.includes('return-to-service-pending'))
assert.ok(queues.includes('hazard-review-pending'))
assert.ok(queues.includes('root-cause-missing'))
assert.ok(queues.includes('my-corrective-actions-open'))
assert.ok(queues.includes('corrective-action-overdue'))
assert.ok(queues.includes('verification-monitoring'))
assert.ok(queues.includes('frb-pending'))

const ktat = getRoleQueue('technical-safety', [record], now)
assert.equal(ktat.length, 1)
assert.deepEqual(ktat[0].queues.sort(), ['hazard-review-pending', 'verification-monitoring'].sort())

const maintenance = getRoleQueue('maintenance', [record], now, 'tech-1')
assert.equal(maintenance.length, 1)
assert.ok(maintenance[0].queues.includes('root-cause-missing'))
assert.ok(maintenance[0].queues.includes('my-corrective-actions-open'))

const otherTech = getRoleQueue('maintenance', [record], now, 'tech-2')
assert.equal(otherTech.length, 1)
assert.deepEqual(otherTech[0].queues, ['root-cause-missing'])

const recurrence = detectRecurrence(
  {
    id: 'INC-new',
    assetId: 'PSD-PG05',
    classification: 'Door fault',
    location: 'TD',
    occurredAt: '2026-09-24T03:00:00Z',
  },
  [
    { id: 'INC-a', assetId: 'PSD-PG05', occurredAt: '2026-09-20T00:00:00Z' },
    { id: 'INC-b', classification: 'Door fault', location: 'TD', occurredAt: '2026-09-19T00:00:00Z' },
    { id: 'INC-c', classification: 'Other', location: 'TD', occurredAt: '2026-09-19T00:00:00Z' },
  ],
  '2026-09-26T00:00:00Z'
)
assert.deepEqual(recurrence.map((item) => item.id).sort(), ['INC-a', 'INC-b'])

const outsideWindow = detectRecurrence(
  { id: 'INC-late', assetId: 'PSD-PG05', occurredAt: '2026-09-27T00:00:00Z' },
  [{ id: 'INC-a', assetId: 'PSD-PG05', occurredAt: '2026-09-20T00:00:00Z' }],
  '2026-09-26T00:00:00Z'
)
assert.deepEqual(outsideWindow, [])

assert.deepEqual(deriveNotificationRecipients('G1_YES'), ['technical-safety'])
assert.deepEqual(deriveNotificationRecipients('G3_YES'), ['frb'])
assert.deepEqual(deriveNotificationRecipients('FRB_REQUIRE_VERIFICATION'), ['technical-safety'])
assert.deepEqual(deriveNotificationRecipients('VERIFICATION_VIOLATION'), ['technical-safety', 'coordinator'])

let history = appendGateDecision([], {
  id: 'g1-1',
  gate: 'G1',
  decision: 'yes',
  actorId: 'coord-1',
  decidedAt: '2026-09-22T01:00:00Z',
})
history = appendGateDecision(history, {
  id: 'g1-2',
  gate: 'G1',
  decision: 'no',
  actorId: 'coord-1',
  decidedAt: '2026-09-22T02:00:00Z',
  reason: 'Reviewed with additional evidence',
})
assert.equal(history[1].supersedesId, 'g1-1')
assert.equal(currentGateDecision(history, 'G1')?.id, 'g1-2')
assert.equal(history.length, 2)

console.log('FRACAS operations engine proof passed')
