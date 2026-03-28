
import { getHazardById } from "@/lib/actions/hazard.actions";
import { getSubsystems, getResponsibleUnits, getLocations } from "@/lib/actions/category.actions";
import { 
    HAZARD_RISK_LEVELS, 
    HAZARD_SEVERITY_LEVELS, 
    HAZARD_LIKELIHOOD_LEVELS 
} from "@/lib/constants";
import { type Locale } from "@/lib/types";
import { AlertTriangle, Calendar, MapPin, User, CheckSquare, Target, Construction, Users, FileText, Lightbulb } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HazardReportPageProps {
  params: {
    id: string;
  };
}

const translations = {
    vi: {
        reportTitle: "BÁO CÁO PHIẾU GHI NHẬN MỐI NGUY",
        hazardId: "Mã số Mối nguy",
        status: "Trạng thái",
        date: "Ngày",
        part1: "Phần 1: Nhận dạng Mối nguy",
        description: "Mô tả Mối nguy",
        systemGroup: "Nhóm Hệ thống",
        location: "Vị trí",
        identifiedBy: "Người phát hiện",
        identificationDate: "Ngày phát hiện",
        source: "Nguồn gốc/Nguyên nhân Tiềm ẩn",
        potentialConsequence: "Hậu quả Tiềm ẩn",
        part2: "Phần 2: Đánh giá Rủi ro",
        severity: "Mức độ Nghiêm trọng",
        likelihood: "Khả năng xảy ra",
        riskLevel: "Mức độ Rủi ro",
        part3: "Phần 3: Biện pháp Kiểm soát & Xử lý",
        currentControls: "Biện pháp kiểm soát chính",
        proposedActions: "Biện pháp kiểm soát bổ sung",
        suggestedActions: "Biện pháp đề xuất (chưa thực hiện)",
        responsibleLeadUnit: "Đơn vị chịu trách nhiệm chủ trì",
        coordinatingUnits: "Đơn vị phối hợp",
        dueDate: "Ngày dự kiến hoàn thành",
        part4: "Phần 4: Thông tin Hoàn thành",
        closureDetails: "Chi tiết Đóng/Hoàn thành",
        verificationDetails: "Chi tiết Xác minh",
        footerApprovedBy: "Phê duyệt bởi",
        footerSignature: "Chữ ký",
        footerDate: "Ngày",
        notFound: "Không tìm thấy báo cáo mối nguy.",
    },
    en: {
        reportTitle: "HAZARD RECORD REPORT",
        hazardId: "Hazard ID",
        status: "Status",
        date: "Date",
        part1: "Part 1: Hazard Identification",
        description: "Hazard Description",
        systemGroup: "System Group",
        location: "Location",
        identifiedBy: "Identified By",
        identificationDate: "Identification Date",
        source: "Source/Potential Cause",
        potentialConsequence: "Potential Consequence",
        part2: "Part 2: Risk Assessment",
        severity: "Severity Level",
        likelihood: "Likelihood Level",
        riskLevel: "Risk Level",
        part3: "Part 3: Control & Mitigation Measures",
        currentControls: "Primary Control Measures",
        proposedActions: "Secondary Control Measures",
        suggestedActions: "Proposed Measures (not yet implemented)",
        responsibleLeadUnit: "Lead Responsible Unit",
        coordinatingUnits: "Coordinating Units",
        dueDate: "Due Date",
        part4: "Part 4: Closure Information",
        closureDetails: "Closure Details",
        verificationDetails: "Verification Details",
        footerApprovedBy: "Approved By",
        footerSignature: "Signature",
        footerDate: "Date",
        notFound: "Hazard report not found.",
    }
};


export default async function HazardReportPage({ params }: HazardReportPageProps) {
  const { id } = params;
  
  // Forcing locale to 'vi' as the document is specified in Vietnamese.
  const locale: Locale = 'vi';
  const t = translations[locale];

  const [hazardData, subsystems, responsibleUnits, locations] = await Promise.all([
    getHazardById(id),
    getSubsystems(),
    getResponsibleUnits(),
    getLocations(),
  ]);

  if (!hazardData) {
    return (
      <div className="container mx-auto p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.notFound}</h1>
      </div>
    );
  }
  
  const severityInfo = HAZARD_SEVERITY_LEVELS.find(s => s.id === hazardData.severityId);
  const likelihoodInfo = HAZARD_LIKELIHOOD_LEVELS.find(l => l.id === hazardData.likelihoodId);
  const riskLevelInfo = HAZARD_RISK_LEVELS.find(r => r.id === hazardData.riskLevelId);
  const systemGroupLabel = subsystems.find(s => s.id === hazardData.systemGroup)?.label[locale] || hazardData.systemGroup;
  const locationLabels = (hazardData.locationIds || []).map(id => locations.find(l => l.id === id)?.label || id).join(', ');
  const coordinatingUnitsLabels = (hazardData.coordinatingUnits || []).map(name => responsibleUnits.find(u => u.name === name)?.name || name).join(', ');
  
  return (
    <div className="bg-white text-black p-8 font-sans text-sm">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase">{t.reportTitle}</h1>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-6 text-sm border-b pb-4">
        <div><strong>{t.hazardId}:</strong> {hazardData.id}</div>
        <div><strong>{t.status}:</strong> {hazardData.status}</div>
        <div><strong>{t.date}:</strong> {new Date(hazardData.identificationDate).toLocaleDateString(locale)}</div>
      </div>

      <main className="space-y-6">
        {/* Part 1 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-black mb-3 pb-1">{t.part1}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div className="col-span-2">
                <p><strong>{t.description}:</strong> {hazardData.description}</p>
            </div>
            <p><strong>{t.systemGroup}:</strong> {systemGroupLabel}</p>
            <p><strong>{t.location}:</strong> {locationLabels}</p>
            <p><strong>{t.identifiedBy}:</strong> {hazardData.identifiedBy}</p>
            <p><strong>{t.identificationDate}:</strong> {new Date(hazardData.identificationDate).toLocaleDateString(locale)}</p>
            <div className="col-span-2">
              <p><strong>{t.source}:</strong> {hazardData.source || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p><strong>{t.potentialConsequence}:</strong> {hazardData.potentialConsequence || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Part 2 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-black mb-3 pb-1">{t.part2}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3">
            <div>
              <p><strong>{t.severity}:</strong> {severityInfo?.label[locale] || 'N/A'}</p>
              <p className="text-xs text-gray-600">{severityInfo?.description[locale]}</p>
            </div>
            <div>
              <p><strong>{t.likelihood}:</strong> {likelihoodInfo?.label[locale] || 'N/A'}</p>
              <p className="text-xs text-gray-600">{likelihoodInfo?.description[locale]}</p>
            </div>
             <div>
              <p><strong>{t.riskLevel}:</strong> {riskLevelInfo?.label[locale] || 'N/A'}</p>
              <p className="text-xs text-gray-600">{riskLevelInfo?.description[locale]}</p>
            </div>
          </div>
        </section>

        {/* Part 3 */}
        <section>
          <h2 className="text-lg font-bold border-b-2 border-black mb-3 pb-1">{t.part3}</h2>
          <div className="space-y-3">
            <p><strong>{t.currentControls}:</strong> {hazardData.currentControls || 'N/A'}</p>
            <p><strong>{t.proposedActions}:</strong> {hazardData.proposedActions || 'N/A'}</p>
            <p><strong>{t.suggestedActions}:</strong> {hazardData.suggestedActions || 'N/A'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
                <p><strong>{t.responsibleLeadUnit}:</strong> {hazardData.responsiblePersonOrUnit || 'N/A'}</p>
                <p><strong>{t.coordinatingUnits}:</strong> {coordinatingUnitsLabels || 'N/A'}</p>
                <p><strong>{t.dueDate}:</strong> {hazardData.dueDate ? new Date(hazardData.dueDate).toLocaleDateString(locale) : 'N/A'}</p>
            </div>
          </div>
        </section>
        
        {/* Part 4 */}
        {(hazardData.closureDetails || hazardData.verificationDetails) && (
            <section>
                <h2 className="text-lg font-bold border-b-2 border-black mb-3 pb-1">{t.part4}</h2>
                 <div className="space-y-3">
                    <p><strong>{t.closureDetails}:</strong> {hazardData.closureDetails || 'N/A'}</p>
                    <p><strong>{t.verificationDetails}:</strong> {hazardData.verificationDetails || 'N/A'}</p>
                </div>
            </section>
        )}

      </main>
      
      <footer className="mt-16 pt-8">
        <div className="grid grid-cols-3 gap-8 text-center">
            <div>
                <p className="font-bold">{t.footerApprovedBy}</p>
                <div className="mt-16 border-b border-gray-400"></div>
            </div>
             <div>
                <p className="font-bold">{t.footerSignature}</p>
                <div className="mt-16 border-b border-gray-400"></div>
            </div>
             <div>
                <p className="font-bold">{t.footerDate}</p>
                <div className="mt-16 border-b border-gray-400"></div>
            </div>
        </div>
      </footer>
    </div>
  );
}
