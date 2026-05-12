
"use client"; 

import * as React from "react"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
    ArrowLeft, ClipboardList, AlertTriangle, CheckCircle2, Clock, PlusCircle, 
    BarChart3, PieChart as PieChartIcon, Users, ListChecks, FileWarning, Lightbulb, ArrowRight,
    ListTodo, ShieldAlert, History, TrendingUp, Eye, Sparkles, Printer, Zap, Trophy, Activity, ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { 
    type DnfDocument, type SystemLog, type PatrolLocation
} from "@/lib/constants";
import { getDnfRecords } from "@/lib/actions/dnf.actions";
import { getInspections } from "@/lib/actions/inspection.actions";
import { getLocations } from "@/lib/actions/category.actions";
import { getHazardRecords } from "@/lib/actions/hazard.actions";
import { runSystemScheduler } from "@/lib/actions/system.actions";
import { getExecutiveSummary, generateStrategicExecutiveSummary } from "@/lib/actions/ai.actions";
import { getSystemHealthOverview } from "@/lib/actions/analytics.actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip as CustomChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


const translations = {
  vi: {
    title: 'Bảng điều khiển - HURC No.1 CDHS',
    welcomeTitle: "Chào mừng đến HURC No.1 CDHS",
    welcomeDescription: "Nền tảng quản lý sự cố và kiểm tra toàn diện cho hệ thống metro. Khẳng định mô hình Bảo trì Khắc phục (Reactive Maintenance) kết hợp cùng Bảo trì Dự đoán (Predictive Maintenance).",
    newIncidentButton: "Tạo Sự cố Mới",
    summaryStats: {
      pendingIncidents: "Sự cố đang xử lý",
      criticalIncidents: "Sự cố nghiêm trọng",
      completedThisMonth: "Hoàn thành (Tháng này)",
      totalInspections: "Tổng số Kiểm tra",
    },
    chartsTitle: "Thống kê Nhanh",
    incidentsByStatusChart: "Sự cố theo Trạng thái",
    incidentsByPriorityChart: "Sự cố theo Mức độ ưu tiên",
    recentIncidentsTitle: "Sự cố Gần đây",
    recentIncidentsDescription: "Các vấn đề mới nhất được ghi nhận cần chú ý.",
    viewAllIncidents: "Xem tất cả Sự cố",
    idHeader: "ID",
    descHeader: "Mô tả",
    locationHeader: "Vị trí",
    statusHeader: "Trạng thái",
    noIncidents: "Không có sự cố nào gần đây.",
    viewDetails: "Xem chi tiết",
    chartIncidentsLabel: "Sự cố",
    executiveTitle: "Thông tin Chiến lược (CEO/CTO)",
    healthIndex: "Chỉ số Sức khỏe Hệ thống",
    healthIndexDesc: "Được tính dựa trên các sự cố nghiêm trọng đang mở.",
    aiSummaryTitle: "Nhận định Chiến lược (AI)",
    aiSummaryLoading: "Đang phân tích dữ liệu chiến lược...",
    aiSummaryRegen: "Tạo lại báo cáo",
    safetyForecastTitle: "Dự báo An toàn AI (YOLO)",
    safetyForecastDesc: "Dự báo dựa trên dữ liệu thị giác máy tính.",
    noSafetyAudit: "Chưa có dữ liệu Audit an toàn.",
    reliabilityTitle: "Độ tin cậy & Hiệu suất Kỹ thuật",
    reliabilityDesc: "Phân tích MTBF/MTTR và sức khỏe các hệ thống con.",
    mtbfLabel: "MTBF Hệ thống (Avg)",
    mttrLabel: "MTTR Trung bình",
    subsystemHealthTitle: "Hiệu suất Hệ thống con",
    riskAssetsTitle: "Thiết bị rủi ro",
    strategicReportBtn: "Tổng hợp Báo cáo Chiến lược",
    strategicReportTitle: "BÁO CÁO CHIẾN LƯỢC QUẢN TRỊ (AI GENERATED)",
    strategicReportLoading: "Đang tổng hợp dữ liệu toàn hệ thống...",
  },
  en: {
    title: 'Dashboard - HURC No.1 CDHS',
    welcomeTitle: "Welcome to HURC No.1 CDHS",
    welcomeDescription: "Comprehensive incident management and inspection platform for metro systems.",
    newIncidentButton: "Create New Incident",
    summaryStats: {
      pendingIncidents: "Pending Incidents",
      criticalIncidents: "Critical Incidents",
      completedThisMonth: "Completed (This Month)",
      totalInspections: "Total Inspections",
    },
    chartsTitle: "Quick Stats",
    incidentsByStatusChart: "Incidents by Status",
    incidentsByPriorityChart: "Incidents by Priority",
    recentIncidentsTitle: "Recent Incidents",
    recentIncidentsDescription: "The latest logged issues requiring attention.",
    viewAllIncidents: "View All Incidents",
    idHeader: "ID",
    descHeader: "Description",
    locationHeader: "Location",
    statusHeader: "Status",
    noIncidents: "No recent incidents found.",
    viewDetails: "View Details",
    chartIncidentsLabel: "Incidents",
    executiveTitle: "Strategic Overview (CEO/CTO)",
    healthIndex: "System Health Index",
    healthIndexDesc: "Based on unresolved critical incidents.",
    aiSummaryTitle: "Strategic Insights (AI Assistant)",
    aiSummaryLoading: "Analyzing strategic data...",
    aiSummaryRegen: "Regenerate Report",
    safetyForecastTitle: "AI Safety Forecasting (YOLO)",
    safetyForecastDesc: "Infrastructure-wide safety predictions.",
    noSafetyAudit: "No AI safety audit data found.",
    strategicReportBtn: "Strategic Executive Summary",
    strategicReportTitle: "STRATEGIC GOVERNANCE REPORT (AI GENERATED)",
    strategicReportLoading: "Compiling system-wide strategic data...",
  },
};

const getDnfStatusBadgeVariant = (status: DnfDocument['status']): "default" | "secondary" | "destructive" | "outline" | "accent" => {
  switch (status) {
    case "Mới": return "outline";
    case "Đánh giá": return "secondary";
    case "Xử lý": return "default";
    case "Phản hồi": return "accent";
    case "Đóng": return "default";
    case "Hủy": return "destructive";
    default: return "outline";
  }
}

const statusColors: Record<string, string> = {
  "Mới": "hsl(var(--chart-4))",
  "Đánh giá": "hsl(var(--chart-1))",
  "Xử lý": "hsl(var(--chart-6))",
  "Phản hồi": "hsl(var(--chart-5))",
  "Đóng": "hsl(var(--chart-3))",
  "Hủy": "hsl(var(--muted-foreground))",
};

const priorityColors: Record<string, string> = {
  "Cao": "hsl(var(--chart-5))",
  "Trung bình": "hsl(var(--chart-4))",
  "Thấp": "hsl(var(--chart-1))",
  "Không ưu tiên": "hsl(var(--muted-foreground))",
};

export default function DashboardPage() {
  const { locale } = useLanguage();
  const t = translations[locale];
  
  const [incidents, setIncidents] = React.useState<DnfDocument[]>([]);
  const [inspections, setInspections] = React.useState<any[]>([]);
  const [hazards, setHazards] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<PatrolLocation[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);
  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = React.useState(false);
  const [reliabilityStats, setReliabilityStats] = React.useState<any[]>([]);
  const [strategicReport, setStrategicReport] = React.useState<string | null>(null);
  const [isGeneratingStrategic, setIsGeneratingStrategic] = React.useState(false);
  const [showStrategicDialog, setShowStrategicDialog] = React.useState(false);

  React.useEffect(() => {
    // This simulates a cron job that runs when a user visits the dashboard.
    // In a real production app, this would be a separate, scheduled server process.
    runSystemScheduler().catch(err => {
        // Silently ignore unauthorized errors from the scheduler as it's just a background task
        console.debug("Background scheduler task skipped: ", err.message);
    });
  }, []);

  const fetchData = React.useCallback(async () => {
    const [incidentData, inspectionData, locationData, hazardData, reliabilityData] = await Promise.all([
      getDnfRecords(),
      getInspections(),
      getLocations(),
      getHazardRecords(),
      getSystemHealthOverview(),
    ]);
    setIncidents(incidentData || []);
    setInspections(inspectionData || []);
    setLocations(locationData || []);
    setHazards(hazardData || []);
    setReliabilityStats(reliabilityData || []);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    document.title = t.title;
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => {
      window.removeEventListener('focus', fetchData);
    };
  }, [t.title, locale, fetchData]);

  const fetchAiSummary = React.useCallback(async () => {
    if (incidents.length === 0 && hazards.length === 0) return;
    setIsLoadingAi(true);
    try {
        const summary = await getExecutiveSummary(incidents, hazards);
        setAiSummary(summary);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingAi(false);
    }
  }, [incidents, hazards]);

  React.useEffect(() => {
     if (isMounted && incidents.length > 0 && !aiSummary) {
         fetchAiSummary();
     }
  }, [isMounted, incidents, aiSummary, fetchAiSummary]);

  const handleGenerateStrategicReport = async () => {
    setIsGeneratingStrategic(true);
    setShowStrategicDialog(true);
    try {
        const report = await generateStrategicExecutiveSummary();
        setStrategicReport(report);
    } catch (error) {
        console.error("Failed to generate strategic report:", error);
    } finally {
        setIsGeneratingStrategic(false);
    }
  };

  const healthIndex = React.useMemo(() => {
    if (!incidents.length) return 100;
    const criticalOpen = incidents.filter(d => d.priority === 'Cao' && !['Đóng', 'Hủy'].includes(d.status)).length;
    const totalOpen = incidents.filter(d => !['Đóng', 'Hủy'].includes(d.status)).length;
    if (totalOpen === 0) return 100;
    // Health drops 10% for each critical open incident, down to 20% min
    return Math.max(20, 100 - (criticalOpen * 15));
  }, [incidents]);

  const summaryStatsData = React.useMemo(() => {
    if (!incidents || !inspections) return [];
    
    const pendingIncidents = incidents.filter(d => !['Đóng', 'Hủy'].includes(d.status)).length;
    const criticalIncidents = incidents.filter(d => d.priority === 'Cao' && !['Đóng', 'Hủy'].includes(d.status)).length;
    
    const now = new Date();
    const completedThisMonth = incidents.filter(d => {
      if (d.status !== 'Đóng' || !d.completedDate) return false;
      const completedDate = new Date(d.completedDate);
      return completedDate.getMonth() === now.getMonth() && completedDate.getFullYear() === now.getFullYear();
    }).length;
    
    return [
      { title: t.summaryStats.pendingIncidents, value: pendingIncidents.toString(), icon: Clock, color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-500/10" },
      { title: t.summaryStats.criticalIncidents, value: criticalIncidents.toString(), icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
      { title: t.summaryStats.completedThisMonth, value: completedThisMonth.toString(), icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-500/10" },
      { title: t.summaryStats.totalInspections, value: inspections.length.toString(), icon: ClipboardList, color: "text-primary", bgColor: "bg-primary/10" },
    ];
  }, [incidents, inspections, t]);

  const getLocationLabel = React.useCallback((locationId: string) => {
    return locations.find(l => l.id === locationId)?.label || locationId;
  }, [locations]);


  const incidentStatusData = React.useMemo(() => {
    if (!incidents) return [];
    const counts = incidents.reduce((acc, incident) => {
      const statusLabel = incident.status || (locale === 'vi' ? 'Không rõ' : 'Unknown');
      acc[statusLabel] = (acc[statusLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count: count,
      fill: statusColors[status] || "hsl(var(--muted))"
    }));
  }, [incidents, locale]);

  const statusChartConfig = {
    count: { label: t.chartIncidentsLabel, },
    ...incidentStatusData.reduce((acc, cur) => ({...acc, [cur.status]: { label: cur.status, color: cur.fill }}), {})
  } satisfies ChartConfig;
  
  const incidentPriorityData = React.useMemo(() => {
    if (!incidents) return [];
    const counts = incidents.reduce((acc, incident) => {
      const priorityLabel = incident.priority || (locale === 'vi' ? 'Không ưu tiên' : 'No Priority');
      acc[priorityLabel] = (acc[priorityLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count: count,
      fill: priorityColors[priority] || "hsl(var(--muted))"
    }));
  }, [incidents, locale]);

  const priorityChartConfig = {
     count: { label: t.chartIncidentsLabel, },
     ...incidentPriorityData.reduce((acc, cur) => ({...acc, [cur.priority]: { label: cur.priority, color: cur.fill }}), {})
  } satisfies ChartConfig;

  const reliabilityMetrics = React.useMemo(() => {
    if (!reliabilityStats.length) return null;
    const avgMtbf = Math.round(reliabilityStats.reduce((acc, s) => acc + s.mtbf, 0) / reliabilityStats.length);
    const avgMttr = Math.round((reliabilityStats.reduce((acc, s) => acc + s.mttr, 0) / reliabilityStats.length) * 10) / 10;
    const criticalAssets = reliabilityStats.filter(s => s.mtbf > 0 && s.mtbf < 100).length;

    const subsystemData = Array.from(new Set(reliabilityStats.map(s => s.subsystem))).map(sub => {
        const subStats = reliabilityStats.filter(s => s.subsystem === sub);
        return {
            name: sub,
            mtbf: Math.round(subStats.reduce((acc, s) => acc + s.mtbf, 0) / subStats.length),
            failures: subStats.reduce((acc, s) => acc + s.totalFailures, 0)
        };
    });

    return { avgMtbf, avgMttr, criticalAssets, subsystemData };
  }, [reliabilityStats]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">{t.welcomeTitle}</h1>
            <p className="text-muted-foreground">{t.welcomeDescription}</p>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="outline"
                className="rounded-full bg-white text-primary border-primary hover:bg-primary/5 shadow-sm px-6 no-print"
                onClick={handleGenerateStrategicReport}
                disabled={isGeneratingStrategic}
            >
                {isGeneratingStrategic ? (
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {t.strategicReportBtn}
                <div className="ml-2 bg-primary/10 px-1.5 py-0.5 rounded text-[8px] font-bold">AI</div>
            </Button>
            <Link href="/dnf/new">
                <Button className="rounded-full shadow-lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                {t.newIncidentButton}
                </Button>
            </Link>
        </div>
      </div>

      <Dialog open={showStrategicDialog} onOpenChange={setShowStrategicDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="p-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                  <DialogTitle className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                      <Sparkles className="h-6 w-6" />
                      {t.strategicReportTitle}
                  </DialogTitle>
                  <DialogDescription className="text-primary-foreground/80 font-medium">
                      Phân tích thông minh giúp tối ưu hóa vận hành và quản trị rủi ro hạ tầng.
                  </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 p-8 bg-white text-black print:p-0">
                  {isGeneratingStrategic ? (
                      <div className="flex flex-col items-center justify-center py-24 gap-4">
                          <div className="relative">
                            <Activity className="h-16 w-16 text-primary animate-pulse" />
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                          </div>
                          <p className="text-lg font-bold italic text-primary animate-bounce">
                              {t.strategicReportLoading}
                          </p>
                      </div>
                  ) : strategicReport ? (
                      <div className="prose prose-slate max-w-none strategic-report-content print:text-black">
                         <div className="flex justify-between items-center border-b-2 border-primary pb-4 mb-8 print:flex">
                            <div className="text-primary font-black italic text-xl">HURC No.1 CDHS</div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase">Báo cáo Chiến lược AI</p>
                                <p className="text-[10px] text-muted-foreground">{new Date().toLocaleString(locale)}</p>
                            </div>
                         </div>
                          <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
                            {strategicReport}
                          </div>
                          
                          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 signature-section-dashboard no-break">
                                <div className="text-center">
                                    <p className="font-bold text-xs uppercase mb-12">Phê duyệt bởi CEO/CTO</p>
                                    <div className="h-0.5 w-32 bg-slate-300 mx-auto border-t border-dotted border-black"></div>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-xs uppercase mb-12">Xác nhận Hệ thống AI</p>
                                    <div className="h-0.5 w-32 bg-slate-300 mx-auto border-t border-dotted border-black"></div>
                                    <p className="text-[8px] text-slate-400 mt-2 italic italic">MetroExpert AI Intelligence Engine</p>
                                </div>
                          </div>
                      </div>
                  ) : (
                      <p className="text-center py-10 text-muted-foreground italic">Lỗi khi tải báo cáo.</p>
                  )}
              </ScrollArea>

              <DialogFooter className="p-4 bg-slate-50 border-t flex justify-between gap-4 no-print sm:justify-between items-center">
                  <div className="text-[10px] text-muted-foreground italic font-medium">
                      CONFIDENTIAL - METRO CRM ADVANCED ANALYTICS MODULE v2.1
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowStrategicDialog(false)} className="rounded-full">
                        Đóng
                    </Button>
                    <Button disabled={!strategicReport} onClick={() => window.print()} className="rounded-full shadow-md">
                        <Printer className="mr-2 h-4 w-4" /> Xuất PDF
                    </Button>
                  </div>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 bg-primary/5 border-primary/20 shadow-lg">
              <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      {t.healthIndex}
                  </CardTitle>
                  <CardDescription className="text-xs">{t.healthIndexDesc}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative h-32 w-32">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle className="text-muted stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                          <circle 
                            className={cn(healthIndex > 80 ? "text-green-500" : healthIndex > 50 ? "text-yellow-500" : "text-destructive", "stroke-current")} 
                            strokeWidth="10" 
                            strokeDasharray={`${healthIndex * 2.51}, 251.2`} 
                            strokeLinecap="round" 
                            fill="transparent" 
                            r="40" cx="50" cy="50" 
                            transform="rotate(-90 50 50)" 
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-bold">{healthIndex}%</span>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="md:col-span-2 border-l-4 border-l-primary shadow-lg overflow-hidden flex flex-col">
              <CardHeader className="bg-primary/5 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{t.aiSummaryTitle}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={fetchAiSummary} disabled={isLoadingAi} className="h-8 px-2 text-xs">
                      {isLoadingAi ? <Clock className="animate-spin h-3 w-3 mr-1" /> : <History className="h-3 w-3 mr-1" />}
                      {t.aiSummaryRegen}
                  </Button>
              </CardHeader>
              <CardContent className="flex-1 py-4 flex items-center justify-center min-h-[140px]">
                  {isLoadingAi ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                          <CardDescription>{t.aiSummaryLoading}</CardDescription>
                      </div>
                  ) : (
                      <p className="text-sm leading-relaxed italic text-foreground/80 font-medium">
                          &quot;{aiSummary || (locale === 'vi' ? 'Sẵn sàng phân tích dữ liệu hệ thống...' : 'Ready to analyze system data...')}&quot;
                      </p>
                  )}
              </CardContent>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-4 border-dashed border-primary/40 bg-muted/20">
              <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{t.safetyForecastTitle}</CardTitle>
                  </div>
                  <CardDescription>{t.safetyForecastDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {hazards.filter(h => h.attachments?.some((a: any) => a.url)).length > 0 ? (
                          hazards.filter(h => h.attachments?.some((a: any) => a.url)).slice(0, 3).map((h, i) => (
                              <div key={i} className="flex flex-col gap-2 p-3 border rounded-lg bg-card shadow-sm">
                                  <div className="flex items-center justify-between">
                                      <Badge variant="secondary" className="font-mono text-[10px]">{h.id}</Badge>
                                      <Badge variant={h.severityId === 'I' ? 'destructive' : 'outline'}>
                                          {h.severityId === 'I' ? 'Cảnh báo Rủi ro cao' : 'Theo dõi'}
                                      </Badge>
                                  </div>
                                  <p className="text-xs font-semibold line-clamp-1">{h.description}</p>
                                  <div className="flex items-start gap-2 text-[11px] text-muted-foreground leading-tight italic">
                                      <ShieldAlert className="h-3 w-3 shrink-0 text-amber-500 mt-0.5" />
                                      {h.potentialConsequence?.substring(0, 80)}...
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-dashed">
                                       <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] justify-between px-2" asChild>
                                           <Link href={`/ai-vision-audit?hazardId=${h.id}`}>
                                               <span className="flex items-center gap-1.5"><Eye className="h-3 w-3" /> Chạy Audit AI</span>
                                               <ArrowRight className="h-3 w-3" />
                                           </Link>
                                       </Button>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <div className="col-span-3 py-6 text-center text-sm text-muted-foreground italic">
                              {t.noSafetyAudit}
                          </div>
                      )}
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {reliabilityMetrics && (
          <>
            <Card className="md:col-span-4 border-none shadow-xl bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-8 rounded-[40px] overflow-hidden relative">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter">METRO RELIABILITY HUB</h2>
                            <p className="text-indigo-100 text-sm font-medium opacity-80">Chỉ số Hiệu suất & Độ tin cậy Kỹ thuật thời gian thực</p>
                        </div>
                        <ShieldCheck className="h-12 w-12 text-white/20" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">MTBF Hệ thống</p>
                            <h3 className="text-4xl font-black tracking-tighter">{reliabilityMetrics.avgMtbf}h</h3>
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px]">+12% vs last month</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">MTTR Trung bình</p>
                            <h3 className="text-4xl font-black tracking-tighter">{reliabilityMetrics.avgMttr}h</h3>
                            <Badge className="bg-amber-500/20 text-amber-300 border-none text-[10px]">-5% optimization</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Rủi ro tới hạn</p>
                            <h3 className="text-4xl font-black tracking-tighter text-red-400">{reliabilityMetrics.criticalAssets}</h3>
                            <p className="text-[10px] text-indigo-300 font-medium italic">Thiết bị MTBF &lt; 100h</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Availability</p>
                            <h3 className="text-4xl font-black tracking-tighter">99.8%</h3>
                            <Badge className="bg-indigo-400/20 text-indigo-200 border-none text-[10px]">World Class Level</Badge>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
            </Card>

            <Card className="md:col-span-2 border-none shadow-xl bg-card rounded-[40px] p-8">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-indigo-600" /> 
                        Hiệu suất Hệ thống con
                    </CardTitle>
                </CardHeader>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reliabilityMetrics.subsystemData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} />
                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="mtbf" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="md:col-span-2 border-none shadow-xl bg-card rounded-[40px] p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        Thiết bị rủi ro
                    </h3>
                    <Trophy className="h-5 w-5 text-slate-200" />
                </div>
                <div className="space-y-4">
                    {reliabilityStats.sort((a,b) => a.mtbf - b.mtbf).slice(0, 4).map(asset => (
                        <div key={asset.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 flex items-center justify-center bg-white rounded-lg shadow-sm">
                                    <Activity className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">{asset.name}</p>
                                    <p className="text-[10px] font-medium text-muted-foreground capitalize">{asset.subsystem}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-red-500">{asset.mtbf}h</p>
                                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-tighter">MTBF</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryStatsData.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-shadow">
             <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.incidentsByStatusChart}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={statusChartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer>
                    <BarChart accessibilityLayer data={incidentStatusData} layout="vertical" margin={{left: 20}}>
                    <YAxis
                        dataKey="status"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
                        className="text-xs fill-muted-foreground"
                    />
                    <XAxis dataKey="count" type="number" hide />
                    <CustomChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Bar dataKey="count" radius={4}>
                        {incidentStatusData.map((entry) => (
                            <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                        ))}
                    </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
            <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.incidentsByPriorityChart}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={priorityChartConfig}
                    className="mx-auto aspect-square h-[250px]"
                >
                    <ResponsiveContainer>
                    <PieChart>
                        <CustomChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={incidentPriorityData}
                            dataKey="count"
                            nameKey="priority"
                            innerRadius={60}
                            strokeWidth={5}
                        />
                            <ChartLegend
                            content={<ChartLegendContent nameKey="priority" />}
                            className="-translate-y-[20px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><FileWarning/>{t.recentIncidentsTitle}</CardTitle>
            <CardDescription>{t.recentIncidentsDescription}</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/dnf">{t.viewAllIncidents}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.idHeader}</TableHead>
                  <TableHead>{t.descHeader}</TableHead>
                  <TableHead>{t.locationHeader}</TableHead>
                  <TableHead>{t.statusHeader}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length > 0 ? incidents.slice(0, 5).map(incident => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-mono text-xs">
                        <Link href={`/dnf/${incident.id}`} className="hover:underline text-primary">
                            {incident.id}
                        </Link>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{incident.descriptionOfFailure}</TableCell>
                    <TableCell>{getLocationLabel(incident.locationOfFailure)}</TableCell>
                    <TableCell><Badge variant={getDnfStatusBadgeVariant(incident.status)}>{incident.status}</Badge></TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">{t.noIncidents}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
