import { z } from 'zod';

/**
 * DB SCHEMA GUARD (HURC1 VALIDATION)
 * Strict schema definitions for JSON-DB collections.
 */

export const DnfSchema = z.object({
    id: z.string(),
    failureReportNo: z.string().optional(),
    status: z.string(),
    locationOfFailure: z.string().optional(),
    descriptionOfFailure: z.string().optional(),
    priority: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
});

export const HazardSchema = z.object({
    id: z.string(),
    status: z.string(),
    description: z.string().optional(),
    riskLevelId: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const MemorySchema = z.object({
    id: z.string(),
    userId: z.string(),
    topic: z.string(),
    content: z.string(),
    importance: z.number().min(1).max(10),
    timestamp: z.string(),
});

export const DbSchema = z.record(z.array(z.any()));

export function validateCollection(name: string, data: any[]) {
    const schemas: Record<string, z.ZodTypeAny> = {
        'dnf_documents': DnfSchema,
        'hazards': HazardSchema,
        'ai_longterm_memory': MemorySchema,
    };

    const schema = schemas[name];
    if (!schema) return { success: true }; // Skip if no schema defined

    const result = z.array(schema).safeParse(data);
    return {
        success: result.success,
        errors: result.success ? [] : result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
    };
}
