"use client";

import React, { useState } from "react";
import { GoalSheet, Quarter, ManagerComment } from "@/types";
import { useAppState } from "@/context/app-context";
import { generateId } from "@/lib/validations";
import { getCurrentQuarter, getQuarterLabel, computeSheetScores } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const QUARTERS: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "bg-slate-100 text-slate-600",
  "On Track": "bg-blue-100 text-blue-700",
  "Completed": "bg-emerald-100 text-emerald-700",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

interface ManagerCheckInViewProps {
  sheet: GoalSheet;
}

export function ManagerCheckInView({ sheet }: ManagerCheckInViewProps) {
  const {
    currentUser,
    getCheckInsByGoalSheet,
    getCommentsByGoalSheet,
    addManagerComment,
  } = useAppState();

  const currentQ = getCurrentQuarter();
  const [selectedQuarter, setSelectedQuarter] = useState<Quarter>(currentQ.quarter);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const checkIns = getCheckInsByGoalSheet(sheet.id);
  const comments = getCommentsByGoalSheet(sheet.id);
  const scores = computeSheetScores(sheet.goals, checkIns);

  const totalWeightedScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);
  const overallPercent = Math.round(totalWeightedScore);

  const handleAddComment = (goalId: string) => {
    if (!currentUser || !commentInputs[goalId]?.trim()) return;

    const newComment: ManagerComment = {
      id: generateId("mc"),
      goalSheetId: sheet.id,
      goalId,
      employeeId: sheet.employeeId,
      managerId: currentUser.id,
      quarter: selectedQuarter,
      comment: commentInputs[goalId],
      createdAt: new Date().toISOString(),
    };

    addManagerComment(newComment);
    setCommentInputs((prev) => ({ ...prev, [goalId]: "" }));
    toast.success("Check-in comment added.");
  };

  return (
    <Card className="bg-white border border-slate-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-50/40 to-white border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              {sheet.employeeName} — Performance Check-in
            </CardTitle>
            <CardDescription>
              {sheet.goals.length} goals · Planned vs. Actual tracking
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Overall Score</p>
              <p className={`text-xl font-bold ${getScoreColor(overallPercent)}`}>
                {checkIns.length > 0 ? `${overallPercent}%` : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Quarter tabs */}
        <div className="flex items-center gap-2 mt-4">
          {QUARTERS.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                q === selectedQuarter
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {q}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-2">
            {getQuarterLabel(selectedQuarter)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {sheet.goals.map((goal, index) => {
          const checkIn = checkIns.find(
            (ci) => ci.goalId === goal.id && ci.quarter === selectedQuarter
          );
          const score = scores.find((s) => s.goalId === goal.id);
          const goalComments = comments.filter(
            (mc) => mc.goalId === goal.id && mc.quarter === selectedQuarter
          );

          return (
            <div
              key={goal.id}
              className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors overflow-hidden"
            >
              {/* Goal header */}
              <div className="flex items-center justify-between p-4 bg-slate-50/50">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-slate-400 font-mono w-5 shrink-0">
                    {index + 1}.
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800 truncate">
                        {goal.title}
                      </span>
                      {goal.isShared && (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200 shrink-0">
                          KPI
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{goal.thrustArea}</span>
                      <span>·</span>
                      <span>{goal.unit}</span>
                      <span>·</span>
                      <span>Target: {goal.target}</span>
                      <span>·</span>
                      <span>{goal.weightage}% weight</span>
                    </div>
                  </div>
                </div>
                {score && score.percentScore > 0 && (
                  <span className={`text-sm font-bold ${getScoreColor(score.percentScore)} shrink-0 ml-4`}>
                    {score.percentScore}%
                  </span>
                )}
              </div>

              {/* Check-in data */}
              <div className="p-4 border-t border-slate-100">
                {checkIn ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Planned</p>
                        <p className="text-sm text-slate-700 font-medium">
                          {checkIn.plannedTarget || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Actual</p>
                        <p className="text-sm text-slate-700 font-medium">
                          {checkIn.actualAchievement || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Status</p>
                        <Badge variant="outline" className={`text-xs ${STATUS_COLORS[checkIn.status] || ""}`}>
                          {checkIn.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {score && score.percentScore > 0 && (
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getScoreBg(score.percentScore)}`}
                          style={{ width: `${Math.min(score.percentScore, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    No check-in logged for {selectedQuarter}
                  </p>
                )}

                {/* Existing Comments */}
                {goalComments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-slate-500">Manager Comments</p>
                    {goalComments.map((mc) => (
                      <div
                        key={mc.id}
                        className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100"
                      >
                        <p className="text-sm text-emerald-800">{mc.comment}</p>
                        <p className="text-xs text-emerald-500 mt-1">
                          {new Date(mc.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <Label className="text-xs font-medium text-slate-500">
                    Add Check-in Comment
                  </Label>
                  <div className="flex gap-2 mt-1.5">
                    <Textarea
                      value={commentInputs[goal.id] || ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [goal.id]: e.target.value,
                        }))
                      }
                      placeholder="Share feedback on progress, concerns, or suggestions..."
                      rows={2}
                      className="text-sm flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(goal.id)}
                      disabled={!commentInputs[goal.id]?.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer self-end shrink-0"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
