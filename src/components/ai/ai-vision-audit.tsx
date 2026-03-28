
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Eye, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeSafetyImage } from "@/lib/actions/ai.actions";
import { Badge } from "@/components/ui/badge";

interface AiVisionAuditProps {
    imageUrl: string;
    onAuditComplete: (result: { summary: string; forecast: string; detections: any[] }) => void;
}

export function AiVisionAudit({ imageUrl, onAuditComplete }: AiVisionAuditProps) {
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const { toast } = useToast();

    const handleAudit = async () => {
        setIsAnalyzing(true);
        try {
            // Convert dataURL to Blob/File for FormData
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const file = new File([blob], "audit-image.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append('image', file);

            const result = await analyzeSafetyImage(formData);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Lỗi phân tích AI",
                    description: result.error,
                });
            } else if (result.summary) {
                onAuditComplete(result as any);
                toast({
                    title: "Phân tích hoàn tất",
                    description: "Hệ thống YOLO đã xác định các yếu tố an toàn.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Lỗi kết nối",
                description: "Không thể kết nối tới dịch vụ AI Vision.",
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Kiểm soát An toàn bằng AI (YOLOv8)</span>
                </div>
                <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleAudit} 
                    disabled={isAnalyzing}
                    className="h-8"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Đang phân tích...
                        </>
                    ) : (
                        <>
                            <Eye className="mr-2 h-3 w-3" />
                            Chạy Audit An toàn
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground italic">
                Sử dụng thị giác máy tính để tự động phát hiện vi phạm PPE và dự báo rủi ro an toàn.
            </p>
        </div>
    );
}
