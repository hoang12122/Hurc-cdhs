export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { AI_GOVERNANCE_CONFIG } from '@/lib/config/ai-governance-profile';
import { pgEventEmitter } from '@/lib/services/event-emitter';
import { requireAuth } from '@/lib/auth-enforcer';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
    const user = await requireAuth();
    const limit = AI_GOVERNANCE_CONFIG.rateLimits.sseOpenPerMinute;
    if (!checkRateLimit(`sse:${user.id}`, limit, 60_000)) {
        return new Response('Too many event stream connections', { status: 429 });
    }

    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    let closed = false;

    const writeEvent = async (event: string, data: unknown) => {
        if (closed) return;
        try {
            await writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (error) {
            closed = true;
            console.error('[SSE] Failed to write event:', error);
        }
    };

    const handleSystemAlert = (payload: unknown) => { void writeEvent('system_alert', payload); };
    await pgEventEmitter.listen('system_alerts', handleSystemAlert);

    const intervalId = setInterval(() => {
        void writeEvent('ping', {
            time: Date.now(),
            profile: AI_GOVERNANCE_CONFIG.runtimeProfile,
        });
    }, 20_000);

    const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(intervalId);
        void pgEventEmitter.removeListener('system_alerts', handleSystemAlert);
        void writer.close().catch(() => undefined);
    };

    req.signal.addEventListener('abort', cleanup, { once: true });

    return new Response(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Content-Encoding': 'none',
            'X-Accel-Buffering': 'no',
            'X-AI-Runtime-Profile': AI_GOVERNANCE_CONFIG.runtimeProfile,
        },
    });
}
