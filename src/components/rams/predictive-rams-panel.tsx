import { AlertTriangle, Activity, Gauge, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculatePredictiveRamsSummary } from '@/lib/rams/predictive-rams';
import type { DnfDocument } from '@/lib/types';

interface PredictiveRamsPanelProps {
  records: DnfDocument[];
}

function badgeVariant(value: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (value === 'critical' || value === 'elevated') return 'destructive';
  if (value === 'watch') return 'secondary';
  return 'outline';
}

export function PredictiveRamsPanel({ records }: PredictiveRamsPanelProps) {
  const summary = calculatePredictiveRamsSummary(records);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" /> Predictive RAMS Layer
            </CardTitle>
            <CardDescription>
              Dự báo sớm hotspot dựa trên recurrence score, asset health score và failure probability.
            </CardDescription>
          </div>
          <Badge variant={badgeVariant(summary.overallPrediction)} className="uppercase">{summary.overallPrediction}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotspot</TableHead>
                <TableHead>Dimension</TableHead>
                <TableHead className="text-right">Recurrence</TableHead>
                <TableHead className="text-right">Asset Health</TableHead>
                <TableHead className="text-right">Failure Probability</TableHead>
                <TableHead>Suggested action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.topSignals.length > 0 ? summary.topSignals.map((signal) => (
                <TableRow key={`${signal.dimension}-${signal.key}`}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      {signal.predictedHotspot ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <Activity className="h-4 w-4 text-primary" />}
                      <span className="max-w-[220px] truncate">{signal.key}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{signal.dimension}</Badge></TableCell>
                  <TableCell className="text-right">{signal.recurrenceScore}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" /> {signal.assetHealthScore}</span>
                  </TableCell>
                  <TableCell className="text-right font-bold">{signal.failureProbability}%</TableCell>
                  <TableCell className="max-w-[320px] text-sm text-muted-foreground">{signal.suggestedPreventiveAction}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-sm italic text-muted-foreground">
                    Chưa có dữ liệu dự báo RAMS.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
