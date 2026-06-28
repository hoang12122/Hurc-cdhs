export type IncidentSubsystem = 'PSD' | 'AFC' | 'Rolling Stock' | 'Power' | 'Signaling' | 'General';

export interface IncidentResolutionCase {
  id: string;
  title: string;
  subsystem: IncidentSubsystem;
  station?: string;
  symptoms: string[];
  rootCauseHypothesis: string;
  actionsTaken: string[];
  resolutionOutcome: string;
  safetyNotes: string[];
  evidenceTags: string[];
  confidence: number;
  sourceType?: 'DNF' | 'Hazard' | 'Task' | 'Inspection' | 'Sample';
  sourceId?: string;
  referenceLabel?: string;
  updatedAt?: string;
}

export interface SimilarIncidentMatch {
  case: IncidentResolutionCase;
  score: number;
  matchedTags: string[];
}

export interface IncidentLearningResult {
  query: string;
  matches: SimilarIncidentMatch[];
  recommendedPlan: string[];
  confidenceLabel: 'low' | 'medium' | 'high';
  warning: string;
  dataSource: 'ops-database' | 'fallback-sample' | 'mixed';
  caseCount: number;
}

export const FALLBACK_INCIDENT_CASES: IncidentResolutionCase[] = [
  {
    id: 'AFC-PG-FREEZE-001',
    title: 'PG treo, dữ liệu giao dịch chưa đẩy hết sau End of Day',
    subsystem: 'AFC',
    station: 'Nhiều ga',
    symptoms: ['PG treo', 'không truyền dữ liệu', 'End of Day lỗi', 'giao dịch chưa đồng bộ', 'phải reboot PG'],
    rootCauseHypothesis: 'Thiết bị PG mất ổn định hoặc tiến trình đồng bộ giao dịch bị kẹt; cần phân biệt lỗi thiết bị, lỗi phần mềm và lỗi truyền dữ liệu.',
    actionsTaken: [
      'Ghi nhận ga, mã PG, thời điểm, số lần reboot và ảnh hưởng khai thác.',
      'Reboot PG theo khuyến nghị vận hành khi bảo đảm không ảnh hưởng giao dịch đang diễn ra.',
      'Trường hợp dữ liệu chưa đẩy hết, xuất dữ liệu giao dịch và truyền bổ sung theo kênh kỹ thuật được phê duyệt.',
      'Theo dõi sau khi cập nhật phần mềm để xác định lỗi còn lặp lại hay không.',
    ],
    resolutionOutcome: 'Cần lập danh sách theo dõi riêng nếu lỗi lặp lại; khi đủ dữ liệu có cơ sở yêu cầu hỗ trợ kỹ thuật dù chưa lập DNF ngay.',
    safetyNotes: ['Không thao tác trong thời điểm đang có giao dịch cuối gần nhất.', 'Không kết luận mất doanh thu nếu chưa đối chiếu dữ liệu kết toán.'],
    evidenceTags: ['afc', 'pg', 'freeze', 'treo', 'eod', 'end of day', 'reboot', 'transaction', 'giao dịch', 'kết toán'],
    confidence: 82,
    sourceType: 'Sample',
    referenceLabel: 'Sample AFC-PG-FREEZE-001',
  },
  {
    id: 'PSD-BELT-TENSION-001',
    title: 'Đứt dây đai PSD sau kiểm tra/điều chỉnh lực căng',
    subsystem: 'PSD',
    station: 'TDN',
    symptoms: ['đứt dây đai', 'belt broken', 'PSD vận hành bất thường', 'lực căng dây đai', 'measurement sai'],
    rootCauseHypothesis: 'Phương pháp đo lực căng không đúng hoặc sai lệch căn chỉnh có thể làm dây đai mòn sớm, nứt mặt lưng và tăng nguy cơ đứt.',
    actionsTaken: [
      'Kiểm tra lại phương pháp đo lực căng theo tài liệu O&M.',
      'Yêu cầu xác nhận vị trí đặt lực kế, phương đo vuông góc và chu kỳ kiểm tra.',
      'Kiểm tra dấu hiệu nứt, mòn, lệch song song và tình trạng pulley/belt path.',
      'Yêu cầu nhà thầu/nhà sản xuất hỗ trợ đo kiểm hiện trường nếu dụng cụ đo không phù hợp.',
    ],
    resolutionOutcome: 'Cần chuẩn hóa lại phương pháp đo và lập biên bản xác nhận hiện trường trước khi áp dụng rộng rãi.',
    safetyNotes: ['Không chỉ thay dây đai mà bỏ qua kiểm tra căn chỉnh.', 'Không dùng kết quả đo nếu thiết bị đo không đặt đúng vị trí.'],
    evidenceTags: ['psd', 'belt', 'dây đai', 'tension', 'lực căng', 'tdn', 'pulley', 'mòn', 'nứt', 'alignment'],
    confidence: 86,
    sourceType: 'Sample',
    referenceLabel: 'Sample PSD-BELT-TENSION-001',
  },
  {
    id: 'PSD-GHD-RAIN-001',
    title: 'Lỗi GHD/PSD xuất hiện tăng khi mưa lớn',
    subsystem: 'PSD',
    symptoms: ['GHD lỗi', 'mưa lớn', 'ẩm', 'nước', 'cửa PSD báo lỗi', 'lỗi lặp lại theo thời tiết'],
    rootCauseHypothesis: 'Điều kiện môi trường như mưa, ẩm hoặc nước xâm nhập có thể làm tăng lỗi cảm biến/công tắc/đấu nối liên quan PSD.',
    actionsTaken: [
      'Đối chiếu thời điểm lỗi với điều kiện thời tiết và khu vực phát sinh.',
      'Kiểm tra dấu hiệu ẩm, nước, bụi bẩn, vật cản và tình trạng vệ sinh tại khu vực cửa.',
      'Ghi nhận tần suất theo ga, mã cửa, thời điểm và điều kiện môi trường.',
      'Nếu lỗi lặp lại theo mưa, đề xuất kiểm tra kín nước, cable gland, connector và bảo vệ môi trường.',
    ],
    resolutionOutcome: 'Phân tích theo điều kiện môi trường giúp tránh xử lý rời rạc từng lỗi và có cơ sở đề xuất biện pháp phòng ngừa.',
    safetyNotes: ['Không bỏ qua yếu tố môi trường khi lỗi lặp lại theo thời tiết.', 'Không kết luận lỗi linh kiện nếu chưa kiểm tra điều kiện ẩm/nước.'],
    evidenceTags: ['psd', 'ghd', 'rain', 'mưa', 'ẩm', 'nước', 'sensor', 'connector', 'environment'],
    confidence: 74,
    sourceType: 'Sample',
    referenceLabel: 'Sample PSD-GHD-RAIN-001',
  },
  {
    id: 'PSD-TRAIN-VOLTAGE-001',
    title: 'Chênh lệch điện áp giữa tàu và PSD/EED',
    subsystem: 'Power',
    symptoms: ['chênh lệch điện áp', 'điện áp 0-80V', 'shock', 'tàu và PSD', 'EED', 'cách điện'],
    rootCauseHypothesis: 'Có hiện tượng chênh lệch điện áp cần đánh giá an toàn điện, biện pháp cách điện tạm thời và phương án xử lý được phê duyệt.',
    actionsTaken: [
      'Ghi nhận vị trí, điều kiện phát sinh và kết quả đo điện áp theo biên bản.',
      'Yêu cầu nhà thầu/tư vấn đưa ra tài liệu biện pháp an toàn và vật tư cách điện phù hợp.',
      'Áp dụng biện pháp tạm thời chỉ khi được kiểm tra, xác nhận và không làm ảnh hưởng vận hành an toàn.',
      'Theo dõi sau khi lắp vật tư cách điện và lưu bằng chứng kiểm tra.',
    ],
    resolutionOutcome: 'Ưu tiên kiểm soát rủi ro an toàn, có tài liệu xác nhận và biên bản trước khi đóng sự cố.',
    safetyNotes: ['Không tự ý thao tác điện khi chưa có biện pháp an toàn được phê duyệt.', 'Luôn ưu tiên cô lập nguy cơ và yêu cầu đơn vị chuyên môn xác nhận.'],
    evidenceTags: ['voltage', 'điện áp', 'shock', 'eed', 'psd', 'train', 'cách điện', 'insulation', 'safety'],
    confidence: 80,
    sourceType: 'Sample',
    referenceLabel: 'Sample PSD-TRAIN-VOLTAGE-001',
  },
  {
    id: 'PSD-PASSENGER-TRAP-001',
    title: 'Hành khách bị kẹt trong quá trình đóng/mở cửa tàu và PSD',
    subsystem: 'PSD',
    symptoms: ['hành khách bị kẹt', 'kẹt cửa', 'PSD', 'cửa tàu', 'trẻ em', 'người lớn tuổi', 'playback camera'],
    rootCauseHypothesis: 'Cần phân tích đồng bộ giữa thao tác đóng/mở cửa, quan sát ke ga, hành vi hành khách và cảnh báo từ hệ thống.',
    actionsTaken: [
      'Trích xuất camera playback để xác định trình tự sự kiện.',
      'Ghi nhận thời điểm, vị trí cửa, hướng ke ga, đối tượng hành khách và mức ảnh hưởng.',
      'Đối chiếu quy trình kiểm tra an toàn trên ke ga và phương pháp chỉ vật - gọi tên.',
      'Đề xuất tăng cường nhắc nhở, quan sát và cảnh báo tại vị trí có nguy cơ.',
    ],
    resolutionOutcome: 'Cần xử lý theo hướng an toàn vận hành, đào tạo lại điểm quan sát và lưu bằng chứng hình ảnh.',
    safetyNotes: ['Không quy trách nhiệm khi chưa đủ playback và trình tự sự kiện.', 'Ưu tiên biện pháp phòng ngừa đối với trẻ em, người lớn tuổi và khu vực đông khách.'],
    evidenceTags: ['passenger', 'kẹt', 'cửa', 'psd', 'train door', 'camera', 'playback', 'platform', 'hành khách'],
    confidence: 78,
    sourceType: 'Sample',
    referenceLabel: 'Sample PSD-PASSENGER-TRAP-001',
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

function scoreCase(query: string, incidentCase: IncidentResolutionCase): SimilarIncidentMatch {
  const queryTokens = new Set(tokenize(query));
  const normalizedQuery = normalizeText(query);
  const tagTokens = incidentCase.evidenceTags.flatMap((tag) => tokenize(tag));
  const symptomTokens = incidentCase.symptoms.flatMap((symptom) => tokenize(symptom));
  const titleTokens = tokenize(incidentCase.title);
  const sourceTokens = tokenize(`${incidentCase.sourceType || ''} ${incidentCase.referenceLabel || ''} ${incidentCase.station || ''}`);
  const allCaseTokens = new Set([...tagTokens, ...symptomTokens, ...titleTokens, ...sourceTokens]);

  const matchedTags = incidentCase.evidenceTags.filter((tag) => {
    const normalizedTag = normalizeText(tag);
    return normalizedQuery.includes(normalizedTag) || tokenize(tag).some((token) => queryTokens.has(token));
  });

  let score = 0;
  queryTokens.forEach((token) => {
    if (allCaseTokens.has(token)) score += 8;
    if (tagTokens.includes(token)) score += 7;
    if (symptomTokens.includes(token)) score += 5;
    if (titleTokens.includes(token)) score += 4;
    if (sourceTokens.includes(token)) score += 2;
  });

  if (matchedTags.length > 0) score += matchedTags.length * 10;
  score += Math.round(incidentCase.confidence / 10);

  return {
    case: incidentCase,
    score: Math.min(score, 100),
    matchedTags,
  };
}

function buildRecommendedPlan(matches: SimilarIncidentMatch[]) {
  if (matches.length === 0) {
    return [
      'Ghi nhận đầy đủ hiện tượng theo cấu trúc: thiết bị/ga/thời điểm/tần suất/ảnh hưởng khai thác.',
      'Tìm thêm dữ liệu DNF, log hệ thống, camera hoặc biên bản bảo trì trước khi kết luận nguyên nhân.',
      'Chỉ đề xuất phương án xử lý chính thức khi có bằng chứng kỹ thuật và điều kiện an toàn được xác nhận.',
    ];
  }

  const plan = new Set<string>();
  plan.add('Đối chiếu sự cố hiện tại với các sự cố tương tự có điểm tương đồng cao nhất.');
  matches.slice(0, 2).forEach((match) => {
    match.case.actionsTaken.slice(0, 3).forEach((action) => plan.add(action));
  });
  plan.add('Xác nhận điều kiện an toàn, phạm vi ảnh hưởng và bằng chứng trước khi áp dụng phương án xử lý.');
  plan.add('Sau xử lý, theo dõi tái diễn theo ga/thiết bị/thời điểm để cập nhật lại kho học sự cố.');

  return Array.from(plan).slice(0, 7);
}

function confidenceLabel(matches: SimilarIncidentMatch[]): IncidentLearningResult['confidenceLabel'] {
  const topScore = matches[0]?.score || 0;
  if (topScore >= 70) return 'high';
  if (topScore >= 40) return 'medium';
  return 'low';
}

function inferDataSource(cases: IncidentResolutionCase[]): IncidentLearningResult['dataSource'] {
  const hasOps = cases.some((incidentCase) => incidentCase.sourceType && incidentCase.sourceType !== 'Sample');
  const hasSample = cases.some((incidentCase) => incidentCase.sourceType === 'Sample');
  if (hasOps && hasSample) return 'mixed';
  if (hasOps) return 'ops-database';
  return 'fallback-sample';
}

export function analyzeSimilarIncidents(query: string, runtimeCases?: IncidentResolutionCase[]): IncidentLearningResult {
  const candidateCases = runtimeCases && runtimeCases.length > 0 ? runtimeCases : FALLBACK_INCIDENT_CASES;
  const matches = candidateCases
    .map((incidentCase) => scoreCase(query, incidentCase))
    .filter((match) => match.score >= 18)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    query,
    matches,
    recommendedPlan: buildRecommendedPlan(matches),
    confidenceLabel: confidenceLabel(matches),
    warning: 'Kết quả học từ sự cố tương tự chỉ là gợi ý kỹ thuật tham khảo. Cần kiểm tra hiện trường, log, tài liệu O&M và phê duyệt an toàn trước khi áp dụng.',
    dataSource: inferDataSource(candidateCases),
    caseCount: candidateCases.length,
  };
}

export function formatIncidentLearningResult(result: IncidentLearningResult) {
  const confidenceText = {
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp',
  }[result.confidenceLabel];

  const dataSourceText = {
    'ops-database': 'OPS database - DNF/Hazard/Task/Inspection',
    'fallback-sample': 'Kho mẫu fallback',
    mixed: 'OPS database + kho mẫu fallback',
  }[result.dataSource];

  const matchText = result.matches.length > 0
    ? result.matches.map((match, index) => {
        const matched = match.matchedTags.length > 0 ? `\n   Từ khóa trùng: ${match.matchedTags.join(', ')}` : '';
        const source = match.case.referenceLabel ? `\n   Nguồn: ${match.case.referenceLabel}` : '';
        const station = match.case.station ? `\n   Vị trí/ga: ${match.case.station}` : '';
        return `${index + 1}. ${match.case.title} [${match.case.subsystem}] - điểm tương đồng ${match.score}/100\n   Giả thuyết: ${match.case.rootCauseHypothesis}\n   Kết quả từng áp dụng: ${match.case.resolutionOutcome}${source}${station}${matched}`;
      }).join('\n')
    : 'Chưa tìm thấy sự cố tương tự đủ mạnh trong kho dữ liệu hiện có. Cần bổ sung thêm DNF/log/biên bản để hệ thống học tốt hơn.';

  const planText = result.recommendedPlan.map((item, index) => `${index + 1}. ${item}`).join('\n');

  return `PHÂN TÍCH SỰ CỐ TƯƠNG TỰ\n\nNguồn dữ liệu: ${dataSourceText} (${result.caseCount} hồ sơ)\nMức tin cậy tham khảo: ${confidenceText}\n\nCác sự cố tương tự:\n${matchText}\n\nPhương án xử lý đề xuất theo kinh nghiệm:\n${planText}\n\nLưu ý: ${result.warning}`;
}
