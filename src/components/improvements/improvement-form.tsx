
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, XCircle, RefreshCcw } from "lucide-react";
import {
    IMPROVEMENT_STATUSES,
    IMPROVEMENT_CATEGORIES,
} from "@/lib/constants";
import { type Improvement, type ImageAttachment } from "@/lib/types";
import { addImprovement, updateImprovement } from "@/lib/actions/improvement.actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  "data-ai-hint": z.string().optional(),
});

const improvementFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống."),
  description: z.string().min(1, "Mô tả không được để trống."),
  category: z.string().min(1, "Vui lòng chọn hạng mục."),
  status: z.enum(IMPROVEMENT_STATUSES as [Improvement['status'], ...Improvement['status'][]]),
  benefitAnalysis: z.string().optional(),
  estimatedCost: z.number().optional(),
  attachments: z.array(imageSchema).optional(),
});

type ImprovementFormValues = z.infer<typeof improvementFormSchema>;

interface ImprovementFormProps {
  initialData?: Improvement;
  isEditMode?: boolean;
}

export function ImprovementForm({ initialData, isEditMode = false }: ImprovementFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { locale } = useLanguage();
  const { user: currentUser } = useAuth();
  const t = locale === 'vi' ? {
      titleLabel: "Tiêu đề Cải tiến",
      titlePlaceholder: "VD: Lắp đặt hệ thống cảm biến tiết kiệm điện",
      descriptionLabel: "Mô tả Chi tiết",
      descriptionPlaceholder: "Mô tả vấn đề hiện tại và giải pháp cải tiến đề xuất...",
      categoryLabel: "Hạng mục Cải tiến",
      categoryPlaceholder: "Chọn hạng mục",
      statusLabel: "Trạng thái",
      statusPlaceholder: "Chọn trạng thái",
      benefitAnalysisLabel: "Phân tích Lợi ích",
      benefitAnalysisPlaceholder: "Mô tả các lợi ích kỳ vọng (an toàn, hiệu suất, chi phí...)",
      estimatedCostLabel: "Chi phí Ước tính (VNĐ)",
      estimatedCostPlaceholder: "VD: 50000000",
      attachmentsLabel: "Hình ảnh/Tài liệu đính kèm",
      uploadButton: "Tải lên",
      noImages: "Chưa có hình ảnh nào.",
      saveButton: "Lưu Cải tiến",
      updateButton: "Cập nhật Cải tiến",
      cancelButton: "Hủy",
      resetFormButton: "Đặt lại Form",
      saveProgress: "Đang lưu...",
      saveSuccessTitle: "Đã lưu Cải tiến",
      updateSuccessTitle: "Đã cập nhật Cải tiến",
      saveSuccessDescription: "Đề xuất cải tiến đã được lưu thành công.",
      updateSuccessDescription: "Đề xuất cải tiến đã được cập nhật thành công.",
  } : {
      titleLabel: "Improvement Title",
      titlePlaceholder: "e.g., Install energy-saving sensor system",
      descriptionLabel: "Detailed Description",
      descriptionPlaceholder: "Describe the current issue and the proposed improvement solution...",
      categoryLabel: "Improvement Category",
      categoryPlaceholder: "Select category",
      statusLabel: "Status",
      statusPlaceholder: "Select status",
      benefitAnalysisLabel: "Benefit Analysis",
      benefitAnalysisPlaceholder: "Describe the expected benefits (safety, efficiency, cost...)",
      estimatedCostLabel: "Estimated Cost (VND)",
      estimatedCostPlaceholder: "e.g., 50000000",
      attachmentsLabel: "Images/Attachments",
      uploadButton: "Upload",
      noImages: "No images yet.",
      saveButton: "Save Improvement",
      updateButton: "Update Improvement",
      cancelButton: "Cancel",
      resetFormButton: "Reset Form",
      saveProgress: "Saving...",
      saveSuccessTitle: "Improvement Saved",
      updateSuccessTitle: "Improvement Updated",
      saveSuccessDescription: "The improvement proposal has been saved successfully.",
      updateSuccessDescription: "The improvement proposal has been updated successfully.",
  };

  const getInitialFormValues = React.useCallback((data?: Improvement): ImprovementFormValues => {
      return {
          title: data?.title || "",
          description: data?.description || "",
          category: data?.category || "",
          status: data?.status || "Mới",
          benefitAnalysis: data?.benefitAnalysis || "",
          estimatedCost: data?.estimatedCost,
          attachments: data?.attachments || [],
      };
  }, []);

  const form = useForm<ImprovementFormValues>({
    resolver: zodResolver(improvementFormSchema),
    defaultValues: getInitialFormValues(initialData),
  });

  React.useEffect(() => {
    form.reset(getInitialFormValues(initialData));
  }, [initialData, form, getInitialFormValues]);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      const newImagesPromises = fileList.map(file => {
        return new Promise<ImageAttachment>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              url: reader.result as string,
              name: file.name,
              "data-ai-hint": file.name.split('.')[0].replace(/[\\W_]+/g, " ").substring(0, 20),
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImagesPromises).then(newImages => {
        const currentImages = form.getValues("attachments") || [];
        form.setValue("attachments", [...currentImages, ...newImages]);
      });
    }
  };

  const removeImage = (imageId: string) => {
    const currentImages = form.getValues("attachments") || [];
    form.setValue("attachments", currentImages.filter(img => img.id !== imageId));
  };
  
  const handleResetForm = () => {
    form.reset(getInitialFormValues(initialData));
  };

  const onSubmit = async (data: ImprovementFormValues) => {
    if (isEditMode && initialData) {
      const updatedData: Improvement = {
        ...initialData,
        ...data,
      };
      await updateImprovement(updatedData);
      toast({ title: t.updateSuccessTitle, description: t.updateSuccessDescription });
      router.push(`/improvements/${initialData.id}`);
    } else {
      const newData: Omit<Improvement, 'id' | 'updatedAt' | 'createdById'> = {
        ...data,
        submittedBy: currentUser?.name || 'Unknown',
        submissionDate: new Date().toISOString(),
      };
      const savedImprovement = await addImprovement(newData);
      toast({ title: t.saveSuccessTitle, description: t.saveSuccessDescription });
      router.push(`/improvements/${savedImprovement.id}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.titleLabel}</FormLabel>
                  <FormControl><Input placeholder={t.titlePlaceholder} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.descriptionLabel}</FormLabel>
                  <FormControl><Textarea placeholder={t.descriptionPlaceholder} {...field} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="benefitAnalysis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.benefitAnalysisLabel}</FormLabel>
                  <FormControl><Textarea placeholder={t.benefitAnalysisPlaceholder} {...field} rows={3} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.categoryLabel}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder={t.categoryPlaceholder} /></SelectTrigger></FormControl>
                            <SelectContent>
                            {IMPROVEMENT_CATEGORIES.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    <div className="flex items-center gap-2">
                                        <cat.icon className="h-4 w-4" />
                                        {cat.label[locale]}
                                    </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="estimatedCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.estimatedCostLabel}</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder={t.estimatedCostPlaceholder}
                                {...field}
                                onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                value={field.value ?? ''}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.statusLabel}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!isEditMode}>
                      <FormControl><SelectTrigger><SelectValue placeholder={t.statusPlaceholder} /></SelectTrigger></FormControl>
                      <SelectContent>
                        {IMPROVEMENT_STATUSES.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!isEditMode && <FormDescription>Trạng thái ban đầu sẽ là 'Mới'.</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormItem>
                <FormLabel>{t.attachmentsLabel}</FormLabel>
                <FormControl>
                    <div className="flex items-center gap-2">
                    <label htmlFor="image-upload-improvement" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                        <span><UploadCloud className="mr-2 h-4 w-4" /> {t.uploadButton}</span>
                        </Button>
                        <input
                        id="image-upload-improvement"
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        multiple
                        onChange={handleImageUpload}
                        />
                    </label>
                    </div>
                </FormControl>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {form.watch("attachments")?.map(att => (
                    <div key={att.id} className="relative group aspect-video border rounded-md">
                        <Image src={att.url} alt={att.name} layout="fill" objectFit="cover" className="rounded-md" data-ai-hint={att['data-ai-hint'] || 'improvement attachment'} />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => removeImage(att.id)}>
                            <XCircle className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-1 text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {att.name}
                        </div>
                    </div>
                    ))}
                </div>
                {form.watch("attachments")?.length === 0 && <p className="text-sm text-muted-foreground mt-2">{t.noImages}</p>}
                <FormMessage />
            </FormItem>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t.cancelButton}</Button>
          <Button type="button" variant="outline" onClick={handleResetForm}><RefreshCcw className="mr-2 h-4 w-4" />{t.resetFormButton}</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? t.saveProgress : (isEditMode ? t.updateButton : t.saveButton)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
