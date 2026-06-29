import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, ExternalLink, FlaskConical, GitBranch, MapPinned } from 'lucide-react';

const TEST_LINKS = [
  { href: '/rail-network', label: 'Mạng tuyến', icon: GitBranch },
  { href: '/spatial-twin', label: 'GIS/BIM', icon: MapPinned },
  { href: '/spatial-twin/import', label: 'Import Center', icon: FlaskConical },
];

export function AcceptanceRibbon() {
  return (
    <div className="border-b bg-gradient-to-r from-sky-50 via-white to-amber-50 px-4 py-2 dark:from-slate-950 dark:via-slate-950 dark:to-amber-950/20 md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline" className="gap-1.5 rounded-full border-sky-200 bg-white text-sky-700 dark:border-sky-900 dark:bg-slate-950 dark:text-sky-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Server test build
          </Badge>
          <span className="text-muted-foreground">
            Bản đang kiểm thử: dữ liệu GIS/BIM/Google Maps có phần demo, chưa dùng làm dữ liệu vận hành chính thức.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 rounded-full border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Chỉ nghiệm thu khi CI/Docker pass
          </Badge>
          {TEST_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Button key={item.href} asChild size="sm" variant="outline" className="h-8 rounded-full bg-white/80 text-xs dark:bg-slate-950">
                <Link href={item.href}>
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  {item.label}
                  <ExternalLink className="ml-1.5 h-3 w-3 opacity-60" />
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
