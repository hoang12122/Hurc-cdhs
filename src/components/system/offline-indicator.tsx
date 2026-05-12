"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { CloudOff, CloudUpload, CheckCircle2, AlertCircle } from "lucide-react";
import { offlineSync, OfflineAction } from "@/lib/services/offline-sync";

type SyncState = "online" | "offline" | "syncing" | "conflict";

export function OfflineSyncIndicator() {
  const [state, setState] = React.useState<SyncState>("online");
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    // Theo dõi trạng thái mạng
    const updateOnlineStatus = () => {
      setState(navigator.onLine ? "online" : "offline");
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    // Khởi tạo và đếm số lượng tác vụ offline (Draft / Waiting Sync)
    const checkPending = async () => {
      await offlineSync.init();
      const actions = await offlineSync.getActions();
      setPendingCount(actions.length);
    };
    
    // Poll mỗi 5s
    const interval = setInterval(checkPending, 5000);
    checkPending();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  if (state === "online" && pendingCount === 0) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Đã đồng bộ (Synced)
      </Badge>
    );
  }

  if (state === "offline") {
    return (
      <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">
        <CloudOff className="w-3 h-3 mr-1" />
        Chế độ Offline ({pendingCount} bản nháp)
      </Badge>
    );
  }

  if (state === "online" && pendingCount > 0) {
    return (
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
        <CloudUpload className="w-3 h-3 mr-1" />
        Đang đồng bộ... ({pendingCount})
      </Badge>
    );
  }

  if (state === "conflict") {
    return (
      <Badge variant="destructive">
        <AlertCircle className="w-3 h-3 mr-1" />
        Xung đột dữ liệu
      </Badge>
    );
  }

  return null;
}
