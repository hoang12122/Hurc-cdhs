

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Search, Edit, Trash2, ListChecks as IconListChecks, UploadCloud, Undo2, RefreshCcw, MapPin, User as UserIcon, Clock, ChevronsUpDown } from "lucide-react";
import { 
    addMaintenanceStandard,
    updateMaintenanceStandard,
    deleteMaintenanceStandard,
    addMaintenanceStandardItem,
    updateMaintenanceStandardItem,
    deleteMaintenanceStandardItem,
    getMaintenanceStandards,
    getMaintenanceStandardItems,
} from "@/lib/actions/maintenance.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { type MaintenanceStandard, type MaintenanceStandardItem, type PatrolLocation, type ToleranceOperator, MOCK_CURRENT_USER, ROLE_ADMIN_PKTAT, TOLERANCE_OPERATORS, type MaintenanceFrequency, MAINTENANCE_FREQUENCIES, type Subsystem, ROLE_L3_SPECIALIST, type User } from "@/lib/constants";
import { hasPermission } from "@/lib/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as React from "react";
import { useLanguage } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getSubsystems, getLocations } from "@/lib/actions/category.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";


const createStandardSchema = (t: any) => z.object({
  name: z.string().min(1, t.validation.nameRequired),
  name_en: z.string().optional(),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'general']).optional(),
  scheduledTime: z.string().optional(),
  locationIds: z.array(z.string()).optional(),
  recipientId: z.string().optional(),
});


const createItemSchema = (t: any) => z.object({
  itemCode: z.string().min(1, t.validation.itemCodeRequired),
  itemText: z.string().min(1, t.validation.itemTextRequired),
  criteria: z.string().min(1, t.validation.criteriaRequired),
  unit: z.string().optional(),
  standardQuantity: z.preprocess(
    (val) => (val === undefined || val === null || String(val).trim() === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: t.validation.numberInvalid }).optional()
  ),
  toleranceOperator: z.enum(['', ...TOLERANCE_OPERATORS] as [string, ...string[]]).optional().transform(val => val === '' ? undefined : val),
  toleranceValue: z.preprocess(
    (val) => (val === undefined || val === null || String(val).trim() === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: t.validation.numberInvalid }).optional()
  ),
  standardId: z.string(),
}).superRefine((data, ctx) => {
  const unitProvided = data.unit && data.unit.trim() !== '';

  if (unitProvided) {
    if (data.standardQuantity === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation.standardQuantityRequired,
        path: ['standardQuantity'],
      });
    }

    if (data.toleranceOperator && data.toleranceValue === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation.toleranceValueRequired,
        path: ['toleranceValue'],
      });
    }
    
    if (data.toleranceValue !== undefined && !data.toleranceOperator) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t.validation.toleranceOperatorRequired,
        path: ['toleranceOperator'],
      });
    }
  }
});


const translations = {
  vi: {
    pageTitle: "Quản lý Định mức Bảo trì",
    pageDescription: "Xem, thêm, sửa, xóa các định mức bảo trì và các hạng mục chi tiết.",
    standardsTitle: "Danh sách Định mức Bảo trì",
    standardsDescription: "Danh sách các định mức bảo trì chính.",
    addStandard: "Thêm Định mức",
    importStandards: "Nhập từ CSV",
    editStandard: "Sửa Định mức",
    deleteStandard: "Xóa Định mức",
    searchStandard: "Tìm định mức...",
    standardName_vi: "Tên Định mức (Chọn từ Hệ thống con)",
    standardName_en: "Tên Định mức (Tiếng Anh)",
    subsystemSelectPlaceholder: "Chọn từ Hệ thống con",
    standardDescription: "Mô tả Định mức",
    frequencyLabel: "Tần suất",
    frequencyPlaceholder: "Chọn tần suất",
    timeLabel: "Thời gian Tạo",
    timePlaceholder: "VD: 07:00",
    locationLabel: "Vị trí áp dụng",
    locationPlaceholder: "Chọn (các) vị trí",
    locationOtherLabel: "Tên Vị trí/Tuyến khác",
    locationOtherPlaceholder: "Nhập vị trí/tuyến cụ thể...",
    itemsTitle: "Các Hạng mục trong Định mức",
    selectStandardPrompt: "Chọn một Định mức để xem và quản lý các hạng mục.",
    noItemsForStandard: "Chưa có hạng mục nào cho định mức này.",
    addItem: "Thêm Hạng mục",
    editItem: "Sửa Hạng mục",
    deleteItem: "Xóa Hạng mục",
    itemCode: "Mã Hạng mục",
    itemText: "Nội dung Hạng mục",
    itemTextPlaceholder: "Mô tả hạng mục kiểm tra tại đây, ví dụ: 'Kiểm tra độ mòn má phanh'.",
    itemCriteria: "Tiêu chí Đánh giá",
    itemUnit: "Đơn vị",
    itemUnitPlaceholder: "VD: cái, mét, kg...",
    itemStandardQuantity: "Định mức số lượng",
    itemStandardQuantityPlaceholder: "VD: 5",
    itemToleranceOperator: "Mức độ chênh lệch",
    itemToleranceOperatorPlaceholder: "Chọn quy tắc",
    itemToleranceValue: "Giá trị chênh lệch",
    itemToleranceValuePlaceholder: "VD: 10 (cho ±) hoặc 5 (cho <=)",
    noItems: "Không có hạng mục nào cho định mức này.",
    noStandards: "Không có định mức nào.",
    actions: "Hành động",
    edit: "Sửa",
    delete: "Xóa",
    save: "Lưu",
    cancel: "Hủy",
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteStandardMsg: "Bạn có chắc chắn muốn xóa định mức này và tất cả các hạng mục liên quan không?",
    confirmDeleteItemMsg: "Bạn có chắc chắn muốn xóa hạng mục này không?",
    standardAdded: "Đã thêm định mức thành công!",
    standardUpdated: "Đã cập nhật định mức thành công!",
    standardDeleted: "Đã xóa định mức thành công!",
    itemAdded: "Đã thêm hạng mục thành công!",
    itemUpdated: "Đã cập nhật hạng mục thành công!",
    itemDeleted: "Đã xóa hạng mục thành công!",
    errorNameExists: (name: string) => `Tên định mức "${name}" đã tồn tại. Vui lòng chọn tên khác.`,
    errorCodeExists: (code: string) => `Mã hạng mục "${code}" đã tồn tại trong định mức này. Vui lòng chọn mã khác.`,
    editStandardDialogDescription: (name: string) => `Cập nhật thông tin cho định mức: ${name}`,
    addStandardDialogDescription: "Nhập thông tin cho định mức mới.",
    editItemDialogDescription: (itemName: string) => `Cập nhật hạng mục: ${itemName}`,
    addItemDialogDescription: (standardName: string | null) => `Thêm hạng mục mới cho định mức: ${standardName || 'N/A'}`,
    accessDenied: "Bạn không có quyền truy cập vào chức năng này.",
    backToDashboard: "Quay lại Bảng điều khiển",
    undoLastChange: "Hoàn tác",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng.",
    undoNothing: "Không có thay đổi nào để hoàn tác.",
    loadingMessage: "Đang tải...",
    quantitativeCheck: "Kiểm tra định lượng",
    resetFormButton: "Đặt lại Form",
    recipientLabel: "Người tiếp nhận",
    recipientPlaceholder: "Chọn người tiếp nhận định mức",
    noRecipientSelected: "Không chọn người tiếp nhận",
    locationsSelected: (count: number) => `${count} vị trí được chọn`,
    validation: {
        nameRequired: "Tên định mức không được để trống.",
        itemCodeRequired: "Mã hạng mục không được để trống.",
        itemTextRequired: "Nội dung hạng mục không được để trống.",
        criteriaRequired: "Tiêu chí đánh giá không được để trống.",
        numberInvalid: "Giá trị phải là một con số.",
        standardQuantityRequired: "Vui lòng nhập Định mức số lượng khi có Đơn vị.",
        toleranceValueRequired: "Vui lòng nhập Giá trị chênh lệch khi có quy tắc.",
        toleranceOperatorRequired: "Vui lòng chọn Quy tắc khi có giá trị chênh lệch.",
    }
  },
  en: {
    pageTitle: "Manage Maintenance Standards",
    pageDescription: "View, add, edit, and delete maintenance standards and their detailed items.",
    standardsTitle: "Maintenance Standards",
    standardsDescription: "List of main maintenance standards.",
    addStandard: "Add Standard",
    importStandards: "Import from CSV",
    editStandard: "Edit Standard",
    deleteStandard: "Delete Standard",
    searchStandard: "Search standards...",
    standardName_vi: "Standard Name (Select from Subsystem)",
    standardName_en: "Standard Name (English)",
    subsystemSelectPlaceholder: "Select from Subsystems",
    standardDescription: "Standard Description",
    frequencyLabel: "Frequency",
    frequencyPlaceholder: "Select frequency",
    timeLabel: "Generation Time",
    timePlaceholder: "e.g., 07:00",
    locationLabel: "Applicable Location(s)",
    locationPlaceholder: "Select location(s)",
    locationOtherLabel: "Other Location/Route Name",
    locationOtherPlaceholder: "Enter specific location/route...",
    itemsTitle: "Items in Standard",
    selectStandardPrompt: "Select a Standard to view and manage related items.",
    noItemsForStandard: "No items yet for this standard.",
    addItem: "Add Item",
    editItem: "Edit Item",
    deleteItem: "Delete Item",
    itemCode: "Item Code",
    itemText: "Item Text/Description",
    itemTextPlaceholder: "Describe the inspection item here, e.g., 'Check brake pad wear'.",
    itemCriteria: "Acceptance Criteria",
    itemUnit: "Unit",
    itemUnitPlaceholder: "e.g., item, meter, kg...",
    itemStandardQuantity: "Standard Quantity",
    itemStandardQuantityPlaceholder: "e.g., 5",
    itemToleranceOperator: "Tolerance Level",
    itemToleranceOperatorPlaceholder: "Select rule",
    itemToleranceValue: "Tolerance Value",
    itemToleranceValuePlaceholder: "e.g., 10 (for ±) or 5 (for <=)",
    noItems: "No items for this standard.",
    noStandards: "No standards found.",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteStandardMsg: "Are you sure you want to delete this standard and all related items?",
    confirmDeleteItemMsg: "Are you sure you want to delete this item?",
    standardAdded: "Standard added successfully!",
    standardUpdated: "Standard updated successfully!",
    standardDeleted: "Standard deleted successfully!",
    itemAdded: "Item added successfully!",
    itemUpdated: "Item updated successfully!",
    itemDeleted: "Item deleted successfully!",
    errorNameExists: (name: string) => `Standard name "${name}" already exists. Please choose a different name.`,
    errorCodeExists: (code: string) => `Item code "${code}" already exists in this standard. Please choose a different code.`,
    editStandardDialogDescription: (name: string) => `Update information for standard: ${name}`,
    addStandardDialogDescription: "Enter information for the new standard.",
    editItemDialogDescription: (itemName: string) => `Update item: ${itemName}`,
    addItemDialogDescription: (standardName: string | null) => `Add new item for standard: ${standardName || 'N/A'}`,
    accessDenied: "You do not have permission to access this feature.",
    backToDashboard: "Back to Dashboard",
    undoLastChange: "Undo",
    undoSuccess: "Successfully undid the last change.",
    undoNothing: "No recent change to undo.",
    loadingMessage: "Loading...",
    quantitativeCheck: "Quantitative Check",
    resetFormButton: "Reset Form",
    recipientLabel: "Recipient",
    recipientPlaceholder: "Select standard recipient",
    noRecipientSelected: "No recipient selected",
    locationsSelected: (count: number) => `${count} selected`,
    validation: {
        nameRequired: "Standard name cannot be empty.",
        itemCodeRequired: "Item code cannot be empty.",
        itemTextRequired: "Item text cannot be empty.",
        criteriaRequired: "Acceptance criteria cannot be empty.",
        numberInvalid: "Value must be a number.",
        standardQuantityRequired: "Standard Quantity is required when Unit is provided.",
        toleranceValueRequired: "Tolerance Value is required when an Operator is selected.",
        toleranceOperatorRequired: "An Operator is required when a Tolerance Value is provided.",
    }
  },
};

const NO_RECIPIENT_VALUE = "__NO_RECIPIENT__";

export default function MaintenanceStandardsPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();

  const [hasAccess, setHasAccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [standardsData, setStandardsData] = React.useState<MaintenanceStandard[]>([]);
  const [itemsData, setItemsData] = React.useState<MaintenanceStandardItem[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedStandardId, setSelectedStandardId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isStandardDialogOpen, setIsStandardDialogOpen] = React.useState(false);
  const [editingStandard, setEditingStandard] = React.useState<MaintenanceStandard | null>(null);
  
  const [isItemDialogOpen, setIsItemDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MaintenanceStandardItem | null>(null);

  const standardSchema = createStandardSchema(t);
  const itemSchema = createItemSchema(t);

  const standardForm = useForm<z.infer<typeof standardSchema>>({
    resolver: zodResolver(standardSchema),
    defaultValues: { name: "", name_en: "", description: "", frequency: "general", scheduledTime: "07:00", locationIds: [], recipientId: "" },
  });

  const itemForm = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { itemCode: "", itemText: "", criteria: "", standardId: "", unit: "", standardQuantity: undefined, toleranceOperator: undefined, toleranceValue: undefined },
  });
  
  const watchedUnit = itemForm.watch('unit');
  const watchedFrequency = standardForm.watch('frequency');
  const watchedToleranceOperator = itemForm.watch('toleranceOperator');


  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const [standards, items, fetchedSubsystems, fetchedLocations, fetchedUsers] = await Promise.all([
            getMaintenanceStandards(),
            getMaintenanceStandardItems(),
            getSubsystems(),
            getLocations(),
            getUsers(),
        ]);
        setStandardsData(standards);
        setItemsData(items);
        setSubsystems(fetchedSubsystems);
        setLocations(fetchedLocations);
        setUsers(fetchedUsers);
    } catch (error) {
        console.error("Failed to fetch data", error);
        toast({ title: "Error", description: "Could not fetch data.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    const checkAccess = async () => {
      const canManageChecklists = await hasPermission("checklist_templates:manage");
      setHasAccess(canManageChecklists);
      if (canManageChecklists) {
        fetchData();
      } else {
        setIsLoading(false);
      }
    };
    checkAccess();
  }, [fetchData]);
  
  React.useEffect(() => {
    document.title = `${t.pageTitle} - Metro Inspect Pro`;
  }, [t.pageTitle, locale]);

  if (isLoading) {
      return <div className="p-6">{t.loadingMessage}</div>;
  }
  
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md p-8 text-center">
          <CardTitle className="text-2xl text-destructive mb-4">{t.accessDenied}</CardTitle>
          <CardDescription>{locale === 'vi' ? `Bạn không có quyền truy cập trang này.` : `You do not have permission to access this page.`}</CardDescription>
           <Button asChild className="mt-6">
            <Link href="/dashboard">
              {t.backToDashboard}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const filteredStandards = standardsData.filter(
      (std) =>
        std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (std.description && std.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const itemsForSelectedStandard = selectedStandardId
      ? itemsData.filter(item => item.standardId === selectedStandardId)
      : [];

  const handleOpenAddStandardDialog = () => {
    setEditingStandard(null);
    standardForm.reset({ name: "", name_en: "", description: "", frequency: "general", scheduledTime: "07:00", locationIds: [], recipientId: "" });
    setIsStandardDialogOpen(true);
  };

  const handleOpenEditStandardDialog = (standard: MaintenanceStandard) => {
    setEditingStandard(standard);
    standardForm.reset({
        ...standard,
        name_en: standard.name_en || '',
        frequency: standard.frequency || 'general',
        scheduledTime: standard.scheduledTime || "07:00",
        locationIds: standard.locationIds || [],
        recipientId: standard.recipientId || ""
    });
    setIsStandardDialogOpen(true);
  };

  const generateAbbreviation = (nameStr?: string) => {
    if (!nameStr?.trim()) return '';
    return nameStr.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  const onSubmitStandard = async (data: z.infer<typeof standardSchema>) => {
    const abbreviation = generateAbbreviation(data.name_en) || generateAbbreviation(data.name);
    
    const standardPayload = { ...data, abbreviation };

    if (editingStandard) { 
      if (data.name !== editingStandard.name && standardsData.some(s => s.name === data.name)) {
        toast({ variant: "destructive", title: t.errorNameExists(data.name) });
        return;
      }
      const updatedStandard = { ...editingStandard, ...standardPayload };
      await updateMaintenanceStandard(updatedStandard as MaintenanceStandard);
      toast({ title: t.standardUpdated });
    } else { 
       if (standardsData.some(s => s.name === data.name)) {
        toast({ variant: "destructive", title: t.errorNameExists(data.name) });
        return;
      }
      await addMaintenanceStandard(standardPayload as Omit<MaintenanceStandard, 'id'>);
      toast({ title: t.standardAdded });
    }
    setIsStandardDialogOpen(false);
    fetchData(); // Refetch data
  };

  const handleDeleteStandard = async (standardId: string) => {
    await deleteMaintenanceStandard(standardId);
    if (selectedStandardId === standardId) {
      setSelectedStandardId(null);
    }
    toast({ title: t.standardDeleted });
    fetchData(); // Refetch data
  };

  const handleOpenAddItemDialog = () => {
    if (!selectedStandardId) return;
    setEditingItem(null);
    itemForm.reset({ itemCode: "", itemText: "", criteria: "", standardId: selectedStandardId, unit: "", standardQuantity: undefined, toleranceOperator: undefined, toleranceValue: undefined });
    setIsItemDialogOpen(true);
  };

  const handleOpenEditItemDialog = (item: MaintenanceStandardItem) => {
    setEditingItem(item);
    itemForm.reset(item);
    setIsItemDialogOpen(true);
  };
  
  const handleResetItemForm = () => {
    itemForm.reset({ 
        itemCode: "", 
        itemText: "", 
        criteria: "", 
        standardId: selectedStandardId || "", 
        unit: "", 
        standardQuantity: undefined, 
        toleranceOperator: undefined, 
        toleranceValue: undefined 
    });
  };

  const onSubmitItem = async (data: z.infer<typeof itemSchema>) => {
    if (editingItem) {
      const updatedItem = { ...editingItem, ...data };
      await updateMaintenanceStandardItem(updatedItem as any);
      toast({ title: t.itemUpdated });
    } else {
      if (itemsData.some(i => i.itemCode === data.itemCode && i.standardId === data.standardId)) {
        toast({ variant: "destructive", title: t.errorCodeExists(data.itemCode!) });
        return;
      }
      await addMaintenanceStandardItem(data as Omit<MaintenanceStandardItem, 'id'>);
      toast({ title: t.itemAdded });
    }
    setIsItemDialogOpen(false);
    fetchData(); // Refetch data
  };
  
  const handleDeleteItem = async (itemId: string) => {
    await deleteMaintenanceStandardItem(itemId);
    toast({ title: t.itemDeleted });
    fetchData(); // Refetch data
  };

  const handleUndo = async () => {
    const success = await undoLastChange('Maintenance Standard');
    if (success) {
      toast({ title: t.undoSuccess });
      fetchData(); // Refresh data after undo
    } else {
      toast({ title: t.undoNothing, variant: "default" });
    }
  };
  
  const selectedStandardForDialog = standardsData.find(std => std.id === selectedStandardId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline text-primary flex items-center">
          <IconListChecks className="mr-3 h-8 w-8" /> {t.pageTitle}
        </h1>
        <Button variant="outline" size="sm" onClick={handleUndo}>
          <Undo2 className="mr-2 h-4 w-4" />
          {t.undoLastChange}
        </Button>
      </div>

      <Dialog open={isStandardDialogOpen} onOpenChange={setIsStandardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStandard ? t.editStandard : t.addStandard}</DialogTitle>
            <DialogDescription>{editingStandard ? t.editStandardDialogDescription(editingStandard.name) : t.addStandardDialogDescription}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 pr-3">
            <Form {...standardForm}>
              <form onSubmit={standardForm.handleSubmit(onSubmitStandard)} className="space-y-4 py-2 pr-2">
                 <FormField
                  control={standardForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.standardName_vi}</FormLabel>
                      <Select
                        onValueChange={(subsystemId) => {
                          const selected = subsystems.find(s => s.id === subsystemId);
                          if (selected) {
                            standardForm.setValue('name', selected.label.vi, { shouldValidate: true });
                            standardForm.setValue('name_en', selected.label.en || '', { shouldValidate: true });
                          }
                        }}
                        value={subsystems.find(s => s.label.vi === field.value)?.id || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.subsystemSelectPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subsystems.map(sub => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.label.vi}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={standardForm.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="standard_name_en">{t.standardName_en}</FormLabel>
                      <FormControl>
                        <Input id="standard_name_en" {...field} value={field.value ?? ""} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={standardForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="standard_description">{t.standardDescription}</FormLabel>
                      <FormControl>
                        <Textarea id="standard_description" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={standardForm.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.frequencyLabel}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || 'general'}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t.frequencyPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MAINTENANCE_FREQUENCIES.map(freq => (
                                <SelectItem key={freq.id} value={freq.id}>{freq.label[locale]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {watchedFrequency !== 'general' && (
                       <FormField
                          control={standardForm.control}
                          name="scheduledTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.timeLabel}</FormLabel>
                              <FormControl><Input type="time" placeholder={t.timePlaceholder} {...field} value={field.value || ""} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )}
                 </div>
                <FormField
                  control={standardForm.control}
                  name="locationIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t.locationLabel}</FormLabel>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <FormControl>
                                  <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                      {field.value && field.value.length > 0
                                          ? t.locationsSelected(field.value.length)
                                          : t.locationPlaceholder
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={standardForm.control}
                  name="recipientId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.recipientLabel}</FormLabel>
                         <Select
                            onValueChange={(value) => field.onChange(value === NO_RECIPIENT_VALUE ? undefined : value)}
                            value={field.value || NO_RECIPIENT_VALUE}
                          >
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder={t.recipientPlaceholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={NO_RECIPIENT_VALUE}>{t.noRecipientSelected}</SelectItem>
                            {users.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsStandardDialogOpen(false)}>{t.cancel}</Button>
                  <Button type="submit">{t.save}</Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
       <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? t.editItem : t.addItem}</DialogTitle>
            <DialogDescription>
              {editingItem ? t.editItemDialogDescription(editingItem.itemText) : t.addItemDialogDescription(selectedStandardForDialog?.name || null)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] p-1 pr-3">
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(onSubmitItem)} className="space-y-4 py-2 pr-2">
              <FormField
                control={itemForm.control}
                name="standardId"
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <FormField
                control={itemForm.control}
                name="itemText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="item_text">{t.itemText}</FormLabel>
                    <FormControl>
                      <Textarea id="item_text" placeholder={t.itemTextPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={itemForm.control}
                name="itemCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="item_code">{t.itemCode}</FormLabel>
                    <FormControl>
                      <Input id="item_code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="item_criteria">{t.itemCriteria}</FormLabel>
                    <FormControl>
                      <Textarea id="item_criteria" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="item_unit">{t.itemUnit}</FormLabel>
                    <FormControl><Input id="item_unit" placeholder={t.itemUnitPlaceholder} {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={cn("space-y-4 rounded-md border p-4", !watchedUnit && 'hidden')}>
                 <h4 className="text-sm font-medium">{t.quantitativeCheck}</h4>
                 <FormField
                    control={itemForm.control}
                    name="standardQuantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.itemStandardQuantity}</FormLabel>
                            <FormControl><Input type="number" placeholder={t.itemStandardQuantityPlaceholder} {...field} value={field.value ?? ""} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={itemForm.control}
                        name="toleranceOperator"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.itemToleranceOperator}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder={t.itemToleranceOperatorPlaceholder} /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {TOLERANCE_OPERATORS.map(op => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={itemForm.control}
                        name="toleranceValue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t.itemToleranceValue}
                                    {watchedToleranceOperator === '±' && ' (%)'}
                                </FormLabel>
                                <FormControl><Input type="number" placeholder={t.itemToleranceValuePlaceholder} {...field} value={field.value ?? ""} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsItemDialogOpen(false)}>{t.cancel}</Button>
                 <Button type="button" variant="outline" onClick={handleResetItemForm}>
                    <RefreshCcw className="mr-2 h-4 w-4"/>
                    {t.resetFormButton}
                </Button>
                <Button type="submit">{t.save}</Button>
              </DialogFooter>
            </form>
          </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle>{t.standardsTitle}</CardTitle>
            <CardDescription>{t.standardsDescription}</CardDescription>
            <div className="pt-2 flex gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder={t.searchStandard} 
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>
                <Button size="sm" variant="outline" onClick={handleOpenAddStandardDialog} className="shrink-0">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t.addStandard}
                </Button>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="outline" asChild className="w-full">
                <Link href="/admin/maintenance-standards/import">
                  <UploadCloud className="mr-2 h-4 w-4" /> {t.importStandards}
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh_-_320px)] pr-3">
              {filteredStandards.length > 0 ? (
                <div className="space-y-2">
                  {filteredStandards.map((std) => {
                    const frequency = MAINTENANCE_FREQUENCIES.find(
                      (f) => f.id === std.frequency
                    );
                    const frequencyLabel = frequency ? frequency.label[locale] : "";
                    const recipient = users.find(u => u.id === std.recipientId);
                    return (
                      <div
                        key={std.id}
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-lg border p-3 transition-colors cursor-pointer",
                          selectedStandardId === std.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedStandardId(std.id)}
                      >
                        <div className="flex-grow">
                          <p className="font-semibold">
                            {std.name}
                            {frequencyLabel &&
                              frequency && frequency.id !== "general" &&
                              ` (${frequencyLabel})`}
                          </p>
                          <p
                            className={cn(
                              "text-xs text-muted-foreground whitespace-normal",
                              selectedStandardId === std.id && "text-primary-foreground/80"
                            )}
                          >
                            {std.description || "N/A"}
                          </p>
                          {(std.locationIds && std.locationIds.length > 0) && (
                            <div className="flex items-center text-xs mt-1" onClick={(e) => e.stopPropagation()}>
                                <MapPin className={cn("mr-1.5 h-3.5 w-3.5", selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")} />
                                <span className={cn(selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                    {std.locationIds.map(locId => locations.find(l => l.id === locId)?.label || locId).join(', ')}
                                </span>
                            </div>
                          )}
                          {std.scheduledTime && (
                             <div className="flex items-center text-xs mt-1" onClick={(e) => e.stopPropagation()}>
                                <Clock className={cn("mr-1.5 h-3.5 w-3.5", selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")} />
                                <span className={cn(selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                    {std.scheduledTime}
                                </span>
                            </div>
                          )}
                          {recipient && (
                            <div className="flex items-center text-xs mt-1" onClick={(e) => e.stopPropagation()}>
                                <UserIcon className={cn("mr-1.5 h-3.5 w-3.5", selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")} />
                                <span className={cn(selectedStandardId === std.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                                    {recipient.name}
                                </span>
                            </div>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            title={t.editStandard}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditStandardDialog(std);
                            }}
                            className={cn("h-8 w-8", selectedStandardId === std.id && "hover:bg-primary-foreground/10 hover:text-primary-foreground")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={t.deleteStandard}
                                className={cn(
                                  "h-8 w-8 text-destructive",
                                  selectedStandardId === std.id ? "hover:bg-destructive/80 hover:text-destructive-foreground" : "hover:bg-destructive hover:text-destructive-foreground"
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogDescription>{t.confirmDeleteStandardMsg}</AlertDialogDescription>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteStandard(std.id)}>
                                  {t.delete}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                 <p className="text-sm text-muted-foreground text-center py-4">{t.noStandards}</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>{t.itemsTitle} {selectedStandardId && standardsData.find(ts => ts.id === selectedStandardId) ? `: ${standardsData.find(ts => ts.id === selectedStandardId)?.name}` : ''}</CardTitle>
                    <CardDescription>
                    {selectedStandardId ? `${itemsForSelectedStandard.length} ${locale === 'vi' ? 'hạng mục' : 'items'}` : t.selectStandardPrompt}
                    </CardDescription>
                </div>
                {selectedStandardId && (
                    <Button size="sm" onClick={handleOpenAddItemDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" /> {t.addItem}
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedStandardId ? (
              <ScrollArea className="h-[calc(100vh_-_280px)]">
                {itemsForSelectedStandard.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.itemCode}</TableHead>
                      <TableHead>{t.itemText}</TableHead>
                      <TableHead>{t.itemCriteria}</TableHead>
                      <TableHead>{t.itemUnit}</TableHead>
                      <TableHead>{t.itemStandardQuantity}</TableHead>
                      <TableHead className="text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsForSelectedStandard.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.itemCode}</TableCell>
                        <TableCell className="whitespace-normal">{item.itemText}</TableCell>
                        <TableCell className="whitespace-normal text-xs text-muted-foreground">{item.criteria || "N/A"}</TableCell>
                        <TableCell>{item.unit || "N/A"}</TableCell>
                        <TableCell>{item.standardQuantity ?? "N/A"}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" title={t.editItem} onClick={() => handleOpenEditItemDialog(item)}><Edit className="h-4 w-4"/></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" title={t.deleteItem} className="text-destructive hover:text-destructive-foreground hover:bg-destructive"><Trash2 className="h-4 w-4"/></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                                    <AlertDialogDescription>{t.confirmDeleteItemMsg}</AlertDialogDescription>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>{t.delete}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                 ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">{t.noItemsForStandard}</p>
                )}
              </ScrollArea>
            ) : (
              <div className="h-[calc(100vh_-_280px)] flex items-center justify-center">
                <p className="text-muted-foreground">{t.selectStandardPrompt}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
