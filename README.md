# Melbet Live Platform

Production-structured sports platform with a FastAPI backend and a Next.js frontend. The backend serves sports/news data APIs and admin APIs, while the frontend provides locale-aware public pages and admin management screens.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: FastAPI
- Database: PostgreSQL
- ORM / Migrations: SQLAlchemy 2.x / Alembic
- Containers: Docker / Docker Compose

## Project Structure

```text
backend/
  alembic/
  app/
frontend/
  src/
    app/
    components/
    features/
    i18n/
    lib/
    messages/
```

## Environment

### Backend

Copy `backend/.env.example` to `backend/.env` and adjust values as needed.

### Frontend

Copy `frontend/.env.example` to `frontend/.env.local` and adjust values as needed.

Important frontend variables:

- `INTERNAL_API_BASE_URL=http://localhost:8000`
- `NEXT_PUBLIC_API_BASE_URL=` (optional; leave blank when the frontend proxies browser requests)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## Run With Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Run Backend Locally

From the `backend` directory:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.utils.create_admin --username admin --email admin@example.com --password StrongPass123! --superuser
uvicorn app.main:app --reload
```

## Run Frontend Locally

From the `frontend` directory:

```bash
npm install
npm run dev
```

## Deploy To Render

This repo now includes a root `render.yaml` Blueprint that provisions:

- `melbet-live-db` as a Render Postgres database
- `melbet-live-backend` as a Docker web service
- `melbet-live-frontend` as a Docker web service

### Render deployment flow

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose `New` -> `Blueprint`.
3. Connect the repository and select this repo's root `render.yaml`.
4. During the initial Blueprint setup, provide values for:
   - `FOOTBALL_DATA_API_KEY`
   - `GNEWS_API_KEY`
5. Create the Blueprint and wait for all three resources to finish provisioning.
6. Open the frontend service URL once deploys complete.

### Render notes

- The backend runs `alembic upgrade head` on startup before launching Uvicorn.
- The frontend talks to the backend over Render's private network using `INTERNAL_API_BASE_URL`.
- Browser API calls are proxied through the frontend service, so `NEXT_PUBLIC_API_BASE_URL` is not required on Render.
- If you want to call the backend directly from another origin later, set `CORS_ALLOW_ORIGINS` on the backend service to a comma-separated list of allowed frontend URLs.

## Frontend Route Assumptions

- Match pages use `/[locale]/matches/[matchSlug]`, but `matchSlug` is treated as the backend `external_match_id`.
- The frontend URL-encodes the backend identifier instead of generating a separate slug because the backend currently exposes match details by external match ID only.
- News pages use the backend article slug directly.

## Public Pages

- `/{locale}`
- `/{locale}/matches/{matchSlug}`
- `/{locale}/news/{newsSlug}`

## Admin Pages

- `/{locale}/admin/login`
- `/{locale}/admin`
- `/{locale}/admin/streams`
- `/{locale}/admin/streams/new`
- `/{locale}/admin/streams/{externalId}/edit`
- `/{locale}/admin/redirects`

## Notes

- Public pages support English (`/en`) and Arabic (`/ar`) with LTR/RTL handling.
- The global click redirect provider runs only on public routes and uses backend redirect config.
- Frontend admin auth uses the backend token and stores it client-side because the backend currently exposes token login rather than secure cookie sessions.
