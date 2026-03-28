'use server';

import { metroDb } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function logTelemetry(assetId: string, metric: string, value: number, unit?: string) {
    const reading = await metroDb.telemetryReading.create({
        data: {
            assetId,
            metric,
            value,
            unit
        }
    });
    return reading;
}

export async function getAssetTelemetry(assetId: string, metric?: string, limit: number = 20) {
    return await metroDb.telemetryReading.findMany({
        where: {
            assetId,
            ...(metric ? { metric } : {})
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: limit
    });
}

export async function getLatestTelemetry() {
    return await metroDb.telemetryReading.findMany({
        orderBy: {
            timestamp: 'desc'
        },
        take: 50
    });
}
export async function getSnmpConfig(assetId: string) {
    return await metroDb.snmpConfig.findUnique({
        where: { assetId }
    });
}

export async function upsertSnmpConfig(data: {
    assetId: string;
    ip: string;
    community: string;
    oid: string;
    metricName: string;
    intervalSeconds: number;
}) {
    const config = await metroDb.snmpConfig.upsert({
        where: { assetId: data.assetId },
        update: data,
        create: data
    });
    return config;
}
