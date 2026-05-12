import os
import whisper
import tempfile

class WhisperEngine:
    def __init__(self, model_size="base"):
        self.model_size = model_size
        self.model = None

    def load_model(self):
        if self.model is None:
            print(f"🎙️ [WHISPER] Loading offline Whisper model: {self.model_size}...")
            # Load model vào RAM/VRAM
            self.model = whisper.load_model(self.model_size)
            print("🎙️ [WHISPER] Model loaded successfully.")

    def transcribe_audio(self, audio_bytes: bytes) -> str:
        """
        Nhận dạng giọng nói (ưu tiên tiếng Việt) và chuyển đổi thành văn bản.
        """
        if self.model is None:
            self.load_model()
            
        # Whisper yêu cầu file trên disk, nên ta tạo file tạm
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            print("🎙️ [WHISPER] Starting transcription...")
            # language='vi' giúp cải thiện độ chính xác cho tiếng Việt
            result = self.model.transcribe(tmp_path, language="vi", fp16=False)
            text = result["text"].strip()
            print(f"🎙️ [WHISPER] Result: {text}")
            return text
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

# Khởi tạo instance toàn cục để dùng lại model trong quá trình chạy server
engine = WhisperEngine(model_size="base")

def transcribe(audio_bytes: bytes) -> str:
    return engine.transcribe_audio(audio_bytes)
