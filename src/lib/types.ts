

import type { LucideIcon } from 'lucide-react';

export type Locale = 'en' | 'vi';

export interface TranslatedText {
  en: string;
  vi: string;
}

export interface NavItemLabel {
  en: string;
  vi: string;
}

export interface NavItem {
  path: string;
  label: NavItemLabel;
  icon: LucideIcon;
  exact?: boolean;
  permission?: string;
}

export interface ImageAttachment {
  id: string;
  url: string;
  name: string;
  size?: number;
  type?: string; // 'image' | 'pdf' | 'doc' | etc.
  'data-ai-hint'?: string;
  isAnalyzing?: boolean;
  aiAnalysisResult?: string;
}

export interface StatusHistory {
  from: string;
  to: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export type UserRole = "SUPER_ADMIN" | "MANAGER" | "TECHNICIAN" | "Admin (P.KTAT)" | "Chuyên viên (L3)" | "Kỹ thuật viên (L2)" | "Nhân viên (L1)" | "Client";

export interface SystemPermission {
    id: string;
    label: NavItemLabel;
    group: NavItemLabel;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  department?: string;
  isVerified: boolean;
  passwordLastChangedAt?: string;
  mustChangePassword?: boolean;
  permissions?: string[];
  assignedSubsystems?: string[];
  avatarUrl?: string;
  verificationOtp?: string;
  otpExpiry?: string;
  failedLoginAttempts?: number;
  lockoutUntil?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  passwordHistory?: string[];
  sessionVersion?: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
export type SystemLogCategory = 'data' | 'network' | 'security' | 'system' | 'maintenance' | 'ai';

export interface SystemLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: string;
    level: LogLevel;
    details: string;
    category: SystemLogCategory;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface SystemState {
    lastSchedulerRun?: string;
    aiModelConfig?: string;
}

export interface PasswordResetRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DbData {
  maintenanceStandards: MaintenanceStandard[];
  maintenanceStandardItems: MaintenanceStandardItem[];
  inspections: InspectionDetail[];
  correctiveActions: CorrectiveAction[];
  dnfs: DnfDocument[];
  hazardRecords: HazardRecord[];
  improvements: Improvement[];
  users: User[];
  roles: Role[];
  responsibleUnits: ResponsibleUnit[];
  subsystems: Subsystem[];
  patrolLocations: PatrolLocation[];
  comments: Comment[];
  notifications: Notification[];
  systemState: SystemState;
  passwordResetRequests: PasswordResetRequest[];
  todos: TodoTask[];
}

// ============== TODO & WORK PROGRESS TYPES =================

export type TodoStatus = 'New' | 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'On Hold' | 'Cancelled';
export type TodoPriority = 'High' | 'Medium' | 'Low';
export type TodoVisibility = 'private' | 'public';

export type TaskAction = 'CREATED' | 'STATUS_CHANGED' | 'ASSIGNEE_CHANGED' | 'PRIORITY_CHANGED' | 'COMMENT_ADDED' | 'ATTACHMENT_ADDED' | 'PROGRESS_UPDATED' | 'TIME_LOGGED' | 'WATCHER_TOGGLED';

export interface TaskActivity {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: TaskAction;
  details: string;
}

export interface TodoTask {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string; // ISO
  deadline?: string; // ISO, optional deadline for conflict resolution
  progress: number; // 0-100
  createdById: string;
  createdByName: string;
  assignedToId?: string; // If public, can be assigned
  assignedToName?: string;
  visibility: TodoVisibility;
  createdAt: string;
  updatedAt: string;
  isNotified24h?: boolean;
  comments?: Comment[];
  attachments?: ImageAttachment[];
  /** Hierarchical fields */
  parentId?: string;
  todoType?: 'Task' | 'WorkPackage' | 'Milestone';
  department?: string;
  startDate?: string; // ISO
  estimatedHours?: number;
  spentHours?: number;
  watchers?: string[]; // Array of User IDs
  activityHistory?: TaskActivity[];
}

// ============== CATEGORY TYPES =================

export interface ResponsibleUnit {
  id: string;
  name: string;
}

export interface Subsystem {
  id: string;
  label: NavItemLabel;
}

export interface PatrolLocation {
  id: string;
  label: string;
}

// ============== COMMENT TYPE ===================
export interface Comment {
    id: string;
    entityId: string; // ID of the DNF, Hazard, etc.
    senderId: string;
    senderName: string;
    timestamp: string;
    content: string;
    isInternal?: boolean; // For secret level-to-level communication
}


// ============ MAINTENANCE STANDARDS ============

export type MaintenanceFrequency = 'general' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type ToleranceOperator = '±' | '>' | '<' | '>=' | '<=' | '==';


export interface MaintenanceStandard {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  frequency?: MaintenanceFrequency;
  scheduledTime?: string; // HH:mm
  locationIds?: string[];
  recipientId?: string; // User ID
  abbreviation?: string;
  estimatedDurationHours?: number;
}

export interface MaintenanceStandardItem {
    id: string;
    standardId: string;
    itemCode: string;
    itemText: string;
    criteria?: string;
    unit?: string;
    standardQuantity?: number;
    toleranceOperator?: ToleranceOperator;
    toleranceValue?: number;
    requiredTools?: string;
}

// ============ INSPECTION TYPES ============

export type InspectionStatus = "Mới" | "Đánh giá" | "Xử lý" | "Phản hồi" | "Đóng" | "Hủy";

export interface Finding {
  id: string;
  description: string;
  severity?: 'critical' | 'major' | 'minor' | 'observation';
  type?: string;
  images?: ImageAttachment[];
  recommendation?: string;
  linkedDnfId?: string;
  quantity?: number;
  location?: GeoLocation;
}

export interface ChecklistItem {
  id: string;
  text: string;
  status: 'pending' | 'pass' | 'fail';
  findings?: Finding[];
  images?: ImageAttachment[];
  isCustom?: boolean;
  criteria?: string;
  unit?: string;
  standardQuantity?: number;
  toleranceOperator?: ToleranceOperator;
  toleranceValue?: number;
  actualQuantity?: number;
  requiredTools?: string;
}

export interface InspectionDetail {
  id: string;
  title: string;
  areaIds: string[];
  inspector: string;
  date: string;
  status: InspectionStatus;
  checklistTemplateId?: string;
  checklistItems?: ChecklistItem[];
  generalNotes?: string;
  approvalComments?: string;
  lastStatusUpdateBy?: string;
  lastStatusUpdateAt?: string;
  scheduledStartDate?: string;
  scheduledFinishDate?: string;
  estimatedDurationHours?: number;
  isArchived?: boolean;
}

// ============ DNF & CORRECTIVE ACTION TYPES ============

export type CorrectiveActionStatus = 'Mới' | 'Đang thực hiện' | 'Hoàn thành' | 'Đã xác minh';

export interface CorrectiveAction {
    id: string;
    dnfId: string;
    description: string;
    responsiblePersonOrUnit: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;
    status: CorrectiveActionStatus;
    dateTimeNotified?: string;
    dateTimeArrival?: string;
    diagnosisTime?: number;
    repairTime?: number;
    verificationTime?: number;
    totalDownTime?: number;
}


export type DnfStatus = "Mới" | "Đánh giá" | "Xử lý" | "Phản hồi" | "Đóng" | "Hủy";

export interface DnfDocument {
  id: string;
  failureReportNo?: string;
  locationOfFailure: string;
  failedComponentEquipmentLRUTrainNumber?: string;
  subsystemIds?: string[];
  descriptionOfFailure: string;
  impactAssessment?: string;
  staffWhoIdentifiedFailure: string;
  dateTimeOfFailureOccurrence: string;
  methodOfFailureDetection: string;
  hazardLevelId?: 'high' | 'medium' | 'low';
  status: DnfStatus;
  attachments?: ImageAttachment[];
  createdById: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistory[];
  correctiveActions?: CorrectiveAction[];
  isArchived?: boolean;
  resolutionDetails?: string;
  assignedTo?: string;
  priority?: 'Cao' | 'Trung bình' | 'Thấp';
  completedDate?: string;
  originatingInspectionId?: string;
  originatingFindingId?: string;

  // New fields from form
  immediateAction?: string;
  problemResettable?: boolean;
  trainServiceAffected?: boolean;
  trainWithdrawn?: boolean;
  systemRestoredTime?: string;
  disruptionDuration?: number; // in minutes
  trainKm?: number;
  rectificationParty?: string;
}

// ============ HAZARD TYPES ============

export type HazardStatus = "Mới" | "Đánh giá" | "Xử lý" | "Phản hồi" | "Đóng" | "Hủy";

export interface HazardRecord {
  id: string;
  description: string;
  systemGroup?: string;
  locationIds: string[];
  source?: string;
  potentialConsequence?: string;
  identifiedBy: string;
  identificationDate: string; // ISO String
  severityId?: string;
  likelihoodId?: string;
  riskLevelId?: string;
  currentControls: string;
  proposedActions?: string;
  suggestedActions?: string;
  responsiblePersonOrUnit?: string;
  coordinatingUnits?: string[];
  dueDate?: string; // ISO String
  status: HazardStatus;
  closureDetails?: string;
  verificationDetails?: string;
  attachments?: ImageAttachment[];
  linkedDnfId?: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  statusHistory?: StatusHistory[];
}

// ============ IMPROVEMENT TYPES ============

export type ImprovementStatus = "Mới" | "Đang xem xét" | "Đã duyệt" | "Đang thực hiện" | "Hoàn thành" | "Đã từ chối";

export interface Improvement {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ImprovementStatus;
  submittedBy: string;
  createdById: string;
  submissionDate: string; // ISO string
  updatedAt: string; // ISO string
  benefitAnalysis?: string;
  estimatedCost?: number;
  attachments?: ImageAttachment[];
}


// ============ UNIFIED TASK TYPE ============
export interface UnifiedTask {
  id: string;
  title: string;
  dueDate: string;
  type: 'Kiểm tra' | 'Sự cố' | 'Mối nguy' | 'Hành động Khắc phục';
  status: string;
  link: string;
  priority?: 'Cao' | 'Trung bình' | 'Thấp';
  location?: string;
}

export type SecurityStats = {
  totalLoginAttempts: number;
  failedLoginAttempts: number;
  rateLimitHits: number;
  lastBackupStatus: string;
  databaseIntegrity: string;
};
