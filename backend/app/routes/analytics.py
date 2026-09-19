from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends

from app import db
from app.auth import current_user
from app.models import AnalyticsSummary

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def summary(user: Annotated[dict, Depends(current_user)]) -> AnalyticsSummary:
    rows = db.all_for_analytics(
        user_id=None if user.get("role") == "admin" else user["sub"]
    )

    today = datetime.now(timezone.utc).date()
    days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    counts_by_day = Counter()
    for row in rows:
        ts = row.get("submitted_at")
        if not ts:
            continue
        try:
            day = datetime.fromisoformat(ts.replace("Z", "+00:00")).date()
        except ValueError:
            continue
        counts_by_day[day] += 1

    volume_by_day = [
        {"date": d.isoformat(), "count": counts_by_day[d]} for d in days
    ]

    severity_distribution = dict(Counter(row["severity"] for row in rows))
    category_distribution = dict(Counter(row["category"] for row in rows))
    active = sum(1 for row in rows if row.get("status") != "resolved")

    return AnalyticsSummary(
        volume_by_day=volume_by_day,
        severity_distribution=severity_distribution,
        category_distribution=category_distribution,
        kpis={
            "total_incidents": len(rows),
            "active": active,
        },
    )