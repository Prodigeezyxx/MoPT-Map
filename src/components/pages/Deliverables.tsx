import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/deliverables")
      .then(r => r.json())
      .then(data => {
        setDeliverables(data);
        setLoading(false);
      });
  }, []);

  const filtered = filter === "All" ? deliverables : deliverables.filter(d => d.stream === filter);

  if (loading) return <div className="text-sm text-gray-500">Loading deliverables...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Deliverables</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Master 47-Deliverables Tracker</p>
        </div>
        
        <div className="flex gap-2">
          {["All", "VR", "Web", "LMS"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="glass px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                background: filter === f ? 'var(--primary)' : 'var(--glass-bg)',
                color: filter === f ? 'white' : 'var(--text-main)',
                border: filter === f ? '1px solid transparent' : '1px solid var(--glass-border)'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass overflow-hidden border-0" style={{ padding: '0' }}>
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead style={{ background: 'rgba(255,255,255,0.4)', borderBottom: '1px solid var(--glass-border)' }}>
              <tr>
                <th className="px-6 py-4 font-semibold" style={{ color: 'var(--text-main)' }}>ID</th>
                <th className="px-6 py-4 font-semibold w-full" style={{ color: 'var(--text-main)' }}>Title</th>
                <th className="px-6 py-4 font-semibold" style={{ color: 'var(--text-main)' }}>Owner</th>
                <th className="px-6 py-4 font-semibold text-center" style={{ color: 'var(--text-main)' }}>Priority</th>
                <th className="px-6 py-4 font-semibold text-center" style={{ color: 'var(--text-main)' }}>Sprint</th>
                <th className="px-6 py-4 font-semibold" style={{ color: 'var(--text-main)' }}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--glass-border)' }}>
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-white/20 transition-colors" style={{ borderBottomColor: 'var(--glass-border)' }}>
                  <td className="px-6 py-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                  <td className="px-6 py-4 font-medium truncate max-w-[300px]" title={item.title} style={{ color: 'var(--text-main)' }}>
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>{item.owner}</td>
                  <td className="px-6 py-4 text-center">
                    <span 
                      className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded text-white text-center min-w-[36px]"
                      style={{ background: item.priority === "P0" ? 'var(--danger)' : item.priority === "P1" ? 'var(--warning)' : 'var(--primary)' }}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.sprint}</td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        background: item.status === "Done" ? 'rgba(16, 185, 129, 0.15)' :
                                   item.status === "In Build" ? 'rgba(99, 102, 241, 0.15)' :
                                   item.status === "In Spec" ? 'rgba(245, 158, 11, 0.15)' :
                                   'rgba(100, 116, 139, 0.15)',
                        color: item.status === "Done" ? '#065f46' :
                               item.status === "In Build" ? '#3730a3' :
                               item.status === "In Spec" ? '#92400e' :
                               '#1e293b'
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
