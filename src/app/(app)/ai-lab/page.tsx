'use client';

import * as React from 'react';
import { SourceSelector } from '@/components/ai/source-selector';
import { AiKnowledgeTerminal } from '@/components/ai/ai-knowledge-terminal';
import { AiGraphExplorer } from '@/components/ai/ai-graph-explorer';
import { AiInsightsPanel } from '@/components/ai/ai-insights-panel';
import { AiVisionLab } from '@/components/ai/ai-vision-lab';
import { McpConsole } from '@/components/ai/mcp-console';
import { Sparkles, Info, BookOpen, Lightbulb, Network, TrendingUp, MessageSquare, Settings2, Eye, Bug } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type TabId = 'chat' | 'graph' | 'vision' | 'insights' | 'debug';

const TABS = [
    { id: 'chat' as TabId, label: 'Chat & RAG', icon: <MessageSquare className="h-4 w-4" />, description: 'Knowledge Terminal' },
    { id: 'graph' as TabId, label: 'Graph Explorer', icon: <Network className="h-4 w-4" />, description: 'GraphRAG Analysis' },
    { id: 'vision' as TabId, label: 'Vision (YOLO)', icon: <Eye className="h-4 w-4" />, description: 'Object Detection' },
    { id: 'debug' as TabId, label: 'Debug Flow (MCP)', icon: <Bug className="h-4 w-4" />, description: 'Remote Tools Debugging' },
    { id: 'insights' as TabId, label: 'Insights & Status', icon: <TrendingUp className="h-4 w-4" />, description: 'AI Predictions' },
];

export default function AiLabPage() {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = React.useState<any[]>([]);
    const [activeTab, setActiveTab] = React.useState<TabId>('chat');

    const handleSelectionChange = (ids: string[], types: any[]) => {
        setSelectedIds(ids);
        setSelectedTypes(types);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-160px)] p-6 space-y-6">
            <header className="flex flex-col space-y-3 shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">HURC AI Knowledge Lab</h1>
                        <Sparkles className="h-6 w-6 text-indigo-500" />
                    </div>
                </div>
                <p className="text-muted-foreground italic">
                    Nâng cấp tri thức bảo trì với TrustGraph — GraphRAG, DocumentRAG, Multi-Agent & Semantic Retrieval.
                </p>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-700 dark:text-indigo-300'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Tab Content */}
            <div className="flex-grow">
                {activeTab === 'chat' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
                        {/* Left Panel: Sources */}
                        <div className="lg:col-span-4 min-h-[500px]">
                            <SourceSelector onSelectionChange={handleSelectionChange} />
                        </div>

                        {/* Right Panel: Chat Terminal */}
                        <div className="lg:col-span-8 min-h-[500px] bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30 flex flex-col">
                            {selectedIds.length === 0 && (
                                <div className="mb-4">
                                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Hành động yêu cầu</AlertTitle>
                                        <AlertDescription>
                                            Chọn nguồn dữ liệu bên trái, hoặc chuyển sang mode <strong>Agent</strong> để chat trực tiếp mà không cần chọn nguồn.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                            
                            <div className="flex-grow min-h-[400px]">
                                <AiKnowledgeTerminal 
                                    selectedIds={selectedIds} 
                                    selectedTypes={selectedTypes} 
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'graph' && (
                    <div className="h-full bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-violet-100 dark:border-violet-900/30 overflow-auto">
                        <AiGraphExplorer />
                    </div>
                )}

                {activeTab === 'vision' && (
                    <div className="h-full bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
                        <AiVisionLab />
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="h-full bg-white dark:bg-slate-950/40 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/30 overflow-auto">
                        <AiInsightsPanel />
                    </div>
                )}

                {activeTab === 'debug' && (
                    <div className="h-full">
                        <McpConsole />
                    </div>
                )}
            </div>

            {/* Quick Tips Footer */}
            <footer className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <TipCard
                    icon={<BookOpen className="h-4 w-4 text-indigo-600" />}
                    title="Grounding (Đặt gốc)"
                    description="AI trả lời dựa trên dữ liệu đã chọn, tránh 'ảo giác'."
                    color="indigo"
                />
                <TipCard
                    icon={<Network className="h-4 w-4 text-violet-600" />}
                    title="GraphRAG"
                    description="Phân tích mối quan hệ giữa entities qua Knowledge Graph."
                    color="violet"
                />
                <TipCard
                    icon={<Lightbulb className="h-4 w-4 text-purple-600" />}
                    title="Smart Router"
                    description="AI tự chọn mode tối ưu: GraphRAG, DocumentRAG, hoặc Agent."
                    color="purple"
                />
                <TipCard
                    icon={<Sparkles className="h-4 w-4 text-emerald-600" />}
                    title="TrustGraph"
                    description="Semantic retrieval, context cores, và multi-agent reasoning."
                    color="emerald"
                />
            </footer>
        </div>
    );
}

function TipCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
    const colorMap: Record<string, string> = {
        indigo: 'bg-indigo-50/50 dark:bg-indigo-950/10 border-indigo-100/50',
        violet: 'bg-violet-50/50 dark:bg-violet-950/10 border-violet-100/50',
        purple: 'bg-purple-50/50 dark:bg-purple-950/10 border-purple-100/50',
        emerald: 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100/50',
    };

    return (
        <div className={`flex items-start gap-3 p-4 ${colorMap[color] || colorMap.indigo} rounded-2xl border`}>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">{icon}</div>
            <div>
                <h4 className="text-sm font-bold">{title}</h4>
                <p className="text-[11px] text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
