
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { type Improvement } from "@/lib/constants";
import { getImprovements } from "@/lib/actions/improvement.actions";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { ImprovementForm } from "@/components/improvements/improvement-form";

type ErrorCode = "NOT_FOUND" | "INVALID_ID" | "GENERAL_ERROR";

export default function EditImprovementPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const improvementId = params.id as string;

  const [initialData, setInitialData] = React.useState<Improvement | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorCode | null>(null);

  const t = locale === 'vi' ? {
    loading: "Đang tải dữ liệu Cải tiến...",
    notFoundError: (id: string) => `Không tìm thấy Đề xuất Cải tiến với ID: ${id}.`,
    generalError: "Lỗi không xác định khi tải dữ liệu.",
    invalidIdError: "ID Cải tiến không hợp lệ.",
    backToList: "Quay lại danh sách Cải tiến",
    pageTitle: (id: string) => `Chỉnh sửa Cải tiến #${id}`,
    cancelAndBack: "Hủy và Quay lại Chi tiết",
    errorTitle: "Lỗi"
  } : {
    loading: "Loading Improvement data...",
    notFoundError: (id: string) => `Improvement Proposal with ID: ${id} not found.`,
    generalError: "Unknown error loading data.",
    invalidIdError: "Invalid Improvement ID.",
    backToList: "Back to Improvement List",
    pageTitle: (id: string) => `Edit Improvement #${id}`,
    cancelAndBack: "Cancel and Go Back to Details",
    errorTitle: "Error"
  };

  React.useEffect(() => {
    if (improvementId) {
      document.title = `${t.pageTitle(improvementId)} - Metro Inspect Pro`;
    }
  }, [improvementId, t]);

  React.useEffect(() => {
    if (improvementId) {
      setLoading(true);
      setError(null);
      getImprovements()
        .then(allImprovements => {
          const foundItem = allImprovements.find(imp => imp.id === improvementId);
          if (foundItem) {
            setInitialData(foundItem);
          } else {
            setError("NOT_FOUND");
          }
        })
        .catch(() => setError("GENERAL_ERROR"))
        .finally(() => setLoading(false));
    } else {
      setError("INVALID_ID");
      setLoading(false);
    }
  }, [improvementId]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loading}</div>;
  }

  if (error || !initialData) {
    let errorMessage = error === "NOT_FOUND" ? t.notFoundError(improvementId) :
                       error === "INVALID_ID" ? t.invalidIdError :
                       t.generalError;
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/improvements">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle(improvementId)}</h1>
        <Button variant="outline" asChild>
          <Link href={`/improvements/${improvementId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.cancelAndBack}
          </Link>
        </Button>
      </div>
      <ImprovementForm initialData={initialData} isEditMode={true} />
    </div>
  );
}
