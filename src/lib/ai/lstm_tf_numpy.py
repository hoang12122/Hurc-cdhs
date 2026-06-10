import numpy as np

def sigmoid(x):
    """Hàm kích hoạt Sigmoid"""
    x = np.clip(x, -500, 500)
    return 1 / (1 + np.exp(-x))

def d_sigmoid(s):
    """Đạo hàm Sigmoid (nhận vào giá trị đã qua sigmoid)"""
    return s * (1 - s)

def tanh(x):
    """Hàm kích hoạt Tanh"""
    return np.tanh(x)

def d_tanh(t):
    """Đạo hàm Tanh (nhận vào giá trị đã qua tanh)"""
    return 1 - t**2

class TensorFlowStyleLSTM:
    """
    Lõi Mạng Nơ-ron LSTM Thuần NumPy (Tối ưu hóa theo chuẩn Framework TensorFlow).
    Thay vì nhân 4 ma trận rời rạc cho 4 cổng (Forget, Input, Cell, Output), 
    TensorFlow ghép nối chúng thành một Siêu Ma trận (Block Matrix) duy nhất.
    Điều này giúp BPTT cực kỳ nhanh, tận dụng tối đa khả năng xử lý vector của CPU/NumPy.
    """
    def __init__(self, input_size, hidden_size, output_size, learning_rate=0.01):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.learning_rate = learning_rate
        
        # ---------------------------------------------------------
        # KHỞI TẠO TRỌNG SỐ THEO CHUẨN TENSORFLOW (BLOCK MATRIX)
        # ---------------------------------------------------------
        z_size = input_size + hidden_size
        std_dev = np.sqrt(2.0 / (input_size + hidden_size))
        
        # W chứa toàn bộ Trọng số cho cả 4 cổng: [W_i, W_f, W_c, W_o]
        # Kích thước: (input_size + hidden_size) x (4 * hidden_size)
        self.W = np.random.randn(z_size, 4 * hidden_size) * std_dev
        
        # b chứa toàn bộ bias: [b_i, b_f, b_c, b_o]
        self.b = np.zeros((1, 4 * hidden_size))
        
        # Lớp Output (Dense Layer) như bình thường
        self.W_y = np.random.randn(hidden_size, output_size) * std_dev
        self.b_y = np.zeros((1, output_size))

    def forward_sequence(self, x_seq):
        """
        Lan truyền xuôi (Forward Pass) cho toàn bộ chuỗi theo phong cách TensorFlow.
        """
        seq_len = x_seq.shape[0]
        h = np.zeros((1, self.hidden_size))
        c = np.zeros((1, self.hidden_size))
        
        caches = []
        
        for t in range(seq_len):
            x_t = x_seq[t].reshape(1, -1)
            
            # 1. Nối vector đầu vào và trạng thái ẩn
            z = np.hstack((x_t, h)) # Kích thước: (1, input_size + hidden_size)
            
            # 2. CHỈ MỘT PHÉP NHÂN MA TRẬN DUY NHẤT (TensorFlow Optimization)
            # gates có kích thước: (1, 4 * hidden_size)
            gates = np.dot(z, self.W) + self.b
            
            # 3. Tách ra 4 cổng
            i_gate, f_gate, c_bar, o_gate = np.split(gates, 4, axis=1)
            
            # 4. Kích hoạt
            i_t = sigmoid(i_gate)
            f_t = sigmoid(f_gate)
            c_bar_t = tanh(c_bar)
            o_t = sigmoid(o_gate)
            
            # 5. Cập nhật trạng thái
            c_next = f_t * c + i_t * c_bar_t
            h_next = o_t * tanh(c_next)
            
            # Lưu cache cho quá trình ngược
            caches.append((z, i_t, f_t, c_bar_t, o_t, c, c_next, h_next))
            
            h = h_next
            c = c_next
            
        # Tính toán kết quả dự báo cuối cùng
        y_pred = sigmoid(np.dot(h, self.W_y) + self.b_y)
        return y_pred, caches

    def backward_sequence(self, y_pred, y_true, caches):
        """
        Thuật toán BPTT (Backpropagation Through Time) siêu tối ưu với Block Matrix.
        Cực kỳ nhanh vì ta dồn tất cả đạo hàm của 4 cổng thành 1 ma trận d_gates.
        """
        dW = np.zeros_like(self.W)
        db = np.zeros_like(self.b)
        
        # Đạo hàm của hàm mất mát (Binary Cross Entropy + Sigmoid)
        dy = y_pred - y_true 
        
        # Trạng thái cuối cùng của h
        h_final = caches[-1][-1]
        
        dW_y = np.dot(h_final.T, dy)
        db_y = np.sum(dy, axis=0, keepdims=True)
        
        # Đạo hàm đi vào LSTM Cell
        dh_next = np.dot(dy, self.W_y.T)
        dc_next = np.zeros((1, self.hidden_size))
        
        # Đi ngược thời gian BPTT
        for t in reversed(range(len(caches))):
            z, i_t, f_t, c_bar_t, o_t, c_prev, c_curr, h_curr = caches[t]
            
            # Gradient của Hidden State
            dh = dh_next
            
            # Gradient qua cổng Output
            tanh_c = tanh(c_curr)
            do_t = dh * tanh_c
            do_t_raw = do_t * d_sigmoid(o_t)
            
            # Gradient truyền qua Cell State
            dc = dc_next + (dh * o_t * d_tanh(tanh_c))
            
            # Gradient qua cổng Input và Candidate
            di_t = dc * c_bar_t
            di_t_raw = di_t * d_sigmoid(i_t)
            
            dc_bar_t = dc * i_t
            dc_bar_t_raw = dc_bar_t * d_tanh(c_bar_t)
            
            # Gradient qua cổng Forget
            df_t = dc * c_prev
            df_t_raw = df_t * d_sigmoid(f_t)
            
            # -------------------------------------------------------------
            # ĐIỂM SÁNG: Gộp tất cả raw gradients thành 1 ma trận duy nhất
            # Tương đương cách TensorFlow tính toán gradients
            # -------------------------------------------------------------
            d_gates = np.hstack((di_t_raw, df_t_raw, dc_bar_t_raw, do_t_raw))
            
            # Tích lũy dW và db chỉ bằng 1 phép tính
            dW += np.dot(z.T, d_gates)
            db += d_gates
            
            # Gradient truyền về bước thời gian t-1
            dz = np.dot(d_gates, self.W.T)
            
            # Tách dh_next (phần ẩn) từ dz
            dh_next = dz[:, self.input_size:]
            dc_next = f_t * dc

        # Cập nhật Gradient Descent với Gradient Clipping
        clip_val = 5.0
        self.W -= self.learning_rate * np.clip(dW, -clip_val, clip_val)
        self.b -= self.learning_rate * np.clip(db, -clip_val, clip_val)
        self.W_y -= self.learning_rate * np.clip(dW_y, -clip_val, clip_val)
        self.b_y -= self.learning_rate * np.clip(db_y, -clip_val, clip_val)

    def train_step(self, x_seq, y_true):
        y_pred, caches = self.forward_sequence(x_seq)
        self.backward_sequence(y_pred, y_true, caches)
        loss = - (y_true * np.log(y_pred + 1e-8) + (1 - y_true) * np.log(1 - y_pred + 1e-8))
        return float(loss.squeeze())

if __name__ == "__main__":
    print("Khoi tao Loi LSTM TensorFlow-style Thuan NumPy...")
    lstm = TensorFlowStyleLSTM(input_size=3, hidden_size=8, output_size=1, learning_rate=0.1)
    
    # 1 Sequence (Time-series)
    x_fail = np.array([
        [0.1, 0.0, 0.8], [0.2, 0.1, 0.8], [0.4, 0.3, 0.8], [0.6, 0.7, 0.8], [0.8, 1.0, 0.8]
    ])
    y_fail = np.array([[1.0]])
    
    x_good = np.array([
        [0.1, 0.0, 0.2], [0.2, 0.0, 0.2], [0.3, 0.1, 0.2], [0.4, 0.1, 0.2], [0.5, 0.1, 0.2]
    ])
    y_good = np.array([[0.0]])
    
    print("Huan luyen voi kien truc Block Matrix (BPTT)...")
    for epoch in range(1001):
        l1 = lstm.train_step(x_fail, y_fail)
        l2 = lstm.train_step(x_good, y_good)
        if epoch % 200 == 0:
            print(f"Epoch {epoch:4d} | Trung binh Loss: {(l1 + l2)/2:.4f}")
            
    p_fail, _ = lstm.forward_sequence(x_fail)
    p_good, _ = lstm.forward_sequence(x_good)
    print("\nKET QUA (INFERENCE):")
    print(f"May Hong: {p_fail.item()*100:.1f}%")
    print(f"May Tot : {p_good.item()*100:.1f}%")
