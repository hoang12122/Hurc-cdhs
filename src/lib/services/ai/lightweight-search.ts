import { readDb } from '../../json-db-service';

/**
 * LIGHTWEIGHT SEARCH (Resource-Friendly RAG Fallback)
 * Performs fast keyword and pattern-based matching over db.json
 * to provide context to AI agents without heavy vector computation.
 */
export async function performLightweightSearch(query: string, options: { 
    limit?: number, 
    threshold?: number 
} = {}) {
    const db = readDb();
    const limit = options.limit || 5;
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    
    if (keywords.length === 0) return [];

    const results: any[] = [];

    // Search through DNFs
    if (db.dnfs) {
        db.dnfs.forEach((dnf: any) => {
            const score = calculateMatchScore(JSON.stringify(dnf).toLowerCase(), keywords);
            if (score > 0) results.push({ type: 'DNF', data: dnf, score });
        });
    }

    // Search through Hazards
    if (db.hazards) {
        db.hazards.forEach((hazard: any) => {
            const score = calculateMatchScore(JSON.stringify(hazard).toLowerCase(), keywords);
            if (score > 0) results.push({ type: 'Hazard', data: hazard, score });
        });
    }

    // Search through Assets
    if (db.assets) {
        db.assets.forEach((asset: any) => {
            const score = calculateMatchScore(JSON.stringify(asset).toLowerCase(), keywords);
            if (score > 0) results.push({ type: 'Asset', data: asset, score });
        });
    }

    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
}

function calculateMatchScore(text: string, keywords: string[]): number {
    let score = 0;
    keywords.forEach(word => {
        if (text.includes(word)) score += 1;
    });
    return score;
}

/**
 * Format search results into a compact context string for AI consumption.
 */
export function formatLightweightContext(results: any[]): string {
    if (results.length === 0) return "Không tìm thấy dữ liệu liên quan trong hệ thống cục bộ.";
    
    return results.map(res => {
        const d = res.data;
        if (res.type === 'DNF') return `[Sự cố ${d.id}] ${d.descriptionOfFailure} (Độ ưu tiên: ${d.priority})`;
        if (res.type === 'Hazard') return `[Mối nguy ${d.id}] ${d.description} (Mức độ rủi ro: ${d.riskLevelId})`;
        if (res.type === 'Asset') return `[Tài sản ${d.id}] ${d.name} (Hệ thống: ${d.subsystem})`;
        return JSON.stringify(d);
    }).join('\n');
}
