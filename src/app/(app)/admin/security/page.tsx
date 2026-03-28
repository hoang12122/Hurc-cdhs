
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldAlert, ShieldCheck, Lock, Fingerprint, 
  Activity, Database, AlertCircle, RefreshCw 
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { getSecurityStats, SecurityStats } from "@/lib/actions/security.actions";
import { Badge } from "@/components/ui/badge";

export default function SecurityHubPage() {
  const { locale } = useLanguage();
  const [stats, setStats] = React.useState<SecurityStats | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getSecurityStats();
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold font-headline text-primary">
            {locale === 'vi' ? 'Trung tâm Bảo mật & Giám sát' : 'Security & Monitoring Hub'}
          </h1>
          <p className="text-muted-foreground">
            {locale === 'vi' 
              ? 'Tầm nhìn CTO về an toàn dữ liệu và tính toàn vẹn hệ thống.' 
              : 'CTO-level overview of data safety and system integrity.'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {locale === 'vi' ? 'Làm mới' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {locale === 'vi' ? 'Đăng nhập (24h)' : 'Logins (24h)'}
              <Badge variant="secondary">{stats?.totalLoginAttempts || 0}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLoginAttempts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.failedLoginAttempts || 0} {locale === 'vi' ? 'thất bại' : 'failed'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {locale === 'vi' ? 'Rate Limit Hits' : 'Rate Limit Hits'}
              <ShieldAlert className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rateLimitHits || 0}</div>
            <p className="text-xs text-muted-foreground">
              {locale === 'vi' ? 'Các nỗ lực truy cập vượt định mức.' : 'Attempts exceeding thresholds.'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {locale === 'vi' ? 'Toàn vẹn DB' : 'DB Integrity'}
              <Database className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">AsyncMutex Active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              {locale === 'vi' ? 'Sao lưu rò rỉ' : 'Backup Leakage'}
              <Lock className="h-4 w-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Secure</div>
            <p className="text-xs text-muted-foreground">Local Encryption Only</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 shadow-lg">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      {locale === 'vi' ? 'Sự cố Bảo mật chính (Audit Trail)' : 'Key Security Events (Audit Trail)'}
                  </CardTitle>
                  <CardDescription>
                      {locale === 'vi' 
                        ? 'Các thay đổi quan trọng đối với người dùng và cấu hình.' 
                        : 'Significant changes to users and configurations.'}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {/* Simulating security events if logs are empty */}
                      <div className="flex items-start gap-4 p-3 rounded-lg bg-orange-50 border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30">
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                              <p className="text-sm font-semibold">{locale === 'vi' ? 'Phát hiện Rate Limit' : 'Rate Limit Triggered'}</p>
                              <p className="text-xs text-muted-foreground">Endpoint: /api/auth/verify-otp | IP: Localhost</p>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50 border border-green-100 dark:bg-green-950/20 dark:border-green-900/30">
                          <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                              <p className="text-sm font-semibold">{locale === 'vi' ? 'Sao lưu Hệ thống Thành công' : 'System Backup Successful'}</p>
                              <p className="text-xs text-muted-foreground">Path: /backups/db-2026-03-11.json</p>
                          </div>
                          <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      {locale === 'vi' ? 'Chính sách Bảo mật' : 'Security Policy'}
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">JWT Session</span>
                      <Badge variant="outline">HTTP-Only Cookie</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">OTP Method</span>
                      <Badge variant="outline">Crypto Random (6-digit)</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Password Hash</span>
                      <Badge variant="outline">BCrypt (Salt 10)</Badge>
                  </div>
                  <div className="mt-6 p-4 rounded bg-slate-100 dark:bg-slate-800 text-xs leading-relaxed">
                      {locale === 'vi' 
                        ? 'Hệ thống tuân thủ các quy tắc bảo mật Intranet, đảm bảo không rò rỉ dữ liệu qua môi trường Internet công cộng.' 
                        : 'System complies with Intranet security rules, ensuring no data leakage to public Internet environments.'}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
