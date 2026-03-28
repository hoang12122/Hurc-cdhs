"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const SidebarSkeleton = () => (
    <div className="hidden md:flex flex-col gap-2 p-2 h-screen w-[16rem] border-r bg-card">
        <div className="flex items-center justify-between p-2">
             <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-5 w-32" />
            </div>
        </div>
        <div className="flex flex-col gap-2 p-2">
            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-8 w-full rounded-md" />)}
        </div>
        <div className="mt-auto p-2 space-y-2">
             <Skeleton className="h-8 w-full rounded-md" />
             <Skeleton className="h-8 w-full rounded-md" />
             <div className="h-px w-full bg-border my-2" />
             <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </div>
    </div>
);

// This is the dynamically imported component, which will only render on the client
export const DynamicMainSidebar = dynamic(
  () => import('@/components/layout/main-sidebar').then(mod => mod.MainSidebar),
  {
    ssr: false,
    loading: () => <SidebarSkeleton />,
  }
);
