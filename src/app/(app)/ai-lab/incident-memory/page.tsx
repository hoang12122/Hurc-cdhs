'use client';

import * as React from 'react';
import { CheckCircle2, Clock, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getIncidentMemoryApprovalQueue, setIncidentMemoryVerificationState, syncIncidentMemory } from '@/lib/actions/incident-learning.actions';

type IncidentMemoryApprovalItem = Awaited<ReturnType<typeof getIncidentMemoryApprovalQueue>>[number];
type VerificationState = 'draft' | 'reviewed' | 'verified' | 'rejected';

function stateBadge(state: string) {
  if (state === 'verified') return <Badge className="bg-emerald-600">verified</Badge>;
  if (state === 'reviewed') return <Badge variant="secondary">reviewed</Badge>;
  if (state === 'rejected') return <Badge variant="destructive">rejected</Badge>;
  return <Badge variant="outline">draft</Badge>;
}

export default function IncidentMemoryApprovalPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<IncidentMemoryApprovalItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const loadQueue = React.useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getIncidentMemoryApprovalQueue(80));
    } catch (error: any) {
      toast({ title: 'Không tải được Incident Memory', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncIncidentMemory();
      toast({ title: 'Đã đồng bộ Incident Memory', description: `Scanned ${result.scanned}, upserted ${result.upserted}` });
      await loadQueue();
    } catch (error: any) {
      toast({ title: 'Đồng bộ thất bại', description: error.message, variant: 'destructive' });
    } finally {
      setSyncing(false);
    }
  };

  const updateState = async (memoryId: string, verificationState: VerificationState) => {
    setUpdatingId(memoryId);
    try {
      await setIncidentMemoryVerificationState(memoryId, verificationState, 'ai-lab-reviewer');
      toast({ title: 'Đã cập nhật trạng thái', description: verificationState });
      await loadQueue();
    } catch (error: any) {
      toast({ title: 'Cập nhật thất bại', description: error.message, variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Memory Approval</h1>
          <p className="text-sm text-muted-foreground">Rà soát bài học kinh nghiệm trước khi AI Lab dùng làm nguồn tham khảo mạnh.</p>
        </div>
        <Button onClick={handleSync} disabled={syncing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          Đồng bộ từ OPS
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5" />Nguyên tắc phê duyệt</CardTitle>
          <CardDescription>
            Chỉ chuyển sang verified khi đã đối chiếu hồ sơ nguồn, log/hiện trường nếu cần và có cơ sở kỹ thuật. AI không thay thế phê duyệt an toàn.
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <Card><CardContent className="flex items-center gap-2 py-8 text-sm text-muted-foreground"><Clock className="h-4 w-4 animate-pulse" />Đang tải danh sách...</CardContent></Card>
      ) : items.length === 0 ? (
        <Card><CardContent className="py-8 text-sm text-muted-foreground">Không có Incident Memory ở trạng thái draft/reviewed.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.referenceLabel || item.sourceId} • {item.sourceType} • {item.subsystem || 'General'}</CardDescription>
                  </div>
                  {stateBadge(item.verificationState)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Triệu chứng:</strong> {item.symptomSummary}</p>
                <p><strong>Nguyên nhân/giả thuyết:</strong> {item.rootCause || 'Chưa có'}</p>
                <p><strong>Hành động:</strong> {item.correctiveAction || 'Chưa có'}</p>
                <p><strong>Bài học:</strong> {item.lessonLearned || 'Chưa có'}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline" disabled={updatingId === item.id} onClick={() => updateState(item.id, 'reviewed')}>Reviewed</Button>
                  <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" disabled={updatingId === item.id} onClick={() => updateState(item.id, 'verified')}>
                    <CheckCircle2 className="h-4 w-4" />Verified
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" disabled={updatingId === item.id} onClick={() => updateState(item.id, 'rejected')}>
                    <XCircle className="h-4 w-4" />Rejected
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
