import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';
import { jsonDb } from '../db/json-db';
import { cache, CACHE_KEYS, TTL_REFERENCE } from '../cache';
import { type ResponsibleUnit, type Subsystem, type PatrolLocation } from '../constants';

/**
 * CORE LOGIC ONLY - NO 'use server'
 * Refactored for Phase 4: Standardized Keys & Atomic JSON operations.
 */

// Responsible Units
export async function getInternalResponsibleUnits(): Promise<ResponsibleUnit[]> {
    return cache.getOrFetch(
        CACHE_KEYS.RESPONSIBLE_UNITS,
        async () => {
            if (!IS_DATABASE_OFFLINE) {
                try {
                    const units = await opsDb.responsibleUnit.findMany();
                    return units as ResponsibleUnit[];
                } catch (e) { /* fallback */ }
            }
            return await jsonDb.getCollection<ResponsibleUnit>('responsible_units');
        },
        TTL_REFERENCE
    );
}

export async function createInternalResponsibleUnit(name: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.responsibleUnit.create({
                data: { id: `unit-${Date.now()}`, name }
            });
            cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const record = { id: `unit-${Date.now()}`, name };
    const result = await jsonDb.insertRecord<any>('responsible_units', record);
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    return result;
}

export async function updateInternalResponsibleUnit(id: string, name: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.responsibleUnit.update({
                where: { id },
                data: { name }
            });
            cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.updateRecord<any>('responsible_units', id, { name });
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    return result;
}

export async function deleteInternalResponsibleUnit(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.responsibleUnit.delete({ where: { id } });
            cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.delete('responsible_units', (u: any) => u.id === id);
    cache.invalidate(CACHE_KEYS.RESPONSIBLE_UNITS);
    return result;
}

// Subsystems
export async function getInternalSubsystems(): Promise<Subsystem[]> {
    const transform = (sub: any): Subsystem => ({
        id: sub.id,
        label: {
            vi: sub.label_vi || sub.label || '',
            en: sub.label_en || sub.label || ''
        }
    });

    return cache.getOrFetch(
        CACHE_KEYS.SUBSYSTEMS,
        async () => {
            if (!IS_DATABASE_OFFLINE) {
                try {
                    const subsystems = await opsDb.subsystem.findMany();
                    return subsystems.map(transform);
                } catch (e) { /* fallback */ }
            }
            const all = await jsonDb.getCollection<any>('sub_systems');
            return all.map(transform);
        },
        TTL_REFERENCE
    );
}

export async function createInternalSubsystem(id: string, label: any) {
    const label_vi = typeof label === 'string' ? label : (label?.vi || '');
    const label_en = typeof label === 'string' ? label : (label?.en || '');
    
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.subsystem.create({
                data: { id, label_vi, label_en }
            });
            cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const record = { id, label_vi, label_en };
    const result = await jsonDb.insertRecord<any>('sub_systems', record);
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    return result;
}

export async function updateInternalSubsystem(id: string, label: any) {
    const label_vi = typeof label === 'string' ? label : (label?.vi || '');
    const label_en = typeof label === 'string' ? label : (label?.en || '');

    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.subsystem.update({
                where: { id },
                data: { label_vi, label_en }
            });
            cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.updateRecord<any>('sub_systems', id, { label_vi, label_en });
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    return result;
}

export async function deleteInternalSubsystem(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.subsystem.delete({ where: { id } });
            cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.delete('sub_systems', (s: any) => s.id === id);
    cache.invalidate(CACHE_KEYS.SUBSYSTEMS);
    return result;
}

// Locations
export async function getInternalLocations(): Promise<PatrolLocation[]> {
    return cache.getOrFetch(
        CACHE_KEYS.LOCATIONS,
        async () => {
            if (!IS_DATABASE_OFFLINE) {
                try {
                    const locations = await opsDb.patrolLocation.findMany();
                    return locations as PatrolLocation[];
                } catch (e) { /* fallback */ }
            }
            return await jsonDb.getCollection<PatrolLocation>('patrol_locations');
        },
        TTL_REFERENCE
    );
}

export async function createInternalLocation(id: string, label: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.patrolLocation.create({
                data: { id, label }
            });
            cache.invalidate(CACHE_KEYS.LOCATIONS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const record = { id, label };
    const result = await jsonDb.insertRecord<any>('patrol_locations', record);
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    return result;
}

export async function updateInternalLocation(id: string, label: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.patrolLocation.update({
                where: { id },
                data: { label }
            });
            cache.invalidate(CACHE_KEYS.LOCATIONS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.updateRecord<any>('patrol_locations', id, { label });
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    return result;
}

export async function deleteInternalLocation(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const record = await opsDb.patrolLocation.delete({ where: { id } });
            cache.invalidate(CACHE_KEYS.LOCATIONS);
            return record;
        } catch (e) { /* fallback */ }
    }

    const result = await jsonDb.delete('patrol_locations', (l: any) => l.id === id);
    cache.invalidate(CACHE_KEYS.LOCATIONS);
    return result;
}
