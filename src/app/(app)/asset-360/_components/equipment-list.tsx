import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, TrainFront } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EquipmentListProps {
    equipments: any[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isLoading: boolean;
}

export function EquipmentList({ equipments, selectedId, onSelect, isLoading }: EquipmentListProps) {
    if (isLoading && equipments.length === 0) {
        return (
            <div className="space-y-3 p-4">
                {[1, 2, 3].map(i => <div key={i} className="h-12 w-full bg-slate-100 animate-pulse rounded-md" />)}
            </div>
        );
    }

    return (
        <Card className="w-80 flex flex-col border-none shadow-xl shadow-slate-200/50 bg-white h-full">
            <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">Danh sách Thiết bị</CardTitle>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-2">
                        {equipments.length}
                    </Badge>
                </div>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Tìm mã hoặc tên..." className="pl-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-cyan-500" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                <div className="divide-y divide-slate-50">
                    {equipments.map(eq => (
                        <button
                            key={eq.id}
                            onClick={() => onSelect(eq.id)}
                            className={cn(
                                "w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-center gap-3",
                                selectedId === eq.id && "bg-cyan-50/50 border-l-4 border-cyan-500"
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-lg",
                                selectedId === eq.id ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500"
                            )}>
                                <TrainFront className="h-5 w-5" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-bold text-sm text-slate-700 truncate">{eq.name}</h4>
                                <p className="text-xs text-slate-400 font-mono">{eq.code}</p>
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[10px]",
                                eq.status === 'ACTIVE' ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"
                            )}>
                                {eq.status}
                            </Badge>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
