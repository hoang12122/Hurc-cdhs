

"use client";

import * as React from 'react';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Users, ShieldCheck, ExternalLink, Settings as SettingsIcon, Database, KeySquare, Loader2, Cpu, Archive, RadioTower } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage, type Locale } from '@/contexts/language-context';
import Link from "next/link";
import { type Role } from "@/lib/constants";
import { getRoles } from "@/lib/actions/role.actions";
import { createSystemBackup, restoreSystemFromBackup, runSnmpDeviceScan, runSystemScheduler, getSystemState, updateAiModelConfig } from "@/lib/actions/system.actions";
import { hasPermission } from '@/lib/auth';
import { DEFAULT_AI_MODEL } from '@/lib/services/ai';

const translations = {
  vi: {
    pageTitle: "Cài Đặt & Cấu hình Hệ thống",
    pageDescription: "Quản lý các tùy chọn, tích hợp và cấu hình cho ứng dụng.",
    uiOptions: "Tùy chọn Giao diện",
    darkMode: "Chế độ tối",
    darkModeDesc: "Kích hoạt giao diện tối cho toàn bộ ứng dụng.",
    language: "Ngôn ngữ",
    languageSelectPlaceholder: "Chọn ngôn ngữ",
    languageDesc: "Chọn ngôn ngữ hiển thị cho ứng dụng.",
    dataManagement: "Quản lý Dữ liệu",
    backupData: "Sao lưu dữ liệu",
    backupDataDesc: "Tạo một bản sao lưu toàn bộ dữ liệu hệ thống vào tệp backup.",
    backupButton: "Bắt đầu Sao lưu",
    backupInProgress: "Đang sao lưu...",
    backupSuccess: "Sao lưu dữ liệu thành công!",
    backupError: "Sao lưu dữ liệu thất bại.",
    restoreData: "Khôi phục dữ liệu",
    restoreDataDesc: "Khôi phục dữ liệu từ bản sao lưu gần nhất. Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại.",
    restoreButton: "Khôi phục từ Sao lưu",
    restoreInProgress: "Đang khôi phục...",
    restoreConfirmTitle: "Xác nhận Khôi phục",
    restoreConfirmMessage: "Bạn có chắc chắn muốn khôi phục dữ liệu không? Tất cả dữ liệu hiện tại chưa được sao lưu sẽ bị mất.",
    restoreSuccess: "Khôi phục dữ liệu thành công!",
    restoreError: "Khôi phục dữ liệu thất bại. Có thể không có tệp sao lưu.",
    confirmAction: "Xác nhận",
    cancelAction: "Hủy",
    integrationsTitle: "Tích hợp & Mở rộng",
    integrationsDesc: "Quản lý các kết nối API.",
    apiKeysButton: "Quản lý Khóa API",
    integrationDescText: "Quản lý khóa API cho các dịch vụ.",
    userRoleManagement: "Quản lý Người dùng & Vai trò",
    userRoleManagementDesc: "Quản lý tài khoản người dùng, vai trò và phân quyền chi tiết.",
    manageUsersButton: "Quản lý Người dùng",
    manageRolesButton: "Quản lý Vai trò",
    currentRolesTitle: "Các vai trò hiện tại",
    roleNameHeader: "Tên Vai trò",
    roleDescriptionHeader: "Mô tả",
    actionHeader: "Hành động",
    managePermissionsButton: "Quản lý quyền",
    dataArchiving: "Lưu trữ Dữ liệu",
    archiveDnfs: "Lưu trữ Dữ liệu Cũ",
    archiveDnfsDesc: "Chuyển các mục đã đóng/hoàn thành (Sự cố, Kiểm tra, Mối nguy) vào kho lưu trữ an toàn (chỉ đọc).",
    archiveButton: "Bắt đầu Lưu trữ",
    archiveInProgress: "Đang lưu trữ...",
    archiveSuccess: (count: number) => `Đã lưu trữ thành công ${count} mục.`,
    archiveNothing: "Không có mục nào cần lưu trữ.",
    archiveError: "Lưu trữ dữ liệu thất bại.",
    networkOperations: "Tác vụ Mạng",
    snmpScan: "Quét Thiết bị SNMP",
    snmpScanDesc: "Thực hiện quét mạng để phát hiện và đăng ký thiết bị mới.",
    snmpScanButton: "Bắt đầu Quét",
    snmpScanInProgress: "Đang quét...",
    snmpScanSuccess: "Quét hoàn tất!",
    snmpScanSuccessDesc: (count: number) => `Đã phát hiện ${count} thiết bị mới. Kiểm tra nhật ký hệ thống để biết chi tiết.`,
    accessDeniedTitle: "Truy cập bị từ chối",
    accessDeniedDescription: "Bạn không có quyền truy cập vào chức năng này. Vui lòng liên hệ quản trị viên.",
    aiSettingsTitle: "Cấu hình Trợ lý AI",
    aiSettingsDesc: "Lựa chọn mô hình ngôn ngữ lớn (LLM) để AI hỗ trợ điền mẫu.",
    aiModelLabel: "Mô hình HuggingFace",
    aiModelSaved: "Đã lưu cấu hình AI thành công.",
  },
  en: {
    pageTitle: "System Settings & Configuration",
    pageDescription: "Manage options, integrations, and configurations for the application.",
    uiOptions: "Interface Options",
    darkMode: "Dark Mode",
    darkModeDesc: "Enable dark theme for the entire application.",
    language: "Language",
    languageSelectPlaceholder: "Select language",
    languageDesc: "Choose the display language for the application.",
    dataManagement: "Data Management",
    backupData: "Backup Data",
    backupDataDesc: "Create a full backup of all system data to the backup file.",
    backupButton: "Start Backup",
    backupInProgress: "Backing up...",
    backupSuccess: "Data backup successful!",
    backupError: "Data backup failed.",
    restoreData: "Restore Data",
    restoreDataDesc: "Restore data from the last backup. This will overwrite all current data.",
    restoreButton: "Restore from Backup",
    restoreInProgress: "Restoring...",
    restoreConfirmTitle: "Confirm Restore",
    restoreConfirmMessage: "Are you sure you want to restore the data? All current unsaved data will be lost.",
    restoreSuccess: "Data restore successful!",
    restoreError: "Data restore failed. No backup file might exist.",
    confirmAction: "Confirm",
    cancelAction: "Cancel",
    integrationsTitle: "Integrations & Extensions",
    integrationsDesc: "Manage API connections.",
    apiKeysButton: "Manage API Keys",
    integrationDescText: "Manage API keys for services.",
    userRoleManagement: "User & Role Management",
    userRoleManagementDesc: "Manage user accounts, roles, and detailed permissions.",
    manageUsersButton: "Manage Users",
    manageRolesButton: "Manage Roles",
    currentRolesTitle: "Current Roles",
    roleNameHeader: "Role Name",
    roleDescriptionHeader: "Description",
    actionHeader: "Actions",
    managePermissionsButton: "Manage Permissions",
    dataArchiving: "Data Archiving",
    archiveDnfs: "Archive Old Data",
    archiveDnfsDesc: "Move closed/completed items (Incidents, Inspections, Hazards) to a secure, read-only archive.",
    archiveButton: "Start Archiving",
    archiveInProgress: "Archiving...",
    archiveSuccess: (count: number) => `Successfully archived ${count} items.`,
    archiveNothing: "No items to archive.",
    archiveError: "Data archiving failed.",
    networkOperations: "Network Operations",
    snmpScan: "Scan SNMP Devices",
    snmpScanDesc: "Perform a network scan to discover and register new devices.",
    snmpScanButton: "Start Scan",
    snmpScanInProgress: "Scanning...",
    snmpScanSuccess: "Scan Complete!",
    snmpScanSuccessDesc: (count: number) => `Discovered ${count} new devices. Check system logs for details.`,
    accessDeniedTitle: "Access Denied",
    accessDeniedDescription: "You do not have permission to access this feature. Please contact an administrator.",
    aiSettingsTitle: "AI Assistant Configuration",
    aiSettingsDesc: "Select the large language model (LLM) for AI form assistance.",
    aiModelLabel: "HuggingFace Model",
    aiModelSaved: "AI configuration saved successfully.",
  }
};


export default function SettingsPage() {
  const { locale, setLocale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [isBackingUp, setIsBackingUp] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [aiModel, setAiModel] = React.useState<string>(DEFAULT_AI_MODEL);

  React.useEffect(() => {
    async function checkAccessAndFetch() {
      const canManageSettings = await hasPermission("settings:manage");
      setHasAccess(canManageSettings);
      if (canManageSettings) {
        document.title = locale === 'en' ? 'Settings - Metro Inspect Pro' : 'Cài Đặt - Metro Inspect Pro';
        getRoles().then(setRoles);
        getSystemState().then(state => {
            if (state.aiModelConfig) setAiModel(state.aiModelConfig);
        });
      }
      setIsLoading(false);
    }
    checkAccessAndFetch();
  }, [locale]);
  
  const handleBackup = async () => {
      setIsBackingUp(true);
      try {
          await createSystemBackup();
          toast({ title: t.backupSuccess });
      } catch (error) {
          console.error("Backup failed:", error);
          toast({ title: t.backupError, variant: "destructive" });
      } finally {
          setIsBackingUp(false);
      }
  };

  const handleRestore = async () => {
      setIsRestoring(true);
      try {
          const success = await restoreSystemFromBackup();
          if (success) {
              toast({ title: t.restoreSuccess });
          } else {
              toast({ title: t.restoreError, variant: "destructive" });
          }
      } catch (error) {
          console.error("Restore failed:", error);
          toast({ title: t.restoreError, variant: "destructive" });
      } finally {
          setIsRestoring(false);
      }
  };

  const handleArchive = async () => {
      setIsArchiving(true);
      try {
          // Manually trigger the scheduler to run just the archive part
          await runSystemScheduler();
          toast({ title: "Hoàn tất", description: "Đã chạy tác vụ lưu trữ." });

      } catch (error) {
          console.error("Archiving failed:", error);
          toast({ title: t.archiveError, variant: "destructive" });
      } finally {
          setIsArchiving(false);
      }
  };
  
  const handleSnmpScan = async () => {
    setIsScanning(true);
    try {
      const result = await runSnmpDeviceScan();
      toast({ title: t.snmpScanSuccess, description: t.snmpScanSuccessDesc(result.discovered) });
    } catch (error) {
      console.error("SNMP Scan failed:", error);
      toast({ title: "Scan Failed", description: "Could not complete the device scan.", variant: "destructive" });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveAiModel = async (value: string) => {
      setAiModel(value);
      try {
          await updateAiModelConfig(value);
          toast({ title: t.aiModelSaved });
      } catch (err: any) {
          toast({ title: "Lỗi lưu AI", description: err.message, variant: "destructive" });
      }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!hasAccess) {
      return (
          <Card className="w-full max-w-md mx-auto mt-10">
              <CardHeader>
                  <CardTitle>{t.accessDeniedTitle}</CardTitle>
                  <CardDescription>{t.accessDeniedDescription}</CardDescription>
              </CardHeader>
          </Card>
      );
  }


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageDescription}</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t.uiOptions}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode" className="text-base">{t.darkMode}</Label>
              <p className="text-sm text-muted-foreground">{t.darkModeDesc}</p>
            </div>
            <Switch id="darkMode" aria-label={t.darkMode} disabled />
          </div>
           <div>
              <Label htmlFor="language" className="text-base">{t.language}</Label>
               <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
                <SelectTrigger className="w-[200px] mt-1">
                  <SelectValue placeholder={t.languageSelectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">{t.languageDesc}</p>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Database /> {t.dataManagement}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <Label className="text-base">{t.backupData}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.backupDataDesc}</p>
                <Button variant="outline" onClick={handleBackup} disabled={isBackingUp || isRestoring || isArchiving}>
                    {isBackingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isBackingUp ? t.backupInProgress : t.backupButton}
                </Button>
            </div>
            <div>
                <Label className="text-base">{t.restoreData}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.restoreDataDesc}</p>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isRestoring || isBackingUp || isArchiving}>{t.restoreButton}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t.restoreConfirmTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{t.restoreConfirmMessage}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancelAction}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRestore}>
                                {isRestoring ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.restoreInProgress}</>
                                ) : t.confirmAction}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
             <div>
                <Label className="text-base flex items-center gap-2"><Archive /> {t.dataArchiving}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.archiveDnfsDesc}</p>
                <Button variant="outline" onClick={handleArchive} disabled={isBackingUp || isRestoring || isArchiving}>
                    {isArchiving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isArchiving ? t.archiveInProgress : t.archiveButton}
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Cpu className="h-5 w-5" /> {t.aiSettingsTitle}</CardTitle>
          <CardDescription>{t.aiSettingsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
              <Label htmlFor="aiModel" className="text-base">{t.aiModelLabel}</Label>
               <Select value={aiModel} onValueChange={handleSaveAiModel}>
                <SelectTrigger className="w-[300px] mt-1">
                  <SelectValue placeholder="Chọn mô hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemma-7b-it">Google Gemma 7B IT (Mặc định)</SelectItem>
                  <SelectItem value="meta-llama/Meta-Llama-3-8B-Instruct">Meta Llama 3 8B Instruct</SelectItem>
                  <SelectItem value="Qwen/Qwen2.5-72B-Instruct">Qwen 2.5 72B Instruct</SelectItem>
                  <SelectItem value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B Instruct v0.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><RadioTower /> {t.networkOperations}</CardTitle>
        </CardHeader>
        <CardContent>
            <div>
                <Label className="text-base">{t.snmpScan}</Label>
                <p className="text-sm text-muted-foreground mb-2">{t.snmpScanDesc}</p>
                <Button variant="outline" onClick={handleSnmpScan} disabled={isScanning}>
                    {isScanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isScanning ? t.snmpScanInProgress : t.snmpScanButton}
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary"/>{t.userRoleManagement}</CardTitle>
          <CardDescription>{t.userRoleManagementDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                    <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        {t.manageUsersButton}
                        <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground"/>
                    </Link>
                </Button>
                <Button asChild variant="outline">
                     <Link href="/admin/roles">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        {t.manageRolesButton}
                        <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground"/>
                    </Link>
                </Button>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">{t.currentRolesTitle}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.roleNameHeader}</TableHead>
                      <TableHead>{t.roleDescriptionHeader}</TableHead>
                      <TableHead className="text-right">{t.actionHeader}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/roles">{t.managePermissionsButton}</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    
