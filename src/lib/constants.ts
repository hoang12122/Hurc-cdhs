

import type { LucideIcon } from 'lucide-react';
import { AI_CONFIG } from './config/ai-config';
import { 
    AlertTriangle,
    ShieldAlert,
    Info as InfoIcon,
    CheckSquare,
    AlertCircle,
    Shield,
    TrendingUp,
    DollarSign,
    Gem,
    HelpCircle,
    ServerCrash,
    Flame,
    Zap,
    CloudOff,
    HeartPulse
} from 'lucide-react';

import { type DbData as DbDataType, type Locale as LocaleType, type NavItemLabel as NavItemLabelType, type NavItem as NavItemType, type ImageAttachment as ImageAttachmentType, type TranslatedText as TranslatedTextType, type StatusHistory as StatusHistoryType, type GeoLocation as GeoLocationType, type UserRole as UserRoleType, type SystemPermission as SystemPermissionType, type User as UserType, type Role as RoleType, type LogLevel as LogLevelType, type SystemLog as SystemLogType, type Notification as NotificationType, type SystemState as SystemStateType, type ResponsibleUnit as ResponsibleUnitType, type Subsystem as SubsystemType, type PatrolLocation as PatrolLocationType, type Comment as CommentType, type MaintenanceFrequency as MaintenanceFrequencyType, type MaintenanceStandard as MaintenanceStandardType, type ToleranceOperator as ToleranceOperatorType, type MaintenanceStandardItem as MaintenanceStandardItemType, type InspectionStatus as InspectionStatusType, type Finding as FindingType, type ChecklistItem as ChecklistItemType, type InspectionDetail as InspectionDetailType, type CorrectiveActionStatus as CorrectiveActionStatusType, type CorrectiveAction as CorrectiveActionType, type DnfStatus as DnfStatusType, type DnfDocument as DnfDocumentType, type HazardStatus as HazardStatusType, type HazardRecord as HazardRecordType, type ImprovementStatus as ImprovementStatusType, type Improvement as ImprovementType, type UnifiedTask as UnifiedTaskType, type SystemLogCategory as SystemLogCategoryType, type PasswordResetRequest as PasswordResetRequestType } from './types';

// Re-export all types from the new types file to maintain backward compatibility
export type DbData = DbDataType;
export type Locale = LocaleType;
export type NavItemLabel = NavItemLabelType;
export type NavItem = NavItemType;
export type ImageAttachment = ImageAttachmentType;
export type TranslatedText = TranslatedTextType;
export type StatusHistory = StatusHistoryType;
export type GeoLocation = GeoLocationType;
export type UserRole = UserRoleType;
export type SystemPermission = SystemPermissionType;
export type User = UserType;
export type Role = RoleType;
export type LogLevel = LogLevelType;
export type SystemLogCategory = SystemLogCategoryType;
export type SystemLog = SystemLogType;
export type Notification = NotificationType;
export type SystemState = SystemStateType;
export type ResponsibleUnit = ResponsibleUnitType;
export type Subsystem = SubsystemType;
export type PatrolLocation = PatrolLocationType;
export type Comment = CommentType;
export type MaintenanceFrequency = MaintenanceFrequencyType;
export type MaintenanceStandard = MaintenanceStandardType;
export type MaintenanceStandardItem = MaintenanceStandardItemType;
export type InspectionStatus = InspectionStatusType;
export type Finding = FindingType;
export type ChecklistItem = ChecklistItemType;
export type InspectionDetail = InspectionDetailType;
export type CorrectiveActionStatus = CorrectiveActionStatusType;
export type CorrectiveAction = CorrectiveActionType;
export type DnfStatus = DnfStatusType;
export type HazardStatus = HazardStatusType;
export type HazardRecord = HazardRecordType;
export type ImprovementStatus = ImprovementStatusType;
export type Improvement = ImprovementType;
export type UnifiedTask = UnifiedTaskType;
export type PasswordResetRequest = PasswordResetRequestType;
export type ToleranceOperator = ToleranceOperatorType;
export type DnfDocument = DnfDocumentType;

// ============================================================================
// CORE APP CONSTANTS
// ============================================================================
export const APP_NAME: Record<Locale, string> = {
  en: "HURC No.1 CDHS",
  vi: "HURC No.1 CDHS"
};

export const DEFAULT_AI_MODEL = AI_CONFIG.LLM.STABLE_MODEL;

// ============================================================================
// USER & ROLE MANAGEMENT CONSTANTS
// ============================================================================
export const ROLE_SUPER_ADMIN = "SUPER_ADMIN";
export const ROLE_ADMIN_PKTAT = "Admin (P.KTAT)";
export const ROLE_L3_SPECIALIST = "Chuyên viên (L3)";
export const ROLE_L2_TECHNICIAN = "Kỹ thuật viên (L2)";
export const ROLE_L1_OPERATOR = "Nhân viên (L1)";
export const ROLE_CLIENT = "Client";

// This is a stand-in for a proper user session management.
// In a real app, this would be derived from a cookie, JWT, or session store.
export const MOCK_CURRENT_USER: User = {
    id: "user-admin-new",
    name: "System Admin",
    email: "nhhoang@hurc.vn",
    role: ROLE_SUPER_ADMIN,
    status: "active",
    department: "Ban Quản trị Hệ thống",
    isVerified: true,
    mustChangePassword: false,
    passwordLastChangedAt: "2026-05-22T07:30:00.000Z",
    permissions: [
        "inspections:create",
        "inspections:view_all",
        "inspections:edit_all",
        "inspections:delete",
        "inspections:assign",
        "inspections:approve",
        "corrective_actions:create",
        "corrective_actions:view_all",
        "corrective_actions:edit_all",
        "corrective_actions:delete",
        "corrective_actions:assign",
        "corrective_actions:verify",
        "improvements:create",
        "improvements:view_all",
        "improvements:edit_all",
        "improvements:delete",
        "reports:view",
        "reports:manage",
        "users:manage",
        "roles:manage",
        "checklist_templates:manage",
        "settings:manage",
        "ai:use",
        "ai:vision",
        "incident-memory:approve"
  ]
};

// ============================================================================
// STATIC DATA FOR UI (Dropdowns, etc.)
// ============================================================================

export const LOG_LEVELS: LogLevel[] = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export const TOLERANCE_OPERATORS: ToleranceOperator[] = ['±', '>', '<', '>=', '<=', '=='];

export const MAINTENANCE_FREQUENCIES: { id: MaintenanceFrequency; label: NavItemLabel; }[] = [
  { id: 'general', label: { vi: 'Tổng quát', en: 'General' } },
  { id: 'daily', label: { vi: 'Hàng Ngày', en: 'Daily' } },
  { id: 'weekly', label: { vi: 'Hàng Tuần', en: 'Weekly' } },
  { id: 'monthly', label: { vi: 'Hàng Tháng', en: 'Monthly' } },
  { id: 'quarterly', label: { vi: 'Hàng Quý', en: 'Quarterly' } },
  { id: 'yearly', label: { vi: 'Hàng Năm', en: 'Yearly' } },
];

export const CORRECTIVE_ACTION_STATUSES: CorrectiveActionStatus[] = ['Mới', 'Đang thực hiện', 'Hoàn thành', 'Đã xác minh'];


export const SEVERITY_LEVELS = [
  { id: 'critical', label: 'Nghiêm trọng', icon: AlertTriangle, className: 'text-white', colorVariable: 'destructive' },
  { id: 'major', label: 'Lớn', icon: ShieldAlert, className: 'text-white', colorVariable: 'accent' },
  { id: 'minor', label: 'Nhỏ', icon: InfoIcon, className: 'text-yellow-700 dark:text-yellow-400', colorVariable: 'yellow-500' },
  { id: 'observation', label: 'Quan sát', icon: CheckSquare, className: 'text-white', colorVariable: 'primary' },
];

export const FINDING_TYPES = [
  { id: 'electrical', label: 'Điện' },
  { id: 'mechanical', label: 'Cơ khí' },
  { id: 'structural', label: 'Kết cấu' },
  { id: 'safety', label: 'An toàn' },
  { id: 'civil', label: 'Xây dựng' },
  { id: 'track', label: 'Đường ray' },
  { id: 'signaling', label: 'Thông tin tín hiệu' },
  { id: 'ventilation', label: 'Thông gió' },
  { id: 'fire_protection', label: 'PCCC' },
  { id: 'other', label: 'Khác' },
];


export const INSPECTION_STATUSES: InspectionStatus[] = ["Mới", "Đánh giá", "Xử lý", "Phản hồi", "Đóng", "Hủy"];
export const LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN: InspectionStatus[] = ["Đóng", "Hủy"];

export const INSPECTION_STATUS_TRANSITIONS: Record<InspectionStatus, {
  next: InspectionStatus[],
  roles?: Partial<Record<UserRole, InspectionStatus[]>>
}> = {
    "Mới": { next: ["Đánh giá", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Đánh giá", "Hủy"] } },
    "Đánh giá": { next: ["Xử lý", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Xử lý", "Hủy"] } },
    "Xử lý": { next: ["Phản hồi", "Hủy"] }, 
    "Phản hồi": { next: ["Đóng", "Xử lý"], roles: { [ROLE_SUPER_ADMIN]: ["Đóng", "Xử lý"] } },
    "Đóng": { next: [] },
    "Hủy": { next: [] },
};