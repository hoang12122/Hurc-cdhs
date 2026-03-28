'use server';

import { revalidatePath } from 'next/cache';
import { type Improvement } from '@/lib/constants';
import { logSystemEvent } from './system.actions';
import { opsDb } from '@/lib/prisma';

export async function getImprovements(): Promise<Improvement[]> {
    const improvements = await opsDb.improvement.findMany();
    return improvements.map(imp => ({
        ...imp,
        submissionDate: imp.submissionDate.toISOString()
    })) as unknown as Improvement[];
}

export async function addImprovement(improvement: Omit<Improvement, 'id' | 'updatedAt' | 'createdById'>): Promise<Improvement> {
    const { getCurrentUser } = await import('./auth.actions');
    const user = await getCurrentUser();
    
    const newRecord = await opsDb.improvement.create({
        data: {
            id: `IMP-${Date.now()}`,
            title: improvement.title,
            description: improvement.description,
            category: improvement.category,
            status: improvement.status,
            submittedBy: improvement.submittedBy,
            createdById: user?.id || 'system'
        }
    });

    await logSystemEvent('CREATE_IMPROVEMENT', 'INFO', `Created new improvement: ${newRecord.title}`);
    revalidatePath('/improvements');
    return {
        ...newRecord,
        submissionDate: newRecord.submissionDate.toISOString()
    } as unknown as Improvement;
}

export async function updateImprovement(updatedImprovement: Improvement): Promise<void> {
    await opsDb.improvement.update({
        where: { id: updatedImprovement.id },
        data: {
            title: updatedImprovement.title,
            description: updatedImprovement.description,
            status: updatedImprovement.status,
        }
    });

    await logSystemEvent('UPDATE_IMPROVEMENT', 'INFO', `Updated improvement: ${updatedImprovement.title}`);
    revalidatePath('/improvements');
    revalidatePath(`/improvements/${updatedImprovement.id}`);
}

export async function deleteImprovement(id: string): Promise<void> {
    const toDelete = await opsDb.improvement.findUnique({ where: { id } });
    
    if (toDelete) {
        await opsDb.improvement.delete({ where: { id } });
        await logSystemEvent('DELETE_IMPROVEMENT', 'WARNING', `Deleted improvement: ${toDelete.title}`);
    }
    revalidatePath('/improvements');
}
