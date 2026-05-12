export const dynamic = 'force-dynamic';

import { HazardTableClient } from '@/components/hazards/hazard-table-client';
import { getHazardRecordsPaginated } from '@/lib/actions/hazard.actions';

export default async function HazardListPage() {
  const initialData = await getHazardRecordsPaginated({ page: 1, pageSize: 20 });

  return (
    <HazardTableClient 
      initialHazards={initialData.data} 
      initialTotalPages={initialData.metadata.pages}
    />
  );
}
