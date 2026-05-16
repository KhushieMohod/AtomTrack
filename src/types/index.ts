// ─── Role & Auth Types ───────────────────────────────────────────────────────

export type Role = "employee" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId?: string; // For employees, the ID of their manager
}

// ─── Goal Types ──────────────────────────────────────────────────────────────

export type UnitOfMeasurement = "Numeric" | "Percentage" | "Timeline" | "Zero-based";

export type GoalStatus = "draft" | "submitted" | "rework" | "approved" | "locked";

export interface Goal {
  id: string;
  title: string;
  thrustArea: string;
  unit: UnitOfMeasurement;
  target: string;
  weightage: number; // Percentage, min 10, max such that total = 100
  remarks?: string;  // Manager's remark on rework
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
