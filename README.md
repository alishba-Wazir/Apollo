# APOLLO for TRI FIT — Enterprise AI Operations & Retention

APOLLO is an enterprise AI operations and retention ecosystem engineered for **TRI FIT**, Pakistan's premier multi-branch gym network (Karachi Seaview Flagship, Islamabad AJ Tower, and Islamabad Soha Mall; Lahore expansion planned).

APOLLO is built as **one unified system with one database and two portals**:
1. **Admin Portal**: Executive ownership and Head Office oversight across all branches and cities.
2. **Branch Manager Portal**: Localized, server-scoped club operations and retention for their own branch only.

> **Design & Safety Standards**: Pure `#050505` dark mode and `#FFFFFF` light mode, `#FFD91C` gold accent, black-on-yellow text (`--on-accent: #050505`), glassmorphism (`backdrop-filter blur(28px)`), strict **PKR** currency formatting (zero `$` symbols), and permanently disabled auto-send (`100% human manager approval enforced`). Zero real member data; all phone numbers formatted as `0300-0000000` demo series.

---

## The Two Portals & Delivered Screens

### 1. Branch Manager Portal (`/branch/*`) — Own Club Scope Only
- **Today (`/branch/today`)**: Real-time KPI counters, 06:00–23:00 hourly attendance curve (`BranchHourlyCurveChart`) with live pulsing indicator, turnstile stream, and prayer auto-ducking.
- **Win-back AI (`/branch/winback`)**: Absent members queue, habit drop trajectory (`MemberHabitDropChart`), Gemini bilingual drafting (English & Roman Urdu), simulated mobile WhatsApp frame with blue ticks, and mandatory human medical handover safety.
- **Trainers (`/branch/trainers`)**: Daily coaching roster, on-duty attendance indicators, shift schedule utilization progress meters, 1-on-1 member bookings, and no-show protection alerts.
- **Classes (`/branch/classes`)**: Studio schedules across 4 fitness studios, live seat fill meters, automated prayer buffer conflict detector, and FIFO waitlist turnstile promoter.
- **Equipment (`/branch/equipment`)**: Equipment health statuses (`OPERATIONAL`, `ATTENTION`, `MAINTENANCE`), service expense logger in PKR, and active manufacturer warranty tracking.
- **Prayer & Ramadan (`/branch/prayer`)**: City astronomical timetables (Karachi & Islamabad), 20-minute congregation audio ducking protocol, and Ramadan Operational Mode (night shift 21:00–04:00 with Sehri access).

### 2. Admin Portal (`/admin/*`) — Global Network Scope
- **Network Overview (`/admin`)**: Consolidated multi-branch KPIs, members-by-branch gradient bars (`GradientBarChart`), 6-month revenue line chart in PKR (`AnimatedLineChart`), 4 circular operational health dials (`CircularDial`), and complete multi-city matrix table.
- **Win-back Results (`/admin/winback-results`)**: Members brought back per branch bars, categorized root causes of absenteeism tagged by Gemini AI (Work, Travel, Boredom, Cost, Injury), and 6-month recovery rate progression line chart.
- **Trainers (`/admin/trainers`)**: Network-wide 30-day attendance adherence (`98.2%`), client loads per coach, performance star ratings, and professional accreditation compliance radar.
- **Revenue (`/admin/revenue`)**: MRR by plan tier bars (BLACK Elite, PLATINUM, FOUNDER), 6-month forecast line chart, and dynamic price elasticity slider computing projected MRR, expected member attrition, and margin feasibility.
- **Classes (`/admin/classes`)**: Cross-branch studio demand bars, interactive studio occupancy heatmap (where yellow opacity scales dynamically with class seat occupancy), and multi-branch schedule matrix.
- **Equipment (`/admin/equipment`)**: Network asset register, cumulative repair spend by branch bars in PKR, manufacturer warranty radar, and 3-year replacement CapEx plan.
- **Prayer and Ramadan (`/admin/prayer`)**: City-specific timetables, network-wide Ramadan master switch, branch-level overrides, and automated PA audio ducking.
- **APOLLO BRAIN (`/admin/brain`)**: Clean 3-tab architecture featuring:
  1. *AI Recommendations & Evidence*: Proactive decisions with ID, model version, confidence bar, grounded telemetry, and Approve/Reject buttons that turn into status chips.
  2. *WhatsApp Communications Center*: Bilingual templates, member opt-in consent records (98.4%), and outbound message logs.
  3. *Settings & Governance*: Per-branch auto-send master setting (Default: OFF), two-portal role boundaries, SQLite dev.db sync telemetry, and security audit log link.

---

## Seeded Demo Accounts

The database is pre-seeded in SQLite (`prisma/dev.db`) with 3 branches, 132 members, 9 trainers, 18 equipment items, 3,039 turnstile visits, and 3 demo accounts:

| Role | Name | Email | Password | Scope |
|---|---|---|---|---|
| **Executive Admin** | TriFit Lead Admin | `admin@trifit.com` | `Password123!` | Global (All Branches & Cities) |
| **Branch Manager** | Seaview General Manager | `manager.seaview@trifit.com` | `Password123!` | Karachi Flagship (`branch-seaview`) |
| **Branch Manager** | AJ Tower Branch Manager | `manager.ajtower@trifit.com` | `Password123!` | Islamabad (`branch-ajtower`) |

> The `/login` page includes **1-Click Demo Persona quick-fill buttons** for instant switching between Admin and Branch Manager roles.

---

## Tech Stack & Design Tokens

- **Framework**: Next.js 14 (App Router)
- **Database & ORM**: SQLite (`prisma/dev.db`) via Prisma 5.22.0
- **Language**: TypeScript 5.6 (Strict Typecheck Passed)
- **Styling**: Tailwind CSS with CSS Variables (`data-theme="dark|light"`)
- **Accent**: `#FFD91C` (the only accent colour), text on yellow is always black (`#050505`)
- **Components**: Framer Motion & SVG charts (`AnimatedLineChart`, `GradientBarChart`, `CircularDial`, `AnimatedCounter`, `StatusBadge`)
- **Testing**: Vitest 5.1 (8 test suites, 58 tests passed with 0 failures)

---

## Setup & Running the Application

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm

### 2. Install Dependencies
```bash
npm install
```

### 3. Initialize & Seed Database
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Run the comprehensive seed script
npx tsx prisma/seed.ts
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run the Production Build
```bash
npm run build
npm start -- -p 3000
```

---

## Running the Automated Test Suites

Run the full Vitest suite:
```bash
npx vitest run
```

All 8 test suites pass with **58 passed tests (0 failures)**:
- `tests/unit/rbac.test.ts`: Server-side branch permissions & 403 Forbidden enforcement.
- `tests/unit/pricing-simulator.test.ts`: Churn elasticity formula and net MRR projections.
- `tests/unit/waitlist-queue.test.ts`: FIFO waitlist queue and seat promotion logic.
- `tests/unit/winback-guardrails.test.ts`: 14-day cooldown, opt-in consent, quiet hours, and prayer time buffers.
- `tests/unit/brain-safety.test.ts`: Prohibited medical diagnostic terms and ethical AI boundary verification.
- `tests/unit/payment-idempotency.test.ts`: Webhook idempotency and zero card data storage.
- `tests/unit/phase1-foundation.test.ts`: Salted password hashing, session cookies, and audit logging.
- `tests/unit/phase2-data-sync.test.ts`: SQLite dev.db schema consistency and multi-city scoping.
