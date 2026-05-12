
"use client";
import { HazardForm } from "@/components/hazards/hazard-form";
import { ArrowLeft, Edit3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { type HazardRecord, calculateRiskLevelId } from "@/lib/constants";
import { getHazardRecords } from "@/lib/actions/hazard.actions";
import { useLanguage } from "@/contexts/language-context";

type ErrorCode = "NOT_FOUND" | "INVALID_ID" | "GENERAL_ERROR";

export default function EditHazardPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const hazardId = params.id as string;
  
  const [initialData, setInitialData] = React.useState<HazardRecord | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorCode | null>(null);

  const t = React.useMemo(() => locale === 'vi' ? {
    loading: "Đang tải dữ liệu Mối nguy...",
    notFoundError: (id: string) => `Không tìm thấy Mối nguy với ID: ${id}.`,
    generalError: "Lỗi không xác định khi tải dữ liệu Mối nguy.",
    invalidIdError: "ID Mối nguy không hợp lệ.",
    backToList: "Quay lại danh sách Mối nguy",
    pageTitle: (id: string) => `Chỉnh sửa Mối nguy #${id}`,
    cancelAndBack: "Hủy và Quay lại Chi tiết",
    errorTitle: "Lỗi"
  } : {
    loading: "Loading Hazard data...",
    notFoundError: (id: string) => `Hazard Record with ID: ${id} not found.`,
    generalError: "Unknown error loading Hazard data.",
    invalidIdError: "Invalid Hazard ID.",
    backToList: "Back to Hazard List",
    pageTitle: (id: string) => `Edit Hazard Record #${id}`,
    cancelAndBack: "Cancel and Go Back to Details",
    errorTitle: "Error"
  }, [locale]);
  
  React.useEffect(() => {
    if (hazardId) {
      document.title = `${t.pageTitle(hazardId)} - HURC CDHS`;
    }
  }, [hazardId, t]);

  React.useEffect(() => {
    if (!hazardId) {
      setError("INVALID_ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const allHazards = await getHazardRecords();
            const foundHazard = allHazards.find(hr => hr.id === hazardId);
            if (foundHazard) {
              const riskLevelId = calculateRiskLevelId(foundHazard.severityId, foundHazard.likelihoodId);
              setInitialData({ ...foundHazard, riskLevelId });
            } else {
              setError("NOT_FOUND");
            }
        } catch (err) {
          console.error("Error fetching Hazard for edit:", err);
          setError("GENERAL_ERROR");
        } finally {
          setLoading(false);
        }
    };
    
    fetchData();

  }, [hazardId]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loading}</div>;
  }

  if (error) {
    let errorMessage = t.generalError;
    if (error === "NOT_FOUND") {
      errorMessage = t.notFoundError(hazardId);
    } else if (error === "INVALID_ID") {
      errorMessage = t.invalidIdError;
    }
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/hazards">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!initialData && !error) { 
     return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{t.notFoundError(hazardId)}</p>
         <Button variant="outline" asChild className="mt-4">
          <Link href="/hazards">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <Edit3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle(hazardId)}</h1>
        </div>
         <Button variant="outline" asChild>
          <Link href={`/hazards/${hazardId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.cancelAndBack}
          </Link>
        </Button>
      </div>
      <HazardForm initialData={initialData} isEditMode={true} /> 
    </div>
  );
}
