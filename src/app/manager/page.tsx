"use client";

import React from "react";
import { useAppState } from "@/context/app-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { GoalSheetReview } from "@/components/goals/goal-sheet-review";
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
  } = useAppState();

  if (!isReady || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const managedSheets = getSheetsByManager(currentUser.id);
  const pendingSheets = managedSheets.filter((s) => s.status === "submitted");
  const approvedSheets = managedSheets.filter(
    (s) => s.status === "approved" || s.status === "locked"
  );

  const handleApprove = (sheetId: string, updatedGoals: Goal[]) => {
    updateGoalSheet(sheetId, {
      goals: updatedGoals,
      status: "locked",
      approvedAt: new Date().toISOString(),
    });
    toast.success("Goal sheet approved and locked successfully!");
  };

  const handleRework = (sheetId: string, remarks: string) => {
    updateGoalSheet(sheetId, {
      status: "rework",
      managerRemarks: remarks,
    });
    toast.success("Goal sheet returned for rework.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Manager Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Review, edit, and approve your team&apos;s goal sheets.
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
          <TabsList className="mb-6 bg-white border border-slate-200">
            <TabsTrigger value="pending" id="tab-pending" className="cursor-pointer">
              Pending Review ({pendingSheets.length})
            </TabsTrigger>
            <TabsTrigger value="approved" id="tab-approved" className="cursor-pointer">
              Approved ({approvedSheets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingSheets.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="py-12 text-center">
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
        </Tabs>
      </main>
    </div>
  );
}
