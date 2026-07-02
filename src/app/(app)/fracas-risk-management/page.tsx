import Link from 'next/link';
import { Activity, AlertTriangle, Bot, CheckCircle2, ClipboardList, FileWarning, GitBranch, RadioTower, ShieldAlert, Sparkles, TrendingUp, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Tiếp nhận và phân loại sự cố',
    scope: 'Tạo báo cáo sự cố, ghi nhận thông tin ban đầu, kiểm tra hiện trường, phân loại kỹ thuật và đánh giá ảnh hưởng an toàn/vận hành.',
    modules: ['DNF Form', 'DNF Actions', 'AI Hazard assessment trong DNF'],
    automation: ['Tự động mã hóa hồ sơ DNF', 'Tự động gửi thông báo theo phân hệ', 'AI/NLP gợi ý phân loại kỹ thuật và mức ảnh hưởng'],
    status: 'Đã có nền tảng',
  },
  {
    phase: 'Phase 2',
    title: 'Điều phối và khắc phục tạm thời',
    scope: 'Điều phối đơn vị xử lý, kiểm tra/chẩn đoán/sửa chữa, cập nhật khôi phục kỹ thuật, khôi phục dịch vụ, thời gian gián đoạn và thời gian sửa chữa.',
    modules: ['Corrective Action', 'DNF status', 'Service impact fields', 'RAMS MTTR input'],
    automation: ['Workflow chuyển trạng thái xử lý', 'Nhắc hạn xử lý', 'AI gợi ý phương án xử lý tạm thời từ sự cố tương tự'],
    status: 'Đã có nền tảng',
  },
  {
    phase: 'Phase 3',
    title: 'Phân tích nguyên nhân gốc rễ',
    scope: 'Rà soát nhật ký vận hành, dữ liệu hiện trường, lịch sử bảo trì, bằng chứng kỹ thuật và thực hiện RCA/FTA/FMEA/FMECA khi cần.',
    modules: ['Incident Learning', 'Hazard AI Flow', 'Hazard Form'],
    automation: ['AI gợi ý sự cố tương tự', 'AI gợi ý nguyên nhân khả thi', 'Tự động đề xuất liên kết DNF với Hazard Log'],
    status: 'Đã có nền tảng',
  },
  {
    phase: 'Phase 4',
    title: 'Đề xuất và phê duyệt biện pháp lâu dài',
    scope: 'Đề xuất biện pháp khắc phục/phòng ngừa dài hạn, xác định trách nhiệm, thời hạn, nguồn lực và trình cấp có thẩm quyền phê duyệt.',
    modules: ['Hazard Form', 'Suggested Actions', 'Responsible Unit', 'Due Date'],
    automation: ['Workflow phê duyệt theo risk level', 'Nhắc phê duyệt', 'AI soạn nháp biện pháp dài hạn nhưng không tự phê duyệt'],
    status: 'Đã có nền tảng',
  },
  {
    phase: 'Phase 5',
    title: 'Theo dõi, xác minh và đóng hồ sơ',
    scope: 'Xác minh hiệu lực khắc phục, cập nhật Hazard Log/RAMS, theo dõi tái diễn và đóng hồ sơ khi đủ căn cứ.',
    modules: ['RAMS Engine', 'RAMS OCC Dashboard', 'DNF/Hazard/RAMS Docs'],
    automation: ['Quét lỗi lặp lại', 'AI dự báo hotspot', 'Cảnh báo OCC khi RAMS Total/MTTR/Service Impact tăng bất thường'],
    status: 'Đã có nền tảng',
  },
];

const automationItems = [
  ['Tự động hóa báo cáo và thông báo', 'Gửi thông báo đến XNVH, XNBD, P.KTAT hoặc người phụ trách theo phân hệ ngay khi có sự cố mới.'],
  ['Workflow phê duyệt và nhắc việc', 'Tự động chuyển trạng thái, nhắc quá hạn và cảnh báo cấp quản lý khi hồ sơ có rủi ro cao hoặc tồn đọng lâu.'],
  ['Liên kết DNF - Hazard Log - RAMS', 'Gợi ý tạo Hazard Log từ DNF liên quan an toàn và cập nhật dữ liệu RAMS khi có thời gian sửa chữa/khôi phục.'],
  ['Theo dõi tái phát', 'Quét sự cố theo thiết bị, phân hệ, vị trí, mô tả và mã sự cố để phát hiện lỗi lặp lại.'],
];

const aiItems = [
  ['AI phân loại và đánh giá tác động', 'Sử dụng NLP để đọc mô tả sự cố, gợi ý phân hệ liên quan, mức ảnh hưởng vận hành và hazard level.'],
  ['AI hỗ trợ RCA', 'So sánh sự cố mới với lịch sử sự cố, gợi ý nguyên nhân khả thi và dữ liệu cần kiểm tra.'],
  ['AI dự báo lỗi và hotspot', 'Dùng dữ liệu RAMS/DNF để xác định thiết bị, hệ thống hoặc ga có nguy cơ phát sinh lỗi.'],
  ['AI hỗ trợ nhập liệu hiện trường', 'Hỗ trợ nhập liệu bằng giọng nói, hình ảnh và đề xuất trường còn thiếu trong form DNF/Hazard.'],
];

const roadmapItems = [
  ['P1', 'Gắn phase/status FRACAS vào DNF lifecycle để theo dõi đúng 05 phase.', 'Cao'],
  ['P2', 'Tạo checklist RCA cho sự cố lặp lại hoặc RAMS Total cao.', 'Cao'],
  ['P3', 'Tạo liên kết một nút từ DNF sang Hazard Log khi AI xác định safety-related.', 'Cao'],
  ['P4', 'Bổ sung dashboard FRACAS phase tracking: hồ sơ từng phase, quá hạn, chờ phê duyệt.', 'Trung bình'],
  ['P5', 'Bổ sung AI chatbot nhập liệu hiện trường bằng giọng nói/hình ảnh.', 'Trung bình'],
  ['P6', 'Hiệu chỉnh mô hình dự báo lỗi khi có đủ dữ liệu vận hành thực tế.', 'Trung bình'],
];

function priorityVariant(priority: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (priority === 'Cao') return 'destructive';
  if (priority === 'Trung bình') return 'secondary';
  return 'outline';
}

export default function FracasRiskManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[32px] border bg-gradient-to-r from-primary/10 via-background to-muted/40 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit">FRACAS / Risk Management</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Lộ trình FRACAS, Automation và AI</h1>
            <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">
              Trang này chuyển nội dung nghiên cứu FRACAS từ tài liệu nội bộ thành giao diện trực tiếp trong phần mềm, phục vụ theo dõi phase triển khai, hướng tự động hóa, ứng dụng AI và liên kết với DNF, Hazard Log, RAMS và OCC Dashboard.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs lg:w-[360px]">
            <Link href="/dnf" className="rounded-xl border bg-card p-3 font-semibold hover:bg-muted/50">
              <FileWarning className="mb-2 h-4 w-4 text-primary" /> DNF / FRACAS Records
            </Link>
            <Link href="/hazards" className="rounded-xl border bg-card p-3 font-semibold hover:bg-muted/50">
              <ShieldAlert className="mb-2 h-4 w-4 text-primary" /> Hazard Log
            </Link>
            <Link href="/dashboard" className="rounded-xl border bg-card p-3 font-semibold hover:bg-muted/50">
              <RadioTower className="mb-2 h-4 w-4 text-primary" /> OCC Dashboard
            </Link>
            <Link href="/ai-lab" className="rounded-xl border bg-card p-3 font-semibold hover:bg-muted/50">
              <Bot className="mb-2 h-4 w-4 text-primary" /> AI Knowledge Lab
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <ClipboardList className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Phạm vi</p>
            <p className="text-2xl font-bold">05 phase</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Workflow className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">Automation</p>
            <p className="text-2xl font-bold">04 nhóm</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Sparkles className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">AI use cases</p>
            <p className="text-2xl font-bold">04 hướng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <TrendingUp className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">RAMS/OCC</p>
            <p className="text-2xl font-bold">Linked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" /> 05 Phase triển khai FRACAS</CardTitle>
          <CardDescription>Chia quy trình FRACAS thành các giai đoạn có thể quản lý, tự động hóa và tích hợp AI từng bước.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {phases.map((item) => (
            <div key={item.phase} className="rounded-2xl border p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline">{item.phase}</Badge>
                    <Badge variant="secondary">{item.status}</Badge>
                  </div>
                  <h2 className="text-lg font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.scope}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Module hiện có</p>
                  <ul className="space-y-1 text-sm">
                    {item.modules.map((module) => <li key={module}>• {module}</li>)}
                  </ul>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Automation/AI đề xuất</p>
                  <ul className="space-y-1 text-sm">
                    {item.automation.map((automation) => <li key={automation}>• {automation}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5 text-primary" /> Hướng tự động hóa</CardTitle>
            <CardDescription>Giảm nhập liệu thủ công, giảm tắc nghẽn hồ sơ và tăng khả năng truy vết.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {automationItems.map(([title, desc]) => (
              <div key={title} className="rounded-xl border p-3">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Hướng ứng dụng AI</CardTitle>
            <CardDescription>AI hỗ trợ sàng lọc, phân tích, gợi ý; không thay thế quyết định của người có thẩm quyền.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiItems.map(([title, desc]) => (
              <div key={title} className="rounded-xl border p-3">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Nguyên tắc kiểm soát</CardTitle>
          <CardDescription>Áp dụng AI và Automation phải bảo đảm truy vết, kiểm soát quyền và phê duyệt bởi con người.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              'AI chỉ hỗ trợ sàng lọc, gợi ý và phân tích sơ bộ.',
              'AI không tự phê duyệt, không tự đóng hồ sơ FRACAS/Hazard.',
              'Quyết định cuối cùng thuộc người có thẩm quyền.',
              'Khuyến nghị AI phải có rationale hoặc căn cứ dữ liệu.',
              'Kết quả liên quan an toàn phải được P.KTAT/cấp thẩm quyền rà soát.',
              'Dữ liệu AI phải bảo đảm truy vết, bảo mật và kiểm soát quyền truy cập.',
            ].map((rule) => (
              <div key={rule} className="flex gap-2 rounded-xl border bg-card p-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Lộ trình kỹ thuật tiếp theo</CardTitle>
          <CardDescription>Các bước phát triển sau khi đã có nền tảng DNF, Hazard AI, RAMS Engine và OCC Dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Giai đoạn</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ưu tiên</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roadmapItems.map(([phase, content, priority]) => (
                <TableRow key={phase}>
                  <TableCell className="font-semibold">{phase}</TableCell>
                  <TableCell>{content}</TableCell>
                  <TableCell><Badge variant={priorityVariant(priority)}>{priority}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
