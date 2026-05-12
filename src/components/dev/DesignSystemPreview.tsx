import React from 'react';
import '../../styles/design-tokens.css';
import { RiskBadge, StatusBadge, PremiumButton, GlassCard } from '../common/PremiumUI';

/**
 * PHASE 10 - TASK 10.1, 10.2 & 10.3: Design System Preview
 * Component to demonstrate Glassmorphism and UI Kit.
 */
export const DesignSystemPreview: React.FC = () => {
  return (
    <div className="p-xl bg-gradient-main min-h-200">
      <div className="justify-between items-center mb-xl">
        <h1 className="text-main m-0">🎨 Hurc1CRM Premium Design Lab</h1>
        <PremiumButton variant="primary">Export UI Kit</PremiumButton>
      </div>

      <div className="grid-cols-2 gap-lg">
        
        {/* --- Glassmorphism Components --- */}
        <GlassCard title="💎 Glassmorphism Components">
          <p className="text-muted mb-md">Bộ UI Kit chuẩn Premium với hiệu ứng kính mờ và bóng đổ sâu.</p>
          
          <div className="flex-wrap gap-sm">
            <RiskBadge level="CRITICAL" score={92} />
            <RiskBadge level="HIGH" score={75} />
            <RiskBadge level="MEDIUM" score={45} />
            <RiskBadge level="LOW" score={12} />
          </div>

          <div className="flex-row gap-sm mt-lg">
            <StatusBadge status="AI_DRAFT" />
            <StatusBadge status="UNDER_REVIEW" />
            <StatusBadge status="APPROVED" />
          </div>
        </GlassCard>

        {/* --- Interactive Elements --- */}
        <GlassCard title="⚡ Interactive Elements">
          <p className="text-muted">Các thành phần tương tác hỗ trợ phản hồi người dùng.</p>
          <div className="flex-row gap-md mt-lg">
            <PremiumButton>Primary Action</PremiumButton>
            <PremiumButton variant="glass">Secondary Action</PremiumButton>
          </div>
        </GlassCard>
      </div>

      {/* --- Color Palette Section --- */}
      <GlassCard title="🌈 Standardized Color Palette" className="mt-lg">
        <div className="flex-row gap-md">
          {[
            { label: 'Critical', class: 'badge-critical' },
            { label: 'High', class: 'badge-high' },
            { label: 'Medium', class: 'badge-medium' },
            { label: 'Low', class: 'badge-low' },
            { label: 'Primary', class: 'ai-bubble-user' }
          ].map(item => (
            <div key={item.label} className="text-center">
              <div className={`circle-60 mb-xs ${item.class}`}></div>
              <span className="text-12 font-bold">{item.label}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
