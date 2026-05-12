
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AiAssistButton } from "@/components/ai/ai-assist-button";
import { AiVisionAudit } from "@/components/ai/ai-vision-audit";
import { AiHazardVision } from "@/components/ai/ai-hazard-vision";
import { VoiceInput } from "@/components/ai/voice-input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, XCircle, FilePlus, RefreshCcw, ChevronsUpDown, Sparkles, Printer } from "lucide-react";
import {
    HAZARD_STATUSES,
    type HazardStatus,
    HAZARD_SEVERITY_LEVELS,
    HAZARD_LIKELIHOOD_LEVELS,
    type HazardRecord,
    type ImageAttachment,
    type DnfDocument,
    type ResponsibleUnit,
    type Subsystem,
    type PatrolLocation,
    HAZARD_STATUS_TRANSITIONS,
    ROLE_ADMIN_PKTAT
} from "@/lib/constants";
import { addHazardRecord, updateHazardRecord } from "@/lib/actions/hazard.actions";
import { getDnfs } from "@/lib/actions/dnf.actions";
import { getResponsibleUnits, getSubsystems, getLocations } from "@/lib/actions/category.actions";
import { useLanguage } from "@/contexts/language-context";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { useNetwork } from "@/components/providers/network-provider";
import { offlineSync } from "@/lib/services/offline-sync";

const NO_LINKED_DNF_VALUE = "__NO_LINKED_DNF__";

const imageAttachmentSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  "data-ai-hint": z.string().optional(),
});

const hazardFormSchema = z.object({
  description: z.string().min(1, "Mô tả không được để trống."),
  systemGroup: z.string().min(1, "Nhóm hệ thống không được để trống."),
  locationIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một vị trí."),
  source: z.string().optional(),
  potentialConsequence: z.string().optional(),
  identifiedBy: z.string().min(1, "Người phát hiện không được để trống."),
  identificationDate: z.string().min(1, "Ngày phát hiện không được để trống."),

  severityId: z.string().optional(),
  likelihoodId: z.string().optional(),

  currentControls: z.string().min(1, "Biện pháp chính không được để trống."),
  proposedActions: z.string().optional(),
  suggestedActions: z.string().optional(),
  responsiblePersonOrUnit: z.string().optional(),
  coordinatingUnits: z.array(z.string()).optional(),
  dueDate: z.string().optional(),

  status: z.enum(HAZARD_STATUSES as [HazardStatus, ...HazardStatus[]]),
  attachments: z.array(imageAttachmentSchema).optional(),
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

const translations = {
  vi: {
    formTitleCreate: "Tạo Phiếu Ghi Mối Nguy Mới",
    formTitleEdit: "Chỉnh sửa Phiếu Ghi Mối Nguy",
    formDescription: "Nhập thông tin chi tiết cho mối nguy.",
    descriptionLabel: "Mô tả mối nguy",
    descriptionPlaceholder: "Mô tả chi tiết mối nguy đã phát hiện...",
    systemGroupLabel: "Hệ thống",
    systemGroupPlaceholder: "Chọn hệ thống",
    locationLabel: "Vị trí Phát hiện",
    locationPlaceholder: "Chọn (các) vị trí",
    sourceLabel: "Nguồn gốc/Nguyên nhân tiềm ẩn",
    sourcePlaceholder: "Mô tả nguồn gốc hoặc nguyên nhân tiềm ẩn của mối nguy (VD: từ chiến dịch an toàn, kiểm tra đột xuất...)",
    potentialConsequenceLabel: "Hậu quả tiềm ẩn",
    potentialConsequencePlaceholder: "Mô tả hậu quả có thể xảy ra nếu mối nguy không được xử lý...",
    identifiedByLabel: "Người/Đơn vị phát hiện",
    identifiedByPlaceholder: "VD: Nguyễn Văn A (Đội trưởng Tuần tra)",
    identificationDateLabel: "Ngày phát hiện",
    severityLabel: "Mức độ Nghiêm trọng",
    severityPlaceholder: "Chọn mức độ nghiêm trọng",
    likelihoodLabel: "Tần suất Khả năng Xảy Ra",
    likelihoodPlaceholder: "Chọn tần suất",
    riskAssessmentInfo: "Mức độ Rủi ro sẽ được tính toán tự động sau khi chọn Mức độ Nghiêm trọng và Tần suất.",
    controlsAndActionsTitle: "Biện pháp kiểm soát",
    currentControlsLabel: "Biện pháp chính",
    currentControlsPlaceholder: "Mô tả các biện pháp kiểm soát chính, đang được áp dụng...",
    proposedActionsLabel: "Biện pháp phụ",
    proposedActionsPlaceholder: "Mô tả các biện pháp phụ, hỗ trợ (nếu có)...",
    suggestedActionsLabel: "Biện pháp đề xuất (chưa thực hiện)",
    suggestedActionsPlaceholder: "Mô tả các biện pháp được đề xuất để cải thiện hoặc thay thế...",
    responsiblePersonLeadLabel: "Đơn vị chịu trách nhiệm chủ trì",
    responsiblePersonPlaceholder: "Chọn đơn vị chủ trì",
    coordinatingUnitsLabel: "Đơn vị trách nhiệm phối hợp",
    coordinatingUnitsPlaceholder: "Chọn đơn vị phối hợp",
    dueDateLabel: "Ngày Dự kiến Hoàn thành",
    statusLabel: "Trạng thái",
    statusPlaceholder: "Chọn trạng thái",
    attachmentsLabel: "Hình ảnh/Tài liệu đính kèm",
    uploadButton: "Tải lên",
    noImages: "Chưa có hình ảnh nào.",
    linkedDnfLabel: "Báo cáo sự cố (DNF) Liên quan (Nếu có)",
    linkedDnfPlaceholder: "Tìm và chọn DNF liên quan...",
    searchDnfPlaceholder: "Tìm DNF theo ID hoặc mô tả...",
    noDnfLinked: "Không liên kết DNF",
    noDnfsAvailable: "Không có DNF nào để chọn",
    closureDetailsLabel: "Thông tin Đóng/Hoàn thành (nếu có)",
    closureDetailsPlaceholder: "Mô tả chi tiết việc đóng/hoàn thành mối nguy...",
    verificationDetailsLabel: "Thông tin Xác minh (nếu có)",
    verificationDetailsPlaceholder: "Mô tả chi tiết việc xác minh sau xử lý...",
    saveButton: "Lưu Mối nguy",
    updateButton: "Cập nhật Mối nguy",
    cancelButton: "Hủy",
    resetFormButton: "Đặt lại Form",
    saveProgress: "Đang lưu...",
    saveSuccessTitle: "Đã lưu Mối nguy",
    updateSuccessTitle: "Đã cập nhật Mối nguy",
    saveSuccessDescription: "Phiếu ghi mối nguy đã được lưu thành công.",
    updateSuccessDescription: "Phiếu ghi mối nguy đã được cập nhật thành công.",
    locationsSelected: (count: number) => `${count} vị trí được chọn`,
    unitsSelected: (count: number) => `${count} đơn vị được chọn`,
  },
  en: {
    formTitleCreate: "Create New Hazard Record",
    formTitleEdit: "Edit Hazard Record",
    formDescription: "Enter the detailed information for the hazard.",
    descriptionLabel: "Hazard Description",
    descriptionPlaceholder: "Describe the detected hazard in detail...",
    systemGroupLabel: "System",
    systemGroupPlaceholder: "Select system",
    locationLabel: "Location of Detection",
    locationPlaceholder: "Select location(s)",
    sourceLabel: "Source/Potential Cause",
    sourcePlaceholder: "Describe the source or potential cause of the hazard (e.g., from safety campaign, spot check...)",
    potentialConsequenceLabel: "Potential Consequence",
    potentialConsequencePlaceholder: "Describe the potential consequences if the hazard is not addressed...",
    identifiedByLabel: "Identified By (Person/Unit)",
    identifiedByPlaceholder: "e.g., Nguyen Van A (Patrol Team Leader)",
    identificationDateLabel: "Date of Detection",
    severityLabel: "Severity Level",
    severityPlaceholder: "Select severity level",
    likelihoodLabel: "Likelihood Level",
    likelihoodPlaceholder: "Select likelihood level",
    riskAssessmentInfo: "Risk Level will be calculated automatically after selecting Severity and Likelihood.",
    controlsAndActionsTitle: "Control Measures",
    currentControlsLabel: "Primary Measures",
    currentControlsPlaceholder: "Describe the primary, currently applied control measures...",
    proposedActionsLabel: "Secondary Measures",
    proposedActionsPlaceholder: "Describe secondary, supporting measures (if any)...",
    suggestedActionsLabel: "Proposed Measures (not yet implemented)",
    suggestedActionsPlaceholder: "Describe measures that are proposed for improvement or replacement...",
    responsiblePersonLeadLabel: "Lead Responsible Unit",
    responsiblePersonPlaceholder: "Select lead unit",
    coordinatingUnitsLabel: "Coordinating Units",
    coordinatingUnitsPlaceholder: "Select coordinating unit(s)",
    dueDateLabel: "Expected Completion Date",
    statusLabel: "Status",
    statusPlaceholder: "Select status",
    attachmentsLabel: "Images/Attachments",
    uploadButton: "Upload",
    noImages: "No images yet.",
    linkedDnfLabel: "Linked Defect Report (DNF) (If any)",
    linkedDnfPlaceholder: "Find and select linked DNF...",
    searchDnfPlaceholder: "Search DNF by ID or description...",
    noDnfLinked: "No linked DNF",
    noDnfsAvailable: "No DNFs available to select",
    closureDetailsLabel: "Closure/Completion Details (if any)",
    closureDetailsPlaceholder: "Describe hazard closure/completion details...",
    verificationDetailsLabel: "Verification Details (if any)",
    verificationDetailsPlaceholder: "Describe post-resolution verification details...",
    saveButton: "Save Hazard",
    updateButton: "Update Hazard",
    cancelButton: "Cancel",
    resetFormButton: "Reset Form",
    saveProgress: "Saving...",
    saveSuccessTitle: "Hazard Saved",
    updateSuccessTitle: "Hazard Updated",
    saveSuccessDescription: "The hazard record has been saved successfully.",
    updateSuccessDescription: "The hazard record has been updated successfully.",
    locationsSelected: (count: number) => `${count} selected`,
    unitsSelected: (count: number) => `${count} units selected`,
  }
};


export function HazardForm({ initialData, isEditMode = false, sourceReportId }: HazardFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user: currentUser } = useAuth();
  const { isOnline } = useNetwork();
  const t = translations[locale];

  const [dnfs, setDnfs] = React.useState<DnfDocument[]>([]);
  const [responsibleUnits, setResponsibleUnits] = React.useState<ResponsibleUnit[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);
  const [openDnfPopover, setOpenDnfPopover] = React.useState(false);
  const [dnfSearch, setDnfSearch] = React.useState("");


  React.useEffect(() => {
    const fetchDropdownData = async () => {
        const [dnfData, unitData, subsystemData, locationData] = await Promise.all([
          getDnfs(),
          getResponsibleUnits(),
          getSubsystems(),
          getLocations()
        ]);
        setDnfs(dnfData);
        setResponsibleUnits(unitData);
        setSubsystems(subsystemData);
        setLocations(locationData);
    };
    fetchDropdownData();
  }, []);
  
  const defaultIdentificationDate = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  const getInitialFormValues = React.useCallback((data?: Partial<HazardRecord>): HazardFormValues => {
    return {
      description: data?.description || "",
      systemGroup: data?.systemGroup || "",
      locationIds: data?.locationIds || [],
      source: data?.source || "",
      potentialConsequence: data?.potentialConsequence || "",
      identifiedBy: data?.identifiedBy || currentUser?.name || '',
      identificationDate: data?.identificationDate ? new Date(data.identificationDate).toISOString().split('T')[0] : defaultIdentificationDate,
      severityId: data?.severityId || undefined,
      likelihoodId: data?.likelihoodId || undefined,
      currentControls: data?.currentControls || "",
      proposedActions: data?.proposedActions || "",
      suggestedActions: data?.suggestedActions || "",
      responsiblePersonOrUnit: data?.responsiblePersonOrUnit || "",
      coordinatingUnits: data?.coordinatingUnits || [],
      dueDate: data?.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : undefined,
      status: data?.status || "Mới",
      attachments: data?.attachments?.map(img => ({...img, "data-ai-hint": img['data-ai-hint'] || img.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0,20) })) || [],
      linkedDnfId: data?.linkedDnfId || null,
      closureDetails: data?.closureDetails || "",
      verificationDetails: data?.verificationDetails || "",
    };
  }, [defaultIdentificationDate, currentUser?.name]);

  const form = useForm<HazardFormValues>({
    resolver: zodResolver(hazardFormSchema),
    defaultValues: getInitialFormValues(initialData),
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset(getInitialFormValues(initialData));
    }
  }, [initialData, form, getInitialFormValues]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
       const reader = new FileReader();
      reader.onloadend = () => {
        const hint = file.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0, 20);
        const newImage: ImageAttachment = {
          id: `img-haz-${Date.now()}`,
          url: reader.result as string,
          name: file.name,
          "data-ai-hint": hint
        };
        const currentImages = form.getValues("attachments") || [];
        form.setValue("attachments", [...currentImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageId: string) => {
    const currentImages = form.getValues("attachments") || [];
    form.setValue("attachments", currentImages.filter(img => img.id !== imageId));
  };

  const handleResetForm = () => {
    form.reset(getInitialFormValues(initialData));
    toast({
        title: locale === 'vi' ? "Đã đặt lại biểu mẫu" : "Form Reset",
        description: locale === 'vi' ? "Các trường đã được hoàn tác về giá trị ban đầu." : "Fields have been reverted to their original values.",
    });
  };

  const onSubmit = async (data: HazardFormValues) => {
    const hazardRecordData: Omit<HazardRecord, 'id' | 'createdAt' | 'updatedAt' | 'riskLevelId' | 'createdById'> = {
        ...data,
        locationIds: data.locationIds,
        coordinatingUnits: data.coordinatingUnits,
        linkedDnfId: data.linkedDnfId,
        identificationDate: new Date(data.identificationDate).toISOString(),
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        status: data.status,
    };

    if (isEditMode && initialData?.id) {
        const fullUpdatedRecord: HazardRecord = {
            ...initialData,
            ...hazardRecordData,
            id: initialData.id,
            createdAt: initialData.createdAt as string,
            createdById: initialData.createdById || currentUser?.id || 'system',
            updatedAt: new Date().toISOString(),
        };
        await updateHazardRecord(fullUpdatedRecord);
        toast({
            title: t.updateSuccessTitle,
            description: t.updateSuccessDescription,
        });
        router.push(`/hazards/${initialData.id}`);
    } else {
        if (!isOnline) {
            await offlineSync.addAction({
                type: 'HAZARD_CREATE',
                entityType: 'HAZARD',
                data: hazardRecordData,
            });
            toast({
                title: locale === 'vi' ? "Đã lưu Ngoại tuyến" : "Saved Offline",
                description: locale === 'vi' ? "Dữ liệu sẽ được tự động đồng bộ khi có mạng." : "Data will be synced automatically when online.",
            });
            router.push("/hazards");
            return;
        }

        const savedHazard = await addHazardRecord({...hazardRecordData, status: 'Mới'});

        toast({
            title: t.saveSuccessTitle,
            description: t.saveSuccessDescription,
        });
        router.push(`/hazards/${savedHazard.id}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEditMode ? t.formTitleEdit : t.formTitleCreate}</CardTitle>
            <CardDescription>{t.formDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.descriptionLabel}</FormLabel>
                    <div className="flex items-center gap-2">
                        <VoiceInput 
                            onResult={(text) => {
                                const current = field.value || '';
                                field.onChange(current ? current + ' ' + text : text);
                            }} 
                        />
                        <AiAssistButton 
                            context="hazard_description" 
                            promptText={`Viết một mô tả ngắn gọn và chuyên môn về mối nguy hiểm sau: ${field.value || 'Chưa rõ'}`} 
                            onResult={(res) => field.onChange(res)} 
                            buttonText="Làm rõ mô tả"
                            tooltipText="Sử dụng AI phân tích và viết lại mô tả mối nguy hiểm rõ ràng hơn"
                        />
                    </div>
                  </div>
                  <FormControl><Textarea placeholder={t.descriptionPlaceholder} {...field} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6 items-start">
                 <FormField
                    control={form.control}
                    name="systemGroup"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.systemGroupLabel}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t.systemGroupPlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {subsystems.map(sub => (
                                    <SelectItem key={sub.id} value={sub.id}>{sub.label[locale]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="locationIds"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{t.locationLabel}</FormLabel>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <FormControl>
                                <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                    <span className="truncate pr-2">
                                        {field.value && field.value.length > 0
                                            ? field.value.map(id => locations.find(l => l.id === id)?.label || id).join(', ')
                                            : t.locationPlaceholder
                                        }
                                    </span>
                                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                </FormControl>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                                {locations.map((location) => (
                                <DropdownMenuCheckboxItem
                                    key={location.id}
                                    checked={field.value?.includes(location.id)}
                                    onCheckedChange={(checked) => {
                                        const selected = field.value || [];
                                        return checked
                                            ? field.onChange([...selected, location.id])
                                            : field.onChange(selected.filter((value) => value !== location.id))
                                    }}
                                >
                                    {location.label}
                                </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="identificationDate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.identificationDateLabel}</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="identifiedBy"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.identifiedByLabel}</FormLabel>
                        <FormControl><Input placeholder={t.identifiedByPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <div className="grid md:grid-cols-2 gap-6 items-start">
                <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.sourceLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.sourcePlaceholder} {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="potentialConsequence"
                    render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>{t.potentialConsequenceLabel}</FormLabel>
                            <AiAssistButton 
                                context="hazard_consequence" 
                                promptText={`Dựa vào mô tả mối nguy hiểm: "${form.getValues('description') || 'Chưa rõ'}", hãy dự đoán các hậu quả tiềm ẩn và mức độ nghiêm trọng có thể xảy ra. Viết dạng gạch đầu dòng ngắn gọn.`} 
                                onResult={(res) => field.onChange(res)} 
                                buttonText="Gợi ý hậu quả"
                                tooltipText="Sử dụng AI dự đoán hậu quả tiềm ẩn dựa trên mô tả mối nguy hiểm"
                            />
                        </div>
                        <FormControl><Textarea placeholder={t.potentialConsequencePlaceholder} {...field} rows={4} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Đánh giá Rủi ro</CardTitle>
                <CardDescription>{t.riskAssessmentInfo}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="severityId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.severityLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t.severityPlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {HAZARD_SEVERITY_LEVELS.map(level => (
                                <SelectItem key={level.id} value={level.id}>{level.label[locale]} ({level.id})</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="likelihoodId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.likelihoodLabel}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t.likelihoodPlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {HAZARD_LIKELIHOOD_LEVELS.map(level => (
                                <SelectItem key={level.id} value={level.id}>{level.label[locale]} ({level.id})</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t.controlsAndActionsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="currentControls"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.currentControlsLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.currentControlsPlaceholder} {...field} rows={4} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="proposedActions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.proposedActionsLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.proposedActionsPlaceholder} {...field} rows={4} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="suggestedActions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.suggestedActionsLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.suggestedActionsPlaceholder} {...field} rows={4} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <div className="grid md:grid-cols-2 gap-6 items-start">
                    <FormField
                        control={form.control}
                        name="responsiblePersonOrUnit"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.responsiblePersonLeadLabel}</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl><SelectTrigger><SelectValue placeholder={t.responsiblePersonPlaceholder} /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {responsibleUnits.map(unit => (
                                        <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="coordinatingUnits"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>{t.coordinatingUnitsLabel}</FormLabel>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                            <span className="truncate pr-2">
                                                {field.value && field.value.length > 0
                                                    ? field.value.join(', ')
                                                    : t.coordinatingUnitsPlaceholder
                                                }
                                            </span>
                                            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                                    {responsibleUnits.map(unit => (
                                        <DropdownMenuCheckboxItem
                                            key={unit.id}
                                            checked={field.value?.includes(unit.name)}
                                            onCheckedChange={(checked) => {
                                                const selected = field.value || [];
                                                return checked
                                                    ? field.onChange([...selected, unit.name])
                                                    : field.onChange(selected.filter(value => value !== unit.name))
                                            }}
                                        >
                                            {unit.name}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.dueDateLabel}</FormLabel>
                            <FormControl><Input type="date" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.statusLabel}</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
                                disabled={!isEditMode}
                            >
                                <FormControl><SelectTrigger><SelectValue placeholder={t.statusPlaceholder} /></SelectTrigger></FormControl>
                                <SelectContent>
                                {HAZARD_STATUSES.map(status => {
                                    const currentStatus = initialData?.status || 'Mới';
                                    const transitionRule = HAZARD_STATUS_TRANSITIONS[currentStatus as HazardStatus];
                                    const canTransition = currentUser?.role === ROLE_ADMIN_PKTAT || status === currentStatus || transitionRule.next.includes(status as HazardStatus);
                                    return (
                                    <SelectItem 
                                        key={status} 
                                        value={status} 
                                        disabled={isEditMode && !canTransition}
                                    >
                                        {status}
                                    </SelectItem>
                                    );
                                })}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                    control={form.control}
                    name="linkedDnfId"
                    render={({ field }) => {
                        const selectedDnf = dnfs.find((dnf) => dnf.id === field.value);
                        return (
                            <FormItem className="flex flex-col">
                                <FormLabel>{t.linkedDnfLabel}</FormLabel>
                                <Popover open={openDnfPopover} onOpenChange={setOpenDnfPopover}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                                            >
                                                {selectedDnf
                                                    ? `${selectedDnf.id} - ${selectedDnf.descriptionOfFailure.substring(0, 40)}...`
                                                    : t.linkedDnfPlaceholder
                                                }
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <div className="p-2 border-b">
                                            <Input
                                                placeholder={t.searchDnfPlaceholder}
                                                value={dnfSearch}
                                                onChange={(e) => setDnfSearch(e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <ScrollArea className="h-72">
                                            <div className="p-1">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start"
                                                    onClick={() => {
                                                        field.onChange(null);
                                                        setOpenDnfPopover(false);
                                                    }}
                                                >
                                                    {t.noDnfLinked}
                                                </Button>
                                                {dnfs.filter(dnf =>
                                                    dnf.id.toLowerCase().includes(dnfSearch.toLowerCase()) ||
                                                    dnf.descriptionOfFailure.toLowerCase().includes(dnfSearch.toLowerCase())
                                                ).map((dnf) => (
                                                    <Button
                                                        variant="ghost"
                                                        key={dnf.id}
                                                        className="w-full justify-start h-auto py-2 text-left flex flex-col items-start"
                                                        onClick={() => {
                                                            field.onChange(dnf.id);
                                                            setOpenDnfPopover(false);
                                                        }}
                                                    >
                                                        <span className="font-mono text-xs">{dnf.id}</span>
                                                        <span className="text-xs text-muted-foreground whitespace-normal">{dnf.descriptionOfFailure}</span>
                                                    </Button>
                                                ))}
                                                {dnfs.length === 0 && (
                                                    <p className="p-4 text-sm text-muted-foreground text-center">{t.noDnfsAvailable}</p>
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                 />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Thông tin Bổ sung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormItem>
                    <FormLabel>{t.attachmentsLabel}</FormLabel>
                    <FormControl>
                        <div className="flex items-center gap-2">
                        <label htmlFor="image-upload-hazard" className="cursor-pointer">
                            <Button type="button" variant="outline" asChild>
                            <span><UploadCloud className="mr-2 h-4 w-4" /> {t.uploadButton}</span>
                            </Button>
                            <input
                            id="image-upload-hazard"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            multiple
                            onChange={handleImageUpload}
                            />
                        </label>
                        </div>
                    </FormControl>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {form.watch("attachments")?.map(image => (
                        <div key={image.id} className="relative group aspect-video border rounded-md">
                            <Image
                                src={image.url}
                                alt={image.name}
                                fill
                                objectFit="cover"
                                className="rounded-md"
                                data-ai-hint={image['data-ai-hint'] || 'hazard attachment'}
                            />
                            <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={() => removeImage(image.id)}
                            >
                            <XCircle className="h-4 w-4" />
                            </Button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {image.name}
                            </div>
                        </div>
                        ))}
                    </div>
                    {form.watch("attachments") && form.watch("attachments")!.length > 0 && (
                        <div className="mt-6 space-y-4">
                            {/* NEW: OPEN MODEL AI VISION */}
                            <AiHazardVision 
                                imageUrl={form.watch("attachments")![0].url}
                                onAnalysisComplete={(result: any) => {
                                    // Structured auto-fill from Open Model (e.g. Llama-3.2 Vision)
                                    if (result.description) form.setValue("description", result.description);
                                    if (result.cause) form.setValue("source", result.cause);
                                    if (result.consequence) form.setValue("potentialConsequence", result.consequence);
                                    if (result.severityId) form.setValue("severityId", result.severityId);
                                    if (result.likelihoodId) form.setValue("likelihoodId", result.likelihoodId);
                                    if (result.suggestedActions) form.setValue("suggestedActions", result.suggestedActions);
                                }}
                            />

                            {/* EXISTING: YOLOv8 PPE AUDIT */}
                            <AiVisionAudit 
                                imageUrl={form.watch("attachments")![0].url} 
                                onAuditComplete={(result) => {
                                    const currentDesc = form.getValues("description");
                                    if (!currentDesc || currentDesc === "") {
                                        form.setValue("description", `Phát hiện tự động: ${result.summary}`);
                                    }
                                    
                                    const currentConsequence = form.getValues("potentialConsequence");
                                    if (!currentConsequence || currentConsequence === "") {
                                        form.setValue("potentialConsequence", result.forecast);
                                    }

                                    if (result.summary.toLowerCase().includes('helmet') || result.summary.toLowerCase().includes('vest')) {
                                        form.setValue("severityId", "I"); 
                                        form.setValue("likelihoodId", "B"); 
                                    }
                                }}
                            />
                        </div>
                    )}
                    {form.watch("attachments")?.length === 0 && <p className="text-sm text-muted-foreground mt-2">{t.noImages}</p>}
                    <FormMessage />
                </FormItem>
                {isEditMode && (
                  <>
                    <FormField
                        control={form.control}
                        name="closureDetails"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.closureDetailsLabel}</FormLabel>
                            <FormControl><Textarea placeholder={t.closureDetailsPlaceholder} {...field} rows={2} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="verificationDetails"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t.verificationDetailsLabel}</FormLabel>
                            <FormControl><Textarea placeholder={t.verificationDetailsPlaceholder} {...field} rows={2} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </>
                )}
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t.cancelButton}</Button>
          <Button type="button" variant="outline" onClick={handleResetForm}><RefreshCcw className="mr-2 h-4 w-4" />{t.resetFormButton}</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t.saveProgress : (isEditMode ? t.updateButton : t.saveButton)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
