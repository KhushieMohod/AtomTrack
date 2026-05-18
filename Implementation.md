# Implementation Tracker

## Phase 1 — Goal Creation & Approval (Must-Have)
- [x] **Employee Portal:** Interface to create and submit a Goal Sheet [7].
- [x] **Goal Fields:** Select Thrust Area, define Title/Description, assign UoM (Numeric, %, Timeline, Zero-based), Target, and Weightage [7].
- [x] **Validation Rules (Strict):** Total weightage = 100%, Min 10% per goal, Max 8 goals per employee [7].
- [x] **Manager Approval Flow:** Review goals, inline edit targets/weightages, or return for rework [7].
- [x] **Locking Mechanism:** Lock goals upon approval (requires Admin to unlock) [6, 7].
- [x] **Shared Goals:** Admin/Manager can push a departmental KPI to employees (Title/Target are read-only, employee adjusts weightage only) [7].

## Phase 2 — Achievement Tracking & Quarterly Check-ins (Must-Have)
- [x] **Quarterly Windows Enforced:** System restricts updates to active periods (Goal Setting in May, Q1 in July, Q2 in Oct, Q3 in Jan, Q4 in March/April) [5, 9].
- [x] **Employee Updates:** Log Actual Achievement vs Planned, select status (Not Started / On Track / Completed) [8].
- [x] **Manager Check-in:** View team data and add structured Check-in Comments [8].
- [x] **Progress Scores Formulas Implemented:**
  - [x] *Min:* Actual ÷ Target [8, 9]
  - [x] *Max:* Target ÷ Actual [9]
  - [x] *Timeline:* Completion date vs. Deadline [9]
  - [x] *Zero:* If 0 -> 100%, else 0% [9]

## User Roles & Routing
- [x] **Employee Dashboard:** Create goals, view locked goals, input actuals [5].
- [x] **Manager Dashboard:** Team overview, inline editing, comment logs [5].
- [x] **Admin Dashboard:** Cycle management, audit logs, goal unlocking [6].

## Reporting & Governance
- [x] **Achievement Report:** Export to CSV/Excel showing Planned vs Actual [6].
- [x] **Completion Dashboard:** Real-time view of completed check-ins [6].
- [x] **Audit Trail:** Log of who changed what and when (post-lock) [6, 11].

## Hackathon Deliverables Checklist
- [x] Accessible via web browser [4].
- [x] Architecture diagram generated (PDF/Image) [4, 10].
- [x] Code pushed to version control (GitHub) [4, 10].
- [ ] Live demo URL via Vercel [10].
- [x] Login credentials clearly provided [10].

## Bonus Features (Good-to-Have)
*(Only mark these if time permits)*
- [ ] Microsoft Entra ID (Azure AD) SSO Integration [11].
- [ ] Email & Microsoft Teams bot/adaptive card notifications [12].
- [ ] Rule-Based Escalation Module (auto-notifications for delays) [12].
- [ ] Analytics Module (QoQ trends, heatmaps, distribution analysis) [13].