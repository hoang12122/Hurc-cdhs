import assert from 'node:assert/strict'
import {
  calculateRamsDurations,
  evaluateFracasTransition,
} from '../src/domains/fracas/fracas-flow-contract.ts'

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
    effectivenessCheckRequired: true,
    effectivenessPassed: true,
    highImpactRecurringOrOverdue: false,
  },
  hasRootCause: true,
  hasCorrectiveActionOwner: true,
  hasCorrectiveActionTarget: true,
  hasVerificationEvidence: true,
  hasClosureApproval: false,
}

assert.equal(evaluateFracasTransition(4, 5, base).allowed, true)

const missingEvidence = structuredClone(base)
missingEvidence.presentTags = ['A', 'B', 'C', 'D', 'E', 'F']
const missingDecision = evaluateFracasTransition(4, 5, missingEvidence)
assert.equal(missingDecision.allowed, false)
assert.deepEqual(missingDecision.missingTags, ['G'])

const safety = structuredClone(base)
safety.gate.safetyOrMajorImpact = true
const safetyDecision = evaluateFracasTransition(1, 2, safety)
assert.equal(safetyDecision.allowed, false)
assert.ok(safetyDecision.blockers.some((value) => value.includes('Technical Safety')))

const verification = structuredClone(base)
verification.hasVerificationEvidence = false
assert.equal(evaluateFracasTransition(4, 5, verification).allowed, false)

const frb = structuredClone(base)
frb.gate.highImpactRecurringOrOverdue = true
frb.gate.frbApproved = false
const frbDecision = evaluateFracasTransition(4, 5, frb)
assert.equal(frbDecision.allowed, false)
assert.ok(frbDecision.route.includes('frb-management'))

const duplicatedMilestone = structuredClone(base)
duplicatedMilestone.milestones['repair-completed'] = duplicatedMilestone.milestones['service-restored']
assert.equal(evaluateFracasTransition(4, 5, duplicatedMilestone).allowed, false)

const durations = calculateRamsDurations(base)
assert.equal(durations.ticketToServiceRestoreMs, 10 * 60 * 1000)
assert.equal(durations.serviceRestoreToRepairMs, 50 * 60 * 1000)
assert.equal(durations.repairToReturnToServiceMs, 15 * 60 * 1000)

console.log('FRACAS flow contract proof passed')
