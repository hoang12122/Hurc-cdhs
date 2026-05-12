"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { offlineSync, OfflineAction } from '@/lib/services/offline-sync';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { addDnf, updateMockDnf } from '@/lib/actions/dnf.actions';
import { addHazardRecord, updateHazardRecord } from '@/lib/actions/hazard.actions';
import { addInspection, updateInspection } from '@/lib/actions/inspection.actions';

interface NetworkContextType {
  isOnline: boolean;
  pendingCount: number;
  syncInProgress: boolean;
  triggerSync: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const { toast } = useToast();

  const updatePendingCount = useCallback(async () => {
    const actions = await offlineSync.getActions();
    setPendingCount(actions.length);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!isOnline || syncInProgress) return;
    
    const actions = await offlineSync.getActions();
    if (actions.length === 0) return;

    setSyncInProgress(true);
    toast({
      title: "Đang đồng bộ...",
      description: `Đang tải ${actions.length} bản ghi lên hệ thống.`,
    });

    let successCount = 0;
    for (const action of actions) {
      try {
        switch (action.type) {
          case 'DNF_CREATE':
            await addDnf(action.data);
            break;
          case 'HAZARD_CREATE':
            await addHazardRecord(action.data);
            break;
          case 'INSPECTION_CREATE':
            await addInspection(action.data);
            break;
          case 'STATUS_UPDATE':
            if (action.entityType === 'DNF') await updateMockDnf(action.data);
            if (action.entityType === 'HAZARD') await updateHazardRecord(action.data);
            if (action.entityType === 'INSPECTION') await updateInspection(action.data);
            break;
        }
        await offlineSync.removeAction(action.id);
        successCount++;
      } catch (error) {
        console.error("Sync failed for action:", action.id, error);
      }
    }

    setSyncInProgress(false);
    await updatePendingCount();

    if (successCount > 0) {
      toast({
        title: "Đã đồng bộ xong",
        description: `Thành công tải lên ${successCount} bản ghi.`,
        variant: "default",
      });
    }
  }, [isOnline, syncInProgress, toast, updatePendingCount]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync, updatePendingCount]);

  return (
    <NetworkContext.Provider value={{ isOnline, pendingCount, syncInProgress, triggerSync }}>
      {children}
      
      {/* Offline Indicator UI */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 z-[100] bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
          <WifiOff size={16} />
          <span className="text-sm font-medium">Đang chế độ Ngoại tuyến</span>
        </div>
      )}
      {pendingCount > 0 && isOnline && !syncInProgress && (
        <div 
          onClick={triggerSync}
          className="fixed bottom-4 right-4 z-[100] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700"
        >
          <Wifi size={16} />
          <span className="text-sm font-medium">Có {pendingCount} bản ghi chờ đồng bộ</span>
        </div>
      )}
      {syncInProgress && (
        <div className="fixed bottom-4 right-4 z-[100] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm font-medium">Đang xử lý đồng bộ...</span>
        </div>
      )}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
