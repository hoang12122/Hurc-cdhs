

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Search, Filter, Edit, FilePlus as FilePlusIcon, RefreshCw, UploadCloud, AlertTriangle, AlertCircle, Info, FileDown, Trash2, Undo2, FileWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    type DnfDocument,
    DNF_STATUSES,
    DNF_HAZARD_LEVELS,
    ROLE_L2_TECHNICIAN,
    ROLE_L3_SPECIALIST,
    ROLE_SUPER_ADMIN,
    ROLE_ADMIN_PKTAT,
    DNF_METHODS_OF_DETECTION,
    type UserRole,
    type Subsystem,
    type PatrolLocation,
    type ResponsibleUnit,
    type User
} from "@/lib/constants";
import { getDnfsPaginated, deleteMockDnf } from "@/lib/actions/dnf.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { getSubsystems, getLocations, getResponsibleUnits } from "@/lib/actions/category.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { hasPermission } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/auth-context";

const ROWS_PER_PAGE = 20;

const translations = {
  vi: {
    pageTitle: "Quản lý Sự cố (DNF)",
    pageDescription: "Theo dõi và quản lý các sự cố và khiếm khuyết của hệ thống.",
    searchPlaceholder: "Tìm ID, Mô tả, Vị trí...",
    filterStatus: "Lọc Trạng thái",
    filterLocation: "Lọc Vị trí",
    filterBySubsystem: "Lọc theo Hệ thống",
    filterHazardLevel: "Lọc Mức độ Mối nguy",
    filterPriority: "Lọc theo Ưu tiên",
    priorityLow: "Thấp",
    priorityMedium: "Trung bình",
    priorityHigh: "Cao",
    allStatuses: "Tất cả Trạng thái",
    allLocations: "Tất cả Vị trí",
    allSubsystems: "Tất cả Hệ thống",
    allHazardLevels: "Tất cả Mức độ Mối nguy",
    newDnf: "Tạo Sự cố (DNF)",
    importDnf: "Nhập DNF",
    idHeader: "ID Sự cố",
    descriptionHeader: "Mô tả",
    locationHeader: "Vị trí",
    assignedToHeader: "Giao cho",
    priorityHeader: "Ưu tiên",
    statusHeader: "Trạng thái",
    actionsHeader: "Hành động",
    noDnfs: "Không có Báo cáo sự cố (DNF) nào phù hợp.",
    startDate: "Từ ngày (Xảy ra)",
    endDate: "Đến ngày (Xảy ra)",
    clearFilters: "Xóa bộ lọc",
    loadingDnfs: "Đang tải danh sách DNF...",
    refresh: "Làm mới",
    filter: "Lọc",
    exportReportButton: "Xuất Báo cáo",
    exportSuccessTitle: "Xuất thành công",
    exportSuccessDesc: (count: number) => `Đã xuất ${count} sự cố.`,
    exportNoDataTitle: "Không có dữ liệu",
    exportNoDataDesc: "Không có sự cố nào để xuất.",
    csvHeaders: {
        id: "ID Sự cố",
        failureReportNo: "Số Báo cáo HTC",
        locationOfFailure: "Vị trí",
        failedComponentEquipmentLRUTrainNumber: "Thiết bị Lỗi",
        subsystem: "Hệ thống",
        descriptionOfFailure: "Mô tả Sự cố",
        staffWhoIdentifiedFailure: "Người Phát Hiện",
        dateTimeOfFailureOccurrence: "Ngày Giờ Xảy Ra (ISO)",
        methodOfFailureDetection: "PP Phát Hiện",
        hazardLevel: "Mức Độ Mối Nguy",
        status: "Trạng Thái",
        attachments: "Đính kèm (Tên tệp)",
        createdById: "ID Người tạo",
        createdAt: "Ngày Tạo (ISO)",
        updatedAt: "Ngày Cập nhật (ISO)",
        assignedTo: "Giao cho",
        priority: "Ưu tiên",
        resolutionDetails: "Chi tiết khắc phục"
    },
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    undoLastChange: "Hoàn tác",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng cho DNF.",
    undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
    deleteDnf: "Xóa sự cố",
    deleteSuccessTitle: "Xóa thành công",
    confirmDeleteTitle: "Xác nhận xóa sự cố",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa sự cố #${id}? Hành động này không thể hoàn tác.`,
    deleteSuccessDesc: (id: string) => `Sự cố #${id} đã được xóa.`,
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    pageInfo: (page: number, total: number) => `Trang ${page} / ${total}`,
  },
  en: {
    pageTitle: "Incident Management (DNF)",
    pageDescription: "Track and manage all system incidents and defects.",
    searchPlaceholder: "Search ID, Description, Location...",
    filterStatus: "Filter by Status",
    filterLocation: "Filter by Location",
    filterBySubsystem: "Filter by System",
    filterHazardLevel: "Filter by Hazard Level",
    filterPriority: "Filter by Priority",
    priorityLow: "Low",
    priorityMedium: "Medium",
    priorityHigh: "High",
    allStatuses: "All Statuses",
    allLocations: "All Locations",
    allSubsystems: "All Systems",
    allHazardLevels: "All Hazard Levels",
    newDnf: "New Incident (DNF)",
    importDnf: "Import DNF",
    idHeader: "Incident ID",
    descriptionHeader: "Description",
    locationHeader: "Location",
    assignedToHeader: "Assigned To",
    priorityHeader: "Priority",
    statusHeader: "Status",
    actionsHeader: "Actions",
    noDnfs: "No matching Defect Reports (DNF) found.",
    startDate: "From Date (Occurrence)",
    endDate: "To Date (Occurrence)",
    clearFilters: "Clear Filters",
    loadingDnfs: "Loading incidents list...",
    refresh: "Refresh",
    filter: "Filter",
    exportReportButton: "Export Report",
    exportSuccessTitle: "Export Successful",
    exportSuccessDesc: (count: number) => `Exported ${count} incidents.`,
    exportNoDataTitle: "No Data",
    exportNoDataDesc: "There are no incidents to export.",
    csvHeaders: {
        id: "Incident ID",
        failureReportNo: "HTC Report No",
        locationOfFailure: "Location",
        failedComponentEquipmentLRUTrainNumber: "Failed Component",
        subsystem: "System",
        descriptionOfFailure: "Failure Description",
        staffWhoIdentifiedFailure: "Identified By",
        dateTimeOfFailureOccurrence: "Occurrence DateTime (ISO)",
        methodOfFailureDetection: "Detection Method",
        hazardLevel: "Hazard Level",
        status: "Status",
        attachments: "Attachments (Filenames)",
        createdById: "Creator ID",
        createdAt: "Created At (ISO)",
        updatedAt: "Updated At (ISO)",
        assignedTo: "Assigned To",
        priority: "Priority",
        resolutionDetails: "Resolution Details",
    },
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    undoLastChange: "Undo",
    undoSuccess: "Successfully undid the last change for DNFs.",
    undoNothing: "No recent changes to undo.",
    deleteDnf: "Delete Incident",
    deleteSuccessTitle: "Delete Successful",
    confirmDeleteTitle: "Confirm Incident Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete incident #${id}? This action cannot be undone.`,
    deleteSuccessDesc: (id: string) => `Incident #${id} has been deleted.`,
    previousPage: "Previous",
    nextPage: "Next",
    pageInfo: (page: number, total: number) => `Page ${page} of ${total}`,
  }
};

function getDnfStatusBadgeVariant(status: DnfDocument['status']): "default" | "secondary" | "destructive" | "outline" | "accent" {
  switch (status) {
    case "Mới": return "outline";
    case "Đánh giá": return "secondary";
    case "Xử lý": return "default";
    case "Phản hồi": return "accent";
    case "Đóng": return "default";
    case "Hủy": return "destructive";
    default: return "outline";
  }
}

function getPriorityBadgeVariant(priority?: "Cao" | "Trung bình" | "Thấp"): "destructive" | "secondary" | "default" {
    if (priority === "Cao") return "destructive";
    if (priority === "Trung bình") return "secondary";
    return "default";
}

interface DnfTableClientProps {
    initialDnfs: DnfDocument[];
    initialTotalPages?: number;
    initialSubsystems: Subsystem[];
    initialLocations: PatrolLocation[];
    initialResponsibleUnits: ResponsibleUnit[];
    initialUsers: User[];
}

export function DnfTableClient({ initialDnfs, initialTotalPages = 1, initialSubsystems, initialLocations, initialResponsibleUnits, initialUsers }: DnfTableClientProps) {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser } = useAuth();

  const [permissions, setPermissions] = React.useState({
    canCreate: false,
    canImport: false,
    canEditAny: false,
    canDeleteAny: false,
    canExport: false,
    canUndo: false,
  });
  const [isMounted, setIsMounted] = React.useState(false);

  const initialStatusFilters = React.useMemo(() => Object.fromEntries(DNF_STATUSES.map(status => [status, true])), []);
  const initialSubsystemFilters = React.useMemo(() => Object.fromEntries(initialSubsystems.map(sub => [sub.id, true])), [initialSubsystems]);
  const initialHazardLevelFilters = React.useMemo(() => Object.fromEntries(DNF_HAZARD_LEVELS.map(level => [level.id, true])), []);

  const [filterStatus, setFilterStatus] = React.useState<Record<string, boolean>>(initialStatusFilters);
  const [filterSubsystem, setFilterSubsystem] = React.useState<Record<string, boolean>>(initialSubsystemFilters);
  const [filterHazardLevel, setFilterHazardLevel] = React.useState<Record<string, boolean>>(initialHazardLevelFilters);
  const [priorityFilter, setPriorityFilter] = React.useState<[number]>([3]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const [dnfs, setDnfs] = React.useState<DnfDocument[]>(initialDnfs);
  const [totalPages, setTotalPages] = React.useState(initialTotalPages);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>(initialSubsystems);
  const [locations, setLocations] = React.useState<PatrolLocation[]>(initialLocations);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const fetchPaginatedData = React.useCallback(async (pageToFetch: number = 1) => {
    setIsLoading(true);
    try {
        const reqStatuses = Object.keys(filterStatus).filter(k => filterStatus[k]);
        const reqSubsystems = Object.keys(filterSubsystem).filter(k => filterSubsystem[k]);
        const reqHazards = Object.keys(filterHazardLevel).filter(k => filterHazardLevel[k]);

        const response = await getDnfsPaginated({
            page: pageToFetch,
            pageSize: ROWS_PER_PAGE,
            searchTerm: searchTerm || undefined,
            statuses: Object.keys(filterStatus).length === reqStatuses.length ? undefined : reqStatuses,
            subsystems: Object.keys(filterSubsystem).length === reqSubsystems.length ? undefined : reqSubsystems,
            assignedSubsystems: (currentUser?.role === ROLE_L2_TECHNICIAN && currentUser?.assignedSubsystems) ? currentUser.assignedSubsystems : undefined,
            hazardLevels: Object.keys(filterHazardLevel).length === reqHazards.length ? undefined : reqHazards,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            priorities: priorityFilter,
        });

        setDnfs(response.data);
        setTotalPages(response.metadata.pages);
        setCurrentPage(pageToFetch);
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch paginated data.'});
    } finally {
        setIsLoading(false);
    }
  }, [filterStatus, filterSubsystem, filterHazardLevel, startDate, endDate, priorityFilter, searchTerm, currentUser, toast]);

  const refreshData = React.useCallback(async () => {
    setIsLoading(true);
    try {
        const [subsystemData, locationData] = await Promise.all([getSubsystems(), getLocations()]);
        setSubsystems(subsystemData);
        setLocations(locationData);
        await fetchPaginatedData(currentPage);
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch list data.'});
    } finally {
        setIsLoading(false);
    }
  }, [fetchPaginatedData, currentPage, toast]);

  React.useEffect(() => {
    setIsMounted(true);
    const checkPermissions = async () => {
      if (!isMounted) return;
      const create = await hasPermission('dnf:create');
      const importPerm = await hasPermission('dnf:import');
      const editAny = await hasPermission('dnf:edit_all');
      const deleteAny = await hasPermission('dnf:delete');
      const exportPerm = await hasPermission('dnf:view_all');
      
      setPermissions({
        canCreate: create,
        canImport: importPerm,
        canEditAny: editAny,
        canDeleteAny: deleteAny,
        canExport: exportPerm,
        canUndo: currentUser?.role === ROLE_SUPER_ADMIN || currentUser?.role === ROLE_ADMIN_PKTAT || currentUser?.role === ROLE_L3_SPECIALIST,
      });
    };
    checkPermissions();
  }, [isMounted, currentUser]);

  React.useEffect(() => {
      if (searchParams.get('refresh')) {
          refreshData();
          const newUrl = window.location.pathname;
          router.replace(newUrl, { scroll: false });
      }
  }, [searchParams, refreshData, router]);


  const canCreateDnf = permissions.canCreate;
  const canImportDnf = permissions.canImport;
  const canEditAnyDnfPermission = permissions.canEditAny;
  const canDeleteAnyDnfPermission = permissions.canDeleteAny;
  const canExportDnfReport = permissions.canExport;
  const canUndoDnfChange = permissions.canUndo;

  const canEditSpecificDnf = (dnf: DnfDocument, currentUserRole: UserRole) => {
      if (canEditAnyDnfPermission) return true;
      
      switch (currentUserRole) {
          case ROLE_L3_SPECIALIST:
            return dnf.status !== "Đóng" && dnf.status !== "Hủy";
          case ROLE_L2_TECHNICIAN:
            return dnf.status === "Xử lý";
          default:
              return false;
      }
  };

  const canUserDeleteDnf = (dnf: DnfDocument, currentUserRole: UserRole) => {
    return (currentUserRole === ROLE_SUPER_ADMIN || currentUserRole === ROLE_ADMIN_PKTAT) && permissions.canDeleteAny;
  };

  const getLocationLabel = React.useCallback((locationId: string) => {
    if (!locationId) return '';
    return locationId.split(',').map(id => locations.find(l => l.id === id)?.label || id).join(', ');
  }, [locations]);

  React.useEffect(() => {
     if (!isMounted) return;
     const timer = setTimeout(() => {
         fetchPaginatedData(1);
     }, 400);
     return () => clearTimeout(timer);
  }, [filterStatus, filterSubsystem, filterHazardLevel, searchTerm, startDate, endDate, priorityFilter, fetchPaginatedData, isMounted]);

  const clearAllFilters = React.useCallback(() => {
    setSearchTerm("");
    setFilterStatus(initialStatusFilters);
    setFilterSubsystem(initialSubsystemFilters);
    setFilterHazardLevel(initialHazardLevelFilters);
    setPriorityFilter([3]);
    setStartDate("");
    setEndDate("");
  }, [initialStatusFilters, initialSubsystemFilters, initialHazardLevelFilters]);

  const handleDeleteDnf = async (dnfId: string) => {
    await deleteMockDnf(dnfId);
    refreshData();
    toast({
      title: t.deleteSuccessTitle,
      description: t.deleteSuccessDesc(dnfId),
    });
  };
  
  const escapeCsvCell = (cellData: any): string => {
    const stringData = String(cellData == null ? "" : cellData);
    if (stringData.includes(",") || stringData.includes("\"") || stringData.includes("\n")) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };
  
  const handleExportCsv = () => {
    if (dnfs.length === 0) {
      toast({
        title: t.exportNoDataTitle,
        description: t.exportNoDataDesc,
        variant: "default"
      });
      return;
    }

    const headers = Object.values(t.csvHeaders);

    const rows = dnfs.map(dnf => {
      const locationLabelExp = getLocationLabel(dnf.locationOfFailure);
      const subsystemLabels = dnf.subsystemIds?.map(id => subsystems.find(s => s.id === id)?.label[locale] || id).join(', ');
      const detectionMethodLabelExp = DNF_METHODS_OF_DETECTION.find(m => m.id === dnf.methodOfFailureDetection)?.label[locale] || dnf.methodOfFailureDetection;
      const hazardLevelLabel = DNF_HAZARD_LEVELS.find(hl => hl.id === dnf.hazardLevelId)?.label[locale] || dnf.hazardLevelId || "N/A";
      const attachmentsString = dnf.attachments?.map(att => att.name).join('; ') || "";


      return [
        dnf.id,
        dnf.failureReportNo || "",
        locationLabelExp,
        dnf.failedComponentEquipmentLRUTrainNumber || "",
        subsystemLabels,
        dnf.descriptionOfFailure,
        dnf.staffWhoIdentifiedFailure,
        dnf.dateTimeOfFailureOccurrence,
        detectionMethodLabelExp,
        hazardLevelLabel,
        dnf.status,
        attachmentsString,
        dnf.createdById,
        dnf.createdAt,
        dnf.updatedAt,
        dnf.assignedTo || "",
        dnf.priority || "",
        dnf.resolutionDetails || ""
      ].map(escapeCsvCell);
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
        + headers.join(",") + "\n"
        + rows.map(r => r.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const currentDate = new Date().toISOString().split('T')[0];
    link.setAttribute("download", `DNF_Report_${currentDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: t.exportSuccessTitle,
        description: t.exportSuccessDesc(dnfs.length)
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <FileWarning className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageDescription}</p>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end md:gap-4">
              <div className="flex items-end gap-4 flex-grow flex-wrap">
                <div className="relative min-w-[250px] flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t.searchPlaceholder}
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    suppressHydrationWarning
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div>
                    <Label htmlFor="startDateDnf" className="text-xs">{t.startDate}</Label>
                    <Input type="date" id="startDateDnf" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9" suppressHydrationWarning />
                  </div>
                      <div>
                    <Label htmlFor="endDateDnf" className="text-xs">{t.endDate}</Label>
                    <Input type="date" id="endDateDnf" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9" suppressHydrationWarning />
                  </div>
                </div>
              </div>
              <div className="md:ml-auto flex items-center gap-2 md:justify-end">
                <Button onClick={refreshData} variant="outline" size="sm" className="h-9 gap-1" disabled={isLoading}>
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                   <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.refresh}</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.filter}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[300px] p-0">
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="status">
                        <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterStatus}</AccordionTrigger>
                        <AccordionContent className="px-1 pt-0 pb-2">
                          <ScrollArea className="h-48">
                            <div className="flex flex-col">
                                {DNF_STATUSES.map(status => (
                                    <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={filterStatus[status] || false}
                                    onCheckedChange={(checked) => setFilterStatus(prev => ({ ...prev, [status]: Boolean(checked) }))}
                                    >{status}</DropdownMenuCheckboxItem>
                                ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="subsystem">
                        <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterBySubsystem}</AccordionTrigger>
                        <AccordionContent className="px-1 pt-0 pb-2">
                          <ScrollArea className="h-48">
                            <div className="flex flex-col">
                                {subsystems.map(sub => (
                                    <DropdownMenuCheckboxItem
                                    key={sub.id}
                                    checked={filterSubsystem[sub.id] ?? false}
                                    onCheckedChange={checked => setFilterSubsystem(prev => ({ ...prev, [sub.id]: Boolean(checked)}))}
                                    >{sub.label[locale]}</DropdownMenuCheckboxItem>
                                ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="hazard">
                        <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterHazardLevel}</AccordionTrigger>
                        <AccordionContent className="px-1 pt-0 pb-2">
                          <ScrollArea className="h-48">
                            <div className="flex flex-col">
                                {DNF_HAZARD_LEVELS.map(level => (
                                    <DropdownMenuCheckboxItem
                                    key={level.id}
                                    checked={filterHazardLevel[level.id] || false}
                                    onCheckedChange={(checked) => setFilterHazardLevel(prev => ({ ...prev, [level.id]: Boolean(checked) }))}
                                    >
                                        <div className="flex items-center gap-2">
                                            <level.icon className="h-4 w-4" />
                                            {level.label[locale]}
                                        </div>
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="priority" className="border-b-0">
                          <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterPriority}</AccordionTrigger>
                          <AccordionContent className="px-4 pt-0 pb-2">
                               <Slider
                                  value={priorityFilter}
                                  onValueChange={(value: number[]) => setPriorityFilter(value as [number])}
                                  max={3}
                                  min={1}
                                  step={1}
                                  className="my-3"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                  <span>{t.priorityLow}</span>
                                  <span>{t.priorityMedium}</span>
                                  <span>{t.priorityHigh}</span>
                              </div>
                          </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">{t.clearFilters}</Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={handleExportCsv} variant="outline" size="sm" className="h-9 gap-1" disabled={!canExportDnfReport}>
                  <FileDown className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.exportReportButton}</span>
              </Button>
              {canImportDnf && (
                  <Button asChild size="sm" className="h-9 gap-1" variant="outline">
                      <Link href="/admin/dnf/import"><UploadCloud className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.importDnf}</span></Link>
                  </Button>
              )}
              {canCreateDnf && (
              <Button asChild size="sm" className="h-9 gap-1">
                  <Link href="/dnf/new"><FilePlusIcon className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.newDnf}</span></Link>
              </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
          ) : (
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>{t.idHeader}</TableHead>
                  <TableHead className="min-w-[200px]">{t.descriptionHeader}</TableHead>
                  <TableHead>{t.locationHeader}</TableHead>
                  <TableHead>{t.assignedToHeader}</TableHead>
                  <TableHead>{t.priorityHeader}</TableHead>
                  <TableHead>{t.statusHeader}</TableHead>
                  <TableHead className="text-right">{t.actionsHeader}</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {dnfs.map((dnf) => {
                  const userCanDeleteThisDnf = canUserDeleteDnf(dnf, currentUser?.role as UserRole);
                  return (
                      <TableRow key={dnf.id}>
                      <TableCell className="font-medium font-mono text-xs">
                          <Link href={`/dnf/${dnf.id}`} className="hover:underline text-primary">
                          {dnf.id}
                          </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-xs">{dnf.descriptionOfFailure}</TableCell>
                      <TableCell>{getLocationLabel(dnf.locationOfFailure)}</TableCell>
                      <TableCell>{dnf.assignedTo || "N/A"}</TableCell>
                      <TableCell>
                          {dnf.priority ? (
                              <Badge variant={getPriorityBadgeVariant(dnf.priority)}>{dnf.priority}</Badge>
                          ) : "N/A"}
                      </TableCell>
                      <TableCell>
                          <Badge variant={getDnfStatusBadgeVariant(dnf.status)}>{dnf.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" asChild title="Chỉnh sửa" disabled={!canEditSpecificDnf(dnf, currentUser?.role as UserRole)}><Link href={`/dnf/${dnf.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                              {userCanDeleteThisDnf && (
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title={t.deleteDnf}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                                  <AlertDialogDescription>{t.confirmDeleteMsg(dnf.id)}</AlertDialogDescription>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteDnf(dnf.id)}>{t.confirmDelete}</AlertDialogAction>
                                  </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                              )}
                          </div>
                      </TableCell>
                      </TableRow>
                  );
                  })}
                  {dnfs.length === 0 && !isLoading && (
                  <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">{t.noDnfs}</TableCell>
                  </TableRow>
                  )}
              </TableBody>
              </Table>
          )}
        </CardContent>
         {totalPages > 1 && (
          <CardFooter>
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPaginatedData(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                {t.previousPage}
              </Button>
              <span>{t.pageInfo(currentPage, totalPages)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPaginatedData(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
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

