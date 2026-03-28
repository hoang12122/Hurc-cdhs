
"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getHazardById } from "@/lib/actions/hazard.actions";
import { AiVisionAudit } from "@/components/ai/ai-vision-audit";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function AiVisionAuditPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hazardId = searchParams.get("hazardId");
    const { locale } = useLanguage();
    
    const [hazard, setHazard] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [auditResult, setAuditResult] = React.useState<any>(null);

    React.useEffect(() => {
        if (hazardId) {
            getHazardById(hazardId).then(data => {
                setHazard(data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [hazardId]);

    const handleAuditComplete = (result: any) => {
        setAuditResult(result);
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <Skeleton className="h-10 w-48" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!hazardId || !hazard) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <h1 className="text-2xl font-bold">Không tìm thấy mối nguy cần Audit</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Vui lòng chọn một mối nguy có hình ảnh đính kèm từ bảng điều khiển hoặc danh sách mối nguy để thực hiện phân tích thị giác AI.
                </p>
                <Button asChild>
                    <Link href="/dashboard"> Quay lại Bảng điều khiển</Link>
                </Button>
            </div>
        );
    }

    const imageUrl = hazard.attachments?.find((a: any) => a.url)?.url;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-headline text-primary">Phân tích Thị giác AI</h1>
                    <p className="text-muted-foreground">Thực hiện kiểm soát an toàn bằng YOLOv8 cho Mối nguy #{hazard.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-primary" />
                            Thông tin Mối nguy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="font-mono text-xs">{hazard.id}</Badge>
                            <Badge variant={hazard.status === 'Đã đóng' ? 'secondary' : 'default'}>{hazard.status}</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Mô tả:</p>
                            <p className="text-sm text-foreground/80">{hazard.description}</p>
                        </div>
                        {hazard.potentialConsequence && (
                            <div>
                                <p className="text-sm font-semibold">Hệ quả tiềm ẩn:</p>
                                <p className="text-sm text-muted-foreground italic">"{hazard.potentialConsequence}"</p>
                            </div>
                        )}
                        
                        {imageUrl ? (
                            <div className="mt-4 rounded-lg overflow-hidden border border-border bg-muted/20">
                                <img src={imageUrl} alt="Hazard attachment" className="w-full h-auto object-cover max-h-[400px]" />
                                <div className="p-4">
                                    <AiVisionAudit 
                                        imageUrl={imageUrl} 
                                        onAuditComplete={handleAuditComplete} 
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-muted/20 rounded-lg border border-dashed">
                                <p className="text-sm text-muted-foreground">Không tìm thấy hình ảnh đính kèm để thực hiện Audit.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Kết quả Phân tích YOLOv8
                        </CardTitle>
                        <CardDescription>Các phát hiện và dự báo rủi ro dựa trên thị giác máy tính.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {auditResult ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        Tóm tắt Phát hiện:
                                    </h4>
                                    <p className="text-sm p-3 bg-secondary/30 rounded-md border border-secondary">
                                        {auditResult.summary}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm flex items-center gap-2 text-amber-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        Dự báo Rủi ro & Khuyến nghị PCCC:
                                    </h4>
                                    <div className="text-sm p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-900/30 whitespace-pre-line">
                                        {auditResult.forecast}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button variant="outline" onClick={() => router.push(`/hazards/${hazard.id}/edit`)}>
                                        Cập nhật Biện pháp Kiểm soát
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <ShieldAlert className="h-8 w-8 text-primary/40" />
                                </div>
                                <p className="text-sm text-muted-foreground">Bắt đầu chạy AI Audit để nhận phân tích chi tiết.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
