'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Database, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDnfShortList, getHazardShortList } from '@/lib/actions/ai.actions';
import { getKnowledgeSnippets } from '@/lib/actions/knowledge.actions';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Source {
    id: string;
    type: 'dnf' | 'hazard' | 'inspection' | 'snippet';
    title: string;
    description: string;
    date: Date;
}

interface SourceSelectorProps {
    onSelectionChange: (selectedIds: string[], types: ('dnf' | 'hazard' | 'inspection' | 'snippet')[]) => void;
}

export function SourceSelector({ onSelectionChange }: SourceSelectorProps) {
    const [sources, setSources] = React.useState<Source[]>([]);
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadData() {
            try {
                const [dnfs, hazards, snippets] = await Promise.all([
                    getDnfShortList(),
                    getHazardShortList(),
                    getKnowledgeSnippets()
                ]);

                const formatted: Source[] = [
                    ...dnfs.map(d => ({
                        id: d.id,
                        type: 'dnf' as const,
                        title: d.failureReportNo || d.id,
                        description: d.descriptionOfFailure,
                        date: new Date(d.createdAt)
                    })),
                    ...hazards.map(h => ({
                        id: h.id,
                        type: 'hazard' as const,
                        title: (h as any).failureReportNo || h.id,
                        description: h.description,
                        date: new Date(h.createdAt)
                    })),
                    ...snippets.map(s => ({
                        id: s.id,
                        type: 'snippet' as const,
                        title: s.source,
                        description: s.content,
                        date: new Date(s.createdAt)
                    }))
                ];
                setSources(formatted.sort((a, b) => b.date.getTime() - a.date.getTime()));
            } catch (error) {
                console.error("Failed to load sources:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const toggleSource = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
        
        const selectedArr = Array.from(newSelected);
        const selectedTypes = sources
            .filter(s => newSelected.has(s.id))
            .map(s => s.type)
            .filter((v, i, a) => a.indexOf(v) === i);
            
        onSelectionChange(selectedArr, selectedTypes as any);
    };

    const filteredSources = sources.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="h-full border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20 border-b pb-4 px-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Nguồn Dữ Liệu
                        </CardTitle>
                        <CardDescription>Chọn các báo cáo để làm gốc tri thức cho AI</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200">
                        {selectedIds.size} đã chọn
                    </Badge>
                </div>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm báo cáo..."
                        className="pl-8 bg-white dark:bg-slate-950 border-indigo-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-[450px]">
                    <div className="p-2 space-y-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">Đang tải dữ liệu...</div>
                        ) : filteredSources.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">Không tìm thấy dữ liệu phù hợp.</div>
                        ) : (
                            filteredSources.map((source) => (
                                <div 
                                    key={source.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer border ${
                                        selectedIds.has(source.id) 
                                            ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-900 border-transparent'
                                    }`}
                                    onClick={() => toggleSource(source.id)}
                                >
                                    <Checkbox 
                                        checked={selectedIds.has(source.id)}
                                        onCheckedChange={() => toggleSource(source.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-grow space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-semibold truncate max-w-[140px]">{source.title}</span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {source.type === 'dnf' && (
                                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-red-100 text-red-700 flex items-center gap-0.5 border-red-200">
                                                        <AlertCircle className="h-2.5 w-2.5" /> DNF
                                                    </Badge>
                                                )}
                                                {source.type === 'hazard' && (
                                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-amber-100 text-amber-700 flex items-center gap-0.5 border-amber-200">
                                                        <FileText className="h-2.5 w-2.5" /> Hazard
                                                    </Badge>
                                                )}
                                                {source.type === 'snippet' && (
                                                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-blue-100 text-blue-700 flex items-center gap-0.5 border-blue-200">
                                                        <Sparkles className="h-2.5 w-2.5" /> Snippet
                                                    </Badge>
                                                )}
                                                <span className="text-[10px] text-muted-foreground">{format(source.date, 'dd/MM')}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {source.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
