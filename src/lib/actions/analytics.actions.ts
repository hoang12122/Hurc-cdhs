'use server';

import { getReliabilityStatsInternal, getSystemHealthOverviewInternal } from '../services/analytics-service';
import { requireAuth } from '../auth-enforcer';

export async function getReliabilityStats(assetId?: string) {
    await requireAuth();
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    return await getReliabilityStatsInternal(thirtyDaysAgo);
}

export async function getSystemHealthOverview() {
    await requireAuth();
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    return await getSystemHealthOverviewInternal(thirtyDaysAgo);
}
