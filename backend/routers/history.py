from fastapi import APIRouter, Query, Depends
from db.database import execute_query, execute_write, get_connection
from dependencies import get_current_user

router = APIRouter(prefix="/api")

@router.get("/history")
def get_history(limit: int = Query(default=50, le=200), user: dict = Depends(get_current_user)):
    """Historique des conversations — filtre par utilisateur (admins voient tout)."""
    if user["role"] == "admin":
        return execute_query(
            f"SELECT * FROM conversations ORDER BY created_at DESC LIMIT {limit}"
        )
    else:
        return execute_query(
            f"SELECT * FROM conversations WHERE username = %s ORDER BY created_at DESC LIMIT {limit}",
        ) if False else _get_user_history(user["username"], limit)

@router.get("/history/stats")
def get_history_stats(user: dict = Depends(get_current_user)):
    """Statistiques d'activite reseau — admin seulement, sinon stats perso."""
    if user["role"] == "admin":
        rows = execute_query("""
            SELECT
                username,
                COUNT(*) AS total_requetes,
                MAX(created_at) AS derniere_activite,
                SUM(CASE WHEN created_at >= NOW() - INTERVAL 24 HOUR THEN 1 ELSE 0 END) AS requetes_24h,
                SUM(CASE WHEN created_at >= NOW() - INTERVAL 1 HOUR THEN 1 ELSE 0 END) AS requetes_1h
            FROM conversations
            WHERE username IS NOT NULL
            GROUP BY username
            ORDER BY derniere_activite DESC
        """)
        total_24h = sum(r.get("requetes_24h", 0) for r in rows)
        total_1h = sum(r.get("requetes_1h", 0) for r in rows)
        total = sum(r.get("total_requetes", 0) for r in rows)
        return {
            "users": rows,
            "total_requetes": total,
            "requetes_24h": total_24h,
            "requetes_1h": total_1h,
            "nb_utilisateurs_actifs": len([r for r in rows if r.get("requetes_24h", 0) > 0]),
        }
    else:
        rows = execute_query(
            "SELECT COUNT(*) AS total FROM conversations WHERE username = %s"
        ) if False else _get_user_stats(user["username"])
        return rows

@router.delete("/history")
def clear_history(user: dict = Depends(get_current_user)):
    """Supprime l'historique — admin efface tout, gestionnaire efface le sien."""
    conn = get_connection()
    cursor = conn.cursor()
    if user["role"] == "admin":
        cursor.execute("DELETE FROM conversations")
    else:
        cursor.execute("DELETE FROM conversations WHERE username = %s", (user["username"],))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Historique supprimé"}


def _get_user_history(username: str, limit: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM conversations WHERE username = %s ORDER BY created_at DESC LIMIT %s",
        (username, limit)
    )
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

def _get_user_stats(username: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """SELECT
            COUNT(*) AS total_requetes,
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 24 HOUR THEN 1 ELSE 0 END) AS requetes_24h
        FROM conversations WHERE username = %s""",
        (username,)
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row or {"total_requetes": 0, "requetes_24h": 0}
