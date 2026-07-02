export interface FracasDemoStep {
  step: string;
  title: string;
  description: string;
  linkedModule: string;
  expectedEvidence: string;
}

export const FRACAS_DEMO_CASE_STUDY = {
  id: 'demo-psd-door-obstruction-fracas',
  title: 'Demo Case Study - PSD Door Obstruction to FRACAS Closure',
  system: 'PSD',
  location: 'Station platform area',
  summary: 'Mô phỏng một sự cố cửa PSD có nguy cơ ảnh hưởng khai thác, từ DNF đến Hazard Log, Corrective Action, RCA, RAMS/OCC highlight và đóng hồ sơ.',
  businessValue: [
    'Chứng minh workflow FRACAS end-to-end.',
    'Minh họa liên kết DNF - Hazard - RAMS - OCC.',
    'Hỗ trợ báo cáo quản lý bằng một kịch bản demo dễ hiểu.',
  ],
  steps: [
    {
      step: '1',
      title: 'Create DNF',
      description: 'Nhân viên ghi nhận sự cố cửa PSD có dấu hiệu kẹt/chậm phản hồi tại khu vực ke ga.',
      linkedModule: '/dnf',
      expectedEvidence: 'DNF record with location, subsystem, failure description and service impact.',
    },
    {
      step: '2',
      title: 'AI Hazard Screening',
      description: 'AI đọc mô tả DNF và gợi ý safety screening, hazard level, priority và human review required.',
      linkedModule: '/dnf',
      expectedEvidence: 'AI note inside impactAssessment and suggested hazard level/priority.',
    },
    {
      step: '3',
      title: 'One-click Hazard Log',
      description: 'Người dùng tạo Hazard Log từ DNF, hệ thống tự điền mô tả, hậu quả tiềm ẩn, kiểm soát ban đầu và link DNF nguồn.',
      linkedModule: '/hazards/new',
      expectedEvidence: 'Hazard linkedDnfId, description, potentialConsequence and currentControls.',
    },
    {
      step: '4',
      title: 'Corrective Action and RCA',
      description: 'Đơn vị bảo dưỡng cập nhật hành động khắc phục, thời gian chẩn đoán/sửa chữa/xác minh và nguyên nhân khả thi.',
      linkedModule: '/dnf',
      expectedEvidence: 'Corrective actions, MTTR data and RCA note.',
    },
    {
      step: '5',
      title: 'RAMS / OCC Highlight',
      description: 'RAMS engine tính service impact, MTTR, RAMS total, hotspot và predictive signal để OCC theo dõi.',
      linkedModule: '/dashboard',
      expectedEvidence: 'RAMS Trending, Hotspot, OCC Highlights and Predictive RAMS Layer.',
    },
    {
      step: '6',
      title: 'Verification and Closure',
      description: 'P.KTAT xác minh hiệu lực biện pháp, kiểm tra tái diễn và đóng hồ sơ khi đủ căn cứ.',
      linkedModule: '/fracas-risk-management',
      expectedEvidence: 'FRACAS Phase Tracker moves record to Phase 5.',
    },
  ] satisfies FracasDemoStep[],
};
