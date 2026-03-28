'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getSystemHealthOverview } from '@/lib/actions/analytics.actions';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
    Activity, 
    ArrowUpRight, 
    AlertTriangle, 
    CheckCircle2, 
    Clock, 
    BarChart3, 
    ShieldCheck, 
    Zap,
    Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ReliabilityDashboard() {
    const [stats, setStats] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        getSystemHealthOverview().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-12 text-center text-slate-400 animate-pulse font-black uppercase tracking-widest">Đang tính toán chỉ số độ tin cậy...</div>;

    const avgMtbf = Math.round(stats.reduce((acc, s) => acc + s.mtbf, 0) / stats.length);
    const avgMttr = Math.round((stats.reduce((acc, s) => acc + s.mttr, 0) / stats.length) * 10) / 10;
    const criticalAssets = stats.filter(s => s.mtbf < 100).length;

    const subsystemData = Array.from(new Set(stats.map(s => s.subsystem))).map(sub => {
        const subStats = stats.filter(s => s.subsystem === sub);
        return {
            name: sub,
            mtbf: Math.round(subStats.reduce((acc, s) => acc + s.mtbf, 0) / subStats.length),
            failures: subStats.reduce((acc, s) => acc + s.totalFailures, 0)
        };
    });

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Reliability Dashboard</h1>
                    <p className="text-slate-500 font-medium">Báo cáo hiệu suất kỹ thuật & Độ tin cậy hệ thống Metro</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-200">Xuất báo cáo PDF</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Lập kế hoạch bảo trì</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-none shadow-xl bg-white rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl">
                            <Activity className="h-6 w-6 text-indigo-600" />
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-none">+12%</Badge>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">MTBF Hệ thống (Avg)</p>
                    <h2 className="text-3xl font-black text-slate-900">{avgMtbf}h</h2>
                </Card>

                <Card className="border-none shadow-xl bg-white rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-2xl">
                            <Clock className="h-6 w-6 text-amber-600" />
                        </div>
                        <Badge className="bg-amber-50 text-amber-700 border-none">-5%</Badge>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">MTTR Trung bình</p>
                    <h2 className="text-3xl font-black text-slate-900">{avgMttr}h</h2>
                </Card>

                <Card className="border-none shadow-xl bg-white rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Thiết bị rủi ro (MTBF &lt; 100h)</p>
                    <h2 className="text-3xl font-black text-slate-900">{criticalAssets}</h2>
                </Card>

                <Card className="border-none shadow-xl bg-indigo-600 rounded-3xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-xs font-black opacity-80 uppercase tracking-widest mb-1">Độ sẵn sàng (Availability)</p>
                    <h2 className="text-3xl font-black">99.8%</h2>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subsystem Chart */}
                <Card className="border-none shadow-xl bg-white rounded-[40px] p-8">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl font-black">Hiệu suất theo Hệ thống con</CardTitle>
                        <CardDescription>So sánh MTBF (giờ) giữa các bộ phận</CardDescription>
                    </CardHeader>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subsystemData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} fontSize={11} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="mtbf" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Worst Performing Assets */}
                <Card className="border-none shadow-xl bg-white rounded-[40px] p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black">Thiết bị cần lưu ý</h3>
                        <Trophy className="h-6 w-6 text-slate-300" />
                    </div>
                    <div className="space-y-4">
                        {stats.sort((a,b) => a.mtbf - b.mtbf).slice(0, 5).map(asset => (
                            <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm">
                                        <Zap className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{asset.name}</p>
                                        <p className="text-[10px] font-medium text-slate-400 capitalize">{asset.subsystem}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-red-600">{asset.mtbf}h</p>
                                    <p className="text-[10px] font-medium text-slate-400">MTBF</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
