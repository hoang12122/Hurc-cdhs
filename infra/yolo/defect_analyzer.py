import numpy as np

def calculate_defect_severity(mask_array, image_shape):
    """
    Tính toán diện tích và mức độ nghiêm trọng dựa trên Segmentation Mask của YOLOv8-seg.
    Giúp kỹ sư hiện trường không cần ước lượng bằng mắt.
    """
    # mask_array: ma trận numpy 2D (giá trị > 0 tại vùng bị lỗi)
    defect_area_pixels = np.sum(mask_array > 0)
    total_area_pixels = image_shape[0] * image_shape[1]
    
    # Tính tỷ lệ % diện tích lỗi so với tổng thể ảnh (hoặc so với diện tích thiết bị)
    defect_ratio = (defect_area_pixels / total_area_pixels) * 100
    
    # Phân loại mức độ nghiêm trọng
    severity = 'Low'
    if defect_ratio > 30:
        severity = 'Critical'
    elif defect_ratio > 10:
        severity = 'High'
    elif defect_ratio > 5:
        severity = 'Medium'
        
    return {
        "defect_area_px": int(defect_area_pixels),
        "total_area_px": int(total_area_pixels),
        "defect_ratio_percent": round(float(defect_ratio), 2),
        "severity": severity
    }

# Mock testing để hệ thống CRM gọi tới
if __name__ == "__main__":
    print("🧪 Test tính toán diện tích phân vùng lỗi (Segmentation)...")
    mock_mask = np.zeros((640, 640))
    # Tạo một vùng lỗi giả lập (200x200 pixel = 40,000 px)
    mock_mask[100:300, 100:300] = 1 
    
    result = calculate_defect_severity(mock_mask, (640, 640))
    print(f"Kết quả phân tích từ AI Mask: {result}")
