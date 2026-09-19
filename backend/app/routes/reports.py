from typing import Annotated

from fastapi import APIRouter, Depends

from app import db
from app.auth import current_user
from app.ml import analyze
from app.models import AnalyzeRequest, AnalyzeResponse, Incident, SubmitRequest

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_report(body: AnalyzeRequest) -> AnalyzeResponse:
    """Run the ML pipeline on raw text. Stateless — no auth required."""
    result = analyze(body.text)
    return AnalyzeResponse(**result, duplicate_of=None)


@router.post("/submit", response_model=Incident)
def submit_report(
    body: SubmitRequest,
    user: Annotated[dict, Depends(current_user)],
) -> Incident:
    """Run the ML pipeline and persist the result. Requires auth so the
    incident can be attached to the submitting user."""
    result = analyze(body.text)
    return db.create_incident(
        category=result["category"],
        severity=result["severity"],
        routed_to=result["routed_to"],
        report=body.text,
        redacted=result["redacted"],
        entities=result["entities"],
        department=body.department,
        score=result["score"],
        duplicate_of=None,
        user_id=user["sub"],
    )
