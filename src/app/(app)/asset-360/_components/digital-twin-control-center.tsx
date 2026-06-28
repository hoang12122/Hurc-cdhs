"use client";

import { useMemo } from 'react';
import { Activity, AlertTriangle, BrainCircuit, Cable, CheckCircle2, DatabaseZap, Gauge, Layers3, ListChecks, Radar, RefreshCw, ShieldCheck, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createDigitalTwinSnapshot, DigitalTwinSeverity } from '@/lib/digital-twin/digital-twin-engine';

interface DigitalTwinControlCenterProps {
  equipment: any;
  prediction?: any;
}

const severityMeta: Record<DigitalTwinSeverity, { label: string; className: string; icon: any }> = {
  normal: { label: 'Ổn định', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  watch: { label: 'Theo dõi', className: 'bg-sky-50 text-sky-700 border-sky-200', icon: Radar },
  warning: { label: 'Cảnh báo', className: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
  critical: { label: 'Nguy cấp', className: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle },
};

function formatSyncState(state: 'live' | 'simulated' | 'offline') {
  if (state === 'live') return 'Đồng bộ tốt';
  if (state === 'simulated') return 'Mô phỏng/thiếu dữ liệu';
  return 'Chưa đủ dữ liệu';
}

export function DigitalTwinControlCenter({ equipment, prediction }: DigitalTwinControlCenterProps) {
  const snapshot = useMemo(() => createDigitalTwinSnapshot(equipment, prediction), [equipment, prediction]);
  const StatusIcon = severityMeta[snapshot.severity].icon;

  return (
    <div className="space-y-6">
      <Card className="border-none bg-slate-950 text-white shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Layers3 className="h-5 w-5 text-cyan-300" />
                Digital Twin Control Center
              </CardTitle>
              <CardDescription className="text-slate-300 mt-1">
                {snapshot.twinId} • {snapshot.assetKind} • Cập nhật {new Date(snapshot.lastUpdatedAt).toLocaleTimeString('vi-VN')}
              </CardDescription>
            </div>
            <Badge className={cn('border font-bold', severityMeta[snapshot.severity].className)}>
              <StatusIcon className="h-3.5 w-3.5 mr-1" /> {severityMeta[snapshot.severity].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <TwinMetric title="Điểm rủi ro" value={`${snapshot.riskScore}/100`} icon={Gauge} helper="Tổng hợp sức khỏe, DNF, mối nguy và AI" />
          <TwinMetric title="Độ tin cậy dữ liệu" value={`${snapshot.dataConfidence}%`} icon={DatabaseZap} helper={formatSyncState(snapshot.synchronizationState)} />
          <TwinMetric title="Xác suất hỏng" value={`${snapshot.failureProbability}%`} icon={BrainCircuit} helper="Từ mô hình dự báo hiện có" />
          <TwinMetric title="Tuổi thọ còn lại" value={snapshot.remainingUsefulLifeDays === null ? 'N/A' : `~${snapshot.remainingUsefulLifeDays} ngày`} icon={Activity} helper="RUL ước tính" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <Card className="xl:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-800">
              <Cable className="h-5 w-5 text-cyan-600" />
              Luồng Digital Thread
            </CardTitle>
            <CardDescription>Liên kết mô hình vật lý, dữ liệu cảm biến, độ tin cậy và hành động bảo trì.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {snapshot.digitalThread.map((item) => {
              const ItemIcon = severityMeta[item.status].icon;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ItemIcon className="h-4 w-4 text-slate-500 shrink-0" />
                      <span className="font-bold text-sm text-slate-700 truncate">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-500">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2 bg-slate-100" />
                  <p className="text-xs leading-relaxed text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="xl:col-span-3 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-800">
              <Activity className="h-5 w-5 text-cyan-600" />
              Bản đồ cảm biến & ngưỡng vận hành
            </CardTitle>
            <CardDescription>Các chỉ số dưới đây được hợp nhất từ dữ liệu tài sản, DNF, health score và mô phỏng IoT.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshot.sensors.map((sensor) => {
              const SensorIcon = severityMeta[sensor.state].icon;
              return (
                <div key={sensor.id} className="rounded-2xl border bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-800">{sensor.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{sensor.source}</p>
                    </div>
                    <Badge variant="outline" className={cn('font-bold', severityMeta[sensor.state].className)}>
                      <SensorIcon className="h-3 w-3 mr-1" /> {severityMeta[sensor.state].label}
                    </Badge>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-slate-900">{sensor.value}<span className="text-sm text-slate-400 ml-1">{sensor.unit}</span></p>
                    <p className="text-xs font-bold text-slate-400">Ngưỡng: {sensor.threshold}{sensor.unit}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{sensor.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-800">
              <ListChecks className="h-5 w-5 text-cyan-600" />
              Khuyến nghị vận hành và bảo trì
            </CardTitle>
            <CardDescription>Đề xuất hành động dựa trên trạng thái Digital Twin hiện tại.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.recommendedActions.map((action, index) => (
              <div key={`${action}-${index}`} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                <div className="h-6 w-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-black shrink-0">{index + 1}</div>
                <p className="text-sm leading-relaxed text-slate-700 font-medium">{action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2 text-slate-800">
              <ShieldCheck className="h-5 w-5 text-cyan-600" />
              Hồ sơ vận hành
            </CardTitle>
            <CardDescription>Các điều kiện cần duy trì trong hồ sơ tài sản số.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.operatingEnvelope.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <Wrench className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
            <Separator />
            <div className="rounded-xl bg-cyan-50 p-3 text-xs leading-relaxed text-cyan-800 font-medium">
              Luồng dữ liệu đề xuất: BIM/3D Model + IoT/SNMP + DNF + Hazard + Maintenance + AI Prediction. Khi tích hợp thật, thay lớp mô phỏng bằng API telemetry hoặc broker MQTT/SCADA Gateway.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TwinMetric({ title, value, helper, icon: Icon }: { title: string; value: string; helper: string; icon: any }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
        <Icon className="h-4 w-4" /> {title}
      </div>
      <p className="text-2xl font-black mt-3">{value}</p>
      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{helper}</p>
    </div>
  );
}
