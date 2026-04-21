/**
 * MoPT Data Store — Supabase cloud-backed CMS data layer
 * Uses an in-memory cache for fast synchronous reads.
 * All writes persist to Supabase (cloud) + update local cache.
 * Falls back to localStorage if Supabase is unreachable.
 */

import { supabase } from "./supabase";
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
    { title: "VR + LMS round-trip", description: "End-to-end data flow validated: complete a VR scenario, session data auto-submits to LMS backend, and appears on the web dashboard within 5 seconds." },
    { title: "Device Auth flow", description: "OAuth 2.0 Device Authorization (RFC 8628) implementation. Clinicians pair their VR headset by entering a 6-digit code on their phone at mopt.co.uk/link." },
    { title: "Neonatal resus v1", description: "First complete clinical scenario: neonatal resuscitation with incubator, stethoscope, O2 administration, and medication interactions." },
    { title: "Chat MoPT debrief", description: "AI-powered post-scenario debrief using the PEARLS framework: Reactions → Description → Analysis → Summary." },
    { title: "DPIA + Hazard Log", description: "Formal Data Protection Impact Assessment and DCB0129 Hazard Log — both mandatory for NHS procurement." },
    { title: "KCL Private Beta", description: "6-week Private Beta with 15–20 King's College London clinicians and 2 educators." },
  ],
  next: [
    { title: "Instructor dashboards", description: "Web dashboards for educators: cohort performance tables, drill-down to individual Chat MoPT transcripts, and module assignment tools." },
    { title: "Cohort analytics", description: "Aggregated analytics across a class or institution: average scores, completion rates, common failure points." },
    { title: "Scenario authoring v1", description: "Standardized pipeline for creating new clinical modules: SME intake → storyboard → VR build → clinical review → versioned release." },
    { title: "2nd + 3rd modules", description: "Expand beyond neonatal resuscitation to adult ALS and sepsis recognition scenarios." },
    { title: "SSO (SAML/OIDC) for institutions", description: "Single Sign-On integration so NHS trusts and universities can use their existing identity systems." },
    { title: "Self-serve billing", description: "Automated billing system for the £21/£31 per month consumer plans and institutional seat management." },
  ],
  later: [
    { title: "Multi-specialty library", description: "Expand beyond emergency medicine to cover paediatric anaphylaxis, obstetric emergencies, airway management, and more." },
    { title: "International (Nigeria, UAE)", description: "Internationalization prep: localized clinical guidelines, regional regulatory compliance, local payment processors." },
    { title: "Pico/Vision Pro support", description: "Expand hardware support beyond Meta Quest to Pico headsets and Apple Vision Pro." },
    { title: "Peer-reviewed outcome study", description: "Publish Kirkpatrick L3 evidence in a peer-reviewed medical education journal." },
    { title: "ISO 27001 certification", description: "Enterprise-grade information security certification. Required by many large NHS trusts." },
    { title: "Scenario marketplace for SMEs", description: "Platform where external Subject Matter Experts can author, publish, and earn royalties from clinical scenarios." },
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

// ─── In-Memory Cache ─────────────────────────────────────
// This cache provides fast synchronous reads while Supabase
// handles persistence. All UI components read from this cache.

let _cache: DataStoreShape | null = null;
let _changelogCache: ChangelogEntry[] = [];
let _initialized = false;

// ─── Realtime Change Listeners ───────────────────────────
// Components register callbacks to be notified when cloud data changes.
type StoreChangeCallback = (data: DataStoreShape) => void;
const _listeners: Set<StoreChangeCallback> = new Set();

/** Register a callback that fires whenever cloud data changes (from any session). */
export function onStoreChange(cb: StoreChangeCallback): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function _notifyListeners(): void {
  if (_cache) {
    for (const cb of _listeners) {
      try { cb({ ..._cache }); } catch { /* ignore listener errors */ }
    }
  }
}

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

// ─── Supabase Helpers ────────────────────────────────────

const DATA_KEYS = ["deliverables", "risks", "okrs", "team", "sprints", "roadmap", "kpis", "branding"] as const;

async function supabaseGet(key: string): Promise<unknown | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("app_data")
      .select("value")
      .eq("key", key)
      .single();
    if (error || !data) return null;
    return data.value;
  } catch {
    return null;
  }
}

async function supabaseSet(key: string, value: unknown): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("app_data")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    return !error;
  } catch {
    return false;
  }
}

async function supabaseInsertChangelog(entry: ChangelogEntry): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("changelog")
      .insert({
        id: entry.id,
        created_at: entry.timestamp,
        admin: entry.admin,
        action: entry.action,
        entity: entry.entity,
        entity_id: entry.entityId,
        entity_title: entry.entityTitle,
        changes: entry.changes,
      });
    return !error;
  } catch {
    return false;
  }
}

// ─── Supabase Realtime Subscription ──────────────────────
// Listens for INSERT/UPDATE on app_data so all open sessions
// receive changes instantly without needing to refresh.

let _realtimeSubscribed = false;

function subscribeToRealtime(): void {
  if (!supabase || _realtimeSubscribed) return;
  _realtimeSubscribed = true;

  supabase
    .channel("app_data_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "app_data" },
      (payload) => {
        // When any row in app_data changes, update the local cache
        const key = (payload.new as Record<string, unknown>)?.key as string;
        const value = (payload.new as Record<string, unknown>)?.value;
        if (key && value && _cache && DATA_KEYS.includes(key as typeof DATA_KEYS[number])) {
          ((_cache) as Record<string, unknown>)[key] = value;
          console.log(`🔄 Realtime update: "${key}" synced from cloud`);
          _notifyListeners();
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "changelog" },
      (payload) => {
        // When a new changelog entry arrives, prepend it
        const row = payload.new as Record<string, unknown>;
        if (row) {
          const entry: ChangelogEntry = {
            id: row.id as string,
            timestamp: row.created_at as string,
            admin: row.admin as string,
            action: row.action as "create" | "update" | "delete",
            entity: row.entity as string,
            entityId: row.entity_id as string,
            entityTitle: row.entity_title as string,
            changes: row.changes as { field: string; oldValue: string; newValue: string }[],
          };
          // Avoid duplicates
          if (!_changelogCache.find((e) => e.id === entry.id)) {
            _changelogCache.unshift(entry);
            console.log(`🔄 Realtime: new changelog entry from ${entry.admin}`);
            _notifyListeners();
          }
        }
      }
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("📡 Realtime subscription active — live sync enabled");
      } else {
        console.warn(`📡 Realtime status: ${status}`);
      }
    });
}

/** Disconnect the realtime subscription (call on app unmount). */
export function unsubscribeRealtime(): void {
  if (!supabase || !_realtimeSubscribed) return;
  supabase.removeAllChannels();
  _realtimeSubscribed = false;
  console.log("📡 Realtime subscription disconnected");
}

// ─── Initialization ──────────────────────────────────────
// Called once on app startup. Fetches from Supabase, seeds
// if empty, falls back to localStorage if offline.
// Also starts the Realtime subscription for live sync.

export async function initStore(): Promise<DataStoreShape> {
  if (_initialized && _cache) return _cache;

  const defaults = getDefaults();

  if (supabase) {
    try {
      // Try fetching deliverables as a health check
      const testData = await supabaseGet("deliverables");

      if (testData !== null) {
        // Supabase has data — load everything
        const store: DataStoreShape = { ...defaults };

        for (const key of DATA_KEYS) {
          const val = await supabaseGet(key);
          if (val !== null) {
            (store as Record<string, unknown>)[key] = val;
          }
        }

        _cache = store;

        // Load changelog
        const { data: logData } = await supabase
          .from("changelog")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);

        if (logData) {
          _changelogCache = logData.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            timestamp: row.created_at as string,
            admin: row.admin as string,
            action: row.action as "create" | "update" | "delete",
            entity: row.entity as string,
            entityId: row.entity_id as string,
            entityTitle: row.entity_title as string,
            changes: row.changes as { field: string; oldValue: string; newValue: string }[],
          }));
        }

        console.log("✅ Data loaded from Supabase cloud");
      } else {
        // Supabase is empty — seed it with defaults
        console.log("🌱 Seeding Supabase with default data...");
        for (const key of DATA_KEYS) {
          await supabaseSet(key, (defaults as Record<string, unknown>)[key]);
        }
        _cache = defaults;
        console.log("✅ Supabase seeded with defaults");
      }

      // Start realtime sync
      subscribeToRealtime();

      _initialized = true;
      return _cache;
    } catch (err) {
      console.warn("⚠️ Supabase unreachable, falling back to localStorage", err);
    }
  }

  // Fallback: localStorage
  try {
    const raw = localStorage.getItem("mopt_data_store");
    if (raw) {
      _cache = JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  if (!_cache) _cache = defaults;
  _initialized = true;

  // Try loading changelog from localStorage
  try {
    const raw = localStorage.getItem("mopt_changelog");
    if (raw) _changelogCache = JSON.parse(raw);
  } catch {
    // ignore
  }

  return _cache;
}

// ─── Core Read Functions (synchronous, from cache) ───────

export function getStore(): DataStoreShape {
  if (_cache) return _cache;
  // If somehow called before init, return defaults
  return getDefaults();
}

export function getChangelog(): ChangelogEntry[] {
  return _changelogCache;
}

// ─── Persist Helpers ─────────────────────────────────────
// These fire-and-forget to Supabase, with localStorage backup.

function persistSection(key: string, value: unknown): void {
  // Always save to localStorage as backup
  if (_cache) {
    localStorage.setItem("mopt_data_store", JSON.stringify(_cache));
  }

  // Push to Supabase in background (fire and forget)
  supabaseSet(key, value).then((ok) => {
    if (!ok) console.warn(`⚠️ Failed to sync "${key}" to cloud`);
  });
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function logChange(
  admin: string,
  action: "create" | "update" | "delete",
  entity: string,
  entityId: string,
  entityTitle: string,
  changes: { field: string; oldValue: string; newValue: string }[]
): void {
  const entry: ChangelogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    admin,
    action,
    entity,
    entityId,
    entityTitle,
    changes,
  };

  _changelogCache.unshift(entry);

  // Backup to localStorage
  localStorage.setItem("mopt_changelog", JSON.stringify(_changelogCache));

  // Push to Supabase
  supabaseInsertChangelog(entry).then((ok) => {
    if (!ok) console.warn("⚠️ Failed to sync changelog to cloud");
  });
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
  persistSection("deliverables", store.deliverables);
  if (changes.length > 0) logChange(admin, "update", "Deliverable", id, old.title, changes);
  return store;
}

export function addDeliverable(admin: string, item: Deliverable): DataStoreShape {
  const store = getStore();
  store.deliverables.push(item);
  persistSection("deliverables", store.deliverables);
  logChange(admin, "create", "Deliverable", item.id, item.title, [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteDeliverable(admin: string, id: string): DataStoreShape {
  const store = getStore();
  const item = store.deliverables.find((d) => d.id === id);
  store.deliverables = store.deliverables.filter((d) => d.id !== id);
  persistSection("deliverables", store.deliverables);
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
  persistSection("risks", store.risks);
  if (changes.length > 0) logChange(admin, "update", "Risk", id, old.risk.slice(0, 60), changes);
  return store;
}

export function addRisk(admin: string, item: Risk): DataStoreShape {
  const store = getStore();
  store.risks.push(item);
  persistSection("risks", store.risks);
  logChange(admin, "create", "Risk", item.id, item.risk.slice(0, 60), [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteRisk(admin: string, id: string): DataStoreShape {
  const store = getStore();
  const item = store.risks.find((r) => r.id === id);
  store.risks = store.risks.filter((r) => r.id !== id);
  persistSection("risks", store.risks);
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
  persistSection("okrs", store.okrs);
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
  persistSection("team", store.team);
  if (changes.length > 0) logChange(admin, "update", "Team Member", String(index), old.name, changes);
  return store;
}

export function addTeamMember(admin: string, member: TeamMember): DataStoreShape {
  const store = getStore();
  store.team.push(member);
  persistSection("team", store.team);
  logChange(admin, "create", "Team Member", String(store.team.length - 1), member.name, [
    { field: "all", oldValue: "", newValue: JSON.stringify(member) },
  ]);
  return store;
}

export function deleteTeamMember(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const member = store.team[index];
  store.team.splice(index, 1);
  persistSection("team", store.team);
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
  persistSection("sprints", store.sprints);
  if (changes.length > 0) logChange(admin, "update", "Sprint", old.sprint, `Sprint ${old.sprint}: ${old.theme}`, changes);
  return store;
}

export function addSprint(admin: string, sprint: Sprint): DataStoreShape {
  const store = getStore();
  store.sprints.push(sprint);
  persistSection("sprints", store.sprints);
  logChange(admin, "create", "Sprint", sprint.sprint, `Sprint ${sprint.sprint}: ${sprint.theme}`, [
    { field: "all", oldValue: "", newValue: JSON.stringify(sprint) },
  ]);
  return store;
}

export function deleteSprint(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const sprint = store.sprints[index];
  store.sprints.splice(index, 1);
  persistSection("sprints", store.sprints);
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
  persistSection("roadmap", store.roadmap);
  if (changes.length > 0) logChange(admin, "update", `Roadmap (${lane})`, String(index), old.title, changes);
  return store;
}

export function addRoadmapItem(admin: string, lane: "now" | "next" | "later", item: RoadmapItem): DataStoreShape {
  const store = getStore();
  store.roadmap[lane].push(item);
  persistSection("roadmap", store.roadmap);
  logChange(admin, "create", `Roadmap (${lane})`, String(store.roadmap[lane].length - 1), item.title, [
    { field: "all", oldValue: "", newValue: JSON.stringify(item) },
  ]);
  return store;
}

export function deleteRoadmapItem(admin: string, lane: "now" | "next" | "later", index: number): DataStoreShape {
  const store = getStore();
  const item = store.roadmap[lane][index];
  store.roadmap[lane].splice(index, 1);
  persistSection("roadmap", store.roadmap);
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
  persistSection("kpis", store.kpis);
  if (changes.length > 0) logChange(admin, "update", "KPI", String(index), old.label, changes);
  return store;
}

export function addKPI(admin: string, kpi: KPIMetric): DataStoreShape {
  const store = getStore();
  store.kpis.push(kpi);
  persistSection("kpis", store.kpis);
  logChange(admin, "create", "KPI", String(store.kpis.length - 1), kpi.label, [
    { field: "all", oldValue: "", newValue: JSON.stringify(kpi) },
  ]);
  return store;
}

export function deleteKPI(admin: string, index: number): DataStoreShape {
  const store = getStore();
  const kpi = store.kpis[index];
  store.kpis.splice(index, 1);
  persistSection("kpis", store.kpis);
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
  persistSection("branding", store.branding);
  if (changes.length > 0) logChange(admin, "update", "Branding", "branding", "Site Branding", changes);
  return store;
}

// ─── Export / Import / Reset ────────────────────────────

export function exportData(): string {
  return JSON.stringify({ store: getStore(), changelog: getChangelog() }, null, 2);
}

export async function importData(json: string): Promise<DataStoreShape> {
  const parsed = JSON.parse(json);
  if (!parsed.store) throw new Error("Invalid data format");

  _cache = parsed.store;
  if (parsed.changelog) _changelogCache = parsed.changelog;

  // Save to localStorage
  localStorage.setItem("mopt_data_store", JSON.stringify(_cache));
  localStorage.setItem("mopt_changelog", JSON.stringify(_changelogCache));

  // Sync all sections to Supabase
  for (const key of DATA_KEYS) {
    await supabaseSet(key, (_cache as Record<string, unknown>)[key]);
  }

  return _cache;
}

export async function resetToDefaults(admin: string): Promise<DataStoreShape> {
  const defaults = getDefaults();
  _cache = defaults;

  // Save to localStorage
  localStorage.setItem("mopt_data_store", JSON.stringify(_cache));

  // Sync all sections to Supabase
  for (const key of DATA_KEYS) {
    await supabaseSet(key, (defaults as Record<string, unknown>)[key]);
  }

  logChange(admin, "update", "System", "reset", "Full Data Reset", [
    { field: "action", oldValue: "custom data", newValue: "factory defaults restored" },
  ]);

  return defaults;
}
