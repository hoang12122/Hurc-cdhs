export type DigitalTwinSeverity = 'normal' | 'watch' | 'warning' | 'critical';

export interface DigitalTwinSensor {
  id: string;
  label: string;
  value: number;
  unit: string;
  threshold: number;
  state: DigitalTwinSeverity;
  source: string;
  description: string;
}

export interface DigitalTwinThread {
  id: string;
  label: string;
  score: number;
  status: DigitalTwinSeverity;
  description: string;
}

export interface DigitalTwinSnapshot {
  twinId: string;
  assetName: string;
  assetCode: string;
  assetKind: string;
  severity: DigitalTwinSeverity;
  riskScore: number;
  healthScore: number;
  dataConfidence: number;
  failureProbability: number;
  remainingUsefulLifeDays: number | null;
  synchronizationState: 'live' | 'simulated' | 'offline';
  sensors: DigitalTwinSensor[];
  digitalThread: DigitalTwinThread[];
  recommendedActions: string[];
  operatingEnvelope: string[];
  lastUpdatedAt: string;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value !== 'string') return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeText(value: unknown) {
  return String(value || '').toLowerCase();
}

function resolveAssetKind(equipment: any) {
  const text = `${normalizeText(equipment?.category)} ${normalizeText(equipment?.name)} ${normalizeText(equipment?.code)} ${normalizeText(equipment?.subsystemId)}`;

  if (text.includes('psd') || text.includes('door') || text.includes('cửa')) return 'Platform Screen Door';
  if (text.includes('afc') || text.includes('gate') || text.includes('tvm') || text.includes('bom')) return 'AFC / Fare Collection';
  if (text.includes('power') || text.includes('ups') || text.includes('traction') || text.includes('điện')) return 'Power System';
  if (text.includes('signal') || text.includes('cbtc') || text.includes('ats')) return 'Signaling / Control';
  if (text.includes('track') || text.includes('rail') || text.includes('đường ray')) return 'Track & Civil Asset';

  return 'Metro Equipment';
}

function getSensorProfile(assetKind: string, riskScore: number, healthScore: number, dnfCount: number): DigitalTwinSensor[] {
  const drift = riskScore / 100;
  const healthDrift = (100 - healthScore) / 100;
  const eventFactor = Math.min(dnfCount, 6) / 6;

  const makeState = (value: number, threshold: number): DigitalTwinSeverity => {
    if (value >= threshold) return 'critical';
    if (value >= threshold * 0.85) return 'warning';
    if (value >= threshold * 0.65) return 'watch';
    return 'normal';
  };

  if (assetKind === 'Platform Screen Door') {
    const vibration = Number((1.8 + drift * 3.7 + eventFactor * 0.8).toFixed(2));
    const motorCurrent = Number((2.4 + healthDrift * 2.6).toFixed(2));
    const cycleTime = Number((2.2 + drift * 1.6).toFixed(2));
    const obstructionEvents = Number((eventFactor * 7 + drift * 5).toFixed(0));

    return [
      { id: 'vibration', label: 'Độ rung cụm truyền động', value: vibration, unit: 'mm/s', threshold: 4.5, state: makeState(vibration, 4.5), source: 'IoT/Vibration', description: 'Theo dõi rung bất thường tại motor, pulley và dây đai.' },
      { id: 'motor-current', label: 'Dòng motor cửa', value: motorCurrent, unit: 'A', threshold: 4.8, state: makeState(motorCurrent, 4.8), source: 'PLC/SNMP', description: 'Phản ánh tải kéo, ma sát và nguy cơ kẹt cơ khí.' },
      { id: 'cycle-time', label: 'Thời gian đóng/mở', value: cycleTime, unit: 's', threshold: 3.5, state: makeState(cycleTime, 3.5), source: 'Door Controller', description: 'So sánh thời gian chu kỳ thực tế với giới hạn vận hành.' },
      { id: 'obstruction', label: 'Sự kiện cản trở', value: obstructionEvents, unit: 'lần/ngày', threshold: 8, state: makeState(obstructionEvents, 8), source: 'DNF/Camera', description: 'Tổng hợp sự kiện kẹt, cản trở và cảnh báo an toàn.' },
    ];
  }

  if (assetKind === 'AFC / Fare Collection') {
    const cpu = Number((28 + drift * 55).toFixed(1));
    const queue = Number((1 + drift * 12 + eventFactor * 5).toFixed(0));
    const latency = Number((45 + drift * 190).toFixed(0));
    const temp = Number((38 + drift * 25).toFixed(1));

    return [
      { id: 'cpu', label: 'Tải xử lý thiết bị', value: cpu, unit: '%', threshold: 85, state: makeState(cpu, 85), source: 'Agent', description: 'Theo dõi tải xử lý, bộ nhớ và tiến trình nghiệp vụ AFC.' },
      { id: 'queue', label: 'Giao dịch chờ đồng bộ', value: queue, unit: 'giao dịch', threshold: 12, state: makeState(queue, 12), source: 'AFC Backoffice', description: 'Phát hiện nguy cơ tồn giao dịch hoặc lệch dữ liệu kết toán.' },
      { id: 'latency', label: 'Độ trễ kết nối', value: latency, unit: 'ms', threshold: 220, state: makeState(latency, 220), source: 'Network Monitor', description: 'Theo dõi đường truyền về máy chủ trung tâm.' },
      { id: 'temperature', label: 'Nhiệt độ module', value: temp, unit: '°C', threshold: 60, state: makeState(temp, 60), source: 'IoT/SNMP', description: 'Giám sát điều kiện nhiệt cho thiết bị điện tử.' },
    ];
  }

  const temperature = Number((40 + drift * 28).toFixed(1));
  const vibration = Number((1.5 + drift * 3.8).toFixed(2));
  const availability = Number((99.5 - drift * 9.5 - eventFactor * 3).toFixed(2));
  const load = Number((45 + drift * 45).toFixed(1));

  return [
    { id: 'temperature', label: 'Nhiệt độ vận hành', value: temperature, unit: '°C', threshold: 65, state: makeState(temperature, 65), source: 'IoT/SNMP', description: 'Theo dõi nhiệt độ bất thường của thiết bị.' },
    { id: 'vibration', label: 'Độ rung tổng hợp', value: vibration, unit: 'mm/s', threshold: 5.0, state: makeState(vibration, 5.0), source: 'IoT/Vibration', description: 'Theo dõi rung động cơ khí và lắp đặt.' },
    { id: 'availability', label: 'Khả dụng ước tính', value: availability, unit: '%', threshold: 92, state: availability <= 92 ? 'warning' : availability <= 96 ? 'watch' : 'normal', source: 'FRACAS/DNF', description: 'Tính từ sự cố, thời gian gián đoạn và điểm sức khỏe.' },
    { id: 'load', label: 'Mức tải vận hành', value: load, unit: '%', threshold: 88, state: makeState(load, 88), source: 'SCADA/Telemetry', description: 'Ước lượng mức tải so với năng lực thiết kế.' },
  ];
}

function severityFromRisk(riskScore: number): DigitalTwinSeverity {
  if (riskScore >= 75) return 'critical';
  if (riskScore >= 55) return 'warning';
  if (riskScore >= 30) return 'watch';
  return 'normal';
}

function threadStatus(score: number): DigitalTwinSeverity {
  if (score < 45) return 'critical';
  if (score < 65) return 'warning';
  if (score < 82) return 'watch';
  return 'normal';
}

function buildRecommendations(severity: DigitalTwinSeverity, assetKind: string, dnfCount: number, hazardCount: number) {
  const recommendations: string[] = [];

  if (severity === 'critical') {
    recommendations.push('Ưu tiên kiểm tra hiện trường, xác nhận tình trạng an toàn và lập phương án xử lý trong ca trực gần nhất.');
    recommendations.push('Tạo phiếu theo dõi riêng, ghi nhận thời điểm phát sinh, số lần reset/reboot, ảnh hưởng vận hành và bằng chứng hình ảnh.');
  } else if (severity === 'warning') {
    recommendations.push('Tăng tần suất theo dõi cảm biến, đối chiếu DNF gần nhất và chuẩn bị vật tư dự phòng phù hợp.');
  } else if (severity === 'watch') {
    recommendations.push('Duy trì giám sát xu hướng, kiểm tra lại ngưỡng cảnh báo và cập nhật dữ liệu sức khỏe sau mỗi đợt bảo trì.');
  } else {
    recommendations.push('Thiết bị đang trong vùng vận hành ổn định, tiếp tục giám sát định kỳ và duy trì dữ liệu chuẩn.');
  }

  if (assetKind === 'Platform Screen Door') {
    recommendations.push('Đối với PSD, cần đối chiếu thêm chu kỳ đóng/mở, lực motor, tình trạng dây đai và sự kiện cản trở tại ke ga.');
  }

  if (assetKind === 'AFC / Fare Collection') {
    recommendations.push('Đối với AFC, cần theo dõi hàng đợi giao dịch, trạng thái đồng bộ EOD và khả năng ảnh hưởng đến kết toán doanh thu.');
  }

  if (dnfCount > 0 || hazardCount > 0) {
    recommendations.push('Liên kết dữ liệu DNF/mối nguy vào hồ sơ tài sản để phục vụ FRACAS và đánh giá rủi ro lặp lại.');
  }

  return recommendations;
}

export function createDigitalTwinSnapshot(equipment: any, prediction?: any): DigitalTwinSnapshot {
  const specs = parseJsonObject(equipment?.specs);
  const dnfCount = Array.isArray(equipment?.dnfs) ? equipment.dnfs.length : 0;
  const hazardCount = Array.isArray(equipment?.hazards) ? equipment.hazards.length : 0;
  const healthScore = clamp(toNumber(prediction?.health_score ?? equipment?.health?.score, 100));
  const failureProbability = clamp(toNumber(prediction?.failure_probability, Math.max(0, 100 - healthScore)));
  const remainingUsefulLifeDays = prediction?.predicted_days_to_failure !== undefined
    ? Math.max(0, Math.round(toNumber(prediction.predicted_days_to_failure, 0)))
    : null;

  const assetKind = resolveAssetKind(equipment);
  const riskScore = clamp(Math.round((100 - healthScore) * 0.45 + failureProbability * 0.35 + dnfCount * 6 + hazardCount * 7));
  const dataConfidence = clamp(
    45
    + (equipment?.code ? 10 : 0)
    + (equipment?.installDate ? 8 : 0)
    + (equipment?.health ? 12 : 0)
    + (prediction && !prediction.error ? 15 : 0)
    + (Object.keys(specs).length > 0 ? 10 : 0)
  );
  const severity = severityFromRisk(riskScore);
  const sensors = getSensorProfile(assetKind, riskScore, healthScore, dnfCount);

  const digitalThread: DigitalTwinThread[] = [
    {
      id: 'physical-model',
      label: 'Mô hình vật lý / 3D',
      score: clamp(equipment?.category ? 88 : 72),
      status: threadStatus(equipment?.category ? 88 : 72),
      description: 'Định danh thiết bị, phân hệ, vị trí và mô hình trực quan phục vụ nhận diện hiện trường.',
    },
    {
      id: 'telemetry',
      label: 'Dữ liệu IoT/SNMP',
      score: dataConfidence,
      status: threadStatus(dataConfidence),
      description: 'Dữ liệu cảm biến, cảnh báo vượt ngưỡng và khả năng đồng bộ theo thời gian thực.',
    },
    {
      id: 'reliability',
      label: 'Sức khỏe & độ tin cậy',
      score: healthScore,
      status: threadStatus(healthScore),
      description: 'Tổng hợp điểm sức khỏe, xác suất hỏng và tuổi thọ còn lại từ mô hình dự báo.',
    },
    {
      id: 'response',
      label: 'Phản ứng bảo trì',
      score: clamp(100 - riskScore + Math.min(dnfCount, 4) * 3),
      status: threadStatus(clamp(100 - riskScore + Math.min(dnfCount, 4) * 3)),
      description: 'Mức sẵn sàng cho hành động bảo trì, vật tư, theo dõi và xử lý sự cố.',
    },
  ];

  return {
    twinId: `DT-${equipment?.code || equipment?.id || 'UNKNOWN'}`,
    assetName: equipment?.name || 'Chưa xác định',
    assetCode: equipment?.code || 'N/A',
    assetKind,
    severity,
    riskScore,
    healthScore,
    dataConfidence,
    failureProbability,
    remainingUsefulLifeDays,
    synchronizationState: dataConfidence >= 70 ? 'live' : dataConfidence >= 45 ? 'simulated' : 'offline',
    sensors,
    digitalThread,
    recommendedActions: buildRecommendations(severity, assetKind, dnfCount, hazardCount),
    operatingEnvelope: [
      `Trạng thái vận hành: ${equipment?.status || 'N/A'}`,
      `DNF liên quan: ${dnfCount}`,
      `Mối nguy liên quan: ${hazardCount}`,
      Object.keys(specs).length > 0 ? 'Đã có thông số kỹ thuật JSON' : 'Cần bổ sung thông số kỹ thuật chuẩn hóa',
    ],
    lastUpdatedAt: new Date().toISOString(),
  };
}
