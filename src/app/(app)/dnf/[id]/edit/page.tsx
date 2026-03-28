"use client";
import { DnfForm } from "@/components/dnf/dnf-form";
import { ArrowLeft, Edit3, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { type DnfDocument } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";
import { getDnfs } from "@/lib/actions/dnf.actions";

type ErrorCode = "NOT_FOUND" | "INVALID_ID" | "GENERAL_ERROR";

export default function EditDnfPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const dnfId = params.id as string;
  
  const [initialData, setInitialData] = React.useState<DnfDocument | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorCode | null>(null);

  const t = locale === 'vi' ? {
    loading: "Đang tải dữ liệu Khiếm khuyết...",
    notFoundError: (id: string) => `Không tìm thấy Khiếm khuyết (Defect) với ID: ${id}.`,
    generalError: "Lỗi không xác định khi tải dữ liệu Khiếm khuyết.",
    invalidIdError: "ID Khiếm khuyết không hợp lệ.",
    backToList: "Quay lại danh sách Khiếm khuyết",
    pageTitle: (id: string) => `Chỉnh sửa Khiếm khuyết (Defect) #${id}`,
    cancelAndBack: "Hủy và Quay lại Chi tiết",
    errorTitle: "Lỗi"
  } : {
    loading: "Loading Defect data...",
    notFoundError: (id: string) => `Defect with ID: ${id} not found.`,
    generalError: "Unknown error loading Defect data.",
    invalidIdError: "Invalid Defect ID.",
    backToList: "Back to Defect List",
    pageTitle: (id: string) => `Edit Defect #${id}`,
    cancelAndBack: "Cancel and Go Back to Details",
    errorTitle: "Error"
  };
  
  React.useEffect(() => {
    if (dnfId) {
      document.title = `${t.pageTitle(dnfId)} - Metro Inspect Pro`;
    }
  }, [dnfId, t]);

  React.useEffect(() => {
    if (dnfId) {
      setLoading(true);
      setError(null); 

      const fetchData = async () => {
        try {
            const allDnfs = await getDnfs();
            const foundDnf = allDnfs.find(dnf => dnf.id === dnfId);
            if (foundDnf) {
              setInitialData(foundDnf);
            } else {
              setError("NOT_FOUND");
            }
        } catch (err) {
            console.error("Error processing Defect for edit:", err);
            setError("GENERAL_ERROR");
        } finally {
            setLoading(false);
        }
      };

      fetchData();
    } else {
      setError("INVALID_ID");
      setLoading(false);
    }
  }, [dnfId]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loading}</div>;
  }

  if (error) {
    let errorMessageText = t.generalError;
    if (error === "NOT_FOUND") errorMessageText = t.notFoundError(dnfId);
    if (error === "INVALID_ID") errorMessageText = t.invalidIdError;

    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{errorMessageText}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dnf">
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
        <p className="text-muted-foreground mb-4">{t.notFoundError(dnfId)}</p>
         <Button variant="outline" asChild className="mt-4">
          <Link href="/dnf">
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
            <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle(dnfId)}</h1>
        </div>
         <Button variant="outline" asChild>
          <Link href={`/dnf/${dnfId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.cancelAndBack}
          </Link>
        </Button>
      </div>
      <DnfForm initialData={initialData} isEditMode={true} /> 
    </div>
  );
}
