

import { getDnfById, getDnfs } from "@/lib/actions/dnf.actions";
import { getSubsystems, getLocations } from "@/lib/actions/category.actions";
import { getComments } from "@/lib/actions/comment.actions";
import { DnfDetailClient } from "@/components/dnf/dnf-detail-client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DnfDetailPageProps {
  params: {
    id: string;
  };
}

// This is now an async Server Component
export default async function DnfDetailPage({ params }: DnfDetailPageProps) {
  const { id } = params;
  
  // Fetch all data in parallel
  const [dnf, allDnfs, subsystems, comments, locations] = await Promise.all([
    getDnfById(id),
    getDnfs(), // Fetch all DNFs for the "related" feature
    getSubsystems(),
    getComments(id),
    getLocations()
  ]);
  
  if (!dnf) {
     return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Sự cố không tồn tại</h1>
        <p className="text-muted-foreground mb-4">Sự cố với ID &quot;{id}&quot; không tồn tại hoặc đã bị xóa.</p>
        <Button variant="outline" asChild>
          <Link href="/dnf">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DnfDetailClient
      initialDnf={dnf}
      allDnfs={allDnfs}
      initialSubsystems={subsystems}
      initialComments={comments}
      initialLocations={locations}
    />
  );
}
