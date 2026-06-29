'use client';

export type CrossModuleEventName =
  | 'inspection:create-dnf'
  | 'dnf:created'
  | 'hazard:created'
  | 'asset:open-360'
  | 'ai-lab:open-incident-learning';

export interface CreateDnfFromInspectionPayload {
  originatingInspectionId: string;
  originatingFindingId?: string;
  description?: string;
  locationOfFailure?: string;
  staffWhoIdentifiedFailure?: string;
  equipmentCode?: string;
  subsystemId?: string;
}

export interface CrossModuleEventMap {
  'inspection:create-dnf': CreateDnfFromInspectionPayload;
  'dnf:created': { dnfId: string; failureReportNo?: string; originatingInspectionId?: string };
  'hazard:created': { hazardId: string; linkedDnfId?: string };
  'asset:open-360': { assetId?: string; assetCode?: string; stationId?: string };
  'ai-lab:open-incident-learning': { query: string; sourceType?: 'DNF' | 'Hazard' | 'Task' | 'Inspection' | 'Manual'; sourceId?: string };
}

type CrossModuleEventEnvelope<TName extends CrossModuleEventName> = {
  name: TName;
  payload: CrossModuleEventMap[TName];
  emittedAt: string;
  traceId: string;
};

type Unsubscribe = () => void;

const BUS_PREFIX = 'hurc:mfe:';

function canUseWindow() {
  return typeof window !== 'undefined' && typeof window.dispatchEvent === 'function';
}

function createTraceId(name: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${name}:${Date.now()}:${random}`;
}

function toBrowserEventName(name: CrossModuleEventName) {
  return `${BUS_PREFIX}${name}`;
}

export function publishCrossModuleEvent<TName extends CrossModuleEventName>(
  name: TName,
  payload: CrossModuleEventMap[TName],
) {
  const envelope: CrossModuleEventEnvelope<TName> = {
    name,
    payload,
    emittedAt: new Date().toISOString(),
    traceId: createTraceId(name),
  };

  if (!canUseWindow()) return envelope;

  window.dispatchEvent(new CustomEvent(toBrowserEventName(name), { detail: envelope }));
  window.dispatchEvent(new CustomEvent(`${BUS_PREFIX}*`, { detail: envelope }));

  return envelope;
}

export function subscribeCrossModuleEvent<TName extends CrossModuleEventName>(
  name: TName,
  handler: (payload: CrossModuleEventMap[TName], envelope: CrossModuleEventEnvelope<TName>) => void,
): Unsubscribe {
  if (!canUseWindow()) return () => undefined;

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent<CrossModuleEventEnvelope<TName>>;
    if (!customEvent.detail || customEvent.detail.name !== name) return;
    handler(customEvent.detail.payload, customEvent.detail);
  };

  const browserEventName = toBrowserEventName(name);
  window.addEventListener(browserEventName, listener);

  return () => window.removeEventListener(browserEventName, listener);
}

export function publishCreateDnfFromInspection(payload: CreateDnfFromInspectionPayload) {
  return publishCrossModuleEvent('inspection:create-dnf', payload);
}

export function subscribeCreateDnfFromInspection(
  handler: (payload: CreateDnfFromInspectionPayload, envelope: CrossModuleEventEnvelope<'inspection:create-dnf'>) => void,
) {
  return subscribeCrossModuleEvent('inspection:create-dnf', handler);
}

export function publishDnfCreated(payload: CrossModuleEventMap['dnf:created']) {
  return publishCrossModuleEvent('dnf:created', payload);
}

export function publishHazardCreated(payload: CrossModuleEventMap['hazard:created']) {
  return publishCrossModuleEvent('hazard:created', payload);
}

export function publishOpenAsset360(payload: CrossModuleEventMap['asset:open-360']) {
  return publishCrossModuleEvent('asset:open-360', payload);
}

export function publishOpenIncidentLearning(payload: CrossModuleEventMap['ai-lab:open-incident-learning']) {
  return publishCrossModuleEvent('ai-lab:open-incident-learning', payload);
}
