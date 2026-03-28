"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { requestPasswordResetToAdmin } from "@/lib/actions/user.actions";

const translations = {
  vi: {
    title: "Quên Mật khẩu",
    description: "Nhập email của bạn để gửi yêu cầu đặt lại mật khẩu đến quản trị viên.",
    emailLabel: "Email",
    emailPlaceholder: "mail@example.com",
    submitButton: "Gửi Yêu cầu",
    submitting: "Đang gửi...",
    backToLogin: "Quay lại Đăng nhập",
    successTitle: "Yêu cầu đã được gửi!",
    successDescription: "Yêu cầu đặt lại mật khẩu của bạn đã được gửi đến quản trị viên. Vui lòng liên hệ quản trị viên để nhận mật khẩu mới.",
    errorTitle: "Lỗi",
    validation: {
      emailRequired: "Email không được để trống.",
      emailInvalid: "Địa chỉ email không hợp lệ.",
    },
  },
  en: {
    title: "Forgot Password",
    description: "Enter your email to send a password reset request to the administrator.",
    emailLabel: "Email",
    emailPlaceholder: "mail@example.com",
    submitButton: "Send Request",
    submitting: "Sending...",
    backToLogin: "Back to Login",
    successTitle: "Request Sent!",
    successDescription: "Your password reset request has been sent to the administrator. Please contact the admin to receive your new password.",
    errorTitle: "Error",
    validation: {
      emailRequired: "Email is required.",
      emailInvalid: "Invalid email address.",
    },
  },
};

const forgotPasswordSchema = (t: any) =>
  z.object({
    email: z
      .string()
      .min(1, { message: t.validation.emailRequired })
      .email({ message: t.validation.emailInvalid }),
  });

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { locale } = useLanguage();
  const t = translations[locale];
  const [submitted, setSubmitted] = React.useState(false);

  const schema = forgotPasswordSchema(t);
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await requestPasswordResetToAdmin(data.email);
      setSubmitted(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold">{t.successTitle}</CardTitle>
            <CardDescription className="text-base">
              {t.successDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="mt-2">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToLogin}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.emailLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? t.submitting : t.submitButton}
              </Button>
              <div className="text-center">
                <Button asChild variant="link" className="text-sm">
                  <Link href="/login">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    {t.backToLogin}
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
