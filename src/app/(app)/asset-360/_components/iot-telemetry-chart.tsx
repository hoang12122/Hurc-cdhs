"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataPoint {
    time: string;
    vibration: number;
    temperature: number;
}

export function IoTTelemetryChart({ equipmentId }: { equipmentId: string }) {
    const [data, setData] = useState<DataPoint[]>([]);
    const [isAlert, setIsAlert] = useState(false);

    // Sinh dữ liệu khởi tạo (15 giây trước)
    useEffect(() => {
        const initialData: DataPoint[] = [];
        const now = new Date();
        for (let i = 15; i >= 0; i--) {
            const t = new Date(now.getTime() - i * 1000);
            initialData.push({
                time: t.toLocaleTimeString('vi-VN', { second: '2-digit', minute: '2-digit' }),
                vibration: 2.0 + Math.random() * 0.5,
                temperature: 45 + Math.random() * 2
            });
        }
        setData(initialData);
        setIsAlert(false);

        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1)];
                const lastVib = prev[prev.length - 1].vibration;
                const lastTemp = prev[prev.length - 1].temperature;
                
                // Thỉnh thoảng tạo spike (cảnh báo) ngẫu nhiên (10% cơ hội)
                const isSpike = Math.random() > 0.9;
                
                const newVib = isSpike ? lastVib + Math.random() * 3 + 1 : 2.0 + Math.random() * 0.5;
                const newTemp = isSpike ? lastTemp + Math.random() * 5 : 45 + Math.random() * 2;
                
                if (newVib > 4.5 || newTemp > 55) {
                    setIsAlert(true);
                } else {
                    setIsAlert(false);
                }

                newData.push({
                    time: new Date().toLocaleTimeString('vi-VN', { second: '2-digit', minute: '2-digit' }),
                    vibration: Number(newVib.toFixed(2)),
                    temperature: Number(newTemp.toFixed(1))
                });
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [equipmentId]);

    return (
        <Card className={cn("border-none shadow-lg transition-colors duration-500", isAlert ? "bg-red-50 border-red-200" : "bg-white")}>
            <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                    <Activity className={cn("h-4 w-4", isAlert ? "text-red-600 animate-pulse" : "text-blue-500")} /> 
                    Giám sát Cảm biến Thời gian thực (IoT)
                </CardTitle>
                {isAlert && (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">
                        <AlertTriangle className="h-3 w-3" /> VƯỢT NGƯỠNG
                    </span>
                )}
            </CardHeader>
            <CardContent className="p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} tickMargin={10} />
                        <YAxis yAxisId="left" domain={[0, 8]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[30, 80]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <ReferenceLine y={4.5} yAxisId="left" stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Ngưỡng Rung', fill: 'red', fontSize: 10 }} />
                        
                        <Line 
                            yAxisId="left" 
                            type="monotone" 
                            dataKey="vibration" 
                            name="Độ rung (mm/s)" 
                            stroke={isAlert ? "#ef4444" : "#3b82f6"} 
                            strokeWidth={2} 
                            dot={false}
                            isAnimationActive={false} 
                        />
                        <Line 
                            yAxisId="right" 
                            type="monotone" 
                            dataKey="temperature" 
                            name="Nhiệt độ (°C)" 
                            stroke="#f59e0b" 
                            strokeWidth={2} 
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
