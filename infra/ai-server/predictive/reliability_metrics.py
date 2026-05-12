import os
import json
from datetime import datetime

class ReliabilityAnalyzer:
    def __init__(self, data_path="data/clean/maintenance_dataset_v1.json"):
        self.data_path = data_path
        self.dataset = self.load_data()

    def load_data(self):
        if not os.path.exists(self.data_path):
            print(f"⚠️ [RELIABILITY] Dataset not found at {self.data_path}")
            return {"dnf_history": [], "inspection_history": []}
        with open(self.data_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def calculate_mttr(self, dnf_records):
        """
        Mean Time To Repair (MTTR) = Tổng thời gian sửa chữa / Số lần sửa chữa
        """
        total_hours = 0
        count = 0
        for rec in dnf_records:
            if rec.get("identification_date") and rec.get("resolution_date"):
                start = datetime.fromisoformat(rec["identification_date"])
                end = datetime.fromisoformat(rec["resolution_date"])
                if end > start:
                    total_hours += (end - start).total_seconds() / 3600
                    count += 1
        return round(total_hours / count, 2) if count > 0 else 0

    def analyze_asset_reliability(self):
        """
        Phân tích độ tin cậy của thiết bị (MTBF, MTTR, Tần suất lỗi)
        """
        dnf_history = self.dataset.get("dnf_history", [])
        
        # Nhóm theo thiết bị
        assets = {}
        for rec in dnf_history:
            asset_id = rec.get("asset_id")
            if not asset_id: continue
            
            if asset_id not in assets:
                assets[asset_id] = []
            assets[asset_id].append(rec)
            
        metrics = []
        for asset_id, records in assets.items():
            failure_count = len(records)
            mttr = self.calculate_mttr(records)
            
            # Tính MTBF (Mean Time Between Failures)
            # Tạm tính: Giả định thiết bị chạy 24/7 trong khoảng thời gian quan sát (ví dụ 1 năm = 8760 giờ)
            # MTBF = Tổng thời gian hoạt động / Số lần lỗi
            assumed_operating_hours = 8760 
            mtbf = round(assumed_operating_hours / failure_count, 2) if failure_count > 0 else assumed_operating_hours
            
            # Tần suất lỗi: Số lỗi / tháng
            failure_frequency = round(failure_count / 12, 2)
            
            # Đánh giá nguy cơ (Risk Level)
            risk_level = "Low"
            if failure_frequency >= 2 or mttr > 48:
                risk_level = "Critical"
            elif failure_frequency >= 1 or mttr > 24:
                risk_level = "High"
                
            metrics.append({
                "asset_id": asset_id,
                "failure_count": failure_count,
                "mtbf_hours": mtbf,
                "mttr_hours": mttr,
                "frequency_per_month": failure_frequency,
                "risk_level": risk_level
            })
            
        # Sắp xếp thiết bị có nguy cơ cao nhất lên đầu
        metrics.sort(key=lambda x: x["failure_count"], reverse=True)
        return metrics

    def export_report(self):
        metrics = self.analyze_asset_reliability()
        report = {
            "generated_at": datetime.now().isoformat(),
            "total_assets_analyzed": len(metrics),
            "high_risk_assets": [m for m in metrics if m["risk_level"] in ["High", "Critical"]],
            "asset_metrics": metrics
        }
        
        out_path = "data/clean/reliability_report.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
            
        print(f"📊 [RELIABILITY] Analyzed {len(metrics)} assets. Found {len(report['high_risk_assets'])} high-risk assets.")
        return report

if __name__ == "__main__":
    analyzer = ReliabilityAnalyzer()
    analyzer.export_report()
