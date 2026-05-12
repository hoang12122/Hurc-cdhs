'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
    BrainCircuit, Loader2, TrendingUp, AlertTriangle, 
    RefreshCw, Shield, Activity, Zap, BarChart3 
} from 'lucide-react';
import { predictiveInsights, getAIStatus, syncDataToTrustGraph } from '@/lib/actions/ai.actions';
import { useToast } from '@/hooks/use-toast';

export function AiInsightsPanel() {
    const [insights, setInsights] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSyncing, setIsSyncing] = React.useState(false);
    const [aiStatus, setAiStatus] = React.useState<any>(null);
    const [insightSource, setInsightSource] = React.useState<string>('');
    const { toast } = useToast();

    React.useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const status = await getAIStatus();
            setAiStatus(status);
        } catch { /* ignore */ }
    };

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        try {
            const result = await predictiveInsights();
            if (result.error) {
                toast({ title: "Lỗi", description: result.error, variant: "destructive" });
            } else {
                setInsights(typeof result.insights === 'string' ? result.insights : JSON.stringify(result.insights));
                setInsightSource(result.source || 'unknown');
            }
        } catch (error: any) {
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncDataToTrustGraph();
            if ('error' in result && result.error) {
                toast({ title: "Lỗi Sync", description: String(result.error), variant: "destructive" });
            } else {
                toast({ 
                    title: "Đồng bộ thành công", 
                    description: `Đã sync ${result.synced} records (${result.errors} lỗi)` 
                });
                loadStatus();
            }
        } catch (error: any) {
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* AI Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatusCard
                    icon={<Zap className="h-5 w-5" />}
                    title="NemoClaw"
                    status={aiStatus?.nemoclaw?.available ? 'Online' : 'Offline'}
                    color={aiStatus?.nemoclaw?.available ? 'emerald' : 'slate'}
                    detail={aiStatus?.nemoclaw?.available ? `${aiStatus.nemoclaw.latencyMs}ms` : 'Không có kết nối'}
                />
                <StatusCard
                    icon={<BrainCircuit className="h-5 w-5" />}
                    title="TrustGraph"
                    status={aiStatus?.trustgraph?.available ? 'Online' : 'Offline'}
                    color={aiStatus?.trustgraph?.available ? 'blue' : 'slate'}
                    detail={aiStatus?.trustgraph?.available ? `${aiStatus.trustgraph.latencyMs}ms` : 'Đang dùng fallback'}
                />
                <StatusCard
                    icon={<Activity className="h-5 w-5" />}
                    title={aiStatus?.gemini?.available ? 'Gemini' : 'HuggingFace'}
                    status="Available"
                    color="amber"
                    detail="Cloud Fallback"
                />
                <StatusCard
                    icon={<Shield className="h-5 w-5" />}
                    title="Active Engine"
                    status={aiStatus?.primaryBackend || '...'}
                    color="indigo"
                    detail="Đang xử lý chính"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button
                    onClick={handleGenerateInsights}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                    Tạo Dự báo AI
                </Button>
                <Button
                    variant="outline"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                    {isSyncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Sync Data → TrustGraph
                </Button>
                <Button variant="ghost" size="sm" onClick={loadStatus}>
                    <RefreshCw className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Insights Display */}
            {insights && (
                <Card className="border-emerald-100 dark:border-emerald-900/30">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-emerald-600" />
                                Dự báo & Insights AI
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                <Zap className="h-2.5 w-2.5 mr-1" />
                                {insightSource}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="max-h-[600px]">
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                                {insights}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!insights && !isLoading && (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <div className="inline-flex p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl mb-4">
                        <TrendingUp className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">AI Insights & Predictions</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Phân tích xu hướng sự cố, dự báo rủi ro, và nhận insights từ dữ liệu bảo trì.
                        Nhấn &quot;Tạo Dự báo AI&quot; để bắt đầu.
                    </p>
                </div>
            )}
        </div>
    );
}

// ============ Status Card Component ============

function StatusCard({ icon, title, status, color, detail }: { 
    icon: React.ReactNode; 
    title: string; 
    status: string; 
    color: string; 
    detail: string;
}) {
    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-950/20 dark:to-green-950/20 dark:border-emerald-800/30',
        blue: 'from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/20 dark:to-cyan-950/20 dark:border-blue-800/30',
        amber: 'from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-950/20 dark:to-yellow-950/20 dark:border-amber-800/30',
        indigo: 'from-indigo-50 to-violet-50 border-indigo-200 dark:from-indigo-950/20 dark:to-violet-950/20 dark:border-indigo-800/30',
        slate: 'from-slate-50 to-gray-50 border-slate-200 dark:from-slate-950/20 dark:to-gray-950/20 dark:border-slate-800/30',
    };

    const iconColorMap: Record<string, string> = {
        emerald: 'text-emerald-600',
        blue: 'text-blue-600',
        amber: 'text-amber-600',
        indigo: 'text-indigo-600',
        slate: 'text-slate-400',
    };

    return (
        <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.slate} border`}>
            <div className="flex items-center gap-2 mb-2">
                <div className={iconColorMap[color] || iconColorMap.slate}>{icon}</div>
                <span className="text-sm font-bold">{title}</span>
            </div>
            <p className="text-lg font-extrabold tracking-tight">{status}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{detail}</p>
        </div>
    );
}
