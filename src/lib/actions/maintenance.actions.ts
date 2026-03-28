'use server';

import { revalidatePath } from 'next/cache';
import { type MaintenanceStandard, type MaintenanceStandardItem } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { opsDb } from '@/lib/prisma';

function migrateMaintenanceStandard(record: any): MaintenanceStandard {
  const migrated = { ...record };
  if (migrated.locationId && !migrated.locationIds) {
    migrated.locationIds = Array.isArray(migrated.locationId) ? migrated.locationId : [migrated.locationId];
  } else if (!migrated.locationIds) {
    migrated.locationIds = [];
  }
  delete migrated.locationId;
  return migrated as MaintenanceStandard;
}

export async function getMaintenanceStandards(): Promise<MaintenanceStandard[]> {
    const standards = await opsDb.maintenanceStandard.findMany();
    return standards.map(migrateMaintenanceStandard) as MaintenanceStandard[];
}

export async function addMaintenanceStandard(standard: Omit<MaintenanceStandard, 'id'>): Promise<MaintenanceStandard> {
    const newRecord = await opsDb.maintenanceStandard.create({
      data: {
        id: `MS-${Date.now()}`,
        name: standard.name,
        name_en: standard.name_en || null,
        description: standard.description || null,
        frequency: standard.frequency || null,
        scheduledTime: standard.scheduledTime || null,
        locationIds: standard.locationIds || [],
        recipientId: standard.recipientId || null,
        abbreviation: standard.abbreviation || null,
        estimatedDurationHours: standard.estimatedDurationHours || null,
      }
    });

    await logSystemEvent('CREATE_MAINTENANCE_STANDARD', 'INFO', `Created maintenance standard: ${newRecord.name}`);
    revalidatePath('/admin/maintenance-standards');
    return newRecord as MaintenanceStandard;
}

export async function updateMaintenanceStandard(updatedStandard: MaintenanceStandard): Promise<void> {
    await opsDb.maintenanceStandard.update({
      where: { id: updatedStandard.id },
      data: {
        name: updatedStandard.name,
        name_en: updatedStandard.name_en,
        description: updatedStandard.description,
        frequency: updatedStandard.frequency,
        scheduledTime: updatedStandard.scheduledTime,
        locationIds: updatedStandard.locationIds,
        recipientId: updatedStandard.recipientId,
        abbreviation: updatedStandard.abbreviation,
        estimatedDurationHours: updatedStandard.estimatedDurationHours,
      }
    });

    await logSystemEvent('UPDATE_MAINTENANCE_STANDARD', 'INFO', `Updated maintenance standard: ${updatedStandard.name}`);
    revalidatePath('/admin/maintenance-standards');
}

export async function deleteMaintenanceStandard(standardId: string): Promise<void> {
    const toDelete = await opsDb.maintenanceStandard.findUnique({ where: { id: standardId } });
    
    if (toDelete) {
        // Cascade delete items manually or let DB handle it if configured
        await opsDb.maintenanceStandardItem.deleteMany({ where: { standardId } });
        await opsDb.maintenanceStandard.delete({ where: { id: standardId } });
        await logSystemEvent('DELETE_MAINTENANCE_STANDARD', 'WARNING', `Deleted maintenance standard: ${toDelete.name} and all its items`);
    }
    revalidatePath('/admin/maintenance-standards');
}

export async function getMaintenanceStandardItems(): Promise<MaintenanceStandardItem[]> {
    const items = await opsDb.maintenanceStandardItem.findMany();
    return items as MaintenanceStandardItem[];
}

export async function addMaintenanceStandardItem(item: Omit<MaintenanceStandardItem, 'id'>): Promise<MaintenanceStandardItem> {
    const newRecord = await opsDb.maintenanceStandardItem.create({
      data: {
        id: `${item.standardId}-${item.itemCode}`,
        standardId: item.standardId,
        itemCode: item.itemCode,
        itemText: item.itemText,
        criteria: item.criteria || null,
        unit: item.unit || null,
        standardQuantity: item.standardQuantity || null,
        toleranceOperator: item.toleranceOperator || null,
        toleranceValue: item.toleranceValue || null,
        requiredTools: item.requiredTools || null,
      }
    });

    await logSystemEvent('CREATE_MAINTENANCE_STANDARD_ITEM', 'INFO', `Added item ${newRecord.itemCode} to standard ${newRecord.standardId}`);
    revalidatePath('/admin/maintenance-standards');
    return newRecord as MaintenanceStandardItem;
}

export async function updateMaintenanceStandardItem(updatedItem: MaintenanceStandardItem): Promise<void> {
    await opsDb.maintenanceStandardItem.update({
      where: { id: updatedItem.id },
      data: {
        itemCode: updatedItem.itemCode,
        itemText: updatedItem.itemText,
        criteria: updatedItem.criteria,
        unit: updatedItem.unit,
        standardQuantity: updatedItem.standardQuantity,
        toleranceOperator: updatedItem.toleranceOperator,
        toleranceValue: updatedItem.toleranceValue,
        requiredTools: updatedItem.requiredTools,
      }
    });

    await logSystemEvent('UPDATE_MAINTENANCE_STANDARD_ITEM', 'INFO', `Updated item ${updatedItem.itemCode} in standard ${updatedItem.standardId}`);
    revalidatePath('/admin/maintenance-standards');
}

export async function deleteMaintenanceStandardItem(itemId: string): Promise<void> {
    const toDelete = await opsDb.maintenanceStandardItem.findUnique({ where: { id: itemId } });
    
    if (toDelete) {
        await opsDb.maintenanceStandardItem.delete({ where: { id: itemId } });
        await logSystemEvent('DELETE_MAINTENANCE_STANDARD_ITEM', 'WARNING', `Deleted item ${toDelete.itemCode} from standard ${toDelete.standardId}`);
    }
    revalidatePath('/admin/maintenance-standards');
}
