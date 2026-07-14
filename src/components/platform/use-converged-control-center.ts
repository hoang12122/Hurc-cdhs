'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ComponentStatus = 'HEALTHY' | 'DEGRADED' | 'DISABLED';

export interface PlatformStatus {
  phase: number;
  status: ComponentStatus;
  components: Array<{
    id: string;
    name: string;
    phase: number;
    status: ComponentStatus;
    latencyMs: number | null;
    detail: string;
  }>;
  outbox: { pending: number; retrying: number; oldestPendingSeconds: number | null } | null;
  etl: {
    received: number;
    normalized: number;
    invalid: number;
    lateEvents: number;
    qualityWarnings: number;
    publishFailures: number;
    commits: number;
    consumerLag: number;
    lastBatchSize: number;
    lastBatchLatencyMs: number;
    schemaRegistered: boolean;
    contractChecksum: string | null;
    lastProcessedAt: string | null;
    sink: {
      received: number;
      inserted: number;
      duplicates: number;
      conflicts: number;
      invalid: number;
      commits: number;
      consumerLag: number;
      lastProcessedAt: string | null;
    } | null;
    replay: {
      activeRequestId: string | null;
      completed: number;
      failed: number;
      replayed: number;
      lastCompletedAt: string | null;
    } | null;
  } | null;
  readiness: {
    ready: boolean;
    score: number;
    deploymentMode: string;
    issues: Array<{
      code: string;
      severity: 'BLOCKER' | 'WARNING';
      area: string;
      message: string;
      remediation: string;
    }>;
  };
  checkedAt: string;
}

export interface TwinOverview {
  generatedAt: string;
  telemetryAvailable: boolean;
  overallScore: number;
  counts: { healthy: number; watch: number; degraded: number; critical: number };
  assets: Array<{
    id: string;
    code: string;
    name: string;
    stationId: string | null;
    subsystem: string | null;
    openDnfs: number;
    openHazards: number;
    lastTelemetryAt: string | null;
    health: {
      score: number;
      band: 'HEALTHY' | 'WATCH' | 'DEGRADED' | 'CRITICAL';
      confidence: number;
      factors: Array<{ label: string; penalty: number }>;
    };
  }>;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

export function useConvergedControlCenter() {
  const [platform, setPlatform] = useState<PlatformStatus | null>(null);
  const [twin, setTwin] = useState<TwinOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async (silent = false) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    if (!silent) setRefreshing(true);
    setError(null);

    const platformPromise: Promise<PlatformStatus> = fetch('/api/platform/status', {
      cache: 'no-store',
      signal: controller.signal,
    }).then(response => readJson<PlatformStatus>(response));
    const twinPromise: Promise<TwinOverview> = fetch('/api/digital-twin/overview?limit=40', {
      cache: 'no-store',
      signal: controller.signal,
    }).then(response => readJson<TwinOverview>(response));
    const [platformResult, twinResult] = await Promise.allSettled([
      platformPromise,
      twinPromise,
    ] as const);

    if (controller.signal.aborted) return;
    if (platformResult.status === 'fulfilled') setPlatform(platformResult.value);
    if (twinResult.status === 'fulfilled') setTwin(twinResult.value);

    const failures = [platformResult, twinResult]
      .filter(result => result.status === 'rejected').length;
    if (failures === 2) setError('Không thể tải dữ liệu điều hành. Vui lòng kiểm tra kết nối hoặc quyền truy cập.');
    else if (failures === 1) setError('Một nguồn dữ liệu đang chậm; giao diện vẫn hiển thị phần dữ liệu còn khả dụng.');

    setLastUpdatedAt(new Date().toISOString());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh(true);
    }, 30_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refresh(true);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      controllerRef.current?.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  return {
    platform,
    twin,
    loading,
    refreshing,
    error,
    lastUpdatedAt,
    refresh,
  };
}
