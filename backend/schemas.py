from pydantic import BaseModel
from typing import Optional, List, Any

# ── Chat ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    question: str
    source: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    data: List[Any]
    sql: Optional[str] = None
    count: Optional[int] = None

class HistoryItem(BaseModel):
    id: int
    question: str
    reponse: str
    sql_genere: Optional[str] = None
    nb_resultats: int
    created_at: Any

# ── Auth ──────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str
    role: str
    nom: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ── Véhicules CRUD ───────────────────────────────────
class VehiculeCreate(BaseModel):
    immatriculation: str
    marque: str
    modele: str
    type: str
    capacite: int
    etat: str = "actif"
    kilometrage: int = 0
    date_mise_service: Optional[str] = None

class VehiculeUpdate(BaseModel):
    immatriculation: Optional[str] = None
    marque: Optional[str] = None
    modele: Optional[str] = None
    type: Optional[str] = None
    capacite: Optional[int] = None
    etat: Optional[str] = None
    kilometrage: Optional[int] = None
    date_mise_service: Optional[str] = None

# ── Chauffeurs CRUD ──────────────────────────────────
class ChauffeurCreate(BaseModel):
    matricule: str
    nom: str
    telephone: Optional[str] = None
    permis_categorie: Optional[str] = None
    statut: str = "disponible"
    vehicule_id: Optional[int] = None
    date_embauche: Optional[str] = None

class ChauffeurUpdate(BaseModel):
    matricule: Optional[str] = None
    nom: Optional[str] = None
    telephone: Optional[str] = None
    permis_categorie: Optional[str] = None
    statut: Optional[str] = None
    vehicule_id: Optional[int] = None
    date_embauche: Optional[str] = None

# ── Incidents CRUD ───────────────────────────────────
class IncidentUpdate(BaseModel):
    resolu: Optional[bool] = None
    date_resolution: Optional[str] = None
    gravite: Optional[str] = None
    description: Optional[str] = None

# ── Users Management ─────────────────────────────────
class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "gestionnaire"
    nom: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    nom: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
