/**
 * User Context Engine — Per-User CRM Personalization
 * 
 * Builds personalized context for each user based on their:
 * - Role & permissions
 * - Department & assigned subsystems
 * - Recent activity (their DNFs, inspections, hazards)
 * - Current tasks and pending items
 * 
 * This context is injected into the AI system prompt so responses
 * are grounded in the user's actual work scope.
 */

import { cache, TTL_OPS_SUMMARY } from '@/lib/cache';
import { opsDb, authDb } from '@/lib/prisma';

interface UserProfile {
    id: string;
    name: string;
    role: string;
    department?: string;
    assignedSubsystems: string[];
    permissions: string[];
}

interface UserActivitySummary {
    recentDnfs: { id: string; description: string; status: string; priority: string | null }[];
    recentInspections: { id: string; title: string; status: string; date: Date }[];
    recentHazards: { id: string; description: string; status: string; riskLevel: string | null }[];
    pendingTasks: number;
    openDnfCount: number;
    openHazardCount: number;
}

/**
 * Build complete personalized context string for a user
 */
export async function buildUserContext(userId: string): Promise<string> {
    return cache.getOrFetch(
        `user_context:${userId}`,
        async () => {
            const [profile, activity] = await Promise.all([
                getUserProfile(userId),
                getUserActivitySummary(userId),
            ]);

            if (!profile) return 'Không có thông tin người dùng.';

            return formatUserContext(profile, activity);
        },
        TTL_OPS_SUMMARY // 30s — fresh enough for current state
    );
}

/**
 * Get user profile from auth DB
 */
async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const user = await authDb.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                role: true,
                department: true,
                assignedSubsystems: true,
                permissions: true,
            },
        });

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            department: user.department || undefined,
            assignedSubsystems: user.assignedSubsystems || [],
            permissions: user.permissions || [],
        };
    } catch {
        return null;
    }
}

/**
 * Get user's recent activity from ops DB
 */
async function getUserActivitySummary(userId: string): Promise<UserActivitySummary> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
        const [recentDnfs, recentInspections, recentHazards, openDnfCount, openHazardCount] = await Promise.all([
            // Recent DNFs created by or assigned to user (last 7 days)
            opsDb.dnfDocument.findMany({
                where: {
                    isArchived: false,
                    createdAt: { gte: sevenDaysAgo },
                    OR: [
                        { createdById: userId },
                        { assignedTo: userId },
                    ],
                },
                select: {
                    id: true,
                    descriptionOfFailure: true,
                    status: true,
                    priority: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            // Recent inspections by user
            opsDb.inspectionDetail.findMany({
                where: {
                    isArchived: false,
                    date: { gte: sevenDaysAgo },
                },
                select: {
                    id: true,
                    title: true,
                    status: true,
                    date: true,
                    inspector: true,
                },
                orderBy: { date: 'desc' },
                take: 5,
            }),
            // Recent hazards assigned to user
            opsDb.hazardRecord.findMany({
                where: {
                    isArchived: false,
                    createdAt: { gte: sevenDaysAgo },
                    OR: [
                        { createdById: userId },
                        { responsiblePersonOrUnit: userId },
                    ],
                },
                select: {
                    id: true,
                    description: true,
                    status: true,
                    riskLevelId: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            // Count open DNFs for this user
            opsDb.dnfDocument.count({
                where: {
                    isArchived: false,
                    status: { notIn: ['Đã đóng', 'Hủy'] },
                    OR: [
                        { createdById: userId },
                        { assignedTo: userId },
                    ],
                },
            }),
            // Count open hazards for this user
            opsDb.hazardRecord.count({
                where: {
                    isArchived: false,
                    status: { notIn: ['Đã đóng', 'Hủy', 'Đã xử lý/Giám sát'] },
                    OR: [
                        { createdById: userId },
                        { responsiblePersonOrUnit: userId },
                    ],
                },
            }),
        ]);

        return {
            recentDnfs: recentDnfs.map((d: any) => ({
                id: d.id,
                description: d.descriptionOfFailure.substring(0, 60),
                status: d.status,
                priority: d.priority,
            })),
            recentInspections: recentInspections.map((i: any) => ({
                id: i.id,
                title: i.title,
                status: i.status,
                date: i.date,
            })),
            recentHazards: recentHazards.map((h: any) => ({
                id: h.id,
                description: h.description.substring(0, 60),
                status: h.status,
                riskLevel: h.riskLevelId,
            })),
            pendingTasks: openDnfCount + openHazardCount,
            openDnfCount,
            openHazardCount,
        };
    } catch (error) {
        console.warn('Failed to fetch user activity:', error);
        return {
            recentDnfs: [],
            recentInspections: [],
            recentHazards: [],
            pendingTasks: 0,
            openDnfCount: 0,
            openHazardCount: 0,
        };
    }
}

/**
 * Format context into structured text for system prompt injection
 */
function formatUserContext(profile: UserProfile, activity: UserActivitySummary): string {
    const lines: string[] = [];

    // User identity
    lines.push(`- Tên: ${profile.name}`);
    lines.push(`- Vai trò: ${profile.role}`);
    if (profile.department) lines.push(`- Phòng ban: ${profile.department}`);
    if (profile.assignedSubsystems.length > 0) {
        lines.push(`- Hệ thống phụ trách: ${profile.assignedSubsystems.join(', ')}`);
    }

    // Current workload
    lines.push(`\n### Tình trạng công việc:`);
    lines.push(`- Sự cố (DNF) đang mở: ${activity.openDnfCount}`);
    lines.push(`- Mối nguy đang xử lý: ${activity.openHazardCount}`);
    lines.push(`- Tổng nhiệm vụ đang chờ: ${activity.pendingTasks}`);

    // Recent DNFs
    if (activity.recentDnfs.length > 0) {
        lines.push(`\n### DNF gần đây (7 ngày):`);
        activity.recentDnfs.forEach(d => {
            lines.push(`- [${d.id}] ${d.description} | Trạng thái: ${d.status} | Ưu tiên: ${d.priority || 'N/A'}`);
        });
    }

    // Recent inspections
    if (activity.recentInspections.length > 0) {
        lines.push(`\n### Kiểm tra gần đây:`);
        activity.recentInspections.forEach(i => {
            lines.push(`- [${i.id}] ${i.title} | ${i.status}`);
        });
    }

    // Recent hazards
    if (activity.recentHazards.length > 0) {
        lines.push(`\n### Mối nguy gần đây:`);
        activity.recentHazards.forEach(h => {
            lines.push(`- [${h.id}] ${h.description} | ${h.status} | Risk: ${h.riskLevel || 'N/A'}`);
        });
    }

    return lines.join('\n');
}

/**
 * Invalidate a user's cached context (call on profile or data changes)
 */
export function invalidateUserContext(userId: string): void {
    cache.invalidate(`user_context:${userId}`);
}

/**
 * Invalidate ALL user contexts (call on bulk data changes)
 */
export function invalidateAllUserContexts(): void {
    cache.invalidatePrefix('user_context:');
}
