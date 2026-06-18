# BookFlow MVP

ระบบจองคิวออนไลน์สำหรับร้านค้า Social Media (TikTok Shop, คลินิก, ร้านทำเล็บ)

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **TailwindCSS** — Mobile-first UI
- **Prisma 6.19** + **Supabase (PostgreSQL)**
- **NextAuth.js** — Email/Password authentication

## Quick Start

### 1. Create a Supabase project

1. สร้าง project ที่ [supabase.com](https://supabase.com)
2. ไป **Project Settings → Database → Connection string**
3. คัดลอก **Transaction pooler** (port `6543`) → ใส่ใน `DATABASE_URL`
4. คัดลอก **Direct connection** (port `5432`) → ใส่ใน `DIRECT_URL`

### 2. Configure environment

```bash
cp .env.example .env
```

แก้ `[YOUR-PASSWORD]` และ `AUTH_SECRET` (สร้างด้วย `openssl rand -base64 32`)

### 3. Push database schema

```bash
npx prisma db push
npx prisma generate
```

> **Local dev (optional):** ยังใช้ Docker Postgres ได้ด้วย `docker compose up -d` แล้วตั้ง `DATABASE_URL` / `DIRECT_URL` เป็น `postgresql://bookflow:bookflow@localhost:5432/bookflow`

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Flows

### Merchant
1. Register at `/register` — creates shop with unique slug
2. Dashboard at `/dashboard` — overview, appointments, services, schedule
3. Copy booking link from Settings — `/{shop-slug}` for TikTok Bio

### Customer
1. Visit `/{shop-slug}` — browse services
2. Book at `/{shop-slug}/book/{serviceId}` — date → time → info
3. Success page with reference code

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register` | POST | Merchant signup |
| `/api/auth/[...nextauth]` | * | Authentication |
| `/api/services` | GET/POST | Service CRUD |
| `/api/merchant/settings` | GET/PATCH/POST/DELETE | Shop settings & holidays |
| `/api/slots` | GET | Available time slots |
| `/api/appointments` | GET/POST/PATCH | Booking management |
| `/api/webhooks/line` | POST | LINE OA webhook (Phase 3) |
| `/api/cron/reminders` | GET | 24h reminder cron |

## SRS Coverage

### Phase 1 ✅
- REQ-1.1.x: Auth, shop profile, slug URL
- REQ-1.2.x: Service CRUD with price & duration
- REQ-1.3.x: Working hours, weekly off, special holidays

### Phase 2 ✅
- REQ-2.1.x: Customer booking flow (mobile-first)
- REQ-2.2.x: Dashboard, queue management, status changes

### Phase 3 (Stubs)
- REQ-3.1.1: LINE Notify on new booking
- REQ-3.1.2: Reminder cron endpoint (integrate LINE/Email)
- REQ-3.2.x: LINE webhook with intent detection stub

### Non-Functional
- NFR-1: Slot conflict check before insert (race condition prevention)
- NFR-2: Mobile-first responsive UI
- NFR-3: Merchant-scoped data access

## Project Structure

```
src/
├── app/
│   ├── [shopSlug]/          # Customer booking pages
│   ├── dashboard/           # Merchant dashboard
│   ├── api/                 # REST API routes
│   └── login|register/      # Auth pages
├── components/              # UI components
├── lib/
│   ├── slots.ts             # Time slot calculation
│   ├── appointments.ts      # Booking with conflict check
│   └── notifications.ts     # LINE Notify
└── types/                   # Shared types
```
