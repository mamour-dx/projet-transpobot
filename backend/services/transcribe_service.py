import httpx
from config import settings

async def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    """Envoie l'audio à l'API Whisper d'OpenAI et retourne la transcription."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.LLM_BASE_URL}/audio/transcriptions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            files={"file": (filename, audio_bytes, "audio/webm")},
            data={"model": "whisper-1", "language": "fr"},
            timeout=30,
        )
        response.raise_for_status()
        return response.json()["text"]
