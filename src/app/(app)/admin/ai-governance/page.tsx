import { Activity, BrainCircuit, Database, LockKeyhole, ShieldCheck } from 'lucide-react';
import { getAiGovernanceDashboard } from '@/lib/actions/ai-governance.actions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  );
}

export default async function AiGovernancePage() {
  const dashboard = await getAiGovernanceDashboard();
  const openCircuits = dashboard.runtime.circuits.filter(circuit => circuit.state !== 'closed').length;
  const activeExecutions = dashboard.runtime.namespaces.reduce((sum, item) => sum + item.active, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight">AI Governance Control Plane</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Giám sát agent, bộ nhớ học có kiểm duyệt, audit, circuit breaker và công cụ AI read-only.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Mode: {dashboard.mode}</Badge>
          <Badge variant="outline">Write access: {dashboard.writeAccess ? 'enabled' : 'disabled'}</Badge>
          <Badge variant="outline">Audit: {dashboard.audit.store}</Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Agent quản trị"
          value={dashboard.agents.length}
          description="Các vai trò được đăng ký cố định trong Control Plane."
        />
        <MetricCard
          title="Ký ức đang hoạt động"
          value={dashboard.memory.active}
          description={`${dashboard.memory.verified} đã xác minh; ${dashboard.memory.provisional} tạm thời.`}
        />
        <MetricCard
          title="Ký ức cách ly"
          value={dashboard.memory.quarantined}
          description={`${dashboard.memory.expired} ký ức đã hết TTL; ${dashboard.memory.superseded} đã bị thay thế.`}
        />
        <MetricCard
          title="Audit governance"
          value={dashboard.audit.total}
          description={`${dashboard.audit.critical} sự kiện critical; ${dashboard.audit.blocked} yêu cầu bị chặn.`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5" /> Agent Registry
            </CardTitle>
            <CardDescription>Agent chỉ có quyền đọc, phân tích và đề xuất theo miền dữ liệu.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {dashboard.agents.map(agent => (
              <div key={agent.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{agent.displayName}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                  <Badge variant="secondary">{agent.minimumGroundingScore.toFixed(2)}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{agent.systemPolicy}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.domains.map(domain => (
                    <Badge key={domain} variant="outline">{domain}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> Runtime Guard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Đang thực thi</span><strong>{activeExecutions}</strong></div>
              <div className="flex justify-between"><span>Single-flight</span><strong>{dashboard.runtime.singleFlightRequests}</strong></div>
              <div className="flex justify-between"><span>Circuit không đóng</span><strong>{openCircuits}</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5" /> Tool Firewall
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Chế độ</span><strong>{dashboard.toolFirewall.mode}</strong></div>
              <div className="flex justify-between"><span>Tool bị chặn</span><strong>{dashboard.toolFirewall.blockedTools.length}</strong></div>
              <div className="flex justify-between"><span>Timeout MCP</span><strong>{dashboard.toolFirewall.timeoutMs / 1000}s</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" /> Memory Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{dashboard.memory.store}</p>
              <p className="text-muted-foreground">
                {dashboard.memory.duplicateReinforcements} lần củng cố trùng đã được hợp nhất thay vì tạo ký ức mới.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Các lớp bảo vệ đang bật</CardTitle>
          <CardDescription>Danh sách invariant được Control Plane và Security Gate kiểm tra.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {dashboard.protections.map(protection => (
            <Badge key={protection} variant="outline">{protection}</Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
