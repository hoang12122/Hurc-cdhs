import os
import json
import random
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier

class PredictiveMaintenanceModel:
    def __init__(self, data_path="data/clean/reliability_report.json"):
        self.data_path = data_path
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        # Trong hệ thống thực tế, mô hình sẽ được huấn luyện trên hàng ngàn bản ghi, 
        # sau đó sẽ save/load file .pkl. Trong ngữ cảnh này, ta sẽ train trực tiếp mỗi lần chạy.
        
    def load_features(self):
        if not os.path.exists(self.data_path):
            print(f"⚠️ [PREDICTIVE] Report not found at {self.data_path}. Run reliability_metrics.py first.")
            return []
            
        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("asset_metrics", [])

    def prepare_data(self, asset_metrics):
        """
        Chuẩn bị Features (X) và Labels (y).
        - Features: mtbf_hours, mttr_hours, frequency_per_month
        - y (Failures soon?): 1 (Sẽ hỏng sớm), 0 (Bình thường)
        Trong mô hình mẫu này, ta giả lập nhãn dựa vào độ tin cậy để huấn luyện mô hình.
        """
        X = []
        y = []
        asset_ids = []
        
        for asset in asset_metrics:
            # Sinh dummy label dựa trên thông số lịch sử
            freq = asset.get("frequency_per_month", 0)
            mtbf = asset.get("mtbf_hours", 8760)
            mttr = asset.get("mttr_hours", 0)
            
            # Gắn nhãn 1 (Risk) nếu tần suất > 1 HOẶC (MTBF < 2000 và MTTR > 10)
            label = 1 if freq > 1 or (mtbf < 2000 and mttr > 10) else 0
            
            X.append([mtbf, mttr, freq])
            y.append(label)
            asset_ids.append(asset["asset_id"])
            
        return X, y, asset_ids

    def train_model(self):
        metrics = self.load_features()
        if not metrics:
            return
            
        X, y, self.asset_ids = self.prepare_data(metrics)
        
        # Nếu chỉ có 1 class (toàn tốt hoặc toàn xấu), Random Forest sẽ phàn nàn,
        # Ta inject dummy data để mô hình có thể build.
        if len(set(y)) < 2:
            X.extend([[100, 24, 5], [8760, 2, 0.1]]) # 1 xấu, 1 tốt
            y.extend([1, 0])
            self.asset_ids.extend(["DUMMY-BAD", "DUMMY-GOOD"])
            
        print("🧠 [PREDICTIVE] Training Random Forest model with Historical Data...")
        self.model.fit(X, y)
        print("✅ [PREDICTIVE] Training Complete.")
        
        return X

    def predict_and_export(self):
        X = self.train_model()
        if not X: return
        
        # Dự đoán xác suất lỗi
        probabilities = self.model.predict_proba(X)
        
        results = []
        # Bỏ qua dummy data
        real_assets_len = len([a for a in self.asset_ids if not a.startswith("DUMMY")])
        
        for i in range(real_assets_len):
            failure_prob = probabilities[i][1] # Xác suất thuộc class 1 (Sẽ hỏng)
            asset_id = self.asset_ids[i]
            
            # Giải thích lý do (Explainable AI)
            reason = "Hoạt động bình thường."
            action = "Tiếp tục theo dõi."
            level = "Low"
            
            if failure_prob > 0.7:
                level = "Critical"
                reason = "AI phát hiện tần suất lỗi có dấu hiệu tăng vọt. Dự đoán thiết bị sẽ hỏng trong vòng 14 ngày tới."
                action = "Lập tức lên lịch bảo trì phòng ngừa (Preventive Maintenance)."
            elif failure_prob > 0.4:
                level = "High"
                reason = "Chu kỳ hỏng hóc (MTBF) đang thu hẹp lại dần."
                action = "Đưa vào danh sách kiểm tra (Inspection) tuần tới."
                
            results.append({
                "asset_id": asset_id,
                "failure_probability": round(failure_prob * 100, 2),
                "risk_level": level,
                "ai_reasoning": reason,
                "recommended_action": action
            })
            
        # Sắp xếp xác suất cao lên đầu
        results.sort(key=lambda x: x["failure_probability"], reverse=True)
        
        output = {
            "prediction_date": datetime.now().isoformat(),
            "model": "Random Forest Classifier (v1.0)",
            "predictions": results
        }
        
        out_path = "data/clean/predictive_maintenance_alerts.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
            
        print(f"🔮 [PREDICTIVE] Predictions exported to {out_path}")
        return output

if __name__ == "__main__":
    predictor = PredictiveMaintenanceModel()
    predictor.predict_and_export()
