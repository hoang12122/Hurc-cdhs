"use client";

import * as React from "react";
import { 
  Plus, Calendar, Clock, Lock, Globe, 
  MoreVertical, Trash2, CheckCircle2, 
  Circle, AlertCircle, Edit2, Loader2,
  Filter, Search, SortAsc, SortDesc,
  MessageSquare, Paperclip, Send, Eye,
  FileText, Image as ImageIcon, File,
  ShieldCheck, ShieldAlert, Download, ExternalLink,
  History, Users, Timer, ChevronRight, ChevronDown, ListTodo, Save
} from "lucide-react";
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, DialogContent, 
  DialogHeader, DialogTitle, DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  createTodo, getTodos, updateTodo, deleteTodo,
  getAssignableUsers, addTodoComment, addTodoAttachment,
  deleteTodoAttachment, updateTodoAttachment,
  toggleWatcher, logTime 
} from "@/lib/actions/todo.actions";
import { getCurrentUser } from "@/lib/actions/auth.actions";
import { TodoTask, TodoPriority, TodoVisibility, TodoStatus, Comment, ImageAttachment } from "@/lib/types";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const translations = {
  vi: {
    title: "Danh sách Việc cần làm",
    addTask: "Thêm công việc",
    newTodo: "Công việc mới",
    all: "Tất cả",
    private: "Riêng tư",
    public: "Công khai",
    priority: "Ưu tiên",
    dueDate: "Hạn chót",
    progress: "Tiến độ",
    status: "Trạng thái",
    description: "Mô tả",
    save: "Lưu lại",
    cancel: "Hủy",
    delete: "Xóa",
    noTodos: "Chưa có danh sách việc cần làm.",
    priorityLabels: { High: "Cao", Medium: "Trung bình", Low: "Thấp" },
    statusLabels: { "To Do": "Chưa làm", "In Progress": "Đang làm", "Done": "Hoàn thành", "New": "Mới" },
    urgent: "Gấp",
    upcoming: "Sắp tới",
    onTime: "Kịp lúc",
    visibility: "Hiển thị",
    assignTo: "Giao cho",
    createdBy: "Người tạo",
    assignee: "Người thực hiện",
    selectUser: "Chọn người dùng...",
    discussion: "Trao đổi nội bộ",
    attachments: "Tệp đính kèm",
    addComment: "Thêm bình luận...",
    internalOnly: "Thông báo bí mật (Chỉ lãnh đạo cấp cao)",
    internal: "Nội bộ",
    upload: "Tải lên tài liệu",
    shared: "Công khai",
    download: "Tải xuống",
    view: "Xem",
    uploading: "Đang tải lên...",
    edit: "Sửa",
    rename: "Đổi tên",
    startDate: "Ngày bắt đầu",
    estimated: "Dự kiến (giờ)",
    spent: "Đã thực hiện",
    logTime: "Ghi thời gian",
    history: "Lịch sử",
    watchers: "Người theo dõi",
    subtasks: "Nhiệm vụ con",
    general: "Thông tin chung",
    details: "Chi tiết",
    noHistory: "Chưa có hoạt động nào được ghi lại.",
    addTime: "Thêm thời gian làm việc",
    hours: "Số giờ",
    workDetails: "Chi tiết công việc...",
    follow: "Theo dõi",
    following: "Đang theo dõi",
  },
  en: {
    title: "To-Do List",
    addTask: "Add Task",
    newTodo: "New Task",
    all: "All",
    private: "Private",
    public: "Public",
    priority: "Priority",
    dueDate: "Due Date",
    progress: "Progress",
    status: "Status",
    description: "Description",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    noTodos: "No tasks in your to-do list.",
    priorityLabels: { High: "High", Medium: "Medium", Low: "Low" },
    statusLabels: { "To Do": "To Do", "In Progress": "In Progress", "Done": "Done", "New": "New" },
    urgent: "Urgent",
    upcoming: "Upcoming",
    onTime: "On Time",
    visibility: "Visibility",
    assignTo: "Assign To",
    createdBy: "Created By",
    assignee: "Assignee",
    selectUser: "Select user...",
    discussion: "Internal Discussion",
    attachments: "Attachments",
    addComment: "Add comment...",
    internalOnly: "Secret Notice (High level only)",
    internal: "Internal",
    upload: "Upload document",
    shared: "Shared",
    download: "Download",
    view: "View",
    uploading: "Uploading...",
    edit: "Edit",
    rename: "Rename",
    startDate: "Start Date",
    estimated: "Estimated (h)",
    spent: "Spent",
    logTime: "Log Time",
    history: "History",
    watchers: "Watchers",
    subtasks: "Subtasks",
    general: "General",
    details: "Details",
    noHistory: "No activities recorded yet.",
    addTime: "Add Work Time",
    hours: "Hours",
    workDetails: "Work details...",
    follow: "Follow",
    following: "Following",
  }
};

export function TodoList() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  
  const [todos, setTodos] = React.useState<TodoTask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);
  const selectedTask = React.useMemo(() => 
    todos.find(t => t.id === selectedTaskId) || null, 
  [todos, selectedTaskId]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  
  const [editingAttachmentId, setEditingAttachmentId] = React.useState<string | null>(null);
  const [renamingValue, setRenamingValue] = React.useState("");
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newDesc, setNewDesc] = React.useState("");
  const [newPriority, setNewPriority] = React.useState<TodoPriority>("Medium");
  const [newDueDate, setNewDueDate] = React.useState("");
  const [newVisibility, setNewVisibility] = React.useState<TodoVisibility>("private");
  const [newAssigneeId, setNewAssigneeId] = React.useState<string>("");
  const [newStartDate, setNewStartDate] = React.useState("");
  const [newEstimatedHours, setNewEstimatedHours] = React.useState<string>("");
  const [assignableUsers, setAssignableUsers] = React.useState<any[]>([]);

  // Comment State
  const [commentText, setCommentText] = React.useState("");
  const [isInternalComment, setIsInternalComment] = React.useState(false);

  // Time Logging State
  const [timeToLog, setTimeToLog] = React.useState<string>("");
  const [timeDetails, setTimeDetails] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("general");

  const fetchTodos = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải danh sách." });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchTodos();
    getAssignableUsers().then(setAssignableUsers);
    getCurrentUser().then(setCurrentUser).catch(() => {});
  }, [fetchTodos]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;
    setIsSubmitting(true);
    try {
      await createTodo({
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        dueDate: newDueDate,
        visibility: newVisibility,
        assignedToId: newAssigneeId,
        assignedToName: assignableUsers.find(u => u.id === newAssigneeId)?.name,
        startDate: newStartDate || undefined,
        estimatedHours: newEstimatedHours ? parseFloat(newEstimatedHours) : undefined
      });
      toast({ title: "Thành công", description: "Đã thêm công việc mới." });
      setIsDialogOpen(false);
      setNewTitle(""); setNewDesc(""); fetchTodos();
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo công việc." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !commentText.trim()) return;
    try {
      await addTodoComment(selectedTask.id, commentText, isInternalComment);
      setCommentText("");
      setIsInternalComment(false);
      fetchTodos();
      toast({ title: "Đã gửi", description: "Bình luận đã được thêm." });
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể gửi bình luận." });
    }
  };

  const handleToggleWatcher = async () => {
    if (!selectedTask || !currentUser) return;
    try {
      await toggleWatcher(selectedTask.id);
      fetchTodos();
      toast({ title: "Cập nhật", description: "Đã thay đổi trạng thái theo dõi." });
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể thay đổi trạng thái theo dõi." });
    }
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !timeToLog) return;
    try {
      await logTime(selectedTask.id, parseFloat(timeToLog), timeDetails);
      setTimeToLog("");
      setTimeDetails("");
      fetchTodos();
      toast({ title: "Thành công", description: "Đã ghi nhận thời gian làm việc." });
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể ghi nhận thời gian." });
    }
  };

  const handleCreateSubtask = async (title: string) => {
    if (!selectedTask) return;
    try {
      await createTodo({
        title,
        priority: selectedTask.priority,
        dueDate: selectedTask.dueDate,
        visibility: selectedTask.visibility,
        parentId: selectedTask.id,
        department: selectedTask.department
      });
      fetchTodos();
      toast({ title: "Thành công", description: "Đã thêm nhiệm vụ con." });
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể thêm nhiệm vụ con." });
    }
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !selectedTask) return;

      if (file.size > 5 * 1024 * 1024) {
          toast({ variant: "destructive", title: "Tệp quá lớn", description: "Vui lòng chọn tệp dưới 5MB." });
          return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          const type = file.type.includes('pdf') ? 'pdf' : (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) ? 'doc' : 'image';
          
          try {
              await addTodoAttachment(selectedTask.id, {
                  name: file.name,
                  url: base64,
                  type: type,
                  size: file.size
              });
              fetchTodos();
              toast({ title: "Thành công", description: "Đã đính kèm tệp tin." });
          } catch (err) {
              toast({ variant: "destructive", title: "Lỗi", description: "Không thể đính kèm tệp." });
          } finally {
              setIsUploading(false);
          }
      };
      reader.readAsDataURL(file);
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!selectedTask) return;
    try {
        await deleteTodoAttachment(selectedTask.id, attachmentId);
        fetchTodos();
        toast({ title: "Thành công", description: "Đã xóa tệp tin." });
    } catch (err) {
        toast({ variant: "destructive", title: "Lỗi", description: "Không thể xóa tệp." });
    }
  };

  const handleRenameAttachment = async (attachmentId: string) => {
    if (!selectedTask || !renamingValue.trim()) return;
    try {
        await updateTodoAttachment(selectedTask.id, attachmentId, renamingValue);
        setEditingAttachmentId(null);
        setRenamingValue("");
        fetchTodos();
        toast({ title: "Thành công", description: "Đã đổi tên tệp tin." });
    } catch (err) {
        toast({ variant: "destructive", title: "Lỗi", description: "Không thể đổi tên tệp." });
    }
  };

  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      await updateTodo(id, { progress });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, progress, status: progress === 100 ? 'Done' : progress > 0 ? 'In Progress' : 'To Do' } : t));
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể cập nhật tiến độ." });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      toast({ title: "Đã xóa", description: "Công việc đã được loại bỏ." });
    } catch (e) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể xóa công việc." });
    }
  };

  const getFileIcon = (type?: string) => {
      switch (type) {
          case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
          case 'doc': return <FileText className="h-4 w-4 text-blue-500" />;
          case 'image': return <ImageIcon className="h-4 w-4 text-green-500" />;
          default: return <File className="h-4 w-4" />;
      }
  };

  const getDeadlineStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return { label: t.urgent, color: "text-red-500", icon: AlertCircle };
    if (diff < 2) return { label: t.urgent, color: "text-orange-500", icon: Clock };
    if (diff < 5) return { label: t.upcoming, color: "text-yellow-500", icon: Calendar };
    return { label: t.onTime, color: "text-green-500", icon: Calendar };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          {t.title}
        </h2>
        <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t.addTask}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>{t.newTodo}</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input placeholder={t.title} value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.priority}</label>
                        <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="High">{t.priorityLabels.High}</SelectItem>
                                <SelectItem value="Medium">{t.priorityLabels.Medium}</SelectItem>
                                <SelectItem value="Low">{t.priorityLabels.Low}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.visibility}</label>
                        <Select value={newVisibility} onValueChange={(v: any) => setNewVisibility(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="private"><div className="flex items-center gap-2"><Lock className="h-3 w-3"/>{t.private}</div></SelectItem>
                                <SelectItem value="public"><div className="flex items-center gap-2"><Globe className="h-3 w-3"/>{t.public}</div></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.dueDate}</label>
                        <Input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.assignTo}</label>
                        <Select value={newAssigneeId} onValueChange={setNewAssigneeId}>
                        <SelectTrigger><SelectValue placeholder={t.selectUser}/></SelectTrigger>
                        <SelectContent>
                            {assignableUsers?.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.startDate}</label>
                        <Input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold">{t.estimated}</label>
                        <Input type="number" placeholder="0" value={newEstimatedHours} onChange={e => setNewEstimatedHours(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">{t.description}</label>
                    <Textarea placeholder={t.description} value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} />
                  </div>
                  <DialogFooter><Button type="submit" disabled={isSubmitting}>{t.save}</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && todos.length === 0 ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-48 rounded-xl bg-muted/50 animate-pulse" />)
        ) : todos.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" /> {t.noTodos}
            </div>
        ) : (
          todos.map(todo => {
            const deadline = getDeadlineStatus(todo.dueDate);
            const StatusIcon = deadline.icon;
            const hasDrafts = (todo.comments?.length || 0) > 0;
            const hasFiles = (todo.attachments?.length || 0) > 0;

            return (
              <Card key={todo.id} className={cn(
                  "hover:shadow-lg transition-all border-l-4 group relative",
                  todo.priority === 'High' ? "border-l-red-500" : todo.priority === 'Medium' ? "border-l-yellow-500" : "border-l-blue-500",
                  todo.parentId ? "ml-6 scale-[0.98] opacity-90" : ""
              )}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold truncate max-w-[150px]">{todo.title}</CardTitle>
                        {todo.visibility === 'private' ? <Lock className="h-3 w-3 text-muted-foreground" /> : <Globe className="h-3 w-3 text-blue-500" />}
                      </div>
                      <div className={cn("text-[10px] font-medium flex items-center gap-1", deadline.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {deadline.label} ({new Date(todo.dueDate).toLocaleDateString(locale)})
                      </div>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedTaskId(todo.id)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(todo.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  {todo.description && <p className="text-[11px] text-muted-foreground line-clamp-1">{todo.description}</p>}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-medium">{t.progress}</span>
                      <span className="font-bold">{todo.progress}%</span>
                    </div>
                    <Slider defaultValue={[todo.progress]} max={100} step={5} onValueCommit={(v) => handleUpdateProgress(todo.id, v[0])} />
                  </div>
                  <div className="flex gap-2">
                      {hasDrafts && (
                          <Badge variant="secondary" className="text-[9px] gap-1 py-0 px-1">
                              <MessageSquare className="h-3 w-3" /> {todo.comments?.length}
                          </Badge>
                      )}
                      {hasFiles && (
                          <Badge variant="secondary" className="text-[9px] gap-1 py-0 px-1 border-blue-200 bg-blue-50 text-blue-700">
                              <Paperclip className="h-3 w-3" /> {todo.attachments?.length}
                          </Badge>
                      )}
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center bg-muted/10 rounded-b-xl border-t border-muted/20">
                    <Badge variant="outline" className="text-[9px] uppercase font-bold text-[8px]">
                        {(t.statusLabels as any)[todo.status] || todo.status}
                    </Badge>
                    <div className="flex flex-col items-end">
                        <div className="text-[8px] text-muted-foreground">{t.createdBy}: {todo.createdByName}</div>
                        {todo.assignedToName && <div className="text-[8px] text-primary/80 font-bold">{t.assignee}: {todo.assignedToName}</div>}
                    </div>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
          {selectedTask && (
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-2 border-b">
                      <div className="flex justify-between items-center w-full">
                          <div className="space-y-1">
                            <DialogTitle className="text-xl flex items-center gap-2">
                                {selectedTask.title}
                                {selectedTask.visibility === 'private' ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Globe className="h-4 w-4 text-blue-500" />}
                            </DialogTitle>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className={cn(
                                    selectedTask.priority === 'High' ? "bg-red-100 text-red-700" : selectedTask.priority === 'Medium' ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                                )}>{(t.priorityLabels as any)[selectedTask.priority] || selectedTask.priority}</Badge>
                                <Badge variant="outline">{(t.statusLabels as any)[selectedTask.status] || selectedTask.status}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <Button 
                                variant={selectedTask.watchers?.includes(currentUser?.id || "") ? "secondary" : "outline"}
                                size="sm" 
                                className="gap-2 h-8"
                                onClick={handleToggleWatcher}
                             >
                                <Eye className="h-4 w-4" />
                                {selectedTask.watchers?.includes(currentUser?.id || "") ? t.following : t.follow}
                             </Button>
                          </div>
                      </div>
                  </DialogHeader>

                  <Tabs defaultValue="general" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 border-b bg-muted/20">
                        <TabsList className="h-10 bg-transparent gap-4">
                            <TabsTrigger value="general" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 h-10">{t.general}</TabsTrigger>
                            <TabsTrigger value="subtasks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 h-10">{t.subtasks}</TabsTrigger>
                            <TabsTrigger value="discussion" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 h-10">{t.discussion}</TabsTrigger>
                            <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 h-10">{t.history}</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="general" className="h-full m-0 p-6 overflow-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> {t.description}</h3>
                                        <div className="bg-muted/30 p-4 rounded-xl border text-sm min-h-[100px]">
                                            {selectedTask?.description || <span className="italic text-muted-foreground">Không có mô tả.</span>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold flex items-center gap-2"><Paperclip className="h-4 w-4 text-primary" /> {t.attachments}</h3>
                                            <div className="flex items-center gap-2">
                                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} aria-label={t.upload} />
                                                <Button variant="outline" size="sm" className="h-8 gap-2" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                                                    {isUploading ? <Loader2 className="h-3 w-3 animate-spin"/> : <Plus className="h-3 w-3" />}
                                                    {t.upload}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedTask?.attachments?.map(att => (
                                                <div key={att.id} className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:border-primary/30 transition-all group overflow-hidden">
                                                    <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                                                        {getFileIcon(att.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-bold truncate">{att.name}</p>
                                                        <p className="text-[8px] text-muted-foreground">{(att.size || 0) / 1024 > 1024 ? `${((att.size || 0)/(1024*1024)).toFixed(1)} MB` : `${((att.size || 0)/1024).toFixed(1)} KB`}</p>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <a href={att.url} download={att.name} target="_blank" rel="noreferrer" aria-label={t.download}>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3"/></Button>
                                                        </a>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteAttachment(att.id)}><Trash2 className="h-3 w-3"/></Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-muted/30 p-4 rounded-xl border space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.dueDate}</label>
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {selectedTask?.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString(locale) : "-"}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">{t.assignee}</label>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6 border">
                                                    <AvatarFallback className="text-[10px]">{selectedTask?.assignedToName?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{selectedTask?.assignedToName || "Chưa giao"}</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" /> {t.spent}</label>
                                                <span className="text-sm font-bold text-primary">{selectedTask?.spentHours || 0} / {selectedTask?.estimatedHours || 0} h</span>
                                            </div>
                                            <Progress value={Math.min(((selectedTask?.spentHours || 0) / (selectedTask?.estimatedHours || 1)) * 100, 100)} className="h-2" />
                                            
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full h-8 gap-2 text-xs">
                                                        <Clock className="h-3 w-3" /> {t.logTime}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[300px]">
                                                    <DialogHeader><DialogTitle className="text-sm">{t.addTime}</DialogTitle></DialogHeader>
                                                    <form onSubmit={handleLogTime} className="space-y-4 pt-2">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold">{t.hours}</label>
                                                            <Input type="number" step="0.5" value={timeToLog} onChange={e => setTimeToLog(e.target.value)} required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-semibold">{t.details}</label>
                                                            <Textarea value={timeDetails} onChange={e => setTimeDetails(e.target.value)} placeholder={t.workDetails} rows={2} />
                                                        </div>
                                                        <Button type="submit" size="sm" className="w-full">{t.save}</Button>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> {t.watchers} ({selectedTask?.watchers?.length || 0})</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTask?.watchers?.map(wId => {
                                                const watcher = assignableUsers.find(u => u.id === wId);
                                                return (
                                                    <Avatar key={wId} className="h-8 w-8 border-2 border-background hover:scale-110 transition-transform cursor-help" title={watcher?.name}>
                                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{watcher?.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="subtasks" className="h-full m-0 p-6 overflow-auto">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-bold flex items-center gap-2"><ListTodo className="h-4 w-4 text-primary" /> {t.subtasks}</h3>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" className="h-8 gap-2"><Plus className="h-3 w-3" /> {t.addTask}</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[400px]">
                                            <DialogHeader><DialogTitle className="text-sm">Thêm nhiệm vụ con</DialogTitle></DialogHeader>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const form = e.target as HTMLFormElement;
                                                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                                                handleCreateSubtask(title);
                                                (form.closest('[role="dialog"]') as any)?.querySelector('[data-state="open"]')?.click();
                                            }} className="space-y-4 pt-2">
                                                <Input name="title" placeholder={t.title} required />
                                                <Button type="submit" size="sm" className="w-full">{t.save}</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <div className="space-y-2">
                                    {todos.filter(t => t.parentId === selectedTask?.id).map(sub => (
                                        <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-2 w-2 rounded-full", sub.priority === 'High' ? "bg-red-500" : "bg-blue-500")} />
                                                <span className="text-sm font-medium">{sub.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24">
                                                    <Progress value={sub.progress} className="h-1" />
                                                </div>
                                                <Badge variant="outline" className="text-[10px]">{(t.statusLabels as any)[sub.status] || sub.status}</Badge>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedTaskId(sub.id)}><ExternalLink className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                    {todos.filter(t => t.parentId === selectedTask?.id).length === 0 && (
                                        <div className="text-center py-10 border border-dashed rounded-xl opacity-30">
                                            <ListTodo className="h-10 w-10 mx-auto mb-2" />
                                            <p className="text-xs">Chưa có nhiệm vụ con nào.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="discussion" className="h-full m-0 p-6 flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-4 pb-4">
                                    {selectedTask?.comments?.map(comment => {
                                        const isMe = comment.senderId === currentUser?.id;
                                        return (
                                            <div key={comment.id} className={cn("flex flex-col gap-1 w-full", isMe ? "items-end" : "items-start")}>
                                                <div className={cn(
                                                    "max-w-[85%] p-3 rounded-2xl text-xs shadow-sm",
                                                    isMe ? "bg-primary text-primary-foreground rounded-tr-none" : comment.isInternal ? "bg-amber-100 border border-amber-200 text-amber-900 rounded-tl-none" : "bg-muted rounded-tl-none"
                                                )}>
                                                    <div className="flex justify-between items-center gap-4 border-b border-white/10 pb-1 mb-1">
                                                        <span className="font-bold text-[9px]">{isMe ? "(Tôi)" : comment.senderName}</span>
                                                        <span className="text-[7px] opacity-70 italic">{new Date(comment.timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <p className="leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                            <form onSubmit={handleAddComment} className="mt-4 pt-4 border-t space-y-2">
                                <Textarea placeholder={t.addComment} value={commentText} onChange={e => setCommentText(e.target.value)} className="text-xs min-h-[80px] resize-none" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="internal" checked={isInternalComment} onCheckedChange={(v) => setIsInternalComment(!!v)} />
                                        <label htmlFor="internal" className="text-[10px] font-medium flex items-center gap-1 cursor-pointer"><ShieldAlert className="h-3 w-3 text-amber-500" /> {t.internalOnly}</label>
                                    </div>
                                    <Button type="submit" size="sm" className="gap-2 px-4"><Send className="h-3 w-3" /> Gửi</Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="history" className="h-full m-0 p-6 overflow-auto">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold flex items-center gap-2"><History className="h-4 w-4 text-primary" /> {t.history}</h3>
                                <div className="relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-muted">
                                    {selectedTask?.activityHistory?.slice().reverse().map(activity => (
                                        <div key={activity.id} className="relative pl-8 pb-6">
                                            <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                    <span className="font-bold text-foreground">{activity.userName}</span>
                                                    <span>•</span>
                                                    <span>{new Date(activity.timestamp).toLocaleString(locale)}</span>
                                                </div>
                                                <p className="text-xs font-medium">{activity.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedTask?.activityHistory || selectedTask?.activityHistory.length === 0) && (
                                        <div className="text-center py-10 opacity-30 italic text-xs">{t.noHistory}</div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                  </Tabs>

                  <DialogFooter className="p-4 border-t bg-muted/10">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTaskId(null)}>{t.cancel}</Button>
                  </DialogFooter>
              </DialogContent>
          )}
      </Dialog>
    </div>
  );
}
