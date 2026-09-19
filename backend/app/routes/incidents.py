from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query

from app import db
from app.auth import current_user
from app.models import Incident, IncidentList

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=IncidentList)
def list_incidents(
    user: Annotated[dict, Depends(current_user)],
    severity: str | None = Query(None),
    status: str | None = Query(None),
    category: str | None = Query(None),
    department: str | None = Query(None),
    q: str | None = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> IncidentList:
    filter_user_id = None if user.get("role") == "admin" else user["sub"]

    items, total = db.list_incidents(
        user_id=filter_user_id,
        severity=severity,
        status=status,
        category=category,
        department=department,
        q=q,
        limit=limit,
        offset=offset,
    )
    return IncidentList(items=items, total=total, limit=limit, offset=offset)


@router.get("/{incident_id}", response_model=Incident)
def get_incident(
    incident_id: str,
    user: Annotated[dict, Depends(current_user)],
) -> Incident:
    incident = db.get_incident(incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    if user.get("role") != "admin" and incident.user_id != user["sub"]:
        raise HTTPException(status_code=403, detail="Not authorized for this incident")

    return incident