"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, ShieldCheck, Database, FileText, Settings, 
  Activity, ShieldAlert, LayoutDashboard, ChevronLeft, ChevronRight, Undo2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

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
    label: { vi: "Nhật ký", en: "System Logs" },
    path: "/admin/system-logs",
  },
  {
    icon: Database,
    label: { vi: "Danh mục", en: "Categories" },
    path: "/admin/categories",
  },
  {
    icon: FileText,
    label: { vi: "Tiêu chuẩn", en: "Standards" },
    path: "/admin/maintenance-standards",
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

export function AdminSidebar() {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card h-full transition-all duration-300 ease-in-out z-40 group shadow-sm",
        isCollapsed ? "w-[80px] items-center" : "w-[260px] px-4"
      )}
    >
      <div className={cn("p-6 flex items-center mb-4 transition-all duration-300", isCollapsed ? "w-full justify-center px-0" : "px-2")}>
        {!isCollapsed && (
          <div className="font-headline font-bold text-xl text-primary truncate">
            Admin <span className="text-muted-foreground font-normal">Hub</span>
          </div>
        )}
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
                "absolute -right-3 top-16 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent",
                isCollapsed ? "right-[-12px]" : ""
            )}
        >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-x-hidden pt-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/item relative",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md font-medium" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover/item:scale-110")} />
                {!isCollapsed && (
                  <span className="text-sm tracking-tight">
                    {item.label[locale]}
                  </span>
                )}
                
                {isCollapsed && isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 invisible group-hover/item:visible group-hover/item:opacity-100 transition-all z-50 whitespace-nowrap border">
                        {item.label[locale]}
                    </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-auto p-4 border-t transition-all duration-300", isCollapsed ? "px-0 pb-6" : "pb-6 px-2")}>
        {!isCollapsed && (
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-2">
            <div className="flex items-center gap-2 mb-1.5 text-primary">
                <ShieldAlert className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{locale === 'vi' ? 'Giám sát Hoạt động' : 'Active Guard'}</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
                {locale === 'vi' 
                    ? 'Hệ thống được giám sát 24/7. Mọi thao tác quản trị đều được ghi nhật ký.'
                    : 'System is monitored 24/7. All admin actions are logged to JSON audit trail.'}
            </p>
          </div>
        )}
        <Link href="/dashboard" className="w-full">
            <Button variant="ghost" className={cn("w-full justify-start text-muted-foreground hover:text-primary transition-colors", isCollapsed && "justify-center px-0")}>
                <Undo2 className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && <span className="text-sm">{locale === 'vi' ? 'Thoát Quản trị' : 'Exit Admin'}</span>}
            </Button>
        </Link>
      </div>
    </aside>
  );
}
