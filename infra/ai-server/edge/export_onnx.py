import os
from ultralytics import YOLO

class EdgeAIExporter:
    def __init__(self, model_path="models/yolov11-hurc-defects.pt", output_dir="edge_models"):
        self.model_path = model_path
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Tạo dummy model nếu chưa có model thật (Dành cho ngữ cảnh setup dự án)
        if not os.path.exists(self.model_path):
            print(f"⚠️ [EDGE] Model not found at {self.model_path}. Downloading a nano model for testing...")
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            self.model = YOLO("yolo11n.pt") # Tự động tải yolov11n.pt
            self.model.save(self.model_path)
        else:
            self.model = YOLO(self.model_path)

    def export_to_onnx(self):
        """
        Export mô hình sang ONNX.
        Đây là định dạng mở, giúp chạy mượt mà trên trình duyệt qua ONNX Runtime Web.
        """
        print(f"🚀 [EDGE] Bắt đầu chuyển đổi mô hình {self.model_path} sang định dạng ONNX...")
        
        try:
            # Export với format ONNX. Có thể thêm imgsz=320 để làm nhẹ thêm model cho mobile.
            success = self.model.export(
                format="onnx",
                imgsz=320,      # Giảm độ phân giải để thiết bị di động chạy nhanh hơn
                half=True,      # FP16 quantization (Tối ưu dung lượng giảm 50%)
                simplify=True,  # Đơn giản hoá kiến trúc mạng đồ thị
                workspace=self.output_dir
            )
            print(f"✅ [EDGE] Xuất mô hình ONNX thành công: {success}")
        except Exception as e:
            print(f"❌ [EDGE] Lỗi xuất mô hình: {e}")

    def export_to_tflite(self):
        """
        Export mô hình sang TensorFlow Lite (TFLite)
        Định dạng chuyên dụng cực kỳ phổ biến cho Android/iOS native app.
        """
        print(f"🚀 [EDGE] Bắt đầu chuyển đổi sang định dạng TensorFlow Lite (int8)...")
        try:
            success = self.model.export(
                format="tflite",
                int8=True,      # Quantization mức tối đa (int8), size model siêu nhẹ <10MB
                imgsz=320
            )
            print(f"✅ [EDGE] Xuất mô hình TFLite thành công: {success}")
        except Exception as e:
            print(f"❌ [EDGE] Lỗi xuất TFLite: {e}")

if __name__ == "__main__":
    exporter = EdgeAIExporter()
    exporter.export_to_onnx()
    # exporter.export_to_tflite() # Tạm khóa để tránh cần cài thêm TensorFlow
