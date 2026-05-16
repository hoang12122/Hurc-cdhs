/**
 * AI SEMANTIC CHUNKER (HURC1 AI-HARDENING)
 * Splits text into logical chunks based on punctuation and semantic boundaries.
 */

export function semanticChunking(text: string, maxChunkSize: number = 1000): string[] {
    // 1. Chia theo đoạn văn (Paragraphs)
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const para of paragraphs) {
        // Nếu đoạn văn đơn lẻ đã quá dài, chia nhỏ hơn theo câu
        if (para.length > maxChunkSize) {
            const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
            for (const sentence of sentences) {
                if ((currentChunk + sentence).length > maxChunkSize) {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = sentence;
                } else {
                    currentChunk += " " + sentence;
                }
            }
        } else {
            if ((currentChunk + para).length > maxChunkSize) {
                if (currentChunk) chunks.push(currentChunk.trim());
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? "\n\n" : "") + para;
            }
        }
    }

    if (currentChunk) chunks.push(currentChunk.trim());
    
    // Inject Metadata (Brutal Audit Fix: Prevent context drift)
    const dateStr = new Date().toISOString().split('T')[0];
    const metadataPrefix = `[DOC_META: Date=${dateStr}] `;
    
    return chunks.map(c => metadataPrefix + c);
}
