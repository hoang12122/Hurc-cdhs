export type FracasRole =
  | 'reporter'
  | 'occ'
  | 'coordinator'
  | 'maintenance'
  | 'technical-safety'
  | 'frb'
  | 'it-admin'

export type FracasQueueId =
  | 'phase-1-missing-data'
  | 'return-to-service-pending'
  | 'gate-g1-pending'
  | 'gate-g3-pending'
  | 'corrective-action-overdue'
  | 'root-cause-missing'
  | 'my-corrective-actions-open'
  | 'hazard-review-pending'
  | 'gate-g2-pending'
  | 'verification-monitoring'
  | 'frb-pending'

export type FracasNotificationEvent =
  | 'G1_YES'
  | 'G3_YES'
  | 'FRB_REQUIRE_VERIFICATION'
  | 'VERIFICATION_VIOLATION'

export interface FracasOperationalRecord {
  id: string
  reporterId?: string
  assignedUserId?: string
  maintenanceGroupId?: string
  assetId?: string
  classification?: string
  location?: string
  phase: 1 | 2 | 3 | 4 | 5
  phase1Complete: boolean
  returnToServiceAt?: string
  rootCause?: string
  correctiveActionOpen?: boolean
  correctiveActionDueAt?: string
  safetyImpact?: boolean
  g1Decision?: 'yes' | 'no'
  hazardReviewComplete?: boolean
  g2Decision?: 'yes' | 'no'
  verificationStatus?: 'pending' | 'passed' | 'waived' | 'failed'
  verificationWindowEndAt?: string
  g3Decision?: 'yes' | 'no'
  frbDecision?: 'approve-closure' | 'require-verification' | 'return-for-action'
}

export interface RecurrenceCandidate {
  id: string
  assetId?: string
  classification?: string
  location?: string
  occurredAt: string
}

export interface GateAuditEntry {
  gate: 'G1' | 'G2' | 'G3'
  decision: 'yes' | 'no'
  actorId: string
  decidedAt: string
  reason?: string
  supersedesId?: string
  id: string
}

export const ROLE_QUEUES: Record<FracasRole, FracasQueueId[]> = {
  reporter: ['phase-1-missing-data'],
  occ: ['phase-1-missing-data', 'return-to-service-pending'],
  coordinator: ['gate-g1-pending', 'gate-g3-pending', 'corrective-action-overdue'],
  maintenance: ['root-cause-missing', 'my-corrective-actions-open'],
  'technical-safety': ['hazard-review-pending', 'gate-g2-pending', 'verification-monitoring'],
  frb: ['frb-pending'],
  'it-admin': [
    'phase-1-missing-data',
    'return-to-service-pending',
    'gate-g1-pending',
    'gate-g3-pending',
    'corrective-action-overdue',
    'root-cause-missing',
    'my-corrective-actions-open',
    'hazard-review-pending',
    'gate-g2-pending',
    'verification-monitoring',
    'frb-pending',
  ],
}

function isOverdue(value: string | undefined, now: Date) {
  if (!value) return false
  const due = new Date(value)
  return !Number.isNaN(due.getTime()) && due.getTime() < now.getTime()
}

export function deriveQueueIds(record: FracasOperationalRecord, now = new Date()): FracasQueueId[] {
  const queues: FracasQueueId[] = []

  if (!record.phase1Complete) queues.push('phase-1-missing-data')
  if (record.phase >= 3 && !record.returnToServiceAt) queues.push('return-to-service-pending')
  if (record.safetyImpact && !record.g1Decision) queues.push('gate-g1-pending')
  if (record.g1Decision === 'yes' && !record.hazardReviewComplete) queues.push('hazard-review-pending')
  if (record.phase >= 3 && !record.rootCause) queues.push('root-cause-missing')
  if (record.correctiveActionOpen) queues.push('my-corrective-actions-open')
  if (record.correctiveActionOpen && isOverdue(record.correctiveActionDueAt, now)) {
    queues.push('corrective-action-overdue')
  }
  if (record.phase === 5 && !record.g2Decision) queues.push('gate-g2-pending')
  if (record.g2Decision === 'yes' && record.verificationStatus === 'pending') {
    queues.push('verification-monitoring')
  }
  if (record.phase === 5 && !record.g3Decision) queues.push('gate-g3-pending')
  if (record.g3Decision === 'yes' && record.frbDecision !== 'approve-closure') queues.push('frb-pending')

  return queues
}

export function getRoleQueue(
  role: FracasRole,
  records: FracasOperationalRecord[],
  now = new Date(),
  userId?: string
) {
  const allowed = new Set(ROLE_QUEUES[role])

  return records
    .map((record) => ({ record, queues: deriveQueueIds(record, now).filter((queue) => allowed.has(queue)) }))
    .filter(({ record, queues }) => {
      if (!queues.length) return false
      if (role === 'reporter' && userId) return record.reporterId === userId
      if (role === 'maintenance' && userId && queues.includes('my-corrective-actions-open')) {
        return record.assignedUserId === userId || queues.some((queue) => queue !== 'my-corrective-actions-open')
      }
      return true
    })
}

export function detectRecurrence(
  incoming: RecurrenceCandidate,
  monitored: RecurrenceCandidate[],
  windowEndAt: string
) {
  const incomingAt = new Date(incoming.occurredAt).getTime()
  const windowEnd = new Date(windowEndAt).getTime()
  if (!Number.isFinite(incomingAt) || !Number.isFinite(windowEnd) || incomingAt > windowEnd) return []

  return monitored.filter((candidate) => {
    if (candidate.id === incoming.id) return false
    const sameAsset = Boolean(incoming.assetId && candidate.assetId && incoming.assetId === candidate.assetId)
    const sameClassificationAtLocation = Boolean(
      incoming.classification &&
        candidate.classification &&
        incoming.location &&
        candidate.location &&
        incoming.classification === candidate.classification &&
        incoming.location === candidate.location
    )
    return sameAsset || sameClassificationAtLocation
  })
}

export function deriveNotificationRecipients(event: FracasNotificationEvent): FracasRole[] {
  switch (event) {
    case 'G1_YES':
      return ['technical-safety']
    case 'G3_YES':
      return ['frb']
    case 'FRB_REQUIRE_VERIFICATION':
      return ['technical-safety']
    case 'VERIFICATION_VIOLATION':
      return ['technical-safety', 'coordinator']
  }
}

export function appendGateDecision(history: GateAuditEntry[], next: Omit<GateAuditEntry, 'supersedesId'>) {
  const prior = [...history]
    .filter((entry) => entry.gate === next.gate)
    .sort((a, b) => new Date(b.decidedAt).getTime() - new Date(a.decidedAt).getTime())[0]

  return [...history, { ...next, supersedesId: prior?.id }]
}

export function currentGateDecision(history: GateAuditEntry[], gate: GateAuditEntry['gate']) {
  return [...history]
    .filter((entry) => entry.gate === gate)
    .sort((a, b) => new Date(b.decidedAt).getTime() - new Date(a.decidedAt).getTime())[0]
}
