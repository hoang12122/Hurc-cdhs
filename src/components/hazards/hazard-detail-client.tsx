
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  User,
  CalendarDays,
  ShieldAlert,
  Target,
  Settings,
  ListChecks,
  Construction,
  UserCheck,
  FileText,
  Image as ImageIcon,
  InfoIcon,
  CheckSquare,
  AlertTriangle,
  Save,
  Trash2,
  CheckCircle as CheckCircleIcon,
  Users,
  Lightbulb,
  Printer,
  Wrench,
  Network,
  History,
  FilePlus,
  MapPin
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import {
    type HazardRecord,
    HAZARD_STATUSES,
    HAZARD_RISK_LEVELS,
    HAZARD_SEVERITY_LEVELS,
    HAZARD_LIKELIHOOD_LEVELS,
    calculateRiskLevelId,
    MOCK_CURRENT_USER,
    ROLE_ADMIN_PKTAT,
    ROLE_L3_SPECIALIST,
    type UserRole,
    type HazardStatus,
    type Subsystem,
    type ResponsibleUnit,
    type PatrolLocation,
    HAZARD_STATUS_TRANSITIONS,
} from '@/lib/constants';
import { updateHazardRecord, deleteHazardRecord } from "@/lib/actions/hazard.actions";
import { hasPermission } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { HazardResolutionForm } from '@/components/hazards/hazard-resolution-form';


const translations = {
  vi: {
    titlePrefix: 'Chi tiết Mối nguy',
    backToList: 'Quay lại danh sách',
    edit: 'Chỉnh sửa',
    delete: 'Xóa Mối nguy',
    printReport: "In Báo cáo",
    confirmDeleteTitle: "Xác nhận Xóa Mối nguy",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa Mối nguy #${id}? Hành động này không thể hoàn tác.`,
    status: 'Trạng thái',
    description: 'Mô tả mối nguy sau',
    location: 'Vị trí',
    source: 'Nguồn gốc/Nguyên nhân tiềm ẩn',
    potentialConsequence: 'Hậu quả tiềm ẩn',
    systemGroup: 'Hệ thống',
    identifiedBy: 'Người phát hiện',
    identificationDate: 'Ngày phát hiện',
    severity: 'Mức độ Nghiêm trọng',
    likelihood: 'Tần suất Khả năng Xảy Ra',
    riskLevel: 'Mức độ Rủi ro',
    currentControls: 'Biện pháp chính',
    proposedActions: 'Biện pháp phụ',
    suggestedActions: 'Biện pháp đề xuất (chưa thực hiện)',
    responsiblePersonLeadUnit: 'Đơn vị chịu trách nhiệm chủ trì',
    coordinatingUnits: 'Đơn vị trách nhiệm phối hợp',
    dueDate: 'Ngày Dự kiến Hoàn thành',
    closureDetails: 'Thông tin Đóng/Hoàn thành',
    verificationDetails: 'Thông tin Xác minh',
    attachments: 'Hình ảnh/Tài liệu đính kèm',
    noAttachments: 'Không có hình ảnh/tài liệu đính kèm.',
    linkedDnf: 'Khiếm khuyết (DNF) liên quan',
    notSet: 'Chưa đặt',
    notAssessed: 'Chưa đánh giá',
    finalClosureTitle: "Phê duyệt & Đóng Mối nguy",
    finalClosureDesc: "Xác nhận rằng mối nguy đã được kiểm soát hoàn toàn và đóng phiếu ghi.",
    closeHazardButton: "Phê duyệt & Đóng",
    statusUpdateSuccess: 'Đã cập nhật trạng thái mối nguy thành công.',
    noPermissionToManageStatus: 'Bạn không có quyền quản lý trạng thái của mối nguy này.',
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    manageStatusTitle: "Quản lý Trạng thái",
    selectNewStatus: "Chọn trạng thái mới",
    saveStatus: "Lưu Trạng Thái",
    statusUpdateFailed: "Không thể cập nhật trạng thái. Không có quyền hoặc chuyển đổi không hợp lệ.",
    workflowTitle: "Các bước tiếp theo",
    workflowDescription: "Thực hiện hành động tiếp theo trong quy trình xử lý mối nguy.",
    assessHazardButton: "Bắt đầu Đánh giá",
    acceptForResolutionButton: "Tiếp nhận Xử lý",
    noFurtherActions: (status: string) => `Không có hành động nào cho trạng thái: ${status}`,
    noPermissionForWorkflow: "Bạn không có quyền thực hiện các bước tiếp theo.",
    relatedHazardsTitle: "Mối nguy Liên quan cùng Hệ thống",
    relatedHazardsDesc: "Các mối nguy khác được ghi nhận trong cùng hệ thống.",
    noRelatedHazards: "Không có mối nguy liên quan nào khác được tìm thấy.",
    statusHistory: "Lịch sử Trạng thái",
    statusChangeDetails: (to: string, by: string, time: string) => `Chuyển thành '${to}' bởi ${by} lúc ${time}`,
  },
  en: {
    titlePrefix: 'Hazard Record Details',
    backToList: 'Back to list',
    edit: 'Edit',
    delete: 'Delete Hazard',
    printReport: "Print Report",
    confirmDeleteTitle: "Confirm Hazard Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete Hazard #${id}? This action cannot be undone.`,
    status: 'Status',
    description: 'Hazard Description',
    location: 'Location',
    source: 'Source/Potential Cause',
    potentialConsequence: 'Potential Consequence',
    systemGroup: 'System',
    identifiedBy: 'Identified By',
    identificationDate: 'Identification Date',
    severity: 'Severity Level',
    likelihood: 'Likelihood Level',
    riskLevel: 'Risk Level',
    currentControls: 'Primary Measures',
    proposedActions: 'Secondary Measures',
    suggestedActions: 'Proposed Measures (not yet implemented)',
    responsiblePersonLeadUnit: 'Lead Responsible Unit',
    coordinatingUnits: 'Coordinating Units',
    dueDate: 'Due Date',
    closureDetails: 'Closure/Completion Details',
    verificationDetails: 'Verification Details',
    attachments: 'Images/Attachments',
    noAttachments: 'No images/attachments.',
    linkedDnf: 'Linked Defect (DNF)',
    notSet: 'Not set',
    notAssessed: 'Not Assessed',
    finalClosureTitle: "Approve & Close Hazard",
    finalClosureDesc: "Confirm that the hazard is fully controlled and close the record.",
    closeHazardButton: "Approve & Close",
    statusUpdateSuccess: 'Hazard status updated successfully.',
    noPermissionToManageStatus: 'You do not have permission to manage the status of this hazard.',
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    manageStatusTitle: "Manage Status",
    selectNewStatus: "Select new status",
    saveStatus: "Save Status",
    statusUpdateFailed: "Failed to update status. No permission or invalid transition.",
    workflowTitle: "Next Steps",
    workflowDescription: "Perform the next action in the hazard resolution workflow.",
    assessHazardButton: "Start Assessment",
    acceptForResolutionButton: "Accept for Resolution",
    noFurtherActions: (status: string) => `No further actions available for status: ${status}`,
    noPermissionForWorkflow: "You do not have permission to perform next steps.",
    relatedHazardsTitle: "Related Hazards in System",
    relatedHazardsDesc: "Other recorded hazards within the same system.",
    noRelatedHazards: "No other related hazards found.",
    statusHistory: "Status History",
    statusChangeDetails: (to: string, by: string, time: string) => `Changed to '${to}' by ${by} at ${time}`,
  }
};

function getHazardStatusBadgeVariant(
  status: HazardRecord['status']
): 'default' | 'secondary' | 'destructive' | 'outline' | 'accent' {
  switch (status) {
    case 'Mới': return 'outline';
    case 'Đang đánh giá': return 'secondary';
    case "Tiếp nhận xử lý": return "default";
    case 'Đã xử lý/Giám sát': return 'default';
    case 'Đã đóng': return 'default';
    case 'Hủy': return 'destructive';
    default: return 'outline';
  }
}

interface HazardDetailClientProps {
  initialHazard: HazardRecord;
  allHazards: HazardRecord[];
  subsystems: Subsystem[];
  responsibleUnits: ResponsibleUnit[];
  locations: PatrolLocation[];
}

export function HazardDetailClient({ initialHazard, allHazards, subsystems, responsibleUnits, locations }: HazardDetailClientProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();

  const [hazard, setHazard] = React.useState<HazardRecord>(initialHazard);
  
  const [permissions, setPermissions] = React.useState({
    canEdit: false,
    canDelete: false,
    canManageStatus: false,
    canViewAll: false,
  });
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const canTransitionToStatus = React.useCallback((currentStatus: HazardStatus, newStatus: HazardStatus, userRole: UserRole): boolean => {
      if (userRole === ROLE_ADMIN_PKTAT) {
          return true; // Admin can do any transition
      }
      const validTransitions = HAZARD_STATUS_TRANSITIONS[currentStatus] || [];
      return validTransitions.includes(newStatus);
  }, []);
  
  const handleStatusUpdate = async (newStatus: HazardStatus) => {
    if (!hazard) return;

    const canPerformTransition = canTransitionToStatus(hazard.status, newStatus, MOCK_CURRENT_USER.role);

    if (!canPerformTransition) {
        toast({ variant: "destructive", title: "Lỗi", description: t.statusUpdateFailed });
        return;
    }

    const updatedHazardData: HazardRecord = { ...hazard, status: newStatus, updatedAt: new Date().toISOString() };
    await updateHazardRecord(updatedHazardData);
    setHazard(updatedHazardData);

    toast({ title: "Thành công", description: t.statusUpdateSuccess });
  };


  React.useEffect(() => {
    const checkPermissions = async () => {
      if (!hazard) return;
      const editAll = await hasPermission('hazard:edit_all');
      const del = await hasPermission('hazard:delete');
      const manageStatus = await hasPermission("hazard:manage_status");
      const viewAll = await hasPermission("hazard:view_all");

      let canEdit = false;
      if (editAll) canEdit = true;
      else if (MOCK_CURRENT_USER.role === ROLE_L3_SPECIALIST) {
        canEdit = hazard.status !== "Đã đóng";
      }

      setPermissions({
        canEdit: canEdit,
        canDelete: del, // This now correctly reflects the user's direct permission
        canManageStatus: manageStatus,
        canViewAll: viewAll,
      });
    };
    if (hazard) {
        checkPermissions();
    }
  }, [hazard]);

  const userCanEditCurrentHazard = permissions.canEdit;
  const userCanDeleteCurrentHazard = permissions.canDelete;

  React.useEffect(() => {
    if (hazard?.id) {
        document.title = `${t.titlePrefix} #${hazard.id} - HURC CDHS`;
    }
  }, [hazard?.id, t.titlePrefix]);

  const handleActualDelete = async () => {
    if (!hazard) return;
    await deleteHazardRecord(hazard.id);
    toast({
      title: "Thành công",
      description: `Đã xóa thành công mối nguy #${hazard.id}.`,
    });
    router.push("/hazards");
  };
  
  const relatedHazards = React.useMemo(() => {
      if (!hazard || !hazard.systemGroup) return [];
      return allHazards.filter(h => h.systemGroup === hazard.systemGroup && h.id !== hazard.id);
  }, [hazard, allHazards]);

  const locationLabels = (hazard.locationIds || []).map(id => locations.find(l => l.id === id)?.label || id).join(', ');
  const identificationDateFormatted = isMounted ? new Date(hazard.identificationDate).toLocaleDateString(locale) : '...';
  const dueDateFormatted = hazard.dueDate ? (isMounted ? new Date(hazard.dueDate).toLocaleDateString(locale) : '...') : t.notSet;

  const severityInfo = HAZARD_SEVERITY_LEVELS.find(s => s.id === hazard.severityId);
  const likelihoodInfo = HAZARD_LIKELIHOOD_LEVELS.find(l => l.id === hazard.likelihoodId);
  const riskLevelInfo = HAZARD_RISK_LEVELS.find(r => r.id === hazard.riskLevelId);
  const systemGroupLabel = subsystems.find(s => s.id === hazard.systemGroup)?.label[locale] || hazard.systemGroup || t.notSet;
  const coordinatingUnitsLabels = (hazard.coordinatingUnits || []).map(name => responsibleUnits.find(u => u.name === name)?.name || name).join(', ');

  const RiskIconToUse = riskLevelInfo?.icon || InfoIcon;
  
  const renderWorkflowActions = () => {
    if (!permissions.canManageStatus) {
      return <p className="text-sm text-muted-foreground italic">{t.noPermissionForWorkflow}</p>;
    }

    switch (hazard.status) {
      case 'Mới':
        return (
          <Button onClick={() => handleStatusUpdate('Đang đánh giá')}>
            <CheckSquare className="mr-2 h-4 w-4" />
            {t.assessHazardButton}
          </Button>
        );
      case 'Đang đánh giá':
        return (
          <Button onClick={() => handleStatusUpdate('Tiếp nhận xử lý')}>
            <Wrench className="mr-2 h-4 w-4" />
            {t.acceptForResolutionButton}
          </Button>
        );
      case 'Tiếp nhận xử lý':
        return <HazardResolutionForm hazard={hazard} />;
      case 'Đã xử lý/Giám sát':
        return (
          <Button onClick={() => handleStatusUpdate('Đã đóng')}>
            <CheckCircleIcon className="mr-2 h-4 w-4" />
            {t.closeHazardButton}
          </Button>
        );
      default:
        return <p className="text-sm text-muted-foreground">{t.noFurtherActions(hazard.status)}</p>;
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/hazards">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
        <div className="flex gap-2">
          {userCanEditCurrentHazard && (
            <Button variant="outline" asChild>
              <Link href={`/hazards/${hazard.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> {t.edit}
              </Link>
            </Button>
          )}
           <Button variant="outline" asChild>
              <Link href={`/hazards/${hazard.id}/report`} target="_blank">
                  <Printer className="mr-2 h-4 w-4" /> {t.printReport}
              </Link>
          </Button>
           {userCanDeleteCurrentHazard && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>{t.confirmDeleteMsg(hazard.id)}</AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleActualDelete}>{t.confirmDelete}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-headline text-primary flex items-center">
                    <ShieldAlert className="mr-3 h-7 w-7" /> Hazard #{hazard.id}
                  </CardTitle>
                  <CardDescription>
                    {hazard.description.substring(0, 100)}...
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={getHazardStatusBadgeVariant(hazard.status)}
                    className="text-sm px-3 py-1"
                  >
                    {hazard.status}
                  </Badge>
                  {riskLevelInfo ? (
                    <Badge
                      style={{ backgroundColor: riskLevelInfo.color, color: riskLevelInfo.textColor }}
                      className="text-sm px-3 py-1 flex items-center"
                    >
                      <RiskIconToUse className="mr-1.5 h-4 w-4" />
                      {`${hazard.riskLevelId || 'N/A'} - ${riskLevelInfo.label[locale]}`}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm px-3 py-1">{t.notAssessed}</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                    <div className="flex items-start"><MapPin className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <p><strong className="font-medium">{t.location}:</strong> {locationLabels || t.notSet}</p></div>
                    <div className="flex items-start"><User className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <p><strong className="font-medium">{t.identifiedBy}:</strong> {hazard.identifiedBy}</p></div>
                    <div className="flex items-start"><CalendarDays className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <p><strong className="font-medium">{t.identificationDate}:</strong> {identificationDateFormatted}</p></div>
                    <div className="flex items-start"><Construction className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <p><strong className="font-medium">{t.systemGroup}:</strong> {systemGroupLabel}</p></div>
                    {hazard.linkedDnfId && <div className="flex items-start"><FileText className="mr-2 mt-0.5 h-5 w-5 text-muted-foreground flex-shrink-0" /> <p><strong className="font-medium">{t.linkedDnf}:</strong> <Link href={`/dnf/${hazard.linkedDnfId}`} className="text-primary hover:underline">{hazard.linkedDnfId}</Link></p></div>}
                </div>

                <Separator />

                <div>
                    <h3 className="font-semibold text-lg mb-2">{t.description}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{hazard.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>{t.source}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{hazard.source || t.notSet}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-destructive"/>{t.potentialConsequence}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{hazard.potentialConsequence || t.notSet}</p>
                    </div>
                </div>

                <Separator />

                <Card className="bg-background/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Đánh giá Rủi ro</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-medium mb-1">{t.severity}</h4>
                            <p className="text-muted-foreground">{severityInfo?.label[locale] || t.notAssessed}</p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{severityInfo?.description[locale]}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">{t.likelihood}</h4>
                            <p className="text-muted-foreground">{likelihoodInfo?.label[locale] || t.notAssessed}</p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{likelihoodInfo?.description[locale]}</p>
                        </div>
                         <div>
                            <h4 className="font-medium mb-1">{t.riskLevel}</h4>
                            {riskLevelInfo ? (
                                <>
                                    <p className="text-muted-foreground">{`${hazard.riskLevelId || 'N/A'} - ${riskLevelInfo.label[locale]}`}</p>
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">{riskLevelInfo.description[locale]}</p>
                                </>
                            ) : (
                                <p className="text-muted-foreground">{t.notAssessed}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>{t.currentControls}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{hazard.currentControls || t.notSet}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Construction className="mr-2 h-5 w-5 text-primary"/>{t.proposedActions}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{hazard.proposedActions || t.notSet}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary"/>{t.suggestedActions}</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{hazard.suggestedActions || t.notSet}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-1 flex items-center"><UserCheck className="mr-2 h-5 w-5 text-muted-foreground"/>{t.responsiblePersonLeadUnit}</h4>
                        <p className="text-muted-foreground">{hazard.responsiblePersonOrUnit || t.notSet}</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1 flex items-center"><Users className="mr-2 h-5 w-5 text-muted-foreground"/>{t.coordinatingUnits}</h4>
                        <p className="text-muted-foreground">
                            {coordinatingUnitsLabels || t.notSet}
                        </p>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium mb-1 flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-muted-foreground"/>{t.dueDate}</h4>
                        <p className="text-muted-foreground">{dueDateFormatted}</p>
                    </div>
                </div>

                {hazard.attachments && hazard.attachments.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/>{t.attachments}:</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {hazard.attachments.map(img => (
                            <div key={img.id} className="relative aspect-video group border rounded-md overflow-hidden">
                                <Image src={img.url} alt={img.name} fill objectFit="cover" data-ai-hint={img['data-ai-hint'] || 'hazard attachment'} />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                    {img.name}
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                )}
                {(!hazard.attachments || hazard.attachments.length === 0) && (
                    <div>
                        <h3 className="font-semibold text-lg mb-1 flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/>{t.attachments}:</h3>
                        <p className="text-sm text-muted-foreground">{t.noAttachments}</p>
                    </div>
                )}

                {(hazard.status === 'Đã đóng') && hazard.closureDetails && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>{t.closureDetails}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{hazard.closureDetails}</p>
                        </div>
                    </>
                )}
                {(hazard.status === 'Đã xử lý/Giám sát' || hazard.status === 'Đã đóng') && hazard.verificationDetails && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="font-semibold text-lg mb-2 flex items-center"><FileText className="mr-2 h-5 w-5 text-primary"/>{t.verificationDetails}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{hazard.verificationDetails}</p>
                        </div>
                    </>
                )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          {hazard.status !== 'Đã đóng' && hazard.status !== 'Hủy' && (
            <Card>
                <CardHeader>
                    <CardTitle>{t.workflowTitle}</CardTitle>
                    <CardDescription>{t.workflowDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderWorkflowActions()}
                </CardContent>
            </Card>
          )}

          <Card>
              <CardHeader><CardTitle>{t.statusHistory}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {hazard.statusHistory?.map((history, index) => (
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
                          <p className="text-sm text-muted-foreground">{locale === 'vi' ? 'Tạo bởi' : 'Created by'} {hazard.identifiedBy} lúc {identificationDateFormatted}</p>
                        </div>
                    </li>
                </ul>
              </CardContent>
          </Card>
          
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Network className="mr-2 h-5 w-5 text-primary" />
                        {t.relatedHazardsTitle}
                    </CardTitle>
                    <CardDescription>{t.relatedHazardsDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    {relatedHazards.length > 0 ? (
                        <div className="space-y-3">
                            {relatedHazards.map(rel => {
                                const relRiskLevel = HAZARD_RISK_LEVELS.find(r => r.id === rel.riskLevelId);
                                return (
                                    <Link key={rel.id} href={`/hazards/${rel.id}`} className="block">
                                        <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-sm">{rel.description.substring(0, 50)}...</p>
                                                <Badge variant={getHazardStatusBadgeVariant(rel.status)}>{rel.status}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-mono mt-1">{rel.id}</p>
                                            {relRiskLevel && (
                                                <div className="flex items-center text-xs mt-1" style={{ color: relRiskLevel.color }}>
                                                    <relRiskLevel.icon className="h-3 w-3 mr-1" />
                                                    <span>{relRiskLevel.label[locale]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">{t.noRelatedHazards}</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
