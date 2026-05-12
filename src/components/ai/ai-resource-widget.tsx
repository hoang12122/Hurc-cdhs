"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, Database, Cloud, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { getAIStatus } from "@/lib/actions/ai.actions";

export function AiResourceWidget() {
    const [status, setStatus] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    const refreshStatus = async () => {
        try {
            const data = await getAIStatus();
            setStatus(data);
        } catch (e) {
            console.error("Failed to fetch AI status");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        refreshStatus();
        const timer = setInterval(refreshStatus, 30000); // Pulse every 30s
        return () => clearInterval(timer);
    }, []);

    if (loading) return null;

    const isLocalActive = status?.aiBackend === 'nemoclaw';

    return (
        <Card className="shadow-lg border-primary/20 bg-muted/5">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        AI Agent Orchestrator
                    </CardTitle>
                    <Badge variant={isLocalActive ? "outline" : "secondary"} className="text-[10px]">
                        {isLocalActive ? "NATIVE MODE" : "CLOUD FALLBACK"}
                    </Badge>
                </div>
                <CardDescription className="text-xs">Giám sát tài nguyên và trạng thái các bộ não AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Local Engine Status */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5" />
                            Gemma 4 Local (E2B/E4B)
                        </span>
                        <span className={status?.aiBackend === 'nemoclaw' ? "text-green-500 font-medium" : "text-amber-500"}>
                            {status?.aiBackend === 'nemoclaw' ? "Sẵn sàng" : "Tiết kiệm RAM"}
                        </span>
                    </div>
                    <Progress value={isLocalActive ? 75 : 0} className="h-1.5" />
                </div>

                {/* Database/Knowledge Source */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Database className="h-3.5 w-3.5" />
                            Kiến thức (RAG Source)
                        </span>
                        <Badge variant="outline" className="h-4 text-[9px] px-1 font-mono">
                            OFFLINE JSON
                        </Badge>
                    </div>
                </div>

                {/* Active Cloud Link */}
                <div className="flex items-center justify-between p-2 rounded-md bg-background border text-[11px]">
                    <div className="flex items-center gap-2">
                        <Cloud className="h-3 w-3 text-primary" />
                        <span>Gemma 4 31B (Strategic Link)</span>
                    </div>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                </div>

                <div className="pt-1 text-[10px] text-muted-foreground italic flex items-center gap-1.5">
                    <ShieldAlert className="h-3 w-3" />
                    Tối ưu hóa tài nguyên đang được kích hoạt (LRU Unloading).
                </div>
            </CardContent>
        </Card>
    );
}
