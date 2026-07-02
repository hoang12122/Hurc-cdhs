"use client";

import { HazardForm } from "@/components/hazards/hazard-form";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { type HazardRecord, MOCK_CURRENT_USER } from "@/lib/constants";
import { useAuth } from "@/contexts/auth-context";

const pageTranslations = {
  vi: {
      title: "Tạo Phiếu Ghi Mối Nguy Mới",
      sourceFromAi: (id: string) => `Phân tích AI từ báo cáo #${id}`,
      sourceFromDnf: (id: string) => `Tạo từ báo cáo DNF #${id}`,
  },
  en: {
      title: "Create New Hazard Record",
      sourceFromAi: (id: string) => `AI Analysis from report #${id}`,
      sourceFromDnf: (id: string) => `Created from DNF #${id}`,
  }
};

export default function NewHazardPage() {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();

  const currentTitle = pageTranslations[locale].title;
  const [initialData, setInitialData] = React.useState<Partial<HazardRecord>>({});
  const reportId = searchParams.get('reportId') || undefined;

  React.useEffect(() => {
    document.title = `${currentTitle} - Metro Inspect Pro`;
  }, [currentTitle, locale]);

  React.useEffect(() => {
    const originatingDnfId = searchParams.get('originatingDnfId');
    const sourceReportId = searchParams.get('reportId');
    const locationOfFailure = searchParams.get('locationOfFailure');

    if (originatingDnfId) {
        setInitialData({
            linkedDnfId: originatingDnfId,
            description: searchParams.get('suggestedDescription') || '',
            potentialConsequence: searchParams.get('suggestedConsequence') || '',
            currentControls: searchParams.get('suggestedControls') || '',
            systemGroup: searchParams.get('suggestedSystemGroup') || '',
            proposedActions: searchParams.get('suggestedProposedActions') || undefined,
            source: sourceReportId ? pageTranslations[locale].sourceFromAi(sourceReportId) : pageTranslations[locale].sourceFromDnf(originatingDnfId),
            identifiedBy: authUser?.name || MOCK_CURRENT_USER.name,
            severityId: searchParams.get('suggestedSeverityId') || undefined,
            likelihoodId: searchParams.get('suggestedLikelihoodId') || undefined,
            locationIds: locationOfFailure ? [locationOfFailure] : [],
        });
    }
  }, [searchParams, locale, authUser]);

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
