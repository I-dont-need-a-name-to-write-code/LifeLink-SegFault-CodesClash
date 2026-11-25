# LifeLink — Blood Donor Network

A prototype for **CodesClash 2026 · Preliminary Round · Problem Statement 02: Blood Donor Finding Website**.

LifeLink helps a requester find potential blood donors by blood group and area, raises a request with a reference code, and gives an administrator a place to review listings and update request statuses.

> All profiles, names, areas and PIN codes in this project are fictional sample data. LifeLink does not verify identity, medical eligibility or availability, and is not a replacement for hospitals, licensed blood banks or medical professionals.

---

## What it does

**For requesters**

- Search approved donors by blood group, city/locality or PIN code.
- Automatically include **compatible blood groups** using the standard ABO/Rh chart (e.g. an O− donor appears for an A+ patient), with an option to show exact matches only.
- See a donor's display name, general area, availability preference and self-declared last donation.
- Send a blood request in a few fields and receive a **reference code** (e.g. `LL-7K2M4Q`).
- Add an email address so a matched donor can reply directly to you.
- Track a request through `Submitted → In Review → Donors Contacted → Fulfilled`.
- Browse open requests and click **I can help** to record an offer of help.

**For donors**

- Register a sample profile: display name, email, blood group, city/area/PIN, availability preference, optional last donation date and note.
- No phone numbers, addresses or medical details are collected or published.
- New profiles start as **pending** and only appear after admin approval.
- Open **My dashboard** (`/dashboard`) with your registered email to see direct requests, nearby compatible requests, and each requester's email so you can reply.

**For administrators** (`/admin`)

- Passcode-gated dashboard (demo passcode: `codesclash`).
- Approve, deactivate, reactivate or delete donor listings.
- Update request statuses and read the offers of help attached to each request.
- At-a-glance counters for pending listings, approved donors, open requests and offers.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2 (App Router, Turbopack) |
| UI | React 19.2, Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Database | Supabase (Postgres) via `@supabase/supabase-js` |
| Fonts | Geist via `next/font` |
| Deployment | Vercel (or any Node host) |

No paid APIs, no external AI service at runtime, no secrets committed.

---

## Getting started

```bash
npm install
npm run dev
# http://localhost:3000
```

### 1. Environment variables

Create or edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
# optional, defaults to "codesclash"
NEXT_PUBLIC_ADMIN_PASSCODE=codesclash
```

### 2. Database

Open your Supabase project → **SQL Editor** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.

That creates:

- `donors` — donor listings with `email`, `status` (`pending` / `approved` / `deactivated`)
- `blood_requests` — requests with a unique `reference_code`, `requester_email`, optional `donor_id` and workflow `status`
- `request_interests` — “I can help” offers linked to a request

It also adds indexes, prototype RLS policies and fictional demo rows (24 approved donors, 2 pending, 1 deactivated, 4 requests).

### 3. Fallback demo mode

If the Supabase variables are missing or the tables have not been created, the app automatically uses a browser-local demo store seeded with the same fictional data. This keeps the live demo working even without a backend, at the cost of changes being local to that browser.

---

## Project structure

```
app/
  layout.tsx            Root layout, header/footer, metadata
  page.tsx              Landing page: hero search, stats, compatibility table
  donors/page.tsx       Directory search (server reads URL filters)
  register/page.tsx     Donor registration
  dashboard/page.tsx    Donor dashboard: requests matched by email
  requests/page.tsx     Raise a request + open request board
  track/page.tsx        Track a request by reference code
  admin/page.tsx        Admin review dashboard
  safety/page.tsx       Safety, privacy and prototype disclosures
components/             Header, footer, cards, forms, dialogs, admin console
lib/
  types.ts              Shared domain types
  blood.ts              ABO/Rh compatibility, filtering, formatting helpers
  store.ts              Data layer: Supabase first, local demo fallback
  supabase.ts           Supabase client (null when not configured)
  seed.ts               Fictional sample data
supabase/schema.sql     Tables, indexes, RLS policies and demo rows
```

### Data flow

```
Browser (React client components)
   │
   ├─ lib/store.ts  ──►  Supabase REST (anon key)  ──►  Postgres tables
   │        │
   │        └─ fallback: localStorage (demo data, when backend unavailable)
   │
   └─ Next.js App Router (server components render static shells + page metadata)
```

---

## Demo script (3–5 minutes)

1. **Landing page** — explain the problem, point at the compatibility-aware search.
2. **Search** — pick `O−`, search `Mumbai`; note compatible groups and exact-match ordering.
3. **Send request** — open a donor card, submit a request, copy the reference code.
4. **Track** — open `/track`, paste the code, show the status timeline.
5. **Register** — add a new sample donor; show it is pending.
6. **Admin** — unlock with `codesclash`, approve the new listing, then return to the directory and find it.
7. **Requests board** — show open requests, click *I can help*, then see the offer inside the admin dashboard and update the status.

Try `LL-7K2M4Q` on the Track page for a ready-made in-progress sample.

---

## What is simulated

- All donor profiles, requests and offers to help are sample data.
- Admin authentication is a shared client-side passcode, not real auth.
- No SMS, email, push or WhatsApp notifications are sent.
- Request statuses change only when an admin updates them.
- Eligibility, identity, availability and matches are never verified.
- Without Supabase, data lives in the browser's `localStorage`.

## Possible next steps

- Real authentication with separate donor, requester and admin accounts.
- Verified contact flow (masked numbers, OTP, consent) instead of a preview-only request.
- Geospatial distance search and map view of nearby donors.
- SMS/WhatsApp alerts to compatible donors with rate limiting and opt-out.
- Donation cooldown tracking and reminder nudges.
- Audit log, reporting/analytics and abuse controls.
- Accessibility and localisation pass (Hindi and regional languages).

---

## Safety and privacy

See the in-app **Safety** page (`/safety`). In short: use sample data only, never publish real contact details or medical information, and let a hospital or licensed blood bank guide any real donation. Emergency helpline in India: **108**.
