'use server';

import { revalidatePath } from 'next/cache';
import { type ResponsibleUnit, type Subsystem, type PatrolLocation } from '@/lib/constants';
import { internalLogSystemEvent as logSystemEvent } from '../services/log-service';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getInternalResponsibleUnits, 
    getInternalSubsystems, 
    getInternalLocations,
    createInternalResponsibleUnit,
    updateInternalResponsibleUnit,
    deleteInternalResponsibleUnit,
    createInternalSubsystem,
    updateInternalSubsystem,
    deleteInternalSubsystem,
    createInternalLocation,
    updateInternalLocation,
    deleteInternalLocation
} from '../services/category-service';

// ============ Responsible Units ============
export async function getResponsibleUnits(): Promise<ResponsibleUnit[]> {
    await requireAuth();
    return await getInternalResponsibleUnits();
}

export async function addResponsibleUnit(unit: Omit<ResponsibleUnit, 'id'>): Promise<ResponsibleUnit> {
    await requirePermission('settings:manage');
    const record = await createInternalResponsibleUnit(unit.name);
    revalidatePath('/admin/categories');
    return record as ResponsibleUnit;
}

export async function updateResponsibleUnit(updatedUnit: ResponsibleUnit): Promise<void> {
    await requirePermission('settings:manage');
    await updateInternalResponsibleUnit(updatedUnit.id, updatedUnit.name);
    await logSystemEvent('UPDATE_RESPONSIBLE_UNIT', 'INFO', `Updated unit: ${updatedUnit.name}`);
    revalidatePath('/admin/categories');
}

export async function deleteResponsibleUnit(unitId: string): Promise<void> {
    await requirePermission('settings:manage');
    await deleteInternalResponsibleUnit(unitId);
    await logSystemEvent('DELETE_RESPONSIBLE_UNIT', 'WARNING', `Deleted unit: ${unitId}`);
    revalidatePath('/admin/categories');
}

// ============ Subsystems ============
export async function getSubsystems(): Promise<Subsystem[]> {
    await requireAuth();
    return await getInternalSubsystems();
}

export async function addSubsystem(subsystem: Subsystem): Promise<Subsystem> {
    await requirePermission('settings:manage');
    const record = await createInternalSubsystem(subsystem.id, subsystem.label);
    await logSystemEvent('CREATE_SUBSYSTEM', 'INFO', `Created subsystem: ${subsystem.id}`);
    revalidatePath('/admin/categories');
    return record as unknown as Subsystem;
}

export async function updateSubsystem(updatedSubsystem: Subsystem): Promise<void> {
    await requirePermission('settings:manage');
    await updateInternalSubsystem(updatedSubsystem.id, updatedSubsystem.label);
    revalidatePath('/admin/categories');
}

export async function deleteSubsystem(subsystemId: string): Promise<void> {
    await requirePermission('settings:manage');
    await deleteInternalSubsystem(subsystemId);
    revalidatePath('/admin/categories');
}

// ============ Locations ============
export async function getLocations(): Promise<PatrolLocation[]> {
    await requireAuth();
    return await getInternalLocations();
}

export async function addLocation(location: PatrolLocation): Promise<PatrolLocation> {
    await requirePermission('settings:manage');
    const record = await createInternalLocation(location.id, location.label);
    revalidatePath('/admin/categories');
    return record as PatrolLocation;
}

export async function updateLocation(updatedLocation: PatrolLocation): Promise<void> {
    await requirePermission('settings:manage');
    await updateInternalLocation(updatedLocation.id, updatedLocation.label);
    revalidatePath('/admin/categories');
}

export async function deleteLocation(locationId: string): Promise<void> {
    await requirePermission('settings:manage');
    await deleteInternalLocation(locationId);
    revalidatePath('/admin/categories');
}
