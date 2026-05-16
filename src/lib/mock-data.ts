import { User, GoalSheet } from "@/types";

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "emp-001",
    name: "Priya Sharma",
    email: "priya.sharma@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
  },
  {
    id: "emp-002",
    name: "Arjun Mehta",
    email: "arjun.mehta@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
  },
  {
    id: "emp-003",
    name: "Neha Gupta",
    email: "neha.gupta@atomtrack.io",
    role: "employee",
    managerId: "mgr-001",
  },
  {
    id: "mgr-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@atomtrack.io",
    role: "manager",
  },
  {
    id: "admin-001",
    name: "Anita Desai",
    email: "anita.desai@atomtrack.io",
    role: "admin",
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
];
