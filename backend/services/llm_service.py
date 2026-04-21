import httpx
import re
import json
from config import settings
from prompts import build_system_prompt

async def ask_llm(question: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.LLM_BASE_URL}/chat/completions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={
                "model": settings.LLM_MODEL,
                "messages": [
                    {"role": "system", "content": build_system_prompt()},
                    {"role": "user",   "content": question},
                ],
                "temperature": 0,
            },
            timeout=30,
        )
        response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        print(f"[LLM RAW] {content[:500]}")

        # Nettoyer les blocs markdown ```json ... ```
        cleaned = re.sub(r'```(?:json)?\s*', '', content)
        cleaned = cleaned.strip()

        match = re.search(r'\{.*\}', cleaned, re.DOTALL)
        if match:
            return json.loads(match.group())

        # Le LLM a repondu en texte brut — on traite comme un refus/clarification
        return {"sql": None, "explication": content.strip()}
