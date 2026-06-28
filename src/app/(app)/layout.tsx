"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/layout/main-header";
import { DynamicMainSidebar } from "@/components/layout/dynamic-main-sidebar";
import { RealtimeProvider } from "@/components/providers/realtime-provider";
import { AcceptanceRibbon } from "@/components/layout/acceptance-ribbon";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MaintenanceCopilot } from "@/app/(app)/asset-360/_components/maintenance-copilot";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.mustChangePassword) {
      router.push("/setup-new-password");
    }
  }, [user, router]);

  return (
    <SidebarProvider defaultOpen={true}>
      <DynamicMainSidebar />
      <SidebarInset>
        <MainHeader />
        <AcceptanceRibbon />
        <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_34%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted))/0.28)] p-4 md:p-6">
          <React.Suspense fallback={<div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">Đang tải dữ liệu giao diện...</div>}>
            <RealtimeProvider>
              {children}
              <MaintenanceCopilot />
            </RealtimeProvider>
          </React.Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
