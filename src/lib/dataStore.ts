/**
 * MoPT Data Store — localStorage-backed CMS data layer
 * Provides CRUD for all content types + changelog tracking
 */

import { ALL_DELIVERABLES, ALL_RISKS, ALL_OKRS, TEAM_MEMBERS, SPRINT_PLAN } from "../data";

// ─── Types ───────────────────────────────────────────────

export interface Deliverable {
  id: string;
  stream: string;
  title: string;
  owner: string;
  priority: string;
  sprint: string;
  status: string;
  description: string;
}

export interface Risk {
  id: string;
  category: string;
  risk: string;
  score: number;
  owner: string;
  mitigation: string;
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: string[];
  owner: string;
}

export interface TeamMember {
  name: string;
  role: string;
  area: string;
}

export interface Sprint {
  sprint: string;
  theme: string;
  weeks: string;
  deliverables: string;
  exit: string;
}

export interface RoadmapItem {
  title: string;
  description: string;
}

export interface RoadmapData {
  now: RoadmapItem[];
  next: RoadmapItem[];
  later: RoadmapItem[];
}

export interface KPIMetric {
  label: string;
  value: string;
  unit: string;
  target: string;
  icon: string;
  color: string;
}

export interface Branding {
  title: string;
  subtitle: string;
}

export interface ChangelogEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: "create" | "update" | "delete";
  entity: string;
  entityId: string;
  entityTitle: string;
  changes: { field: string; oldValue: string; newValue: string }[];
}

export interface DataStoreShape {
  deliverables: Deliverable[];
  risks: Risk[];
  okrs: OKR[];
  team: TeamMember[];
  sprints: Sprint[];
  roadmap: RoadmapData;
  kpis: KPIMetric[];
  branding: Branding;
}

// ─── Default Data ────────────────────────────────────────

const DEFAULT_ROADMAP: RoadmapData = {
  now: [
    { title: "VR + LMS round-trip", description: "End-to-end data flow validated: complete a VR scenario, session data auto-submits to LMS backend, and appears on the web dashboard within 5 seconds. This is the foundational integration that proves our platform works as a connected system." },
    { title: "Device Auth flow", description: "OAuth 2.0 Device Authorization (RFC 8628) implementation. Clinicians pair their VR headset by entering a 6-digit code on their phone at mopt.co.uk/link — no typing on VR keyboards. Owned by Joshua." },
    { title: "Neonatal resus v1", description: "First complete clinical scenario: neonatal resuscitation with incubator, stethoscope, O2 administration, and medication interactions. Procedure graph authored by Dr. Olayinka, verified by Aladeojebi Adedotun Isaac. Must pass 72 FPS gate on Quest 3." },
    { title: "Chat MoPT debrief", description: "AI-powered post-scenario debrief using the PEARLS framework: Reactions → Description → Analysis → Summary. Uses the rule-based assessor's evidence trace — the AI explains, it doesn't judge. Temperature locked at 0.0 for clinical facts." },
    { title: "DPIA + Hazard Log", description: "Formal Data Protection Impact Assessment required before any real user data hits the database. Must be signed by Graham (IP/Legal). Hazard Log follows the DCB0129 standard for clinical risk management — both are mandatory for NHS procurement." },
    { title: "KCL Private Beta", description: "6-week Private Beta with 15–20 King's College London clinicians and 2 educators. Exit criteria: ≥80% session completion rate, NPS ≥40, ≥20% competency-score improvement across 3 attempts. This is our proof point for institutional value." },
  ],
  next: [
    { title: "Instructor dashboards", description: "Web dashboards for educators: cohort performance tables with red flags for students failing critical steps >2 times, drill-down to individual Chat MoPT transcripts, and module assignment tools. This is what makes institutions want to pay." },
    { title: "Cohort analytics", description: "Aggregated analytics across a class or institution: average scores, completion rates, common failure points, time-to-competency trends. Provides the ROI evidence NHS training directors need for procurement approval." },
    { title: "Scenario authoring v1", description: "Standardized pipeline for creating new clinical modules: SME intake → storyboard → VR build → clinical review → versioned release. Goal: produce 1 new module every 6 weeks. Hire Clinical Content Designer to run the pipeline." },
    { title: "2nd + 3rd modules", description: "Expand beyond neonatal resuscitation to adult Advanced Life Support (ALS) and sepsis recognition scenarios. Each follows the same procedure graph → assessor → telemetry → debrief pipeline. Verified by Aladeojebi Adedotun Isaac." },
    { title: "SSO (SAML/OIDC) for institutions", description: "Single Sign-On integration so NHS trusts and universities can use their existing identity systems. Eliminates the need for clinicians to create separate MoPT accounts — reduces onboarding friction for institutional buyers." },
    { title: "Self-serve billing", description: "Automated billing system for the £21/£31 per month consumer plans and institutional seat management. Reduces COO overhead and enables self-service institutional purchasing without manual invoicing." },
  ],
  later: [
    { title: "Multi-specialty library", description: "Expand beyond emergency medicine to cover paediatric anaphylaxis, obstetric emergencies, airway management, and more. Each specialty requires dedicated SME partnerships and content agreements with IP ownership clarity." },
    { title: "International (Nigeria, UAE)", description: "Internationalization prep: localized clinical guidelines (not just language), regional regulatory compliance, local payment processors, and potential partnerships with medical schools in Lagos and Dubai." },
    { title: "Pico/Vision Pro support", description: "Expand hardware support beyond Meta Quest to Pico headsets (popular in enterprise) and Apple Vision Pro. Requires significant rendering optimization and platform-specific UI adaptation for each device." },
    { title: "Peer-reviewed outcome study", description: "Publish Kirkpatrick L3 evidence in a peer-reviewed medical education journal. Requires 3-6 month longitudinal data from beta cohorts showing transfer of VR training to actual clinical practice." },
    { title: "ISO 27001 certification", description: "Enterprise-grade information security certification. Required by many large NHS trusts and international institutions for procurement. Stage 1 readiness begins in Q4, full certification targeted for following year." },
    { title: "Scenario marketplace for SMEs", description: "Platform where external Subject Matter Experts can author, publish, and earn royalties from clinical scenarios they create. Transforms MoPT from a product into a platform ecosystem." },
  ],
};

const DEFAULT_KPIS: KPIMetric[] = [
  { label: "FPS Stability", value: "≥72", unit: "FPS", target: "≥99% session time", icon: "Gauge", color: "var(--success)" },
  { label: "Crash Rate", value: "<1%", unit: "", target: "Alert if >2%", icon: "Activity", color: "var(--danger)" },
  { label: "API Latency", value: "<500", unit: "ms p95", target: "Alert if >1s", icon: "Zap", color: "var(--warning)" },
  { label: "Activation Rate", value: "≥60%", unit: "", target: "First module in 7 days", icon: "TrendingUp", color: "var(--primary)" },
  { label: "Session Completion", value: "≥85%", unit: "", target: "Started vs completed", icon: "CheckCircle2", color: "var(--success)" },
  { label: "Learner NPS", value: "≥40", unit: "", target: "Measured on 3rd module", icon: "Users", color: "var(--primary)" },
  { label: "Gross Margin", value: "≥75%", unit: "", target: "After LLM costs", icon: "TrendingUp", color: "var(--success)" },
  { label: "Sprint Say-Do", value: "≥80%", unit: "", target: "Points done/committed", icon: "Shield", color: "var(--warning)" },
];

const DEFAULT_BRANDING: Branding = {
  title: "MoPT",
  subtitle: "Product Roadmap",
};

// ─── Storage Keys ────────────────────────────────────────

const STORE_KEY = "mopt_data_store";
const CHANGELOG_KEY = "mopt_changelog";

// ─── Core Functions ──────────────────────────────────────

function getDefaults(): DataStoreShape {
  return {
    deliverables: ALL_DELIVERABLES.map((d) => ({ ...d })),
    risks: ALL_RISKS.map((r) => ({ ...r })),
    okrs: ALL_OKRS.map((o) => ({ ...o, keyResults: [...o.keyResults] })),
    team: TEAM_MEMBERS.map((t) => ({ ...t })),
    sprints: SPRINT_PLAN.map((s) => ({ ...s })),
    roadmap: JSON.parse(JSON.stringify(DEFAULT_ROADMAP)),
    kpis: DEFAULT_KPIS.map((k) => ({ ...k })),
    branding: { ...DEFAULT_BRANDING },
  };
}

export function getStore(): DataStoreShape {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DataStoreShape;
      // Ensure all keys exist (handle store upgrades)
      const defaults = getDefaults();
      return {
        deliverables: parsed.deliverables ?? defaults.deliverables,
        risks: parsed.risks ?? defaults.risks,
        okrs: parsed.okrs ?? defaults.okrs,
        team: parsed.team ?? defaults.team,
        sprints: parsed.sprints ?? defaults.sprints,
        roadmap: parsed.roadmap ?? defaults.roadmap,
        kpis: parsed.kpis ?? defaults.kpis,
        branding: parsed.branding ?? defaults.branding,
      };
    }
  } catch {
    // If localStorage is corrupted, fall back to defaults
  }
  return getDefaults();
}

function saveStore(store: DataStoreShape): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// ─── Changelog ───────────────────────────────────────────

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getChangelog(): ChangelogEntry[] {
  try {
    const raw = localStorage.getItem(CHANGELOG_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveChangelog(entries: ChangelogEntry[]): void {
  localStorage.setItem(CHANGELOG_KEY, JSON.stringify(entries));
}

export function logChange(
  admin: string,
  action: "create" | "update" | "delete",
  entity: string,
  entityId: string,
  entityTitle: string,
  changes: { field: string; oldValue: string; newValue: string }[]
): void {
  const changelog = getChangelog();
  changelog.unshift({
    id: generateId(),
    timestamp: new Date().toISOString(),
    admin,
    action,
    entity,
    entityId,
    entityTitle,
    changes,
  });
  saveChangelog(changelog);
}

// ─── Deliverables CRUD ──────────────────────────────────

export function updateDeliverable(admin: string, id: string, updates: Partial<Deliverable>): DataStoreShape {
  const store = getStore();
  const idx = store.deliverables.findIndex((d) => d.id === id);
  if (idx === -1) return store;

  const old = store.deliverables[idx];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  store.deliverables[idx] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "Deliverable", id, old.title, changes);
  return store;
}

export function addDeliverable(admin: string, item: Deliverable): DataStoreShape {
  const store = getStore();
  store.deliverables.push(item);
  saveStore(store);
  logChange(admin, "create", "Deliverable", item.id, item.title, [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteDeliverable(admin: string, id: string): DataStoreShape {
  const store = getStore();
  const item = store.deliverables.find((d) => d.id === id);
  store.deliverables = store.deliverables.filter((d) => d.id !== id);
  saveStore(store);
  if (item) logChange(admin, "delete", "Deliverable", id, item.title, []);
  return store;
}

// ─── Risks CRUD ─────────────────────────────────────────

export function updateRisk(admin: string, id: string, updates: Partial<Risk>): DataStoreShape {
  const store = getStore();
  const idx = store.risks.findIndex((r) => r.id === id);
  if (idx === -1) return store;

  const old = store.risks[idx];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  store.risks[idx] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "Risk", id, old.risk.slice(0, 60), changes);
  return store;
}

export function addRisk(admin: string, item: Risk): DataStoreShape {
  const store = getStore();
  store.risks.push(item);
  saveStore(store);
  logChange(admin, "create", "Risk", item.id, item.risk.slice(0, 60), [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteRisk(admin: string, id: string): DataStoreShape {
  const store = getStore();
  const item = store.risks.find((r) => r.id === id);
  store.risks = store.risks.filter((r) => r.id !== id);
  saveStore(store);
  if (item) logChange(admin, "delete", "Risk", id, item.risk.slice(0, 60), []);
  return store;
}

// ─── OKRs CRUD ──────────────────────────────────────────

export function updateOKR(admin: string, id: string, updates: Partial<OKR>): DataStoreShape {
  const store = getStore();
  const idx = store.okrs.findIndex((o) => o.id === id);
  if (idx === -1) return store;

  const old = store.okrs[idx];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  if (updates.objective && updates.objective !== old.objective) {
    changes.push({ field: "objective", oldValue: old.objective, newValue: updates.objective });
  }
  if (updates.owner && updates.owner !== old.owner) {
    changes.push({ field: "owner", oldValue: old.owner, newValue: updates.owner });
  }
  if (updates.keyResults) {
    const oldKR = old.keyResults.join(" | ");
    const newKR = updates.keyResults.join(" | ");
    if (oldKR !== newKR) {
      changes.push({ field: "keyResults", oldValue: oldKR, newValue: newKR });
    }
  }

  store.okrs[idx] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "OKR", id, old.objective, changes);
  return store;
}

// ─── Team CRUD ──────────────────────────────────────────

export function updateTeamMember(admin: string, index: number, updates: Partial<TeamMember>): DataStoreShape {
  const store = getStore();
  if (index < 0 || index >= store.team.length) return store;

  const old = store.team[index];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  store.team[index] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "Team Member", String(index), old.name, changes);
  return store;
}

export function addTeamMember(admin: string, member: TeamMember): DataStoreShape {
  const store = getStore();
  store.team.push(member);
  saveStore(store);
  logChange(admin, "create", "Team Member", String(store.team.length - 1), member.name, [
    { field: "all", oldValue: "", newValue: JSON.stringify(member) },
  ]);
  return store;
}

export function deleteTeamMember(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const member = store.team[index];
  store.team.splice(index, 1);
  saveStore(store);
  if (member) logChange(admin, "delete", "Team Member", String(index), member.name, []);
  return store;
}

// ─── Sprints CRUD ───────────────────────────────────────

export function updateSprint(admin: string, index: number, updates: Partial<Sprint>): DataStoreShape {
  const store = getStore();
  if (index < 0 || index >= store.sprints.length) return store;

  const old = store.sprints[index];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  store.sprints[index] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "Sprint", old.sprint, `Sprint ${old.sprint}: ${old.theme}`, changes);
  return store;
}

export function addSprint(admin: string, sprint: Sprint): DataStoreShape {
  const store = getStore();
  store.sprints.push(sprint);
  saveStore(store);
  logChange(admin, "create", "Sprint", sprint.sprint, `Sprint ${sprint.sprint}: ${sprint.theme}`, [
    { field: "all", oldValue: "", newValue: JSON.stringify(sprint) },
  ]);
  return store;
}

export function deleteSprint(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const sprint = store.sprints[index];
  store.sprints.splice(index, 1);
  saveStore(store);
  if (sprint) logChange(admin, "delete", "Sprint", sprint.sprint, `Sprint ${sprint.sprint}: ${sprint.theme}`, []);
  return store;
}

// ─── Roadmap CRUD ───────────────────────────────────────

export function updateRoadmapItem(
  admin: string,
  lane: "now" | "next" | "later",
  index: number,
  updates: Partial<RoadmapItem>
): DataStoreShape {
  const store = getStore();
  const items = store.roadmap[lane];
  if (index < 0 || index >= items.length) return store;

  const old = items[index];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  items[index] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", `Roadmap (${lane})`, String(index), old.title, changes);
  return store;
}

export function addRoadmapItem(admin: string, lane: "now" | "next" | "later", item: RoadmapItem): DataStoreShape {
  const store = getStore();
  store.roadmap[lane].push(item);
  saveStore(store);
  logChange(admin, "create", `Roadmap (${lane})`, String(store.roadmap[lane].length - 1), item.title, [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteRoadmapItem(admin: string, lane: "now" | "next" | "later", index: number): DataStoreShape {
  const store = getStore();
  const item = store.roadmap[lane][index];
  store.roadmap[lane].splice(index, 1);
  saveStore(store);
  if (item) logChange(admin, "delete", `Roadmap (${lane})`, String(index), item.title, []);
  return store;
}

// ─── KPIs CRUD ──────────────────────────────────────────

export function updateKPI(admin: string, index: number, updates: Partial<KPIMetric>): DataStoreShape {
  const store = getStore();
  if (index < 0 || index >= store.kpis.length) return store;

  const old = store.kpis[index];
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  for (const [key, newVal] of Object.entries(updates)) {
    const oldVal = (old as Record<string, unknown>)[key];
    if (oldVal !== newVal) {
      changes.push({ field: key, oldValue: String(oldVal), newValue: String(newVal) });
    }
  }

  store.kpis[index] = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "KPI", String(index), old.label, changes);
  return store;
}

export function addKPI(admin: string, kpi: KPIMetric): DataStoreShape {
  const store = getStore();
  store.kpis.push(kpi);
  saveStore(store);
  logChange(admin, "create", "KPI", String(store.kpis.length - 1), kpi.label, [
    { field: "all", oldValue: "", newValue: JSON.stringify(kpi) },
  ]);
  return store;
}

export function deleteKPI(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const kpi = store.kpis[index];
  store.kpis.splice(index, 1);
  saveStore(store);
  if (kpi) logChange(admin, "delete", "KPI", String(index), kpi.label, []);
  return store;
}

// ─── Branding ───────────────────────────────────────────

export function updateBranding(admin: string, updates: Partial<Branding>): DataStoreShape {
  const store = getStore();
  const old = store.branding;
  const changes: { field: string; oldValue: string; newValue: string }[] = [];

  if (updates.title && updates.title !== old.title) {
    changes.push({ field: "title", oldValue: old.title, newValue: updates.title });
  }
  if (updates.subtitle && updates.subtitle !== old.subtitle) {
    changes.push({ field: "subtitle", oldValue: old.subtitle, newValue: updates.subtitle });
  }

  store.branding = { ...old, ...updates };
  saveStore(store);
  if (changes.length > 0) logChange(admin, "update", "Branding", "branding", "Site Branding", changes);
  return store;
}

// ─── Export / Import / Reset ────────────────────────────

export function exportData(): string {
  return JSON.stringify({ store: getStore(), changelog: getChangelog() }, null, 2);
}

export function importData(json: string): DataStoreShape {
  const parsed = JSON.parse(json);
  if (parsed.store) {
    saveStore(parsed.store);
    if (parsed.changelog) saveChangelog(parsed.changelog);
    return parsed.store;
  }
  throw new Error("Invalid data format");
}

export function resetToDefaults(admin: string): DataStoreShape {
  const defaults = getDefaults();
  saveStore(defaults);
  logChange(admin, "update", "System", "reset", "Full Data Reset", [
    { field: "action", oldValue: "custom data", newValue: "factory defaults restored" },
  ]);
  return defaults;
}
