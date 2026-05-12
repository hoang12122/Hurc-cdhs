
"use client";

import * as React from "react";
import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LOG_LEVELS, type SystemLog, MOCK_CURRENT_USER, ROLE_SUPER_ADMIN, type User, type SystemLogCategory } from "@/lib/constants";
import { getSystemLogs } from "@/lib/actions/system.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { History, Search, Filter, AlertTriangle, AlertCircle, Info, XCircle as IconXCircle, FileDown, RefreshCw, Database, RadioTower } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMonitor } from "./network-monitor";

const ROWS_PER_PAGE = 50;

const translations = {
  vi: {
    pageTitle: "Nhật ký Hệ thống",
    pageDescription: "Theo dõi các sự kiện và hoạt động quan trọng trong toàn bộ hệ thống.",
    dataLogsTab: "Nhật ký Dữ liệu",
    networkLogsTab: "Nhật ký Mạng",
    searchPlaceholder: "Tìm kiếm theo người dùng, hành động...",
    filter: "Lọc",
    clearFilters: "Xóa bộ lọc",
    filterByLevel: "Lọc theo Mức độ",
    filterByUser: "Lọc theo Người dùng",
    filterByAction: "Lọc theo Hành động",
    allLevels: "Tất cả Mức độ",
    allUsers: "Tất cả Người dùng",
    allActions: "Tất cả Hành động",
    startDate: "Từ ngày",
    endDate: "Đến ngày",
    timestampCol: "Thời gian",
    userCol: "Người dùng",
    actionCol: "Hành động",
    detailsCol: "Chi tiết",
    levelCol: "Mức độ",
    noLogs: "Không có nhật ký nào phù hợp.",
    accessDenied: "Bạn không có quyền truy cập vào chức năng này.",
    backToDashboard: "Quay lại Bảng điều khiển",
    exportCsvButton: "Xuất CSV",
    exportSuccessTitle: "Xuất thành công",
    exportSuccessDesc: (count: number) => `Đã xuất ${count} bản ghi nhật ký.`,
    exportNoDataTitle: "Không có dữ liệu",
    exportNoDataDesc: "Không có nhật ký nào trong bộ lọc hiện tại để xuất.",
    csvHeaders: {
        timestamp: "Thời gian (ISO)",
        user: "Người dùng (ID)",
        level: "Mức độ",
        action: "Hành động",
        details: "Chi tiết",
        category: "Danh mục"
    },
    refresh: "Làm mới",
    previousPage: "Trang trước",
    nextPage: "Trang sau",
    pageInfo: (page: number, total: number) => `Trang ${page} / ${total}`,
  },
  en: {
    pageTitle: "System Logs",
    pageDescription: "Monitor important events and activities across the entire system.",
    dataLogsTab: "Data Logs",
    networkLogsTab: "Network Logs",
    searchPlaceholder: "Search by user, action...",
    filter: "Filter",
    clearFilters: "Clear Filters",
    filterByLevel: "Filter by Level",
    filterByUser: "Filter by User",
    filterByAction: "Filter by Action",
    allLevels: "All Levels",
    allUsers: "All Users",
    allActions: "All Actions",
    startDate: "Start Date",
    endDate: "To Date",
    timestampCol: "Timestamp",
    userCol: "User",
    actionCol: "Action",
    detailsCol: "Details",
    levelCol: "Level",
    noLogs: "No matching logs found.",
    accessDenied: "You do not have permission to access this feature.",
    backToDashboard: "Back to Dashboard",
    exportCsvButton: "Export CSV",
    exportSuccessTitle: "Export Successful",
    exportSuccessDesc: (count: number) => `Exported ${count} log entries.`,
    exportNoDataTitle: "No Data",
    exportNoDataDesc: "No logs in the current filter to export.",
    csvHeaders: {
        timestamp: "Timestamp (ISO)",
        user: "User (ID)",
        level: "Level",
        action: "Action",
        details: "Details",
        category: "Category"
    },
    refresh: "Refresh",
    previousPage: "Previous",
    nextPage: "Next",
    pageInfo: (page: number, total: number) => `Page ${page} of ${total}`,
  }
};

const getLevelBadgeVariant = (level: SystemLog['level']): "destructive" | "secondary" | "default" | "outline" => {
    switch (level) {
        case 'CRITICAL': return 'destructive';
        case 'ERROR': return 'destructive';
        case 'WARNING': return 'secondary';
        case 'INFO': return 'default';
        default: return 'outline';
    }
};

const getLevelIcon = (level: SystemLog['level']): React.ComponentType<{ className?: string }> => {
    switch (level) {
        case 'CRITICAL': return AlertTriangle;
        case 'ERROR': return IconXCircle;
        case 'WARNING': return AlertCircle;
        case 'INFO': return Info;
        default: return Info;
    }
};

interface SystemLogsClientProps {
    initialLogs: SystemLog[];
    initialUsers: User[];
}

export function SystemLogsClient({ initialLogs, initialUsers }: SystemLogsClientProps) {
    const { locale } = useLanguage();
    const t = translations[locale];
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // States
    const isFirstRender = React.useRef(true);
    const [isMounted, setIsMounted] = React.useState(false);
    const [currentTab, setCurrentTab] = React.useState<SystemLogCategory>("data");
    const [logs, setLogs] = React.useState<SystemLog[]>(initialLogs);
    const [users, setUsers] = React.useState<User[]>(initialUsers);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const initialLevelFilters = React.useMemo(() => Object.fromEntries(LOG_LEVELS.map(level => [level, true])), []);
    const [levelFilters, setLevelFilters] = React.useState<Record<string, boolean>>(initialLevelFilters);
    const [selectedUser, setSelectedUser] = React.useState('all');
    const [selectedAction, setSelectedAction] = React.useState('all');
    const [currentPage, setCurrentPage] = React.useState(1);

    const currentUserRole = MOCK_CURRENT_USER.role;

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [logData, userData] = await Promise.all([
                getSystemLogs(),
                getUsers()
            ]);
            
            const sortedLogs = [...logData].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setLogs(sortedLogs);
            setUsers(userData.sort((a, b) => a.name.localeCompare(b.name)));

        } catch (e) {
            console.error("Failed to fetch system logs or users:", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data.'});
        } finally {
            setIsLoading(false);
        }
    }, [toast]);
    
    React.useEffect(() => {
        const sortedLogs = [...initialLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setLogs(sortedLogs);
        setUsers([...initialUsers].sort((a, b) => a.name.localeCompare(b.name)));
    }, [initialLogs, initialUsers]);

    React.useEffect(() => {
        setIsMounted(true);
        window.addEventListener('focus', fetchData);
        return () => {
            window.removeEventListener('focus', fetchData)
        };
    }, [fetchData]);

    // Handle search params for deep linking (e.g. from Users page)
    React.useEffect(() => {
        if (!isFirstRender.current) return;
        
        const userId = searchParams.get('userId');
        if (userId) {
            setSelectedUser(userId);
        }
        isFirstRender.current = false;
    }, [searchParams]);

    const { filteredLogs, paginatedLogs, totalPages, uniqueActions } = React.useMemo(() => {
        const categoryLogs = logs.filter(log => log.category === currentTab);
        
        const filtered = categoryLogs.filter(log => {
            const levelMatch = levelFilters[log.level] !== false;
            const searchMatch =
                log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase());

            let dateMatch = true;
            if (startDate) {
                if (new Date(log.timestamp) < new Date(startDate)) dateMatch = false;
            }
            if (endDate) {
                if (new Date(log.timestamp) > new Date(new Date(endDate).setHours(23, 59, 59, 999))) dateMatch = false;
            }

            const userMatch = selectedUser === 'all' || log.userId === selectedUser;
            const actionMatch = selectedAction === 'all' || log.action === selectedAction;

            return levelMatch && searchMatch && dateMatch && userMatch && actionMatch;
        });

        const paginated = filtered.slice(
            (currentPage - 1) * ROWS_PER_PAGE,
            currentPage * ROWS_PER_PAGE
        );

        const pages = Math.ceil(filtered.length / ROWS_PER_PAGE);
        const actions = Array.from(new Set(categoryLogs.map(log => log.action))).sort();

        return { filteredLogs: filtered, paginatedLogs: paginated, totalPages: pages, uniqueActions: actions };
    }, [logs, currentTab, levelFilters, searchTerm, startDate, endDate, selectedUser, selectedAction, currentPage]);
    
    React.useEffect(() => {
      setCurrentPage(1); // Reset page when filters change
      setSelectedAction('all'); // Reset action filter when tab changes
    }, [currentTab]);

    if (currentUserRole !== ROLE_SUPER_ADMIN) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Card className="w-full max-w-md p-8 text-center">
            <CardTitle className="text-2xl text-destructive mb-4">{t.accessDenied}</CardTitle>
            <CardDescription>{locale === 'vi' ? `Chỉ Quản trị viên cấp cao mới có quyền truy cập trang này.` : `Only Super Administrators can access this page.`}</CardDescription>
             <Button asChild className="mt-6">
              <Link href="/dashboard">
                {t.backToDashboard}
              </Link>
            </Button>
          </Card>
        </div>
      );
    }

    const clearAllFilters = () => {
        setSearchTerm("");
        setLevelFilters(initialLevelFilters);
        setStartDate("");
        setEndDate("");
        setSelectedUser("all");
        setSelectedAction("all");
        setCurrentPage(1);
    };

    const escapeCsvCell = (cellData: any): string => {
        const stringData = String(cellData == null ? "" : cellData);
        if (stringData.includes(",") || stringData.includes("\"") || stringData.includes("\n")) {
          return `"${stringData.replace(/"/g, '""')}"`;
        }
        return stringData;
    };

    const handleExportCsv = () => {
        if (filteredLogs.length === 0) {
            toast({
                title: t.exportNoDataTitle,
                description: t.exportNoDataDesc,
                variant: "default"
            });
            return;
        }

        const headers = [
            t.csvHeaders.timestamp,
            t.csvHeaders.user,
            t.csvHeaders.level,
            t.csvHeaders.action,
            t.csvHeaders.details,
            t.csvHeaders.category,
        ];

        const rows = filteredLogs.map(log => {
            return [
                log.timestamp,
                `${log.userName} (${log.userId})`,
                log.level,
                log.action,
                log.details,
                log.category
            ].map(escapeCsvCell);
        });

        const csvContent = "\uFEFF" + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        const currentDate = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `system_logs_${currentTab}_${currentDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
            title: t.exportSuccessTitle,
            description: t.exportSuccessDesc(filteredLogs.length)
        });
    };

    const renderLogTable = (logsToRender: SystemLog[]) => (
        <>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[180px]">{t.timestampCol}</TableHead>
                    <TableHead className="w-[150px]">{t.userCol}</TableHead>
                    <TableHead className="w-[150px]">{t.levelCol}</TableHead>
                    <TableHead className="w-[180px]">{t.actionCol}</TableHead>
                    <TableHead>{t.detailsCol}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {logsToRender.map(log => {
                    const LevelIcon = getLevelIcon(log.level);
                    return (
                        <TableRow key={log.id}>
                            <TableCell className="font-mono text-xs">
                                {isMounted ? new Date(log.timestamp).toLocaleString(locale) : '...'}
                            </TableCell>
                            <TableCell>{log.userName} ({log.userId})</TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant={getLevelBadgeVariant(log.level)} className="cursor-help">
                                            <LevelIcon className="mr-1.5 h-3.5 w-3.5"/>
                                            {log.level}
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{log.details}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{log.action}</TableCell>
                            <TableCell>{log.details}</TableCell>
                        </TableRow>
                    );
                })}
                {logsToRender.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">{t.noLogs}</TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            {totalPages > 1 && (
            <CardFooter className="mt-4 border-t pt-4">
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
        </>
    );

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <History className="h-8 w-8 text-primary" />
                    <div>
                    <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
                    <p className="text-muted-foreground">{t.pageDescription}</p>
                    </div>
                </div>

                <Tabs defaultValue="data" onValueChange={(value: string) => setCurrentTab(value as SystemLogCategory)}>
                    <TabsList className="grid w-full grid-cols-2 md:w-[600px] mb-4">
                        <TabsTrigger value="data"><Database className="mr-2 h-4 w-4"/> {t.dataLogsTab}</TabsTrigger>
                        <TabsTrigger value="network"><RadioTower className="mr-2 h-4 w-4"/> {t.networkLogsTab}</TabsTrigger>
                    </TabsList>
                    
                    <Card className="shadow-lg">
                        <CardHeader>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-end gap-4">
                                    <div className="relative flex-grow">
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
                                            <Label htmlFor="startDateLogs" className="text-xs">{t.startDate}</Label>
                                            <Input type="date" id="startDateLogs" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9"/>
                                        </div>
                                        <div>
                                            <Label htmlFor="endDateLogs" className="text-xs">{t.endDate}</Label>
                                            <Input type="date" id="endDateLogs" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button onClick={fetchData} variant="outline" size="sm" className="h-9 gap-1" disabled={isLoading}>
                                        <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                                        {t.refresh}
                                    </Button>
                                    <Button onClick={handleExportCsv} size="sm" className="h-9 gap-1">
                                        <FileDown className="h-3.5 w-3.5" /> {t.exportCsvButton}
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-9 gap-1">
                                            <Filter className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.filter}</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[300px]">
                                            <DropdownMenuLabel>{t.filterByLevel}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {LOG_LEVELS.map(level => (
                                                <DropdownMenuCheckboxItem
                                                    key={level}
                                                    checked={levelFilters[level] || false}
                                                    onCheckedChange={(checked) => setLevelFilters(prev => ({ ...prev, [level]: Boolean(checked) }))}
                                                >{level}</DropdownMenuCheckboxItem>
                                            ))}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>{t.filterByUser}</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup value={selectedUser} onValueChange={setSelectedUser}>
                                                <DropdownMenuRadioItem value="all">{t.allUsers}</DropdownMenuRadioItem>
                                                {users.map(user => (
                                                    <DropdownMenuRadioItem key={user.id} value={user.id}>{user.name}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>{t.filterByAction}</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup value={selectedAction} onValueChange={setSelectedAction}>
                                                <DropdownMenuRadioItem value="all">{t.allActions}</DropdownMenuRadioItem>
                                                {uniqueActions.map(action => (
                                                    <DropdownMenuRadioItem key={action} value={action}>{action}</DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">{t.clearFilters}</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TabsContent value="data" className="mt-0">
                                {renderLogTable(paginatedLogs)}
                            </TabsContent>
                            <TabsContent value="network" className="mt-0 p-6">
                                <NetworkMonitor />
                            </TabsContent>
                        </CardContent>
                    </Card>
                </Tabs>
            </div>
        </TooltipProvider>
    );
}
