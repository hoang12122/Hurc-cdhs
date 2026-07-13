'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Blocks,
  BrainCircuit,
  CheckCircle2,
  Database,
  RefreshCcw,
  RadioTower,
  ServerCog,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type PlatformFocus = 'iot' | 'data-platform' | 'mlops' | 'evidence-ledger';

type ComponentStatus = 'HEALTHY' | 'DEGRADED' | 'DISABLED';

interface PlatformStatus {
  phase: number;
  status: ComponentStatus;
  components: Array<{
    id: string;
    name: string;
    phase: number;
    status: ComponentStatus;
    latencyMs: number | null;
    detail: string;
  }>;
  outbox: { pending: number; retrying: number; oldestPendingSeconds: number | null } | null;
  checkedAt: string;
}

interface TwinOverview {
  generatedAt: string;
  telemetryAvailable: boolean;
  overallScore: number;
  counts: { healthy: number; watch: number; degraded: number; critical: number };
  assets: Array<{
    id: string;
    code: string;
    name: string;
    stationId: string | null;
    subsystem: string | null;
    openDnfs: number;
    openHazards: number;
    lastTelemetryAt: string | null;
    health: {
      score: number;
      band: 'HEALTHY' | 'WATCH' | 'DEGRADED' | 'CRITICAL';
      confidence: number;
      factors: Array<{ label: string; penalty: number }>;
    };
  }>;
}

const focusConfig = {
  iot: {
    title: 'IoT Operations',
    description: 'Quản lý kết nối thiết bị, chất lượng telemetry và sức khỏe gateway.',
    icon: RadioTower,
    requiredPhase: 1,
    checklist: ['Định danh thiết bị riêng', 'Đồng bộ thời gian', 'Theo dõi mất kết nối', 'Kiểm soát chất lượng payload'],
  },
  'data-platform': {
    title: 'Data Platform',
    description: 'Theo dõi event backbone, raw zone, OLAP, outbox và khả năng replay.',
    icon: Database,
    requiredPhase: 2,
    checklist: ['Outbox không tồn đọng', 'Kafka consumer không lag', 'Raw zone bất biến', 'Schema có version'],
  },
  mlops: {
    title: 'MLOps & AI Reliability',
    description: 'Quản trị mô hình, độ lệch, bằng chứng huấn luyện và phê duyệt triển khai.',
    icon: BrainCircuit,
    requiredPhase: 3,
    checklist: ['Dataset có version', 'Model được phê duyệt', 'Theo dõi drift', 'Có canary và rollback'],
  },
  'evidence-ledger': {
    title: 'Evidence Ledger',
    description: 'Xác minh hash bằng chứng, signer và trạng thái neo chuỗi khối.',
    icon: Blocks,
    requiredPhase: 4,
    checklist: ['Không lưu dữ liệu thật on-chain', 'External signer ở production', 'Khóa trong KMS/HSM', 'Có quy trình revoke'],
  },
} as const;

const navItems: Array<{ id: PlatformFocus; href: string; label: string }> = [
  { id: 'iot', href: '/iot', label: 'IoT' },
  { id: 'data-platform', href: '/data-platform', label: 'Data Platform' },
  { id: 'mlops', href: '/mlops', label: 'MLOps' },
  { id: 'evidence-ledger', href: '/evidence-ledger', label: 'Evidence Ledger' },
];

function statusClass(status: ComponentStatus | TwinOverview['assets'][number]['health']['band']) {
  if (status === 'HEALTHY') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (status === 'WATCH') return 'bg-amber-100 text-amber-800 border-amber-200';
  if (status === 'DEGRADED') return 'bg-orange-100 text-orange-800 border-orange-200';
  if (status === 'CRITICAL') return 'bg-red-100 text-red-800 border-red-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

function formatAge(value: string | null) {
  if (!value) return 'Chưa có dữ liệu';
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} giờ trước`;
  return `${Math.round(minutes / 1440)} ngày trước`;
}

export function ConvergedControlCenter({ focus }: { focus: PlatformFocus }) {
  const config = focusConfig[focus];
  const Icon = config.icon;
  const [platform, setPlatform] = useState<PlatformStatus | null>(null);
  const [twin, setTwin] = useState<TwinOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [platformResponse, twinResponse] = await Promise.all([
        fetch('/api/platform/status', { cache: 'no-store' }),
        fetch('/api/digital-twin/overview', { cache: 'no-store' }),
      ]);
      if (!platformResponse.ok || !twinResponse.ok) throw new Error('Không thể tải dữ liệu điều hành.');
      const [platformData, twinData] = await Promise.all([platformResponse.json(), twinResponse.json()]);
      setPlatform(platformData);
      setTwin(twinData);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Không thể tải dữ liệu điều hành.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const visibleComponents = useMemo(
    () => platform?.components.filter(item => item.phase <= Math.max(config.requiredPhase, platform.phase)) ?? [],
    [config.requiredPhase, platform],
  );
  const riskAssets = twin?.assets.slice(0, 8) ?? [];
  const phaseReady = (platform?.phase ?? 0) >= config.requiredPhase;

  return (
    <main className="min-h-full bg-slate-50/70 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-slate-900 p-3 text-white"><Icon className="h-7 w-7" /></div>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className={statusClass(platform?.status ?? 'DISABLED')}>{platform?.status ?? 'LOADING'}</Badge>
                  <Badge variant="outline">Phase {platform?.phase ?? 0}</Badge>
                  {!phaseReady && <Badge className="border-amber-200 bg-amber-50 text-amber-800">Cần Phase {config.requiredPhase}</Badge>}
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{config.title}</h1>
                <p className="mt-1 max-w-3xl text-sm text-slate-600 md:text-base">{config.description}</p>
              </div>
            </div>
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Làm mới
            </Button>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2 border-t pt-5">
            {navItems.map(item => (
              <Button key={item.id} asChild variant={item.id === focus ? 'default' : 'outline'} size="sm">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
            <Button asChild variant="outline" size="sm"><Link href="/asset-360">Digital Twin</Link></Button>
          </nav>
        </section>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card><CardHeader className="pb-2"><CardDescription>Digital Twin Health</CardDescription><CardTitle className="text-3xl">{twin?.overallScore ?? '—'}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Confidence theo từng tài sản, không mặc định khỏe khi thiếu dữ liệu.</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Tài sản Critical</CardDescription><CardTitle className="text-3xl text-red-600">{twin?.counts.critical ?? '—'}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Cần điều tra và xác nhận của con người.</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Outbox chờ publish</CardDescription><CardTitle className="text-3xl">{platform?.outbox?.pending ?? '—'}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Retry: {platform?.outbox?.retrying ?? '—'} sự kiện.</CardContent></Card>
          <Card><CardHeader className="pb-2"><CardDescription>Telemetry</CardDescription><CardTitle className="text-xl">{twin?.telemetryAvailable ? 'Đang nhận dữ liệu' : 'Chưa có dữ liệu'}</CardTitle></CardHeader><CardContent className="text-sm text-slate-500">Không có telemetry sẽ làm giảm độ tin cậy.</CardContent></Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ServerCog className="h-5 w-5" /> Trạng thái thành phần</CardTitle><CardDescription>Kết quả kiểm tra trực tiếp, tự làm mới mỗi 30 giây.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {visibleComponents.map(item => (
                <div key={item.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <Badge className={statusClass(item.status)}>{item.status}</Badge>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{item.detail}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.latencyMs === null ? 'Không đo latency' : `${item.latencyMs} ms`}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Điều kiện vận hành</CardTitle><CardDescription>Không đánh dấu hoàn thành chỉ vì container đang chạy.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {config.checklist.map(item => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Tài sản cần ưu tiên</CardTitle><CardDescription>Xếp theo điểm sức khỏe tăng dần; điểm thấp được hiển thị trước.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {riskAssets.length === 0 && <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">Chưa có tài sản hoặc dữ liệu Digital Twin.</div>}
            {riskAssets.map(asset => (
              <div key={asset.id} className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><span className="font-bold">{asset.code}</span><Badge className={statusClass(asset.health.band)}>{asset.health.band}</Badge></div>
                  <div className="mt-1 text-sm text-slate-600">{asset.name} · {asset.stationId ?? 'Chưa có ga'} · {asset.subsystem ?? 'Chưa có hệ thống'}</div>
                  <div className="mt-1 text-xs text-slate-400">Telemetry: {formatAge(asset.lastTelemetryAt)} · Confidence {asset.health.confidence}%</div>
                  {asset.health.factors[0] && <div className="mt-2 text-xs text-orange-700">Yếu tố chính: {asset.health.factors[0].label} (-{asset.health.factors[0].penalty})</div>}
                </div>
                <div className="text-sm text-slate-600">DNF {asset.openDnfs} · Hazard {asset.openHazards}</div>
                <Button asChild size="sm" variant="outline"><Link href={`/asset-360?equipmentId=${encodeURIComponent(asset.id)}`}>Điều tra</Link></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
