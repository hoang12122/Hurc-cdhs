'use server';

import { revalidatePath } from 'next/cache';
import { requirePermission, requireAuth } from '@/lib/auth-enforcer';
import { 
    getAssetsInternal, 
    getAssetTreeInternal, 
    createAssetInternal, 
    deleteAssetInternal, 
    getAssetQRCodeInternal,
    getEquipmentInternal,
    getEquipmentByIdInternal
} from '../services/asset-service';

export async function getAssets() {
    await requireAuth();
    return await getAssetsInternal();
}

export async function getEquipment(filters?: { stationId?: string; systemId?: string; keyword?: string }) {
    await requireAuth();
    return await getEquipmentInternal(filters);
}

export async function getEquipmentById(id: string) {
    await requireAuth();
    return await getEquipmentByIdInternal(id);
}

export async function getAssetTree() {
    await requireAuth();
    return await getAssetTreeInternal();
}

export async function createAsset(data: {
    code: string;
    name: string;
    subsystem: string;
    parentId?: string;
    criticality?: string;
    specification?: any;
}) {
    await requirePermission('settings:manage');
    const asset = await createAssetInternal(data);
    revalidatePath('/admin/assets');
    return asset;
}

export async function deleteAsset(id: string) {
    await requirePermission('settings:manage');
    await deleteAssetInternal(id);
    revalidatePath('/admin/assets');
}

export async function getAssetQRCode(assetId: string) {
    await requireAuth();
    return await getAssetQRCodeInternal(assetId);
}
