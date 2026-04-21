from fastapi import APIRouter, Depends, HTTPException, status
from schemas import LoginRequest, LoginResponse, UserOut, PasswordChange
from db.database import get_connection, execute_write
from services.auth_service import verify_password, hash_password, create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

def _find_user(username: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s LIMIT 1", (username,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

@router.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    user = _find_user(req.username)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiants incorrects")

    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return LoginResponse(
        access_token=token,
        user=UserOut(username=user["username"], role=user["role"], nom=user["nom"])
    )

@router.get("/me", response_model=UserOut)
def me(current_user: dict = Depends(get_current_user)):
    user = _find_user(current_user["username"])
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return UserOut(username=user["username"], role=user["role"], nom=user["nom"])

@router.put("/password")
def change_password(req: PasswordChange, current_user: dict = Depends(get_current_user)):
    user = _find_user(current_user["username"])
    if not user or not verify_password(req.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")
    new_hash = hash_password(req.new_password)
    execute_write("UPDATE users SET hashed_password = %s WHERE id = %s", (new_hash, user["id"]))
    return {"message": "Mot de passe modifie avec succes"}
