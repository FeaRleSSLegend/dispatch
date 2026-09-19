from fastapi import APIRouter

from app.config import settings
from app.ml import model_metadata

router = APIRouter(prefix="/api", tags=["meta"])


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}


@router.get("/version")
def version() -> dict:
    return {
        "api_version": settings.api_version,
        "models": model_metadata(),
    }