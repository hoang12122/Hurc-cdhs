import { GisBimViewer } from './_components/gis-bim-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Database, MapPinned, Network } from 'lucide-react';
import { BIM_MODEL_REGISTRY, GIS_INTEGRATION_LAYERS, SAMPLE_SPATIAL_FEATURES } from '@/lib/spatial-integration/spatial-data';

export default function SpatialTwinPage() {
  const mappedElements = BIM_MODEL_REGISTRY.flatMap((model) => model.elements).filter((element) => element.status === 'mapped').length;

  return (
    <div className="min-h-full bg-slate-50/60 p-6 dark:bg-slate-950 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit gap-2 rounded-full bg-white px-3 py-1 font-bold dark:bg-slate-950">
            <Network className="h-3.5 w-3.5 text-emerald-600" />
            GIS / BIM Integration
          </Badge>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Spatial Digital Twin</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Lớp tích hợp GIS/BIM giúp liên kết tuyến, nhà ga, tài sản, mô hình không gian, DNF, Hazard và dữ liệu telemetry vào cùng một bối cảnh vận hành.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-[430px]">
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <MapPinned className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{GIS_INTEGRATION_LAYERS.length}</div>
                <div className="text-xs text-muted-foreground">GIS Layers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Box className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{BIM_MODEL_REGISTRY.length}</div>
                <div className="text-xs text-muted-foreground">BIM Models</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{SAMPLE_SPATIAL_FEATURES.length}/{mappedElements}</div>
                <div className="text-xs text-muted-foreground">GIS/BIM link</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GisBimViewer />
    </div>
  );
}
