

"use client"; 

import * as React from 'react';
import { useEffect, useState } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit, Printer, Wrench, MapPin, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_LEVELS, type InspectionDetail as AppInspectionDetail, FINDING_TYPES, MOCK_CURRENT_USER, ROLE_ADMIN_PKTAT, ROLE_L3_SPECIALIST, INSPECTION_STATUSES, type InspectionStatus, LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN, type MaintenanceStandard, type PatrolLocation } from "@/lib/constants"; 
import { updateInspection, getInspections } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandards, getMaintenanceStandardItems } from "@/lib/actions/maintenance.actions";
import { getLocations } from "@/lib/actions/category.actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/language-context';
import { useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { FilePlus, Save, AlertTriangle, ThumbsUp, Calendar, Clock, UserCircle, Shield } from "lucide-react";

const translations = {
  vi: {
    titleBase: "Chi tiết Kiểm tra",
    notFoundTitle: "Không tìm thấy Kiểm tra",
    notFoundDescription: (id: string) => `Kiểm tra với ID "${id}" không tồn tại hoặc đã bị xóa.`,
    errorLoading: "Lỗi khi tải chi tiết kiểm tra.",
    errorTitle: "Lỗi",
    loadingMessage: "Đang tải chi tiết kiểm tra...",
    backToList: "Quay lại danh sách",
    edit: "Chỉnh sửa",
    print: "Xuất Báo Cáo (PDF)",
    inspectorLabel: "Người kiểm tra",
    templateLabel: "Mẫu Checklist",
    generalNotesLabel: "Ghi chú chung",
    noGeneralNotes: "Không có ghi chú chung nào.",
    checklistTitle: "Chi tiết Checklist và Phát hiện",
    noChecklistItems: "Không có hạng mục checklist nào cho kiểm tra này.",
    statusPass: "Đạt",
    statusFail: "Không đạt",
    statusPending: "Chưa kiểm tra",
    criteriaLabel: "Tiêu chí",
    unitLabel: "Đơn vị",
    findingLabel: "Phát hiện",
    severityLabel: "Mức độ",
    typeLabel: "Phân loại",
    quantityLabel: "Định lượng",
    standardQuantityPrefix: "Định mức",
    relatedDnfLabel: "Khiếm khuyết (DNF) liên quan",
    createDnfFromFinding: "Tạo DNF từ Phát hiện",
    recommendationLabel: "Đề xuất",
    imagesLabel: "Hình ảnh",
    notApplicable: "N/A",
    approvalTitle: "Đánh giá & Phê duyệt Kiểm tra", 
    approvalDescription: "Thay đổi trạng thái và đưa ra nhận xét cho kết quả kiểm tra.",
    selectNewStatus: "Chọn trạng thái mới",
    saveStatusAndComments: "Lưu Trạng thái & Ý kiến",
    statusUpdateSuccess: "Đã cập nhật trạng thái kiểm tra thành công.",
    commentsPlaceholder: "Nhập ý kiến đánh giá...",
    unknownSeverity: "Không xác định",
    unknownType: "Không xác định",
    inspectionLockedMessage: "Phiếu kiểm tra này đã được xử lý và không thể thay đổi trạng thái bởi vai trò của bạn.",
    schedulingDetails: "Chi tiết Lịch trình",
    scheduledStart: "Bắt đầu Theo lịch",
    scheduledFinish: "Kết thúc Theo lịch",
    estimatedDuration: "Thời gian Ước tính",
    hours: "giờ",
    requiredTools: "Công cụ Yêu cầu",
    none: "Không có",
    actualQuantityLabel: "Giá trị thực tế",
    toleranceLabel: "Chênh lệch cho phép",
    areaLabel: "Khu vực kiểm tra"
  },
  en: {
    titleBase: "Inspection Details",
    notFoundTitle: "Inspection Not Found",
    notFoundDescription: (id: string) => `Inspection with ID "${id}" does not exist or has been deleted.`,
    errorLoading: "Error loading inspection details.",
    errorTitle: "Error",
    loadingMessage: "Loading inspection details...",
    backToList: "Back to list",
    edit: "Edit",
    print: "Export Report (PDF)",
    inspectorLabel: "Inspector",
    templateLabel: "Checklist Template",
    generalNotesLabel: "General Notes",
    noGeneralNotes: "No general notes.",
    checklistTitle: "Checklist Details and Findings",
    noChecklistItems: "No checklist items for this inspection.",
    statusPass: "Pass",
    statusFail: "Fail / Has Findings",
    statusPending: "Pending",
    criteriaLabel: "Criteria",
    unitLabel: "Unit",
    findingLabel: "Finding",
    severityLabel: "Severity",
    typeLabel: "Type",
    quantityLabel: "Quantity",
    standardQuantityPrefix: "Standard",
    relatedDnfLabel: "Related Defect (DNF)",
    createDnfFromFinding: "Create DNF from this Finding",
    recommendationLabel: "Recommendation",
    imagesLabel: "Images",
    notApplicable: "N/A",
    approvalTitle: "Inspection Review & Approval", 
    approvalDescription: "Change status and provide comments for the inspection results.",
    selectNewStatus: "Select new status",
    saveStatusAndComments: "Save Status & Comments",
    statusUpdateSuccess: "Inspection status updated successfully.",
    commentsPlaceholder: "Enter review comments...",
    unknownSeverity: "Unknown",
    unknownType: "Unknown",
    inspectionLockedMessage: "This inspection has been processed and its status cannot be changed by your role.",
    schedulingDetails: "Scheduling Details",
    scheduledStart: "Scheduled Start",
    scheduledFinish: "Scheduled Finish",
    estimatedDuration: "Estimated Duration",
    hours: "hours",
    requiredTools: "Required Tools",
    none: "None",
    actualQuantityLabel: "Actual Value",
    toleranceLabel: "Allowed Tolerance",
    areaLabel: "Inspection Area",
  }
};

export default function InspectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast(); 
  
  const [inspection, setInspection] = useState<AppInspectionDetail | null>(null);
  const [maintenanceStandards, setMaintenanceStandards] = useState<MaintenanceStandard[]>([]);
  const [locations, setLocations] = useState<PatrolLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalComments, setApprovalComments] = useState(""); 
  const [selectedNewStatus, setSelectedNewStatus] = useState<InspectionStatus | "">("");
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentUser = MOCK_CURRENT_USER;
  const canManageInspectionStatus = currentUser.role === ROLE_ADMIN_PKTAT || currentUser.role === ROLE_L3_SPECIALIST;
  
  const isInspectionEditable = React.useCallback(() => {
    if (!inspection) return false;
    
    if (inspection.id.startsWith('INS-HM-')) {
        return true;
    }

    if (currentUser.role === ROLE_ADMIN_PKTAT) return true;
    if (LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN.includes(inspection.status as any)) {
      return false;
    }
    return currentUser.role === ROLE_L3_SPECIALIST; 
  }, [inspection, currentUser.role]);

  const canInteractWithApprovalForm = React.useMemo(() => {
    if (!inspection || !canManageInspectionStatus) return false;
    if (currentUser.role === ROLE_ADMIN_PKTAT) return true; 
    return !LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN.includes(inspection.status as any);
  }, [inspection, canManageInspectionStatus, currentUser.role]);


  useEffect(() => {
    if (!id) {
        setError("INVALID_ID");
        setLoading(false);
        return;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [allInspections, allStandards, allLocations, allStandardItems] = await Promise.all([
                getInspections(),
                getMaintenanceStandards(),
                getLocations(),
                getMaintenanceStandardItems()
            ]);

            const foundInspection = allInspections.find(insp => insp.id === id) || null;
            
            if (foundInspection) {
                let populatedInspection = { ...foundInspection };
                if ((!populatedInspection.checklistItems || populatedInspection.checklistItems.length === 0) && populatedInspection.checklistTemplateId) {
                    const itemsFromTemplate = allStandardItems.filter(
                        (item) => item.standardId === populatedInspection.checklistTemplateId
                    );
                    populatedInspection.checklistItems = itemsFromTemplate.map(task => ({
                        id: task.itemCode,
                        text: task.itemText,
                        criteria: task.criteria || "",
                        unit: task.unit,
                        status: "pending",
                        findings: [],
                        isCustom: false,
                        standardQuantity: task.standardQuantity,
                        toleranceOperator: task.toleranceOperator,
                        toleranceValue: task.toleranceValue,
                        requiredTools: task.requiredTools
                    }));
                }
                
                setInspection(populatedInspection);
                setMaintenanceStandards(allStandards);
                setLocations(allLocations);
                setSelectedNewStatus(populatedInspection.status); 
                setApprovalComments(populatedInspection.approvalComments || "");
            } else {
                setError("NOT_FOUND");
            }
        } catch (e) {
            console.error("Failed to fetch inspection details:", e);
            setError("GENERAL_ERROR");
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [id]);

  useEffect(() => {
    if (error === "NOT_FOUND") {
        document.title = `${t.notFoundTitle} - HURC CDHS`;
    } else if (inspection) {
        document.title = `${t.titleBase}: ${inspection.title} - HURC CDHS`;
    } else if (error) {
        document.title = `${t.errorTitle} - HURC CDHS`;
    }
  }, [inspection, error, t.titleBase, t.notFoundTitle, t.errorTitle]);

  const getChecklistItemStatusBadge = (status: "pending" | "pass" | "fail") => {
    switch (status) {
        case 'pass':
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5"/>{t.statusPass}</Badge>;
        case 'fail':
            return <Badge variant="destructive" className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5"/>{t.statusFail}</Badge>;
        case 'pending':
        default:
            return <Badge variant="secondary" className="flex items-center gap-1.5"><MinusCircle className="h-3.5 w-3.5"/>{t.statusPending}</Badge>;
    }
  };

  const getSeverityDisplay = (severityId?: string) => {
    if (!severityId) return <Badge variant="outline">{t.unknownSeverity}</Badge>;
    const level = SEVERITY_LEVELS.find(s => s.id === severityId);
    if (!level) return <Badge variant="outline">{severityId}</Badge>;
    
    const style: React.CSSProperties = {};
    if (level.colorVariable) { 
      style.backgroundColor = `hsl(var(--${level.colorVariable}))`;
    }
    
    return <Badge style={style} className={`${level.className} text-white`}>{level.label}</Badge>;
  };

  const getFindingTypeDisplay = (typeId?: string) => {
    if(!typeId) return t.unknownType;
    const findingType = FINDING_TYPES.find(ft => ft.id === typeId);
    return findingType ? findingType.label : typeId;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveStatusAndComments = async () => {
    if (!inspection || !selectedNewStatus || (selectedNewStatus as string) === "") {
        toast({ title: "Lỗi", description: "Vui lòng chọn trạng thái mới.", variant: "destructive"});
        return;
    }

    const updatedInspectionData: AppInspectionDetail = {
        ...inspection,
        status: selectedNewStatus,
        approvalComments: approvalComments,
        lastStatusUpdateBy: MOCK_CURRENT_USER.id,
        lastStatusUpdateAt: new Date().toISOString(),
    };
    
    await updateInspection(updatedInspectionData); 
    setInspection(updatedInspectionData); 
    toast({ title: "Thành công", description: t.statusUpdateSuccess });
  };


  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loadingMessage}</div>;
  }

  if (error) {
    let errorMessageText = t.errorLoading;
    if (error === "NOT_FOUND") errorMessageText = t.notFoundDescription(id);
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{errorMessageText}</p>
        <Button variant="outline" asChild>
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }

  if (!inspection) { 
     return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.notFoundTitle}</h1>
        <p className="text-muted-foreground mb-4">{t.notFoundDescription(id)}</p>
         <Button variant="outline" asChild className="mt-4">
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }
  
  const templateName = maintenanceStandards.find(
    (tmpl) => tmpl.id === inspection.checklistTemplateId
  )?.name || inspection.checklistTemplateId || t.notApplicable;
  const isCurrentInspectionEditable = isInspectionEditable();
  const inspectionDateFormatted = isMounted ? new Date(inspection.date).toLocaleDateString(locale) : '...';
  const scheduledStartDateFormatted = inspection.scheduledStartDate ? (isMounted ? new Date(inspection.scheduledStartDate).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short'}) : '...') : t.notApplicable;
  const scheduledFinishDateFormatted = inspection.scheduledFinishDate ? (isMounted ? new Date(inspection.scheduledFinishDate).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short'}) : '...') : t.notApplicable;
  const locationLabels = (inspection.areaIds || []).map(id => locations.find(l => l.id === id)?.label || id).join(', ');


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" asChild disabled={!isCurrentInspectionEditable} title={!isCurrentInspectionEditable ? t.inspectionLockedMessage : t.edit}>
            <Link href={`/inspections/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> {t.edit}
            </Link>
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> {t.print}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                    <CardTitle className="text-2xl font-headline text-primary">{inspection.title}</CardTitle>
                    <CardDescription>ID: {inspection.id} - {inspectionDateFormatted}</CardDescription>
                    </div>
                    <Badge variant={inspection.status === "Hoàn thành" || inspection.status === "Hoàn thành (Có phát hiện)" || inspection.status === "Đã xem xét" || inspection.status === "Đã duyệt để tạo báo cáo" ? "default" : "secondary"}>{inspection.status}</Badge>
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <p><strong>{t.inspectorLabel}:</strong> {inspection.inspector}</p>
                        <p><strong>{t.templateLabel}:</strong> {templateName}</p>
                    </div>
                    <div>
                        <p><strong>{t.areaLabel}:</strong> {locationLabels}</p>
                    </div>
                    <p><strong>{t.generalNotesLabel}:</strong> {inspection.generalNotes || t.noGeneralNotes}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>{t.checklistTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {inspection.checklistItems && inspection.checklistItems.length > 0 ? (
                    inspection.checklistItems.map((item) => (
                    <Card key={item.id} className={`p-4 ${item.status === 'pass' ? 'border-green-500/50' : item.status === 'fail' ? 'border-orange-500/50' : 'border-border'} bg-opacity-5`}>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="font-semibold">{item.text} ({item.id})</p>
                                {item.criteria && <p className="text-xs text-muted-foreground mt-1">{t.criteriaLabel}: {item.criteria}</p>}
                                {item.requiredTools && <p className="text-xs text-muted-foreground mt-1"><strong>{t.requiredTools}:</strong> {item.requiredTools || t.none}</p>}
                                {item.unit && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {t.unitLabel}: {item.unit} | {t.standardQuantityPrefix}: {item.standardQuantity ?? t.notApplicable}
                                        {item.toleranceOperator && (<span> | {t.toleranceLabel}: {item.toleranceOperator} {item.toleranceValue ?? ''}{item.toleranceOperator === '±' ? '%' : ''}</span>)}
                                    </p>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                {getChecklistItemStatusBadge(item.status)}
                            </div>
                        </div>

                        {item.actualQuantity != null && (
                            <p className="text-sm mt-2"><strong>{t.actualQuantityLabel}:</strong> {item.actualQuantity} {item.unit}</p>
                        )}
                    
                        {item.findings && item.findings.length > 0 && (
                            <div className="mt-2 ml-4 space-y-3">
                            {item.findings.map(finding => (
                                <Card key={finding.id} className="p-3 bg-card shadow-sm">
                                    <p><strong>{t.findingLabel} ({finding.id}):</strong> {finding.description}</p>
                                    <div className="flex items-center">
                                        <strong className="mr-1">{t.severityLabel}:</strong> {getSeverityDisplay(finding.severity)}
                                    </div>
                                    <p><strong>{t.typeLabel}:</strong> {getFindingTypeDisplay(finding.type)}</p>
                                    {finding.quantity != null && (
                                        <p><strong>{t.quantityLabel}:</strong> {finding.quantity} {item.unit || ''}
                                            {item.standardQuantity != null && (
                                                <span className="text-sm text-muted-foreground ml-2">({t.standardQuantityPrefix}: {item.standardQuantity})</span>
                                            )}
                                        </p>
                                    )}
                                    <p><strong>{t.recommendationLabel}:</strong> {finding.recommendation || t.notApplicable}</p>
                                    
                                    <div className="mt-2">
                                        {finding.linkedDnfId ? (
                                            <p><strong>{t.relatedDnfLabel}:</strong> <Link href={`/dnf/${finding.linkedDnfId}`} className="text-primary hover:underline">{finding.linkedDnfId}</Link></p>
                                        ) : (
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/dnf/new?originatingInspectionId=${inspection.id}&originatingFindingId=${finding.id}&description=${encodeURIComponent(finding.description)}&locationOfFailure=${encodeURIComponent((inspection.areaIds || []).join(','))}&staffWhoIdentifiedFailure=${encodeURIComponent(inspection.inspector)}`}>
                                                    <FilePlus className="mr-2 h-4 w-4" />
                                                    {t.createDnfFromFinding}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>

                                    {finding.images && finding.images.length > 0 && (
                                    <div className="mt-2">
                                    <p className="font-medium text-sm mb-1">{t.imagesLabel}:</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {finding.images.map(img => (
                                        <div key={img.id} className="relative aspect-video group">
                                            <Image src={img.url} alt={img.name} fill objectFit="cover" className="rounded" data-ai-hint={img['data-ai-hint'] || 'inspection image'} />
                                        </div>
                                        ))}
                                    </div>
                                    </div>
                                )}
                                </Card>
                            ))}
                            </div>
                        )}
                    </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground">{t.noChecklistItems}</p>
                )}
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t.schedulingDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/><span><strong>{t.scheduledStart}:</strong> {scheduledStartDateFormatted}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/><span><strong>{t.scheduledFinish}:</strong> {scheduledFinishDateFormatted}</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/><span><strong>{t.estimatedDuration}:</strong> {inspection.estimatedDurationHours || 'N/A'} {inspection.estimatedDurationHours ? t.hours : ''}</span></div>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <ThumbsUp className="mr-2 h-5 w-5 text-primary" />
                    {t.approvalTitle}
                </CardTitle>
                <CardDescription>
                    {t.approvalDescription}
                </CardDescription>
                </CardHeader>
                <CardContent>
                {canManageInspectionStatus ? (
                    <div className="space-y-4">
                    <div>
                        <Label htmlFor="newInspectionStatusSelect">{t.selectNewStatus}</Label>
                        <Select
                            value={selectedNewStatus}
                            onValueChange={(value) => setSelectedNewStatus(value as InspectionStatus)}
                            disabled={!canInteractWithApprovalForm}
                        >
                            <SelectTrigger id="newInspectionStatusSelect" className="mt-1 w-full">
                                <SelectValue placeholder={t.selectNewStatus} />
                            </SelectTrigger>
                            <SelectContent>
                            {INSPECTION_STATUSES.map(statusValue => (
                                <SelectItem key={statusValue} value={statusValue}>
                                    {statusValue}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="approvalCommentsTextarea">{t.commentsPlaceholder}</Label>
                        <Textarea
                            id="approvalCommentsTextarea"
                            placeholder={t.commentsPlaceholder}
                            className="mt-1"
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            disabled={!canInteractWithApprovalForm}
                            rows={3}
                        />
                    </div>
                    
                    {canInteractWithApprovalForm && (
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveStatusAndComments}
                                disabled={!selectedNewStatus || (inspection && selectedNewStatus === inspection.status)}
                            >
                                <Save className="mr-2 h-4 w-4" /> {t.saveStatusAndComments}
                            </Button>
                        </div>
                    )}
                    {!canInteractWithApprovalForm && (
                        <p className="text-sm text-muted-foreground italic">{t.inspectionLockedMessage}</p>
                    )}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">
                    {locale === 'vi' ? 'Bạn không có quyền thực hiện đánh giá và phê duyệt.' : 'You do not have permission to perform review and approval actions.'}
                    </p>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
