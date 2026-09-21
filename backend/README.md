# Dispatch — Backend

The API for Dispatch, a security incident triage dashboard. It serves auth, incident CRUD, analytics, and a report-analysis endpoint that wraps an ML pipeline. Incidents are persisted to Supabase; text classification runs on demand.

FastAPI service that wraps the ML pipeline and stores incidents in Supabase.

## Stack

- FastAPI + Uvicorn
- Pydantic v2 + pydantic-settings
- Supabase (Postgres) via `supabase-py`
- JWT auth (`python-jose`) + bcrypt password hashing
- Imports the ML pipeline from `../ML_pipeline`

## Local setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env
# Edit .env with your Supabase credentials
uvicorn app.main:app --reload --port 8000
```

API docs at http://localhost:8000/docs.

## Environment

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (server-side only) |
| `JWT_SECRET` | Signing key for JWTs. Use a long random string. |
| `JWT_ALGORITHM` | Default `HS256` |
| `JWT_EXPIRES_MINUTES` | Token lifetime, default 7 days |

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | — | Liveness check |
| GET | `/api/version` | — | API + loaded model metadata |
| POST | `/api/auth/signup` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Sign in, returns JWT |
| GET | `/api/auth/me` | required | Current user |
| GET | `/api/incidents` | required | List incidents (filtered by owner for users, all for admins) |
| GET | `/api/incidents/{id}` | required | Single incident |
| POST | `/api/reports/analyze` | — | Run ML, no persistence |
| POST | `/api/reports/submit` | required | Run ML + persist, attaches `user_id` |
| GET | `/api/analytics/summary` | required | Aggregated stats (scoped by role) |

## Database

Two tables in Supabase: `users` and `incidents`. See `migrations/` for SQL. Incidents carry a `user_id` foreign key; the API enforces ownership.

## ML pipeline

`app/ml.py` adds `../ML_pipeline/src` to `sys.path` and imports `pipeline.process_report()`. Models are loaded once at startup. If the model files are missing, the app fails at boot — check `../ML_pipeline/models/`.

## Deployment

Deployed on Render as a Python web service. Root directory: `backend`. Build: `pip install -r requirements.txt`. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Free tier spins down after 15 min idle; first request after that takes ~30-60s.
