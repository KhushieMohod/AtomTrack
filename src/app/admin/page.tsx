"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-100 text-blue-700",
  rework: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  locked: "bg-purple-100 text-purple-700",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  rework: "Rework",
  approved: "Approved",
  locked: "Locked",
};

export default function AdminDashboard() {
  const { isReady } = useAuthGuard("admin");
  const { currentUser, getAllSheets } = useAppState();

  if (!isReady || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const allSheets = getAllSheets();
  const submitted = allSheets.filter((s) => s.status === "submitted").length;
  const locked = allSheets.filter((s) => s.status === "locked").length;
  const rework = allSheets.filter((s) => s.status === "rework").length;
  const totalGoals = allSheets.reduce((sum, s) => sum + s.goals.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Organization-wide goal management overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-slate-800">{allSheets.length}</p>
              <p className="text-sm text-slate-500 mt-1">Total Sheets</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-blue-600">{submitted}</p>
              <p className="text-sm text-slate-500 mt-1">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-purple-600">{locked}</p>
              <p className="text-sm text-slate-500 mt-1">Locked</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-emerald-600">{totalGoals}</p>
              <p className="text-sm text-slate-500 mt-1">Total Goals</p>
            </CardContent>
          </Card>
        </div>

        {/* All Sheets Table */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">All Goal Sheets</CardTitle>
            <CardDescription>
              Read-only overview of all submissions across the organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allSheets.length === 0 ? (
              <p className="text-center text-slate-400 py-8">
                No goal sheets in the system yet.
              </p>
            ) : (
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-4 py-3 font-medium text-slate-500">Employee</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Goals</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Status</th>
                      <th className="px-4 py-3 font-medium text-slate-500">Submitted</th>
                      <th className="px-4 py-3 font-medium text-slate-500 text-right">
                        Total Weightage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSheets.map((sheet) => {
                      const totalW = sheet.goals.reduce(
                        (s, g) => s + g.weightage,
                        0
                      );
                      return (
                        <tr
                          key={sheet.id}
                          className="border-t border-slate-100 hover:bg-slate-50/50"
                        >
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {sheet.employeeName}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {sheet.goals.length}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className={STATUS_STYLES[sheet.status]}>
                              {STATUS_LABELS[sheet.status]}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {sheet.submittedAt
                              ? new Date(sheet.submittedAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${
                              totalW === 100
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {totalW}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rework Breakdown */}
        {rework > 0 && (
          <Card className="mt-6 bg-amber-50 border border-amber-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-sm font-semibold text-amber-800">
                ⚠️ {rework} goal sheet(s) are currently returned for rework
              </p>
              <p className="text-xs text-amber-600 mt-1">
                These require attention from the respective employees.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
