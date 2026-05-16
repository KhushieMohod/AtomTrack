"use client";

import React, { useState } from "react";
import { GoalSheet, Goal } from "@/types";
import { validateGoalSheet } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 border-slate-200",
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  rework: "bg-amber-100 text-amber-700 border-amber-200",
  approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  locked: "bg-purple-100 text-purple-700 border-purple-200",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  rework: "Returned for Rework",
  approved: "Approved",
  locked: "Locked",
};

interface GoalSheetReviewProps {
  sheet: GoalSheet;
  onApprove: (sheetId: string, updatedGoals: Goal[]) => void;
  onRework: (sheetId: string, remarks: string) => void;
}

export function GoalSheetReview({ sheet, onApprove, onRework }: GoalSheetReviewProps) {
  const [editableGoals, setEditableGoals] = useState<Goal[]>(
    sheet.goals.map((g) => ({ ...g }))
  );
  const [showReworkDialog, setShowReworkDialog] = useState(false);
  const [reworkRemarks, setReworkRemarks] = useState("");
  const [editErrors, setEditErrors] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const totalWeightage = editableGoals.reduce((sum, g) => sum + g.weightage, 0);
  const isLocked = sheet.status === "locked" || sheet.status === "approved";

  const handleWeightageChange = (index: number, value: number) => {
    setEditableGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, weightage: value } : g))
    );
    setIsEditing(true);
  };

  const handleTargetChange = (index: number, value: string) => {
    setEditableGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, target: value } : g))
    );
    setIsEditing(true);
  };

  const handleApprove = () => {
    const result = validateGoalSheet(editableGoals);
    if (!result.valid) {
      setEditErrors(result.errors);
      return;
    }
    setEditErrors([]);
    onApprove(sheet.id, editableGoals);
  };

  const handleRework = () => {
    if (!reworkRemarks.trim()) return;
    onRework(sheet.id, reworkRemarks);
    setShowReworkDialog(false);
    setReworkRemarks("");
  };

  return (
    <>
      <Card className="bg-white border border-slate-200 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                {sheet.employeeName}
              </CardTitle>
              <CardDescription>
                {sheet.goals.length} goals &middot; Submitted{" "}
                {sheet.submittedAt
                  ? new Date(sheet.submittedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "recently"}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={STATUS_STYLES[sheet.status]}
            >
              {STATUS_LABELS[sheet.status]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* Validation errors */}
          {editErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm font-medium text-red-700 mb-1">Cannot approve:</p>
              {editErrors.map((err, i) => (
                <p key={i} className="text-xs text-red-600">• {err}</p>
              ))}
            </div>
          )}

          {/* Goals Table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-4 py-3 font-medium text-slate-500 w-8">#</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Goal</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Thrust Area</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Unit</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Target</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-right">
                    Weightage
                  </th>
                </tr>
              </thead>
              <tbody>
                {editableGoals.map((goal, index) => (
                  <tr
                    key={goal.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {goal.title}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{goal.thrustArea}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs font-normal">
                        {goal.unit}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {!isLocked ? (
                        <Input
                          value={goal.target}
                          onChange={(e) =>
                            handleTargetChange(index, e.target.value)
                          }
                          className="h-8 text-sm w-28"
                        />
                      ) : (
                        <span className="text-slate-600">{goal.target}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isLocked ? (
                        <Input
                          type="number"
                          min={10}
                          max={100}
                          value={goal.weightage}
                          onChange={(e) =>
                            handleWeightageChange(
                              index,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="h-8 text-sm w-20 text-right ml-auto"
                        />
                      ) : (
                        <span className="text-slate-600">{goal.weightage}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={5} className="px-4 py-3 font-medium text-slate-600">
                    Total Weightage
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-bold ${
                      totalWeightage === 100
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {totalWeightage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Manager Remarks if any */}
          {sheet.managerRemarks && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700">Manager Remarks:</p>
              <p className="text-sm text-amber-800 mt-1">{sheet.managerRemarks}</p>
            </div>
          )}

          {/* Action Buttons */}
          {!isLocked && sheet.status === "submitted" && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="text-xs text-slate-400">
                {isEditing && "You have unsaved edits to targets/weightages"}
              </div>
              <div className="flex gap-3">
                <Button
                  id={`rework-btn-${sheet.id}`}
                  variant="outline"
                  onClick={() => setShowReworkDialog(true)}
                  className="text-amber-600 border-amber-300 hover:bg-amber-50 cursor-pointer"
                >
                  Return for Rework
                </Button>
                <Button
                  id={`approve-btn-${sheet.id}`}
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  Approve &amp; Lock
                </Button>
              </div>
            </div>
          )}

          {/* Locked indicator */}
          {isLocked && (
            <div className="flex items-center justify-center gap-2 py-3 bg-purple-50 rounded-lg border border-purple-100">
              <span className="text-purple-600 font-medium text-sm">
                🔒 This goal sheet is locked and cannot be modified
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rework Dialog */}
      <Dialog open={showReworkDialog} onOpenChange={setShowReworkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return for Rework</DialogTitle>
            <DialogDescription>
              Provide feedback for {sheet.employeeName} about what needs to be revised.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            id="rework-remarks"
            placeholder="Enter your feedback and suggestions for revision..."
            value={reworkRemarks}
            onChange={(e) => setReworkRemarks(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReworkDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              id="confirm-rework-btn"
              onClick={handleRework}
              disabled={!reworkRemarks.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
            >
              Send for Rework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
