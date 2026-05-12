'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { McpFlowViewer } from './mcp-flow-viewer';
import { getMcpTools, callMcpTool, getMcpTraces, clearMcpTraces } from '@/lib/actions/ai.actions';
import { McpTool, McpTraceNode } from '@/lib/services/ai/mcp-service';
import { Loader2, RefreshCw, Play, Search, Settings2, Box, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function McpConsole() {
    const [tools, setTools] = React.useState<McpTool[]>([]);
    const [traces, setTraces] = React.useState<McpTraceNode[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isExecuting, setIsExecuting] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const fetchMcpData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [toolList, traceList] = await Promise.all([
                getMcpTools().catch(() => []),
                getMcpTraces().catch(() => [])
            ]);
            setTools(Array.isArray(toolList) ? toolList : []);
            setTraces(Array.isArray(traceList) ? traceList : []);
        } catch (error) {
            toast({ title: "Lỗi MCP", description: "Không thể lấy dữ liệu từ Grapuco.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchMcpData();
        const interval = setInterval(async () => {
            try {
                const data = await getMcpTraces();
                setTraces(Array.isArray(data) ? data : []);
            } catch { /* ignore polling errors */ }
        }, 3000);
        return () => clearInterval(interval);
    }, [fetchMcpData]);

    const handleCallTool = async (toolName: string) => {
        setIsExecuting(toolName);
        try {
            // In a real debug console, we might have a JSON editor for args.
            // For now, we'll use a placeholder or empty object.
            await callMcpTool(toolName, {});
            toast({ title: "Tool executed", description: `Đã chạy ${toolName} thành công.` });
        } catch (error: any) {
            toast({ title: "Lỗi thực thi", description: error.message, variant: "destructive" });
        } finally {
            setIsExecuting(null);
        }
    };

    const handleClear = async () => {
        await clearMcpTraces();
        setTraces([]);
        toast({ title: "Traces cleared" });
    };

    const filteredTools = tools.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Panel: Tools Inventory */}
            <div className="lg:col-span-4 flex flex-col space-y-4 h-full overflow-hidden">
                <Card className="flex-grow flex flex-col bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-none">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Box className="h-5 w-5 text-indigo-500" />
                                Grapuco Tools
                            </CardTitle>
                            <Button variant="ghost" size="icon" onClick={fetchMcpData} disabled={isLoading}>
                                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                            </Button>
                        </div>
                        <CardDescription className="text-xs">Liệt kê tất cả các công cụ khả dụng trên Grapuco MCP server.</CardDescription>
                        <div className="relative mt-4">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search tools..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60 h-9 text-xs"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ScrollArea className="h-[400px] lg:h-full px-4">
                            <div className="space-y-3 pb-6">
                                {filteredTools.length === 0 ? (
                                    <div className="text-center py-20 opacity-30 italic text-sm">No tools found</div>
                                ) : (
                                    filteredTools.map(tool => (
                                        <div key={tool.name} className="group p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{tool.name}</h4>
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="h-7 px-2 text-[10px] gap-1 font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                                                    onClick={() => handleCallTool(tool.name)}
                                                    disabled={!!isExecuting}
                                                >
                                                    {isExecuting === tool.name ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                                                    Debug
                                                </Button>
                                            </div>
                                            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{tool.description}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {Object.keys(tool.inputSchema?.properties || {}).map(p => (
                                                    <Badge key={p} variant="outline" className="text-[9px] font-mono h-4 px-1 opacity-60">
                                                        {p}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel: Flow Viewer */}
            <div className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                <McpFlowViewer traces={traces} onClear={handleClear} />
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
