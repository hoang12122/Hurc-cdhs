import Link from 'next/link';
import { AlertTriangle, Activity, MapPin, RadioTower, TrendingUp, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateRamsQuickSummary, type RamsRiskLevel } from '@/lib/rams';
import type { DnfDocument } from '@/lib/types';

interface RamsOccDashboardPanelProps {
  records: DnfDocument[];
}

function riskBadgeVariant(riskLevel: RamsRiskLevel): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (riskLevel === 'critical' || riskLevel === 'high') return 'destructive';
  if (riskLevel === 'medium') return 'secondary';
  return 'outline';
}

function dimensionIcon(dimension: string) {
  if (dimension === 'location') return <MapPin className="h-4 w-4" />;
  if (dimension === 'subsystem') return <RadioTower className="h-4 w-4" />;
  return <Wrench className="h-4 w-4" />;
}

export function RamsOccDashboardPanel({ records }: RamsOccDashboardPanelProps) {
  const summary = calculateRamsQuickSummary({ records, trendBucket: 'week' });
  const latestTrend = summary.trends[summary.trends.length - 1];
  const topTrends = summary.trends.slice(-8);
  const topHotspots = summary.hotspots.slice(0, 8);

  return (
    <section className="space-y-4">
      <Card className="border-primary/30 bg-primary/5 shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-5 w-5 text-primary" />
                OCC RAMS Quick Risk Dashboard
              </CardTitle>
              <CardDescription>
                Tính nhanh RAMS từ DNF/sự cố để highlight trending, hotspot và cảnh báo vận hành cho OCC.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={riskBadgeVariant(summary.worstRiskLevel)} className="uppercase">
                Worst: {summary.worstRiskLevel}
              </Badge>
              <Badge variant="outline">Avg RAMS: {summary.averageRamsTotal}</Badge>
              <Badge variant="outline">Avg MTTR: {summary.averageMttrMinutes} min</Badge>
              <Badge variant="outline">Service affected: {summary.affectedServiceRecords}/{summary.totalRecords}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              RAMS Total Trending
            </CardTitle>
            <CardDescription>
              Theo tuần, dùng để nhận biết xu hướng RAMS tăng/giảm và rủi ro cần OCC theo dõi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTrends.length > 0 ? topTrends.map((point) => (
              <div key={point.bucket} className="space-y-1 rounded-lg border p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{point.bucket}</span>
                  <span>Avg {point.averageRamsTotal} / Max {point.maxRamsTotal}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, point.averageRamsTotal)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{point.recordCount} DNF</span>
                  <span>MTTR {point.averageMttrMinutes} min</span>
                </div>
              </div>
            )) : (
              <p className="py-8 text-center text-sm italic text-muted-foreground">Chưa có dữ liệu trend RAMS.</p>
            )}
            {latestTrend && (
              <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                Kỳ gần nhất: <strong>{latestTrend.bucket}</strong>, Avg RAMS <strong>{latestTrend.averageRamsTotal}</strong>, Max RAMS <strong>{latestTrend.maxRamsTotal}</strong>.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              RAMS Hotspot
            </CardTitle>
            <CardDescription>
              Tổng hợp theo ga/khu vực, hệ thống và thiết bị để xác định điểm nóng vận hành.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotspot</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="text-right">RAMS</TableHead>
                    <TableHead className="text-right">MTTR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topHotspots.length > 0 ? topHotspots.map((hotspot) => (
                    <TableRow key={`${hotspot.dimension}-${hotspot.key}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{dimensionIcon(hotspot.dimension)}</span>
                          <div>
                            <p className="max-w-[180px] truncate text-xs font-semibold">{hotspot.key}</p>
                            <p className="text-[10px] uppercase text-muted-foreground">{hotspot.dimension} · {hotspot.recordCount} records</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={riskBadgeVariant(hotspot.riskLevel)} className="uppercase text-[10px]">
                          {hotspot.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs font-bold">{hotspot.maxRamsTotal}</TableCell>
                      <TableCell className="text-right text-xs">{hotspot.averageMttrMinutes}m</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-sm italic text-muted-foreground">
                        Chưa có hotspot RAMS.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RadioTower className="h-4 w-4 text-primary" />
              OCC Highlights
            </CardTitle>
            <CardDescription>
              Các điểm cần OCC ưu tiên theo dõi, điều phối hoặc chuyển đơn vị chuyên môn rà soát.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.occHighlights.length > 0 ? summary.occHighlights.map((highlight, index) => (
              <div key={`${highlight}-${index}`} className="rounded-xl border bg-card p-3 text-sm shadow-sm">
                <div className="flex gap-2">
                  <Badge variant="outline" className="h-6 shrink-0">#{index + 1}</Badge>
                  <p className="leading-relaxed">{highlight}</p>
                </div>
              </div>
            )) : (
              <p className="py-8 text-center text-sm italic text-muted-foreground">Không có cảnh báo OCC nổi bật từ dữ liệu hiện tại.</p>
            )}
            <div className="rounded-xl bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              Kết quả RAMS quick calculation chỉ dùng để sàng lọc nhanh. OCC cần chuyển hotspot High/Critical cho đơn vị phụ trách để rà soát DNF/Hazard Log, không tự động đóng sự cố hoặc phê duyệt rủi ro.
            </div>
            <Link href="/dnf" className="inline-flex text-xs font-semibold text-primary hover:underline">
              Mở danh sách DNF để kiểm tra hồ sơ nguồn
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
