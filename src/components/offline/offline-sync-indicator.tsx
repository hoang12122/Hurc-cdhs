"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNetwork } from "@/components/providers/network-provider";
import { CloudOff, RefreshCw, AlertCircle } from "lucide-react";
import { replayOfflineQueue, getPendingCount } from "@/lib/services/offline-queue-service";

/**
 * Task 17.3: Offline Sync Indicator
 *
 * Shows a floating indicator when there are pending offline actions.
 * Automatically attempts to replay the queue when connectivity is restored.
 */
export function OfflineSyncIndicator() {
  const { isOnline } = useNetwork();
  const { toast } = useToast();
  const [pendingCount, setPendingCount] = React.useState(0);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const prevOnlineRef = React.useRef(isOnline);

  const handleSync = React.useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const result = await replayOfflineQueue();

      if (result.succeeded > 0) {
        toast({
          title: "Đồng bộ thành công",
          description: `Đã đồng bộ ${result.succeeded} hành động lên máy chủ.`,
        });
      }

      if (result.failed > 0) {
        toast({
          variant: "destructive",
          title: "Lỗi đồng bộ",
          description: `${result.failed} hành động không thể đồng bộ: ${result.errors.join("; ")}`,
        });
      }

      const remaining = await getPendingCount();
      setPendingCount(remaining);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Lỗi đồng bộ",
        description: err.message || "Không thể đồng bộ dữ liệu ngoại tuyến.",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, toast]);

  // Poll pending count every 5 seconds
  React.useEffect(() => {
    const checkPending = async () => {
      try {
        const count = await getPendingCount();
        setPendingCount(count);
      } catch {
        // IndexedDB might not be available in SSR
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync when coming back online
  React.useEffect(() => {
    if (isOnline && !prevOnlineRef.current && pendingCount > 0) {
      void handleSync();
    }
    prevOnlineRef.current = isOnline;
  }, [handleSync, isOnline, pendingCount]);

  // Don't render if nothing pending and online
  if (pendingCount === 0 && isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg px-4 py-3 animate-in slide-in-from-bottom-5">
      {!isOnline ? (
        <>
          <CloudOff className="h-5 w-5 text-amber-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Ngoại tuyến
            </span>
            {pendingCount > 0 && (
              <span className="text-xs text-muted-foreground">
                {pendingCount} hành động đang chờ đồng bộ
              </span>
            )}
          </div>
        </>
      ) : pendingCount > 0 ? (
        <>
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {pendingCount} hành động chưa đồng bộ
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="ml-2"
          >
            {isSyncing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">{isSyncing ? "Đang đồng bộ..." : "Đồng bộ"}</span>
          </Button>
        </>
      ) : null}
    </div>
  );
}
