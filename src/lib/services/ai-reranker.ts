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
        
        return { ...chunk, finalScore: chunk.score * (1 + matchScore) };
    });
    
    return ranked
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, topK)
        .map(c => c.text);
}
