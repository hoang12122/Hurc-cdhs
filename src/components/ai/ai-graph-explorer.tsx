'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, GitBranch, Loader2, Network, Zap, ArrowRight } from 'lucide-react';
import { graphQuery } from '@/lib/actions/ai.actions';
import { useToast } from '@/hooks/use-toast';

export function AiGraphExplorer() {
    const [query, setQuery] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [result, setResult] = React.useState<{ response: string; entities: any[]; source?: string } | null>(null);
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        try {
            const data = await graphQuery(query);
            setResult(data);
        } catch (error: any) {
            toast({ title: "Lỗi", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Phân tích mối quan hệ giữa các sự cố, mối nguy..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-10 h-12 text-base border-indigo-200 focus-visible:ring-indigo-500"
                    />
                </div>
                <Button
                    onClick={handleSearch}
                    disabled={isLoading || !query.trim()}
                    className="h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/20"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Network className="h-4 w-4 mr-2" />}
                    GraphRAG
                </Button>
            </div>

            {/* Results */}
            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Response */}
                    <Card className="lg:col-span-2 border-indigo-100 dark:border-indigo-900/30">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <GitBranch className="h-5 w-5 text-violet-600" />
                                    Phân tích Knowledge Graph
                                </CardTitle>
                                {result.source && (
                                    <Badge variant="outline" className="text-[10px] bg-violet-50 text-violet-700 border-violet-200">
                                        <Zap className="h-2.5 w-2.5 mr-1" />
                                        {result.source}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="max-h-[500px]">
                                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                                    {result.response}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Related Entities */}
                    <Card className="border-purple-100 dark:border-purple-900/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Network className="h-4 w-4 text-purple-600" />
                                Thực thể liên quan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="max-h-[500px]">
                                {result.entities.length > 0 ? (
                                    <div className="space-y-3">
                                        {result.entities.map((entity: any, i: number) => (
                                            <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-100/50 dark:border-purple-800/30">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0 mt-0.5">
                                                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">{i + 1}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium truncate">{entity.entity || entity.label || entity.value || 'Entity'}</p>
                                                        {entity.score && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <div className="h-1.5 flex-grow bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                                                        style={{ width: `${Math.round(entity.score * 100)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] text-muted-foreground shrink-0">
                                                                    {Math.round(entity.score * 100)}%
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Network className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground italic">
                                            Chưa có dữ liệu entity. Hãy đồng bộ dữ liệu với TrustGraph trước.
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Empty State */}
            {!result && !isLoading && (
                <div className="text-center py-16">
                    <div className="inline-flex p-4 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl mb-4">
                        <GitBranch className="h-10 w-10 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Knowledge Graph Explorer</h3>
                    <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                        Sử dụng GraphRAG để phân tích mối quan hệ giữa các sự cố, mối nguy, và báo cáo kiểm tra. 
                        Tìm kiếm patterns, nguyên nhân gốc, và cross-references.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                        {[
                            "Mối liên hệ giữa các sự cố tín hiệu",
                            "Nguyên nhân gốc của lỗi lặp lại",
                            "Pattern rủi ro hệ thống điện",
                        ].map((suggestion, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className="text-xs border-violet-200 text-violet-700 hover:bg-violet-50"
                                onClick={() => { setQuery(suggestion); }}
                            >
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {suggestion}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
