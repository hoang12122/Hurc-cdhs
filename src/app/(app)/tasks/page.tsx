

"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    AlertTriangle, ClipboardList, ListTodo, ShieldAlert, FileWarning, ArrowRight, MapPin, Filter, ArrowDownUp, ChevronDown, CheckCircle, Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { getTasksForCurrentUser } from "@/lib/actions/task.actions";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { UnifiedTask, } from "@/lib/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodoList } from "@/components/tasks/todo-list";
import { checkTodoDeadlines } from "@/lib/actions/todo.actions";

const translations = {
  vi: {
    pageTitle: "Quản lý Công việc",
    pageDescription: "Tất cả các công việc, sự cố và nhiệm vụ được giao cho bạn hoặc nhóm của bạn.",
    taskType: "Loại nhiệm vụ",
    dueDate: "Hạn chót",
    taskStatus: "Trạng thái",
    viewDetailsTask: "Xem chi tiết",
    noTasks: "Tuyệt vời! Hiện không có công việc nào được giao cho bạn.",
    noFilteredTasks: "Không tìm thấy công việc nào phù hợp với bộ lọc.",
    taskStatusLabels: {
      overdue: "Quá hạn",
      dueSoon: "Sắp đến hạn",
      onTrack: "Đúng tiến độ",
    },
    taskTypeLabels: {
        incident: "Sự cố",
        inspection: "Kiểm tra",
        hazard: "Mối nguy",
        corrective_action: "Hành động Khắc phục",
        other: "Khác",
    },
    location: "Vị trí",
    priority: "Ưu tiên",
    filters: "Bộ lọc",
    sort: "Sắp xếp",
    filterByType: "Lọc theo loại",
    filterByPriority: "Lọc theo ưu tiên",
    filterByStatus: "Lọc theo trạng thái",
    all: "Tất cả",
    clearFilters: "Xóa bộ lọc",
    sortByDueDateAsc: "Hạn chót (Gần nhất)",
    sortByDueDateDesc: "Hạn chót (Xa nhất)",
    sortByPriority: "Ưu tiên (Cao xuống thấp)",
    priorityLabels: {
        "Cao": "Cao",
        "Trung bình": "Trung bình",
        "Thấp": "Thấp"
    },
    summary: {
        title: "Tổng quan Công việc",
        checklist: "Checklist",
        dnf: "Sự cố (DNF)",
        hazard: "Mối nguy",
        total: "Tổng cộng",
        inProgress: "Đang thực hiện",
        completed: "Hoàn thành",
    },
    tabs: {
        system: "Nhiệm vụ Hệ thống",
        todos: "Việc cần làm (Todo List)"
    }
  },
  en: {
    pageTitle: "Task Management",
    pageDescription: "All work orders, incidents, and tasks assigned to you or your team.",
    taskType: "Work Type",
    dueDate: "Due Date",
    taskStatus: "Status",
    viewDetailsTask: "View Details",
    noTasks: "Great! You have no tasks assigned to you right now.",
    noFilteredTasks: "No tasks found matching the current filters.",
    taskStatusLabels: {
      overdue: "Overdue",
      dueSoon: "Due Soon",
      onTrack: "On Track",
    },
    taskTypeLabels: {
        incident: "Incident",
        inspection: "Inspection",
        hazard: "Hazard",
        corrective_action: "Corrective Action",
        other: "Other",
    },
    location: "Location",
    priority: "Priority",
    filters: "Filters",
    sort: "Sort",
    filterByType: "Filter by Type",
    filterByPriority: "Filter by Priority",
    filterByStatus: "Filter by Status",
    all: "All",
    clearFilters: "Clear Filters",
    sortByDueDateAsc: "Due Date (Ascending)",
    sortByDueDateDesc: "Due Date (Descending)",
    sortByPriority: "Priority (High to Low)",
     priorityLabels: {
        "Cao": "High",
        "Trung bình": "Medium",
        "Thấp": "Low"
    },
    summary: {
        title: "Task Overview",
        checklist: "Checklist",
        dnf: "Incidents (DNF)",
        hazard: "Hazards",
        total: "Total",
        inProgress: "In Progress",
        completed: "Completed",
    },
    tabs: {
        system: "System Tasks",
        todos: "To-Do List"
    }
  },
};

type TaskStatusLabelKey = keyof typeof translations.en.taskStatusLabels;
type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priority';

const getTaskStatus = (dueDate: string): { labelKey: TaskStatusLabelKey; variant: "destructive" | "secondary" | "default" } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { labelKey: 'overdue', variant: 'destructive' };
    }
    if (diffDays <= 3) {
        return { labelKey: 'dueSoon', variant: 'secondary' };
    }
    return { labelKey: 'onTrack', variant: 'default' };
};

const getTaskTypeVisuals = (taskType: UnifiedTask['type'], t: any): { icon: React.ElementType, color: string, label: string, key: string } => {
    switch (taskType) {
        case "Kiểm tra":
            return { icon: ClipboardList, color: "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20", label: t.taskTypeLabels.inspection, key: 'inspection' };
        case "Sự cố":
            return { icon: FileWarning, color: "bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20", label: t.taskTypeLabels.incident, key: 'incident' };
        case "Mối nguy":
            return { icon: ShieldAlert, color: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-500/20", label: t.taskTypeLabels.hazard, key: 'hazard' };
        case "Hành động Khắc phục":
            return { icon: ListTodo, color: "bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-500/20", label: t.taskTypeLabels.corrective_action, key: 'corrective_action' };
        default:
            return { icon: ListTodo, color: "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-500/20", label: t.taskTypeLabels.other, key: `other-${taskType}` };
    }
};

function PriorityBadge({ priority }: { priority?: 'Cao' | 'Trung bình' | 'Thấp' }) {
    if (!priority) return null;
    const { AlertCircle: AlertCircleIcon, Info } = require('lucide-react');

    const variant = {
        'Cao': 'destructive',
        'Trung bình': 'secondary',
        'Thấp': 'default',
    }[priority] as "destructive" | "secondary" | "default";
    
    const Icon = {
        'Cao': AlertTriangle,
        'Trung bình': AlertCircleIcon,
        'Thấp': Info,
    }[priority];

    return (
        <Badge variant={variant} className="capitalize">
            <Icon className="mr-1 h-3 w-3" />
            {priority}
        </Badge>
    );
}

const isTaskCompleted = (task: UnifiedTask): boolean => {
    switch (task.type) {
        case 'Kiểm tra':
            return ['Hoàn thành', 'Hoàn thành (Có phát hiện)', 'Đã xem xét', 'Đã duyệt để tạo báo cáo'].includes(task.status);
        case 'Sự cố':
            return ['Đã đóng', 'Hủy'].includes(task.status);
        case 'Mối nguy':
            return ['Đã xử lý/Giám sát', 'Đã đóng'].includes(task.status);
        case 'Hành động Khắc phục':
            return task.status === 'Đã xác minh';
        default:
            return false;
    }
};

interface SummaryStats {
    total: number;
    completed: number;
    inProgress: number;
}

export default function TaskManagementPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  
  const [tasks, setTasks] = React.useState<UnifiedTask[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  
  const [typeFilters, setTypeFilters] = React.useState<Record<string, boolean>>({
    inspection: true, incident: true, hazard: true, corrective_action: true, other: true
  });
  const [priorityFilters, setPriorityFilters] = React.useState<Record<string, boolean>>({
    Cao: true, "Trung bình": true, "Thấp": true, None: true
  });
  const [statusFilters, setStatusFilters] = React.useState<Record<TaskStatusLabelKey, boolean>>({
    overdue: true, dueSoon: true, onTrack: true
  });
  const [sortOption, setSortOption] = React.useState<SortOption>('dueDateAsc');

  const fetchData = React.useCallback(async () => {
    try {
        const userTasks = await getTasksForCurrentUser();
        setTasks(userTasks);
    } catch (e) {
        console.error("Failed to fetch tasks", e);
        toast({ variant: 'destructive', title: "Error", description: "Could not load tasks."});
    }
  }, [toast]);

  React.useEffect(() => {
    setIsMounted(true);
    document.title = t.pageTitle;
    fetchData();
    checkTodoDeadlines(); // Check for overdue todos on load
  }, [t.pageTitle, fetchData]);
  
  const clearFilters = () => {
      setTypeFilters({ inspection: true, incident: true, hazard: true, corrective_action: true, other: true });
      setPriorityFilters({ Cao: true, "Trung bình": true, "Thấp": true, None: true });
      setStatusFilters({ overdue: true, dueSoon: true, onTrack: true });
  }

  const processedTasks = React.useMemo(() => {
    return tasks
      .map(task => ({
        ...task,
        derivedStatus: getTaskStatus(task.dueDate),
        derivedType: getTaskTypeVisuals(task.type, t),
      }))
      .filter(task => {
        const typeKey = task.derivedType.key.startsWith('other-') ? 'other' : task.derivedType.key;
        const typeMatch = typeFilters[typeKey];
        const priorityMatch = priorityFilters[task.priority || 'None'];
        const statusMatch = statusFilters[task.derivedStatus.labelKey];
        return typeMatch && priorityMatch && statusMatch;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case 'dueDateDesc':
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
          case 'priority':
            const priorityOrder = { "Cao": 3, "Trung bình": 2, "Thấp": 1, undefined: 0 };
            return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          case 'dueDateAsc':
          default:
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
      });
  }, [tasks, typeFilters, priorityFilters, statusFilters, sortOption, t]);

  const summaryData = React.useMemo<Record<string, SummaryStats>>(() => {
    const initialStats: Record<string, SummaryStats> = {
      checklist: { total: 0, completed: 0, inProgress: 0 },
      dnf: { total: 0, completed: 0, inProgress: 0 },
      hazard: { total: 0, completed: 0, inProgress: 0 },
    };

    return tasks.reduce((acc, task) => {
        const isCompleted = isTaskCompleted(task);
        if (task.type === 'Kiểm tra') {
            acc.checklist.total++;
            if (isCompleted) acc.checklist.completed++; else acc.checklist.inProgress++;
        } else if (task.type === 'Sự cố' || task.type === 'Hành động Khắc phục') {
            acc.dnf.total++;
            if (isCompleted) acc.dnf.completed++; else acc.dnf.inProgress++;
        } else if (task.type === 'Mối nguy') {
            acc.hazard.total++;
            if (isCompleted) acc.hazard.completed++; else acc.hazard.inProgress++;
        }
        return acc;
    }, initialStats);
  }, [tasks]);
  
  const taskTypesForFilter = React.useMemo(() => [
    { key: 'inspection', label: t.taskTypeLabels.inspection },
    { key: 'incident', label: t.taskTypeLabels.incident },
    { key: 'hazard', label: t.taskTypeLabels.hazard },
    { key: 'corrective_action', label: t.taskTypeLabels.corrective_action },
    { key: 'other', label: t.taskTypeLabels.other },
  ], [t.taskTypeLabels]);


  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
         <div className="flex items-center gap-3">
           <ListTodo className="h-8 w-8 text-primary" />
           <div>
             <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
             <p className="text-muted-foreground">{t.pageDescription}</p>
           </div>
         </div>
         <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between sm:w-auto">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4"/>
                      {t.filters}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                    <Accordion type="multiple" className="w-full">
                        <AccordionItem value="type">
                            <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterByType}</AccordionTrigger>
                            <AccordionContent className="px-1 pt-0 pb-2">
                                <ScrollArea className="h-40">
                                    {taskTypesForFilter.map(type => (
                                        <DropdownMenuCheckboxItem key={type.key} checked={typeFilters[type.key] ?? false} onCheckedChange={(checked) => setTypeFilters(prev => ({...prev, [type.key]: Boolean(checked)}))}>{type.label}</DropdownMenuCheckboxItem>
                                    ))}
                                </ScrollArea>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="priority">
                             <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterByPriority}</AccordionTrigger>
                             <AccordionContent className="px-1 pt-0 pb-2">
                                <ScrollArea className="h-32">
                                    {Object.keys(priorityFilters).map(prio => (
                                        <DropdownMenuCheckboxItem key={prio} checked={priorityFilters[prio] ?? false} onCheckedChange={(checked) => setPriorityFilters(prev => ({...prev, [prio]: Boolean(checked)}))}>{prio === 'None' ? (locale === 'vi' ? 'Không có' : 'None') : t.priorityLabels[prio as keyof typeof t.priorityLabels]}</DropdownMenuCheckboxItem>
                                    ))}
                                </ScrollArea>
                             </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="status" className="border-b-0">
                             <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline">{t.filterByStatus}</AccordionTrigger>
                             <AccordionContent className="px-1 pt-0 pb-2">
                                <ScrollArea className="h-24">
                                    {Object.keys(statusFilters).map(status => (
                                        <DropdownMenuCheckboxItem key={status} checked={statusFilters[status as TaskStatusLabelKey] ?? false} onCheckedChange={(checked) => setStatusFilters(prev => ({...prev, [status]: Boolean(checked)}))}>{t.taskStatusLabels[status as TaskStatusLabelKey]}</DropdownMenuCheckboxItem>
                                    ))}
                                </ScrollArea>
                             </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline"><ArrowDownUp className="mr-2 h-4 w-4"/>{t.sort}</Button></DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{t.sort}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                        <DropdownMenuRadioItem value="dueDateAsc">{t.sortByDueDateAsc}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="dueDateDesc">{t.sortByDueDateDesc}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="priority">{t.sortByPriority}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" onClick={clearFilters}>{t.clearFilters}</Button>
         </div>
       </div>
       
        <Card>
            <CardHeader>
                <CardTitle>{t.summary.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-blue-500/5">
                    <CardHeader className="pb-2 flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">{t.summary.checklist}</CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="text-2xl font-bold">{summaryData.checklist.total} {t.summary.total}</div>
                        <div className="flex text-xs text-muted-foreground">
                            <span className="flex items-center mr-4"><Clock className="h-3 w-3 mr-1 text-yellow-500"/>{summaryData.checklist.inProgress} {t.summary.inProgress}</span>
                            <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1 text-green-500"/>{summaryData.checklist.completed} {t.summary.completed}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-500/5">
                    <CardHeader className="pb-2 flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">{t.summary.dnf}</CardTitle>
                        <FileWarning className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent className="space-y-1">
                         <div className="text-2xl font-bold">{summaryData.dnf.total} {t.summary.total}</div>
                        <div className="flex text-xs text-muted-foreground">
                            <span className="flex items-center mr-4"><Clock className="h-3 w-3 mr-1 text-yellow-500"/>{summaryData.dnf.inProgress} {t.summary.inProgress}</span>
                            <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1 text-green-500"/>{summaryData.dnf.completed} {t.summary.completed}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5">
                    <CardHeader className="pb-2 flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">{t.summary.hazard}</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent className="space-y-1">
                         <div className="text-2xl font-bold">{summaryData.hazard.total} {t.summary.total}</div>
                        <div className="flex text-xs text-muted-foreground">
                            <span className="flex items-center mr-4"><Clock className="h-3 w-3 mr-1 text-yellow-500"/>{summaryData.hazard.inProgress} {t.summary.inProgress}</span>
                            <span className="flex items-center"><CheckCircle className="h-3 w-3 mr-1 text-green-500"/>{summaryData.hazard.completed} {t.summary.completed}</span>
                        </div>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>

        <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
                <TabsTrigger value="system" className="gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    {t.tabs.system}
                </TabsTrigger>
                <TabsTrigger value="todos" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {t.tabs.todos}
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="space-y-6">
                <div className="space-y-4">
                {processedTasks.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {processedTasks.map(task => {
                            const statusLabel = t.taskStatusLabels[task.derivedStatus.labelKey];
                            const { icon: TaskIcon, color: taskColor, label: taskTypeLabel } = task.derivedType;

                            return (
                            <Card key={task.id} className={cn("overflow-hidden hover:shadow-md transition-shadow", task.derivedStatus.variant === 'destructive' && 'border-destructive/50')}>
                                <CardHeader className="p-4 flex flex-row items-start bg-muted/50 gap-4">
                                    <div className={cn("p-2 rounded-lg", taskColor)}>
                                        <TaskIcon className="h-6 w-6" />
                                    </div>
                                    <div className="grid gap-1">
                                        <CardTitle className="text-base">{taskTypeLabel}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {t.dueDate}: {isMounted ? new Date(task.dueDate).toLocaleDateString(locale) : '...'}
                                        </CardDescription>
                                    </div>
                                    <div className="ml-auto flex flex-col items-end gap-1">
                                        <Badge variant={task.derivedStatus.variant} className="w-fit whitespace-nowrap">
                                            {task.derivedStatus.variant === 'destructive' && <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />}
                                            {statusLabel}
                                        </Badge>
                                        {task.priority && <PriorityBadge priority={task.priority} />}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2">
                                    <p className="font-semibold" title={task.title}>{task.title}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/> {task.location || 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground"><strong className="font-medium">{t.taskStatus}:</strong> {task.status}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button asChild variant="outline" size="sm" className="w-full">
                                        <Link href={task.link || "#"}>
                                            {t.viewDetailsTask} <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                            );
                        })
                    }
                    </div>
                ) : (
                    <Card className="shadow-lg">
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground py-10">
                                {tasks.length > 0 ? t.noFilteredTasks : t.noTasks}
                            </p>
                        </CardContent>
                    </Card>
                )}
                </div>
            </TabsContent>
            
            <TabsContent value="todos">
                <TodoList />
            </TabsContent>
        </Tabs>
    </div>
  );
}
