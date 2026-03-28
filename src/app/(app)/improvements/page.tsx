
"use client";

import * as React from "react";
import { useLanguage } from "@/contexts/language-context";
import { ImprovementsTableClient } from "@/components/improvements/improvements-table-client";
import { Lightbulb } from "lucide-react";
import { getImprovements } from "@/lib/actions/improvement.actions";
import { type Improvement } from "@/lib/types";

// This page has been converted to a client component to handle dynamic language switching
// while still fetching initial data on the server via a useEffect hook.
// A more advanced setup might use server-side props with language detection.

export default function ImprovementsPage() {
  const { locale } = useLanguage();
  const [initialImprovements, setInitialImprovements] = React.useState<Improvement[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const t = locale === 'vi' ? {
    pageTitle: "Quản lý Cải tiến",
    pageDescription: "Theo dõi, tạo và quản lý các đề xuất cải tiến để nâng cao hiệu quả hoạt động."
  } : {
    pageTitle: "Improvements Management",
    pageDescription: "Track, create, and manage improvement proposals to enhance operational efficiency."
  };

  React.useEffect(() => {
    document.title = `${t.pageTitle} - HURC CDHS`;
    getImprovements().then(data => {
      setInitialImprovements(data);
      setIsLoading(false);
    });
  }, [t.pageTitle]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-3">
        <Lightbulb className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageDescription}</p>
        </div>
      </div>
       {isLoading ? (
        <p>Loading...</p> 
      ) : (
        <ImprovementsTableClient initialImprovements={initialImprovements} />
      )}
    </div>
  );
}
