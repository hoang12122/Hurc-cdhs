

import type { LucideIcon } from 'lucide-react';
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
export type ToleranceOperator = ToleranceOperatorType;
export type MaintenanceStandardItem = MaintenanceStandardItemType;
export type InspectionStatus = InspectionStatusType;
export type Finding = FindingType;
export type ChecklistItem = ChecklistItemType;
export type InspectionDetail = InspectionDetailType;
export type CorrectiveActionStatus = CorrectiveActionStatusType;
export type CorrectiveAction = CorrectiveActionType;
export type DnfStatus = DnfStatusType;
export type DnfDocument = DnfDocumentType;
export type HazardStatus = HazardStatusType;
export type HazardRecord = HazardRecordType;
export type ImprovementStatus = ImprovementStatusType;
export type Improvement = ImprovementType;
export type UnifiedTask = UnifiedTaskType;
export type PasswordResetRequest = PasswordResetRequestType;


// ==========================================================================
// CORE APP CONSTANTS
// ==========================================================================
export const APP_NAME: Record<Locale, string> = {
  en: "HURC No.1 CDHS",
  vi: "HURC No.1 CDHS"
};

export const DEFAULT_AI_MODEL = process.env.NEXT_PUBLIC_HF_MODEL || 'google/gemma-4-31b';

// ==========================================================================
// USER & ROLE MANAGEMENT CONSTANTS
// ==========================================================================
export const ROLE_SUPER_ADMIN = "SUPER_ADMIN";
export const ROLE_ADMIN_PKTAT = "Admin (P.KTAT)";
export const ROLE_L3_SPECIALIST = "Chuyên viên (L3)";
export const ROLE_L2_TECHNICIAN = "Kỹ thuật viên (L2)";
export const ROLE_L1_OPERATOR = "Nhân viên (L1)";
export const ROLE_CLIENT = "Client";

// This is a stand-in for a proper user session management.
// In a real app, this would be derived from a cookie, JWT, or session store.
export const MOCK_CURRENT_USER: User = {
    id: "user-admin-2026",
    name: "Supper Admin",
    email: "nhhoang@hurc.vn",
    role: ROLE_SUPER_ADMIN,
    status: "active",
    department: "Ban Quản trị Hệ thống",
    isVerified: true,
    mustChangePassword: false,
    passwordLastChangedAt: "2025-07-01T00:00:00.000Z",
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
        "ai:vision"
  ]
};

// ==========================================================================
// STATIC DATA FOR UI (Dropdowns, etc.)
// ==========================================================================

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

export const DNF_STATUSES: DnfStatus[] = ["Mới", "Đánh giá", "Xử lý", "Phản hồi", "Đóng", "Hủy"];
export const LOCKED_DNF_STATUSES_FOR_NON_ADMIN: DnfStatus[] = ["Đóng", "Hủy"];

export const DNF_STATUS_TRANSITIONS: Record<DnfStatus, {
  next: DnfStatus[],
  roles?: Partial<Record<UserRole, DnfStatus[]>>
}> = {
    "Mới": { next: ["Đánh giá", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Đánh giá", "Hủy"] } },
    "Đánh giá": { next: ["Xử lý", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Xử lý", "Hủy"] } },
    "Xử lý": { next: ["Phản hồi", "Hủy"] },
    "Phản hồi": { next: ["Đóng", "Xử lý"], roles: { [ROLE_SUPER_ADMIN]: ["Đóng", "Xử lý"] } },
    "Đóng": { next: [] },
    "Hủy": { next: [] },
};


export const DNF_HAZARD_LEVELS: { id: string; label: NavItemLabel; icon: LucideIcon; badgeVariant: "destructive" | "secondary" | "default" }[] = [
  { id: 'high', label: { vi: 'Cao', en: 'High' }, icon: AlertTriangle, badgeVariant: 'destructive' },
  { id: 'medium', label: { vi: 'Trung bình', en: 'Medium' }, icon: AlertCircle, badgeVariant: 'secondary' },
  { id: 'low', label: { vi: 'Thấp', en: 'Low' }, icon: InfoIcon, badgeVariant: 'default' },
];

export const DNF_METHODS_OF_DETECTION: { id: string; label: NavItemLabel }[] = [
  { id: 'visual', label: { vi: 'Nhìn thấy', en: 'Visual' } },
  { id: 'audio', label: { vi: 'Nghe thấy', en: 'Audio' } },
  { id: 'smell', label: { vi: 'Ngửi thấy', en: 'Smell' } },
  { id: 'measurement', label: { vi: 'Đo đạc', en: 'Measurement' } },
  { id: 'test_equipment', label: { vi: 'Thiết bị kiểm tra', en: 'Test Equipment' } },
  { id: 'report_from_other', label: { vi: 'Báo cáo từ người khác', en: 'Report from Others' } },
  { id: 'alarm_system', label: { vi: 'Hệ thống cảnh báo', en: 'Alarm System' } },
  { id: 'other', label: { vi: 'Khác', en: 'Other' } },
];

export const HAZARD_STATUSES: HazardStatus[] = ["Mới", "Đánh giá", "Xử lý", "Phản hồi", "Đóng", "Hủy"];
export const LOCKED_HAZARD_STATUSES_FOR_NON_ADMIN: HazardStatus[] = ["Đóng", "Hủy"];

export const HAZARD_STATUS_TRANSITIONS: Record<HazardStatus, {
  next: HazardStatus[],
  roles?: Partial<Record<UserRole, HazardStatus[]>>
}> = {
    "Mới": { next: ["Đánh giá", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Đánh giá", "Hủy"] } },
    "Đánh giá": { next: ["Xử lý", "Hủy"], roles: { [ROLE_SUPER_ADMIN]: ["Xử lý", "Hủy"] } },
    "Xử lý": { next: ["Phản hồi", "Hủy"] },
    "Phản hồi": { next: ["Đóng", "Xử lý"], roles: { [ROLE_SUPER_ADMIN]: ["Đóng", "Xử lý"] } },
    "Đóng": { next: [] },
    "Hủy": { next: [] },
};

export const HAZARD_SEVERITY_LEVELS: { id: string; label: NavItemLabel; description: NavItemLabel; value: number }[] = [
  { id: 'I', label: { vi: 'I - Đặc biệt nghiêm trọng', en: 'I - Catastrophic' }, description: { vi: 'Tử vong hoặc mất khả năng hoạt động của hệ thống', en: 'Death or system loss' }, value: 4 },
  { id: 'II', label: { vi: 'II - Nghiêm trọng', en: 'II - Critical' }, description: { vi: 'Thương tật nặng, bệnh nghề nghiệp nặng hoặc hư hỏng nặng hệ thống', en: 'Severe injury, severe occupational illness, or major system damage' }, value: 3 },
  { id: 'III', label: { vi: 'III - Bình thường', en: 'III - Marginal' }, description: { vi: 'Thương tật nhẹ, bệnh nghề nghiệp nhẹ hoặc hư hỏng nhẹ hệ thống', en: 'Minor injury, minor occupational illness, or minor system damage' }, value: 2 },
  { id: 'IV', label: { vi: 'IV - Không đáng kể', en: 'IV - Negligible' }, description: { vi: 'Ít hơn thương tật nhẹ, bệnh nghề nghiệp nhẹ hoặc hư hỏng hệ thống', en: 'Less than minor injury, minor occupational illness, or system damage' }, value: 1 },
];

export const HAZARD_LIKELIHOOD_LEVELS: { id: string; label: NavItemLabel; description: NavItemLabel; value: number }[] = [
  { id: 'A', label: { vi: 'A - Thường xuyên', en: 'A - Frequent' }, description: { vi: 'Có khả năng xảy ra thường xuyên', en: 'Likely to occur frequently' }, value: 6 },
  { id: 'B', label: { vi: 'B - Rất có thể', en: 'B - Probable' }, description: { vi: 'Sẽ xảy ra nhiều lần trong vòng đời của một hạng mục', en: 'Will occur several times in life of an item' }, value: 5 },
  { id: 'C', label: { vi: 'C - Thỉnh thoảng', en: 'C - Occasional' }, description: { vi: 'Có khả năng xảy ra trong vòng đời của một hạng mục', en: 'Likely to occur sometime in life of an item' }, value: 4 },
  { id: 'D', label: { vi: 'D - Hiếm khi', en: 'D - Remote' }, description: { vi: 'Không có khả năng xảy ra một cách thường xuyên', en: 'Unlikely to occur, but possible' }, value: 3 },
  { id: 'E', label: { vi: 'E - Không có khả năng', en: 'E - Unlikely' }, description: { vi: 'Không có khả năng xảy ra trong các điều kiện hoạt động bình thường', en: 'Not likely to occur in normal operating conditions' }, value: 2 },
  { id: 'F', label: { vi: 'F - Không thể xảy ra', en: 'F - Improbable' }, description: { vi: 'Rất không có khả năng xảy ra đến mức có thể giả định rằng nó sẽ không xảy ra', en: 'So unlikely, it can be assumed occurrence may not be experienced' }, value: 1 },
];

export const RISK_MATRIX: Record<string, Record<string, string>> = {
  'A': { 'I': 'R1', 'II': 'R1', 'III': 'R1', 'IV': 'R2' },
  'B': { 'I': 'R1', 'II': 'R1', 'III': 'R2', 'IV': 'R3' },
  'C': { 'I': 'R1', 'II': 'R2', 'III': 'R2', 'IV': 'R3' },
  'D': { 'I': 'R2', 'II': 'R2', 'III': 'R3', 'IV': 'R4' },
  'E': { 'I': 'R3', 'II': 'R3', 'III': 'R4', 'IV': 'R4' },
  'F': { 'I': 'R4', 'II': 'R4', 'III': 'R4', 'IV': 'R4' },
};

export const HAZARD_RISK_LEVELS: { id: string; label: NavItemLabel; description: NavItemLabel; icon: LucideIcon; color: string; textColor: string; }[] = [
    { id: 'R1', label: { vi: 'Rất cao', en: 'Very High' }, description: { vi: 'Không chấp nhận được, phải dừng hoạt động và khắc phục ngay', en: 'Unacceptable, must cease operations and fix immediately' }, icon: ServerCrash, color: 'hsl(var(--destructive))', textColor: 'hsl(var(--destructive-foreground))' },
    { id: 'R2', label: { vi: 'Cao', en: 'High' }, description: { vi: 'Cần có biện pháp giảm thiểu rủi ro ngay lập tức', en: 'Requires immediate risk mitigation measures' }, icon: Flame, color: 'hsl(30, 90%, 55%)', textColor: 'hsl(var(--destructive-foreground))' },
    { id: 'R3', label: { vi: 'Trung bình', en: 'Medium' }, description: { vi: 'Chấp nhận được với sự kiểm soát và giảm thiểu rủi ro', en: 'Acceptable with risk mitigation and control' }, icon: Zap, color: 'hsl(198, 80%, 50%)', textColor: 'hsl(var(--primary-foreground))' },
    { id: 'R4', label: { vi: 'Thấp', en: 'Low' }, description: { vi: 'Chấp nhận được, không cần hành động thêm', en: 'Acceptable, no further action required' }, icon: CloudOff, color: 'hsl(var(--muted))', textColor: 'hsl(var(--muted-foreground))' },
];


export const calculateRiskLevelId = (severityId?: string, likelihoodId?: string): string | undefined => {
  if (!severityId || !likelihoodId) return undefined;
  return RISK_MATRIX[likelihoodId]?.[severityId];
};

export const IMPROVEMENT_STATUSES: ImprovementStatus[] = ["Mới", "Đang xem xét", "Đã duyệt", "Đang thực hiện", "Hoàn thành", "Đã từ chối"];

export const IMPROVEMENT_CATEGORIES: { id: string; label: NavItemLabel; icon: LucideIcon; }[] = [
    { id: 'safety', label: { vi: 'An toàn', en: 'Safety' }, icon: Shield },
    { id: 'efficiency', label: { vi: 'Hiệu suất', en: 'Efficiency' }, icon: TrendingUp },
    { id: 'cost_saving', label: { vi: 'Tiết kiệm Chi phí', en: 'Cost Saving' }, icon: DollarSign },
    { id: 'quality', label: { vi: 'Chất lượng', en: 'Quality' }, icon: Gem },
    { id: 'other', label: { vi: 'Khác', en: 'Other' }, icon: HelpCircle },
];

export const SYSTEM_PERMISSIONS: SystemPermission[] = [
  // Inspection Management
  { id: 'inspections:create', label: { vi: 'Tạo Kiểm tra', en: 'Create Inspection' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  { id: 'inspections:view_all', label: { vi: 'Xem Tất cả Kiểm tra', en: 'View All Inspections' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  { id: 'inspections:edit_all', label: { vi: 'Sửa Tất cả Kiểm tra', en: 'Edit All Inspections' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  { id: 'inspections:delete', label: { vi: 'Xóa Kiểm tra', en: 'Delete Inspection' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  { id: 'inspections:assign', label: { vi: 'Gán Kiểm tra', en: 'Assign Inspection' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  { id: 'inspections:approve', label: { vi: 'Phê duyệt Kiểm tra', en: 'Approve Inspection' }, group: { vi: 'Quản lý Kiểm tra', en: 'Inspection Management' } },
  // DNF Management
  { id: 'dnf:create', label: { vi: 'Tạo Sự cố (Defect)', en: 'Create Incident (Defect)' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  { id: 'dnf:view_all', label: { vi: 'Xem Tất cả Sự cố', en: 'View All Incidents' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  { id: 'dnf:edit_all', label: { vi: 'Sửa Tất cả Sự cố', en: 'Edit All Incidents' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  { id: 'dnf:delete', label: { vi: 'Xóa Sự cố', en: 'Delete Incident' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  { id: 'dnf:manage_status', label: { vi: 'Quản lý Trạng thái Sự cố', en: 'Manage Incident Status' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  { id: 'dnf:import', label: { vi: 'Nhập Dữ liệu Sự cố', en: 'Import Incident Data' }, group: { vi: 'Quản lý Sự cố', en: 'Incident Management' } },
  // Corrective Action Management
  { id: 'corrective_actions:create', label: { vi: 'Tạo Hành động Khắc phục', en: 'Create Corrective Action' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  { id: 'corrective_actions:view_all', label: { vi: 'Xem Tất cả Hành động Khắc phục', en: 'View All Corrective Actions' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  { id: 'corrective_actions:edit_all', label: { vi: 'Sửa Tất cả Hành động Khắc phục', en: 'Edit All Corrective Actions' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  { id: 'corrective_actions:delete', label: { vi: 'Xóa Hành động Khắc phục', en: 'Delete Corrective Action' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  { id: 'corrective_actions:assign', label: { vi: 'Gán Hành động Khắc phục', en: 'Assign Corrective Action' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  { id: 'corrective_actions:verify', label: { vi: 'Xác minh Hành động Khắc phục', en: 'Verify Corrective Action' }, group: { vi: 'Quản lý Hành động Khắc phục', en: 'Corrective Action Management' } },
  // Hazard Management
  { id: 'hazard:create', label: { vi: 'Tạo Mối nguy', en: 'Create Hazard' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  { id: 'hazard:view_all', label: { vi: 'Xem Tất cả Mối nguy', en: 'View All Hazards' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  { id: 'hazard:assess', label: { vi: 'Đánh giá Mối nguy', en: 'Assess Hazard' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  { id: 'hazard:edit_all', label: { vi: 'Sửa Tất cả Mối nguy', en: 'Edit All Hazards' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  { id: 'hazard:delete', label: { vi: 'Xóa Mối nguy', en: 'Delete Hazard' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  { id: 'hazard:manage_status', label: { vi: 'Quản lý Trạng thái Mối nguy', en: 'Manage Hazard Status' }, group: { vi: 'Quản lý Mối nguy', en: 'Hazard Management' } },
  // Improvements Management
  { id: 'improvements:create', label: { vi: 'Tạo Cải tiến', en: 'Create Improvement' }, group: { vi: 'Quản lý Cải tiến', en: 'Improvements Management' } },
  { id: 'improvements:view_all', label: { vi: 'Xem Tất cả Cải tiến', en: 'View All Improvements' }, group: { vi: 'Quản lý Cải tiến', en: 'Improvements Management' } },
  { id: 'improvements:edit_all', label: { vi: 'Sửa Tất cả Cải tiến', en: 'Edit All Improvements' }, group: { vi: 'Quản lý Cải tiến', en: 'Improvements Management' } },
  { id: 'improvements:delete', label: { vi: 'Xóa Cải tiến', en: 'Delete Improvement' }, group: { vi: 'Quản lý Cải tiến', en: 'Improvements Management' } },
  // Analysis Reports
  { id: 'reports:view', label: { vi: 'Xem Báo cáo Phân tích', en: 'View Analysis Reports' }, group: { vi: 'Báo cáo', en: 'Reporting' } },
  { id: 'reports:manage', label: { vi: 'Quản lý Báo cáo Phân tích', en: 'Manage Analysis Reports' }, group: { vi: 'Báo cáo', en: 'Reporting' } },
  // System Administration
  { id: 'users:manage', label: { vi: 'Quản lý Người dùng', en: 'Manage Users' }, group: { vi: 'Quản trị Hệ thống', en: 'System Administration' } },
  { id: 'roles:manage', label: { vi: 'Quản lý Vai trò & Quyền', en: 'Manage Roles & Permissions' }, group: { vi: 'Quản trị Hệ thống', en: 'System Administration' } },
  { id: 'checklist_templates:manage', label: { vi: 'Quản lý Mẫu Checklist', en: 'Manage Checklist Templates' }, group: { vi: 'Quản trị Hệ thống', en: 'System Administration' } },
  { id: 'settings:manage', label: { vi: 'Quản lý Cài đặt Hệ thống', en: 'Manage System Settings' }, group: { vi: 'Quản trị Hệ thống', en: 'System Administration' } },
  // AI Features
  { id: 'ai:use', label: { vi: 'Sử dụng Trợ lý AI', en: 'Use AI Assistant' }, group: { vi: 'Tính năng AI', en: 'AI Features' } },
  { id: 'ai:vision', label: { vi: 'Phân tích Hình ảnh AI', en: 'AI Image Analysis' }, group: { vi: 'Tính năng AI', en: 'AI Features' } },
];
