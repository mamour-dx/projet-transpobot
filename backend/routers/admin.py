from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user, require_admin
from db.database import execute_query, execute_write, get_connection, execute_paginated_query
from schemas import (
    VehiculeCreate, VehiculeUpdate,
    ChauffeurCreate, ChauffeurUpdate,
    IncidentUpdate,
    UserCreate, UserUpdate, PasswordChange,
)
from services.auth_service import hash_password, verify_password

# ══════════════════════════════════════════════════════════
#  CRUD Flotte — accessible à TOUS les utilisateurs authentifiés
# ══════════════════════════════════════════════════════════
fleet_router = APIRouter(prefix="/api/admin", dependencies=[Depends(get_current_user)], tags=["fleet"])

# ── Vehicules ─────────────────────────────────────────

@fleet_router.post("/vehicules")
def create_vehicule(v: VehiculeCreate):
    sql = """INSERT INTO vehicules (immatriculation, marque, modele, type, capacite, etat, kilometrage, date_mise_service)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    result = execute_write(sql, (v.immatriculation, v.marque, v.modele, v.type, v.capacite, v.etat, v.kilometrage, v.date_mise_service))
    return {"message": "Vehicule cree", "id": result["lastrowid"]}

@fleet_router.put("/vehicules/{id}")
def update_vehicule(id: int, v: VehiculeUpdate):
    fields, values = [], []
    for key, val in v.model_dump(exclude_none=True).items():
        fields.append(f"{key} = %s")
        values.append(val)
    if not fields:
        raise HTTPException(400, "Aucun champ a modifier")
    values.append(id)
    sql = f"UPDATE vehicules SET {', '.join(fields)} WHERE id = %s"
    execute_write(sql, tuple(values))
    return {"message": "Vehicule mis a jour"}

@fleet_router.delete("/vehicules/{id}")
def delete_vehicule(id: int):
    execute_write("UPDATE vehicules SET etat = 'retire' WHERE id = %s", (id,))
    return {"message": "Vehicule retire"}

# ── Chauffeurs ────────────────────────────────────────

@fleet_router.post("/chauffeurs")
def create_chauffeur(c: ChauffeurCreate):
    sql = """INSERT INTO chauffeurs (matricule, nom, telephone, permis_categorie, statut, vehicule_id, date_embauche)
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    result = execute_write(sql, (c.matricule, c.nom, c.telephone, c.permis_categorie, c.statut, c.vehicule_id, c.date_embauche))
    return {"message": "Chauffeur cree", "id": result["lastrowid"]}

@fleet_router.put("/chauffeurs/{id}")
def update_chauffeur(id: int, c: ChauffeurUpdate):
    fields, values = [], []
    for key, val in c.model_dump(exclude_none=True).items():
        fields.append(f"{key} = %s")
        values.append(val)
    if not fields:
        raise HTTPException(400, "Aucun champ a modifier")
    values.append(id)
    sql = f"UPDATE chauffeurs SET {', '.join(fields)} WHERE id = %s"
    execute_write(sql, tuple(values))
    return {"message": "Chauffeur mis a jour"}

@fleet_router.delete("/chauffeurs/{id}")
def delete_chauffeur(id: int):
    execute_write("UPDATE chauffeurs SET statut = 'suspendu' WHERE id = %s", (id,))
    return {"message": "Chauffeur suspendu"}

# ── Incidents ─────────────────────────────────────────

@fleet_router.get("/incidents")
def list_incidents(page: int = 1, size: int = 10):
    return execute_paginated_query("SELECT * FROM v_incidents_details ORDER BY date_incident DESC", (), page, size)

@fleet_router.put("/incidents/{id}")
def update_incident(id: int, inc: IncidentUpdate):
    fields, values = [], []
    for key, val in inc.model_dump(exclude_none=True).items():
        fields.append(f"{key} = %s")
        values.append(val)
    if not fields:
        raise HTTPException(400, "Aucun champ a modifier")
    values.append(id)
    sql = f"UPDATE incidents SET {', '.join(fields)} WHERE id = %s"
    execute_write(sql, tuple(values))
    return {"message": "Incident mis a jour"}

# ══════════════════════════════════════════════════════════
#  Gestion des comptes — ADMIN uniquement
# ══════════════════════════════════════════════════════════
users_router = APIRouter(prefix="/api/admin/users", dependencies=[Depends(require_admin)], tags=["users"])

@users_router.get("")
def list_users(page: int = 1, size: int = 10):
    return execute_paginated_query("SELECT id, username, role, nom, created_at FROM users ORDER BY created_at DESC", (), page, size)

@users_router.post("")
def create_user(u: UserCreate):
    hashed = hash_password(u.password)
    sql = "INSERT INTO users (username, hashed_password, role, nom) VALUES (%s, %s, %s, %s)"
    result = execute_write(sql, (u.username, hashed, u.role, u.nom))
    return {"message": "Utilisateur cree", "id": result["lastrowid"]}

@users_router.put("/{id}")
def update_user(id: int, u: UserUpdate):
    fields, values = [], []
    data = u.model_dump(exclude_none=True)
    if "password" in data:
        data["hashed_password"] = hash_password(data.pop("password"))
    for key, val in data.items():
        fields.append(f"{key} = %s")
        values.append(val)
    if not fields:
        raise HTTPException(400, "Aucun champ a modifier")
    values.append(id)
    sql = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
    execute_write(sql, tuple(values))
    return {"message": "Utilisateur mis a jour"}

@users_router.delete("/{id}")
def delete_user(id: int):
    # Empecher la suppression de son propre compte
    execute_write("DELETE FROM users WHERE id = %s", (id,))
    return {"message": "Utilisateur supprime"}
