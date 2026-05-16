import { User, GoalSheet, SharedGoal, QuarterlyCheckIn, ManagerComment, AuditLogEntry } from "@/types";

// ─── Mock Users (Seeded for Hackathon Demo) ──────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "emp-001",
    name: "Khushie Mohod",
    email: "khushie@atomtrack.com",
    password: "Demo@123",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "emp-002",
    name: "Arjun Mehta",
    email: "arjun@atomtrack.com",
    password: "Demo@123",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "emp-003",
    name: "Neha Gupta",
    email: "neha@atomtrack.com",
    password: "Demo@123",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "mgr-001",
    name: "Sakshi Kuber",
    email: "sakshi@atomtrack.com",
    password: "Demo@123",
    role: "manager",
    department: "Engineering",
  },
  {
    id: "admin-001",
    name: "Shlok Chaudhari",
    email: "shlok@atomtrack.com",
    password: "Demo@123",
    role: "admin",
    department: "Human Resources",
  },
];

// ─── Mock Goal Sheets (pre-seeded for demo) ──────────────────────────────────

export const INITIAL_GOAL_SHEETS: GoalSheet[] = [
  {
    id: "gs-001",
    employeeId: "emp-002",
    employeeName: "Arjun Mehta",
    status: "submitted",
    submittedAt: new Date().toISOString(),
    goals: [
      {
        id: "g-001",
        title: "Increase quarterly sales revenue",
        thrustArea: "Revenue Growth",
        unit: "Percentage",
        target: "15",
        weightage: 30,
      },
      {
        id: "g-002",
        title: "Onboard 5 new enterprise clients",
        thrustArea: "Client Acquisition",
        unit: "Numeric",
        target: "5",
        weightage: 25,
      },
      {
        id: "g-003",
        title: "Complete AWS certification",
        thrustArea: "Skill Development",
        unit: "Zero-based",
        target: "Certified",
        weightage: 20,
      },
      {
        id: "g-004",
        title: "Deliver project milestones on time",
        thrustArea: "Project Delivery",
        unit: "Timeline",
        target: "Q3 2026",
        weightage: 25,
      },
    ],
  },
  {
    id: "gs-002",
    employeeId: "emp-001",
    employeeName: "Khushie Mohod",
    status: "locked",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    goals: [
      {
        id: "g-005",
        title: "Reduce deployment failures",
        thrustArea: "Quality",
        unit: "Numeric (Max)",
        target: "2",
        weightage: 30,
      },
      {
        id: "g-006",
        title: "Improve code coverage to 85%",
        thrustArea: "Quality",
        unit: "Percentage",
        target: "85",
        weightage: 25,
      },
      {
        id: "g-007",
        title: "Mentor 2 junior developers",
        thrustArea: "Leadership",
        unit: "Numeric",
        target: "2",
        weightage: 20,
      },
      {
        id: "g-008",
        title: "Complete security audit",
        thrustArea: "Compliance",
        unit: "Zero-based",
        target: "Completed",
        weightage: 25,
      },
    ],
  },
];

// ─── Mock Shared Goals (Departmental KPIs) ───────────────────────────────────

export const INITIAL_SHARED_GOALS: SharedGoal[] = [
  {
    id: "sg-001",
    title: "Achieve 95% Customer Satisfaction Score",
    thrustArea: "Customer Experience",
    unit: "Percentage",
    target: "95",
    defaultWeightage: 15,
    createdBy: "admin-001",
    assignedTo: ["emp-001", "emp-002", "emp-003"],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Mock Quarterly Check-ins ────────────────────────────────────────────────

export const INITIAL_CHECK_INS: QuarterlyCheckIn[] = [
  {
    id: "ci-001",
    goalSheetId: "gs-002",
    goalId: "g-005",
    employeeId: "emp-001",
    quarter: "Q1",
    plannedTarget: "Max 2 failures",
    actualAchievement: "1",
    status: "On Track",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ci-002",
    goalSheetId: "gs-002",
    goalId: "g-006",
    employeeId: "emp-001",
    quarter: "Q1",
    plannedTarget: "85% coverage",
    actualAchievement: "72",
    status: "On Track",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ci-003",
    goalSheetId: "gs-002",
    goalId: "g-007",
    employeeId: "emp-001",
    quarter: "Q1",
    plannedTarget: "2 mentees",
    actualAchievement: "2",
    status: "Completed",
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ci-004",
    goalSheetId: "gs-002",
    goalId: "g-008",
    employeeId: "emp-001",
    quarter: "Q1",
    plannedTarget: "Complete audit",
    actualAchievement: "0",
    status: "Completed",
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Mock Manager Comments ───────────────────────────────────────────────────

export const INITIAL_MANAGER_COMMENTS: ManagerComment[] = [
  {
    id: "mc-001",
    goalSheetId: "gs-002",
    goalId: "g-005",
    employeeId: "emp-001",
    managerId: "mgr-001",
    quarter: "Q1",
    comment: "Great progress on reducing deployment failures. Keep it up!",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mc-002",
    goalSheetId: "gs-002",
    goalId: "g-007",
    employeeId: "emp-001",
    managerId: "mgr-001",
    quarter: "Q1",
    comment: "Excellent mentorship — both juniors are showing visible improvement.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Mock Audit Log ──────────────────────────────────────────────────────────

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "emp-001",
    userName: "Khushie Mohod",
    userRole: "employee",
    action: "goal_submitted",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet submitted for approval",
    details: { employeeName: "Khushie Mohod" },
  },
  {
    id: "audit-002",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Sakshi Kuber",
    userRole: "manager",
    action: "goal_approved",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet approved for Khushie Mohod",
    details: { employeeName: "Khushie Mohod" },
  },
  {
    id: "audit-003",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Sakshi Kuber",
    userRole: "manager",
    action: "goal_locked",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet locked after approval for Khushie Mohod",
    details: { employeeName: "Khushie Mohod" },
  },
  {
    id: "audit-004",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "admin-001",
    userName: "Shlok Chaudhari",
    userRole: "admin",
    action: "shared_goal_created",
    entityType: "shared_goal",
    entityId: "sg-001",
    description: "Created departmental KPI: Achieve 95% Customer Satisfaction Score",
  },
  {
    id: "audit-005",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "admin-001",
    userName: "Shlok Chaudhari",
    userRole: "admin",
    action: "shared_goal_pushed",
    entityType: "shared_goal",
    entityId: "sg-001",
    description: "Pushed KPI to 3 employees: Khushie, Arjun, Neha",
  },
  {
    id: "audit-006",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Sakshi Kuber",
    userRole: "manager",
    action: "post_lock_edit",
    entityType: "goal",
    entityId: "g-005",
    description: "Modified target on locked goal 'Reduce deployment failures' for Khushie Mohod",
    details: {
      field: "target",
      oldValue: "3",
      newValue: "2",
      goalSheetId: "gs-002",
      employeeName: "Khushie Mohod",
    },
  },
  {
    id: "audit-007",
    timestamp: new Date().toISOString(),
    userId: "emp-002",
    userName: "Arjun Mehta",
    userRole: "employee",
    action: "goal_submitted",
    entityType: "goal_sheet",
    entityId: "gs-001",
    description: "Goal sheet submitted for approval",
    details: { employeeName: "Arjun Mehta" },
  },
];

// ─── Notification Templates ─────────────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "action";
  channel: "email" | "teams" | "system";
  deepLink?: string;
  read: boolean;
  createdAt: string;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    userId: "emp-001",
    title: "Goal Approved by Sakshi Kuber",
    message: "Your goal sheet has been approved and locked by your manager.",
    type: "success",
    channel: "teams",
    deepLink: "/employee",
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-002",
    userId: "emp-001",
    title: "Reminder: Submit your Q1 check-in",
    message: "The Q1 reporting window is currently active. Please log your quarterly achievements.",
    type: "warning",
    channel: "email",
    deepLink: "/employee",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-003",
    userId: "emp-001",
    title: "New KPI Assigned: Customer Satisfaction",
    message: "Shlok Chaudhari has pushed a departmental KPI to your goal sheet.",
    type: "info",
    channel: "teams",
    deepLink: "/employee",
    read: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-004",
    userId: "mgr-001",
    title: "Pending Approval: Arjun Mehta",
    message: "Arjun Mehta has submitted a goal sheet for your review.",
    type: "action",
    channel: "teams",
    deepLink: "/manager",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-005",
    userId: "mgr-001",
    title: "Reminder: Review team check-ins",
    message: "Khushie Mohod has logged Q1 check-ins awaiting your comments.",
    type: "warning",
    channel: "email",
    deepLink: "/manager",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-006",
    userId: "admin-001",
    title: "Escalation: Goal submission overdue",
    message: "Neha Gupta has not submitted goals within the 5-day window. Auto-escalated to Manager.",
    type: "warning",
    channel: "system",
    deepLink: "/admin",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-007",
    userId: "admin-001",
    title: "KPI pushed successfully",
    message: "Customer Satisfaction KPI has been pushed to 3 employees.",
    type: "success",
    channel: "system",
    deepLink: "/admin",
    read: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-008",
    userId: "emp-002",
    title: "Reminder: Submit your goals",
    message: "The goal setting window is open. Please create and submit your goals.",
    type: "action",
    channel: "email",
    deepLink: "/employee",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
