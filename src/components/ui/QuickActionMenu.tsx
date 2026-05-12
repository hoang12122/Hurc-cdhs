import React, { useState } from 'react';
import { PremiumButton } from '../common/PremiumUI';

/**
 * PHASE 10 - TASK 10.6: Quick Action Menu (Floating Action Button)
 */
export const QuickActionMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: '🎙️ Record', color: '#3b82f6', action: () => alert('Voice Recording Started...') },
    { label: '📸 Photo', color: '#10b981', action: () => alert('Camera Opened...') },
    { label: '📝 Quick DNF', color: '#f59e0b', action: () => alert('DNF Draft Created!') },
  ];

  return (
    <div className="fixed-bottom-left">
      {isOpen && (
        <div className="fab-actions-container">
          {actions.map((act) => (
            <PremiumButton 
              key={act.label}
              variant="glass"
              onClick={() => { act.action(); setIsOpen(false); }}
              className="fab-action-btn badge-dynamic"
              style={{ '--badge-border': act.color } as React.CSSProperties}
            >
              {act.label}
            </PremiumButton>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fab-main-btn ${isOpen ? 'open' : ''}`}
      >
        +
      </button>
    </div>
  );
};
