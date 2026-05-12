"use client";

import * as React from "react";
import { Check, X, Edit3, UserCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface AIProposal {
    id: string;
    module: string;
    content: string;
    timestamp: number;
}

export function AiVerificationPanel({ proposal }: { proposal: AIProposal }) {
    const [status, setStatus] = React.useState<'pending' | 'approved' | 'rejected' | 'editing'>('pending');
    const [editedContent, setEditedContent] = React.useState(proposal.content);
    const [reason, setReason] = React.useState("");

    const handleApprove = () => {
        setStatus('approved');
        console.log(`[HUMAN-CONFIRM] Approved AI result ${proposal.id}`);
    };

    const handleReject = () => {
        if (!reason) {
            alert("Vui lòng nhập lý do từ chối kết quả AI");
            return;
        }
        setStatus('rejected');
        console.log(`[HUMAN-CONFIRM] Rejected AI result ${proposal.id}. Reason: ${reason}`);
    };

    const handleSaveEdit = () => {
        setStatus('approved'); // Sau khi sửa thì coi như đã duyệt nội dung mới
        console.log(`[HUMAN-CONFIRM] Edited and approved AI result ${proposal.id}`);
    };

    if (status === 'approved') {
        return (
            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1 py-1 px-3">
                <UserCheck className="w-3 h-3" /> Đã xác nhận bởi con người
            </Badge>
        );
    }

    if (status === 'rejected') {
        return (
            <Badge variant="destructive" className="flex items-center gap-1 py-1 px-3">
                <ShieldAlert className="w-3 h-3" /> Đã từ chối kết quả AI
            </Badge>
        );
    }

    return (
        <Card className="border-amber-200 bg-amber-50/30 dark:bg-amber-950/10 dark:border-amber-900 mt-4 shadow-sm">
            <CardHeader className="py-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                    Xác nhận kết quả AI ({proposal.module})
                    <Badge variant="outline" className="ml-auto text-[10px] uppercase font-normal border-amber-300">
                        Chờ phê duyệt
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-4">
                {status === 'editing' ? (
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-muted-foreground">CHỈNH SỬA NỘI DUNG ĐỀ XUẤT:</label>
                        <Textarea 
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="text-sm min-h-[100px] bg-white"
                        />
                    </div>
                ) : (
                    <div className="p-3 bg-white border border-amber-100 rounded-md text-sm italic text-slate-700 shadow-inner">
                        &quot;{proposal.content}&quot;
                    </div>
                )}

                {status === 'pending' && (
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="h-8 text-amber-600 border-amber-200 hover:bg-amber-100" onClick={() => setStatus('editing')}>
                            <Edit3 className="w-3 h-3 mr-1" /> Chỉnh sửa
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => { /* Show reason input */ setStatus('pending'); }}>
                            <X className="w-3 h-3 mr-1" /> Từ chối
                        </Button>
                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                            <Check className="w-3 h-3 mr-1" /> Xác nhận & Lưu
                        </Button>
                    </div>
                )}

                {status === 'editing' && (
                    <div className="flex gap-2 justify-end pt-2">
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => setStatus('pending')}>Hủy</Button>
                        <Button size="sm" className="h-8 bg-amber-600 hover:bg-amber-700 text-white" onClick={handleSaveEdit}>Lưu bản sửa đổi</Button>
                    </div>
                )}
            </CardContent>
            <CardFooter className="py-2 border-t border-amber-100 dark:border-amber-900 bg-amber-100/20">
                <p className="text-[10px] text-amber-800 dark:text-amber-300">
                    * Lưu ý: AI chỉ đóng vai trò hỗ trợ. Mọi dữ liệu phải được con người kiểm tra trước khi lưu chính thức.
                </p>
            </CardFooter>
        </Card>
    );
}
