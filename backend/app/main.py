from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import analytics, auth, health, incidents, reports

app = FastAPI(
    title="Dispatch API",
    version=settings.api_version,
    description="Incident triage API backed by the ML pipeline and Supabase.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://dispatch-.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(incidents.router)
app.include_router(reports.router)
app.include_router(analytics.router)


@app.get("/")
def root() -> dict:
    return {"service": "dispatch-api", "docs": "/docs"}