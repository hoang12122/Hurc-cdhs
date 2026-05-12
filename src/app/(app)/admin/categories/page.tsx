
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, SlidersHorizontal, Building2, Undo2, MapPin } from "lucide-react";
import { MOCK_CURRENT_USER, ROLE_ADMIN_PKTAT, type ResponsibleUnit, type Subsystem, type PatrolLocation } from "@/lib/constants";
import { 
    addResponsibleUnit, updateResponsibleUnit, deleteResponsibleUnit, getResponsibleUnits,
    addSubsystem, updateSubsystem, deleteSubsystem, getSubsystems,
    addLocation, updateLocation, deleteLocation, getLocations
} from "@/lib/actions/category.actions";
import { undoLastChange } from '@/lib/actions/system.actions';
import { useLanguage } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasPermission } from "@/lib/auth";


// Responsible Unit Component
// ============================================================================

const unitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên đơn vị không được để trống."),
});

const unitTranslations = {
  vi: {
    addUnit: "Thêm Đơn vị Mới", editUnit: "Sửa Đơn vị", deleteUnit: "Xóa Đơn vị",
    nameHeader: "Tên Đơn vị/Cá nhân", actionsHeader: "Hành động", noUnits: "Không có đơn vị nào.",
    save: "Lưu", cancel: "Hủy", confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteMsg: (name: string) => `Bạn có chắc chắn muốn xóa đơn vị "${name}" không?`,
    unitAdded: "Đã thêm đơn vị thành công!", unitUpdated: "Đã cập nhật đơn vị thành công!",
    unitDeleted: "Đã xóa đơn vị thành công!", errorNameExists: (name: string) => `Tên đơn vị "${name}" đã tồn tại.`,
    addUnitDialogTitle: "Thêm Đơn vị Mới", editUnitDialogTitle: "Chỉnh sửa Đơn vị",
  },
  en: {
    addUnit: "Add New Unit", editUnit: "Edit Unit", deleteUnit: "Delete Unit",
    nameHeader: "Unit/Person Name", actionsHeader: "Actions", noUnits: "No units found.",
    save: "Save", cancel: "Cancel", confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteMsg: (name: string) => `Are you sure you want to delete the unit "${name}"?`,
    unitAdded: "Unit added successfully!", unitUpdated: "Unit updated successfully!",
    unitDeleted: "Unit deleted successfully!", errorNameExists: (name: string) => `Unit name "${name}" already exists.`,
    addUnitDialogTitle: "Add New Unit", editUnitDialogTitle: "Edit Unit",
  },
};

function ResponsibleUnitsManager() {
  const { locale } = useLanguage();
  const t = unitTranslations[locale];
  const { toast } = useToast();
  const [units, setUnits] = React.useState<ResponsibleUnit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<ResponsibleUnit | null>(null);

  const fetchData = React.useCallback(async () => {
    const data = await getResponsibleUnits();
    setUnits(data);
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const form = useForm<z.infer<typeof unitSchema>>({
    resolver: zodResolver(unitSchema),
    defaultValues: { name: "" },
  });

  const handleOpenAddDialog = () => {
    setEditingUnit(null);
    form.reset({ name: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (unit: ResponsibleUnit) => {
    setEditingUnit(unit);
    form.reset(unit);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof unitSchema>) => {
    if (editingUnit) {
      if (data.name !== editingUnit.name && units.some(u => u.name === data.name)) {
        toast({ variant: "destructive", title: t.errorNameExists(data.name) }); return;
      }
      await updateResponsibleUnit({ ...editingUnit, name: data.name });
      toast({ title: t.unitUpdated });
    } else {
      if (units.some(u => u.name === data.name)) {
        toast({ variant: "destructive", title: t.errorNameExists(data.name) }); return;
      }
      await addResponsibleUnit({ name: data.name });
      toast({ title: t.unitAdded });
    }
    setIsDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (unitId: string) => {
    await deleteResponsibleUnit(unitId);
    toast({ title: t.unitDeleted });
    fetchData();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-end">
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-5 w-5" /> {t.addUnit}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingUnit ? t.editUnitDialogTitle : t.addUnitDialogTitle}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.nameHeader}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t.cancel}</Button>
                            <Button type="submit">{t.save}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.nameHeader}</TableHead>
              <TableHead className="text-right">{t.actionsHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" title={t.editUnit} onClick={() => handleOpenEditDialog(unit)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title={t.deleteUnit} className="text-destructive hover:text-destructive-foreground hover:bg-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>{t.confirmDeleteMsg(unit.name)}</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(unit.id)}>{t.deleteUnit}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {units.length === 0 && (<TableRow><TableCell colSpan={2} className="h-24 text-center">{t.noUnits}</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


// Subsystem Component
// ============================================================================

const subsystemSchema = z.object({
  id: z.string().min(1, "ID không được để trống. Nên dùng chữ không dấu, không khoảng trắng, ví dụ: 'power_supply'."),
  label_vi: z.string().min(1, "Tên tiếng Việt không được để trống."),
  label_en: z.string().min(1, "Tên tiếng Anh không được để trống."),
});
type SubsystemFormValues = z.infer<typeof subsystemSchema>;

const subsystemTranslations = {
  vi: {
    addUnit: "Thêm Hệ thống", editUnit: "Sửa Hệ thống", deleteUnit: "Xóa Hệ thống",
    idHeader: "ID", nameHeaderVI: "Tên (Tiếng Việt)", nameHeaderEN: "Tên (Tiếng Anh)",
    actionsHeader: "Hành động", noUnits: "Không có hệ thống nào.", save: "Lưu", cancel: "Hủy",
    confirmDeleteTitle: "Xác nhận Xóa", confirmDeleteMsg: (name: string) => `Bạn có chắc chắn muốn xóa hệ thống "${name}" không?`,
    unitAdded: "Đã thêm hệ thống thành công!", unitUpdated: "Đã cập nhật hệ thống thành công!",
    unitDeleted: "Đã xóa hệ thống thành công!", errorIdExists: (id: string) => `ID "${id}" đã tồn tại.`,
    addUnitDialogTitle: "Thêm Hệ thống Mới", editUnitDialogTitle: "Chỉnh sửa Hệ thống",
  },
  en: {
    addUnit: "Add New System", editUnit: "Edit System", deleteUnit: "Delete System",
    idHeader: "ID", nameHeaderVI: "Name (Vietnamese)", nameHeaderEN: "Name (English)",
    actionsHeader: "Actions", noUnits: "No systems found.", save: "Save", cancel: "Cancel",
    confirmDeleteTitle: "Confirm Deletion", confirmDeleteMsg: (name: string) => `Are you sure you want to delete the system "${name}"?`,
    unitAdded: "System added successfully!", unitUpdated: "System updated successfully!",
    unitDeleted: "System deleted successfully!", errorIdExists: (id: string) => `ID "${id}" already exists.`,
    addUnitDialogTitle: "Add New System", editUnitDialogTitle: "Edit System",
  },
};

function SubsystemsManager() {
  const { locale } = useLanguage();
  const t = subsystemTranslations[locale];
  const { toast } = useToast();
  const [units, setUnits] = React.useState<Subsystem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Subsystem | null>(null);

  const fetchData = React.useCallback(async () => {
    const data = await getSubsystems();
    setUnits(data);
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const form = useForm<SubsystemFormValues>({
    resolver: zodResolver(subsystemSchema),
    defaultValues: { id: "", label_vi: "", label_en: "" },
  });

  const handleOpenAddDialog = () => {
    setEditingUnit(null);
    form.reset({ id: "", label_vi: "", label_en: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (unit: Subsystem) => {
    setEditingUnit(unit);
    form.reset({ id: unit.id, label_vi: unit.label.vi, label_en: unit.label.en });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: SubsystemFormValues) => {
    const subsystemData: Subsystem = { id: data.id, label: { vi: data.label_vi, en: data.label_en } };
    if (editingUnit) {
      await updateSubsystem(subsystemData);
      toast({ title: t.unitUpdated });
    } else {
      if (units.some(u => u.id === data.id)) {
        toast({ variant: "destructive", title: t.errorIdExists(data.id) }); return;
      }
      await addSubsystem(subsystemData);
      toast({ title: t.unitAdded });
    }
    setIsDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (unitId: string) => {
    await deleteSubsystem(unitId);
    toast({ title: t.unitDeleted });
    fetchData();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-end">
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-5 w-5" /> {t.addUnit}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingUnit ? t.editUnitDialogTitle : t.addUnitDialogTitle}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <FormField control={form.control} name="id" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.idHeader}</FormLabel>
                                <FormControl><Input {...field} disabled={!!editingUnit} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="label_vi" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.nameHeaderVI}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="label_en" render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.nameHeaderEN}</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t.cancel}</Button>
                            <Button type="submit">{t.save}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.idHeader}</TableHead>
              <TableHead>{t.nameHeaderVI}</TableHead>
              <TableHead>{t.nameHeaderEN}</TableHead>
              <TableHead className="text-right">{t.actionsHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-mono text-xs">{unit.id}</TableCell>
                <TableCell>{unit.label.vi}</TableCell>
                <TableCell>{unit.label.en}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" title={t.editUnit} onClick={() => handleOpenEditDialog(unit)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title={t.deleteUnit} className="text-destructive hover:text-destructive-foreground hover:bg-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>{t.confirmDeleteMsg(unit.label[locale])}</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(unit.id)}>{t.deleteUnit}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {units.length === 0 && (<TableRow><TableCell colSpan={4} className="h-24 text-center">{t.noUnits}</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


// Locations Component
// ============================================================================

const locationSchema = z.object({
  id: z.string().min(3, "ID phải có ít nhất 3 ký tự và không chứa dấu cách.").regex(/^[a-z0-9_]+$/, "ID chỉ được chứa chữ thường, số và dấu gạch dưới."),
  label: z.string().min(1, "Tên vị trí không được để trống."),
});
type LocationFormValues = z.infer<typeof locationSchema>;

const locationTranslations = {
  vi: {
    add: "Thêm Vị trí Mới", edit: "Sửa Vị trí", delete: "Xóa Vị trí",
    idHeader: "ID", labelHeader: "Tên Vị trí", actionsHeader: "Hành động",
    noLocations: "Không có vị trí nào.", save: "Lưu", cancel: "Hủy",
    confirmDeleteTitle: "Xác nhận Xóa", confirmDeleteMsg: (name: string) => `Bạn có chắc chắn muốn xóa vị trí "${name}" không?`,
    added: "Đã thêm vị trí thành công!", updated: "Đã cập nhật vị trí thành công!",
    deleted: "Đã xóa vị trí thành công!", errorIdExists: (id: string) => `ID vị trí "${id}" đã tồn tại.`,
    addDialogTitle: "Thêm Vị trí Mới", editDialogTitle: "Chỉnh sửa Vị trí",
  },
  en: {
    add: "Add New Location", edit: "Edit Location", delete: "Delete Location",
    idHeader: "ID", labelHeader: "Location Name", actionsHeader: "Actions",
    noLocations: "No locations found.", save: "Save", cancel: "Cancel",
    confirmDeleteTitle: "Confirm Deletion", confirmDeleteMsg: (name: string) => `Are you sure you want to delete the location "${name}"?`,
    added: "Location added successfully!", updated: "Location updated successfully!",
    deleted: "Location deleted successfully!", errorIdExists: (id: string) => `Location ID "${id}" already exists.`,
    addDialogTitle: "Add New Location", editDialogTitle: "Edit Location",
  },
};

function LocationsManager() {
  const { locale } = useLanguage();
  const t = locationTranslations[locale];
  const { toast } = useToast();
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<PatrolLocation | null>(null);

  const fetchData = React.useCallback(async () => {
    const data = await getLocations();
    setLocations(data);
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { id: "", label: "" },
  });

  const handleOpenAddDialog = () => {
    setEditingLocation(null);
    form.reset({ id: "", label: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (location: PatrolLocation) => {
    setEditingLocation(location);
    form.reset(location);
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: LocationFormValues) => {
    if (editingLocation) {
      await updateLocation(data as PatrolLocation);
      toast({ title: t.updated });
    } else {
      if (locations.some(l => l.id === data.id)) {
        toast({ variant: "destructive", title: t.errorIdExists(data.id) }); return;
      }
      await addLocation(data as PatrolLocation);
      toast({ title: t.added });
    }
    setIsDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (locationId: string) => {
    await deleteLocation(locationId);
    toast({ title: t.deleted });
    fetchData();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-end">
          <Button onClick={handleOpenAddDialog}>
            <PlusCircle className="mr-2 h-5 w-5" /> {t.add}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingLocation ? t.editDialogTitle : t.addDialogTitle}</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField control={form.control} name="id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.idHeader}</FormLabel>
                    <FormControl><Input {...field} disabled={!!editingLocation} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="label" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.labelHeader}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>{t.cancel}</Button>
                  <Button type="submit">{t.save}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.idHeader}</TableHead>
              <TableHead>{t.labelHeader}</TableHead>
              <TableHead className="text-right">{t.actionsHeader}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-mono text-xs">{location.id}</TableCell>
                <TableCell className="font-medium">{location.label}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" title={t.edit} onClick={() => handleOpenEditDialog(location)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title={t.delete} className="text-destructive hover:text-destructive-foreground hover:bg-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>{t.confirmDeleteMsg(location.label)}</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(location.id)}>{t.delete}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {locations.length === 0 && (<TableRow><TableCell colSpan={3} className="h-24 text-center">{t.noLocations}</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


// Main Page Component
// ============================================================================

const pageTranslations = {
    vi: {
        title: "Quản lý Danh mục",
        description: "Quản lý các danh sách dùng chung như Vị trí, Đơn vị chịu trách nhiệm và Hệ thống.",
        locationsTab: "Vị trí",
        responsibleUnitsTab: "Đơn vị Chịu trách nhiệm",
        subsystemsTab: "Hệ thống",
        undoSuccess: "Đã hoàn tác thay đổi cuối cùng thành công.",
        undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
        undoLastChange: "Hoàn tác",
        accessDenied: {
          title: "Truy cập bị từ chối",
          description: "Bạn không có quyền truy cập vào chức năng này. Vui lòng liên hệ quản trị viên."
        }
    },
    en: {
        title: "Category Management",
        description: "Manage shared lists like Locations, Responsible Units, and Systems.",
        locationsTab: "Locations",
        responsibleUnitsTab: "Responsible Units",
        subsystemsTab: "Systems",
        undoSuccess: "Successfully undid the last change.",
        undoNothing: "No recent changes to undo.",
        undoLastChange: "Undo",
        accessDenied: {
          title: "Access Denied",
          description: "You do not have permission to access this feature. Please contact an administrator."
        }
    }
}

export default function CategoriesPage() {
    const { locale } = useLanguage();
    const t = pageTranslations[locale];
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'locations';
    const [hasAccess, setHasAccess] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        hasPermission("settings:manage").then(access => {
            setHasAccess(access);
            setIsLoading(false);
        });
    }, []);
    
    if (isLoading) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    if (!hasAccess) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Card className="w-full max-w-md p-8 text-center">
                    <CardTitle className="text-2xl text-destructive mb-4">{t.accessDenied.title}</CardTitle>
                    <CardDescription>{locale === 'vi' ? `Chỉ Quản trị viên cấp cao mới có quyền truy cập trang này.` : `Only Super Administrators can access this page.`}</CardDescription>
                    <Button asChild className="mt-6">
                        <Link href="/dashboard">
                            {locale === 'vi' ? 'Quay lại Bảng điều khiển' : 'Back to Dashboard'}
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }
    
    const handleUndo = async () => {
        let success = await undoLastChange('ResponsibleUnit');
        if (!success) success = await undoLastChange('Subsystem');
        if (!success) success = await undoLastChange('PatrolLocation');

        if (success) {
            toast({ title: t.undoSuccess });
            // This is a simple way to force re-fetch across components.
            // In a more complex app, you might use a state management library.
            router.refresh(); 
        } else {
            toast({ title: t.undoNothing, variant: "default" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
                        <p className="text-muted-foreground">{t.description}</p>
                    </div>
                </div>
                 <Button variant="outline" size="sm" onClick={handleUndo}>
                  <Undo2 className="mr-2 h-4 w-4" />
                  {t.undoLastChange}
                </Button>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
                    <TabsTrigger value="locations">
                        <MapPin className="mr-2 h-4 w-4" />
                        {t.locationsTab}
                    </TabsTrigger>
                    <TabsTrigger value="responsible-units">
                        <Building2 className="mr-2 h-4 w-4" />
                        {t.responsibleUnitsTab}
                    </TabsTrigger>
                    <TabsTrigger value="subsystems">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {t.subsystemsTab}
                    </TabsTrigger>
                </TabsList>
                 <TabsContent value="locations">
                    <LocationsManager />
                </TabsContent>
                <TabsContent value="responsible-units">
                    <ResponsibleUnitsManager />
                </TabsContent>
                <TabsContent value="subsystems">
                    <SubsystemsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
}
