
"use client";

import * as React from "react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Search, Edit, Trash2, CheckCircle, XCircle, Eye, EyeOff, Undo2, ChevronsUpDown, KeyRound, Bell, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROLE_ADMIN_PKTAT, type User, type Role, type ResponsibleUnit, type Subsystem, type PasswordResetRequest } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { addUser, updateUser, deleteUser, getUsers, adminResetUserPassword, getPendingPasswordResetRequests, approvePasswordResetRequest, rejectPasswordResetRequest } from "@/lib/actions/user.actions";
import { getRoles } from "@/lib/actions/role.actions";
import { getResponsibleUnits, getSubsystems } from "@/lib/actions/category.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

const passwordValidation = z.string()
    .min(10, "Mật khẩu phải có ít nhất 10 ký tự.")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");

const createUserSchema = z.object({
  id: z.string().min(1, "ID không được để trống."),
  name: z.string().min(1, "Tên không được để trống."),
  email: z.string().email("Email không hợp lệ."),
  password: passwordValidation,
  role: z.string().min(1, "Vai trò không được để trống."),
  status: z.enum(["active", "inactive"], { required_error: "Vui lòng chọn trạng thái." }),
  department: z.string().optional(),
  assignedSubsystems: z.array(z.string()).optional(),
});

const editUserSchema = z.object({
  id: z.string().min(1, "ID không được để trống."),
  name: z.string().min(1, "Tên không được để trống."),
  email: z.string().email("Email không hợp lệ."),
  role: z.string().min(1, "Vai trò không được để trống."),
  status: z.enum(["active", "inactive"], { required_error: "Vui lòng chọn trạng thái." }),
  department: z.string().optional(),
  assignedSubsystems: z.array(z.string()).optional(),
});


const translations = {
  vi: {
    title: "Quản lý Người dùng",
    description: "Thêm, sửa đổi và quản lý tài khoản người dùng trong hệ thống.",
    searchPlaceholder: "Tìm kiếm người dùng theo tên, email...",
    addUser: "Thêm Người dùng Mới",
    editUser: "Sửa thông tin Người dùng",
    deleteUser: "Xóa Người dùng",
    idHeader: "ID",
    nameHeader: "Tên",
    emailHeader: "Email",
    passwordHeader: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu ban đầu",
    passwordRequired: "Mật khẩu là bắt buộc cho người dùng mới.",
    togglePassword: "Hiện/Ẩn mật khẩu",
    roleHeader: "Vai trò",
    statusHeader: "Trạng thái",
    departmentHeader: "Phòng ban",
    departmentPlaceholder: "Chọn phòng ban/đơn vị",
    assignedSubsystemsHeader: "Đảm nhận Hệ thống con",
    assignedSubsystemsPlaceholder: "Chọn hệ thống con",
    assignedSubsystemsSelected: (count: number) => `${count} hệ thống con được chọn`,
    actionsHeader: "Hành động",
    editTooltip: "Chỉnh sửa",
    deleteTooltip: "Xóa",
    active: "Hoạt động",
    inactive: "Không hoạt động",
    noUsers: "Không có người dùng nào.",
    accessDenied: "Bạn không có quyền truy cập vào chức năng này.",
    save: "Lưu",
    cancel: "Hủy",
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteUserMsg: "Bạn có chắc chắn muốn xóa người dùng này không?",
    userAdded: "Đã thêm người dùng thành công!",
    userUpdated: "Đã cập nhật người dùng thành công!",
    userDeleted: "Đã xóa người dùng thành công!",
    errorIdExists: (id: string) => `ID Người dùng "${id}" đã tồn tại. Vui lòng chọn ID khác.`,
    addUserDialogTitle: "Thêm Người dùng Mới",
    addUserDialogDescription: "Nhập thông tin chi tiết cho tài khoản người dùng mới.",
    editUserDialogTitle: "Chỉnh sửa Thông tin Người dùng",
    editUserDialogDescription: (userName: string) => `Cập nhật thông tin cho người dùng: ${userName}`,
    undoLastChange: "Hoàn tác Thay đổi",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng thành công.",
    undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
    deleteFailedTitle: "Xóa thất bại",
    resetPassword: "Đặt lại Mật khẩu",
    resetPasswordDialogTitle: "Đặt lại Mật khẩu Người dùng",
    resetPasswordDialogDescription: (userName: string) => `Nhập mật khẩu mới cho người dùng: ${userName}`,
    newPasswordLabel: "Mật khẩu mới",
    newPasswordPlaceholder: "Nhập mật khẩu mới",
    resetPasswordSuccess: "Đã đặt lại mật khẩu thành công!",
    resetPasswordError: "Đặt lại mật khẩu thất bại.",
    passwordResetRequests: "Yêu cầu Đặt lại Mật khẩu",
    passwordResetRequestsDialogTitle: "Yêu cầu Đặt lại Mật khẩu đang chờ",
    passwordResetRequestsDialogDescription: "Duyệt và phê duyệt hoặc từ chối các yêu cầu đặt lại mật khẩu.",
    noResetRequests: "Không có yêu cầu nào đang chờ.",
    approve: "Duyệt",
    reject: "Từ chối",
    requestFrom: "Từ",
    requestDate: "Ngày yêu cầu",
    approveSuccess: "Đã duyệt yêu cầu đặt lại mật khẩu.",
    rejectSuccess: "Đã từ chối yêu cầu.",
  },
  en: {
    title: "User Management",
    description: "Add, modify, and manage user accounts in the system.",
    searchPlaceholder: "Search users by name, email...",
    addUser: "Add New User",
    editUser: "Edit User Information",
    deleteUser: "Delete User",
    idHeader: "ID",
    nameHeader: "Name",
    emailHeader: "Email",
    passwordHeader: "Password",
    passwordPlaceholder: "Enter initial password",
    passwordRequired: "Password is required for new users.",
    togglePassword: "Show/Hide password",
    roleHeader: "Role",
    statusHeader: "Status",
    departmentHeader: "Department",
    departmentPlaceholder: "Select department/unit",
    assignedSubsystemsHeader: "Assigned Subsystems",
    assignedSubsystemsPlaceholder: "Select subsystems",
    assignedSubsystemsSelected: (count: number) => `${count} selected`,
    actionsHeader: "Actions",
    editTooltip: "Edit",
    deleteTooltip: "Delete",
    active: "Active",
    inactive: "Inactive",
    noUsers: "No users found.",
    accessDenied: "You do not have permission to access this feature.",
    save: "Save",
    cancel: "Cancel",
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteUserMsg: "Are you sure you want to delete this user?",
    userAdded: "User added successfully!",
    userUpdated: "User updated successfully!",
    userDeleted: "User deleted successfully!",
    errorIdExists: (id: string) => `User ID "${id}" already exists. Please choose a different ID.`,
    addUserDialogTitle: "Add New User",
    addUserDialogDescription: "Enter details for the new user account.",
    editUserDialogTitle: "Edit User Information",
    editUserDialogDescription: (userName: string) => `Update information for user: ${userName}`,
    undoLastChange: "Undo Last Change",
    undoSuccess: "Successfully undid the last change.",
    undoNothing: "No recent changes to undo.",
    deleteFailedTitle: "Deletion Failed",
    resetPassword: "Reset Password",
    resetPasswordDialogTitle: "Reset User Password",
    resetPasswordDialogDescription: (userName: string) => `Enter a new password for user: ${userName}`,
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "Enter new password",
    resetPasswordSuccess: "Password reset successfully!",
    resetPasswordError: "Password reset failed.",
    passwordResetRequests: "Reset Requests",
    passwordResetRequestsDialogTitle: "Pending Password Reset Requests",
    passwordResetRequestsDialogDescription: "Review and approve or reject password reset requests.",
    noResetRequests: "No pending requests.",
    approve: "Approve",
    reject: "Reject",
    requestFrom: "From",
    requestDate: "Request Date",
    approveSuccess: "Password reset request approved.",
    rejectSuccess: "Request rejected.",
  },
};

export default function UserManagementPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const currentUserRole = user?.role;

  const [usersData, setUsersData] = React.useState<User[]>([]);
  const [rolesData, setRolesData] = React.useState<Role[]>([]);
  const [responsibleUnits, setResponsibleUnits] = React.useState<ResponsibleUnit[]>([]);
  const [subsystems, setSubsystems] = React.useState<Subsystem[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = React.useState(false);
  const [resetPasswordUser, setResetPasswordUser] = React.useState<User | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [isResetRequestsDialogOpen, setIsResetRequestsDialogOpen] = React.useState(false);
  const [resetRequests, setResetRequests] = React.useState<PasswordResetRequest[]>([]);
  const [approveRequestId, setApproveRequestId] = React.useState<string | null>(null);
  const [approvePassword, setApprovePassword] = React.useState("");
  const [showApprovePassword, setShowApprovePassword] = React.useState(false);
  
  const formSchema = editingUser ? editUserSchema : createUserSchema;
  type UserFormValues = z.infer<typeof formSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: "", name: "", email: "", role: "", status: "active", department: "", assignedSubsystems: [] },
  });
  
  const fetchData = React.useCallback(async () => {
    const [users, roles, units, fetchedSubsystems] = await Promise.all([getUsers(), getRoles(), getResponsibleUnits(), getSubsystems()]);
    setUsersData(users);
    setRolesData(roles);
    setResponsibleUnits(units);
    setSubsystems(fetchedSubsystems);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (currentUserRole !== ROLE_ADMIN_PKTAT) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md p-8 text-center">
          <CardTitle className="text-2xl text-destructive mb-4">{t.accessDenied}</CardTitle>
          <CardDescription>{locale === 'vi' ? `Chỉ Quản trị viên (P.KTAT) mới có quyền truy cập trang này.` : `Only Administrators (P.KTAT) can access this page.`}</CardDescription>
           <Button asChild className="mt-6">
            <Link href="/dashboard">
              {locale === 'vi' ? 'Quay lại Bảng điều khiển' : 'Back to Dashboard'}
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleOpenAddUserDialog = React.useCallback(() => {
    setEditingUser(null);
    setShowPassword(false);
    form.reset({ id: "", name: "", email: "", role: "", status: "active", department: "", assignedSubsystems: [] } as any);
    setIsUserDialogOpen(true);
  }, [form]);

  const handleOpenEditUserDialog = React.useCallback((user: User) => {
    setEditingUser(user);
    setShowPassword(false);
    form.reset({...user, assignedSubsystems: user.assignedSubsystems || []});
    setIsUserDialogOpen(true);
  }, [form]);

  const onSubmitUser = React.useCallback(async (data: UserFormValues) => {
    if (editingUser) {
      await updateUser({ ...editingUser, ...data } as any);
      toast({ title: t.userUpdated });
    } else {
      const createData = data as z.infer<typeof createUserSchema>;
      if (usersData.some(u => u.id === createData.id)) {
        toast({ variant: "destructive", title: t.errorIdExists(createData.id) });
        return;
      }
      await addUser(createData as any);
      toast({ title: t.userAdded });
    }
    setIsUserDialogOpen(false);
    fetchData();
  }, [editingUser, usersData, t, toast, fetchData]);

  const handleDeleteUser = React.useCallback(async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
        toast({ title: t.userDeleted });
        fetchData();
    } else {
        toast({
            variant: "destructive",
            title: t.deleteFailedTitle,
            description: result.message,
        });
    }
  }, [t, toast, fetchData]);
  
  const handleUndo = async () => {
    const success = await undoLastChange('User');
    if (success) {
      toast({ title: t.undoSuccess });
      fetchData();
    } else {
      toast({ title: t.undoNothing, variant: "default" });
    }
  };

  const handleOpenResetPasswordDialog = React.useCallback((user: User) => {
    setResetPasswordUser(user);
    setNewPassword("");
    setShowNewPassword(false);
    setIsResetPasswordDialogOpen(true);
  }, []);

  const handleResetPassword = React.useCallback(async () => {
    if (!resetPasswordUser || !newPassword) return;
    try {
      await adminResetUserPassword(resetPasswordUser.id, newPassword);
      toast({ title: t.resetPasswordSuccess });
      setIsResetPasswordDialogOpen(false);
      setResetPasswordUser(null);
      setNewPassword("");
    } catch (error: any) {
      toast({ variant: "destructive", title: t.resetPasswordError, description: error.message });
    }
  }, [resetPasswordUser, newPassword, t, toast]);

  const fetchResetRequests = React.useCallback(async () => {
    try {
      const requests = await getPendingPasswordResetRequests();
      setResetRequests(requests);
    } catch { setResetRequests([]); }
  }, []);

  const handleOpenResetRequests = React.useCallback(async () => {
    await fetchResetRequests();
    setIsResetRequestsDialogOpen(true);
  }, [fetchResetRequests]);

  const handleApproveRequest = React.useCallback(async () => {
    if (!approveRequestId || !approvePassword) return;
    try {
      await approvePasswordResetRequest(approveRequestId, approvePassword);
      toast({ title: t.approveSuccess });
      setApproveRequestId(null);
      setApprovePassword("");
      await fetchResetRequests();
    } catch (error: any) {
      toast({ variant: "destructive", title: t.resetPasswordError, description: error.message });
    }
  }, [approveRequestId, approvePassword, t, toast, fetchResetRequests]);

  const handleRejectRequest = React.useCallback(async (requestId: string) => {
    try {
      await rejectPasswordResetRequest(requestId);
      toast({ title: t.rejectSuccess });
      await fetchResetRequests();
    } catch (error: any) {
      toast({ variant: "destructive", title: t.resetPasswordError, description: error.message });
    }
  }, [t, toast, fetchResetRequests]);


  const filteredUsers = React.useMemo(() => 
    usersData.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [usersData, searchTerm]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline text-primary">{t.title}</h1>
         <Button variant="outline" size="sm" onClick={handleUndo}>
          <Undo2 className="mr-2 h-4 w-4" />
          {t.undoLastChange}
        </Button>
      </div>
       <p className="text-muted-foreground -mt-4">{t.description}</p>

      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? t.editUserDialogTitle : t.addUserDialogTitle}</DialogTitle>
            <DialogDescription>
              {editingUser ? t.editUserDialogDescription(editingUser.name) : t.addUserDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] -mx-6 px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitUser)} className="space-y-4 py-2 pr-6">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_id">{t.idHeader}</FormLabel>
                      <FormControl>
                        <Input id="user_id" {...field} disabled={!!editingUser} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_name">{t.nameHeader}</FormLabel>
                      <FormControl>
                        <Input id="user_name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_email">{t.emailHeader}</FormLabel>
                      <FormControl>
                        <Input id="user_email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!editingUser && (
                  <FormField
                    control={form.control}
                    name={"password" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="user_password">{t.passwordHeader}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              id="user_password"
                              type={showPassword ? "text" : "password"}
                              placeholder={t.passwordPlaceholder}
                              className="pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                            aria-label={t.togglePassword}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_role">{t.roleHeader}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={locale === 'vi' ? "Chọn vai trò" : "Select role"} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {rolesData.map(role => (
                            <SelectItem key={role.id} value={role.id}>{role.name} ({role.id})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="assignedSubsystems"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t.assignedSubsystemsHeader}</FormLabel>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <FormControl>
                                  <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
                                      {field.value && field.value.length > 0
                                          ? t.assignedSubsystemsSelected(field.value.length)
                                          : t.assignedSubsystemsPlaceholder
                                      }
                                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                              </FormControl>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                              {subsystems.map((sub) => (
                                  <DropdownMenuCheckboxItem
                                      key={sub.id}
                                      checked={field.value?.includes(sub.id)}
                                      onCheckedChange={(checked) => {
                                          const selected = field.value || [];
                                          return checked
                                              ? field.onChange([...selected, sub.id])
                                              : field.onChange(selected.filter((value) => value !== sub.id));
                                      }}
                                  >
                                      {sub.label[locale]}
                                  </DropdownMenuCheckboxItem>
                              ))}
                          </DropdownMenuContent>
                      </DropdownMenu>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_department">{t.departmentHeader}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.departmentPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {responsibleUnits.map(unit => (
                            <SelectItem key={unit.id} value={unit.name}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="user_status">{t.statusHeader}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={locale === 'vi' ? "Chọn trạng thái" : "Select status"} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="active">{t.active}</SelectItem>
                          <SelectItem value="inactive">{t.inactive}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>{t.cancel}</Button>
                  <Button type="submit">{t.save}</Button>
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.resetPasswordDialogTitle}</DialogTitle>
            <DialogDescription>
              {resetPasswordUser ? t.resetPasswordDialogDescription(resetPasswordUser.name) : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new_password_reset">{t.newPasswordLabel}</Label>
              <div className="relative">
                <Input
                  id="new_password_reset"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t.newPasswordPlaceholder}
                  className="pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>{t.cancel}</Button>
            <Button onClick={handleResetPassword} disabled={!newPassword}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Requests Dialog */}
      <Dialog open={isResetRequestsDialogOpen} onOpenChange={setIsResetRequestsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.passwordResetRequestsDialogTitle}</DialogTitle>
            <DialogDescription>{t.passwordResetRequestsDialogDescription}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {resetRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t.noResetRequests}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.requestFrom}</TableHead>
                    <TableHead>{t.emailHeader}</TableHead>
                    <TableHead>{t.requestDate}</TableHead>
                    <TableHead className="text-right">{t.actionsHeader}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resetRequests.map((req) => (
                    <React.Fragment key={req.id}>
                      <TableRow>
                        <TableCell className="font-medium">{req.userName}</TableCell>
                        <TableCell>{req.userEmail}</TableCell>
                        <TableCell>{new Date(req.createdAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                              title={t.approve}
                              onClick={() => { setApproveRequestId(req.id); setApprovePassword(""); setShowApprovePassword(false); }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                              title={t.reject}
                              onClick={() => handleRejectRequest(req.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {approveRequestId === req.id && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <div className="flex items-center gap-2 py-2">
                              <div className="relative flex-1">
                                <Input
                                  type={showApprovePassword ? "text" : "password"}
                                  placeholder={t.newPasswordPlaceholder}
                                  className="pr-10"
                                  value={approvePassword}
                                  onChange={(e) => setApprovePassword(e.target.value)}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowApprovePassword(!showApprovePassword)}
                                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                >
                                  {showApprovePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                              </div>
                              <Button size="sm" onClick={handleApproveRequest} disabled={!approvePassword}>{t.approve}</Button>
                              <Button size="sm" variant="outline" onClick={() => setApproveRequestId(null)}>{t.cancel}</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center gap-4">
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
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" onClick={handleOpenResetRequests}>
                <Bell className="mr-2 h-4 w-4" />
                {t.passwordResetRequests}
                {resetRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{resetRequests.length}</Badge>
                )}
              </Button>
              <Button onClick={handleOpenAddUserDialog}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {t.addUser}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.idHeader}</TableHead>
                <TableHead>{t.nameHeader}</TableHead>
                <TableHead>{t.emailHeader}</TableHead>
                <TableHead>{t.roleHeader}</TableHead>
                <TableHead>{t.assignedSubsystemsHeader}</TableHead>
                <TableHead>{t.statusHeader}</TableHead>
                <TableHead className="text-right">{t.actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium font-mono text-xs">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.assignedSubsystems && user.assignedSubsystems.length > 0
                        ? user.assignedSubsystems.map(subId => {
                            const sub = subsystems.find(s => s.id === subId);
                            return <Badge key={subId} variant="secondary">{sub ? sub.label[locale] : subId}</Badge>;
                          })
                        : "N/A"
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "outline"}
                           className={user.status === "active" ? "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/20" : "bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"}>
                      {user.status === "active" ? <CheckCircle className="mr-1 h-3.5 w-3.5"/> : <XCircle className="mr-1 h-3.5 w-3.5"/>}
                      {user.status === "active" ? t.active : t.inactive}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" title={t.resetPassword} onClick={() => handleOpenResetPasswordDialog(user)}>
                        <KeyRound className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title={t.editTooltip} onClick={() => handleOpenEditUserDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title={t.deleteTooltip}>
                             <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogDescription>{t.confirmDeleteUserMsg}</AlertDialogDescription>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>{t.deleteUser}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
               {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {t.noUsers}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    