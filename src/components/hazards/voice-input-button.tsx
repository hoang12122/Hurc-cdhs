"use client";

import * as React from "react";
import { Mic, Square, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function VoiceInputButton({ onDataExtracted }: { onDataExtracted: (data: any) => void }) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");

  const handleToggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setTranscript("");
    } else {
      // Stop recording and process
      setIsRecording(false);
      setIsProcessing(true);
      
      // Giả lập nội dung ghi âm kỹ thuật
      const mockAudioText = "Phát hiện vết nứt khoảng 5 phân ở trục bánh xe số 3 toa tàu 05. Yêu cầu thay thế gấp để đảm bảo an toàn chạy tàu.";
      
      setTimeout(() => {
        setTranscript(mockAudioText);
        
        // Giả lập Gemma AI trích xuất thông tin
        setTimeout(() => {
          const aiExtractedData = {
            title: "Vết nứt trục bánh xe",
            description: mockAudioText,
            category: "ROLLING_STOCK",
            severity: "HIGH",
            location: "Toa 05, Bánh số 3"
          };
          setIsProcessing(false);
          onDataExtracted(aiExtractedData);
        }, 1500);
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-3 mt-4">
      <div className="flex items-center gap-3">
        <Button 
          type="button"
          onClick={handleToggleRecording}
          variant={isRecording ? "destructive" : "outline"}
          className={`relative overflow-hidden transition-all duration-300 ${isRecording ? 'animate-pulse' : 'hover:border-blue-400 hover:text-blue-600'}`}
          disabled={isProcessing}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 mr-2 fill-current" /> Dừng ghi âm
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI đang xử lý...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" /> Nhập bằng Giọng nói (Whisper AI)
            </>
          )}
        </Button>
        {isRecording && <span className="text-sm text-red-500 font-medium">Đang nghe...</span>}
      </div>

      {(transcript || isProcessing) && (
        <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900 shadow-sm">
          <CardContent className="p-3 text-sm flex flex-col gap-2">
             <div className="flex items-center text-blue-700 dark:text-blue-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Kết quả trích xuất tự động
             </div>
             
             {isProcessing ? (
                <p className="text-muted-foreground animate-pulse">Đang dịch giọng nói và nhận diện thực thể kỹ thuật...</p>
             ) : (
                <>
                  <p className="italic text-slate-600 dark:text-slate-300">
                    &quot;{transcript}&quot;
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="bg-white">Toa 05</Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Mức độ: CAO</Badge>
                    <Badge variant="outline" className="bg-white">Rolling Stock</Badge>
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-1">
                    Đã điền tự động vào Form! Hãy kiểm tra lại trước khi Lưu.
                  </p>
                </>
             )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
