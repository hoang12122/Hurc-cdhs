import { NextResponse } from 'next/server';
import { storeExperience } from '@/lib/services/agent-memory';
import { internalLogSystemEvent } from '@/lib/services/log-service';

export async function POST(req: Request) {
    try {
        const { userId, topic, context, importance, isPositive, feedbackText } = await req.json();

        // 1. Lưu vào Agent Memory (TencentDB Agent Memory)
        // Nếu là Dislike (isPositive = false), ta lưu với importance cao để AI ghi nhớ bài học
        const finalImportance = isPositive ? (importance || 5) : 10;
        const memoryContent = isPositive 
            ? context 
            : `[ĐÍNH CHÍNH TỪ CEO]: ${feedbackText}. Câu trả lời cũ sai: ${context}`;

        await storeExperience(userId, topic, memoryContent, finalImportance);

        // 2. Log sự kiện để admin theo dõi
        await internalLogSystemEvent(
            "AI_FEEDBACK_RECEIVED",
            isPositive ? "INFO" : "WARNING",
            `CEO phản hồi AI trên chủ đề: ${topic}. Phản hồi: ${feedbackText || (isPositive ? 'Hữu ích' : 'Không hữu ích')}`,
            "ai"
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
