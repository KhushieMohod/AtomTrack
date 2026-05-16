"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { SharedGoalForm } from "@/components/goals/shared-goal-form";
import { AchievementReport } from "@/components/admin/achievement-report";
import { CompletionDashboard } from "@/components/admin/completion-dashboard";
import { AuditLogView } from "@/components/admin/audit-log";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { EscalationsView } from "@/components/admin/escalations";
import { ArchitectureDiagram } from "@/components/admin/architecture-diagram";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { SharedGoal } from "@/types";

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
  const {
    currentUser,
    getAllSheets,
    getAllUsers,
    sharedGoals,
    addSharedGoal,
    pushSharedGoalToSheets,
    addAuditEntry,
  } = useAppState();

  if (!isReady || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#E2E8F0] border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-sm text-[#94A3B8]">Loading...</p>
        </div>
      </div>
    );
  }

  const allSheets = getAllSheets();
  const allUsers = getAllUsers();
  const employees = allUsers.filter((u) => u.role === "employee");

  const submitted = allSheets.filter((s) => s.status === "submitted").length;
  const locked = allSheets.filter((s) => s.status === "locked").length;
  const rework = allSheets.filter((s) => s.status === "rework").length;
  const totalGoals = allSheets.reduce((sum, s) => sum + s.goals.length, 0);

  const handleCreateSharedGoal = (goal: SharedGoal) => {
    addSharedGoal(goal);
    pushSharedGoalToSheets(goal);

    // Log to audit trail
    addAuditEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "shared_goal_created",
      entityType: "shared_goal",
      entityId: goal.id,
      description: `Created departmental KPI: ${goal.title}`,
    });
    addAuditEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "shared_goal_pushed",
      entityType: "shared_goal",
      entityId: goal.id,
      description: `Pushed KPI to ${goal.assignedTo.length} employee(s)`,
    });

    toast.success(`Departmental KPI "${goal.title}" pushed to ${goal.assignedTo.length} employee(s).`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Organization-wide goal management, reporting, and governance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
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
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-amber-600">{sharedGoals.length}</p>
              <p className="text-sm text-slate-500 mt-1">Shared KPIs</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 bg-white border border-[#E2E8F0] flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" id="tab-overview" className="cursor-pointer text-xs sm:text-sm">
              All Sheets
            </TabsTrigger>
            <TabsTrigger value="shared" id="tab-shared" className="cursor-pointer text-xs sm:text-sm">
              KPIs ({sharedGoals.length})
            </TabsTrigger>
            <TabsTrigger value="report" id="tab-report" className="cursor-pointer text-xs sm:text-sm">
              Achievement Report
            </TabsTrigger>
            <TabsTrigger value="completion" id="tab-completion" className="cursor-pointer text-xs sm:text-sm">
              Completion
            </TabsTrigger>
            <TabsTrigger value="analytics" id="tab-analytics" className="cursor-pointer text-xs sm:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="escalations" id="tab-escalations" className="cursor-pointer text-xs sm:text-sm">
              Escalations
            </TabsTrigger>
            <TabsTrigger value="audit" id="tab-audit" className="cursor-pointer text-xs sm:text-sm">
              Audit Trail
            </TabsTrigger>
            <TabsTrigger value="architecture" id="tab-architecture" className="cursor-pointer text-xs sm:text-sm">
              Architecture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
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
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 text-lg">No goal sheets in the system yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Goal sheets will appear here once employees submit them.</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-left">
                          <th className="px-4 py-3 font-medium text-slate-500">Employee</th>
                          <th className="px-4 py-3 font-medium text-slate-500">Goals</th>
                          <th className="px-4 py-3 font-medium text-slate-500">Shared</th>
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
                          const sharedCount = sheet.goals.filter((g) => g.isShared).length;
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
                                {sharedCount > 0 ? (
                                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                                    {sharedCount} KPI{sharedCount > 1 ? "s" : ""}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-slate-400">—</span>
                                )}
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
          </TabsContent>

          <TabsContent value="shared">
            <SharedGoalForm
              employees={employees}
              onSubmit={handleCreateSharedGoal}
              existingGoals={sharedGoals}
            />
          </TabsContent>

          <TabsContent value="report">
            <AchievementReport />
          </TabsContent>

          <TabsContent value="completion">
            <CompletionDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="escalations">
            <EscalationsView />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogView />
          </TabsContent>

          <TabsContent value="architecture">
            <ArchitectureDiagram />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
