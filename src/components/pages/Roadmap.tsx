export default function RoadmapPage() {
  const roadmapData = {
    now: [
      "VR + LMS round-trip",
      "Device Auth flow",
      "Neonatal resus v1",
      "Chat MoPT debrief",
      "DPIA + Hazard Log",
      "KCL Private Beta"
    ],
    next: [
      "Instructor dashboards",
      "Cohort analytics",
      "Scenario authoring v1",
      "2nd + 3rd modules",
      "SSO (SAML/OIDC) for institutions",
      "Self-serve billing"
    ],
    later: [
      "Multi-specialty library",
      "International (Nigeria, UAE)",
      "Pico/Vision Pro support",
      "Peer-reviewed outcome study",
      "ISO 27001 certification",
      "Scenario marketplace for SMEs"
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-main)' }}>Roadmap</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Now / Next / Later Execution Plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--danger)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Now</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-muted)' }}>0-3 mo</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.now.map((item, idx) => (
              <li key={idx} className="glass p-4 text-sm font-medium" style={{ borderLeft: '4px solid var(--danger)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--warning)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Next</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-muted)' }}>3-6 mo</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.next.map((item, idx) => (
              <li key={idx} className="glass p-4 text-sm font-medium" style={{ borderLeft: '4px solid var(--warning)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: 'var(--primary)' }}>
            <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: 'var(--text-main)' }}>Later</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.4)', color: 'var(--text-muted)' }}>6-18 mo</span>
          </div>
          <ul className="space-y-3">
            {roadmapData.later.map((item, idx) => (
              <li key={idx} className="glass p-4 text-sm font-medium" style={{ opacity: 0.8, borderLeft: '4px solid var(--primary)' }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
