'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { subscribeCreateDnfFromInspection, subscribeCrossModuleEvent } from '@/lib/mfe/service-bus';

function appendIfPresent(params: URLSearchParams, key: string, value?: string) {
  if (value && value.trim().length > 0) params.set(key, value.trim());
}

function toQueryString(params: URLSearchParams) {
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function CrossModuleServiceBusBridge() {
  const router = useRouter();

  React.useEffect(() => {
    const unsubscribeCreateDnf = subscribeCreateDnfFromInspection((payload) => {
      const params = new URLSearchParams();
      appendIfPresent(params, 'originatingInspectionId', payload.originatingInspectionId);
      appendIfPresent(params, 'originatingFindingId', payload.originatingFindingId);
      appendIfPresent(params, 'description', payload.description);
      appendIfPresent(params, 'locationOfFailure', payload.locationOfFailure);
      appendIfPresent(params, 'staffWhoIdentifiedFailure', payload.staffWhoIdentifiedFailure);
      appendIfPresent(params, 'equipmentCode', payload.equipmentCode);
      appendIfPresent(params, 'subsystemId', payload.subsystemId);
      router.push(`/dnf/new${toQueryString(params)}`);
    });

    const unsubscribeOpenAsset = subscribeCrossModuleEvent('asset:open-360', (payload) => {
      const params = new URLSearchParams();
      appendIfPresent(params, 'assetId', payload.assetId);
      appendIfPresent(params, 'assetCode', payload.assetCode);
      appendIfPresent(params, 'stationId', payload.stationId);
      router.push(`/asset-360${toQueryString(params)}`);
    });

    const unsubscribeOpenIncidentLearning = subscribeCrossModuleEvent('ai-lab:open-incident-learning', (payload) => {
      const params = new URLSearchParams();
      params.set('mode', 'incident_learning');
      appendIfPresent(params, 'query', payload.query);
      appendIfPresent(params, 'sourceType', payload.sourceType);
      appendIfPresent(params, 'sourceId', payload.sourceId);
      router.push(`/ai-lab${toQueryString(params)}`);
    });

    return () => {
      unsubscribeCreateDnf();
      unsubscribeOpenAsset();
      unsubscribeOpenIncidentLearning();
    };
  }, [router]);

  return null;
}
