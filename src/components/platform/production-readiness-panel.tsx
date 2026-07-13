'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ReadinessIssue {
  code: string;
  severity: 'BLOCKER' | 'WARNING';
  area: string;
  message: string;
  remediation: string;
}

interface Readiness {
  ready: boolean;
  score: number;
  deploymentMode: string;
  issues: ReadinessIssue[];
}

export function ProductionReadinessPanel() {
  const [readiness, setReadiness] = useState<Readiness | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/platform/status', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : Promise.reject(new Error('status unavailable')))
      .then(data => { if (active) setReadiness(data.readiness); })
      .catch(() => { if (active) setReadiness(null); });
    return () => { active = false; };
  }, []);

  const blockers = readiness?.issues.filter(issue => issue.severity === 'BLOCKER') ?? [];
  const warnings = readiness?.issues.filter(issue => issue.severity === 'WARNING') ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-slate-950 text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-5 w-5" /> Production HA Readiness</CardTitle>
              <CardDescription className="mt-1 text-slate-300">Đánh giá fail-closed theo cấu hình và bằng chứng vận hành.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={readiness?.ready ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'}>
                {readiness?.ready ? 'READY' : 'NOT READY'}
              </Badge>
              <span className="text-2xl font-black">{readiness?.score ?? '—'}/100</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-5 md:p-6">
          {!readiness && <div className="text-sm text-slate-500">Chưa thể tải đánh giá production readiness.</div>}
          {readiness && readiness.issues.length === 0 && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <CheckCircle2 className="h-5 w-5" /> Không còn blocker cấu hình. Vẫn phải có CI, load-test và biên bản nghiệm thu thực tế.
            </div>
          )}
          {readiness && readiness.issues.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="destructive">{blockers.length} blocker</Badge>
                <Badge variant="outline">{warnings.length} warning</Badge>
                <Badge variant="outline">Mode: {readiness.deploymentMode}</Badge>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {readiness.issues.slice(0, 12).map(issue => (
                  <div key={issue.code} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-900">{issue.message}</div>
                      <Badge className={issue.severity === 'BLOCKER' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}>{issue.severity}</Badge>
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{issue.area} · {issue.code}</div>
                    <div className="mt-3 flex gap-2 text-sm text-slate-600"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /> {issue.remediation}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
