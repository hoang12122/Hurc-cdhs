import { DnfTableClient } from '@/components/dnf/dnf-table-client';
import { getDnfsPaginated } from '@/lib/actions/dnf.actions';
import { getSubsystems, getLocations, getResponsibleUnits } from '@/lib/actions/category.actions';
import { getUsers } from '@/lib/actions/user.actions';

export default async function DnfListPage() {
  const [initialData, initialSubsystems, initialLocations, initialResponsibleUnits, initialUsers] = await Promise.all([
    getDnfsPaginated({ page: 1, pageSize: 20 }),
    getSubsystems(),
    getLocations(),
    getResponsibleUnits(),
    getUsers(),
  ]);
  
  return (
    <DnfTableClient 
      initialDnfs={initialData.data} 
      initialTotalPages={initialData.metadata.pages}
      initialSubsystems={initialSubsystems}
      initialLocations={initialLocations}
      initialResponsibleUnits={initialResponsibleUnits}
      initialUsers={initialUsers}
    />
  );
}
