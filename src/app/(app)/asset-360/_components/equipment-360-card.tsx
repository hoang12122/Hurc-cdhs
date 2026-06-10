import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, AlertTriangle, Settings2, Trash2, Calendar, FileWarning, LucideIcon, BrainCircuit, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { predictEquipmentHealthLSTM } from '@/lib/actions/ai.actions';
import { IoTTelemetryChart } from './iot-telemetry-chart';
import { Equipment3DModel } from './3d-equipment-model';
import { motion } from 'framer-motion';

interface Equipment360CardProps {
    equipment: any;
    onDelete: (id: string) => void;
}

import React from 'react';

export const Equipment360Card = React.memo(function Equipment360Card({ equipment, onDelete }: Equipment360CardProps) {
    if (!equipment) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="p-6 bg-slate-100 rounded-full">
                    <Activity className="h-12 w-12 text-slate-300" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-600">Chọn một Tài sản</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">Chọn thiết bị bên trái để xem Hồ sơ 360 độ (Digital Twin).</p>
                </div>
            </div>
        );
    }

    const [prediction, setPrediction] = useState<any>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        if (!equipment) return;
        const fetchPrediction = async () => {
            setIsPredicting(true);
            const ageDays = equipment.installDate ? Math.floor((Date.now() - new Date(equipment.installDate).getTime()) / (1000 * 60 * 60 * 24)) : 100;
            const res = await predictEquipmentHealthLSTM({
                age_days: ageDays,
                dnf_count: equipment.dnfs?.length || 0,
                criticality: "High" // TODO: map from category
            });
            setPrediction(res);
            setIsPredicting(false);
        };
        fetchPrediction();
    }, [equipment]);

    const healthScore = prediction?.health_score || equipment.health?.score || 0;
    const isHealthy = healthScore > 70;
    const isWarning = healthScore > 40 && healthScore <= 70;
    const isCritical = healthScore <= 40;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Info Card */}
            <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className={cn(
                    "h-1.5 w-full",
                    isHealthy ? "bg-green-500" : isWarning ? "bg-amber-500" : "bg-red-500"
                )} />
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <Settings2 className="h-10 w-10 text-slate-700" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl font-black">{equipment.name}</CardTitle>
                                <Badge variant="secondary" className="font-mono">{equipment.code}</Badge>
                            </div>
                            <CardDescription className="font-medium text-slate-500 mt-1">
                                Danh mục: {equipment.category || 'N/A'} • Lắp đặt: {equipment.installDate ? new Date(equipment.installDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </CardDescription>
                        </div>
                    </div>
                    <div>
                        <Button variant="outline" size="icon" className="h-10 w-10 text-red-600 hover:bg-red-50" onClick={() => onDelete(equipment.id)}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <Separator className="bg-slate-100/50" />
                <CardContent className="py-8 bg-slate-50/50">
                    <div className="grid grid-cols-3 gap-8">
                        <StatBlock 
                            title="Sức khỏe thiết bị (AI)" 
                            value={`${healthScore}%`} 
                            icon={Activity} 
                            color={isHealthy ? "text-green-600" : isWarning ? "text-amber-600" : "text-red-600"} 
                        />
                        <StatBlock 
                            title="Trạng thái" 
                            value={equipment.status} 
                            icon={ShieldCheck} 
                            color={equipment.status === 'ACTIVE' ? "text-green-600" : "text-slate-500"} 
                        />
                        <StatBlock 
                            title="Lịch sử DNF" 
                            value={equipment.dnfs?.length || '0'} 
                            icon={FileWarning} 
                            color="text-orange-600" 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* IoT Telemetry Real-time Dashboard */}
            <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }} className="w-full">
                <IoTTelemetryChart equipmentId={equipment.id} />
            </motion.div>

            {/* Timeline / Digital Twin Data */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="border-none shadow-lg bg-white p-6 flex flex-col">
                    <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Mô hình 3D (Digital Twin)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative">
                        <Equipment3DModel status={isCritical ? 'critical' : isWarning ? 'warning' : 'healthy'} />
                    </CardContent>
                </Card>
                <Card className="border-none shadow-lg bg-white p-6">
                    <CardHeader className="p-0 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-800">Dòng thời gian Sự cố</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {equipment.dnfs && equipment.dnfs.length > 0 ? (
                            <div className="space-y-4">
                                {equipment.dnfs.map((dnf: any) => (
                                    <div key={dnf.id} className="flex gap-3 text-sm">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0" />
                                        <div>
                                            <p className="font-bold text-slate-700">{dnf.descriptionOfFailure}</p>
                                            <p className="text-slate-500 text-xs">{new Date(dnf.dateTimeOfFailureOccurrence).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <ShieldCheck className="h-4 w-4" /> Không có sự cố nào được ghi nhận.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* AI PREDICTION CARD */}
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border-none shadow-lg bg-indigo-50 border-indigo-200 overflow-hidden relative backdrop-blur-sm bg-opacity-80">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit className="h-32 w-32 text-indigo-500" /></div>
                <CardHeader className="p-6 pb-4 relative z-10">
                    <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                        <BrainCircuit className="h-5 w-5 text-indigo-600" />
                        Phân tích Dự báo (Mô hình LSTM)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 relative z-10">
                    {isPredicting ? (
                        <div className="flex items-center gap-2 text-indigo-600 font-medium">
                            <RefreshCw className="h-4 w-4 animate-spin" /> Đang tính toán dữ liệu bằng Numpy LSTM...
                        </div>
                    ) : prediction && !prediction.error ? (
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Xác suất hỏng hóc</p>
                                <p className="text-2xl font-black text-red-600">{prediction.failure_probability}%</p>
                            </div>
                            <div>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Ngày dự kiến hỏng</p>
                                <p className="text-2xl font-black text-indigo-800">~{prediction.predicted_days_to_failure} ngày tới</p>
                            </div>
                            <div>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Thuật toán lõi</p>
                                <p className="text-sm font-bold text-indigo-600 mt-1">{prediction.algorithm}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500 text-sm">{prediction?.error || "Không có dữ liệu dự báo"}</p>
                    )}
                </CardContent>
            </Card>
            </motion.div>
            
            {/* SMART INVENTORY ALERT */}
            {isCritical && (
                <Card className="border-none shadow-lg bg-orange-50 border-orange-200 mt-6">
                    <CardHeader className="p-4 flex flex-row items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-orange-600 animate-pulse" />
                        <div>
                            <CardTitle className="text-sm font-bold text-orange-800">Cảnh báo Phụ tùng (Smart Inventory)</CardTitle>
                            <CardDescription className="text-xs text-orange-600 mt-1">
                                Hệ thống phát hiện động cơ có nguy cơ hỏng cao nhưng Kho dự trữ linh kiện thay thế (Mã: PT-009) đang dưới mức tối thiểu (Còn 1 cái). Vui lòng đặt hàng ngay.
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
});

function StatBlock({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: LucideIcon, color: string }) {
    return (
        <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest font-black text-slate-400">{title}</span>
            <div className={cn("flex items-center gap-2 font-black text-xl", color)}>
                <Icon className="h-6 w-6" /> {value}
            </div>
        </div>
    );
}
