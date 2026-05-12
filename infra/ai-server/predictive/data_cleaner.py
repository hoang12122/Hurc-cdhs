import os
import json
import uuid
from datetime import datetime

class MaintenanceDataCleaner:
    def __init__(self, raw_data_dir="data/raw", clean_data_dir="data/clean"):
        self.raw_data_dir = raw_data_dir
        self.clean_data_dir = clean_data_dir
        os.makedirs(self.raw_data_dir, exist_ok=True)
        os.makedirs(self.clean_data_dir, exist_ok=True)
        
        # Mappings chuẩn hóa
        self.location_map = {
            "ga bt": "Ga Bến Thành",
            "bt": "Ga Bến Thành",
            "ben thanh": "Ga Bến Thành",
            "suoi tien": "Ga Suối Tiên",
            "st": "Ga Suối Tiên"
        }
        
        self.defect_map = {
            "ket co": "Kẹt cơ khí",
            "hu hong": "Hư hỏng",
            "mat dien": "Mất nguồn điện",
            "ri set": "Rỉ sét"
        }

    def normalize_location(self, loc):
        if not loc: return "Không xác định"
        loc = loc.strip().lower()
        return self.location_map.get(loc, loc.title())

    def normalize_defect(self, defect):
        if not defect: return "Không xác định"
        defect = defect.strip().lower()
        return self.defect_map.get(defect, defect.capitalize())

    def parse_date(self, date_str):
        # Cố gắng parse nhiều định dạng khác nhau
        if not date_str: return None
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S.%fZ"):
            try:
                return datetime.strptime(date_str, fmt).isoformat()
            except ValueError:
                pass
        return None

    def process_dnf_records(self, records):
        """
        Làm sạch, chuẩn hóa và gỡ trùng lặp các record DNF
        """
        clean_records = []
        seen_ids = set()

        for rec in records:
            # 1. Bỏ qua nếu thiếu dữ liệu quan trọng hoặc bị trùng ID
            rec_id = rec.get("id", str(uuid.uuid4()))
            if rec_id in seen_ids:
                continue
            
            # 2. Chuẩn hóa Mã thiết bị & Vị trí
            asset_id = rec.get("asset_id", "UNKNOWN_ASSET").strip().upper()
            location = self.normalize_location(rec.get("location", ""))
            
            # 3. Chuẩn hóa Loại lỗi
            defect_type = self.normalize_defect(rec.get("defect_type", ""))
            
            # 4. Chuẩn hóa Thời gian
            issue_date = self.parse_date(rec.get("identification_date", ""))
            resolve_date = self.parse_date(rec.get("resolution_date", ""))

            # Ghi nhận bản ghi đã làm sạch
            clean_rec = {
                "id": rec_id,
                "asset_id": asset_id,
                "location": location,
                "defect_type": defect_type,
                "identification_date": issue_date,
                "resolution_date": resolve_date,
                "source": "DNF"
            }
            clean_records.append(clean_rec)
            seen_ids.add(rec_id)
            
        return clean_records

    def process_inspection_records(self, records):
        """
        Làm sạch, chuẩn hóa và gỡ trùng lặp các record Inspection
        """
        clean_records = []
        for rec in records:
            asset_id = rec.get("asset_id", "UNKNOWN_ASSET").strip().upper()
            inspection_date = self.parse_date(rec.get("inspection_date", ""))
            status = rec.get("status", "Normal").capitalize()
            
            clean_records.append({
                "id": rec.get("id", str(uuid.uuid4())),
                "asset_id": asset_id,
                "inspection_date": inspection_date,
                "status": status,
                "source": "INSPECTION"
            })
        return clean_records

    def export_dataset(self, dnf_records, inspection_records, output_filename="maintenance_dataset_v1.json"):
        """
        Hợp nhất DNF và Inspection thành Dataset chuẩn cho AI Dự đoán.
        """
        print(f"🧹 [DATA CLEANER] Processing {len(dnf_records)} DNF records and {len(inspection_records)} Inspection records...")
        
        clean_dnf = self.process_dnf_records(dnf_records)
        clean_inspection = self.process_inspection_records(inspection_records)
        
        dataset = {
            "metadata": {
                "created_at": datetime.now().isoformat(),
                "total_dnf": len(clean_dnf),
                "total_inspections": len(clean_inspection)
            },
            "dnf_history": clean_dnf,
            "inspection_history": clean_inspection
        }
        
        out_path = os.path.join(self.clean_data_dir, output_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)
            
        print(f"✅ [DATA CLEANER] Standardization complete. Dataset saved to {out_path}")
        return out_path

if __name__ == "__main__":
    # Test Mock Data
    mock_dnf = [
        {"id": "DNF-001", "asset_id": "Gate-02", "location": "ga bt", "defect_type": "ket co", "identification_date": "2026-05-01"},
        {"id": "DNF-001", "asset_id": "Gate-02", "location": "ga bt", "defect_type": "ket co", "identification_date": "2026-05-01"}, # Duplicate
        {"id": "DNF-002", "asset_id": "Train-01", "location": "suoi tien", "defect_type": "hu hong", "identification_date": "05/05/2026"}
    ]
    mock_ins = [
        {"id": "INS-001", "asset_id": "Gate-02", "inspection_date": "2026-04-20", "status": "normal"},
        {"id": "INS-002", "asset_id": "Train-01", "inspection_date": "2026-05-02", "status": "warning"}
    ]
    
    cleaner = MaintenanceDataCleaner()
    cleaner.export_dataset(mock_dnf, mock_ins)
