"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLanguage } from "@/contexts/language-context";
import { 
  Eye, EyeOff, Loader2, Camera, Shield, KeySquare, 
  User as UserIcon, Plus, Trash2, Check, Copy, Download,
  QrCode, AlertTriangle, ShieldCheck, RefreshCw, Key,
  Calendar, FileText, Rss, ArrowRight, ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUser, updateUserPassword } from "@/lib/actions/user.actions";
import { type User } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  getTwoFAStatus, 
  setupNew2FADevice, 
  confirmTwoFADevice, 
  makeDeviceDefault, 
  revoke2FADevice, 
  createBackupCodes 
} from "@/lib/actions/twofa.actions";

import { 
  getTokens, 
  createToken, 
  deleteToken 
} from "@/lib/actions/token.actions";

import '@/styles/design-tokens.css';

const passwordValidation = z.string()
    .min(10, "Mật khẩu phải có ít nhất 10 ký tự.")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");

const translations = {
  vi: {
    pageTitle: "Hồ Sơ & Bảo Mật",
    pageDescription: "Quản lý thông tin cá nhân, cài đặt xác thực 2 yếu tố và mã thông báo truy cập.",
    personalInfoTab: "Thông tin cá nhân",
    security2faTab: "Xác thực 2 yếu tố",
    tokensTab: "Mã thông báo truy cập",
    userName: "Họ và tên",
    email: "Email",
    employeeId: "Mã nhân viên",
    role: "Vai trò",
    changePassword: "Đổi mật khẩu",
    newPassword: "Mật khẩu mới",
    confirmNewPassword: "Xác nhận mật khẩu mới",
    passwordsDoNotMatch: "Mật khẩu mới không khớp.",
    saveChanges: "Lưu thay đổi",
    userAvatar: "Ảnh đại diện",
    changePhoto: "Thay đổi ảnh",
    togglePassword: "Hiện/Ẩn mật khẩu",
    updateSuccess: "Hồ sơ đã được cập nhật!",
    updateError: "Lỗi khi cập nhật hồ sơ.",
    leaveBlank: "(để trống nếu không thay đổi)",
    passwordUpdateSuccess: "Đã cập nhật mật khẩu thành công!",
    passwordUpdateError: "Không thể cập nhật mật khẩu.",
    saving: "Đang lưu...",
  },
  en: {
    pageTitle: "Profile & Security",
    pageDescription: "Manage personal details, 2FA settings, and personal access tokens.",
    personalInfoTab: "Personal Profile",
    security2faTab: "Two-Factor Auth",
    tokensTab: "Access Tokens",
    userName: "Full Name",
    email: "Email",
    employeeId: "Employee ID",
    role: "Role",
    changePassword: "Change password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    passwordsDoNotMatch: "New passwords do not match.",
    saveChanges: "Save Changes",
    userAvatar: "User avatar",
    changePhoto: "Change Photo",
    togglePassword: "Show/Hide password",
    updateSuccess: "Profile updated successfully!",
    updateError: "Error updating profile.",
    leaveBlank: "(leave blank if not changing)",
    passwordUpdateSuccess: "Password updated successfully!",
    passwordUpdateError: "Could not update password.",
    saving: "Saving...",
  }
};

const createProfileSchema = (t: any) => z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email(),
  avatarUrl: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
    if (data.newPassword || data.confirmNewPassword) {
      if (!data.newPassword || !data.confirmNewPassword) {
        return false;
      }
      return data.newPassword === data.confirmNewPassword;
    }
    return true;
}, {
    message: t.passwordsDoNotMatch,
    path: ["confirmNewPassword"],
}).refine(data => {
    if (data.newPassword && data.newPassword.length > 0) {
        return passwordValidation.safeParse(data.newPassword).success;
    }
    return true;
}, {
    message: "Mật khẩu mới không đáp ứng yêu cầu bảo mật. (Ít nhất 10 ký tự, gồm chữ hoa, chữ thường, số, và ký tự đặc biệt)",
    path: ["newPassword"],
});

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

export default function ProfilePage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();
  const { user, setAuthInfo } = useAuth();
  
  // States for Profile Tab
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  // States for 2FA Tab
  const [twofaStatus, setTwofaStatus] = React.useState<any>(null);
  const [loading2FA, setLoading2FA] = React.useState(true);
  const [isRegistering2FA, setIsRegistering2FA] = React.useState(false);
  const [newDeviceName, setNewDeviceName] = React.useState("");
  const [registrationData, setRegistrationData] = React.useState<any>(null);
  const [otpCode, setOtpCode] = React.useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [backupCodesList, setBackupCodesList] = React.useState<string[]>([]);
  const [isGeneratingBackups, setIsGeneratingBackups] = React.useState(false);

  // States for Access Tokens Tab
  const [activeTokenSubTab, setActiveTokenSubTab] = React.useState<'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss'>('api');
  const [tokensList, setTokensList] = React.useState<any[]>([]);
  const [loadingTokens, setLoadingTokens] = React.useState(false);
  
  // Token creation states
  const [isCreatingToken, setIsCreatingToken] = React.useState(false);
  const [tokenName, setTokenName] = React.useState("");
  const [tokenExpiresIn, setTokenExpiresIn] = React.useState("30");
  const [tokenCalendar, setTokenCalendar] = React.useState("");
  const [tokenProject, setTokenProject] = React.useState("");
  const [newlyCreatedRawToken, setNewlyCreatedRawToken] = React.useState<string | null>(null);
  const [copiedToken, setCopiedToken] = React.useState(false);

  // Load Profile Form
  const profileSchema = createProfileSchema(t);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatarUrl: user?.avatarUrl || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  
  const watchedAvatarUrl = form.watch('avatarUrl');

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, form]);

  React.useEffect(() => {
    document.title = `${t.pageTitle} - HURC CDHS`;
  }, [t.pageTitle, locale]);

  // Fetch 2FA Status
  const fetch2FAStatus = async () => {
    try {
      const status = await getTwoFAStatus();
      setTwofaStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading2FA(false);
    }
  };

  // Fetch Tokens List
  const fetchTokens = async (type: 'api' | 'icalendar' | 'meeting_ical' | 'oauth' | 'rss') => {
    setLoadingTokens(true);
    try {
      const list = await getTokens(type);
      setTokensList(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTokens(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetch2FAStatus();
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      fetchTokens(activeTokenSubTab);
    }
  }, [user, activeTokenSubTab]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setValue("avatarUrl", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    try {
        let userToUpdate: User = { ...user };
        let profileUpdated = false;
        let passwordUpdated = false;

        if (data.name !== user.name || data.email !== user.email || data.avatarUrl !== user.avatarUrl) {
            userToUpdate.name = data.name;
            userToUpdate.email = data.email;
            userToUpdate.avatarUrl = data.avatarUrl;
            await updateUser(userToUpdate);
            profileUpdated = true;
        }
        
        if (data.newPassword) {
            const updatedUserWithNewPassword = await updateUserPassword(user.id, data.newPassword);
            userToUpdate = { ...userToUpdate, ...updatedUserWithNewPassword };
            passwordUpdated = true;
        }

        setAuthInfo({ user: userToUpdate });

        if (passwordUpdated) {
             toast({ title: t.passwordUpdateSuccess });
        }
        if (profileUpdated) {
            toast({ title: t.updateSuccess });
        }
        if(!passwordUpdated && !profileUpdated) {
             toast({ title: "Không có gì thay đổi", variant: "default" });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        toast({
            variant: "destructive",
            title: t.updateError,
        });
    }
  };

  // 2FA Actions
  const handleInitiate2FA = async () => {
    if (!newDeviceName.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tên thiết bị."
      });
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const data = await setupNew2FADevice(newDeviceName.trim());
      setRegistrationData(data);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi thiết lập 2FA",
        description: e.message
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleConfirm2FA = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mã xác thực phải gồm 6 chữ số."
      });
      return;
    }
    setIsVerifyingOtp(true);
    try {
      await confirmTwoFADevice(registrationData.deviceId, otpCode.trim());
      toast({
        title: "Kích hoạt thành công!",
        description: "Thiết bị xác thực 2FA đã được đăng ký và hoạt động."
      });
      setIsRegistering2FA(false);
      setRegistrationData(null);
      setOtpCode("");
      setNewDeviceName("");
      fetch2FAStatus();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: e.message
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleMakeDeviceDefault = async (deviceId: string) => {
    try {
      await makeDeviceDefault(deviceId);
      toast({
        title: "Cập nhật thành công",
        description: "Đã chọn thiết bị làm mặc định."
      });
      fetch2FAStatus();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message
      });
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thiết bị xác thực 2FA này không?")) return;
    try {
      await revoke2FADevice(deviceId);
      toast({
        title: "Đã xóa thiết bị",
        description: "Thiết bị xác thực đã được gỡ bỏ khỏi tài khoản."
      });
      fetch2FAStatus();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message
      });
    }
  };

  const handleGenerateBackups = async () => {
    setIsGeneratingBackups(true);
    try {
      const codes = await createBackupCodes();
      setBackupCodesList(codes);
      fetch2FAStatus();
      toast({
        title: "Đã tạo bộ mã mới",
        description: "Vui lòng sao lưu kỹ trước khi đóng cửa sổ."
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message
      });
    } finally {
      setIsGeneratingBackups(false);
    }
  };

  // Access Token Actions
  const handleCreateToken = async () => {
    if (!tokenName.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tên mã thông báo không được để trống."
      });
      return;
    }
    setLoadingTokens(true);
    try {
      const result = await createToken({
        type: activeTokenSubTab,
        name: tokenName.trim(),
        calendar: activeTokenSubTab === 'icalendar' ? tokenCalendar.trim() : undefined,
        project: activeTokenSubTab === 'icalendar' ? tokenProject.trim() : undefined,
        expiresInDays: tokenExpiresIn === "never" ? undefined : parseInt(tokenExpiresIn),
      });

      setNewlyCreatedRawToken(result.rawToken);
      setTokenName("");
      setTokenCalendar("");
      setTokenProject("");
      setTokenExpiresIn("30");
      fetchTokens(activeTokenSubTab);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi tạo token",
        description: e.message
      });
    } finally {
      setLoadingTokens(false);
    }
  };

  const handleDeleteToken = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn thu hồi/xóa mã thông báo này không? Các dịch vụ ngoài sẽ mất kết nối lập tức.")) return;
    try {
      await deleteToken(id, activeTokenSubTab);
      toast({
        title: "Đã hủy mã thông báo",
        description: "Mã thông báo không còn tác dụng trên hệ thống."
      });
      fetchTokens(activeTokenSubTab);
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: e.message
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: "Nội dung đã được sao chép vào bộ nhớ tạm."
    });
  };

  const downloadBackupCodes = () => {
    const text = `HURC CDHS BACKUP CODES\nGenerated: ${new Date().toLocaleString()}\n\n` + backupCodesList.join('\n') + '\n\nKeep these codes highly secure!';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hurc_backup_codes_${user?.email}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary tracking-tight">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageDescription}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-md border p-1 rounded-2xl grid grid-cols-3 max-w-xl shadow-sm">
          <TabsTrigger value="profile" className="rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium tracking-tight">
            <UserIcon className="h-4 w-4" />
            {t.personalInfoTab}
          </TabsTrigger>
          <TabsTrigger value="2fa" className="rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium tracking-tight">
            <Shield className="h-4 w-4" />
            {t.security2faTab}
          </TabsTrigger>
          <TabsTrigger value="tokens" className="rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium tracking-tight">
            <KeySquare className="h-4 w-4" />
            {t.tokensTab}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Info & Change Password */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="glass-card shadow-lg border">
                <CardHeader>
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border ring-2 ring-primary/10 transition-transform duration-300 hover:scale-105">
                        <AvatarImage src={watchedAvatarUrl} alt={t.userAvatar} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="absolute bottom-1 right-1 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md bg-background/90 backdrop-blur-sm"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Camera className="h-3.5 w-3.5"/>
                        {t.changePhoto}
                      </Button>
                      <FormField 
                        control={form.control}
                        name="avatarUrl"
                        render={({ field }) => (
                           <FormItem>
                             <FormControl>
                               <Input
                                 ref={avatarInputRef}
                                 type="file"
                                 accept="image/png, image/jpeg, image/gif"
                                 className="hidden"
                                 onChange={handleAvatarChange}
                               />
                             </FormControl>
                             <FormMessage />
                           </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight text-foreground">{user.name}</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1">
                        <Badge variant="secondary" className="mr-2 uppercase text-[10px] tracking-wider">{user.role}</Badge>
                        <span className="text-muted-foreground">{user.department}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t.userName}</FormLabel><FormControl><Input {...field} className="rounded-xl border-input/60" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t.email}</FormLabel><FormControl><Input type="email" {...field} className="rounded-xl border-input/60" /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div><FormLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t.employeeId}</FormLabel><Input defaultValue={user.id} disabled className="rounded-xl bg-muted/40" /></div>
                    <div><FormLabel className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">{t.role}</FormLabel><Input defaultValue={user.role} disabled className="rounded-xl bg-muted/40" /></div>
                  </div>
                  
                  <div className="pt-6 border-t space-y-4">
                    <FormLabel className="font-bold text-sm tracking-tight text-foreground">{t.changePassword} <span className="text-xs text-muted-foreground font-normal">{t.leaveBlank}</span></FormLabel>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="newPassword" render={({ field }) => (
                          <FormItem><div className="relative">
                              <FormControl><Input type={showNewPassword ? 'text' : 'password'} placeholder={t.newPassword} className="pr-10 rounded-xl border-input/60" {...field} /></FormControl>
                              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground" aria-label={t.togglePassword}>
                                  {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                              </button>
                          </div><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="confirmNewPassword" render={({ field }) => (
                          <FormItem><div className="relative">
                              <FormControl><Input type={showConfirmPassword ? 'text' : 'password'} placeholder={t.confirmNewPassword} className="pr-10 rounded-xl border-input/60" {...field} /></FormControl>
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground" aria-label={t.togglePassword}>
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                              </button>
                          </div><FormMessage /></FormItem>
                      )}/>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting} className="rounded-xl font-medium tracking-tight shadow-md hover:shadow-lg transition-all duration-300">
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? t.saving : t.saveChanges}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        {/* Tab 2: Two-Factor Authentication (2FA) */}
        <TabsContent value="2fa" className="space-y-6 outline-none">
          {loading2FA ? (
            <Card className="p-6 space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-24 w-full" /></Card>
          ) : (
            <div className="space-y-6">
              {/* 2FA Status Banner */}
              <Card className={`glass-card shadow-lg border border-l-4 ${twofaStatus?.twoFactorEnabled ? 'border-l-green-500' : 'border-l-slate-400'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${twofaStatus?.twoFactorEnabled ? 'bg-green-500/10 text-green-600' : 'bg-slate-500/10 text-slate-500'}`}>
                      {twofaStatus?.twoFactorEnabled ? <ShieldCheck className="h-8 w-8" /> : <Shield className="h-8 w-8" />}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-lg text-foreground">
                          {twofaStatus?.twoFactorEnabled ? "Xác thực 2 yếu tố đang HOẠT ĐỘNG" : "Xác thực 2 yếu tố KHÔNG HOẠT ĐỘNG"}
                        </h3>
                        <Badge variant={twofaStatus?.twoFactorEnabled ? "default" : "secondary"}>
                          {twofaStatus?.twoFactorEnabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                        Để kích hoạt xác thực 2 yếu tố, sử dụng các nút bên dưới để đăng ký thiết bị 2FA mới. Nếu bạn đã có thiết bị, bạn cần đặt thiết bị đó làm mặc định để xác thực khi đăng nhập.
                      </p>
                      
                      <div className="pt-3 flex gap-3">
                        <Dialog open={isRegistering2FA} onOpenChange={(open) => {
                          setIsRegistering2FA(open);
                          if (!open) {
                            setRegistrationData(null);
                            setOtpCode("");
                            setNewDeviceName("");
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button className="rounded-xl font-medium shadow-sm hover:shadow text-xs h-9" disabled={isRegistering2FA}>
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Đăng ký thiết bị 2FA mới
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[450px] rounded-2xl glass-card border">
                            <DialogHeader>
                              <DialogTitle className="font-bold text-xl flex items-center gap-2"><QrCode className="text-primary"/> Thiết lập thiết bị xác thực mới</DialogTitle>
                              <DialogDescription>
                                Đăng ký ứng dụng xác thực OTP (Google Authenticator, Microsoft Authenticator, v.v.)
                              </DialogDescription>
                            </DialogHeader>

                            {!registrationData ? (
                              <div className="space-y-4 py-3">
                                <div className="space-y-2">
                                  <Label htmlFor="deviceName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tên thiết bị xác thực</Label>
                                  <Input 
                                    id="deviceName" 
                                    placeholder="ví dụ: Google Authenticator của tôi" 
                                    value={newDeviceName}
                                    onChange={(e) => setNewDeviceName(e.target.value)}
                                    className="rounded-xl border-input/60"
                                  />
                                </div>
                                <Button className="w-full rounded-xl font-medium mt-2" onClick={handleInitiate2FA} disabled={isVerifyingOtp}>
                                  {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Tiếp tục tạo khóa bí mật
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-5 py-2 flex flex-col items-center">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                                  <img src={registrationData.qrCodeUrl} alt="2FA QR Code" className="h-44 w-44 object-contain" />
                                </div>
                                <div className="text-center w-full space-y-1">
                                  <p className="text-xs text-muted-foreground">Hoặc sao chép khóa bí mật này vào ứng dụng của bạn:</p>
                                  <div className="flex items-center justify-between p-2.5 bg-muted/60 rounded-xl w-full border border-dashed">
                                    <code className="text-xs font-mono font-bold tracking-widest text-primary break-all">{registrationData.secret}</code>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => copyToClipboard(registrationData.secret)}>
                                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="space-y-2 w-full pt-2 border-t">
                                  <Label htmlFor="otpCode" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Nhập mã 6 chữ số từ ứng dụng</Label>
                                  <div className="flex gap-2">
                                    <Input 
                                      id="otpCode" 
                                      placeholder="000 000" 
                                      value={otpCode}
                                      onChange={(e) => setOtpCode(e.target.value)}
                                      maxLength={6}
                                      className="rounded-xl text-center text-lg font-bold tracking-widest border-input/60 flex-1"
                                    />
                                    <Button className="rounded-xl" onClick={handleConfirm2FA} disabled={isVerifyingOtp}>
                                      {isVerifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                      Xác nhận kích hoạt
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 2FA Devices Table */}
              <Card className="glass-card shadow-lg border">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2"><KeySquare className="text-primary h-5 w-5"/> Các thiết bị 2FA</CardTitle>
                  <CardDescription>Danh sách thiết bị xác thực 2FA đã đăng ký và cấu hình của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Kiểu thiết bị</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Tên thiết bị</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-center">Mặc định</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-center">Xác nhận</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {twofaStatus?.devices.length > 0 ? (
                          twofaStatus.devices.map((device: any) => (
                            <TableRow key={device.id}>
                              <TableCell className="font-semibold text-xs uppercase text-primary tracking-wider">{device.type}</TableCell>
                              <TableCell className="font-medium text-sm text-foreground">{device.name}</TableCell>
                              <TableCell className="text-center">
                                {device.isDefault ? (
                                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-[10px] border-green-500/20">Mặc định</Badge>
                                ) : (
                                  <Button variant="ghost" className="h-7 text-xs font-semibold px-2 hover:bg-muted text-muted-foreground rounded-lg" onClick={() => handleMakeDeviceDefault(device.id)}>
                                    Đặt mặc định
                                  </Button>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={device.confirmed ? "default" : "secondary"} className="text-[10px]">
                                  {device.confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => handleRevokeDevice(device.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-sm text-muted-foreground italic bg-muted/10">
                              Không có thiết bị 2FA nào được đăng ký cho tài khoản của bạn.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Backup Codes Section */}
              <Card className="glass-card shadow-lg border border-destructive/15">
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Mã dự phòng (Backup Codes)
                  </CardTitle>
                  <CardDescription>
                    Nếu bạn không thể truy cập vào thiết bị hai yếu tố của mình, bạn có thể sử dụng mã dự phòng để lấy lại quyền truy cập vào tài khoản của mình.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sử dụng nút dưới đây để tạo bộ mã dự phòng mới.
                    <span className="block font-semibold text-destructive mt-2">
                      ⚠️ Cảnh báo: Nếu bạn đã tạo mã dự phòng trước đó, chúng sẽ bị vô hiệu và không còn tác dụng.
                    </span>
                  </p>

                  <div className="pt-2 flex flex-col gap-4">
                    <div>
                      <Button variant="outline" className="border-destructive/20 text-destructive hover:bg-destructive/5 rounded-xl font-medium text-xs h-9" onClick={handleGenerateBackups} disabled={isGeneratingBackups}>
                        {isGeneratingBackups && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Tạo bộ mã dự phòng mới
                      </Button>
                    </div>

                    {backupCodesList.length > 0 && (
                      <div className="p-5 bg-card border border-destructive/20 rounded-2xl space-y-4 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-xs font-bold text-destructive uppercase tracking-widest">Lưu trữ mã dự phòng mới</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={() => copyToClipboard(backupCodesList.join('\n'))}>
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={downloadBackupCodes}>
                              <Download className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm font-bold text-foreground text-center">
                          {backupCodesList.map((code, index) => (
                            <div key={index} className="py-1 bg-muted/40 rounded-lg border border-slate-100">{code}</div>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center">
                          * Mỗi mã chỉ có thể sử dụng một lần để đăng nhập khẩn cấp. Lưu trữ an toàn!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Account Settings & Access Tokens */}
        <TabsContent value="tokens" className="space-y-6 outline-none">
          <div className="grid md:grid-cols-4 gap-6 items-start">
            {/* Sidebar Tokens Subnav */}
            <Card className="glass-card shadow-lg border p-2 space-y-1">
              <Button 
                variant={activeTokenSubTab === 'api' ? 'default' : 'ghost'} 
                className="w-full justify-start rounded-xl font-medium text-xs md:text-sm h-10 px-3 transition-colors"
                onClick={() => { setActiveTokenSubTab('api'); setNewlyCreatedRawToken(null); }}
              >
                <Key className="h-4 w-4 mr-2" />
                Mã thông báo API
              </Button>
              <Button 
                variant={activeTokenSubTab === 'icalendar' ? 'default' : 'ghost'} 
                className="w-full justify-start rounded-xl font-medium text-xs md:text-sm h-10 px-3 transition-colors"
                onClick={() => { setActiveTokenSubTab('icalendar'); setNewlyCreatedRawToken(null); }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                iCalendar
              </Button>
              <Button 
                variant={activeTokenSubTab === 'meeting_ical' ? 'default' : 'ghost'} 
                className="w-full justify-start rounded-xl font-medium text-xs md:text-sm h-10 px-3 transition-colors"
                onClick={() => { setActiveTokenSubTab('meeting_ical'); setNewlyCreatedRawToken(null); }}
              >
                <FileText className="h-4 w-4 mr-2" />
                iCalendar cho cuộc họp
              </Button>
              <Button 
                variant={activeTokenSubTab === 'oauth' ? 'default' : 'ghost'} 
                className="w-full justify-start rounded-xl font-medium text-xs md:text-sm h-10 px-3 transition-colors"
                onClick={() => { setActiveTokenSubTab('oauth'); setNewlyCreatedRawToken(null); }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                OAuth Applications
              </Button>
              <Button 
                variant={activeTokenSubTab === 'rss' ? 'default' : 'ghost'} 
                className="w-full justify-start rounded-xl font-medium text-xs md:text-sm h-10 px-3 transition-colors"
                onClick={() => { setActiveTokenSubTab('rss'); setNewlyCreatedRawToken(null); }}
              >
                <Rss className="h-4 w-4 mr-2" />
                RSS Tokens
              </Button>
            </Card>

            {/* Main Token CRUD Panel */}
            <div className="md:col-span-3 space-y-6">
              <Card className="glass-card shadow-lg border">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 capitalize">
                      {activeTokenSubTab === 'api' && "Mã thông báo API"}
                      {activeTokenSubTab === 'icalendar' && "Mã thông báo iCalendar"}
                      {activeTokenSubTab === 'meeting_ical' && "iCalendar cho Cuộc họp"}
                      {activeTokenSubTab === 'oauth' && "Mã thông báo OAuth"}
                      {activeTokenSubTab === 'rss' && "Mã thông báo RSS"}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {activeTokenSubTab === 'api' && "Cho phép ứng dụng bên thứ ba giao tiếp với HURC CDHS qua API REST."}
                      {activeTokenSubTab === 'icalendar' && "Cho phép bạn subscribe vào lịch làm việc HURC CDHS từ Outlook, Apple Calendar, v.v."}
                      {activeTokenSubTab === 'meeting_ical' && "Đăng ký xem lịch trình tất cả các cuộc họp trên các ứng dụng khách bên ngoài."}
                      {activeTokenSubTab === 'oauth' && "Quản lý kết nối các ứng dụng của bên thứ ba đã được cấp quyền."}
                      {activeTokenSubTab === 'rss' && "Nhận cập nhật về các sự cố, thay đổi hệ thống mới nhất qua bộ đọc RSS."}
                    </CardDescription>
                  </div>
                  
                  <Dialog open={isCreatingToken} onOpenChange={(open) => {
                    setIsCreatingToken(open);
                    if (!open) {
                      setTokenName("");
                      setTokenCalendar("");
                      setTokenProject("");
                      setTokenExpiresIn("30");
                      setNewlyCreatedRawToken(null);
                      setCopiedToken(false);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="rounded-xl font-medium shadow-sm hover:shadow text-xs h-9">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Tạo mã mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] rounded-2xl glass-card border">
                      <DialogHeader>
                        <DialogTitle className="font-bold text-xl flex items-center gap-2"><Key className="text-primary"/> Cấp mã truy cập mới</DialogTitle>
                        <DialogDescription>
                          Tạo mã thông báo bảo mật mới để sử dụng bên ngoài.
                        </DialogDescription>
                      </DialogHeader>

                      {!newlyCreatedRawToken ? (
                        <div className="space-y-4 py-3">
                          <div className="space-y-2">
                            <Label htmlFor="tokName" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tên mã thông báo</Label>
                            <Input 
                              id="tokName" 
                              placeholder="ví dụ: Máy khách API di động" 
                              value={tokenName}
                              onChange={(e) => setTokenName(e.target.value)}
                              className="rounded-xl border-input/60"
                            />
                          </div>

                          {activeTokenSubTab === 'icalendar' && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="tokCal" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Lịch đăng ký</Label>
                                <Input 
                                  id="tokCal" 
                                  placeholder="ví dụ: Lịch bảo trì" 
                                  value={tokenCalendar}
                                  onChange={(e) => setTokenCalendar(e.target.value)}
                                  className="rounded-xl border-input/60"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="tokProj" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Dự án</Label>
                                <Input 
                                  id="tokProj" 
                                  placeholder="ví dụ: Metro Line 3" 
                                  value={tokenProject}
                                  onChange={(e) => setTokenProject(e.target.value)}
                                  className="rounded-xl border-input/60"
                                />
                              </div>
                            </>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="tokExp" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Hết hạn sau</Label>
                            <Select value={tokenExpiresIn} onValueChange={setTokenExpiresIn}>
                              <SelectTrigger id="tokExp" className="rounded-xl border-input/60">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 Ngày</SelectItem>
                                <SelectItem value="90">90 Ngày</SelectItem>
                                <SelectItem value="365">1 Năm</SelectItem>
                                <SelectItem value="never">Không bao giờ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button className="w-full rounded-xl font-medium mt-2" onClick={handleCreateToken} disabled={loadingTokens}>
                            {loadingTokens && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Bắt đầu tạo mã truy cập
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-5 py-2">
                          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 rounded-2xl flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div className="text-xs leading-relaxed">
                              <strong>CẢNH BÁO QUAN TRỌNG:</strong> Mã thông báo này chỉ hiển thị <strong>MỘT LẦN DUY NHẤT</strong>. Hệ thống sẽ không hiển thị lại khóa bí mật này nữa vì lý do bảo mật. Hãy sao chép nó ngay lập tức!
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mã truy cập cá nhân của bạn</Label>
                            <div className="flex gap-2">
                              <Input 
                                readOnly 
                                value={newlyCreatedRawToken} 
                                className="rounded-xl font-mono text-sm font-bold bg-muted text-foreground border-input/60 flex-1"
                              />
                              <Button className="rounded-xl" onClick={() => { copyToClipboard(newlyCreatedRawToken); setCopiedToken(true); }}>
                                {copiedToken ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <Button className="w-full rounded-xl font-medium mt-2" variant="secondary" onClick={() => setIsCreatingToken(false)}>
                            Đã lưu trữ an toàn, đóng cửa sổ
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/40">
                        <TableRow>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Tên</TableHead>
                          {activeTokenSubTab === 'icalendar' && (
                            <>
                              <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Lịch</TableHead>
                              <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Dự án</TableHead>
                            </>
                          )}
                          {activeTokenSubTab === 'oauth' && (
                            <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Mã thông báo</TableHead>
                          )}
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Tạo ngày</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">Hết hạn</TableHead>
                          <TableHead className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingTokens ? (
                          <TableRow>
                            <TableCell colSpan={activeTokenSubTab === 'icalendar' ? 6 : 4} className="text-center py-6">
                              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
                            </TableCell>
                          </TableRow>
                        ) : tokensList.length > 0 ? (
                          tokensList.map((token: any) => (
                            <TableRow key={token.id}>
                              <TableCell className="font-semibold text-sm text-foreground">{token.name}</TableCell>
                              {activeTokenSubTab === 'icalendar' && (
                                <>
                                  <TableCell className="font-medium text-xs text-muted-foreground">{token.calendar || '—'}</TableCell>
                                  <TableCell className="font-medium text-xs text-muted-foreground">{token.project || '—'}</TableCell>
                                </>
                              )}
                              {activeTokenSubTab === 'oauth' && (
                                <TableCell className="font-mono text-xs text-muted-foreground">••••••••••••••••</TableCell>
                              )}
                              <TableCell className="text-xs text-muted-foreground">
                                {new Date(token.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                              </TableCell>
                              <TableCell className="text-xs">
                                {token.expiresAt ? (
                                  <span className={new Date(token.expiresAt) < new Date() ? "text-destructive font-semibold" : "text-muted-foreground"}>
                                    {new Date(token.expiresAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                                  </span>
                                ) : (
                                  <span className="text-green-600 font-medium">Không bao giờ</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => handleDeleteToken(token.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={activeTokenSubTab === 'icalendar' ? 6 : 4} className="text-center py-8 text-sm text-muted-foreground italic bg-muted/10">
                              {activeTokenSubTab === 'api' && "Chưa có mã thông báo API. Bạn có thể tạo một cái bằng cách sử dụng nút bên dưới."}
                              {activeTokenSubTab === 'icalendar' && "Để thêm mã thông báo iCalendar, hãy đăng ký lịch mới hoặc lịch hiện có từ trong mô-đun Lịch của dự án."}
                              {activeTokenSubTab === 'meeting_ical' && "Chưa có mã thông báo cuộc họp iCalendar. Bạn có thể tạo một cái bằng cách sử dụng nút bên dưới."}
                              {activeTokenSubTab === 'oauth' && "Không có quyền truy cập ứng dụng của bên thứ ba nào được định cấu hình và hoạt động cho bạn."}
                              {activeTokenSubTab === 'rss' && "Chưa có mã thông báo RSS. Bạn có thể tạo một cái bằng cách sử dụng nút bên dưới."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
