import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { type MaintenanceStandard, type MaintenanceStandardItem } from '../constants';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Hardened for Offline Stability (Phase 4).
 */

export async function getInternalMaintenanceStandards(): Promise<MaintenanceStandard[]> {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const results = await opsDb.maintenanceStandard.findMany({
        where: { deletedAt: null },
        include: { items: true }
      });
      return results as unknown as MaintenanceStandard[];
    } catch (dbError) { /* fallback */ }
  }
  return await jsonDb.getCollection<MaintenanceStandard>('maintenance_standards');
}

export async function getInternalMaintenanceStandardById(id: string): Promise<MaintenanceStandard | undefined> {
  if (!IS_DATABASE_OFFLINE) {
    try {
      const result = await opsDb.maintenanceStandard.findUnique({
        where: { id },
        include: { items: true }
      });
      return result as unknown as MaintenanceStandard;
    } catch (e) { /* fallback */ }
  }
  const all = await jsonDb.getCollection<any>('maintenance_standards');
  const item = all.find((s: any) => s.id === id);
  if (!item) return undefined;

  const allItems = await jsonDb.getCollection<any>('maintenance_standard_items');
  const relatedItems = allItems.filter((i: any) => i.standardId === id);

  return {
    ...item,
    items: relatedItems
  } as unknown as MaintenanceStandard;
}

export async function createInternalMaintenanceStandard(data: any) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandard.create({ data });
    } catch (e) { /* fallback */ }
  }

  return await jsonDb.insertRecord<any>('maintenance_standards', {
    ...data,
    deletedAt: null
  });
}

export async function updateInternalMaintenanceStandard(id: string, data: any) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandard.update({ where: { id }, data });
    } catch (e) { /* fallback */ }
  }

  return await jsonDb.updateRecord<any>('maintenance_standards', id, data);
}

export async function deleteInternalMaintenanceStandard(id: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      await opsDb.maintenanceStandardItem.deleteMany({ where: { standardId: id } });
      return await opsDb.maintenanceStandard.delete({ where: { id } });
    } catch (e) { /* fallback */ }
  }

  await jsonDb.delete('maintenance_standards', (s: any) => s.id === id);
  await jsonDb.delete('maintenance_standard_items', (i: any) => i.standardId === id);
}

// Items
export async function getInternalMaintenanceStandardItems(): Promise<MaintenanceStandardItem[]> {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandardItem.findMany() as unknown as MaintenanceStandardItem[];
    } catch (e) { /* fallback */ }
  }
  return await jsonDb.getCollection<MaintenanceStandardItem>('maintenance_standard_items');
}

export async function createInternalMaintenanceStandardItem(data: any) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandardItem.create({ data });
    } catch (e) { /* fallback */ }
  }

  return await jsonDb.insertRecord<any>('maintenance_standard_items', data);
}

export async function updateInternalMaintenanceStandardItem(id: string, data: any) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandardItem.update({ where: { id }, data });
    } catch (e) { /* fallback */ }
  }

  return await jsonDb.updateRecord<any>('maintenance_standard_items', id, data);
}

export async function deleteInternalMaintenanceStandardItem(id: string) {
  if (!IS_DATABASE_OFFLINE) {
    try {
      return await opsDb.maintenanceStandardItem.delete({ where: { id } });
    } catch (e) { /* fallback */ }
  }

  await jsonDb.delete('maintenance_standard_items', (i: any) => i.id === id);
}
