
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeHazardImageOpen } from "@/lib/actions/ai.actions";

interface AiHazardVisionProps {
    imageUrl: string;
    onAnalysisComplete: (result: {
        description: string;
        cause: string;
        consequence: string;
        severityId: string;
        likelihoodId: string;
        suggestedActions: string;
    }) => void;
}

export function AiHazardVision({ imageUrl, onAnalysisComplete }: AiHazardVisionProps) {
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const { toast } = useToast();

    const handleAnalysis = async () => {
        setIsAnalyzing(true);
        try {
            // Convert dataURL to Blob for FormData
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], "hazard-image.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('image', file);

            const result = await analyzeHazardImageOpen(formData);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Lỗi AI Vision (Open Model)",
                    description: result.error,
                });
            } else if (result.description) {
                onAnalysisComplete(result);
                toast({
                    title: "AI Phân tích hoàn tất",
                    description: "Các trường dữ liệu đã được đề xuất tự động.",
                });
            } else if (result.rawResponse) {
                toast({
                    title: "Kết quả AI (Dạng thô)",
                    description: "AI không trả về định dạng JSON chuẩn. Vui lòng kiểm tra lại.",
                });
                console.log("Raw AI Response:", result.rawResponse);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi kết nối",
                description: "Không thể kết nối tới dịch vụ AI Open Vision.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 border-2 border-primary/20 rounded-xl bg-primary/5 shadow-inner">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <span className="text-sm font-bold block">AI Smart Scan (Open Model)</span>
                        <span className="text-xs text-muted-foreground">Phân tích rủi ro & đề xuất tự động</span>
                    </div>
                </div>
                <Button 
                    onClick={handleAnalysis} 
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto shadow-md"
                    variant="default"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang quét ảnh...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Bắt đầu Quét AI
                        </>
                    )}
                </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/50 p-1.5 rounded border border-dashed">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Tự động điền Mô tả & Nguyên nhân
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/50 p-1.5 rounded border border-dashed">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Đề xuất Risk Level (S1-S4, L1-L4)
                </div>
            </div>
        </div>
    );
}
