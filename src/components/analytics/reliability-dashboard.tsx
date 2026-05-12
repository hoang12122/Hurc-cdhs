"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, Wrench } from "lucide-react";

interface AssetMetric {
  asset_id: string;
  failure_count: number;
  mtbf_hours: number;
  mttr_hours: number;
  frequency_per_month: number;
  risk_level: string;
}

export function ReliabilityDashboard() {
  // In a real application, fetch this from the API (reliability_report.json)
  const [metrics, setMetrics] = React.useState<AssetMetric[]>([
    {
        asset_id: "Gate-02",
        failure_count: 5,
        mtbf_hours: 1752,
        mttr_hours: 12.5,
        frequency_per_month: 0.42,
        risk_level: "High"
    },
    {
        asset_id: "Train-01",
        failure_count: 1,
        mtbf_hours: 8760,
        mttr_hours: 4.0,
        frequency_per_month: 0.08,
        risk_level: "Low"
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình thời gian giữa các lỗi (MTBF)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~5,256 Giờ</div>
            <p className="text-xs text-muted-foreground">Cao hơn 12% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian khắc phục (MTTR)</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.25 Giờ</div>
            <p className="text-xs text-muted-foreground">Đã cải thiện so với KPI (24 Giờ)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị Rủi ro cao</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground">Cần kiểm tra bảo trì dự phòng ngay</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Thiết bị theo mức độ Rủi ro (MTBF/MTTR)</CardTitle>
          <CardDescription>Bảng thống kê các thiết bị dựa trên tính toán lịch sử DNF.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 font-medium">Thiết bị (Asset ID)</th>
                  <th className="p-4 font-medium">Số lỗi (Failures)</th>
                  <th className="p-4 font-medium">MTBF (Giờ)</th>
                  <th className="p-4 font-medium">MTTR (Giờ)</th>
                  <th className="p-4 font-medium">Rủi ro (Risk)</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((asset) => (
                  <tr key={asset.asset_id} className="border-t">
                    <td className="p-4 font-semibold">{asset.asset_id}</td>
                    <td className="p-4">{asset.failure_count}</td>
                    <td className="p-4">{asset.mtbf_hours.toLocaleString()}</td>
                    <td className="p-4">{asset.mttr_hours.toFixed(1)}</td>
                    <td className="p-4">
                      <Badge variant={asset.risk_level === 'High' ? 'destructive' : 'secondary'}>
                        {asset.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
