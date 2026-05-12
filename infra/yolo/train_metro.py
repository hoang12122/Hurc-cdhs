from ultralytics import YOLO

def main():
    print("🚀 Bắt đầu quá trình Fine-tuning YOLOv8 cho tuyến Metro...")
    
    # Load model pre-trained (chọn yolov8n.pt để cân bằng giữa tốc độ và độ chính xác)
    # Model này sẽ được lưu thành file mới sau khi train, đảm bảo không ghi đè model cũ.
    model = YOLO('yolov8n.pt')
    
    # Huấn luyện model
    results = model.train(
        data='metro_defects.yaml', # File cấu hình dataset
        epochs=100,                # Số vòng lặp huấn luyện
        imgsz=640,                 # Kích thước ảnh chuẩn
        batch=16,                  # Batch size
        name='yolov8_metro_v1',    # Tên model output (tạo phiên bản riêng)
        device='cpu',              # Đổi thành 'cuda' nếu có GPU NVIDIA
        patience=20,               # Dừng sớm nếu không cải thiện sau 20 epochs
        lr0=0.001                  # Learning rate ban đầu
    )
    
    print("✅ Hoàn tất huấn luyện!")
    print("📦 Trọng số model mới được lưu tại: runs/detect/yolov8_metro_v1/weights/best.pt")

    # Đánh giá model
    print("🔍 Đang đánh giá model (Validation)...")
    metrics = model.val()
    print(f"📊 Kết quả mAP50: {metrics.box.map50:.3f}")
    print(f"📊 Kết quả mAP50-95: {metrics.box.map:.3f}")

if __name__ == '__main__':
    main()
