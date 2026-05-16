"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { GoalSheetReview } from "@/components/goals/goal-sheet-review";
import { ManagerCheckInView } from "@/components/goals/manager-checkin";
import { Goal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ManagerDashboard() {
  const { isReady } = useAuthGuard("manager");
  const {
    currentUser,
    getSheetsByManager,
    updateGoalSheet,
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

  const managedSheets = getSheetsByManager(currentUser.id);
  const pendingSheets = managedSheets.filter((s) => s.status === "submitted");
  const approvedSheets = managedSheets.filter(
    (s) => s.status === "approved" || s.status === "locked"
  );

  const handleApprove = (sheetId: string, updatedGoals: Goal[]) => {
    const sheet = managedSheets.find((s) => s.id === sheetId);
    updateGoalSheet(sheetId, {
      goals: updatedGoals,
      status: "locked",
      approvedAt: new Date().toISOString(),
    });

    // Log to audit trail
    addAuditEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "goal_approved",
      entityType: "goal_sheet",
      entityId: sheetId,
      description: `Goal sheet approved for ${sheet?.employeeName || "employee"}`,
      details: { employeeName: sheet?.employeeName },
    });
    addAuditEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "goal_locked",
      entityType: "goal_sheet",
      entityId: sheetId,
      description: `Goal sheet locked after approval for ${sheet?.employeeName || "employee"}`,
      details: { employeeName: sheet?.employeeName },
    });

    toast.success("Goal sheet approved and locked successfully!");
  };

  const handleRework = (sheetId: string, remarks: string) => {
    const sheet = managedSheets.find((s) => s.id === sheetId);
    updateGoalSheet(sheetId, {
      status: "rework",
      managerRemarks: remarks,
    });

    // Log to audit trail
    addAuditEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "goal_reworked",
      entityType: "goal_sheet",
      entityId: sheetId,
      description: `Goal sheet returned for rework: ${sheet?.employeeName || "employee"}. Reason: "${remarks}"`,
      details: { employeeName: sheet?.employeeName },
    });

    toast.success("Goal sheet returned for rework.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Manager Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Review, approve, and track your team&apos;s performance goals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-blue-600">{pendingSheets.length}</p>
              <p className="text-sm text-slate-500 mt-1">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-emerald-600">{approvedSheets.length}</p>
              <p className="text-sm text-slate-500 mt-1">Approved &amp; Locked</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="pt-5 pb-4">
              <p className="text-3xl font-bold text-slate-800">{managedSheets.length}</p>
              <p className="text-sm text-slate-500 mt-1">Total Submissions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6 bg-white border border-[#E2E8F0]">
            <TabsTrigger value="pending" id="tab-pending" className="cursor-pointer">
              Pending Review ({pendingSheets.length})
            </TabsTrigger>
            <TabsTrigger value="approved" id="tab-approved" className="cursor-pointer">
              Approved ({approvedSheets.length})
            </TabsTrigger>
            <TabsTrigger value="checkins" id="tab-checkins" className="cursor-pointer">
              Team Check-ins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingSheets.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">
                    No goal sheets pending review.
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Goal sheets submitted by your team members will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pendingSheets.map((sheet) => (
                  <GoalSheetReview
                    key={sheet.id}
                    sheet={sheet}
                    onApprove={handleApprove}
                    onRework={handleRework}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {approvedSheets.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">
                    No approved goal sheets yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {approvedSheets.map((sheet) => (
                  <GoalSheetReview
                    key={sheet.id}
                    sheet={sheet}
                    onApprove={handleApprove}
                    onRework={handleRework}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="checkins">
            {approvedSheets.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">
                    No locked goal sheets to review check-ins for.
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Approve goal sheets first, then your team can log quarterly check-ins.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {approvedSheets.map((sheet) => (
                  <ManagerCheckInView key={sheet.id} sheet={sheet} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
