"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, ShieldCheck, Database, FileText, Settings, 
  Activity, ShieldAlert, LayoutDashboard, Undo2, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Badge } from "@/components/ui/badge";
import { getAdminSummaryStats } from "@/lib/actions/admin.actions";

const adminNavItems = [
  {
    icon: LayoutDashboard,
    label: { vi: "Tổng quan", en: "Overview" },
    path: "/admin",
  },
  {
    icon: Users,
    label: { vi: "Người dùng", en: "Users" },
    path: "/admin/users",
  },
  {
    icon: ShieldCheck,
    label: { vi: "Vai trò", en: "Roles" },
    path: "/admin/roles",
  },
  {
    icon: Activity,
    label: { vi: "Nhật ký", en: "Logs" },
    path: "/admin/system-logs",
  },
  {
    icon: Database,
    label: { vi: "Danh mục", en: "Category" },
    path: "/admin/categories",
  },
  {
    icon: ShieldAlert,
    label: { vi: "Bảo mật", en: "Security" },
    path: "/admin/security",
  },
  {
    icon: Settings,
    label: { vi: "Cài đặt", en: "Settings" },
    path: "/admin/settings",
  },
];

export function AdminSubNav() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    async function fetchStats() {
        try {
            const s = await getAdminSummaryStats();
            setStats(s);
        } catch (e) {
            console.error(e);
        }
    }
    fetchStats();
  }, [pathname]); // Refresh when navigating

  return (
    <div className="sticky top-0 z-20 w-full bg-card/80 backdrop-blur-md border-b shadow-sm overflow-x-auto no-scrollbar">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between gap-4">
        <nav className="flex items-center gap-1 md:gap-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "scale-100" : "opacity-70")} />
                  <span>{item.label[locale]}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          {stats?.isMaintenanceMode && (
              <Badge variant="destructive" className="h-7 animate-pulse text-[10px] hidden sm:flex">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Maint. Mode
              </Badge>
          )}
          
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
          
          <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8">
                  <Undo2 className="h-4 w-4 mr-2" />
                  <span className="text-xs hidden md:inline">{locale === 'vi' ? 'Thoát' : 'Exit'}</span>
              </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
