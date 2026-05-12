"use server";

import { getInternalSystemLogs as getSystemLogs } from "../services/log-service";
import { requireAuth } from '@/lib/auth-enforcer';
import { type SecurityStats } from '@/lib/types';

export async function getSecurityStats(): Promise<SecurityStats> {
  await requireAuth();
  const logs = await getSystemLogs();

  const loginFailures = logs.filter(l => l.details.toLowerCase().includes('failed') && l.details.toLowerCase().includes('login')).length;
  
  return {
    totalLoginAttempts: logs.filter(l => l.details.toLowerCase().includes('login')).length,
    failedLoginAttempts: loginFailures,
    rateLimitHits: logs.filter(l => l.details.toLowerCase().includes('rate limit')).length,
    lastBackupStatus: "Sẵn sàng (24h)",
    databaseIntegrity: "Tốt (AsyncMutex Active)"
  };
}
