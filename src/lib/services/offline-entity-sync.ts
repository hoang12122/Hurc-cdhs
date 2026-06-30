'use client';

import { offlineSync, type OfflineAction } from '@/lib/services/offline-sync';

type SyncOutcome = { success: boolean; message?: string };
type OfflineActionHandler = (action: OfflineAction) => Promise<SyncOutcome | void>;

export interface OfflineEntitySyncHandlers {
  dnfCreate?: OfflineActionHandler;
  hazardCreate?: OfflineActionHandler;
  inspectionCreate?: OfflineActionHandler;
  statusUpdate?: OfflineActionHandler;
}

export interface OfflineEntitySyncResult {
  scanned: number;
  synced: number;
  failed: number;
  skipped: number;
  errors: Array<{ actionId: string; type: OfflineAction['type']; message: string }>;
}

function resolveHandler(action: OfflineAction, handlers: OfflineEntitySyncHandlers) {
  if (action.type === 'DNF_CREATE') return handlers.dnfCreate;
  if (action.type === 'HAZARD_CREATE') return handlers.hazardCreate;
  if (action.type === 'INSPECTION_CREATE') return handlers.inspectionCreate;
  if (action.type === 'STATUS_UPDATE') return handlers.statusUpdate;
  return undefined;
}

export async function syncOfflineActionsByEntity(handlers: OfflineEntitySyncHandlers): Promise<OfflineEntitySyncResult> {
  const actions = await offlineSync.getActions();
  const result: OfflineEntitySyncResult = { scanned: actions.length, synced: 0, failed: 0, skipped: 0, errors: [] };

  for (const action of actions) {
    const handler = resolveHandler(action, handlers);
    if (!handler) {
      result.skipped += 1;
      continue;
    }

    try {
      const outcome = await handler(action);
      if (outcome && outcome.success === false) {
        result.failed += 1;
        result.errors.push({ actionId: action.id, type: action.type, message: outcome.message || 'Unsuccessful sync result.' });
        continue;
      }

      await offlineSync.removeAction(action.id);
      result.synced += 1;
    } catch (error: any) {
      result.failed += 1;
      result.errors.push({ actionId: action.id, type: action.type, message: error?.message || 'Unknown offline sync error.' });
    }
  }

  return result;
}

export const OFFLINE_ENTITY_SYNC_CHECKLIST = [
  'DNF_CREATE uses the approved DNF Server Action.',
  'HAZARD_CREATE uses the approved Hazard Server Action.',
  'INSPECTION_CREATE uses the approved Inspection Server Action.',
  'STATUS_UPDATE uses the related entity Server Action.',
  'Remove an offline action only after backend write succeeds.',
];
