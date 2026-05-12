
"use client";

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/language-context";

interface ReportLayoutProps {
    title: string;
    documentId: string;
    date?: string | Date;
    children: React.ReactNode;
    subtitle?: string;
}

export function ReportLayout({ 
    title, 
    documentId, 
    date = new Date(), 
    children,
    subtitle = "HURC-1 - HỆ THỐNG QUẢN LÝ BẢO TRÌ & AN TOÀN" 
}: ReportLayoutProps) {
    const { locale } = useLanguage();
    const formattedDate = typeof date === 'string' ? date : format(date, 'dd/MM/yyyy HH:mm');

    return (
        <div className="print-only w-full bg-white text-black p-0 min-h-screen">
            {/* Header with Logo and Info */}
            <div className="report-header flex items-center justify-between pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary flex items-center justify-center text-white font-bold rounded-lg no-print-bg">
                        HURC1
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-primary">HURC-1</h2>
                        <p className="text-xs text-muted-foreground uppercase font-medium">{subtitle}</p>
                    </div>
                </div>
                <div className="text-right text-xs space-y-1">
                    <div className="font-mono font-bold">ID: {documentId}</div>
                    <div>Ngày in: {formattedDate}</div>
                    <div className="italic text-[10px]">Tài liệu nội bộ - Bảo mật</div>
                </div>
            </div>

            {/* Document Title */}
            <h1 className="report-title">{title}</h1>

            {/* Main Content Area */}
            <div className="report-content py-4">
                {children}
            </div>

            {/* Signature Section */}
            <div className="signature-section pt-10 mt-auto">
                <div className="signature-box">
                    <p className="font-bold">Người lập phiếu</p>
                    <p className="text-[10px] text-muted-foreground italic">(Ký và ghi rõ họ tên)</p>
                    <div className="signature-space"></div>
                    <p className="mt-4 border-t border-dotted border-black pt-1">..........................................</p>
                </div>
                
                <div className="signature-box">
                    <p className="font-bold">Cán bộ phụ tráchL2</p>
                    <p className="text-[10px] text-muted-foreground italic">(Xác nhận chuyên môn)</p>
                    <div className="signature-space"></div>
                    <p className="mt-4 border-t border-dotted border-black pt-1">..........................................</p>
                </div>

                <div className="signature-box">
                    <p className="font-bold">Lãnh đạo đơn vị</p>
                    <p className="text-[10px] text-muted-foreground italic">(Phê duyệt cuối cùng)</p>
                    <div className="signature-space"></div>
                    <p className="mt-4 border-t border-dotted border-black pt-1">..........................................</p>
                </div>
            </div>

            {/* Footer / Page Numbers */}
            <div className="fixed bottom-0 left-0 right-0 text-center text-[8pt] text-gray-400 py-4 report-footer">
                Trang 1 / 1 - Bản quyền © 2026 HURC-1 Metro. 
                Địa chỉ: Depot Long Bình, TP. Thủ Đức, TP. Hồ Chí Minh.
            </div>
        </div>
    );
}
