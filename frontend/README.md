# Dispatch — Frontend

The web UI for Dispatch, a security incident triage dashboard. Users file incident reports; analysts review, classify, and route them. This app handles authentication, the reporter submission flow, and the analyst workspace.

React SPA that talks to the FastAPI backend at `/api/*`.

## Stack

- React 19 + TypeScript
- TanStack Router (file-based routing, client-side only)
- TanStack Query (data fetching + caching)
- Tailwind CSS v4 + custom CSS modules
- Vite (dev server + build)
- shadcn/ui + Radix primitives

## Local setup

```bash
npm install
npm run dev
```

Opens on http://localhost:5173.

In dev, `/api/*` is proxied to the backend via Vite. By default it targets `http://127.0.0.1:8000`; override with `DISPATCH_API_PROXY_TARGET` in `.env.local`.

## Environment

Copy `.env.example` to `.env.local` and adjust:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Production only. Public URL of the backend. Baked in at build time. |
| `DISPATCH_API_PROXY_TARGET` | Dev only. Where Vite forwards `/api/*`. |

## Routes

| Path | Access | Purpose |
|---|---|---|
| `/login` | public | Reporter sign in |
| `/signup` | public | Reporter sign up |
| `/admin/login` | public | Admin sign in |
| `/report` | user | Submit an incident report |
| `/` | admin | Overview + recent incidents |
| `/incidents` | admin | Full incident queue |
| `/incidents/$incidentId` | admin | Incident detail |
| `/new-report` | admin | Analyze a report (no persistence) |
| `/analytics` | admin | Volume + severity analytics |

Regular users are redirected to `/report` after login; admins land on `/`.

## Building

```bash
npm run build
```

Output goes to `dist/`. Deployed on Vercel with a SPA rewrite so client-side routes work on hard reload (`vercel.json`).

## Auth

JWT stored in `localStorage` under `dispatch.token`. `lib/api.ts` attaches it as `Authorization: Bearer <token>` on every request. On 401, the token is cleared and the user is redirected to `/login`.
