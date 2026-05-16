import { UnitOfMeasurement, GoalScore, QuarterlyCheckIn } from "@/types";

/**
 * Calculate progress score for a single goal based on its unit type.
 *
 * Formulas:
 *   Numeric (Min — Higher is better): Actual ÷ Target  (capped at 100%)
 *   Percentage (Min — Higher is better): Actual ÷ Target  (capped at 100%)
 *   Timeline: Compare completion date vs deadline
 *   Zero-based (Zero = Success): If actual == 0 then 100%, else 0%
 */
export function computeGoalScore(
  unit: UnitOfMeasurement,
  target: string,
  actual: string,
  completionDate?: string,
  deadline?: string
): number {
  switch (unit) {
    case "Numeric":
    case "Percentage":
      return computeMinScore(target, actual);

    case "Numeric (Max)":
      return computeMaxScore(target, actual);

    case "Timeline":
      return computeTimelineScore(completionDate, deadline);

    case "Zero-based":
      return computeZeroScore(actual);

    default:
      return 0;
  }
}

/**
 * Min formula (Higher is better): Actual ÷ Target
 * Capped at 100%. Returns 0-100.
 */
function computeMinScore(target: string, actual: string): number {
  const t = parseFloat(target);
  const a = parseFloat(actual);

  if (isNaN(t) || isNaN(a) || t === 0) return 0;

  const ratio = a / t;
  return Math.min(ratio * 100, 100);
}

/**
 * Max formula (Lower is better): Target ÷ Actual
 * Used when a lower actual value indicates better performance.
 * Capped at 100%. Returns 0-100.
 */
export function computeMaxScore(target: string, actual: string): number {
  const t = parseFloat(target);
  const a = parseFloat(actual);

  if (isNaN(t) || isNaN(a) || a === 0) return 0;

  const ratio = t / a;
  return Math.min(ratio * 100, 100);
}

/**
 * Timeline: Compare completion date vs deadline.
 * If completed on or before deadline → 100%.
 * If completed after → proportional deduction (each day late reduces score).
 * If no completion date → 0%.
 */
function computeTimelineScore(completionDate?: string, deadline?: string): number {
  if (!completionDate || !deadline) return 0;

  const comp = new Date(completionDate).getTime();
  const dead = new Date(deadline).getTime();

  if (isNaN(comp) || isNaN(dead)) return 0;

  if (comp <= dead) return 100;

  // Each day late reduces score. 30 days late = 0%.
  const daysLate = (comp - dead) / (1000 * 60 * 60 * 24);
  const score = Math.max(100 - (daysLate / 30) * 100, 0);
  return Math.round(score * 100) / 100;
}

/**
 * Zero-based: If actual is 0 (or "0") → 100%, else 0%.
 */
function computeZeroScore(actual: string): number {
  const val = actual.trim();
  if (val === "0" || val === "") return 100;
  // Also check for numeric zero
  const num = parseFloat(val);
  if (!isNaN(num) && num === 0) return 100;
  return 0;
}

/**
 * Compute weighted scores for all goals in a sheet.
 */
export function computeSheetScores(
  goals: { id: string; unit: UnitOfMeasurement; target: string; weightage: number }[],
  checkIns: QuarterlyCheckIn[]
): GoalScore[] {
  return goals.map((goal) => {
    // Get the latest check-in for this goal
    const goalCheckIns = checkIns
      .filter((ci) => ci.goalId === goal.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const latest = goalCheckIns[0];

    if (!latest || !latest.actualAchievement) {
      return {
        goalId: goal.id,
        rawScore: 0,
        percentScore: 0,
        weightedScore: 0,
      };
    }

    const percentScore = computeGoalScore(
      goal.unit,
      goal.target,
      latest.actualAchievement,
      latest.completionDate,
      goal.target // For timeline, target is the deadline
    );

    const rawScore = percentScore / 100;

    return {
      goalId: goal.id,
      rawScore,
      percentScore: Math.round(percentScore * 100) / 100,
      weightedScore: Math.round(rawScore * goal.weightage * 100) / 100,
    };
  });
}

/**
 * Get the current fiscal quarter.
 * Q1: Apr–Jun, Q2: Jul–Sep, Q3: Oct–Dec, Q4: Jan–Mar
 */
export function getCurrentQuarter(): { quarter: "Q1" | "Q2" | "Q3" | "Q4"; year: number } {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();

  if (month >= 3 && month <= 5) return { quarter: "Q1", year };      // Apr-Jun
  if (month >= 6 && month <= 8) return { quarter: "Q2", year };      // Jul-Sep
  if (month >= 9 && month <= 11) return { quarter: "Q3", year };     // Oct-Dec
  return { quarter: "Q4", year: month < 3 ? year : year + 1 };       // Jan-Mar
}

/**
 * Check if a specific quarter reporting window is strictly open based on the current month.
 * Q1: July (6), Q2: October (9), Q3: January (0), Q4: March (2) / April (3)
 */
export function isCheckInWindowOpen(quarter: "Q1" | "Q2" | "Q3" | "Q4"): boolean {
  const month = new Date().getMonth(); // 0-indexed
  switch (quarter) {
    case "Q1": return month === 6; // July
    case "Q2": return month === 9; // October
    case "Q3": return month === 0; // January
    case "Q4": return month === 2 || month === 3; // March or April
    default: return false;
  }
}

/**
 * Check if the goal setting window is open (May).
 */
export function isGoalSettingWindowOpen(): boolean {
  return new Date().getMonth() === 4; // May
}

/**
 * Legacy check for current quarter (kept for UI labels).
 */
export function isQuarterActive(quarter: "Q1" | "Q2" | "Q3" | "Q4"): boolean {
  const current = getCurrentQuarter();
  return current.quarter === quarter;
}

/**
 * Get quarter label string.
 */
export function getQuarterLabel(quarter: "Q1" | "Q2" | "Q3" | "Q4"): string {
  const labels: Record<string, string> = {
    Q1: "Q1 (Apr – Jun)",
    Q2: "Q2 (Jul – Sep)",
    Q3: "Q3 (Oct – Dec)",
    Q4: "Q4 (Jan – Mar)",
  };
  return labels[quarter] || quarter;
}

/**
 * Get the date range for a quarter.
 */
export function getQuarterDateRange(quarter: "Q1" | "Q2" | "Q3" | "Q4", year: number): { start: Date; end: Date } {
  switch (quarter) {
    case "Q1": return { start: new Date(year, 3, 1), end: new Date(year, 5, 30) };
    case "Q2": return { start: new Date(year, 6, 1), end: new Date(year, 8, 30) };
    case "Q3": return { start: new Date(year, 9, 1), end: new Date(year, 11, 31) };
    case "Q4": return { start: new Date(year + 1, 0, 1), end: new Date(year + 1, 2, 31) };
  }
}
