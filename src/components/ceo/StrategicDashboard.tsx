'use client';

import React, { useEffect, useState } from 'react';
import { 
    ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import { 
    TrendingUp, ShieldCheck, Users, Zap, Brain, 
    ArrowUpRight, ArrowDownRight, Target, Activity,
    ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * CEO STRATEGIC DASHBOARD
 * Cung cấp cái nhìn toàn cảnh về sức khỏe và chiến lược của HURC1
 */

export default function StrategicDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const generateReport = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/ceo/strategic-metrics', { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                alert(`Báo cáo đã được tạo tại: ${result.filePath}`);
            }
        } catch (error) {
            console.error("Report generation failed:", error);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ceo/strategic-metrics');
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch strategic metrics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-amber-500"><Brain className="animate-pulse mr-2" /> Loading CEO Brain...</div>;
    if (!data) return <div>Error loading strategic data.</div>;

    const radarData = [
        { subject: 'Năng suất', A: data.metrics.operations.productivityIndex, fullMark: 100 },
        { subject: 'Vận hành', A: data.metrics.operations.utilizationRate, fullMark: 100 },
        { subject: 'Nhân sự', A: data.metrics.humanCapital.retentionRate, fullMark: 100 },
        { subject: 'Chất lượng', A: data.metrics.quality.serviceRecoveryRate, fullMark: 100 },
        { subject: 'An toàn', A: data.metrics.safety.hazardMitigationRate, fullMark: 100 },
    ];

    return (
        <div className="p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-slate-200">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                        CEO Strategic Command Center
                    </h1>
                    <p className="text-slate-500 mt-2 uppercase tracking-widest text-xs font-semibold">
                        Hệ điều hành quản trị tối cao - Dựa trên Bản đồ Não bộ CEO
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <button 
                        onClick={generateReport}
                        disabled={generating}
                        className="px-4 py-2 bg-amber-500 text-[#0a0a0a] rounded-lg text-sm font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50"
                    >
                        <Brain size={14} className={generating ? "animate-spin" : ""} /> 
                        {generating ? "Đang lập báo cáo..." : "Lập báo cáo Chiến lược"}
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-sm hover:bg-amber-500/20 transition-all flex items-center gap-2"
                    >
                        <Zap size={14} /> In nhanh
                    </button>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">Dữ liệu cập nhật lúc</p>
                        <p className="text-sm font-mono text-amber-400">{new Date(data.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Quick Overview Section (Nhìn nhanh toàn bộ doanh nghiệp) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-transparent to-transparent border border-amber-500/10 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="text-amber-500" />
                    <h2 className="text-xl font-bold text-amber-100">Nhìn nhanh toàn bộ hệ thống</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <QuickStat label="Dòng tiền" status="HEALTHY" value="0.92x" />
                    <QuickStat label="Vận hành" status={data.metrics.quality.healthScore > 80 ? "EXCELLENT" : "STABLE"} value={`${data.metrics.quality.healthScore}%`} />
                    <QuickStat label="Nhân sự" status="STABLE" value={`${data.metrics.humanCapital.retentionRate}%`} />
                    <QuickStat label="An toàn" status={data.metrics.safety.criticalFailureRisk > 0.5 ? "WARNING" : "SAFE"} value={data.metrics.safety.criticalFailureRisk > 0.5 ? "Alert" : "Secure"} />
                    <QuickStat label="Tăng trưởng" status="UPWARD" value="+15.2%" />
                </div>
            </div>

            {/* Top Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard 
                    title="Health Score" 
                    value={`${data.metrics.quality.healthScore}%`} 
                    icon={<Activity className="text-emerald-500" />}
                    trend="+2.4%"
                    description="Sức khỏe hệ thống tổng thể"
                />
                <MetricCard 
                    title="Risk Level" 
                    value={data.metrics.safety.criticalFailureRisk > 0.5 ? "HIGH" : "SAFE"} 
                    icon={<ShieldAlert className={data.metrics.safety.criticalFailureRisk > 0.5 ? "text-rose-500" : "text-emerald-500"} />}
                    trend="LOW"
                    description="Rủi ro lỗi hệ thống nghiêm trọng"
                />
                <MetricCard 
                    title="Productivity" 
                    value={`${data.metrics.operations.productivityIndex}%`} 
                    icon={<Target className="text-amber-500" />}
                    trend="+12%"
                    description="Hiệu suất xử lý sự cố"
                />
                <MetricCard 
                    title="Retention" 
                    value={`${data.metrics.humanCapital.retentionRate}%`} 
                    icon={<Users className="text-sky-500" />}
                    trend="STABLE"
                    description="Tỉ lệ giữ chân nhân sự cốt lõi"
                />
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Radar Chart - Strategic Balance */}
                <Card className="lg:col-span-1 bg-[#121212]/50 backdrop-blur-xl border-amber-900/30">
                    <CardHeader>
                        <CardTitle className="text-amber-100 flex items-center gap-2">
                            <Brain size={18} /> Strategic Balance
                        </CardTitle>
                        <CardDescription className="text-slate-500">Cân bằng các trụ cột quản trị</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="CEO Brain"
                                    dataKey="A"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* AI Insights - Actionable Guidance */}
                <Card className="lg:col-span-2 bg-[#121212]/50 backdrop-blur-xl border-amber-900/30 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-amber-900/10 to-transparent">
                        <CardTitle className="text-amber-100 flex items-center gap-2">
                            <Zap className="text-amber-500" size={18} /> AI Strategic Insights
                        </CardTitle>
                        <CardDescription className="text-slate-500">Lời khuyên từ Gemma-4 Brain</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        {data.insights.map((insight: string, idx: number) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 items-start">
                                <div className="bg-amber-500/20 p-2 rounded-full text-amber-500 shrink-0">
                                    <ArrowUpRight size={16} />
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                            </div>
                        ))}
                        {data.insights.length === 0 && (
                            <div className="text-center py-10 text-slate-600 italic">AI đang phân tích xu hướng...</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Operational Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-[#121212] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Hiệu quả vận hành</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tỉ lệ khai thác máy móc</span>
                                <span className="text-amber-400">{data.metrics.operations.utilizationRate}%</span>
                            </div>
                            <Progress value={data.metrics.operations.utilizationRate} className="h-1 bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Kiểm soát chi phí (Actual/Budget)</span>
                                <span className="text-emerald-400">{data.metrics.operations.costRatio * 100}%</span>
                            </div>
                            <Progress value={data.metrics.operations.costRatio * 100} className="h-1 bg-slate-800" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#121212] border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Rủi ro & An toàn</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Xử lý mối nguy (Hazards)</span>
                                <span className="text-emerald-400">{data.metrics.safety.hazardMitigationRate}%</span>
                            </div>
                            <Progress value={data.metrics.safety.hazardMitigationRate} className="h-1 bg-slate-800" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tỉ lệ phục hồi dịch vụ (Service Recovery)</span>
                                <span className="text-emerald-400">{data.metrics.quality.serviceRecoveryRate}%</span>
                            </div>
                            <Progress value={data.metrics.quality.serviceRecoveryRate} className="h-1 bg-slate-800" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend, description }: any) {
    return (
        <Card className="bg-[#121212]/40 backdrop-blur-md border-slate-800 hover:border-amber-500/30 transition-all duration-300">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-amber-500">
                        {icon}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') || trend === 'SAFE' || trend === 'STABLE' || trend === 'HEALTHY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend === 'STABLE' || trend === 'HEALTHY' ? <Activity size={12} /> : trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trend}
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                    <p className="text-sm font-semibold text-slate-200 mt-1 uppercase tracking-tighter opacity-80">{title}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-tight">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickStat({ label, status, value }: any) {
    const isGood = status === 'HEALTHY' || status === 'EXCELLENT' || status === 'STABLE' || status === 'UPWARD' || status === 'SAFE';
    return (
        <div className="space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{label}</p>
            <p className="text-lg font-bold text-amber-100">{value}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isGood ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                {status}
            </span>
        </div>
    );
}
