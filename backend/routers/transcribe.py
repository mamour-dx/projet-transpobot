from fastapi import APIRouter, UploadFile, File, Depends
from services.transcribe_service import transcribe_audio
from dependencies import get_current_user

router = APIRouter(prefix="/api", dependencies=[Depends(get_current_user)])

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    """Transcrit un fichier audio en texte via Whisper."""
    audio_bytes = await file.read()
    text = await transcribe_audio(audio_bytes, file.filename or "audio.webm")
    return {"text": text}
