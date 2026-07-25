import { jsonDb } from '../db/json-db';
import { sanitizeAiText } from '../services/ai/control-plane';
import {
  crmToolDeclarations,
  openAiToolDeclarations,
} from './crm-tool-declarations';
import {
  toolClawGrep,
  toolClawLs,
  toolClawRead,
} from './crm-tool-filesystem';

export { crmToolDeclarations, openAiToolDeclarations };

export async function executeCrmTool(callerName: string, args: any): Promise<any> {
  try {
    switch (callerName) {
      case 'get_open_dnfs':
        return toolGetOpenDnfs(args);
      case 'get_system_health':
        return toolGetSystemHealth();
      case 'claw_ls':
        return toolClawLs(args);
      case 'claw_read':
        return toolClawRead(args);
      case 'claw_grep':
        return toolClawGrep(args);
      default:
        return {
          success: false,
          error: `Tool ${sanitizeAiText(callerName, 120)} is not in the read-only allowlist.`,
        };
    }
  } catch (error) {
    console.error(`[CRM TOOL] ${sanitizeAiText(callerName, 120)} failed:`, error);
    return {
      success: false,
      error: 'Lỗi hệ thống khi thực thi công cụ read-only.',
    };
  }
}

async function toolGetOpenDnfs(args: any) {
  const requestedLimit = Number(args?.limit ?? 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(Math.floor(requestedLimit), 50))
    : 10;

  try {
    const { opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
    if (IS_DATABASE_OFFLINE) throw new Error('Offline Mode');

    const dnfs = await opsDb.dnfDocument.findMany({
      where: { status: { notIn: ['Đã đóng', 'Hủy'] } },
      select: {
        id: true,
        failureReportNo: true,
        descriptionOfFailure: true,
        priority: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      success: true,
      count: dnfs.length,
      data: dnfs,
      note: 'Dữ liệu read-only thời gian thực từ PostgreSQL.',
    };
  } catch (error) {
    console.warn('[CRM TOOL] get_open_dnfs uses governed JSON fallback:', error instanceof Error ? error.message : error);
    const allDnfs = await jsonDb.getCollection<any>('dnf_documents');
    const openDnfs = allDnfs
      .filter((dnf: any) => !['Đã đóng', 'Hủy'].includes(dnf.status))
      .reverse()
      .slice(0, limit)
      .map((dnf: any) => ({
        id: dnf.id,
        failureReportNo: dnf.failureReportNo,
        descriptionOfFailure: dnf.descriptionOfFailure,
        priority: dnf.priority,
        status: dnf.status,
        createdAt: dnf.createdAt,
      }));

    return {
      success: true,
      count: openDnfs.length,
      data: openDnfs,
      note: 'Dữ liệu read-only từ kho dự phòng do PostgreSQL không sẵn sàng.',
    };
  }
}

async function toolGetSystemHealth() {
  try {
    const { authDb, opsDb, IS_DATABASE_OFFLINE } = await import('@/lib/prisma');
    const stats = {
      dbStatus: IS_DATABASE_OFFLINE ? 'Offline (JSON fallback)' : 'Online (PostgreSQL)',
      isDatabaseOffline: IS_DATABASE_OFFLINE,
      userCount: 0,
      logCount: 0,
    };

    if (!IS_DATABASE_OFFLINE) {
      try {
        [stats.userCount, stats.logCount] = await Promise.all([
          authDb.user.count(),
          opsDb.systemLog.count(),
        ]);
      } catch {
        stats.dbStatus = 'PostgreSQL connection error';
        stats.isDatabaseOffline = true;
      }
    }

    if (stats.isDatabaseOffline) {
      const [users, logs] = await Promise.all([
        jsonDb.getCollection<any>('users'),
        jsonDb.getCollection<any>('system_logs'),
      ]);
      stats.userCount = users.length;
      stats.logCount = logs.length;
    }

    return {
      success: true,
      ...stats,
      message: `Hệ thống ${stats.dbStatus}. Số người dùng: ${stats.userCount}. Số nhật ký: ${stats.logCount}.`,
    };
  } catch {
    return { success: false, error: 'Không thể đọc trạng thái hệ thống.' };
  }
}
