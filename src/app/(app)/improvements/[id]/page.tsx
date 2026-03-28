
"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { IMPROVEMENT_CATEGORIES, IMPROVEMENT_STATUSES, MOCK_CURRENT_USER } from "@/lib/constants";
import { type Improvement } from "@/lib/types";
import { deleteImprovement, getImprovements } from "@/lib/actions/improvement.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Edit, Trash2, Calendar, User, DollarSign, TrendingUp, Lightbulb, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const translations = {
  vi: {
    titlePrefix: "Chi tiết Cải tiến",
    notFoundTitle: "Không tìm thấy Đề xuất Cải tiến",
    notFoundDescription: (id: string) => `Đề xuất cải tiến với ID "${id}" không tồn tại hoặc đã bị xóa.`,
    errorLoading: "Lỗi khi tải chi tiết.",
    errorTitle: "Lỗi",
    backToList: "Quay lại danh sách",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    confirmDeleteTitle: "Xác nhận Xóa",
    confirmDeleteMsg: (id: string) => `Bạn có chắc chắn muốn xóa Đề xuất Cải tiến #${id} không? Hành động này không thể hoàn tác.`,
    deleteSuccess: (id: string) => `Đề xuất Cải tiến #${id} đã được xóa thành công.`,
    cancel: "Hủy",
    confirmDelete: "Xác nhận Xóa",
    status: "Trạng thái",
    category: "Hạng mục",
    submittedBy: "Người đề xuất",
    submissionDate: "Ngày đề xuất",
    lastUpdated: "Cập nhật lần cuối",
    description: "Mô tả chi tiết",
    benefitAnalysis: "Phân tích Lợi ích",
    estimatedCost: "Chi phí Ước tính",
    attachments: "Tài liệu đính kèm",
    noAttachments: "Không có tài liệu đính kèm.",
    loadingMessage: "Đang tải...",
  },
  en: {
    titlePrefix: "Improvement Details",
    notFoundTitle: "Improvement Proposal Not Found",
    notFoundDescription: (id: string) => `The improvement proposal with ID "${id}" does not exist or has been deleted.`,
    errorLoading: "Error loading details.",
    errorTitle: "Error",
    backToList: "Back to list",
    edit: "Edit",
    delete: "Delete",
    confirmDeleteTitle: "Confirm Deletion",
    confirmDeleteMsg: (id: string) => `Are you sure you want to delete Improvement Proposal #${id}?`,
    deleteSuccess: (id: string) => `Improvement Proposal #${id} has been deleted successfully.`,
    cancel: "Cancel",
    confirmDelete: "Confirm Delete",
    status: "Status",
    category: "Category",
    submittedBy: "Submitted By",
    submissionDate: "Submission Date",
    lastUpdated: "Last Updated",
    description: "Detailed Description",
    benefitAnalysis: "Benefit Analysis",
    estimatedCost: "Estimated Cost",
    attachments: "Attachments",
    noAttachments: "No attachments.",
    loadingMessage: "Loading...",
  }
};

const getStatusBadgeVariant = (status: Improvement['status']): "default" | "secondary" | "destructive" | "outline" | "accent" => {
    switch (status) {
        case "Mới": return "outline";
        case "Đang xem xét": return "secondary";
        case "Đã duyệt": return "default";
        case "Đang thực hiện": return "accent";
        case "Hoàn thành": return "default";
        case "Đã từ chối": return "destructive";
        default: return "outline";
    }
};

export default function ImprovementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { locale } = useLanguage();
  const t = translations[locale];
  const { toast } = useToast();

  const [improvement, setImprovement] = React.useState<Improvement | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const canEdit = MOCK_CURRENT_USER.permissions?.includes('improvements:edit_all') ?? false;
  const canDelete = MOCK_CURRENT_USER.permissions?.includes('improvements:delete') ?? false;

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      setError(false);
      getImprovements()
        .then(allImprovements => {
          const foundItem = allImprovements.find(imp => imp.id === id) ?? null;
          if (foundItem) {
            setImprovement(foundItem);
            document.title = `${t.titlePrefix} #${id} - HURC CDHS`;
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [id, t.titlePrefix]);

  const handleActualDelete = async () => {
    if (!improvement) return;
    await deleteImprovement(improvement.id);
    toast({
      title: "Thành công",
      description: t.deleteSuccess(improvement.id),
    });
    router.push("/improvements");
  };

  if (loading) {
    return <div className="container mx-auto py-8 text-center">{t.loadingMessage}</div>;
  }

  if (error || !improvement) {
    return (
      <div className="container mx-auto py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">{t.notFoundTitle}</h1>
        <p className="text-muted-foreground mb-4">{t.notFoundDescription(id)}</p>
        <Button variant="outline" asChild>
          <Link href="/improvements">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
          </Link>
        </Button>
      </div>
    );
  }
  
  const categoryInfo = IMPROVEMENT_CATEGORIES.find(cat => cat.id === improvement.category);
  const CategoryIcon = categoryInfo?.icon || Lightbulb;
  const submissionDateFormatted = isMounted ? new Date(improvement.submissionDate).toLocaleDateString(locale) : '...';
  const updatedAtFormatted = isMounted ? new Date(improvement.updatedAt).toLocaleString(locale) : '...';

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
                <Link href="/improvements">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToList}
                </Link>
            </Button>
            <div className="flex gap-2">
                {canEdit && (
                    <Button variant="outline" asChild>
                        <Link href={`/improvements/${improvement.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t.edit}
                        </Link>
                    </Button>
                )}
                {canDelete && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> {t.delete}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogDescription>{t.confirmDeleteMsg(improvement.id)}</AlertDialogDescription>
                            <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleActualDelete}>{t.confirmDelete}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>

        <Card className="shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-headline text-primary flex items-center">
                           <Lightbulb className="mr-3 h-7 w-7"/> {improvement.title}
                        </CardTitle>
                        <CardDescription>ID: {improvement.id}</CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(improvement.status)} className="text-sm px-3 py-1">{improvement.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-center"><User className="mr-2 h-5 w-5 text-muted-foreground"/> <p><strong>{t.submittedBy}:</strong> {improvement.submittedBy}</p></div>
                    <div className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-muted-foreground"/> <p><strong>{t.submissionDate}:</strong> {submissionDateFormatted}</p></div>
                    <div className="flex items-center"><CategoryIcon className="mr-2 h-5 w-5 text-muted-foreground"/> <p><strong>{t.category}:</strong> {categoryInfo?.label[locale] || improvement.category}</p></div>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                     <div>
                        <h3 className="font-semibold text-lg mb-1">{t.description}:</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{improvement.description}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-1">{t.benefitAnalysis}:</h3>
                        <p className="text-muted-foreground whitespace-pre-line">{improvement.benefitAnalysis || (locale === 'vi' ? 'Chưa cung cấp' : 'Not provided')}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-1">{t.estimatedCost}:</h3>
                    <p className="text-muted-foreground text-lg font-mono">
                        {improvement.estimatedCost != null ? `${improvement.estimatedCost.toLocaleString(locale)} VNĐ` : (locale === 'vi' ? 'Chưa ước tính' : 'Not estimated')}
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">{t.attachments}:</h3>
                    {improvement.attachments && improvement.attachments.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {improvement.attachments.map(img => (
                        <div key={img.id} className="relative aspect-video group border rounded-md overflow-hidden">
                            <Image src={img.url} alt={img.name} layout="fill" objectFit="cover" data-ai-hint={img['data-ai-hint'] || 'improvement attachment'} />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs truncate group-hover:opacity-100 opacity-0 transition-opacity">
                                {img.name}
                            </div>
                        </div>
                        ))}
                    </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t.noAttachments}</p>
                    )}
                </div>
                <Separator/>
                <div className="text-xs text-muted-foreground">
                    <strong>{t.lastUpdated}:</strong> {updatedAtFormatted}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
