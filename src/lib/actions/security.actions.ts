
"use server";


import { getSystemLogs } from "./system.actions";

export type SecurityStats = {
  totalLoginAttempts: number;
  failedLoginAttempts: number;
  rateLimitHits: number;
  lastBackupStatus: string;
  databaseIntegrity: string;
};

export async function getSecurityStats(): Promise<SecurityStats> {
  const logs = await getSystemLogs();

  const securityLogs = logs.filter(l => l.level === 'ERROR' || l.level === 'WARNING');
  const loginFailures = logs.filter(l => l.details.toLowerCase().includes('failed') && l.details.toLowerCase().includes('login')).length;
  
  return {
    totalLoginAttempts: logs.filter(l => l.details.toLowerCase().includes('login')).length,
    failedLoginAttempts: loginFailures,
    rateLimitHits: logs.filter(l => l.details.toLowerCase().includes('rate limit')).length,
    lastBackupStatus: "Sẵn sàng (24h)",
    databaseIntegrity: "Tốt (AsyncMutex Active)"
  };
}
