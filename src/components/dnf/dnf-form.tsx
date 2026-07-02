"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { DNF_STATUSES, DNF_METHODS_OF_DETECTION, DNF_HAZARD_LEVELS, type DnfDocument, type DnfStatus } from "@/lib/constants";
import { addDnf, updateMockDnf } from "@/lib/actions/dnf.actions";
import { assessHazardFlow, type HazardFlowAssessmentResult } from "@/lib/hazards/hazard-ai-flow-assessment";

const dnfFormSchema = z.object({
  failureReportNo: z.string().optional(),
  locationOfFailureText: z.string().min(1, "Location is required."),
  failedComponentEquipmentLRUTrainNumber: z.string().optional(),
  subsystemIdsText: z.string().min(1, "Subsystem is required."),
  descriptionOfFailure: z.string().min(1, "Description is required."),
  impactAssessment: z.string().optional(),
  staffWhoIdentifiedFailure: z.string().min(1, "Reporter is required."),
  dateTimeOfFailureOccurrence: z.string().min(1, "Date/time is required."),
  methodOfFailureDetection: z.string().min(1, "Detection method is required."),
  hazardLevelId: z.string().optional(),
  status: z.enum(DNF_STATUSES as [DnfStatus, ...DnfStatus[]]),
  assignedTo: z.string().optional(),
  priority: z.enum(["Cao", "Trung bình", "Thấp"]).optional(),
  immediateAction: z.string().optional(),
  problemResettable: z.boolean().optional(),
  trainServiceAffected: z.boolean().optional(),
  trainWithdrawn: z.boolean().optional(),
  systemRestoredTime: z.string().optional(),
  disruptionDuration: z.coerce.number().optional(),
  trainKm: z.coerce.number().optional(),
  rectificationParty: z.string().optional(),
});

type DnfFormValues = z.infer<typeof dnfFormSchema>;

interface DnfFormProps {
  initialData?: Partial<DnfDocument>;
  isEditMode?: boolean;
}

function splitList(value?: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toDateTimeLocal(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
  return date.toISOString().slice(0, 16);
}

function riskToHazardLevel(riskClass: string): "high" | "medium" | "low" {
  if (riskClass === "Critical" || riskClass === "High") return "high";
  if (riskClass === "Medium") return "medium";
  return "low";
}

function riskToPriority(riskClass: string): "Cao" | "Trung bình" | "Thấp" {
  if (riskClass === "Critical" || riskClass === "High") return "Cao";
  if (riskClass === "Medium") return "Trung bình";
  return "Thấp";
}

function formatDecision(decision: string) {
  switch (decision) {
    case "accept": return "Chap nhan theo doi";
    case "mitigate": return "Can giam thieu rui ro";
    case "escalate": return "Can chuyen cap xem xet";
    default: return "Can con nguoi ra soat";
  }
}

export function DnfForm({ initialData, isEditMode = false }: DnfFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { locale } = useLanguage();
  const [aiAssessment, setAiAssessment] = React.useState<HazardFlowAssessmentResult | null>(null);

  const form = useForm<DnfFormValues>({
    resolver: zodResolver(dnfFormSchema),
    defaultValues: {
      failureReportNo: initialData?.failureReportNo || "",
      locationOfFailureText: initialData?.locationOfFailure || "",
      failedComponentEquipmentLRUTrainNumber: initialData?.failedComponentEquipmentLRUTrainNumber || "",
      subsystemIdsText: (initialData?.subsystemIds || []).join(", "),
      descriptionOfFailure: initialData?.descriptionOfFailure || "",
      impactAssessment: initialData?.impactAssessment || "",
      staffWhoIdentifiedFailure: initialData?.staffWhoIdentifiedFailure || currentUser?.name || "",
      dateTimeOfFailureOccurrence: toDateTimeLocal(initialData?.dateTimeOfFailureOccurrence),
      methodOfFailureDetection: initialData?.methodOfFailureDetection || "visual",
      hazardLevelId: initialData?.hazardLevelId || "",
      status: initialData?.status || "Mới",
      assignedTo: initialData?.assignedTo || "",
      priority: initialData?.priority,
      immediateAction: initialData?.immediateAction || "",
      problemResettable: initialData?.problemResettable || false,
      trainServiceAffected: initialData?.trainServiceAffected || false,
      trainWithdrawn: initialData?.trainWithdrawn || false,
      systemRestoredTime: initialData?.systemRestoredTime ? toDateTimeLocal(initialData.systemRestoredTime) : "",
      disruptionDuration: initialData?.disruptionDuration,
      trainKm: initialData?.trainKm,
      rectificationParty: initialData?.rectificationParty || "",
    },
  });

  const runDnfHazardAiAssessment = React.useCallback(() => {
    const values = form.getValues();
    const result = assessHazardFlow({
      description: values.descriptionOfFailure,
      potentialConsequence: values.impactAssessment,
      currentControls: values.immediateAction,
      repeatedFailure: /lap lai|tai dien|repeated|recurrence/i.test(values.descriptionOfFailure),
      operationalImpact: Boolean(values.trainServiceAffected || values.trainWithdrawn || values.disruptionDuration),
      safetyRelated: undefined,
    });

    setAiAssessment(result);
    form.setValue("hazardLevelId", riskToHazardLevel(result.riskClass), { shouldDirty: true });
    form.setValue("priority", riskToPriority(result.riskClass), { shouldDirty: true });

    const aiNote = [
      "AI quick Hazard Log assessment from DNF:",
      `- Safety screening: ${result.safetyScreening}`,
      `- Severity: ${result.severityLevel}`,
      `- Frequency: ${result.frequencyLevel}`,
      `- Matrix: ${result.riskClass} (${result.matrixScore})`,
      `- Recommendation: ${formatDecision(result.aiRecommendation)}`,
      "- Human decision required before Hazard Log update.",
      ...result.suggestedActions.map((action) => `- ${action}`),
    ].join("\n");

    const currentImpact = values.impactAssessment || "";
    if (!currentImpact.includes("AI quick Hazard Log assessment from DNF:")) {
      form.setValue("impactAssessment", currentImpact ? `${currentImpact}\n\n${aiNote}` : aiNote, { shouldDirty: true });
    }

    toast({
      title: locale === "vi" ? "Da danh gia nhanh Hazard tu DNF" : "AI Hazard assessment completed",
      description: locale === "vi" ? "AI da gan muc do moi nguy, uu tien va ghi chu danh gia vao bao cao su co." : "AI added hazard level, priority and assessment note to the defect report.",
    });
  }, [form, locale, toast]);

  const handleResetForm = () => {
    form.reset();
    setAiAssessment(null);
  };

  const onSubmit = async (values: DnfFormValues) => {
    const recordBase = {
      failureReportNo: values.failureReportNo,
      locationOfFailure: values.locationOfFailureText,
      failedComponentEquipmentLRUTrainNumber: values.failedComponentEquipmentLRUTrainNumber,
      subsystemIds: splitList(values.subsystemIdsText),
      descriptionOfFailure: values.descriptionOfFailure,
      impactAssessment: values.impactAssessment,
      staffWhoIdentifiedFailure: values.staffWhoIdentifiedFailure,
      dateTimeOfFailureOccurrence: new Date(values.dateTimeOfFailureOccurrence).toISOString(),
      methodOfFailureDetection: values.methodOfFailureDetection,
      hazardLevelId: values.hazardLevelId as "high" | "medium" | "low" | undefined,
      status: values.status,
      attachments: initialData?.attachments || [],
      assignedTo: values.assignedTo,
      priority: values.priority,
      immediateAction: values.immediateAction,
      problemResettable: values.problemResettable,
      trainServiceAffected: values.trainServiceAffected,
      trainWithdrawn: values.trainWithdrawn,
      systemRestoredTime: values.systemRestoredTime ? new Date(values.systemRestoredTime).toISOString() : undefined,
      disruptionDuration: values.disruptionDuration,
      trainKm: values.trainKm,
      rectificationParty: values.rectificationParty,
    };

    try {
      if (isEditMode && initialData?.id) {
        await updateMockDnf({
          ...(initialData as DnfDocument),
          ...recordBase,
          id: initialData.id,
          statusHistory: initialData.statusHistory || [],
          createdAt: initialData.createdAt || new Date().toISOString(),
          createdById: initialData.createdById || currentUser?.id || "system",
          updatedAt: new Date().toISOString(),
        });
        toast({ title: locale === "vi" ? "Da cap nhat DNF" : "DNF updated" });
        router.push(`/dnf/${initialData.id}`);
        return;
      }

      await addDnf(recordBase);
      toast({ title: locale === "vi" ? "Da luu DNF" : "DNF saved" });
      router.push("/dnf?refresh=true");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: locale === "vi" ? "Khong the luu DNF" : "Could not save DNF",
        description: error?.message || "Unknown error",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? "Chinh sua Bao cao su co" : "Tao Bao cao su co"}</CardTitle>
            <CardDescription>Nhap thong tin su co va su dung AI de sang loc nhanh nguy co lien quan Hazard Log.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="failureReportNo" render={({ field }) => (
              <FormItem>
                <FormLabel>So bao cao/tham chieu</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="locationOfFailureText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vi tri su co</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="subsystemIdsText" render={({ field }) => (
                <FormItem>
                  <FormLabel>He thong lien quan</FormLabel>
                  <FormControl><Input placeholder="PSD, AFC, Power..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="failedComponentEquipmentLRUTrainNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Thiet bi/LRU/Tau bi loi</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="descriptionOfFailure" render={({ field }) => (
              <FormItem>
                <FormLabel>Mo ta su co</FormLabel>
                <FormControl><Textarea rows={4} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="impactAssessment" render={({ field }) => (
              <FormItem>
                <FormLabel>Danh gia anh huong / ghi chu AI</FormLabel>
                <FormControl><Textarea rows={6} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="staffWhoIdentifiedFailure" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nguoi phat hien</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dateTimeOfFailureOccurrence" render={({ field }) => (
                <FormItem>
                  <FormLabel>Thoi gian xay ra/phat hien</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="methodOfFailureDetection" render={({ field }) => (
              <FormItem>
                <FormLabel>Phuong phap phat hien</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Chon phuong phap" /></SelectTrigger></FormControl>
                  <SelectContent>{DNF_METHODS_OF_DETECTION.map((item) => <SelectItem key={item.id} value={item.id}>{item.label[locale]}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> AI danh gia nhanh lien quan Hazard</CardTitle>
            <CardDescription>AI doc mo ta DNF, anh huong van hanh va hanh dong tuc thoi de goi y cap do Hazard. Quyet dinh cuoi cung van do con nguoi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={runDnfHazardAiAssessment}>
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
            <CardTitle>Phan loai va thong tin van hanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <FormField control={form.control} name="hazardLevelId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Muc do moi nguy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chon muc" /></SelectTrigger></FormControl>
                    <SelectContent>{DNF_HAZARD_LEVELS.map((item) => <SelectItem key={item.id} value={item.id}>{item.label[locale]} ({item.id})</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel>Uu tien</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chon uu tien" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Cao">Cao</SelectItem>
                      <SelectItem value="Trung bình">Trung binh</SelectItem>
                      <SelectItem value="Thấp">Thap</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Trang thai</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>{DNF_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="immediateAction" render={({ field }) => (
              <FormItem>
                <FormLabel>Hanh dong tuc thoi</FormLabel>
                <FormControl><Textarea rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid md:grid-cols-3 gap-6">
              <FormField control={form.control} name="trainServiceAffected" render={({ field }) => (
                <FormItem>
                  <FormLabel>Dich vu tau bi anh huong?</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "yes")} value={field.value ? "yes" : "no"}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="no">Khong</SelectItem><SelectItem value="yes">Co</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="trainWithdrawn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tau bi rut khoi dich vu?</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "yes")} value={field.value ? "yes" : "no"}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="no">Khong</SelectItem><SelectItem value="yes">Co</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="disruptionDuration" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gian doan dich vu (phut)</FormLabel>
                  <FormControl><Input type="number" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <FormField control={form.control} name="systemRestoredTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Thoi gian khoi phuc</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="trainKm" render={({ field }) => (
                <FormItem>
                  <FormLabel>Km tau</FormLabel>
                  <FormControl><Input type="number" {...field} value={field.value || ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="rectificationParty" render={({ field }) => (
                <FormItem>
                  <FormLabel>Ben khac phuc</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Huy</Button>
          <Button type="button" variant="outline" onClick={handleResetForm}><RefreshCcw className="mr-2 h-4 w-4" />Dat lai</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Dang luu..." : isEditMode ? "Cap nhat DNF" : "Luu DNF"}</Button>
        </div>
      </form>
    </Form>
  );
}
