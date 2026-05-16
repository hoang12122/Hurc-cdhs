/**
 * GOVERNANCE SERVICE (HURC1 MISSION-CRITICAL)
 * Manages pending actions requiring Super Admin approval.
 */

import { jsonDb } from '../db/json-db';

export interface PendingAction {
    id: string;
    type: 'DELETE_RECORD' | 'SYSTEM_CONFIG' | 'AI_MEMORY_OVERRIDE';
    description: string;
    payload: any;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requestedBy: string;
    timestamp: string;
}

export async function requestAction(action: Omit<PendingAction, 'id' | 'status' | 'timestamp'>) {
    const newAction: PendingAction = {
        ...action,
        id: (await import('crypto')).randomUUID(),
        status: 'PENDING',
        timestamp: new Date().toISOString(),
    };
    
    await jsonDb.insertRecord('pending_actions', newAction);
    return newAction.id;
}

export async function approveAction(actionId: string, superAdminId: string) {
    const action = await jsonDb.findFirst<PendingAction>('pending_actions', a => a.id === actionId);
    if (!action || action.status !== 'PENDING') throw new Error("Action not found or already processed.");
    
    // Logic thực thi tác vụ (ví dụ: Xóa bản ghi thật)
    // ... logic thực thi dựa trên action.type ...
    
    await jsonDb.updateRecord<PendingAction>('pending_actions', actionId, { 
        status: 'APPROVED',
        payload: { ...action.payload, approvedBy: superAdminId }
    });
    
    return true;
}
