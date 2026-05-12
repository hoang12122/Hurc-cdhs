'use client';

import * as React from 'react';
import { McpTraceNode } from '@/lib/services/ai/mcp-service';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Terminal, Network, Clock, Database, Brain, AlertCircle, CheckCircle2, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface McpFlowViewerProps {
    traces: McpTraceNode[];
    onClear?: () => void;
}

export function McpFlowViewer({ traces, onClear }: McpFlowViewerProps) {
    const [viewMode, setViewMode] = React.useState<'flow' | 'log'>('flow');
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [traces]);

    return (
        <div className={cn(
            "flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition-all duration-500 shadow-2xl shadow-indigo-500/10",
            isFullscreen ? "fixed inset-4 z-50" : "h-full min-h-[500px]"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        {viewMode === 'flow' ? <Network className="h-5 w-5 text-indigo-400" /> : <Terminal className="h-5 w-5 text-indigo-400" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">MCP Trace & Debug</h3>
                        <p className="text-[10px] text-slate-500 font-mono">{traces.length} steps execution flow</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-800 p-1 rounded-xl mr-2">
                        <button 
                            onClick={() => setViewMode('flow')}
                            className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", 
                                viewMode === 'flow' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" : "text-slate-400 hover:text-slate-200")}
                        >
                            Visual Flow
                        </button>
                        <button 
                            onClick={() => setViewMode('log')}
                            className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", 
                                viewMode === 'log' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40" : "text-slate-400 hover:text-slate-200")}
                        >
                            Debug Log
                        </button>
                    </div>
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                    >
                        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </button>
                    {onClear && (
                        <button 
                            onClick={onClear}
                            className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider px-2"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-hidden relative">
                {viewMode === 'flow' ? (
                    <div className="h-full w-full bg-[#020617] overflow-auto p-12 scrollbar-none flex flex-col items-center">
                        {traces.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-40">
                                <div className="w-24 h-24 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center">
                                    <Network className="h-10 w-10" />
                                </div>
                                <p className="text-sm font-mono tracking-widest uppercase">Waiting for trace data...</p>
                            </div>
                        ) : (
                            <div className="relative flex flex-col items-center space-y-16 py-8">
                                {traces.map((node, index) => (
                                    <React.Fragment key={node.id}>
                                        <FlowNode node={node} />
                                        {index < traces.length - 1 && (
                                            <div className="h-16 w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent relative">
                                                <ChevronRight className="h-4 w-4 text-indigo-400 absolute -bottom-2 -left-[7px] rotate-90 animate-bounce" />
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <ScrollArea className="h-full p-6 font-mono text-sm" ref={scrollRef}>
                        <div className="space-y-3">
                            {traces.map((node, i) => (
                                <div key={node.id} className="group border-l-2 border-slate-800 pl-4 py-1 hover:border-indigo-500 transition-colors">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] text-slate-600">[{new Date(node.timestamp).toLocaleTimeString()}]</span>
                                        <Badge variant="outline" className={cn("text-[9px] uppercase tracking-tighter h-4 px-1 border-none", 
                                            node.type === 'tool_call' ? "bg-blue-500/10 text-blue-400" :
                                            node.type === 'tool_output' ? "bg-emerald-500/10 text-emerald-400" :
                                            node.type === 'error' ? "bg-red-500/10 text-red-400" :
                                            "bg-indigo-500/10 text-indigo-400"
                                        )}>
                                            {node.type}
                                        </Badge>
                                        <span className="text-xs font-bold text-slate-400">{node.label}</span>
                                    </div>
                                    <pre className="text-[11px] text-slate-500 bg-slate-900/50 p-2 rounded-lg mt-1 border border-slate-800/50 overflow-x-auto whitespace-pre-wrap">
                                        {node.content}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* Status Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Grapuco SSE Active</span>
                    </div>
                    <div className="h-3 w-px bg-slate-800" />
                    <span className="text-[10px] text-slate-500 font-mono">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                    <Clock className="h-3 w-3" />
                    <span>Real-time Stream Engine v1.0</span>
                </div>
            </div>
        </div>
    );
}

function FlowNode({ node }: { node: McpTraceNode }) {
    const iconMap = {
        input: <ChevronRight className="h-5 w-5 text-white" />,
        thought: <Brain className="h-5 w-5 text-indigo-400" />,
        tool_call: <Database className="h-5 w-5 text-blue-400" />,
        tool_output: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
        error: <AlertCircle className="h-5 w-5 text-red-400" />,
        final_answer: <CheckCircle2 className="h-5 w-5 text-purple-400" />,
    };

    const gradientMap = {
        input: "from-slate-700 to-slate-900",
        thought: "from-indigo-600/20 to-indigo-950/20",
        tool_call: "from-blue-600/20 to-blue-950/20",
        tool_output: "from-emerald-600/20 to-emerald-950/20",
        error: "from-red-600/20 to-red-950/20",
        final_answer: "from-purple-600/20 to-purple-950/20",
    };

    return (
        <div className={cn(
            "relative group flex items-start gap-4 p-5 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-2xl max-w-md w-full",
            node.type === 'tool_call' ? "border-blue-500/30 shadow-blue-500/10" :
            node.type === 'tool_output' ? "border-emerald-500/30 shadow-emerald-500/10" :
            node.type === 'error' ? "border-red-500/30 shadow-red-500/10" :
            "border-indigo-500/30 shadow-indigo-500/10",
            gradientMap[node.type] || gradientMap.thought
        )}>
            <div className={cn(
                "p-3 rounded-xl shadow-inner flex shrink-0",
                node.type === 'tool_call' ? "bg-blue-500/10 text-blue-400" :
                node.type === 'tool_output' ? "bg-emerald-500/10 text-emerald-400" :
                node.type === 'error' ? "bg-red-500/10 text-red-400" :
                "bg-indigo-500/10 text-indigo-400"
            )}>
                {iconMap[node.type] || iconMap.thought}
            </div>

            <div className="flex-grow space-y-1">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{node.type}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{new Date(node.timestamp).toLocaleTimeString()}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-200 leading-tight">{node.label}</h4>
                <div className="relative mt-2">
                    <div className="text-[11px] text-slate-400 font-mono line-clamp-3 bg-black/40 p-2 rounded-lg border border-slate-800/50">
                        {node.content}
                    </div>
                </div>
            </div>
            
            {/* Glow effect */}
            <div className={cn(
                "absolute -inset-0.5 rounded-2xl opacity-20 blur-xl -z-10 group-hover:opacity-40 transition-opacity",
                node.type === 'tool_call' ? "bg-blue-500" :
                node.type === 'tool_output' ? "bg-emerald-500" :
                "bg-indigo-500"
            )} />
        </div>
    );
}
