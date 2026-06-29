"use client";

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, CheckSquare, ClipboardCheck, Edit, History, MinusCircle, Printer, ThumbsUp, Wrench, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import {
  FINDING_TYPES,
  SEVERITY_LEVELS,
  type InspectionDetail as AppInspectionDetail,
  type InspectionStatus,
  type MaintenanceStandard,
  type PatrolLocation,
} from '@/lib/constants';
import { CreateDnfFromFindingEventButton } from '@/components/inspections/create-dnf-from-finding-event-button';
import { useInspectionDetailWorkflow } from '@/components/inspections/use-inspection-detail-workflow';

const t = {
  backToList: 'Quay lại danh sách',
  edit: 'Chỉnh sửa',
  print: 'Xuất Báo Cáo (PDF)',
  inspectorLabel: 'Người kiểm tra',
  templateLabel: 'Mẫu Checklist',
  generalNotesLabel: 'Ghi chú chung',
  noGeneralNotes: 'Không có ghi chú chung nào.',
  checklistTitle: 'Chi tiết Checklist và Phát hiện',
  noChecklistItems: 'Không có hạng mục checklist nào cho kiểm tra này.',
  statusPass: 'Đạt',
  statusFail: 'Không đạt',
  statusPending: 'Chưa kiểm tra',
  criteriaLabel: 'Tiêu chí',
  findingLabel: 'Phát hiện',
  severityLabel: 'Mức độ',
  typeLabel: 'Phân loại',
  relatedDnfLabel: 'Khiếm khuyết (DNF) liên quan',
  createDnfFromFinding: 'Tạo DNF từ Phát hiện',
  recommendationLabel: 'Đề xuất',
  notApplicable: 'N/A',
  approvalDescription: 'Thực hiện các bước trong quy trình phê duyệt kiểm tra.',
  statusUpdateSuccess: 'Đã cập nhật trạng thái kiểm tra thành công.',
  statusUpdateFailed: 'Chuyển trạng thái không hợp lệ hoặc thiếu quyền.',
  commentsPlaceholder: 'Nhập ý kiến đánh giá...',
  unknownSeverity: 'Không xác định',
  unknownType: 'Không xác định',
  areaLabel: 'Khu vực kiểm tra',
  workflowTitle: 'Quy trình Phê duyệt',
  btnIdentify: 'Bắt đầu Đánh giá',
  btnAnalyze: 'Tiếp nhận Xử lý',
  btnResolve: 'Gửi Phản hồi',
  btnClose: 'Phê duyệt & Đóng',
  statusHistory: 'Lịch sử Trạng thái',
  statusChangeDetails: (to: string, by: string, time: string) => `Chuyển thành '${to}' bởi ${by} lúc ${time}`,
};

interface InspectionDetailClientProps {
  initialInspection: AppInspectionDetail;
  maintenanceStandards: MaintenanceStandard[];
  locations: PatrolLocation[];
}

export function InspectionDetailClient({ initialInspection, maintenanceStandards, locations }: InspectionDetailClientProps) {
  const { locale } = useLanguage();
  const { inspection, approvalComments, setApprovalComments, isMounted, handleStatusUpdate } = useInspectionDetailWorkflow({
    initialInspection,
    statusUpdateFailedMessage: t.statusUpdateFailed,
    statusUpdateSuccessMessage: t.statusUpdateSuccess,
  });

  const templateName = maintenanceStandards.find((item) => item.id === inspection.checklistTemplateId)?.name || inspection.checklistTemplateId || t.notApplicable;
  const inspectionDateFormatted = isMounted ? new Date(inspection.date).toLocaleDateString(locale) : '...';
  const locationLabels = (inspection.areaIds || []).map((id) => locations.find((location) => location.id === id)?.label || id).join(', ');

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
      <InspectionHeader inspectionId={inspection.id} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InspectionSummaryCard inspection={inspection} templateName={templateName} locationLabels={locationLabels} inspectionDateFormatted={inspectionDateFormatted} />
          <ChecklistFindingsCard inspection={inspection} />
        </div>
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ThumbsUp className="h-5 w-5 text-primary" />{t.workflowTitle}</CardTitle>
              <CardDescription>{t.approvalDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="approvalCommentsTextarea">{t.commentsPlaceholder}</Label>
                <Textarea id="approvalCommentsTextarea" className="mt-1.5 min-h-[100px]" value={approvalComments} onChange={(event) => setApprovalComments(event.target.value)} rows={4} />
              </div>
              <div className="pt-2">{renderWorkflowActions()}</div>
            </CardContent>
          </Card>
          <StatusHistoryCard inspection={inspection} isMounted={isMounted} locale={locale} />
        </div>
      </div>
    </div>
  );
}

function InspectionHeader({ inspectionId }: { inspectionId: string }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" asChild><Link href="/inspections"><ArrowLeft className="mr-2 h-4 w-4" />{t.backToList}</Link></Button>
      <div className="flex gap-2">
        <Button variant="outline" asChild><Link href={`/inspections/${inspectionId}/edit`}><Edit className="mr-2 h-4 w-4" />{t.edit}</Link></Button>
        <Button variant="outline" onClick={() => window.print()} className="no-print"><Printer className="mr-2 h-4 w-4" />{t.print}</Button>
      </div>
    </div>
  );
}

function InspectionSummaryCard({ inspection, templateName, locationLabels, inspectionDateFormatted }: { inspection: AppInspectionDetail; templateName: string; locationLabels: string; inspectionDateFormatted: string }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary"><ClipboardCheck className="h-7 w-7" />{inspection.title}</CardTitle>
            <CardDescription>ID: {inspection.id} - {inspectionDateFormatted}</CardDescription>
          </div>
          <Badge variant={inspection.status === 'Đóng' ? 'default' : 'secondary'} className="px-3 py-1 text-sm">{inspection.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <p><strong>{t.inspectorLabel}:</strong> {inspection.inspector}</p>
          <p><strong>{t.templateLabel}:</strong> {templateName}</p>
          <p className="md:col-span-2"><strong>{t.areaLabel}:</strong> {locationLabels}</p>
        </div>
        <Separator />
        <div>
          <p className="mb-1 font-semibold">{t.generalNotesLabel}:</p>
          <p className="text-muted-foreground">{inspection.generalNotes || t.noGeneralNotes}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistFindingsCard({ inspection }: { inspection: AppInspectionDetail }) {
  return (
    <Card>
      <CardHeader><CardTitle>{t.checklistTitle}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {inspection.checklistItems?.length ? inspection.checklistItems.map((item: any) => <ChecklistItemCard key={item.id} item={item} inspection={inspection} />) : <p className="py-8 text-center text-muted-foreground">{t.noChecklistItems}</p>}
      </CardContent>
    </Card>
  );
}

function ChecklistItemCard({ item, inspection }: { item: any; inspection: AppInspectionDetail }) {
  return (
    <Card className={cn('border-l-4 p-4', item.status === 'pass' ? 'border-l-green-500' : item.status === 'fail' ? 'border-l-destructive' : 'border-l-muted')}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{item.text} ({item.id})</p>
          {item.criteria && <p className="mt-1 text-xs text-muted-foreground">{t.criteriaLabel}: {item.criteria}</p>}
        </div>
        <div className="shrink-0">{getChecklistItemStatusBadge(item.status)}</div>
      </div>
      {Array.isArray(item.findings) && item.findings.length > 0 && <div className="ml-4 mt-3 space-y-3">{item.findings.map((finding: any) => <FindingCard key={finding.id} finding={finding} inspection={inspection} />)}</div>}
    </Card>
  );
}

function FindingCard({ finding, inspection }: { finding: any; inspection: AppInspectionDetail }) {
  return (
    <Card className="border-dashed bg-muted/30 p-3 shadow-sm">
      <p className="text-sm font-medium"><strong>{t.findingLabel} ({finding.id}):</strong> {finding.description}</p>
      <div className="mt-2 flex items-center gap-4 text-xs">
        <div className="flex items-center"><strong className="mr-1">{t.severityLabel}:</strong>{getSeverityDisplay(finding.severity)}</div>
        <p><strong>{t.typeLabel}:</strong> {getFindingTypeDisplay(finding.type)}</p>
      </div>
      <p className="mt-2 text-xs italic text-muted-foreground"><strong>{t.recommendationLabel}:</strong> {finding.recommendation || t.notApplicable}</p>
      <div className="mt-3">
        {finding.linkedDnfId ? <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-600"><Link href={`/dnf/${finding.linkedDnfId}`}>{t.relatedDnfLabel}: {finding.linkedDnfId}</Link></Badge> : <CreateDnfFromFindingEventButton inspectionId={inspection.id} findingId={finding.id} description={finding.description} locationOfFailure={(inspection.areaIds || []).join(',')} staffWhoIdentifiedFailure={inspection.inspector} subsystemId={inspection.checklistTemplateId || undefined} label={t.createDnfFromFinding} />}
      </div>
    </Card>
  );
}

function StatusHistoryCard({ inspection, isMounted, locale }: { inspection: AppInspectionDetail; isMounted: boolean; locale: string }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-muted-foreground" />{t.statusHistory}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground">{t.statusChangeDetails(inspection.status, inspection.lastStatusUpdateBy || 'System', isMounted ? new Date(inspection.lastStatusUpdateAt || inspection.date).toLocaleString(locale) : '...')}</p></CardContent>
    </Card>
  );
}

function getChecklistItemStatusBadge(status: 'pending' | 'pass' | 'fail') {
  if (status === 'pass') return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-1.5 h-3.5 w-3.5" />{t.statusPass}</Badge>;
  if (status === 'fail') return <Badge variant="destructive"><XCircle className="mr-1.5 h-3.5 w-3.5" />{t.statusFail}</Badge>;
  return <Badge variant="secondary"><MinusCircle className="mr-1.5 h-3.5 w-3.5" />{t.statusPending}</Badge>;
}

function getSeverityDisplay(severityId?: string) {
  if (!severityId) return <Badge variant="outline">{t.unknownSeverity}</Badge>;
  const level = SEVERITY_LEVELS.find((item) => item.id === severityId);
  if (!level) return <Badge variant="outline">{severityId}</Badge>;
  return <Badge variant="outline" className={cn('text-white font-medium', level.id === 'S1' ? 'bg-red-600' : level.id === 'S2' ? 'bg-orange-500' : level.id === 'S3' ? 'bg-yellow-500' : 'bg-blue-500')}>{level.label}</Badge>;
}

function getFindingTypeDisplay(typeId?: string) {
  if (!typeId) return t.unknownType;
  return FINDING_TYPES.find((item) => item.id === typeId)?.label || typeId;
}
