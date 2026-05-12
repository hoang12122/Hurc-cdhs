'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    React.useEffect(() => {
        // Log the error to an analytics service
        console.error('HURC Global Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-red-100 dark:border-red-900/30 text-center space-y-6">
                <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Hệ thống gặp sự cố tạm thời</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Có vẻ như kết nối tới Cơ sở dữ liệu hoặc Dịch vụ AI đang gặp gián đoạn. Chúng tôi xin lỗi vì sự bất tiện này.
                    </p>
                </div>

                {error.digest && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                        <code className="text-[10px] text-slate-400 font-mono">ID sự cố: {error.digest}</code>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                        onClick={() => reset()} 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" /> Thử lại ngay
                    </Button>
                    <Button 
                        variant="outline" 
                        asChild 
                        className="flex-1 gap-2"
                    >
                        <a href="/">
                            <Home className="h-4 w-4" /> Về trang chủ
                        </a>
                    </Button>
                </div>
                
                <p className="text-[10px] text-slate-400 italic">
                    Gợi ý: Nếu lỗi vẫn tiếp diễn, bạn hãy kiểm tra trạng thái Docker Engine và DB JSON.
                </p>
            </div>
        </div>
    );
}
