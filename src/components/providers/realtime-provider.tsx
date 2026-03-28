"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let retryTimeout: NodeJS.Timeout;

        const connect = () => {
            eventSource = new EventSource("/api/events");

            eventSource.onopen = () => {
                console.log("[SSE] Connected to real-time events channel.");
                setIsConnected(true);
            };

            eventSource.addEventListener("system_alert", (event: MessageEvent) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    toast({
                        title: data.title || "Cảnh báo Hệ thống",
                        description: data.message || "Đã có sự kiện mới được ghi nhận.",
                        variant: data.level === 'CRITICAL' ? 'destructive' : 'default',
                        duration: data.level === 'CRITICAL' ? 10000 : 5000,
                    });
                } catch (e) {
                    console.error("Error parsing SSE data", e);
                }
            });

            eventSource.onerror = (err) => {
                console.error("[SSE] Connection lost. Reconnecting in 5s...");
                setIsConnected(false);
                if (eventSource) {
                    eventSource.close();
                }
                retryTimeout = setTimeout(connect, 5000);
            };
        };

        connect();

        return () => {
            clearTimeout(retryTimeout);
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [toast]);

    return <>{children}</>;
}
