"use client";

import React, { useMemo } from "react";
import { useAppState } from "@/context/app-context";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  User,
  Users,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type EscalationSeverity = "critical" | "warning" | "info";
type EscalationStatus = "active" | "resolved" | "escalated";

interface EscalationRule {
  id: string;
  title: string;
  description: string;
  condition: string;
  severity: EscalationSeverity;
}

interface EscalationEntry {
  id: string;
  ruleId: string;
  ruleTitle: string;
  severity: EscalationSeverity;
  status: EscalationStatus;
  subject: string;
  subjectRole: string;
  description: string;
  triggeredAt: string;
  chain: { role: string; name: string; action: string }[];
}

const RULES: EscalationRule[] = [
  {
    id: "rule-001",
    title: "Goal Submission Overdue",
    description: "Employee did not submit goals within 5 business days of the cycle opening.",
    condition: "No goal sheet submitted within 5 days",
    severity: "critical",
  },
  {
    id: "rule-002",
    title: "Manager Approval Ignored",
    description: "Manager has not acted on pending goal sheet approvals for more than 3 days.",
    condition: "Submitted sheet pending > 3 days without manager action",
    severity: "warning",
  },
  {
    id: "rule-003",
    title: "Quarterly Check-in Missed",
    description: "Employee missed the quarterly check-in reporting window.",
    condition: "No check-in logged for the current active quarter",
    severity: "warning",
  },
];

const SEVERITY_STYLES: Record<EscalationSeverity, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const SEVERITY_LABELS: Record<EscalationSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

const STATUS_STYLES: Record<EscalationStatus, string> = {
  active: "bg-red-50 text-red-700 border-red-200",
  escalated: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function EscalationsView() {
  const { getAllUsers, getAllSheets, checkIns } = useAppState();
  const allUsers = getAllUsers();
  const allSheets = getAllSheets();
  const employees = allUsers.filter((u) => u.role === "employee");
  const managers = allUsers.filter((u) => u.role === "manager");

  const escalations = useMemo<EscalationEntry[]>(() => {
    const entries: EscalationEntry[] = [];
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    // Rule 1: Goal Submission Overdue
    employees.forEach((emp) => {
      const empSheets = allSheets.filter((s) => s.employeeId === emp.id);
      if (empSheets.length === 0) {
        const mgr = managers.find((m) => m.id === emp.managerId);
        entries.push({
          id: `esc-${emp.id}-r1`,
          ruleId: "rule-001",
          ruleTitle: "Goal Submission Overdue",
          severity: "critical",
          status: "escalated",
          subject: emp.name,
          subjectRole: "Employee",
          description: `${emp.name} has not submitted any goal sheet. Overdue by 5+ days.`,
          triggeredAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
          chain: [
            { role: "Employee", name: emp.name, action: "Reminder sent via email" },
            { role: "Manager", name: mgr?.name || "Unassigned", action: "Escalation notification sent" },
            { role: "HR / Admin", name: "Shlok Chaudhari", action: "Auto-escalated for intervention" },
          ],
        });
      }
    });

    // Rule 2: Manager Approval Ignored
    const pendingSheets = allSheets.filter((s) => s.status === "submitted");
    pendingSheets.forEach((sheet) => {
      const submittedDate = sheet.submittedAt ? new Date(sheet.submittedAt).getTime() : now;
      const daysPending = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));
      if (daysPending >= 0) {
        const emp = employees.find((e) => e.id === sheet.employeeId);
        const mgr = managers.find((m) => m.id === emp?.managerId);
        entries.push({
          id: `esc-${sheet.id}-r2`,
          ruleId: "rule-002",
          ruleTitle: "Manager Approval Ignored",
          severity: "warning",
          status: "active",
          subject: mgr?.name || "Unknown Manager",
          subjectRole: "Manager",
          description: `${mgr?.name || "Manager"} has a pending approval for ${sheet.employeeName}'s goal sheet (${daysPending} day${daysPending !== 1 ? "s" : ""}).`,
          triggeredAt: sheet.submittedAt || new Date().toISOString(),
          chain: [
            { role: "Employee", name: sheet.employeeName, action: "Goal sheet submitted" },
            { role: "Manager", name: mgr?.name || "Unknown", action: "Pending approval — reminder sent" },
            { role: "HR / Admin", name: "Shlok Chaudhari", action: "Monitoring" },
          ],
        });
      }
    });

    // Rule 3: Quarterly Check-in Missed
    const lockedSheets = allSheets.filter((s) => s.status === "locked");
    lockedSheets.forEach((sheet) => {
      const emp = employees.find((e) => e.id === sheet.employeeId);
      const empCheckIns = checkIns.filter(
        (ci) => ci.employeeId === sheet.employeeId && ci.quarter === "Q2"
      );
      if (empCheckIns.length === 0 && emp) {
        const mgr = managers.find((m) => m.id === emp.managerId);
        entries.push({
          id: `esc-${sheet.id}-r3`,
          ruleId: "rule-003",
          ruleTitle: "Quarterly Check-in Missed",
          severity: "warning",
          status: "active",
          subject: emp.name,
          subjectRole: "Employee",
          description: `${emp.name} has not logged Q2 check-ins for locked goal sheet.`,
          triggeredAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
          chain: [
            { role: "Employee", name: emp.name, action: "Check-in reminder sent" },
            { role: "Manager", name: mgr?.name || "Unassigned", action: "Notified of pending check-in" },
            { role: "HR / Admin", name: "Shlok Chaudhari", action: "Monitoring deadline" },
          ],
        });
      }
    });

    return entries;
  }, [allSheets, employees, managers, checkIns]);

  const activeCount = escalations.filter((e) => e.status === "active").length;
  const escalatedCount = escalations.filter((e) => e.status === "escalated").length;
  const criticalCount = escalations.filter((e) => e.severity === "critical").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-[#E2E8F0]">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-[#0F172A]">{escalations.length}</p>
            <p className="text-sm text-[#475569] mt-1">Total Escalations</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#E2E8F0]">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-sm text-[#475569] mt-1">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#E2E8F0]">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-amber-600">{activeCount}</p>
            <p className="text-sm text-[#475569] mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-[#E2E8F0]">
          <CardContent className="pt-5 pb-4">
            <p className="text-3xl font-bold text-[#7C3AED]">{escalatedCount}</p>
            <p className="text-sm text-[#475569] mt-1">Escalated to HR</p>
          </CardContent>
        </Card>
      </div>

      {/* Escalation Rules */}
      <Card className="bg-white border border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#475569]" />
            Active Escalation Rules
          </CardTitle>
          <CardDescription>
            Automated rules that trigger escalations based on workflow conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RULES.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                <div className="mt-0.5">
                  {rule.severity === "critical" ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-[#0F172A]">{rule.title}</span>
                    <Badge variant="outline" className={`text-[10px] ${SEVERITY_STYLES[rule.severity]}`}>
                      {SEVERITY_LABELS[rule.severity]}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#475569]">{rule.description}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-1 font-mono">
                    Condition: {rule.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Log */}
      <Card className="bg-white border border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#475569]" />
            Escalation Log
          </CardTitle>
          <CardDescription>
            Triggered escalations with full chain-of-command visibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {escalations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
              <p className="text-[#475569]">No escalations triggered.</p>
              <p className="text-sm text-[#94a3b8] mt-1">
                All employees and managers are on track.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {escalations.map((esc) => (
                <div
                  key={esc.id}
                  className="border border-[#E2E8F0] rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${SEVERITY_STYLES[esc.severity]}`}>
                        {SEVERITY_LABELS[esc.severity]}
                      </Badge>
                      <span className="text-sm font-medium text-[#0F172A]">
                        {esc.ruleTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[esc.status]}`}>
                        {esc.status.charAt(0).toUpperCase() + esc.status.slice(1)}
                      </Badge>
                      <span className="text-[10px] text-[#94a3b8]">
                        {new Date(esc.triggeredAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-3">
                    <p className="text-sm text-[#475569] mb-4">{esc.description}</p>

                    {/* Escalation Chain */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {esc.chain.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white">
                            <div className="w-6 h-6 rounded-full bg-[#F8FAFC] flex items-center justify-center">
                              {step.role === "Employee" ? (
                                <User className="w-3 h-3 text-[#2563EB]" />
                              ) : step.role === "Manager" ? (
                                <Users className="w-3 h-3 text-[#7C3AED]" />
                              ) : (
                                <Shield className="w-3 h-3 text-[#16A34A]" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#0F172A]">
                                {step.name}
                              </p>
                              <p className="text-[10px] text-[#94a3b8]">
                                {step.role} — {step.action}
                              </p>
                            </div>
                          </div>
                          {idx < esc.chain.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-[#94a3b8] shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
