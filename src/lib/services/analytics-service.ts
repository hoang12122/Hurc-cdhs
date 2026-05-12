import { jsonDb } from '../db/json-db';

/**
 * ANALYTICS SERVICE — Hardened Atomic JSON
 */

export async function getReliabilityStatsInternal(thirtyDaysAgo: Date) {
    const allDnfs = await jsonDb.getCollection<any>('dnf_documents');
    const failures = allDnfs.filter((f: any) => 
        new Date(f.createdAt) >= thirtyDaysAgo && !f.isArchived
    );

    const totalFailures = failures.length;
    const mtbf = totalFailures > 0 ? (30 * 24) / totalFailures : 0;

    const closedFailures = failures.filter((f: any) => f.status === 'Đã đóng');
    let totalRepairTime = 0;
    
    closedFailures.forEach((f: any) => {
        totalRepairTime += (new Date(f.updatedAt).getTime() - new Date(f.createdAt).getTime()) / (1000 * 60 * 60);
    });

    const mttr = closedFailures.length > 0 ? totalRepairTime / closedFailures.length : 0;

    return {
        totalFailures,
        mtbf: Math.round(mtbf * 10) / 10,
        mttr: Math.round(mttr * 10) / 10,
        reliability: totalFailures > 0 ? Math.round((1 - (totalFailures / 100)) * 100) : 100
    };
}

export async function getSystemHealthOverviewInternal(thirtyDaysAgo: Date) {
    const [assets, allDnfs] = await Promise.all([
        jsonDb.getCollection<any>('assets'),
        jsonDb.getCollection<any>('dnf_documents')
    ]);

    const allFailures = allDnfs.filter((f: any) => 
        new Date(f.createdAt) >= thirtyDaysAgo && !f.isArchived
    );

    const subsystems = ['rolling-stock', 'power', 'signaling', 'track', 'afc', 'telecom'];
    
    // Map health by subsystem
    return subsystems.map(sub => {
        const assetFailures = allFailures.filter(
            (f: any) => (f.subsystemIds as string[])?.includes(sub)
        );
        const totalFailures = assetFailures.length;
        const mtbf = totalFailures > 0 ? (30 * 24) / totalFailures : 0;
        
        const closedFailures = assetFailures.filter((f: any) => f.status === 'Đã đóng');
        let totalRepairTime = 0;
        closedFailures.forEach((f: any) => {
            totalRepairTime += (new Date(f.updatedAt).getTime() - new Date(f.createdAt).getTime()) / (1000 * 60 * 60);
        });
        const mttr = closedFailures.length > 0 ? totalRepairTime / closedFailures.length : 0;

        return {
            id: `sub-${sub}`,
            name: `${sub.toUpperCase()} System`,
            subsystem: sub,
            totalFailures,
            mtbf: Math.round(mtbf * 10) / 10,
            mttr: Math.round(mttr * 10) / 10,
            reliability: totalFailures > 0 ? Math.round((1 - (totalFailures / 100)) * 100) : 100,
        };
    });
}
