import React from 'react';
import { RiskBadge, GlassCard } from '../common/PremiumUI';
import { SuggestionCard } from './SuggestionCard';

/**
 * PHASE 10 - TASK 10.4: AI Intelligence Sidebar
 * Refactored to use CSS Classes from design-tokens.css.
 */

interface AiSidebarProps {
  targetName: string;
  riskScore: number;
  suggestions: Array<{
    id: string;
    title: string;
    description: string;
    confidence: number;
  }>;
}

export const AiSidebar: React.FC<AiSidebarProps> = ({ targetName, riskScore, suggestions }) => {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="glass-sidebar ai-sidebar-container">
      {/* Header Section */}
      <div className="mb-lg">
        <h2 className="m-0 text-20 text-main">AI Intelligence</h2>
        <p className="text-muted text-14">
          Phân tích rủi ro cho: <strong>{targetName}</strong>
        </p>
      </div>

      {/* Risk Overview Card */}
      <GlassCard className="risk-summary-box">
        <div className="risk-score-large">
          {riskScore}
        </div>
        <RiskBadge level={getRiskLevel(riskScore)} score={riskScore} />
        <div className="mt-md text-12 text-muted">
          Dựa trên TrustGraph & Predictive Model
        </div>
      </GlassCard>

      {/* Suggestions List */}
      <div className="flex-1 overflow-auto pr-xs">
        <h3 className="text-16 mb-md text-main">Đề xuất từ AI</h3>
        {suggestions.map(s => (
          <SuggestionCard 
            key={s.id}
            title={s.title}
            description={s.description}
            confidence={s.confidence}
            onApprove={() => console.log('Approved:', s.id)}
            onReject={() => console.log('Rejected:', s.id)}
          />
        ))}
      </div>

      {/* Footer / Meta info */}
      <div className="mt-lg text-xs text-muted text-center">
        AI model: Gemma-2b-it | Prompt v1.2
      </div>
    </div>
  );
};
