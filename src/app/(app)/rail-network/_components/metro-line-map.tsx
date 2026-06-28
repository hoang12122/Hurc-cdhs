'use client';

import * as React from 'react';
import { HCMC_METRO_LINES, LINE_STATUS_LABELS, getUniqueStations, type RailLineModel, type RailStationNode } from '@/lib/rail-network/rail-network-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Info, MapPin, Network, TrainFront, Waypoints } from 'lucide-react';

function buildPolyline(stations: RailStationNode[]) {
  return stations.map((station) => `${station.x},${station.y}`).join(' ');
}

function getStationRadius(station: RailStationNode) {
  if (station.type === 'interchange') return 1.55;
  if (station.type === 'terminal') return 1.35;
  return 0.95;
}

function StationNode({ station, active }: { station: RailStationNode; active: boolean }) {
  return (
    <g className={cn('transition-opacity duration-300', active ? 'opacity-100' : 'opacity-45')}>
      <circle
        cx={station.x}
        cy={station.y}
        r={getStationRadius(station)}
        fill="white"
        stroke={station.type === 'interchange' ? '#0f172a' : '#94a3b8'}
        strokeWidth={station.type === 'interchange' ? 0.55 : 0.35}
      />
      {station.type === 'interchange' && (
        <circle
          cx={station.x}
          cy={station.y}
          r={2.1}
          fill="none"
          stroke="#0f172a"
          strokeWidth={0.28}
          opacity={0.7}
        />
      )}
    </g>
  );
}

function StationLabel({ station, selectedLineCode }: { station: RailStationNode; selectedLineCode: string }) {
  const shouldShow = station.type === 'interchange' || station.type === 'terminal' || station.lineIds.includes(selectedLineCode);
  if (!shouldShow) return null;

  const dx = station.x > 80 ? -1.5 : 1.5;
  const anchor = station.x > 80 ? 'end' : 'start';

  return (
    <text
      x={station.x + dx}
      y={station.y - 1.5}
      fontSize="2.25"
      textAnchor={anchor}
      className="select-none fill-slate-700 dark:fill-slate-200"
    >
      {station.name}
    </text>
  );
}

export function MetroLineMap() {
  const [selectedLineId, setSelectedLineId] = React.useState(HCMC_METRO_LINES[0]?.id || 'm1');
  const selectedLine = React.useMemo(
    () => HCMC_METRO_LINES.find((line) => line.id === selectedLineId) || HCMC_METRO_LINES[0],
    [selectedLineId],
  );
  const stations = React.useMemo(() => getUniqueStations(), []);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
        <CardHeader className="border-b bg-white/90 dark:bg-slate-950/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl font-black">
                <Network className="h-5 w-5 text-sky-600" />
                Mô hình tuyến đường sắt đô thị
              </CardTitle>
              <CardDescription>
                Các nút tròn màu trắng thể hiện vị trí nhà ga; nút viền đen là ga trung chuyển/điểm giao tuyến.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {HCMC_METRO_LINES.map((line) => (
                <Button
                  key={line.id}
                  type="button"
                  variant={selectedLineId === line.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLineId(line.id)}
                  className={cn('h-8 rounded-full px-3 text-xs font-bold', selectedLineId === line.id && 'text-white')}
                  style={selectedLineId === line.id ? { backgroundColor: line.color, borderColor: line.color } : { borderColor: line.color, color: line.color }}
                >
                  {line.code}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-50 p-0 dark:bg-slate-950">
          <div className="relative w-full overflow-auto">
            <svg
              viewBox="0 0 100 104"
              role="img"
              aria-label="Sơ đồ tuyến đường sắt đô thị Thành phố Hồ Chí Minh"
              className="min-h-[640px] w-full min-w-[980px] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.98))] dark:bg-slate-950"
            >
              <defs>
                <filter id="stationShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0.8" stdDeviation="0.8" floodColor="#0f172a" floodOpacity="0.18" />
                </filter>
              </defs>

              <path d="M70 12 C82 18, 74 32, 86 38 C96 44, 90 57, 80 61 C68 66, 77 79, 86 90" fill="none" stroke="#7dd3fc" strokeWidth="3.5" opacity="0.42" strokeLinecap="round" />
              <path d="M54 1 C56 15, 63 24, 62 36 C61 48, 68 54, 64 67 C60 79, 62 92, 72 100" fill="none" stroke="#7dd3fc" strokeWidth="3.5" opacity="0.36" strokeLinecap="round" />

              {HCMC_METRO_LINES.map((line) => {
                const isActive = line.id === selectedLine.id;
                return (
                  <g key={line.id} className="transition-opacity duration-300" opacity={isActive ? 1 : 0.28}>
                    <polyline
                      points={buildPolyline(line.stations)}
                      fill="none"
                      stroke={line.color}
                      strokeWidth={isActive ? 1.85 : 1.25}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

              <g filter="url(#stationShadow)">
                {stations.map((station) => (
                  <StationNode
                    key={station.id}
                    station={station}
                    active={station.lineIds.includes(selectedLine.code) || station.type === 'interchange'}
                  />
                ))}
              </g>

              <g>
                {stations.map((station) => (
                  <StationLabel key={`${station.id}-label`} station={station} selectedLineCode={selectedLine.code} />
                ))}
              </g>

              {HCMC_METRO_LINES.map((line) => {
                const first = line.stations[0];
                const last = line.stations[line.stations.length - 1];
                const active = line.id === selectedLine.id;
                return (
                  <g key={`${line.id}-terminal-labels`} opacity={active ? 1 : 0.45}>
                    {[first, last].map((station) => (
                      <g key={`${line.id}-${station.id}`}>
                        <rect
                          x={station.x - 3.2}
                          y={station.y - 5.2}
                          width="6.4"
                          height="3.2"
                          rx="0.7"
                          fill={line.color}
                        />
                        <text x={station.x} y={station.y - 3} textAnchor="middle" fontSize="2.1" className="fill-white font-bold">
                          {line.code}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                  <TrainFront className={cn('h-5 w-5', selectedLine.textClassName)} />
                  {selectedLine.code} · {selectedLine.name}
                </CardTitle>
                <CardDescription>{selectedLine.terminalA} → {selectedLine.terminalB}</CardDescription>
              </div>
              <Badge className="text-white" style={{ backgroundColor: selectedLine.color }}>
                {LINE_STATUS_LABELS[selectedLine.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">{selectedLine.description}</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
                <div className="text-2xl font-black">{HCMC_METRO_LINES.length}</div>
                <div className="text-xs text-muted-foreground">Tuyến</div>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
                <div className="text-2xl font-black">{stations.length}</div>
                <div className="text-xs text-muted-foreground">Ga/Nút</div>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-900">
                <div className="text-2xl font-black">{stations.filter((station) => station.type === 'interchange').length}</div>
                <div className="text-xs text-muted-foreground">Trung chuyển</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/70 dark:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <Waypoints className="h-4 w-4 text-slate-600" />
              Danh sách nhà ga tuyến {selectedLine.code}
            </CardTitle>
            <CardDescription>Thứ tự hiển thị theo chiều từ ga đầu đến ga cuối.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
              {selectedLine.stations.map((station, index) => (
                <div key={`${selectedLine.id}-${station.id}-${index}`} className="flex items-center gap-3 rounded-xl border bg-white p-3 text-sm dark:bg-slate-950">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white" style={{ backgroundColor: selectedLine.color }}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-slate-800 dark:text-slate-100">{station.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{station.code}</div>
                  </div>
                  {station.type === 'interchange' && <Badge variant="outline">Trung chuyển</Badge>}
                  {station.type === 'terminal' && <Badge variant="secondary">Ga đầu/cuối</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-amber-50 shadow-sm dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-black text-amber-800 dark:text-amber-200">
              <Info className="h-4 w-4" />
              Ghi chú triển khai
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-amber-900/90 dark:text-amber-100/90">
            <p>Các nút trắng trên sơ đồ được chuẩn hóa là vị trí nhà ga. Dữ liệu hiện được đặt ở lớp cấu hình để hiển thị nhanh, đồng thời schema database đã bổ sung bảng tuyến, ga và phân công trách nhiệm.</p>
            <Separator className="bg-amber-200/70 dark:bg-amber-900" />
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Khi có tọa độ GIS/BIM chính thức, chỉ cần thay tọa độ `mapX/mapY` để bản đồ chuyển sang dữ liệu thật.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
