
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, ShieldCheck, Database, FileText, Settings, 
  Activity, Radio, ListChecks, ArrowUpRight, ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

const adminModules = [
  {
    icon: Users,
    title: { vi: "Quản lý Người dùng", en: "User Management" },
    desc: { vi: "Quản lý tài khoản, phân quyền và trạng thái xác thực.", en: "Manage accounts, permissions, and verification status." },
    path: "/admin/users",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    icon: ShieldCheck,
    title: { vi: "Phân quyền & Vai trò", en: "Roles & Permissions" },
    desc: { vi: "Thiết lập các nhóm quyền hạn cho từng bộ phận.", en: "Configure permission sets for different departments." },
    path: "/admin/roles",
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    icon: Settings,
    title: { vi: "Cài đặt Hệ thống", en: "System Settings" },
    desc: { vi: "Cấu hình chung, tích hợp AI và thông số mạng.", en: "General config, AI integration, and network parameters." },
    path: "/admin/settings",
    color: "text-slate-600",
    bgColor: "bg-slate-100 dark:bg-slate-900/20"
  },
  {
    icon: Activity,
    title: { vi: "Nhật ký Hệ thống", en: "System Logs" },
    desc: { vi: "Kiểm tra lịch sử hoạt động và các sự kiện bảo mật.", en: "Review activity history and security events." },
    path: "/admin/system-logs",
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20"
  },
  {
    icon: Database,
    title: { vi: "Dữ liệu & DM", en: "Data & Categories" },
    desc: { vi: "Quản lý danh mục vị trí, thiết bị và hệ thống.", en: "Manage master data for locations, assets, and systems." },
    path: "/admin/categories",
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20"
  },
  {
    icon: ListChecks,
    title: { vi: "Tiêu chuẩn Bảo trì", en: "Maintenance Standards" },
    desc: { vi: "Nhập và quản lý các định mức kỹ thuật.", en: "Import and manage technical maintenance norms." },
    path: "/admin/maintenance-standards",
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/20"
  },
  {
    icon: ShieldAlert,
    title: { vi: "Trung tâm Bảo mật (Mới)", en: "Security Hub (New)" },
    desc: { vi: "Giám sát an toàn dữ liệu và các nỗ lực xâm nhập.", en: "Monitor data safety and intrusion attempts." },
    path: "/admin/security",
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20"
  }
];

export default function AdminHubPage() {
  const { locale } = useLanguage();
  const t = (val: { vi: string, en: string }) => val[locale];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-headline text-primary">
          {locale === 'vi' ? 'Quản trị Hệ thống' : 'System Administration'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'vi' 
            ? 'Trung tâm quản lý chiến lược và kỹ thuật cho HURC No.1 CDHS.' 
            : 'Strategic and technical management hub for HURC No.1 CDHS.'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((module) => (
          <Link key={module.path} href={module.path}>
            <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-l-4 group" style={{ borderLeftColor: 'currentColor' }}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-3 rounded-xl ${module.bgColor} ${module.color}`}>
                  <module.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{t(module.title)}</CardTitle>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {t(module.desc)}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {locale === 'vi' ? 'Trạng thái Hệ thống (Góc nhìn CTO)' : 'System Health (CTO View)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{locale === 'vi' ? 'Cơ sở dữ liệu' : 'Database'}</p>
                  <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-medium">JSON (Local)</span>
                  </div>
              </div>
              <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{locale === 'vi' ? 'Bảo mật' : 'Security'}</p>
                  <p className="font-medium text-green-600">Rate Limiting Active</p>
              </div>
              <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{locale === 'vi' ? 'Trí tuệ nhân tạo' : 'AI Engine'}</p>
                  <p className="font-medium">HuggingFace (On)</p>
              </div>
              <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{locale === 'vi' ? 'Lần cuối sao lưu' : 'Last Backup'}</p>
                  <p className="font-medium">Every 24h</p>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
