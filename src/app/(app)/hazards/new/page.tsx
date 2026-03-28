
"use client"; 

import { HazardForm } from "@/components/hazards/hazard-form";
import { ShieldAlert } from "lucide-react"; 
import { useLanguage } from "@/contexts/language-context";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { type HazardRecord, MOCK_CURRENT_USER } from "@/lib/constants";

export default function NewHazardPage() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();

  const pageTranslations = {
    vi: { 
        title: "Tạo Phiếu Ghi Mối Nguy Mới",
        sourceFromAi: (id: string) => `Phân tích AI từ báo cáo #${id}`,
    },
    en: { 
        title: "Create New Hazard Record",
        sourceFromAi: (id: string) => `AI Analysis from report #${id}`,
    }
  };
  const currentTitle = pageTranslations[locale].title;

  const [initialData, setInitialData] = React.useState<Partial<HazardRecord>>({});
  
  // Extract reportId to pass to the form for updating the suggestion status upon creation
  const reportId = searchParams.get('reportId') || undefined;

  React.useEffect(() => {
    document.title = `${currentTitle} - Metro Inspect Pro`;
  }, [currentTitle, locale]);

  React.useEffect(() => {
    // Check for query params to pre-fill the form
    const originatingDnfId = searchParams.get('originatingDnfId');
    const sourceReportId = searchParams.get('reportId');
    const locationOfFailure = searchParams.get('locationOfFailure');

    if (originatingDnfId) {
        setInitialData({
            linkedDnfId: originatingDnfId,
            description: searchParams.get('suggestedDescription') || '',
            // If it comes from an AI report, set the source and identifiedBy to the approver (current user).
            source: sourceReportId ? pageTranslations[locale].sourceFromAi(sourceReportId) : 'Thủ công',
            identifiedBy: sourceReportId ? MOCK_CURRENT_USER.name : undefined,
            severityId: searchParams.get('suggestedSeverityId') || undefined,
            likelihoodId: searchParams.get('suggestedLikelihoodId') || undefined,
            locationIds: locationOfFailure ? [locationOfFailure] : [],
        });
    }
  }, [searchParams, locale]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="h-8 w-8 text-primary" /> 
        <h1 className="text-3xl font-bold font-headline text-primary">{currentTitle}</h1>
      </div>
      <HazardForm initialData={initialData} sourceReportId={reportId} />
    </div>
  );
}
