

"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { AiAssistButton } from "@/components/ai/ai-assist-button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, XCircle, RefreshCcw, ChevronsUpDown, QrCode } from "lucide-react";
import {
    DNF_STATUSES,
    type DnfStatus,
    DNF_METHODS_OF_DETECTION,
    DNF_HAZARD_LEVELS,
    type DnfDocument,
    type ImageAttachment,
    type User,
    type Subsystem,
    type ResponsibleUnit,
    type PatrolLocation
} from "@/lib/constants";
import { addDnf, updateMockDnf } from "@/lib/actions/dnf.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { getSubsystems, getResponsibleUnits, getLocations } from "@/lib/actions/category.actions";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BarcodeScannerDialog } from "@/components/common/barcode-scanner-dialog";
import { useAuth } from "@/contexts/auth-context";

const NO_HAZARD_LEVEL_VALUE = "__NO_HAZARD_LEVEL__";
const NO_LINKED_DNF_VALUE = "__NO_LINKED_DNF__";

const imageAttachmentSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  "data-ai-hint": z.string().optional(),
});

const createDnfFormSchema = (t: any) => z.object({
  failureReportNo: z.string().optional(),
  locationOfFailureIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một vị trí."),
  failedComponentEquipmentLRUTrainNumber: z.string().optional(),
  subsystemIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một Hệ thống."),
  descriptionOfFailure: z.string().min(1, "Mô tả khiếm khuyết không được để trống."),
  impactAssessment: z.string().optional(),
  staffWhoIdentifiedFailure: z.string().min(1, "Người phát hiện không được để trống."),
  dateTimeOfFailureOccurrence: z.string().min(1, "Ngày giờ phát hiện không được để trống."),
  methodOfFailureDetection: z.string().min(1, "Phương pháp phát hiện không được để trống."),
  hazardLevelId: z.string().optional(),
  status: z.enum(DNF_STATUSES as [DnfStatus, ...DnfStatus[]]),
  attachments: z.array(imageAttachmentSchema).optional(),
  originatingInspectionId: z.string().optional(),
  originatingFindingId: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["Cao", "Trung bình", "Thấp"]).optional(),
  
  // New fields from form
  immediateAction: z.string().optional(),
  problemResettable: z.boolean().optional(),
  trainServiceAffected: z.boolean().optional(),
  trainWithdrawn: z.boolean().optional(),
  systemRestoredTime: z.string().optional(),
  disruptionDuration: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
  trainKm: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
  rectificationParty: z.string().optional(),
});


type DnfFormValues = z.infer<ReturnType<typeof createDnfFormSchema>>;

interface DnfFormProps {
  initialData?: Partial<DnfDocument>;
  isEditMode?: boolean;
}

export function DnfForm({ initialData, isEditMode = false }: DnfFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user: currentUser } = useAuth();
  const t = locale === 'vi' ? {
    // VI
    formTitleCreate: "Tạo Báo cáo sự cố (DNF)",
    formTitleEdit: "Chỉnh sửa Báo cáo sự cố (DNF)",
    formDescription: "Nhập thông tin chi tiết cho Báo cáo sự cố (DNF).",
    failureReportNoLabel: "Số Báo cáo Khiếm khuyết (Tham chiếu HTC)",
    failureReportNoPlaceholder: "VD: HTC-REF-001",
    locationOfFailureLabel: "Vị trí Khiếm khuyết",
    locationOfFailurePlaceholder: "Chọn (các) vị trí",
    failedComponentLabel: "Thiết bị/LRU/Số Tàu bị lỗi",
    failedComponentPlaceholder: "VD: ID 06 / Train 02 - Motor Unit A3",
    scanQrCode: "Quét mã",
    subsystemLabel: "Hệ thống",
    subsystemPlaceholder: "Chọn (các) hệ thống",
    descriptionOfFailureLabel: "Mô tả Khiếm khuyết",
    descriptionOfFailurePlaceholder: "Mô tả chi tiết khiếm khuyết đã phát hiện...",
    impactAssessmentLabel: "Đánh giá ảnh hưởng",
    impactAssessmentPlaceholder: "Mô tả các ảnh hưởng tiềm tàng về an toàn, vận hành, kinh tế...",
    staffWhoIdentifiedFailureLabel: "Nhân viên phát hiện Khiếm khuyết",
    staffWhoIdentifiedFailurePlaceholder: "VD: Nguyễn Văn A (Đội trưởng)",
    dateTimeOfFailureOccurrenceLabel: "Ngày & Giờ xảy ra Khiếm khuyết",
    methodOfFailureDetectionLabel: "Phương pháp phát hiện Khiếm khuyết",
    methodOfFailureDetectionPlaceholder: "Chọn phương pháp",
    hazardLevelLabel: "Mức độ Mối nguy",
    hazardLevelPlaceholder: "Chọn mức độ mối nguy",
    noHazardLevelSelected: "Không chọn",
    statusLabel: "Trạng thái",
    statusPlaceholder: "Chọn trạng thái",
    statusUpdateNote: "Trạng thái được quản lý trên trang chi tiết DNF để đảm bảo đúng quy trình.",
    attachmentsLabel: "Hình ảnh/Tài liệu đính kèm",
    uploadButton: "Tải lên",
    cancelButton: "Hủy",
    resetFormButton: "Đặt lại Form",
    saveButton: "Lưu DNF",
    updateButton: "Cập nhật DNF",
    saveProgress: "Đang lưu...",
    saveSuccessTitle: "Đã lưu DNF",
    updateSuccessTitle: "Đã cập nhật DNF",
    saveSuccessDescription: "Báo cáo sự cố đã được lưu thành công.",
    updateSuccessDescription: "Báo cáo sự cố đã được cập nhật thành công.",
    noImages: "Chưa có hình ảnh nào.",
    assignmentAndPriorityTitle: "Phân loại & Phân công",
    assignmentAndPriorityDesc: "Phân loại sự cố và giao cho người hoặc nhóm chịu trách nhiệm.",
    assignedToLabel: "Giao cho",
    assignedToPlaceholder: "Chọn người hoặc nhóm xử lý",
    priorityLabel: "Ưu tiên",
    priorityPlaceholder: "Chọn mức độ ưu tiên",
    priorityHigh: "Cao",
    priorityMedium: "Trung bình",
    priorityLow: "Thấp",
    usersGroup: "Cá nhân",
    unitsGroup: "Đơn vị",
    systemsSelected: (count: number) => `${count} hệ thống được chọn`,
    locationsSelected: (count: number) => `${count} vị trí được chọn`,
    serviceImpactTitle: "Thông tin Vận hành Tàu",
    immediateActionLabel: "Hành động tức thời",
    immediateActionPlaceholder: "Mô tả hành động đã thực hiện ngay khi phát hiện...",
    problemResettableLabel: "Sự cố có thể Reset?",
    trainServiceAffectedLabel: "Dịch vụ Tàu bị ảnh hưởng?",
    trainWithdrawnLabel: "Tàu phải rút khỏi dịch vụ?",
    systemRestoredTimeLabel: "Thời gian khôi phục hệ thống/chức năng",
    disruptionDurationLabel: "Thời gian gián đoạn dịch vụ (phút)",
    trainKmLabel: "Số Km của Tàu",
    correctiveActionInfoTitle: "Thông tin Khắc phục Sự cố",
    rectificationPartyLabel: "Bên chịu trách nhiệm khắc phục",
    rectificationPartyPlaceholder: "Chọn bên khắc phục",
  } : {
    // EN
    formTitleCreate: "Create Defect Report (DNF)",
    formTitleEdit: "Edit Defect Report (DNF)",
    formDescription: "Enter the details for this Defect Report (DNF).",
    failureReportNoLabel: "Failure Report No (HTC Reference)",
    failureReportNoPlaceholder: "e.g., HTC-REF-001",
    locationOfFailureLabel: "Location of Failure",
    locationOfFailurePlaceholder: "Select location(s)",
    failedComponentLabel: "Failed Component/LRU/Train Number",
    failedComponentPlaceholder: "e.g., ID 06 / Train 02 - Motor Unit A3",
    scanQrCode: "Scan Code",
    subsystemLabel: "System",
    subsystemPlaceholder: "Select system(s)",
    descriptionOfFailureLabel: "Description of Failure",
    descriptionOfFailurePlaceholder: "Describe the defect found in detail...",
    impactAssessmentLabel: "Impact Assessment",
    impactAssessmentPlaceholder: "Describe potential impacts on safety, operations, finances...",
    staffWhoIdentifiedFailureLabel: "Staff who Identified Failure",
    staffWhoIdentifiedFailurePlaceholder: "e.g., John Doe (Team Leader)",
    dateTimeOfFailureOccurrenceLabel: "Date & Time of Failure Occurrence",
    methodOfFailureDetectionLabel: "Method of Failure Detection",
    methodOfFailureDetectionPlaceholder: "Select method",
    hazardLevelLabel: "Hazard Level",
    hazardLevelPlaceholder: "Select hazard level",
    noHazardLevelSelected: "None",
    statusLabel: "Status",
    statusPlaceholder: "Select status",
    statusUpdateNote: "Status is managed on the DNF detail page to ensure proper workflow.",
    attachmentsLabel: "Images/Attachments",
    uploadButton: "Upload",
    cancelButton: "Cancel",
    resetFormButton: "Reset Form",
    saveButton: "Save DNF",
    updateButton: "Update DNF",
    saveProgress: "Saving...",
    saveSuccessTitle: "DNF Saved",
    updateSuccessTitle: "DNF Updated",
    saveSuccessDescription: "The defect report has been saved successfully.",
    updateSuccessDescription: "The defect report has been updated successfully.",
    noImages: "No images yet.",
    assignmentAndPriorityTitle: "Classification & Assignment",
    assignmentAndPriorityDesc: "Classify the incident and assign it to the responsible person or group.",
    assignedToLabel: "Assigned To",
    assignedToPlaceholder: "Select assignee",
    priorityLabel: "Priority",
    priorityPlaceholder: "Select priority",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    usersGroup: "Users",
    unitsGroup: "Units",
    systemsSelected: (count: number) => `${count} selected`,
    locationsSelected: (count: number) => `${count} selected`,
    serviceImpactTitle: "Train Service Information",
    immediateActionLabel: "Immediate Action Taken",
    immediateActionPlaceholder: "Describe action taken upon detection...",
    problemResettableLabel: "Problem Resettable?",
    trainServiceAffectedLabel: "Train Service Affected?",
    trainWithdrawnLabel: "Train Withdrawn from Service?",
    systemRestoredTimeLabel: "Time when system/function is restored",
    disruptionDurationLabel: "Duration of train service disruption (minutes)",
    trainKmLabel: "Train Km",
    correctiveActionInfoTitle: "Corrective Action Information",
    rectificationPartyLabel: "Party Responsible for Rectification",
    rectificationPartyPlaceholder: "Select rectification party",
  };

  const [users, setUsers] = React.useState<User[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [responsibleUnits, setResponsibleUnits] = React.useState<ResponsibleUnit[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);

  React.useEffect(() => {
    const fetchDropdownData = async () => {
        const [userList, subsystemList, unitList, locationList] = await Promise.all([
          getUsers(),
          getSubsystems(),
          getResponsibleUnits(),
          getLocations()
        ]);
        setUsers(userList);
        setSubsystems(subsystemList);
        setResponsibleUnits(unitList);
        setLocations(locationList);
    };
    fetchDropdownData();
  }, []);
  
  const dnfFormSchema = createDnfFormSchema(t);

  const defaultDateTimeForForm = React.useMemo(() => {
    const dt = new Date();
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    return dt.toISOString().substring(0, 16);
  }, []);

  const getInitialFormValues = React.useCallback((data?: Partial<DnfDocument>): DnfFormValues => {
    return {
      failureReportNo: data?.failureReportNo || "",
      locationOfFailureIds: data?.locationOfFailure?.split(',') || [],
      failedComponentEquipmentLRUTrainNumber: data?.failedComponentEquipmentLRUTrainNumber || "",
      subsystemIds: data?.subsystemIds || [],
      descriptionOfFailure: data?.descriptionOfFailure || "",
      impactAssessment: data?.impactAssessment || "",
      staffWhoIdentifiedFailure: data?.staffWhoIdentifiedFailure || currentUser?.name || '',
      dateTimeOfFailureOccurrence: data?.dateTimeOfFailureOccurrence ? new Date(data.dateTimeOfFailureOccurrence).toISOString().substring(0, 16) : defaultDateTimeForForm,
      methodOfFailureDetection: data?.methodOfFailureDetection || "",
      hazardLevelId: data?.hazardLevelId || undefined,
      status: data?.status || "Mới",
      attachments: data?.attachments?.map(img => ({...img, "data-ai-hint": img['data-ai-hint'] || img.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0,20) })) || [],
      originatingInspectionId: data?.originatingInspectionId || '',
      originatingFindingId: data?.originatingFindingId || '',
      assignedTo: data?.assignedTo,
      priority: data?.priority,
      immediateAction: data?.immediateAction || "",
      problemResettable: data?.problemResettable,
      trainServiceAffected: data?.trainServiceAffected,
      trainWithdrawn: data?.trainWithdrawn,
      systemRestoredTime: data?.systemRestoredTime ? new Date(data.systemRestoredTime).toISOString().substring(0, 16) : "",
      disruptionDuration: data?.disruptionDuration,
      trainKm: data?.trainKm,
      rectificationParty: data?.rectificationParty,
    };
  }, [defaultDateTimeForForm]);


  const form = useForm<DnfFormValues>({
    resolver: zodResolver(dnfFormSchema),
    defaultValues: getInitialFormValues(initialData),
  });
  
  React.useEffect(() => {
      form.reset(getInitialFormValues(initialData));
  }, [initialData, form, getInitialFormValues]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const hint = file.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0, 20);
        const newImage: ImageAttachment = {
          id: `img-${Date.now()}`,
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

  const onSubmit = async (data: DnfFormValues) => {
    const finalLocation = data.locationOfFailureIds.join(',');

    const { locationOfFailureIds, ...restOfData } = data;

    const baseRecord = {
        ...restOfData,
        locationOfFailure: finalLocation,
        dateTimeOfFailureOccurrence: new Date(data.dateTimeOfFailureOccurrence).toISOString(),
        systemRestoredTime: data.systemRestoredTime ? new Date(data.systemRestoredTime).toISOString() : undefined,
        attachments: data.attachments || [],
        hazardLevelId: data.hazardLevelId as 'high' | 'medium' | 'low' | undefined, 
        priority: data.priority,
    };

    if (isEditMode && initialData?.id) {
        const dnfRecord: DnfDocument = {
            ...(initialData as DnfDocument),
            ...baseRecord,
            id: initialData.id,
            statusHistory: initialData.statusHistory || [],
            createdAt: initialData.createdAt || new Date().toISOString(),
            createdById: initialData.createdById || currentUser?.id || 'system',
            updatedAt: new Date().toISOString(),
        };
        await updateMockDnf(dnfRecord);
        toast({
            title: t.updateSuccessTitle,
            description: t.updateSuccessDescription,
        });
        router.push(`/dnf/${initialData.id}`);
    } else {
        const dnfRecord: Omit<DnfDocument, 'id'|'createdAt'|'updatedAt'|'createdById'|'statusHistory'|'isArchived'|'correctiveActions'> = {
            ...baseRecord,
            originatingInspectionId: data.originatingInspectionId || undefined,
            originatingFindingId: data.originatingFindingId || undefined,
        };
        await addDnf(dnfRecord); 
        toast({
            title: t.saveSuccessTitle,
            description: t.saveSuccessDescription,
        });
        router.push("/dnf?refresh=true");
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
              name="failureReportNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.failureReportNoLabel}</FormLabel>
                  <FormControl><Input placeholder={t.failureReportNoPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="locationOfFailureIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t.locationOfFailureLabel}</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                            <span className="truncate pr-2">
                                {field.value && field.value.length > 0
                                    ? field.value.map(id => locations.find(l => l.id === id)?.label || id).join(', ')
                                    : t.locationOfFailurePlaceholder
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
                                : field.onChange(selected.filter((value) => value !== location.id));
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
              <FormField
                control={form.control}
                name="failedComponentEquipmentLRUTrainNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.failedComponentLabel}</FormLabel>
                     <div className="flex items-center gap-2">
                        <FormControl><Input placeholder={t.failedComponentPlaceholder} {...field} /></FormControl>
                        <BarcodeScannerDialog onScan={(value) => form.setValue('failedComponentEquipmentLRUTrainNumber', value, { shouldValidate: true })} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subsystemIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t.subsystemLabel}</FormLabel>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <FormControl>
                              <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                  <span className="truncate pr-2">
                                    {field.value && field.value.length > 0
                                        ? field.value.map(id => subsystems.find(s => s.id === id)?.label[locale] || id).join(', ')
                                        : t.subsystemPlaceholder
                                    }
                                </span>
                                   <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                          </FormControl>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                          {subsystems.map((sub) => (
                              <DropdownMenuCheckboxItem
                                  key={sub.id}
                                  checked={field.value?.includes(sub.id)}
                                  onCheckedChange={(checked) => {
                                      const selected = field.value || [];
                                      return checked
                                          ? field.onChange([...selected, sub.id])
                                          : field.onChange(selected.filter((value) => value !== sub.id));
                                  }}
                              >
                                  {sub.label[locale]}
                              </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionOfFailure"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.descriptionOfFailureLabel}</FormLabel>
                    <AiAssistButton 
                        context="dnf_description" 
                        promptText={`Dựa vào thông tin thiết bị: ${form.getValues('failedComponentEquipmentLRUTrainNumber') || 'Không rõ'}, hãy viết một mô tả khiếm khuyết chi tiết. Vui lòng chỉ trả về nội dung.`} 
                        onResult={(res) => field.onChange(res)} 
                        tooltipText="AI sẽ viết mô tả chi tiết dựa trên mã thiết bị (nếu có)"
                    />
                  </div>
                  <FormControl><Textarea placeholder={t.descriptionOfFailurePlaceholder} {...field} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="impactAssessment"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.impactAssessmentLabel}</FormLabel>
                    <AiAssistButton 
                        context="dnf_impact" 
                        promptText={`Dựa vào mô tả khiếm khuyết: "${form.getValues('descriptionOfFailure') || 'Chưa rõ'}", hãy đánh giá mức độ ảnh hưởng của nó và đưa ra đề xuất. Vui lòng trả lời ngắn gọn.`} 
                        onResult={(res) => field.onChange(res)} 
                        buttonText="Phân tích ảnh hưởng"
                        tooltipText="Sử dụng AI phân tích ảnh hưởng dựa trên mô tả khiếm khuyết"
                    />
                  </div>
                  <FormControl><Textarea placeholder={t.impactAssessmentPlaceholder} {...field} value={field.value ?? ""} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="staffWhoIdentifiedFailure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.staffWhoIdentifiedFailureLabel}</FormLabel>
                    <FormControl><Input placeholder={t.staffWhoIdentifiedFailurePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateTimeOfFailureOccurrence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.dateTimeOfFailureOccurrenceLabel}</FormLabel>
                    <FormControl><Input type="datetime-local" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="methodOfFailureDetection"
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>{t.methodOfFailureDetectionLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t.methodOfFailureDetectionPlaceholder} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {DNF_METHODS_OF_DETECTION.map(method => (
                            <SelectItem key={method.id} value={method.id}>{method.label[locale]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hazardLevelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.hazardLevelLabel}</FormLabel>
                    <Select 
                        onValueChange={(value) => field.onChange(value === NO_HAZARD_LEVEL_VALUE ? undefined : value)} 
                        value={field.value || NO_HAZARD_LEVEL_VALUE}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder={t.hazardLevelPlaceholder} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value={NO_HAZARD_LEVEL_VALUE}>{t.noHazardLevelSelected}</SelectItem>
                        {DNF_HAZARD_LEVELS.map(level => (
                          <SelectItem key={level.id} value={level.id}>
                            <div className="flex items-center gap-2">
                              <level.icon className="h-4 w-4" />
                              {level.label[locale]}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.statusLabel}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isEditMode}>
                    <FormControl><SelectTrigger><SelectValue placeholder={t.statusPlaceholder} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {DNF_STATUSES.map(status => (
                        <SelectItem key={status} value={status} disabled={isEditMode && status !== initialData?.status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   {isEditMode && <FormDescription>{t.statusUpdateNote}</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>{t.attachmentsLabel}</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-2">
                    <label htmlFor="image-upload-dnf" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                        <span><UploadCloud className="mr-2 h-4 w-4" /> {t.uploadButton}</span>
                        </Button>
                        <input
                        id="image-upload-dnf"
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
                            data-ai-hint={image['data-ai-hint'] || 'dnf attachment'}
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
                {form.watch("attachments")?.length === 0 && <p className="text-sm text-muted-foreground mt-2">{t.noImages}</p>}
                <FormMessage />
            </FormItem>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
              <CardTitle>{t.serviceImpactTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                    control={form.control}
                    name="immediateAction"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.immediateActionLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.immediateActionPlaceholder} {...field} value={field.value ?? ""} rows={2} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="problemResettable" render={({ field }) => (
                         <FormItem className="flex items-center gap-2 pt-6"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>{t.problemResettableLabel}</FormLabel><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="trainServiceAffected" render={({ field }) => (
                         <FormItem className="flex items-center gap-2 pt-6"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>{t.trainServiceAffectedLabel}</FormLabel><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="trainWithdrawn" render={({ field }) => (
                         <FormItem className="flex items-center gap-2 pt-6"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>{t.trainWithdrawnLabel}</FormLabel><FormMessage /></FormItem>
                    )}/>
                 </div>
                 <div className="grid md:grid-cols-3 gap-6">
                    <FormField control={form.control} name="systemRestoredTime" render={({ field }) => (
                        <FormItem><FormLabel>{t.systemRestoredTimeLabel}</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="disruptionDuration" render={({ field }) => (
                        <FormItem><FormLabel>{t.disruptionDurationLabel}</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="trainKm" render={({ field }) => (
                        <FormItem><FormLabel>{t.trainKmLabel}</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                    )}/>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle>{t.assignmentAndPriorityTitle}</CardTitle>
              <CardDescription>{t.assignmentAndPriorityDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.assignedToLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t.assignedToPlaceholder} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t.usersGroup}</SelectLabel>
                            {users.filter(u => u.status === 'active').map(user => (
                              <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                            ))}
                          </SelectGroup>
                           <SelectGroup>
                            <SelectLabel>{t.unitsGroup}</SelectLabel>
                            {responsibleUnits.map(unit => (
                              <SelectItem key={unit.id} value={unit.name}>{unit.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.priorityLabel}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t.priorityPlaceholder} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Cao">{t.priorityHigh}</SelectItem>
                          <SelectItem value="Trung bình">{t.priorityMedium}</SelectItem>
                          <SelectItem value="Thấp">{t.priorityLow}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t.cancelButton}</Button>
          <Button type="button" variant="outline" onClick={handleResetForm}>
             <RefreshCcw className="mr-2 h-4 w-4" /> {t.resetFormButton}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t.saveProgress : (isEditMode ? t.updateButton : t.saveButton)}
          </Button>
        </div>
      </form>
    </Form>
  );
}

