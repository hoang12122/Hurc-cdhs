'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldAlert, Archive } from 'lucide-react';
import { reviewAiMemory } from '@/lib/actions/ai-governance.actions';
import type { AgentMemory, MemoryReviewDecision } from '@/lib/services/agent-memory';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function statusClass(status: AgentMemory['verificationStatus']) {
  if (status === 'verified') return 'border-emerald-200 bg-emerald-100 text-emerald-800';
  if (status === 'quarantined') return 'border-red-200 bg-red-100 text-red-800';
  if (status === 'superseded') return 'border-slate-200 bg-slate-100 text-slate-700';
  return 'border-amber-200 bg-amber-100 text-amber-800';
}

export function LearningReviewQueue({ initialRecords }: { initialRecords: AgentMemory[] }) {
  const [records, setRecords] = useState(initialRecords);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const counts = useMemo(() => ({
    provisional: records.filter(item => item.verificationStatus === 'provisional').length,
    quarantined: records.filter(item => item.verificationStatus === 'quarantined').length,
  }), [records]);

  const decide = (memory: AgentMemory, decision: MemoryReviewDecision) => {
    const label = decision === 'approve'
      ? 'phê duyệt'
      : decision === 'quarantine'
        ? 'cách ly'
        : 'đánh dấu đã bị thay thế';
    if (!window.confirm(`Xác nhận ${label} ký ức “${memory.topic}”?`)) return;

    setError(null);
    setActiveId(memory.id);
    startTransition(async () => {
      try {
        const result = await reviewAiMemory(memory.id, decision);
        if (!result) throw new Error('Không tìm thấy ký ức hoặc bản ghi đã thay đổi.');
        setRecords(current => current.filter(item => item.id !== memory.id));
        router.refresh();
      } catch (reviewError) {
        setError(reviewError instanceof Error ? reviewError.message : 'Không thể cập nhật ký ức.');
      } finally {
        setActiveId(null);
      }
    });
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2">
        <Card><CardHeader className="pb-2"><CardDescription>Provisional chờ duyệt</CardDescription><CardTitle className="text-3xl">{counts.provisional}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Quarantine cần quyết định</CardDescription><CardTitle className="text-3xl">{counts.quarantined}</CardTitle></CardHeader></Card>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

      {records.length === 0 && (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-muted-foreground">
          Không có ký ức nào đang chờ phê duyệt. AI tiếp tục hoạt động ở chế độ shadow learning.
        </div>
      )}

      <div className="space-y-4">
        {records.map(memory => {
          const busy = isPending && activeId === memory.id;
          return (
            <Card key={memory.id}>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="text-lg">{memory.topic}</CardTitle>
                    <CardDescription className="mt-1">
                      {memory.domain} · {memory.agentRole} · {memory.sourceType}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusClass(memory.verificationStatus)}>{memory.verificationStatus}</Badge>
                    <Badge variant="outline">Confidence {memory.confidence.toFixed(2)}</Badge>
                    <Badge variant="outline">Reinforcement {memory.reinforcementCount}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-52 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                  {memory.context}
                </div>
                <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <div>Namespace: {memory.namespace}</div>
                  <div>Source ID: {memory.sourceId ?? 'Không có'}</div>
                  <div>Last seen: {new Date(memory.lastSeenAt).toLocaleString('vi-VN')}</div>
                  <div>Expires: {new Date(memory.expiresAt).toLocaleString('vi-VN')}</div>
                </div>
                <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
                  <Button variant="outline" disabled={isPending} onClick={() => decide(memory, 'supersede')}>
                    <Archive className="mr-2 h-4 w-4" /> Supersede
                  </Button>
                  <Button variant="destructive" disabled={isPending} onClick={() => decide(memory, 'quarantine')}>
                    <ShieldAlert className="mr-2 h-4 w-4" /> Quarantine
                  </Button>
                  <Button disabled={isPending} onClick={() => decide(memory, 'approve')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> {busy ? 'Đang xử lý...' : 'Approve'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
