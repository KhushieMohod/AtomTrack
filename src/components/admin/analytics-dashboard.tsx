"use client";

import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppState } from "@/context/app-context";

// ─── Color Palette ───────────────────────────────────────────────────────────

const COLORS = {
  indigo: "#6366f1",
  violet: "#8b5cf6",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  slate: "#64748b",
};

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#ec4899",
];

// ─── QoQ Achievement Trends (Line Chart) ─────────────────────────────────────

const QOQ_DATA = [
  { quarter: "FY25 Q1", orgAvg: 62, engineering: 68, hr: 55, target: 70 },
  { quarter: "FY25 Q2", orgAvg: 71, engineering: 74, hr: 65, target: 70 },
  { quarter: "FY25 Q3", orgAvg: 78, engineering: 82, hr: 72, target: 75 },
  { quarter: "FY25 Q4", orgAvg: 85, engineering: 88, hr: 80, target: 80 },
  { quarter: "FY26 Q1", orgAvg: 74, engineering: 79, hr: 68, target: 80 },
];

function QoQTrendsChart() {
  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          QoQ Goal Achievement Trends
        </CardTitle>
        <CardDescription className="text-xs">
          Quarter-on-quarter achievement percentage across departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={QOQ_DATA} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="quarter"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
              />
              <YAxis
                domain={[40, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}%`, undefined]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
              <Line
                type="monotone"
                dataKey="orgAvg"
                name="Org Average"
                stroke={COLORS.indigo}
                strokeWidth={2.5}
                dot={{ r: 4, fill: COLORS.indigo }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="engineering"
                name="Engineering"
                stroke={COLORS.cyan}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.cyan }}
              />
              <Line
                type="monotone"
                dataKey="hr"
                name="HR"
                stroke={COLORS.amber}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.amber }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke={COLORS.rose}
                strokeWidth={1.5}
                strokeDasharray="6 3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Completion Heatmap (Custom Grid) ────────────────────────────────────────

function CompletionHeatmap() {
  const { getAllUsers, getAllSheets, checkIns } = useAppState();
  const employees = getAllUsers().filter((u) => u.role === "employee");
  const allSheets = getAllSheets();
  const quarters = ["Q1", "Q2", "Q3", "Q4"] as const;

  const heatmapData = employees.map((emp) => {
    const empSheets = allSheets.filter((s) => s.employeeId === emp.id);
    const lockedSheets = empSheets.filter((s) => s.status === "locked");
    const totalGoals = lockedSheets.reduce((sum, s) => sum + s.goals.length, 0);

    const qData = quarters.map((q) => {
      const qCheckIns = checkIns.filter(
        (ci) => ci.employeeId === emp.id && ci.quarter === q
      );
      const completed = qCheckIns.filter((ci) => ci.status === "Completed").length;
      const total = totalGoals || 1;
      const pct = totalGoals > 0 ? Math.round((qCheckIns.length / total) * 100) : 0;
      return { quarter: q, count: qCheckIns.length, completed, pct };
    });

    return { name: emp.name.split(" ")[0], fullName: emp.name, quarters: qData };
  });

  const getCellColor = (pct: number) => {
    if (pct === 0) return "bg-slate-100 text-slate-400";
    if (pct < 30) return "bg-red-100 text-red-700";
    if (pct < 60) return "bg-amber-100 text-amber-700";
    if (pct < 90) return "bg-blue-100 text-blue-700";
    return "bg-emerald-100 text-emerald-700";
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Organization-wide Completion Heatmap
        </CardTitle>
        <CardDescription className="text-xs">
          Check-in completion rate by employee and quarter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="grid" aria-label="Completion heatmap">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-xs font-medium text-slate-500">
                  Employee
                </th>
                {quarters.map((q) => (
                  <th
                    key={q}
                    className="px-3 py-2 text-xs font-medium text-slate-500 text-center"
                  >
                    {q}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.fullName} className="border-t border-slate-50">
                  <td className="px-3 py-2.5 font-medium text-slate-700 text-xs">
                    {row.fullName}
                  </td>
                  {row.quarters.map((qd) => (
                    <td key={qd.quarter} className="px-3 py-2.5 text-center">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-8 rounded-md text-xs font-semibold transition-colors ${getCellColor(
                          qd.pct
                        )}`}
                        title={`${qd.count} check-ins (${qd.pct}%)`}
                        role="gridcell"
                        aria-label={`${row.fullName} ${qd.quarter}: ${qd.pct}%`}
                      >
                        {qd.pct}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-medium">Scale:</span>
          {[
            { label: "0%", cls: "bg-slate-100" },
            { label: "<30%", cls: "bg-red-100" },
            { label: "<60%", cls: "bg-amber-100" },
            { label: "<90%", cls: "bg-blue-100" },
            { label: "90%+", cls: "bg-emerald-100" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className={`w-4 h-3 rounded-sm ${item.cls}`} />
              <span className="text-[10px] text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Goal Distribution (Pie + Bar) ───────────────────────────────────────────

function GoalDistributionCharts() {
  const { getAllSheets } = useAppState();
  const allSheets = getAllSheets();
  const allGoals = allSheets.flatMap((s) => s.goals);

  // By Thrust Area
  const thrustAreaMap: Record<string, number> = {};
  allGoals.forEach((g) => {
    thrustAreaMap[g.thrustArea] = (thrustAreaMap[g.thrustArea] || 0) + 1;
  });
  const thrustAreaData = Object.entries(thrustAreaMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // By Unit of Measurement
  const uomMap: Record<string, number> = {};
  allGoals.forEach((g) => {
    uomMap[g.unit] = (uomMap[g.unit] || 0) + 1;
  });
  const uomData = Object.entries(uomMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (props: any) => {
    const { name, percent } = props as { name?: string; percent?: number };
    return (percent && percent > 0.08) ? `${name || ""} (${(percent * 100).toFixed(0)}%)` : "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Thrust Area Pie */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Goals by Thrust Area
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of goals across strategic thrust areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {thrustAreaData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-slate-400">
              No goal data available
            </div>
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={thrustAreaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={renderLabel}
                    labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                  >
                    {thrustAreaData.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* UoM Bar Chart */}
      <Card className="bg-white border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Goals by Unit of Measurement
          </CardTitle>
          <CardDescription className="text-xs">
            How goals are measured across the organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uomData.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-slate-400">
              No goal data available
            </div>
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={uomData}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={90}
                    axisLine={{ stroke: "#cbd5e1" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [value, "Goals"]}
                  />
                  <Bar dataKey="value" name="Goals" radius={[0, 6, 6, 0]} maxBarSize={28}>
                    {uomData.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Manager Effectiveness Radar ─────────────────────────────────────────────

function ManagerEffectivenessChart() {
  const { getAllUsers, getAllSheets, managerComments, checkIns } = useAppState();
  const managers = getAllUsers().filter((u) => u.role === "manager");
  const employees = getAllUsers().filter((u) => u.role === "employee");
  const allSheets = getAllSheets();

  const managerData = managers.map((mgr) => {
    const team = employees.filter((e) => e.managerId === mgr.id);
    const teamIds = team.map((e) => e.id);
    const teamSheets = allSheets.filter((s) => teamIds.includes(s.employeeId));
    const lockedSheets = teamSheets.filter((s) => s.status === "locked");
    const comments = managerComments.filter((mc) => mc.managerId === mgr.id);
    const teamCheckIns = checkIns.filter((ci) => teamIds.includes(ci.employeeId));
    const completedCheckIns = teamCheckIns.filter((ci) => ci.status === "Completed");

    // Normalize scores to 0–100
    const approvalRate = team.length > 0 ? Math.round((lockedSheets.length / Math.max(teamSheets.length, 1)) * 100) : 0;
    const feedbackScore = Math.min(100, comments.length * 25);
    const teamCompletion = teamCheckIns.length > 0 ? Math.round((completedCheckIns.length / teamCheckIns.length) * 100) : 0;
    const responseTime = Math.min(100, 85); // Mock: avg response within SLA
    const teamEngagement = Math.min(100, Math.round((teamCheckIns.length / Math.max(team.length, 1)) * 30));

    return {
      name: mgr.name.split(" ")[0],
      fullName: mgr.name,
      approvalRate,
      feedbackScore,
      teamCompletion,
      responseTime,
      teamEngagement,
    };
  });

  // Build radar data
  const radarMetrics = [
    "Approval Rate",
    "Feedback Quality",
    "Team Completion",
    "Response Time",
    "Team Engagement",
  ];
  const radarData = radarMetrics.map((metric, idx) => {
    const entry: Record<string, string | number> = { metric };
    managerData.forEach((mgr) => {
      const values = [
        mgr.approvalRate,
        mgr.feedbackScore,
        mgr.teamCompletion,
        mgr.responseTime,
        mgr.teamEngagement,
      ];
      entry[mgr.name] = values[idx];
    });
    return entry;
  });

  const radarColors = [COLORS.indigo, COLORS.emerald, COLORS.amber, COLORS.rose];

  return (
    <Card className="bg-white border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          Manager Effectiveness Comparison
        </CardTitle>
        <CardDescription className="text-xs">
          Multi-dimensional effectiveness metrics across managers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                />
                {managerData.map((mgr, i) => (
                  <Radar
                    key={mgr.fullName}
                    name={mgr.fullName}
                    dataKey={mgr.fullName}
                    stroke={radarColors[i % radarColors.length]}
                    fill={radarColors[i % radarColors.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Score Breakdown Cards */}
          <div className="space-y-3">
            {managerData.map((mgr, i) => (
              <div
                key={mgr.fullName}
                className="p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50/50 to-white"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: radarColors[i % radarColors.length] }}
                  >
                    {mgr.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {mgr.fullName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Approval Rate", value: mgr.approvalRate, color: "indigo" },
                    { label: "Feedback", value: mgr.feedbackScore, color: "emerald" },
                    { label: "Team Completion", value: mgr.teamCompletion, color: "blue" },
                    { label: "Response Time", value: mgr.responseTime, color: "amber" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500">{m.label}</span>
                          <span className="text-[10px] font-semibold text-slate-600">
                            {m.value}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${m.value}%`,
                              backgroundColor:
                                COLORS[m.color as keyof typeof COLORS] || COLORS.indigo,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Analytics Dashboard ────────────────────────────────────────────────

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analytics Overview
            </h2>
            <p className="text-sm text-white/70 mt-1 max-w-lg">
              Organization-wide performance analytics with QoQ trends,
              completion heatmaps, goal distributions, and manager effectiveness
              metrics.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Live Data
          </div>
        </div>
      </div>

      {/* Chart 1: QoQ Achievement Trends */}
      <QoQTrendsChart />

      {/* Chart 2: Completion Heatmap */}
      <CompletionHeatmap />

      {/* Chart 3: Goal Distribution */}
      <GoalDistributionCharts />

      {/* Chart 4: Manager Effectiveness */}
      <ManagerEffectivenessChart />
    </div>
  );
}
