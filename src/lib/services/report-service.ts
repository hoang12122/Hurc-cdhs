import { calculateStrategicScorecard, generateCEOInsights, type StrategicScorecard } from './strategic-metrics';
import fs from 'fs';
import path from 'path';

/**
 * CEO REPORT SERVICE
 * Tự động hóa việc tạo báo cáo quản trị chiến lược
 */

export async function generateWeeklyCeoReport(): Promise<{ success: boolean; filePath: string; content: string }> {
    const scorecard = await calculateStrategicScorecard();
    const insights = await generateCEOInsights(scorecard);
    
    const reportDate = new Date().toISOString().split('T')[0];
    const fileName = `CEO_Strategic_Report_${reportDate}.md`;
    const reportDir = path.join(process.cwd(), 'data', 'reports', 'ceo');
    
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    const filePath = path.join(reportDir, fileName);

    const content = `
# BÁO CÁO QUẢN TRỊ CHIẾN LƯỢC HURC1
**Ngày lập:** ${new Date().toLocaleString('vi-VN')}
**Đối tượng:** Ban Giám đốc (CEO Office)
**Bảo mật:** TỐI MẬT (Chỉ lưu hành nội bộ)

---

## 1. TỔNG QUAN SỨC KHỎE HỆ THỐNG
> [!IMPORTANT]
> **Health Score: ${scorecard.metrics.quality.healthScore}%**
> Trạng thái: ${scorecard.metrics.quality.healthScore > 80 ? 'AN TOÀN' : 'CẦN GIÁM SÁT'}

### Chỉ số cốt lõi:
- **Năng suất vận hành:** ${scorecard.metrics.operations.productivityIndex}%
- **Tỉ lệ giữ chân nhân sự:** ${scorecard.metrics.humanCapital.retentionRate}%
- **Rủi ro lỗi nghiêm trọng:** ${scorecard.metrics.safety.criticalFailureRisk > 0.5 ? 'CAO ⚠️' : 'THẤP ✅'}

---

## 2. NHẬN ĐỊNH CHIẾN LƯỢC (AI INSIGHTS)
*Phân tích bởi Gemma-4 Local Brain*

${insights.map(i => `- ${i}`).join('\n')}

---

## 3. CHI TIẾT CÁC TRỤ CỘT

### VẬN HÀNH & HỆ THỐNG
- Tỉ lệ khai thác máy móc: ${scorecard.metrics.operations.utilizationRate}%
- Chỉ số kiểm soát chi phí: ${scorecard.metrics.operations.costRatio * 100}%

### NHÂN SỰ & VĂN HÓA
- Năng suất lao động bình quân: ${scorecard.metrics.humanCapital.laborProductivity} task/người
- Tỉ lệ ổn định đội ngũ: ${scorecard.metrics.humanCapital.retentionRate}%

### AN TOÀN & CHẤT LƯỢNG
- Tỉ lệ xử lý mối nguy: ${scorecard.metrics.safety.hazardMitigationRate}%
- Tỉ lệ phục hồi dịch vụ: ${scorecard.metrics.quality.serviceRecoveryRate}%

---

## 4. KHUYẾN NGHỊ HÀNH ĐỘNG
1. **Ưu tiên:** Tập trung nguồn lực vào các Hazard cấp độ I (nếu có).
2. **Vận hành:** Tối ưu hóa ca trực tại các trạm có chỉ số Productivity thấp.
3. **Chiến lược:** Duy trì chính sách AI Local để bảo vệ chủ quyền dữ liệu.

---
*Báo cáo được tạo tự động bởi Hệ thống Quản trị HURC1 - Local AI Edition.*
`;

    fs.writeFileSync(filePath, content);

    return {
        success: true,
        filePath,
        content
    };
}
