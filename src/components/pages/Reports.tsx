import { useState, useMemo, useEffect } from "react";
import {
  ResponsiveContainer, RadialBarChart, RadialBar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, AreaChart, Area, Legend, Treemap,
  LineChart,
} from "recharts";
import {
  BarChart3, Upload, Users, Clock, Target, Award, Lightbulb,
  CheckCircle2, TrendingUp, Layers, Activity, Sparkles, Trophy,
  Briefcase, Cpu, Heart, Building2, HeartHandshake, ListChecks, Star,
} from "lucide-react";
import type { DataStoreShape } from "../../lib/dataStore";
import { EVAL_LABELS, OKR_INFO, REPORT_MONTHS, TEAM_ROSTER, getOKRScore, getTeamAverage, type TeamReport } from "../../lib/reportData";
import { getAllReports, getSubmissionStats, onReportsChange } from "../../lib/reportStore";
import SubmitReportModal from "../reports/SubmitReportModal";

// ─── Custom tooltip ─────────────────────────────────────
function GlassTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string; payload?: { fullLabel?: string } }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass !rounded-lg px-3 py-2 text-xs shadow-lg" style={{ background: "rgba(255,255,255,0.95)" }}>
      {label && <div className="font-semibold mb-1" style={{ color: "var(--text-main)" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-muted)" }}>{p.payload?.fullLabel ?? p.name}:</span>
          <span className="font-semibold" style={{ color: "var(--text-main)" }}>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── OKR Hero Card ──────────────────────────────────────
function OKRCard({ okr, reports, okrData }: { okr: "O1" | "O2" | "O3" | "TEAM"; reports: TeamReport[]; okrData?: { id: string; objective: string; keyResults: string[] } }) {
  const score = getOKRScore(reports, okr);
  const pct = (score / 5) * 100;
  const info = OKR_INFO[okr];
  const data = [{ name: okr, value: pct, fill: info.color }];
  const contributingCats = EVAL_LABELS.filter((l) => l.okr === okr);

  const Icon = okr === "O1" ? Building2 : okr === "O2" ? Heart : okr === "O3" ? Cpu : Users;

  return (
    <div className="glass p-5 flex flex-col" style={{ background: info.bg, border: `1px solid ${info.color}33` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: info.color + "22" }}>
            <Icon className="w-4 h-4" style={{ color: info.color }} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: info.color }}>{info.title}</div>
            <div className="text-[9px] leading-tight max-w-[180px]" style={{ color: "var(--text-muted)" }}>{info.subtitle}</div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="65%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar background={{ fill: "rgba(0,0,0,0.05)" }} dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-light" style={{ color: info.color }}>{score.toFixed(2)}</span>
          <span className="text-[9px] font-medium" style={{ color: "var(--text-muted)" }}>/ 5.00</span>
        </div>
      </div>

      {okrData && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: info.color + "22" }}>
          <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--text-main)" }}>{okrData.objective}</p>
          <ul className="space-y-1">
            {okrData.keyResults.slice(0, 3).map((kr, i) => (
              <li key={i} className="text-[9px] flex items-start gap-1.5" style={{ color: "var(--text-muted)" }}>
                <span className="mt-0.5" style={{ color: info.color }}>▸</span>
                <span className="leading-snug">{kr}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {okr === "TEAM" && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: info.color + "22" }}>
          <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--text-main)" }}>Capability & culture pulse</p>
          <div className="flex flex-wrap gap-1">
            {contributingCats.map((c) => (
              <span key={c.key} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: c.color + "22", color: c.color }}>{c.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Team Pulse Radar ───────────────────────────────────
function TeamPulseRadar({ reports, previousReports }: { reports: TeamReport[]; previousReports: TeamReport[] }) {
  const data = useMemo(() => {
    return EVAL_LABELS.map((l) => {
      const currAvg = reports.reduce((s, r) => s + r.selfEval[l.key], 0) / Math.max(1, reports.length);
      const prevAvg = previousReports.reduce((s, r) => s + r.selfEval[l.key], 0) / Math.max(1, previousReports.length);
      return {
        category: l.label.replace(/&/g, "+").replace(/ \/ /g, "/"),
        current: Number(currAvg.toFixed(2)),
        previous: Number(prevAvg.toFixed(2)),
        target: 4,
      };
    });
  }, [reports, previousReports]);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Activity className="w-4 h-4" style={{ color: "var(--primary)" }} />
          Team Capability Pulse
        </h3>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>14 dimensions · this month vs prior</span>
      </div>
      <div style={{ height: 340 }}>
        <ResponsiveContainer>
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(0,0,0,0.08)" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: "#64748b" }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: "#94a3b8" }} angle={90} />
            <Radar name="Target" dataKey="target" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} strokeDasharray="3 3" />
            <Radar name="Previous month" dataKey="previous" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
            <Radar name="This month" dataKey="current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Tooltip content={<GlassTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Monthly Trend ──────────────────────────────────────
function MonthlyTrend({ allReports }: { allReports: TeamReport[] }) {
  const data = useMemo(() => {
    return REPORT_MONTHS.map((m) => {
      const monthReports = allReports.filter((r) => r.month === m);
      if (monthReports.length === 0) return { month: m.slice(0, 3), hours: 0, tasks: 0, avgEval: 0, ideas: 0 };
      const hours = monthReports.reduce((s, r) => s + r.hoursLogged, 0);
      const tasks = monthReports.reduce((s, r) => s + r.tasksCompleted, 0);
      const ideas = monthReports.reduce((s, r) => s + r.innovationIdeas, 0);
      const avgEval = monthReports.reduce((s, r) => {
        const vals = Object.values(r.selfEval);
        return s + vals.reduce((a, b) => a + b, 0) / vals.length;
      }, 0) / monthReports.length;
      return { month: m.slice(0, 3), hours, tasks, avgEval: Number(avgEval.toFixed(2)), ideas };
    });
  }, [allReports]);

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <TrendingUp className="w-4 h-4" style={{ color: "var(--primary)" }} />
          Team Velocity & Health Trend
        </h3>
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Hours · tasks · avg rating</span>
      </div>
      <div style={{ height: 340 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar yAxisId="left" dataKey="hours" name="Hours logged" fill="url(#hoursGrad)" radius={[6, 6, 0, 0]} />
            <Bar yAxisId="left" dataKey="tasks" name="Tasks done" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="avgEval" name="Avg self-eval" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Modules Donut ──────────────────────────────────────
function ModulesDonut({ reports }: { reports: TeamReport[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach((r) => r.modulesWorked.forEach((m) => { counts[m] = (counts[m] || 0) + 1; }));
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [reports]);

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#ec4899", "#84cc16", "#3b82f6", "#14b8a6"];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Briefcase className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Module Activity Distribution
      </h3>
      <div className="relative" style={{ height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<GlassTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-light" style={{ color: "var(--text-main)" }}>{total}</span>
          <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>contributions</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 max-h-24 overflow-y-auto">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="truncate flex-1" style={{ color: "var(--text-main)" }}>{d.name}</span>
            <span style={{ color: "var(--text-muted)" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hours Investment Treemap ──────────────────────────
function HoursTreemap({ reports }: { reports: TeamReport[] }) {
  const data = useMemo(() => {
    const byArea: Record<string, number> = {};
    reports.forEach((r) => { byArea[r.team] = (byArea[r.team] || 0) + r.hoursLogged; });
    const COLORS: Record<string, string> = {
      Leadership: "#6366f1", Engineering: "#10b981", "AI/ML": "#a855f7",
      Clinical: "#ef4444", Design: "#ec4899", Advisory: "#f59e0b", Legal: "#94a3b8",
    };
    return Object.entries(byArea).map(([name, size]) => ({ name, size, fill: COLORS[name] || "#94a3b8" }));
  }, [reports]);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Layers className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Hours Investment by Workstream
      </h3>
      <div style={{ height: 260 }}>
        <ResponsiveContainer>
          <Treemap data={data} dataKey="size" stroke="#fff" content={<TreemapNode />} />
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface TreemapNodeProps {
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  fill?: string;
}
function TreemapNode(props: TreemapNodeProps) {
  const { depth = 0, x = 0, y = 0, width = 0, height = 0, name = "", size = 0, fill = "#94a3b8" } = props;
  if (depth === 0) return null;
  const showLabel = width > 60 && height > 40;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill, stroke: "#fff", strokeWidth: 2, fillOpacity: 0.85 }} />
      {showLabel && (
        <>
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={11} fontWeight={600}>{name}</text>
          <text x={x + 8} y={y + 33} fill="#fff" fontSize={10} fillOpacity={0.85}>{size}h</text>
        </>
      )}
    </g>
  );
}

// ─── Self-Eval Distribution Stacked Bar ─────────────────
function EvalDistribution({ reports }: { reports: TeamReport[] }) {
  const data = useMemo(() => {
    return EVAL_LABELS.map((l) => {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reports.forEach((r) => { counts[r.selfEval[l.key] as 1 | 2 | 3 | 4 | 5]++; });
      return {
        label: l.label.length > 16 ? l.label.slice(0, 14) + "…" : l.label,
        fullLabel: l.label,
        "1": counts[1], "2": counts[2], "3": counts[3], "4": counts[4], "5": counts[5],
      };
    });
  }, [reports]);

  const COLORS = { "1": "#ef4444", "2": "#f59e0b", "3": "#eab308", "4": "#84cc16", "5": "#10b981" };

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Sparkles className="w-4 h-4" style={{ color: "var(--primary)" }} />
          Self-Evaluation Rating Distribution
        </h3>
        <div className="flex items-center gap-2">
          {Object.entries(COLORS).map(([rating, color]) => (
            <span key={rating} className="flex items-center gap-1 text-[9px]" style={{ color: "var(--text-muted)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} /> {rating}
            </span>
          ))}
        </div>
      </div>
      <div style={{ height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 9, fill: "#64748b" }} />
            <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 9, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            {(["1", "2", "3", "4", "5"] as const).map((r) => (
              <Bar key={r} dataKey={r} stackId="a" fill={COLORS[r]} radius={r === "5" ? [0, 4, 4, 0] : r === "1" ? [4, 0, 0, 4] : 0} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Innovation Pipeline Funnel ─────────────────────────
function InnovationPipeline({ reports }: { reports: TeamReport[] }) {
  const totalIdeas = reports.reduce((s, r) => s + r.innovationIdeas, 0);
  const experiments = reports.reduce((s, r) => s + r.experimentsCompleted, 0);
  const pocs = Math.round(experiments * 0.6);
  const shipped = Math.round(pocs * 0.5);

  const data = [
    { stage: "Ideas raised", value: totalIdeas, fill: "#6366f1" },
    { stage: "Experiments started", value: experiments, fill: "#8b5cf6" },
    { stage: "POCs delivered", value: pocs, fill: "#a855f7" },
    { stage: "Shipped to roadmap", value: shipped, fill: "#10b981" },
  ];

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Lightbulb className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Innovation Pipeline (R&D Funnel)
      </h3>
      <div style={{ height: 230 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="stage" tick={{ fontSize: 9, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 9, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px]" style={{ color: "var(--text-muted)" }}>
        <span>Conversion rate</span>
        <span className="font-semibold" style={{ color: "var(--success)" }}>
          {totalIdeas > 0 ? Math.round((shipped / totalIdeas) * 100) : 0}% idea → ship
        </span>
      </div>
    </div>
  );
}

// ─── Activity Area Chart ────────────────────────────────
function ActivityArea({ allReports }: { allReports: TeamReport[] }) {
  const data = useMemo(() => {
    return REPORT_MONTHS.map((m) => {
      const monthReports = allReports.filter((r) => r.month === m);
      const meetings = monthReports.reduce((s, r) => s + r.meetingsAttended, 0);
      const blockers = monthReports.reduce((s, r) => s + r.blockersResolved, 0);
      const collabs = monthReports.reduce((s, r) => s + r.crossTeamCollabs, 0);
      const cpd = monthReports.reduce((s, r) => s + r.cpHours, 0);
      return { month: m.slice(0, 3), meetings, blockers, collabs, cpd };
    });
  }, [allReports]);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Activity className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Collaboration & Learning Activity
      </h3>
      <div style={{ height: 230 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              {[
                { id: "g1", color: "#6366f1" },
                { id: "g2", color: "#10b981" },
                { id: "g3", color: "#f59e0b" },
                { id: "g4", color: "#ec4899" },
              ].map((g) => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={g.color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={g.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Area type="monotone" dataKey="meetings" stroke="#6366f1" fill="url(#g1)" />
            <Area type="monotone" dataKey="blockers" stroke="#10b981" fill="url(#g2)" />
            <Area type="monotone" dataKey="collabs" stroke="#f59e0b" fill="url(#g3)" />
            <Area type="monotone" dataKey="cpd" stroke="#ec4899" fill="url(#g4)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Submission Status ──────────────────────────────────
function SubmissionStatus({ month, onOpenSubmit }: { month: string; onOpenSubmit: () => void }) {
  const stats = getSubmissionStats(month);
  const data = [{ name: "submitted", value: stats.rate, fill: "#10b981" }];
  const missing = stats.total - stats.submitted;

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <CheckCircle2 className="w-4 h-4" style={{ color: "var(--primary)" }} />
        {month} Submission Status
      </h3>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
          <ResponsiveContainer>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "rgba(0,0,0,0.05)" }} dataKey="value" cornerRadius={20} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-light" style={{ color: "var(--success)" }}>{stats.submitted}/{stats.total}</span>
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>submitted</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Submission Rate
          </div>
          <div className="text-2xl font-light" style={{ color: stats.rate >= 80 ? "var(--success)" : stats.rate >= 50 ? "var(--warning)" : "var(--danger)" }}>
            {stats.rate.toFixed(0)}%
          </div>
          <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
            {missing > 0 ? `${missing} member${missing === 1 ? "" : "s"} pending` : "All submitted ✓"}
          </p>
          <button
            onClick={onOpenSubmit}
            className="mt-3 w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors text-white"
            style={{ background: "var(--primary)" }}
          >
            <Upload className="w-3 h-3" /> Submit a Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero KPIs ──────────────────────────────────────────
function HeroKPIs({ reports }: { reports: TeamReport[] }) {
  const totalHours = reports.reduce((s, r) => s + r.hoursLogged, 0);
  const totalTasks = reports.reduce((s, r) => s + r.tasksCompleted, 0);
  const totalIdeas = reports.reduce((s, r) => s + r.innovationIdeas, 0);
  const teamAvg = getTeamAverage(reports);
  const submittedCount = reports.filter((r) => r.isSubmitted).length;
  const reportsWithRating = reports.filter((r) => r.overallRating > 0);
  const avgOverallRating = reportsWithRating.length > 0
    ? reportsWithRating.reduce((s, r) => s + r.overallRating, 0) / reportsWithRating.length
    : 0;

  const kpis = [
    { label: "Active reporters", value: String(reports.length), icon: Users, color: "var(--primary)", sub: `${submittedCount} user-submitted` },
    { label: "Hours logged", value: String(totalHours), icon: Clock, color: "var(--warning)", sub: `~${Math.round(totalHours / Math.max(1, reports.length))}h / person` },
    { label: "Tasks shipped", value: String(totalTasks), icon: CheckCircle2, color: "var(--success)", sub: `~${Math.round(totalTasks / Math.max(1, reports.length))} / person` },
    { label: "Ideas generated", value: String(totalIdeas), icon: Lightbulb, color: "var(--danger)", sub: "R&D contributions" },
    { label: "Avg self-eval", value: teamAvg.toFixed(2), icon: Award, color: "#a855f7", sub: "across 14 areas" },
    { label: "Overall rating", value: avgOverallRating > 0 ? avgOverallRating.toFixed(1) : "—", icon: Star, color: "#f59e0b", sub: "mean across reports" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {kpis.map((k) => (
        <div key={k.label} className="glass p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <k.icon className="w-3.5 h-3.5" style={{ color: k.color }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-light" style={{ color: k.color }}>{k.value}</span>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>{k.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Achievements (no names) ───────────────────────────
function AchievementsWall({ reports }: { reports: TeamReport[] }) {
  // Pull unique achievements only — no member name
  const items = useMemo(() => {
    const seen = new Set<string>();
    const out: { text: string; area: string }[] = [];
    for (const r of reports) {
      if (r.keyAchievement && r.keyAchievement !== "—" && !seen.has(r.keyAchievement)) {
        seen.add(r.keyAchievement);
        out.push({ text: r.keyAchievement, area: r.team });
      }
    }
    return out.slice(0, 8);
  }, [reports]);

  const AREA_COLORS: Record<string, string> = {
    Leadership: "#6366f1", Engineering: "#10b981", "AI/ML": "#a855f7",
    Clinical: "#ef4444", Design: "#ec4899", Advisory: "#f59e0b",
    Product: "#f97316", Operations: "#06b6d4",
  };

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Trophy className="w-4 h-4" style={{ color: "var(--warning)" }} />
        Key Achievements This Month
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((a, i) => (
          <div key={i} className="p-3 rounded-lg flex items-start gap-2.5" style={{ background: (AREA_COLORS[a.area] || "#94a3b8") + "0d", border: `1px solid ${(AREA_COLORS[a.area] || "#94a3b8")}22` }}>
            <div className="w-1 h-full rounded-full self-stretch shrink-0" style={{ background: AREA_COLORS[a.area] || "#94a3b8", minHeight: 28 }} />
            <div className="flex-1">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: AREA_COLORS[a.area] || "#94a3b8" }}>{a.area}</span>
              <p className="text-xs leading-snug mt-0.5" style={{ color: "var(--text-main)" }}>{a.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OKR x Category Heatmap ─────────────────────────────
function CategoryByOKR({ reports }: { reports: TeamReport[] }) {
  const data = useMemo(() => {
    return EVAL_LABELS.map((l) => {
      const avg = reports.reduce((s, r) => s + r.selfEval[l.key], 0) / Math.max(1, reports.length);
      return { name: l.label, value: Number(avg.toFixed(2)), okr: l.okr, fill: l.color };
    }).sort((a, b) => b.value - a.value);
  }, [reports]);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <Layers className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Capability Strength by OKR
      </h3>
      <div style={{ height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 5, bottom: 5 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 9, fill: "#64748b" }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 9, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Wellbeing Trend ────────────────────────────────────
function WellbeingTrend({ allReports }: { allReports: TeamReport[] }) {
  const data = useMemo(() => {
    return REPORT_MONTHS.map((m) => {
      const month = allReports.filter((r) => r.month === m && r.wellbeingScore > 0);
      const avg = month.length > 0 ? month.reduce((s, r) => s + r.wellbeingScore, 0) / month.length : 0;
      const min = month.length > 0 ? Math.min(...month.map((r) => r.wellbeingScore)) : 0;
      const max = month.length > 0 ? Math.max(...month.map((r) => r.wellbeingScore)) : 0;
      return { month: m.slice(0, 3), avg: Number(avg.toFixed(1)), min, max };
    });
  }, [allReports]);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <HeartHandshake className="w-4 h-4" style={{ color: "#ec4899" }} />
        Team Wellbeing Trend
      </h3>
      <div style={{ height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis domain={[1, 5]} tick={{ fontSize: 10, fill: "#64748b" }} ticks={[1, 2, 3, 4, 5]} />
            <Tooltip content={<GlassTooltip />} />
            <Area type="monotone" dataKey="max" stroke="transparent" fill="rgba(236,72,153,0.05)" />
            <Area type="monotone" dataKey="min" stroke="transparent" fill="rgba(236,72,153,0.05)" />
            <Line type="monotone" dataKey="avg" name="Avg wellbeing" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
        Monthly mean wellbeing (1-5). Range bands show min-max spread.
      </p>
    </div>
  );
}

// ─── Team Priorities ────────────────────────────────────
function PrioritiesCloud({ reports }: { reports: TeamReport[] }) {
  const items = useMemo(() => {
    const seen = new Set<string>();
    const out: { text: string; area: string }[] = [];
    for (const r of reports) {
      for (const p of r.priorities || []) {
        const trimmed = p.trim();
        if (trimmed && !seen.has(trimmed)) {
          seen.add(trimmed);
          out.push({ text: trimmed, area: r.team });
        }
      }
    }
    return out;
  }, [reports]);

  const AREA_COLORS: Record<string, string> = {
    Leadership: "#6366f1", Engineering: "#10b981", "AI/ML": "#a855f7",
    Clinical: "#ef4444", Design: "#ec4899", Advisory: "#f59e0b",
    Product: "#f97316", Operations: "#06b6d4",
  };

  if (items.length === 0) return null;

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <ListChecks className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Next Month Priorities
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((p, i) => (
          <span
            key={i}
            className="px-3 py-1.5 rounded-full text-[10px] font-medium leading-relaxed"
            style={{
              background: (AREA_COLORS[p.area] || "#94a3b8") + "12",
              color: AREA_COLORS[p.area] || "#64748b",
              border: `1px solid ${(AREA_COLORS[p.area] || "#94a3b8")}28`,
            }}
          >
            {p.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Cumulative Submission Tracker ─────────────────────
function CumulativeProgress({ allReports }: { allReports: TeamReport[] }) {
  const data = useMemo(() => {
    let cumulativeHours = 0, cumulativeTasks = 0, cumulativeIdeas = 0;
    return REPORT_MONTHS.map((m) => {
      const month = allReports.filter((r) => r.month === m);
      cumulativeHours += month.reduce((s, r) => s + r.hoursLogged, 0);
      cumulativeTasks += month.reduce((s, r) => s + r.tasksCompleted, 0);
      cumulativeIdeas += month.reduce((s, r) => s + r.innovationIdeas, 0);
      return { month: m.slice(0, 3), hours: cumulativeHours, tasks: cumulativeTasks, ideas: cumulativeIdeas };
    });
  }, [allReports]);

  return (
    <div className="glass p-5">
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
        <TrendingUp className="w-4 h-4" style={{ color: "var(--primary)" }} />
        Cumulative Team Output
      </h3>
      <div style={{ height: 230 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#64748b" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#64748b" }} />
            <Tooltip content={<GlassTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line yAxisId="left" type="monotone" dataKey="hours" name="Hours (cum)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
            <Line yAxisId="left" type="monotone" dataKey="tasks" name="Tasks (cum)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="ideas" name="Ideas (cum)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Reports Page ──────────────────────────────────
interface ReportsPageProps {
  data: DataStoreShape;
}

export default function ReportsPage({ data }: ReportsPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(REPORT_MONTHS[REPORT_MONTHS.length - 1]);

  // Re-fetch on any submission changes
  useEffect(() => {
    return onReportsChange(() => setRefreshKey((k) => k + 1));
  }, []);

  const allReports = useMemo(() => getAllReports(), [refreshKey]);
  const filteredReports = useMemo(() => allReports.filter((r) => r.month === selectedMonth), [allReports, selectedMonth]);
  const previousMonth = REPORT_MONTHS[Math.max(0, REPORT_MONTHS.indexOf(selectedMonth) - 1)];
  const previousReports = useMemo(() => allReports.filter((r) => r.month === previousMonth), [allReports, previousMonth]);

  // OKR data from main store
  const okrMap = useMemo(() => {
    const map: Record<string, { id: string; objective: string; keyResults: string[] }> = {};
    for (const o of data.okrs) {
      map[o.id] = { id: o.id, objective: o.objective, keyResults: o.keyResults };
    }
    return map;
  }, [data.okrs]);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight" style={{ color: "var(--text-main)" }}>Monthly Reports</h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Team performance, capability pulse & OKR contribution — {selectedMonth} {filteredReports[0]?.year ?? "2026"}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-lg p-1" style={{ background: "rgba(0,0,0,0.04)" }}>
            {REPORT_MONTHS.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={{
                  background: selectedMonth === m ? "var(--primary)" : "transparent",
                  color: selectedMonth === m ? "#fff" : "var(--text-main)",
                }}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSubmit(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors text-white shadow-md hover:shadow-lg"
            style={{ background: "var(--primary)" }}
          >
            <Upload className="w-3.5 h-3.5" /> Submit Report
          </button>
        </div>
      </div>

      {/* Hero KPIs */}
      <HeroKPIs reports={filteredReports} />

      {/* OKR Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>OKR Contribution Pulse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <OKRCard okr="O1" reports={filteredReports} okrData={okrMap.O1} />
          <OKRCard okr="O2" reports={filteredReports} okrData={okrMap.O2} />
          <OKRCard okr="O3" reports={filteredReports} okrData={okrMap.O3} />
          <OKRCard okr="TEAM" reports={filteredReports} />
        </div>
      </div>

      {/* Radar + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <TeamPulseRadar reports={filteredReports} previousReports={previousReports} />
        <MonthlyTrend allReports={allReports} />
      </div>

      {/* Modules + Hours Treemap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ModulesDonut reports={filteredReports} />
        <HoursTreemap reports={filteredReports} />
      </div>

      {/* Eval Distribution + Capability by OKR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <EvalDistribution reports={filteredReports} />
        <CategoryByOKR reports={filteredReports} />
      </div>

      {/* Innovation + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InnovationPipeline reports={filteredReports} />
        <ActivityArea allReports={allReports} />
      </div>

      {/* Cumulative + Submission Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <CumulativeProgress allReports={allReports} />
        </div>
        <SubmissionStatus month={selectedMonth} onOpenSubmit={() => setShowSubmit(true)} />
      </div>

      {/* Wellbeing & Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <WellbeingTrend allReports={allReports} />
        <PrioritiesCloud reports={filteredReports} />
      </div>

      {/* Achievements */}
      <AchievementsWall reports={filteredReports} />

      {/* Team Roster (compact, no individual metrics) */}
      <div className="glass p-5">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-main)" }}>
          <Users className="w-4 h-4" style={{ color: "var(--primary)" }} />
          Reporting Team
          <span className="text-[10px] font-normal ml-1" style={{ color: "var(--text-muted)" }}>({TEAM_ROSTER.length} members)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {TEAM_ROSTER.map((m) => {
            const hasSubmitted = filteredReports.find((r) => r.memberId === m.id)?.isSubmitted;
            return (
              <div key={m.id} className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "rgba(0,0,0,0.03)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "rgba(99,102,241,0.12)", color: "var(--primary)" }}>
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold truncate" style={{ color: "var(--text-main)" }}>{m.shortName}</p>
                  <p className="text-[9px] truncate" style={{ color: "var(--text-muted)" }}>{m.area}</p>
                </div>
                {hasSubmitted && <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "var(--success)" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {showSubmit && (
        <SubmitReportModal
          onClose={() => setShowSubmit(false)}
          onSubmitted={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
