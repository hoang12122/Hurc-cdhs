import { Skeleton } from '@/components/ui/skeleton';

export function OperationalListLoading({ rows = 8 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Đang tải dữ liệu">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-5 w-[28rem] max-w-full" />
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-5 flex flex-wrap gap-3">
          <Skeleton className="h-10 min-w-64 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: rows }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>

        <div className="mt-5 flex justify-between gap-3">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
