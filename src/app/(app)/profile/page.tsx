
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
import { Eye, EyeOff, Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { updateUser, updateUserPassword } from "@/lib/actions/user.actions";
import { type User } from "@/lib/constants";

const passwordValidation = z.string()
    .min(10, "Mật khẩu phải có ít nhất 10 ký tự.")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");

const translations = {
  vi: {
    pageTitle: "Hồ Sơ Người Dùng",
    pageDescription: "Xem và cập nhật thông tin cá nhân của bạn.",
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
    pageTitle: "User Profile",
    pageDescription: "View and update your personal information.",
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
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

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

        // Update profile info if changed
        if (data.name !== user.name || data.email !== user.email || data.avatarUrl !== user.avatarUrl) {
            userToUpdate.name = data.name;
            userToUpdate.email = data.email;
            userToUpdate.avatarUrl = data.avatarUrl;
            await updateUser(userToUpdate);
            profileUpdated = true;
        }
        
        // Update password if provided
        if (data.newPassword) {
            const updatedUserWithNewPassword = await updateUserPassword(user.id, data.newPassword);
            userToUpdate = { ...userToUpdate, ...updatedUserWithNewPassword }; // merge password change
            passwordUpdated = true;
        }

        // Update auth context with the latest user data
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
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-10 w-full" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageDescription}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border">
                        <AvatarImage src={watchedAvatarUrl} alt={t.userAvatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4"/>
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
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.role} - {user.department}</CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>{t.userName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>{t.email}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div><FormLabel>{t.employeeId}</FormLabel><Input defaultValue={user.id} disabled /></div>
                    <div><FormLabel>{t.role}</FormLabel><Input defaultValue={user.role} disabled /></div>
                </div>
                
                <div className="space-y-2">
                    <FormLabel>{t.changePassword} <span className="text-xs text-muted-foreground">{t.leaveBlank}</span></FormLabel>
                     <FormField control={form.control} name="newPassword" render={({ field }) => (
                        <FormItem><div className="relative">
                            <FormControl><Input type={showNewPassword ? 'text' : 'password'} placeholder={t.newPassword} className="pr-10" {...field} /></FormControl>
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground" aria-label={t.togglePassword}>
                                {showNewPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="confirmNewPassword" render={({ field }) => (
                        <FormItem><div className="relative">
                            <FormControl><Input type={showConfirmPassword ? 'text' : 'password'} placeholder={t.confirmNewPassword} className="pr-10" {...field} /></FormControl>
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground" aria-label={t.togglePassword}>
                                {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div><FormMessage /></FormItem>
                    )}/>
                </div>
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {form.formState.isSubmitting ? t.saving : t.saveChanges}
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
}
