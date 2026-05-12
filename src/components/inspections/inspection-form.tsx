

"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { UploadCloud, XCircle, PlusCircle, Trash2, RefreshCcw, FilePlus, Wrench, MapPin, ChevronsUpDown } from "lucide-react";
import {
  SEVERITY_LEVELS,
  FINDING_TYPES,
  type MaintenanceStandard,
  type MaintenanceStandardItem,
  type InspectionDetail,
  type ImageAttachment,
  type PatrolLocation,
  type GeoLocation,
} from "@/lib/constants";
import { updateInspection, addInspection } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandards, getMaintenanceStandardItems } from "@/lib/actions/maintenance.actions";
import { getLocations } from "@/lib/actions/category.actions";
import { useLanguage } from "@/contexts/language-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useNetwork } from "@/components/providers/network-provider";
import { offlineSync } from "@/lib/services/offline-sync";

const NO_TEMPLATE_VALUE = "---no-template---";

const geoLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
}).optional();

const findingSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Mô tả phát hiện không được để trống."),
  severity: z.string().optional(),
  type: z.string().optional(),
  images: z.array(z.object({ id: z.string(), url: z.string(), name: z.string(), "data-ai-hint": z.string().optional() })).optional(),
  recommendation: z.string().optional(),
  linkedDnfId: z.string().optional(),
  quantity: z.number().optional(),
  location: geoLocationSchema,
});

const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Nội dung hạng mục không được để trống."),
  status: z.enum(["pending", "pass", "fail"], { required_error: "Vui lòng chọn trạng thái."}).default("pending"),
  findings: z.array(findingSchema).optional(),
  images: z.array(z.object({ id: z.string(), url: z.string(), name: z.string(), "data-ai-hint": z.string().optional() })).optional(),
  isCustom: z.boolean().optional().default(false),
  criteria: z.string().optional(),
  unit: z.string().optional(),
  standardQuantity: z.number().optional(),
  toleranceOperator: z.enum(['>', '<', '>=', '<=', '==', '±']).optional(),
  toleranceValue: z.number().optional(),
  actualQuantity: z.preprocess(
    (val) => (String(val).trim() === '' ? undefined : Number(val)),
    z.number().optional()
  ),
  requiredTools: z.string().optional(),
});

const inspectionFormSchema = z.object({
  inspectionTitle: z.string().min(1, "Tiêu đề kiểm tra không được để trống."),
  inspectionDate: z.string().min(1, "Ngày kiểm tra không được để trống."),
  inspectorName: z.string().min(1, "Tên người kiểm tra không được để trống."),
  checklistTemplateId: z.string().optional(),
  areaIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một khu vực kiểm tra."),
  checklistItems: z.array(checklistItemSchema),
  generalNotes: z.string().optional(),
  scheduledStartDate: z.string().optional(),
  scheduledFinishDate: z.string().optional(),
  estimatedDurationHours: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
});

type InspectionFormValues = z.infer<typeof inspectionFormSchema>;

interface InspectionFormProps {
  initialData?: Partial<InspectionDetail>;
  isEditMode?: boolean;
}

const translations = {
  vi: {
    formTitle: "Thông tin Phiếu Kiểm Tra",
    formDescription: "Nhập các thông tin chi tiết cho phiếu kiểm tra.",
    generalInfoTitle: "Thông tin chung",
    generalInfoDesc: "Nhập các thông tin cơ bản cho đợt kiểm tra này.",
    titleLabel: "Tiêu đề kiểm tra",
    titlePlaceholder: "VD: Kiểm tra định kỳ Ga Ba Son Quý 1",
    inspectorLabel: "Người kiểm tra",
    inspectorPlaceholder: "Nhập tên người thực hiện",
    dateLabel: "Ngày kiểm tra",
    templateLabel: "Mẫu Checklist",
    templatePlaceholder: "Chọn mẫu checklist (hoặc bỏ trống để nhập tay)",
    noTemplateSelected: "Không có mẫu (nhập thủ công)",
    areaLabel: "Khu vực kiểm tra",
    areaPlaceholder: "Chọn (các) khu vực",
    notesLabel: "Ghi chú chung",
    notesPlaceholder: "Nhập các ghi chú chung cho đợt kiểm tra (nếu có)...",
    checklistSectionTitle: "Checklist Kiểm Tra",
    checklistSectionDesc: "Đánh dấu các hạng mục và ghi nhận phát hiện (nếu có).",
    customItemLabel: "Nội dung hạng mục tùy chỉnh",
    customItemPlaceholder: "Nhập nội dung hạng mục mới...",
    criteriaPrefix: "Tiêu chí",
    statusLabel: "Trạng thái",
    statusPending: "Chưa kiểm tra",
    statusPass: "Đạt",
    statusFail: "Không đạt",
    findingLabel: "Phát hiện",
    findingDescLabel: "Mô tả phát hiện",
    findingDescPlaceholder: "Mô tả chi tiết phát hiện...",
    severityLabel: "Mức độ nghiêm trọng",
    severityPlaceholder: "Chọn mức độ",
    typeLabel: "Phân loại",
    typePlaceholder: "Chọn phân loại",
    quantityLabel: "Định lượng",
    quantityPlaceholder: "Nhập số lượng...",
    actualQuantityLabel: "Giá trị thực tế",
    actualQuantityPlaceholder: "Nhập số liệu đo được...",
    standardQuantityPrefix: "Định mức",
    toleranceLabel: "Chênh lệch cho phép",
    recommendationLabel: "Đề xuất khắc phục",
    recommendationPlaceholder: "Đề xuất biện pháp khắc phục...",
    linkedDnfLabel: "Khiếm khuyết (DNF) liên quan",
    linkedDnfPlaceholder: "VD: DNF-2024-001",
    createDnfButton: "Tạo DNF từ Phát hiện này",
    imagesLabel: "Hình ảnh đính kèm",
    uploadImageButton: "Tải ảnh",
    addFindingButton: "Thêm phát hiện",
    addCustomItemButton: "Thêm hạng mục checklist tùy chỉnh",
    noChecklistItemsMessage: "Vui lòng chọn 'Mẫu Checklist' để tải checklist, hoặc thêm hạng mục tùy chỉnh.",
    cancelButton: "Hủy",
    resetFormButton: "Đặt lại Form",
    saveButton: "Lưu Kiểm Tra",
    updateButton: "Cập nhật Kiểm Tra",
    savingProgress: "Đang lưu...",
    saveSuccessTitle: "Đã lưu kiểm tra",
    updateSuccessTitle: "Đã cập nhật kiểm tra",
    saveSuccessDesc: (title: string) => `Kiểm tra "${title}" đã được lưu thành công.`,
    updateSuccessDesc: (title: string) => `Kiểm tra "${title}" đã được cập nhật thành công.`,
    deleteItemTooltip: "Xóa hạng mục tùy chỉnh",
    deleteFindingTooltip: "Xóa phát hiện",
    autoFailDescriptionPercentage: (actual: number, unit: string, standard: number, tolerance: number) => `Giá trị đo được (${actual} ${unit}) nằm ngoài ngưỡng cho phép (Định mức: ${standard}, Chênh lệch: ±${tolerance}%).`,
    autoFailDescriptionAbsolute: (actual: number, unit: string, operator: string, standard: number) => `Giá trị đo được (${actual} ${unit}) không đáp ứng điều kiện ('${operator} ${standard}').`,
    requiredTools: "Công cụ Yêu cầu",
    captureLocation: "Ghi nhận vị trí",
    locationCaptured: "Đã ghi nhận vị trí",
    locationCaptureError: "Lỗi ghi nhận vị trí",
    locationsSelected: (count: number) => `${count} vị trí được chọn`,
  },
  en: {
    formTitle: "Inspection Form Details",
    formDescription: "Enter the detailed information for the inspection form.",
    generalInfoTitle: "General Information",
    generalInfoDesc: "Enter the basic information for this inspection.",
    titleLabel: "Inspection Title",
    titlePlaceholder: "e.g., Quarterly Ba Son Station Check",
    inspectorLabel: "Inspector Name",
    inspectorPlaceholder: "Enter inspector's name",
    dateLabel: "Inspection Date",
    templateLabel: "Checklist Template",
    templatePlaceholder: "Select template (or leave blank for manual entry)",
    noTemplateSelected: "No Template (manual entry)",
    areaLabel: "Inspection Area",
    areaPlaceholder: "Select area(s)",
    notesLabel: "General Notes",
    notesPlaceholder: "Enter general notes for the inspection (if any)...",
    checklistSectionTitle: "Inspection Checklist",
    checklistSectionDesc: "Mark items and record findings (if any).",
    customItemLabel: "Custom Checklist Item Content",
    customItemPlaceholder: "Enter new item content...",
    criteriaPrefix: "Criteria",
    statusLabel: "Status",
    statusPending: "Pending",
    statusPass: "Pass",
    statusFail: "Fail",
    findingLabel: "Finding",
    findingDescLabel: "Finding Description",
    findingDescPlaceholder: "Describe the finding in detail...",
    severityLabel: "Severity",
    severityPlaceholder: "Select severity",
    typeLabel: "Type",
    typePlaceholder: "Select type",
    quantityLabel: "Quantity",
    quantityPlaceholder: "Enter quantity...",
    actualQuantityLabel: "Actual Value",
    actualQuantityPlaceholder: "Enter measured value...",
    standardQuantityPrefix: "Standard",
    toleranceLabel: "Allowed Tolerance",
    recommendationLabel: "Recommendation",
    recommendationPlaceholder: "Suggest corrective measures...",
    linkedDnfLabel: "Related Defect (DNF)",
    linkedDnfPlaceholder: "e.g., DNF-2024-001",
    createDnfButton: "Create DNF from this Finding",
    imagesLabel: "Attached Images",
    uploadImageButton: "Upload Image",
    addFindingButton: "Add Finding",
    addCustomItemButton: "Add Custom Checklist Item",
    noChecklistItemsMessage: "Please select a 'Checklist Template' to load items, or add custom items.",
    cancelButton: "Cancel",
    resetFormButton: "Reset Form",
    saveButton: "Save Inspection",
    updateButton: "Update Inspection",
    savingProgress: "Saving...",
    saveSuccessTitle: "Inspection Saved",
    updateSuccessTitle: "Inspection Updated",
    saveSuccessDesc: (title: string) => `Inspection "${title}" has been saved successfully.`,
    updateSuccessDesc: (title: string) => `Inspection "${title}" has been updated successfully.`,
    deleteItemTooltip: "Delete custom item",
    deleteFindingTooltip: "Delete finding",
    autoFailDescriptionPercentage: (actual: number, unit: string, standard: number, tolerance: number) => `Measured value (${actual} ${unit}) is outside the allowed tolerance (Standard: ${standard}, Tolerance: ±${tolerance}%).`,
    autoFailDescriptionAbsolute: (actual: number, unit: string, operator: string, standard: number) => `Measured value (${actual} ${unit}) does not meet the condition ('${operator} ${standard}').`,
    requiredTools: "Required Tools",
    captureLocation: "Capture Location",
    locationCaptured: "Location captured",
    locationCaptureError: "Error capturing location",
    locationsSelected: (count: number) => `${count} selected`,
  }
};

export function InspectionForm({ initialData, isEditMode = false }: InspectionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user: currentUser } = useAuth();
  const { isOnline } = useNetwork();
  const t = translations[locale];

  const [maintenanceStandards, setMaintenanceStandards] = React.useState<MaintenanceStandard[]>([]);
  const [maintenanceStandardItems, setMaintenanceStandardItems] = React.useState<MaintenanceStandardItem[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [standards, items, locationData] = await Promise.all([
          getMaintenanceStandards(),
          getMaintenanceStandardItems(),
          getLocations(),
        ]);
        setMaintenanceStandards(standards);
        setMaintenanceStandardItems(items);
        setLocations(locationData);
      } catch (error) {
        console.error("Failed to fetch maintenance data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu định mức. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    };
    fetchData();
  }, [toast]);


  const defaultInspectionDate = React.useMemo(() => new Date().toISOString().split('T')[0], []);

  const getInitialFormValues = React.useCallback((data?: Partial<InspectionDetail>): InspectionFormValues => {
    return {
      inspectionTitle: data?.title || "",
      inspectionDate: data?.date || defaultInspectionDate,
      inspectorName: data?.inspector || currentUser?.name || '',
      checklistTemplateId: data?.checklistTemplateId || "",
      areaIds: data?.areaIds || [],
      checklistItems: (data?.checklistItems?.map(item => ({
        ...item,
        id: item.id || `custom-${Date.now()}`,
        criteria: item.criteria || "",
        images: item.images?.map(img => ({...img, "data-ai-hint": img['data-ai-hint'] || img.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0,20) })) || [],
        findings: item.findings?.map(f => ({
          ...f,
          id: f.id || `finding-${Date.now()}-${Math.random()}`,
          images: f.images?.map(img => ({...img, "data-ai-hint": img['data-ai-hint'] || img.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0,20) })) || [],
          location: f.location,
        })) || []
      })) || []) as any,
      generalNotes: data?.generalNotes || "",
      scheduledStartDate: data?.scheduledStartDate,
      scheduledFinishDate: data?.scheduledFinishDate,
      estimatedDurationHours: data?.estimatedDurationHours,
    };
  }, [defaultInspectionDate, currentUser?.name]);

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: getInitialFormValues(initialData),
  });

  const { fields: checklistFields, replace: replaceChecklistItems, append: appendChecklistItem, remove: removeChecklistItem } = useFieldArray({
    control: form.control,
    name: "checklistItems",
  });

  const selectedTemplateId = form.watch('checklistTemplateId');

  React.useEffect(() => {
    form.reset(getInitialFormValues(initialData));
  }, [initialData, form, getInitialFormValues]);

  React.useEffect(() => {
    const customItems = form.getValues('checklistItems').filter(item => item.isCustom);

    if (selectedTemplateId && selectedTemplateId !== NO_TEMPLATE_VALUE) {
      const itemsFromTemplate = maintenanceStandardItems.filter(task => task.standardId === selectedTemplateId);
      const newChecklistItems = itemsFromTemplate.map(task => ({
          id: task.itemCode,
          text: task.itemText,
          criteria: task.criteria || "",
          status: "pending" as "pending" | "pass" | "fail",
          findings: [],
          isCustom: false,
          unit: task.unit,
          standardQuantity: task.standardQuantity,
          toleranceOperator: task.toleranceOperator,
          toleranceValue: task.toleranceValue,
          requiredTools: task.requiredTools
      }));
      replaceChecklistItems([...newChecklistItems, ...customItems]);
    } else {
       replaceChecklistItems(customItems);
    }
  }, [selectedTemplateId, maintenanceStandardItems, replaceChecklistItems, form]);


  const handleImageUpload = (checklistIndex: number, findingIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const hint = file.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0, 20);
        const newImage = {
          id: `img-${Date.now()}`,
          url: reader.result as string,
          name: file.name,
          "data-ai-hint": hint
        };
        const currentImages = form.getValues(`checklistItems.${checklistIndex}.findings.${findingIndex}.images`) || [];
        form.setValue(`checklistItems.${checklistIndex}.findings.${findingIndex}.images`, [...currentImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChecklistImageUpload = (checklistIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const hint = file.name.split('.')[0].replace(/[\\W_]+/g," ").substring(0, 20);
        const newImage = {
          id: `img-cl-${Date.now()}`,
          url: reader.result as string,
          name: file.name,
          "data-ai-hint": hint
        };
        const currentImages = form.getValues(`checklistItems.${checklistIndex}.images`) || [];
        form.setValue(`checklistItems.${checklistIndex}.images`, [...currentImages, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (checklistIndex: number, findingIndex: number, imageId: string) => {
    const currentImages = form.getValues(`checklistItems.${checklistIndex}.findings.${findingIndex}.images`) || [];
    form.setValue(`checklistItems.${checklistIndex}.findings.${findingIndex}.images`, currentImages.filter(img => img.id !== imageId));
  };

  const removeChecklistImage = (checklistIndex: number, imageId: string) => {
    const currentImages = form.getValues(`checklistItems.${checklistIndex}.images`) || [];
    form.setValue(`checklistItems.${checklistIndex}.images`, currentImages.filter(img => img.id !== imageId));
  };

  const addFinding = (checklistIndex: number) => {
    const currentFindings = form.getValues(`checklistItems.${checklistIndex}.findings`) || [];
    form.setValue(`checklistItems.${checklistIndex}.findings`, [
      ...currentFindings,
      { id: `finding-${Date.now()}-${checklistIndex}`, description: "", severity: "", type: "", images: [], recommendation: "", linkedDnfId: "", quantity: undefined }
    ]);
  };

  const removeFinding = (checklistIndex: number, findingIndex: number) => {
    const currentFindings = form.getValues(`checklistItems.${checklistIndex}.findings`) || [];
    form.setValue(`checklistItems.${checklistIndex}.findings`, currentFindings.filter((_, idx) => idx !== findingIndex));
  };

  const addNewChecklistItem = () => {
    appendChecklistItem({
      id: `custom-${Date.now()}`,
      text: "",
      criteria: "",
      status: "pending",
      findings: [],
      isCustom: true,
      unit: "",
      standardQuantity: undefined,
      toleranceOperator: undefined,
      toleranceValue: undefined,
      actualQuantity: undefined,
      requiredTools: ""
    });
  };

  const removeCustomChecklistItem = (index: number) => {
    removeChecklistItem(index);
  };
  
  const handleCaptureLocation = (checklistIndex: number, findingIndex: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue(`checklistItems.${checklistIndex}.findings.${findingIndex}.location`, { latitude, longitude });
          toast({ title: t.locationCaptured });
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({ variant: "destructive", title: t.locationCaptureError, description: error.message });
        }
      );
    } else {
      toast({ variant: "destructive", title: t.locationCaptureError, description: "Geolocation is not supported by this browser." });
    }
  };

  const handleResetForm = () => {
    form.reset(getInitialFormValues(initialData));
    toast({
        title: locale === 'vi' ? "Đã đặt lại biểu mẫu" : "Form Reset",
        description: locale === 'vi' ? "Các trường đã được hoàn tác về giá trị ban đầu." : "Fields have been reverted to their original values.",
    });
  };


  const onSubmit = async (data: InspectionFormValues) => {
    const finalStatus: InspectionDetail['status'] = "Mới";
            
    if (isEditMode && initialData?.id) {
        const inspectionRecord: InspectionDetail = {
            ...(initialData as InspectionDetail),
            title: data.inspectionTitle,
            date: data.inspectionDate,
            inspector: data.inspectorName,
            checklistTemplateId: data.checklistTemplateId,
            areaIds: data.areaIds,
            checklistItems: data.checklistItems as any,
            generalNotes: data.generalNotes,
            status: finalStatus,
            scheduledStartDate: data.scheduledStartDate,
            scheduledFinishDate: data.scheduledFinishDate,
            estimatedDurationHours: data.estimatedDurationHours,
        };
        await updateInspection(inspectionRecord);
        toast({
            title: t.updateSuccessTitle,
            description: t.updateSuccessDesc(data.inspectionTitle),
        });
        router.push(`/inspections/${initialData.id}`);
    } else {
        const inspectionRecord: Omit<InspectionDetail, 'id'> = {
            title: data.inspectionTitle,
            date: data.inspectionDate,
            inspector: data.inspectorName,
            checklistTemplateId: data.checklistTemplateId,
            areaIds: data.areaIds,
            checklistItems: data.checklistItems as any,
            generalNotes: data.generalNotes,
            status: finalStatus,
            scheduledStartDate: data.scheduledStartDate,
            scheduledFinishDate: data.scheduledFinishDate,
            estimatedDurationHours: data.estimatedDurationHours
        };

        if (!isOnline) {
            await offlineSync.addAction({
                type: 'INSPECTION_CREATE',
                entityType: 'INSPECTION',
                data: inspectionRecord,
            });
            toast({
                title: locale === 'vi' ? "Đã lưu Ngoại tuyến" : "Saved Offline",
                description: locale === 'vi' ? "Dữ liệu sẽ được tự động đồng bộ khi có mạng." : "Data will be synced automatically when online.",
            });
            router.push("/inspections");
            return;
        }

        await addInspection(inspectionRecord);
        toast({
            title: t.saveSuccessTitle,
            description: t.saveSuccessDesc(data.inspectionTitle),
        });
        router.push("/inspections?refresh=true");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.generalInfoTitle}</CardTitle>
            <CardDescription>{t.generalInfoDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inspectionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.titleLabel}</FormLabel>
                    <FormControl><Input placeholder={t.titlePlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="inspectorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.inspectorLabel}</FormLabel>
                    <FormControl><Input placeholder={t.inspectorPlaceholder} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="inspectionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.dateLabel}</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checklistTemplateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.templateLabel}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value === NO_TEMPLATE_VALUE ? "" : value);
                      }}
                      value={field.value || NO_TEMPLATE_VALUE}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder={t.templatePlaceholder} /></SelectTrigger></FormControl>
                      <SelectContent>
                         <SelectItem value={NO_TEMPLATE_VALUE}>{t.noTemplateSelected}</SelectItem>
                        {maintenanceStandards.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} {template.description ? `(${template.description})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areaIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t.areaLabel}</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                            {field.value && field.value.length > 0
                                ? t.locationsSelected(field.value.length)
                                : t.areaPlaceholder
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                     <div className="flex flex-wrap gap-1 pt-1">
                        {field.value?.map((id) => {
                            const location = locations.find(l => l.id === id);
                            return location ? (
                                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                    {location.label}
                                    <button
                                        type="button"
                                        className="focus:ring-ring focus:ring-offset-background rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1"
                                        onClick={() => field.onChange(field.value?.filter(currentId => currentId !== id))}
                                    >
                                        <XCircle className="h-3.5 w-3.5" />
                                        <span className="sr-only">Remove {location.label}</span>
                                    </button>
                                </Badge>
                            ) : null
                        })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="generalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.notesLabel}</FormLabel>
                  <FormControl><Textarea placeholder={t.notesPlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.checklistSectionTitle}</CardTitle>
            <CardDescription>{t.checklistSectionDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                {checklistFields.map((item, checklistIndex) => (
                <div key={item.id} className="p-4 border rounded-md shadow-sm bg-card space-y-4">
                    {/* Hidden fields to hold metadata */}
                    <Controller name={`checklistItems.${checklistIndex}.isCustom`} control={form.control} render={({ field }) => <input type="hidden" {...field} value={String(field.value)} />} />
                    <Controller name={`checklistItems.${checklistIndex}.id`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.criteria`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.standardQuantity`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.toleranceOperator`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.toleranceValue`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.unit`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                    <Controller name={`checklistItems.${checklistIndex}.requiredTools`} control={form.control} render={({ field }) => <input type="hidden" {...field} />} />
                
                    <div className="flex justify-between items-start">
                    <FormField
                        control={form.control}
                        name={`checklistItems.${checklistIndex}.text`}
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            {form.getValues(`checklistItems.${checklistIndex}.isCustom`) ? (
                            <>
                                <FormLabel>{t.customItemLabel} #{checklistIndex + 1}</FormLabel>
                                <FormControl>
                                <Input placeholder={t.customItemPlaceholder} {...field} />
                                </FormControl>
                            </>
                            ) : (
                            <FormLabel className="font-semibold pt-2 pb-1 block text-base">
                                {field.value} ({form.getValues(`checklistItems.${checklistIndex}.id`)})
                            </FormLabel>
                            )}
                            {!form.getValues(`checklistItems.${checklistIndex}.isCustom`) && form.getValues(`checklistItems.${checklistIndex}.criteria`) && (
                                <FormDescription className="text-xs">
                                    {t.criteriaPrefix}: {form.getValues(`checklistItems.${checklistIndex}.criteria`)}
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    {form.getValues(`checklistItems.${checklistIndex}.isCustom`) && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomChecklistItem(checklistIndex)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive ml-2 mt-1" title={t.deleteItemTooltip}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    </div>
                    
                    {item.unit && (
                    <FormField
                        control={form.control}
                        name={`checklistItems.${checklistIndex}.actualQuantity`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.actualQuantityLabel} ({item.unit})</FormLabel>
                            <FormControl>
                            <Input
                                type="number"
                                step="any"
                                placeholder={t.actualQuantityPlaceholder}
                                {...field}
                                onChange={e => {
                                const value = e.target.value;
                                const actualQty = value === '' ? undefined : parseFloat(value);
                                field.onChange(actualQty);

                                const operator = form.getValues(`checklistItems.${checklistIndex}.toleranceOperator`);
                                const standard = form.getValues(`checklistItems.${checklistIndex}.standardQuantity`);
                                const tolerance = form.getValues(`checklistItems.${checklistIndex}.toleranceValue`);
                                const unit = form.getValues(`checklistItems.${checklistIndex}.unit`) || '';

                                if (operator && standard != null && actualQty != null) {
                                    let isFail = false;
                                    let autoDescription = "";

                                    switch (operator) {
                                    case '±':
                                        if (tolerance != null) {
                                        const diff = Math.abs(actualQty - standard);
                                        if (standard === 0) {
                                            if (actualQty > tolerance) {
                                            isFail = true;
                                            autoDescription = t.autoFailDescriptionPercentage(actualQty, unit, standard, tolerance);
                                            }
                                        } else {
                                            if ((diff / standard) * 100 > tolerance) {
                                            isFail = true;
                                            autoDescription = t.autoFailDescriptionPercentage(actualQty, unit, standard, tolerance);
                                            }
                                        }
                                        }
                                        break;
                                    case '>': if (!(actualQty > standard)) isFail = true; break;
                                    case '<': if (!(actualQty < standard)) isFail = true; break;
                                    case '>=': if (!(actualQty >= standard)) isFail = true; break;
                                    case '<=': if (!(actualQty <= standard)) isFail = true; break;
                                    case '==': if (actualQty !== standard) isFail = true; break;
                                    }

                                    if (isFail && (operator !== '±')) {
                                    autoDescription = t.autoFailDescriptionAbsolute(actualQty, unit, operator, standard);
                                    }
                                    
                                    if (isFail) {
                                    form.setValue(`checklistItems.${checklistIndex}.status`, 'fail');
                                    let findings = form.getValues(`checklistItems.${checklistIndex}.findings`) || [];
                                    if (findings.length === 0) {
                                        form.setValue(`checklistItems.${checklistIndex}.findings`, [{ 
                                        id: `finding-auto-${Date.now()}`, 
                                        description: autoDescription,
                                        quantity: actualQty,
                                        }]);
                                    } else {
                                        const updatedFindings = [...findings];
                                        updatedFindings[0] = { ...updatedFindings[0], description: autoDescription, quantity: actualQty };
                                        form.setValue(`checklistItems.${checklistIndex}.findings`, updatedFindings);
                                    }
                                    }
                                }
                                }}
                                value={field.value ?? ''}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    )}

                    <FormField
                    control={form.control}
                    name={`checklistItems.${checklistIndex}.status`}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                        <FormLabel>{t.statusLabel}</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={(value) => {
                                field.onChange(value);
                                if (value === 'pass') {
                                form.setValue(`checklistItems.${checklistIndex}.findings`, []);
                                }
                            }}
                            value={field.value}
                            className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="pending" /></FormControl>
                                <FormLabel className="font-normal">{t.statusPending}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="pass" /></FormControl>
                                <FormLabel className="font-normal text-green-600 dark:text-green-400">{t.statusPass}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="fail" /></FormControl>
                                <FormLabel className="font-normal text-red-600 dark:text-red-400">{t.statusFail}</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <div className="flex flex-col gap-4">
                        <FormItem>
                            <FormLabel>{t.imagesLabel}</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`checklist-image-upload-${checklistIndex}`} className="cursor-pointer">
                                        <Button type="button" variant="outline" size="sm" asChild>
                                            <span><UploadCloud className="mr-2 h-4 w-4" /> {t.uploadImageButton}</span>
                                        </Button>
                                        <input
                                            id={`checklist-image-upload-${checklistIndex}`}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleChecklistImageUpload(checklistIndex, e)}
                                        />
                                    </label>
                                </div>
                            </FormControl>
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                {form.watch(`checklistItems.${checklistIndex}.images`)?.map(image => (
                                    <div key={image.id} className="relative group aspect-square h-20 w-20">
                                        <Image src={image.url} alt={image.name} layout="fill" objectFit="cover" className="rounded-md" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeChecklistImage(checklistIndex, image.id)}
                                        >
                                            <XCircle className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    </div>

                    {form.watch(`checklistItems.${checklistIndex}.status`) === 'fail' && (
                    <div className="pl-4 mt-4 border-l-2 border-destructive/50 space-y-4">
                        {form.watch(`checklistItems.${checklistIndex}.findings`)?.map((_finding, findingIndex) => (
                        <Card key={_finding.id || findingIndex} className="p-4 bg-background">
                            <FormField
                            control={form.control}
                            name={`checklistItems.${checklistIndex}.findings.${findingIndex}.id`}
                            render={({ field }) => <input type="hidden" {...field} />}
                            />
                            <CardHeader className="p-0 pb-2 mb-2 border-b">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-base">{t.findingLabel} #{findingIndex + 1}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => removeFinding(checklistIndex, findingIndex)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title={t.deleteFindingTooltip}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                            </CardHeader>
                            <CardContent className="p-0 space-y-3">
                            <FormField
                                control={form.control}
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.description`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.findingDescLabel}</FormLabel>
                                    <FormControl><Textarea placeholder={t.findingDescPlaceholder} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleCaptureLocation(checklistIndex, findingIndex)}>
                                    <MapPin className="mr-2 h-4 w-4" /> {t.captureLocation}
                                </Button>
                                {form.watch(`checklistItems.${checklistIndex}.findings.${findingIndex}.location`) && (
                                    <p className="text-xs text-green-600">{t.locationCaptured}</p>
                                )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.severity`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t.severityLabel}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder={t.severityPlaceholder} /></SelectTrigger></FormControl>
                                        <SelectContent>
                                        {SEVERITY_LEVELS.map(level => (
                                            <SelectItem key={level.id} value={level.id}>{level.label}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.type`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>{t.typeLabel}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder={t.typePlaceholder} /></SelectTrigger></FormControl>
                                        <SelectContent>
                                        {FINDING_TYPES.map(type => (
                                            <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
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
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.quantity`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                    {t.quantityLabel} {form.getValues(`checklistItems.${checklistIndex}.unit`) ? `(${form.getValues(`checklistItems.${checklistIndex}.unit`)})` : ''}
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        type="number"
                                        step="any"
                                        placeholder={t.quantityPlaceholder}
                                        {...field}
                                        onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        value={field.value ?? ''}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.recommendation`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.recommendationLabel}</FormLabel>
                                    <FormControl><Textarea placeholder={t.recommendationPlaceholder} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`checklistItems.${checklistIndex}.findings.${findingIndex}.linkedDnfId`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t.linkedDnfLabel}</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <FormControl><Input placeholder={t.linkedDnfPlaceholder} {...field} /></FormControl>
                                        {!field.value && (
                                            <Button type="button" variant="outline" size="sm" asChild>
                                            <Link href={`/dnf/new?originatingInspectionId=${initialData?.id || 'new'}&originatingFindingId=${form.getValues(`checklistItems.${checklistIndex}.findings.${findingIndex}.id`) || ''}&description=${encodeURIComponent(form.getValues(`checklistItems.${checklistIndex}.findings.${findingIndex}.description`) || '')}&locationOfFailure=${encodeURIComponent((form.getValues('areaIds') || []).join(','))}&staffWhoIdentifiedFailure=${encodeURIComponent(form.getValues('inspectorName') || '')}`}>
                                                    <FilePlus className="mr-2 h-4 w-4"/>
                                                    {t.createDnfButton}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormItem>
                                <FormLabel>{t.imagesLabel}</FormLabel>
                                <FormControl>
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`image-upload-${checklistIndex}-${findingIndex}`} className="cursor-pointer">
                                    <Button type="button" variant="outline" asChild>
                                        <span><UploadCloud className="mr-2 h-4 w-4" /> {t.uploadImageButton}</span>
                                    </Button>
                                    <input
                                        id={`image-upload-${checklistIndex}-${findingIndex}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(checklistIndex, findingIndex, e)}
                                    />
                                    </label>
                                </div>
                                </FormControl>
                                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {form.watch(`checklistItems.${checklistIndex}.findings.${findingIndex}.images`)?.map(image => (
                                    <div key={image.id} className="relative group aspect-square">
                                    <Image src={image.url} alt={image.name} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint={image['data-ai-hint'] || 'inspection image'} />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(checklistIndex, findingIndex, image.id)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                    </div>
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                            </CardContent>
                        </Card>
                        ))}
                        <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addFinding(checklistIndex)}
                        className="mt-2"
                        >
                        <PlusCircle className="mr-2 h-4 w-4" /> {t.addFindingButton}
                        </Button>
                    </div>
                    )}
                    {checklistIndex < checklistFields.length - 1 && <Separator className="my-6" />}
                </div>
                ))}
            </div>

            {checklistFields.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-4">{t.noChecklistItemsMessage}</p>
                <Button type="button" onClick={addNewChecklistItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t.addCustomItemButton}
                </Button>
              </div>
            )}
            
            {checklistFields.length > 0 && (
              <Button type="button" variant="outline" onClick={addNewChecklistItem} className="mt-4 w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> {t.addCustomItemButton}
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t.cancelButton}</Button>
           <Button type="button" variant="outline" onClick={handleResetForm}>
            <RefreshCcw className="mr-2 h-4 w-4" /> {t.resetFormButton}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t.savingProgress : (isEditMode ? t.updateButton : t.saveButton)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
