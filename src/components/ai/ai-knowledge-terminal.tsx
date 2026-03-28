'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Loader2, BrainCircuit, BookOpen, Quote, ShieldCheck, ChevronDown, Plus, Network, FileText, Bot, Zap, User } from 'lucide-react';
import { groundedQuery, generateSynthesis, getAgents, createAgent, aiAgentChat, personalizedQuery } from '@/lib/actions/ai.actions';
import { pushKnowledgeSnippet, processFileKnowledge } from '@/lib/actions/knowledge.actions';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    source?: string;
    intent?: string;
}

type RagMode = 'auto' | 'nemoclaw' | 'document_rag' | 'graph_rag' | 'agent';

interface AiKnowledgeTerminalProps {
    selectedIds: string[];
    selectedTypes: any[];
}

const RAG_MODES: { value: RagMode; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'auto', label: 'Auto', icon: <Sparkles className="h-3.5 w-3.5" />, description: 'AI tự chọn mode tối ưu' },
    { value: 'nemoclaw', label: 'NemoClaw', icon: <User className="h-3.5 w-3.5 text-amber-500" />, description: 'Cá nhân hóa theo roles' },
    { value: 'document_rag', label: 'DocumentRAG', icon: <FileText className="h-3.5 w-3.5" />, description: 'Tìm kiếm trong tài liệu' },
    { value: 'graph_rag', label: 'GraphRAG', icon: <Network className="h-3.5 w-3.5" />, description: 'Phân tích mối quan hệ' },
    { value: 'agent', label: 'Agent', icon: <Bot className="h-3.5 w-3.5" />, description: 'Suy luận phức tạp' },
];

export function AiKnowledgeTerminal({ selectedIds, selectedTypes }: AiKnowledgeTerminalProps) {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const [isSynthesizing, setIsSynthesizing] = React.useState(false);
    const [ragMode, setRagMode] = React.useState<RagMode>('auto');
    
    // Agent State (for multi-turn)
    const [agents, setAgents] = React.useState<any[]>([]);
    const [selectedAgentId, setSelectedAgentId] = React.useState<string | undefined>();
    const [isCreatingAgent, setIsCreatingAgent] = React.useState(false);
    const [newAgent, setNewAgent] = React.useState({ name: '', subsystem: '', prompt: '' });
    
    // Agent conversation state
    const [agentState, setAgentState] = React.useState<any>(null);
    const [agentHistory, setAgentHistory] = React.useState<any[]>([]);
    
    // Knowledge Push State
    const [isPushing, setIsPushing] = React.useState(false);
    const [pushContent, setPushContent] = React.useState('');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

    const { toast } = useToast();
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        async function loadAgents() {
            const data = await getAgents();
            setAgents(data);
            if (data.length > 0) setSelectedAgentId(data[0].id);
        }
        loadAgents();
    }, []);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;
        
        // Allow agent or nemoclaw mode even without selected sources
        if (selectedIds.length === 0 && ragMode !== 'agent' && ragMode !== 'nemoclaw') {
            toast({
                title: "Chưa chọn nguồn",
                description: "Vui lòng chọn ít nhất một báo cáo/nguồn dữ liệu, hoặc chuyển sang mode Agent/NemoClaw.",
                variant: "destructive"
            });
            return;
        }

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            let response: string;
            let source: string = 'unknown';

            if (ragMode === 'agent') {
                // Multi-turn agent chat
                const result = await aiAgentChat(userMsg, agentState, agentHistory);
                response = result.answer;
                source = (result as any).source || 'agent';
                setAgentState(result.state);
                setAgentHistory(result.history);
            } else if (ragMode === 'nemoclaw') {
                // Personalized NemoClaw chat
                const result = await personalizedQuery(userMsg, agentHistory);
                response = result.content;
                source = result.source;
                setAgentHistory(prev => [...prev, { role: 'user', content: userMsg }, { role: 'assistant', content: response }]);
            } else {
                // Grounded query with selected sources
                response = await groundedQuery(selectedIds, selectedTypes, userMsg, selectedAgentId);
                source = 'grounded';
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response, source }]);
        } catch (error: any) {
            toast({
                title: "Lỗi AI",
                description: error.message || "Không thể trả lời câu hỏi lúc này.",
                variant: "destructive"
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleSynthesis = async () => {
        if (selectedIds.length === 0) return;
        setIsSynthesizing(true);
        setMessages(prev => [...prev, { role: 'user', content: "Hãy tổng hợp tri thức từ các nguồn đã chọn." }]);
        
        try {
            const summary = await generateSynthesis(selectedIds, selectedTypes);
            setMessages(prev => [...prev, { role: 'assistant', content: summary, source: 'synthesis' }]);
        } catch (error) {
            toast({ title: "Lỗi tổng hợp", variant: "destructive" });
        } finally {
            setIsSynthesizing(false);
        }
    };

    const handleCreateAgent = async () => {
        if (!newAgent.name) return;
        try {
            const agent = await createAgent({
                name: newAgent.name,
                subsystem: newAgent.subsystem,
                systemPrompt: newAgent.prompt
            });
            setAgents(prev => [...prev, agent]);
            setSelectedAgentId(agent.id);
            setIsCreatingAgent(false);
            setNewAgent({ name: '', subsystem: '', prompt: '' });
            toast({ title: "Đã tạo Agent mới" });
        } catch (e) {
            toast({ title: "Lỗi tạo Agent", variant: "destructive" });
        }
    };

    const handlePushKnowledge = async () => {
        if (!pushContent.trim() && !selectedFile) return;
        setIsPushing(true);
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await processFileKnowledge(formData);
                setSelectedFile(null);
            } else {
                await pushKnowledgeSnippet(pushContent, 'Manual Push');
                setPushContent('');
            }
            
            setIsPushing(false);
            toast({ title: "Đã nạp tri thức thành công", description: "Dữ liệu đã được tự động đồng bộ với TrustGraph." });
        } catch (e: any) {
            toast({ title: "Lỗi nạp dữ liệu", description: e.message, variant: "destructive" });
            setIsPushing(false);
        }
    };

    const handleClearConversation = () => {
        setMessages([]);
        setAgentState(null);
        setAgentHistory([]);
    };

    const currentAgentName = agents.find(a => a.id === selectedAgentId)?.name || "Chọn Agent";
    const currentMode = RAG_MODES.find(m => m.value === ragMode) || RAG_MODES[0];

    return (
        <Card className="h-full border-none shadow-none bg-transparent flex flex-col">
            <CardHeader className="pb-4 px-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                            <BrainCircuit className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-extrabold tracking-tight">Knowledge Terminal</CardTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                                {/* Agent Selector */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 border border-indigo-100 flex items-center gap-1">
                                            {currentAgentName} <ChevronDown className="h-2.5 w-2.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-56">
                                        {agents.map(a => (
                                            <DropdownMenuItem key={a.id} onClick={() => setSelectedAgentId(a.id)} className="flex items-center justify-between">
                                                <span>{a.name} ({a.subsystem})</span>
                                                {selectedAgentId === a.id && <ShieldCheck className="h-4 w-4 text-green-500" />}
                                            </DropdownMenuItem>
                                        ))}
                                        <Dialog open={isCreatingAgent} onOpenChange={setIsCreatingAgent}>
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-indigo-600 font-semibold italic flex items-center gap-2">
                                                    <Plus className="h-4 w-4" /> Thêm Agent mới
                                                </DropdownMenuItem>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Tạo chuyên gia AI mới</DialogTitle></DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Tên Agent</Label>
                                                        <Input placeholder="Ví dụ: Chuyên gia Tín hiệu" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Hệ thống con</Label>
                                                        <Input placeholder="Ví dụ: Signaling" value={newAgent.subsystem} onChange={e => setNewAgent({...newAgent, subsystem: e.target.value})} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>System Prompt (Chỉ dẫn AI)</Label>
                                                        <Textarea 
                                                            placeholder="Bạn là chuyên gia về... Hãy ưu tiên kiểm tra..." 
                                                            rows={4} 
                                                            value={newAgent.prompt} 
                                                            onChange={e => setNewAgent({...newAgent, prompt: e.target.value})} 
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsCreatingAgent(false)}>Hủy</Button>
                                                    <Button onClick={handleCreateAgent} className="bg-indigo-600 text-white">Lưu Agent</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* RAG Mode Selector */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 border border-violet-100 flex items-center gap-1">
                                            {currentMode.icon}
                                            {currentMode.label}
                                            <ChevronDown className="h-2.5 w-2.5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-64">
                                        {RAG_MODES.map(mode => (
                                            <DropdownMenuItem 
                                                key={mode.value} 
                                                onClick={() => setRagMode(mode.value)}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="text-violet-600">{mode.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-sm">{mode.label}</p>
                                                    <p className="text-[11px] text-muted-foreground">{mode.description}</p>
                                                </div>
                                                {ragMode === mode.value && <ShieldCheck className="h-4 w-4 text-green-500 ml-auto" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {messages.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={handleClearConversation} className="text-xs text-muted-foreground">
                                Xóa hội thoại
                            </Button>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Plus className="h-3.5 w-3.5" /> Đẩy tri thức
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader><DialogTitle>Nạp dữ liệu vào Kho tri thức</DialogTitle></DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold">Tải lên tài liệu (PDF, Word, Excel, TXT)</Label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Plus className="w-8 h-8 mb-3 text-slate-400" />
                                                    <p className="mb-2 text-sm text-slate-500">
                                                        {selectedFile ? <span className="font-bold text-indigo-600">{selectedFile.name}</span> : "Click để chọn file hoặc kéo thả"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">PDF, DOCX, XLSX (Max 10MB)</p>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf,.docx,.xlsx,.xls,.txt,.md"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Hoặc dán văn bản</span></div>
                                    </div>

                                    <div className="space-y-2">
                                        <Textarea 
                                            placeholder="Paste tài liệu, quy trình hoặc ghi chú technical tại đây..." 
                                            rows={6} 
                                            value={pushContent}
                                            disabled={!!selectedFile}
                                            onChange={(e) => setPushContent(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground italic">
                                        Dữ liệu sẽ được lưu vào Kho AI và tự động đồng bộ với TrustGraph (nếu available).
                                    </p>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handlePushKnowledge} disabled={isPushing || (!pushContent.trim() && !selectedFile)} className="bg-blue-600 text-white w-full">
                                        {isPushing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                        {isPushing ? "Đang xử lý tài liệu..." : "Nạp vào Kho Tri thức"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                            onClick={handleSynthesis}
                            disabled={selectedIds.length === 0 || isSynthesizing}
                        >
                            {isSynthesizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <BookOpen className="h-3.5 w-3.5" />}
                            Tổng hợp
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-grow p-0 relative min-h-[400px]">
                <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-grow p-4" ref={scrollRef}>
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
                                <div className="p-4 bg-white dark:bg-slate-950 rounded-full shadow-sm border border-slate-100 dark:border-slate-900">
                                    <Sparkles className="h-8 w-8 text-indigo-500 animate-pulse" />
                                </div>
                                <div className="max-w-[300px] space-y-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Bắt đầu hành trình tri thức</h3>
                                    <p className="text-sm text-muted-foreground italic">
                                        {ragMode === 'agent' 
                                            ? "Mode Agent: Hỏi tôi bất cứ điều gì, tôi sẽ suy luận và tìm câu trả lời."
                                            : ragMode === 'nemoclaw'
                                                ? "NemoClaw: Trợ lý AI cá nhân hóa theo vai trò của bạn tại HURC1."
                                                : "Hãy chọn nguồn dữ liệu bên trái và hỏi tôi bất cứ điều gì về các sự cố này."
                                        }
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                            m.role === 'user' 
                                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                                        }`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                {m.role === 'assistant' && <Quote className="h-3 w-3 text-indigo-400 opacity-50" />}
                                                <span className={`text-[10px] font-bold uppercase tracking-wider opacity-60`}>
                                                    {m.role === 'user' ? 'Bạn' : 'HURC AI Lab'}
                                                </span>
                                                {m.source && m.role === 'assistant' && (
                                                    <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 bg-transparent border-indigo-200/50">
                                                        <Zap className="h-2 w-2 mr-0.5" />
                                                        {m.source}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert">
                                                {m.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                            <span className="text-xs text-muted-foreground">
                                                {ragMode === 'agent' ? 'Agent đang suy luận...' : 'AI đang phân tích...'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>
                    
                    <div className="p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-2">
                            <Input 
                                placeholder={
                                    ragMode === 'agent' 
                                        ? "Hỏi AI Agent bất cứ điều gì..."
                                        : ragMode === 'nemoclaw'
                                            ? "Hỏi AI cá nhân hóa (NemoClaw)..."
                                            : selectedIds.length > 0 
                                                ? "Đặt câu hỏi về các nguồn đã chọn..." 
                                                : "Vui lòng chọn nguồn dữ liệu..."
                                }
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={(selectedIds.length === 0 && ragMode !== 'agent' && ragMode !== 'nemoclaw') || isTyping}
                                className="border-indigo-100 focus-visible:ring-indigo-500"
                            />
                            <Button 
                                size="icon" 
                                onClick={handleSend} 
                                disabled={(selectedIds.length === 0 && ragMode !== 'agent' && ragMode !== 'nemoclaw') || isTyping || !input.trim()}
                                className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center text-muted-foreground mt-2">
                            Mode: {currentMode.label} • {ragMode === 'agent' ? 'Multi-turn conversation' : 'Grounded in selected sources'} • Mô hình có thể nhầm lẫn
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
