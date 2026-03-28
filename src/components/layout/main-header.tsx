
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Search, Settings, UserCircle, Sun, Moon, Check, FolderGit2 } from "lucide-react";
import { USER_NAV_ITEMS } from "@/lib/navigation";
import type { SystemLog, NavItemLabel } from "@/lib/types";
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
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLanguage } from '@/contexts/language-context';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSystemLogs } from "@/lib/actions/system.actions";
import { useAuth } from "@/contexts/auth-context";


export function MainHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { locale } = useLanguage();

  const tNavItem = (label: NavItemLabel) => label[locale];

  const translations = {
    en: {
      searchPlaceholder: "Search reports...",
      notifications: "Notifications",
      noNewNotifications: "No new notifications.",
      markAsRead: "Mark as read",
      viewAllNotifications: "View all notifications",
      myAccount: "My Account",
      logout: "Logout",
      loggedOut: "Logged Out",
      loggedOutDesc: "You have been successfully logged out.",
      toggleTheme: "Toggle theme",
      userAvatarAlt: "User avatar",
      userMenuSr: "User account",
    },
    vi: {
      searchPlaceholder: "Tìm kiếm báo cáo...",
      notifications: "Thông báo",
      noNewNotifications: "Chưa có thông báo mới.",
      markAsRead: "Đánh dấu đã đọc",
      viewAllNotifications: "Xem tất cả thông báo",
      myAccount: "Tài khoản của tôi",
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
        const transformedNotifications = logData.slice(0, 5).map(log => ({
            id: log.id,
            title: log.action.replace(/_/g, ' '),
            message: log.details,
            time: new Date(log.timestamp).toLocaleString(locale),
            read: readNotificationIds.has(log.id),
            link: '/admin/system-logs'
        }));
        setNotifications(transformedNotifications);
      } catch (e) {
        console.error("Failed to fetch system logs for header", e);
      }
    };
    if(mounted) {
      fetchLogs();
    }
  }, [locale, readNotificationIds, mounted]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMounted(true);
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    if (typeof window !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChange);
        return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChange);
    }
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
    setIsDarkMode(!isDarkMode); 
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setReadNotificationIds(prev => new Set(prev).add(id));
  };

  if (!mounted || !user) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm">
      {/* Left side: Hamburger and App Name */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/dashboard" className="hidden items-center gap-2 sm:flex">
          <span className="font-bold text-lg truncate text-foreground">HURC No.1 CDHS</span>
        </Link>
      </div>

      {/* Spacer to push actions to the right */}
      <div className="flex-1" />
      
      {/* Right side: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t.toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
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
                    <DropdownMenuItem key={notif.id} className={cn("flex flex-col items-start gap-1 py-2 px-3 hover:bg-accent/50", !notif.read && "bg-primary/5")} asChild>
                        <Link href={notif.link || "#"} className="w-full">
                            <div className="flex justify-between items-center w-full">
                                <p className={cn("font-semibold text-sm", !notif.read && "text-primary")}>{notif.title}</p>
                                {!notif.read && (
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80" onClick={(e) => {e.preventDefault(); e.stopPropagation(); markNotificationAsRead(notif.id);}}>
                                        <Check className="h-3 w-3 mr-1"/> {t.markAsRead}
                                    </Button>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{notif.message}</p>
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{notif.time}</p>
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
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
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
