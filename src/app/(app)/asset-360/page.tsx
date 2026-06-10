'use client';

import { useState } from 'react';
import { useAsset360 } from './_hooks/useAsset360';
import { EquipmentList } from './_components/equipment-list';
import { Equipment360Card } from './_components/equipment-360-card';
import { EquipmentForm } from './_components/equipment-form';
import { Button } from '@/components/ui/button';
import { Plus, TrainFront, Lightbulb } from 'lucide-react';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { sound } from "@/lib/sounds";

export default function Asset360Page() {
    const {
        equipments,
        selectedEquipment,
        isLoading,
        isPending,
        handleSelectEquipment,
        handleCreate,
        handleDelete
    } = useAsset360();

    const [showAddForm, setShowAddForm] = useState(false);

    const startTour = () => {
        sound.playPop();
        const driverObj = driver({
            showProgress: true,
            animate: true,
            nextBtnText: 'Tiếp theo',
            prevBtnText: 'Quay lại',
            doneBtnText: 'Hoàn tất',
            steps: [
                {
                    element: '.tour-header',
                    popover: { title: 'Asset 360', description: 'Chào mừng bạn đến với Bản sao Số. Đây là nơi quản lý toàn bộ thiết bị của Tuyến Metro.' }
                },
                {
                    element: '.tour-equipment-list',
                    popover: { title: 'Danh sách Thiết bị', description: 'Tất cả thiết bị IoT và máy móc được liệt kê tại đây. Bạn có thể bấm vào để xem chi tiết.' }
                },
                {
                    element: '.tour-add-btn',
                    popover: { title: 'Thêm Thiết bị mới', description: 'Click vào đây để khai báo một thiết bị mới vào hệ thống quản lý.' }
                },
                {
                    element: '.tour-3d-viewer',
                    popover: { title: 'Mô hình 3D', description: 'Giao diện tương tác 3D. Dùng chuột để xoay, phóng to thu nhỏ và xem cấu trúc bên trong.' }
                }
            ]
        });
        driverObj.drive();
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <header className="tour-header flex items-center justify-between px-8 py-6 border-b bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-600 rounded-xl shadow-lg shadow-cyan-500/20">
                        <TrainFront className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">Asset 360 Digital Twin</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Bản sao số 360 độ - Trái tim hệ thống bảo trì</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-950" onClick={startTour}>
                        <Lightbulb className="h-4 w-4 mr-2" /> Hướng dẫn
                    </Button>
                    <Button 
                        className="tour-add-btn bg-cyan-600 hover:bg-cyan-700 text-white"
                    onClick={() => setShowAddForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Thêm Thiết bị
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden p-8 gap-8">
                {/* Left: List */}
                <div className="tour-equipment-list w-[400px] shrink-0">
                    <EquipmentList 
                    equipments={equipments}
                    selectedId={selectedEquipment?.id || null}
                    onSelect={handleSelectEquipment}
                    isLoading={isLoading}
                    />
                </div>

                {/* Right: Detail or Form */}
                <div className="tour-3d-viewer flex-1 overflow-y-auto">
                    {showAddForm ? (
                        <EquipmentForm 
                            onSubmit={(data) => handleCreate(data, () => setShowAddForm(false))}
                            onCancel={() => setShowAddForm(false)}
                            isPending={isPending}
                        />
                    ) : (
                        <Equipment360Card 
                            equipment={selectedEquipment} 
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
