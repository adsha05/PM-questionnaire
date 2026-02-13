# PM Questionnaire (Production-ready)

This app now uses a secure backend for:
- Server-side Gemini analysis (API key never exposed in browser)
- Postgres storage for all questionnaire submissions
- Abuse prevention (validation, honeypot, rate limits, duplicate throttling, secure headers)

## Tech Stack
- Frontend: Vite + React + TypeScript
- Backend: Express (Node.js)
- Database: PostgreSQL
- AI analysis: Gemini (`@google/genai`) on the server

## Local Setup

1. Install dependencies:
   `npm install`
2. Copy env file:
   `cp .env.example .env`
3. Fill required values in `.env`:
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `HASH_SECRET`
   - `ENCRYPTION_SECRET`
   - `TRUST_PROXY_HOPS` (set `1` on Render/Railway/Fly)
4. Start frontend + backend:
   `npm run dev`

Frontend runs on `http://localhost:3000`, API runs on `http://localhost:8787`.

## Production Deploy (Recommended: Render / Railway / Fly)

1. Provision a PostgreSQL database.
2. Set these environment variables in your hosting platform:
   - `NODE_ENV=production`
   - `PORT` (platform default is usually auto-injected)
   - `DATABASE_URL`
   - `GEMINI_API_KEY`
   - `HASH_SECRET` (long random secret)
   - `ENCRYPTION_SECRET` (long random secret)
   - `TRUST_PROXY_HOPS=1` (if behind one reverse proxy)
   - Optional: `TURNSTILE_SECRET_KEY` + `VITE_TURNSTILE_SITE_KEY`
   - Optional: `ALLOWED_ORIGINS` (comma-separated)
3. Build command:
   `npm run build`
4. Start command:
   `npm run start`

The Node server serves both API and the built frontend (`dist/`) as a single deployable service.

### Render one-click blueprint
- This repo includes `render.yaml`.
- On Render, choose **New +** -> **Blueprint**, then point to this repository.
- Add only one secret manually: `GEMINI_API_KEY`.

## API Endpoints
- `POST /api/submissions`: validates input, runs Gemini, stores submission, returns results
- `GET /api/stats`: total submissions (baseline + stored)
- `GET /api/peers?archetype=...`: anonymized peer list by archetype
- `GET /api/health`: health check

## Security Controls Included
- Gemini key moved to backend
- Request payload validation (shape, question IDs, option IDs, text limits)
- Hidden honeypot field + optional Cloudflare Turnstile verification
- Durable database-backed throttling for IP and email burst limits
- Duplicate-submission and daily network submission limits
- Gemini safety limits: concurrency cap, request timeout, daily budget cap
- PII encrypted at rest in Postgres (name/email/company)
- Helmet security headers
- Strict proxy-aware client IP handling via `TRUST_PROXY_HOPS`
- Optional CORS allowlist via `ALLOWED_ORIGINS`

## Notes
- For very high traffic, move rate limiting from Postgres to Redis/edge WAF.
- Do not commit `.env` files.
