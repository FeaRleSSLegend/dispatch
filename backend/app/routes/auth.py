from fastapi import APIRouter, Depends, HTTPException, status

from app import db
from app.auth import create_access_token, current_user, verify_password
from app.models import AuthResponse, LoginRequest, SignupRequest, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _to_user_out(row: dict) -> UserOut:
    return UserOut(
        id=row["id"],
        email=row["email"],
        name=row["name"],
        role=row["role"],
    )


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest) -> AuthResponse:
    existing = db.get_user_by_email(body.email)
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

    row = db.create_user(
        email=body.email,
        name=body.name,
        password=body.password,
        role="user",
    )
    token = create_access_token(user_id=row["id"], email=row["email"], role=row["role"])
    return AuthResponse(token=token, user=_to_user_out(row))


@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest) -> AuthResponse:
    row = db.get_user_by_email(body.email)
    if row is None or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user_id=row["id"], email=row["email"], role=row["role"])
    return AuthResponse(token=token, user=_to_user_out(row))


@router.get("/me", response_model=UserOut)
def me(user: dict = Depends(current_user)) -> UserOut:
    row = db.get_user_by_id(user["sub"])
    if row is None:
        raise HTTPException(status_code=404, detail="User not found")
    return _to_user_out(row)