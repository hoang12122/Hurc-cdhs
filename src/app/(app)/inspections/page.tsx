

"use client"; 

import * as React from "react";
import { InspectionsPageClient } from '@/components/inspections/inspections-page-client';
import type { InspectionDetail, MaintenanceStandard } from "@/lib/types";
import { getInspections } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandards } from "@/lib/actions/maintenance.actions";

export default function InspectionsPage() {
  const [initialData, setInitialData] = React.useState<{inspections: InspectionDetail[], standards: MaintenanceStandard[]}>({ inspections: [], standards: [] });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      getInspections(),
      getMaintenanceStandards()
    ]).then(([inspections, standards]) => {
      setInitialData({ inspections, standards });
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
      return (
          <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                  {/* Skeleton for title */}
              </div>
              {/* Skeleton for table */}
          </div>
      );
  }

  return (
    <InspectionsPageClient 
        initialInspections={initialData.inspections}
        initialMaintenanceStandards={initialData.standards}
    />
  );
}
