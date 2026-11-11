# TriFit Apollo Enterprise Admin Portal — Full Operational Guide

> **Single Source of Truth** for the architecture, feature set, user journeys, and operational workflows of the TriFit Apollo Enterprise Admin Portal.

---

## 1. Executive Summary & Design System

The **TriFit Apollo Enterprise Admin Portal** is an executive-grade gym management ecosystem designed specifically for TriFit Pakistan's luxury multi-club fitness network.

### Visual Foundations (`DESIGN.md`)
- **Aesthetic:** Apple VisionOS frosted glassmorphism floating over an **Obsidian HUD** dark environment.
- **Palette:** Signature Yellow (`#FFD60A` Dark / `#FFCC00` Light), Obsidian Slate/Black (`#070708` to `#111008`), and Frosted White.
- **Glass Token:**
  ```css
  .glass {
    background: var(--card);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid var(--card-border);
    border-radius: 24px;
    box-shadow: var(--shadow), inset 0 1px 0 var(--highlight);
  }
  ```
- **Dual-Theme Engine:**
  - **Dark Mode (`.theme-dark`):** Futuristic cockpit HUD with ambient blurred golden light orbs behind translucent frosted cards.
  - **Light Mode (`.theme-light`):** Warm cream gradient (`#ffffff` to `#fcfaf1` to `#f2edd8`) with frosted white cards and sharp, readable text.
  - **Switching:** Instant toggle on the bottom left of the sidebar rail; state persists in `localStorage`.
- **Typography:** **Space Grotesk** (700 weight) for titles and KPIs; **Inter** (400–600 weight) for body text, tables, and labels.

---

## 2. Multi-Branch Network Architecture

All screens support dynamic, real-time scoping across TriFit Pakistan's 4 operational flagship clubs:

| Branch ID | Club Name | City | Area / Location | Type |
|---|---|---|---|---|
| `branch-seaview` | **TriFit Seaview DHA** | Karachi | Sea View Road, Phase 8, DHA | Mixed Premium Flagship |
| `branch-clifton` | **TriFit Clifton** | Karachi | Park Towers Vicinity, Block 4 | Mixed Luxury Club |
| `branch-luckyone` | **TriFit LuckyOne Mall** | Karachi | 2nd Floor, Rashid Minhas Road | Mixed Family & Pilates |
| `branch-ajtower` | **TriFit AJ Tower** | Islamabad | Civic Center, Gulberg Greens | Mixed Executive Club |

**Dynamic Context Behavior:**
- Selecting **"All Flagships"** provides consolidated executive analytics across Pakistan.
- Selecting any single branch filters all dashboard KPIs, revenue charts, member feeds, studio rosters, and coach assignments to that specific club.

---

## 3. Screen-by-Screen Feature Breakdown

### A. Executive Dashboard (`/admin`)

#### 1. Global Context Bar
- **Custom Glass Branch Selector:** Dropdown to switch between "All Flagships (Consolidated)" and individual clubs.
- **Date Range Filters:** `7d`, `30d`, `3m`, `6m`, `12m` chips dynamically adjusting collections and trend figures.
- **Primary Action Buttons:**
  - `+ Add Member`: Fast registration modal with immediate branch, package, and trainer assignment.
  - `Member Check-in`: Manual code entry and simulated camera QR turnstile scanner.

#### 2. High-Density Top KPI Cards
- **Card 1: Active Members:** Active enrolled member count (e.g. 33 demo members), 94.2% retention benchmark, and capacity progress bar.
- **Card 2: Monthly Revenue:** Monthly recurring collections (e.g. PKR 38.6M consolidated), day's pace, and quarterly goal progress.
- **Card 3: Total Coaches (Clickable Roster Launcher):**
  - Displays certified coaches (8 consolidated across Pakistan, or 2 per individual branch), `REPs L3` badge, active 1-on-1 PT clients, and monthly sessions delivered.
  - **Click Action:** Clicking anywhere on the card opens the interactive **Coach Roster Modal**.
- **Card 4: Fuel Bar & Retail Nutrition:** Collections (PKR 4.36M), total shakes blended (5,450), 64% gross margin, and top-selling product (Whey Gold).

#### 3. Analytical Chart Suite
- **Protein & Fuel Bar Revenue Chart (`ProteinRevenueChart.tsx`):**
  - **Multi-Branch Mode:** Comparative breakdown across all 4 clubs with branch-specific colors and adaptive contrast.
  - **Individual Branch Scope Mode:** Automatically switches to day-by-day collections for the selected club.
- **Subscription Tier Interactive Donut Chart (`SubscriptionDonutChart.tsx`):**
  - **Hover Elevation:** Hovering over any segment physically pops it outward from the center with an ambient drop-shadow.
  - **Center Hole Metric:** Displays consolidated active members or PKR volume.
  - **Interactive Switcher:** Toggle between high-level **2-Tier Distribution** (TriFit Regular vs TriFit Plus) or granular **6-Package Distribution** (3M, 6M, 12M).
  - **Cross-Highlighting Legend:** Hovering a legend item highlights the corresponding donut slice.
- **Subscription Growth & Revenue Trajectory Spline Chart (`SubscriptionGrowthTrajectoryChart.tsx`):**
  - Displays annual pace target (**108% Pace**).
  - Smooth curved golden spline with gradient fill underneath.
  - 6 Interactive Milestones: `Q1 (Kickoff)`, `Q2 (Expansion)`, `Q3 (Mid-Year)`, `Q4 (Peak Run)`, `Target Pace`, and pulsing `Year-End Trajectory`.
  - Hover tooltips reveal projected revenue and enrolled members.
  - Footers: `Average Plan Duration: 9.4 Months` and `Subscription Retention: 94.2% Active`.

#### 4. Bottom Grid Cards
- **Weekly Revenue Distribution:** Vertical bars by day of week with revenue breakdown (Memberships 68%, Personal Training 20%, Fuel Bar 12%).
- **Recent Activations Feed:** Live stream of recent registrations and renewals scoped by branch.
- **Quick Action Launcher:** One-click shortcuts to **Run AI Retention Engine** and **Export Audit Sheet (.CSV)**.

---

### B. Total Coaches Roster Modal (`CoachRosterModal.tsx`)

Triggered by clicking **"Total Coaches"** (Card 3) on the dashboard.
- **Search & Filter:** Search by coach name or specialty; filter by branch flagship.
- **Coach Cards:**
  - Photo avatar, name, and specialty (Strength & Hypertrophy, Stages RPM Cycling, Reformer Pilates, Functional HYROX, Vinyasa Flow).
  - Branch location badge and REPs Level 3 certification badge.
  - Performance Stats: Member star rating (4.95/5.0), active client count, completed monthly sessions, and hourly rate (PKR 3,500 – PKR 5,000 / hr).
  - Coach bio and background summary.
- **Admin Action:** Direct **WhatsApp Message** button opening a WhatsApp chat with pre-filled context.

---

### C. Signature Studios Management Portal (`/admin/studios`)

A dedicated management portal for the **5 TriFit Signature Studios**:

1. **🔥 HIIT Studio:** Woodway Curve Treadmills & MyZone heart-rate conditioning (24 stations).
2. **🚴 Cycling Studio:** Stages SC3 Smart Power Bikes & Stages Flight RPM video screens (28 stations).
3. **🧘 Yoga Studio:** Manduka Pro Mats & Infrared heated radiant ceiling panels (22 stations).
4. **🤸 Pilates Studio:** Balanced Body Allegro 2 Reformer Beds & core stabilization (14 stations).
5. **⚡ Functional Fitness Studio:** 30m sprint turf, prowler sleds, Olympic rigs & HYROX prep (30 stations).

#### Key Capabilities:
- **Top Metrics:** Total Stations (118 per club), Active Enrolled Members (96 Booked), Studio Utilization Rate (88.3%), Lead Instructors (8 Coaches).
- **Studio Overview Cards:** 5 frosted glass cards showing live occupancy progress bars and fill percentages.
- **Studio Filter Tabs:** Filter between All Studios or individual studios (HIIT, Cycling, Yoga, Pilates, Functional).
- **Actionable Member Roster Table:**
  - Displays each member taking a class with their **assigned Station / Spot #** (e.g. `Reformer Bed #03`, `Stages SC3 Bike #12`, `Turf Sprint Lane #01`).
  - Highlights member membership tier with a VIP crown for TriFit Plus members.
  - Shows class name, coach, time slot, and attendance status (`Checked-In`, `Reserved`, `Waitlist`).
- **Actionable Controls:**
  - **Check In / Attended Toggle:** One-click attendance recording.
  - **WhatsApp Alert Button:** Automatically formats a personalized WhatsApp confirmation text with class time, coach name, and station number.
  - **Cancel / Release Spot:** Frees up spots for waitlisted members with confirmation safeguard.
  - **+ Book Member into Studio Modal:** Quickly enrolls any member into any studio class with assigned station.
  - **Export CSV Button:** Generates a real-time downloadable CSV attendance and station roster sheet.

---

### D. Official TriFit Membership Packages (`/admin/plans`)

Strictly adheres to official **TriFit Pakistan packages**:

#### 🏋️ TriFit Regular Plans (Multi-Gym Access, Guest Passes, Sauna & Steam)
1. **3 Months Operating:** PKR 52,999 upfront *(PKR 17,666 / mo)*
2. **6 Months Operating:** PKR 84,999 upfront *(PKR 14,167 / mo)*
3. **12 Months Operating (Most Popular / Best Value):** PKR 122,999 upfront *(PKR 10,250 / mo)*

#### 👑 TriFit Plus Plans (All Regular Features + Personal Training + Unlimited Guests)
1. **3 Months Operating:** PKR 65,999 upfront *(PKR 22,000 / mo)*
2. **6 Months Operating:** PKR 105,999 upfront *(PKR 17,667 / mo)*
3. **12 Months Operating (Best Value VIP):** PKR 155,999 upfront *(PKR 13,000 / mo)*

---

### E. Branch Network Management (`/admin/network`)

- Displays all 4 operational flagship clubs in Karachi and Islamabad.
- **Contrast Assurance:** Uses frosted dark glass tokens (`var(--card)`) so branch cards never render stark white in dark mode.
- **Metrics per Club:** Active members, monthly collections, assigned coaches, maximum capacity, GM contact.
- **Actions:**
  - **Manage:** Switches the entire portal's active branch scope to that specific club.
  - **Inspect:** Modal with facility specs, operating hours, and equipment breakdowns.
  - **Add / Edit Branch:** Update club details, capacity limits, and manager assignments.

---

### F. Member Directory & CRM (`/admin/members`)

- **Full Roster:** Searchable and filterable by branch, membership plan, status (`Active`, `At-Risk`, `Frozen`, `Expired`), and trainer assignment.
- **Member Profile Modal:** Displays membership history, check-in frequency, Bio-Scan body fat / biometric history, and emergency contact details.
- **Add Member Workflow:** Enrolls new members with immediate branch, plan, and trainer assignment.

---

### G. AI Retention & Intelligence Engine (`/admin/brain`)

- **Risk Scoring:** Analyzes check-in frequency drops and payment status to assign member risk tiers (`High Risk`, `Medium Risk`, `Healthy`).
- **AI Winback Assistant:** Generates personalized WhatsApp retention offers (e.g., complimentary PT session or Fuel Bar smoothie pass) with an admin "Approve & Send" workflow.

---

### H. Finance & Executive Reports (`/admin/finance`, `/admin/reports`)

- Complete ledger of membership dues, POS nutrition payments, PT packages, and refund audits.
- Export CSV capability for accounting audits.

---

### I. Deprecated Features & Redirect Safeguards

- **Turnstile Attendance (`/admin/attendance`):** Automatically redirects to `/admin/studios`.
- **Social Hub (`/social`):** Automatically redirects to `/admin/studios`.
- **Navigation Cleanup:** All references removed from sidebar navigation, rail shortcuts, and mobile drawer.

---

## 4. Key File Map

| File Path | Description |
|---|---|
| [`app/admin/page.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/app/admin/page.tsx) | Executive HUD Dashboard (KPIs, Charts, Branch Selector, Activations) |
| [`app/admin/studios/page.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/app/admin/studios/page.tsx) | TriFit Signature Studios Management Portal |
| [`app/admin/network/page.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/app/admin/network/page.tsx) | Branch Network Management (4 Flagship Clubs) |
| [`app/admin/plans/page.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/app/admin/plans/page.tsx) | TriFit Regular & Plus Membership Packages |
| [`components/trainers/CoachRosterModal.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/components/trainers/CoachRosterModal.tsx) | Individual Coaches Roster & WhatsApp contact modal |
| [`components/dashboard/SubscriptionGrowthTrajectoryChart.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/components/dashboard/SubscriptionGrowthTrajectoryChart.tsx) | Subscription Growth & Revenue Trajectory spline chart |
| [`components/dashboard/SubscriptionDonutChart.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/components/dashboard/SubscriptionDonutChart.tsx) | Interactive Donut with hover slice pop-out & tier toggle |
| [`components/dashboard/ProteinRevenueChart.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/components/dashboard/ProteinRevenueChart.tsx) | Fuel Bar & Protein Revenue multi-branch comparison |
| [`components/layout/AdminPortalLayout.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/components/layout/AdminPortalLayout.tsx) | Global Admin Layout, 76px sticky rail, and theme switcher |
| [`lib/apollo-demo-store.tsx`](file:///c:/Users/PMLS/Desktop/Apollo/lib/apollo-demo-store.tsx) | Central state store for members, branches, trainers, plans, and studios |
| [`src/styles/theme.css`](file:///c:/Users/PMLS/Desktop/Apollo/src/styles/theme.css) | Core design system tokens for Dark and Light themes |

---

## 5. Development & Testing Commands

```bash
# Start local development server
npm run dev

# Run automated Vitest unit tests (68 tests)
npm test

# Run strict TypeScript typecheck
npx tsc --noEmit
```

*Generated for TriFit Apollo Enterprise.*
