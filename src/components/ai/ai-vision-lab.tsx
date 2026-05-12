'use client';

import React, { useState } from 'react';
import { Upload, X, ShieldAlert, Cpu, Search, Layers } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { YoloCanvas } from './YoloCanvas';
import { type YoloResponse } from '@/lib/services/yolo';

export const AiVisionLab = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [detections, setDetections] = useState<YoloResponse | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setSelectedImage(url);
            setDetections(null);
            setError(null);
        }
    };

    const runDetection = async () => {
        if (!imageFile) return;

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', imageFile);

            const response = await fetch('/api/ai/vision/detect', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Dịch vụ YOLO Vision hiện tại không khả dụng.');
            }

            setDetections(data);
        } catch (err: any) {
            console.error("YOLO_CLIENT_ERROR:", err);
            setError(err.message || 'Lỗi kết nối máy chủ AI Vision.');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImageFile(null);
        setDetections(null);
        setError(null);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
            {/* Left Panel: Upload & Controls */}
            <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                <Card className="border-indigo-100 dark:border-indigo-900/30 shadow-xl shadow-indigo-500/5">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <Layers className="h-5 w-5" />
                            YOLO Machine Vision
                        </CardTitle>
                        <CardDescription>
                            Tải lên hình ảnh hiện trường để phát hiện vật thể và rủi ro an toàn.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!selectedImage ? (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-3xl cursor-pointer bg-indigo-50/50 dark:bg-indigo-950/10 hover:bg-indigo-100/50 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <p className="mb-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">Click để chọn ảnh</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG hoặc JPEG (Max 10MB)</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        ) : (
                            <div className="relative group h-64 w-full">
                                <Image 
                                    src={selectedImage} 
                                    className="object-cover rounded-3xl border border-indigo-200 dark:border-indigo-800" 
                                    alt="Preview" 
                                    fill
                                    unoptimized
                                />
                                <button 
                                    onClick={clearImage}
                                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    aria-label="Clear image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all font-bold"
                            disabled={!selectedImage || isProcessing}
                            onClick={runDetection}
                        >
                            {isProcessing ? (
                                <>
                                    <Cpu className="mr-2 h-4 w-4 animate-spin" />
                                    Đang phân tích YOLOv8...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Chạy Object Detection
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl flex gap-3 text-red-700 dark:text-red-400">
                                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {detections && (
                    <Card className="border-slate-100 dark:border-slate-800 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-sm">Kết quả phân tích</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-muted-foreground">Phát hiện:</span>
                                <span className="font-bold text-indigo-600">{detections.count} vật thể</span>
                            </div>
                            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pt-2">
                                {detections.detections.map((det, i) => (
                                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                        <span className="font-medium capitalize">{det.label}</span>
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full font-bold">
                                            {Math.round(det.confidence * 100)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Right Panel: Canvas Visualization */}
            <div className="lg:col-span-8 h-full bg-slate-950 rounded-[40px] p-8 border border-white/5 flex items-center justify-center relative shadow-inner overflow-hidden">
                {selectedImage ? (
                    <YoloCanvas 
                        imageUrl={selectedImage} 
                        detections={detections?.detections || []} 
                        confidenceThreshold={0.4}
                    />
                ) : (
                    <div className="text-center space-y-4">
                        <div className="p-6 bg-slate-900 rounded-full w-fit mx-auto ring-1 ring-white/10 shadow-3xl shadow-indigo-500/10 mb-6">
                            <Cpu className="h-12 w-12 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Chờ dữ liệu hình ảnh</h3>
                        <p className="text-slate-600 max-w-xs mx-auto text-sm">
                            Hãy tải lên một tấm ảnh và nhấn &quot;Chạy Object Detection&quot; để bắt đầu phân tích thời gian thực.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
