import type { ReactNode } from 'react';
import { RamsOccDashboardPanel } from '@/components/rams/rams-occ-dashboard-panel';
import { getDnfRecords } from '@/lib/actions/dnf.actions';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  let records = [];

  try {
    records = await getDnfRecords();
  } catch (error) {
    console.error('[dashboard-rams] Could not load DNF records for RAMS OCC panel:', error);
  }

  return (
    <div className="flex flex-col gap-6">
      {children}
      <RamsOccDashboardPanel records={records} />
    </div>
  );
}
