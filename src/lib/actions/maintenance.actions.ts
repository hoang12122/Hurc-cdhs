'use server';

import { revalidatePath } from 'next/cache';
import { type MaintenanceStandard, type MaintenanceStandardItem } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { 
    getInternalMaintenanceStandards, 
    createInternalMaintenanceStandard, 
    updateInternalMaintenanceStandard, 
    deleteInternalMaintenanceStandard,
    getInternalMaintenanceStandardItems,
    createInternalMaintenanceStandardItem,
    updateInternalMaintenanceStandardItem,
    deleteInternalMaintenanceStandardItem
} from '../services/maintenance-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';

// Internal helper function moved to individual actions for strict Server Action compliance
const migrateMaintenanceStandard = (record: any): MaintenanceStandard => {
  const migrated = { ...record };
  if (migrated.locationId && !migrated.locationIds) {
    migrated.locationId = Array.isArray(migrated.locationId) ? migrated.locationId : [migrated.locationId];
  } else if (!migrated.locationIds) {
    migrated.locationIds = [];
  }
  return migrated as unknown as MaintenanceStandard;
};

export async function getMaintenanceStandards(): Promise<MaintenanceStandard[]> {
  await requireAuth();
  const standards = await getInternalMaintenanceStandards();
  return standards.map(migrateMaintenanceStandard);
}

export async function addMaintenanceStandard(standard: Omit<MaintenanceStandard, 'id'>): Promise<MaintenanceStandard> {
  await requirePermission('settings:manage');
  const id = `MS-${Date.now()}`;
  const newRecord = { ...standard, id };
  const record = await createInternalMaintenanceStandard(newRecord);
  await logSystemEvent('CREATE_MAINTENANCE_STANDARD', 'INFO', `Created maintenance standard: ${record.name}`);
  revalidatePath('/admin/maintenance-standards');
  return record as unknown as MaintenanceStandard;
}

export async function updateMaintenanceStandard(updatedStandard: MaintenanceStandard): Promise<void> {
  await requirePermission('settings:manage');
  await updateInternalMaintenanceStandard(updatedStandard.id, updatedStandard);
  await logSystemEvent('UPDATE_MAINTENANCE_STANDARD', 'INFO', `Updated maintenance standard: ${updatedStandard.name}`);
  revalidatePath('/admin/maintenance-standards');
}

export async function deleteMaintenanceStandard(standardId: string): Promise<void> {
  await requirePermission('settings:manage');
  await deleteInternalMaintenanceStandard(standardId);
  await logSystemEvent('DELETE_MAINTENANCE_STANDARD', 'WARNING', `Deleted maintenance standard ID: ${standardId}`);
  revalidatePath('/admin/maintenance-standards');
}

export async function getMaintenanceStandardItems(): Promise<MaintenanceStandardItem[]> {
  await requireAuth();
  return await getInternalMaintenanceStandardItems() as any;
}

export async function addMaintenanceStandardItem(item: Omit<MaintenanceStandardItem, 'id'>): Promise<MaintenanceStandardItem> {
  await requirePermission('settings:manage');
  const id = `${item.standardId}-${item.itemCode}`;
  const record = await createInternalMaintenanceStandardItem({ ...item, id });
  await logSystemEvent('CREATE_MAINTENANCE_STANDARD_ITEM', 'INFO', `Added item ${record.itemCode} to standard ${record.standardId}`);
  revalidatePath('/admin/maintenance-standards');
  return record as unknown as MaintenanceStandardItem;
}

export async function updateMaintenanceStandardItem(updatedItem: MaintenanceStandardItem): Promise<void> {
  await requirePermission('settings:manage');
  await updateInternalMaintenanceStandardItem(updatedItem.id, updatedItem);
  await logSystemEvent('UPDATE_MAINTENANCE_STANDARD_ITEM', 'INFO', `Updated item ${updatedItem.itemCode}`);
  revalidatePath('/admin/maintenance-standards');
}

export async function deleteMaintenanceStandardItem(itemId: string): Promise<void> {
  await requirePermission('settings:manage');
  await deleteInternalMaintenanceStandardItem(itemId);
  await logSystemEvent('DELETE_MAINTENANCE_STANDARD_ITEM', 'WARNING', `Deleted item ID: ${itemId}`);
  revalidatePath('/admin/maintenance-standards');
}
