import { aiDbProvider } from './db-wrapper';
import { RiskEngine } from './risk-engine';

/**
 * PHASE 9 - TASK 9.2: Risk Propagation Service
 * Handles walking the TrustGraph to spread risk scores.
 */
export class RiskPropagationService {
  private static MAX_DEPTH = 3;

  /**
   * Propagate risk from a source node to its neighbors
   */
  static async propagateFromNode(nodeId: string, sourceScore: number) {
    console.log(`[RiskPropagation] Starting propagation from ${nodeId} (Score: ${sourceScore})`);
    
    // Sử dụng Breadth-First Search để lan truyền rủi ro
    const queue: { nodeId: string; score: number; depth: number }[] = [
      { nodeId, score: sourceScore, depth: 0 }
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { nodeId: currentId, score: currentScore, depth } = queue.shift()!;
      
      if (depth >= this.MAX_DEPTH || visited.has(currentId)) continue;
      visited.add(currentId);

      // Tìm tất cả các quan hệ đi từ node này hoặc đi tới node này
      const edges = await aiDbProvider.findMany<any>('TrustGraphEdge', {
        OR: [
          { fromNodeId: currentId },
          { toNodeId: currentId }
        ]
      });

      for (const edge of edges) {
        const neighborId = edge.fromNodeId === currentId ? edge.toNodeId : edge.fromNodeId;
        
        if (visited.has(neighborId)) continue;

        // Tính toán điểm rủi ro lan truyền
        const propagatedScore = RiskEngine.calculatePropagatedScore(currentScore, edge.relationType, depth + 1);
        
        if (propagatedScore > 5) { // Chỉ lan truyền rủi ro có ý nghĩa
          console.log(`  -> Propagating to ${neighborId} via ${edge.relationType} (Score: ${propagatedScore})`);
          
          // Cập nhật node đích (Trong thực tế sẽ lấy điểm cao nhất giữa rủi ro hiện tại và rủi ro lan truyền)
          await this.updateNodeRisk(neighborId, propagatedScore, `Propagated from ${currentId} via ${edge.relationType}`);
          
          queue.push({ nodeId: neighborId, score: propagatedScore, depth: depth + 1 });
        }
      }
    }
  }

  private static async updateNodeRisk(nodeId: string, score: number, reason: string) {
    try {
      const node = await aiDbProvider.findUnique<any>('TrustGraphNode', nodeId);
      if (!node) return;

      // Nếu rủi ro mới cao hơn rủi ro cũ thì cập nhật
      if (score > (node.riskScore || 0)) {
        const level = RiskEngine.getRiskLevel(score);
        
        await aiDbProvider.update('TrustGraphNode', 
          nodeId, 
          { 
            riskScore: score, 
            riskLevel: level,
            lastRiskUpdate: new Date()
          }
        );

        // Lưu lịch sử
        await (aiDbProvider as any).create('RiskScoreHistory', {
          nodeId: nodeId,
          score: score,
          level: level,
          factors: [{ factor: 'Propagation', impact: score, description: reason }],
          createdAt: new Date()
        });
      }
    } catch (err) {
      console.error(`[RiskPropagation] Failed to update node ${nodeId}`, err);
    }
  }
}
