import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EquipmentFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isPending: boolean;
}

export function EquipmentForm({ onSubmit, onCancel, isPending }: EquipmentFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: '',
        installDate: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            specs: { manufacturer: "Unknown", voltage: "220V" } // Mock specs for PoC
        });
    };

    return (
        <Card className="border-none shadow-xl shadow-cyan-100/50 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-cyan-700">Thêm Tài sản mới</CardTitle>
                <CardDescription>Đưa thiết bị vào hệ thống quản lý 360 độ</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tên thiết bị</Label>
                            <Input 
                                placeholder="VD: Bơm nước Tòa nhà" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mã định danh (Code)</Label>
                            <Input 
                                placeholder="VD: PUMP-01" 
                                value={formData.code} 
                                onChange={e => setFormData({...formData, code: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Danh mục</Label>
                            <Input 
                                placeholder="VD: Hệ thống Nước" 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày lắp đặt</Label>
                            <Input 
                                type="date"
                                value={formData.installDate} 
                                onChange={e => setFormData({...formData, installDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>Hủy</Button>
                        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={isPending}>
                            {isPending ? "Đang lưu..." : "Lưu tài sản"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
