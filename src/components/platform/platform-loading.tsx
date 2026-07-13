import { Skeleton } from '@/components/ui/skeleton';

export function PlatformLoading() {
  return (
    <main className="min-h-full bg-slate-50/70 p-4 md:p-8" aria-busy="true" aria-label="Đang tải nền tảng số hội tụ">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
          </div>
          <div className="mt-6 flex gap-2 border-t pt-5">
            {[1, 2, 3, 4].map(item => <Skeleton key={item} className="h-9 w-28 rounded-md" />)}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="rounded-xl border bg-white p-5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-9 w-20" />
              <Skeleton className="mt-3 h-3 w-full" />
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl border bg-white p-6"><Skeleton className="h-56 w-full" /></div>
          <div className="rounded-xl border bg-white p-6"><Skeleton className="h-56 w-full" /></div>
        </section>
      </div>
    </main>
  );
}
