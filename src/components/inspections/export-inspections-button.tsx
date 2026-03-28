
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InspectionDetail, Locale, MaintenanceStandard } from "@/lib/constants";

// Define a more specific type for the CSV headers part of translations
interface CsvHeaders {
    id: string;
    title: string;
    area: string;
    checklistTemplateName: string;
    date: string;
    status: string;
    inspector: string;
    generalNotes: string;
    checklistItemsCount: string;
    findingsCount: string;
}

// Define a more specific type for the translations prop
interface ExportTranslations {
    exportCsvButton: string;
    exportSuccessTitle: string;
    exportSuccessDesc: (count: number) => string;
    exportNoDataTitle: string;
    exportNoDataDesc: string;
    csvHeaders: CsvHeaders;
}

interface ExportInspectionsButtonProps {
  filteredInspections: InspectionDetail[];
  maintenanceStandards: MaintenanceStandard[];
  translations: ExportTranslations;
  locale: Locale;
}

export function ExportInspectionsButton({ filteredInspections, maintenanceStandards, translations, locale }: ExportInspectionsButtonProps) {
  const { toast } = useToast();

  const escapeCsvCell = (cellData: any): string => {
    const stringData = String(cellData == null ? "" : cellData);
    if (stringData.includes(",") || stringData.includes("\"") || stringData.includes("\n")) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };

  const handleExportCsv = React.useCallback(() => {
    if (filteredInspections.length === 0) {
        toast({
            title: translations.exportNoDataTitle,
            description: translations.exportNoDataDesc,
            variant: "default"
        });
        return;
    }

    const headers = [
        translations.csvHeaders.id,
        translations.csvHeaders.title,
        translations.csvHeaders.area,
        translations.csvHeaders.checklistTemplateName,
        translations.csvHeaders.date,
        translations.csvHeaders.status,
        translations.csvHeaders.inspector,
        translations.csvHeaders.generalNotes,
        translations.csvHeaders.checklistItemsCount,
        translations.csvHeaders.findingsCount
    ];

    const rows = filteredInspections.map(inspection => {
        const template = maintenanceStandards.find(tmpl => tmpl.id === inspection.checklistTemplateId);
        const templateName = template?.name || (inspection.checklistTemplateId || "N/A");
        const checklistItemsCount = inspection.checklistItems?.length || 0;
        const findingsCount = inspection.checklistItems?.reduce((acc, item) => acc + (item.findings?.length || 0), 0) || 0;

        return [
            inspection.id,
            inspection.title,
            (inspection.areaIds || []).join(', '),
            templateName,
            inspection.date, // Use raw date string
            inspection.status,
            inspection.inspector,
            inspection.generalNotes || "",
            checklistItemsCount,
            findingsCount
        ].map(escapeCsvCell);
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(row => row.join(",")).join("\n");
    const link = document.createElement("a");
    const url = encodeURI(csvContent);
    link.setAttribute("href", url);
    const currentDate = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `inspections_export_${currentDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: translations.exportSuccessTitle,
        description: translations.exportSuccessDesc(filteredInspections.length),
    });
  }, [filteredInspections, maintenanceStandards, translations, toast]);

  return (
    <Button onClick={handleExportCsv} variant="outline" size="sm" className="h-9 gap-1">
      <FileDown className="h-3.5 w-3.5" /> {translations.exportCsvButton}
    </Button>
  );
}
