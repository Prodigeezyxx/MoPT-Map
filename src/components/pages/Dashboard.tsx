import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, Users, Target } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<{ deliverables: any[], okrs: any[] }>({ deliverables: [], okrs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/deliverables").then(r => r.json()),
      fetch("/api/okrs").then(r => r.json())
    ]).then(([deliverables, okrs]) => {
      setData({ deliverables, okrs });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading dashboard...</div>;

  const summary = {
    total: 47, // From the pdf
    vr: data.deliverables.filter(d => d.stream === "VR").length,
    web: data.deliverables.filter(d => d.stream === "Web").length,
    lms: data.deliverables.filter(d => d.stream === "LMS").length,
    inBuild: data.deliverables.filter(d => d.status === "In Build").length,
    done: data.deliverables.filter(d => d.status === "Done").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Version 2.0 - The World-Class Edition</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 flex flex-col justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Deliverables Tracker</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>47</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Mapped</span>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5"><CircleDashed className="w-3.5 h-3.5" /> 27 VR</div>
            <div className="flex items-center gap-1.5"><CircleDashed className="w-3.5 h-3.5" /> 13 Web</div>
            <div className="flex items-center gap-1.5"><CircleDashed className="w-3.5 h-3.5" /> 7 LMS</div>
          </div>
        </div>

        <div className="glass p-6 flex flex-col justify-between" style={{ borderLeft: '4px solid var(--primary)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Current Sprint Focus</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-light tracking-tighter" style={{ color: 'var(--text-main)' }}>{summary.inBuild}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>In Build</span>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-medium" style={{ color: 'var(--success)' }}>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {summary.done} Completed</div>
          </div>
        </div>

        <div className="glass p-6 flex flex-col justify-between" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--primary)' }}>North Star Metric</p>
          <div className="mt-4 flex flex-col gap-1">
            <span className="text-2xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Weekly Competency-Mins per Active Learner</span>
          </div>
          <div className="mt-6 flex items-center justify-between text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Target: ≥45 min/wk</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-medium mb-6" style={{ color: 'var(--text-main)' }}>Annual OKRs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.okrs.map((okr, index) => (
            <div key={okr.id} className="glass p-6 flex flex-col" style={{ borderLeft: `4px solid ${index % 3 === 0 ? 'var(--danger)' : index % 3 === 1 ? 'var(--warning)' : 'var(--primary)'}` }}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
