import Link from 'next/link';
import { ArrowLeft, CheckCircle2, FileWarning, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FRACAS_DEMO_CASE_STUDY } from '@/lib/demo/fracas-demo-case-study';

export default function FracasDemoCaseStudyPage() {
  const demo = FRACAS_DEMO_CASE_STUDY;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/fracas-risk-management" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Quay lại FRACAS / Risk Management
        </Link>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">{demo.title}</h1>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">{demo.summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {demo.businessValue.map((value) => (
          <Card key={value}>
            <CardContent className="flex gap-2 p-4 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PlayCircle className="h-5 w-5 text-primary" /> Workflow demo end-to-end</CardTitle>
          <CardDescription>Minh họa một hồ sơ PSD đi từ DNF đến Hazard Log, Corrective Action, RAMS/OCC và Closure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {demo.steps.map((step) => (
            <div key={step.step} className="rounded-2xl border p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline">Step {step.step}</Badge>
                    <Badge variant="secondary">{step.linkedModule}</Badge>
                  </div>
                  <h2 className="font-bold">{step.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground"><strong>Evidence:</strong> {step.expectedEvidence}</p>
                </div>
                <Link href={step.linkedModule} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted/50">
                  <FileWarning className="h-4 w-4" /> Open module
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
