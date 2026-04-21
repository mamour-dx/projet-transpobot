import httpx
from schemas import ChatResponse
from db.database import get_connection, execute_query
from services.llm_service import ask_llm

def save_conversation(question: str, reponse: str, sql_genere: str = None,
                      nb_resultats: int = 0, source: str = None, username: str = None):
    """Sauvegarde un échange dans la table conversations."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO conversations (question, reponse, sql_genere, nb_resultats, source, username) VALUES (%s, %s, %s, %s, %s, %s)",
            (question, reponse, sql_genere, nb_resultats, source or 'web', username)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Erreur sauvegarde conversation: {e}")

async def process_chat(question: str, source: str = None, username: str = None) -> ChatResponse:
    try:
        llm_response = await ask_llm(question)
        sql = llm_response.get("sql")
        explication = llm_response.get("explication", "")

        if not sql:
            save_conversation(question, explication, None, 0, source, username)
            return ChatResponse(answer=explication, data=[], sql=None, count=None)

        data = execute_query(sql)
        count = len(data)

        # Sauvegarder dans l'historique
        save_conversation(question, explication, sql, count, source, username)

        return ChatResponse(
            answer=explication,
            data=data,
            sql=sql,
            count=count,
        )
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 401:
            return ChatResponse(answer="Clé API invalide ou manquante. Veuillez configurer votre clé OpenAI.", data=[], sql=None, count=None)
        return ChatResponse(answer=f"Erreur du service LLM : {e.response.status_code}", data=[], sql=None, count=None)
    except (httpx.ConnectError, httpx.TimeoutException):
        return ChatResponse(answer="Impossible de contacter le service LLM. Vérifiez votre connexion.", data=[], sql=None, count=None)
    except Exception as e:
        return ChatResponse(answer=f"Une erreur est survenue : {str(e)}", data=[], sql=None, count=None)
