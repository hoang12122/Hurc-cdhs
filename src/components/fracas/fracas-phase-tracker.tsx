import Link from 'next/link';
import { AlertTriangle, GitBranch, TimerReset } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateFracasPhaseSummary, type FracasPhaseRisk } from '@/lib/fracas/fracas-phase-tracker';
import type { DnfDocument } from '@/lib/types';

interface FracasPhaseTrackerProps {
  records: DnfDocument[];
}

function riskVariant(risk: FracasPhaseRisk): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (risk === 'critical' || risk === 'overdue') return 'destructive';
  if (risk === 'watch') return 'secondary';
  return 'outline';
}

export function FracasPhaseTracker({ records }: FracasPhaseTrackerProps) {
  const summary = calculateFracasPhaseSummary(records);

  return (
    <Card className="border-primary/30 bg-primary/5 shadow-md">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <GitBranch className="h-5 w-5 text-primary" /> FRACAS Phase Tracker
            </CardTitle>
            <CardDescription>
              Theo dõi hồ sơ DNF/FRACAS theo 05 phase: intake, short-term action, RCA, long-term action và closure.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Total: {summary.totalRecords}</Badge>
            <Badge variant="secondary">Open: {summary.openRecords}</Badge>
            <Badge variant={summary.overdueRecords > 0 ? 'destructive' : 'outline'}>Overdue: {summary.overdueRecords}</Badge>
            <Badge variant={summary.criticalRecords > 0 ? 'destructive' : 'outline'}>Critical: {summary.criticalRecords}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.highlights.length > 0 && (
          <div className="grid gap-2 md:grid-cols-3">
            {summary.highlights.map((highlight) => (
              <div key={highlight} className="flex gap-2 rounded-xl border bg-card p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{highlight}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3 xl:grid-cols-5">
          {summary.phases.map((phase) => (
            <div key={phase.id} className="rounded-2xl border bg-card p-3 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold">{phase.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{phase.description}</p>
                </div>
                <Badge variant={phase.criticalCount || phase.overdueCount ? 'destructive' : 'outline'}>{phase.count}</Badge>
              </div>

              <div className="space-y-2">
                {phase.records.length > 0 ? phase.records.map((record) => (
                  <Link key={record.id} href={`/dnf/${record.id}`} className="block rounded-lg border p-2 text-xs hover:bg-muted/50">
                    <div className="flex items-center justify-between gap-2">
                      <span className="max-w-[140px] truncate font-semibold">#{record.reference || record.id}</span>
                      <Badge variant={riskVariant(record.risk)} className="text-[10px] uppercase">{record.risk}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground">{record.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <TimerReset className="h-3 w-3" /> {record.ageDays} days · {record.reason}
                    </p>
                  </Link>
                )) : (
                  <p className="rounded-lg border border-dashed p-4 text-center text-xs italic text-muted-foreground">No records</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
