"use client";

import React, { useState } from "react";
import { GoalSheet, QuarterlyCheckIn, Quarter, CheckInStatus } from "@/types";
import { useAppState } from "@/context/app-context";
import { generateId } from "@/lib/validations";
import { getCurrentQuarter, isCheckInWindowOpen, getQuarterLabel } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
const STATUSES: CheckInStatus[] = ["Not Started", "On Track", "Completed"];

const STATUS_COLORS: Record<CheckInStatus, string> = {
  "Not Started": "bg-slate-100 text-slate-600 border-slate-200",
  "On Track": "bg-blue-100 text-blue-700 border-blue-200",
  "Completed": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

interface QuarterlyCheckInFormProps {
  sheet: GoalSheet;
}

export function QuarterlyCheckInForm({ sheet }: QuarterlyCheckInFormProps) {
  const {
    checkIns,
    addCheckIn,
    updateCheckIn,
    getCheckInsByGoalSheet,
  } = useAppState();

  const currentQ = getCurrentQuarter();
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(currentQ.quarter);

  const sheetCheckIns = getCheckInsByGoalSheet(sheet.id);

  const getCheckIn = (goalId: string, quarter: Quarter): QuarterlyCheckIn | undefined => {
    return sheetCheckIns.find(
      (ci) => ci.goalId === goalId && ci.quarter === quarter
    );
  };

  const isActiveQuarter = isCheckInWindowOpen(selectedQuarter);

  const handleSaveCheckIn = (
    goalId: string,
    plannedTarget: string,
    actualAchievement: string,
    status: CheckInStatus,
    completionDate?: string
  ) => {
    const existing = getCheckIn(goalId, selectedQuarter);

    if (existing) {
      updateCheckIn(existing.id, {
        plannedTarget,
        actualAchievement,
        status,
        completionDate,
        updatedAt: new Date().toISOString(),
      });
    } else {
      const newCheckIn: QuarterlyCheckIn = {
        id: generateId("ci"),
        goalSheetId: sheet.id,
        goalId,
        employeeId: sheet.employeeId,
        quarter: selectedQuarter,
        plannedTarget,
        actualAchievement,
        status,
        completionDate,
        updatedAt: new Date().toISOString(),
      };
      addCheckIn(newCheckIn);
    }

    toast.success(`Check-in saved for ${selectedQuarter}`);
  };

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Quarterly Check-ins</CardTitle>
            <CardDescription>
              Log your actual achievement against planned targets for each goal.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${
                isActiveQuarter
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              }`}
            >
              {isActiveQuarter ? "● Active Window" : "○ Closed Window"}
            </Badge>
          </div>
        </div>

        {/* Quarter Selector */}
        <div className="flex items-center gap-2 mt-4">
          {QUARTERS.map((q) => {
            const isActive = isCheckInWindowOpen(q);
            const isCurrent = q === selectedQuarter;
            return (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-sm"
                    : isActive
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {q}
                {isActive && !isCurrent && (
                  <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
          <span className="text-xs text-slate-400 ml-2">
            Current: {getQuarterLabel(currentQ.quarter)} {currentQ.year}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sheet.goals.map((goal, index) => {
          const existing = getCheckIn(goal.id, selectedQuarter);
          return (
            <CheckInRow
              key={goal.id}
              index={index}
              goalTitle={goal.title}
              goalUnit={goal.unit}
              goalTarget={goal.target}
              isShared={goal.isShared}
              existing={existing}
              isEditable={isActiveQuarter}
              onSave={(planned, actual, status, completionDate) =>
                handleSaveCheckIn(goal.id, planned, actual, status, completionDate)
              }
            />
          );
        })}

        {!isActiveQuarter && (
          <div className="flex items-center justify-center gap-2 py-4 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-sm text-slate-500">
              🔒 {getQuarterLabel(selectedQuarter)} is not the active quarter. Updates are view-only.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Individual Check-in Row ─────────────────────────────────────────────────

interface CheckInRowProps {
  index: number;
  goalTitle: string;
  goalUnit: string;
  goalTarget: string;
  isShared?: boolean;
  existing?: QuarterlyCheckIn;
  isEditable: boolean;
  onSave: (
    planned: string,
    actual: string,
    status: CheckInStatus,
    completionDate?: string
  ) => void;
}

function CheckInRow({
  index,
  goalTitle,
  goalUnit,
  goalTarget,
  isShared,
  existing,
  isEditable,
  onSave,
}: CheckInRowProps) {
  const [plannedTarget, setPlannedTarget] = useState(existing?.plannedTarget || goalTarget);
  const [actualAchievement, setActualAchievement] = useState(existing?.actualAchievement || "");
  const [status, setStatus] = useState<CheckInStatus>(existing?.status || "Not Started");
  const [completionDate, setCompletionDate] = useState(existing?.completionDate || "");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onSave(
      plannedTarget,
      actualAchievement,
      status,
      goalUnit === "Timeline" ? completionDate : undefined
    );
    setIsExpanded(false);
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isExpanded
          ? "border-blue-200 bg-blue-50/30 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Summary row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-slate-400 font-mono w-5 shrink-0">{index + 1}.</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-800 truncate">{goalTitle}</span>
              {isShared && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 shrink-0">
                  KPI
                </Badge>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {goalUnit} · Target: {goalTarget}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {existing && (
            <Badge variant="outline" className={`text-xs ${STATUS_COLORS[existing.status]}`}>
              {existing.status}
            </Badge>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded form */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <div>
              <Label className="text-xs font-medium text-slate-500">Planned Target</Label>
              <Input
                value={plannedTarget}
                onChange={(e) => setPlannedTarget(e.target.value)}
                disabled={!isEditable}
                className="mt-1 text-sm"
                placeholder="What you planned to achieve"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-slate-500">Actual Achievement</Label>
              <Input
                value={actualAchievement}
                onChange={(e) => setActualAchievement(e.target.value)}
                disabled={!isEditable}
                className="mt-1 text-sm"
                placeholder="What you actually achieved"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium text-slate-500">Status</Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) setStatus(val as CheckInStatus);
                }}
                disabled={!isEditable}
              >
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {goalUnit === "Timeline" && (
              <div>
                <Label className="text-xs font-medium text-slate-500">Completion Date</Label>
                <Input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  disabled={!isEditable}
                  className="mt-1 text-sm"
                />
              </div>
            )}
          </div>

          {isEditable && (
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Save Check-in
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
