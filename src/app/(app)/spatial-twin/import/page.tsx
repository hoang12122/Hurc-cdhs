import Link from 'next/link';
import { BIM_MODEL_REGISTRY, GIS_INTEGRATION_LAYERS, SAMPLE_SPATIAL_FEATURES } from '@/lib/spatial-integration/spatial-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle2, Database, FileJson, Layers, UploadCloud } from 'lucide-react';

const IMPORT_STEPS = [
  'Chọn loại dữ liệu GIS hoặc BIM',
  'Upload file hoặc khai báo URL nguồn dữ liệu',
  'Chọn tuyến, ga và hệ thống liên quan',
  'Preview dữ liệu trước khi import',
  'Map trường dữ liệu stationCode, assetCode, globalId',
  'Validate lỗi trùng mã, sai tọa độ, thiếu mã ga/tài sản',
  'Import chính thức vào database',
  'Kiểm tra kết quả trên Spatial Twin, Rail Network và Asset 360',
];

const VALIDATION_RULES = [
  'GeoJSON phải có type = FeatureCollection và features không rỗng.',
  'Mỗi GIS Feature phải có geometry.type, geometry.coordinates và properties.',
  'BIM metadata phải có model.name, model.modelType và elements.',
  'Mỗi BIM element phải có globalId, assetCode hoặc name để nhận diện.',
  'Khi import chính thức phải có METRO_DATABASE_URL và schema đã migration.',
  'File BIM nặng chỉ lưu ở storage/CDE; database chỉ lưu metadata và chỉ mục phần tử.',
];

export default function GisBimImportCenterPage() {
  const mappedBimElements = BIM_MODEL_REGISTRY.flatMap((model) => model.elements).filter((element) => element.status === 'mapped');

  return (
    <div className="min-h-full bg-slate-50/60 p-6 dark:bg-slate-950 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-3">
          <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-0 font-bold text-muted-foreground hover:bg-transparent">
            <Link href="/spatial-twin">
              <ArrowLeft className="h-4 w-4" /> Quay lại Spatial Twin
            </Link>
          </Button>
          <div>
            <Badge variant="outline" className="mb-3 w-fit gap-2 rounded-full bg-white px-3 py-1 font-bold dark:bg-slate-950">
              <UploadCloud className="h-3.5 w-3.5 text-sky-600" /> GIS/BIM Import Center
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Trung tâm import dữ liệu GIS/BIM</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Màn hình kiểm chứng luồng import theo 02 giai đoạn: chạy script/dry-run để kiểm tra dữ liệu, sau đó mới import chính thức vào database và liên kết với Asset 360.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <FileJson className="h-5 w-5 text-emerald-600" />
                Dữ liệu mẫu đang dùng để dry-run
              </CardTitle>
              <CardDescription>
                CI sẽ đọc các file mẫu này để kiểm tra cấu trúc GeoJSON/BIM metadata trước khi build.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
                <div className="flex items-center gap-2 font-bold"><Layers className="h-4 w-4 text-emerald-600" /> GIS Layers</div>
                <div className="mt-3 text-3xl font-black">{GIS_INTEGRATION_LAYERS.length}</div>
                <div className="text-xs text-muted-foreground">Đã khai báo</div>
              </div>
              <div className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
                <div className="flex items-center gap-2 font-bold"><Database className="h-4 w-4 text-sky-600" /> GIS Features</div>
                <div className="mt-3 text-3xl font-black">{SAMPLE_SPATIAL_FEATURES.length}</div>
                <div className="text-xs text-muted-foreground">Feature mẫu</div>
              </div>
              <div className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
                <div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4 text-indigo-600" /> BIM mapped</div>
                <div className="mt-3 text-3xl font-black">{mappedBimElements.length}</div>
                <div className="text-xs text-muted-foreground">Element đã liên kết</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xl font-black">Luồng import chính thức</CardTitle>
              <CardDescription>Áp dụng cho file GeoJSON, BIM metadata và các nguồn dữ liệu GIS/BIM sau này.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {IMPORT_STEPS.map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-black text-white">{index + 1}</div>
                      {index < IMPORT_STEPS.length - 1 && <div className="mt-1 h-8 w-px bg-slate-200 dark:bg-slate-800" />}
                    </div>
                    <div className="pt-1 text-sm font-medium text-slate-800 dark:text-slate-100">{step}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-black">Lệnh import khuyến nghị</CardTitle>
              <CardDescription>Chạy dry-run trước, chỉ commit khi dữ liệu đã được kiểm tra.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Dry-run trong CI/local</div>
                <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">npm run import:gis-bim:dry-run</pre>
              </div>
              <div>
                <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">Import chính thức sau migration</div>
                <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">npm run import:gis-bim:commit</pre>
              </div>
              <div>
                <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">File mẫu</div>
                <pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">data/import/gis/stations-m1.geojson{`\n`}data/import/bim/ben-thanh-bim-index.json</pre>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-amber-50 shadow-sm dark:bg-amber-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-black text-amber-800 dark:text-amber-200">Quy tắc validate bắt buộc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
              {VALIDATION_RULES.map((rule) => (
                <div key={rule} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />
                  <span>{rule}</span>
                </div>
              ))}
              <Separator className="bg-amber-200/70 dark:bg-amber-900" />
              <p>Không import dữ liệu demo vào môi trường vận hành chính thức. Dữ liệu vận hành phải có nguồn gốc, phiên bản, người phê duyệt và trạng thái as-built.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
