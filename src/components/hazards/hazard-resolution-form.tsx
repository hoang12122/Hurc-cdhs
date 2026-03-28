
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { type HazardRecord } from "@/lib/constants";
import { updateHazardRecord } from "@/lib/actions/hazard.actions";
import { useLanguage } from "@/contexts/language-context";
import { Wrench, CheckSquare } from "lucide-react";

const resolutionSchema = z.object({
  closureDetails: z.string().min(1, "Vui lòng nhập chi tiết xử lý."),
  verificationDetails: z.string().optional(),
});

type ResolutionFormValues = z.infer<typeof resolutionSchema>;

interface HazardResolutionFormProps {
  hazard: HazardRecord;
}

const translations = {
    vi: {
        title: "Thông tin Xử lý & Khắc phục Mối nguy",
        description: "Ghi nhận chi tiết quá trình xử lý và các biện pháp đã được áp dụng.",
        closureDetailsLabel: "Chi tiết Xử lý/Đóng",
        closureDetailsPlaceholder: "Mô tả các bước đã thực hiện để kiểm soát hoặc loại bỏ mối nguy...",
        verificationDetailsLabel: "Chi tiết Xác minh (nếu có)",
        verificationDetailsPlaceholder: "Mô tả cách thức và kết quả xác minh hiệu quả của biện pháp xử lý...",
        saveButton: "Lưu & Chuyển sang Giám sát",
        updateSuccess: "Đã cập nhật thông tin xử lý mối nguy.",
    },
    en: {
        title: "Hazard Processing & Resolution Details",
        description: "Log the details of the resolution process and measures applied.",
        closureDetailsLabel: "Resolution/Closure Details",
        closureDetailsPlaceholder: "Describe the steps taken to control or eliminate the hazard...",
        verificationDetailsLabel: "Verification Details (optional)",
        verificationDetailsPlaceholder: "Describe how the effectiveness of the resolution was verified...",
        saveButton: "Save & Move to Monitoring",
        updateSuccess: "Hazard resolution information updated.",
    },
};

export function HazardResolutionForm({ hazard }: HazardResolutionFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = translations[locale];

  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionSchema),
    mode: "onChange",
    defaultValues: {
      closureDetails: hazard.closureDetails || "",
      verificationDetails: hazard.verificationDetails || "",
    },
  });

  const onSubmit = async (data: ResolutionFormValues) => {
    const updatedHazard: HazardRecord = {
      ...hazard,
      closureDetails: data.closureDetails,
      verificationDetails: data.verificationDetails,
      status: 'Đã xử lý/Giám sát', // Transition to the next logical state
      updatedAt: new Date().toISOString(),
    };
    await updateHazardRecord(updatedHazard);
    toast({ title: t.updateSuccess });
    router.refresh();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Wrench className="mr-2 h-5 w-5 text-primary"/>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="closureDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.closureDetailsLabel}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t.closureDetailsPlaceholder} {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verificationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.verificationDetailsLabel}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t.verificationDetailsPlaceholder} {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                <CheckSquare className="mr-2 h-4 w-4" />
                {t.saveButton}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
