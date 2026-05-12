import { aiDbProvider } from '../lib/services/db-wrapper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PHASE 9 - TASK 9.4: Risk Dashboard Generator
 * Generates a premium HTML report for Risk Analysis.
 */
async function generateRiskDashboard() {
  console.log('📊 Generating Risk Dashboard...');

  // 1. Lấy dữ liệu rủi ro từ TrustGraph
  const highRiskNodes = await aiDbProvider.findMany<any>('TrustGraphNode', {
    riskScore: { gte: 60 },
    orderBy: { riskScore: 'desc' },
    take: 10
  });

  // 2. Lấy các cụm lỗi gần đây từ Safety Log
  const clusters = await aiDbProvider.findMany<any>('AuditConsistencyCheckLog', {
    checkType: 'ERROR_CLUSTERING',
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const timestamp = new Date().toLocaleString();
  const reportPath = path.join(process.cwd(), 'reports', 'risk-dashboard.html');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hurc1CRM - Risk Intelligence Dashboard</title>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 40px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .title { font-size: 24px; font-weight: 700; color: #0f172a; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: left; padding: 12px; background: #f1f5f9; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .badge-critical { background: #fee2e2; color: #991b1b; }
        .badge-high { background: #ffedd5; color: #9a3412; }
        .badge-medium { background: #fef9c3; color: #854d0e; }
        .status-tag { display: inline-block; padding: 2px 6px; border-radius: 4px; background: #e0f2fe; color: #0369a1; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <div class="title">🚀 Risk Intelligence Dashboard</div>
                <div style="color: #64748b; font-size: 14px; margin-top: 4px;">Tình trạng an toàn hạ tầng Hurc1CRM | Cập nhật: ${timestamp}</div>
            </div>
            <div class="badge badge-critical" style="font-size: 14px; padding: 10px 20px;">
                Cảnh báo: ${highRiskNodes.length} Thiết bị rủi ro cao
            </div>
        </div>

        <div class="grid">
            <!-- Top 10 Risky Equipment -->
            <div class="card">
                <h3 style="margin-top:0">🔥 Top 10 Thiết bị rủi ro cao</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Thiết bị / Node</th>
                            <th>Mức độ</th>
                            <th>Điểm số</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${highRiskNodes.map(node => `
                            <tr>
                                <td><strong>${node.label}</strong><br><small style="color:#64748b">${node.sourceType} | ${node.sourceId || 'N/A'}</small></td>
                                <td><span class="badge badge-${node.riskLevel?.toLowerCase() || 'low'}">${node.riskLevel || 'LOW'}</span></td>
                                <td style="font-weight:700">${node.riskScore || 0}/100</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Recent Error Clusters -->
            <div class="card">
                <h3 style="margin-top:0">🧩 Cụm lỗi hệ thống (Clusters)</h3>
                ${clusters.length === 0 ? '<p style="color:#64748b">Chưa phát hiện cụm lỗi bất thường.</p>' : `
                    <table>
                        <thead>
                            <tr>
                                <th>Loại cụm</th>
                                <th>Chi tiết</th>
                                <th>Thời gian</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clusters.map(c => `
                                <tr>
                                    <td><span class="status-tag">${c.targetId || 'CLUSTER'}</span></td>
                                    <td>${c.issueDetails}</td>
                                    <td><small>${new Date(c.createdAt).toLocaleString()}</small></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        </div>

        <div class="card">
            <h3 style="margin-top:0">ℹ️ Giải thích mô hình (AI Reasoning)</h3>
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                Điểm rủi ro được tính toán dựa trên 4 yếu tố: Mức độ nghiêm trọng của sự cố (40%), Tần suất lỗi lặp lại (30%), 
                Tuổi đời thiết bị (10%) và Khoảng cách bảo trì (20%). Hệ thống tự động lan truyền rủi ro qua các mối quan hệ 
                <strong>PART_OF</strong> và <strong>CONNECTED_TO</strong> trong TrustGraph để phát hiện các rủi ro tiềm ẩn.
            </p>
        </div>
    </div>
</body>
</html>
  `;

  if (!fs.existsSync(path.dirname(reportPath))) fs.mkdirSync(path.dirname(reportPath));
  fs.writeFileSync(reportPath, html);
  console.log(`✅ Risk Dashboard generated at: ${reportPath}`);
}

generateRiskDashboard().catch(console.error);
