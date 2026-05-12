"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function YoloVisionPreview() {
  const [isScanning, setIsScanning] = React.useState(true);

  React.useEffect(() => {
    // Giả lập thời gian quét bằng model YOLO
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="border-red-200 bg-red-50/30 dark:bg-red-950/20 dark:border-red-900 mt-4 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center text-red-700 dark:text-red-400">
          <Camera className="w-4 h-4 mr-2" />
          AI Vision Inspection (YOLO)
          {isScanning ? (
            <Badge variant="secondary" className="ml-2 bg-yellow-200 text-yellow-800 animate-pulse">
              Đang phân tích ảnh...
            </Badge>
          ) : (
            <Badge variant="destructive" className="ml-2">
              Phát hiện 2 lỗi
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning ? (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center relative overflow-hidden">
             {/* Scanning effect */}
             <div className="absolute top-0 left-0 w-full h-2 bg-green-400 opacity-50 animate-bounce shadow-[0_0_15px_#4ade80]" />
          </div>
        ) : (
          <div className="w-full h-48 bg-slate-900 rounded-md relative flex items-center justify-center group overflow-hidden">
            {/* Ảnh minh họa (Placeholder giả lập) */}
            <p className="text-slate-500 text-xs">Ảnh trục bánh xe thép</p>
            
            {/* Bounding Box 1: Vết nứt */}
            <div className="absolute top-[20%] left-[30%] w-[100px] h-[50px] border-2 border-red-500 bg-red-500/20 flex flex-col justify-end">
                <span className="bg-red-500 text-white text-[10px] font-bold px-1 absolute -top-4 left-[-2px]">
                  crack 0.92
                </span>
            </div>

            {/* Bounding Box 2: Rỉ sét */}
            <div className="absolute bottom-[20%] right-[20%] w-[60px] h-[60px] border-2 border-orange-500 bg-orange-500/20 flex flex-col justify-end">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-1 absolute -top-4 left-[-2px]">
                  rust 0.85
                </span>
            </div>
          </div>
        )}

        {!isScanning && (
          <div className="mt-3 text-xs text-muted-foreground flex flex-col gap-1">
             <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <strong>Cảnh báo khẩn cấp:</strong> Phát hiện vết nứt (crack) với độ tin cậy 92%. Đề nghị thay thế trục.
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
