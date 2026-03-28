
"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Loader2, Mail, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { verifyUserAccount, resendVerificationOtp } from "@/lib/actions/user.actions";

const translations = {
  vi: {
    title: "Xác thực Tài khoản",
    description: "Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email của bạn.",
    otpLabel: "Mã xác thực (OTP)",
    verifyButton: "Xác thực",
    verifying: "Đang xác thực...",
    resendButton: "Gửi lại mã",
    resending: "Đang gửi lại...",
    backToLogin: "Quay lại đăng nhập",
    successTitle: "Xác thực thành công",
    successDesc: "Tài khoản của bạn đã được xác thực. Đang chuyển hướng...",
    errorTitle: "Lỗi xác thực",
    invalidOtp: "Mã OTP không chính xác hoặc đã hết hạn.",
    resendSuccess: "Đã gửi lại mã OTP mới vào email của bạn.",
    resendError: "Không thể gửi lại mã. Vui lòng thử lại sau.",
    emailSentTo: (email: string) => `Mã đã được gửi tới: ${email}`,
  },
  en: {
    title: "Account Verification",
    description: "Please enter the 6-digit OTP code sent to your email.",
    otpLabel: "Verification Code (OTP)",
    verifyButton: "Verify",
    verifying: "Verifying...",
    resendButton: "Resend Code",
    resending: "Resending...",
    backToLogin: "Back to Login",
    successTitle: "Verification Successful",
    successDesc: "Your account has been verified. Redirecting...",
    errorTitle: "Verification Failed",
    invalidOtp: "Invalid or expired OTP code.",
    resendSuccess: "A new OTP code has been sent to your email.",
    resendError: "Could not resend code. Please try again later.",
    emailSentTo: (email: string) => `Code sent to: ${email}`,
  }
};

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setAuthInfo, logout } = useAuth();
  const { locale } = useLanguage();
  const { toast } = useToast();
  const t = translations[locale];

  const [otp, setOtp] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(0);

  // If user is already verified and not coming from a reset flow, redirect to dashboard
  React.useEffect(() => {
    if (user && user.isVerified && searchParams.get('reason') !== 'reset_password') {
      router.push("/dashboard");
    }
  }, [user, router, searchParams]);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (otp.length !== 6) {
        toast({ variant: "destructive", title: t.errorTitle, description: locale === 'vi' ? "Vui lòng nhập đủ 6 chữ số." : "Please enter all 6 digits." });
        return;
    }

    setIsSubmitting(true);
    try {
      const verifiedUser = await verifyUserAccount(user.id, otp);
      setAuthInfo({ user: verifiedUser });
      toast({ title: t.successTitle, description: t.successDesc });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.errorTitle,
        description: error.message || t.invalidOtp,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!user || countdown > 0) return;
    setIsResending(true);
    try {
      await resendVerificationOtp(user.id);
      toast({ title: t.resendSuccess });
      setCountdown(60); // 60 seconds cooldown
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t.resendError,
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!user) {
      return (
          <div className="flex h-screen items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline">{t.title}</CardTitle>
          <CardDescription className="text-base">{t.description}</CardDescription>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 py-1 px-3 rounded-md w-fit mx-auto">
             <Mail className="h-4 w-4" />
             <span>{t.emailSentTo(user.email)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-3xl tracking-[1em] font-mono h-16 border-2 focus-visible:ring-primary"
                  autoFocus
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={isSubmitting || otp.length !== 6}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                t.verifyButton
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full">
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="text-primary font-medium"
            >
              {isResending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className={`mr-2 h-4 w-4 ${countdown > 0 ? 'opacity-50' : ''}`} />
              )}
              {countdown > 0 ? `${t.resendButton} (${countdown}s)` : t.resendButton}
            </Button>
          </div>
          <Button variant="ghost" onClick={() => logout()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToLogin}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
