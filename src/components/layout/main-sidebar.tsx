
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, FolderGit2 } from "lucide-react";
import { MAIN_NAV_ITEMS, ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from "@/lib/navigation";
import type { NavItemLabel, NavItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/language-context';
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission } from "@/lib/auth";
import * as React from "react";
import { useAuth } from "@/contexts/auth-context";

const ClientOnlyFooterUser = dynamic(() => import('./client-only-footer-user').then(mod => mod.ClientOnlyFooterUser), {
  ssr: false,
  loading: () => (
    <div className="mt-4 flex items-center gap-3 group-data-[collapsible=icon]:hidden">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  ),
});


export function MainSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const { toast } = useToast();
  const { locale } = useLanguage();
  const { logout } = useAuth();
  const [accessibleAdminItems, setAccessibleAdminItems] = React.useState<NavItem[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = React.useState(true);

  const t = (label: NavItemLabel) => label[locale];

  React.useEffect(() => {
    const checkAdminNavPermissions = async () => {
        setIsLoadingPermissions(true);
        const items: NavItem[] = [];
        const permissionChecks = await Promise.all(
            ADMIN_NAV_ITEMS.map(item => 
                !item.permission || hasPermission(item.permission)
            )
        );
        
        permissionChecks.forEach((hasPerm, index) => {
            if (hasPerm) {
                items.push(ADMIN_NAV_ITEMS[index]);
            }
        });
        
        setAccessibleAdminItems(items);
        setIsLoadingPermissions(false);
    };
    checkAdminNavPermissions();
  }, []);

  const logoutTranslations = {
    en: {
      logoutButton: "Logout",
      adminGroupLabel: "Administration",
    },
    vi: {
      logoutButton: "Đăng xuất",
      adminGroupLabel: "Quản trị Hệ thống",
    }
  };
  const currentTranslations = logoutTranslations[locale];

  const handleLogout = () => {
    logout();
    toast({
      title: "Thông báo",
      description: "Chức năng đăng xuất đã bị vô hiệu hóa.",
    });
    setOpenMobile(false);
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
        <SidebarMenuItem key={item.path}>
          <Link href={item.path} onClick={() => setOpenMobile(false)}>
            <SidebarMenuButton
              isActive={item.exact ? pathname === item.path : pathname.startsWith(item.path)}
              tooltip={{ children: t(item.label), className: "group-data-[collapsible=icon]:visible" }}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{t(item.label)}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ));
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="sidebar">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:py-2 group-data-[collapsible=icon]:px-1.5">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-4">
           <div className="group-data-[collapsible=icon]:hidden">
             <Link href="/dashboard" onClick={() => setOpenMobile(false)} className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-lg truncate">HURC No.1 CDHS</span>
              </Link>
           </div>
          <SidebarTrigger className="md:hidden" />
          <SidebarTrigger className="hidden md:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {renderNavItems(MAIN_NAV_ITEMS)}
        </SidebarMenu>
        
        {isLoadingPermissions ? (
            <>
                <SidebarSeparator />
                <SidebarGroup>
                     {state !== 'collapsed' && <SidebarGroupLabel><Skeleton className="h-4 w-32" /></SidebarGroupLabel>}
                    <SidebarMenu>
                        <Skeleton className="h-8 w-full rounded-md" />
                        <Skeleton className="h-8 w-full rounded-md" />
                    </SidebarMenu>
                </SidebarGroup>
            </>
        ) : accessibleAdminItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
                {state !== 'collapsed' &&
                  <SidebarGroupLabel>
                      {currentTranslations.adminGroupLabel}
                  </SidebarGroupLabel>
                }
                <SidebarMenu>
                    {renderNavItems(accessibleAdminItems)}
                </SidebarMenu>
            </SidebarGroup>
          </>
        )}

      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <div className="group-data-[collapsible=icon]:hidden flex flex-col gap-2">
          {USER_NAV_ITEMS.map((item) => (
             <Link href={item.path} key={item.path} onClick={() => setOpenMobile(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <item.icon className="h-5 w-5" />
                    {t(item.label)}
                </Button>
             </Link>
          ))}
           <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive">
              <LogOut className="h-5 w-5" />
              {currentTranslations.logoutButton}
          </Button>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex flex-col gap-2 items-center">
            {USER_NAV_ITEMS.map((item) => (
                <Link href={item.path} key={item.path} onClick={() => setOpenMobile(false)}>
                    <SidebarMenuButton
                        tooltip={{ children: t(item.label), className: "group-data-[collapsible=icon]:visible" }}
                        className="justify-center"
                        size="sm"
                        asChild
                    >
                        <item.icon className="h-5 w-5" />
                    </SidebarMenuButton>
                </Link>
            ))}
             <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: currentTranslations.logoutButton, className: "group-data-[collapsible=icon]:visible text-destructive" }}
                className="justify-center text-destructive hover:text-destructive-foreground hover:bg-destructive"
                size="sm"
             >
                <LogOut className="h-5 w-5" />
            </SidebarMenuButton>
        </div>
        
        <ClientOnlyFooterUser />

      </SidebarFooter>
    </Sidebar>
  );
}
