"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CompletionDashboard() {
  const { getAllSheets, checkIns, getAllUsers, managerComments } = useAppState();

  const allSheets = getAllSheets();
  const allUsers = getAllUsers();
  const employees = allUsers.filter((u) => u.role === "employee");
  const managers = allUsers.filter((u) => u.role === "manager");

  // Build completion data per employee
  const employeeCompletion = employees.map((emp) => {
    const empSheets = allSheets.filter((s) => s.employeeId === emp.id);
    const lockedSheets = empSheets.filter((s) => s.status === "locked");
    const hasSubmitted = empSheets.length > 0;
    const hasLocked = lockedSheets.length > 0;

    // Check-in status per quarter
    const quarters = ["Q1", "Q2", "Q3", "Q4"] as const;
    const quarterCheckIns = quarters.map((q) => {
      const qCheckIns = checkIns.filter(
        (ci) => ci.employeeId === emp.id && ci.quarter === q
      );
      return {
        quarter: q,
        count: qCheckIns.length,
        completed: qCheckIns.filter((ci) => ci.status === "Completed").length,
        totalGoals: lockedSheets.reduce((sum, s) => sum + s.goals.length, 0),
      };
    });

    // Latest activity
    const latestCheckIn = checkIns
      .filter((ci) => ci.employeeId === emp.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];

    return {
      employee: emp,
      hasSubmitted,
      hasLocked,
      lockedSheetCount: lockedSheets.length,
      totalGoals: lockedSheets.reduce((sum, s) => sum + s.goals.length, 0),
      totalCheckIns: checkIns.filter((ci) => ci.employeeId === emp.id).length,
      quarterCheckIns,
      latestActivity: latestCheckIn?.updatedAt || empSheets[0]?.submittedAt,
      sheetStatus: empSheets[0]?.status || "none",
    };
  });

  // Manager completion
  const managerCompletion = managers.map((mgr) => {
    const managedEmployees = employees.filter((e) => e.managerId === mgr.id);
    const managedSheets = allSheets.filter((s) =>
      managedEmployees.some((e) => e.id === s.employeeId)
    );
    const lockedSheets = managedSheets.filter((s) => s.status === "locked");
    const commentCount = managerComments.filter((mc) => mc.managerId === mgr.id).length;

    return {
      manager: mgr,
      totalTeamMembers: managedEmployees.length,
      sheetsReviewed: lockedSheets.length,
      pendingReview: managedSheets.filter((s) => s.status === "submitted").length,
      commentsPosted: commentCount,
    };
  });

  // Stats
  const totalEmployees = employees.length;
  const submittedCount = employees.filter((e) =>
    allSheets.some((s) => s.employeeId === e.id)
  ).length;
  const lockedCount = employees.filter((e) =>
    allSheets.some((s) => s.employeeId === e.id && s.status === "locked")
  ).length;
  const checkInCount = checkIns.length;

  const completionRate = totalEmployees > 0 ? Math.round((lockedCount / totalEmployees) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-blue-700">{submittedCount}/{totalEmployees}</p>
            <p className="text-sm text-blue-600/70 mt-1">Goals Submitted</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200/60">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-purple-700">{lockedCount}/{totalEmployees}</p>
            <p className="text-sm text-purple-600/70 mt-1">Goals Locked</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/60">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-emerald-700">{checkInCount}</p>
            <p className="text-sm text-emerald-600/70 mt-1">Check-ins Logged</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-amber-700">{completionRate}%</p>
            </div>
            <p className="text-sm text-amber-600/70 mt-1">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Completion Table */}
      <Card className="bg-white border border-slate-200 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Employee Check-in Status</CardTitle>
          <CardDescription>
            Real-time view of goal submission and quarterly check-in completion.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-200">
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs">Employee</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs">Department</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs">Goal Sheet</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Q1</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Q2</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Q3</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Q4</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-right">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {employeeCompletion.map(({
                  employee,
                  hasSubmitted,
                  hasLocked,

                  quarterCheckIns,
                  latestActivity,
                  sheetStatus,
                }) => (
                  <tr key={employee.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                          {employee.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{employee.department}</td>
                    <td className="px-4 py-3">
                      {!hasSubmitted ? (
                        <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 border-slate-200">
                          Not Started
                        </Badge>
                      ) : hasLocked ? (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          Locked
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            sheetStatus === "submitted"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : sheetStatus === "rework"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          {sheetStatus === "submitted" ? "Pending Review" : sheetStatus === "rework" ? "Rework" : sheetStatus}
                        </Badge>
                      )}
                    </td>
                    {quarterCheckIns.map(({ quarter, count, totalGoals: tg }) => (
                      <td key={quarter} className="px-4 py-3 text-center">
                        {!hasLocked ? (
                          <span className="text-xs text-slate-300">—</span>
                        ) : count > 0 ? (
                          <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              count >= tg
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {count}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-0.5">/{tg}</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-400 mx-auto">
                            0
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right text-xs text-slate-400">
                      {latestActivity
                        ? new Date(latestActivity).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manager Review Status */}
      <Card className="bg-white border border-slate-200 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Manager Review Status</CardTitle>
          <CardDescription>
            Check-in review and feedback activity by managers.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-200">
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs">Manager</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs">Department</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Team Size</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Sheets Reviewed</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Pending</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">Comments Posted</th>
                </tr>
              </thead>
              <tbody>
                {managerCompletion.map(({
                  manager,
                  totalTeamMembers,
                  sheetsReviewed,
                  pendingReview,
                  commentsPosted,
                }) => (
                  <tr key={manager.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                          {manager.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{manager.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{manager.department}</td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium">{totalTeamMembers}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-emerald-600 font-semibold">{sheetsReviewed}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {pendingReview > 0 ? (
                        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                          {pendingReview}
                        </Badge>
                      ) : (
                        <span className="text-xs text-emerald-500">✓ None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 font-medium">{commentsPosted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
