import { useState } from "react";
import { CheckCircle2, CircleDashed, Users, Target, TrendingUp, Clock, Shield, Zap, ChevronRight, X, Activity, Gauge } from "lucide-react";
import type { DataStoreShape } from "../../lib/dataStore";

// ─── Icon Map for KPIs ──────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Gauge, Activity, Zap, TrendingUp, CheckCircle2, Users, Shield,
};

interface CardModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

function CardModal({ title, description, onClose }: CardModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="glass p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200" style={{ borderTop: "4px solid var(--primary)" }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/30 transition-colors">
          <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </button>
        <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-main)" }}>{title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
    </div>
  );
}

interface ClickableCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

function ClickableCard({ children, title, description, className = "", style }: ClickableCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`glass p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group ${className}`}
        style={style}
      >
        {children}
        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-medium" style={{ color: "var(--primary)" }}>
          Click for details <ChevronRight className="w-3 h-3" />
        </div>
      </div>
      {open && <CardModal title={title} description={description} onClose={() => setOpen(false)} />}
    </>
  );
}

interface DashboardPageProps {
  data: DataStoreShape;
}

export default function DashboardPage({ data }: DashboardPageProps) {
  const summary = {
    total: data.deliverables.length,
    vr: data.deliverables.filter(d => d.stream === "VR").length,
    web: data.deliverables.filter(d => d.stream === "Web").length,
    lms: data.deliverables.filter(d => d.stream === "LMS").length,
    inBuild: data.deliverables.filter(d => d.status === "In Build").length,
    inSpec: data.deliverables.filter(d => d.status === "In Spec").length,
    done: data.deliverables.filter(d => d.status === "Done").length,
    notStarted: data.deliverables.filter(d => d.status === "Not Started").length,
    p0: data.deliverables.filter(d => d.priority === "P0").length,
    p1: data.deliverables.filter(d => d.priority === "P1").length,
    p2: data.deliverables.filter(d => d.priority === "P2").length,
    highRisks: data.risks.filter((r) => r.score >= 15).length,
    medRisks: data.risks.filter((r) => r.score >= 10 && r.score < 15).length,
  };

  const completionPct = summary.total > 0 ? Math.round((summary.done / summary.total) * 100) : 0;
  const inProgressPct = summary.total > 0 ? Math.round((summary.inBuild / summary.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Version 2.0 — The World-Class Edition</p>
      </div>

      {/* Row 1: Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ClickableCard
          title="Total Deliverables"
          description={`${summary.total} deliverables mapped across 3 workstreams: ${summary.vr} VR items, ${summary.web} Web items, and ${summary.lms} LMS integration items.`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Deliverables</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>{summary.total}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Mapped</span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1"><CircleDashed className="w-3 h-3" /> {summary.vr} VR</span>
            <span className="flex items-center gap-1"><CircleDashed className="w-3 h-3" /> {summary.web} Web</span>
            <span className="flex items-center gap-1"><CircleDashed className="w-3 h-3" /> {summary.lms} LMS</span>
          </div>
        </ClickableCard>

        <ClickableCard
          title="Sprint Progress"
          description={`Currently ${summary.inBuild} items are actively being built, ${summary.inSpec} are in specification phase, and ${summary.done} have been completed. ${summary.notStarted} items haven't started yet.`}
          style={{ borderLeft: '4px solid var(--primary)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sprint Progress</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>{summary.inBuild}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>In Build</span>
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1" style={{ color: 'var(--success)' }}><CheckCircle2 className="w-3 h-3" /> {summary.done} Done</span>
            <span className="flex items-center gap-1" style={{ color: 'var(--warning)' }}><Clock className="w-3 h-3" /> {summary.inSpec} In Spec</span>
          </div>
        </ClickableCard>

        <ClickableCard
          title="Priority Breakdown"
          description={`${summary.p0} P0 (must-have for beta), ${summary.p1} P1 (important but can follow), ${summary.p2} P2 (deferred post-beta).`}
          style={{ borderLeft: '4px solid var(--danger)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Priority Breakdown</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light" style={{ color: 'var(--danger)' }}>{summary.p0}</span>
              <span className="text-[10px] font-bold" style={{ color: 'var(--danger)' }}>P0</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light" style={{ color: 'var(--warning)' }}>{summary.p1}</span>
              <span className="text-[10px] font-bold" style={{ color: 'var(--warning)' }}>P1</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light" style={{ color: 'var(--primary)' }}>{summary.p2}</span>
              <span className="text-[10px] font-bold" style={{ color: 'var(--primary)' }}>P2</span>
            </div>
          </div>
          <div className="mt-4 w-full h-2 rounded-full overflow-hidden flex" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div style={{ width: `${summary.total > 0 ? (summary.p0/summary.total)*100 : 0}%`, background: 'var(--danger)' }}></div>
            <div style={{ width: `${summary.total > 0 ? (summary.p1/summary.total)*100 : 0}%`, background: 'var(--warning)' }}></div>
            <div style={{ width: `${summary.total > 0 ? (summary.p2/summary.total)*100 : 0}%`, background: 'var(--primary)' }}></div>
          </div>
        </ClickableCard>

        <ClickableCard
          title="North Star Metric"
          description="Weekly Competency-Minutes per Active Learner (W-CM/AL): the sum of VR minutes weighted by competency gain, averaged across active learners per week. Target: ≥45 min/learner/week."
          style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>North Star Metric</p>
          <div className="mt-3 flex flex-col gap-1">
            <span className="text-lg font-medium tracking-tight" style={{ color: 'var(--text-main)' }}>W-CM/AL</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Competency-Mins per Learner</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <Target className="w-3.5 h-3.5" /> Target: ≥45 min/wk
          </div>
        </ClickableCard>
      </div>

      {/* Row 2: Risk Overview + Completion + Team */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClickableCard
          title="Risk Overview"
          description={`${summary.highRisks} critical risks (score ≥15) need immediate attention. ${summary.medRisks} moderate risks (score 10-14) are being actively monitored.`}
          style={{ borderTop: '4px solid var(--danger)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Risk Overview</p>
          <div className="mt-3 flex items-center gap-6">
            <div className="text-center">
              <span className="text-3xl font-light" style={{ color: 'var(--danger)' }}>{summary.highRisks}</span>
              <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--danger)' }}>Critical</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-light" style={{ color: 'var(--warning)' }}>{summary.medRisks}</span>
              <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--warning)' }}>Moderate</p>
            </div>
            <div className="text-center">
              <span className="text-3xl font-light" style={{ color: 'var(--success)' }}>{data.risks.length - summary.highRisks - summary.medRisks}</span>
              <p className="text-[10px] font-bold uppercase mt-1" style={{ color: 'var(--success)' }}>Low</p>
            </div>
          </div>
          <div className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            {data.risks.length} total risks tracked
          </div>
        </ClickableCard>

        <ClickableCard
          title="Completion Tracker"
          description={`Overall completion is at ${completionPct}% with ${summary.done} of ${summary.total} deliverables completed. ${inProgressPct}% (${summary.inBuild} items) are actively being built.`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Completion Tracker</p>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light" style={{ color: 'var(--text-main)' }}>{completionPct}%</span>
              <span className="text-sm" style={{ color: 'var(--success)' }}>complete</span>
            </div>
            <div className="mt-3 w-full h-3 rounded-full overflow-hidden flex gap-0.5" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div className="rounded-full transition-all duration-700" style={{ width: `${completionPct}%`, background: 'var(--success)' }}></div>
              <div className="rounded-full transition-all duration-700" style={{ width: `${inProgressPct}%`, background: 'var(--primary)' }}></div>
            </div>
            <div className="mt-2 flex gap-4 text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }}></span> Done</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }}></span> In Build</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }}></span> Remaining</span>
            </div>
          </div>
        </ClickableCard>

        <ClickableCard
          title="Team Overview"
          description={`The team has ${data.team.length} members across multiple functional areas.`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Team Overview</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-light" style={{ color: 'var(--text-main)' }}>{data.team.length}</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Members</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Leadership", "VR", "Engineering", "AI/ML", "Clinical"].map(area => {
              const count = data.team.filter((t) => t.area === area).length;
              if (!count) return null;
              return (
                <span key={area} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
                  {area} ({count})
                </span>
              );
            })}
          </div>
        </ClickableCard>
      </div>

      {/* Row 3: Sprint Timeline */}
      <div>
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-main)' }}>Sprint Plan to Beta</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {data.sprints.map((sprint, i: number) => (
            <ClickableCard
              key={sprint.sprint}
              title={`Sprint ${sprint.sprint}: ${sprint.theme}`}
              description={`Deliverables: ${sprint.deliverables}\n\nExit Criteria: ${sprint.exit}`}
              className="!p-4"
              style={{ borderTop: `3px solid ${i === 0 ? 'var(--danger)' : i < 3 ? 'var(--warning)' : 'var(--primary)'}` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{sprint.weeks}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>S{sprint.sprint}</span>
              </div>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--text-main)' }}>{sprint.theme}</h4>
              <p className="text-[11px] mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{sprint.deliverables}</p>
            </ClickableCard>
          ))}
        </div>
      </div>

      {/* Row 4: OKRs */}
      <div>
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-main)' }}>Annual OKRs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.okrs.map((okr, index: number) => (
            <ClickableCard
              key={okr.id}
              title={`${okr.id}: ${okr.objective}`}
              description={`Key Results:\n${okr.keyResults.map((kr: string, i: number) => `${i+1}. ${kr}`).join('\n')}\n\nOwner: ${okr.owner}`}
              style={{ borderLeft: `4px solid ${index % 3 === 0 ? 'var(--danger)' : index % 3 === 1 ? 'var(--warning)' : 'var(--primary)'}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.7)', color: 'var(--text-main)' }}>
                  {okr.id}
                </span>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Users className="w-3 h-3" />
                  {okr.owner}
                </span>
              </div>
              <h4 className="text-sm font-semibold mb-4 leading-snug" style={{ color: 'var(--text-main)' }}>{okr.objective}</h4>
              <ul className="space-y-2 mt-auto">
                {okr.keyResults.map((kr: string, idx: number) => (
                  <li key={idx} className="text-xs flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-mono mt-0.5 opacity-50">-</span>
                    <span className="leading-relaxed">{kr}</span>
                  </li>
                ))}
              </ul>
            </ClickableCard>
          ))}
        </div>
      </div>

      {/* Row 5: Key Metrics Grid */}
      <div>
        <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-main)' }}>Key Performance Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.kpis.map((metric) => {
            const IconComponent = ICON_MAP[metric.icon] || Gauge;
            return (
              <ClickableCard
                key={metric.label}
                title={metric.label}
                description={`Target: ${metric.value}${metric.unit ? ' ' + metric.unit : ''}. ${metric.target}. This is one of MoPT's guardrail metrics.`}
                className="!p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className="w-3.5 h-3.5" style={{ color: metric.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{metric.label}</span>
                </div>
                <span className="text-xl font-light" style={{ color: metric.color }}>{metric.value}</span>
                <span className="text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>{metric.unit}</span>
              </ClickableCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
