"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Check, Database, GitBranch, Layers3, LogOut, MapPinned, Moon, ShieldAlert, Sun, UserRound } from "lucide-react";
import { USER_NAV_ITEMS } from "@/lib/navigation";
import type { NavItemLabel } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLanguage } from '@/contexts/language-context';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSystemLogs, getDatabaseStatus } from "@/lib/actions/system.actions";
import { useAuth } from "@/contexts/auth-context";

const MODULE_CONTEXTS = [
  {
    match: '/asset-360',
    title: 'Asset 360 Digital Twin',
    description: 'Hồ sơ thiết bị, AI health, IoT telemetry và khuyến nghị bảo trì.',
    icon: Layers3,
  },
  {
    match: '/rail-network',
    title: 'Mạng tuyến Metro',
    description: 'Sơ đồ tuyến, nhà ga, ga trung chuyển và liên kết Google Maps.',
    icon: GitBranch,
  },
  {
    match: '/spatial-twin',
    title: 'GIS/BIM Twin',
    description: 'Bản đồ GIS, mô hình BIM, liên kết tài sản và import dữ liệu.',
    icon: MapPinned,
  },
];

const QUICK_LINKS = [
  { href: '/asset-360', label: 'Asset 360', icon: Layers3 },
  { href: '/rail-network', label: 'Rail Network', icon: GitBranch },
  { href: '/spatial-twin', label: 'GIS/BIM', icon: MapPinned },
];

export function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { locale } = useLanguage();
  const [dbOffline, setDbOffline] = useState(false);

  const activeContext = MODULE_CONTEXTS.find((item) => pathname.startsWith(item.match)) || {
    title: 'HURC No.1 CDHS',
    description: 'Trung tâm dữ liệu bảo trì, an toàn và tài sản số đường sắt đô thị.',
    icon: Database,
  };
  const ActiveIcon = activeContext.icon;

  const tNavItem = (label: NavItemLabel) => label[locale];

  const translations = {
    en: {
      notifications: "Notifications",
      noNewNotifications: "No new notifications.",
      markAsRead: "Mark as read",
      viewAllNotifications: "View all notifications",
      logout: "Logout",
      loggedOut: "Logged Out",
      loggedOutDesc: "You have been successfully logged out.",
      toggleTheme: "Toggle theme",
      userAvatarAlt: "User avatar",
      userMenuSr: "User account",
    },
    vi: {
      notifications: "Thông báo",
      noNewNotifications: "Chưa có thông báo mới.",
      markAsRead: "Đánh dấu đã đọc",
      viewAllNotifications: "Xem tất cả thông báo",
      logout: "Đăng xuất",
      loggedOut: "Đã đăng xuất",
      loggedOutDesc: "Bạn đã đăng xuất thành công.",
      toggleTheme: "Chuyển đổi giao diện",
      userAvatarAlt: "Ảnh đại diện",
      userMenuSr: "Tài khoản người dùng",
    }
  };
  const t = translations[locale];

  type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    link?: string;
    read: boolean;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logData = await getSystemLogs();
        const logs = Array.isArray(logData) ? logData : [];
        const transformedNotifications = logs.slice(0, 5).map(log => ({
          id: log.id,
          title: log.action?.replace(/_/g, ' ') || 'System Event',
          message: log.details || '',
          time: log.timestamp ? new Date(log.timestamp).toLocaleString(locale) : '',
          read: readNotificationIds.has(log.id),
          link: '/admin/system-logs'
        }));
        setNotifications(transformedNotifications);
      } catch (e) {
        console.error("Failed to fetch system logs for header", e);
      }
    };
    if (mounted) {
      fetchLogs();
      const checkDb = async () => {
        try {
          const status = await getDatabaseStatus();
          if (status) {
            setDbOffline(status.isOffline);
          }
        } catch (e) {
          console.error("Failed to check DB status", e);
        }
      };
      checkDb();
      const interval = setInterval(checkDb, 30000);
      return () => clearInterval(interval);
    }
  }, [locale, readNotificationIds, mounted]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMounted(true);
    const media = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const prefersDark = Boolean(media?.matches);
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    media?.addEventListener('change', handleChange);
    return () => media?.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: t.loggedOut,
      description: t.loggedOutDesc,
    });
    router.push('/login');
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds(prev => new Set(prev).add(id));
  };

  if (!mounted || !user) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <SidebarTrigger className="md:hidden" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-20 flex-col gap-3 border-b bg-card/95 px-4 py-3 shadow-sm backdrop-blur md:px-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
          <ActiveIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard" className="truncate text-lg font-black tracking-tight text-foreground">
              {activeContext.title}
            </Link>
            <div className={cn(
              "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold transition-all",
              dbOffline
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
            )}>
              {dbOffline ? <ShieldAlert className="h-3 w-3" /> : <Database className="h-3 w-3" />}
              {dbOffline ? "LOCAL JSON" : "POSTGRES ONLINE"}
            </div>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:text-sm">{activeContext.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 xl:justify-end">
        <div className="hidden flex-wrap items-center gap-2 lg:flex">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Button key={item.href} asChild size="sm" variant={active ? 'default' : 'outline'} className="h-8 rounded-full text-xs font-bold">
                <Link href={item.href}>
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t.toggleTheme} className="rounded-full">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">{t.notifications}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96">
            <DropdownMenuLabel>{t.notifications}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <DropdownMenuItem key={notif.id} className={cn("flex flex-col items-start gap-1 px-3 py-2 hover:bg-accent/50", !notif.read && "bg-primary/5")} asChild>
                  <Link href={notif.link || "#"} className="w-full">
                    <div className="flex w-full items-center justify-between gap-2">
                      <p className={cn("truncate text-sm font-semibold", !notif.read && "text-primary")}>{notif.title}</p>
                      {!notif.read && (
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80" onClick={(e) => { e.preventDefault(); e.stopPropagation(); markNotificationAsRead(notif.id); }}>
                          <Check className="mr-1 h-3 w-3" /> {t.markAsRead}
                        </Button>
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{notif.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{notif.time}</p>
                  </Link>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>{t.noNewNotifications}</DropdownMenuItem>
            )}
            {notifications.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem className="justify-center" asChild>
              <Link href="/admin/system-logs" className="text-sm text-primary hover:underline">{t.viewAllNotifications}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={t.userAvatarAlt} />
                <AvatarFallback>{user.name?.charAt(0).toUpperCase() || <UserRound className="h-4 w-4" />}</AvatarFallback>
              </Avatar>
              <span className="sr-only">{t.userMenuSr}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {USER_NAV_ITEMS.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link href={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {tNavItem(item.label)}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
