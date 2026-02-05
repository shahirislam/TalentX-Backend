# TalentX Backend

REST API for TalentX – AI & Data Expert Marketplace. Node.js, Express, MongoDB Atlas, Firebase Auth, Google Gemini.

## Requirements

- Node.js 18+
- MongoDB Atlas (database name: **TalentX**)
- Firebase project (for Auth)
- Google Gemini API key

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy env example and set variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - **MONGODB_URI** – Atlas connection string
   - **GEMINI_API_KEY** – from Google AI Studio
   - **Firebase** – either `GOOGLE_APPLICATION_CREDENTIALS` (path to service account JSON) or `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

3. Run:
   ```bash
   npm start
   ```
   Dev with auto-reload:
   ```bash
   npm run dev
   ```

Server listens on `PORT` (default 3000). Health: `GET /health`.

## Seeding

Seed employer profiles, talent profiles, and job posts:

```bash
npm run seed
```

This inserts (and replaces on re-run):

- **Employers:** 2 users (Acme Corp, DataDrive Inc) with UIDs `seed_employer_001`, `seed_employer_002`.
- **Talents:** 3 users (Alex Chen, Sam Rivera, Jordan Lee) with UIDs `seed_talent_001`, etc., and skills.
- **Jobs:** 4 job posts linked to the seed employers.

**Login:** Auth is via Firebase. To use seeded users in tests:

- Create Firebase Auth users (e.g. in Firebase Console or Auth Emulator) and set their UID to match the seed UIDs above, **or**
- Sign up normally in the app, then call `POST /users/onboard` with `name`, `email`, and `role`; the seeded jobs will still appear in `GET /jobs`.

## API Overview

- **Auth:** All protected routes use `Authorization: Bearer <Firebase ID token>`.
- **Roles:** `EMPLOYER` | `TALENT`; set via `POST /users/onboard`.

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | /users/onboard | yes | any |
| GET | /jobs | no | - |
| GET | /jobs/:id | no | - |
| POST | /jobs | yes | EMPLOYER |
| POST | /jobs/generate-jd | yes | EMPLOYER |
| GET | /jobs/:id/applicants | yes | EMPLOYER |
| GET | /talents/matched?jobId= | yes | EMPLOYER |
| POST | /jobs/:id/apply | yes | TALENT |
| GET | /talent/jobs/matched | yes | TALENT |
| GET | /invitations | yes | TALENT |
| POST | /invitations | yes | EMPLOYER |
| POST | /invitations/:id/respond | yes | TALENT |

No mock data; all data is persisted in MongoDB Atlas.
