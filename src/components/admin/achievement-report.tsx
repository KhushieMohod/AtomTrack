"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { computeSheetScores } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export function AchievementReport() {
  const { getAllSheets, checkIns, getUserById } = useAppState();

  const allSheets = getAllSheets();
  const lockedSheets = allSheets.filter((s) => s.status === "locked");

  const sheetData = lockedSheets.map((sheet) => {
    const sheetCheckIns = checkIns.filter((ci) => ci.goalSheetId === sheet.id);
    const scores = computeSheetScores(sheet.goals, sheetCheckIns);
    const totalWeightedScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);
    const employee = getUserById(sheet.employeeId);

    return {
      sheet,
      scores,
      totalWeightedScore: Math.round(totalWeightedScore),
      sheetCheckIns,
      employee,
    };
  });

  const exportCSV = () => {
    const headers = [
      "Employee",
      "Department",
      "Goal Title",
      "Thrust Area",
      "Unit",
      "Planned Target",
      "Actual Achievement",
      "Weightage %",
      "Score %",
      "Weighted Score",
      "Status",
      "Quarter",
    ];

    const rows: string[][] = [];

    sheetData.forEach(({ sheet, scores, sheetCheckIns, employee }) => {
      sheet.goals.forEach((goal) => {
        const score = scores.find((s) => s.goalId === goal.id);
        const latestCheckIn = sheetCheckIns
          .filter((ci) => ci.goalId === goal.id)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

        rows.push([
          sheet.employeeName,
          employee?.department || "—",
          goal.title,
          goal.thrustArea,
          goal.unit,
          latestCheckIn?.plannedTarget || goal.target,
          latestCheckIn?.actualAchievement || "—",
          String(goal.weightage),
          String(score?.percentScore || 0),
          String(score?.weightedScore || 0),
          latestCheckIn?.status || "Not Started",
          latestCheckIn?.quarter || "—",
        ]);
      });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AtomTrack_Achievement_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (lockedSheets.length === 0) {
    return (
      <Card className="bg-white border border-slate-200">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg">No locked goal sheets available for reporting.</p>
          <p className="text-slate-400 text-sm mt-1">
            Reports are generated from approved and locked goal sheets.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Header */}
      <Card className="bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 border border-indigo-200/60">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Achievement Report</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Planned vs. Actual performance data across {lockedSheets.length} locked goal sheet(s).
              </p>
            </div>
            <Button
              id="export-csv-btn"
              onClick={exportCSV}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      {sheetData.map(({ sheet, scores, totalWeightedScore, sheetCheckIns }) => (
        <Card key={sheet.id} className="bg-white border border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-800">
                  {sheet.employeeName}
                </CardTitle>
                <CardDescription>
                  {sheet.goals.length} goals · Approved{" "}
                  {sheet.approvedAt
                    ? new Date(sheet.approvedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "recently"}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Overall Score</p>
                  <p className={`text-xl font-bold ${getScoreColor(totalWeightedScore)}`}>
                    {sheetCheckIns.length > 0 ? `${totalWeightedScore}%` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 text-left border-b border-slate-100">
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">#</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Goal</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Planned</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Actual</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Status</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Score</th>
                    <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Weighted</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.goals.map((goal, index) => {
                    const score = scores.find((s) => s.goalId === goal.id);
                    const latestCheckIn = sheetCheckIns
                      .filter((ci) => ci.goalId === goal.id)
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

                    return (
                      <tr key={goal.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-medium text-slate-700">{goal.title}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-400">{goal.thrustArea}</span>
                              <span className="text-xs text-slate-300">·</span>
                              <span className="text-xs text-slate-400">{goal.unit}</span>
                              <span className="text-xs text-slate-300">·</span>
                              <span className="text-xs text-slate-400">{goal.weightage}%</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {latestCheckIn?.plannedTarget || goal.target}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {latestCheckIn?.actualAchievement || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {latestCheckIn ? (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                latestCheckIn.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : latestCheckIn.status === "On Track"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}
                            >
                              {latestCheckIn.status}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {score && score.percentScore > 0 ? (
                            <span className={`font-semibold ${getScoreColor(score.percentScore)}`}>
                              {score.percentScore}%
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {score && score.weightedScore > 0 ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getScoreBg(score.percentScore)}`}
                                  style={{ width: `${Math.min(score.percentScore, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-600 w-8 text-right">
                                {score.weightedScore}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
