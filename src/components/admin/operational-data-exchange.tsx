'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, CheckCircle2, Download, FileJson, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Entity = 'dnf' | 'hazard';

interface ImportIssue {
  row: number;
  field?: string;
  code: string;
  message: string;
}

interface ImportResult {
  entity: Entity;
  dryRun: boolean;
  totalRows: number;
  validRows: number;
  created: number;
  updated: number;
  rejected: number;
  issues: ImportIssue[];
}

export function OperationalDataExchange() {
  const [entity, setEntity] = useState<Entity>('dnf');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async (dryRun: boolean) => {
    if (!file) return setMessage('Chọn tệp CSV trước khi nhập.');
    if (!dryRun && (!preview || preview.rejected > 0)) {
      return setMessage('Chỉ được ghi dữ liệu sau khi dry-run hoàn tất và không còn dòng bị từ chối.');
    }
    const form = new FormData();
    form.append('file', file);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/data-exchange/${entity}?dryRun=${dryRun}`, { method: 'POST', body: form });
      const body = await response.json();
      if (!response.ok && !body.totalRows) throw new Error(body.error || `HTTP ${response.status}`);
      setPreview(body as ImportResult);
      setMessage(dryRun ? 'Đã kiểm tra tệp. Chưa có dữ liệu nào được ghi.' : 'Đã hoàn tất nhập dữ liệu.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Nhập dữ liệu thất bại.');
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-3xl font-black">Trao đổi dữ liệu vận hành</h1><p className="text-sm text-slate-600">Nhập và xuất DNF/Hazard có kiểm tra thử, báo lỗi theo dòng và kiểm soát quyền.</p></div>
          <Button asChild variant="outline"><Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Quản trị</Link></Button>
        </div>

        {message && <div className="rounded-xl border bg-white p-3 text-sm">{message}</div>}

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card><CardHeader><CardTitle>1. Chọn loại dữ liệu</CardTitle><CardDescription>Thao tác hàng loạt yêu cầu quyền admin:system.</CardDescription></CardHeader><CardContent className="space-y-4">
            <div><Label>Đối tượng</Label><select className="mt-2 h-10 w-full rounded-md border bg-white px-3" value={entity} onChange={event => { setEntity(event.target.value as Entity); setPreview(null); }}><option value="dnf">DNF – Báo cáo sự cố</option><option value="hazard">Hazard – Mối nguy</option></select></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline"><a href={`/api/data-exchange/${entity}?format=csv`}><Download className="mr-2 h-4 w-4" />Xuất CSV</a></Button>
              <Button asChild variant="outline"><a href={`/api/data-exchange/${entity}?format=json`}><FileJson className="mr-2 h-4 w-4" />Xuất JSON</a></Button>
            </div>
            <div><Label>Tệp CSV cần nhập</Label><Input className="mt-2" type="file" accept=".csv,text/csv" onChange={event => { setFile(event.target.files?.[0] ?? null); setPreview(null); }} /></div>
            <div className="grid gap-2 sm:grid-cols-2"><Button onClick={() => void submit(true)} disabled={busy || !file}><CheckCircle2 className="mr-2 h-4 w-4" />Dry-run</Button><Button variant="destructive" onClick={() => void submit(false)} disabled={busy || !preview || preview.rejected > 0}><Upload className="mr-2 h-4 w-4" />Ghi dữ liệu</Button></div>
            <p className="text-xs text-slate-500">Dry-run luôn là bước bắt buộc. Nếu có dòng lỗi, nút ghi dữ liệu sẽ bị khóa.</p>
          </CardContent></Card>

          <Card><CardHeader><CardTitle>2. Kết quả kiểm tra</CardTitle><CardDescription>CSV tối đa 5.000 dòng và 10MB mỗi lần nhập.</CardDescription></CardHeader><CardContent className="space-y-4">
            {!preview && <div className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-500">Chưa có kết quả dry-run.</div>}
            {preview && <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                {[['Tổng', preview.totalRows], ['Hợp lệ', preview.validRows], ['Tạo mới', preview.created], ['Cập nhật', preview.updated], ['Từ chối', preview.rejected]].map(([label, count]) => <div key={String(label)} className="rounded-xl border p-3"><div className="text-xs text-slate-500">{label}</div><div className="text-2xl font-bold">{count}</div></div>)}
              </div>
              <div className="flex items-center gap-2"><Badge variant="outline">{preview.dryRun ? 'DRY-RUN' : 'APPLIED'}</Badge>{preview.rejected === 0 ? <span className="flex items-center gap-1 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4" />Có thể ghi dữ liệu</span> : <span className="flex items-center gap-1 text-sm text-red-700"><AlertTriangle className="h-4 w-4" />Cần sửa tệp</span>}</div>
              <div className="max-h-[420px] overflow-auto rounded-xl border">
                {preview.issues.length === 0 ? <div className="p-6 text-sm text-emerald-700">Không phát hiện lỗi dữ liệu.</div> : <table className="w-full text-left text-sm"><thead className="sticky top-0 bg-slate-100"><tr><th className="p-2">Dòng</th><th className="p-2">Trường</th><th className="p-2">Mã</th><th className="p-2">Nội dung</th></tr></thead><tbody>{preview.issues.map((issue, index) => <tr key={`${issue.row}-${issue.code}-${index}`} className="border-t"><td className="p-2">{issue.row}</td><td className="p-2">{issue.field ?? '—'}</td><td className="p-2 font-mono text-xs">{issue.code}</td><td className="p-2">{issue.message}</td></tr>)}</tbody></table>}
              </div>
            </>}
          </CardContent></Card>
        </section>
      </div>
    </main>
  );
}
