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
export const ROLE_L3_SPECIALIST: UserRole = 'Chuyên viên (L3)';
export const ROLE_L2_TECHNICIAN: UserRole = 'Kỹ thuật viên (L2)';
export const ROLE_L1_OPERATOR: UserRole = 'Nhân viên (L1)';
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
  permissions: ['settings:manage', 'admin:system', 'ai:use', 'ai:vision'],
};

export const LOG_LEVELS = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
export const TOLERANCE_OPERATORS = ['±', '>', '<', '>=', '<=', '=='];
export const MAINTENANCE_FREQUENCIES = [
  { id: 'general', label: { vi: 'General', en: 'General' } },
  { id: 'daily', label: { vi: 'Daily', en: 'Daily' } },
  { id: 'weekly', label: { vi: 'Weekly', en: 'Weekly' } },
  { id: 'monthly', label: { vi: 'Monthly', en: 'Monthly' } },
  { id: 'quarterly', label: { vi: 'Quarterly', en: 'Quarterly' } },
  { id: 'yearly', label: { vi: 'Yearly', en: 'Yearly' } },
];

export const CORRECTIVE_ACTION_STATUSES: CorrectiveActionStatus[] = ['Mới', 'Đang thực hiện', 'Hoàn thành', 'Đã xác minh'];
export const SEVERITY_LEVELS = [{ id: 'general', label: 'General', icon: Icon, className: 'text-muted-foreground', colorVariable: 'muted' }];
export const FINDING_TYPES = [{ id: 'general', label: 'General' }, { id: 'other', label: 'Other' }];

export const INSPECTION_STATUSES: InspectionStatus[] = ['Mới', 'Đánh giá', 'Xử lý', 'Phản hồi', 'Đóng', 'Hủy'];
export const LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN: InspectionStatus[] = ['Đóng', 'Hủy'];
export const DNF_STATUSES: DnfStatus[] = ['Mới', 'Đánh giá', 'Xử lý', 'Phản hồi', 'Đóng', 'Hủy'];
export const LOCKED_DNF_STATUSES_FOR_NON_ADMIN: DnfStatus[] = ['Đóng', 'Hủy'];
export const HAZARD_STATUSES: HazardStatus[] = ['Mới', 'Đánh giá', 'Xử lý', 'Phản hồi', 'Đóng', 'Hủy'];
export const LOCKED_HAZARD_STATUSES_FOR_NON_ADMIN: HazardStatus[] = ['Đóng', 'Hủy'];

const transitions: Record<DnfStatus, StatusTransitionRule<DnfStatus>> = {
  'Mới': { next: ['Đánh giá', 'Hủy'] },
  'Đánh giá': { next: ['Xử lý', 'Hủy'] },
  'Xử lý': { next: ['Phản hồi', 'Hủy'] },
  'Phản hồi': { next: ['Đóng', 'Xử lý'] },
  'Đóng': { next: [] },
  'Hủy': { next: [] },
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

export const IMPROVEMENT_STATUSES: ImprovementStatus[] = ['Mới', 'Đang xem xét', 'Đã duyệt', 'Đang thực hiện', 'Hoàn thành', 'Đã từ chối'];
export const IMPROVEMENT_CATEGORIES = [{ id: 'general', label: { vi: 'General', en: 'General' }, icon: Icon }];
export const SYSTEM_PERMISSIONS = [
  { id: 'settings:manage', label: { vi: 'Settings', en: 'Settings' }, group: { vi: 'Admin', en: 'Admin' } },
  { id: 'admin:system', label: { vi: 'Quản trị hệ thống và AI', en: 'System and AI governance' }, group: { vi: 'Admin', en: 'Admin' } },
  { id: 'ai:use', label: { vi: 'AI', en: 'AI' }, group: { vi: 'AI', en: 'AI' } },
  { id: 'ai:vision', label: { vi: 'AI Vision', en: 'AI Vision' }, group: { vi: 'AI', en: 'AI' } },
];
