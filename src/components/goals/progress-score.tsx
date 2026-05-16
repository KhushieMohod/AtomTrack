"use client";

import React from "react";
import { GoalSheet, GoalScore } from "@/types";
import { useAppState } from "@/context/app-context";
import { computeSheetScores } from "@/lib/scoring";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProgressScoreCardProps {
  sheet: GoalSheet;
}

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

function getScoreBadge(score: number): { label: string; className: string } {
  if (score >= 80) return { label: "Excellent", className: "bg-emerald-100 text-emerald-700 border-emerald-200" };
  if (score >= 60) return { label: "Good", className: "bg-blue-100 text-blue-700 border-blue-200" };
  if (score >= 40) return { label: "Needs Improvement", className: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: "At Risk", className: "bg-red-100 text-red-700 border-red-200" };
}

export function ProgressScoreCard({ sheet }: ProgressScoreCardProps) {
  const { getCheckInsByGoalSheet } = useAppState();

  const checkIns = getCheckInsByGoalSheet(sheet.id);
  const scores = computeSheetScores(sheet.goals, checkIns);

  const totalWeightedScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);
  const overallPercent = Math.round(totalWeightedScore);
  const overallBadge = getScoreBadge(overallPercent);

  const hasAnyCheckIns = checkIns.length > 0;

  if (!hasAnyCheckIns) {
    return (
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Progress Score</CardTitle>
          <CardDescription>
            Scores will appear once you log quarterly check-ins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl text-slate-300">—</span>
              </div>
              <p className="text-sm text-slate-400">No check-in data yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-slate-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Progress Score</CardTitle>
            <CardDescription>
              System-computed scores based on actual vs. target performance.
            </CardDescription>
          </div>
          <Badge variant="outline" className={`text-xs ${overallBadge.className}`}>
            {overallBadge.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Overall Score Ring */}
        <div className="flex items-center gap-6 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-100">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              {/* Background circle */}
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-100"
              />
              {/* Progress circle */}
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={`${(overallPercent / 100) * 213.6} 213.6`}
                strokeLinecap="round"
                className={getScoreColor(overallPercent)}
                style={{ transition: "stroke-dasharray 0.8s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold ${getScoreColor(overallPercent)}`}>
                {overallPercent}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Overall Weighted Score</p>
            <p className="text-xs text-slate-500 mt-1">
              Based on {checkIns.length} check-in(s) across {sheet.goals.length} goals
            </p>
          </div>
        </div>

        {/* Per-goal scores */}
        <div className="space-y-3">
          {sheet.goals.map((goal, index) => {
            const score = scores.find((s) => s.goalId === goal.id);
            if (!score) return null;

            return (
              <div
                key={goal.id}
                className="flex items-center gap-3 py-2.5"
              >
                <span className="text-xs text-slate-400 font-mono w-5 shrink-0">
                  {index + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700 truncate pr-2">
                      {goal.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-400">
                        {goal.weightage}% weight
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(score.percentScore)}`}>
                        {score.percentScore}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${getScoreBg(score.percentScore)}`}
                      style={{ width: `${Math.min(score.percentScore, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formula Legend */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">Scoring Formulas</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
            <span>📈 Numeric/Percentage: Actual ÷ Target</span>
            <span>📅 Timeline: Deadline comparison</span>
            <span>🎯 Zero-based: 0 = 100%, else 0%</span>
            <span>⚖️ Weighted by goal percentage</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
