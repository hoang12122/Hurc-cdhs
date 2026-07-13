import Link from 'next/link';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import { getAiMemoryReviewQueue } from '@/lib/actions/ai-governance.actions';
import { Button } from '@/components/ui/button';
import { LearningReviewQueue } from './learning-review-queue';

export const dynamic = 'force-dynamic';

export default async function ContinuousLearningReviewPage() {
  const queue = await getAiMemoryReviewQueue(100);

  return (
    <main className="space-y-6 p-6">
      <section className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-100 p-2 text-cyan-800">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Phê duyệt vòng học AI</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Rà soát tri thức provisional và quarantine trước khi AI được sử dụng như kiến thức đã xác minh.
              </p>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/ai-governance"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Governance</Link>
        </Button>
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Approve nâng confidence tối thiểu lên 0,95 và đổi nguồn thành human-approved. Quarantine và Supersede loại ký ức khỏi luồng truy xuất hợp lệ. Mọi quyết định đều yêu cầu quyền admin:system.
      </div>

      <LearningReviewQueue initialRecords={queue.records} />
    </main>
  );
}
