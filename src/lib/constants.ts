import type { LucideIcon } from 'lucide-react';
import { AI_CONFIG } from './config/ai-config';
import type { CorrectiveActionStatus, DnfStatus, HazardStatus, ImprovementStatus, InspectionStatus, User, UserRole } from './types';
export * from './types';

const Icon = (() => null) as unknown as LucideIcon;
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'accent';

type StatusTransitionRule<TStatus extends string> = {
  next: TStatus[];
  roles?: Partial<Record<UserRole, TStatus[]>>;
};

export const APP_NAME = { en: 'HURC No.1 CDHS', vi: 'HURC No.1 CDHS' };
export const DEFAULT_AI_MODEL = AI_CONFIG.LLM.STABLE_MODEL;

export const ROLE_SUPER_ADMIN: UserRole = 'SUPER_ADMIN';
export const ROLE_ADMIN_PKTAT: UserRole = 'Admin (P.KTAT)';
export const ROLE_L3_SPECIALIST: UserRole = 'Chuy\u00ean vi\u00ean (L3)';
export const ROLE_L2_TECHNICIAN: UserRole = 'K\u1ef9 thu\u1eadt vi\u00ean (L2)';
export const ROLE_L1_OPERATOR: UserRole = 'Nh\u00e2n vi\u00ean (L1)';
export const ROLE_CLIENT: UserRole = 'Client';

export const MOCK_CURRENT_USER: User = {
  id: 'user-admin-new',
  name: 'System Admin',
  email: 'admin@example.local',
  role: ROLE_SUPER_ADMIN,
  status: 'active',
  department: 'Admin',
  isVerified: true,
  mustChangePassword: false,
  passwordLastChangedAt: '2026-05-22T07:30:00.000Z',
  permissions: ['settings:manage', 'ai:use', 'ai:vision'],
};

export const LOG_LEVELS = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
export const TOLERANCE_OPERATORS = ['\u00b1', '>', '<', '>=', '<=', '=='];
export const MAINTENANCE_FREQUENCIES = [
  { id: 'general', label: { vi: 'General', en: 'General' } },
  { id: 'daily', label: { vi: 'Daily', en: 'Daily' } },
  { id: 'weekly', label: { vi: 'Weekly', en: 'Weekly' } },
  { id: 'monthly', label: { vi: 'Monthly', en: 'Monthly' } },
  { id: 'quarterly', label: { vi: 'Quarterly', en: 'Quarterly' } },
  { id: 'yearly', label: { vi: 'Yearly', en: 'Yearly' } },
];

export const CORRECTIVE_ACTION_STATUSES: CorrectiveActionStatus[] = ['M\u1edbi', '\u0110ang th\u1ef1c hi\u1ec7n', 'Ho\u00e0n th\u00e0nh', '\u0110\u00e3 x\u00e1c minh'];
export const SEVERITY_LEVELS = [{ id: 'general', label: 'General', icon: Icon, className: 'text-muted-foreground', colorVariable: 'muted' }];
export const FINDING_TYPES = [{ id: 'general', label: 'General' }, { id: 'other', label: 'Other' }];

export const INSPECTION_STATUSES: InspectionStatus[] = ['M\u1edbi', '\u0110\u00e1nh gi\u00e1', 'X\u1eed l\u00fd', 'Ph\u1ea3n h\u1ed3i', '\u0110\u00f3ng', 'H\u1ee7y'];
export const LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN: InspectionStatus[] = ['\u0110\u00f3ng', 'H\u1ee7y'];
export const DNF_STATUSES: DnfStatus[] = ['M\u1edbi', '\u0110\u00e1nh gi\u00e1', 'X\u1eed l\u00fd', 'Ph\u1ea3n h\u1ed3i', '\u0110\u00f3ng', 'H\u1ee7y'];
export const LOCKED_DNF_STATUSES_FOR_NON_ADMIN: DnfStatus[] = ['\u0110\u00f3ng', 'H\u1ee7y'];
export const HAZARD_STATUSES: HazardStatus[] = ['M\u1edbi', '\u0110\u00e1nh gi\u00e1', 'X\u1eed l\u00fd', 'Ph\u1ea3n h\u1ed3i', '\u0110\u00f3ng', 'H\u1ee7y'];
export const LOCKED_HAZARD_STATUSES_FOR_NON_ADMIN: HazardStatus[] = ['\u0110\u00f3ng', 'H\u1ee7y'];

const transitions: Record<DnfStatus, StatusTransitionRule<DnfStatus>> = {
  'M\u1edbi': { next: ['\u0110\u00e1nh gi\u00e1', 'H\u1ee7y'] },
  '\u0110\u00e1nh gi\u00e1': { next: ['X\u1eed l\u00fd', 'H\u1ee7y'] },
  'X\u1eed l\u00fd': { next: ['Ph\u1ea3n h\u1ed3i', 'H\u1ee7y'] },
  'Ph\u1ea3n h\u1ed3i': { next: ['\u0110\u00f3ng', 'X\u1eed l\u00fd'] },
  '\u0110\u00f3ng': { next: [] },
  'H\u1ee7y': { next: [] },
};

export const INSPECTION_STATUS_TRANSITIONS = transitions as Record<InspectionStatus, StatusTransitionRule<InspectionStatus>>;
export const DNF_STATUS_TRANSITIONS = transitions as Record<DnfStatus, StatusTransitionRule<DnfStatus>>;
export const HAZARD_STATUS_TRANSITIONS = transitions as Record<HazardStatus, StatusTransitionRule<HazardStatus>>;

export const DNF_HAZARD_LEVELS: Array<{ id: string; label: { vi: string; en: string }; icon: LucideIcon; badgeVariant: BadgeVariant }> = [
  { id: 'general', label: { vi: 'General', en: 'General' }, icon: Icon, badgeVariant: 'default' },
];
export const DNF_METHODS_OF_DETECTION = [{ id: 'visual', label: { vi: 'Visual', en: 'Visual' } }, { id: 'other', label: { vi: 'Other', en: 'Other' } }];

export const HAZARD_SEVERITY_LEVELS = [{ id: 'I', label: { vi: 'Level I', en: 'Level I' }, description: { vi: 'Level I', en: 'Level I' }, value: 4 }];
export const HAZARD_LIKELIHOOD_LEVELS = [{ id: 'A', label: { vi: 'Level A', en: 'Level A' }, description: { vi: 'Level A', en: 'Level A' }, value: 6 }];
export const RISK_MATRIX = { A: { I: 'R1' } };
export const HAZARD_RISK_LEVELS = [{ id: 'R1', label: { vi: 'R1', en: 'R1' }, description: { vi: 'R1', en: 'R1' }, icon: Icon, color: 'hsl(var(--muted))', textColor: 'hsl(var(--muted-foreground))' }];
export const calculateRiskLevelId = (severityId?: string, likelihoodId?: string) => (severityId && likelihoodId ? RISK_MATRIX[likelihoodId as 'A']?.[severityId as 'I'] : undefined);

export const IMPROVEMENT_STATUSES: ImprovementStatus[] = ['M\u1edbi', '\u0110ang xem x\u00e9t', '\u0110\u00e3 duy\u1ec7t', '\u0110ang th\u1ef1c hi\u1ec7n', 'Ho\u00e0n th\u00e0nh', '\u0110\u00e3 t\u1eeb ch\u1ed1i'];
export const IMPROVEMENT_CATEGORIES = [{ id: 'general', label: { vi: 'General', en: 'General' }, icon: Icon }];
export const SYSTEM_PERMISSIONS = [
  { id: 'settings:manage', label: { vi: 'Settings', en: 'Settings' }, group: { vi: 'Admin', en: 'Admin' } },
  { id: 'ai:use', label: { vi: 'AI', en: 'AI' }, group: { vi: 'AI', en: 'AI' } },
  { id: 'ai:vision', label: { vi: 'AI Vision', en: 'AI Vision' }, group: { vi: 'AI', en: 'AI' } },
];
