export type FracasPhaseId = 1 | 2 | 3 | 4 | 5
export type FracasLane = 'operation' | 'coordination' | 'maintenance' | 'technical-safety' | 'frb-management'
export type FracasDataTag = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type FracasMilestone =
  | 'ticket-resolved'
  | 'service-restored'
  | 'repair-completed'
  | 'return-to-service'
  | 'verified'
  | 'closed'

export interface FracasGateInput {
  safetyOrMajorImpact: boolean
  effectivenessCheckRequired: boolean
  effectivenessPassed?: boolean
  highImpactRecurringOrOverdue: boolean
  frbApproved?: boolean
}

export interface FracasEvidenceState {
  presentTags: FracasDataTag[]
  milestones: Partial<Record<FracasMilestone, string>>
  gate: FracasGateInput
  hasRootCause: boolean
  hasCorrectiveActionOwner: boolean
  hasCorrectiveActionTarget: boolean
  hasVerificationEvidence: boolean
  hasClosureApproval: boolean
}

export interface FracasTransitionDecision {
  allowed: boolean
  fromPhase: FracasPhaseId
  toPhase: FracasPhaseId
  missingTags: FracasDataTag[]
  blockers: string[]
  route: FracasLane[]
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

export function evaluateFracasTransition(
  fromPhase: FracasPhaseId,
  toPhase: FracasPhaseId,
  evidence: FracasEvidenceState
): FracasTransitionDecision {
  const blockers: string[] = []
  const requiredForTarget = missingTags(toPhase, evidence)

  if (toPhase !== fromPhase + 1) blockers.push('FRACAS transitions must advance one phase at a time')
  blockers.push(...validateMilestoneSeparation(evidence))

  if (fromPhase === 1 && evidence.gate.safetyOrMajorImpact) {
    blockers.push('Technical Safety / HL escalation is required before leaving Phase 1')
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

  if (toPhase === 5 && evidence.gate.effectivenessCheckRequired && !evidence.hasVerificationEvidence) {
    blockers.push('Verification evidence is required when effectiveness check is required')
  }

  if (toPhase === 5 && evidence.gate.effectivenessCheckRequired && evidence.gate.effectivenessPassed !== true) {
    blockers.push('Effectiveness check must pass before closure routing')
  }

  if (toPhase === 5 && evidence.gate.highImpactRecurringOrOverdue && evidence.gate.frbApproved !== true) {
    blockers.push('FRB approval is required for high-impact, recurring, or overdue cases')
  }

  if (toPhase === 5 && evidence.gate.highImpactRecurringOrOverdue && !evidence.hasClosureApproval) {
    blockers.push('Management closure approval is required after FRB review')
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

export function calculateRamsDurations(evidence: FracasEvidenceState) {
  const parse = (value?: string) => (value ? new Date(value).getTime() : undefined)
  const failure = parse(evidence.milestones['ticket-resolved'])
  const restored = parse(evidence.milestones['service-restored'])
  const repaired = parse(evidence.milestones['repair-completed'])
  const rts = parse(evidence.milestones['return-to-service'])

  return {
    ticketToServiceRestoreMs: failure !== undefined && restored !== undefined ? Math.max(0, restored - failure) : undefined,
    serviceRestoreToRepairMs: restored !== undefined && repaired !== undefined ? Math.max(0, repaired - restored) : undefined,
    repairToReturnToServiceMs: repaired !== undefined && rts !== undefined ? Math.max(0, rts - repaired) : undefined,
  }
}
