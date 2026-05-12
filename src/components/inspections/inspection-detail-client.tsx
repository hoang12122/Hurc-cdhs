
"use client";

import * as React from 'react';
import { useEffect, useState } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    ArrowLeft, Edit, Printer, Wrench, MapPin, CheckCircle, XCircle, MinusCircle, 
    AlertTriangle, Save, Calendar, Clock, ThumbsUp, ClipboardCheck, History,
    FilePlus, CheckSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
    SEVERITY_LEVELS, type InspectionDetail as AppInspectionDetail, FINDING_TYPES, 
    MOCK_CURRENT_USER, ROLE_ADMIN_PKTAT, ROLE_L3_SPECIALIST, 
    type InspectionStatus, 
    type MaintenanceStandard, type PatrolLocation,
    INSPECTION_STATUS_TRANSITIONS,
    type UserRole
} from "@/lib/constants"; 
import { updateInspection } from "@/lib/actions/inspection.actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/language-context';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast"; 
import { Label } from '@/components/ui/label';
import { useNetwork } from '@/components/providers/network-provider';
import { offlineSync } from '@/lib/services/offline-sync';
import { cn } from '@/lib/utils';
import { ReportLayout } from '@/components/shared/report-layout';

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
    approvalDescription: "Thực hiện các bước trong quy trình phê duyệt kiểm tra (5 bước).",
    selectNewStatus: "Chọn trạng thái mới",
    saveStatusAndComments: "Lưu Trạng thái & Ý kiến",
    statusUpdateSuccess: "Đã cập nhật trạng thái kiểm tra thành công.",
    statusUpdateFailed: "Chuyển trạng thái không hợp lệ hoặc thiếu quyền.",
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
    areaLabel: "Khu vực kiểm tra",
    workflowTitle: "Quy trình Phê duyệt",
    btnIdentify: "Bắt đầu Đánh giá",
    btnAnalyze: "Tiếp nhận Xử lý",
    btnResolve: "Gửi Phản hồi",
    btnClose: "Phê duyệt & Đóng",
    statusHistory: "Lịch sử Trạng thái",
    statusChangeDetails: (to: string, by: string, time: string) => `Chuyển thành '${to}' bởi ${by} lúc ${time}`,
    reportSubtitle: "BÁO CÁO KẾT QUẢ KIỂM TRA ĐỊNH KỲ (INSPECTION)",
    identificationDate: "Ngày phát hiện",
    location: "Vị trí"
  },
  en: {
    titleBase: "Inspection Details",
    print: "Export Report (PDF)",
    reportSubtitle: "PERIODIC INSPECTION REPORT",
    identificationDate: "Identification Date",
    location: "Location"
  }
};

interface InspectionDetailClientProps {
    initialInspection: AppInspectionDetail;
    maintenanceStandards: MaintenanceStandard[];
    locations: PatrolLocation[];
}

export function InspectionDetailClient({ initialInspection, maintenanceStandards, locations }: InspectionDetailClientProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = translations[locale as 'vi'] || translations.vi;
  const { toast } = useToast(); 
  const { isOnline } = useNetwork();
  
  const [inspection, setInspection] = useState<AppInspectionDetail>(initialInspection);
  const [approvalComments, setApprovalComments] = useState(initialInspection.approvalComments || ""); 
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const canTransitionToStatus = React.useCallback((currentStatus: InspectionStatus, newStatus: InspectionStatus, userRole: UserRole): boolean => {
      if (userRole === ROLE_ADMIN_PKTAT) return true;
      const transitionRule = INSPECTION_STATUS_TRANSITIONS[currentStatus];
      if (!transitionRule) return false;
      
      if (transitionRule.roles) {
          const allowedForRole = transitionRule.roles[userRole];
          if (allowedForRole) {
              return allowedForRole.includes(newStatus);
          }
      }
      return transitionRule.next.includes(newStatus);
  }, []);

  const handleStatusUpdate = async (newStatus: InspectionStatus) => {
    if (!inspection) return;

    if (!canTransitionToStatus(inspection.status as InspectionStatus, newStatus, MOCK_CURRENT_USER.role)) {
        toast({ title: "Lỗi", description: t.statusUpdateFailed, variant: "destructive"});
        return;
    }

    const updatedInspectionData: AppInspectionDetail = {
        ...inspection,
        status: newStatus,
        approvalComments: approvalComments,
        lastStatusUpdateBy: MOCK_CURRENT_USER.id,
        lastStatusUpdateAt: new Date().toISOString(),
    };
    
    if (!isOnline) {
        await offlineSync.addAction({
            type: 'STATUS_UPDATE',
            entityType: 'INSPECTION',
            data: updatedInspectionData
        });
        setInspection(updatedInspectionData);
        toast({ title: "Đã lưu ngoại tuyến", description: "Trạng thái sẽ được cập nhật khi có mạng." });
        return;
    }

    await updateInspection(updatedInspectionData); 
    setInspection(updatedInspectionData); 
    toast({ title: "Thành công", description: t.statusUpdateSuccess });
  };

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
    
    return (
        <Badge 
            variant="outline"
            className={cn("text-white font-medium", 
                level.id === 'S1' ? "bg-red-600" :
                level.id === 'S2' ? "bg-orange-500" :
                level.id === 'S3' ? "bg-yellow-500" :
                "bg-blue-500"
            )}
        >
            {level.label}
        </Badge>
    );
  };

  const getFindingTypeDisplay = (typeId?: string) => {
    if(!typeId) return t.unknownType;
    const findingType = FINDING_TYPES.find(ft => ft.id === typeId);
    return findingType ? findingType.label : typeId;
  };

  const templateName = maintenanceStandards.find(
    (tmpl) => tmpl.id === inspection.checklistTemplateId
  )?.name || inspection.checklistTemplateId || t.notApplicable;
  
  const inspectionDateFormatted = isMounted ? new Date(inspection.date).toLocaleDateString(locale) : '...';
  const locationLabels = (inspection.areaIds || []).map(id => locations.find(l => l.id === id)?.label || id).join(', ');

  const renderWorkflowActions = () => {
    const currentStatus = inspection.status as InspectionStatus;
    
    switch (currentStatus) {
      case 'Mới':
        return <Button onClick={() => handleStatusUpdate('Đánh giá')}><CheckSquare className="mr-2 h-4 w-4" />{t.btnIdentify}</Button>;
      case 'Đánh giá':
        return <Button onClick={() => handleStatusUpdate('Xử lý')}><Wrench className="mr-2 h-4 w-4" />{t.btnAnalyze}</Button>;
      case 'Xử lý':
        return <Button onClick={() => handleStatusUpdate('Phản hồi')}><ClipboardCheck className="mr-2 h-4 w-4" />{t.btnResolve}</Button>;
      case 'Phản hồi':
        return <Button onClick={() => handleStatusUpdate('Đóng')}><CheckCircle className="mr-2 h-4 w-4" />{t.btnClose}</Button>;
      default:
        return <p className="text-sm text-muted-foreground italic">Hoàn thành quy trình.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
        <div className="flex gap-2">
           <Button variant="outline" asChild>
            <Link href={`/inspections/${inspection.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> {t.edit}
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="no-print">
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
                    <CardTitle className="text-2xl font-headline text-primary flex items-center gap-2">
                        <ClipboardCheck className="h-7 w-7" />
                        {inspection.title}
                    </CardTitle>
                    <CardDescription>ID: {inspection.id} - {inspectionDateFormatted}</CardDescription>
                    </div>
                    <Badge variant={inspection.status === "Đóng" ? "default" : "secondary"} className="px-3 py-1 text-sm">{inspection.status}</Badge>
                </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <p><strong>{t.inspectorLabel}:</strong> {inspection.inspector}</p>
                        <p><strong>{t.templateLabel}:</strong> {templateName}</p>
                        <p className="md:col-span-2"><strong>{t.areaLabel}:</strong> {locationLabels}</p>
                    </div>
                    <Separator />
                    <div>
                        <p className="font-semibold mb-1">{t.generalNotesLabel}:</p>
                        <p className="text-muted-foreground">{inspection.generalNotes || t.noGeneralNotes}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>{t.checklistTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {inspection.checklistItems && inspection.checklistItems.length > 0 ? (
                    inspection.checklistItems.map((item) => (
                    <Card key={item.id} className={cn("p-4 border-l-4", 
                        item.status === 'pass' ? 'border-l-green-500' : 
                        item.status === 'fail' ? 'border-l-destructive' : 
                        'border-l-muted'
                    )}>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <p className="font-semibold">{item.text} ({item.id})</p>
                                {item.criteria && <p className="text-xs text-muted-foreground mt-1">{t.criteriaLabel}: {item.criteria}</p>}
                            </div>
                            <div className="flex-shrink-0">
                                {getChecklistItemStatusBadge(item.status)}
                            </div>
                        </div>

                        {item.findings && item.findings.length > 0 && (
                            <div className="mt-3 ml-4 space-y-3">
                            {item.findings.map(finding => (
                                <Card key={finding.id} className="p-3 bg-muted/30 shadow-sm border-dashed">
                                    <p className="text-sm font-medium"><strong>{t.findingLabel} ({finding.id}):</strong> {finding.description}</p>
                                    <div className="flex items-center mt-2 gap-4 text-xs">
                                        <div className="flex items-center">
                                            <strong className="mr-1">{t.severityLabel}:</strong> {getSeverityDisplay(finding.severity)}
                                        </div>
                                        <p><strong>{t.typeLabel}:</strong> {getFindingTypeDisplay(finding.type)}</p>
                                    </div>
                                    <p className="text-xs mt-2 italic text-muted-foreground"><strong>{t.recommendationLabel}:</strong> {finding.recommendation || t.notApplicable}</p>
                                    
                                    <div className="mt-3">
                                        {finding.linkedDnfId ? (
                                            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                                                <Link href={`/dnf/${finding.linkedDnfId}`}>{t.relatedDnfLabel}: {finding.linkedDnfId}</Link>
                                            </Badge>
                                        ) : (
                                            <Button size="sm" variant="outline" className="h-8 text-xs font-normal" asChild>
                                                <Link href={`/dnf/new?originatingInspectionId=${inspection.id}&originatingFindingId=${finding.id}&description=${encodeURIComponent(finding.description)}&locationOfFailure=${encodeURIComponent((inspection.areaIds || []).join(','))}&staffWhoIdentifiedFailure=${encodeURIComponent(inspection.inspector)}`}>
                                                    <FilePlus className="mr-1.5 h-3.5 w-3.5" />
                                                    {t.createDnfFromFinding}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                            </div>
                        )}
                    </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground text-center py-8">{t.noChecklistItems}</p>
                )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-primary/20">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary" />
                    {t.workflowTitle}
                </CardTitle>
                <CardDescription>
                    {t.approvalDescription}
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="approvalCommentsTextarea">{t.commentsPlaceholder}</Label>
                        <Textarea
                            id="approvalCommentsTextarea"
                            placeholder={t.commentsPlaceholder}
                            className="mt-1.5 min-h-[100px]"
                            value={approvalComments}
                            onChange={(e) => setApprovalComments(e.target.value)}
                            rows={4}
                        />
                    </div>
                    
                    <div className="pt-2">
                        {renderWorkflowActions()}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5 text-muted-foreground" />
                        {t.statusHistory}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>{t.statusChangeDetails(inspection.status, inspection.lastStatusUpdateBy || 'System', isMounted ? new Date(inspection.lastStatusUpdateAt || inspection.date).toLocaleString(locale) : '...')}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* ============ PRINT REPORT LAYOUT ============ */}
      <ReportLayout 
        title={`${t.titleBase} #${inspection.id}`} 
        documentId={inspection.id}
        subtitle={t.reportSubtitle}
      >
        <div className="space-y-6">
            <table className="w-full border-collapse border border-black text-black bg-white">
                <tbody>
                    <tr>
                        <th className="w-1/4 bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.templateLabel}</th>
                        <td className="w-1/4 p-2 border border-black font-bold text-primary">{templateName}</td>
                        <th className="w-1/4 bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.inspectorLabel}</th>
                        <td className="w-1/4 p-2 border border-black">{inspection.inspector || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.identificationDate}</th>
                        <td className="p-2 border border-black">{inspectionDateFormatted}</td>
                        <th className="bg-gray-100 p-2 border border-black font-bold uppercase text-[10px]">{t.location}</th>
                        <td className="p-2 border border-black">{locationLabels || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>

            <div className="no-break border border-black p-4 rounded-sm mt-4">
                <h3 className="font-bold border-b border-black pb-1 mb-2 uppercase text-xs">{t.generalNotesLabel}</h3>
                <p className="text-sm whitespace-pre-wrap">{inspection.generalNotes || t.noGeneralNotes}</p>
            </div>

            <div className="mt-8">
                <h3 className="font-bold border-b-2 border-primary pb-1 mb-4 uppercase text-sm">{t.checklistTitle}</h3>
                <table className="w-full border-collapse border border-black text-black bg-white">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-2 border border-black w-8">#</th>
                            <th className="p-2 border border-black">{t.criteriaLabel}</th>
                            <th className="p-2 border border-black w-24">Kết quả</th>
                            <th className="p-2 border border-black w-48">{t.findingLabel}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspection.checklistItems?.map((item, idx) => (
                            <tr key={idx} className="no-break">
                                <td className="p-2 border border-black text-center">{idx + 1}</td>
                                <td className="p-2 border border-black text-xs">{item.criteria}</td>
                                <td className={`p-2 border border-black text-center font-bold text-xs ${item.status === 'pass' ? 'text-green-600' : item.status === 'fail' ? 'text-red-600' : 'text-gray-400'}`}>
                                    {item.status === 'pass' ? t.statusPass : item.status === 'fail' ? t.statusFail : t.statusPending}
                                </td>
                                <td className="p-2 border border-black text-xs italic">
                                    {Array.isArray(item.findings) 
                                        ? item.findings.map(f => f.description).join(', ') 
                                        : (item.findings || '-')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="signature-section pt-10 mt-auto">
                <div className="signature-box flex-1 border border-transparent">
                    <p className="font-bold">Người thực hiện</p>
                    <p className="text-[10px] text-muted-foreground italic">(Ký và ghi rõ họ tên)</p>
                    <div className="signature-space h-20"></div>
                    <p className="mt-4 border-t border-dotted border-black pt-1">..........................................</p>
                </div>
                
                <div className="signature-box flex-1 border border-transparent">
                    <p className="font-bold">Đơn vị quản lý</p>
                    <p className="text-[10px] text-muted-foreground italic">(Xác nhận chuyên môn)</p>
                    <div className="signature-space h-20"></div>
                    <p className="mt-4 border-t border-dotted border-black pt-1">..........................................</p>
                </div>
            </div>
        </div>
      </ReportLayout>
    </div>
  );
}
