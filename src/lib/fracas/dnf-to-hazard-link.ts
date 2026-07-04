import type { DnfDocument } from '@/lib/types';

function appendParam(params: URLSearchParams, key: string, value?: string | number | boolean | null) {
  if (value === undefined || value === null || value === '') return;
  params.set(key, String(value));
}

export function buildDnfToHazardUrl(dnf: DnfDocument) {
  const params = new URLSearchParams();

  appendParam(params, 'originatingDnfId', dnf.id);
  appendParam(params, 'dnfHazardPrefill', 'normalized');
  appendParam(params, 'suggestedDescription', dnf.descriptionOfFailure);
  appendParam(params, 'locationOfFailure', dnf.locationOfFailure);
  appendParam(params, 'suggestedConsequence', dnf.impactAssessment);
  appendParam(params, 'suggestedControls', dnf.immediateAction);
  appendParam(params, 'suggestedSystemGroup', dnf.subsystemIds?.join(','));
  appendParam(params, 'suggestedSeverityId', dnf.hazardLevelId === 'high' ? 'I' : undefined);
  appendParam(params, 'suggestedProposedActions', dnf.resolutionDetails || dnf.immediateAction);

  return `/hazards/new?${params.toString()}`;
}
