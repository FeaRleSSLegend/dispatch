"""Supabase-backed store for incidents and users."""

from datetime import datetime, timezone

from supabase import Client, create_client

from app.auth import hash_password
from app.config import settings
from app.models import Incident

_client: Client | None = None

TABLE = "incidents"
USERS = "users"


def client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client


def _next_id() -> str:
    result = client().table(TABLE).select("id").order("id", desc=True).limit(1).execute()
    if not result.data:
        return "INC-0001"
    last = result.data[0]["id"]
    try:
        n = int(last.split("-")[1])
    except (IndexError, ValueError):
        n = 0
    return f"INC-{n + 1:04d}"


def list_incidents(
    *,
    user_id: str | None = None,
    severity: str | None = None,
    status: str | None = None,
    category: str | None = None,
    department: str | None = None,
    q: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Incident], int]:
    query = client().table(TABLE).select("*", count="exact")

    if user_id is not None:
        query = query.eq("user_id", user_id)
    if severity:
        query = query.eq("severity", severity)
    if status:
        query = query.eq("status", status)
    if category:
        query = query.eq("category", category)
    if department:
        query = query.eq("department", department)
    if q:
        query = query.ilike("report", f"%{q}%")

    query = query.order("submitted_at", desc=True).range(offset, offset + limit - 1)
    result = query.execute()

    items = [Incident(**row) for row in result.data]
    total = result.count or len(items)
    return items, total


def get_incident(incident_id: str) -> Incident | None:
    result = (
        client().table(TABLE).select("*").eq("id", incident_id).limit(1).execute()
    )
    if not result.data:
        return None
    return Incident(**result.data[0])


def create_incident(
    *,
    category: str,
    severity: str,
    routed_to: str,
    report: str,
    redacted: str,
    entities: dict,
    department: str,
    score: float | None,
    user_id: str | None = None,
    duplicate_of: str | None = None,
) -> Incident:
    payload = {
        "id": _next_id(),
        "category": category,
        "severity": severity,
        "status": "new",
        "routed_to": routed_to,
        "report": report,
        "redacted": redacted,
        "entities": entities,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "duplicate_of": duplicate_of,
        "score": score,
        "department": department,
        "user_id": user_id,
    }
    result = client().table(TABLE).insert(payload).execute()
    return Incident(**result.data[0])


def all_for_analytics(user_id: str | None = None) -> list[dict]:
    query = client().table(TABLE).select("severity, category, status, submitted_at")
    if user_id is not None:
        query = query.eq("user_id", user_id)
    return query.execute().data


def create_user(*, email: str, name: str, password: str, role: str = "user") -> dict:
    payload = {
        "email": email.lower().strip(),
        "name": name.strip(),
        "password_hash": hash_password(password),
        "role": role,
    }
    result = client().table(USERS).insert(payload).execute()
    return result.data[0]


def get_user_by_email(email: str) -> dict | None:
    result = (
        client()
        .table(USERS)
        .select("*")
        .eq("email", email.lower().strip())
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None


def get_user_by_id(user_id: str) -> dict | None:
    result = (
        client().table(USERS).select("*").eq("id", user_id).limit(1).execute()
    )
    return result.data[0] if result.data else None