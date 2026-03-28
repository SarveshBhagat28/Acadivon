# Acadivon — AI-Powered Education Platform

> Manage timetables, track attendance, get AI tutoring, and optimise your academic journey.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 |
| Database ORM | Prisma 6 + PostgreSQL |
| Authentication | Firebase Auth (email/password, Google, GitHub) |
| AI | OpenAI GPT-4o |
| Deployment | Vercel (frontend) + Railway / Supabase (DB) |

---

## Local Development

### 1. Prerequisites

- Node.js ≥ 20
- PostgreSQL (local or via Docker)
- Firebase project
- OpenAI API key

### 2. Clone & install

```bash
git clone https://github.com/SarveshBhagat28/Acadivon.git
cd Acadivon
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
# Fill in all values in .env.local
```

See [Environment Variables](#environment-variables) below for descriptions.

### 4. Set up the database

```bash
# Push the schema to your PostgreSQL database
npx prisma db push

# (Optional) Open Prisma Studio to inspect data
npx prisma studio
```

### 5. Run the development server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment

### Option A — Vercel (recommended)

1. Push your code to GitHub.
2. Import the repository on [vercel.com/new](https://vercel.com/new).
3. Set all [Environment Variables](#environment-variables) in the Vercel dashboard.
4. Vercel will automatically run `npm install` → `prisma generate` → `next build`.
5. Add a PostgreSQL database (Vercel Postgres, Neon, Supabase, or Railway).
6. Run the initial migration:
   ```bash
   npx prisma db push
   ```
7. Deploy!

### Option B — Docker / Railway

The project is configured with `output: "standalone"` in `next.config.ts`, which produces a self-contained bundle under `.next/standalone`.

**Railway** (one-click):
1. Create a new Railway project.
2. Add a PostgreSQL service and copy the `DATABASE_URL`.
3. Deploy the repo — Railway auto-detects Next.js.
4. Add all environment variables in the Railway dashboard.

**Docker** (manual):
```bash
# Build
docker build -t acadivon .

# Run
docker run -p 3000:3000 --env-file .env.local acadivon
```

> The project does not yet include a `Dockerfile`. Add one if you need custom Docker builds.

---

## Environment Variables

Copy `.env.local.example` → `.env.local` and fill in every value.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `FIREBASE_ADMIN_PROJECT_ID` | ✅ | Firebase Admin project ID |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ | Firebase Admin private key (PEM) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | ✅ | Firebase Admin service account email |
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `OPENAI_MODEL` | optional | Model name, defaults to `gpt-4o` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public URL of the deployed app |
| `JWT_SECRET` | ✅ | Secret for JWT session tokens |
| `PINECONE_API_KEY` | optional | Pinecone vector DB key |
| `CLOUDINARY_CLOUD_NAME` | optional | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | optional | Cloudinary API secret |

> **Never** commit `.env.local` to version control — it is in `.gitignore`.

### Authentication troubleshooting

- Merging branches does **not** copy deployment environment variables.
- Client sign-in UI needs: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`.
- Backend auth APIs (`/api/auth`, `/api/auth/login`) also need: `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_PRIVATE_KEY`, `FIREBASE_ADMIN_CLIENT_EMAIL`.
- If Admin variables are missing, auth API responses return a clear configuration error (HTTP 503) so the root cause is visible.

---

## Project Structure

```
Acadivon/
├── app/
│   ├── (auth)/           # Login & Register pages
│   ├── (dashboard)/      # Dashboard, Timetable, AI Hub
│   ├── api/              # API routes (auth, tutor, analyzer, planner, health)
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/           # Sidebar, Header
│   └── ui/               # Button, Card, Input, Badge
├── lib/
│   ├── ai/               # Tutor, Analyzer, Planner services
│   ├── auth/             # Firebase client + Admin SDK
│   ├── db/               # Prisma client singleton
│   └── utils/            # cn() utility
├── prisma/
│   └── schema.prisma     # 12 database models
├── types/
│   └── index.ts
├── vercel.json
└── .env.local.example
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/health` | `GET` | Health check — returns `{ status: "ok" }` |
| `/api/auth` | `GET`, `POST` | Firebase token verification + user upsert |
| `/api/tutor` | `POST` | AI Tutor chat (GPT-4o) |
| `/api/analyzer` | `GET`, `POST` | Performance insights generation |
| `/api/planner` | `GET`, `POST` | Weekly study plan generation |

---

## License

[Apache 2.0](LICENSE)
