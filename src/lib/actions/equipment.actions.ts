"use server";

import { dbProvider } from '../services/db-wrapper';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getEquipments() {
  try {
    return await dbProvider.findMany('equipment', {}, false);
  } catch (error) {
    console.error("Failed to fetch equipments:", error);
    return [];
  }
}

export async function getEquipmentById(id: string) {
  try {
    const equipment = await dbProvider.findUnique('equipment', id);
    if (!equipment) return null;
    
    // Also fetch health if possible, since we don't have relational fetch in generic findUnique easily
    const healthList = await dbProvider.findMany('equipmentHealth', { equipmentId: id });
    const health = healthList.length > 0 ? healthList[0] : null;
    
    return { ...equipment, health };
  } catch (error) {
    console.error(`Failed to fetch equipment ${id}:`, error);
    return null;
  }
}

export async function createEquipment(data: any) {
  try {
    const newEquipment = await dbProvider.create<{ id: string; [key: string]: any }>('equipment', {
      id: uuidv4(),
      code: data.code,
      name: data.name,
      category: data.category,
      locationId: data.locationId,
      subsystemId: data.subsystemId,
      installDate: data.installDate ? new Date(data.installDate) : null,
      status: 'ACTIVE',
      specs: data.specs ? JSON.stringify(data.specs) : null,
    });
    
    // Create default health score
    await dbProvider.create('equipmentHealth', {
      id: uuidv4(),
      equipmentId: newEquipment.id,
      score: 100,
      details: JSON.stringify({ reason: "New equipment installed" })
    });

    revalidatePath('/admin/metro');
    return { success: true, data: newEquipment };
  } catch (error: any) {
    console.error("Failed to create equipment:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteEquipment(id: string) {
  try {
    await dbProvider.delete('equipment', id);
    revalidatePath('/admin/metro');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
