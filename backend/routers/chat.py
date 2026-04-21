from fastapi import APIRouter, Depends
from schemas import ChatRequest, ChatResponse
from services.chat_service import process_chat
from dependencies import get_current_user

router = APIRouter(prefix="/api")

@router.post("/chat", response_model=ChatResponse)
async def chat(msg: ChatRequest, user: dict = Depends(get_current_user)):
    """Point d'entrée principal : question → SQL → résultats"""
    return await process_chat(msg.question, source=msg.source, username=user["username"])
