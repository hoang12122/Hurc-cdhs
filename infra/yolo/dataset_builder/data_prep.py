import os
import shutil
import random
from pathlib import Path

# Cấu hình
RAW_DIR = Path('./raw_images')
DATASET_DIR = Path('../dataset')
SPLIT_RATIO = {'train': 0.8, 'val': 0.1, 'test': 0.1}

def setup_directories():
    """Tạo cấu trúc thư mục chuẩn YOLO"""
    for split in ['train', 'val', 'test']:
        (DATASET_DIR / 'images' / split).mkdir(parents=True, exist_ok=True)
        (DATASET_DIR / 'labels' / split).mkdir(parents=True, exist_ok=True)
    print("✅ Đã khởi tạo cấu trúc thư mục YOLO dataset.")

def process_and_split():
    """Phân chia dữ liệu thành Train (80%), Val (10%), Test (10%)"""
    if not RAW_DIR.exists():
        RAW_DIR.mkdir()
        print(f"⚠️ Thư mục {RAW_DIR} chưa tồn tại. Đã tạo mới. Vui lòng copy ảnh và label vào đây.")
        return

    # Lấy danh sách tất cả file ảnh (jpg, png, jpeg)
    valid_extensions = ('.jpg', '.jpeg', '.png')
    images = [f for f in RAW_DIR.iterdir() if f.suffix.lower() in valid_extensions]
    
    if not images:
        print("⚠️ Không tìm thấy ảnh nào trong thư mục raw_images.")
        return

    # Trộn ngẫu nhiên
    random.seed(42)
    random.shuffle(images)

    total = len(images)
    train_end = int(total * SPLIT_RATIO['train'])
    val_end = train_end + int(total * SPLIT_RATIO['val'])

    splits = {
        'train': images[:train_end],
        'val': images[train_end:val_end],
        'test': images[val_end:]
    }

    print(f"📦 Đang xử lý {total} ảnh...")

    for split_name, img_list in splits.items():
        for img_path in img_list:
            # Copy ảnh
            dest_img = DATASET_DIR / 'images' / split_name / img_path.name
            shutil.copy2(img_path, dest_img)

            # Tìm và copy file label (.txt) tương ứng
            label_path = img_path.with_suffix('.txt')
            if label_path.exists():
                dest_label = DATASET_DIR / 'labels' / split_name / label_path.name
                shutil.copy2(label_path, dest_label)
            else:
                # Nếu không có label (background image / no defect)
                # YOLOv8 hỗ trợ background image bằng cách để trống file txt
                dest_label = DATASET_DIR / 'labels' / split_name / label_path.name
                dest_label.touch()

    print(f"✅ Hoàn tất! Train: {len(splits['train'])} | Val: {len(splits['val'])} | Test: {len(splits['test'])}")

if __name__ == "__main__":
    print("🚀 Bắt đầu quá trình chuẩn hóa bộ dữ liệu Metro Defects...")
    setup_directories()
    process_and_split()
