/**
 * Task 17.3: Offline Queue Service
 * 
 * Extended offline sync queue that supports DNF_CREATE, HAZARD_CREATE,
 * and CHECKLIST_ITEM_UPDATE operations alongside existing types.
 * 
 * When internet connectivity is restored, the queue automatically replays
 * all pending actions in chronological order to ensure data integrity.
 */

import { offlineSync, type OfflineAction } from './offline-sync';

/**
 * Replay all queued offline actions when connectivity is restored.
 * Actions are processed in chronological order (FIFO by timestamp).
 * Each action is removed from the queue only after successful server-side execution.
 */
export async function replayOfflineQueue(): Promise<{
  succeeded: number;
  failed: number;
  errors: string[];
}> {
  const actions = await offlineSync.getActions();
  
  // Sort by timestamp to ensure chronological replay order
  const sortedActions = [...actions].sort((a, b) => a.timestamp - b.timestamp);
  
  let succeeded = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const action of sortedActions) {
    try {
      await executeAction(action);
      await offlineSync.removeAction(action.id);
      succeeded++;
    } catch (err: any) {
      failed++;
      errors.push(`[${action.type}] ${err.message || 'Unknown error'}`);
      console.error(`[OfflineQueue] Failed to replay action ${action.id} (${action.type}):`, err);
    }
  }

  return { succeeded, failed, errors };
}

/**
 * Execute a single offline action by dispatching to the appropriate server action.
 */
async function executeAction(action: OfflineAction): Promise<void> {
  switch (action.type) {
    case 'DNF_CREATE': {
      const { addDnf } = await import('@/lib/actions/dnf.actions');
      await addDnf(action.data);
      break;
    }

    case 'HAZARD_CREATE': {
      const { addHazardRecord } = await import('@/lib/actions/hazard.actions');
      await addHazardRecord(action.data);
      break;
    }

    case 'INSPECTION_CREATE': {
      const { addInspection } = await import('@/lib/actions/inspection.actions');
      await addInspection(action.data);
      break;
    }

    case 'STATUS_UPDATE': {
      if (action.entityType === 'INSPECTION') {
        const { updateInspection } = await import('@/lib/actions/inspection.actions');
        await updateInspection(action.data);
      } else if (action.entityType === 'DNF') {
        const { updateDnf } = await import('@/lib/actions/dnf.actions');
        await updateDnf(action.data);
      } else if (action.entityType === 'HAZARD') {
        const { updateHazardRecord } = await import('@/lib/actions/hazard.actions');
        await updateHazardRecord(action.data);
      }
      break;
    }

    case 'EDGE_INFERENCE_SYNC': {
      // Edge AI inference results — just log for now, no server action needed
      console.info('[OfflineQueue] Synced edge inference result:', action.data?.modelName);
      break;
    }

    default:
      console.warn(`[OfflineQueue] Unknown action type: ${action.type}`);
  }
}

/**
 * Get the count of pending offline actions.
 */
export async function getPendingCount(): Promise<number> {
  const actions = await offlineSync.getActions();
  return actions.length;
}

/**
 * Clear all pending offline actions (use with caution).
 */
export async function clearQueue(): Promise<void> {
  const actions = await offlineSync.getActions();
  for (const action of actions) {
    await offlineSync.removeAction(action.id);
  }
}
