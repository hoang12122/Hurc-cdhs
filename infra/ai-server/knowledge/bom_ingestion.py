import os
import json
import uuid

class BOMIngestion:
    def __init__(self, bom_dir="data/raw/bom", graph_export_dir="data/clean/graph"):
        self.bom_dir = bom_dir
        self.graph_export_dir = graph_export_dir
        os.makedirs(self.bom_dir, exist_ok=True)
        os.makedirs(self.graph_export_dir, exist_ok=True)
        
        # Mappings
        self.asset_map = {
            "gate": "Gate",
            "tvm": "Ticket Vending Machine",
            "train": "Rolling Stock Train"
        }

    def normalize_part_name(self, name):
        if not name: return "Unknown Part"
        # Xóa khoảng trắng thừa, in hoa chữ cái đầu
        return " ".join(name.strip().split()).title()

    def normalize_asset_code(self, code):
        if not code: return "UNKNOWN"
        return code.strip().upper()

    def process_bom_data(self, raw_bom_list):
        print(f"📦 [BOM] Processing {len(raw_bom_list)} raw BOM records...")
        
        nodes = []
        edges = []
        
        for record in raw_bom_list:
            # Thu thập và Chuẩn hóa
            part_no = record.get("part_number", str(uuid.uuid4())[:8])
            part_name = self.normalize_part_name(record.get("part_name", ""))
            asset_code = self.normalize_asset_code(record.get("asset_code", ""))
            stock = int(record.get("stock_quantity", 0))
            om_doc = record.get("om_document", None)
            dnf_history = record.get("dnf_history_id", None)
            
            # Khởi tạo Node Vật tư (SparePart)
            spare_part_node = {
                "id": f"PART-{part_no}",
                "label": "SparePart",
                "properties": {
                    "name": part_name,
                    "part_number": part_no,
                    "stock_quantity": stock
                }
            }
            nodes.append(spare_part_node)
            
            # Gắn mã vật tư với thiết bị (CONTAINS_PART hoặc REQUIRES_SPARE)
            edges.append({
                "from": f"ASSET-{asset_code}",
                "to": f"PART-{part_no}",
                "type": "CONTAINS_PART"
            })
            
            # Liên kết vật tư với tài liệu O&M
            if om_doc:
                edges.append({
                    "from": f"PART-{part_no}",
                    "to": f"DOC-{om_doc}",
                    "type": "REFERENCED_BY"
                })
                
            # Liên kết vật tư với lịch sử DNF
            if dnf_history:
                edges.append({
                    "from": f"DNF-{dnf_history}",
                    "to": f"PART-{part_no}",
                    "type": "REQUIRES_SPARE"
                })

        return nodes, edges

    def export_graph_data(self, raw_bom_list, output_filename="bom_graph_nodes.json"):
        nodes, edges = self.process_bom_data(raw_bom_list)
        
        graph_payload = {
            "metadata": {
                "source": "BOM",
                "total_parts": len(nodes),
                "total_relationships": len(edges)
            },
            "nodes": nodes,
            "edges": edges
        }
        
        out_path = os.path.join(self.graph_export_dir, output_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(graph_payload, f, ensure_ascii=False, indent=2)
            
        print(f"✅ [BOM] Ingestion complete. Exported {len(nodes)} parts and {len(edges)} relationships to {out_path}.")
        return out_path

if __name__ == "__main__":
    # Mock Data cho BOM
    mock_bom = [
        {
            "part_number": "GEAR-101",
            "part_name": "vành răng cổng soát vé   ",
            "asset_code": "gate-02",
            "stock_quantity": 15,
            "om_document": "OM-GATE-2024",
            "dnf_history_id": "DNF-001"
        },
        {
            "part_number": "SENSOR-05",
            "part_name": "cảm biến quang",
            "asset_code": "gate-02",
            "stock_quantity": 8,
            "om_document": "OM-GATE-2024",
            "dnf_history_id": None
        },
        {
            "part_number": "BRAKE-PAD-X",
            "part_name": "Má phanh tàu hỏa",
            "asset_code": "train-01",
            "stock_quantity": 4,
            "om_document": "OM-TRAIN-BOGIE",
            "dnf_history_id": "DNF-002"
        }
    ]
    
    ingestor = BOMIngestion()
    ingestor.export_graph_data(mock_bom)
