export const dynamic = 'force-dynamic';

import { InspectionsPageClient } from '@/components/inspections/inspections-page-client';
import { getInspectionsPaginated } from '@/lib/actions/inspection.actions';
import { getMaintenanceStandards } from '@/lib/actions/maintenance.actions';

export default async function InspectionsPage() {
  const [initialData, initialStandards] = await Promise.all([
    getInspectionsPaginated({ page: 1, pageSize: 20 }),
    getMaintenanceStandards()
  ]);

  return (
    <InspectionsPageClient 
      initialInspections={initialData.data}
      initialTotalPages={initialData.metadata.pages}
      initialMaintenanceStandards={initialStandards}
    />
  );
}
