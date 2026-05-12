
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Paperclip, User, CalendarDays, AlertTriangle, CheckCircle, Info, Clock, Eye, Settings, Tag, ListChecks, Image as ImageIcon, Save, FileDown, MapPin, Construction, ShieldPlus, Trash2, History, FilePlus, UserCheck, Shield, Archive, Network, Wrench, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
    DNF_METHODS_OF_DETECTION,
    DNF_STATUSES,
    DNF_HAZARD_LEVELS,
    MOCK_CURRENT_USER,
    DNF_STATUS_TRANSITIONS,
    ROLE_L2_TECHNICIAN,
    ROLE_L3_SPECIALIST,
    ROLE_SUPER_ADMIN,
    ROLE_ADMIN_PKTAT,
    ROLE_CLIENT,
} from "@/lib/constants";
import { type DnfDocument, type DnfStatus, type UserRole, type Subsystem, type Comment, type PatrolLocation } from "@/lib/types";
import { updateMockDnf, deleteMockDnf, getDnfById } from "@/lib/actions/dnf.actions";
import { hasPermission } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CorrectiveActionPanel } from '@/components/dnf/corrective-action-panel';
import { CommentPanel } from '@/components/dnf/comment-panel';
import { useNetwork } from '@/components/providers/network-provider';
import { offlineSync } from '@/lib/services/offline-sync';
import { ReportLayout } from '@/components/shared/report-layout';


const translations = {
  vi: {
    titlePrefix: "Chi tiết Sự cố",
    backToList: "Quay lại danh sách",
    edit: "Chỉnh sửa",
    delete: "Xóa Sự cố",
    createHazard: "Tạo Mối nguy",
    confirmDeleteTitle: "Xác nhận Xóa Sự cố",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa Sự cố #${id} không? Hành động này không thể hoàn tác.`,
    deleteSuccess: (id: string) => `Sự cố #${id} đã được xóa thành công.`,
    exportCsv: "Xuất CSV",
    status: "Trạng thái",
    hazardLevel: "Mức độ Mối nguy",
    failureReportNo: "Số tham chiếu (HTC)",
    location: "Vị trí",
    failedComponent: "Thiết bị/LRU/Tàu",
    subsystem: "Hệ thống",
    description: "Mô tả Sự cố",
    impactAssessmentLabel: "Đánh giá ảnh hưởng",
    identifiedBy: "Người phát hiện",
    occurrenceTime: "Thời gian xảy ra",
    detectionMethod: "Phương pháp phát hiện",
    attachments: "Hình ảnh/Tài liệu đính kèm",
    noAttachments: "Không có hình ảnh/tài liệu đính kèm.",
    createdBy: "Người tạo",
    createdAt: "Ngày tạo",
    updatedAt: "Cập nhật lần cuối",
    manageStatusTitle: "Quản lý Trạng thái",
    selectNewStatus: "Chọn trạng thái mới",
    saveStatus: "Lưu Trạng Thái",
    statusUpdateSuccess: "Đã cập nhật trạng thái sự cố thành công.",
    statusUpdateFailed: "Không thể cập nhật trạng thái. Không có quyền hoặc chuyển đổi không hợp lệ.",
    noPermissionToManageStatus: "Bạn không có quyền quản lý trạng thái của sự cố này.",
    processingInfoTitle: "Thông tin Xử lý & Khắc phục",
    createCorrectiveAction: "Tạo Hành động Khắc phục",
    csvHeaders: {
        id: "ID Sự cố",
        failureReportNo: "Số Báo cáo HTC",
        locationOfFailure: "Vị trí",
        failedComponentEquipmentLRUTrainNumber: "Thiết bị Lỗi",
        subsystem: "Hệ thống",
        descriptionOfFailure: "Mô tả Sự cố",
        impactAssessment: "Đánh giá ảnh hưởng",
        staffWhoIdentifiedFailure: "Người Phát Hiện",
        dateTimeOfFailureOccurrence: "Ngày Giờ Xảy Ra (ISO)",
        methodOfFailureDetection: "PP Phát Hiện",
        hazardLevel: "Mức Độ Mối Nguy",
        status: "Trạng Thái",
        attachments: "Đính kèm (Tên tệp)",
        createdById: "ID Người tạo",
        createdAt: "Ngày Tạo (ISO)",
        updatedAt: "Ngày Cập nhật (ISO)",
        assignedTo: "Giao cho",
        priority: "Ưu tiên",
        resolutionDetails: "Chi tiết khắc phục"
    },
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    statusHistory: "Lịch sử Trạng thái",
    statusChangeDetails: (to: string, by: string, time: string) => `Chuyển thành '${to}' bởi ${by} lúc ${time}`,
    assignedTo: "Giao cho",
    priority: "Mức độ ưu tiên",
    archivedRecord: "Bản ghi đã được lưu trữ",
    archivedRecordDesc: "Đây là bản ghi chỉ đọc. Dữ liệu gốc được hiển thị cho mục đích tham khảo.",
    noRelatedIncidents: "Không có sự cố liên quan nào khác được tìm thấy.",
    relatedIncidentsTitle: "Sự cố Liên quan cùng Hệ thống",
    relatedIncidentsDesc: "Các sự cố khác được ghi nhận trong cùng hệ thống.",
    workflowTitle: "Các bước tiếp theo",
    workflowDescription: "Thực hiện hành động tiếp theo trong quy trình xử lý sự cố.",
    btnIdentify: "Bắt đầu Đánh giá",
    btnAnalyze: "Tiếp nhận Xử lý",
    btnResolve: "Gửi Phản hồi",
    btnClose: "Phê duyệt & Đóng",
    noFurtherActions: (status: string) => `Không có hành động nào cho trạng thái: ${status}`,
    noPermissionForWorkflow: "Bạn không có quyền thực hiện các bước tiếp theo.",
    closeSuccess: "Đã phê duyệt và đóng sự cố thành công.",
    printReport: "In Báo cáo PDF",
    reportSubtitle: "BÁO CÁO CHI TIẾT SỰ CỐ VÀ HỎNG HÓC (DNF)"
  },
  en: {
    titlePrefix: "Incident Details",
    backToList: "Back to list",
    edit: "Edit",
    delete: "Delete Incident",
    createHazard: "Create Hazard",
    confirmDeleteTitle: "Confirm Incident Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete Incident #${id}? This action cannot be undone.`,
    deleteSuccess: (id: string) => `Incident #${id} has been deleted successfully.`,
    exportCsv: "Export CSV",
    status: "Status",
    hazardLevel: "Hazard Level",
    failureReportNo: "Failure Report No (HTC)",
    location: "Location",
    failedComponent: "Failed Component/LRU/Train",
    subsystem: "System",
    description: "Description of Failure",
    impactAssessmentLabel: "Impact Assessment",
    identifiedBy: "Identified By",
    occurrenceTime: "Time of Occurrence",
    detectionMethod: "Detection Method",
    attachments: "Images/Attachments",
    noAttachments: "No images/attachments.",
    createdBy: "Created By",
    createdAt: "Created At",
    updatedAt: "Last Updated",
    manageStatusTitle: "Manage Status",
    selectNewStatus: "Select new status",
    saveStatus: "Save Status",
    statusUpdateSuccess: "Incident status updated successfully.",
    statusUpdateFailed: "Failed to update status. No permission or invalid transition.",
    noPermissionToManageStatus: "You do not have permission to manage the status of this Incident.",
    processingInfoTitle: "Processing & Resolution Details",
    createCorrectiveAction: "Create Corrective Action",
    csvHeaders: {
        id: "Incident ID",
        failureReportNo: "HTC Report No",
        locationOfFailure: "Location",
        failedComponentEquipmentLRUTrainNumber: "Failed Component",
        subsystem: "System",
        descriptionOfFailure: "Failure Description",
        impactAssessment: "Impact Assessment",
        staffWhoIdentifiedFailure: "Identified By",
        dateTimeOfFailureOccurrence: "Occurrence DateTime (ISO)",
        methodOfFailureDetection: "Detection Method",
        hazardLevel: "Hazard Level",
        status: "Status",
        attachments: "Attachments (Filenames)",
        createdById: "Creator ID",
        createdAt: "Created At (ISO)",
        updatedAt: "Updated At (ISO)",
        assignedTo: "Assigned To",
        priority: "Priority",
        resolutionDetails: "Resolution Details",
    },
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    statusHistory: "Status History",
    statusChangeDetails: (to: string, by: string, time: string) => `Changed to '${to}' by ${by} at ${time}`,
    assignedTo: "Assigned To",
    priority: "Priority",
    archivedRecord: "Archived Record",
    archivedRecordDesc: "This is a read-only record. Original data is shown for reference.",
    noRelatedIncidents: "No other related incidents found.",
    relatedIncidentsTitle: "Related Incidents in System",
    relatedIncidentsDesc: "Other recorded incidents within the same system.",
    workflowTitle: "Next Steps",
    workflowDescription: "Perform the next action in the incident resolution workflow.",
    btnIdentify: "Start Assessment",
    btnAnalyze: "Accept for Resolution",
    btnResolve: "Send Feedback",
    btnClose: "Approve & Close",
    noFurtherActions: (status: string) => `No further actions available for status: ${status}`,
    noPermissionForWorkflow: "You do not have permission to perform next steps.",
    printReport: "Print PDF Report",
    reportSubtitle: "DEFECT / NON-FAILURE (DNF) DETAIL REPORT"
  },
};

function getDnfStatusBadgeVariant(status: DnfStatus): "default" | "secondary" | "destructive" | "outline" | "accent" {
  switch (status) {
    case "Mới": return "outline";
    case "Đánh giá": return "secondary";
    case "Xử lý": return "default";
    case "Phản hồi": return "accent";
    case "Đóng": return "default";
    default: return "outline";
  }
}

function getPriorityBadgeVariant(priority?: "Cao" | "Trung bình" | "Thấp"): "destructive" | "secondary" | "default" {
    if (priority === "Cao") return "destructive";
    if (priority === "Trung bình") return "secondary";
    return "default";
}

interface DnfDetailClientProps {
  initialDnf: DnfDocument;
  allDnfs: DnfDocument[];
  initialSubsystems: Subsystem[];
  initialComments: Comment[];
  initialLocations: PatrolLocation[];
}

export function DnfDetailClient({ initialDnf, allDnfs, initialSubsystems, initialComments, initialLocations }: DnfDetailClientProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const { isOnline } = useNetwork();
  const [dnf, setDnf] = React.useState<DnfDocument>(initialDnf);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>(initialSubsystems);
  const [locations, setLocations] = React.useState<PatrolLocation[]>(initialLocations);
  const [isMounted, setIsMounted] = React.useState(false);

  const [permissions, setPermissions] = React.useState({
    canEdit: false,
    canDelete: false,
    canManageStatus: false,
    canResolve: false,
    canViewAll: false,
    canCreateHazard: false,
  });

  const canTransitionToStatus = React.useCallback((currentStatus: DnfStatus, newStatus: DnfStatus, userRole: UserRole): boolean => {
      if (userRole === ROLE_SUPER_ADMIN || userRole === ROLE_ADMIN_PKTAT) {
          return true; // Admin can do any transition
      }
      const transitionRule = DNF_STATUS_TRANSITIONS[currentStatus];
      if (!transitionRule) return false;
      
      if (transitionRule.roles) {
          const allowedForRole = (transitionRule.roles as any)[userRole];
          if (allowedForRole) {
              return (allowedForRole as string[]).includes(newStatus);
          }
      }
      
      return (transitionRule.next as string[]).includes(newStatus);
  }, []);

  const handleUpdate = async () => {
    try {
        const updatedDnf = await getDnfById(dnf.id);
        if (updatedDnf) {
            setDnf(updatedDnf);
        }
    } catch(e) {
        console.error("Failed to refresh DNF data:", e);
    }
  }

  React.useEffect(() => {
    setIsMounted(true);
    const checkPermissions = async () => {
      if (!dnf) return;
      const currentUser = MOCK_CURRENT_USER;
      const editAll = await hasPermission('dnf:edit_all');
      const deletePerm = await hasPermission('dnf:delete');
      const manageStatus = await hasPermission("dnf:manage_status");
      const viewAll = await hasPermission("dnf:view_all");
      const createHazardPerm = await hasPermission("hazard:create");
      const createCorrectiveActionPerm = await hasPermission("corrective_actions:create");
      
      let canEditCurrent = false;
      if (dnf.isArchived) { // Archived records cannot be edited
          canEditCurrent = false;
      } else if (editAll || currentUser?.role === ROLE_SUPER_ADMIN || currentUser?.role === ROLE_ADMIN_PKTAT || currentUser?.role === ROLE_L3_SPECIALIST) {
          canEditCurrent = dnf.status !== "Đóng";
      } else if (currentUser.role === ROLE_L2_TECHNICIAN) {
          canEditCurrent = dnf.status === "Mới" || dnf.status === "Đánh giá";
      }
      
      setPermissions({
        canEdit: canEditCurrent,
        canDelete: deletePerm && (currentUser?.role === ROLE_SUPER_ADMIN || currentUser?.role === ROLE_ADMIN_PKTAT) && !dnf.isArchived,
        canManageStatus: manageStatus && !dnf.isArchived,
        canResolve: createCorrectiveActionPerm && !dnf.isArchived,
        canViewAll: viewAll,
        canCreateHazard: createHazardPerm && !dnf.isArchived,
      });
    };

    if (dnf) {
      checkPermissions();
    }
  }, [dnf]);

  const userCanEditCurrentDnf = permissions.canEdit;
  const userCanDeleteCurrentDnf = permissions.canDelete;
  const canUserManageStatus = permissions.canManageStatus;
  const canUserResolve = permissions.canResolve;
  const canUserCreateHazard = permissions.canCreateHazard;
  
  React.useEffect(() => {
    document.title = `${t.titlePrefix} #${dnf.id} - Metro Inspect Pro`;
  }, [dnf.id, t.titlePrefix]);


  const handleStatusUpdate = async (newStatus: DnfStatus) => {
    if (!dnf) return;

    const canPerformTransition = canTransitionToStatus(dnf.status, newStatus, MOCK_CURRENT_USER.role);

    if (!canPerformTransition) {
        toast({ variant: "destructive", title: "Lỗi", description: t.statusUpdateFailed });
        return;
    }

    const updatedDnfData = { ...dnf, status: newStatus, updatedAt: new Date().toISOString() };
    
    if (!isOnline) {
        await offlineSync.addAction({
            type: 'STATUS_UPDATE',
            entityType: 'DNF',
            data: updatedDnfData
        });
        setDnf(updatedDnfData);
        toast({ title: "Đã lưu ngoại tuyến", description: "Trạng thái sẽ được cập nhật khi có mạng." });
        return;
    }

    await updateMockDnf(updatedDnfData);
    setDnf(updatedDnfData);

    toast({ title: "Thành công", description: t.statusUpdateSuccess });
  };

  const handleActualDelete = async () => {
    if (!dnf) return;
    await deleteMockDnf(dnf.id);
    toast({
      title: "Thành công",
      description: t.deleteSuccess(dnf.id),
    });
    router.push("/dnf?refresh=true");
  };

  const escapeCsvCell = (cellData: any): string => {
    const stringData = String(cellData == null ? "" : cellData);
    if (stringData.includes(",") || stringData.includes("\"") || stringData.includes("\n")) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };

  const handleExportDnfCsv = () => {
    if (!dnf) return;
    const hazardLevelInfo = DNF_HAZARD_LEVELS.find(hl => hl.id === dnf.hazardLevelId);
    const hazardLevelLabel = hazardLevelInfo ? hazardLevelInfo.label[locale] : dnf.hazardLevelId || "N/A";

    const headers = [
        t.csvHeaders.id,
        t.csvHeaders.failureReportNo,
        t.csvHeaders.locationOfFailure,
        t.csvHeaders.failedComponentEquipmentLRUTrainNumber,
        t.csvHeaders.subsystem,
        t.csvHeaders.descriptionOfFailure,
        t.csvHeaders.impactAssessment,
        t.csvHeaders.staffWhoIdentifiedFailure,
        t.csvHeaders.dateTimeOfFailureOccurrence,
        t.csvHeaders.methodOfFailureDetection,
        t.csvHeaders.hazardLevel,
        t.csvHeaders.status,
        t.csvHeaders.attachments,
        t.csvHeaders.createdById,
        t.csvHeaders.createdAt,
        t.csvHeaders.updatedAt,
    ];

    const locationLabelExp = dnf.locationOfFailure.split(',').map(id => locations.find(l => l.id === id)?.label || id).join('; ');
    const subsystemLabelExp = dnf.subsystemIds?.map(id => subsystems.find(s => s.id === id)?.label[locale] || id).join('; ');
    const detectionMethodLabelExp = DNF_METHODS_OF_DETECTION.find(m => m.id === dnf.methodOfFailureDetection)?.label[locale] || dnf.methodOfFailureDetection;
    const attachmentsString = dnf.attachments?.map(att => att.name).join('; ') || "";


    const row = [
        dnf.id,
        dnf.failureReportNo,
        locationLabelExp,
        dnf.failedComponentEquipmentLRUTrainNumber,
        subsystemLabelExp,
        dnf.descriptionOfFailure,
        dnf.impactAssessment || "",
        dnf.staffWhoIdentifiedFailure,
        new Date(dnf.dateTimeOfFailureOccurrence).toLocaleString(locale),
        detectionMethodLabelExp,
        hazardLevelLabel,
        dnf.status,
        attachmentsString,
        dnf.createdById,
        new Date(dnf.createdAt).toLocaleString(locale),
        new Date(dnf.updatedAt).toLocaleString(locale),
    ].map(escapeCsvCell);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
        + headers.join(",") + "\n"
        + row.join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Defect-${dnf.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const relatedIncidents = React.useMemo(() => {
    if (!dnf || !dnf.subsystemIds || dnf.subsystemIds.length === 0) return [];
    return allDnfs.filter(d => 
        d.id !== dnf.id && 
        d.subsystemIds?.some(subId => dnf.subsystemIds!.includes(subId))
    );
  }, [dnf, allDnfs]);

  const locationLabel = dnf.locationOfFailure.split(',').map(id => locations.find(l => l.id === id)?.label || id).join(', ');
  const subsystemLabels = (dnf.subsystemIds || []).map(id => subsystems.find(s => s.id === id)?.label[locale] || id).join(', ');
  const detectionMethodLabel = DNF_METHODS_OF_DETECTION.find(m => m.id === dnf.methodOfFailureDetection)?.label[locale] || dnf.methodOfFailureDetection;
  const dateTimeOccurrence = isMounted ? new Date(dnf.dateTimeOfFailureOccurrence).toLocaleString(locale) : '...';
  const createdAtDate = isMounted ? new Date(dnf.createdAt).toLocaleString(locale) : '...';
  const updatedAtDate = isMounted ? new Date(dnf.updatedAt).toLocaleString(locale) : '...';

  const hazardLevelInfo = DNF_HAZARD_LEVELS.find(hl => hl.id === dnf.hazardLevelId);
  const hazardLevelLabel = hazardLevelInfo?.label[locale] || dnf.hazardLevelId;
  const HazardIcon = hazardLevelInfo?.icon || Info;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/dnf?refresh=true">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" asChild disabled={!userCanEditCurrentDnf}>
            <Link href={`/dnf/${dnf.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> {t.edit}
            </Link>
          </Button>
          {canUserCreateHazard && (
            <Button variant="outline" asChild>
                <Link href={`/hazards/new?originatingDnfId=${dnf.id}&suggestedDescription=${encodeURIComponent(dnf.descriptionOfFailure)}&locationOfFailure=${dnf.locationOfFailure}`}>
                    <ShieldPlus className="mr-2 h-4 w-4" />
                    {t.createHazard}
                </Link>
            </Button>
          )}
           {userCanDeleteCurrentDnf && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>{t.confirmDeleteMsg(dnf.id)}</AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleActualDelete}>{t.confirmDelete}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
           <Button variant="outline" onClick={() => window.print()} className="no-print">
            <Printer className="mr-2 h-4 w-4" /> {t.printReport}
          </Button>
          <Button onClick={handleExportDnfCsv} className="no-print">
            <FileDown className="mr-2 h-4 w-4" /> {t.exportCsv}
          </Button>
        </div>
      </div>

       {dnf.isArchived && (
          <Card className="border-amber-500/50 bg-amber-500/10">
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <Archive className="h-6 w-6 text-amber-600"/>
                  <div>
                    <CardTitle className="text-amber-700">{t.archivedRecord}</CardTitle>
                    <CardDescription className="text-amber-600">{t.archivedRecordDesc}</CardDescription>
                  </div>
              </CardHeader>
          </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-headline text-primary flex items-center">
                    <Tag className="mr-3 h-7 w-7"/> {t.titlePrefix} #{dnf.id}
                  </CardTitle>
                  <CardDescription>{t.failureReportNo}: {dnf.failureReportNo || "N/A"}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <Badge variant={getDnfStatusBadgeVariant(dnf.status)} className="text-sm px-3 py-1">{dnf.status}</Badge>
                    {hazardLevelInfo && (
                        <Badge variant={hazardLevelInfo.badgeVariant} className="text-sm px-3 py-1">
                            <HazardIcon className="mr-2 h-4 w-4" />
                            {hazardLevelInfo.label[locale]}
                        </Badge>
                    )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-start"><MapPin className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.location}:</strong> {locationLabel}</div></div>
                <div className="flex items-start col-span-full lg:col-span-2"><Settings className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.subsystem}:</strong> {subsystemLabels}</div></div>
                <div className="flex items-start"><Construction className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.failedComponent}:</strong> {dnf.failedComponentEquipmentLRUTrainNumber || "N/A"}</div></div>
                <div className="flex items-start"><User className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.identifiedBy}:</strong> {dnf.staffWhoIdentifiedFailure}</div></div>
                <div className="flex items-start"><Clock className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.occurrenceTime}:</strong> {dateTimeOccurrence}</div></div>
                <div className="flex items-start"><Eye className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.detectionMethod}:</strong> {detectionMethodLabel}</div></div>
                <div className="flex items-start"><UserCheck className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.assignedTo}:</strong> {dnf.assignedTo || "N/A"}</div></div>
                <div className="flex items-start"><Shield className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <div><strong className="font-medium">{t.priority}:</strong> {dnf.priority ? <Badge variant={getPriorityBadgeVariant(dnf.priority)}>{dnf.priority}</Badge> : "N/A"}</div></div>
                {hazardLevelInfo && (
                    <div className="flex items-start"><HazardIcon className={cn("mr-2 mt-0.5 h-5 w-5 flex-shrink-0",
                        hazardLevelInfo.badgeVariant === 'destructive' ? 'text-destructive' :
                        hazardLevelInfo.badgeVariant === 'secondary' ? 'text-yellow-500' : 'text-muted-foreground'
                    )} />
                    <div><strong className="font-medium">{t.hazardLevel}:</strong> {hazardLevelInfo.label[locale]}</div></div>
                )}
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-1">{t.description}:</h3>
                <p className="text-muted-foreground whitespace-pre-line">{dnf.descriptionOfFailure}</p>
              </div>

              {dnf.impactAssessment && (
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t.impactAssessmentLabel}:</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{dnf.impactAssessment}</p>
                </div>
              )}

              {dnf.attachments && dnf.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">{t.attachments}:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {dnf.attachments.map(img => (
                      <div key={img.id} className="relative aspect-video group border rounded-md overflow-hidden">
                        <Image src={img.url} alt={img.name} fill objectFit="cover" data-ai-hint={img['data-ai-hint'] || 'dnf attachment'} />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate group-hover:opacity-100 opacity-0 transition-opacity">
                            {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(!dnf.attachments || dnf.attachments.length === 0) && (
                <div>
                    <h3 className="font-semibold text-lg mb-1">{t.attachments}:</h3>
                    <p className="text-sm text-muted-foreground">{t.noAttachments}</p>
                </div>
              )}
              <Separator />
              <div className="grid md:grid-cols-3 gap-x-6 gap-y-2 text-xs text-muted-foreground">
                    <p><strong>{t.createdBy}:</strong> {dnf.createdById || "Hệ thống"}</p>
                    <p><strong>{t.createdAt}:</strong> {createdAtDate}</p>
                    <p><strong>{t.updatedAt}:</strong> {updatedAtDate}</p>
              </div>
            </CardContent>
          </Card>
          
          {canUserResolve && dnf && (dnf.status === "Xử lý") && (
            <CorrectiveActionPanel dnf={dnf} onUpdate={handleUpdate} />
          )}

        </div>

        <div className="lg:col-span-1 space-y-6">
          { canUserManageStatus && dnf && dnf.status !== "Đóng" && (
            <Card>
                <CardHeader>
                    <CardTitle>{t.workflowTitle}</CardTitle>
                    <CardDescription>{t.workflowDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    {(() => {
                        switch (dnf.status) {
                            case 'Mới':
                                return (
                                    <Button onClick={() => handleStatusUpdate('Đánh giá')}>
                                        <ListChecks className="mr-2 h-4 w-4" />
                                        {t.btnIdentify}
                                    </Button>
                                );
                            case 'Đánh giá':
                                return (
                                    <Button onClick={() => handleStatusUpdate('Xử lý')}>
                                        <Wrench className="mr-2 h-4 w-4" />
                                        {t.btnAnalyze}
                                    </Button>
                                );
                            case 'Xử lý':
                                return <p className="text-sm text-muted-foreground">{t.noFurtherActions(dnf.status)} (Sử dụng Panel bên dưới)</p>;
                            case 'Phản hồi':
                                return (
                                    <Button onClick={() => handleStatusUpdate('Đóng')}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {t.btnClose}
                                    </Button>
                                );
                            default:
                                return <p className="text-sm text-muted-foreground">{t.noFurtherActions(dnf.status)}</p>;
                        }
                    })()}
                </CardContent>
            </Card>
          )}
          { !canUserManageStatus && permissions.canViewAll && (
            <Card>
                <CardHeader><CardTitle>{t.manageStatusTitle}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">{t.noPermissionToManageStatus}</p></CardContent>
            </Card>
          )}

          <CommentPanel entityId={dnf.id} initialComments={initialComments} />
          
          <Card>
              <CardHeader><CardTitle>{t.statusHistory}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {dnf.statusHistory?.map((history, index) => (
                      <li key={index} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <History className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{t.statusChangeDetails(history.to, history.userName, isMounted ? new Date(history.timestamp).toLocaleString(locale) : '...')}</p>
                          </div>
                      </li>
                  )).reverse()}
                   <li className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <FilePlus className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{locale === 'vi' ? 'Tạo bởi' : 'Created by'} {dnf.createdById} lúc {createdAtDate}</p>
                        </div>
                    </li>
                </ul>
              </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Network className="mr-2 h-5 w-5 text-primary" />
                        {t.relatedIncidentsTitle}
                    </CardTitle>
                    <CardDescription>{t.relatedIncidentsDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    {relatedIncidents.length > 0 ? (
                        <div className="space-y-3">
                            {relatedIncidents.slice(0, 5).map(rel => {
                                return (
                                    <Link key={rel.id} href={`/dnf/${rel.id}`} className="block">
                                        <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-sm">{rel.descriptionOfFailure.substring(0, 50)}...</p>
                                                <Badge variant={getDnfStatusBadgeVariant(rel.status)}>{rel.status}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">{rel.id}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">{t.noRelatedIncidents}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

      {/* ============ PRINT REPORT LAYOUT ============ */}
      <ReportLayout 
        title={`${t.titlePrefix} #${dnf.id}`} 
        documentId={dnf.id}
        subtitle={t.reportSubtitle}
      >
        <div className="space-y-6">
            <table className="w-full border-collapse border border-black">
                <tbody>
                    <tr>
                        <th className="w-1/4 bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.status}</th>
                        <td className="w-1/4 p-2 border border-black font-bold text-primary">{dnf.status}</td>
                        <th className="w-1/4 bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.priority}</th>
                        <td className="w-1/4 p-2 border border-black">{dnf.priority || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.failureReportNo}</th>
                        <td className="p-2 border border-black font-mono">{dnf.failureReportNo || 'N/A'}</td>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.hazardLevel}</th>
                        <td className="p-2 border border-black">{hazardLevelLabel || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.location}</th>
                        <td className="p-2 border border-black" colSpan={3}>{locationLabel}</td>
                    </tr>
                    <tr>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.subsystem}</th>
                        <td className="p-2 border border-black">{subsystemLabels}</td>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.failedComponent}</th>
                        <td className="p-2 border border-black">{dnf.failedComponentEquipmentLRUTrainNumber}</td>
                    </tr>
                </tbody>
            </table>

            <div className="no-break border border-black p-4 rounded-sm mt-4">
                <h3 className="font-bold border-b border-black pb-1 mb-2 uppercase text-xs">{t.description}</h3>
                <p className="text-sm whitespace-pre-wrap">{dnf.descriptionOfFailure}</p>
            </div>

            <div className="no-break border border-black p-4 rounded-sm mt-4">
                <h3 className="font-bold border-b border-black pb-1 mb-2 uppercase text-xs">{t.impactAssessmentLabel}</h3>
                <p className="text-sm whitespace-pre-wrap">{dnf.impactAssessment || 'Chưa đánh giá.'}</p>
            </div>

            {dnf.attachments && dnf.attachments.length > 0 && (
                <div className="mt-8">
                    <h3 className="font-bold border-b-2 border-primary pb-1 mb-4 uppercase text-xs">{t.attachments}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {dnf.attachments.map((img: any, idx: number) => (
                            <div key={idx} className="border border-gray-300 p-1 flex flex-col items-center no-break relative min-h-[200px]">
                                <Image src={img.url} alt={`attachment-${idx}`} fill className="object-contain" />
                                <p className="text-[8pt] text-gray-500 mt-1 italic absolute bottom-1">{img.name || `Hình ảnh ${idx + 1}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </ReportLayout>
    </div>
  );
}
