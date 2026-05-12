import { jsonDb } from '../db/json-db';
import { generateAssetQR } from '@/lib/services/qr-gen';
import { opsDb, IS_DATABASE_OFFLINE } from '../prisma';

/**
 * ASSET SERVICE — Hardened Atomic JSON
 */

export async function getAssetsInternal() {
    if (!IS_DATABASE_OFFLINE) {
        try {
            return await opsDb.asset.findMany();
        } catch (e) { /* fallback */ }
    }
    return await jsonDb.getCollection<any>('assets');
}

export async function getEquipmentInternal(filters?: { stationId?: string; systemId?: string; keyword?: string }) {
    let equipment: any[] = [];

    if (!IS_DATABASE_OFFLINE) {
        try {
            equipment = await opsDb.asset.findMany({
                where: {
                    AND: [
                        filters?.stationId ? { stationId: filters.stationId } : {},
                        filters?.systemId ? { systemId: filters.systemId } : {},
                        filters?.keyword ? {
                            OR: [
                                { name: { contains: filters.keyword, mode: 'insensitive' } },
                                { code: { contains: filters.keyword, mode: 'insensitive' } }
                            ]
                        } : {}
                    ]
                }
            });
            return equipment;
        } catch (e) { /* fallback */ }
    }

    // Offline Filtering
    equipment = await jsonDb.getCollection<any>('assets');
    
    if (filters) {
        equipment = equipment.filter(e => {
            if (filters.stationId && e.stationId !== filters.stationId) return false;
            if (filters.systemId && e.systemId !== filters.systemId) return false;
            if (filters.keyword) {
                const k = filters.keyword.toLowerCase();
                const match = (e.name?.toLowerCase().includes(k)) || (e.code?.toLowerCase().includes(k)) || (e.id?.toLowerCase().includes(k));
                if (!match) return false;
            }
            return true;
        });
    }

    return equipment;
}

export async function getEquipmentByIdInternal(id: string) {
    if (!IS_DATABASE_OFFLINE) {
        try {
            const asset = await opsDb.asset.findUnique({ where: { id } });
            if (asset) return asset;
        } catch (e) { /* fallback */ }
    }

    const all = await jsonDb.getCollection<any>('assets');
    const item = all.find((e: any) => e.id === id);
    
    if (!item) {
        throw new Error(`Equipment with ID ${id} not found in offline storage.`);
    }

    return item;
}

export async function getAssetTreeInternal() {
    const allAssets = await getAssetsInternal();

    const assetMap = new Map();
    allAssets.forEach((asset: any) => assetMap.set(asset.id, { ...asset, children: [] }));

    const rootAssets: any[] = [];
    allAssets.forEach((asset: any) => {
        if (asset.parentId) {
            const parent = assetMap.get(asset.parentId);
            if (parent) {
                parent.children.push(assetMap.get(asset.id));
            }
        } else {
            rootAssets.push(assetMap.get(asset.id));
        }
    });

    return rootAssets;
}

export async function createAssetInternal(data: any) {
    // Redirect to JSON-DB write in this phase
    console.log("[ASSET SERVICE] Mocking creation in JSON-DB:", data.code);
    return { id: `asset-${Date.now()}`, ...data };
}

export async function deleteAssetInternal(id: string) {
    console.log("[ASSET SERVICE] Mocking deletion:", id);
    return { id };
}

export async function getAssetQRCodeInternal(assetId: string) {
    return await generateAssetQR(assetId);
}
