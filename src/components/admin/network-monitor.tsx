"use client";

import * as React from "react";
import { 
  Activity, RadioTower, Server, Shield, Share2, 
  Cpu, HardDrive, Zap, Info, AlertTriangle, CheckCircle2,
  XCircle, ChevronRight, Search, Terminal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getNetworkDiscoveryStats } from "@/lib/actions/system.actions";
import { useLanguage } from "@/contexts/language-context";

interface NetworkNode {
  id: string;
  name: string;
  ip: string;
  status: 'up' | 'down' | 'warning';
  latency: string;
  type: string;
  lastSeen: string;
  cpuUsage: number;
  bandwidth: string;
  uptime: string;
}

export function NetworkMonitor() {
  const { locale } = useLanguage();
  const [nodes, setNodes] = React.useState<NetworkNode[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [logStream, setLogStream] = React.useState<string[]>([]);

  const fetchStats = React.useCallback(async () => {
    try {
      const data = await getNetworkDiscoveryStats();
      setNodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
        fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const filteredNodes = nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()) || n.ip.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Health Grid - Cacti Style */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RadioTower className="h-5 w-5 text-primary" />
              {locale === 'vi' ? 'Sức khỏe Thiết bị (Cacti Mode)' : 'Device Health (Cacti Mode)'}
            </h3>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={locale === 'vi' ? 'Tìm thiết bị...' : 'Find device...'} 
                className="pl-8 h-8 text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNodes.map(node => (
              <Card key={node.id} className={cn(
                "border-l-4 transition-all hover:shadow-md",
                node.status === 'up' ? "border-l-green-500" : node.status === 'warning' ? "border-l-yellow-500" : "border-l-red-500"
              )}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-sm">{node.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{node.ip}</div>
                    </div>
                    <Badge variant={node.status === 'up' ? 'default' : node.status === 'warning' ? 'secondary' : 'destructive'} className="text-[10px] uppercase">
                      {node.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground flex items-center gap-1"><Cpu className="h-3 w-3"/> CPU</span>
                      <span className="font-medium">{node.cpuUsage}%</span>
                    </div>
                    <Progress value={node.cpuUsage} className="h-1" />
                    
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-border/50">
                        <div className="text-[9px]">
                            <div className="text-muted-foreground uppercase">{locale === 'vi' ? 'Băng thông' : 'Bandwidth'}</div>
                            <div className="font-semibold text-primary">{node.bandwidth}</div>
                        </div>
                        <div className="text-[9px] text-right">
                            <div className="text-muted-foreground uppercase">{locale === 'vi' ? 'Độ trễ' : 'Latency'}</div>
                            <div className="font-semibold">{node.latency}</div>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Log Stream - Real Grafana Loki Integration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            {locale === 'vi' ? 'Hệ thống Grafana Loki (Real-time)' : 'Grafana Loki System (Real-time)'}
          </h3>
          <div className="bg-black/95 rounded-xl overflow-hidden h-[400px] border border-primary/20 shadow-2xl relative">
            <iframe 
                src="http://localhost:3001/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Bapp%3D%5C%22hurc-crm%5C%22%7D%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D" 
                className="w-full h-full border-none"
                title="Loki Explorer"
            />
            {/* Overlay nếu chưa đăng nhập */}
            <div className="absolute bottom-2 right-2 flex gap-2">
                <Button variant="outline" size="sm" className="text-[9px] h-5 bg-black/50 text-white border-white/20" asChild>
                    <a href="http://localhost:3001" target="_blank" rel="noreferrer noopener">Open Full Grafana</a>
                </Button>
                <Button variant="outline" size="sm" className="text-[9px] h-5 bg-black/50 text-white border-white/20" asChild>
                    <a href="http://localhost:8080" target="_blank" rel="noreferrer noopener">Open Cacti</a>
                </Button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            {locale === 'vi' ? '* Yêu cầu chạy `docker-compose up -d` để kích hoạt hạ tầng giám sát thực tế.' : '* Requires `docker-compose up -d` to activate real monitoring infrastructure.'}
          </p>
        </div>
      </div>
    </div>
  );
}
