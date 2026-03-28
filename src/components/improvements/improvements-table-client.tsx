
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, Edit, FilePlus, RefreshCw, Trash2, Undo2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    MOCK_CURRENT_USER,
    IMPROVEMENT_STATUSES,
    IMPROVEMENT_CATEGORIES,
} from "@/lib/constants";
import { type Improvement } from "@/lib/types";
import { deleteImprovement, getImprovements } from "@/lib/actions/improvement.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { hasPermission } from "@/lib/auth";
import { useLanguage } from "@/contexts/language-context";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";

const translations = {
  vi: {
    newImprovement: "Tạo Cải tiến Mới",
    searchPlaceholder: "Tìm theo ID, Tiêu đề...",
    filter: "Lọc",
    filterStatus: "Lọc Trạng thái",
    filterCategory: "Lọc Hạng mục",
    clearFilters: "Xóa bộ lọc",
    refresh: "Làm mới",
    idHeader: "ID",
    titleHeader: "Tiêu đề",
    categoryHeader: "Hạng mục",
    submittedByHeader: "Người đề xuất",
    submissionDateHeader: "Ngày đề xuất",
    statusHeader: "Trạng thái",
    actionsHeader: "Hành động",
    viewDetails: "Xem chi tiết",
    edit: "Sửa",
    delete: "Xóa",
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa Đề xuất Cải tiến #${id} không?`,
    deleteSuccess: (id: string) => `Đề xuất Cải tiến #${id} đã được xóa.`,
    noImprovements: "Không tìm thấy đề xuất cải tiến nào phù hợp.",
    loading: "Đang tải danh sách cải tiến...",
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    undoLastChange: "Hoàn tác",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng cho Cải tiến.",
    undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
  },
  en: {
    newImprovement: "New Improvement",
    searchPlaceholder: "Search by ID, Title...",
    filter: "Filter",
    filterStatus: "Filter by Status",
    filterCategory: "Filter by Category",
    clearFilters: "Clear Filters",
    refresh: "Refresh",
    idHeader: "ID",
    titleHeader: "Title",
    categoryHeader: "Category",
    submittedByHeader: "Submitted By",
    submissionDateHeader: "Submission Date",
    statusHeader: "Status",
    actionsHeader: "Actions",
    viewDetails: "View Details",
    edit: "Edit",
    delete: "Delete",
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete Improvement Proposal #${id}?`,
    deleteSuccess: (id: string) => `Improvement Proposal #${id} has been deleted.`,
    noImprovements: "No matching improvement proposals found.",
    loading: "Loading improvements list...",
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    undoLastChange: "Undo",
    undoSuccess: "Successfully undid the last change for Improvements.",
    undoNothing: "No recent changes to undo.",
  }
};

const getStatusBadgeVariant = (status: Improvement['status']): "default" | "secondary" | "destructive" | "outline" | "accent" => {
    switch (status) {
        case "Mới": return "outline";
        case "Đang xem xét": return "secondary";
        case "Đã duyệt": return "default";
        case "Đang thực hiện": return "accent";
        case "Hoàn thành": return "default";
        case "Đã từ chối": return "destructive";
        default: return "outline";
    }
};

interface ImprovementsTableClientProps {
    initialImprovements: Improvement[];
}

export function ImprovementsTableClient({ initialImprovements }: ImprovementsTableClientProps) {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const [improvements, setImprovements] = React.useState<Improvement[]>(initialImprovements);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const initialStatusFilter = React.useMemo(() => Object.fromEntries(IMPROVEMENT_STATUSES.map(s => [s, true])), []);
  const initialCategoryFilter = React.useMemo(() => Object.fromEntries(IMPROVEMENT_CATEGORIES.map(c => [c.id, true])), []);
  const [statusFilters, setStatusFilters] = React.useState<Record<string, boolean>>(initialStatusFilter);
  const [categoryFilters, setCategoryFilters] = React.useState<Record<string, boolean>>(initialCategoryFilter);

  const [permissions, setPermissions] = React.useState({
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canUndo: false,
  });
  
  React.useEffect(() => {
    const checkPermissions = async () => {
      const create = await hasPermission('improvements:create');
      const edit = await hasPermission('improvements:edit_all');
      const del = await hasPermission('improvements:delete');
      
      setPermissions({
        canCreate: create,
        canEdit: edit,
        canDelete: del,
        canUndo: edit || del
      });
    };
    checkPermissions();
  }, []);

  const canCreate = permissions.canCreate;
  const canEdit = permissions.canEdit;
  const canDelete = permissions.canDelete;
  const canUndo = permissions.canUndo;

  const fetchImprovements = React.useCallback(async () => {
    setIsLoading(true);
    const data = await getImprovements();
    setImprovements([...data].sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    setImprovements([...initialImprovements].sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
  }, [initialImprovements]);

  React.useEffect(() => {
    window.addEventListener('focus', fetchImprovements);
    return () => {
      window.removeEventListener('focus', fetchImprovements);
    };
  }, [fetchImprovements]);

  const filteredImprovements = React.useMemo(() =>
    improvements.filter(imp => {
      const statusMatch = statusFilters[imp.status] !== false;
      const categoryMatch = categoryFilters[imp.category] !== false;
      const searchMatch =
          imp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          imp.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && categoryMatch && searchMatch;
    }),
  [improvements, statusFilters, categoryFilters, searchTerm]);
  
  const clearAllFilters = () => {
      setSearchTerm("");
      setStatusFilters(initialStatusFilter);
      setCategoryFilters(initialCategoryFilter);
  };
  
  const handleActualDelete = async (id: string) => {
    await deleteImprovement(id);
    fetchImprovements();
    toast({ title: "Thành công", description: t.deleteSuccess(id) });
  };
  
  const handleUndo = async () => {
    if (await undoLastChange('Improvement')) {
        fetchImprovements();
        toast({ title: "Thành công", description: t.undoSuccess });
    } else {
        toast({ title: "Thông báo", description: t.undoNothing, variant: "default" });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.searchPlaceholder}
              className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[380px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 md:ml-auto">
             <Button variant="outline" size="sm" className="h-9 gap-1" onClick={fetchImprovements} disabled={isLoading}>
                <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t.filter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>{t.filterStatus}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {IMPROVEMENT_STATUSES.map(status => (
                  <DropdownMenuCheckboxItem key={status} checked={statusFilters[status]} onCheckedChange={(checked) => setStatusFilters(prev => ({...prev, [status]: Boolean(checked)}))}>
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
                 <DropdownMenuSeparator />
                <DropdownMenuLabel>{t.filterCategory}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {IMPROVEMENT_CATEGORIES.map(cat => (
                  <DropdownMenuCheckboxItem key={cat.id} checked={categoryFilters[cat.id]} onCheckedChange={(checked) => setCategoryFilters(prev => ({...prev, [cat.id]: Boolean(checked)}))}>
                    {cat.label[locale]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
             <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-9">{t.clearFilters}</Button>
          </div>
           <div className="flex gap-2">
                {canUndo && (
                    <Button onClick={handleUndo} variant="outline" size="sm" className="h-9 gap-1">
                        <Undo2 className="h-3.5 w-3.5" /> {t.undoLastChange}
                    </Button>
                )}
                {canCreate && (
                    <Button asChild size="sm" className="h-9 gap-1">
                        <Link href="/improvements/new"><FilePlus className="h-3.5 w-3.5" />{t.newImprovement}</Link>
                    </Button>
                )}
           </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && !initialImprovements.length ? (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
        ) : (
        <ScrollArea className="h-[calc(100vh-400px)]">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>{t.idHeader}</TableHead>
                <TableHead>{t.titleHeader}</TableHead>
                <TableHead>{t.categoryHeader}</TableHead>
                <TableHead>{t.submittedByHeader}</TableHead>
                <TableHead>{t.submissionDateHeader}</TableHead>
                <TableHead>{t.statusHeader}</TableHead>
                <TableHead className="text-right">{t.actionsHeader}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredImprovements.length > 0 ? filteredImprovements.map((imp) => {
                const categoryInfo = IMPROVEMENT_CATEGORIES.find(c => c.id === imp.category);
                const CategoryIcon = categoryInfo?.icon || Lightbulb;
                return (
                <TableRow key={imp.id}>
                    <TableCell className="font-medium font-mono text-xs">
                        <Link href={`/improvements/${imp.id}`} className="hover:underline text-primary">
                            {imp.id}
                        </Link>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{imp.title}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="flex items-center w-fit">
                            <CategoryIcon className="mr-1.5 h-3.5 w-3.5" />
                            {categoryInfo?.label[locale] || imp.category}
                        </Badge>
                    </TableCell>
                    <TableCell>{imp.submittedBy}</TableCell>
                    <TableCell>{isMounted ? new Date(imp.submissionDate).toLocaleDateString(locale) : '...'}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(imp.status)}>{imp.status}</Badge></TableCell>
                    <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" asChild title={t.edit} disabled={!canEdit}><Link href={`/improvements/${imp.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                        {canDelete && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title={t.delete}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                                <AlertDialogDescription>{t.confirmDeleteMsg(imp.id)}</AlertDialogDescription>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleActualDelete(imp.id)}>{t.confirmDelete}</AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    </TableCell>
                </TableRow>
                )}) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">{t.noImprovements}</TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
