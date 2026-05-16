import { User, GoalSheet, SharedGoal, QuarterlyCheckIn, ManagerComment, AuditLogEntry } from "@/types";

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "emp-001",
    name: "Priya Sharma",
    email: "priya.sharma@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "emp-002",
    name: "Arjun Mehta",
    email: "arjun.mehta@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "emp-003",
    name: "Neha Gupta",
    email: "neha.gupta@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
    department: "Engineering",
  },
  {
    id: "mgr-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@atomtrack.io",
    role: "manager",
    department: "Engineering",
  },
  {
    id: "admin-001",
    name: "Anita Desai",
    email: "anita.desai@atomtrack.io",
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
    employeeName: "Priya Sharma",
    status: "locked",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    goals: [
      {
        id: "g-005",
        title: "Reduce deployment failures",
        thrustArea: "Quality",
        unit: "Numeric",
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
    userName: "Priya Sharma",
    userRole: "employee",
    action: "goal_submitted",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet submitted for approval",
    details: { employeeName: "Priya Sharma" },
  },
  {
    id: "audit-002",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Rajesh Kumar",
    userRole: "manager",
    action: "goal_approved",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet approved for Priya Sharma",
    details: { employeeName: "Priya Sharma" },
  },
  {
    id: "audit-003",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Rajesh Kumar",
    userRole: "manager",
    action: "goal_locked",
    entityType: "goal_sheet",
    entityId: "gs-002",
    description: "Goal sheet locked after approval for Priya Sharma",
    details: { employeeName: "Priya Sharma" },
  },
  {
    id: "audit-004",
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "admin-001",
    userName: "Anita Desai",
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
    userName: "Anita Desai",
    userRole: "admin",
    action: "shared_goal_pushed",
    entityType: "shared_goal",
    entityId: "sg-001",
    description: "Pushed KPI to 3 employees: Priya, Arjun, Neha",
  },
  {
    id: "audit-006",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "mgr-001",
    userName: "Rajesh Kumar",
    userRole: "manager",
    action: "post_lock_edit",
    entityType: "goal",
    entityId: "g-005",
    description: "Modified target on locked goal 'Reduce deployment failures' for Priya Sharma",
    details: {
      field: "target",
      oldValue: "3",
      newValue: "2",
      goalSheetId: "gs-002",
      employeeName: "Priya Sharma",
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
