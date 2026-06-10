'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceReporterProps {
    onTranscriptionComplete: (data: any) => void;
}

export function VoiceReporter({ onTranscriptionComplete }: VoiceReporterProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { toast } = useToast();

    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = async () => {
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        
        setIsProcessing(true);
        try {
            // Mô phỏng luồng gọi API gửi file âm thanh tới Whisper
            // Mất khoảng 2 giây để bóc băng và trích xuất LLM
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Giả lập kết quả trả về từ AI (Llama3 JSON extraction)
            const mockExtractedData = {
                locationOfFailure: "Ga Cát Linh",
                descriptionOfFailure: "Bóng đèn số 4 platform bị cháy và chớp nháy liên tục gây chói mắt",
                hazardLevelId: "MEDIUM",
                priority: "HIGH"
            };

            onTranscriptionComplete(mockExtractedData);
            toast({ 
                title: "Trí tuệ nhân tạo (AI)", 
                description: "Đã bóc băng và tự điền dữ liệu thành công!" 
            });
        } catch (error) {
            toast({ title: "Lỗi xử lý giọng nói", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-cyan-200 bg-cyan-50/30 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-cyan-700 font-bold">
                <Sparkles className="h-5 w-5" />
                <span>Trợ lý AI Báo cáo bằng Giọng nói (Push-to-Talk)</span>
            </div>
            <p className="text-sm text-slate-500 text-center max-w-sm">
                Đang đứng tại hiện trường? Hãy nhấn Ghi âm và đọc sự cố, AI sẽ tự động điền Form giúp bạn.
            </p>
            
            <div className="flex items-center gap-4">
                {!isRecording && !isProcessing ? (
                    <Button 
                        type="button"
                        onClick={startRecording}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full h-16 w-16 shadow-xl shadow-cyan-500/30 transition-transform hover:scale-105"
                    >
                        <Mic className="h-8 w-8" />
                    </Button>
                ) : isRecording ? (
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-mono text-red-500 font-bold animate-pulse">
                            {formatTime(recordingTime)}
                        </div>
                        <Button 
                            type="button"
                            onClick={stopRecording}
                            variant="destructive"
                            className="rounded-full h-16 w-16 shadow-xl shadow-red-500/30 animate-in zoom-in"
                        >
                            <Square className="h-6 w-6" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-10 w-10 text-cyan-600 animate-spin" />
                        <span className="text-sm text-cyan-700 font-medium animate-pulse">AI đang phân tích âm thanh...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
