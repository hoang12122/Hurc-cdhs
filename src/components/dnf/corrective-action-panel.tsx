
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DnfDocument, MOCK_CURRENT_USER, type User, type CorrectiveAction, CORRECTIVE_ACTION_STATUSES, type CorrectiveActionStatus } from "@/lib/constants";
import { addCorrectiveAction, updateCorrectiveAction, deleteCorrectiveAction } from "@/lib/actions/dnf.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { useLanguage } from "@/contexts/language-context";
import { Wrench, PlusCircle, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const correctiveActionSchema = z.object({
    description: z.string().min(1, "Mô tả không được để trống."),
    responsiblePersonOrUnit: z.string().min(1, "Vui lòng gán cho người/đơn vị chịu trách nhiệm."),
});

type CorrectiveActionFormValues = z.infer<typeof correctiveActionSchema>;

interface CorrectiveActionPanelProps {
  dnf: DnfDocument;
  onUpdate: () => void;
}

const translations = {
    vi: {
        title: "Hành động Khắc phục",
        description: "Theo dõi và quản lý các công việc cần thực hiện để giải quyết sự cố.",
        addAction: "Thêm Hành động Khắc phục",
        descriptionLabel: "Mô tả Công việc",
        descriptionPlaceholder: "Mô tả chi tiết công việc cần làm...",
        responsibleLabel: "Người/Đơn vị Chịu trách nhiệm",
        responsiblePlaceholder: "Chọn người/đơn vị",
        saveButton: "Lưu Hành động",
        updateButton: "Cập nhật",
        editAction: "Sửa Hành động",
        deleteAction: "Xóa Hành động",
        noActions: "Chưa có hành động khắc phục nào được tạo.",
        addSuccess: "Đã thêm hành động khắc phục thành công.",
        updateSuccess: "Đã cập nhật hành động khắc phục.",
        deleteSuccess: "Đã xóa hành động khắc phục.",
        error: "Lỗi",
        status: "Trạng thái",
        changeStatus: "Đổi trạng thái",
    },
    en: {
        title: "Corrective Actions",
        description: "Track and manage the tasks required to resolve the incident.",
        addAction: "Add Corrective Action",
        descriptionLabel: "Task Description",
        descriptionPlaceholder: "Describe the task to be performed...",
        responsibleLabel: "Responsible Person/Unit",
        responsiblePlaceholder: "Select person/unit",
        saveButton: "Save Action",
        updateButton: "Update",
        editAction: "Edit Action",
        deleteAction: "Delete Action",
        noActions: "No corrective actions have been created yet.",
        addSuccess: "Corrective action added successfully.",
        updateSuccess: "Corrective action updated.",
        deleteSuccess: "Corrective action deleted.",
        error: "Error",
        status: "Status",
        changeStatus: "Change Status",
    },
};

const getStatusBadgeVariant = (status: CorrectiveActionStatus): "default" | "secondary" | "destructive" | "outline" | "accent" => {
  switch (status) {
    case 'Mới': return "outline";
    case 'Đang thực hiện': return "secondary";
    case 'Hoàn thành': return "default";
    case 'Đã xác minh': return "default";
    default: return "outline";
  }
}

export function CorrectiveActionPanel({ dnf, onUpdate }: CorrectiveActionPanelProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = translations[locale];

  const actions = dnf.correctiveActions || [];
  const [users, setUsers] = React.useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAction, setEditingAction] = React.useState<CorrectiveAction | null>(null);

  const form = useForm<CorrectiveActionFormValues>({
    resolver: zodResolver(correctiveActionSchema),
  });
  
  React.useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleOpenDialog = (action: CorrectiveAction | null = null) => {
    setEditingAction(action);
    if (action) {
      form.reset({
        description: action.description,
        responsiblePersonOrUnit: action.responsiblePersonOrUnit,
      });
    } else {
      form.reset({
        description: "",
        responsiblePersonOrUnit: "",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CorrectiveActionFormValues) => {
    try {
      if (editingAction) {
        await updateCorrectiveAction(dnf.id, { ...editingAction, ...data });
        toast({ title: t.updateSuccess });
      } else {
        await addCorrectiveAction(dnf.id, { ...data });
        toast({ title: t.addSuccess });
      }
      onUpdate();
      setIsDialogOpen(false);
    } catch (e) {
      toast({ variant: 'destructive', title: t.error, description: String(e) });
    }
  };

  const handleDelete = async (actionId: string) => {
    try {
        await deleteCorrectiveAction(dnf.id, actionId);
        toast({ title: t.deleteSuccess });
        onUpdate();
    } catch (e) {
        toast({ variant: 'destructive', title: t.error, description: String(e) });
    }
  };
  
  const handleStatusChange = async (action: CorrectiveAction, newStatus: CorrectiveActionStatus) => {
    try {
      await updateCorrectiveAction(dnf.id, { ...action, status: newStatus });
      onUpdate();
    } catch(e) {
        toast({ variant: 'destructive', title: t.error, description: String(e) });
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary"/>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog(null)}><PlusCircle className="mr-2 h-4 w-4"/>{t.addAction}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAction ? t.editAction : t.addAction}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.descriptionLabel}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t.descriptionPlaceholder} {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="responsiblePersonOrUnit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.responsibleLabel}</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder={t.responsiblePlaceholder} /></SelectTrigger></FormControl>
                                    <SelectContent>
                                    {users.filter(u => u.status === 'active').map(user => (
                                        <SelectItem key={user.id} value={user.name}>{user.name} ({user.role})</SelectItem>
                                    ))}
                                    <SelectItem value="Đội Bảo trì A">Đội Bảo trì A</SelectItem>
                                    <SelectItem value="Nhà thầu XYZ">Nhà thầu XYZ</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                      <Button type="submit">{editingAction ? t.updateButton : t.saveButton}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">{t.noActions}</p>
        ) : (
          <div className="space-y-4">
            {actions.map(action => (
              <div key={action.id} className="border p-4 rounded-md space-y-2">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{action.description}</p>
                    <div className="flex items-center gap-2">
                         <Badge variant={getStatusBadgeVariant(action.status)}>{action.status}</Badge>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenDialog(action)}><Edit className="h-4 w-4"/></Button>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(action.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{t.responsibleLabel}: {action.responsiblePersonOrUnit}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">{t.changeStatus}</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {CORRECTIVE_ACTION_STATUSES.map(status => (
                          <DropdownMenuItem key={status} onSelect={() => handleStatusChange(action, status)} disabled={action.status === status}>
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    