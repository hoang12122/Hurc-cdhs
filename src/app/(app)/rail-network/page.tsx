import { MetroLineMap } from './_components/metro-line-map';
import { RAIL_NETWORK_SUMMARY } from '@/lib/rail-network/rail-network-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Route, ShieldCheck, TrainFront } from 'lucide-react';

export default function RailNetworkPage() {
  return (
    <div className="min-h-full bg-slate-50/60 p-6 dark:bg-slate-950 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <Badge variant="outline" className="w-fit gap-2 rounded-full bg-white px-3 py-1 font-bold dark:bg-slate-950">
            <TrainFront className="h-3.5 w-3.5 text-sky-600" />
            Metro Network Model
          </Badge>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Mạng tuyến đường sắt đô thị</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Sơ đồ hóa các tuyến M1-M6, vị trí nhà ga, ga trung chuyển và định hướng liên kết với cơ sở dữ liệu tài sản, Digital Twin, DNF, Hazard và phân công trách nhiệm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:min-w-[430px]">
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{RAIL_NETWORK_SUMMARY.lines}</div>
                <div className="text-xs text-muted-foreground">Tuyến</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Map className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{RAIL_NETWORK_SUMMARY.stations}</div>
                <div className="text-xs text-muted-foreground">Ga/Nút</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black">{RAIL_NETWORK_SUMMARY.interchanges}</div>
                <div className="text-xs text-muted-foreground">Trung chuyển</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MetroLineMap />
    </div>
  );
}
