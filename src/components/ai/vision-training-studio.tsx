'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ImagePlus, Play, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Dataset {
  id: string;
  name: string;
  description: string;
  classes: string[];
  status: string;
}

interface Box {
  id: string;
  classId: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Sample {
  id: string;
  status: string;
}

interface TrainingJob {
  id: string;
  status: string;
  approval?: string;
  metrics?: Record<string, number>;
  error?: string;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/vision-training/${path}`, { ...init, cache: 'no-store' });
  const body = await response.json();
  if (!response.ok) throw new Error(body.detail || body.error || `HTTP ${response.status}`);
  return body as T;
}

export function VisionTrainingStudio() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [datasetId, setDatasetId] = useState('');
  const [datasetName, setDatasetName] = useState('');
  const [classText, setClassText] = useState('normal, crack, corrosion, displacement');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [split, setSplit] = useState<'train' | 'val' | 'test'>('train');
  const [sample, setSample] = useState<Sample | null>(null);
  const [job, setJob] = useState<TrainingJob | null>(null);
  const [epochs, setEpochs] = useState(50);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const dataset = useMemo(() => datasets.find(item => item.id === datasetId) ?? null, [datasetId, datasets]);

  const refreshDatasets = async () => {
    try {
      const values = await api<Dataset[]>('datasets');
      setDatasets(values);
      if (!datasetId && values[0]) setDatasetId(values[0].id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải dataset.');
    }
  };

  useEffect(() => { void refreshDatasets(); }, []);
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);
  useEffect(() => {
    if (!job || !['QUEUED', 'RUNNING'].includes(job.status)) return;
    const timer = window.setInterval(async () => {
      try {
        setJob(await api<TrainingJob>(`training/jobs/${job.id}`));
      } catch { /* keep last known state */ }
    }, 5_000);
    return () => window.clearInterval(timer);
  }, [job]);

  const createDataset = async () => {
    const classes = classText.split(',').map(value => value.trim()).filter(Boolean);
    if (!datasetName.trim() || classes.length === 0) return setMessage('Nhập tên dataset và ít nhất một lớp lỗi.');
    setBusy(true);
    try {
      const created = await api<Dataset>('datasets', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: datasetName.trim(), classes, description: 'Dataset lỗi thiết bị được tạo từ Vision Training Studio.' }),
      });
      await refreshDatasets();
      setDatasetId(created.id);
      setDatasetName('');
      setMessage(`Đã tạo dataset ${created.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Tạo dataset thất bại.');
    } finally { setBusy(false); }
  };

  const selectImage = (selected: File | null) => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(selected);
    setImageUrl(selected ? URL.createObjectURL(selected) : '');
    setBoxes([]);
    setSample(null);
  };

  const pointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  const finishBox = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;
    const end = pointer(event);
    const left = Math.min(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    if (width < 0.01 || height < 0.01) return;
    setBoxes(current => [...current, {
      id: crypto.randomUUID(), classId: selectedClass,
      x: left + width / 2, y: top + height / 2, width, height,
    }]);
  };

  const uploadSample = async () => {
    if (!dataset || !file || boxes.length === 0) return setMessage('Chọn dataset, ảnh và vẽ ít nhất một bounding box.');
    const form = new FormData();
    form.append('image', file);
    form.append('split', split);
    form.append('source', 'vision-training-studio');
    form.append('annotations', JSON.stringify(boxes.map(({ classId, x, y, width, height }) => ({ classId, x, y, width, height }))));
    setBusy(true);
    try {
      setSample(await api<Sample>(`datasets/${dataset.id}/samples`, { method: 'POST', body: form }));
      setMessage('Ảnh đã vào hàng đợi duyệt; chưa được dùng để huấn luyện.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Tải mẫu thất bại.');
    } finally { setBusy(false); }
  };

  const approveSample = async () => {
    if (!sample) return;
    setBusy(true);
    try {
      setSample(await api<Sample>(`samples/${sample.id}/approve`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ note: 'Đã kiểm tra ảnh và bounding box trên giao diện.' }),
      }));
      setMessage('Mẫu đã được phê duyệt cho dataset.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Duyệt mẫu thất bại.');
    } finally { setBusy(false); }
  };

  const startTraining = async () => {
    if (!dataset) return setMessage('Chọn dataset trước khi huấn luyện.');
    setBusy(true);
    try {
      setJob(await api<TrainingJob>('training/jobs', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ datasetId: dataset.id, baseModel: 'yolo11n.pt', epochs, imageSize: 640, batchSize: 8 }),
      }));
      setMessage('Job đã được xếp hàng. Model hoàn thành vẫn phải qua phê duyệt trước triển khai.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể khởi chạy huấn luyện.');
    } finally { setBusy(false); }
  };

  const approveModel = async () => {
    if (!job || job.status !== 'SUCCEEDED_REVIEW_REQUIRED') return;
    setBusy(true);
    try {
      setJob(await api<TrainingJob>(`training/jobs/${job.id}/approve`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ note: 'Đã xem xét metric; model được duyệt nhưng chưa được triển khai.' }),
      }));
      setMessage('Model đã được duyệt ở trạng thái APPROVED_NOT_DEPLOYED. Cần canary và phê duyệt phát hành riêng.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Phê duyệt model thất bại.');
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-3xl font-black">Vision Training Studio</h1><p className="text-sm text-slate-600">Gắn nhãn ảnh, kiểm duyệt dữ liệu và huấn luyện model nhận biết lỗi thiết bị.</p></div>
          <Button asChild variant="outline"><Link href="/mlops"><ArrowLeft className="mr-2 h-4 w-4" />MLOps</Link></Button>
        </div>
        {message && <div className="rounded-xl border bg-white p-3 text-sm">{message}</div>}

        <section className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader><CardTitle>1. Dataset và lớp lỗi</CardTitle><CardDescription>Mỗi lớp phải rõ nghĩa, không trùng tên và có đủ ảnh train/validation.</CardDescription></CardHeader><CardContent className="space-y-3">
            <Label>Tên dataset</Label><Input value={datasetName} onChange={event => setDatasetName(event.target.value)} placeholder="PSD door defects 2026" />
            <Label>Các lớp, phân cách bằng dấu phẩy</Label><Input value={classText} onChange={event => setClassText(event.target.value)} />
            <Button onClick={() => void createDataset()} disabled={busy}><Plus className="mr-2 h-4 w-4" />Tạo dataset</Button>
            <Label>Dataset đang dùng</Label>
            <select className="h-10 w-full rounded-md border bg-white px-3" value={datasetId} onChange={event => { setDatasetId(event.target.value); setBoxes([]); setSample(null); }}>
              <option value="">Chọn dataset</option>{datasets.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {dataset && <div className="flex flex-wrap gap-2">{dataset.classes.map((item, index) => <Badge key={item} variant="outline">{index}: {item}</Badge>)}</div>}
          </CardContent></Card>

          <Card><CardHeader><CardTitle>2. Chọn ảnh và vẽ vùng lỗi</CardTitle><CardDescription>Kéo chuột từ góc trên trái đến góc dưới phải của lỗi.</CardDescription></CardHeader><CardContent className="space-y-3">
            <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => selectImage(event.target.files?.[0] ?? null)} />
            <div className="grid gap-3 sm:grid-cols-2"><select className="h-10 rounded-md border bg-white px-3" value={selectedClass} onChange={event => setSelectedClass(Number(event.target.value))}>{dataset?.classes.map((item, index) => <option key={item} value={index}>{item}</option>)}</select><select className="h-10 rounded-md border bg-white px-3" value={split} onChange={event => setSplit(event.target.value as typeof split)}><option value="train">Train</option><option value="val">Validation</option><option value="test">Test</option></select></div>
            {imageUrl && <div className="overflow-auto rounded-xl border bg-slate-900 p-2"><div className="relative inline-block max-w-full select-none" onPointerDown={event => { startRef.current = pointer(event); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={finishBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}<img src={imageUrl} alt="Ảnh gắn nhãn" className="max-h-[520px] max-w-full" draggable={false} />
              <div className="absolute inset-0 cursor-crosshair">{boxes.map(box => <div key={box.id} className="absolute border-2 border-red-500 bg-red-500/10" style={{ left: `${(box.x - box.width / 2) * 100}%`, top: `${(box.y - box.height / 2) * 100}%`, width: `${box.width * 100}%`, height: `${box.height * 100}%` }}><span className="bg-red-600 px-1 text-xs text-white">{dataset?.classes[box.classId]}</span></div>)}</div>
            </div></div>}
            <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setBoxes([])}><Trash2 className="mr-2 h-4 w-4" />Xóa box</Button><Button onClick={() => void uploadSample()} disabled={busy || !file || boxes.length === 0}><ImagePlus className="mr-2 h-4 w-4" />Gửi mẫu</Button>{sample?.status === 'PENDING_REVIEW' && <Button onClick={() => void approveSample()} disabled={busy}><CheckCircle2 className="mr-2 h-4 w-4" />Duyệt mẫu</Button>}</div>
          </CardContent></Card>
        </section>

        <Card><CardHeader><CardTitle>3. Huấn luyện có kiểm soát</CardTitle><CardDescription>Chỉ chạy khi mỗi lớp đủ mẫu đã duyệt và có dữ liệu validation. Model không tự triển khai.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-[180px_auto_1fr] md:items-end"><div><Label>Epochs</Label><Input type="number" min={1} max={200} value={epochs} onChange={event => setEpochs(Number(event.target.value))} /></div><Button onClick={() => void startTraining()} disabled={busy || !dataset}><Play className="mr-2 h-4 w-4" />Bắt đầu training</Button><div className="rounded-xl border p-3 text-sm">{job ? <><div className="flex flex-wrap items-center gap-2"><Badge>{job.status}</Badge><span>{job.id}</span>{['QUEUED', 'RUNNING'].includes(job.status) && <RefreshCw className="h-4 w-4 animate-spin" />}{job.status === 'SUCCEEDED_REVIEW_REQUIRED' && <Button size="sm" onClick={() => void approveModel()} disabled={busy}><ShieldCheck className="mr-2 h-4 w-4" />Duyệt model</Button>}</div>{job.metrics && <div className="mt-2 text-xs text-slate-500">{Object.entries(job.metrics).slice(0, 6).map(([key, value]) => `${key}: ${value.toFixed(4)}`).join(' · ')}</div>}{job.error && <div className="mt-2 text-red-600">{job.error}</div>}</> : 'Chưa có job đang theo dõi.'}</div></CardContent></Card>
      </div>
    </main>
  );
}
