/**
 * MoPT Monthly Report Data
 * Mock dataset for team monthly reports + types for submitted reports.
 * Submitted reports are merged with mock data at read time.
 */

// ─── Types ───────────────────────────────────────────────

export interface SelfEval {
  vrModule: number;
  vrEnv: number;
  haptic: number;
  aiFeedback: number;
  computerVision: number;
  skillsIntel: number;
  agenticAI: number;
  softwareEng: number;
  lmsIntegration: number;
  innovation: number;
  collaboration: number;
  creativity: number;
  codingLearning: number;
  professionalDev: number;
}

export interface TeamReport {
  id: string;
  memberId: string;
  name: string;
  role: string;
  avatar: string;
  team: string;
  month: string;
  year: string;
  selfEval: SelfEval;
  hoursLogged: number;
  tasksCompleted: number;
  modulesWorked: string[];
  innovationIdeas: number;
  experimentsCompleted: number;
  meetingsAttended: number;
  cpHours: number;
  blockersResolved: number;
  crossTeamCollabs: number;
  keyAchievement: string;
  nextMonthFocus: string;
  // New: aligned with form §11 (Forward Planning) and §12 (Wellbeing)
  priorities: string[]; // up to 3, mapped to form §11.1 Next Month Objectives
  overallRating: number; // 1-5, separate from category ratings (form §10 bottom)
  wellbeingScore: number; // 1-5, derived from §12 Wellbeing & Workload
  blockerNote?: string; // §11.2 known blockers
  submittedAt: string;
  isSubmitted: boolean; // true if user-submitted via form, false if mock
}

// ─── Team Roster ─────────────────────────────────────────

export interface TeamMemberInfo {
  id: string;
  name: string;
  shortName: string;
  role: string;
  area: string;
  avatar: string;
}

export const TEAM_ROSTER: TeamMemberInfo[] = [
  { id: "aladeojebi", name: "Aladeojebi Adedotun Isaac", shortName: "Aladeojebi", role: "Medical Verifier / Clinical Safety", area: "Clinical", avatar: "AI" },
  { id: "alexander", name: "Alexander Olaiya", shortName: "Alexander", role: "ML / AI Engineer", area: "AI/ML", avatar: "AO" },
  { id: "evelyn", name: "Evelyn Ogungbemi", shortName: "Evelyn", role: "Clinical Fellow", area: "Clinical", avatar: "EO" },
  { id: "iyobosa", name: "Iyobosa Rehoboth", shortName: "Iyobosa", role: "Product Manager", area: "Product", avatar: "IR" },
  { id: "joshua", name: "Joshua A.", shortName: "Joshua", role: "VR / Tech Lead", area: "Engineering", avatar: "JA" },
  { id: "matt", name: "Matt", shortName: "Matt", role: "ML/AI Engineer (Classical ML & CV)", area: "AI/ML", avatar: "MT" },
  { id: "moyowa", name: "Moyowa Etchie", shortName: "Moyowa", role: "Software Engineer", area: "Engineering", avatar: "ME" },
  { id: "olayinka", name: "Dr. Olayinka Kowobari", shortName: "Olayinka", role: "CEO / Clinical Lead", area: "Leadership", avatar: "OK" },
  { id: "olorunfemi", name: "Olorunfemi Jessy-Moses", shortName: "Olorunfemi", role: "Operations Lead", area: "Operations", avatar: "OJ" },
  { id: "tola", name: "Adetola", shortName: "Tola", role: "CFO / COO", area: "Leadership", avatar: "TO" },
];

// ─── Eval labels + OKR mapping ────────────────────────────

export interface EvalLabel {
  key: keyof SelfEval;
  label: string;
  okr: "O1" | "O2" | "O3" | "TEAM";
  color: string;
}

export const EVAL_LABELS: EvalLabel[] = [
  { key: "vrModule", label: "VR Module Dev", okr: "O2", color: "#6366f1" },
  { key: "vrEnv", label: "VR Environment", okr: "O3", color: "#8b5cf6" },
  { key: "haptic", label: "Haptic / Hardware", okr: "O3", color: "#a855f7" },
  { key: "aiFeedback", label: "AI Feedback Engine", okr: "O2", color: "#10b981" },
  { key: "computerVision", label: "Computer Vision", okr: "O2", color: "#06b6d4" },
  { key: "skillsIntel", label: "Skills Intelligence", okr: "O2", color: "#0ea5e9" },
  { key: "agenticAI", label: "Agentic AI / NLP", okr: "O3", color: "#3b82f6" },
  { key: "softwareEng", label: "Software Engineering", okr: "O1", color: "#f59e0b" },
  { key: "lmsIntegration", label: "LMS / Privacy / API", okr: "O1", color: "#f97316" },
  { key: "innovation", label: "Innovation & R&D", okr: "O3", color: "#ef4444" },
  { key: "collaboration", label: "Team Collaboration", okr: "TEAM", color: "#ec4899" },
  { key: "creativity", label: "Creativity & Design", okr: "TEAM", color: "#14b8a6" },
  { key: "codingLearning", label: "Technical Learning", okr: "TEAM", color: "#84cc16" },
  { key: "professionalDev", label: "Professional Dev", okr: "TEAM", color: "#22c55e" },
];

export const OKR_INFO: Record<string, { title: string; subtitle: string; color: string; bg: string }> = {
  O1: {
    title: "O1 · NHS Readiness",
    subtitle: "Earn the right to sell to the NHS",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
  },
  O2: {
    title: "O2 · Clinical Outcomes",
    subtitle: "Prove learning outcomes in a clinical cohort",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  O3: {
    title: "O3 · Scalable Platform",
    subtitle: "Build a commercial, scalable platform",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
  },
  TEAM: {
    title: "Team Health",
    subtitle: "Cross-cutting culture & capability metrics",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
};

// ─── Mock data generation ────────────────────────────────

const MONTHS = ["January", "February", "March", "April"];

// ─── Clinical Modules ────────────────────────────────────
// Aligned with codebase:
//   - Documentation §10.3 "Initial Clinical Testbeds" (ETI primary, IV Cannulation secondary)
//   - Sprint 2 plan: Neonatal Resus scene
//   - Roadmap "next": Adult ALS, Sepsis Recognition as 2nd + 3rd modules
//
// MODULES_ACTIVE = the 3 modules being worked on this sprint
// MODULES_PIPELINE = next up (referenced for forward planning visibility)

export interface ModuleInfo {
  name: string;
  stage: "active" | "pipeline";
  description: string;
}

export const MODULES_ACTIVE: ModuleInfo[] = [
  { name: "Neonatal Resuscitation", stage: "active", description: "Sprint 2 deliverable; incubator, stethoscope, O2 + medications" },
  { name: "Endotracheal Intubation (ETI)", stage: "active", description: "Most mature module context (Doc §10.3)" },
  { name: "IV Cannulation", stage: "active", description: "Next candidate for procedure graph formalisation" },
];

export const MODULES_PIPELINE: ModuleInfo[] = [
  { name: "Adult ALS", stage: "pipeline", description: "Planned 2nd module (Roadmap next lane)" },
  { name: "Sepsis Recognition", stage: "pipeline", description: "Planned 3rd module (Roadmap next lane)" },
];

export const ALL_MODULES: ModuleInfo[] = [...MODULES_ACTIVE, ...MODULES_PIPELINE];

const MODULE_NAMES = ALL_MODULES.map((m) => m.name);
const ACTIVE_MODULE_NAMES = MODULES_ACTIVE.map((m) => m.name);

const ACHIEVEMENTS = [
  "Completed end-to-end VR session data pipeline",
  "Shipped Neonatal Resuscitation module v1",
  "Procedure graph signed off for Endotracheal Intubation",
  "Reduced AI inference latency by 40%",
  "Implemented OAuth 2.0 Device Auth flow",
  "Achieved 72 FPS on Quest 3 consistently",
  "Launched Chat MoPT debrief prototype",
  "Delivered DPIA documentation for beta",
  "Built cohort analytics dashboard wireframes",
  "Optimised tissue simulation physics for IV Cannulation",
  "Completed LMS data contract specification",
  "Authored Skills Index (ECR / ERR / T2C / CLR) calculation spec",
];

const NEXT_FOCUS = [
  "Spatial UI menu finalisation",
  "Neonatal module clinician sign-off",
  "MoPT Mentor scoring engine v2",
  "Skills Intelligence dashboard API",
  "Session replay infrastructure",
  "VR environment lighting pass for ETI",
  "Beta environment provisioning",
  "Onboarding flow UX research",
  "RAG pipeline for Chat MoPT",
  "E2E regression test suite",
  "IV Cannulation procedure graph build",
  "DTAC documentation pack submission",
];

// Stable pseudo-random based on seed for reproducible mock data
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pickModules(rng: () => number): string[] {
  // Most members touch 1-3 modules. Heavily bias active modules (this sprint),
  // with a small chance of touching a pipeline module (forward planning).
  const out: string[] = [];
  for (const m of ACTIVE_MODULE_NAMES) {
    if (rng() < 0.6) out.push(m);
  }
  // Small probability of pipeline involvement
  for (const m of MODULE_NAMES.filter((n) => !ACTIVE_MODULE_NAMES.includes(n))) {
    if (rng() < 0.15) out.push(m);
  }
  // Ensure at least one module
  if (out.length === 0) out.push(ACTIVE_MODULE_NAMES[Math.floor(rng() * ACTIVE_MODULE_NAMES.length)]);
  return out;
}

function generateEval(rng: () => number, area: string, monthIdx: number): SelfEval {
  // Bias scores by area so each member has a believable specialism
  const r = (mean: number) => Math.max(1, Math.min(5, Math.round(mean + (rng() - 0.5) * 1.4 + monthIdx * 0.15)));
  const high = 3.8, mid = 3.2, low = 2.5;
  const isAI = area === "AI/ML";
  const isEng = area === "Engineering";
  const isClin = area === "Clinical";
  const isLead = area === "Leadership";
  const isDesign = area === "Design";
  const isProduct = area === "Product";
  const isOps = area === "Operations";

  return {
    vrModule: r(isEng ? high : isClin ? high : isProduct ? mid : mid),
    vrEnv: r(isEng ? high : isDesign ? high : low),
    haptic: r(isEng ? mid : low),
    aiFeedback: r(isAI ? high : mid),
    computerVision: r(isAI ? high : low),
    skillsIntel: r(isAI ? mid : isLead ? high : isProduct ? mid : mid),
    agenticAI: r(isAI ? high : mid),
    softwareEng: r(isEng ? high : mid),
    lmsIntegration: r(isEng ? high : isLead ? mid : isProduct ? mid : low),
    innovation: r(isLead ? high : isAI ? high : isProduct ? high : isOps ? mid : mid),
    collaboration: r(isLead ? high : isProduct ? high : isOps ? high : high),
    creativity: r(isDesign ? high : isClin ? mid : isProduct ? mid : mid),
    codingLearning: r(isEng ? high : isAI ? high : isProduct ? mid : mid),
    professionalDev: r(high),
  };
}

const PRIORITY_OPTIONS = [
  "Ship Neonatal Resus v1 to clinician review",
  "Lock procedure graph for ETI with Aladeojebi sign-off",
  "Deliver Skills Intelligence dashboard API contract",
  "Spatial UI menu finalisation across 11 screens",
  "Reduce LLM cost-per-session by 25%",
  "Complete DPIA evidence pack for DTAC submission",
  "Achieve 72 FPS guarantee on Quest 3 across all scenes",
  "Wire up Chat MoPT RAG baseline",
  "Build E2E regression test harness",
  "Author IV Cannulation telemetry spec",
  "Ship cohort analytics MVP for instructor view",
  "Stand up CI/CD for Unity App Lab Beta channel",
];

function pickPriorities(rng: () => number): string[] {
  const shuffled = [...PRIORITY_OPTIONS].sort(() => rng() - 0.5);
  return shuffled.slice(0, 3);
}

function generateReport(member: TeamMemberInfo, monthIdx: number): TeamReport {
  const seed = member.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) * (monthIdx + 1);
  const rng = seeded(seed);
  const selfEval = generateEval(rng, member.area, monthIdx);
  const avgEval = Object.values(selfEval).reduce((a, b) => a + b, 0) / 14;

  return {
    id: `${member.id}-${monthIdx}`,
    memberId: member.id,
    name: member.name,
    role: member.role,
    avatar: member.avatar,
    team: member.area,
    month: MONTHS[monthIdx],
    year: "2026",
    selfEval,
    hoursLogged: Math.floor(rng() * 60) + 130 + monthIdx * 4,
    tasksCompleted: Math.floor(rng() * 25) + 18 + monthIdx * 2,
    modulesWorked: pickModules(rng),
    innovationIdeas: Math.floor(rng() * 4) + 1,
    experimentsCompleted: Math.floor(rng() * 3),
    meetingsAttended: Math.floor(rng() * 8) + 10,
    cpHours: Math.floor(rng() * 12) + 6,
    blockersResolved: Math.floor(rng() * 6) + 2,
    crossTeamCollabs: Math.floor(rng() * 5) + 2,
    keyAchievement: ACHIEVEMENTS[Math.floor(rng() * ACHIEVEMENTS.length)],
    nextMonthFocus: NEXT_FOCUS[Math.floor(rng() * NEXT_FOCUS.length)],
    priorities: pickPriorities(rng),
    overallRating: Math.max(1, Math.min(5, Math.round(avgEval + (rng() - 0.5) * 0.6))),
    wellbeingScore: Math.max(1, Math.min(5, Math.round(3.6 + (rng() - 0.5) * 1.8))),
    submittedAt: new Date(2026, monthIdx, 1).toISOString(),
    isSubmitted: false,
  };
}

export function generateMockReports(): TeamReport[] {
  const reports: TeamReport[] = [];
  for (let m = 0; m < MONTHS.length; m++) {
    for (const member of TEAM_ROSTER) {
      reports.push(generateReport(member, m));
    }
  }
  return reports;
}

export const REPORT_MONTHS = MONTHS;

// ─── OKR scoring helpers ──────────────────────────────────

export function getOKRScore(reports: TeamReport[], okr: "O1" | "O2" | "O3" | "TEAM"): number {
  const keys = EVAL_LABELS.filter((l) => l.okr === okr).map((l) => l.key);
  if (reports.length === 0 || keys.length === 0) return 0;
  let sum = 0, n = 0;
  for (const r of reports) {
    for (const k of keys) {
      sum += r.selfEval[k];
      n++;
    }
  }
  return n > 0 ? sum / n : 0;
}

export function getTeamAverage(reports: TeamReport[]): number {
  if (reports.length === 0) return 0;
  let sum = 0, n = 0;
  for (const r of reports) {
    const vals = Object.values(r.selfEval);
    sum += vals.reduce((a, b) => a + b, 0);
    n += vals.length;
  }
  return n > 0 ? sum / n : 0;
}
