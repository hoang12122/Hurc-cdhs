'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { generateAiHint } from '@/lib/actions/ai.actions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AiAssistButtonProps {
    context: string;
    promptText: string;
    onResult: (result: string) => void;
    buttonText?: string;
    tooltipText?: string;
    disabled?: boolean;
}

const translations = {
    vi: {
        analyzing: "AI đang phân tích...",
        success: "Đề xuất AI thành công",
        error: "Lỗi AI",
        defaultButton: "Hỏi AI",
        defaultTooltip: "Sử dụng AI HuggingFace để đưa ra gợi ý chuyên sâu."
    },
    en: {
        analyzing: "AI is analyzing...",
        success: "AI suggestion generated",
        error: "AI Error",
        defaultButton: "Ask AI",
        defaultTooltip: "Use HuggingFace AI to generate expert suggestions."
    }
};

export function AiAssistButton({ context, promptText, onResult, buttonText, tooltipText, disabled }: AiAssistButtonProps) {
    const { locale } = useLanguage();
    const t = translations[locale];
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleAssist = async () => {
        if (!promptText.trim()) {
            toast({
                title: "Lỗi",
                description: "Vui lòng nhập nội dung trước khi yêu cầu AI.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const hint = await generateAiHint(context, promptText);
            onResult(hint);
            toast({
                title: t.success,
                description: "Đã điền nội dung gợi ý từ AI.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t.error,
                description: error.message || "Không thể kết nối với dịch vụ AI.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleAssist} 
                        disabled={disabled || isLoading}
                        className="gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-500" />}
                        {isLoading ? t.analyzing : (buttonText || t.defaultButton)}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <p>{tooltipText || t.defaultTooltip}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
