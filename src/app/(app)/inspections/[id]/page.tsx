

"use client";

import * as React from 'react';
import { useEffect, useState } from 'react'; 
import { useParams } from 'next/navigation';
import { InspectionDetailClient } from "@/components/inspections/inspection-detail-client";
import { type InspectionDetail as AppInspectionDetail } from "@/lib/constants"; 
import { getInspectionById, getInspections } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandards, getMaintenanceStandardItems } from "@/lib/actions/maintenance.actions";
import { getLocations } from "@/lib/actions/category.actions";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InspectionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [inspection, setInspection] = useState<AppInspectionDetail | null>(null);
  const [maintenanceStandards, setMaintenanceStandards] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setError("INVALID_ID");
        setLoading(false);
        return;
    }

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [foundInspection, allStandards, allLocations, allStandardItems] = await Promise.all([
                getInspectionById(id),
                getMaintenanceStandards(),
                getLocations(),
                getMaintenanceStandardItems()
            ]);
            
            if (foundInspection) {
                let populatedInspection = { ...foundInspection };
                if ((!populatedInspection.checklistItems || populatedInspection.checklistItems.length === 0) && populatedInspection.checklistTemplateId) {
                    const itemsFromTemplate = allStandardItems.filter(
                        (item) => item.standardId === populatedInspection.checklistTemplateId
                    );
                    populatedInspection.checklistItems = itemsFromTemplate.map(task => ({
                        id: task.itemCode,
                        text: task.itemText,
                        criteria: task.criteria || "",
                        unit: task.unit,
                        status: "pending",
                        findings: [],
                        isCustom: false,
                        standardQuantity: task.standardQuantity,
                        toleranceOperator: task.toleranceOperator,
                        toleranceValue: task.toleranceValue,
                        requiredTools: task.requiredTools
                    }));
                }
                
                setInspection(populatedInspection);
                setMaintenanceStandards(allStandards);
                setLocations(allLocations);
            } else {
                setError("NOT_FOUND");
            }
        } catch (e) {
            console.error("Failed to fetch inspection details:", e);
            setError("GENERAL_ERROR");
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [id]);

  if (loading) return <div className="container mx-auto py-8 text-center text-muted-foreground animate-pulse">Đang tải chi tiết kiểm tra...</div>;

  if (error || !inspection) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Lỗi</h1>
        <p className="text-muted-foreground mb-4">{error === "NOT_FOUND" ? "Không tìm thấy phiếu kiểm tra này." : "Có lỗi xảy ra khi tải dữ liệu."}</p>
        <Button variant="outline" asChild>
          <Link href="/inspections">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
        <InspectionDetailClient 
            initialInspection={inspection} 
            maintenanceStandards={maintenanceStandards} 
            locations={locations} 
        />
    </div>
  );
}
