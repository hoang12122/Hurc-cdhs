import nbformat as nbf
import os

def create_lstm_notebook(output_dir):
    nb = nbf.v4.new_notebook()
    
    # Markdown cell 1
    markdown_1 = """# LSTM V2 (NumPy/Adam) Training Showcase
Sổ tay này trực quan hóa thuật toán Mạng nơ-ron hồi quy dài-ngắn hạn (LSTM) hoàn toàn bằng Toán học và NumPy.
**HURC CDHS - Môi trường Hệ thống Air-gapped.**"""
    
    # Code cell 1: Import
    code_1 = """import numpy as np
import matplotlib.pyplot as plt
import sys
import os
sys.path.append(os.path.abspath('..'))
from lstm_advanced import AdvancedStackedLSTM"""
    
    # Markdown cell 2
    markdown_2 = """## 1. Khởi tạo Mô hình và Dữ liệu
Chúng ta sẽ giả lập một cụm 3 thiết bị (Mini-batch) và chuỗi thời gian là 5 bước."""
    
    # Code cell 2: Init
    code_2 = """# Cấu trúc: 3 Input -> LSTM 16 -> LSTM 8 -> Output 1
model = AdvancedStackedLSTM(layer_dims=[3, 16, 8, 1], learning_rate=0.05)

# (seq_len=5, batch_size=3, input_dim=3)
x_batch = np.random.rand(5, 3, 3) 
# Máy 0: Hỏng (1), Máy 1: Tốt (0), Máy 2: Tốt (0)
y_batch = np.array([[1.0], [0.0], [0.0]]) 

print("Khởi tạo dữ liệu thành công!")"""
    
    # Markdown cell 3
    markdown_3 = """## 2. Huấn luyện (Training) với Adam Optimizer
Theo dõi đường cong Loss Curve để xem thuật toán tối ưu hóa của chúng ta hội tụ nhanh như thế nào!"""
    
    # Code cell 3: Train
    code_3 = """losses = []
epochs = 200

for epoch in range(epochs):
    loss = model.train_batch(x_batch, y_batch)
    losses.append(loss)
    if epoch % 20 == 0:
        print(f"Epoch {epoch:3d} | Loss: {loss:.4f}")

plt.figure(figsize=(10, 5))
plt.plot(losses, color='#4f46e5', linewidth=2)
plt.title('Hội tụ Mất mát (BCE Loss) qua các Vòng lặp')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.grid(True, linestyle='--', alpha=0.7)
plt.show()"""

    # Markdown cell 4
    markdown_4 = """## 3. Suy luận (Inference)
Đánh giá xác suất dự đoán của 3 thiết bị sau khi huấn luyện."""

    # Code cell 4: Inference
    code_4 = """predictions, _ = model.forward(x_batch)
for i in range(3):
    print(f"Thiết bị {i} | Thực tế: {y_batch[i, 0]} | Dự đoán: {predictions[i, 0]:.4f} ({predictions[i, 0]*100:.1f}%)")"""

    nb['cells'] = [
        nbf.v4.new_markdown_cell(markdown_1),
        nbf.v4.new_code_cell(code_1),
        nbf.v4.new_markdown_cell(markdown_2),
        nbf.v4.new_code_cell(code_2),
        nbf.v4.new_markdown_cell(markdown_3),
        nbf.v4.new_code_cell(code_3),
        nbf.v4.new_markdown_cell(markdown_4),
        nbf.v4.new_code_cell(code_4)
    ]
    
    filepath = os.path.join(output_dir, 'lstm_training_demo.ipynb')
    with open(filepath, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    print(f"Created: {filepath}")

def create_rag_notebook(output_dir):
    nb = nbf.v4.new_notebook()
    
    markdown_1 = """# RAG Engine (TF-IDF) Showcase
Sổ tay minh bạch hóa thuật toán Tìm kiếm tài liệu Offline cho trợ lý ảo Maintenance Copilot."""
    
    code_1 = """import sys
import os
sys.path.append(os.path.abspath('..'))
from rag_engine import tf_idf_search, MANUAL_PAGES, tokenize"""
    
    markdown_2 = """## 1. Dữ liệu Kho tài liệu (Knowledge Base)"""
    
    code_2 = """for i, doc in enumerate(MANUAL_PAGES):
    print(f"[{doc['category']}] {doc['text'][:80]}...")"""
    
    markdown_3 = """## 2. Phân tách và Tính điểm (Tokenization & TF-IDF Scoring)"""
    
    code_3 = """query = "Mã lỗi E-404 của máy"
print(f"Câu hỏi: {query}")
print(f"Tokens: {tokenize(query)}\n")

for doc in MANUAL_PAGES:
    doc_tokens = tokenize(doc['text'])
    score = sum(1 for q in set(tokenize(query)) if q in doc_tokens)
    print(f"Document: {doc['category']}")
    print(f"Match Score: {score}")
    print("-" * 30)"""

    nb['cells'] = [
        nbf.v4.new_markdown_cell(markdown_1),
        nbf.v4.new_code_cell(code_1),
        nbf.v4.new_markdown_cell(markdown_2),
        nbf.v4.new_code_cell(code_2),
        nbf.v4.new_markdown_cell(markdown_3),
        nbf.v4.new_code_cell(code_3)
    ]
    
    filepath = os.path.join(output_dir, 'rag_engine_demo.ipynb')
    with open(filepath, 'w', encoding='utf-8') as f:
        nbf.write(nb, f)
    print(f"Created: {filepath}")

if __name__ == "__main__":
    output_dir = os.path.join(os.path.dirname(__file__), 'notebooks')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    create_lstm_notebook(output_dir)
    create_rag_notebook(output_dir)
    print("Notebook generation complete!")
