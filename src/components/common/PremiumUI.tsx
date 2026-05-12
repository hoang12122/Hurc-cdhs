import React from 'react';
import '../../styles/design-tokens.css';

/**
 * PHASE 10 - TASK 10.3: Premium UI Component Library
 * Refactored to use CSS Classes instead of Inline Styles.
 */

interface RiskBadgeProps {
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const badgeClass = `badge-${level.toLowerCase()}`;
  return (
    <span className={`glass-badge ${badgeClass}`}>
      {level} {score !== undefined ? `(${score})` : ''}
    </span>
  );
};

interface StatusBadgeProps {
  status: 'AI_DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClass = `status-${status.toLowerCase().replace('_', '-')}`;
  return (
    <span className={`status-badge ${statusClass}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

export const PremiumButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'glass' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantClass = variant === 'glass' ? 'btn-glass' : 'btn-primary';
  return (
    <button 
      {...props} 
      className={`btn-premium ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  title?: string; 
  className?: string;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDragLeave?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
}> = ({ children, title, className = '', ...props }) => (
  <div className={`glass-card ${className}`} {...props}>
    {title && <h3 className="glass-card-title">{title}</h3>}
    {children}
  </div>
);
