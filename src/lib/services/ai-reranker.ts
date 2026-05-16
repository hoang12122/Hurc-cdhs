/**
 * AI RERANKER (HURC1 AI-HARDENING)
 * Selects the most relevant chunks from a pool to fit within Context Window.
 */

export interface Chunk {
    text: string;
    score: number;
}

export function rerankChunks(chunks: Chunk[], query: string, topK: number = 5): string[] {
    // Trong môi trường local, ta sử dụng logic dựa trên keyword overlap và relevance scoring
    // Nếu có mô hình BGE-Reranker local, ta sẽ gọi API tại đây.
    
    const queryTerms = query.toLowerCase().split(/\s+/);
    
    const ranked = chunks.map(chunk => {
        let matchScore = 0;
        const text = chunk.text.toLowerCase();
        
        queryTerms.forEach(term => {
            if (text.includes(term)) matchScore += 1;
        });
        
        // PHASE 7 - RECENCY BOOST (Brutal Audit Fix: Prefer Newer Data)
        let recencyBoost = 1.0;
        const metaMatch = chunk.text.match(/\[DOC_META: Date=(\d{4}-\d{2}-\d{2})\]/);
        if (metaMatch) {
            const docDate = new Date(metaMatch[1]).getTime();
            const now = Date.now();
            const ageDays = (now - docDate) / (1000 * 60 * 60 * 24);
            // Boost newer docs (max 20% boost for today, decaying over 1 year)
            recencyBoost = 1.0 + Math.max(0, 0.2 * (1 - ageDays / 365));
        }

        return { ...chunk, finalScore: chunk.score * (1 + matchScore) * recencyBoost };
    });
    
    const sorted = ranked.sort((a, b) => b.finalScore - a.finalScore);
    
    // PHASE 6 - SIMILARITY CUTOFF (Brutal Audit Fix: Remove Garbage)
    const SIMILARITY_THRESHOLD = 0.5;
    const filtered = sorted.filter(r => r.finalScore >= SIMILARITY_THRESHOLD);
    
    if (filtered.length === 0) {
        console.warn(`⚠️ [AI-RERANKER] No chunks met threshold (${SIMILARITY_THRESHOLD}).`);
        return [];
    }

    return filtered.slice(0, topK).map(c => c.text);
}
