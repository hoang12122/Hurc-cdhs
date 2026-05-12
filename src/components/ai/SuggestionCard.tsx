import React from 'react';
import { GlassCard, PremiumButton } from '../common/PremiumUI';

/**
 * PHASE 10 - TASK 10.5: AI Suggestion Card
 * Refactored to use CSS Classes from design-tokens.css.
 */

interface SuggestionCardProps {
  title: string;
  description: string;
  confidence: number;
  onApprove: () => void;
  onReject: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps & { id?: string }> = ({ 
  id, title, description, confidence, onApprove, onReject 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('suggestion', JSON.stringify({ id, title, description }));
  };

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab">
      <GlassCard 
        className="suggestion-card-main border-l-primary p-md mb-md"
      >
        <div className="suggestion-card-header">
          <h4 className="m-0 text-15 text-main">{title}</h4>
          <span className="confidence-badge">
            {Math.round(confidence * 100)}% CONFIDENCE
          </span>
        </div>
        
        <p className="text-13 text-muted leading-relaxed mb-md">
          {description}
        </p>
        
        <div className="ai-chat-input-area">
          <PremiumButton 
            variant="primary" 
            className="flex-1 py-xs text-12"
            onClick={onApprove}
          >
            Approve
          </PremiumButton>
          <PremiumButton 
            variant="glass" 
            className="flex-1 py-xs text-12"
            onClick={onReject}
          >
            Reject
          </PremiumButton>
        </div>
      </GlassCard>
    </div>
  );
};
