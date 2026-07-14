import { AlertTriangle, CheckCircle2, DatabaseZap, History, ShieldCheck, TimerReset } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlatformStatus } from './use-converged-control-center';

function ratio(normalized: number, received: number) {
  if (received <= 0) return '—';
  return `${((normalized / received) * 100).toFixed(1)}%`;
}

function lastProcessed(value: string | null) {
  if (!value) return 'Chưa có sự kiện';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Không xác định';
  return parsed.toLocaleString('vi-VN');
}

export function EtlHealthCards({ etl }: { etl: PlatformStatus['etl'] }) {
  if (!etl) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-6 text-sm text-slate-500">
        Canonical ETL chưa hoạt động hoặc Phase 2 chưa được bật.
      </div>
    );
  }

  const sink = etl.sink;
  const replay = etl.replay;
  const lag = Math.max(etl.consumerLag, sink?.consumerLag ?? 0);
  const collisions = sink?.conflicts ?? 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><DatabaseZap className="h-4 w-4" /> Bronze → Silver</CardDescription>
          <CardTitle className="text-3xl">{ratio(etl.normalized, etl.received)}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          {etl.normalized.toLocaleString('vi-VN')} / {etl.received.toLocaleString('vi-VN')} sự kiện · batch gần nhất {etl.lastBatchSize.toLocaleString('vi-VN')}.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><TimerReset className="h-4 w-4" /> Độ trễ pipeline</CardDescription>
          <CardTitle className={lag > 0 ? 'text-3xl text-amber-600' : 'text-3xl'}>{lag.toLocaleString('vi-VN')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Consumer lag lớn nhất · batch latency {etl.lastBatchLatencyMs.toLocaleString('vi-VN')} ms.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Invalid / Collision</CardDescription>
          <CardTitle className={etl.invalid + collisions > 0 ? 'text-3xl text-red-600' : 'text-3xl'}>
            {(etl.invalid + collisions).toLocaleString('vi-VN')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          DLQ {etl.invalid.toLocaleString('vi-VN')} · checksum collision {collisions.toLocaleString('vi-VN')}.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Chất lượng và late data</CardDescription>
          <CardTitle className="text-3xl">{etl.qualityWarnings.toLocaleString('vi-VN')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Late {etl.lateEvents.toLocaleString('vi-VN')} · publish failure {etl.publishFailures.toLocaleString('vi-VN')}.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Contract / Effectively-once</CardDescription>
          <CardTitle className="text-xl">{etl.schemaRegistered ? 'Schema đã đăng ký' : 'Schema chưa xác nhận'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          Sink {sink?.inserted.toLocaleString('vi-VN') ?? '—'} inserted · {sink?.duplicates.toLocaleString('vi-VN') ?? '—'} duplicate bỏ qua.
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><History className="h-4 w-4" /> Replay có kiểm soát</CardDescription>
          <CardTitle className={replay?.failed ? 'text-xl text-red-600' : 'text-xl'}>
            {replay?.activeRequestId ? 'Đang replay' : `${replay?.completed ?? 0} hoàn tất`}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">
          {(replay?.replayed ?? 0).toLocaleString('vi-VN')} sự kiện · {replay?.failed ?? 0} thất bại · cập nhật {lastProcessed(replay?.lastCompletedAt ?? etl.lastProcessedAt)}.
        </CardContent>
      </Card>
    </section>
  );
}
