export type DomainDictionaryKey =
  | 'dnf'
  | 'hazard'
  | 'fracasRisk'
  | 'ramsOcc'
  | 'aiRecommendation'
  | 'approvalClosure'
  | 'phaseTracker'
  | 'benchmark';

export type DomainLocale = 'vi' | 'en';

export const DOMAIN_DICTIONARY: Record<DomainDictionaryKey, Record<DomainLocale, string>> = {
  dnf: { vi: 'Báo cáo sự cố / DNF', en: 'Incident / DNF' },
  hazard: { vi: 'Nhật ký mối nguy', en: 'Hazard Log' },
  fracasRisk: { vi: 'FRACAS / Quản lý rủi ro', en: 'FRACAS / Risk Management' },
  ramsOcc: { vi: 'RAMS / Điều độ OCC', en: 'RAMS / OCC Control' },
  aiRecommendation: { vi: 'Khuyến nghị AI', en: 'AI Recommendation' },
  approvalClosure: { vi: 'Phê duyệt và đóng hồ sơ', en: 'Approval and Closure' },
  phaseTracker: { vi: 'Theo dõi phase FRACAS', en: 'FRACAS Phase Tracker' },
  benchmark: { vi: 'Đối chiếu năng lực phần mềm', en: 'Software Benchmark' },
};

export function translateDomain(key: DomainDictionaryKey, locale: DomainLocale = 'vi') {
  return DOMAIN_DICTIONARY[key]?.[locale] || DOMAIN_DICTIONARY[key]?.vi || key;
}
