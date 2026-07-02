import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Bot, CheckCircle2, Gauge, GitCompare, ShieldCheck, TrendingUp, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const comparisonRows = [
  ['Mục tiêu nghiệp vụ', 'DNF, Hazard Log, RAMS, FRACAS/Risk Management, OCC Dashboard, AI hỗ trợ đánh giá nhanh.', 'Bảo trì và báo cáo song ngữ trên các tuyến metro, bảo trì dự đoán.', 'HURC CDHS bám sát nghiệp vụ tuyến số 1; Shamma mạnh về định vị enterprise/predictive maintenance.'],
  ['FRACAS', 'Có DNF Form, AI Hazard, roadmap 05 phase, audit liên kết.', 'Không công khai chi tiết FRACAS.', 'HURC CDHS có lợi thế về FRACAS theo tài liệu nội bộ.'],
  ['Hazard Log', 'Có Hazard Form, AI đánh giá nhanh, human review required.', 'Không công khai cụ thể Hazard Log.', 'HURC CDHS rõ hơn về quản lý mối nguy an toàn.'],
  ['RAMS', 'Có RAMS quick engine, MTTR, Service Impact, RAMS Total, hotspot, trend.', 'Công khai định hướng predictive maintenance.', 'HURC CDHS có logic RAMS rõ; cần dữ liệu thật và predictive layer.'],
  ['AI', 'Có Hazard AI Flow, DNF/Hazard AI, Incident Memory, AI Lab.', 'Nhấn mạnh automation, prediction, decision support.', 'HURC CDHS chuyên ngành; Shamma mạnh thông điệp sản phẩm.'],
  ['Dashboard', 'Có OCC RAMS Trending, Hotspot, Highlights.', 'Không công khai dashboard chi tiết.', 'HURC CDHS có nền tảng; cần biểu đồ/filter/drill-down sâu hơn.'],
  ['Song ngữ', 'Có EN/VI ở menu và một số module.', 'Công khai nhấn mạnh bilingual EN/VI.', 'HURC CDHS cần chuẩn hóa i18n toàn hệ thống.'],
  ['Production readiness', 'Cần tiếp tục chứng minh build, demo data, smoke test, case study.', 'Công khai định vị hệ thống đã chạy production.', 'Đây là khoảng cách quan trọng cần ưu tiên.'],
];

const strengths = [
  'Bám sát nghiệp vụ metro tuyến số 1, không chỉ là CMMS tổng quát.',
  'Có chuỗi DNF → Hazard → RAMS → OCC Dashboard.',
  'Có nguyên tắc AI không tự phê duyệt, quyết định cuối cùng do con người.',
  'Có audit kiểm tra liên kết giữa các module chính.',
  'Có RAMS Trending, Hotspot và OCC Highlights hỗ trợ điều hành.',
];

const weaknesses = [
  'Chưa chứng minh đầy đủ production readiness bằng demo/case study hoàn chỉnh.',
  'Predictive maintenance còn ở mức nền tảng, chưa có mô hình dự báo hoàn chỉnh.',
  'UI/UX cần tổ chức rõ hơn theo workflow FRACAS end-to-end.',
  'Song ngữ EN/VI chưa đồng bộ toàn bộ module.',
  'Tích hợp dữ liệu thật vẫn là rủi ro lớn nếu nguồn dữ liệu vận hành chưa sạch.',
];

const roadmap = [
  ['P1', 'FRACAS Phase Tracker', 'Hiển thị số hồ sơ theo 05 phase, hồ sơ quá hạn, hồ sơ chờ phê duyệt.', 'Cao'],
  ['P2', 'DNF → Hazard one-click workflow', 'Tạo Hazard Log từ DNF khi AI xác định safety-related.', 'Cao'],
  ['P3', 'Demo Case Study nội bộ', 'Tạo kịch bản PSD/AFC/Train/Power/Signal từ DNF đến closure.', 'Cao'],
  ['P4', 'Predictive RAMS layer', 'Bổ sung recurrence score, asset health, failure probability, predicted hotspot.', 'Trung bình'],
  ['P5', 'Chuẩn hóa song ngữ', 'Tạo dictionary EN/VI cho DNF, Hazard, FRACAS, RAMS, AI, Approval/Closure.', 'Trung bình'],
  ['P6', 'Benchmark dashboard', 'Theo dõi khoảng cách HURC CDHS so với các nền tảng enterprise/predictive maintenance.', 'Trung bình'],
];

function priorityVariant(priority: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (priority === 'Cao') return 'destructive';
  if (priority === 'Trung bình') return 'secondary';
  return 'outline';
}

export default function ShammaBenchmarkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/fracas-risk-management" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Quay lại FRACAS / Risk Management
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">Shamma Metro Benchmark</h1>
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            So sánh sơ bộ HURC CDHS với thông tin công khai về Shamma Consultancy Metro Systems để xác định điểm mạnh, điểm yếu và hướng cập nhật phần mềm.
          </p>
        </div>
        <Badge variant="outline" className="w-fit">Benchmark / Gap Assessment</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <GitCompare className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">So sánh</p>
            <p className="text-2xl font-bold">08 tiêu chí</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Điểm mạnh</p>
            <p className="text-2xl font-bold">05 nhóm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <AlertTriangle className="mb-3 h-5 w-5 text-amber-500" />
            <p className="text-xs text-muted-foreground">Khoảng cách</p>
            <p className="text-2xl font-bold">05 nhóm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <TrendingUp className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Cập nhật</p>
            <p className="text-2xl font-bold">06 bước</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitCompare className="h-5 w-5 text-primary" /> Bảng so sánh tổng quan</CardTitle>
          <CardDescription>Đánh giá dựa trên thông tin công khai, không bao gồm case study password-protected của Shamma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu chí</TableHead>
                  <TableHead>HURC CDHS</TableHead>
                  <TableHead>Shamma Metro Systems</TableHead>
                  <TableHead>Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map(([criterion, hurc, shamma, assessment]) => (
                  <TableRow key={criterion}>
                    <TableCell className="min-w-[160px] font-semibold">{criterion}</TableCell>
                    <TableCell className="min-w-[240px] text-sm">{hurc}</TableCell>
                    <TableCell className="min-w-[240px] text-sm">{shamma}</TableCell>
                    <TableCell className="min-w-[280px] text-sm text-muted-foreground">{assessment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Điểm mạnh HURC CDHS</CardTitle>
            <CardDescription>Các lợi thế nên tiếp tục phát huy khi phát triển sản phẩm.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengths.map((item) => (
              <div key={item} className="flex gap-2 rounded-xl border bg-card p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><XCircle className="h-5 w-5 text-destructive" /> Điểm yếu / khoảng cách</CardTitle>
            <CardDescription>Các điểm cần khắc phục để đạt mức sản phẩm chuyên nghiệp hơn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weaknesses.map((item) => (
              <div key={item} className="flex gap-2 rounded-xl border bg-card p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Gauge className="h-5 w-5 text-primary" /> Cập nhật đề xuất cho phần mềm</CardTitle>
          <CardDescription>Lộ trình ưu tiên để thu hẹp khoảng cách với nền tảng enterprise/predictive maintenance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phase</TableHead>
                <TableHead>Hạng mục</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ưu tiên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roadmap.map(([phase, title, content, priority]) => (
                <TableRow key={phase}>
                  <TableCell className="font-semibold">{phase}</TableCell>
                  <TableCell className="font-semibold">{title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{content}</TableCell>
                  <TableCell><Badge variant={priorityVariant(priority)}>{priority}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> Kết luận định hướng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            HURC CDHS không nên phát triển theo hướng CMMS tổng quát, mà nên tập trung thành hệ thống chuyên biệt cho FRACAS - Hazard - RAMS - OCC của đường sắt đô thị.
          </p>
          <p>
            Trọng tâm cập nhật là chứng minh workflow thực tế, tăng predictive layer, chuẩn hóa song ngữ, bổ sung phase tracking và tạo case study nội bộ đủ thuyết phục cho quản lý.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
