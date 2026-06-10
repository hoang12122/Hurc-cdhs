import numpy as np

def sigmoid(x):
    """Hàm kích hoạt Sigmoid (chuyển giá trị về khoảng [0, 1])"""
    # Dùng np.clip để tránh overflow
    x = np.clip(x, -500, 500)
    return 1 / (1 + np.exp(-x))

def d_sigmoid(x):
    """Đạo hàm của Sigmoid"""
    s = sigmoid(x)
    return s * (1 - s)

def tanh(x):
    """Hàm kích hoạt Tanh (chuyển giá trị về khoảng [-1, 1])"""
    return np.tanh(x)

def d_tanh(x):
    """Đạo hàm của Tanh"""
    return 1 - np.tanh(x)**2

class LSTMCore:
    """
    Lõi mạng Nơ-ron LSTM (Long Short-Term Memory) thuần Toán học/NumPy.
    - Không sử dụng Framework (TensorFlow/PyTorch).
    - Tối ưu cho môi trường Air-gapped, CPU/Non-GPU.
    - Bao gồm Cả Lan truyền xuôi (Forward) và Lan truyền ngược qua thời gian (BPTT - Backpropagation Through Time).
    """
    def __init__(self, input_size, hidden_size, output_size, learning_rate=0.01):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.learning_rate = learning_rate
        
        # ---------------------------------------------------------
        # KHỞI TẠO TRỌNG SỐ (WEIGHTS) & ĐỘ LỆCH (BIASES)
        # Sử dụng Xavier/Glorot Initialization để tránh bùng nổ gradient
        # Kích thước nối (z) = input_size + hidden_size
        # ---------------------------------------------------------
        z_size = input_size + hidden_size
        std_dev = np.sqrt(2.0 / (input_size + hidden_size))
        
        # 1. Forget Gate (Cổng Quên): Quyết định giữ/vứt bỏ bao nhiêu % bộ nhớ cũ
        self.W_f = np.random.randn(hidden_size, z_size) * std_dev
        self.b_f = np.zeros((hidden_size, 1))
        
        # 2. Input Gate (Cổng Đầu vào): Quyết định cập nhật bao nhiêu % thông tin mới
        self.W_i = np.random.randn(hidden_size, z_size) * std_dev
        self.b_i = np.zeros((hidden_size, 1))
        
        # 3. Cell Candidate (Ứng viên Bộ nhớ): Thông tin mới tiềm năng để lưu trữ
        self.W_c = np.random.randn(hidden_size, z_size) * std_dev
        self.b_c = np.zeros((hidden_size, 1))
        
        # 4. Output Gate (Cổng Đầu ra): Quyết định xuất bao nhiêu % thông tin ra ngoài
        self.W_o = np.random.randn(hidden_size, z_size) * std_dev
        self.b_o = np.zeros((hidden_size, 1))
        
        # 5. Lớp Fully Connected (Dense Layer) ánh xạ Hidden State ra Kết quả (Prediction)
        self.W_y = np.random.randn(output_size, hidden_size) * std_dev
        self.b_y = np.zeros((output_size, 1))

    def forward_step(self, x_t, h_prev, c_prev):
        """
        Lan truyền xuôi tại một BƯỚC THỜI GIAN (Time-step) t.
        Các phương trình Toán học của LSTM:
        z = [h_prev, x_t]
        f_t = sigmoid(W_f * z + b_f)
        i_t = sigmoid(W_i * z + b_i)
        c_bar_t = tanh(W_c * z + b_c)
        c_t = f_t * c_prev + i_t * c_bar_t
        o_t = sigmoid(W_o * z + b_o)
        h_t = o_t * tanh(c_t)
        """
        x_t = x_t.reshape(-1, 1) # Đảm bảo vector cột
        
        # Nối (Concatenate) hidden_state trước đó và input hiện tại
        z = np.vstack((h_prev, x_t))
        
        # Cổng Quên (Forget Gate)
        f_t = sigmoid(np.dot(self.W_f, z) + self.b_f)
        
        # Cổng Đầu vào (Input Gate)
        i_t = sigmoid(np.dot(self.W_i, z) + self.b_i)
        
        # Ứng viên Bộ nhớ (Cell Candidate)
        c_bar_t = tanh(np.dot(self.W_c, z) + self.b_c)
        
        # Cập nhật Trạng thái Bộ nhớ (Cell State)
        # Hadamard Product (nhân từng phần tử)
        c_t = f_t * c_prev + i_t * c_bar_t
        
        # Cổng Đầu ra (Output Gate)
        o_t = sigmoid(np.dot(self.W_o, z) + self.b_o)
        
        # Cập nhật Trạng thái Ẩn (Hidden State)
        h_t = o_t * tanh(c_t)
        
        # Lưu cache để dùng cho Backpropagation
        cache = (x_t, h_prev, c_prev, z, f_t, i_t, c_bar_t, c_t, o_t, h_t)
        return h_t, c_t, cache

    def forward_sequence(self, x_seq):
        """
        Lan truyền xuôi qua toàn bộ CHUỖI THỜI GIAN (Sequence).
        """
        # Trạng thái ban đầu bằng 0
        h = np.zeros((self.hidden_size, 1))
        c = np.zeros((self.hidden_size, 1))
        caches = []
        
        for t in range(len(x_seq)):
            h, c, cache_t = self.forward_step(x_seq[t], h, c)
            caches.append(cache_t)
            
        # Prediction cuối cùng sau khi đã xử lý toàn bộ chuỗi
        y_pred = sigmoid(np.dot(self.W_y, h) + self.b_y)
        
        return y_pred, caches

    def backward_sequence(self, y_pred, y_true, caches):
        """
        Thuật toán BPTT (Backpropagation Through Time)
        Tính đạo hàm (Gradient) từ tương lai ngược về quá khứ để cập nhật Trọng số.
        Sử dụng MSE (Mean Squared Error) Loss hoặc Binary Cross Entropy.
        Ở đây dùng phỏng sinh đạo hàm Loss BCE + Sigmoid = (y_pred - y_true)
        """
        # Khởi tạo ma trận Gradients (Cùng kích thước với Weights)
        dW_f = np.zeros_like(self.W_f)
        db_f = np.zeros_like(self.b_f)
        dW_i = np.zeros_like(self.W_i)
        db_i = np.zeros_like(self.b_i)
        dW_c = np.zeros_like(self.W_c)
        db_c = np.zeros_like(self.b_c)
        dW_o = np.zeros_like(self.W_o)
        db_o = np.zeros_like(self.b_o)
        
        # Lớp Output
        h_final = caches[-1][-1] # h_t tại time-step cuối
        dy = y_pred - y_true # Đạo hàm hàm mất mát Loss đối với y_pred
        
        dW_y = np.dot(dy, h_final.T)
        db_y = dy
        
        # Đạo hàm đi vào LSTM Cell từ Output Layer
        dh_next = np.dot(self.W_y.T, dy)
        dc_next = np.zeros((self.hidden_size, 1))
        
        # Đi NGƯỢC THỜI GIAN (Từ T, T-1, ..., 0)
        for t in reversed(range(len(caches))):
            x_t, h_prev, c_prev, z, f_t, i_t, c_bar_t, c_t, o_t, h_t = caches[t]
            
            # Đạo hàm của Hidden State
            dh = dh_next
            
            # Đạo hàm của Output Gate
            do_t = dh * tanh(c_t)
            do_t_raw = do_t * o_t * (1 - o_t) # Qua đạo hàm của sigmoid
            
            # Đạo hàm của Cell State
            dc = dc_next + (dh * o_t * d_tanh(c_t))
            
            # Đạo hàm của Candidate State
            dc_bar_t = dc * i_t
            dc_bar_t_raw = dc_bar_t * (1 - c_bar_t**2) # Qua đạo hàm của tanh
            
            # Đạo hàm của Input Gate
            di_t = dc * c_bar_t
            di_t_raw = di_t * i_t * (1 - i_t) # Qua đạo hàm của sigmoid
            
            # Đạo hàm của Forget Gate
            df_t = dc * c_prev
            df_t_raw = df_t * f_t * (1 - f_t) # Qua đạo hàm của sigmoid
            
            # Tích luỹ Gradients cho Weights và Biases
            dW_f += np.dot(df_t_raw, z.T)
            db_f += df_t_raw
            dW_i += np.dot(di_t_raw, z.T)
            db_i += di_t_raw
            dW_c += np.dot(dc_bar_t_raw, z.T)
            db_c += dc_bar_t_raw
            dW_o += np.dot(do_t_raw, z.T)
            db_o += do_t_raw
            
            # Truyền Gradient ngược về Time-step trước đó (t-1)
            # z bao gồm [h_prev, x_t]. Ta cắt nửa trên để lấy gradient cho h_prev
            dz = (np.dot(self.W_f.T, df_t_raw)
                + np.dot(self.W_i.T, di_t_raw)
                + np.dot(self.W_c.T, dc_bar_t_raw)
                + np.dot(self.W_o.T, do_t_raw))
            
            dh_next = dz[:self.hidden_size, :]
            dc_next = f_t * dc
            
        # Cập nhật Trọng số (Gradient Descent Update Rule)
        # Bằng cách trừ đi learning_rate * Gradient
        # (Lưu ý trong thực tế sẽ clip gradients (Gradient Clipping) để tránh nổ)
        clip_value = 5.0
        
        self.W_f -= self.learning_rate * np.clip(dW_f, -clip_value, clip_value)
        self.b_f -= self.learning_rate * np.clip(db_f, -clip_value, clip_value)
        self.W_i -= self.learning_rate * np.clip(dW_i, -clip_value, clip_value)
        self.b_i -= self.learning_rate * np.clip(db_i, -clip_value, clip_value)
        self.W_c -= self.learning_rate * np.clip(dW_c, -clip_value, clip_value)
        self.b_c -= self.learning_rate * np.clip(db_c, -clip_value, clip_value)
        self.W_o -= self.learning_rate * np.clip(dW_o, -clip_value, clip_value)
        self.b_o -= self.learning_rate * np.clip(db_o, -clip_value, clip_value)
        
        self.W_y -= self.learning_rate * np.clip(dW_y, -clip_value, clip_value)
        self.b_y -= self.learning_rate * np.clip(db_y, -clip_value, clip_value)

    def train_step(self, x_seq, y_true):
        """Chạy 1 Epoch (Forward + Backward)"""
        y_pred, caches = self.forward_sequence(x_seq)
        self.backward_sequence(y_pred, y_true, caches)
        # Loss: Binary Cross Entropy
        loss = - (y_true * np.log(y_pred + 1e-8) + (1 - y_true) * np.log(1 - y_pred + 1e-8))
        return float(loss.squeeze())

# ==========================================
# KHU VỰC TEST THUẬT TOÁN (TRAINING LOOP)
# ==========================================
if __name__ == "__main__":
    # Mô phỏng dữ liệu: 3 features (Tuổi thọ, Tần suất lỗi, Mức độ rủi ro)
    # Target: 1 (Sắp Hỏng), 0 (Bình thường)
    
    print("Khoi tao Loi LSTM Thuan NumPy (Khong GPU)...")
    lstm = LSTMCore(input_size=3, hidden_size=8, output_size=1, learning_rate=0.1)
    
    # 1 Sequence gồm 5 time-steps (VD: 5 tháng qua)
    # Thiết bị A: Cũ dần, lỗi tăng liên tục -> Nhãn: 1 (Hỏng)
    x_fail = np.array([
        [0.1, 0.0, 0.8], # Tháng 1
        [0.2, 0.1, 0.8], # Tháng 2
        [0.4, 0.3, 0.8], # Tháng 3
        [0.6, 0.7, 0.8], # Tháng 4
        [0.8, 1.0, 0.8]  # Tháng 5
    ])
    y_fail = np.array([[1.0]])
    
    # Thiết bị B: Rất bền, ít lỗi -> Nhãn: 0 (Bình thường)
    x_good = np.array([
        [0.1, 0.0, 0.2],
        [0.2, 0.0, 0.2],
        [0.3, 0.1, 0.2],
        [0.4, 0.1, 0.2],
        [0.5, 0.1, 0.2]
    ])
    y_good = np.array([[0.0]])
    
    print("Bat dau Training (Backpropagation Through Time) trong 1000 Epochs...")
    for epoch in range(1001):
        loss_1 = lstm.train_step(x_fail, y_fail)
        loss_2 = lstm.train_step(x_good, y_good)
        
        if epoch % 200 == 0:
            print(f"Epoch {epoch:4d} | Trung bình Loss: {(loss_1 + loss_2)/2:.4f}")
            
    # Kiểm tra lại (Inference)
    y_pred_fail, _ = lstm.forward_sequence(x_fail)
    y_pred_good, _ = lstm.forward_sequence(x_good)
    
    print("\nKIEM TRA KET QUA DU BAO (INFERENCE):")
    print(f"Thiet bi A (Thuc te: HONG): May du doan hong hoc = {y_pred_fail.item() * 100:.1f}%")
    print(f"Thiet bi B (Thuc te: TOT): May du doan hong hoc = {y_pred_good.item() * 100:.1f}%")
