'use client';

import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeTelemetryTrend } from '@/lib/actions/ai.actions';
import { getAssetTelemetry } from '@/lib/actions/telemetry.actions';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, Thermometer, Zap, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TelemetryChartProps {
    assetId: string;
    assetName: string;
}

export function TelemetryChart({ assetId, assetName }: TelemetryChartProps) {
    const [data, setData] = React.useState<any[]>([]);
    const [analysis, setAnalysis] = React.useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const loadData = async () => {
        const history = await getAssetTelemetry(assetId);
        setData(history.reverse().map(h => ({
            time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: h.value,
            unit: h.unit
        })));
        setIsLoading(false);
    };

    React.useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [assetId]);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeTelemetryTrend(assetName, data);
            setAnalysis(result);
        } catch (e) {
            setAnalysis("Không thể phân tích dữ liệu lúc này.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) return <div className="h-48 flex items-center justify-center animate-pulse bg-slate-50 rounded-xl">Loading health data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Chỉ số vận hành (Real-time)</h3>
                </div>
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || data.length === 0}
                >
                    {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
                    Chuyên gia AI Phân tích
                </Button>
            </div>

            <div className="h-64 w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-inner">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#4f46e5" 
                                strokeWidth={3} 
                                dot={{ fill: '#4f46e5', r: 4 }} 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Zap className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs">Chưa có dữ liệu cảm biến (SNMP)</p>
                    </div>
                )}
            </div>

            {analysis && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-indigo-600 text-white font-bold">AI INSIGHT</Badge>
                        <span className="text-xs text-indigo-400 font-medium">Bảo trì dự báo từ Chuyên gia Metro</span>
                    </div>
                    <p className="text-xs text-indigo-900 leading-relaxed font-medium whitespace-pre-wrap">{analysis}</p>
                </div>
            )}
        </div>
    );
}
