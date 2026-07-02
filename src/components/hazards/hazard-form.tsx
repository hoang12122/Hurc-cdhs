"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import {
  HAZARD_STATUSES,
  HAZARD_SEVERITY_LEVELS,
  HAZARD_LIKELIHOOD_LEVELS,
  type HazardRecord,
  type HazardStatus,
} from "@/lib/constants";
import { addHazardRecord, updateHazardRecord } from "@/lib/actions/hazard.actions";
import { assessHazardFlow, type HazardFlowAssessmentResult } from "@/lib/hazards/hazard-ai-flow-assessment";

const hazardFormSchema = z.object({
  description: z.string().min(1, "Description is required."),
  systemGroup: z.string().min(1, "System is required."),
  locationIdsText: z.string().min(1, "Location is required."),
  source: z.string().optional(),
  potentialConsequence: z.string().optional(),
  identifiedBy: z.string().min(1, "Reporter is required."),
  identificationDate: z.string().min(1, "Date is required."),
  severityId: z.string().optional(),
  likelihoodId: z.string().optional(),
  currentControls: z.string().min(1, "Current controls are required."),
  proposedActions: z.string().optional(),
  suggestedActions: z.string().optional(),
  responsiblePersonOrUnit: z.string().optional(),
  coordinatingUnitsText: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(HAZARD_STATUSES as [HazardStatus, ...HazardStatus[]]),
  linkedDnfId: z.string().optional().nullable(),
  closureDetails: z.string().optional(),
  verificationDetails: z.string().optional(),
});

type HazardFormValues = z.infer<typeof hazardFormSchema>;

interface HazardFormProps {
  initialData?: Partial<HazardRecord>;
  isEditMode?: boolean;
  sourceReportId?: string;
}

function splitList(value?: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toFormDate(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function formatDecision(decision: string) {
  switch (decision) {
    case "accept": return "Chap nhan theo doi";
    case "mitigate": return "Can giam thieu rui ro";
    case "escalate": return "Can chuyen cap xem xet";
    default: return "Can con nguoi ra soat";
  }
}

export function HazardForm({ initialData, isEditMode = false, sourceReportId }: HazardFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { locale } = useLanguage();
  const { user: currentUser } = useAuth();
  const [aiAssessment, setAiAssessment] = React.useState<HazardFlowAssessmentResult | null>(null);

  const form = useForm<HazardFormValues>({
    resolver: zodResolver(hazardFormSchema),
    defaultValues: {
      description: initialData?.description || "",
      systemGroup: initialData?.systemGroup || "",
      locationIdsText: (initialData?.locationIds || []).join(", "),
      source: initialData?.source || "",
      potentialConsequence: initialData?.potentialConsequence || "",
      identifiedBy: initialData?.identifiedBy || currentUser?.name || "",
      identificationDate: toFormDate(initialData?.identificationDate),
      severityId: initialData?.severityId || "",
      likelihoodId: initialData?.likelihoodId || "",
      currentControls: initialData?.currentControls || "",
      proposedActions: initialData?.proposedActions || "",
      suggestedActions: initialData?.suggestedActions || "",
      responsiblePersonOrUnit: initialData?.responsiblePersonOrUnit || "",
      coordinatingUnitsText: (initialData?.coordinatingUnits || []).join(", "),
      dueDate: initialData?.dueDate ? toFormDate(initialData.dueDate) : "",
      status: initialData?.status || "Mới",
      linkedDnfId: initialData?.linkedDnfId || sourceReportId || "",
      closureDetails: initialData?.closureDetails || "",
      verificationDetails: initialData?.verificationDetails || "",
    },
  });

  const runHazardAiAssessment = React.useCallback(() => {
    const values = form.getValues();
    const result = assessHazardFlow({
      description: values.description,
      potentialConsequence: values.potentialConsequence,
      currentControls: values.currentControls,
      severityLevel: undefined,
      frequencyLevel: undefined,
      repeatedFailure: /lap lai|tai dien|repeated|recurrence/i.test(`${values.description} ${values.source}`),
      operationalImpact: /van hanh|khai thac|service|operation|delay|cham tau/i.test(`${values.description} ${values.potentialConsequence}`),
      safetyRelated: undefined,
    });

    setAiAssessment(result);

    const aiNote = [
      "AI quick Hazard Log assessment:",
      `- Safety screening: ${result.safetyScreening}`,
      `- Severity: ${result.severityLevel}`,
      `- Frequency: ${result.frequencyLevel}`,
      `- Matrix: ${result.riskClass} (${result.matrixScore})`,
      `- Recommendation: ${formatDecision(result.aiRecommendation)}`,
      "- Human decision required before Hazard Log update.",
      ...result.suggestedActions.map((action) => `- ${action}`),
    ].join("\n");

    const currentSuggestedActions = values.suggestedActions || "";
    if (!currentSuggestedActions.includes("AI quick Hazard Log assessment:")) {
      form.setValue("suggestedActions", currentSuggestedActions ? `${currentSuggestedActions}\n\n${aiNote}` : aiNote, { shouldDirty: true });
    }

    toast({
      title: locale === "vi" ? "Da danh gia nhanh bang AI" : "AI quick assessment completed",
      description: locale === "vi" ? "Ket qua AI da duoc gan vao bien phap de xuat de nguoi co tham quyen ra soat." : "AI result was added to suggested actions for human review.",
    });
  }, [form, locale, toast]);

  const handleResetForm = () => {
    form.reset();
    setAiAssessment(null);
  };

  const onSubmit = async (values: HazardFormValues) => {
    const payload: Omit<HazardRecord, "id" | "createdAt" | "updatedAt" | "riskLevelId" | "createdById"> = {
      description: values.description,
      systemGroup: values.systemGroup,
      locationIds: splitList(values.locationIdsText),
      source: values.source,
      potentialConsequence: values.potentialConsequence,
      identifiedBy: values.identifiedBy,
      identificationDate: new Date(values.identificationDate).toISOString(),
      severityId: values.severityId || undefined,
      likelihoodId: values.likelihoodId || undefined,
      currentControls: values.currentControls,
      proposedActions: values.proposedActions,
      suggestedActions: values.suggestedActions,
      responsiblePersonOrUnit: values.responsiblePersonOrUnit,
      coordinatingUnits: splitList(values.coordinatingUnitsText),
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
      status: values.status,
      linkedDnfId: values.linkedDnfId || null,
      closureDetails: values.closureDetails,
      verificationDetails: values.verificationDetails,
      attachments: initialData?.attachments || [],
    };

    try {
      if (isEditMode && initialData?.id) {
        await updateHazardRecord({
          ...(initialData as HazardRecord),
          ...payload,
          id: initialData.id,
          createdAt: initialData.createdAt || new Date().toISOString(),
          createdById: initialData.createdById || currentUser?.id || "system",
          updatedAt: new Date().toISOString(),
        });
        toast({ title: locale === "vi" ? "Da cap nhat Hazard" : "Hazard updated" });
        router.push(`/hazards/${initialData.id}`);
        return;
      }

      const saved = await addHazardRecord(payload);
      toast({ title: locale === "vi" ? "Da luu Hazard" : "Hazard saved" });
      router.push(`/hazards/${saved.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: locale === "vi" ? "Khong the luu Hazard" : "Could not save Hazard",
        description: error?.message || "Unknown error",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Chinh sua Hazard Log" : "Tao Hazard Log"}</CardTitle>
            <CardDescription>Nhap thong tin Hazard Log va su dung AI de danh gia nhanh theo severity, frequency, matrix va human decision.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Mo ta moi nguy</FormLabel>
                <FormControl><Textarea rows={4} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="systemGroup" render={({ field }) => (
                <FormItem>
                  <FormLabel>He thong</FormLabel>
                  <FormControl><Input placeholder="PSD, AFC, Power, Signal..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="locationIdsText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vi tri</FormLabel>
                  <FormControl><Input placeholder="Nhap vi tri, cach nhau bang dau phay" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="identifiedBy" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nguoi/Don vi phat hien</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="identificationDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngay phat hien</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="source" render={({ field }) => (
              <FormItem>
                <FormLabel>Nguon goc / Nguyen nhan tiem an</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="potentialConsequence" render={({ field }) => (
              <FormItem>
                <FormLabel>Hau qua tiem an</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI danh gia nhanh Hazard Log</CardTitle>
            <CardDescription>AI ho tro sang loc nhanh. Quyet dinh cuoi cung bat buoc do con nguoi phe duyet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={runHazardAiAssessment}>
              <Sparkles className="mr-2 h-4 w-4" /> AI danh gia nhanh
            </Button>
            {aiAssessment && (
              <div className="rounded-md border p-4 space-y-3 bg-muted/30">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Safety: {aiAssessment.safetyScreening}</Badge>
                  <Badge variant="outline">Severity: {aiAssessment.severityLevel}</Badge>
                  <Badge variant="outline">Frequency: {aiAssessment.frequencyLevel}</Badge>
                  <Badge variant={aiAssessment.riskClass === "Critical" || aiAssessment.riskClass === "High" ? "destructive" : "secondary"}>Matrix: {aiAssessment.riskClass} ({aiAssessment.matrixScore})</Badge>
                </div>
                <p className="text-sm"><strong>AI khuyen nghi:</strong> {formatDecision(aiAssessment.aiRecommendation)}</p>
                <p className="text-xs text-muted-foreground">Human decision required: {String(aiAssessment.humanDecisionRequired)}</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {aiAssessment.suggestedActions.map((action) => <li key={action}>{action}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk matrix va bien phap kiem soat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="severityId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Muc do nghiem trong</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chon severity" /></SelectTrigger></FormControl>
                    <SelectContent>{HAZARD_SEVERITY_LEVELS.map((level) => <SelectItem key={level.id} value={level.id}>{level.label[locale]} ({level.id})</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="likelihoodId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tan suat / kha nang xay ra</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chon likelihood" /></SelectTrigger></FormControl>
                    <SelectContent>{HAZARD_LIKELIHOOD_LEVELS.map((level) => <SelectItem key={level.id} value={level.id}>{level.label[locale]} ({level.id})</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="currentControls" render={({ field }) => (
              <FormItem>
                <FormLabel>Bien phap kiem soat hien tai</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="proposedActions" render={({ field }) => (
              <FormItem>
                <FormLabel>Bien phap phu / bo sung</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="suggestedActions" render={({ field }) => (
              <FormItem>
                <FormLabel>Bien phap de xuat / ket qua AI</FormLabel>
                <FormControl><Textarea rows={7} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="responsiblePersonOrUnit" render={({ field }) => (
                <FormItem>
                  <FormLabel>Don vi chu tri</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="coordinatingUnitsText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Don vi phoi hop</FormLabel>
                  <FormControl><Input placeholder="Nhap cac don vi, cach nhau bang dau phay" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngay du kien hoan thanh</FormLabel>
                  <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Trang thai</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>{HAZARD_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="linkedDnfId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Bao cao su co/DNF lien quan</FormLabel>
                  <FormControl><Input placeholder="DNF ID neu co" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            {isEditMode && (
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="closureDetails" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thong tin dong/hoan thanh</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="verificationDetails" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thong tin xac minh</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Huy</Button>
          <Button type="button" variant="outline" onClick={handleResetForm}><RefreshCcw className="mr-2 h-4 w-4" />Dat lai</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Dang luu..." : isEditMode ? "Cap nhat Hazard" : "Luu Hazard"}</Button>
        </div>
      </form>
    </Form>
  );
}
