from ultralytics import YOLO

def main():
    print("🚀 Bắt đầu quá trình Fine-tuning YOLOv8-SEG (Segmentation) cho tuyến Metro...")
    
    # Load model segmentation pre-trained
    # yolov8n-seg.pt cho phép tạo ra các mask thay vì chỉ bounding box
    model = YOLO('yolov8n-seg.pt')
    
    # Huấn luyện model
    results = model.train(
        data='metro_defects_seg.yaml', # Cần cấu hình dataset segmentation chứa polygon/mask
        epochs=100,                
        imgsz=640,                 
        batch=16,                  
        name='yolov8_metro_seg_v1',    # Không ghi đè model gốc
        device='cpu',              
        patience=20,               
        lr0=0.001                  
    )
    
    print("✅ Hoàn tất huấn luyện Segmentation!")
    print("📦 Trọng số model mới được lưu tại: runs/segment/yolov8_metro_seg_v1/weights/best.pt")

if __name__ == '__main__':
    main()
