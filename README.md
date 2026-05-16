# AtomTrack - Goal Setting & Tracking Portal

## Background & Problem Context
Organizations that rely on manual or fragmented goal-tracking methods often struggle with alignment, visibility, and accountability [1]. Spreadsheets, emails, and offline review cycles create blind spots — managers cannot monitor team progress in real time, employees lack clarity on how their work connects to organizational priorities, and HR teams are left piecing together data at appraisal time [1]. 

AtomTrack is a structured, digital Goal Setting & Tracking Portal built for the **AtomQuest Hackathon 1.0** to eliminate these pain points [1, 2]. The system supports the full lifecycle of employee goals — from creation and alignment to quarterly check-ins and performance visibility — ensuring the process is intuitive, reliable, and audit-ready [2].

## Tech Stack & Architecture
* **Frontend/Backend:** Next.js (React)
* **Styling:** Tailwind CSS 
* **Deployment:** Vercel (Optimized for zero-cost, high-efficiency hosting) [3]
* **Accessibility:** Web-browser accessible portal (no desktop-only apps) [4].

## Core Features & Roles
The portal supports three distinct user roles with clearly differentiated capabilities [5]:
1. **Employee:** Can draft goals, enter quarterly achievements, and update progress statuses [5].
2. **Manager (L1):** Can review and approve goals, conduct quarterly check-ins, and log feedback [5].
3. **Admin / HR:** Can configure cycles, manage the org hierarchy, oversee completion rates, and unlock goals [6].

### System Workflow
* **Phase 1 (Goal Setting):** Employees define Goal Title, Thrust Area, Unit of Measurement (Numeric, %, Timeline, or Zero-based), Target, and Weightage [7]. The system strictly enforces that total weightage equals 100%, each goal has a minimum of 10% weightage, and no employee exceeds 8 goals [7]. 
* **Approval & Locking:** Managers review, inline edit, and approve goals, locking them from further edits without Admin intervention [7]. Admins/managers can also push shared departmental KPIs [7].
* **Phase 2 (Achievement Tracking):** Employees log Actual Achievement against Planned Targets during specific quarterly windows (Q1, Q2, Q3, Q4/Annual) [5, 8, 9]. 
* **Scoring Formulas:** System-computed progress scores are calculated automatically using Min, Max, Timeline, and Zero-based formulas [8, 9].

## Reporting & Governance
* **Achievement Report:** Exportable (CSV / Excel) showing Planned vs. Actual data [6].
* **Completion Dashboard:** Real-time view of check-in completions [6].
* **Audit Trail:** Logs all post-lock goal changes (who, what, when) [6].

## Setup & Demo Instructions
1. Clone the repository.
2. Run `npm install` and then `npm run dev`.
3. Navigate to `http://localhost:3000`.
4. Switch between user journeys using the following mock credentials [10]:
   - **Employee:** `emp@atomtrack.com` / `password`
   - **Manager:** `mgr@atomtrack.com` / `password`
   - **Admin:** `admin@atomtrack.com` / `password`