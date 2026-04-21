import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import type { DataStoreShape, RoadmapItem } from "../../lib/dataStore";

function RoadmapCard({ item, color }: { item: RoadmapItem; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <li
        onClick={() => setOpen(true)}
        className="glass p-4 text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] group"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-main)' }}>{item.title}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
        </div>
        <p className="text-[11px] mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }}>
          Click for details
        </p>
      </li>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div className="glass p-8 max-w-lg w-full relative animate-in fade-in zoom-in duration-200" style={{ borderTop: `4px solid ${color}` }}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
            <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-main)" }}>{item.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

interface RoadmapPageProps {
  data: DataStoreShape;
}

export default function RoadmapPage({ data }: RoadmapPageProps) {
  const roadmapData = data.roadmap;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Roadmap</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Now / Next / Later Execution Plan — Click any item for details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--danger)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Now</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>0-3 mo</span>
            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{roadmapData.now.length} items</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.now.map((item, idx) => (
              <RoadmapCard key={idx} item={item} color="var(--danger)" />
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--warning)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Next</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)' }}>3-6 mo</span>
            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{roadmapData.next.length} items</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.next.map((item, idx) => (
              <RoadmapCard key={idx} item={item} color="var(--warning)" />
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--primary)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Later</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>6-18 mo</span>
            <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>{roadmapData.later.length} items</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.later.map((item, idx) => (
              <RoadmapCard key={idx} item={item} color="var(--primary)" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
