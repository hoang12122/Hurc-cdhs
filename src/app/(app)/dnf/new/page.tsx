

"use client";

import { DnfForm } from "@/components/dnf/dnf-form";
import type { Metadata } from 'next';
import { FilePlus } from "lucide-react";
import * as React from "react";
import { useSearchParams } from 'next/navigation';
import { useLanguage } from "@/contexts/language-context";
import type { DnfDocument } from "@/lib/constants";

export default function NewDnfPage() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();

  const [pageTitle, setPageTitle] = React.useState(locale === 'vi' ? "Tạo Khiếm khuyết (Defect) Mới" : "Create New Defect (DNF)");
  const [initialData, setInitialData] = React.useState<Partial<DnfDocument>>({});

  React.useEffect(() => {
    const originatingInspectionId = searchParams.get('originatingInspectionId');
    const originatingFindingId = searchParams.get('originatingFindingId');
    const descriptionParam = searchParams.get('description');
    const locationOfFailure = searchParams.get('locationOfFailure');
    const staffWhoIdentifiedFailure = searchParams.get('staffWhoIdentifiedFailure');

    let title = locale === 'vi' ? "Tạo Khiếm khuyết (Defect) Mới" : "Create New Defect (DNF)";
    let initialDescription = descriptionParam || '';

    if (originatingInspectionId) {
        title = locale === 'vi' 
            ? `Tạo DNF từ Kiểm tra #${originatingInspectionId}` 
            : `Create DNF from Inspection #${originatingInspectionId}`;
        initialDescription = `Từ Kiểm tra #${originatingInspectionId}, Phát hiện #${originatingFindingId}:\n\n${descriptionParam || ''}`;
    }
    setPageTitle(title);
    
    document.title = `${title} - HURC CDHS`;

    setInitialData({
      originatingInspectionId: originatingInspectionId || undefined,
      originatingFindingId: originatingFindingId || undefined,
      descriptionOfFailure: initialDescription,
      locationOfFailure: locationOfFailure ? locationOfFailure.split(',')[0] : '', // Use first location if multiple
      staffWhoIdentifiedFailure: staffWhoIdentifiedFailure || '',
    });

  }, [searchParams, locale]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <FilePlus className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline text-primary">{pageTitle}</h1>
      </div>
      <DnfForm initialData={initialData} />
    </div>
  );
}
