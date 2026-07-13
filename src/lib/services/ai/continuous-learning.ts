import {
  getMemoryHealth,
  getQuarantinedMemories,
  type MemoryHealth,
} from '@/lib/services/agent-memory';

export interface ContinuousLearningPolicy {
  enabled: boolean;
  mode: 'governed-shadow-learning';
  evaluationWindowDays: number;
  minimumConfidence: number;
  minimumReinforcements: number;
  humanApprovalRequired: true;
  automaticPromotion: false;
  autonomousCodeChanges: false;
  operationalWriteAccess: false;
}

export interface LearningProposal {
  code: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  rationale: string;
  recommendedAction: string;
  requiresHumanApproval: true;
}

export interface ContinuousLearningStatus {
  policy: ContinuousLearningPolicy;
  health: MemoryHealth;
  reviewQueue: {
    provisional: number;
    quarantined: number;
    reinforced: number;
    recentQuarantineSamples: number;
  };
  proposals: LearningProposal[];
  releaseState: 'COLLECTING' | 'REVIEW_REQUIRED' | 'READY_FOR_HUMAN_EVALUATION';
  evaluatedAt: string;
}

type Environment = Readonly<Partial<NodeJS.ProcessEnv>>;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function numberValue(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveContinuousLearningPolicy(
  env: Environment = process.env,
): ContinuousLearningPolicy {
  return {
    enabled: env.AI_CONTINUOUS_LEARNING_ENABLED !== 'false',
    mode: 'governed-shadow-learning',
    evaluationWindowDays: Math.round(clamp(numberValue(env.AI_LEARNING_WINDOW_DAYS, 30), 7, 180)),
    minimumConfidence: clamp(numberValue(env.AI_LEARNING_MIN_CONFIDENCE, 0.8), 0.65, 0.95),
    minimumReinforcements: Math.round(clamp(numberValue(env.AI_LEARNING_MIN_REINFORCEMENTS, 3), 2, 20)),
    humanApprovalRequired: true,
    automaticPromotion: false,
    autonomousCodeChanges: false,
    operationalWriteAccess: false,
  };
}

function buildProposals(health: MemoryHealth): LearningProposal[] {
  const proposals: LearningProposal[] = [];

  if (health.provisional > 0) {
    proposals.push({
      code: 'REVIEW_PROVISIONAL_MEMORY',
      priority: health.provisional > health.verified ? 'HIGH' : 'MEDIUM',
      title: 'Rà soát ký ức tạm thời',
      rationale: `${health.provisional} ký ức đang ở trạng thái provisional và chưa được dùng như tri thức đã xác minh.`,
      recommendedAction: 'Lấy mẫu, đối chiếu nguồn, đánh giá độ đúng và phê duyệt hoặc cách ly.',
      requiresHumanApproval: true,
    });
  }

  if (health.quarantined > 0) {
    proposals.push({
      code: 'ANALYZE_QUARANTINE',
      priority: health.quarantined > 20 ? 'HIGH' : 'MEDIUM',
      title: 'Phân tích dữ liệu bị cách ly',
      rationale: `${health.quarantined} ký ức bị cách ly có thể phản ánh phản hồi âm, injection hoặc dữ liệu chất lượng thấp.`,
      recommendedAction: 'Phân nhóm nguyên nhân, sửa prompt/pipeline và không tái sử dụng nội dung chưa xác minh.',
      requiresHumanApproval: true,
    });
  }

  if (health.duplicateReinforcements >= 3) {
    proposals.push({
      code: 'PROMOTE_REINFORCED_PATTERN',
      priority: 'MEDIUM',
      title: 'Đánh giá mẫu được củng cố nhiều lần',
      rationale: `${health.duplicateReinforcements} lần củng cố trùng cho thấy một số kiến thức được người dùng lặp lại.`,
      recommendedAction: 'Chạy shadow evaluation trên tập kiểm thử trước khi phê duyệt thành tri thức verified.',
      requiresHumanApproval: true,
    });
  }

  if (health.verified === 0) {
    proposals.push({
      code: 'BOOTSTRAP_VERIFIED_BASELINE',
      priority: 'HIGH',
      title: 'Tạo tập tri thức chuẩn ban đầu',
      rationale: 'Chưa có ký ức verified nên AI không có baseline học liên tục đáng tin cậy.',
      recommendedAction: 'Chọn tài liệu và tình huống đã phê duyệt để xây dựng bộ đánh giá chuẩn.',
      requiresHumanApproval: true,
    });
  }

  return proposals;
}

export async function getContinuousLearningStatus(): Promise<ContinuousLearningStatus> {
  const policy = resolveContinuousLearningPolicy();
  const [health, quarantine] = await Promise.all([
    getMemoryHealth(),
    getQuarantinedMemories(20),
  ]);
  const proposals = policy.enabled ? buildProposals(health) : [];
  const releaseState = !policy.enabled
    ? 'COLLECTING'
    : health.provisional > 0 || health.quarantined > 0
      ? 'REVIEW_REQUIRED'
      : health.verified > 0
        ? 'READY_FOR_HUMAN_EVALUATION'
        : 'COLLECTING';

  return {
    policy,
    health,
    reviewQueue: {
      provisional: health.provisional,
      quarantined: health.quarantined,
      reinforced: health.duplicateReinforcements,
      recentQuarantineSamples: quarantine.length,
    },
    proposals,
    releaseState,
    evaluatedAt: new Date().toISOString(),
  };
}
