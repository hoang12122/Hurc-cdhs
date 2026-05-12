"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, ShieldCheck, Database, Activity, 
  ArrowUpRight, ShieldAlert, History, Info, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { getAdminSummaryStats, getLogActivityChartData } from "@/lib/actions/admin.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminHubPage() {
  const { locale } = useLanguage();
  const [stats, setStats] = React.useState<any>(null);
  const [chartData, setChartData] = React.useState<{date: string; count: number}[]>([]);
  const [loading, setLoading] = React.useState(true);
  const chartRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    async function init() {
      try {
        const [s, c] = await Promise.all([getAdminSummaryStats(), getLogActivityChartData()]);
        
        // Handle standardized error (Hardening Task 4.11)
        if (s && (s as any).error) {
            setStats({
                totalUsers: 0,
                activeUsers: 0,
                totalRoles: 0,
                totalLogs: 0,
                recentLogs: [],
                dbSize: 0,
                isDatabaseOffline: true
            });
        } else {
            setStats(s);
        }

        if (c) setChartData(c);
      } catch (e) {
        console.error("Failed to fetch admin stats:", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  React.useLayoutEffect(() => {
    if (!loading && chartData.length > 0) {
        const max = Math.max(...chartData.map(cd => cd.count)) || 1;
        chartData.forEach((d, i) => {
            if (chartRefs.current[i]) {
                const height = Math.min(100, Math.max(10, (d.count / max) * 200));
                chartRefs.current[i]!.style.height = `${height}px`;
            }
        });
    }
  }, [loading, chartData]);

  const t = (vi: string, en: string) => (locale === 'vi' ? vi : en);

  if (loading) return (
    <div className="space-y-8 animate-pulse pt-4">
        <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
            <Skeleton className="lg:col-span-4 h-[400px] w-full rounded-2xl" />
            <Skeleton className="lg:col-span-3 h-[400px] w-full rounded-2xl" />
        </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold font-headline tracking-tight text-primary uppercase">
            {t('Trung tâm Điều hành', 'Command Center')}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            {t('Toàn quyền quản trị hạ tầng dữ liệu và lưu lượng hệ thống.', 'Full control over data infrastructure and system traffic.')}
          </p>
        </div>
        <div className="flex gap-2">
            {stats?.isMaintenanceMode && (
                <Badge variant="destructive" className="px-3 py-1 animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-2" />
                    {t('CHẾ ĐỘ BẢO TRÌ', 'MAINTENANCE MODE')}
                </Badge>
            )}
            <Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                {t('Sẵn sàng', 'Engine: Ready')}
            </Badge>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title={t('Người dùng hệ thống', 'System Users')}
            value={stats.totalUsers}
            subValue={`${stats.activeUsers} ${t('đang hoạt động', 'active users')}`}
            icon={Users}
            color="blue"
        />
        <StatCard 
            title={t('Cấu trúc Phân quyền', 'Role Schema')}
            value={stats.totalRoles}
            subValue={t('Gán quyền trực tiếp', 'Direct assignment')}
            icon={ShieldCheck}
            color="purple"
        />
        <StatCard 
            title={t('Lưu lượng Nhật ký', 'Log Stream')}
            value={stats.totalLogs}
            subValue={t('Ghi nhận real-time', 'Real-time ingestion')}
            icon={Activity}
            color="orange"
        />
        <StatCard 
            title={t('Tệp tin Cơ sở dữ liệu', 'DB File Status')}
            value={`${(stats.dbSize / 1024).toFixed(1)} KB`}
            subValue={t('Toàn vẹn (Healthy)', 'Integrity Verified')}
            icon={Database}
            color="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
          {/* Activity Chart Section */}
          <Card className="lg:col-span-4 border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-primary/5">
                  <div className="space-y-0.5">
                    <CardTitle className="text-xl font-bold">{t('Biểu đồ Hoạt động (7 Ngày)', 'Activity Chart (7 Days)')}</CardTitle>
                    <CardDescription>{t('Tần suất thay đổi dữ liệu hệ thống', 'System data modification frequency')}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                      <Link href="/admin/system-logs">
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      </Link>
                  </Button>
              </CardHeader>
              <CardContent className="pt-8 h-[300px] flex items-end justify-around gap-2 px-6">
                  {chartData.map((d, i) => (
                      <div key={i} className="flex-1 flex-col items-center gap-2 group/bar cursor-help flex">
                          <div 
                            ref={el => { chartRefs.current[i] = el; }}
                            className={cn(
                                "w-full min-w-[20px] rounded-t-lg bg-primary/20 group-hover/bar:bg-primary transition-all duration-300 relative",
                                d.count > 0 ? "shadow-sm" : "opacity-30"
                            )}
                          >
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-black text-white text-[10px] px-2 py-1 rounded">
                                  {d.count} events
                              </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground rotate-45 md:rotate-0 origin-left">
                              {d.date.split('-').slice(1).join('/')}
                          </span>
                      </div>
                  ))}
              </CardContent>
          </Card>

          {/* Recent Activity Section */}
          <Card className="lg:col-span-3 border-none shadow-xl border-l-[6px] border-l-primary overflow-hidden">
              <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {t('Sự kiện Gần đây', 'Recent Audit Log')}
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                  <ScrollArea className="h-[340px]">
                      <div className="divide-y divide-border/50">
                        {stats.recentLogs.map((log: any, i: number) => (
                            <div key={i} className="p-4 hover:bg-muted/30 transition-colors group cursor-default">
                                <div className="flex items-start justify-between gap-3 mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            log.level === 'CRITICAL' ? "bg-red-500" : 
                                            log.level === 'WARNING' ? "bg-orange-500" : "bg-blue-500"
                                        )} />
                                        <span className="font-bold text-sm tracking-tight">{log.action}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-1.5 font-medium">
                                    {log.details}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[9px] h-4 py-0 font-normal">
                                        {log.userName}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                      </div>
                  </ScrollArea>
              </CardContent>
          </Card>
      </div>

      {/* Info Warning Panel */}
      <div className="grid gap-6 md:grid-cols-2">
          {stats?.isDatabaseOffline && (
              <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardContent className="p-6 flex gap-4">
                      <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0" />
                      <div className="space-y-1">
                          <h4 className="font-bold text-orange-800">{t('Chế độ Dữ liệu Fallback', 'Fallback Database Active')}</h4>
                          <p className="text-sm text-orange-700/80 leading-relaxed">
                            {t('Hệ thống hiện đang sử dụng tệp db.json thay cho PostgreSQL. Một số tính năng đòi hỏi hiệu năng cao có thể bị ảnh hưởng. Hãy đảm bảo tệp JSON được sao lưu thường xuyên.', 
                               'System is currently using db.json fallback. High-performance features might be throttled. Ensure JSON file is backed up regularly.')}
                          </p>
                      </div>
                  </CardContent>
              </Card>
          )}
          <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-6 flex gap-4">
                  <Info className="h-6 w-6 text-blue-600 shrink-0" />
                  <div className="space-y-1">
                      <h4 className="font-bold text-blue-800">{t('Mẹo Quản trị viên', 'Administrator Tip')}</h4>
                      <p className="text-sm text-blue-700/80 leading-relaxed">
                        {t('Bạn có thể nhấn vào biểu tượng Nhật ký để xem chi tiết từng thao tác của các thành viên. Mọi thay đổi đều được lưu vết định danh.', 
                           'Click the History icon to see granular activity details. Every change is tagged with a digital signature for auditing.')}
                      </p>
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon: Icon, color }: any) {
    const iconColors: any = {
        blue: "text-blue-600 bg-blue-100",
        purple: "text-purple-600 bg-purple-100",
        orange: "text-orange-600 bg-orange-100",
        green: "text-green-600 bg-green-100"
    };
    
    const borderColors: any = {
        blue: "border-blue-500",
        purple: "border-purple-500",
        orange: "border-orange-500",
        green: "border-green-500"
    };

    return (
        <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className={cn("p-2 rounded-lg transition-transform", iconColors[color])}>
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
                        <span className="text-xs text-muted-foreground flex items-center mt-1">
                            {subValue}
                        </span>
                    </div>
                </div>
                <div className={cn("h-1 w-full opacity-30", borderColors[color].replace('border-', 'bg-'))} />
            </CardContent>
        </Card>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
