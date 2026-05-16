// ─── Role & Auth Types ───────────────────────────────────────────────────────

export type Role = "employee" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string; // For employees, the ID of their manager
  department?: string;
}

// ─── Goal Types ──────────────────────────────────────────────────────────────

export type UnitOfMeasurement = "Numeric" | "Numeric (Max)" | "Percentage" | "Timeline" | "Zero-based";

export type GoalStatus = "draft" | "submitted" | "rework" | "approved" | "locked";

export interface Goal {
  id: string;
  title: string;
  thrustArea: string;
  unit: UnitOfMeasurement;
  target: string;
  weightage: number; // Percentage, min 10, max such that total = 100
  remarks?: string;  // Manager's remark on rework
  isShared?: boolean;        // Whether this is a shared/departmental KPI
  sharedGoalId?: string;     // Reference to the parent SharedGoal
}

export interface GoalSheet {
  id: string;
  employeeId: string;
  employeeName: string;
  goals: Goal[];
  status: GoalStatus;
  submittedAt?: string;
  approvedAt?: string;
  managerRemarks?: string;
}

// ─── Shared Goals (Departmental KPIs) ────────────────────────────────────────

export interface SharedGoal {
  id: string;
  title: string;
  thrustArea: string;
  unit: UnitOfMeasurement;
  target: string;
  defaultWeightage: number;
  createdBy: string;       // Admin user ID
  assignedTo: string[];    // Employee IDs
  createdAt: string;
}

// ─── Quarterly Check-in Types ────────────────────────────────────────────────

export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";

export type CheckInStatus = "Not Started" | "On Track" | "Completed";

export interface QuarterlyCheckIn {
  id: string;
  goalSheetId: string;
  goalId: string;
  employeeId: string;
  quarter: Quarter;
  plannedTarget: string;
  actualAchievement: string;
  status: CheckInStatus;
  completionDate?: string;  // For timeline scoring
  updatedAt: string;
}

// ─── Manager Check-in Comments ───────────────────────────────────────────────

export interface ManagerComment {
  id: string;
  goalSheetId: string;
  goalId: string;
  employeeId: string;
  managerId: string;
  quarter: Quarter;
  comment: string;
  createdAt: string;
}

// ─── Progress Scoring ────────────────────────────────────────────────────────

export interface GoalScore {
  goalId: string;
  rawScore: number;      // 0-1 scale
  percentScore: number;  // 0-100 scale
  weightedScore: number; // rawScore * weightage
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

// ─── Validation ──────────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── Audit Trail ─────────────────────────────────────────────────────────────

export type AuditAction =
  | "goal_approved"
  | "goal_locked"
  | "goal_reworked"
  | "goal_submitted"
  | "goal_resubmitted"
  | "checkin_created"
  | "checkin_updated"
  | "shared_goal_created"
  | "shared_goal_pushed"
  | "post_lock_edit";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: AuditAction;
  entityType: "goal_sheet" | "goal" | "check_in" | "shared_goal";
  entityId: string;
  description: string;
  details?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    goalSheetId?: string;
    employeeName?: string;
  };
}
