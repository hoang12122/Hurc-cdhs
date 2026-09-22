export type FracasPhaseId = 1 | 2 | 3 | 4 | 5
export type FracasLane = 'operation' | 'coordination' | 'maintenance' | 'technical-safety' | 'frb-management'
export type FracasDataTag = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
export type FracasVerificationStatus = 'not-required' | 'pending' | 'passed' | 'waived' | 'failed'
export type FracasFrbDecision = 'approve-closure' | 'require-verification' | 'return-for-action'

export type FracasMilestone =
  | 'ticket-resolved'
  | 'service-restored'
  | 'repair-completed'
  | 'return-to-service'
  | 'verified'
  | 'closed'

export interface FracasGateInput {
  safetyOrMajorImpact: boolean
  hazardReviewed?: boolean
  effectivenessCheckRequired: boolean
  verificationStatus?: FracasVerificationStatus
  verificationWindowOpenedAt?: string
  verificationWindowEndsAt?: string
  recurrenceDetected?: boolean
  highImpactRecurringOrOverdue: boolean
  frbDecision?: FracasFrbDecision
  frbDecisionAt?: string
  closureApproved?: boolean
}

export interface FracasEvidenceState {
  presentTags: FracasDataTag[]
  milestones: Partial<Record<FracasMilestone, string>>
  gate: FracasGateInput
  hasRootCause: boolean
  hasCorrectiveActionOwner: boolean
  hasCorrectiveActionTarget: boolean
  hasVerificationEvidence: boolean
  technicalRecoveryRecorded?: boolean
  fracasClosureStatusClosed?: boolean
  ticketStatusClosed?: boolean
}

export interface FracasTransitionDecision {
  allowed: boolean
  fromPhase: FracasPhaseId
  toPhase: FracasPhaseId
  missingTags: FracasDataTag[]
  blockers: string[]
  route: FracasLane[]
}

export interface FracasClosureDecision {
  readyForFracasClosure: boolean
  readyForTicketClosure: boolean
  blockers: string[]
}

export const PHASE_REQUIRED_TAGS: Record<FracasPhaseId, FracasDataTag[]> = {
  1: ['A', 'B', 'C', 'E'],
  2: ['B', 'C', 'D', 'E'],
  3: ['B', 'F', 'G'],
  4: ['F', 'G'],
  5: ['F', 'G'],
}

export const PHASE_DEFAULT_ROUTE: Record<FracasPhaseId, FracasLane[]> = {
  1: ['operation', 'coordination'],
  2: ['coordination', 'maintenance'],
  3: ['maintenance', 'technical-safety'],
  4: ['maintenance', 'technical-safety'],
  5: ['technical-safety', 'frb-management'],
}

function uniq<T>(values: T[]) {
  return [...new Set(values)]
}

function missingTags(phase: FracasPhaseId, evidence: FracasEvidenceState) {
  const present = new Set(evidence.presentTags)
  return PHASE_REQUIRED_TAGS[phase].filter((tag) => !present.has(tag))
}

function parseTime(value?: string) {
  if (!value) return undefined
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? undefined : time
}

export function validateMilestoneSeparation(evidence: FracasEvidenceState) {
  const ordered: FracasMilestone[] = [
    'ticket-resolved',
    'service-restored',
    'repair-completed',
    'return-to-service',
  ]

  const seen = new Map<string, FracasMilestone>()
  const blockers: string[] = []

  for (const milestone of ordered) {
    const at = evidence.milestones[milestone]
    if (!at) continue
    const prior = seen.get(at)
    if (prior) blockers.push(`${prior} and ${milestone} must be captured as distinct milestones`)
    else seen.set(at, milestone)
  }

  return blockers
}

export function validateVerificationWindow(evidence: FracasEvidenceState, now = new Date()) {
  const blockers: string[] = []
  const gate = evidence.gate

  if (!gate.effectivenessCheckRequired) return blockers

  if (!gate.verificationStatus) blockers.push('G2 verification status must be decided')
  if (gate.recurrenceDetected && gate.verificationStatus !== 'failed') {
    blockers.push('Recurrence during verification must set verification status to failed')
  }

  if (gate.verificationStatus === 'pending') {
    const opened = parseTime(gate.verificationWindowOpenedAt)
    const ends = parseTime(gate.verificationWindowEndsAt)
    if (opened === undefined || ends === undefined) blockers.push('Verification window timestamps are required')
    else if (ends <= opened) blockers.push('Verification window end must be after its start')
  }

  if (gate.verificationStatus === 'passed') {
    const ends = parseTime(gate.verificationWindowEndsAt)
    if (ends === undefined) blockers.push('Verification window end is required before recording pass')
    else if (now.getTime() < ends) blockers.push('Verification cannot pass before the monitoring window ends')
  }

  if (gate.verificationStatus === 'waived' && !evidence.hasVerificationEvidence) {
    blockers.push('Verification waiver reason/evidence is required')
  }

  return blockers
}

export function evaluateFracasTransition(
  fromPhase: FracasPhaseId,
  toPhase: FracasPhaseId,
  evidence: FracasEvidenceState,
  now = new Date()
): FracasTransitionDecision {
  const blockers: string[] = []
  const requiredForTarget = missingTags(toPhase, evidence)

  if (toPhase !== fromPhase + 1) blockers.push('FRACAS transitions must advance one phase at a time')
  blockers.push(...validateMilestoneSeparation(evidence))

  if (fromPhase === 1 && evidence.gate.safetyOrMajorImpact && evidence.gate.hazardReviewed !== true) {
    blockers.push('Technical Safety / Hazard Log review is required before leaving Phase 1')
  }

  if (toPhase >= 3 && !evidence.milestones['service-restored']) {
    blockers.push('Service-restored milestone is required before root-cause progression')
  }

  if (toPhase >= 4 && !evidence.hasRootCause) {
    blockers.push('Root cause must be established before long-term corrective action')
  }

  if (toPhase >= 4 && (!evidence.hasCorrectiveActionOwner || !evidence.hasCorrectiveActionTarget)) {
    blockers.push('Corrective action owner and target date are required')
  }

  if (toPhase === 5) {
    blockers.push(...validateVerificationWindow(evidence, now))

    if (evidence.gate.effectivenessCheckRequired) {
      const complete = evidence.gate.verificationStatus === 'passed' || evidence.gate.verificationStatus === 'waived'
      if (!complete) blockers.push('G2 verification must pass or be formally waived before closure routing')
    }

    if (evidence.gate.highImpactRecurringOrOverdue) {
      if (!evidence.gate.frbDecision) blockers.push('G3 requires an FRB decision for high-impact, recurring, or overdue cases')
      if (evidence.gate.frbDecision === 'require-verification') blockers.push('Latest FRB decision requires a new verification cycle')
      if (evidence.gate.frbDecision === 'return-for-action') blockers.push('Latest FRB decision returned the case for additional action')
      if (evidence.gate.frbDecision === 'approve-closure' && evidence.gate.closureApproved !== true) {
        blockers.push('FRB closure approval signature is required')
      }
    }
  }

  const route = [...PHASE_DEFAULT_ROUTE[toPhase]]
  if (evidence.gate.safetyOrMajorImpact) route.unshift('technical-safety')
  if (evidence.gate.highImpactRecurringOrOverdue) route.push('frb-management')

  return {
    allowed: blockers.length === 0 && requiredForTarget.length === 0,
    fromPhase,
    toPhase,
    missingTags: requiredForTarget,
    blockers: uniq(blockers),
    route: uniq(route),
  }
}

export function evaluateFracasClosure(evidence: FracasEvidenceState, now = new Date()): FracasClosureDecision {
  const blockers = validateVerificationWindow(evidence, now)

  if (evidence.gate.effectivenessCheckRequired) {
    const complete = evidence.gate.verificationStatus === 'passed' || evidence.gate.verificationStatus === 'waived'
    if (!complete) blockers.push('G2 must be completed before FRACAS closure')
  }

  if (evidence.gate.highImpactRecurringOrOverdue) {
    if (evidence.gate.frbDecision !== 'approve-closure' || evidence.gate.closureApproved !== true) {
      blockers.push('Latest FRB session must approve closure')
    }
  }

  if (evidence.technicalRecoveryRecorded !== true) blockers.push('Technical recovery status must be recorded')
  if (evidence.fracasClosureStatusClosed !== true) blockers.push('FRACAS closure status must be set to closed')

  const readyForFracasClosure = uniq(blockers).length === 0
  const ticketBlockers = [...blockers]
  if (evidence.ticketStatusClosed !== true) ticketBlockers.push('Ticket must be closed as the final independent step')

  return {
    readyForFracasClosure,
    readyForTicketClosure: readyForFracasClosure && evidence.ticketStatusClosed === true,
    blockers: uniq(ticketBlockers),
  }
}

export function calculateVerificationWindow(openedAt: string, days = 5) {
  const opened = parseTime(openedAt)
  if (opened === undefined || days <= 0) return undefined
  return new Date(opened + days * 86400000).toISOString()
}

export function calculateRamsDurations(evidence: FracasEvidenceState) {
  const ticketResolved = parseTime(evidence.milestones['ticket-resolved'])
  const restored = parseTime(evidence.milestones['service-restored'])
  const repaired = parseTime(evidence.milestones['repair-completed'])
  const rts = parseTime(evidence.milestones['return-to-service'])

  return {
    ticketToServiceRestoreMs:
      ticketResolved !== undefined && restored !== undefined ? Math.max(0, restored - ticketResolved) : undefined,
    serviceRestoreToRepairMs:
      restored !== undefined && repaired !== undefined ? Math.max(0, repaired - restored) : undefined,
    repairToReturnToServiceMs:
      repaired !== undefined && rts !== undefined ? Math.max(0, rts - repaired) : undefined,
  }
}
