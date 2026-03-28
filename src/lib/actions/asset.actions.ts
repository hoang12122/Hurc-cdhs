'use server';

import { metroDb } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { generateAssetQR } from '@/lib/services/qr-gen';

export async function getAssets() {
    return await metroDb.asset.findMany({
        include: {
            children: true
        },
        orderBy: {
            code: 'asc'
        }
    });
}

export async function getAssetTree() {
    const allAssets = await metroDb.asset.findMany({
        include: { children: true }
    });

    // Build hierarchical tree
    const assetMap = new Map();
    allAssets.forEach(asset => assetMap.set(asset.id, { ...asset, children: [] }));

    const rootAssets: any[] = [];
    allAssets.forEach(asset => {
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

export async function createAsset(data: {
    code: string;
    name: string;
    subsystem: string;
    parentId?: string;
    criticality?: string;
    specification?: any;
}) {
    const asset = await metroDb.asset.create({
        data
    });
    revalidatePath('/admin/assets');
    return asset;
}

export async function deleteAsset(id: string) {
    await metroDb.asset.delete({
        where: { id }
    });
    revalidatePath('/admin/assets');
}
export async function getAssetQRCode(assetId: string) {
    return await generateAssetQR(assetId);
}
