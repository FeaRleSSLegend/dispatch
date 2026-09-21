# Dispatch

A security incident triage platform. Users file free-text incident reports;
an ML pipeline classifies each one by category and severity, extracts
technical indicators, redacts PII, and routes it to the right team. Analysts
review the queue, open individual cases, and see aggregated metrics.

## Live

- **Frontend:** https://dispatch-ttkq.vercel.app
- **Backend:** https://dispatch-backend-07jy.onrender.com
- **API docs:** https://dispatch-backend-07jy.onrender.com/docs

> The backend runs on Render's free tier and spins down after 15 minutes of
> inactivity. The first request after an idle period takes ~30-60 seconds.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, TanStack Router, TanStack Query, Tailwind v4, Vite |
| Backend | FastAPI, Pydantic v2, Uvicorn |
| Database | Supabase (Postgres) |
| Auth | JWT (`python-jose`) + bcrypt |
| ML | scikit-learn (TF-IDF + LogisticRegression), spaCy |
| Hosting | Vercel (frontend), Render (backend) |

## How it works

1. A user signs up or logs in. They land on `/report` and submit a free-text
   description of a security concern.
2. The backend runs the ML pipeline: classifies the category (phishing,
   account takeover, malware, data leak, suspicious activity), predicts a
   severity, extracts IPs/URLs/account references, and redacts names, phones,
   emails, and ID numbers.
3. The incident is stored in Supabase with the submitting user's ID.
4. Admins see all incidents. Regular users see only their own.
5. The `/new-report` page lets admins run the ML pipeline on a text sample
   without persisting anything.

## Repo layout

```
dispatch-repo/
├── frontend/          React SPA (see frontend/README.md)
├── backend/           FastAPI service (see backend/README.md)
└── ML_pipeline/       Classification + entity extraction (see ML_pipeline/README.md)
```

## Local development

Each service runs independently. You'll need three things running:

**1. Backend** — see `backend/README.md`

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, JWT_SECRET
uvicorn app.main:app --reload --port 8000
```

**2. Frontend** — see `frontend/README.md`

```bash
cd frontend
npm install
npm run dev
```

Dev mode proxies `/api/*` to `http://127.0.0.1:8000`, so the browser never
makes a cross-origin request.

**3. ML pipeline** — models are committed to the repo, so no setup is needed
to run the backend. To retrain:

```bash
cd ML_pipeline/src
python train.py
```

## Environment

| Service | File | Vars |
|---|---|---|
| Backend | `backend/.env` | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET` |
| Frontend | `frontend/.env.local` | `VITE_API_URL` (prod), `DISPATCH_API_PROXY_TARGET` (dev) |

Neither `.env` file is committed. `.env.example` templates are.

## Deployment

- **Backend** → Render, root directory `backend`. Auto-deploys on push to `main`.
- **Frontend** → Vercel, root directory `frontend`. Needs `VITE_API_URL` set to
  the backend URL, and a SPA rewrite in `vercel.json`.

See the individual READMEs for details.

## Known limitations

- The ML model is trained on a small synthetic dataset. Category accuracy is
  roughly 74% and severity ~60% on held-out data. It's a proof of concept,
  not a production classifier.
- Duplicate detection exists in `ML_pipeline/src/dedup.py` but is not wired
  into the API.
- The Render free tier spins down, so the first request after idle is slow.