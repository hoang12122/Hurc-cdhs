
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
import { UploadCloud, XCircle, RefreshCcw, Mic, MicOff, Sparkles, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    IMPROVEMENT_STATUSES,
    IMPROVEMENT_CATEGORIES,
} from "@/lib/constants";
import { type Improvement, type ImageAttachment } from "@/lib/types";
import { addImprovement, updateImprovement } from "@/lib/actions/improvement.actions";
import { logAiAction } from "@/lib/actions/ai.actions";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
  "data-ai-hint": z.string().optional(),
  isAnalyzing: z.boolean().optional(),
  aiAnalysisResult: z.string().optional(),
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

  const [isRecording, setIsRecording] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    toast({
      title: "Đang đồng bộ...",
      description: "Đang đẩy dữ liệu offline lên hệ thống chính.",
    });
    
    setTimeout(() => {
        setIsSyncing(false);
        setIsOffline(false);
        toast({
            title: "Đồng bộ thành công",
            description: "Toàn bộ dữ liệu đã được lưu trữ an toàn.",
        });
    }, 3000);
  };

  const handleSpeechToAI = () => {
    // Check if browser supports SpeechRecognition
    const win = window as any;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Lỗi tương thích",
        description: "Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói (Vui lòng dùng Chrome/Edge).",
        variant: "destructive",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      toast({
        title: "Đang nghe...",
        description: "Vui lòng nói rõ ràng vấn đề cải tiến...",
      });
    };

    recognition.onresult = async (event: any) => {
      setIsRecording(false);
      const transcript = event.results[0][0].transcript;
      
      toast({
        title: "Đã ghi nhận giọng nói",
        description: `Đang phân tích: "${transcript}"...`,
      });

      try {
        setIsSyncing(true); // Reusing isSyncing state for visual loading indicator
        const res = await fetch('/api/ai/speech/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript })
        });
        
        if (!res.ok) throw new Error("API parsing failed");
        
        const data = await res.json();
        
        if (data.title) form.setValue("title", data.title);
        if (data.description) form.setValue("description", data.description);
        if (data.category) form.setValue("category", data.category);
        if (data.benefitAnalysis) form.setValue("benefitAnalysis", data.benefitAnalysis);
        if (data.estimatedCost) form.setValue("estimatedCost", data.estimatedCost);

        toast({
          title: "AI xử lý thành công",
          description: "Thông tin đã được điền tự động vào form.",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Lỗi xử lý AI",
          description: "Không thể phân tích giọng nói lúc này.",
          variant: "destructive",
        });
      } finally {
        setIsSyncing(false);
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      toast({
        title: "Lỗi nhận diện",
        description: "Không thể ghi âm. Hãy đảm bảo đã cấp quyền micro.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  React.useEffect(() => {
    form.reset(getInitialFormValues(initialData));
  }, [initialData, form, getInitialFormValues]);


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      const newImagesPromises = fileList.map(file => {
        return new Promise<{img: ImageAttachment, file: File}>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              img: {
                id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                url: reader.result as string,
                name: file.name,
                "data-ai-hint": file.name.split('.')[0].replace(/[\W_]+/g, " ").substring(0, 20),
                isAnalyzing: true,
              },
              file
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const processedFiles = await Promise.all(newImagesPromises);
      const currentImages = form.getValues("attachments") || [];
      const imagesWithAnalysis = processedFiles.map(pf => pf.img);
      
      // Update form immediately so user sees images with "AI Analyzing..."
      form.setValue("attachments", [...currentImages, ...imagesWithAnalysis]);

      // Call AI Real API
      processedFiles.forEach(async ({img, file}) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const res = await fetch('/api/ai/vision/analyze', {
            method: 'POST',
            body: formData
          });
          
          if (!res.ok) throw new Error("API error");
          const data = await res.json();
          
          let aiAnalysisResult = "Không phát hiện bất thường";
          if (data.detections && data.detections.length > 0) {
            const labels = data.detections.map((d: any) => d.label).join(', ');
            aiAnalysisResult = `Phát hiện: ${labels}`;
          }

          // Update the specific image attachment with results
          const latestAttachments = form.getValues("attachments") || [];
          form.setValue("attachments", latestAttachments.map(a => 
            a.id === img.id ? { ...a, isAnalyzing: false, aiAnalysisResult } : a
          ));
        } catch (error) {
          console.error("YOLO Error:", error);
          const latestAttachments = form.getValues("attachments") || [];
          form.setValue("attachments", latestAttachments.map(a => 
            a.id === img.id ? { ...a, isAnalyzing: false, aiAnalysisResult: "Lỗi phân tích AI" } : a
          ));
        }
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
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                {isOffline ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20 animate-pulse">
                        <WifiOff className="h-3 w-3" /> Offline Mode
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">
                        <Wifi className="h-3 w-3" /> Online
                    </div>
                )}
            </div>
            {isOffline && (
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 border-primary/30 text-primary hover:bg-primary/5 transition-all duration-300"
                    onClick={handleSync}
                    disabled={isSyncing}
                >
                    <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
                    {isSyncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
                </Button>
            )}
            {!isOffline && (
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-muted-foreground hover:text-red-500"
                    onClick={() => setIsOffline(true)}
                >
                    <WifiOff className="h-3 w-3 mr-1" /> Giả lập Offline
                </Button>
            )}
        </div>

        <Card className="glass-card border-white/20 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <CardContent className="pt-6 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t.titleLabel}</FormLabel>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className={cn(
                            "h-8 px-2 text-xs gap-1 transition-all duration-500",
                            isRecording ? "text-red-500 animate-pulse bg-red-500/10" : "text-primary hover:bg-primary/10"
                        )}
                        onClick={handleSpeechToAI}
                        disabled={isRecording || isSyncing}
                    >
                        {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                        {isRecording ? "Đang nghe..." : isSyncing ? "Đang xử lý..." : "Ghi âm AI (Gemma)"}
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                        <Input placeholder={t.titlePlaceholder} {...field} className={cn("pr-10", !field.value && isRecording && "animate-pulse")} />
                        {field.value && !isRecording && <Sparkles className="absolute right-3 top-2.5 h-4 w-4 text-amber-500 animate-in zoom-in duration-700" />}
                    </div>
                  </FormControl>
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
                    {!isEditMode && <FormDescription>Trạng thái ban đầu sẽ là &apos;Mới&apos;.</FormDescription>}
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
                    <div key={att.id} className="relative group aspect-video border-2 border-white/10 rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:scale-105 hover:border-primary/50">
                        <Image src={att.url} alt={att.name} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-110" data-ai-hint={att['data-ai-hint'] || 'improvement attachment'} />
                        
                        {att.isAnalyzing && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                            <RefreshCcw className="h-6 w-6 text-white animate-spin mb-2" />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">AI Analyzing...</span>
                          </div>
                        )}

                        {att.aiAnalysisResult && !att.isAnalyzing && (
                          <div className="absolute top-2 left-2 z-20">
                            <div className="bg-emerald-500/90 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-md shadow-lg border border-emerald-400/50 flex items-center gap-1 animate-in fade-in zoom-in duration-500">
                              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                              {att.aiAnalysisResult}
                            </div>
                          </div>
                        )}

                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 hover:rotate-90" onClick={() => removeImage(att.id)}>
                            <XCircle className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-md">
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

        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="ghost" onClick={() => router.back()} className="hover:bg-white/10">{t.cancelButton}</Button>
          <Button type="button" variant="outline" onClick={handleResetForm} className="border-white/20 glass-card hover:bg-white/10"><RefreshCcw className="mr-2 h-4 w-4" />{t.resetFormButton}</Button>
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95">
            {form.formState.isSubmitting ? t.saveProgress : (isEditMode ? t.updateButton : t.saveButton)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
