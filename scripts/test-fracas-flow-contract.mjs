import assert from 'node:assert/strict'
import {
  calculateRamsDurations,
  calculateVerificationWindow,
  evaluateFracasClosure,
  evaluateFracasTransition,
} from '../src/domains/fracas/fracas-flow-contract.ts'

const now = new Date('2026-09-30T00:00:00Z')
const base = {
  presentTags: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  milestones: {
    'ticket-resolved': '2026-09-22T01:00:00Z',
    'service-restored': '2026-09-22T01:10:00Z',
    'repair-completed': '2026-09-22T02:00:00Z',
    'return-to-service': '2026-09-22T02:15:00Z',
  },
  gate: {
    safetyOrMajorImpact: false,
    hazardReviewed: false,
    effectivenessCheckRequired: true,
    verificationStatus: 'passed',
    verificationWindowOpenedAt: '2026-09-22T03:00:00Z',
    verificationWindowEndsAt: '2026-09-27T03:00:00Z',
    recurrenceDetected: false,
    highImpactRecurringOrOverdue: false,
  },
  hasRootCause: true,
  hasCorrectiveActionOwner: true,
  hasCorrectiveActionTarget: true,
  hasVerificationEvidence: true,
  technicalRecoveryRecorded: true,
  fracasClosureStatusClosed: true,
  ticketStatusClosed: true,
}

assert.equal(evaluateFracasTransition(4, 5, base, now).allowed, true)

const missingEvidence = structuredClone(base)
missingEvidence.presentTags = ['A', 'B', 'C', 'D', 'E', 'F']
const missingDecision = evaluateFracasTransition(4, 5, missingEvidence, now)
assert.equal(missingDecision.allowed, false)
assert.deepEqual(missingDecision.missingTags, ['G'])

const safety = structuredClone(base)
safety.gate.safetyOrMajorImpact = true
safety.gate.hazardReviewed = false
const safetyDecision = evaluateFracasTransition(1, 2, safety, now)
assert.equal(safetyDecision.allowed, false)
assert.ok(safetyDecision.blockers.some((value) => value.includes('Hazard Log')))

const safetyReviewed = structuredClone(safety)
safetyReviewed.gate.hazardReviewed = true
assert.equal(evaluateFracasTransition(1, 2, safetyReviewed, now).allowed, true)

const earlyPass = structuredClone(base)
earlyPass.gate.verificationWindowEndsAt = '2026-10-01T00:00:00Z'
assert.equal(evaluateFracasTransition(4, 5, earlyPass, now).allowed, false)

const recurrence = structuredClone(base)
recurrence.gate.recurrenceDetected = true
recurrence.gate.verificationStatus = 'passed'
const recurrenceDecision = evaluateFracasTransition(4, 5, recurrence, now)
assert.equal(recurrenceDecision.allowed, false)
assert.ok(recurrenceDecision.blockers.some((value) => value.includes('Recurrence')))

const waivedWithoutEvidence = structuredClone(base)
waivedWithoutEvidence.gate.verificationStatus = 'waived'
waivedWithoutEvidence.hasVerificationEvidence = false
assert.equal(evaluateFracasTransition(4, 5, waivedWithoutEvidence, now).allowed, false)

const frbReturn = structuredClone(base)
frbReturn.gate.highImpactRecurringOrOverdue = true
frbReturn.gate.frbDecision = 'return-for-action'
const frbReturnDecision = evaluateFracasTransition(4, 5, frbReturn, now)
assert.equal(frbReturnDecision.allowed, false)
assert.ok(frbReturnDecision.route.includes('frb-management'))

const frbVerification = structuredClone(base)
frbVerification.gate.highImpactRecurringOrOverdue = true
frbVerification.gate.frbDecision = 'require-verification'
assert.equal(evaluateFracasTransition(4, 5, frbVerification, now).allowed, false)

const frbApproved = structuredClone(base)
frbApproved.gate.highImpactRecurringOrOverdue = true
frbApproved.gate.frbDecision = 'approve-closure'
frbApproved.gate.closureApproved = true
assert.equal(evaluateFracasTransition(4, 5, frbApproved, now).allowed, true)

const duplicatedMilestone = structuredClone(base)
duplicatedMilestone.milestones['repair-completed'] = duplicatedMilestone.milestones['service-restored']
assert.equal(evaluateFracasTransition(4, 5, duplicatedMilestone, now).allowed, false)

const closureWithoutTicket = structuredClone(base)
closureWithoutTicket.ticketStatusClosed = false
const closureDecision = evaluateFracasClosure(closureWithoutTicket, now)
assert.equal(closureDecision.readyForFracasClosure, true)
assert.equal(closureDecision.readyForTicketClosure, false)

const closureIncomplete = structuredClone(base)
closureIncomplete.fracasClosureStatusClosed = false
assert.equal(evaluateFracasClosure(closureIncomplete, now).readyForFracasClosure, false)

assert.equal(
  calculateVerificationWindow('2026-09-22T03:00:00Z'),
  '2026-09-27T03:00:00.000Z'
)

const durations = calculateRamsDurations(base)
assert.equal(durations.ticketToServiceRestoreMs, 10 * 60 * 1000)
assert.equal(durations.serviceRestoreToRepairMs, 50 * 60 * 1000)
assert.equal(durations.repairToReturnToServiceMs, 15 * 60 * 1000)

console.log('FRACAS flow contract proof passed')
