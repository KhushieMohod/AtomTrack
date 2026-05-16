"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/app-context";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { AppHeader } from "@/components/layout/app-header";
import { GoalForm } from "@/components/goals/goal-form";
import { Goal, GoalSheet } from "@/types";
import { generateId } from "@/lib/validations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
  rework: "Returned for Rework",
  approved: "Approved",
  locked: "Locked",
};

export default function EmployeeDashboard() {
  const { isReady } = useAuthGuard("employee");
  const { currentUser, addGoalSheet, getSheetsByEmployee, updateGoalSheet } =
    useAppState();
  const [activeTab, setActiveTab] = useState("create");
  const [editingSheet, setEditingSheet] = useState<GoalSheet | null>(null);

  if (!isReady || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  const mySheets = getSheetsByEmployee(currentUser.id);
  const reworkSheets = mySheets.filter((s) => s.status === "rework");

  const handleSubmit = (goals: Goal[]) => {
    if (editingSheet) {
      // Resubmitting a reworked sheet
      updateGoalSheet(editingSheet.id, {
        goals,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        managerRemarks: undefined,
      });
      setEditingSheet(null);
      toast.success("Goal sheet re-submitted successfully!");
    } else {
      // New submission
      const newSheet: GoalSheet = {
        id: generateId("gs"),
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        goals,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      };
      addGoalSheet(newSheet);
      toast.success("Goal sheet submitted successfully!");
    }
    setActiveTab("history");
  };

  const handleEditRework = (sheet: GoalSheet) => {
    setEditingSheet(sheet);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-slate-500 mt-1">
            Define your performance goals for the current appraisal cycle.
          </p>
        </div>

        {/* Rework Notification */}
        {reworkSheets.length > 0 && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    ⚠️ You have {reworkSheets.length} goal sheet(s) returned for rework
                  </p>
                  {reworkSheets[0].managerRemarks && (
                    <p className="text-xs text-amber-600 mt-1">
                      Manager feedback: &quot;{reworkSheets[0].managerRemarks}&quot;
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 cursor-pointer"
                  onClick={() => handleEditRework(reworkSheets[0])}
                >
                  Revise Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white border border-slate-200">
            <TabsTrigger value="create" id="tab-create" className="cursor-pointer">
              {editingSheet ? "Revise Goal Sheet" : "Create Goal Sheet"}
            </TabsTrigger>
            <TabsTrigger value="history" id="tab-history" className="cursor-pointer">
              My Submissions ({mySheets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <GoalForm
              onSubmit={handleSubmit}
              initialGoals={editingSheet?.goals}
              key={editingSheet?.id || "new"}
            />
          </TabsContent>

          <TabsContent value="history">
            {mySheets.length === 0 ? (
              <Card className="bg-white border border-slate-200">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-400 text-lg">No goal sheets submitted yet.</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Switch to the &quot;Create Goal Sheet&quot; tab to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mySheets.map((sheet) => (
                  <Card key={sheet.id} className="bg-white border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Goal Sheet — {sheet.goals.length} Goals
                          </CardTitle>
                          <CardDescription>
                            Submitted{" "}
                            {sheet.submittedAt
                              ? new Date(sheet.submittedAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "recently"}
                          </CardDescription>
                        </div>
                        <Badge className={STATUS_STYLES[sheet.status]}>
                          {STATUS_LABELS[sheet.status]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {sheet.goals.map((g, i) => (
                          <div
                            key={g.id}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 text-xs w-5">
                                {i + 1}.
                              </span>
                              <span className="font-medium text-slate-700">
                                {g.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500">
                              <span className="text-xs">{g.thrustArea}</span>
                              <Badge variant="outline" className="text-xs">
                                {g.weightage}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      {sheet.managerRemarks && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs font-medium text-amber-700">
                            Manager Remarks:
                          </p>
                          <p className="text-sm text-amber-800 mt-1">
                            {sheet.managerRemarks}
                          </p>
                        </div>
                      )}
                      {sheet.status === "rework" && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleEditRework(sheet)}
                            className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                          >
                            Revise &amp; Resubmit
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
