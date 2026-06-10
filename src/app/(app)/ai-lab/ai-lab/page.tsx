"use client";

import React, { useEffect, useState } from 'react';
import { NotebookViewer } from '@/components/notebook-viewer';
import { readNotebookFile } from '@/lib/actions/ai.actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Beaker } from 'lucide-react';

export default function AILabPage() {
    const [lstmNotebook, setLstmNotebook] = useState<any>(null);
    const [ragNotebook, setRagNotebook] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotebooks = async () => {
            setLoading(true);
            const lstm = await readNotebookFile('lstm_training_demo.ipynb');
            const rag = await readNotebookFile('rag_engine_demo.ipynb');
            setLstmNotebook(lstm);
            setRagNotebook(rag);
            setLoading(false);
        };
        fetchNotebooks();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-medium">Đang tải Open Notebooks...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Beaker className="h-6 w-6 text-indigo-600" />
                    Phòng Thí nghiệm AI (HURC CDHS AI Lab)
                </h1>
                <p className="text-slate-500 mt-1">Môi trường Hộp Trắng (White-box) minh bạch hóa toàn bộ mã nguồn thuật toán Trí tuệ Nhân tạo.</p>
            </div>

            <Tabs defaultValue="lstm" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                    <TabsTrigger value="lstm">Mạng LSTM V2</TabsTrigger>
                    <TabsTrigger value="rag">Công cụ RAG Engine</TabsTrigger>
                </TabsList>
                <TabsContent value="lstm">
                    <NotebookViewer notebookData={lstmNotebook} title="Sổ tay Huấn luyện mạng Nơ-ron LSTM V2 (Numpy)" />
                </TabsContent>
                <TabsContent value="rag">
                    <NotebookViewer notebookData={ragNotebook} title="Sổ tay Thuật toán Tìm kiếm Tài liệu (TF-IDF RAG)" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
