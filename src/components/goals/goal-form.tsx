"use client";

import React, { useState } from "react";
import { Goal, UnitOfMeasurement } from "@/types";
import { validateGoalSheet, generateId } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UNITS: UnitOfMeasurement[] = ["Numeric", "Percentage", "Timeline", "Zero-based"];

const UNIT_HELP: Record<UnitOfMeasurement, string> = {
  Numeric: "e.g. 5 clients, 10 modules",
  Percentage: "e.g. 15%, 80%",
  Timeline: "e.g. Q3 2026, Dec 2026",
  "Zero-based": "e.g. Certified, Completed",
};

const MAX_GOALS = 8;

function createEmptyGoal(): Goal {
  return {
    id: generateId("goal"),
    title: "",
    thrustArea: "",
    unit: "Numeric",
    target: "",
    weightage: 10,
  };
}

interface GoalFormProps {
  onSubmit: (goals: Goal[]) => void;
  initialGoals?: Goal[];
  isReadOnly?: boolean;
}

export function GoalForm({ onSubmit, initialGoals, isReadOnly = false }: GoalFormProps) {
  const [goals, setGoals] = useState<Goal[]>(
    initialGoals && initialGoals.length > 0 ? initialGoals : [createEmptyGoal()]
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);
  const weightageStatus =
    totalWeightage === 100
      ? "valid"
      : totalWeightage < 100
      ? "under"
      : "over";

  // ── Handlers ──────────────────────────────────────────────────────────────

  const updateGoal = (index: number, field: keyof Goal, value: string | number) => {
    setGoals((prev) =>
      prev.map((g, i) =>
        i === index ? { ...g, [field]: value } : g
      )
    );
    if (showErrors) setShowErrors(false);
  };

  const addGoal = () => {
    if (goals.length >= MAX_GOALS) return;
    setGoals((prev) => [...prev, createEmptyGoal()]);
  };

  const removeGoal = (index: number) => {
    if (goals.length <= 1) return;
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const result = validateGoalSheet(goals);
    if (!result.valid) {
      setErrors(result.errors);
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    onSubmit(goals);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Weightage Tracker Bar */}
      <Card className="bg-white border border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Total Weightage
            </span>
            <span
              className={`text-sm font-bold ${
                weightageStatus === "valid"
                  ? "text-emerald-600"
                  : weightageStatus === "over"
                  ? "text-red-600"
                  : "text-amber-600"
              }`}
            >
              {totalWeightage}% / 100%
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                weightageStatus === "valid"
                  ? "bg-emerald-500"
                  : weightageStatus === "over"
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(totalWeightage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>{goals.length} of {MAX_GOALS} goals</span>
            <span>
              {weightageStatus === "valid"
                ? "✓ Ready to submit"
                : weightageStatus === "under"
                ? `${100 - totalWeightage}% remaining`
                : `${totalWeightage - 100}% over limit`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {showErrors && errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <h4 className="text-sm font-semibold text-red-800 mb-2">
              Please fix the following issues:
            </h4>
            <ul className="space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  {err}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Goal Cards */}
      {goals.map((goal, index) => (
        <Card
          key={goal.id}
          id={`goal-card-${index}`}
          className="bg-white border border-slate-200 hover:border-slate-300 transition-colors"
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-700">
                  Goal {index + 1}
                </CardTitle>
                <CardDescription className="text-xs">
                  Define a measurable performance objective
                </CardDescription>
              </div>
              {!isReadOnly && goals.length > 1 && (
                <Button
                  id={`remove-goal-${index}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => removeGoal(index)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                >
                  Remove
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Row 1: Title */}
            <div>
              <Label htmlFor={`title-${index}`} className="text-sm font-medium text-slate-600 mb-1.5">
                Goal Title
              </Label>
              <Input
                id={`title-${index}`}
                placeholder="e.g. Increase quarterly sales revenue by 15%"
                value={goal.title}
                onChange={(e) => updateGoal(index, "title", e.target.value)}
                disabled={isReadOnly}
                className="mt-1.5"
              />
            </div>

            {/* Row 2: Thrust Area + Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`thrust-${index}`} className="text-sm font-medium text-slate-600 mb-1.5">
                  Thrust Area
                </Label>
                <Input
                  id={`thrust-${index}`}
                  placeholder="e.g. Revenue Growth, Skill Development"
                  value={goal.thrustArea}
                  onChange={(e) => updateGoal(index, "thrustArea", e.target.value)}
                  disabled={isReadOnly}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`unit-${index}`} className="text-sm font-medium text-slate-600 mb-1.5">
                  Unit of Measurement
                </Label>
                <Select
                  value={goal.unit}
                  onValueChange={(val) => { if (val) updateGoal(index, "unit", val); }}
                  disabled={isReadOnly}
                >
                  <SelectTrigger id={`unit-${index}`} className="w-full mt-1.5">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-1">{UNIT_HELP[goal.unit]}</p>
              </div>
            </div>

            {/* Row 3: Target + Weightage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`target-${index}`} className="text-sm font-medium text-slate-600 mb-1.5">
                  Target
                </Label>
                <Input
                  id={`target-${index}`}
                  placeholder={UNIT_HELP[goal.unit]}
                  value={goal.target}
                  onChange={(e) => updateGoal(index, "target", e.target.value)}
                  disabled={isReadOnly}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor={`weightage-${index}`} className="text-sm font-medium text-slate-600 mb-1.5">
                  Weightage (%)
                </Label>
                <div className="flex items-center gap-3 mt-1.5">
                  <Input
                    id={`weightage-${index}`}
                    type="number"
                    min={10}
                    max={100}
                    value={goal.weightage}
                    onChange={(e) =>
                      updateGoal(index, "weightage", parseInt(e.target.value) || 0)
                    }
                    disabled={isReadOnly}
                    className="w-24"
                  />
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${goal.weightage}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-500 w-10 text-right">
                    {goal.weightage}%
                  </span>
                </div>
                {goal.weightage < 10 && goal.weightage > 0 && (
                  <p className="text-xs text-red-500 mt-1">Minimum 10% required</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Actions */}
      {!isReadOnly && (
        <div className="flex items-center justify-between pt-2">
          <Button
            id="add-goal-btn"
            variant="outline"
            onClick={addGoal}
            disabled={goals.length >= MAX_GOALS}
            className="cursor-pointer"
          >
            + Add Goal {goals.length >= MAX_GOALS && "(Max reached)"}
          </Button>
          <Button
            id="submit-goals-btn"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 cursor-pointer"
          >
            Submit Goal Sheet
          </Button>
        </div>
      )}
    </div>
  );
}
