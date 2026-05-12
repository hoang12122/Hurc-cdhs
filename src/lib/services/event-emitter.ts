
type EventCallback = (payload: any) => void;

class PgEventEmitter {
    private callbacks: Map<string, Set<EventCallback>> = new Map();

    constructor() {
        const isOffline = process.env.IS_DATABASE_OFFLINE === 'true';
        if (isOffline) {
            console.log('[PgEventEmitter] Initialized in Mock Mode (No PostgreSQL needed).');
        } else {
            console.log('[PgEventEmitter] Initialized in PostgreSQL Mode (Ready for Real-time Events).');
        }
    }

    public async listen(channel: string, callback: EventCallback) {
        if (!this.callbacks.has(channel)) {
            this.callbacks.set(channel, new Set());
        }
        this.callbacks.get(channel)!.add(callback);
    }

    public async removeListener(channel: string, callback: EventCallback) {
        const channelCallbacks = this.callbacks.get(channel);
        if (channelCallbacks) {
            channelCallbacks.delete(callback);
            if (channelCallbacks.size === 0) {
                this.callbacks.delete(channel);
            }
        }
    }

    /**
     * Helper to manually trigger an event in mock mode (useful for testing UI)
     */
    public emit(channel: string, payload: any) {
        const channelCallbacks = this.callbacks.get(channel);
        if (channelCallbacks) {
            channelCallbacks.forEach(cb => cb(payload));
        }
    }
}

// Global singleton to prevent multiple connections in dev mode
const globalForEventEmitter = globalThis as unknown as {
    pgEventEmitter: PgEventEmitter | undefined;
};

export const pgEventEmitter = globalForEventEmitter.pgEventEmitter ?? new PgEventEmitter();

if (process.env.NODE_ENV !== 'production') {
    globalForEventEmitter.pgEventEmitter = pgEventEmitter;
}
