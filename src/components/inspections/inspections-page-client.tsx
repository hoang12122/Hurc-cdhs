
"use client"; 

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Search, Filter, Edit, Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label'; 
import { 
    MOCK_CURRENT_USER, 
    ROLE_ADMIN_PKTAT, 
    ROLE_L2_TECHNICIAN, 
    ROLE_L3_SPECIALIST, 
    INSPECTION_STATUSES,
    LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN
} from "@/lib/constants";
import type { Locale, InspectionDetail, MaintenanceStandard, Subsystem } from "@/lib/types";
import { getInspections, deleteInspection } from "@/lib/actions/inspection.actions";
import { getMaintenanceStandards } from "@/lib/actions/maintenance.actions";
import { getSubsystems } from "@/lib/actions/category.actions";
import { ExportInspectionsButton } from "@/components/inspections/export-inspections-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from 'next/navigation';
import { hasPermission } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const ROWS_PER_PAGE = 20;

const clientComponentTranslations = {
  vi: {
    pageTitle: "Danh sách Kiểm Tra",
    pageDescription: "Quản lý và theo dõi tất cả các đợt kiểm tra.",
    newInspectionButton: "Tạo Kiểm Tra Mới",
    searchPlaceholder: "Tìm kiếm kiểm tra...",
    filterLabel: "Lọc",
    filterByStatus: "Lọc theo Trạng thái",
    filterByInspector: "Lọc theo Người kiểm tra",
    filterByChecklistTemplate: "Lọc theo Mẫu Checklist",
    filterBySubsystem: "Lọc theo Hệ thống con",
    allInspectors: "Tất cả Người kiểm tra",
    allChecklistTemplates: "Tất cả Mẫu Checklist",
    allSubsystems: "Tất cả Hệ thống con",
    startDate: "Từ ngày",
    endDate: "Đến ngày",
    clearFilters: "Xóa bộ lọc",
    idCol: "ID",
    titleCol: "Tiêu đề",
    areaCol: "Khu vực",
    categoryCol: "Mẫu Checklist",
    scheduledDateHeader: "Ngày Bắt đầu",
    dueDateHeader: "Ngày Kết thúc",
    statusCol: "Trạng thái",
    inspectorCol: "Người kiểm tra",
    actionsCol: "Hành động",
    viewDetailsTooltip: "Xem chi tiết",
    editTooltip: "Chỉnh sửa",
    deleteTooltip: "Xóa",
    noData: "Không có dữ liệu kiểm tra.",
    exportCsvButton: "Xuất CSV",
    exportSuccessTitle: "Xuất thành công",
    exportSuccessDesc: (count: number) => `Đã xuất ${count} kiểm tra.`,
    exportNoDataTitle: "Không có dữ liệu",
    exportNoDataDesc: "Không có kiểm tra nào trong bộ lọc hiện tại để xuất.",
    csvHeaders: {
        id: "ID Kiểm tra",
        title: "Tiêu đề",
        area: "Khu vực",
        checklistTemplateName: "Tên Mẫu Checklist",
        date: "Ngày kiểm tra",
        status: "Trạng thái",
        inspector: "Người kiểm tra",
        generalNotes: "Ghi chú chung",
        checklistItemsCount: "Số Hạng mục Checklist",
        findingsCount: "Tổng số Phát hiện"
    },
    deleteSuccessTitle: "Xóa thành công",
    deleteSuccessDesc: (id: string) => `Phiếu kiểm tra ${id} đã được xóa.`,
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa phiếu kiểm tra #${id}?`,
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    inspectionLockedMessage: "Đã duyệt, không thể sửa.",
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    pageInfo: (page: number, total: number) => `Trang ${page} / ${total}`,
  },
  en: {
    pageTitle: "Inspections List",
    pageDescription: "Manage and track all inspections.",
    newInspectionButton: "Create New Inspection",
    searchPlaceholder: "Search inspections...",
    filterLabel: "Filter",
    filterByStatus: "Filter by Status",
    filterByInspector: "Filter by Inspector",
    filterByChecklistTemplate: "Filter by Checklist Template",
    filterBySubsystem: "Filter by Subsystem",
    allInspectors: "All Inspectors",
    allChecklistTemplates: "All Checklist Templates",
    allSubsystems: "All Subsystems",
    startDate: "Start Date",
    endDate: "End Date",
    clearFilters: "Clear Filters",
    idCol: "ID",
    titleCol: "Title",
    areaCol: "Area",
    categoryCol: "Checklist Template",
    scheduledDateHeader: "Start Date",
    dueDateHeader: "Due Date",
    statusCol: "Status",
    inspectorCol: "Inspector",
    actionsCol: "Actions",
    viewDetailsTooltip: "View Details",
    editTooltip: "Edit",
    deleteTooltip: "Delete",
    noData: "No inspection data found.",
    exportCsvButton: "Export CSV",
    exportSuccessTitle: "Export Successful",
    exportSuccessDesc: (count: number) => `Exported ${count} inspections.`,
    exportNoDataTitle: "No Data",
    exportNoDataDesc: "No inspections found in the current filter to export.",
    csvHeaders: {
        id: "Inspection ID",
        title: "Title",
        area: "Area",
        checklistTemplateName: "Checklist Template Name",
        date: "Inspection Date",
        status: "Status",
        inspector: "Inspector",
        generalNotes: "General Notes",
        checklistItemsCount: "Checklist Items Count",
        findingsCount: "Total Findings Count"
    },
    deleteSuccessTitle: "Delete Successful",
    deleteSuccessDesc: (id: string) => `Inspection ${id} has been deleted.`,
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete inspection #${id}?`,
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    inspectionLockedMessage: "Approved, cannot edit.",
    previousPage: "Previous",
    nextPage: "Next",
    pageInfo: (page: number, total: number) => `Page ${page} of ${total}`,
  }
};

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "hoàn thành": return "default";
    case "hoàn thành (có phát hiện)": return "default";
    case "đang thực hiện": return "secondary";
    case "chưa thực hiện": return "outline";
    case "đã xem xét": return "default";
    case "cần bổ sung": return "secondary";
    case "đã duyệt để tạo báo cáo": return "default";
    default: return "outline";
  }
}

interface InspectionsPageClientProps {
  initialInspections: InspectionDetail[];
  initialMaintenanceStandards: MaintenanceStandard[];
}

export function InspectionsPageClient({ initialInspections, initialMaintenanceStandards }: InspectionsPageClientProps) {
  const { locale } = useLanguage(); 
  const t = clientComponentTranslations[locale];
  const { toast } = useToast(); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = MOCK_CURRENT_USER;
  const [isMounted, setIsMounted] = React.useState(false);
  const [inspectionsData, setInspectionsData] = React.useState<InspectionDetail[]>(initialInspections);
  const [maintenanceStandards, setMaintenanceStandards] = React.useState<MaintenanceStandard[]>(initialMaintenanceStandards);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [canCreate, setCanCreate] = React.useState(false);
  const [canDelete, setCanDelete] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    const [inspections, standards, fetchedSubsystems] = await Promise.all([
      getInspections(), 
      getMaintenanceStandards(),
      getSubsystems(),
    ]);
    const sortedData = [...inspections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setInspectionsData(sortedData);
    setMaintenanceStandards(standards);
    setSubsystems(fetchedSubsystems);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    getSubsystems().then(setSubsystems);
    hasPermission('inspections:create').then(setCanCreate);
    hasPermission('inspections:delete').then(setCanDelete);
    if (searchParams.get('refresh')) {
      fetchData();
      const newUrl = window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, fetchData, router]);

  const canEditInspectionInList = (inspection: InspectionDetail) => {
    if (inspection.id.startsWith('INS-HM-')) return true;
    if (currentUser.role === ROLE_ADMIN_PKTAT) return true;
    if (LOCKED_INSPECTION_STATUSES_FOR_NON_ADMIN.includes(inspection.status as any)) return false;
    if (currentUser.role === ROLE_L3_SPECIALIST) return true; 
    if (currentUser.role === ROLE_L2_TECHNICIAN && inspection.status === "Chưa thực hiện") return true;
    return false;
  };
  
  const canDeleteInspection = (inspection: InspectionDetail) => {
    return canDelete;
  };

  const [searchTerm, setSearchTerm] = React.useState("");
  const initialStatusFilters = Object.fromEntries(INSPECTION_STATUSES.map(status => [status, true]));
  const [statusFilters, setStatusFilters] = React.useState<Record<string, boolean>>(initialStatusFilters);
  const [subsystemFilters, setSubsystemFilters] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setSubsystemFilters(Object.fromEntries(subsystems.map(sub => [sub.id, true])));
  }, [subsystems]);

  const MOCK_INSPECTORS = React.useMemo(() => Array.from(new Set(inspectionsData.map(insp => insp.inspector))), [inspectionsData]);
  const [selectedInspector, setSelectedInspector] = React.useState<string>("all");
  const [selectedChecklistTemplate, setSelectedChecklistTemplate] = React.useState<string>("all");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const filteredInspections = React.useMemo(() => {
    let inspectionsToFilter = inspectionsData;

    if (currentUser.role === ROLE_L2_TECHNICIAN && currentUser.assignedSubsystems && currentUser.assignedSubsystems.length > 0) {
        const userSubsystems = currentUser.assignedSubsystems;
        inspectionsToFilter = inspectionsData.filter(insp => {
            const standard = maintenanceStandards.find(std => std.id === insp.checklistTemplateId);
            if (!standard) return false;
            const subsystem = subsystems.find(sub => sub.label.vi === standard.name);
            return subsystem ? userSubsystems.includes(subsystem.id) : false;
        });
    }

    return inspectionsToFilter.filter(inspection => {
      const template = maintenanceStandards.find(tmpl => tmpl.id === inspection.checklistTemplateId);
      const templateName = template?.name || "";
      const subsystem = subsystems.find(sub => sub.label.vi === templateName);
      
      const searchMatch = 
          inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inspection.areaIds || []).join(',').toLowerCase().includes(searchTerm.toLowerCase()) ||
          templateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilters[inspection.status] !== false;
      const subsystemMatch = !subsystem || subsystemFilters[subsystem.id] !== false;
      const inspectorMatch = selectedInspector === "all" || inspection.inspector === selectedInspector;
      const templateMatch = selectedChecklistTemplate === "all" || inspection.checklistTemplateId === selectedChecklistTemplate;
      
      let dateMatch = true;
      if (startDate && inspection.date < startDate) dateMatch = false;
      if (endDate && inspection.date > endDate) dateMatch = false;

      return searchMatch && statusMatch && inspectorMatch && templateMatch && dateMatch && subsystemMatch;
    });
  }, [inspectionsData, maintenanceStandards, searchTerm, statusFilters, selectedInspector, selectedChecklistTemplate, startDate, endDate, currentUser, subsystems, subsystemFilters]);
  
  const clearAllFilters = React.useCallback(() => {
    setSearchTerm("");
    setStatusFilters(initialStatusFilters);
    setSelectedInspector("all");
    setSelectedChecklistTemplate("all");
    setSubsystemFilters(Object.fromEntries(subsystems.map(sub => [sub.id, true])));
    setStartDate("");
    setEndDate("");
  }, [initialStatusFilters, subsystems]);

  const handleActualDeleteInspection = async (inspectionId: string) => {
    await deleteInspection(inspectionId);
    toast({ title: t.deleteSuccessTitle, description: t.deleteSuccessDesc(inspectionId)});
    fetchData(); 
  };

  const totalPages = Math.ceil(filteredInspections.length / ROWS_PER_PAGE);
  const paginatedInspections = filteredInspections.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageDescription}</p>
            </div>
            <div className="flex items-center gap-2">
            {canCreate && (
            <Button asChild>
                <Link href="/inspections/new">
                <PlusCircle className="mr-2 h-5 w-5" />
                {t.newInspectionButton}
                </Link>
            </Button>
            )}
            </div>
        </div>
        <Card className="shadow-lg">
        <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap items-end gap-2">
                <div>
                    <Label htmlFor="startDate" className="text-xs">{t.startDate}</Label>
                    <Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9"/>
                </div>
                    <div>
                    <Label htmlFor="endDate" className="text-xs">{t.endDate}</Label>
                    <Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9"/>
                </div>
            </div>
            <div className="md:ml-auto flex items-center gap-2">
                 <Button onClick={fetchData} variant="outline" size="sm" className="h-9 gap-1" disabled={isLoading}>
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {t.filterLabel}
                    </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[280px]">
                    <DropdownMenuLabel>{t.filterByStatus}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {INSPECTION_STATUSES.map(status => (
                        <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilters[status] || false}
                        onCheckedChange={(checked) => {
                            setStatusFilters(prev => ({ ...prev, [status]: Boolean(checked) }));
                        }}
                        >
                        {status}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                     <DropdownMenuLabel>{t.filterBySubsystem}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {subsystems.map(sub => (
                        <DropdownMenuCheckboxItem
                            key={sub.id}
                            checked={subsystemFilters[sub.id] ?? false}
                            onCheckedChange={checked => setSubsystemFilters(prev => ({ ...prev, [sub.id]: Boolean(checked)}))}
                        >
                            {sub.label[locale]}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{t.filterByInspector}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                    checked={selectedInspector === "all"}
                    onCheckedChange={() => setSelectedInspector("all")}
                    >
                    {t.allInspectors}
                    </DropdownMenuCheckboxItem>
                    {MOCK_INSPECTORS.map(inspector => (
                        <DropdownMenuCheckboxItem
                        key={inspector}
                        checked={selectedInspector === inspector}
                        onCheckedChange={() => setSelectedInspector(inspector)}
                        >
                        {inspector}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{t.filterByChecklistTemplate}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                    checked={selectedChecklistTemplate === "all"}
                    onCheckedChange={() => setSelectedChecklistTemplate("all")}
                    >
                    {t.allChecklistTemplates}
                    </DropdownMenuCheckboxItem>
                    {maintenanceStandards.map(template => (
                        <DropdownMenuCheckboxItem
                        key={template.id}
                        checked={selectedChecklistTemplate === template.id}
                        onCheckedChange={() => setSelectedChecklistTemplate(template.id)}
                        >
                        {template.name}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
                </DropdownMenu>
                <ExportInspectionsButton 
                filteredInspections={filteredInspections}
                maintenanceStandards={maintenanceStandards}
                translations={{
                    exportCsvButton: t.exportCsvButton,
                    exportSuccessTitle: t.exportSuccessTitle,
                    exportSuccessDesc: t.exportSuccessDesc,
                    exportNoDataTitle: t.exportNoDataTitle,
                    exportNoDataDesc: t.exportNoDataDesc,
                    csvHeaders: t.csvHeaders,
                }} 
                locale={locale} 
                />
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">{t.clearFilters}</Button>
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{t.idCol}</TableHead>
                <TableHead>{t.titleCol}</TableHead>
                <TableHead>{t.areaCol}</TableHead>
                <TableHead>{t.scheduledDateHeader}</TableHead>
                <TableHead>{t.dueDateHeader}</TableHead>
                <TableHead>{t.statusCol}</TableHead>
                <TableHead>{t.inspectorCol}</TableHead>
                <TableHead className="text-right">{t.actionsCol}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedInspections.map((inspection) => {
                const isEditable = canEditInspectionInList(inspection);
                const isDeletable = canDeleteInspection(inspection);
                return (
                <TableRow key={inspection.id}>
                    <TableCell className="font-medium font-mono text-xs">
                        <Link href={`/inspections/${inspection.id}`} className="hover:underline text-primary">
                            {inspection.id}
                        </Link>
                    </TableCell>
                    <TableCell>{inspection.title}</TableCell>
                    <TableCell>{(inspection.areaIds || []).join(', ')}</TableCell>
                    <TableCell>{isMounted && inspection.scheduledStartDate ? new Date(inspection.scheduledStartDate).toLocaleDateString(locale) : '...'}</TableCell>
                    <TableCell>{isMounted && inspection.scheduledFinishDate ? new Date(inspection.scheduledFinishDate).toLocaleDateString(locale) : '...'}</TableCell>
                    <TableCell>
                    <Badge variant={getStatusBadgeVariant(inspection.status)}>{inspection.status}</Badge>
                    </TableCell>
                    <TableCell>{inspection.inspector}</TableCell>
                    <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" asChild title={!isEditable ? t.inspectionLockedMessage : t.editTooltip} disabled={!isEditable}>
                        <Link href={`/inspections/${inspection.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive-foreground hover:bg-destructive" 
                                title={t.deleteTooltip} 
                                disabled={!isDeletable}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogDescription>{t.confirmDeleteMsg(inspection.id)}</AlertDialogDescription>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleActualDeleteInspection(inspection.id)}>{t.confirmDelete}</AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    </TableCell>
                </TableRow>
                );
                })}
                {filteredInspections.length === 0 && (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                    {t.noData}
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </CardContent>
         {totalPages > 1 && (
            <CardFooter>
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                >
                {t.previousPage}
                </Button>
                <span>{t.pageInfo(currentPage, totalPages)}</span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                >
                {t.nextPage}
                </Button>
            </div>
            </CardFooter>
        )}
        </Card>
    </div>
  );
}
