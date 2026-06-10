"use client";

import { useState } from 'react';
import { Bot, X, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { askCopilot } from '@/lib/actions/ai.actions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function MaintenanceCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào! Tôi là Trợ lý AI Bảo trì (Copilot). Tôi đã được huấn luyện trên hàng nghìn trang tài liệu kỹ thuật (Offline RAG). Bạn cần tra cứu mã lỗi hay hướng dẫn sửa chữa thiết bị nào?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askCopilot(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, đã xảy ra lỗi khi tìm kiếm tài liệu.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all z-50 p-0 flex items-center justify-center"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <h3 className="font-bold text-sm">HURC Copilot</h3>
            <p className="text-xs text-indigo-200">Offline RAG AI</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-slate-200" : "bg-indigo-100")}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-slate-600" /> : <Bot className="h-4 w-4 text-indigo-600" />}
              </div>
              <div className={cn("px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap max-w-[75%]", 
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-sm" 
                  : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-100">
                <Bot className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm rounded-tl-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
        <Input 
          placeholder="Hỏi về mã lỗi, cách bảo trì..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="rounded-full border-slate-300 focus-visible:ring-indigo-500"
        />
        <Button 
          size="icon" 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()}
          className="rounded-full h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
