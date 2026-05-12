
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldAlert, ShieldCheck, Lock, Fingerprint, 
  Activity, Database, AlertCircle, RefreshCw,
  LogOut, UserX, Power
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
    getAdminSummaryStats, 
    toggleMaintenanceMode, 
    emergencyUserLock, 
    forceLogoutAllSessions 
} from "@/lib/actions/admin.actions";

export default function SecurityHubPage() {
  const { locale } = useLanguage();
  const { toast } = useToast();
  const [stats, setStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [lockEmail, setLockEmail] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminSummaryStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  const handleToggleMaintenance = async (checked: boolean) => {
    setIsProcessing(true);
    try {
       await toggleMaintenanceMode(checked);
       toast({
         title: locale === 'vi' ? "Thành công" : "Success",
         description: locale === 'vi' 
            ? `Chế độ bảo trì đã ${checked ? 'bật' : 'tắt'}.` 
            : `Maintenance mode is now ${checked ? 'on' : 'off'}.`,
       });
       await fetchStats();
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: e.message
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleEmergencyLock = async () => {
    if (!lockEmail) return;
    setIsProcessing(true);
    try {
        await emergencyUserLock(lockEmail);
        toast({
            title: locale === 'vi' ? "Đã khóa tài khoản" : "Account Locked",
            description: locale === 'vi' ? `Tài khoản ${lockEmail} đã bị khóa ngay lập tức.` : `Account ${lockEmail} has been locked immediately.`,
        });
        setLockEmail("");
        await fetchStats();
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: e.message
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleForceLogout = async () => {
    if (!confirm(locale === 'vi' ? "Xác nhận đăng xuất TOÀN BỘ người dùng khỏi hệ thống?" : "Are you sure you want to LOGOUT ALL users?")) return;
    setIsProcessing(true);
    try {
        await forceLogoutAllSessions();
        toast({
            title: "Logout Command Sent",
            description: locale === 'vi' ? "Lệnh phát đi thành công." : "Command broadcasted successfully.",
        });
        await fetchStats();
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: e.message
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const t = (vi: string, en: string) => (locale === 'vi' ? vi : en);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold font-headline text-primary">
            {t('Trung tâm Bảo mật & Quản trị', 'Security & Admin Hub')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('Bảng điều khiển tối cao phục vụ giám sát và can thiệp hệ thống khẩn cấp.', 'Supreme control panel for monitoring and emergency system intervention.')}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t('Làm mới', 'Refresh')}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Người dùng (Active)', 'Active Users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Tổng số:', 'Total:')} {stats?.totalUsers || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Tổng Nhật ký', 'Total Logs')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalLogs || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Ghi nhận từ DB', 'Recorded from DB')}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Trạng thái DB', 'DB Integrity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600 flex items-center gap-2">
               <ShieldCheck className="h-5 w-5" />
               Healthy
            </div>
            <p className="text-xs text-muted-foreground mt-1">
                {(stats?.dbSize / 1024).toFixed(2)} KB | JSON-DB
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md bg-accent/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Hệ thống', 'System Mode')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
                 <Badge variant={stats?.isMaintenanceMode ? "destructive" : "secondary"}>
                    {stats?.isMaintenanceMode ? t('BẢO TRÌ', 'MAINTENANCE') : t('HOẠT ĐỘNG', 'ACTIVE')}
                 </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
                {stats?.isMaintenanceMode ? t('Kết nối bị hạn chế', 'Access restricted') : t('Hệ thống sẵn sàng', 'System ready')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          {/* Action Panel */}
          <Card className="shadow-lg border-t-4 border-t-destructive">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                      <ShieldAlert className="h-5 w-5" />
                      {t('Bảng Điều khiển Khẩn cấp', 'Emergency Control')}
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase">{t('Khóa tài khoản nhanh', 'Emergency User Lock')}</Label>
                      <div className="flex gap-2">
                          <Input 
                            placeholder="user@example.com" 
                            value={lockEmail}
                            onChange={(e) => setLockEmail(e.target.value)}
                            className="text-sm"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={handleEmergencyLock}
                            disabled={isProcessing || !lockEmail}
                          >
                              <UserX className="h-4 w-4" />
                          </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">
                          {t('* Khóa tức thì trạng thái hoạt động của người dùng.', '* Instantly revokes user active status.')}
                      </p>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                      <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                              <Label className="text-sm font-semibold">{t('Chế độ Bảo trì', 'Maintenance Mode')}</Label>
                              <p className="text-[10px] text-muted-foreground">{t('Chặn các cập nhật dữ liệu mới.', 'Disable new data updates.')}</p>
                          </div>
                          <Switch 
                            checked={stats?.isMaintenanceMode} 
                            onCheckedChange={handleToggleMaintenance}
                            disabled={isProcessing}
                          />
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-destructive hover:bg-destructive/10 border-destructive/20"
                        onClick={handleForceLogout}
                        disabled={isProcessing}
                      >
                          <LogOut className="h-4 w-4 mr-2" />
                          {t('Đăng xuất Toàn hệ thống', 'Force Logout All')}
                      </Button>
                  </div>
              </CardContent>
          </Card>

          {/* Audit Trail */}
          <Card className="md:col-span-2 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          {t('Nhật ký Hành động Hệ thống', 'System Audit Trail')}
                      </CardTitle>
                      <CardDescription>
                          {t('Dữ liệu thực tế ghi nhận từ cơ sở dữ liệu nhật ký.', 'Live data from system logs database.')}
                      </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                      <a href="/admin/system-logs" className="text-xs text-primary underline">
                        {t('Xem tất cả', 'View all')}
                      </a>
                  </Button>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                      {stats?.recentLogs?.length > 0 ? (
                          stats.recentLogs.map((log: any, idx: number) => (
                              <div key={idx} className="flex items-start gap-3 p-2 rounded border bg-card/50 text-sm">
                                  {log.level === 'ERROR' || log.level === 'CRITICAL' ? (
                                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                                  ) : log.level === 'WARNING' ? (
                                      <ShieldAlert className="h-4 w-4 text-orange-500 mt-0.5" />
                                  ) : (
                                      <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                      <p className="font-medium text-xs truncate">{log.details}</p>
                                      <p className="text-[10px] text-muted-foreground">
                                          {new Date(log.timestamp).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                                      </p>
                                  </div>
                                  <Badge variant="outline" className="text-[10px] uppercase h-5">
                                      {log.level}
                                  </Badge>
                              </div>
                          ))
                      ) : (
                          <div className="text-center py-10 text-muted-foreground text-sm italic">
                               {t('Chưa có ghi nhận hành động nào.', 'No activity logs found.')}
                          </div>
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
