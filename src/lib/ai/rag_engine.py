import sys
import json
import math
import re

# Giả lập Kho tài liệu Kỹ thuật Bảo trì (Knowledge Base)
MANUAL_PAGES = [
    {"id": "doc_1", "text": "Mã lỗi E-404 trên động cơ kéo (Traction Motor) biểu thị tình trạng quá nhiệt stator. Cách khắc phục: 1. Dừng tàu khẩn cấp. 2. Kiểm tra quạt làm mát. 3. Vệ sinh bộ lọc bụi.", "category": "Motor"},
    {"id": "doc_2", "text": "Bảo dưỡng định kỳ hộp số (Gearbox) mức 2: Yêu cầu thay dầu bôi trơn sau mỗi 50,000 km. Sử dụng dầu Castrol Syntrans. Kiểm tra độ rơ của bánh răng, độ rung cho phép dưới 4.5 mm/s.", "category": "Gearbox"},
    {"id": "doc_3", "text": "Hệ thống phanh hãm (Brake System) báo đèn đỏ: Cảm biến áp suất khí nén có thể bị rò rỉ. Cần xả e, thay thế van một chiều và reset bộ điều khiển trung tâm (BCU).", "category": "Brake"},
    {"id": "doc_4", "text": "Thay thế phụ tùng vòng bi (Bearing): Yêu cầu sử dụng kích thủy lực, tháo trục bánh xe. Không dùng búa đập trực tiếp vào ca ngoài của vòng bi.", "category": "Wheel"}
]

def tokenize(text):
    return re.findall(r'\w+', text.lower())

def tf_idf_search(query, docs):
    query_tokens = set(tokenize(query))
    
    best_match = None
    highest_score = 0
    
    for doc in docs:
        doc_tokens = tokenize(doc["text"])
        score = 0
        for q in query_tokens:
            if q in doc_tokens:
                score += 1 # Mô phỏng BM25 / TF-IDF đơn giản
        
        if score > highest_score:
            highest_score = score
            best_match = doc

    return best_match, highest_score

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            query_json = sys.argv[1]
            data = json.loads(query_json)
            query = data.get("query", "")
            
            best_match, score = tf_idf_search(query, MANUAL_PAGES)
            
            if score > 0:
                answer = f"Theo Cẩm nang Bảo trì ({best_match['category']}):\n{best_match['text']}"
            else:
                answer = "Xin lỗi, tôi không tìm thấy thông tin phù hợp trong kho tài liệu kỹ thuật."
            
            print(json.dumps({
                "answer": answer,
                "confidence": score,
                "engine": "TF-IDF Offline RAG"
            }))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        print(json.dumps({"error": "No query provided"}))
