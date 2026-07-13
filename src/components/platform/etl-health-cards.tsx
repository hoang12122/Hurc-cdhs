import { AlertTriangle, CheckCircle2, DatabaseZap, RefreshCw } from 'lucide-react';
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
        ETL Normalizer chưa hoạt động hoặc Phase 2 chưa được bật.
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><DatabaseZap className="h-4 w-4" /> Bronze → Silver</CardDescription>
          <CardTitle className="text-3xl">{ratio(etl.normalized, etl.received)}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">{etl.normalized.toLocaleString('vi-VN')} / {etl.received.toLocaleString('vi-VN')} sự kiện.</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Invalid / DLQ</CardDescription>
          <CardTitle className={etl.invalid > 0 ? 'text-3xl text-red-600' : 'text-3xl'}>{etl.invalid.toLocaleString('vi-VN')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">Dữ liệu lỗi contract được cách ly, không vào Gold.</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Quality warning</CardDescription>
          <CardTitle className="text-3xl">{etl.qualityWarnings.toLocaleString('vi-VN')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">Publish failure: {etl.publishFailures.toLocaleString('vi-VN')}.</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Checkpoint</CardDescription>
          <CardTitle className="text-xl">{etl.commits.toLocaleString('vi-VN')} commits</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-500">Lần xử lý gần nhất: {lastProcessed(etl.lastProcessedAt)}.</CardContent>
      </Card>
    </section>
  );
}
