import type { ReactNode } from 'react';
import { FracasPhaseTracker } from '@/components/fracas/fracas-phase-tracker';
import { PredictiveRamsPanel } from '@/components/rams/predictive-rams-panel';
import { RamsOccDashboardPanel } from '@/components/rams/rams-occ-dashboard-panel';
import { getDnfRecords } from '@/lib/actions/dnf.actions';
import type { DnfDocument } from '@/lib/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  let records: DnfDocument[] = [];

  try {
    records = await getDnfRecords();
  } catch {
    records = [];
  }

  return (
    <div className="flex flex-col gap-6">
      {children}
      <FracasPhaseTracker records={records} />
      <RamsOccDashboardPanel records={records} />
      <PredictiveRamsPanel records={records} />
    </div>
  );
}
