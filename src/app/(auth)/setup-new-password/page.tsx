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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { updateUserPassword } from "@/lib/actions/user.actions";
import { KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";

const translations: Record<string, any> = {
  vi: {
    title: "Thiết lập Mật khẩu Mới",
    description: "Tài khoản của bạn yêu cầu thiết lập mật khẩu an toàn trước khi truy cập hệ thống.",
    newPasswordLabel: "Mật khẩu mới",
    confirmPasswordLabel: "Xác nhận mật khẩu",
    submitButton: "Cập nhật Mật khẩu",
    submitting: "Đang lưu...",
    successTitle: "Thành công!",
    successDescription: "Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng...",
    errorTitle: "Lỗi",
    requirementTitle: "Yêu cầu bảo mật:",
    req1: "Ít nhất 10 ký tự",
    req2: "Có chữ hoa & chữ thường",
    req3: "Có chữ số & ký tự đặc biệt",
    togglePassword: "Hiện/Ẩn mật khẩu",
    validation: {
        match: "Mật khẩu xác nhận không khớp.",
    }
  },
  en: {
    title: "Setup New Password",
    description: "Your account requires a secure password before accessing the system.",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    submitButton: "Update Password",
    submitting: "Saving...",
    successTitle: "Success!",
    successDescription: "Your password has been updated. Redirecting...",
    errorTitle: "Error",
    requirementTitle: "Security Requirements:",
    req1: "At least 10 characters",
    req2: "Uppercase & lowercase letters",
    req3: "Number & special character",
    togglePassword: "Show/Hide password",
    validation: {
        match: "Passwords do not match.",
    }
  },
};

const passwordValidation = z.string()
    .min(10, "Mật khẩu phải có ít nhất 10 ký tự.")
    .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa.")
    .regex(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ thường.")
    .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất một chữ số.")
    .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.");

const changePasswordSchema = (t: any) =>
  z.object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: "Bắt buộc" }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.validation.match,
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const { push } = useRouter();
  const t = translations[locale];
  const [showPassword, setShowPassword] = React.useState(false);

  const schema = changePasswordSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Pass an empty string for userId to update current session user
      await updateUserPassword('', data.password);
      
      toast({
        title: t.successTitle,
        description: t.successDescription,
      });
      
      setTimeout(() => {
        push("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: error.message || "Không thể cập nhật mật khẩu.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <KeyRound className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription className="text-base">{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.newPasswordLabel}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} className="pr-10" {...field} />
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

              <div className="bg-muted/50 p-4 rounded-lg border border-muted text-sm space-y-2">
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

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                )}
                {form.formState.isSubmitting ? t.submitting : t.submitButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
