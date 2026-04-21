import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  Shield,
  Rocket,
  Users,
  BarChart3,
  AlertTriangle,
  Star,
  ArrowUp,
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface TocEntry {
  id: string;
  label: string;
  level: number;
  icon?: React.ElementType;
  children?: TocEntry[];
}

// â”€â”€â”€ Table of Contents Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TOC: TocEntry[] = [
  {
    id: "executive-summary",
    label: "Executive Summary",
    level: 0,
    icon: BookOpen,
  },
  {
    id: "non-negotiables",
    label: "12 Non-Negotiables",
    level: 0,
    icon: Shield,
  },
  {
    id: "part-i",
    label: "Part I â€” Foundations",
    level: 0,
    icon: FileText,
    children: [
      { id: "sec-1", label: "1. PM Operating Philosophy", level: 1 },
      { id: "sec-2", label: "2. 30/60/90 Day Onboarding", level: 1 },
      { id: "sec-3", label: "3. Vision, Strategy & North Star", level: 1 },
    ],
  },
  {
    id: "part-ii",
    label: "Part II â€” Discovery & Validation",
    level: 0,
    icon: FileText,
    children: [
      { id: "sec-4", label: "4. Discovery Framework", level: 1 },
      { id: "sec-5", label: "5. Learning Science", level: 1 },
      { id: "sec-6", label: "6. Clinical Scenario Design", level: 1 },
    ],
  },
  {
    id: "part-iii",
    label: "Part III â€” PRDs",
    level: 0,
    icon: FileText,
    children: [
      { id: "sec-7", label: "7. PRD â€” Unity VR Client", level: 1 },
      { id: "sec-8", label: "8. PRD â€” Web Client & Dashboards", level: 1 },
      { id: "sec-9", label: "9. PRD â€” LMS Integration & API", level: 1 },
      { id: "sec-10", label: "10. PRD â€” Chat MoPT (AI)", level: 1 },
    ],
  },
  {
    id: "part-iv",
    label: "Part IV â€” Regulatory, Safety & Trust",
    level: 0,
    icon: Shield,
    children: [
      { id: "sec-11", label: "11. UK MedTech Regulatory Map", level: 1 },
      { id: "sec-12", label: "12. Data Protection & GDPR", level: 1 },
      { id: "sec-13", label: "13. Clinical Safety & Risk", level: 1 },
      { id: "sec-14", label: "14. Ethical AI Governance", level: 1 },
    ],
  },
  {
    id: "part-v",
    label: "Part V â€” Execution System",
    level: 0,
    icon: Rocket,
    children: [
      { id: "sec-15", label: "15. Roadmap, OKRs & Prioritization", level: 1 },
      { id: "sec-16", label: "16. Iteration System", level: 1 },
      { id: "sec-17", label: "17. Release Management", level: 1 },
      { id: "sec-18", label: "18. QA Strategy", level: 1 },
    ],
  },
  {
    id: "part-vi",
    label: "Part VI â€” Go-to-Market",
    level: 0,
    icon: Rocket,
    children: [
      { id: "sec-19", label: "19. Beta Program Design", level: 1 },
      { id: "sec-20", label: "20. Institutional Sales", level: 1 },
      { id: "sec-21", label: "21. Pricing & Unit Economics", level: 1 },
      { id: "sec-22", label: "22. Customer Success & Hardware", level: 1 },
    ],
  },
  {
    id: "part-vii",
    label: "Part VII â€” Team & Stakeholders",
    level: 0,
    icon: Users,
    children: [
      { id: "sec-23", label: "23. Stakeholder Map & RACI", level: 1 },
      { id: "sec-24", label: "24. Advisory Boards", level: 1 },
      { id: "sec-25", label: "25. Hiring & Team Scaling", level: 1 },
    ],
  },
  {
    id: "part-viii",
    label: "Part VIII â€” Analytics & KPIs",
    level: 0,
    icon: BarChart3,
    children: [
      { id: "sec-26", label: "26. Analytics Infrastructure", level: 1 },
      { id: "sec-27", label: "27. KPI Operating Model", level: 1 },
      { id: "sec-28", label: "28. Experimentation", level: 1 },
    ],
  },
  {
    id: "part-ix",
    label: "Part IX â€” Risk, Crisis & Governance",
    level: 0,
    icon: AlertTriangle,
    children: [
      { id: "sec-29", label: "29. Risk Register", level: 1 },
      { id: "sec-30", label: "30. Crisis Playbooks", level: 1 },
      { id: "sec-31", label: "31. Decision Records", level: 1 },
    ],
  },
  {
    id: "part-x",
    label: "Part X â€” Personal Excellence",
    level: 0,
    icon: Star,
    children: [
      { id: "sec-32", label: "32. Personal Excellence", level: 1 },
      { id: "sec-33", label: "33. Master 47-Deliverables Tracker", level: 1 },
    ],
  },
  {
    id: "appendices",
    label: "Appendices & Glossary",
    level: 0,
    icon: FileText,
  },
];

// â”€â”€â”€ Reusable Sub-Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl font-semibold tracking-tight pt-10 pb-4 scroll-mt-6"
      style={{ color: "var(--text-main)" }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold tracking-tight pt-8 pb-3 scroll-mt-6"
      style={{ color: "var(--text-main)" }}
    >
      {children}
    </h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

function Callout({ type, children }: { type: "info" | "warn" | "danger"; children: React.ReactNode }) {
  const styles = {
    info: { bg: "rgba(99,102,241,0.08)", border: "var(--primary)", color: "var(--primary)" },
    warn: { bg: "rgba(245,158,11,0.08)", border: "var(--warning)", color: "var(--warning)" },
    danger: { bg: "rgba(239,68,68,0.08)", border: "var(--danger)", color: "var(--danger)" },
  };
  const s = styles[type];
  return (
    <div
      className="rounded-xl px-5 py-4 mb-5 text-sm leading-relaxed"
      style={{ background: s.bg, borderLeft: `4px solid ${s.border}`, color: "var(--text-main)" }}
    >
      {children}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto mb-6 rounded-xl" style={{ border: "1px solid var(--glass-border)" }}>
      <table className="w-full text-xs">
        <thead>
          <tr style={{ background: "rgba(99,102,241,0.06)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-main)", borderBottom: "1px solid var(--glass-border)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--glass-border)" }}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="rounded-xl px-5 py-4 mb-5 text-xs leading-relaxed overflow-x-auto font-mono"
      style={{ background: "rgba(30,41,59,0.06)", color: "var(--text-main)", border: "1px solid var(--glass-border)" }}
    >
      {children}
    </pre>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--primary)" }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2 mb-5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span
            className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
            style={{ background: "rgba(99,102,241,0.12)", color: "var(--primary)" }}
          >
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

// â”€â”€â”€ TOC Sidebar Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TocSidebar({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <nav className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest mb-4 px-3" style={{ color: "var(--text-muted)" }}>
        Table of Contents
      </p>
      {TOC.map((entry) => {
        const Icon = entry.icon;
        const isActive = activeId === entry.id || entry.children?.some((c) => c.id === activeId);
        const isOpen = expanded[entry.id] ?? isActive;

        return (
          <div key={entry.id}>
            <button
              onClick={() => {
                if (entry.children) toggle(entry.id);
                onNavigate(entry.id);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group"
              style={{
                background: isActive ? "rgba(99,102,241,0.1)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
              }}
            >
              {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />}
              <span className="flex-1 text-left truncate">{entry.label}</span>
              {entry.children && (
                <span className="opacity-40">
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </span>
              )}
            </button>
            {entry.children && isOpen && (
              <div className="ml-5 pl-3 space-y-0.5 mt-0.5" style={{ borderLeft: "1px solid var(--glass-border)" }}>
                {entry.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onNavigate(child.id)}
                    className="block w-full text-left px-3 py-1.5 rounded-md text-[11px] transition-all duration-200"
                    style={{
                      color: activeId === child.id ? "var(--primary)" : "var(--text-muted)",
                      fontWeight: activeId === child.id ? 600 : 400,
                      background: activeId === child.id ? "rgba(99,102,241,0.06)" : "transparent",
                    }}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// â”€â”€â”€ Main Documentation Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("executive-summary");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const ids = TOC.flatMap((t) => [t.id, ...(t.children?.map((c) => c.id) ?? [])]);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Scroll listener for back-to-top
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handler = () => setShowBackToTop(container.scrollTop > 600);
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="flex gap-6 h-full" style={{ minHeight: 0 }}>
      {/* Sticky TOC */}
      <aside
        className="hidden xl:block w-64 flex-shrink-0 overflow-y-auto pr-4"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        <TocSidebar activeId={activeSection} onNavigate={handleNavigate} />
      </aside>

      {/* Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto pb-24 doc-content" style={{ maxHeight: "calc(100vh - 100px)" }}>
        {/* Title Block */}
        <div className="glass p-8 mb-8" style={{ borderLeft: "4px solid var(--primary)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--primary)" }}>
            Living Document â€” Review Quarterly
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: "var(--text-main)" }}>
            MoPT Product Manager Master Execution Pack
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Version 2.0 â€” The World-Class Edition
          </p>
          <div className="flex flex-wrap gap-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <span>Prepared by: PM/Innovation Lead</span>
            <span>â€¢</span>
            <span>Date: April 2026</span>
            <span>â€¢</span>
            <span>Status: Living document</span>
          </div>
        </div>

        <Callout type="info">
          <strong>Why this v2.0 exists:</strong> The initial draft of our execution plan was purely tactical, focusing solely on software features and the immediate beta. It critically missed the realities of building a MedTech product in the UK. This v2.0 rebuild establishes a world-class foundation integrating NHS regulatory compliance, rigorous learning science, clinical safety protocols, ethical AI governance, institutional procurement realities, and long-term crisis management.
        </Callout>

        {/* â”€â”€â”€â”€â”€â”€ EXECUTIVE SUMMARY â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="executive-summary">Executive Summary</SectionHeading>
        <Para>
          MoPT (Mo Personal Trainer) is forging a new category in medical education by bridging high-fidelity Unity VR simulations, an advanced web LMS, and Agentic AI (Chat MoPT). Our immediate target is executing a flawless Closed Beta with King's College London and select NHS Trusts, proving our core value proposition to support our Â£21/Â£31/mo commercial tiers.
        </Para>
        <Para>
          To succeed, we are making critical bets on frictionless Device Auth for VR, dynamic LLM-driven clinical debriefs, and an uncompromising commitment to clinical realism. Our regulatory posture embraces NHS DTAC and DCB0129 compliance proactively, ensuring institutional trust.
        </Para>
        <Para>
          Our North Star metricâ€”<strong>Weekly Competency-Minutes per Active Learner</strong>â€”aligns our product success directly with clinical learning outcomes. The top risks we must navigate are VR cybersickness (FPS drops), Chat MoPT medical hallucinations, PII leakage, Meta App Lab constraints, and the key-person dependency on our sole Unity developer.
        </Para>

        <div className="glass p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>How to Use This Pack</p>
          <DataTable
            headers={["Audience", "Focus Areas"]}
            rows={[
              ["CEO (Dr. Olayinka) & COO (Adetola)", "Parts I (Strategy), VI (GTM/Pricing), and IX (Risk & Crisis)"],
              ["VR Lead (Dr. Tara) & Unity Dev (Oluwatosin)", "Parts III (PRD - VR), V (Execution), and VI (QA)"],
              ["VR/Tech Lead (Joshua)", "Sections 8, 9, 10 (Web, API, AI PRDs) and Section 12 (Data Privacy)"],
              ["Advisors (Gigi, Dr. Janice, Ayokunnu, Graham)", "Part VII (Stakeholders) and Part IV (Regulatory)"],
            ]}
          />
        </div>

        {/* â”€â”€â”€â”€â”€â”€ 12 NON-NEGOTIABLES â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="non-negotiables">The 12 Things This Pack Insists On (Non-Negotiables)</SectionHeading>
        <NumberedList
          items={[
            "72 FPS Minimum: Unity builds dropping below 72 FPS on Quest 3 will not be merged.",
            "DPIA Before Beta: A formal Data Protection Impact Assessment must be signed by Graham (IP/Legal) before patient/student data hits the database.",
            "Clinical Safety Officer (CSO): We must formally appoint a CSO as per NHS DCB0129 standards.",
            "Device Auth Grant: VR login must use pairing codes (RFC 8628), not in-VR keyboards.",
            "Zero-Temperature AI: Chat MoPT will run at T=0 for clinical facts to prevent hallucinations.",
            "Kirkpatrick L3 Commitment: We measure behavioral change, not just app usage.",
            "Protect the Devs: All advisor/stakeholder feedback routes exclusively through the PM.",
            'No "Nice to Haves": If it doesn\'t serve the Beta hypotheses, it is cut from the sprint.',
            "Blameless Post-Mortems: When things break, we fix systems, we do not blame people.",
            "Accessibility as Default: Subtitles, seated mode, and left-hand dominance are P0 features.",
            "Idempotency in APIs: All Unity â†’ LMS data submissions must be safely retryable.",
            "Clinical Sign-off: Dr. Olayinka must formally approve every scenario before it hits `main`.",
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART I â€” FOUNDATIONS â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-i">Part I â€” Foundations</SectionHeading>

        <SubHeading id="sec-1">1. PM Operating Philosophy & Personal Charter</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>North Star Principles</p>
        <BulletList
          items={[
            "Clinical Realism: We are building a medical simulator, not a video game. If a mechanic contradicts NHS guidelines, it is rejected.",
            "Frictionless Learning: Time-to-value is paramount. Clinicians are exhausted. The UI must be invisible, and the hardware must disappear into the experience.",
            "Evidence Over Opinion: We resolve debates using user telemetry, clinical guidelines, and A/B test data, not HiPPO (Highest Paid Person's Opinion).",
            "Shield the Team: Oluwatosin and Joshua must operate in deep work states. I absorb organizational chaos and emit structured Jira tickets.",
            "Ship to Learn: We validate assumptions by putting headsets on real clinicians as early as safely possible.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Definition of Excellent Execution</p>
        <Para>
          Excellence in my role means establishing high-fidelity connective tissue. I must translate Dr. Olayinka's medical expertise into logic gates, Dr. Tara's XR academic research into spatial UI constraints, Adetola's budget realities into scope management, and Graham's legal warnings into GDPR-compliant API architectures.
        </Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Operating Cadence & Rituals</p>
        <BulletList
          items={[
            "Daily: Triage blockers. 15-minute async Slack standup. Unblock Unity dev.",
            "Weekly: 1:1 with functional leads. Feature review. Send Executive Status Report.",
            "Sprint (Bi-weekly): Backlog grooming. Sprint Planning. Demo & Retrospective.",
            "Monthly: KPI & OKR review. Risk Register audit. Advisory Board summary.",
            "Quarterly: Strategic roadmap refresh. Clinical Safety Group review.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Decision-Making Framework (RAPID)</p>
        <DataTable
          headers={["Decision Type", "Recommend", "Agree", "Perform", "Input", "Decide"]}
          rows={[
            ["Clinical Scenario Accuracy", "Prof. Olaosun", "Dr. Olayinka", "PM / Unity Dev", "Clinical SMEs", "Dr. Olayinka"],
            ["VR Architecture / Tech Stack", "Unity Dev", "Dr. Tara", "Unity Dev", "PM / Joshua", "Dr. Tara"],
            ["API & Web LMS Arch", "Joshua", "PM", "Joshua", "Unity Dev", "Joshua"],
            ["Sprint Prioritization", "PM", "Founders", "Team", "Advisors / Leads", "PM"],
          ]}
        />

        <Callout type="info">
          <strong>Working Agreement with Oluwatosin (Unity Dev):</strong> Specs will always include wireframes, expected haptics, and success criteria. We will pair-program/review VR builds twice a week utilizing Meta Quest Casting. If a ticket lacks clear acceptance criteria, Oluwatosin has full authority to reject it back to the PM.
        </Callout>

        <Callout type="warn">
          <strong>Anti-Patterns to Avoid:</strong> Hero Mode (PM trying to do QA, UX, and Scrum Master simultaneously), Premature Optimization (building robust multiplayer for Beta), Jira-Bound (more time formatting tickets than talking to clinicians).
        </Callout>

        {/* â”€â”€ Section 2 â”€â”€ */}
        <SubHeading id="sec-2">2. First 30 / 60 / 90 Day PM Onboarding Plan</SubHeading>
        <DataTable
          headers={["Phase", "Focus", "Key Actions & Milestones"]}
          rows={[
            ["Days 1â€“30 (Listen & Audit)", "Context gathering & baseline mapping", "Conduct 1:1s with all founders and advisors. Deliverable: LMS Architecture Audit completed with Joshua. Deliverable: Master Backlog created and triaged in Jira. Shadow 3 clinical SMEs."],
            ["Days 31â€“60 (Align & Structure)", "Establishing the engine", "Implement bi-weekly sprint ceremonies. Deliverable: DPIA drafted and submitted to Graham. Deliverable: OKRs drafted and signed off by CEO. Clinical Safety Officer explicitly appointed."],
            ["Days 61â€“90 (Deliver Beta)", "Execution & Go-to-Market", "Deliverable: Private Beta launched with KCL. End-to-end data pipeline validated. Initiate institutional pricing discovery with Adetola."],
          ]}
        />

        {/* â”€â”€ Section 3 â”€â”€ */}
        <SubHeading id="sec-3">3. Product Vision, Strategy & North Star Metric</SubHeading>
        <div className="glass p-6 mb-6" style={{ borderLeft: "4px solid var(--primary)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Vision</p>
          <p className="text-sm font-medium mb-4" style={{ color: "var(--text-main)" }}>A world where no clinician encounters a critical medical scenario for the first time on a live patient.</p>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Mission</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>To provide accessible, AI-guided, high-fidelity VR clinical skills training that translates directly to institutional competency and improved patient safety.</p>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Competitive Landscape</p>
        <DataTable
          headers={["Competitor", "Core Focus", "MoPT Differentiation"]}
          rows={[
            ["Oxford Medical Simulation (OMS)", "Nursing/medical scenarios, high institutional penetration", "Chat MoPT provides dynamic, unscripted AI mentorship vs static decision trees. Lower price floor."],
            ["FundamentalVR / Osso VR", "Surgical precision, bone/tissue haptics", "MoPT focuses on cognitive load, diagnostics, and emergency protocols rather than purely surgical kinematics."],
            ["SimX / UbiSim", "Multiplayer clinical simulation", "MoPT focuses heavily on the LMS/Web analytics layer, providing superior ROI proof for NHS admins."],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>North Star Metric & KPIs</p>
        <Callout type="info">
          <strong>North Star:</strong> Weekly Competency-Minutes per Active Learner â€” "Time in app" is vanity; "competency-minutes" weights active VR time by the score achieved, ensuring we measure effective learning.
        </Callout>
        <BulletList
          items={[
            "Input Metric 1 (Product UX): Time-to-Sim (seconds from headset on to scenario start).",
            "Input Metric 2 (Clinical Value): AI Feedback Acceptance Rate (% of times a user corrects an action based on Chat MoPT).",
            "Input Metric 3 (Institutional): Web Dashboard Weekly Active Instructors.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>18-Month Strategic Horizon</p>
        <BulletList
          items={[
            "Phase 1 (Now â€“ 3mo): Beta with KCL. Prove the Unity-LMS-AI loop.",
            "Phase 2 (3â€“9mo): Commercial NHS Pilots. Obtain DTAC compliance. Expand to 5 core neonatal scenarios.",
            "Phase 3 (9â€“18mo): Multi-specialty expansion. Self-serve institutional purchasing. Internationalization prep.",
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART II â€” DISCOVERY â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-ii">Part II â€” Discovery & Validation</SectionHeading>

        <SubHeading id="sec-4">4. Discovery Framework & Continuous User Research Plan</SubHeading>
        <Para>We do not build features based on hunches. We utilize Teresa Torres' Continuous Discovery Habits framework (Opportunity Solution Trees) to map clinical pains to product solutions.</Para>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Research Methods Mix</p>
        <BulletList
          items={[
            "Contextual Inquiry: PM and VR Lead visiting KCL to watch clinicians use the VR headset in their natural environment.",
            "Usability Testing: Meta Quest Casting to monitor UI struggles in real-time.",
            "Surveys: Automated SSQ (Simulator Sickness Questionnaire) sent post-module.",
          ]}
        />
        <Callout type="info">
          <strong>Insight-to-Backlog Pipeline:</strong> All user feedback from the Web Portal and in-VR bug reports flows into a central Notion/Dovetail repository. PM tags insights by persona and theme. If an insight maps to a current OKR, it is converted to a Jira discovery ticket.
        </Callout>

        <SubHeading id="sec-5">5. Learning Science & Pedagogical Foundations</SubHeading>
        <Callout type="warn">
          <strong>Why Learning Science Matters:</strong> If MoPT does not genuinely transfer skills to the physical world, institutions will churn. Our design must be rooted in proven pedagogical frameworks.
        </Callout>
        <BulletList
          items={[
            "Miller's Pyramid: VR operates at the \"Shows How\" level. MoPT tests applied competence, bridging the gap between textbook knowledge (\"Knows\") and ward practice (\"Does\").",
            "Deliberate Practice: MoPT allows clinicians to repeatedly practice the exact 30-second window of a resuscitation where they are weakest, receiving immediate, targeted feedback.",
            "Cognitive Load Theory: The VR UI must minimize extraneous load (confusing menus) so the user's working memory is dedicated to germane load (solving the medical crisis).",
            "Debriefing (PEARLS): Chat MoPT's post-scenario debrief will be structured on the PEARLS framework: Reactions â†’ Description â†’ Analysis â†’ Summary.",
          ]}
        />

        <SubHeading id="sec-6">6. Clinical Scenario Design System</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Scenario Authoring Pipeline</p>
        <NumberedList
          items={[
            "SME Intake: Dr. Olayinka defines learning objectives and critical failure paths for a scenario.",
            "Storyboard & Script: PM and Clinical Content Designer map the state machine (e.g., if user gives Adrenaline early â†’ trigger Chat MoPT warning).",
            "VR Build: Oluwatosin implements the environmental assets and interaction logic.",
            "Clinical Review: Prof. Olaosun reviews a recorded playthrough for medical fidelity.",
            "Release: Semantic versioning applied (e.g., NeoResus v1.2) to ensure historical student grades remain contextually accurate.",
          ]}
        />
        <Para>
          <strong>Fidelity Tradeoffs:</strong> We prioritize Conceptual Fidelity (clinical logic) and Emotional Fidelity (stress, time pressure) over absolute Physical Fidelity (perfectly rendering the exact texture of skin).
        </Para>

        {/* â”€â”€â”€â”€â”€â”€ PART III â€” PRDs â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-iii">Part III â€” Product Requirements Documents (PRDs)</SectionHeading>

        <SubHeading id="sec-7">7. PRD â€” Unity VR Client</SubHeading>
        <Para>Goal: Deliver a performant, clinically accurate, and intuitive VR presentation layer that interfaces seamlessly with the LMS and AI engines.</Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Non-Functional Requirements</p>
        <BulletList
          items={[
            "Performance Gate: Target 72 FPS strictly. 90 FPS where possible. Max scene load time: 4 seconds.",
            "Accessibility: High-contrast subtitles pinned to lower FOV. Comfort mode (vignetting). Left/Right hand dominance toggle. Seated/Standing toggle.",
            "Cybersickness Mitigation: Teleportation is default locomotion. Smooth turning disabled by default (snap turn enabled).",
            "Device Support: Meta Quest 3 (Primary), Quest Pro. Quest 2 on best-effort basis.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>VR Data Schema (JSON Payload to LMS)</p>
        <CodeBlock>{`{
  "session_id": "sess_8f92a1",
  "user_id": "usr_9921",
  "module_id": "neo_resus_01",
  "app_version": "1.0.4",
  "start_time": "2026-04-10T14:30:00Z",
  "end_time": "2026-04-10T14:42:15Z",
  "final_score": 85,
  "telemetry": {
    "fps_avg": 71.8,
    "time_in_hmd_sec": 735
  },
  "clinical_events": [
    {"timestamp": 12, "action": "hands_washed", "status": "pass"},
    {"timestamp": 45, "action": "o2_administered", "status": "fail_late"}
  ]
}`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Core VR Deliverables</p>
        <DataTable
          headers={["ID", "Requirement", "Acceptance Criteria", "Priority"]}
          rows={[
            ["VR2", "Spatial UI Menu System", "Splash, Dashboard, Module select screens as curved world-space canvases. Raycast interaction. Readable at 1.5m.", "P0"],
            ["VR3", "Interactive Onboarding", "3-minute tutorial scene teaching teleport, grab, and UI click. Triggers on first launch.", "P0"],
            ["VR9", "Edge-Case Handling", "App pauses when headset removed. Local fallback cache saves session if Wi-Fi drops.", "P0"],
            ["VR11", "AI Interaction UI", "User presses left-wrist button to trigger voice recording. Floating UI displays response subtitles.", "P1"],
            ["VR13", "Neonatal Module (E2E)", "Incubator, stethoscope, O2 tools function. Logic tree tracks user actions against rubric.", "P0"],
            ["VR18", "Offline Mode Sync", "If offline, JSON payloads are queued locally and auto-POSTed upon connection restore.", "P1"],
          ]}
        />

        <SubHeading id="sec-8">8. PRD â€” Web Client & Dashboards</SubHeading>
        <Para>Goal: Provide institutional buyers, instructors, and learners with a robust control center for managing accounts, modules, and performance analytics.</Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Role Permissions Matrix</p>
        <DataTable
          headers={["Feature / Action", "Learner", "Instructor", "Inst. Admin", "Super Admin"]}
          rows={[
            ["View own session data", "âœ”", "âœ”", "âœ”", "âœ”"],
            ["View cohort analytics", "âœ–", "âœ”", "âœ”", "âœ”"],
            ["Assign modules to users", "âœ–", "âœ”", "âœ”", "âœ”"],
            ["Manage billing & seats", "âœ–", "âœ–", "âœ”", "âœ”"],
            ["Edit clinical rubrics", "âœ–", "âœ–", "âœ–", "âœ”"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Dashboard Wireframe Narratives</p>
        <BulletList
          items={[
            "Learner View: Greeting. \"Continue Training\" button. Spider chart showing historic competencies. List of earned certificates.",
            "Instructor View: Cohort table. Red flags next to students who failed critical protocol steps >2 times. Drill-down click reveals specific Chat MoPT transcripts.",
            "Admin View: Seat utilization chart (e.g., 45/50 licenses active). Invoice history. GDPR data export button.",
          ]}
        />

        <SubHeading id="sec-9">9. PRD â€” LMS Integration & API Contract</SubHeading>
        <CodeBlock>{`[Unity C# HttpClient]
    â†“ (Bearer Token)
[AWS API Gateway] â†’ Rate Limiter â†’ Auth Service
    â†“
[Node.js / LMS Backend] â†” [PostgreSQL DB]
    â†“ (Async Webhook)
[Web Dashboard React App]`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Authentication: OAuth 2.0 Device Flow (RFC 8628)</p>
        <NumberedList
          items={[
            "VR App requests code from /oauth/device/code.",
            "VR displays a 6-digit code (e.g., A7X-9BQ).",
            "Clinician logs into mopt.co.uk/link on their phone and enters the code.",
            "VR App polls /oauth/token until user approves on phone, receiving JWT.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Core API Contract</p>
        <DataTable
          headers={["Endpoint", "Method", "Purpose", "Responses"]}
          rows={[
            ["/v1/auth/device", "POST", "Initiate VR pairing flow", "200: Device Code, URI"],
            ["/v1/modules", "GET", "Fetch available scenarios for user", "200: Array of Module Objects"],
            ["/v1/sessions", "POST", "Submit completed VR session data", "201: Created, 400: Bad Request"],
            ["/v1/ai/query", "POST", "Send transcript to Chat MoPT, get reply", "200: AI Response Text/Audio"],
          ]}
        />

        <SubHeading id="sec-10">10. PRD â€” Assessment Intelligence & Chat MoPT (Agentic AI)</SubHeading>
        
        <Callout type="info">
          <strong>Core Product Truth:</strong> MoPT's defensible AI layer is not a generic chatbot. It is an assessment intelligence system that ingests Unity telemetry, evaluates learner actions against clinician-authored procedure logic, generates real-time judgment, and only then uses conversational AI as a delivery layer for feedback. Rule-based, clinician-validated judgment comes first; ML and LLMs are augmentation layers, not the source of truth.
        </Callout>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.1 Working Group Context</p>
        <DataTable
          headers={["Contributor", "Context / Capability", "Implication for PM"]}
          rows={[
            ["Joshua", "Assessment-system framing, task decomposition, clinician-validation push.", "Primary product counterpart for assessor scope and decision logic."],
            ["Alexander Olaiya", "LLM/API workflows, LangChain, Groq, OpenAI, LLaMA orchestration.", "Best placed on delivery-layer orchestration and prompt pipelines."],
            ["Matt", "Classical ML + CV background: regression, random forest, CNN, YOLO.", "Best placed on later hybrid / temporal-model research and evaluation."],
            ["Dr. Olayinka", "Clinical grounding and final medical credibility.", "Clinical sign-off gate for assessor logic and feedback credibility."],
          ]}
        />
        <Para>
          <span className="opacity-80 italic">The team's stated model-build estimate of ~1â€“2 weeks is realistic for a prototype but not for clinically credible production judgment. PM must therefore separate MVP assessor build time from clinical validation, telemetry QA, and replay verification time.</span>
        </Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.2 Product Goal</p>
        <Para>
          Build a real-time assessment engine for MoPT VR simulations that can: (1) ingest interaction streams from the Unity/C# client, (2) evaluate learner behavior against a clinician-authored procedure graph, (3) trigger immediate feedback or silent logging depending on policy, (4) influence simulation state when required, and (5) generate a trustworthy post-scenario debrief with evidence traces.
        </Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.3 Initial Clinical Testbeds</p>
        <BulletList items={[
          "Primary: Endotracheal Intubation (ETI) â€” currently the most mature module context.",
          "Secondary: IV Cannulation â€” next candidate for procedure graph and telemetry formalization.",
        ]} />
        <Callout type="danger">
          <strong>Rule:</strong> No ML model is trained or benchmarked before the procedure graph and assessor rubric for each scenario are signed off by a medical advisor (Aladeojebi Adedotun Isaac).
        </Callout>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.4 Assessor Architecture</p>
        <DataTable
          headers={["Layer", "Purpose", "Implementation posture"]}
          rows={[
            ["Procedure graph", "Formal model of required, optional, forbidden, and branching actions.", "Clinician-authored in Draw.io / Miro / Lucidchart first; version controlled after sign-off."],
            ["Telemetry ontology", "Defines what the VR app must emit for reliable judgment.", "Unity event contract owned jointly by PM, Joshua, and engineering leads."],
            ["Rule-based MVP assessor", "Tracks step progression, sequence violations, omissions, timing breaches.", "P0 MVP. Must exist before any temporal ML model enters roadmap."],
            ["Feedback policy engine", "Decides whether to interrupt, coach, silently log, or defer to debrief.", "Difficulty-aware and scenario-specific."],
            ["Scoring engine", "Converts evidence into process, safety, execution, and efficiency scores.", "Transparent formulas required for clinician trust."],
            ["Conversational delivery layer", "Turns evidence into text/voice feedback.", "Chat MoPT + optional ElevenLabs voice stack; never the sole judge."],
            ["Offline replay evaluator", "Re-runs a captured session against new rules, new rubrics, or models.", "Critical for QA, clinician review, and future ML benchmarking."],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.5 Procedure-Graph & 10.6 Telemetry Specification</p>
        <Para>
          Every scenario graph must explicitly label: required actions, optional actions, forbidden actions, prerequisites, branching states, timeout windows, recovery pathways, and terminal failure conditions. This is the heart of MoPT's IP.
        </Para>
        <BulletList items={[
          "Event stream: object picked, tool equipped, medication selected, prompt opened, step confirmed, help requested.",
          "Transforms: hand/controller position, head pose, tool tip pose, patient-relative interaction zone.",
          "Object states: whether a tool is available, contaminated, connected, activated, inserted, disposed, or reset.",
          "Timestamps: absolute UTC, session-relative seconds, event sequence index, latency markers.",
        ]} />
        <Callout type="warn">
          <strong>Telemetry rule:</strong> If an action matters for scoring, safety, progression, feedback, or replay, it must exist in the telemetry spec. No clinically meaningful judgment should depend on hidden client-side state.
        </Callout>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.7 Rule-Based MVP Assessor & 10.8 Feedback Policy</p>
        <Para>
          State tracking maintains current node, prior nodes, elapsed time, and satisfied prerequisites. Sequence validation detects out-of-order actions, skipped mandatory steps, and irreversible critical mistakes. Critical safety logic immediately flags forbidden actions. This is the scope referred to as "Rubi's assessor", owned by Matt and Alexander Olaiya for penalty/reward logic drafts, but subordinate to clinician-approved rules.
        </Para>
        <DataTable
          headers={["Situation", "Feedback mode", "Example"]}
          rows={[
            ["Immediate patient-safety breach", "In-headset interruptive prompt", "\"Pause. You attempted a forbidden action before verifying airway readiness.\""],
            ["Recoverable sequencing error", "Silent log or optional nudge depending on difficulty", "Log on hard mode; hint on easy mode."],
            ["Scenario complete", "Structured PEARLS debrief", "Summary of strengths, misses, timings, and remediation advice."],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.9 Scoring Framework & 10.10 Expert Comparison</p>
        <BulletList items={[
          "Process adherence: Did the learner follow the clinically correct sequence?",
          "Technical execution: Did they manipulate tools and complete actions correctly?",
          "Safety: Did they avoid forbidden or unsafe behaviors?",
          "Efficiency: Did they complete the procedure within acceptable time and motion bounds?",
        ]} />
        <Para>
          The comparison method should begin with an expert reference trace: one or more clinician-validated gold-standard runs annotated against the same procedure graph. Learner performance is then compared on step order, timing windows, hesitation points, error recovery, and unnecessary actions.
        </Para>

        <div className="glass p-5 mt-6" style={{ borderLeft: "4px solid var(--primary)" }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>10.13 Prompt Architecture & Refusal Rules</p>
          <Para>
            System prompt must include: <span className="font-mono text-xs opacity-90">"You are MoPT, a clinical educator. Base all answers strictly on UK Resuscitation Council guidelines and the assessor evidence provided. Do not invent dosages. Do not override the assessor state. If asked about a real patient, refuse to answer. If evidence is incomplete, say so explicitly."</span>
          </Para>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>10.14 Immediate Deliverables Required</p>
        <NumberedList items={[
          "Procedure graph for ETI and IV cannulation (Miro / Lucidchart / Draw.io acceptable initially).",
          "Telemetry specification aligned to MoPT spatial interaction design and Unity object model.",
          "Rule-based assessor prototype proving step progression, sequence violations, critical mistakes, and replay output.",
          "Medical-advisor review session with the full team present before assessor logic is frozen.",
        ]} />
        <Callout type="danger">
          <strong>PM operating rule for AI/ML:</strong> Do not allow the team to hide ambiguity behind the word model. First pin down the procedure graph, telemetry ontology, assessor policy, and replay harness. Only then decide whether additional temporal ML is warranted.
        </Callout>

        {/* â”€â”€â”€â”€â”€â”€ PART IV â€” REGULATORY â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-iv">Part IV â€” Regulatory, Safety & Trust</SectionHeading>

        <SubHeading id="sec-11">11. UK MedTech Regulatory Map</SubHeading>
        <Callout type="info">
          <strong>Regulatory Posture:</strong> MoPT is an educational tool. We must explicitly document that it is NOT Software as a Medical Device (SaMD) under MHRA guidelines, as it does not diagnose, treat, or monitor real patients. However, to sell to the NHS, we MUST comply with clinical safety standards.
        </Callout>
        <BulletList
          items={[
            "DCB0129: Clinical Risk Management. We must create a Clinical Safety Case Report and a Hazard Log.",
            "NHS DTAC: Digital Technology Assessment Criteria. Requires evidence of clinical safety, data protection, technical security, and usability. Mandatory for NHS procurement.",
            "DSPT: Data Security and Protection Toolkit. Institutional buyers will demand this.",
          ]}
        />
        <Callout type="warn">
          <strong>Action:</strong> Dr. Olayinka or an external consultant must be formally appointed as the Clinical Safety Officer (CSO).
        </Callout>

        <SubHeading id="sec-12">12. Data Protection, Security & GDPR Deep Dive</SubHeading>
        <BulletList
          items={[
            "GDPR Posture: We process PII (names, emails, institutional affiliation) and potentially sensitive performance data. Lawful basis: Contract for core service, Legitimate Interest for analytics, Consent for marketing/voice processing.",
            "DPIA: A Data Protection Impact Assessment is mandatory before Beta due to AI processing and health-adjacent data.",
            "Data Residency: AWS eu-west-2 (London) only. No data transfer outside UK/EEA.",
            "AI Processor DPA: If using OpenAI/Azure for Chat MoPT, we must secure a B2B agreement stipulating zero data retention for model training.",
          ]}
        />

        <SubHeading id="sec-13">13. Clinical Safety & Risk Management</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Hazard Log Summary (DCB0129)</p>
        <DataTable
          headers={["Hazard", "Likelihood", "Severity", "Mitigation"]}
          rows={[
            ["Negative Learning Transfer (Scenario teaches wrong protocol)", "Low", "Critical", "Mandatory sign-off by 2 independent SMEs. Version locking."],
            ["Physical Injury (Tripping in VR)", "Medium", "Moderate", "Stationary/Seated mode defaults. Passthrough boundary enforcement."],
            ["Simulator Sickness", "High", "Minor", "72 FPS minimum. Teleportation only. Vignette comfort settings."],
          ]}
        />

        <SubHeading id="sec-14">14. Ethical AI & Chat MoPT Governance</SubHeading>
        <Para>
          Transparency is key. Users must be explicitly informed when they are interacting with AI versus a human instructor. Bias reviews must be conducted on VR avatars to ensure diverse representation of virtual patients (ethnicity, gender, body type) to prevent diagnostic bias training.
        </Para>

        {/* â”€â”€â”€â”€â”€â”€ PART V â€” EXECUTION â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-v">Part V â€” Execution System</SectionHeading>

        <SubHeading id="sec-15">15. Roadmap, OKRs & Prioritization</SubHeading>
        <Para>A world-class PM does not manage tasks. They manage outcomes.</Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Annual OKRs</p>
        <DataTable
          headers={["Objective", "Key Results", "Owner"]}
          rows={[
            ["O1. Earn the right to sell to the NHS", "KR1: Complete DPIA and DCB0129 Clinical Safety Case. KR2: Achieve Cyber Essentials Plus. KR3: Submit DTAC pack to 1 NHS Trust.", "PM + DPO + CSO"],
            ["O2. Prove learning outcomes in a clinical cohort", "KR1: Run Private Beta with â‰¥20 KCL clinicians. KR2: â‰¥20% competency-score improvement (Kirkpatrick L2). KR3: Institutional NPS â‰¥40.", "PM + Clinical Lead"],
            ["O3. Build a commercial, scalable platform", "KR1: Sign 2 paid institutional pilots (Â£5â€“15k ARR each). KR2: Unit gross margin â‰¥70%. KR3: Ship v1.0 scenario authoring pipeline.", "PM + COO"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Now / Next / Later Roadmap</p>
        <DataTable
          headers={["Now (0â€“3 months)", "Next (3â€“6 months)", "Later (6â€“18 months)"]}
          rows={[
            [
              "VR + LMS round-trip, Device Auth flow, Neonatal resus v1, Chat MoPT debrief, DPIA + Hazard Log, KCL Private Beta",
              "Instructor dashboards, Cohort analytics, Scenario authoring v1, 2nd + 3rd modules, SSO for institutions, Self-serve billing",
              "Multi-specialty library, International (Nigeria, UAE), Pico/Vision Pro support, Peer-reviewed study, ISO 27001, Scenario marketplace",
            ],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Sprint Plan to Beta (Sprints 1â€“5)</p>
        <DataTable
          headers={["Sprint", "Theme", "Primary Deliverables", "Exit Criteria"]}
          rows={[
            ["1 (Wk 1â€“2)", "Foundation", "API contracts locked; Device Auth live; Spatial UI shell; LMS audit; DPIA kicked off.", "Clinician can pair headset with web and load dummy Platform menu."],
            ["2 (Wk 3â€“4)", "Core Simulation", "Neonatal resus scene; Scoring rubric; Session schema; /sessions endpoint.", "Module playable locally; 200 OK on session POST via Postman."],
            ["3 (Wk 5â€“6)", "Integration + AI", "Round-trip data (VR â†’ LMS â†’ Dashboard); Chat MoPT RAG baseline; Individual learner view.", "Completed module in VR appears on web within 5s; Chat MoPT functional."],
            ["4 (Wk 7â€“8)", "Hardening", "72 FPS guarantee; haptics; accessibility; edge cases; offline cache; feature flags; Clinical Safety Case draft.", "OVR metrics green; app recovers from Wi-Fi drop; CSO approves."],
            ["5 (Wk 9â€“10)", "Beta Readiness", "QA sweep; GDPR walkthrough; train-the-trainer kit; KCL onboarding docs; App Lab Beta channel push.", "Zero S1/S2; DPIA signed; KCL accounts provisioned."],
          ]}
        />

        <Callout type="info">
          <strong>PM Recommendation:</strong> Lock the top 10 P0 items for Sprints 1â€“3. Every other item must earn its way into a sprint by passing Definition of Ready AND showing no dependency on an unfinished P0.
        </Callout>

        <SubHeading id="sec-16">16. Iteration System & Engineering Operating Model</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Sprint Structure</p>
        <Para>Two-week sprints. Monday 09:30 Sprint Planning. Wednesday 14:00 Backlog Grooming. Friday 15:00 Sprint Demo + Retrospective on the final Friday. Async standups (Slack #mopt-standup) daily at 09:00.</Para>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Definition of Ready (DoR) Checklist</p>
        <BulletList
          items={[
            'User story written in "As a [persona] I want [outcome] so that [value]" format.',
            "Acceptance criteria enumerated and testable.",
            "Figma / spatial wireframe attached for UI work.",
            "JSON schema attached for API work.",
            "Dependencies identified and not blocked.",
            "Clinical sign-off attached if content-related.",
            "Estimated in story points by the implementer.",
            "Analytics events specified for new user-facing flows.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Definition of Done (DoD)</p>
        <DataTable
          headers={["Surface", "Definition of Done"]}
          rows={[
            ["VR / Unity", "PR reviewed; automated PlayMode test added; manual device test passed on Quest 3; 72 FPS sustained; analytics firing; ADR updated; clinical sign-off for scenario changes."],
            ["Web", "PR reviewed; unit + integration test coverage â‰¥70%; Playwright E2E passes; a11y scan (axe) green; Lighthouse â‰¥90; Storybook updated."],
            ["API / Integration", "Swagger updated; Postman regression pass; contract test green; security headers verified; logged and traced; idempotency verified; rollback path documented."],
            ["Chat MoPT / AI", "Prompt version tagged; eval harness run (faithfulness + clinical accuracy); cost per call logged; guardrail tests pass; clinical reviewer signs off."],
          ]}
        />

        <SubHeading id="sec-17">17. Release Management & Environments</SubHeading>
        <DataTable
          headers={["Environment", "Purpose", "Data", "Access"]}
          rows={[
            ["Local", "Dev hot-loop", "Seeded fake data", "Engineers only"],
            ["Dev", "Shared integration", "Seeded fake data", "Full team"],
            ["QA / Staging", "Pre-release testing", "Anonymized snapshot", "Team + CSO + clinical reviewers"],
            ["Pre-Prod", "Release candidate", "Production-like", "PM + SRE + CSO"],
            ["Production", "Live learners", "Real, encrypted", "SRE via break-glass"],
          ]}
        />
        <Para>
          <strong>Semantic Versioning:</strong> VR client: MAJOR.MINOR.PATCH. API: URL-based (/v1/, /v2/). Scenario modules independently versioned (neo-resus@1.2.0).
        </Para>
        <Para>
          <strong>Feature Flag Governance:</strong> Flags are created via PR with an owner and an expiry date (max 90 days). Kill-switch flag ai.chat_mopt.enabled is always hot-toggleable without a client deploy.
        </Para>

        <SubHeading id="sec-18">18. QA Strategy & Test Architecture</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Test Pyramid</p>
        <BulletList
          items={[
            "Bottom (fast, many): Unit tests in C# (Unity EditMode), Jest (web), pytest (API).",
            "Middle: Integration tests, contract tests (Pact), Unity PlayMode tests, Playwright component tests.",
            "Top (few, slow, high signal): End-to-end VR-to-dashboard round-trip, manual exploratory VR sessions.",
          ]}
        />
        <Callout type="warn">
          <strong>Beta Gate: QA Exit Criteria:</strong> Zero S1/S2; &lt;3 S3; performance regressions closed; a11y scans green; UAT sign-off by CSO; evidence bundle attached to Sprint 5 release PR.
        </Callout>

        {/* â”€â”€â”€â”€â”€â”€ PART VI â€” GTM â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-vi">Part VI â€” Go-to-Market</SectionHeading>

        <SubHeading id="sec-19">19. Beta Program Design</SubHeading>
        <DataTable
          headers={["Phase", "Duration", "Cohort", "Objective", "Exit Criteria"]}
          rows={[
            ["Closed Alpha", "2 weeks", "MoPT team + 4 advisors", "Validate core loop; kill S1/S2 bugs", "0 S1/S2; 72 FPS sustained"],
            ["Private Beta", "6 weeks", "15â€“20 KCL clinicians + 2 educators", "Validate clinical accuracy, learning outcomes", "â‰¥80% completion; NPS â‰¥40; â‰¥20% L2 improvement"],
            ["Open Beta", "8 weeks", "Waitlist + 2 NHS trusts", "Scalability, conversion to paid", "<1% crash rate; 2 paid pilots signed"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Bug Taxonomy & SLA</p>
        <DataTable
          headers={["Severity", "Definition", "Response SLA", "Resolution SLA"]}
          rows={[
            ["S1 Blocker", "Crash, login broken, data loss, cybersickness risk, clinical misinformation", "15 min", "24 h"],
            ["S2 Critical", "Scenario fails partway, FPS <72, AI gives wrong advice", "2 h", "48 h"],
            ["S3 Major", "UX degraded, non-critical feature broken, visual glitch", "1 day", "Next sprint"],
            ["S4 Minor", "Typo, cosmetic, small polish item", "3 days", "Backlog"],
          ]}
        />

        <Callout type="danger">
          <strong>Private Beta Go/No-Go Gate:</strong> 1) DPIA signed. 2) Clinical Safety Case approved by CSO. 3) 0 S1/S2. 4) 72 FPS verified. 5) E2E round-trip verified over 50 simulated sessions. 6) KCL Data Sharing Agreement executed. 7) Rollback and kill-switch tested.
        </Callout>

        <SubHeading id="sec-20">20. Institutional Sales & Procurement</SubHeading>
        <Para>NHS procurement is slow, evidence-hungry, and risk-averse. Universities demand ethics approval and data-sharing agreements. MoPT must invest in a Trust Center.</Para>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>The MoPT Trust Center (must-have assets)</p>
        <BulletList
          items={[
            "DTAC (Digital Technology Assessment Criteria) pack",
            "DSPT (Data Security and Protection Toolkit) submission",
            "Cyber Essentials / Cyber Essentials Plus certificate",
            "DPIA summary + ROPA extract",
            "Clinical Safety Case + Hazard Log (DCB0129)",
            "Sub-processor list + DPAs",
            "Reference architecture diagram (for institution IT)",
            "Penetration test executive summary",
            "SLA document + support tiers",
            "Clinical evidence pack (pilot results, NPS, learning outcomes)",
          ]}
        />

        <SubHeading id="sec-21">21. Pricing, Packaging & Unit Economics</SubHeading>
        <DataTable
          headers={["Plan", "Price (monthly)", "Entitlement"]}
          rows={[
            ["Standard", "Â£21", "Unlimited VR sessions, core modules, Chat MoPT limited (N queries/day), basic dashboard."],
            ["Premium", "Â£31", "All scenario bundles, unlimited Chat MoPT, certificate of completion, priority support."],
            ["Institution", "Custom", "SSO, admin panel, cohort analytics, dedicated CSM, DPA, SLA, training."],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Unit Economics Model</p>
        <DataTable
          headers={["Line", "Standard (Â£21/mo)", "Premium (Â£31/mo)"]}
          rows={[
            ["Revenue", "Â£21.00", "Â£31.00"],
            ["Payment processing (~2.5%)", "-Â£0.53", "-Â£0.78"],
            ["LLM / Chat MoPT tokens", "-Â£1.20", "-Â£3.50"],
            ["Cloud + bandwidth", "-Â£0.60", "-Â£0.90"],
            ["Support allocation", "-Â£0.80", "-Â£1.20"],
            ["Gross margin", "~Â£17.87 (85%)", "~Â£24.62 (79%)"],
          ]}
        />

        <SubHeading id="sec-22">22. Customer Success, Hardware Logistics & Support</SubHeading>
        <DataTable
          headers={["Step", "Who", "Outcome", "Timing"]}
          rows={[
            ["Kickoff call", "PM + COO + institution admin", "Success plan signed; champion identified", "Day 0"],
            ["Hardware shipment", "COO + hardware partner", "Headsets delivered + MDM enrolled", "Day 1â€“7"],
            ["Train-the-trainer", "PM + Clinical Lead", "2-hour session; certified institutional trainer", "Day 7"],
            ["Learner activation", "Instructor + CSM", "70% of learners complete first module in 14 days", "Day 7â€“21"],
            ["First QBR", "PM + institution admin", "Outcome review; expansion plan", "Day 90"],
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART VII â€” TEAM â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-vii">Part VII â€” Team & Stakeholders</SectionHeading>

        <SubHeading id="sec-23">23. Stakeholder Map, RACI & Communication System</SubHeading>
        <DataTable
          headers={["Group", "Stakeholders", "Interest", "Influence", "PM Engagement"]}
          rows={[
            ["Founders", "Dr. Olayinka (CEO), Adetola (CFO/COO)", "Very high", "Very high", "Weekly 1:1s + Friday status"],
            ["Tech leads", "Dr. Tara (VR), Joshua (AI/Web)", "Very high", "High", "Daily async + weekly syncs"],
            ["Implementers", "Oluwatosin (Unity)", "Very high", "High", "Daily + weekly 1:1 + in-headset pairing"],
            ["Clinical", "Prof. Olaosun, external SMEs", "High", "Medium", "Bi-weekly CAB"],
            ["Advisors", "Dr. Janice, Gigi, Ayokunnu, Graham", "Medium", "Medium", "Monthly input via PM funnel"],
            ["External", "KCL, NHS trust champions, Meta", "High", "Medium", "Weekly during pilot"],
            ["Regulators", "ICO, MHRA, NHS Digital", "Lowâ€“Medium", "Very high (latent)", "Proactive posture"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Escalation Ladder</p>
        <NumberedList
          items={[
            "Team resolves in standup.",
            "PM arbitrates within 24h.",
            "PM + functional lead resolve within 48h.",
            "Escalate to CEO/COO for trade-off requiring budget, scope, or strategic change.",
            "Board-level only if regulatory, reputational, or >Â£25k cost implication.",
          ]}
        />

        <SubHeading id="sec-24">24. Clinical & Product Advisory Boards</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass p-5" style={{ borderLeft: "4px solid var(--primary)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--primary)" }}>Clinical Advisory Board (CAB)</p>
            <BulletList items={[
              "Chair: Prof. Adedayo Olaosun",
              "Cadence: Quarterly 90-minute meetings + ad-hoc scenario sign-offs",
              "Decision rights: Veto over scenario release; advise on clinical priority list; ratify learning objectives",
            ]} />
          </div>
          <div className="glass p-5" style={{ borderLeft: "4px solid var(--warning)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--warning)" }}>Product Advisory Board (PAB)</p>
            <BulletList items={[
              "Chair: Dr. Janice Turner",
              "Cadence: Monthly 60-minute session with PM",
              "Decision rights: Advisory; provide coaching and pattern recognition",
            ]} />
          </div>
        </div>

        <SubHeading id="sec-25">25. Hiring & Team Scaling Plan</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Current Team Assessment</p>
        <DataTable
          headers={["Role", "Coverage", "Risk"]}
          rows={[
            ["Unity / VR", "Oluwatosin solo", "High â€” key person dependency"],
            ["AI / Backend / Web", "Joshua solo", "High â€” key person dependency"],
            ["VR academic / UX", "Dr. Tara (part-time)", "Medium â€” capacity-bound"],
            ["Clinical content", "Dr. Olayinka + Prof. Olaosun", "High â€” founders own too much content"],
            ["QA", "Distributed informally", "High â€” no dedicated owner"],
            ["Customer success / sales", "Adetola (part)", "Medium"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Next 6 Hires (recommended sequence)</p>
        <NumberedList
          items={[
            "Clinical Content Designer â€” offloads scenario authoring from founders. Hire by end of Q2.",
            "QA / XR Test Engineer â€” owns test architecture + manual exploratory VR testing. Hire by Sprint 6.",
            "Senior Backend / Platform Engineer â€” reduces Joshua's SPOF; owns SRE, security, observability. Hire by Q3.",
            "Customer Success Manager â€” owns institutional onboarding and QBRs. Hire when 3rd pilot signs.",
            "Second Unity Developer â€” reduces Oluwatosin SPOF; enables parallel scenario work. Hire by Q4.",
            "DPO / Compliance Lead (can be fractional/outsourced initially) â€” owns DPIA, ROPA, DTAC, DSPT.",
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART VIII â€” ANALYTICS â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-viii">Part VIII â€” Analytics, KPIs & Learning</SectionHeading>

        <SubHeading id="sec-26">26. Analytics & Data Infrastructure</SubHeading>
        <Para>
          <strong>Recommended Stack:</strong> Unity telemetry â†’ Segment (or Rudderstack) â†’ Postgres (UK) â†’ dbt transformations â†’ Metabase for internal BI + Mixpanel for product analytics.
        </Para>
        <BulletList
          items={[
            "Event naming convention: object_action (e.g. module_started, ai_query_sent).",
            "Every event has: description, properties, PII flag, owner, added-by-ticket, added-in-version.",
            "New events require PR with tracking plan update before merging.",
            "Telemetry stream strictly separated from PII store. User IDs are hashed in telemetry.",
          ]}
        />

        <SubHeading id="sec-27">27. KPI Operating Model & Learning Outcomes</SubHeading>
        <Callout type="info">
          <strong>Proposed North Star:</strong> Weekly Competency-Minutes per Active Learner (W-CM/AL) â€” the sum of VR minutes weighted by competency gain, averaged across active learners per week. It forces the team to optimize learning-effective time-in-VR.
        </Callout>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Key KPIs</p>
        <DataTable
          headers={["Metric", "Definition", "Owner", "Target", "Alert"]}
          rows={[
            ["W-CM/AL", "Î£(session minutes Ã— competency delta) / active learners (week)", "PM", "â‰¥45 min/learner/wk", "<20"],
            ["Activation rate", "% of new learners completing 1 module within 7d", "PM", "â‰¥60%", "<40%"],
            ["Session completion", "Sessions completed / sessions started", "PM", "â‰¥85%", "<70%"],
            ["FPS stability", "% session time at â‰¥72 FPS", "Oluwatosin", "â‰¥99%", "<95%"],
            ["Crash rate", "Crashes / sessions", "AI/Web Lead", "<1%", ">2%"],
            ["API p95 latency", "p95 response time", "AI/Web Lead", "<500 ms", ">1 s"],
            ["Chat MoPT TTFT", "Time-to-first-token", "AI/Web Lead", "<2 s", ">4 s"],
            ["SSQ delta", "Post â€“ Pre Simulator Sickness score", "VR Lead", "<5", ">10"],
            ["Learner NPS", "Standard NPS on 3rd module", "PM", "â‰¥40", "<20"],
            ["ARR", "Contracted annual recurring revenue", "COO", "Plan-defined", "Miss >10%"],
            ["Gross margin", "(Revenue âˆ’ COGS) / Revenue", "COO", "â‰¥75%", "<65%"],
            ["Sprint say-do", "Points done / points committed", "PM", "â‰¥80%", "<60%"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Kirkpatrick Four-Level Mapping</p>
        <DataTable
          headers={["Level", "What We Measure", "How", "When"]}
          rows={[
            ["L1 â€” Reaction", "Satisfaction, presence, comfort", "NPS, CSAT, SSQ, IPQ short-form", "After every session"],
            ["L2 â€” Learning", "Knowledge & procedural competence", "Pre/post-sim scores, critical-error count, time-to-decision", "Per module"],
            ["L3 â€” Behavior", "Transfer to clinical practice", "Instructor observation scales, 360Â° feedback, OSCE deltas", "3â€“6 months post-training"],
            ["L4 â€” Results", "Patient & system outcomes", "Partner trust outcome data (adherence to protocol, incident rates)", "12+ months (aspirational)"],
          ]}
        />

        <SubHeading id="sec-28">28. Experimentation & Continuous Discovery</SubHeading>
        <Para>We are hypothesis-driven. Every non-trivial change is framed as: "We believe [change] will cause [outcome] for [persona]. We'll know we're right when [metric/evidence]."</Para>
        <BulletList
          items={[
            "Within-subject designs (same user tries variant A then B with wash-out).",
            "Qualitative paired comparisons and think-aloud.",
            "Diary studies for multi-session effects.",
            "Quantitative A/B only on the web dashboard side and for onboarding flows.",
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART IX â€” RISK â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-ix">Part IX â€” Risk, Crisis & Governance</SectionHeading>

        <SubHeading id="sec-29">29. Risk Register & Contingency Plans</SubHeading>
        <DataTable
          headers={["ID", "Category", "Risk", "P", "I", "Score", "Owner"]}
          rows={[
            ["R01", "Technical", "VR drops below 72 FPS", "M", "H", "12", "Oluwatosin"],
            ["R02", "Technical", "Wi-Fi loss mid-session â€” data loss", "H", "H", "16", "AI/Web Lead"],
            ["R03", "Product/Clinical", "Chat MoPT hallucinates clinical advice", "M", "C", "15", "AI/Web Lead + CSO"],
            ["R04", "Regulatory", "NHS buyer requires DTAC, we aren't ready", "H", "H", "16", "PM + DPO"],
            ["R05", "Data/Security", "PII breach", "L", "C", "10", "DPO"],
            ["R06", "Compliance", "GDPR complaint from user", "L", "H", "8", "DPO"],
            ["R07", "Clinical Safety", "Scenario teaches incorrect protocol", "L", "C", "10", "CSO"],
            ["R08", "Team", "Key-person dependency on Oluwatosin", "H", "H", "16", "COO"],
            ["R09", "Team", "AI/Web SPOF on Joshua", "M", "H", "12", "COO"],
            ["R10", "Commercial", "No institutional pilot signs", "M", "H", "12", "CEO + PM"],
            ["R11", "Market", "Competitor launches agentic AI first", "M", "M", "9", "PM"],
            ["R12", "Hardware", "Meta pushes breaking Quest OS update", "L", "M", "6", "VR Lead"],
            ["R13", "Supplier", "LLM vendor outage or policy change", "M", "H", "12", "AI/Web Lead"],
            ["R14", "Financial", "LLM token costs exceed margin", "M", "M", "9", "COO + AI Lead"],
            ["R15", "Reputational", "Negative viral clinician review", "L", "H", "8", "CEO"],
            ["R16", "IP", "Scenario IP contested by SME", "L", "M", "6", "Graham (IP) + PM"],
            ["R17", "Operational", "Hardware loss/damage at institution", "H", "L", "6", "CSM"],
            ["R18", "Ethical/AI", "Diagnostic bias in avatars/scenarios", "M", "H", "12", "PM + CAB"],
            ["R19", "Legal", "Institutional DPA friction delays launch", "M", "M", "9", "COO + Graham"],
            ["R20", "Content", "Scenario backlog bottleneck", "H", "M", "12", "PM"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Top 10 Contingency Plans</p>
        <NumberedList
          items={[
            "FPS collapse: triage PR, revert if new regression; strip environment assets; ship Beta on Quest 3 only.",
            "Data loss on sync: trigger local cache mode; ship reconcile job; publish clinician-facing note.",
            "AI clinical hallucination: flip ai.chat_mopt.enabled to false; fallback to deterministic PEARLS debrief; notify affected users.",
            "PII breach: Breach playbook (Section 30); containment, forensics, ICO 72h, customer comms, remediation.",
            "Key-person absence: activate break-glass contract with XR agency; access to ADR/docs ensures continuity.",
            "LLM vendor outage: route to secondary LLM; if both down, serve static debrief templates.",
            "DTAC block: run a 5-day DTAC acceleration sprint: PM owns evidence pack.",
            "Negative viral review: CEO personal response; offer refund + call; publish transparent post.",
            "Margin compression from LLM: enforce token caps per plan; add paywall for high-volume use.",
            "Scenario backlog: outsource 2 modules to pre-vetted clinical authors.",
          ]}
        />

        <SubHeading id="sec-30">30. Crisis Playbooks</SubHeading>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--danger)" }}>30.1 Data Breach Playbook</p>
        <DataTable
          headers={["Window", "Actions", "Owner"]}
          rows={[
            ["First 60 minutes", "Declare incident; Incident Commander named; containment (revoke keys, rotate secrets, isolate systems); forensics preserved.", "DPO + AI/Web Lead"],
            ["First 24 hours", "Scope determined; legal engaged (Graham); internal comms; prepare external comms.", "DPO + CEO"],
            ["Within 72 hours", "ICO notification if likely to result in risk to rights and freedoms; affected user comms; status page update.", "DPO"],
            ["Week 1â€“2", "Remediation deploy; blameless post-mortem; regulator follow-up; customer QBR.", "PM + DPO"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--danger)" }}>30.2 Chat MoPT Gives Dangerous Clinical Advice</p>
        <NumberedList
          items={[
            "Anyone can raise via #mopt-incident or in-VR bug report.",
            "On-call flips kill-switch within 15 minutes.",
            "Clinical Safety Officer reviews transcript and hazard log.",
            "Affected learners notified if the advice could cause negative learning transfer.",
            "Guardrail or prompt fix deployed; eval harness updated; red-team re-run.",
            "Public transparency note if incident was material.",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--danger)" }}>30.3â€“30.7 Additional Playbooks</p>
        <BulletList
          items={[
            "Clinician Injury or Severe Cybersickness: Institution's instructor follows in-person first response. Incident reported within 24h to CSO. Hazard log updated.",
            "App Lab / Meta Breaking Change: Detect via monitoring. Pin OS version via MDM. Hotfix branch, expedited review.",
            "Public PR Incident: CEO speaks, PM prepares facts. One-voice rule. Hold statement within 2h.",
            "Key Person Unavailability: Runbooks + ADRs + pairing reduce impact. Break-glass contractor list maintained by COO.",
            "Supplier Outage (LLM, Cloud): Abstract dependencies. Secondary vendor pre-contracted. Feature flags per dependency.",
          ]}
        />

        <Callout type="danger">
          <strong>Crisis Rule:</strong> Every crisis ends with: (1) blameless post-mortem, (2) at least one systemic fix, (3) a public or customer-facing communication proportional to impact, and (4) update to this pack.
        </Callout>

        <SubHeading id="sec-31">31. Decision Records & Governance</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>ADR Example</p>
        <CodeBlock>{`# ADR-0023: Use OAuth 2.0 Device Authorization Grant for VR login
Status: Accepted
Date: 2026-04-15
Context: Typing passwords in VR is high-friction and error-prone.
Decision: Adopt RFC 8628 Device Flow. Headset shows short code;
  user authenticates on mopt.co.uk/link on phone or PC.
Consequences: +UX simplicity, +security; requires device endpoint
  and short-code issuer; minor backend work.
Alternatives considered: username/password in VR, QR-code login,
  magic-link email.
Reversibility: Type 2 (reversible).`}</CodeBlock>

        <DataTable
          headers={["Body", "Chair", "Cadence", "Purpose"]}
          rows={[
            ["Product Council", "PM", "Weekly 60 min", "Sprint goals, risk review, prioritization"],
            ["Clinical Safety Group", "CSO", "Monthly 60 min", "Hazard log, scenario sign-offs, incidents"],
            ["Security & Privacy Council", "DPO", "Monthly 45 min", "DPIA status, DSPT, pentest findings"],
            ["Clinical Advisory Board", "Prof. Olaosun", "Quarterly 90 min", "Scenario roadmap, clinical strategy"],
            ["Product Advisory Board", "Dr. Janice Turner", "Monthly 60 min", "PM coaching, pattern recognition"],
          ]}
        />

        {/* â”€â”€â”€â”€â”€â”€ PART X â€” PERSONAL EXCELLENCE â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="part-x">Part X â€” Personal Excellence & Appendices</SectionHeading>

        <SubHeading id="sec-32">32. Personal Excellence, Growth & Anti-Patterns</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Weekly Self-Assessment Checklist</p>
        <BulletList
          items={[
            "Did I proactively unblock Oluwatosin and Joshua, or did I become a bottleneck?",
            "Are the next two sprints' tickets 100% DoR-compliant?",
            "Did I spend time with at least one real clinician this week?",
            "Did I review telemetry and learning outcome data, not just feature progress?",
            'Did I say a firm, kind "no" to a scope creep request?',
            "Did I translate founder intent into testable outcomes?",
            "Did I shield engineering from advisor noise while still extracting advisor value?",
            "Did I update the risk register and decision log for anything material?",
            "Did I check the guardrail metrics (crash, SSQ, AI refusal, ticket volume)?",
            "Did I ship one thing that made the team's operating system measurably better?",
            "Did I close the loop with a beta participant who gave feedback last week?",
            "Did I make progress on my own skill plan (clinical, XR, AI, regulatory)?",
            "Did I give specific, actionable praise to at least one teammate?",
            "Did I write less, decide more, and talk to more humans?",
            "Am I still optimizing for long-term trust with clinicians over short-term velocity?",
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Skill Development Plan</p>
        <DataTable
          headers={["Domain", "Why It Matters", "How I'll Build It"]}
          rows={[
            ["Clinical literacy", "Speak the users' language; earn clinician trust", "Shadow KCL neonatal ward; complete NHS e-learning on resus; monthly reading list curated by CAB"],
            ["XR UX", "Design decisions in VR are physical, not visual", "Meta Quest UI guidelines; XR Access; hands-on testing 1h/week; Tara mentorship"],
            ["AI / LLM systems", "Chat MoPT is core differentiator", "RAG patterns; LLM evals (Arize, Weights & Biases); AI safety reading"],
            ["Data analytics", "PM owns tracking plan and metric integrity", "SQL proficiency in Postgres; Metabase dashboards I build myself"],
            ["UK MedTech regulatory", "Unlocks NHS revenue", "MHRA guidance; DCB0129/0160; DTAC; NHS Digital playbook"],
            ["Commercial fluency", "Bridge product and revenue", "Pairing with Ayokunnu on unit economics; SaaS pricing literature"],
          ]}
        />

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--warning)" }}>Anti-Patterns Watchlist</p>
        <BulletList
          items={[
            "Hero mode: doing QA, design, and sprint master simultaneously.",
            "PM-as-Jira-admin: if I spend more time on tickets than talking to clinicians, I am failing.",
            "Premature optimization: building multiplayer before one clinician has completed one module.",
            "Pet features: shipping things I find cool instead of things the data demands.",
            "Advisor capture: letting the loudest advisor set the roadmap.",
            "False certainty: writing 50-page PRDs instead of shipping a 2-day prototype.",
            "Silence on risk: not surfacing bad news early and loudly to the CEO.",
            "Founder mode creep: overruling the CEO's intent without alignment.",
          ]}
        />

        <SubHeading id="sec-33">33. Master 47-Deliverables Tracker</SubHeading>
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Summary Counts</p>
        <DataTable
          headers={["Stream", "P0", "P1", "P2", "Total"]}
          rows={[
            ["VR", "10", "11", "6", "27"],
            ["Web", "5", "8", "0", "13"],
            ["LMS Integration", "7", "0", "0", "7"],
            ["Total", "22", "19", "6", "47"],
          ]}
        />
        <Para>
          <strong>Dependency Map (headline):</strong> Int-2 (API spec) â†’ Web-6, Web-8, VR-24, Int-4, Int-5. Int-3 (Auth) â†’ Web-3, Int-6. VR-5 (session schema) â†’ VR-24 â†’ Web-6 â†’ Web-9/10/11. Web-13 (DPIA/GDPR) gates all beta launch. VR-27 (clinical review) gates VR-13 (neonatal module) before beta.
        </Para>

        {/* â”€â”€â”€â”€â”€â”€ APPENDICES â”€â”€â”€â”€â”€â”€ */}
        <SectionHeading id="appendices">Appendices & Glossary</SectionHeading>

        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Appendix A â€” PRD Template (Short-Form)</p>
        <CodeBlock>{`# PRD: [Feature name]
Author: PM | Date: YYYY-MM-DD | Status: Draft|Ready|Shipped

1. Problem & user - Persona, JTBD, evidence.
2. Goals & non-goals
3. Success metrics (primary, guardrails)
4. User stories + acceptance criteria
5. UX notes (wireframes / Figma link)
6. Data & schema
7. Dependencies
8. Risks & open questions
9. Rollout plan & feature flag
10. Out of scope`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Appendix B â€” VR Feature Spec Template</p>
        <CodeBlock>{`## VR Feature Spec: [name]
Screen(s): [Splash|Welcome|Dashboard|Platform|Modules|...]
Input: controller / voice / gaze
Haptic profile: amplitude, frequency, duration
Comfort impact: locomotion? head motion? contraindication?
FPS budget: draw calls / tris / memory delta allowed
Analytics events: object_action list
Clinical review needed? Y/N. SME assigned: [name]
Accessibility: subtitle, left-hand, seated, colour-blind
Failure modes: HMD off, Wi-Fi drop, timeout, input error
Acceptance: bullet list`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Appendix C â€” ADR Template</p>
        <CodeBlock>{`# ADR-XXXX: [Title]
Status: Proposed | Accepted | Superseded
Context: what forces us to decide?
Decision: what we decided.
Consequences: what becomes easier, what becomes harder.
Alternatives: options considered.
Reversibility: Type 1 (one-way) | Type 2 (reversible).
Reviewers: who signed off.`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Appendix D â€” Experiment Template</p>
        <CodeBlock>{`Hypothesis:
Primary metric + direction + MDE:
Guardrail metrics:
Variant design:
Sample size / duration / decision rule:
Ethics / consent:
Rollback:
Decision after run: ship | iterate | kill`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Appendix E â€” Post-Mortem Template</p>
        <CodeBlock>{`Incident: [one-line summary]
Severity: S1 | S2 | S3
Timeline (UTC):
  - Detected:
  - Mitigated:
  - Resolved:
Impact (users, data, revenue, clinical):
Root cause(s):
Contributing factors:
What went well:
What went wrong:
Action items (owner, due, ticket):
Customer / regulator communication:`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Appendix F â€” Weekly Status Report Template</p>
        <CodeBlock>{`Subject: MoPT Product Sync â€” Sprint [X], Week [Y]
Health: [Green | Yellow | Red]
North Star this week: W-CM/AL = [value], vs target [target]

Wins: ...
Risks & blockers (with owner & ask): ...
Decisions made / needed: ...
Next week's top 3: ...

Metrics snapshot:
  Activation | Completion | FPS | Crash | AI sat | NPS`}</CodeBlock>

        <p className="text-xs font-bold uppercase tracking-wider mb-3 mt-6" style={{ color: "var(--primary)" }}>Glossary (Selected)</p>
        <DataTable
          headers={["Term", "Meaning"]}
          rows={[
            ["ADR", "Architecture Decision Record"],
            ["ARR", "Annual Recurring Revenue"],
            ["CAB", "Clinical Advisory Board"],
            ["CSO", "Clinical Safety Officer (DCB0129)"],
            ["DCB0129", "UK clinical risk management standard for manufacturers of health IT"],
            ["DPIA", "Data Protection Impact Assessment"],
            ["DSPT", "NHS Data Security and Protection Toolkit"],
            ["DTAC", "Digital Technology Assessment Criteria (NHS)"],
            ["Kirkpatrick", "4-level training evaluation model (Reaction, Learning, Behavior, Results)"],
            ["LMS", "Learning Management System"],
            ["MHRA", "UK Medicines and Healthcare products Regulatory Agency"],
            ["NPS", "Net Promoter Score"],
            ["OKR", "Objectives and Key Results"],
            ["PEARLS", "Promoting Excellence And Reflective Learning in Simulation (debrief framework)"],
            ["RAG", "Retrieval-Augmented Generation"],
            ["RBAC", "Role-Based Access Control"],
            ["RICE", "Reach Ã— Impact Ã— Confidence Ã· Effort prioritization"],
            ["SaMD", "Software as a Medical Device"],
            ["SSQ", "Simulator Sickness Questionnaire"],
            ["W-CM/AL", "Weekly Competency-Minutes per Active Learner (our North Star)"],
          ]}
        />

        {/* End Marker */}
        <div className="glass p-6 mt-12 text-center" style={{ borderTop: "4px solid var(--primary)" }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--primary)" }}>
            End of Document â€” Version 2.0
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            This Master Execution Pack v2.0 is the operating system for a world-class PM running MoPT. It is a living document. Review quarterly; update whenever a decision, risk, or metric changes materially.
          </p>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

