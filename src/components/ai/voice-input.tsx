"use client";

import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
  isListening?: boolean;
}

export function VoiceInput({ onResult, className }: VoiceInputProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    // Check if browser supports Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "vi-VN"; // Default to Vietnamese for Metro Engineers

        recognition.onstart = () => {
          setIsRecording(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            onResult(finalTranscript.trim() + " ");
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setError(event.error);
          setIsRecording(false);
          toast({
            title: "Lỗi ghi âm",
            description: "Không thể nhận diện giọng nói. Vui lòng kiểm tra quyền truy cập Micro.",
            variant: "destructive",
          });
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setError("Browser not supported");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, toast]);

  const toggleRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    if (error === "Browser not supported") {
      toast({
        title: "Trình duyệt không hỗ trợ",
        description: "Vui lòng sử dụng Chrome, Edge hoặc Safari phiên bản mới nhất.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        toast({
          title: "Đang ghi âm...",
          description: "Hãy nói rõ ràng nội dung báo cáo sự cố.",
        });
      } catch (err) {
        console.error("Failed to start recording:", err);
      }
    }
  };

  return (
    <Button
      type="button"
      variant={isRecording ? "destructive" : "outline"}
      size="icon"
      className={cn("h-8 w-8 rounded-full transition-all duration-300", className, isRecording && "animate-pulse")}
      onClick={toggleRecording}
      title="Nhập liệu bằng giọng nói (Speech-to-Text)"
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
