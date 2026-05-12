"use client";

import * as React from "react";
import { Search, Filter, FileOutput, ShieldCheck, Clock, User, Cpu, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AiSafetyLogViewer() {
    // Mock data cho giao diện demo
    const mockLogs = [
        {
            id: "LOG-AI-20260508-A1",
            timestamp: "2026-05-08 14:05:12",
            module: "YOLO",
            user: "Nguyễn Văn A",
            target: "DNF-2026-001",
            status: "APPROVED",
            details: "Phát hiện vết nứt trục bánh xe (crack 0.92)"
        },
        {
            id: "LOG-AI-20260508-B2",
            timestamp: "2026-05-08 14:06:45",
            module: "GEMMA",
            user: "Trần Thị B",
            target: "HAZARD-045",
            status: "EDITED",
            details: "Bóc tách giọng nói: 'Toa 05' -> 'Toa 07' (người dùng sửa)"
        },
        {
            id: "LOG-AI-20260508-C3",
            timestamp: "2026-05-08 14:07:30",
            module: "RAG",
            user: "Lê Văn C",
            target: "DOC-SEARCH",
            status: "REJECTED",
            details: "AI đề xuất tài liệu sai phiên bản kỹ thuật."
        }
    ];

    return (
        <Card className="w-full shadow-lg border-slate-200">
            <CardHeader className="bg-slate-50 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                        AI Safety Log Explorer
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" /> Bộ lọc
                        </Button>
                        <Button variant="outline" size="sm" className="text-green-700 border-green-200">
                            <FileOutput className="w-4 h-4 mr-2" /> Xuất Excel
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="p-4 border-b bg-white flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm kiếm theo mã DNF, người dùng hoặc module..." className="pl-9 h-10" />
                    </div>
                </div>
                
                <ScrollArea className="h-[500px]">
                    <Table>
                        <TableHeader className="bg-slate-50/50 sticky top-0">
                            <TableRow>
                                <TableHead className="w-[180px] font-bold text-slate-700"><Clock className="w-3 h-3 inline mr-1" /> Thời gian</TableHead>
                                <TableHead className="w-[100px] font-bold text-slate-700"><Cpu className="w-3 h-3 inline mr-1" /> Module</TableHead>
                                <TableHead className="w-[150px] font-bold text-slate-700"><User className="w-3 h-3 inline mr-1" /> Người thực hiện</TableHead>
                                <TableHead className="w-[120px] font-bold text-slate-700">Mã tham chiếu</TableHead>
                                <TableHead className="w-[100px] font-bold text-slate-700">Trạng thái</TableHead>
                                <TableHead className="font-bold text-slate-700">Chi tiết xử lý</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="text-xs font-mono text-slate-500">{log.timestamp}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{log.module}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.user}</TableCell>
                                    <TableCell className="text-xs font-semibold">{log.target}</TableCell>
                                    <TableCell>
                                        {log.status === "APPROVED" && <Badge className="bg-green-500">Duyệt</Badge>}
                                        {log.status === "EDITED" && <Badge className="bg-amber-500">Sửa đổi</Badge>}
                                        {log.status === "REJECTED" && <Badge className="bg-red-500">Từ chối</Badge>}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600 italic">
                                        {log.details}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
            <div className="p-3 bg-slate-50 border-t flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Chỉ Quản trị viên mới có quyền xem dữ liệu nhạy cảm.
                </div>
                <div>Hiển thị 3 bản ghi gần nhất</div>
            </div>
        </Card>
    );
}
