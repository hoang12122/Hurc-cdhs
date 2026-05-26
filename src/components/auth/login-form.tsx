
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
import { Eye, EyeOff, Loader2, KeySquare } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Checkbox } from "@/components/ui/checkbox";
import { login, login2FA } from '@/lib/actions/auth.actions';
import { useAuth } from "@/contexts/auth-context";

const translations = {
    vi: {
        formDescription: "Đăng nhập vào hệ thống HURC CDHS",
        emailLabel: "Địa chỉ Email",
        passwordLabel: "Mật khẩu",
        rememberMeLabel: "Ghi nhớ đăng nhập",
        loginButton: "Đăng nhập",
        loginProgress: "Đang xác thực...",
        loginSuccessTitle: "Đăng nhập thành công",
        loginSuccessDesc: (name: string) => `Chào mừng trở lại, ${name}!`,
        loginErrorTitle: "Đăng nhập thất bại",
        loginErrorDesc: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
        togglePassword: "Hiện/Ẩn mật khẩu",
        forgotPasswordLink: "Quên mật khẩu?",
        validation: {
            emailRequired: "Vui lòng nhập email.",
            emailInvalid: "Email không hợp lệ.",
            passwordRequired: "Vui lòng nhập mật khẩu.",
        }
    },
    en: {
        formDescription: "Login to HURC CDHS System",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        rememberMeLabel: "Remember me",
        loginButton: "Sign In",
        loginProgress: "Authenticating...",
        loginSuccessTitle: "Login Successful",
        loginSuccessDesc: (name: string) => `Welcome back, ${name}!`,
        loginErrorTitle: "Login Failed",
        loginErrorDesc: "Invalid email or password. Please try again.",
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
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuthInfo } = useAuth();
  const { locale } = useLanguage();
  const t = translations[locale];
  const [showPassword, setShowPassword] = React.useState(false);

  // 2FA States
  const [show2FA, setShow2FA] = React.useState(false);
  const [userId2FA, setUserId2FA] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [isVerifying2FA, setIsVerifying2FA] = React.useState(false);
  
  const loginSchema = createLoginSchema(t);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data.email, data.password, data.rememberMe);
      
      if (result.error) {
          toast({
              variant: "destructive",
              title: t.loginErrorTitle,
              description: result.error,
          });
          return;
      }

      if (result.requires2FA) {
          setUserId2FA(result.userId || "");
          setShow2FA(true);
          return;
      }

      const user = result.user;
      if (user) {
        setAuthInfo({ user });
        
        // Priority 2: Mandatory Password Change (Admin set or New user)
        if (user.mustChangePassword) {
            router.push('/setup-new-password');
            return;
        }

        // Priority 3: Expired Password (6 months)
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
        
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push("/dashboard");
      }
    } catch (error) {
       toast({
          variant: "destructive",
          title: t.loginErrorTitle,
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.",
        });
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: "Vui lòng nhập mã OTP 6 chữ số hoặc mã dự phòng."
      });
      return;
    }
    setIsVerifying2FA(true);
    try {
      const result = await login2FA(userId2FA, otpCode.trim(), form.getValues("rememberMe"));
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Xác thực 2FA thất bại",
          description: result.error,
        });
        return;
      }

      const user = result.user;
      if (user) {
        setAuthInfo({ user });

        if (user.mustChangePassword) {
            router.push('/setup-new-password');
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
        
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi hệ thống",
        description: "Đã xảy ra lỗi không xác định trong quá trình xác thực 2FA.",
      });
    } finally {
      setIsVerifying2FA(false);
    }
  };

  if (show2FA) {
    return (
      <Card className="w-full max-w-md shadow-xl border bg-card/60 backdrop-blur-md">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <KeySquare className="text-primary h-6 w-6" />
            Xác thực 2 lớp (2FA)
          </CardTitle>
          <CardDescription>
            Tài khoản của bạn đã được bảo vệ bằng xác thực hai yếu tố. Vui lòng nhập mã OTP từ ứng dụng hoặc mã dự phòng của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle2FAVerify} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mã xác thực 2FA / Mã dự phòng</label>
              <Input 
                placeholder="000 000" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="rounded-xl text-center text-lg font-bold tracking-widest border-input/60 h-11"
              />
            </div>
            
            <Button type="submit" className="w-full h-11 text-base rounded-xl font-medium mt-2 animate-pulse-subtle" disabled={isVerifying2FA}>
              {isVerifying2FA && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận đăng nhập
            </Button>
            
            <Button type="button" variant="ghost" className="w-full h-10 text-xs rounded-xl" onClick={() => { setShow2FA(false); setOtpCode(""); }}>
              Quay lại trang đăng nhập thường
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

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
                  </div>
                  <div className="relative">
                    <FormControl>
                      <Input
                        id="password"
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
            
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {t.rememberMeLabel}
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full h-11 text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {form.formState.isSubmitting ? t.loginProgress : t.loginButton}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
