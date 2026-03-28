'use server';

import { revalidatePath } from 'next/cache';
import { type ResponsibleUnit, type Subsystem, type PatrolLocation } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { opsDb } from '@/lib/prisma';
import { cache, CACHE_KEYS, TTL_REFERENCE } from '@/lib/cache';

// ============ Responsible Units (T3: Reference Data — Cached) ============

export async function getResponsibleUnits(): Promise<ResponsibleUnit[]> {
    return cache.getOrFetch(
        CACHE_KEYS.RESPONSIBLE_UNITS,
        async () => {
            const units = await opsDb.responsibleUnit.findMany();
            return units as ResponsibleUnit[];
        },
        TTL_REFERENCE
    );
}

export async function addResponsibleUnit(unit: Omit<ResponsibleUnit, 'id'>): Promise<ResponsibleUnit> {
    const newRecord = await opsDb.responsibleUnit.create({
        data: { id: `unit-${Date.now()}`, name: unit.name }
    });
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    revalidatePath('/admin/categories');
    return newRecord as ResponsibleUnit;
}

export async function updateResponsibleUnit(updatedUnit: ResponsibleUnit): Promise<void> {
    await opsDb.responsibleUnit.update({
        where: { id: updatedUnit.id },
        data: { name: updatedUnit.name }
    });
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    await logSystemEvent('UPDATE_RESPONSIBLE_UNIT', 'INFO', `Updated responsible unit: ${updatedUnit.name} (ID: ${updatedUnit.id})`);
    revalidatePath('/admin/categories');
}

export async function deleteResponsibleUnit(unitId: string): Promise<void> {
    const toDelete = await opsDb.responsibleUnit.findUnique({ where: { id: unitId } });
    if (toDelete) {
        await opsDb.responsibleUnit.delete({ where: { id: unitId } });
        await logSystemEvent('DELETE_RESPONSIBLE_UNIT', 'WARNING', `Deleted responsible unit: ${toDelete.name} (ID: ${unitId})`);
    }
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    revalidatePath('/admin/categories');
}

// ============ Subsystems (T3: Reference Data — Cached) ============

export async function getSubsystems(): Promise<Subsystem[]> {
    return cache.getOrFetch(
        CACHE_KEYS.SUBSYSTEMS,
        async () => {
            const subsystems = await opsDb.subsystem.findMany();
            return subsystems as unknown as Subsystem[];
        },
        TTL_REFERENCE
    );
}

export async function addSubsystem(subsystem: Subsystem): Promise<Subsystem> {
    const newRecord = await opsDb.subsystem.create({
        data: { id: subsystem.id, label: subsystem.label as any }
    });
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    await logSystemEvent('CREATE_SUBSYSTEM', 'INFO', `Created new subsystem: ${(newRecord.label as any).vi} (ID: ${newRecord.id})`);
    revalidatePath('/admin/categories');
    return newRecord as unknown as Subsystem;
}

export async function updateSubsystem(updatedSubsystem: Subsystem): Promise<void> {
    await opsDb.subsystem.update({
        where: { id: updatedSubsystem.id },
        data: { label: updatedSubsystem.label as any }
    });
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    await logSystemEvent('UPDATE_SUBSYSTEM', 'INFO', `Updated subsystem: ${updatedSubsystem.label.vi} (ID: ${updatedSubsystem.id})`);
    revalidatePath('/admin/categories');
}

export async function deleteSubsystem(subsystemId: string): Promise<void> {
    const toDelete = await opsDb.subsystem.findUnique({ where: { id: subsystemId } });
    if (toDelete) {
        await opsDb.subsystem.delete({ where: { id: subsystemId } });
        await logSystemEvent('DELETE_SUBSYSTEM', 'WARNING', `Deleted subsystem: ${(toDelete.label as any).vi} (ID: ${subsystemId})`);
    }
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    revalidatePath('/admin/categories');
}

// ============ Locations (T3: Reference Data — Cached) ============

export async function getLocations(): Promise<PatrolLocation[]> {
    return cache.getOrFetch(
        CACHE_KEYS.LOCATIONS,
        async () => {
            const locations = await opsDb.patrolLocation.findMany();
            return locations as PatrolLocation[];
        },
        TTL_REFERENCE
    );
}

export async function addLocation(location: PatrolLocation): Promise<PatrolLocation> {
    const newRecord = await opsDb.patrolLocation.create({
        data: { id: location.id, label: location.label }
    });
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    await logSystemEvent('CREATE_LOCATION', 'INFO', `Created new location: ${newRecord.label} (ID: ${newRecord.id})`);
    revalidatePath('/admin/categories');
    return newRecord as PatrolLocation;
}

export async function updateLocation(updatedLocation: PatrolLocation): Promise<void> {
    await opsDb.patrolLocation.update({
        where: { id: updatedLocation.id },
        data: { label: updatedLocation.label }
    });
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    await logSystemEvent('UPDATE_LOCATION', 'INFO', `Updated location: ${updatedLocation.label} (ID: ${updatedLocation.id})`);
    revalidatePath('/admin/categories');
}

export async function deleteLocation(locationId: string): Promise<void> {
    const toDelete = await opsDb.patrolLocation.findUnique({ where: { id: locationId } });
    if (toDelete) {
        await opsDb.patrolLocation.delete({ where: { id: locationId } });
        await logSystemEvent('DELETE_LOCATION', 'WARNING', `Deleted location: ${toDelete.label} (ID: ${locationId})`);
    }
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    revalidatePath('/admin/categories');
}
