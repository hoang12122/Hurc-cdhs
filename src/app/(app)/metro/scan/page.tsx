'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, CheckCircle, ArrowLeft, Loader2, Settings2, Smartphone } from 'lucide-react';
import { metroDb } from '@/lib/prisma'; // This won't work on client, need action
import { getAssets } from '@/lib/actions/asset.actions';

export default function TechnicianScanPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const assetId = searchParams.get('id');
    const [asset, setAsset] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (assetId) {
            // Find asset in list (simple for now)
            getAssets().then(all => {
                const found = all.find(a => a.id === assetId);
                setAsset(found);
                setLoading(false);
            });
        }
    }, [assetId]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Đang tải dữ liệu thiết bị...</p>
        </div>
    );

    if (!asset) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
            <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
            <h2 className="text-xl font-black text-slate-900 mb-2">Không tìm thấy thiết bị</h2>
            <p className="text-slate-500 mb-6">Mã QR có thể không hợp lệ hoặc thiết bị đã bị xóa.</p>
            <Button onClick={() => router.push('/metro/assets')}>Quay lại Asset Hub</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-indigo-700 text-white p-6 pb-20 rounded-b-[40px] shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5 opacity-80" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">Technician Mode</span>
                    </div>
                </div>
                
                <h1 className="text-3xl font-black mb-2">{asset.name}</h1>
                <div className="flex items-center gap-2 opacity-90">
                    <Settings2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{asset.code} • {asset.subsystem}</span>
                </div>
            </div>

            <div className="px-6 -mt-12 space-y-6">
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-6 bg-white flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mb-1">Trạng thái vận hành</p>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-lg font-bold text-slate-900 italic">Vận hành bình thường</span>
                            </div>
                        </div>
                        <Activity className="h-10 w-10 text-indigo-100" />
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                    <Button 
                        variant="outline" 
                        className="h-24 bg-white border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-900 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm transition-all"
                        onClick={() => router.push(`/admin/dnf/new?assetId=${asset.id}`)}
                    >
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                        <span className="font-black text-sm uppercase">Báo cáo DNF mới</span>
                    </Button>

                    <Button 
                        variant="outline" 
                        className="h-24 bg-white border-2 border-slate-100 hover:border-amber-200 hover:bg-amber-50 text-slate-900 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm transition-all"
                        onClick={() => router.push(`/admin/hazards/new?assetId=${asset.id}`)}
                    >
                        <Activity className="h-8 w-8 text-amber-500" />
                        <span className="font-black text-sm uppercase">Ghi nhận Mối nguy</span>
                    </Button>

                    <Button 
                        variant="outline" 
                        className="h-24 bg-white border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-900 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-sm transition-all"
                        onClick={() => router.push(`/inspections/new?assetId=${asset.id}`)}
                    >
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                        <span className="font-black text-sm uppercase">Kiểm tra định kỳ</span>
                    </Button>
                </div>

                <div className="pt-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Thông số kỹ thuật</h3>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        {asset.specification ? (
                            <pre className="text-xs font-medium text-slate-600 font-mono">
                                {JSON.stringify(asset.specification, null, 2)}
                            </pre>
                        ) : (
                            <p className="text-xs text-slate-400 text-center py-4">Chưa có thông số chi tiết</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
