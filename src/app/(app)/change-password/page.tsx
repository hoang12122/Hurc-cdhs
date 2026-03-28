
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Loader2, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateUserPassword } from "@/lib/actions/user.actions";

const passwordValidation = z.string()
    .min(10, "Mật khẩu phải có ít nhất 10 ký tự.")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");

const changePasswordSchema = z.object({
  newPassword: passwordValidation,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
});

const translations = {
  vi: {
    title: "Đổi Mật khẩu",
    expiredDesc: "Mật khẩu của bạn đã hết hạn (chu kỳ 6 tháng). Vui lòng cập nhật mật khẩu mới để đảm bảo an toàn.",
    normalDesc: "Cập nhật mật khẩu mới cho tài khoản của bạn.",
    newPasswordLabel: "Mật khẩu mới",
    confirmPasswordLabel: "Xác nhận mật khẩu mới",
    saveButton: "Cập nhật Mật khẩu",
    saving: "Đang lưu...",
    successTitle: "Đổi mật khẩu thành công",
    successDesc: "Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng...",
    errorTitle: "Lỗi",
    togglePassword: "Hiện/Ẩn mật khẩu",
    backToLogin: "Quay lại đăng nhập",
    requirementTitle: "Yêu cầu mật khẩu:",
    req1: "Ít nhất 10 ký tự",
    req2: "Có chữ hoa & chữ thường",
    req3: "Có chữ số & ký tự đặc biệt"
  },
  en: {
    title: "Change Password",
    expiredDesc: "Your password has expired (6-month cycle). Please update it to ensure security.",
    normalDesc: "Update your account password.",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm New Password",
    saveButton: "Update Password",
    saving: "Updating...",
    successTitle: "Password Updated",
    successDesc: "Your password has been successfully updated. Redirecting...",
    errorTitle: "Error",
    togglePassword: "Show/Hide password",
    backToLogin: "Back to Login",
    requirementTitle: "Password Requirements:",
    req1: "At least 10 characters",
    req2: "Uppercase & lowercase letters",
    req3: "Number & special character"
  }
};

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setAuthInfo, logout } = useAuth();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const t = translations[locale];
  const isExpired = searchParams.get('reason') === 'expired';

  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof changePasswordSchema>) => {
    if (!user) return;
    try {
      const updatedUser = await updateUserPassword(user.id, values.newPassword);
      setAuthInfo({ user: updatedUser });
      toast({ title: t.successTitle, description: t.successDesc });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-amber-100 p-3 rounded-full w-fit mb-2">
            <KeyRound className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">{t.title}</CardTitle>
          <CardDescription className="text-base">
            {isExpired ? t.expiredDesc : t.normalDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.newPasswordLabel}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.confirmPasswordLabel}</FormLabel>
                    <FormControl>
                      <Input type={showPassword ? "text" : "password"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/30 p-4 rounded-lg border border-muted text-sm space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  {t.requirementTitle}
                </p>
                <ul className="grid grid-cols-1 gap-1 pl-6 list-disc text-muted-foreground">
                  <li>{t.req1}</li>
                  <li>{t.req2}</li>
                  <li>{t.req3}</li>
                </ul>
              </div>

              <Button type="submit" className="w-full h-11" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.saving}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t.saveButton}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={() => logout()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToLogin}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
