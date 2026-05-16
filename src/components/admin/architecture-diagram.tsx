"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const layers = [
  {
    name: "Presentation Layer",
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
    items: [
      { label: "Login Page", desc: "Mock Auth · Role Selection" },
      { label: "Employee Dashboard", desc: "Goal Creation · Check-ins · Scores" },
      { label: "Manager Dashboard", desc: "Review · Approve · Comments" },
      { label: "Admin Dashboard", desc: "Reports · Audit · KPIs" },
    ],
  },
  {
    name: "Component Layer",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50 border-violet-200",
    textColor: "text-violet-800",
    items: [
      { label: "GoalForm", desc: "Validation · Weightage" },
      { label: "GoalSheetReview", desc: "Inline Edit · Approve" },
      { label: "QuarterlyCheckIn", desc: "Actual vs. Planned" },
      { label: "ProgressScore", desc: "SVG Ring · Formulas" },
    ],
  },
  {
    name: "State Management",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-800",
    items: [
      { label: "AppContext", desc: "React Context API" },
      { label: "useAppState()", desc: "Global State Hook" },
      { label: "useAuthGuard()", desc: "Route Protection" },
      { label: "Audit Trail", desc: "Change Logging" },
    ],
  },
  {
    name: "Business Logic",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
    items: [
      { label: "Scoring Engine", desc: "Min / Max / Timeline / Zero" },
      { label: "Validation", desc: "100% · 10% Min · Max 8" },
      { label: "Quarter System", desc: "Fiscal Year Windows" },
      { label: "CSV Export", desc: "Report Generation" },
    ],
  },
  {
    name: "Data Layer",
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50 border-slate-200",
    textColor: "text-slate-800",
    items: [
      { label: "Mock Users", desc: "5 Users · 3 Roles" },
      { label: "Goal Sheets", desc: "Goals · Status · History" },
      { label: "Check-ins", desc: "Quarterly Records" },
      { label: "Audit Log", desc: "Immutable Trail" },
    ],
  },
];

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "UI Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS 4", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Sonner", category: "Toasts" },
  { name: "Vercel", category: "Deployment" },
  { name: "Lucide", category: "Icons" },
];

export function ArchitectureDiagram() {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card className="bg-white border border-slate-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardTitle className="text-lg">System Architecture</CardTitle>
          <CardDescription className="text-slate-300">
            AtomTrack — Layered Architecture Diagram
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="space-y-3">
            {layers.map((layer, layerIndex) => (
              <div key={layer.name} className="relative">
                {/* Connector */}
                {layerIndex > 0 && (
                  <div className="flex justify-center -mt-3 mb-0 relative z-10">
                    <div className="flex flex-col items-center">
                      <svg className="w-4 h-6 text-slate-300" viewBox="0 0 16 24" fill="none">
                        <path d="M8 0V20M4 16L8 22L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Layer card */}
                <div className={`rounded-xl border-2 ${layer.bgColor} p-4 transition-all hover:shadow-md`}>
                  {/* Layer header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-1.5 w-8 rounded-full bg-gradient-to-r ${layer.color}`} />
                    <h3 className={`text-sm font-bold ${layer.textColor} uppercase tracking-wider`}>
                      {layer.name}
                    </h3>
                  </div>

                  {/* Layer items */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {layer.items.map((item) => (
                      <div
                        key={item.label}
                        className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 hover:border-slate-300 transition-all hover:shadow-sm"
                      >
                        <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Data Flow Legend */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>UI Components</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>State Management</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Business Logic</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-3 text-slate-400" viewBox="0 0 16 12" fill="none">
                <path d="M2 6H14M10 2L14 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Data Flow</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Technology Stack</CardTitle>
          <CardDescription>
            Core technologies powering AtomTrack.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-500">
                    {tech.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{tech.name}</p>
                  <p className="text-xs text-slate-400">{tech.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles Flow */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">User Role Permissions</CardTitle>
          <CardDescription>
            Access control matrix for all three user roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left border-b border-slate-200">
                <th className="px-4 py-3 font-medium text-slate-500 text-xs">Feature</th>
                <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Employee
                  </span>
                </th>
                <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Manager
                  </span>
                </th>
                <th className="px-4 py-3 font-medium text-slate-500 text-xs text-center">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Admin
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Create Goal Sheet", emp: true, mgr: false, admin: false },
                { feature: "Submit Goals for Review", emp: true, mgr: false, admin: false },
                { feature: "Log Quarterly Check-ins", emp: true, mgr: false, admin: false },
                { feature: "View Progress Scores", emp: true, mgr: true, admin: true },
                { feature: "Review & Edit Goals", emp: false, mgr: true, admin: false },
                { feature: "Approve & Lock Goals", emp: false, mgr: true, admin: false },
                { feature: "Return for Rework", emp: false, mgr: true, admin: false },
                { feature: "Add Check-in Comments", emp: false, mgr: true, admin: false },
                { feature: "Create Shared KPIs", emp: false, mgr: false, admin: true },
                { feature: "View All Goal Sheets", emp: false, mgr: false, admin: true },
                { feature: "Export Achievement Reports", emp: false, mgr: false, admin: true },
                { feature: "View Audit Trail", emp: false, mgr: false, admin: true },
                { feature: "View Completion Dashboard", emp: false, mgr: false, admin: true },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 text-slate-700 font-medium">{row.feature}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.emp ? (
                      <span className="text-emerald-500 text-base">✓</span>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.mgr ? (
                      <span className="text-emerald-500 text-base">✓</span>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.admin ? (
                      <span className="text-emerald-500 text-base">✓</span>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
