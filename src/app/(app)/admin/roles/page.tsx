
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Edit, Trash2, ShieldCheck, Undo2 } from "lucide-react";
import { MOCK_CURRENT_USER, ROLE_ADMIN_PKTAT, SYSTEM_PERMISSIONS, type SystemPermission, type NavItemLabel, type Role } from "@/lib/constants";
import { addRole, updateRole, deleteRole, getRoles } from "@/lib/actions/role.actions";
import { getUsers } from "@/lib/actions/user.actions";
import { undoLastChange } from "@/lib/actions/system.actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";


const roleSchema = z.object({
  id: z.string().min(1, "ID Vai trò không được để trống."),
  name: z.string().min(1, "Tên Vai trò không được để trống."),
  description: z.string().min(1, "Mô tả không được để trống."),
  permissions: z.array(z.string()).optional(),
});

const translations = {
  vi: {
    title: "Quản lý Vai trò",
    description: "Định nghĩa và cấu hình các vai trò người dùng và quyền hạn tương ứng.",
    addRole: "Thêm Vai trò Mới",
    editRole: "Sửa Vai trò",
    deleteRole: "Xóa Vai trò",
    idHeader: "ID Vai trò",
    nameHeader: "Tên Vai trò",
    descriptionHeader: "Mô tả",
    actionsHeader: "Hành động",
    managePermissions: "Quản lý Quyền",
    noRoles: "Không có vai trò nào.",
    save: "Lưu",
    cancel: "Hủy",
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteRoleMsg: "Bạn có chắc chắn muốn xóa vai trò này không?",
    roleAdded: "Đã thêm vai trò thành công!",
    roleUpdated: "Đã cập nhật vai trò thành công!",
    roleDeleted: "Đã xóa vai trò thành công!",
    errorIdExists: (id: string) => `ID Vai trò "${id}" đã tồn tại. Vui lòng chọn ID khác.`,
    addRoleDialogTitle: "Thêm Vai trò Mới",
    addRoleDialogDescription: "Nhập thông tin cho vai trò người dùng mới.",
    editRoleDialogTitle: "Chỉnh sửa Vai trò",
    editRoleDialogDescription: (roleName: string) => `Cập nhật thông tin cho vai trò: ${roleName}`,
    accessDenied: "Bạn không có quyền truy cập vào chức năng này.",
    permissionsDialogTitle: (roleName: string) => `Quản lý Quyền cho Vai trò: ${roleName}`,
    savePermissions: "Lưu Quyền",
    permissionsUpdated: (roleName: string) => `Đã cập nhật quyền cho vai trò "${roleName}"!`,
    noPermissionsAssigned: "Chưa có quyền nào được gán.",
    permissionGroupLabel: (group: string) => `Nhóm quyền: ${group}`,
    undoLastChange: "Hoàn tác Thay đổi",
    undoSuccess: "Đã hoàn tác thay đổi cuối cùng thành công.",
    undoNothing: "Không có thay đổi nào gần đây để hoàn tác.",
  },
  en: {
    title: "Role Management",
    description: "Define and configure user roles and their corresponding permissions.",
    addRole: "Add New Role",
    editRole: "Edit Role",
    deleteRole: "Delete Role",
    idHeader: "Role ID",
    nameHeader: "Role Name",
    descriptionHeader: "Description",
    actionsHeader: "Actions",
    managePermissions: "Manage Permissions",
    noRoles: "No roles found.",
    save: "Save",
    cancel: "Cancel",
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteRoleMsg: "Are you sure you want to delete this role?",
    roleAdded: "Role added successfully!",
    roleUpdated: "Role updated successfully!",
    roleDeleted: "Role deleted successfully!",
    errorIdExists: (id: string) => `Role ID "${id}" already exists. Please choose a different ID.`,
    addRoleDialogTitle: "Add New Role",
    addRoleDialogDescription: "Enter information for the new user role.",
    editRoleDialogTitle: "Edit Role",
    editRoleDialogDescription: (roleName: string) => `Update information for role: ${roleName}`,
    accessDenied: "You do not have permission to access this feature.",
    permissionsDialogTitle: (roleName: string) => `Manage Permissions for Role: ${roleName}`,
    savePermissions: "Save Permissions",
    permissionsUpdated: (roleName: string) => `Permissions updated for role "${roleName}"!`,
    noPermissionsAssigned: "No permissions assigned yet.",
    permissionGroupLabel: (group: string) => `Permission Group: ${group}`,
    undoLastChange: "Undo Last Change",
    undoSuccess: "Successfully undid the last change.",
    undoNothing: "No recent changes to undo.",
  },
};

export default function RoleManagementPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const currentUserRole = user?.role;

  const [rolesData, setRolesData] = React.useState<Role[]>([]);
  const [usersData, setUsersData] = React.useState<any[]>([]);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState<Role | null>(null);

  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = React.useState(false);
  const [selectedRoleForPermissions, setSelectedRoleForPermissions] = React.useState<Role | null>(null);
  const [currentPermissions, setCurrentPermissions] = React.useState<string[]>([]);

  const fetchData = React.useCallback(async () => {
    const [roles, users] = await Promise.all([getRoles(), getUsers()]);
    setRolesData(roles);
    setUsersData(users);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const roleForm = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: { id: "", name: "", description: "", permissions: [] },
  });

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

  const handleOpenAddRoleDialog = React.useCallback(() => {
    setEditingRole(null);
    roleForm.reset({ id: "", name: "", description: "", permissions: [] });
    setIsRoleDialogOpen(true);
  }, [roleForm]);

  const handleOpenEditRoleDialog = React.useCallback((role: Role) => {
    setEditingRole(role);
    roleForm.reset(role);
    setIsRoleDialogOpen(true);
  }, [roleForm]);

  const onSubmitRole = React.useCallback(async (data: z.infer<typeof roleSchema>) => {
    const roleWithPermissions = { ...data, permissions: data.permissions || [] };
    if (editingRole) {
      await updateRole({ ...editingRole, ...roleWithPermissions });
      toast({ title: t.roleUpdated });
    } else {
      if (rolesData.some(r => r.id === data.id)) {
        toast({ variant: "destructive", title: t.errorIdExists(data.id) });
        return;
      }
      await addRole(roleWithPermissions);
      toast({ title: t.roleAdded });
    }
    setIsRoleDialogOpen(false);
    fetchData();
  }, [editingRole, rolesData, t, toast, fetchData]);

  const handleDeleteRole = React.useCallback(async (roleId: string) => {
    await deleteRole(roleId);
    toast({ title: t.roleDeleted });
    fetchData();
  }, [t, toast, fetchData]);

  const handleOpenPermissionsDialog = React.useCallback((role: Role) => {
    setSelectedRoleForPermissions(role);
    setCurrentPermissions(role.permissions || []);
    setIsPermissionsDialogOpen(true);
  }, []);

  const handlePermissionChange = React.useCallback((permissionId: string, checked: boolean | string) => {
    setCurrentPermissions(prev =>
      checked
        ? [...prev, permissionId]
        : prev.filter(p => p !== permissionId)
    );
  }, []);

  const handleSavePermissions = React.useCallback(async () => {
    if (!selectedRoleForPermissions) return;
    const updatedRoleWithNewPermissions = { ...selectedRoleForPermissions, permissions: currentPermissions };
    await updateRole(updatedRoleWithNewPermissions);
    toast({ title: t.permissionsUpdated(selectedRoleForPermissions.name) });
    setIsPermissionsDialogOpen(false);
    fetchData();
  }, [selectedRoleForPermissions, currentPermissions, t, toast, fetchData]);

  const handleUndo = async () => {
    const success = await undoLastChange('Role');
    if (success) {
      toast({ title: t.undoSuccess });
      fetchData(); // Refresh data after undo
    } else {
      toast({ title: t.undoNothing, variant: "default" });
    }
  };

  const groupedSystemPermissions = React.useMemo(() => 
    SYSTEM_PERMISSIONS.reduce((acc, perm) => {
      const groupLabel = perm.group[locale];
      if (!acc[groupLabel]) {
        acc[groupLabel] = [];
      }
      acc[groupLabel].push(perm);
      return acc;
    }, {} as Record<string, SystemPermission[]>), 
  [locale]);


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

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? t.editRoleDialogTitle : t.addRoleDialogTitle}</DialogTitle>
            <DialogDescription>
              {editingRole ? t.editRoleDialogDescription(editingRole.name) : t.addRoleDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <Form {...roleForm}>
            <form onSubmit={roleForm.handleSubmit(onSubmitRole)} className="space-y-4 py-2">
              <FormField
                control={roleForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role_id">{t.idHeader}</FormLabel>
                    <FormControl>
                      <Input id="role_id" {...field} disabled={!!editingRole} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={roleForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role_name">{t.nameHeader}</FormLabel>
                    <FormControl>
                      <Input id="role_name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={roleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="role_description">{t.descriptionHeader}</FormLabel>
                    <FormControl>
                      <Textarea id="role_description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>{t.cancel}</Button>
                <Button type="submit">{t.save}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRoleForPermissions ? t.permissionsDialogTitle(selectedRoleForPermissions.name) : ""}</DialogTitle>
            <DialogDescription>
              {locale === 'vi' ? `Chọn các quyền hạn cụ thể cho vai trò này.` : `Select specific permissions for this role.`}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] p-1 pr-3">
            <div className="space-y-6 py-2">
              {Object.entries(groupedSystemPermissions).map(([groupName, permissionsInGroup]) => (
                <div key={groupName}>
                  <h3 className="text-lg font-semibold mb-3 border-b pb-1">{groupName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                    {permissionsInGroup.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={currentPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                        />
                        <Label htmlFor={`perm-${permission.id}`} className="text-sm font-normal cursor-pointer">
                          {permission.label[locale]} <span className="text-xs text-muted-foreground">({permission.id})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>{t.cancel}</Button>
            <Button type="button" onClick={handleSavePermissions}>{t.savePermissions}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{locale === 'vi' ? 'Danh sách Vai trò' : 'Role List'}</CardTitle>
              <CardDescription>{locale === 'vi' ? `Có tổng cộng ${rolesData.length} vai trò trong hệ thống.` : `Total ${rolesData.length} roles defined.`}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleOpenAddRoleDialog}>
                <PlusCircle className="mr-2 h-5 w-5" />
                {t.addRole}
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
                <TableHead>{locale === 'vi' ? 'Quyền hạn' : 'Permissions'}</TableHead>
                <TableHead>{locale === 'vi' ? 'Người dùng' : 'Users'}</TableHead>
                <TableHead>{t.descriptionHeader}</TableHead>
                <TableHead className="text-right">{t.actionsHeader}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesData.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium font-mono text-xs">{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {role.permissions?.length || 0} {locale === 'vi' ? 'quyền' : 'permissions'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {usersData.filter(u => u.role === role.id).length}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-normal max-w-xs truncate">{role.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                       <Button variant="ghost" size="icon" title={t.editRole} onClick={() => handleOpenEditRoleDialog(role)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title={t.deleteRole} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>{t.confirmDeleteRoleMsg}</AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteRole(role.id)}>{t.deleteRole}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="outline" size="sm" onClick={() => handleOpenPermissionsDialog(role)}>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {t.managePermissions}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
               {rolesData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    {t.noRoles}
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
