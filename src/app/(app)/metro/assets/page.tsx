'use client';

import * as React from 'react';
import { AssetTree } from '@/components/metro/asset-tree';
import { getAssetTree, createAsset, deleteAsset, getAssetQRCode } from '@/lib/actions/asset.actions';
import { getSnmpConfig, upsertSnmpConfig } from '@/lib/actions/telemetry.actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { 
    Plus, 
    Trash2, 
    RefreshCcw, 
    Search, 
    LayoutDashboard,
    ShieldCheck,
    AlertTriangle,
    Info,
    TrainFront,
    Settings2,
    Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TelemetryChart } from '@/components/metro/telemetry-chart';

export default function AssetHubPage() {
    const [assets, setAssets] = React.useState<any[]>([]);
    const [selectedAsset, setSelectedAsset] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    
    // Form State
    const [showAddForm, setShowAddForm] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: '',
        code: '',
        subsystem: 'Rolling Stock',
        criticality: 'Medium',
        parentId: ''
    });

    // SNMP State
    const [snmpConfig, setSnmpConfig] = React.useState({
        ip: '',
        community: 'public',
        oid: '',
        metricName: 'Temperature',
        intervalSeconds: 60
    });
    const [showSnmpDialog, setShowSnmpDialog] = React.useState(false);
    const [isSavingSnmp, setIsSavingSnmp] = React.useState(false);

    const [qrCode, setQrCode] = React.useState<string | null>(null);

    const { toast } = useToast();

    const loadAssets = async () => {
        setIsRefreshing(true);
        try {
            const data = await getAssetTree();
            setAssets(data);
        } catch (e) {
            toast({ title: "Lỗi tải dữ liệu", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    React.useEffect(() => {
        loadAssets();
    }, []);

    React.useEffect(() => {
        if (selectedAsset) {
            getSnmpConfig(selectedAsset.id).then(config => {
                if (config) {
                    setSnmpConfig({
                        ip: config.ip,
                        community: config.community,
                        oid: config.oid,
                        metricName: config.metricName,
                        intervalSeconds: config.intervalSeconds
                    });
                } else {
                    setSnmpConfig({ ip: '', community: 'public', oid: '', metricName: 'Temperature', intervalSeconds: 60 });
                }
            });

            getAssetQRCode(selectedAsset.id).then(setQrCode);
        } else {
            setQrCode(null);
        }
    }, [selectedAsset]);

    const handleSaveSnmp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingSnmp(true);
        try {
            await upsertSnmpConfig({
                assetId: selectedAsset.id,
                ...snmpConfig
            });
            toast({ title: "Đã cập nhật cấu hình SNMP" });
            setShowSnmpDialog(false);
        } catch (e) {
            toast({ title: "Lỗi lưu cấu hình", variant: "destructive" });
        } finally {
            setIsSavingSnmp(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAsset({
                ...formData,
                parentId: formData.parentId || undefined
            });
            toast({ title: "Đã thêm tài sản mới" });
            setFormData({ name: '', code: '', subsystem: 'Rolling Stock', criticality: 'Medium', parentId: '' });
            setShowAddForm(false);
            loadAssets();
        } catch (e) {
            toast({ title: "Lỗi thêm tài sản", variant: "destructive" });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài sản này?")) return;
        try {
            await deleteAsset(id);
            toast({ title: "Đã xóa tài sản" });
            setSelectedAsset(null);
            loadAssets();
        } catch (e) {
            toast({ title: "Lỗi khi xóa", variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-transparent">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6 border-b bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                        <TrainFront className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Metro Asset Hub</h1>
                        <p className="text-sm text-muted-foreground font-medium">Digital Registry & Hierarchy Management</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white hover:bg-slate-50"
                        onClick={loadAssets}
                        disabled={isRefreshing}
                    >
                        <RefreshCcw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                        Làm mới
                    </Button>
                    <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10"
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Thêm tài sản
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden p-8 gap-8">
                {/* Left: Asset Tree */}
                <Card className="w-96 flex flex-col border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">Cây tài sản</CardTitle>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold px-2">{assets.length} Gốc</Badge>
                        </div>
                        <CardDescription>Cấu trúc phân cấp hệ thống Metro</CardDescription>
                        <div className="relative mt-4">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Tìm mã hoặc tên..." className="pl-9 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500" />
                        </div>
                    </CardHeader>
                    <Separator className="bg-slate-100/50" />
                    <CardContent className="flex-1 overflow-auto pt-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 w-full bg-slate-100 animate-pulse rounded-md" />)}
                            </div>
                        ) : (
                            <AssetTree assets={assets} onSelect={setSelectedAsset} />
                        )}
                    </CardContent>
                </Card>

                {/* Right: Details / Forms */}
                <div className="flex-1 overflow-auto">
                    {showAddForm ? (
                        <Card className="border-none shadow-xl shadow-indigo-100/50 dark:shadow-none bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-indigo-700">Thêm tài sản mới</CardTitle>
                                <CardDescription>Tạo nút mới trong hệ thống phân cực Metro</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreate} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Tên tài sản</Label>
                                            <Input 
                                                placeholder="VD: Ga Bến Thành" 
                                                value={formData.name} 
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Mã tài sản (Code)</Label>
                                            <Input 
                                                placeholder="VD: STN-BT" 
                                                value={formData.code} 
                                                onChange={e => setFormData({...formData, code: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hệ thống con (Subsystem)</Label>
                                            <Select value={formData.subsystem} onValueChange={v => setFormData({...formData, subsystem: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Rolling Stock">Rolling Stock (Tầu)</SelectItem>
                                                    <SelectItem value="Signaling">Signaling (Tín hiệu)</SelectItem>
                                                    <SelectItem value="Power Supply">Power Supply (Điện)</SelectItem>
                                                    <SelectItem value="Track">Track (Đường ray)</SelectItem>
                                                    <SelectItem value="Civil">Civil (Công trình)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Độ quan trọng (Criticality)</Label>
                                            <Select value={formData.criticality} onValueChange={v => setFormData({...formData, criticality: v})}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High">Cao (High)</SelectItem>
                                                    <SelectItem value="Medium">Trung bình (Medium)</SelectItem>
                                                    <SelectItem value="Low">Thấp (Low)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tài sản cha (Parent ID - Optional)</Label>
                                        <Input 
                                            placeholder="Dán ID của tài sản cha để tạo phân cấp" 
                                            value={formData.parentId} 
                                            onChange={e => setFormData({...formData, parentId: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" type="button" onClick={() => setShowAddForm(false)}>Hủy</Button>
                                        <Button type="submit" className="bg-indigo-600 text-white px-8">Lưu tài sản</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : selectedAsset ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                                <div className={cn(
                                    "h-1.5 w-full",
                                    selectedAsset.criticality === 'High' ? "bg-red-500" : "bg-indigo-500"
                                )} />
                                <CardHeader className="flex flex-row items-center justify-between pb-6">
                                    <div className="flex items-center gap-4">
                                        <Card className="border-none shadow-xl bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center space-y-4">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">QR Code Định danh</h4>
                                            {qrCode ? (
                                                <div className="p-2 bg-white rounded-xl border-4 border-slate-50 shadow-inner">
                                                    <img src={qrCode} alt="Asset QR Code" className="w-32 h-32" />
                                                </div>
                                            ) : (
                                                <div className="w-32 h-32 bg-slate-50 animate-pulse rounded-xl" />
                                            )}
                                            <p className="text-[10px] text-slate-400 text-center font-medium max-w-[120px]">
                                                Dán tại thiết bị để truy cập nhanh từ Mobile
                                            </p>
                                            <Button size="sm" variant="ghost" className="text-[10px] h-6" onClick={() => window.print()}>
                                                In nhãn QR
                                            </Button>
                                        </Card>
                                        <div className="p-3 bg-slate-50 rounded-2xl">
                                            <Settings2 className="h-8 w-8 text-slate-700" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-2xl font-black">{selectedAsset.name}</CardTitle>
                                                <Badge variant="secondary" className="font-mono">{selectedAsset.code}</Badge>
                                            </div>
                                            <CardDescription className="font-medium text-slate-500 mt-1">{selectedAsset.subsystem} Subsystem</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Dialog open={showSnmpDialog} onOpenChange={setShowSnmpDialog}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-10 px-4 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100">
                                                    <Settings2 className="h-4 w-4 mr-2" /> Thiết lập SNMP
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Cấu hình Giám sát SNMP</DialogTitle>
                                                    <DialogDescription>
                                                        Thiết lập thông số để AI theo dõi sức khỏe thiết bị thời gian thực.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleSaveSnmp} className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>Địa chỉ IP Thiết bị</Label>
                                                        <Input value={snmpConfig.ip} onChange={e => setSnmpConfig({...snmpConfig, ip: e.target.value})} placeholder="10.0.0.1" required />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label>SNMP Community</Label>
                                                            <Input value={snmpConfig.community} onChange={e => setSnmpConfig({...snmpConfig, community: e.target.value})} placeholder="public" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Metric Name</Label>
                                                            <Select value={snmpConfig.metricName} onValueChange={v => setSnmpConfig({...snmpConfig, metricName: v})}>
                                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Temperature">Nhiệt độ (C)</SelectItem>
                                                                    <SelectItem value="Voltage">Điện áp (V)</SelectItem>
                                                                    <SelectItem value="Load">Tải trọng (%)</SelectItem>
                                                                    <SelectItem value="Status">Trạng thái (0/1)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>SNMP OID</Label>
                                                        <Input value={snmpConfig.oid} onChange={e => setSnmpConfig({...snmpConfig, oid: e.target.value})} placeholder="1.3.6.1.4.1.25053..." required />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit" disabled={isSavingSnmp}>
                                                            {isSavingSnmp ? "Đang lưu..." : "Lưu cấu hình"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="outline" size="icon" className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(selectedAsset.id)}>
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <Separator className="bg-slate-100/50" />
                                <CardContent className="py-8">
                                    <div className="grid grid-cols-3 gap-8">
                                        <div className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-widest font-black text-slate-400">Trạng thái</span>
                                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                                <ShieldCheck className="h-5 w-5" /> Hoạt động tốt
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-widest font-black text-slate-400">Độ quan trọng</span>
                                            <div className={cn(
                                                "flex items-center gap-2 font-bold",
                                                selectedAsset.criticality === 'High' ? "text-red-600" : "text-amber-600"
                                            )}>
                                                <AlertTriangle className="h-5 w-5" /> {selectedAsset.criticality}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-xs uppercase tracking-widest font-black text-slate-400">ID Hệ thống</span>
                                            <div className="flex items-center gap-2 text-slate-600 font-mono text-sm">
                                                <Info className="h-5 w-5" /> {selectedAsset.id}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-6">
                                <Card className="border-none shadow-lg bg-white dark:bg-slate-900 p-6 flex items-center gap-4">
                                    <div className="p-4 bg-orange-50 rounded-2xl">
                                        <Activity className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-tight">Sự cố liên quan</h4>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">0</p>
                                    </div>
                                </Card>
                                <Card className="border-none shadow-lg bg-white dark:bg-slate-900 p-6 flex items-center gap-4">
                                    <div className="p-4 bg-blue-50 rounded-2xl">
                                        <LayoutDashboard className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-tight">Lượt kiểm định</h4>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white">0</p>
                                    </div>
                                </Card>
                            </div>

                            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 p-8">
                                <TelemetryChart assetId={selectedAsset.id} assetName={selectedAsset.name} />
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="p-6 bg-slate-100 rounded-full">
                                <TrainFront className="h-12 w-12 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-600">Chọn một tài sản</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">Chọn bất kỳ nút nào từ Cây tài sản bên trái để xem chi tiết kỹ thuật và lịch sử bảo trì.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
