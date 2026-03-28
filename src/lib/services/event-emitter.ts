import { Client } from 'pg';

type EventCallback = (payload: any) => void;

class PgEventEmitter {
    private client: Client | null = null;
    private callbacks: Map<string, Set<EventCallback>> = new Map();
    private isConnected = false;
    private isConnecting = false;

    constructor() {
        this.connect();
    }

    private async connect() {
        if (!process.env.DATABASE_URL || this.isConnecting) return;
        this.isConnecting = true;
        
        try {
            this.client = new Client({
                connectionString: process.env.DATABASE_URL,
            });
            await this.client.connect();
            this.isConnected = true;
            this.isConnecting = false;
            console.log('[PgEventEmitter] Connected to database for LISTEN.');

            this.client.on('notification', (msg) => {
                const channel = msg.channel;
                const payloadStr = msg.payload;
                
                let payload = payloadStr;
                try {
                    payload = payloadStr ? JSON.parse(payloadStr) : null;
                } catch (e) {
                    // Ignore JSON parse errors
                }

                const channelCallbacks = this.callbacks.get(channel);
                if (channelCallbacks) {
                    channelCallbacks.forEach(cb => cb(payload));
                }
            });

            this.client.on('error', (err) => {
                console.error("[PgEventEmitter] Client Error:", err);
                this.isConnected = false;
                this.reconnect();
            });

            // Re-listen to existing channels after reconnect
            for (const channel of this.callbacks.keys()) {
                await this.client.query(`LISTEN ${channel}`);
            }

        } catch (e) {
            console.error("[PgEventEmitter] Failed to connect:", e);
            this.isConnecting = false;
            this.reconnect();
        }
    }

    private reconnect() {
        if (this.client) {
            try { this.client.end(); } catch (e) {}
            this.client = null;
        }
        setTimeout(() => this.connect(), 5000);
    }

    public async listen(channel: string, callback: EventCallback) {
        if (!this.callbacks.has(channel)) {
            this.callbacks.set(channel, new Set());
            if (this.isConnected && this.client) {
                try {
                    await this.client.query(`LISTEN ${channel}`);
                } catch (e) {
                    console.error(`[PgEventEmitter] Error LISTEN ${channel}:`, e);
                }
            }
        }
        this.callbacks.get(channel)!.add(callback);
    }

    public async removeListener(channel: string, callback: EventCallback) {
        const channelCallbacks = this.callbacks.get(channel);
        if (channelCallbacks) {
            channelCallbacks.delete(callback);
            if (channelCallbacks.size === 0) {
                this.callbacks.delete(channel);
                if (this.isConnected && this.client) {
                    try {
                        await this.client.query(`UNLISTEN ${channel}`);
                    } catch (e) {
                        console.error(`[PgEventEmitter] Error UNLISTEN ${channel}:`, e);
                    }
                }
            }
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
