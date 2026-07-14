'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, History, RefreshCcw, Route, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { EtlOperationsOverview } from '@/lib/services/etl-operations-service';

function formatTime(value: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('vi-VN');
}

function statusClass(status: string) {
  if (status === 'COMPLETED' || status === 'RUNNING') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'FAILED') return 'border-red-200 bg-red-50 text-red-800';
  if (status === 'APPROVED') return 'border-blue-200 bg-blue-50 text-blue-800';
  return 'border-slate-200 bg-slate-50 text-slate-700';
}

export function EtlOperationsPanel() {
  const [data, setData] = useState<EtlOperationsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const response = await fetch('/api/platform/etl/operations', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json() as EtlOperationsOverview;
      setData(payload);
      setError(payload.error);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể tải ETL operations.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh(true);
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 pb-8 md:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-950">Điều hành ETL chuyên sâu</h2>
          <p className="text-sm text-slate-500">Pipeline run, data quality, checksum collision và replay có kiểm soát.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={refreshing}>
          <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Làm mới
        </Button>
      </div>

      {(loading || error) && (
        <div className={`rounded-2xl border p-4 text-sm ${error ? 'border-amber-200 bg-amber-50 text-amber-900' : 'bg-white text-slate-500'}`}>
          {error ?? 'Đang tải dữ liệu vận hành ETL...'}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Route className="h-5 w-5" /> Pipeline runs</CardTitle>
            <CardDescription>Đối chiếu input, output, duplicate, collision, invalid và late event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.pipelineRuns.length === 0 && <p className="text-sm text-slate-500">Chưa có pipeline run.</p>}
            {data?.pipelineRuns.slice(0, 6).map(run => (
              <div key={run.runId} className="rounded-2xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-slate-900">{run.pipelineName} · {run.mode}</div>
                  <Badge className={statusClass(run.status)}>{run.status}</Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
                  <span>Input {run.inputCount}</span><span>Output {run.outputCount}</span>
                  <span>Duplicate {run.duplicateCount}</span><span>Collision {run.conflictCount}</span>
                  <span>Invalid {run.invalidCount}</span><span>Late {run.lateCount}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">{formatTime(run.startedAt)}</div>
                {run.lastError && <div className="mt-2 text-xs text-red-700">{run.lastError}</div>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Data quality gần nhất</CardTitle>
            <CardDescription>DLQ và cảnh báo được định danh theo topic/partition/offset.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.qualityIssues.length === 0 && <p className="text-sm text-slate-500">Không có lỗi chất lượng gần đây.</p>}
            {data?.qualityIssues.slice(0, 8).map(issue => (
              <div key={issue.id} className="rounded-2xl border p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={issue.severity === 'ERROR' ? 'destructive' : 'outline'}>{issue.severity}</Badge>
                  <span className="font-semibold">{issue.code}</span>
                </div>
                <div className="mt-1 break-all text-xs text-slate-500">{issue.topic}:{issue.partition ?? '—'}:{issue.offset ?? '—'}</div>
                {issue.detail && <div className="mt-1 line-clamp-2 text-xs text-slate-600">{issue.detail}</div>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> Checksum collision</CardTitle>
            <CardDescription>Cùng eventId nhưng nội dung khác bị cách ly, không ghi đè dữ liệu chuẩn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.collisions.length === 0 && <p className="text-sm text-emerald-700">Không ghi nhận checksum collision.</p>}
            {data?.collisions.map(item => (
              <div key={item.eventId} className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <div className="break-all font-semibold">{item.eventId}</div>
                <div className="mt-1 text-xs">Seen {item.seenCount} · Conflict {item.conflictCount} · {formatTime(item.lastSeenAt)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Replay requests</CardTitle>
            <CardDescription>Chỉ worker mới được thực thi yêu cầu đã duyệt theo dual-control.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.replayRequests.length === 0 && <p className="text-sm text-slate-500">Chưa có yêu cầu replay.</p>}
            {data?.replayRequests.map(item => (
              <div key={item.id} className="rounded-2xl border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{item.sourceTopic} → {item.targetTopic}</span>
                  <Badge className={statusClass(item.status)}>{item.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-slate-500">{item.replayedCount} bản ghi · attempt {item.attemptCount} · {formatTime(item.requestedAt)}</div>
                {item.lastError && <div className="mt-1 line-clamp-2 text-xs text-red-700">{item.lastError}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
