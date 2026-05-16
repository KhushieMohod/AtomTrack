# AtomTrack — Performance Goal Management System

A professional, enterprise-grade performance management web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. AtomTrack enables organizations to define, track, and approve employee objectives through a structured quarterly appraisal cycle.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/<your-username>/AtomTrack.git
cd AtomTrack/AtomTrack

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

Select a role card on the login page to auto-fill credentials, then click **Sign in**.

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Employee** | Khushie Mohod | `khushie@atomtrack.com` | `Demo@123` |
| **Reporting Manager (L1)** | Sakshi Kuber | `sakshi@atomtrack.com` | `Demo@123` |
| **Admin / HR** | Shlok Chaudhari | `shlok@atomtrack.com` | `Demo@123` |

Additional seeded employees: Arjun Mehta (`arjun@atomtrack.com`) and Neha Gupta (`neha@atomtrack.com`).

---

## Features

### Authentication
- Email / password credential login with route-guarded dashboards
- Microsoft Entra ID (SSO) visual stub for enterprise integration
- Role-based access control (Employee, Manager, Admin)

### Phase 1 — Goal Creation & Approval
- **Employee Portal**: Create and submit goal sheets with up to 8 goals
- **Strict Validation**: Total weightage = 100%, minimum 10% per goal, max 8 goals
- **Manager Review**: Inline editing of targets and weightages
- **Approval Flow**: Approve & lock goals, or return for rework with feedback
- **Shared KPIs**: Admin can push departmental goals to employees (read-only, weightage-only edits)

### Phase 2 — Achievement Tracking
- **Quarterly Check-ins**: Log actual achievement vs. planned targets
- **Progress Scoring**: Automated scoring with 4 formula types (Min, Max, Timeline, Zero-based)
- **Manager Comments**: Structured feedback on quarterly performance
- **Quarter Windows**: System-enforced active/inactive periods (July, October, January, March/April)

### Phase 3 — Reporting & Governance
- **Achievement Report**: Export Planned vs. Actual data as CSV
- **Completion Dashboard**: Real-time view of employee & manager check-in status
- **Audit Trail**: Complete log of post-lock goal changes (who, what, when)
- **Error Handling**: Custom 404 page, global error boundary, graceful edge cases

### Bonus — Analytics Dashboard
- **QoQ Goal Achievement Trends**: Line chart visualizing quarterly performance by department
- **Completion Heatmap**: Color-coded grid of per-employee, per-quarter check-in completion rates
- **Goal Distribution**: Donut chart (by Thrust Area) + horizontal bar chart (by Unit of Measurement)
- **Manager Effectiveness Radar**: Radar chart comparing managers on approval rate, feedback quality, and team engagement

### Bonus — Rule-Based Escalations
- 3 automated escalation rules: Goal submission overdue, Manager approval ignored, Quarterly check-in missed
- Visual escalation log showing the full chain-of-command (Employee → Manager → HR)
- Summary dashboard with Critical, Active, and Escalated counts

### Bonus — Notifications (Teams & Email Stub)
- Global notification bell icon in the top navigation bar with unread count badge
- Simulated Teams / Email / System alerts (e.g., "Reminder: Submit your Q1 check-in", "Goal Approved by Sakshi Kuber")
- Deep-link routing from notification to the relevant goal sheet or dashboard
- Mark as read / Mark all read functionality

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page & login
│   ├── employee/           # Employee dashboard
│   ├── manager/            # Manager dashboard
│   ├── admin/              # Admin dashboard (7 tabs)
│   ├── not-found.tsx       # Custom 404
│   └── global-error.tsx    # Error boundary
├── components/
│   ├── auth/               # Login page
│   ├── layout/             # Header (with notifications), Logo
│   ├── goals/              # Goal form, review, check-ins, scoring
│   ├── admin/              # Reports, audit log, analytics, escalations
│   └── ui/                 # shadcn/ui primitives
├── context/                # React Context (global state)
├── hooks/                  # Auth guard hook
├── lib/                    # Mock data, scoring, validation, utils
└── types/                  # TypeScript definitions
```

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 | Framework (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | 4.7.0 | UI Components |
| Recharts | 2.x | Data Visualizations |
| Sonner | 2.x | Toast Notifications |
| Lucide React | 1.x | Icons |

---

## Deployment

### Push to GitHub

```bash
cd AtomTrack
git add -A
git commit -m "feat: complete AtomTrack with auth, analytics, escalations, and enterprise UI"
git branch -M main
git remote add origin https://github.com/<your-username>/AtomTrack.git
git push -u origin main
```

### Deploy to Vercel

```bash
# Option 1: Vercel CLI
npm i -g vercel
cd AtomTrack
vercel --prod

# Option 2: Connect via Vercel Dashboard
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repository
# 3. Set Root Directory to "AtomTrack"
# 4. Click Deploy
```

> **Important**: Set the root directory to `AtomTrack` (the inner folder containing `package.json`) when deploying.

---

## License

This project was built for the Hackathon demonstration. MIT License.