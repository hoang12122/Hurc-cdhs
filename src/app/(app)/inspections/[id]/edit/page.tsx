
"use client"; 
import { InspectionForm } from "@/components/inspections/inspection-form";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { type InspectionDetail } from "@/lib/constants"; 
import { useLanguage } from "@/contexts/language-context";
import { getInspections } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandardItems } from "@/lib/actions/maintenance.actions";

type ErrorCode = "NOT_FOUND" | "INVALID_ID" | "GENERAL_ERROR";

export default function EditInspectionPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.id as string;
  const { locale } = useLanguage();
  
  const [initialInspectionData, setInitialInspectionData] = React.useState<InspectionDetail | undefined>(undefined);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ErrorCode | null>(null);

  const t = locale === 'vi' ? {
    pageTitle: (id: string) => `Chỉnh sửa Phiếu Kiểm Tra #${id}`,
    loadingMessage: "Đang tải dữ liệu kiểm tra...",
    errorMessage: "Lỗi khi tải dữ liệu kiểm tra.",
    notFoundMessage: (id: string) => `Không tìm thấy kiểm tra với ID: ${id}.`,
    invalidIdMessage: "ID kiểm tra không hợp lệ.",
    backToList: "Quay lại danh sách",
    cancelAndBack: "Hủy và Quay lại",
    errorTitle: "Lỗi"
  } : {
    pageTitle: (id: string) => `Edit Inspection Form #${id}`,
    loadingMessage: "Loading inspection data...",
    errorMessage: "Error loading inspection data.",
    notFoundMessage: (id: string) => `Inspection with ID: ${id} not found.`,
    invalidIdMessage: "Invalid inspection ID.",
    backToList: "Back to list",
    cancelAndBack: "Cancel and Go Back",
    errorTitle: "Error"
  };

  React.useEffect(() => {
    if (inspectionId) {
      document.title = `${t.pageTitle(inspectionId)} - HURC CDHS`;
    }
  }, [inspectionId, t]);
  
  React.useEffect(() => {
    if (!inspectionId) {
      setError("INVALID_ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [allInspections, allStandardItems] = await Promise.all([
                getInspections(),
                getMaintenanceStandardItems(),
            ]);

            const foundInspection = allInspections.find(insp => insp.id === inspectionId);

            if (foundInspection) {
              let checklistItems = foundInspection.checklistItems || [];
              if (checklistItems.length === 0 && foundInspection.checklistTemplateId) {
                  const itemsFromTemplate = allStandardItems.filter(
                      (item) => item.standardId === foundInspection.checklistTemplateId
                  );
                  checklistItems = itemsFromTemplate.map(task => ({
                      id: task.itemCode,
                      text: task.itemText,
                      criteria: task.criteria || "",
                      unit: task.unit,
                      status: "pending",
                      findings: [],
                      images: [],
                      isCustom: false,
                      standardQuantity: task.standardQuantity,
                      toleranceOperator: task.toleranceOperator,
                      toleranceValue: task.toleranceValue,
                      requiredTools: task.requiredTools
                  }));
              }
              const detailedData: InspectionDetail = {
                ...foundInspection,
                checklistItems: checklistItems.map((item: any) => ({
                    ...item,
                    images: item.images || [],
                })),
                generalNotes: foundInspection.generalNotes || "",
              };
              setInitialInspectionData(detailedData);
            } else {
              setError("NOT_FOUND");
            }
        } catch (err) {
            console.error("Error processing inspection for edit:", err);
            setError("GENERAL_ERROR");
        } finally {
            setLoading(false);
        }
    }

    fetchData();
    
  }, [inspectionId]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loadingMessage}</div>;
  }

  if (error) {
    let errorMessageText = t.errorMessage;
    if (error === "NOT_FOUND") errorMessageText = t.notFoundMessage(inspectionId);
    if (error === "INVALID_ID") errorMessageText = t.invalidIdMessage;

    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{errorMessageText}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }
  
  if (!initialInspectionData && !error) { 
     return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.errorTitle}</h1>
        <p className="text-muted-foreground mb-4">{t.notFoundMessage(inspectionId)}</p>
         <Button variant="outline" asChild className="mt-4">
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle(inspectionId)}</h1>
         <Button variant="outline" asChild>
          <Link href={`/inspections/${inspectionId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.cancelAndBack}
          </Link>
        </Button>
      </div>
      <React.Suspense fallback={<div>Loading form...</div>}>
        <InspectionForm initialData={initialInspectionData} isEditMode={true} />
      </React.Suspense>
    </div>
  );
}
