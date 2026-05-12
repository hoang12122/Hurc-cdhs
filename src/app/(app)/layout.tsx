"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/layout/main-header";
import { DynamicMainSidebar } from "@/components/layout/dynamic-main-sidebar";
import { RealtimeProvider } from "@/components/providers/realtime-provider";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background">
          <React.Suspense fallback={<div>Loading page...</div>}>
            <RealtimeProvider>
              {children}
            </RealtimeProvider>
          </React.Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
