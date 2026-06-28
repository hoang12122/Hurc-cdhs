'use client';

import * as React from 'react';
import { BIM_MODEL_REGISTRY, GIS_INTEGRATION_LAYERS, SAMPLE_SPATIAL_FEATURES, SPATIAL_INTEGRATION_FLOW, projectGeoToCanvas } from '@/lib/spatial-integration/spatial-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Box, Database, Layers, Link2, MapPinned, Radar, Route, ShieldAlert } from 'lucide-react';

function featurePath(featureId: string) {
  const feature = SAMPLE_SPATIAL_FEATURES.find((item) => item.id === featureId);
  if (!feature) return '';
  return feature.coordinates.map((coordinate) => {
    const point = projectGeoToCanvas(coordinate);
    return `${point.x},${point.y}`;
  }).join(' ');
}

function getLayerBadge(layerType: string) {
  switch (layerType) {
    case 'station':
      return 'Ga';
    case 'alignment':
      return 'Tim tuyến';
    case 'risk_zone':
      return 'Vùng rủi ro';
    case 'asset':
      return 'Tài sản';
    default:
      return layerType;
  }
}

export function GisBimViewer() {
  const [activeLayer, setActiveLayer] = React.useState('all');
  const [activeModelId, setActiveModelId] = React.useState(BIM_MODEL_REGISTRY[0]?.id || '');
  const activeModel = BIM_MODEL_REGISTRY.find((model) => model.id === activeModelId) || BIM_MODEL_REGISTRY[0];

  const visibleFeatures = React.useMemo(() => {
    if (activeLayer === 'all') return SAMPLE_SPATIAL_FEATURES;
    return SAMPLE_SPATIAL_FEATURES.filter((feature) => feature.layerType === activeLayer);
  }, [activeLayer]);

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader className="border-b bg-white/90 dark:bg-slate-950/80">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-black">
                  <MapPinned className="h-5 w-5 text-emerald-600" />
                  GIS Operational Map
                </CardTitle>
                <CardDescription>
                  Lớp bản đồ GIS mẫu để kiểm chứng liên kết tuyến, ga, vùng rủi ro và tài sản.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {['all', 'alignment', 'station', 'risk_zone', 'asset'].map((layer) => (
                  <Button
                    key={layer}
                    size="sm"
                    variant={activeLayer === layer ? 'default' : 'outline'}
                    onClick={() => setActiveLayer(layer)}
                    className="h-8 rounded-full text-xs font-bold"
                  >
                    {layer === 'all' ? 'Tất cả' : getLayerBadge(layer)}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-slate-50 p-0 dark:bg-slate-950">
            <svg viewBox="0 0 100 100" className="min-h-[520px] w-full bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] dark:bg-slate-950" role="img" aria-label="Mô phỏng lớp GIS tích hợp">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#cbd5e1" strokeWidth="0.18" opacity="0.45" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              <path d="M8 85 C25 72, 37 66, 50 56 C63 46, 71 33, 90 14" fill="none" stroke="#bae6fd" strokeWidth="8" strokeLinecap="round" opacity="0.35" />
              <path d="M10 74 C23 67, 34 60, 49 52 C64 44, 75 28, 92 18" fill="none" stroke="#bbf7d0" strokeWidth="6" strokeLinecap="round" opacity="0.28" />

              {visibleFeatures.filter((feature) => feature.layerType === 'alignment').map((feature) => (
                <polyline key={feature.id} points={featurePath(feature.id)} fill="none" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              ))}

              {visibleFeatures.filter((feature) => feature.layerType === 'risk_zone').map((feature) => (
                <polygon key={feature.id} points={featurePath(feature.id)} fill="#f59e0b" opacity="0.24" stroke="#d97706" strokeWidth="0.55" />
              ))}

              {visibleFeatures.filter((feature) => feature.layerType === 'station').map((feature) => {
                const point = projectGeoToCanvas(feature.coordinates[0]);
                return (
                  <g key={feature.id}>
                    <circle cx={point.x} cy={point.y} r="2.2" fill="white" stroke="#0f172a" strokeWidth="0.55" />
                    <text x={point.x + 2.8} y={point.y - 2} fontSize="2.7" className="fill-slate-700 dark:fill-slate-100">
                      {feature.name}
                    </text>
                  </g>
                );
              })}

              <g transform="translate(5 5)">
                <rect width="36" height="14" rx="2" fill="white" opacity="0.9" />
                <text x="3" y="5" fontSize="2.8" className="fill-slate-700 font-bold">CRS: EPSG:4326</text>
                <text x="3" y="10" fontSize="2.3" className="fill-slate-500">Demo GIS overlay</text>
              </g>
            </svg>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Box className="h-5 w-5 text-indigo-600" />
              BIM Model Registry
            </CardTitle>
            <CardDescription>
              Quản lý mô hình IFC/glTF/glb/Revit/Point Cloud và liên kết từng phần tử BIM với Asset 360.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {BIM_MODEL_REGISTRY.map((model) => (
                <Button
                  key={model.id}
                  size="sm"
                  variant={activeModel.id === model.id ? 'default' : 'outline'}
                  onClick={() => setActiveModelId(model.id)}
                  className="rounded-full text-xs font-bold"
                >
                  {model.stationCode} · {model.modelType.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="rounded-2xl border bg-slate-950 p-5 text-white shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <Badge className="bg-indigo-500 text-white">{activeModel.modelType.toUpperCase()}</Badge>
                  <span className="text-xs text-slate-300">{activeModel.version}</span>
                </div>
                <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/25 via-sky-500/20 to-emerald-500/20">
                  <div className="relative h-32 w-40">
                    <div className="absolute inset-x-6 bottom-0 h-20 rounded-md border border-sky-300/70 bg-sky-400/10 shadow-lg shadow-sky-500/10" />
                    <div className="absolute left-12 top-3 h-24 w-28 skew-x-[-18deg] rounded-md border border-indigo-200/70 bg-indigo-400/10" />
                    <div className="absolute bottom-8 left-3 h-7 w-34 rounded-full border border-emerald-200/70 bg-emerald-400/10" />
                    <Radar className="absolute left-16 top-20 h-8 w-8 text-emerald-200" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-bold">{activeModel.name}</p>
                <p className="mt-1 text-xs text-slate-300">{activeModel.discipline}</p>
              </div>

              <div className="space-y-3">
                {activeModel.elements.map((element) => (
                  <div key={element.id} className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-slate-900 dark:text-white">{element.name}</div>
                        <div className="mt-1 truncate text-xs text-muted-foreground">{element.globalId}</div>
                      </div>
                      <Badge variant={element.status === 'mapped' ? 'default' : 'outline'}>{element.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>Loại: <span className="font-semibold text-slate-700 dark:text-slate-200">{element.elementType}</span></div>
                      <div>Ga: <span className="font-semibold text-slate-700 dark:text-slate-200">{element.stationCode || '-'}</span></div>
                      <div>Asset: <span className="font-semibold text-slate-700 dark:text-slate-200">{element.assetCode || 'Chưa gán'}</span></div>
                      <div>Bộ môn: <span className="font-semibold text-slate-700 dark:text-slate-200">{element.discipline}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <Database className="h-5 w-5 text-slate-600" />
              Lớp dữ liệu tích hợp
            </CardTitle>
            <CardDescription>Những lớp cần nhập vào để hình thành Spatial Digital Twin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {GIS_INTEGRATION_LAYERS.map((layer) => (
              <div key={layer.id} className="rounded-2xl border bg-white p-4 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold">{layer.name}</div>
                  <Badge variant="outline">{layer.sourceType.toUpperCase()}</Badge>
                </div>
                <div className="mt-2 text-xs leading-5 text-muted-foreground">{layer.note}</div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> {getLayerBadge(layer.layerType)} · {layer.crs}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <Link2 className="h-5 w-5 text-sky-600" />
              Luồng tích hợp GIS/BIM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {SPATIAL_INTEGRATION_FLOW.map((item, index) => (
              <div key={item.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-black text-white">{index + 1}</div>
                  {index < SPATIAL_INTEGRATION_FLOW.length - 1 && <div className="mt-1 h-10 w-px bg-slate-200 dark:bg-slate-800" />}
                </div>
                <div className="pb-3">
                  <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                  <div className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none bg-amber-50 shadow-sm dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-black text-amber-800 dark:text-amber-200">
              <ShieldAlert className="h-4 w-4" />
              Ghi chú nghiệm thu dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
            <p>Dữ liệu hiện tại là mẫu kiểm chứng kiến trúc. Khi triển khai thật cần import dữ liệu GIS/BIM đã được phê duyệt, có hệ tọa độ, phiên bản mô hình, người phê duyệt và trạng thái as-built.</p>
            <Separator className="bg-amber-200/70 dark:bg-amber-900" />
            <p>Không nên dùng dữ liệu demo này làm dữ liệu vận hành chính thức.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
