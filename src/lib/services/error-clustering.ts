import { opsDbProvider, aiDbProvider } from './db-wrapper';

/**
 * PHASE 9 - TASK 9.3: Error Clustering Service
 * Detects patterns and clusters in failure data.
 */
export enum ClusterType {
  REPEATED_FAILURE = 'REPEATED_FAILURE', // Lỗi lặp lại trên 1 thiết bị
  SYSTEMIC_RISK = 'SYSTEMIC_RISK',       // Lỗi cùng loại trên toàn hệ thống
  STATION_STORM = 'STATION_STORM'        // "Bão" sự cố tại 1 nhà ga
}

export interface ErrorCluster {
  type: ClusterType;
  label: string;
  count: number;
  entities: string[]; // IDs of DNF or Assets
  metadata: any;
}

export class ErrorClusteringService {
  /**
   * Run cluster detection for a given time window
   */
  static async detectClusters(days: number = 30): Promise<ErrorCluster[]> {
    console.log(`[ErrorClustering] Analyzing failures from last ${days} days...`);
    
    const since = new Date();
    since.setDate(since.getDate() - days);

    // 1. Lấy toàn bộ DNF trong khoảng thời gian
    const dnfs = await opsDbProvider.findMany<any>('DnfDocument', {
      createdAt: { gte: since },
      deletedAt: null
    });

    const clusters: ErrorCluster[] = [];

    // --- LOGIC 1: Repeated Failures (Group by Asset) ---
    const assetGroups = this.groupBy(dnfs, 'locationOfFailure'); 
    for (const [assetId, groupEntry] of Object.entries(assetGroups)) {
      const group = groupEntry as any[]; // Ép kiểu để truy cập .length và .map
      if (group.length >= 3) { 
        clusters.push({
          type: ClusterType.REPEATED_FAILURE,
          label: `Repeated Failure on Asset ${assetId}`,
          count: group.length,
          entities: group.map(d => d.id),
          metadata: { assetId }
        });
      }
    }

    // --- LOGIC 2: Station Storm (Group by Station) ---
    // Giả sử có logic trích xuất Station ID từ metadata hoặc quan hệ
    // Tạm thời bỏ qua nếu schema chưa hỗ trợ trực tiếp StationId trong DNF

    console.log(`[ErrorClustering] Found ${clusters.length} potential clusters.`);
    return clusters;
  }

  private static groupBy(array: any[], key: string) {
    return array.reduce((storage, item) => {
      const group = item[key];
      storage[group] = storage[group] || [];
      storage[group].push(item);
      return storage;
    }, {} as Record<string, any[]>);
  }

  /**
   * Log clusters to AI Safety Log
   */
  static async logClusters(clusters: ErrorCluster[]) {
    for (const cluster of clusters) {
      await (aiDbProvider as any).create('AuditConsistencyCheckLog', {
        checkType: 'ERROR_CLUSTERING',
        targetType: 'CLUSTER',
        targetId: cluster.type,
        issueDetails: `AI detected ${cluster.label} with ${cluster.count} incidents.`,
        severity: cluster.count > 5 ? 'CRITICAL' : 'WARNING',
        status: 'detected',
        createdAt: new Date()
      });
    }
  }
}
