'use server';

import { requireAuth } from '../auth-enforcer';
import { 
    logTelemetryInternal, 
    getAssetTelemetryInternal, 
    getLatestTelemetryInternal, 
    getSnmpConfigInternal, 
    upsertSnmpConfigInternal 
} from '../services/telemetry-service';

export async function logTelemetry(assetId: string, metric: string, value: number, unit?: string) {
    // Usually called by background tasks, but if called by UI, require auth
    await requireAuth();
    return await logTelemetryInternal(assetId, metric, value, unit);
}

export async function getAssetTelemetry(assetId: string, metric?: string, limit: number = 20) {
    await requireAuth();
    return await getAssetTelemetryInternal(assetId, metric, limit);
}

export async function getLatestTelemetry() {
    await requireAuth();
    return await getLatestTelemetryInternal();
}

export async function getSnmpConfig(assetId: string) {
    await requireAuth();
    return await getSnmpConfigInternal(assetId);
}

export async function upsertSnmpConfig(data: {
    assetId: string;
    ip: string;
    community: string;
    oid: string;
    metricName: string;
    intervalSeconds: number;
}) {
    await requireAuth();
    return await upsertSnmpConfigInternal(data);
}
