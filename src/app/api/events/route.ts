export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { pgEventEmitter } from '@/lib/services/event-emitter';

export async function GET(req: NextRequest) {
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    const writeEvent = (event: string, data: any) => {
        try {
            writer.write(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
            console.error("[SSE] Failed to write event:", e);
        }
    };

    const handleSystemAlert = (payload: any) => {
        writeEvent('system_alert', payload);
    };

    // Listen to PostgreSQL channel
    await pgEventEmitter.listen('system_alerts', handleSystemAlert);

    // Keep connection alive
    const intervalId = setInterval(() => {
        writeEvent('ping', { time: Date.now() });
    }, 20000);

    req.signal.addEventListener('abort', () => {
        clearInterval(intervalId);
        pgEventEmitter.removeListener('system_alerts', handleSystemAlert);
        try { writer.close(); } catch (e) {}
    });

    return new Response(stream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Content-Encoding': 'none'
        },
    });
}
