'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { subscribeCreateDnfFromInspection } from '@/lib/mfe/service-bus';

function appendIfPresent(params: URLSearchParams, key: string, value?: string) {
  if (value && value.trim().length > 0) params.set(key, value.trim());
}

export function CrossModuleServiceBusBridge() {
  const router = useRouter();

  React.useEffect(() => {
    return subscribeCreateDnfFromInspection((payload) => {
      const params = new URLSearchParams();
      appendIfPresent(params, 'originatingInspectionId', payload.originatingInspectionId);
      appendIfPresent(params, 'originatingFindingId', payload.originatingFindingId);
      appendIfPresent(params, 'description', payload.description);
      appendIfPresent(params, 'locationOfFailure', payload.locationOfFailure);
      appendIfPresent(params, 'staffWhoIdentifiedFailure', payload.staffWhoIdentifiedFailure);
      appendIfPresent(params, 'equipmentCode', payload.equipmentCode);
      appendIfPresent(params, 'subsystemId', payload.subsystemId);

      router.push(`/dnf/new?${params.toString()}`);
    });
  }, [router]);

  return null;
}
