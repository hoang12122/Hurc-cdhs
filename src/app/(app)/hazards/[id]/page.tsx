

import { getHazardById, getHazardRecords } from "@/lib/actions/hazard.actions";
import { getSubsystems, getResponsibleUnits, getLocations } from "@/lib/actions/category.actions";
import { calculateRiskLevelId } from "@/lib/constants";
import { HazardDetailClient } from "@/components/hazards/hazard-detail-client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface HazardDetailPageProps {
  params: {
    id: string;
  };
}

export default async function HazardDetailPage({ params }: HazardDetailPageProps) {
  const { id } = params;

  // Fetch all data in parallel
  const [hazardData, allHazards, subsystems, responsibleUnits, locations] = await Promise.all([
    getHazardById(id),
    getHazardRecords(),
    getSubsystems(),
    getResponsibleUnits(),
    getLocations(),
  ]);
  
  if (!hazardData) {
      return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Mối nguy không tồn tại</h1>
        <p className="text-muted-foreground mb-4">Mối nguy với ID &quot;{id}&quot; không tồn tại hoặc đã bị xóa.</p>
        <Button variant="outline" asChild>
          <Link href="/hazards">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  const hazardWithRiskLevel = {
    ...hazardData,
    riskLevelId: calculateRiskLevelId(hazardData.severityId, hazardData.likelihoodId),
  };

  return <HazardDetailClient 
    initialHazard={hazardWithRiskLevel}
    allHazards={allHazards}
    subsystems={subsystems} 
    responsibleUnits={responsibleUnits} 
    locations={locations}
  />;
}
