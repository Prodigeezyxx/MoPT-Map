import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function RisksPage() {
  const [risks, setRisks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/risks")
      .then(r => r.json())
      .then(data => {
        setRisks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading risks...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Risk Register</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Contingency Plans & Active Threats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((risk) => (
          <div key={risk.id} className="glass p-6" style={{ borderTop: `4px solid ${risk.score >= 15 ? 'var(--danger)' : risk.score >= 12 ? 'var(--warning)' : 'var(--primary)'}` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{
                  background: risk.score >= 15 ? 'rgba(239, 68, 68, 0.15)' : risk.score >= 12 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  borderColor: risk.score >= 15 ? 'var(--danger)' : risk.score >= 12 ? 'var(--warning)' : 'var(--primary)',
                  color: risk.score >= 15 ? 'var(--danger)' : risk.score >= 12 ? 'var(--warning)' : 'var(--primary)'
                }}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{risk.id} • {risk.category}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Owner: {risk.owner}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Score</span>
                <span className="text-lg font-mono font-bold leading-none mt-1" style={{ 
                  color: risk.score >= 15 ? 'var(--danger)' : risk.score >= 12 ? 'var(--warning)' : 'var(--primary)' 
                }}>{risk.score}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>The Risk</p>
                <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text-main)' }}>{risk.risk}</p>
              </div>
              
              <div className="rounded-lg p-4" style={{ background: 'rgba(255, 255, 255, 0.4)', border: '1px solid var(--glass-border)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Mitigation Strategy</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-main)' }}>{risk.mitigation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
