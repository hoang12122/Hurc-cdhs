import { NextResponse } from 'next/server';
import { storeExperience } from '@/lib/services/agent-memory';
import { internalLogSystemEvent } from '@/lib/services/log-service';
import { requirePermission } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_TOPIC_LENGTH = 300;
const MAX_CONTEXT_LENGTH = 8_000;
const MAX_FEEDBACK_LENGTH = 2_000;

function normalizeText(value: unknown, maxLength: number): string {
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(req: Request) {
    try {
        const user = await requirePermission('ai:use');
        if (!checkRateLimit(`ai_feedback:${user.id}`, 20, 60_000)) {
            return NextResponse.json({ error: 'Too many feedback requests' }, { status: 429 });
        }

        const body = await req.json();
        const topic = normalizeText(body?.topic, MAX_TOPIC_LENGTH);
        const context = normalizeText(body?.context, MAX_CONTEXT_LENGTH);
        const feedbackText = normalizeText(body?.feedbackText, MAX_FEEDBACK_LENGTH);
        const isPositive = body?.isPositive === true;

        if (!topic || !context) {
            return NextResponse.json({ error: 'Topic and context are required' }, { status: 400 });
        }

        const memoryContent = isPositive
            ? context
            : `[PHẢN HỒI NGƯỜI DÙNG - CHỜ KIỂM DUYỆ]: ${feedbackText || 'Không hữu ích'}. Nội dung cần xem lại: ${context}`;

        await storeExperience(user.id, topic, memoryContent, isPositive ? 5 : 8, {
            sourceType: 'system-event',
            sourceId: `feedback:${user.id}`,
            confidence: isPositive ? 0.7 : 0.4,
            humanApproved: false,
        });

        await internalLogSystemEvent(
            'AI_FEEDBACK_RECEIVED',
            isPositive ? 'INFO' : 'WARNING',
            `User ${user.id} submitted ${isPositive ? 'positive' : 'negative'} AI feedback for topic: ${topic}`,
            'ai'
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error?.message?.toLowerCase().includes('permission') || error?.message?.toLowerCase().includes('auth') ? 403 : 500;
        return NextResponse.json({ error: status === 500 ? 'Unable to process feedback' : 'Forbidden' }, { status });
    }
}
