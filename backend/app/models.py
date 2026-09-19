from typing import Any, Literal

from pydantic import BaseModel, Field

Category = Literal[
    "phishing",
    "account_takeover",
    "malware",
    "data_leak",
    "suspicious_activity",
]

Severity = Literal["low", "medium", "high"]

Status = Literal["new", "triaged", "investigating", "resolved"]


class Entities(BaseModel):
    ips: list[str] = []
    urls: list[str] = []
    account_refs: list[str] = []
    organizations: list[str] = []
    time_references: list[str] = []


class Incident(BaseModel):
    id: str
    category: Category
    severity: Severity
    status: Status
    routed_to: str
    report: str
    redacted: str
    entities: Entities
    submitted_at: str
    duplicate_of: str | None = None
    score: float | None = None
    department: str
    user_id: str | None = None


class IncidentList(BaseModel):
    items: list[Incident]
    total: int
    limit: int
    offset: int


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=20_000)


class AnalyzeResponse(BaseModel):
    category: Category
    severity: Severity
    score: float | None
    entities: Entities
    redacted: str
    routed_to: str
    duplicate_of: str | None = None


class SubmitRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=20_000)
    department: str = Field(..., min_length=1, max_length=100)


class AnalyticsSummary(BaseModel):
    volume_by_day: list[dict[str, Any]]
    severity_distribution: dict[str, int]
    category_distribution: dict[str, int]
    kpis: dict[str, Any]


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


class SignupRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=200)
    name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=8, max_length=200)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=200)
    password: str = Field(..., min_length=1, max_length=200)


class AuthResponse(BaseModel):
    token: str
    user: UserOut