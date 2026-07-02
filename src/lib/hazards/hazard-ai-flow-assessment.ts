export type HazardSeverityLevel = 'S1' | 'S2' | 'S3' | 'S4';
export type HazardFrequencyLevel = 'F1' | 'F2' | 'F3' | 'F4';
export type HazardRiskClass = 'Low' | 'Medium' | 'High' | 'Critical';
export type HumanDecision = 'accept' | 'mitigate' | 'escalate' | 'reject' | 'pending-human-review';

export interface HazardFlowAssessmentInput {
  description?: string;
  potentialConsequence?: string;
  currentControls?: string;
  severityLevel?: HazardSeverityLevel;
  frequencyLevel?: HazardFrequencyLevel;
  repeatedFailure?: boolean;
  operationalImpact?: boolean;
  safetyRelated?: boolean;
}

export interface HazardFlowAssessmentResult {
  safetyScreening: 'safety-related' | 'not-safety-related' | 'needs-review';
  severityLevel: HazardSeverityLevel;
  frequencyLevel: HazardFrequencyLevel;
  riskClass: HazardRiskClass;
  matrixScore: number;
  aiRecommendation: HumanDecision;
  humanDecisionRequired: true;
  suggestedActions: string[];
  rationale: string[];
}

const SEVERITY_SCORE: Record<HazardSeverityLevel, number> = {
  S1: 1,
  S2: 2,
  S3: 3,
  S4: 4,
};

const FREQUENCY_SCORE: Record<HazardFrequencyLevel, number> = {
  F1: 1,
  F2: 2,
  F3: 3,
  F4: 4,
};

function inferSeverity(input: HazardFlowAssessmentInput): HazardSeverityLevel {
  if (input.severityLevel) return input.severityLevel;

  const text = `${input.description || ''} ${input.potentialConsequence || ''}`.toLowerCase();
  if (/fatal|death|serious injury|derail|collision|cháy|tử vong|nghiêm trọng|va chạm|trật bánh/.test(text)) return 'S4';
  if (/injury|service suspension|major delay|mất an toàn|dừng khai thác|gián đoạn lớn/.test(text)) return 'S3';
  if (/minor|delay|warning|ảnh hưởng vận hành|chậm tàu/.test(text)) return 'S2';
  return 'S1';
}

function inferFrequency(input: HazardFlowAssessmentInput): HazardFrequencyLevel {
  if (input.frequencyLevel) return input.frequencyLevel;
  if (input.repeatedFailure && input.operationalImpact) return 'F4';
  if (input.repeatedFailure) return 'F3';
  if (input.operationalImpact) return 'F2';
  return 'F1';
}

function classifyRisk(severity: HazardSeverityLevel, frequency: HazardFrequencyLevel): { riskClass: HazardRiskClass; matrixScore: number } {
  const matrixScore = SEVERITY_SCORE[severity] * FREQUENCY_SCORE[frequency];

  if (matrixScore >= 12) return { riskClass: 'Critical', matrixScore };
  if (matrixScore >= 8) return { riskClass: 'High', matrixScore };
  if (matrixScore >= 4) return { riskClass: 'Medium', matrixScore };
  return { riskClass: 'Low', matrixScore };
}

function screenSafety(input: HazardFlowAssessmentInput): HazardFlowAssessmentResult['safetyScreening'] {
  if (input.safetyRelated === true) return 'safety-related';
  if (input.safetyRelated === false) return 'not-safety-related';

  const text = `${input.description || ''} ${input.potentialConsequence || ''} ${input.currentControls || ''}`.toLowerCase();
  if (/safety|hazard|risk|injury|fatal|fire|collision|door|psd|afc|power|signal|an toàn|mối nguy|rủi ro|thương tích|cháy|va chạm|cửa/.test(text)) {
    return 'safety-related';
  }
  return 'needs-review';
}

function recommendDecision(riskClass: HazardRiskClass, safetyScreening: HazardFlowAssessmentResult['safetyScreening']): HumanDecision {
  if (safetyScreening === 'needs-review') return 'pending-human-review';
  if (riskClass === 'Critical') return 'escalate';
  if (riskClass === 'High') return 'mitigate';
  if (riskClass === 'Medium') return 'mitigate';
  return 'accept';
}

function buildSuggestedActions(riskClass: HazardRiskClass, decision: HumanDecision): string[] {
  const base = ['Human reviewer must validate severity, frequency, matrix class and final decision before updating Hazard Log.'];

  if (decision === 'escalate') {
    return [
      'Escalate to responsible manager / safety authority for urgent review.',
      'Require immediate risk control or temporary mitigation before closure.',
      'Link the hazard with relevant FRACAS/DNF record and root cause analysis.',
      ...base,
    ];
  }

  if (decision === 'mitigate') {
    return [
      'Define corrective / preventive action and responsible unit.',
      'Set due date, monitoring requirement and verification evidence.',
      'Review residual risk before management approval.',
      ...base,
    ];
  }

  if (decision === 'accept') {
    return [
      'Record rationale for acceptance and continue monitoring for recurrence.',
      'Reassess if repeated failure or operational impact occurs.',
      ...base,
    ];
  }

  return [
    'Request human review due to insufficient information or unclear safety relation.',
    'Complete missing incident description, consequence, control and recurrence evidence.',
    ...base,
  ];
}

export function assessHazardFlow(input: HazardFlowAssessmentInput): HazardFlowAssessmentResult {
  const safetyScreening = screenSafety(input);
  const severityLevel = inferSeverity(input);
  const frequencyLevel = inferFrequency(input);
  const { riskClass, matrixScore } = classifyRisk(severityLevel, frequencyLevel);
  const aiRecommendation = recommendDecision(riskClass, safetyScreening);

  return {
    safetyScreening,
    severityLevel,
    frequencyLevel,
    riskClass,
    matrixScore,
    aiRecommendation,
    humanDecisionRequired: true,
    suggestedActions: buildSuggestedActions(riskClass, aiRecommendation),
    rationale: [
      `Severity criterion: ${severityLevel}`,
      `Frequency criterion: ${frequencyLevel}`,
      `Risk matrix classification: ${riskClass} with score ${matrixScore}`,
      'Final decision remains under human responsibility.',
    ],
  };
}
