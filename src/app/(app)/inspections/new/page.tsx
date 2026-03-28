

"use client";

import { InspectionForm } from "@/components/inspections/inspection-form";
import * as React from "react";
import { useLanguage } from "@/contexts/language-context";

export default function NewInspectionPage() {
  const { locale } = useLanguage();
  const pageTranslations = {
    vi: { title: "Tạo Phiếu Kiểm Tra Mới" },
    en: { title: "Create New Inspection Form" }
  };
  const currentTitle = pageTranslations[locale].title;

  React.useEffect(() => {
    document.title = `${currentTitle} - Metro Inspect Pro`;
  }, [currentTitle, locale]); // Added locale to dependency array for completeness

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline text-primary">{currentTitle}</h1>
      <React.Suspense fallback={<div>Loading...</div>}>
        <InspectionForm />
      </React.Suspense>
    </div>
  );
}
