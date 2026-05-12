'use client';

import React, { useRef, useEffect } from 'react';
import { type YoloDetection } from '@/lib/services/yolo';

interface YoloCanvasProps {
    imageUrl: string;
    detections: YoloDetection[];
    confidenceThreshold?: number;
    showLabels?: boolean;
}

export const YoloCanvas: React.FC<YoloCanvasProps> = ({
    imageUrl,
    detections,
    confidenceThreshold = 0.5,
    showLabels = true,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                // Resize canvas to match image natural size
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Set display size to fit container width while maintaining aspect ratio
                if (containerRef.current) {
                    const containerWidth = containerRef.current.clientWidth;
                    const scale = containerWidth / img.naturalWidth;
                    canvas.style.width = `${containerWidth}px`;
                    canvas.style.height = `${img.naturalHeight * scale}px`;
                }

                // Draw background image
                ctx.drawImage(img, 0, 0);

                // Draw detections
                detections.forEach((det) => {
                    if (det.confidence < confidenceThreshold) return;

                    const [x1, y1, x2, y2] = det.box;
                    const width = x2 - x1;
                    const height = y2 - y1;

                    // Choose color based on label (default to green for safety, red for hazards)
                    let color = '#10b981'; // green-500
                    if (det.label.toLowerCase().includes('person')) color = '#3b82f6'; // blue-500
                    if (det.label.toLowerCase().includes('hazard') || det.label.toLowerCase().includes('danger')) color = '#ef4444'; // red-500

                    // Draw bounding box
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x1, y1, width, height);

                    // Draw label background
                    if (showLabels) {
                        const labelText = `${det.label} (${Math.round(det.confidence * 100)}%)`;
                        ctx.font = 'bold 24px sans-serif';
                        const textMetrics = ctx.measureText(labelText);
                        
                        ctx.fillStyle = color;
                        ctx.fillRect(x1, y1 - 35, textMetrics.width + 10, 35);

                        // Draw label text
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(labelText, x1 + 5, y1 - 8);
                    }
                });
            };
        };

        draw();
        
        // Handle window resize
        window.addEventListener('resize', draw);
        return () => window.removeEventListener('resize', draw);
    }, [imageUrl, detections, confidenceThreshold, showLabels]);

    return (
        <div ref={containerRef} className="w-full relative rounded-xl overflow-hidden shadow-2xl bg-slate-900 ring-1 ring-white/10">
            <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto block"
            />
        </div>
    );
};
