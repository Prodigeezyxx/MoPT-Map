import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { DataStoreShape } from "../../lib/dataStore";

interface DeliverablesPageProps {
  data: DataStoreShape;
}

export default function DeliverablesPage({ data }: DeliverablesPageProps) {
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const deliverables = data.deliverables;
  const filtered = filter === "All" ? deliverables : deliverables.filter(d => d.stream === filter);

  const counts = {
    all: deliverables.length,
    vr: deliverables.filter(d => d.stream === "VR").length,
    web: deliverables.filter(d => d.stream === "Web").length,
    lms: deliverables.filter(d => d.stream === "LMS").length,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Deliverables</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Master {deliverables.length}-Deliverables Tracker — Click any row for details</p>
        </div>
        
        <div className="flex gap-2">
          {[
            { key: "All", count: counts.all },
            { key: "VR", count: counts.vr },
            { key: "Web", count: counts.web },
            { key: "LMS", count: counts.lms },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: filter === f.key ? 'var(--primary)' : 'var(--glass-bg)',
                color: filter === f.key ? 'white' : 'var(--text-main)',
                border: filter === f.key ? '1px solid transparent' : '1px solid var(--glass-border)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {f.key} <span className="opacity-70">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Done", count: filtered.filter(d => d.status === "Done").length, color: "var(--success)" },
          { label: "In Build", count: filtered.filter(d => d.status === "In Build").length, color: "var(--primary)" },
          { label: "In Spec", count: filtered.filter(d => d.status === "In Spec").length, color: "var(--warning)" },
          { label: "Not Started", count: filtered.filter(d => d.status === "Not Started" || d.status === "In Discovery").length, color: "var(--text-muted)" },
        ].map(s => (
          <div key={s.label} className="glass p-3 flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ background: s.color }}></div>
            <div>
              <span className="text-xl font-light" style={{ color: 'var(--text-main)' }}>{s.count}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass overflow-hidden" style={{ padding: '0' }}>
        <div style={{ maxHeight: 'calc(100vh - 340px)', overflowY: 'auto' }}>
          <table className="w-full text-left text-sm">
            <thead style={{ background: 'rgba(255,255,255,0.4)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th className="px-4 py-3 font-semibold w-8" style={{ color: 'var(--text-main)' }}></th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--text-main)' }}>ID</th>
                <th className="px-4 py-3 font-semibold w-full" style={{ color: 'var(--text-main)' }}>Title</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--text-main)' }}>Owner</th>
                <th className="px-4 py-3 font-semibold text-center" style={{ color: 'var(--text-main)' }}>Priority</th>
                <th className="px-4 py-3 font-semibold text-center" style={{ color: 'var(--text-main)' }}>Sprint</th>
                <th className="px-4 py-3 font-semibold" style={{ color: 'var(--text-main)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="cursor-pointer transition-colors hover:bg-white/30 group"
                    style={{ borderBottom: '1px solid var(--glass-border)' }}
                  >
                    <td className="px-4 py-3" colSpan={isExpanded ? 7 : undefined}>
                      {isExpanded ? (
                        <div className="animate-in fade-in duration-200">
                          <div className="flex items-start gap-4 mb-3">
                            <ChevronDown className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>{item.id}</span>
                                <span
                                  className="inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded text-white"
                                  style={{ background: item.priority === "P0" ? 'var(--danger)' : item.priority === "P1" ? 'var(--warning)' : 'var(--primary)' }}
                                >{item.priority}</span>
                                <span
                                  className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium"
                                  style={{
                                    background: item.status === "Done" ? 'rgba(16,185,129,0.15)' :
                                               item.status === "In Build" ? 'rgba(99,102,241,0.15)' :
                                               item.status === "In Spec" ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
                                    color: item.status === "Done" ? '#065f46' :
                                           item.status === "In Build" ? '#3730a3' :
                                           item.status === "In Spec" ? '#92400e' : '#1e293b'
                                  }}
                                >{item.status}</span>
                              </div>
                              <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-main)' }}>{item.title}</h4>
                              <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                              <div className="flex gap-4 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                <span><strong>Owner:</strong> {item.owner}</span>
                                <span><strong>Sprint:</strong> {item.sprint}</span>
                                <span><strong>Stream:</strong> {item.stream}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </td>
                    {!isExpanded && (
                      <>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.id}</td>
                        <td className="px-4 py-3 font-medium max-w-[300px]" style={{ color: 'var(--text-main)' }}>
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--primary)' }} />
                            <span className="truncate" title={item.title}>{item.title}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{item.owner}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded text-white min-w-[36px]"
                            style={{ background: item.priority === "P0" ? 'var(--danger)' : item.priority === "P1" ? 'var(--warning)' : 'var(--primary)' }}
                          >{item.priority}</span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{item.sprint}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                            style={{
                              background: item.status === "Done" ? 'rgba(16,185,129,0.15)' :
                                         item.status === "In Build" ? 'rgba(99,102,241,0.15)' :
                                         item.status === "In Spec" ? 'rgba(245,158,11,0.15)' : 'rgba(100,116,139,0.15)',
                              color: item.status === "Done" ? '#065f46' :
                                     item.status === "In Build" ? '#3730a3' :
                                     item.status === "In Spec" ? '#92400e' : '#1e293b'
                            }}
                          >{item.status}</span>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
