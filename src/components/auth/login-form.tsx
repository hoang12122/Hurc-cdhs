
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { login } from '@/lib/actions/auth.actions';
import { useAuth } from "@/contexts/auth-context";

const translations = {
    vi: {
        formDescription: "Đăng nhập vào tài khoản của bạn",
        emailLabel: "Email",
        passwordLabel: "Mật khẩu",
        loginButton: "Đăng nhập",
        loginProgress: "Đang đăng nhập...",
        loginSuccessTitle: "Đăng nhập thành công",
        loginSuccessDesc: (name: string) => `Chào mừng trở lại, ${name}!`,
        loginErrorTitle: "Đăng nhập thất bại",
        loginErrorDesc: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        togglePassword: "Hiện/Ẩn mật khẩu",
        forgotPasswordLink: "Quên mật khẩu?",
        validation: {
            emailRequired: "Email không được để trống.",
            emailInvalid: "Địa chỉ email không hợp lệ.",
            passwordRequired: "Mật khẩu không được để trống.",
        }
    },
    en: {
        formDescription: "Login to your account",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginButton: "Login",
        loginProgress: "Logging in...",
        loginSuccessTitle: "Login Successful",
        loginSuccessDesc: (name: string) => `Welcome back, ${name}!`,
        loginErrorTitle: "Login Failed",
        loginErrorDesc: "Incorrect email or password. Please try again.",
        togglePassword: "Show/Hide password",
        forgotPasswordLink: "Forgot password?",
        validation: {
            emailRequired: "Email is required.",
            emailInvalid: "Invalid email address.",
            passwordRequired: "Password is required.",
        }
    }
}

const createLoginSchema = (t: any) => z.object({
  email: z.string().min(1, { message: t.validation.emailRequired }).email({ message: t.validation.emailInvalid }),
  password: z.string().min(1, { message: t.validation.passwordRequired }),
});

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuthInfo } = useAuth();
  const { locale } = useLanguage();
  const t = translations[locale];
  const [showPassword, setShowPassword] = React.useState(false);
  
  const loginSchema = createLoginSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const user = await login(data.email, data.password);
      if (user) {
        setAuthInfo({ user });
        
        if (user.isVerified === false) {
            router.push('/verify-otp?reason=first_login');
            return;
        }

        if (user.passwordLastChangedAt) {
            const passwordExpiryDate = new Date(user.passwordLastChangedAt);
            passwordExpiryDate.setMonth(passwordExpiryDate.getMonth() + 6);
            if (new Date() > passwordExpiryDate) {
                router.push('/change-password?reason=expired');
                return;
            }
        }


        toast({
          title: t.loginSuccessTitle,
          description: t.loginSuccessDesc(user.name),
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: t.loginErrorTitle,
          description: t.loginErrorDesc,
        });
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: t.loginErrorTitle,
          description: "An unexpected error occurred.",
        });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center space-y-4">
        <CardTitle className="text-2xl font-bold">HURC No.1 CDHS</CardTitle>
        <CardDescription>{t.formDescription}</CardDescription>
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
                    <Input type="email" placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.passwordLabel}</FormLabel>
                     <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      {t.forgotPasswordLink}
                    </Link>
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
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
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form.formState.isSubmitting ? t.loginProgress : t.loginButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
