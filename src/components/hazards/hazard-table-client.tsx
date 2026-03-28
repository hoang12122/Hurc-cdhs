

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Search, Filter, Edit, FilePlus, RefreshCw, ShieldAlert, FileDown, Trash2, Undo2, UploadCloud, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    type HazardRecord,
    HAZARD_STATUSES,
    HAZARD_RISK_LEVELS,
    HAZARD_SEVERITY_LEVELS,
    HAZARD_LIKELIHOOD_LEVELS,
    ROLE_ADMIN_PKTAT,
    ROLE_L3_SPECIALIST,
    calculateRiskLevelId,
    type UserRole,
} from "@/lib/constants";
import { getHazardRecordsPaginated, deleteHazardRecord } from "@/lib/actions/hazard.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { hasPermission } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/auth-context";


const ROWS_PER_PAGE = 20;

const translations = {
  vi: {
    pageTitle: "Quản lý Mối nguy",
    pageDescription: "Theo dõi, đánh giá và quản lý các mối nguy tiềm ẩn trong hệ thống.",
    searchPlaceholder: "Tìm ID, Mô tả, Vị trí...",
    filterStatus: "Lọc Trạng thái",
    filterRiskLevel: "Lọc Mức độ Rủi ro",
    allStatuses: "Tất cả Trạng thái",
    allRiskLevels: "Tất cả Mức độ Rủi ro",
    newHazard: "Tạo Mối nguy Mới",
    importHazards: "Nhập Mối nguy",
    exportCsv: "Xuất CSV",
    exportPdfButton: "Xuất PDF",
    idHeader: "Mã",
    descriptionHeader: "Mô tả",
    causeHeader: "Nguyên nhân",
    consequenceHeader: "Hệ quả",
    severityHeader: "Mức độ nghiêm trọng",
    likelihoodHeader: "Khả năng",
    riskLevelHeader: "Mức độ Rủi ro",
    controlsHeader: "Biện pháp kiểm soát",
    statusHeader: "Trạng thái xử lý",
    actionsHeader: "Hành động",
    viewDetails: "Xem chi tiết",
    editHazard: "Chỉnh sửa",
    deleteHazard: "Xóa Mối nguy",
    confirmDeleteTitle: "Xác nhận Xóa Mối nguy",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa Mối nguy #${id}? Hành động này không thể hoàn tác.`,
    deleteSuccess: (id: string) => `Mối nguy #${id} đã được xóa thành công.`,
    noHazards: "Không có mối nguy nào phù hợp.",
    startDate: "Từ ngày (Phát hiện)",
    endDate: "Đến ngày (Phát hiện)",
    clearFilters: "Xóa bộ lọc",
    loadingHazards: "Đang tải danh sách mối nguy...",
    refresh: "Làm mới",
    filter: "Lọc",
    notAssessedDisplay: "Chưa ĐG",
    csvHeaders: {
        id: "Mã",
        description: "Mô tả",
        system: "Hệ thống",
        cause: "Nguyên nhân",
        effect: "Hệ quả",
        severity: "Mức độ nghiêm trọng",
        likelihood: "Khả năng",
        riskLevel: "Rủi ro",
        mitigation: "Biện pháp kiểm soát",
        responsible: "Trách nhiệm",
        status: "Trạng thái xử lý"
    },
    mitigationPrefixes: {
      main: "BP chính",
      secondary: "BP bổ sung",
      proposed: "BP đề xuất",
    },
    exportSuccessTitle: "Xuất thành công",
    exportSuccessDesc: (count: number) => `Đã xuất ${count} mối nguy.`,
    exportNoDataTitle: "Không có dữ liệu",
    exportNoDataDesc: "Không có mối nguy nào để xuất.",
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    undoLastChange: "Hoàn tác",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng cho Mối nguy.",
    undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    pageInfo: (page: number, total: number) => `Trang ${page} / ${total}`,
  },
  en: {
    pageTitle: "Hazard Management",
    pageDescription: "Track, assess, and manage potential hazards in the system.",
    searchPlaceholder: "Search ID, Description, Location...",
    filterStatus: "Filter by Status",
    filterRiskLevel: "Filter by Risk Level",
    allStatuses: "All Statuses",
    allRiskLevels: "All Risk Levels",
    newHazard: "New Hazard",
    importHazards: "Import Hazards",
    exportCsv: "Export CSV",
    exportPdfButton: "Export PDF",
    idHeader: "ID",
    descriptionHeader: "Description",
    causeHeader: "Cause",
    consequenceHeader: "Consequence",
    severityHeader: "Severity",
    likelihoodHeader: "Likelihood",
    riskLevelHeader: "Risk Level",
    controlsHeader: "Control Measures",
    statusHeader: "Status",
    actionsHeader: "Actions",
    viewDetails: "View Details",
    editHazard: "Edit",
    deleteHazard: "Delete Hazard",
    confirmDeleteTitle: "Confirm Hazard Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete Hazard #${id}? This action cannot be undone.`,
    deleteSuccess: (id: string) => `Hazard #${id} has been deleted successfully.`,
    noHazards: "No matching hazards found.",
    startDate: "From Date (Identification)",
    endDate: "To Date (Identification)",
    clearFilters: "Clear Filters",
    loadingHazards: "Loading hazards list...",
    refresh: "Refresh",
    filter: "Filter",
    notAssessedDisplay: "N/A",
    csvHeaders: {
        id: "ID",
        description: "Description",
        system: "System",
        cause: "Cause",
        effect: "Effect",
        severity: "Severity",
        likelihood: "Likelihood",
        riskLevel: "Risk level",
        mitigation: "Mitigation",
        responsible: "Responsible",
        status: "Status"
    },
     mitigationPrefixes: {
      main: "Main",
      secondary: "Secondary",
      proposed: "Proposed",
    },
    exportSuccessTitle: "Export Successful",
    exportSuccessDesc: (count: number) => `Exported ${count} hazards.`,
    exportNoDataTitle: "No Data",
    exportNoDataDesc: "There are no hazards to export.",
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    undoLastChange: "Undo",
    undoSuccess: "Successfully undid the last change for Hazards.",
    undoNothing: "No recent changes to undo.",
    previousPage: "Previous",
    nextPage: "Next",
    pageInfo: (page: number, total: number) => `Page ${page} of ${total}`,
  }
};

function getHazardStatusBadgeVariant(status: HazardRecord['status']): "default" | "secondary" | "destructive" | "outline" | "accent" {
  switch (status) {
    case "Mới": return "outline";
    case "Đang đánh giá": return "secondary";
    case "Tiếp nhận xử lý": return "default";
    case "Đã xử lý/Giám sát": return "default";
    case "Đã đóng": return "default";
    case "Hủy": return "destructive";
    default: return "outline";
  }
}

const canEditSpecificHazard = (hazard: HazardRecord, currentUserRole: UserRole, editAllPermission: boolean) => {
    if (editAllPermission) return true; // Admin
    if (currentUserRole === ROLE_L3_SPECIALIST) {
        return hazard.status !== "Đã đóng";
    }
    return false;
};

const canUserDeleteHazard = (currentUserRole: UserRole, deletePermission: boolean) => {
    // Only Admin can delete
    return currentUserRole === ROLE_ADMIN_PKTAT && deletePermission;
};


interface HazardTableClientProps {
  initialHazards: HazardRecord[];
  initialTotalPages?: number;
}

export function HazardTableClient({ initialHazards, initialTotalPages = 1 }: HazardTableClientProps) {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [permissions, setPermissions] = React.useState({
    canCreate: false,
    canEditAny: false,
    canDeleteAny: false,
    canUndo: false,
  });
  
  React.useEffect(() => {
    const checkPermissions = async () => {
      const create = await hasPermission('hazard:create');
      const editAny = await hasPermission('hazard:edit_all');
      const del = await hasPermission('hazard:delete');
      
      setPermissions({
        canCreate: create,
        canEditAny: editAny,
        canDeleteAny: del,
        canUndo: currentUser?.role === ROLE_ADMIN_PKTAT,
      });
    };
    checkPermissions();
  }, []);

  const canCreateHazardPermission = permissions.canCreate;
  const canEditAnyHazardPermission = permissions.canEditAny;
  const canDeleteAnyHazardPermission = permissions.canDeleteAny;
  const canUndoHazardChange = permissions.canUndo;

  const initialStatusFilter = React.useMemo(() => Object.fromEntries(HAZARD_STATUSES.map(status => [status, true])), []);
  const initialRiskLevelFilter = React.useMemo(() => Object.fromEntries(HAZARD_RISK_LEVELS.map(level => [level.id, true])), []);

  const [filterStatus, setFilterStatus] = React.useState<Record<string, boolean>>(initialStatusFilter);
  const [filterRiskLevel, setFilterRiskLevel] = React.useState<Record<string, boolean>>(initialRiskLevelFilter);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const [hazardRecords, setHazardRecords] = React.useState<HazardRecord[]>(initialHazards);
  const [totalPages, setTotalPages] = React.useState(initialTotalPages);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isMounted, setIsMounted] = React.useState(false);

  const initialStatusFilter = React.useMemo(() => Object.fromEntries(HAZARD_STATUSES.map(status => [status, true])), []);
  const initialRiskLevelFilter = React.useMemo(() => Object.fromEntries(HAZARD_RISK_LEVELS.map(level => [level.id, true])), []);

  const [filterStatus, setFilterStatus] = React.useState<Record<string, boolean>>(initialStatusFilter);
  const [filterRiskLevel, setFilterRiskLevel] = React.useState<Record<string, boolean>>(initialRiskLevelFilter);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  const fetchHazards = React.useCallback(async (pageToFetch: number = 1) => {
    setIsLoading(true);
    try {
        const reqStatuses = Object.keys(filterStatus).filter(k => filterStatus[k]);
        const reqRiskLevels = Object.keys(filterRiskLevel).filter(k => filterRiskLevel[k]);

        const hasNoneRisk = filterRiskLevel['none'] === true;
        const validRiskLevels = reqRiskLevels.filter(k => k !== 'none');

        const response = await getHazardRecordsPaginated({
            page: pageToFetch,
            pageSize: ROWS_PER_PAGE,
            searchTerm: searchTerm || undefined,
            statuses: Object.keys(filterStatus).length === reqStatuses.length ? undefined : reqStatuses,
            riskLevels: Object.keys(filterRiskLevel).length === reqRiskLevels.length ? undefined : (hasNoneRisk ? [...validRiskLevels, 'none'] : validRiskLevels),
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        });

        const processedHazards = response.data.map((hr: any) => ({
            ...hr,
            riskLevelId: calculateRiskLevelId(hr.severityId, hr.likelihoodId) || hr.riskLevelId
        }));
        setHazardRecords(processedHazards);
        setTotalPages(response.metadata.pages);
        setCurrentPage(pageToFetch);
    } catch (e) {
        console.error("Failed to fetch paginated hazards:", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch hazard records.'});
    } finally {
        setIsLoading(false);
    }
  }, [filterStatus, filterRiskLevel, searchTerm, startDate, endDate, toast]);

  React.useEffect(() => {
      setIsMounted(true);
  }, []);

  React.useEffect(() => {
     if (!isMounted) return;
     const timer = setTimeout(() => {
         fetchHazards(1);
     }, 400);
     return () => clearTimeout(timer);
  }, [filterStatus, filterRiskLevel, searchTerm, startDate, endDate, fetchHazards, isMounted]);

  React.useEffect(() => {
    const handleFocus = () => fetchHazards(currentPage);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchHazards, currentPage]);

  const getRiskLevelDetails = React.useCallback((riskId?: string) => HAZARD_RISK_LEVELS.find(rl => rl.id === riskId), []);

  const clearAllFilters = React.useCallback(() => {
    setSearchTerm("");
    setFilterStatus(initialStatusFilter);
    setFilterRiskLevel(initialRiskLevelFilter);
    setStartDate("");
    setEndDate("");
  }, [initialStatusFilter, initialRiskLevelFilter]);


  const escapeCsvCell = (cellData: any): string => {
    const stringData = String(cellData == null ? "" : cellData);
    if (stringData.includes(",") || stringData.includes("\"") || stringData.includes("\n")) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };
  
  const handleExportCsv = React.useCallback(() => {
    if (hazardRecords.length === 0) {
      toast({
        title: t.exportNoDataTitle,
        description: t.exportNoDataDesc,
        variant: "default"
      });
      return;
    }

    const headers = [
      t.csvHeaders.id, t.csvHeaders.description, t.csvHeaders.system, t.csvHeaders.cause, t.csvHeaders.effect,
      t.csvHeaders.severity, t.csvHeaders.likelihood, t.csvHeaders.riskLevel,
      t.csvHeaders.mitigation, t.csvHeaders.responsible, t.csvHeaders.status,
    ];

    const rows = hazardRecords.map(hr => {
        const severityLabelText = HAZARD_SEVERITY_LEVELS.find(s => s.id === hr.severityId)?.label[locale] || hr.severityId || "";
        const likelihoodLabelText = HAZARD_LIKELIHOOD_LEVELS.find(l => l.id === hr.likelihoodId)?.label[locale] || hr.likelihoodId || "";
        const riskLevelDetailsData = getRiskLevelDetails(hr.riskLevelId);
        const riskLevelLabelText = riskLevelDetailsData ? `${hr.riskLevelId || ""} - ${riskLevelDetailsData.label[locale]}` : (hr.riskLevelId || t.notAssessedDisplay);
        
        const mitigationParts = [];
        if (hr.currentControls) mitigationParts.push(`${t.mitigationPrefixes.main}: ${hr.currentControls}`);
        if (hr.proposedActions) mitigationParts.push(`${t.mitigationPrefixes.secondary}: ${hr.proposedActions}`);
        if (hr.suggestedActions) mitigationParts.push(`${t.mitigationPrefixes.proposed}: ${hr.suggestedActions}`);
        const mitigationText = mitigationParts.join('\n');
        
        const responsibleParts = [];
        if (hr.responsiblePersonOrUnit) responsibleParts.push(hr.responsiblePersonOrUnit);
        if (hr.coordinatingUnits && hr.coordinatingUnits.length > 0) {
            responsibleParts.push(...hr.coordinatingUnits);
        }
        const responsibleText = responsibleParts.join('\n');

        return [
            hr.id,
            hr.description,
            hr.systemGroup || "",
            hr.source || "",
            hr.potentialConsequence || "",
            severityLabelText,
            likelihoodLabelText,
            riskLevelLabelText,
            mitigationText,
            responsibleText,
            hr.status
        ].map(escapeCsvCell);
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
        + headers.join(",") + "\n"
        + rows.map(row => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hazard_log_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: t.exportSuccessTitle,
        description: t.exportSuccessDesc(hazardRecords.length),
    });

  }, [hazardRecords, locale, t, getRiskLevelDetails, toast]);


  const handleDeleteHazard = async (hazardId: string) => {
    await deleteHazardRecord(hazardId);
    fetchHazards(currentPage);
    toast({
      title: "Thành công",
      description: t.deleteSuccess(hazardId),
    });
  };

  const handleUndoChange = async () => {
    if (await undoLastChange('Hazard')) {
      fetchHazards(currentPage);
      toast({
        title: "Thành công",
        description: t.undoSuccess,
      });
    } else {
      toast({
        title: "Thông báo",
        description: t.undoNothing,
        variant: "default"
      });
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 no-print">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageDescription}</p>
        </div>
      </div>
      <Card className="shadow-lg card-to-print">
        <CardHeader className="no-print">
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
                          <Label htmlFor="startDateHazard" className="text-xs">{t.startDate}</Label>
                          <Input type="date" id="startDateHazard" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9" suppressHydrationWarning />
                          </div>
                          <div>
                          <Label htmlFor="endDateHazard" className="text-xs">{t.endDate}</Label>
                          <Input type="date" id="endDateHazard" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9" suppressHydrationWarning />
                          </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 md:ml-auto flex-shrink-0">
                      <Button onClick={() => fetchHazards(currentPage)} variant="outline" size="sm" className="h-9 gap-1" disabled={isLoading}>
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
                                  {HAZARD_STATUSES.map(status => (
                                    <DropdownMenuCheckboxItem
                                      key={status}
                                      checked={filterStatus[status] || false}
                                      onCheckedChange={(checked) => setFilterStatus(prev => ({ ...prev, [status]: Boolean(checked) }))}
                                    >{status}</DropdownMenuCheckboxItem>
                                  ))}
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="riskLevel" className="border-b-0">
                              <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterRiskLevel}</AccordionTrigger>
                              <AccordionContent className="px-1 pt-0 pb-2">
                                <ScrollArea className="h-48">
                                    <DropdownMenuCheckboxItem
                                        checked={filterRiskLevel['none'] || false}
                                        onCheckedChange={(checked) => setFilterRiskLevel(prev => ({ ...prev, ['none']: Boolean(checked) }))}
                                    >{locale === 'vi' ? 'Chưa đánh giá' : 'Not Assessed'}</DropdownMenuCheckboxItem>
                                    {HAZARD_RISK_LEVELS.map(level => (
                                        <DropdownMenuCheckboxItem
                                        key={level.id}
                                        checked={filterRiskLevel[level.id] || false}
                                        onCheckedChange={(checked) => setFilterRiskLevel(prev => ({ ...prev, [level.id]: Boolean(checked) }))}
                                        >
                                        {level.icon && <level.icon className="mr-2 h-4 w-4" style={{color: level.color}}/> }
                                        {level.label[locale]}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">{t.clearFilters}</Button>
                   </div>
              </div>
              <div className="flex justify-end gap-2">
                  {canUndoHazardChange && (
                  <Button onClick={handleUndoChange} variant="outline" size="sm" className="h-9 gap-1">
                      <Undo2 className="h-3.5 w-3.5" /> {t.undoLastChange}
                  </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.exportPdfButton}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-1" onClick={handleExportCsv}>
                  <FileDown className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.exportCsv}</span>
                  </Button>
                  {canCreateHazardPermission && (
                  <Button asChild size="sm" className="h-9 gap-1">
                      <Link href="/hazards/new"><FilePlus className="h-3.5 w-3.5" /> <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.newHazard}</span></Link>
                  </Button>
                  )}
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                <p className="text-center text-muted-foreground">{t.loadingHazards}</p>
              </div>
          ) : (
          <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>{t.idHeader}</TableHead>
                  <TableHead className="min-w-[200px]">{t.descriptionHeader}</TableHead>
                  <TableHead>{t.riskLevelHeader}</TableHead>
                  <TableHead>{t.statusHeader}</TableHead>
                  <TableHead className="text-right no-print">{t.actionsHeader}</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {hazardRecords.length > 0 ? hazardRecords.map((hr) => {
                  const riskLevel = getRiskLevelDetails(hr.riskLevelId);
                  const RiskIcon = riskLevel?.icon || ShieldAlert;
                  const userCanDeleteThisHazard = canUserDeleteHazard(currentUser?.role as UserRole, permissions.canDeleteAny);
                  
                  return (
                      <TableRow key={hr.id}>
                      <TableCell className="font-medium font-mono text-xs">
                          <Link href={`/hazards/${hr.id}`} className="hover:underline text-primary">
                          {hr.id}
                          </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-xs">{hr.description}</TableCell>
                      <TableCell>
                          {riskLevel ? (
                          <Badge style={{ backgroundColor: riskLevel.color, color: riskLevel.textColor }} className="whitespace-nowrap">
                              <RiskIcon className="mr-1.5 h-3.5 w-3.5" />
                              {`${hr.riskLevelId || ""} - ${riskLevel.label[locale]}`}
                          </Badge>
                          ) : (
                          <Badge variant="outline">{t.notAssessedDisplay}</Badge>
                          )}
                      </TableCell>
                      <TableCell>
                          <Badge variant={getHazardStatusBadgeVariant(hr.status)}>{hr.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right no-print">
                          <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" asChild title={t.editHazard} disabled={!canEditSpecificHazard(hr, currentUser?.role as UserRole, canEditAnyHazardPermission)}><Link href={`/hazards/${hr.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                              {userCanDeleteThisHazard && (
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title={t.deleteHazard}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                                  <AlertDialogDescription>{t.confirmDeleteMsg(hr.id)}</AlertDialogDescription>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteHazard(hr.id)}>{t.confirmDelete}</AlertDialogAction>
                                  </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                              )}
                          </div>
                      </TableCell>
                      </TableRow>
                  );
              }) : (
              <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">{t.noHazards}</TableCell>
              </TableRow>
              )}
          </TableBody>
          </Table>
          )}
        </CardContent>
         {totalPages > 1 && (
          <CardFooter className="no-print">
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchHazards(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                {t.previousPage}
              </Button>
              <span>{t.pageInfo(currentPage, totalPages)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchHazards(Math.min(totalPages, currentPage + 1))}
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

