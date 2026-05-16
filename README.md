# ⚛️ AtomTrack — Performance Goal Management System

A professional, human-centric performance management web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. AtomTrack enables organizations to define, track, and approve employee objectives through a structured quarterly appraisal cycle.

---

## 🚀 Quick Start

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

## 🔑 Demo Credentials

This is a demo environment with mock authentication. Click any role card on the login page:

| Role | Name | Email |
|------|------|-------|
| **Employee** | Priya Sharma | priya.sharma@atomtrack.io |
| **Manager (L1)** | Rajesh Kumar | rajesh.kumar@atomtrack.io |
| **Admin / HR** | Anita Desai | anita.desai@atomtrack.io |

---

## ✨ Features

### Phase 1 — Goal Creation & Approval
- **Employee Portal**: Create and submit goal sheets with up to 8 goals
- **Strict Validation**: Total weightage = 100%, minimum 10% per goal, max 8 goals
- **Manager Review**: Inline editing of targets and weightages
- **Approval Flow**: Approve & lock goals, or return for rework with feedback
- **Shared KPIs**: Admin can push departmental goals to employees

### Phase 2 — Achievement Tracking
- **Quarterly Check-ins**: Log actual achievement vs. planned targets
- **Progress Scoring**: Automated scoring with 4 formula types (Min, Max, Timeline, Zero-based)
- **Manager Comments**: Structured feedback on quarterly performance
- **Quarter Windows**: System-enforced active/inactive periods

### Phase 3 — Reporting & Governance
- **Achievement Report**: Export Planned vs. Actual data as CSV
- **Completion Dashboard**: Real-time view of employee & manager check-in status
- **Audit Trail**: Complete log of post-lock goal changes (who, what, when)
- **Architecture Diagram**: Interactive system architecture visualization
- **Error Handling**: Custom 404 page, global error boundary, graceful edge cases

---

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Login (role selection)
│   ├── employee/           # Employee dashboard
│   ├── manager/            # Manager dashboard
│   ├── admin/              # Admin dashboard (6 tabs)
│   ├── not-found.tsx       # Custom 404
│   └── global-error.tsx    # Error boundary
├── components/
│   ├── auth/               # Login page
│   ├── layout/             # Header, Logo
│   ├── goals/              # Goal form, review, check-ins, scoring
│   ├── admin/              # Reports, audit log, architecture
│   └── ui/                 # shadcn/ui primitives
├── context/                # React Context (global state)
├── hooks/                  # Auth guard hook
├── lib/                    # Mock data, scoring, validation, utils
└── types/                  # TypeScript definitions
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 | Framework (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | 4.7.0 | UI Components |
| Sonner | 2.x | Toast Notifications |
| Lucide React | 1.x | Icons |

---

## 📦 Deployment

### Push to GitHub

```bash
cd AtomTrack
git add -A
git commit -m "feat: complete AtomTrack with all 3 phases"
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

## 📄 License

This project was built for the Hackathon demonstration. MIT License.