import { useState, useEffect, useTransition } from 'react';
import { getEquipments, getEquipmentById, createEquipment, deleteEquipment } from '@/lib/actions/equipment.actions';
import { useToast } from '@/hooks/use-toast';

export const useAsset360 = () => {
    const [equipments, setEquipments] = useState<any[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const loadEquipments = async () => {
        setIsLoading(true);
        try {
            const data = await getEquipments();
            setEquipments(data);
        } catch (error) {
            toast({ title: 'Lỗi tải danh sách tài sản', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadEquipments();
    }, []);

    const handleSelectEquipment = async (id: string) => {
        setIsLoading(true);
        try {
            const data = await getEquipmentById(id);
            setSelectedEquipment(data);
        } catch (error) {
            toast({ title: 'Lỗi tải thông tin chi tiết', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = (data: any, onSuccess: () => void) => {
        startTransition(async () => {
            const res = await createEquipment(data);
            if (res.success) {
                toast({ title: 'Đã thêm tài sản mới' });
                await loadEquipments();
                onSuccess();
            } else {
                toast({ title: 'Thất bại', description: res.error, variant: 'destructive' });
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
        startTransition(async () => {
            const res = await deleteEquipment(id);
            if (res.success) {
                toast({ title: 'Đã xóa tài sản' });
                setSelectedEquipment(null);
                await loadEquipments();
            } else {
                toast({ title: 'Lỗi khi xóa', variant: 'destructive' });
            }
        });
    };

    return {
        equipments,
        selectedEquipment,
        isLoading,
        isPending,
        handleSelectEquipment,
        handleCreate,
        handleDelete,
        refresh: loadEquipments
    };
};
