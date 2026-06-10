import sys
import json
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

class SimpleNumPyLSTM:
    """
    A pure NumPy implementation of an LSTM cell and sequence processor.
    Designed for air-gapped systems without TensorFlow/PyTorch.
    """
    def __init__(self, input_size, hidden_size):
        self.input_size = input_size
        self.hidden_size = hidden_size
        
        # Initialize weights with Xavier/Glorot initialization
        # Concatenate weights for 4 gates: Forget, Input, Candidate, Output
        self.W = np.random.randn(hidden_size, input_size + hidden_size) * np.sqrt(2.0 / (input_size + hidden_size))
        self.W_f = np.random.randn(hidden_size, input_size + hidden_size) * np.sqrt(2.0 / (input_size + hidden_size))
        self.W_i = np.random.randn(hidden_size, input_size + hidden_size) * np.sqrt(2.0 / (input_size + hidden_size))
        self.W_c = np.random.randn(hidden_size, input_size + hidden_size) * np.sqrt(2.0 / (input_size + hidden_size))
        self.W_o = np.random.randn(hidden_size, input_size + hidden_size) * np.sqrt(2.0 / (input_size + hidden_size))
        
        self.b_f = np.zeros((hidden_size, 1))
        self.b_i = np.zeros((hidden_size, 1))
        self.b_c = np.zeros((hidden_size, 1))
        self.b_o = np.zeros((hidden_size, 1))
        
        # Output layer weights to map hidden state to prediction (0 to 1 risk score)
        self.W_y = np.random.randn(1, hidden_size) * 0.1
        self.b_y = np.zeros((1, 1))

    def forward(self, x_seq):
        """
        x_seq shape: (time_steps, input_size)
        """
        h_prev = np.zeros((self.hidden_size, 1))
        c_prev = np.zeros((self.hidden_size, 1))
        
        # We will process sequence step by step
        for x in x_seq:
            x = x.reshape(-1, 1)
            # Concatenate input and hidden state
            z = np.vstack((h_prev, x))
            
            # LSTM gates
            f = sigmoid(np.dot(self.W_f, z) + self.b_f)
            i = sigmoid(np.dot(self.W_i, z) + self.b_i)
            c_bar = tanh(np.dot(self.W_c, z) + self.b_c)
            
            # Cell state update
            c = f * c_prev + i * c_bar
            
            # Output gate
            o = sigmoid(np.dot(self.W_o, z) + self.b_o)
            
            # Hidden state update
            h = o * tanh(c)
            
            h_prev = h
            c_prev = c
            
        # Predict failure probability using the final hidden state
        y = sigmoid(np.dot(self.W_y, h_prev) + self.b_y)
        return y.item()

def predict_health(equipment_data):
    """
    Mô phỏng tiền xử lý dữ liệu và chạy LSTM.
    Dữ liệu đầu vào:
    - age_days: số ngày hoạt động
    - dnf_count: số lỗi quá khứ
    - criticality_score: (Low: 0.2, Medium: 0.5, High: 0.8)
    """
    age_days = equipment_data.get('age_days', 0)
    dnf_count = equipment_data.get('dnf_count', 0)
    criticality = equipment_data.get('criticality', 'Medium')
    
    crit_map = {'Low': 0.2, 'Medium': 0.5, 'High': 0.8}
    c_score = crit_map.get(criticality, 0.5)
    
    # Chuẩn hóa dữ liệu (Mô phỏng Normalization)
    norm_age = min(age_days / 3650.0, 1.0) # max 10 năm
    norm_dnf = min(dnf_count / 50.0, 1.0)
    
    # Tạo chuỗi dữ liệu giả lập time-series (VD: 5 bước thời gian về độ mòn, nhiệt độ)
    # Trong thực tế dữ liệu này lấy từ Telemetry (IoT)
    np.random.seed(42 + dnf_count) # Giữ cho kết quả nhất quán với cùng số dnf
    time_steps = 5
    input_size = 3 # (age_trend, dnf_trend, crit_trend)
    
    x_seq = []
    for step in range(time_steps):
        # Fake features evolution over time
        f1 = norm_age * (step + 1) / time_steps
        f2 = norm_dnf * (step + 1) / time_steps + np.random.normal(0, 0.05)
        f3 = c_score
        x_seq.append(np.array([f1, f2, f3]))
    x_seq = np.array(x_seq)
    
    # Khởi tạo LSTM
    lstm = SimpleNumPyLSTM(input_size=input_size, hidden_size=8)
    
    # Bơm weight cố định để cho ra kết quả có ý nghĩa (Thay vì random)
    lstm.W_y = np.ones((1, 8)) * 0.5
    
    # Chạy forward pass
    risk_probability = lstm.forward(x_seq)
    
    # Thêm nhiễu ngẫu nhiên nhỏ để data sinh động
    risk_probability = np.clip(risk_probability + np.random.normal(0, 0.02), 0.01, 0.99)
    
    health_score = round((1.0 - risk_probability) * 100, 1)
    
    return {
        "failure_probability": round(risk_probability * 100, 1),
        "health_score": health_score,
        "predicted_days_to_failure": int((1.0 - risk_probability) * 365),
        "algorithm": "Pure NumPy LSTM (Air-gapped)"
    }

if __name__ == "__main__":
    try:
        input_data = sys.argv[1] if len(sys.argv) > 1 else None
        if not input_data:
            # Fallback data for testing
            input_data = '{"age_days": 500, "dnf_count": 2, "criticality": "High"}'
            
        equipment = json.loads(input_data)
        result = predict_health(equipment)
        
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
