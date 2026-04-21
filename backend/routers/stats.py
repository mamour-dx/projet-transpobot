from fastapi import APIRouter, Depends
from db.database import execute_query, execute_paginated_query
from dependencies import get_current_user

router = APIRouter(prefix="/api", dependencies=[Depends(get_current_user)])
health_router = APIRouter()

@router.get("/stats")
def get_stats():
    """Tableau de bord — via la vue v_dashboard"""
    result = execute_query("SELECT * FROM v_dashboard")
    if result:
        row = result[0]
        return {
            "total_trajets":    row["trajets_termines"],
            "trajets_en_cours": row["trajets_en_cours"],
            "vehicules_actifs": row["vehicules_actifs"],
            "incidents_ouverts":row["incidents_non_resolus"],
            "recette_totale":   row["recette_totale"],
            "total_vehicules":  row["total_vehicules"],
            "total_chauffeurs": row["total_chauffeurs"],
        }
    return {}

@router.get("/vehicules")
def get_vehicules(page: int = 1, size: int = 10):
    return execute_paginated_query("SELECT * FROM vehicules ORDER BY immatriculation", (), page, size)

@router.get("/chauffeurs")
def get_chauffeurs(page: int = 1, size: int = 10):
    """Liste chauffeurs — via la vue v_chauffeurs_vehicules"""
    return execute_paginated_query("SELECT * FROM v_chauffeurs_vehicules ORDER BY nom", (), page, size)

@router.get("/trajets/recent")
def get_trajets_recent():
    """Trajets récents — via la vue v_trajets_details"""
    return execute_query("SELECT * FROM v_trajets_details ORDER BY date_depart DESC LIMIT 20")

@health_router.get("/health")
def health():
    return {"status": "ok", "app": "TranspoBot"}
