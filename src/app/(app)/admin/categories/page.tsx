// src/app/(app)/admin/categories/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function CategoriesRedirectPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  React.useEffect(() => {
    router.replace("/admin/organization?tab=categories");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] gap-3 text-muted-foreground">
      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      <span className="text-sm">
        {locale === 'vi' 
          ? "Đang chuyển hướng đến Trung tâm Cấu trúc & Phân quyền AD..." 
          : "Redirecting to unified Active Directory Control Panel..."}
      </span>
    </div>
  );
}
