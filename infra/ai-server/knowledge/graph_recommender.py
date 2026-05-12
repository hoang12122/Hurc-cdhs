import os
import json

class GraphRecommender:
    def __init__(self, graph_data_path="data/clean/graph/bom_graph_nodes.json"):
        self.graph_data_path = graph_data_path
        self.nodes = []
        self.edges = []
        self.load_graph()
        
        # Hardcode Graph Rules cho phiên bản mẫu
        self.fallback_rules = {
            "bánh xe bị mòn": [
                "Kiểm tra Vòng bi",
                "Kiểm tra Trục bánh xe",
                "Kiểm tra Giá chuyển hướng (Bogie)",
                "Đo lường độ mòn của Ray tiếp xúc",
                "Lấy vật tư dự phòng: BRAKE-PAD-X"
            ],
            "kẹt cơ khí": [
                "Kiểm tra Vành răng",
                "Kiểm tra Cảm biến quang (SENSOR-05)",
                "Bôi trơn trục xoay"
            ]
        }

    def load_graph(self):
        if os.path.exists(self.graph_data_path):
            with open(self.graph_data_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.nodes = data.get("nodes", [])
                self.edges = data.get("edges", [])

    def get_related_components(self, defect_description):
        """
        Duyệt đồ thị (hoặc dùng Rule base) để đưa ra đề xuất kiểm tra liên quan.
        """
        defect_lower = defect_description.lower()
        
        # Kết hợp Rule cũ và Knowledge Graph
        recommendations = []
        
        # 1. Tìm trong Fallback Rules (Quy tắc cũ)
        for key, recs in self.fallback_rules.items():
            if key in defect_lower:
                recommendations.extend([{"item": rec, "source": "Rule Base"} for rec in recs])
                
        # 2. Duyệt qua Graph Nodes (Đồ thị mới)
        # Giả lập: Nếu lỗi liên quan đến cổng (gate), tìm vật tư liên quan từ Graph
        if "cổng" in defect_lower or "gate" in defect_lower:
            gate_parts = [edge["to"] for edge in self.edges if "gate" in edge["from"].lower()]
            for part_id in gate_parts:
                part_node = next((n for n in self.nodes if n["id"] == part_id), None)
                if part_node:
                    part_name = part_node["properties"].get("name", part_id)
                    stock = part_node["properties"].get("stock_quantity", 0)
                    recommendations.append({
                        "item": f"Kiểm tra/Thay thế: {part_name} (Tồn kho: {stock})",
                        "source": "Knowledge Graph"
                    })

        return {
            "defect": defect_description,
            "recommendations": recommendations,
            "status": "success"
        }

if __name__ == "__main__":
    recommender = GraphRecommender()
    print(json.dumps(recommender.get_related_components("Bánh xe bị mòn và rít"), ensure_ascii=False, indent=2))
    print(json.dumps(recommender.get_related_components("Lỗi kẹt cơ khí ở cổng soát vé"), ensure_ascii=False, indent=2))
