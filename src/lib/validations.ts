import { Goal, ValidationResult } from "@/types";

const MAX_GOALS = 8;
const MIN_WEIGHTAGE = 10;
const TOTAL_WEIGHTAGE = 100;

/**
 * Validate a goal sheet before submission.
 * Enforces:
 *  - At least 1 goal
 *  - Maximum 8 goals
 *  - Each goal has all required fields
 *  - Minimum 10% weightage per goal
 *  - Total weightage equals exactly 100%
 */
export function validateGoalSheet(goals: Goal[]): ValidationResult {
  const errors: string[] = [];

  // No goals
  if (goals.length === 0) {
    errors.push("You must add at least one goal.");
    return { valid: false, errors };
  }

  // Max goals
  if (goals.length > MAX_GOALS) {
    errors.push(`Maximum ${MAX_GOALS} goals allowed. You have ${goals.length}.`);
  }

  // Per-goal validations
  goals.forEach((goal, index) => {
    const label = `Goal ${index + 1}`;

    if (!goal.title.trim()) {
      errors.push(`${label}: Title is required.`);
    }
    if (!goal.thrustArea.trim()) {
      errors.push(`${label}: Thrust Area is required.`);
    }
    if (!goal.target.trim()) {
      errors.push(`${label}: Target is required.`);
    }
    if (goal.weightage < MIN_WEIGHTAGE) {
      errors.push(
        `${label}: Weightage must be at least ${MIN_WEIGHTAGE}%. Currently ${goal.weightage}%.`
      );
    }
  });

  // Total weightage
  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
  if (totalWeightage !== TOTAL_WEIGHTAGE) {
    errors.push(
      `Total weightage must equal exactly ${TOTAL_WEIGHTAGE}%. Currently ${totalWeightage}%.`
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate a unique ID (simple implementation for mock data).
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
