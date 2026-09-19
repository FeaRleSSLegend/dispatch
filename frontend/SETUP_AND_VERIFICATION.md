# Dispatch frontend: local setup and API verification

The visual refresh does **not** modify the Python backend, Supabase authentication,
database schema, or ML pipeline. A request that says **Failed to fetch** is a
browser network failure, not evidence that an admin password was rejected.

## Start both services

1. Keep your existing working `backend/.env` and Supabase project configuration.
   Neither is included in the ZIP. In one terminal, start your existing FastAPI
   backend from `backend/` (normally `uvicorn app.main:app --reload --port 8000`).
   If its Python dependencies or `.env` are missing, follow the original backend
   setup first; running `npm install` does not start Python.
2. Check `http://127.0.0.1:8000/api/health` in a browser before trying to sign in.
   Expect JSON, not a network error. If startup fails, read the backend terminal.
3. In a second terminal, `cd frontend`, then `npm install` and `npm run dev`.
   Open the URL printed by Vite. Vite forwards browser `/api/*` requests to
   `http://127.0.0.1:8000`, avoiding local cross-origin and dynamic-port issues.
4. If your backend uses a different host or port, put
   `DISPATCH_API_PROXY_TARGET=http://YOUR_HOST:PORT` in `frontend/.env` and
   restart Vite. **Remove any old `VITE_API_URL=http://localhost:8000` line**
   from local frontend configuration. The dev proxy handles requests instead.

## If admin sign-in still fails

- Browser DevTools > Network > sign-in request: a `401` means the backend
  rejected the credentials; inspect the existing account and role in your
  configured Supabase database. A `500` can indicate the backend failed to
  contact Supabase; inspect the Python server terminal. A connection error or
  `502/503` means the frontend could not reach its API target.
- `npm notice: New major version of npm available` is an informational notice,
  **not** a project error. npm is installed on your computer, not fixed by a
  dependency version in this ZIP. Do not upgrade it merely to troubleshoot login.

## Deployment

If frontend and backend share a host, configure hosting to forward `/api/*` to
FastAPI. If they have separate public origins, set `VITE_API_URL` at **build time**
to the real public HTTPS backend origin and configure backend CORS for your
frontend origin. `localhost` in a deployed frontend points at each visitor's
computer; it is not a usable production API address.

## Verification boundary

Frontend API calls and routing have been kept intact except for the development
network transport and connection-error messaging. Successful live admin login
requires your running API, configured database and real account; it cannot be
asserted by a frontend-only static validation.
