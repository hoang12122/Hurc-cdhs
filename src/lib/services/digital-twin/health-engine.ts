export type TwinHealthBand = 'HEALTHY' | 'WATCH' | 'DEGRADED' | 'CRITICAL';
export type TwinTrend = 'IMPROVING' | 'STABLE' | 'DECLINING' | 'UNKNOWN';

export interface TwinHealthSignals {
  openDnfs: number;
  criticalDnfs: number;
  overdueDnfs: number;
  openHazards: number;
  criticalHazards: number;
  inspectionFindings: number;
  telemetryAgeMinutes: number | null;
  telemetryErrorRatio: number | null;
  anomalyScore: number | null;
  dataCompleteness: number;
  maintenanceOverdue: boolean;
  previousScore?: number | null;
}

export interface TwinHealthFactor {
  code: string;
  label: string;
  penalty: number;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface TwinHealthResult {
  score: number;
  band: TwinHealthBand;
  trend: TwinTrend;
  confidence: number;
  factors: TwinHealthFactor[];
  recommendations: string[];
  calculatedAt: string;
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const ratio = (value: number | null) => value === null ? null : clamp(value, 0, 1);

function freshnessPenalty(ageMinutes: number | null): number {
  if (ageMinutes === null) return 10;
  if (ageMinutes <= 5) return 0;
  if (ageMinutes <= 15) return 3;
  if (ageMinutes <= 60) return 8;
  if (ageMinutes <= 240) return 14;
  return 22;
}

function bandFor(score: number): TwinHealthBand {
  if (score >= 85) return 'HEALTHY';
  if (score >= 70) return 'WATCH';
  if (score >= 45) return 'DEGRADED';
  return 'CRITICAL';
}

function trendFor(score: number, previousScore?: number | null): TwinTrend {
  if (previousScore === undefined || previousScore === null) return 'UNKNOWN';
  const delta = score - previousScore;
  if (delta >= 4) return 'IMPROVING';
  if (delta <= -4) return 'DECLINING';
  return 'STABLE';
}

function factor(code: string, label: string, penalty: number): TwinHealthFactor | null {
  const rounded = Math.round(Math.max(0, penalty) * 10) / 10;
  if (rounded <= 0) return null;
  return {
    code,
    label,
    penalty: rounded,
    severity: rounded >= 15 ? 'CRITICAL' : rounded >= 6 ? 'WARNING' : 'INFO',
  };
}

export function calculateTwinHealth(signals: TwinHealthSignals): TwinHealthResult {
  const errorRatio = ratio(signals.telemetryErrorRatio);
  const anomaly = ratio(signals.anomalyScore);
  const completeness = ratio(signals.dataCompleteness) ?? 0;

  const factors = [
    factor(
      'DNF_OPEN',
      'Sự cố DNF chưa đóng',
      Math.min(34, signals.openDnfs * 2.5 + signals.criticalDnfs * 7 + signals.overdueDnfs * 3.5),
    ),
    factor(
      'HAZARD_OPEN',
      'Mối nguy đang mở',
      Math.min(34, signals.openHazards * 3 + signals.criticalHazards * 9),
    ),
    factor(
      'INSPECTION_FINDINGS',
      'Phát hiện kiểm tra chưa xử lý',
      Math.min(12, signals.inspectionFindings * 1.8),
    ),
    factor(
      'TELEMETRY_STALE',
      'Dữ liệu telemetry chậm hoặc chưa có',
      freshnessPenalty(signals.telemetryAgeMinutes),
    ),
    factor(
      'TELEMETRY_QUALITY',
      'Tỷ lệ dữ liệu telemetry lỗi',
      errorRatio === null ? 5 : errorRatio * 18,
    ),
    factor(
      'ANOMALY',
      'Bất thường thiết bị',
      anomaly === null ? 0 : anomaly * 22,
    ),
    factor(
      'MAINTENANCE_OVERDUE',
      'Bảo trì quá hạn',
      signals.maintenanceOverdue ? 10 : 0,
    ),
    factor(
      'DATA_INCOMPLETE',
      'Thiếu dữ liệu để đánh giá',
      (1 - completeness) * 10,
    ),
  ].filter((item): item is TwinHealthFactor => Boolean(item));

  const totalPenalty = factors.reduce((sum, item) => sum + item.penalty, 0);
  const score = Math.round(clamp(100 - totalPenalty));
  const sourceCoverage = [
    signals.telemetryAgeMinutes !== null,
    signals.telemetryErrorRatio !== null,
    signals.anomalyScore !== null,
    signals.openDnfs + signals.openHazards + signals.inspectionFindings > 0,
  ].filter(Boolean).length / 4;
  const confidence = Math.round(clamp(35 + completeness * 45 + sourceCoverage * 20));

  const recommendations: string[] = [];
  if (signals.criticalHazards > 0) recommendations.push('Ưu tiên đánh giá và kiểm soát mối nguy nghiêm trọng.');
  if (signals.criticalDnfs > 0) recommendations.push('Phân công xử lý DNF mức cao và xác nhận thời gian khôi phục.');
  if (signals.telemetryAgeMinutes === null || signals.telemetryAgeMinutes > 60) {
    recommendations.push('Kiểm tra gateway, nguồn cấp, đồng bộ thời gian và kết nối telemetry.');
  }
  if ((errorRatio ?? 0) >= 0.1) recommendations.push('Rà soát chất lượng cảm biến và quy tắc chuẩn hóa dữ liệu.');
  if ((anomaly ?? 0) >= 0.6) recommendations.push('Tạo phiên điều tra có người phê duyệt từ tín hiệu bất thường.');
  if (signals.maintenanceOverdue) recommendations.push('Lập kế hoạch bảo trì bù và đánh giá rủi ro trì hoãn.');
  if (recommendations.length === 0) recommendations.push('Tiếp tục giám sát theo chu kỳ và duy trì chất lượng dữ liệu.');

  return {
    score,
    band: bandFor(score),
    trend: trendFor(score, signals.previousScore),
    confidence,
    factors: factors.sort((a, b) => b.penalty - a.penalty),
    recommendations,
    calculatedAt: new Date().toISOString(),
  };
}
