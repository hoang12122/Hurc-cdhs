'use server';

import { opsDb, metroDb } from '@/lib/prisma';
import { cache, TTL_ANALYTICS } from '@/lib/cache';
import { authenticatedAction } from '../auth-enforcer';

export async function getReliabilityStats(assetId?: string) {
    return authenticatedAction(async () => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        // Use select to get only needed fields — skip large text columns
        const failures = await opsDb.dnfDocument.findMany({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                isArchived: false,
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                priority: true,
            }
        });

        const totalFailures = failures.length;
        
        const mtbf = totalFailures > 0 ? (30 * 24) / totalFailures : 720;

        const closedFailures = failures.filter(f => f.status === 'Đã đóng');
        let totalRepairTime = 0;
        
        closedFailures.forEach(f => {
            const repairTime = (f.updatedAt.getTime() - f.createdAt.getTime()) / (1000 * 60 * 60);
            totalRepairTime += repairTime;
        });

        const mttr = closedFailures.length > 0 ? totalRepairTime / closedFailures.length : 0;

        return {
            totalFailures,
            mtbf: Math.round(mtbf * 10) / 10,
            mttr: Math.round(mttr * 10) / 10,
            reliability: totalFailures > 0 ? Math.round((1 - (totalFailures / 100)) * 100) : 100
        };
    });
}

export async function getSystemHealthOverview() {
    return authenticatedAction(async () => {
        // Use cache for system health (expensive N+1 query)
        return cache.getOrFetch(
            'analytics:system_health',
            async () => {
                // Get assets with select projection
                const assets = await metroDb.asset.findMany({
                    select: { id: true, name: true, subsystem: true }
                });

                // Single batch query for all failures instead of N+1
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                
                const allFailures = await opsDb.dnfDocument.findMany({
                    where: {
                        createdAt: { gte: thirtyDaysAgo },
                        isArchived: false,
                    },
                    select: {
                        id: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        subsystemIds: true,
                    }
                });

                // Calculate per-asset reliability in-memory (no N+1!)
                return assets.map(a => {
                    const assetFailures = allFailures.filter(
                        f => (f.subsystemIds as string[])?.includes(a.subsystem)
                    );
                    const totalFailures = assetFailures.length;
                    const mtbf = totalFailures > 0 ? (30 * 24) / totalFailures : 720;
                    
                    const closedFailures = assetFailures.filter(f => f.status === 'Đã đóng');
                    let totalRepairTime = 0;
                    closedFailures.forEach(f => {
                        totalRepairTime += (f.updatedAt.getTime() - f.createdAt.getTime()) / (1000 * 60 * 60);
                    });
                    const mttr = closedFailures.length > 0 ? totalRepairTime / closedFailures.length : 0;

                    return {
                        id: a.id,
                        name: a.name,
                        subsystem: a.subsystem,
                        totalFailures,
                        mtbf: Math.round(mtbf * 10) / 10,
                        mttr: Math.round(mttr * 10) / 10,
                        reliability: totalFailures > 0 ? Math.round((1 - (totalFailures / 100)) * 100) : 100,
                    };
                });
            },
            TTL_ANALYTICS
        );
    });
}
