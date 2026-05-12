import { metroDb, IS_DATABASE_OFFLINE } from '../prisma';

export async function logTelemetryInternal(assetId: string, metric: string, value: number, unit?: string) {
    if (IS_DATABASE_OFFLINE) {
        // Suppress sensor logs offline to prevent db.json bloat
        return null;
    }
    try {
        return await metroDb.telemetryReading.create({
            data: {
                assetId,
                metric,
                value,
                unit
            }
        });
    } catch (e) { return null; }
}

export async function getAssetTelemetryInternal(assetId: string, metric?: string, limit: number = 20) {
    if (IS_DATABASE_OFFLINE) return [];
    try {
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
    } catch (e) { return []; }
}

export async function getLatestTelemetryInternal() {
    if (IS_DATABASE_OFFLINE) return [];
    try {
        return await metroDb.telemetryReading.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            take: 50
        });
    } catch (e) { return []; }
}

export async function getSnmpConfigInternal(assetId: string) {
    if (IS_DATABASE_OFFLINE) return null;
    try {
        return await metroDb.snmpConfig.findUnique({
            where: { assetId }
        });
    } catch (e) { return null; }
}

export async function upsertSnmpConfigInternal(data: {
    assetId: string;
    ip: string;
    community: string;
    oid: string;
    metricName: string;
    intervalSeconds: number;
}) {
    if (IS_DATABASE_OFFLINE) return null;
    try {
        return await metroDb.snmpConfig.upsert({
            where: { assetId: data.assetId },
            update: data,
            create: data
        });
    } catch (e) { return null; }
}
