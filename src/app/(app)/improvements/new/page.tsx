
"use client";

import { ImprovementForm } from "@/components/improvements/improvement-form";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import * as React from "react";

export default function NewImprovementPage() {
  const { locale } = useLanguage();
  const t = locale === 'vi' ? {
    pageTitle: "Tạo Đề xuất Cải tiến Mới",
  } : {
    pageTitle: "Create New Improvement Proposal",
  };

  React.useEffect(() => {
    document.title = `${t.pageTitle} - HURC CDHS`;
  }, [t.pageTitle, locale]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
      </div>
      <ImprovementForm />
    </div>
  );
}
