import os
import tempfile
from pathlib import Path

import whisper


class WhisperEngine:
    def __init__(self, model_path: str | None = None):
        configured = model_path or os.getenv("LOCAL_WHISPER_MODEL_PATH", "/models/whisper/base.pt")
        self.model_path = Path(configured).expanduser().resolve()
        self.model = None

    def load_model(self):
        if self.model is not None:
            return
        if not self.model_path.exists() or not self.model_path.is_file():
            raise RuntimeError("Approved local Whisper model is not mounted.")
        print("[WHISPER] Loading governed local model...")
        # Passing an existing checkpoint path prevents runtime download.
        self.model = whisper.load_model(str(self.model_path))

    def transcribe_audio(self, audio_bytes: bytes) -> str:
        if self.model is None:
            self.load_model()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".audio") as temporary:
            temporary.write(audio_bytes)
            temporary_path = temporary.name

        try:
            result = self.model.transcribe(
                temporary_path,
                language="vi",
                fp16=False,
                verbose=False,
            )
            return str(result.get("text", "")).strip()
        finally:
            try:
                os.remove(temporary_path)
            except FileNotFoundError:
                pass


engine = WhisperEngine()


def transcribe(audio_bytes: bytes) -> str:
    return engine.transcribe_audio(audio_bytes)
