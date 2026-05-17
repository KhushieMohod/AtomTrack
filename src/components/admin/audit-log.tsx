"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/app-context";
import { AuditAction } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HiDocumentText,
  HiCheckCircle,
  HiLockClosed,
  HiArrowPath,
  HiPaperAirplane,
  HiChartBar,
  HiArrowTrendingUp,
  HiBuildingOffice2,
  HiArrowUpTray,
  HiExclamationTriangle,
} from "react-icons/hi2";

const ACTION_CONFIG: Record<AuditAction, { label: string; color: string; Icon: React.ElementType }> = {
  goal_submitted: {
    label: "Goal Submitted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    Icon: HiDocumentText,
  },
  goal_approved: {
    label: "Goal Approved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Icon: HiCheckCircle,
  },
  goal_locked: {
    label: "Goal Locked",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    Icon: HiLockClosed,
  },
  goal_reworked: {
    label: "Returned for Rework",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    Icon: HiArrowPath,
  },
  goal_resubmitted: {
    label: "Goal Resubmitted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    Icon: HiPaperAirplane,
  },
  checkin_created: {
    label: "Check-in Created",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    Icon: HiChartBar,
  },
  checkin_updated: {
    label: "Check-in Updated",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    Icon: HiArrowTrendingUp,
  },
  shared_goal_created: {
    label: "KPI Created",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    Icon: HiBuildingOffice2,
  },
  shared_goal_pushed: {
    label: "KPI Pushed",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    Icon: HiArrowUpTray,
  },
  post_lock_edit: {
    label: "Post-Lock Change",
    color: "bg-red-50 text-red-700 border-red-200",
    Icon: HiExclamationTriangle,
  },
};

const ROLE_COLORS: Record<string, string> = {
  employee: "bg-blue-100 text-blue-700 border-blue-200",
  manager: "bg-emerald-100 text-emerald-700 border-emerald-200",
  admin: "bg-amber-100 text-amber-700 border-amber-200",
};

type FilterMode = "all" | "post_lock";

export function AuditLogView() {
  const { getAuditLog, getPostLockAuditLog } = useAppState();
  const [filter, setFilter] = useState<FilterMode>("all");

  const allEntries = getAuditLog();
  const postLockEntries = getPostLockAuditLog();
  const entries = filter === "post_lock" ? postLockEntries : allEntries;

  return (
    <div className="space-y-6">
      {/* Post-Lock Alert */}
      {postLockEntries.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HiExclamationTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {postLockEntries.length} post-lock change(s) detected
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">
                    Goals were modified after the lock date. Review these changes below.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilter(filter === "post_lock" ? "all" : "post_lock")}
                className={`text-xs cursor-pointer ${
                  filter === "post_lock"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                {filter === "post_lock" ? "Show All" : "Show Post-Lock Only"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Log */}
      <Card className="bg-white border border-[#E2E8F0]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-[#0F172A]">Audit Trail</CardTitle>
              <CardDescription>
                Complete log of all goal-related changes across the organization.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs bg-slate-50 border-[#E2E8F0] text-[#475569]">
              {entries.length} entries
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-4">
                <HiDocumentText className="w-8 h-8 text-[#CBD5E1]" />
              </div>
              <p className="text-[#475569] text-lg">No audit entries found.</p>
              <p className="text-[#94A3B8] text-sm mt-1">
                {filter === "post_lock"
                  ? "No post-lock changes have been recorded."
                  : "Actions will appear here as users interact with the system."}
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#E2E8F0]" />

              <div className="space-y-0">
                {entries.map((entry, index) => {
                  const config = ACTION_CONFIG[entry.action];
                  const isPostLock = entry.action === "post_lock_edit";
                  const IconComponent = config.Icon;

                  return (
                    <div
                      key={entry.id}
                      className={`relative flex gap-4 py-4 ${
                        index < entries.length - 1 ? "border-b border-[#F1F5F9]" : ""
                      } ${isPostLock ? "bg-red-50/30 -mx-4 px-4 rounded-lg" : ""}`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isPostLock
                            ? "bg-red-100 border-2 border-red-300"
                            : "bg-white border-2 border-[#E2E8F0]"
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${
                          isPostLock ? "text-red-600" : "text-[#475569]"
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                variant="outline"
                                className={`text-xs ${config.color}`}
                              >
                                {config.label}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${ROLE_COLORS[entry.userRole]}`}
                              >
                                {entry.userName}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#475569] mt-1.5">
                              {entry.description}
                            </p>

                            {/* Post-lock change details */}
                            {isPostLock && entry.details && (
                              <div className="mt-2 p-3 rounded-lg bg-red-50 border border-red-200">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                  {entry.details.field && (
                                    <div>
                                      <span className="text-red-500 font-medium">Field Changed:</span>
                                      <span className="text-red-700 ml-1 capitalize">{entry.details.field}</span>
                                    </div>
                                  )}
                                  {entry.details.oldValue && (
                                    <div>
                                      <span className="text-red-500 font-medium">Old Value:</span>
                                      <span className="text-red-700 ml-1 line-through">{entry.details.oldValue}</span>
                                    </div>
                                  )}
                                  {entry.details.newValue && (
                                    <div>
                                      <span className="text-red-500 font-medium">New Value:</span>
                                      <span className="text-red-700 ml-1 font-semibold">{entry.details.newValue}</span>
                                    </div>
                                  )}
                                </div>
                                {entry.details.employeeName && (
                                  <p className="text-xs text-red-500 mt-1.5">
                                    Affected Employee: {entry.details.employeeName}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Timestamp */}
                          <div className="text-right shrink-0">
                            <p className="text-xs text-[#94A3B8]">
                              {new Date(entry.timestamp).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-[#CBD5E1]">
                              {new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
