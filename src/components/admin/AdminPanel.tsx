import { useState, useCallback } from "react";
import {
  ListTodo,
  AlertTriangle,
  Target,
  Users,
  Rocket,
  Map,
  Gauge,
  Palette,
  History,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Edit3,
  Check,
  BookOpen,
} from "lucide-react";
import {
  type DataStoreShape,
  type Deliverable,
  type Risk,
  type OKR,
  type TeamMember,
  type Sprint,
  type RoadmapItem,
  type KPIMetric,
  type ChangelogEntry,
  getStore,
  getChangelog,
  updateDeliverable,
  addDeliverable,
  deleteDeliverable,
  updateRisk,
  addRisk,
  deleteRisk,
  updateOKR,
  addOKR,
  deleteOKR,
  updateTeamMember,
  addTeamMember,
  deleteTeamMember,
  updateSprint,
  addSprint,
  deleteSprint,
  updateRoadmapItem,
  addRoadmapItem,
  deleteRoadmapItem,
  updateKPI,
  addKPI,
  deleteKPI,
  updateBranding,
  exportData,
  importData,
  resetToDefaults,
} from "../../lib/dataStore";
import DocumentationEditor from "./DocumentationEditor";

type AdminTab =
  | "deliverables"
  | "risks"
  | "okrs"
  | "team"
  | "sprints"
  | "roadmap"
  | "kpis"
  | "branding"
  | "documentation"
  | "changelog"
  | "data";

interface AdminPanelProps {
  admin: string;
  onDataChange: () => void;
  onLogout: () => void;
}

// ─── Input Component ────────────────────────────────────

function Input({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const baseStyle = {
    background: "rgba(255,255,255,0.6)",
    border: "1px solid var(--glass-border)",
    color: "var(--text-main)",
  };

  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y min-h-[60px]"
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none"
          style={baseStyle}
        />
      )}
    </div>
  );
}

// ─── Select Component ───────────────────────────────────

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase tracking-wider mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-xs outline-none appearance-none"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-main)",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Confirm Dialog ─────────────────────────────────────

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div className="glass p-6 max-w-sm w-full" style={{ borderTop: "4px solid var(--danger)" }}>
        <p className="text-sm font-medium mb-4" style={{ color: "var(--text-main)" }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-main)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: "var(--danger)" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ──────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[300] glass px-5 py-3 flex items-center gap-3 shadow-xl"
      style={{ borderLeft: "4px solid var(--success)", animation: "fadeScaleIn 0.3s ease-out" }}
    >
      <Check className="w-4 h-4" style={{ color: "var(--success)" }} />
      <span className="text-xs font-medium" style={{ color: "var(--text-main)" }}>
        {message}
      </span>
      <button onClick={onClose} className="ml-2">
        <X className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════

export default function AdminPanel({ admin, onDataChange, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("deliverables");
  const [data, setData] = useState<DataStoreShape>(getStore());
  const [toast, setToast] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);

  const refresh = useCallback(() => {
    setData(getStore());
    onDataChange();
  }, [onDataChange]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "deliverables", label: "Deliverables", icon: ListTodo },
    { id: "risks", label: "Risks", icon: AlertTriangle },
    { id: "okrs", label: "OKRs", icon: Target },
    { id: "team", label: "Team", icon: Users },
    { id: "sprints", label: "Sprints", icon: Rocket },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "kpis", label: "KPIs", icon: Gauge },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "documentation", label: "Docs", icon: BookOpen },
    { id: "changelog", label: "Changelog", icon: History },
    { id: "data", label: "Data", icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-light tracking-tight" style={{ color: "var(--text-main)" }}>
            Admin Panel
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Logged in as <strong>{admin}</strong> — All changes are saved instantly & logged
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-80"
          style={{ background: "rgba(239,68,68,0.1)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          Log Out
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200"
            style={{
              background: activeTab === tab.id ? "var(--primary)" : "var(--glass-bg)",
              color: activeTab === tab.id ? "white" : "var(--text-main)",
              border: activeTab === tab.id ? "1px solid transparent" : "1px solid var(--glass-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass p-6" style={{ minHeight: "400px" }}>
        {activeTab === "deliverables" && (
          <DeliverablesEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "risks" && (
          <RisksEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "okrs" && (
          <OKRsEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "team" && (
          <TeamEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "sprints" && (
          <SprintsEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "roadmap" && (
          <RoadmapEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "kpis" && (
          <KPIsEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "branding" && (
          <BrandingEditor data={data} admin={admin} refresh={refresh} showToast={showToast} />
        )}
        {activeTab === "documentation" && (
          <DocumentationEditor data={data} admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
        {activeTab === "changelog" && <ChangelogViewer />}
        {activeTab === "data" && (
          <DataManager admin={admin} refresh={refresh} showToast={showToast} setConfirm={setConfirmAction} />
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          message={confirmAction.message}
          onConfirm={() => {
            confirmAction.action();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DELIVERABLES EDITOR
// ═══════════════════════════════════════════════════════

function DeliverablesEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Deliverable>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Deliverable>({
    id: "",
    stream: "VR",
    title: "",
    owner: "",
    priority: "P0",
    sprint: "1",
    status: "Not Started",
    description: "",
  });

  const startEdit = (d: Deliverable) => {
    setEditingId(d.id);
    setEditForm({ ...d });
  };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateDeliverable(admin, editingId, editForm);
      refresh();
      showToast("Deliverable updated");
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    if (!newItem.id || !newItem.title) return;
    addDeliverable(admin, newItem);
    refresh();
    showToast("Deliverable added");
    setShowAdd(false);
    setNewItem({ id: "", stream: "VR", title: "", owner: "", priority: "P0", sprint: "1", status: "Not Started", description: "" });
  };

  const handleDelete = (id: string, title: string) => {
    setConfirm({
      message: `Delete deliverable "${title}"? This cannot be undone.`,
      action: () => {
        deleteDeliverable(admin, id);
        refresh();
        showToast("Deliverable deleted");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>
            Deliverables ({data.deliverables.length})
          </h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Click any row to edit, or add new deliverables
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="w-3 h-3" /> Add New
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Input label="ID" value={newItem.id} onChange={(v) => setNewItem({ ...newItem, id: v })} />
            <Select label="Stream" value={newItem.stream} onChange={(v) => setNewItem({ ...newItem, stream: v })} options={["VR", "Web", "LMS"]} />
            <Select label="Priority" value={newItem.priority} onChange={(v) => setNewItem({ ...newItem, priority: v })} options={["P0", "P1", "P2"]} />
            <Select
              label="Status"
              value={newItem.status}
              onChange={(v) => setNewItem({ ...newItem, status: v })}
              options={["Not Started", "In Discovery", "In Spec", "In Build", "Done"]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="md:col-span-2">
              <Input label="Title" value={newItem.title} onChange={(v) => setNewItem({ ...newItem, title: v })} />
            </div>
            <Input label="Owner" value={newItem.owner} onChange={(v) => setNewItem({ ...newItem, owner: v })} />
          </div>
          <Input label="Sprint" value={newItem.sprint} onChange={(v) => setNewItem({ ...newItem, sprint: v })} />
          <div className="mt-3">
            <Input label="Description" value={newItem.description} onChange={(v) => setNewItem({ ...newItem, description: v })} multiline />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}>
              <Save className="w-3 h-3" /> Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
        <table className="w-full text-left text-xs">
          <thead style={{ position: "sticky", top: 0, zIndex: 5, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
            <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>ID</th>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>Title</th>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>Stream</th>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>Owner</th>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>Priority</th>
              <th className="px-3 py-2 font-semibold" style={{ color: "var(--text-main)" }}>Status</th>
              <th className="px-3 py-2 font-semibold text-right" style={{ color: "var(--text-main)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.deliverables.map((d) => (
              editingId === d.id ? (
                <tr key={d.id} style={{ background: "rgba(99,102,241,0.04)", borderBottom: "1px solid var(--glass-border)" }}>
                  <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>{d.id}</td>
                  <td className="px-3 py-2" colSpan={5}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
                      <Input label="Title" value={editForm.title ?? ""} onChange={(v) => setEditForm({ ...editForm, title: v })} />
                      <Input label="Owner" value={editForm.owner ?? ""} onChange={(v) => setEditForm({ ...editForm, owner: v })} />
                      <Select label="Stream" value={editForm.stream ?? "VR"} onChange={(v) => setEditForm({ ...editForm, stream: v })} options={["VR", "Web", "LMS"]} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Select label="Priority" value={editForm.priority ?? "P0"} onChange={(v) => setEditForm({ ...editForm, priority: v })} options={["P0", "P1", "P2"]} />
                      <Input label="Sprint" value={editForm.sprint ?? ""} onChange={(v) => setEditForm({ ...editForm, sprint: v })} />
                      <Select label="Status" value={editForm.status ?? "Not Started"} onChange={(v) => setEditForm({ ...editForm, status: v })} options={["Not Started", "In Discovery", "In Spec", "In Build", "Done"]} />
                    </div>
                    <Input label="Description" value={editForm.description ?? ""} onChange={(v) => setEditForm({ ...editForm, description: v })} multiline />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex flex-col gap-1">
                      <button onClick={saveEdit} className="p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.15)", color: "var(--success)" }}>
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg" style={{ background: "rgba(100,116,139,0.1)", color: "var(--text-muted)" }}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr
                  key={d.id}
                  className="cursor-pointer transition-colors hover:bg-white/30"
                  style={{ borderBottom: "1px solid var(--glass-border)" }}
                  onClick={() => startEdit(d)}
                >
                  <td className="px-3 py-2 font-mono" style={{ color: "var(--primary)" }}>{d.id}</td>
                  <td className="px-3 py-2 font-medium max-w-[200px] truncate" style={{ color: "var(--text-main)" }}>{d.title}</td>
                  <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>{d.stream}</td>
                  <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>{d.owner}</td>
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{ background: d.priority === "P0" ? "var(--danger)" : d.priority === "P1" ? "var(--warning)" : "var(--primary)" }}>
                      {d.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{
                      background: d.status === "Done" ? "rgba(16,185,129,0.15)" : d.status === "In Build" ? "rgba(99,102,241,0.15)" : d.status === "In Spec" ? "rgba(245,158,11,0.15)" : "rgba(100,116,139,0.15)",
                      color: d.status === "Done" ? "#065f46" : d.status === "In Build" ? "#3730a3" : d.status === "In Spec" ? "#92400e" : "#1e293b",
                    }}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(d.id, d.title); }}
                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--danger)" }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// RISKS EDITOR
// ═══════════════════════════════════════════════════════

function RisksEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Risk>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Risk>({ id: "", category: "Technical", risk: "", score: 6, owner: "", mitigation: "" });

  const startEdit = (r: Risk) => { setEditingId(r.id); setEditForm({ ...r }); };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateRisk(admin, editingId, editForm);
      refresh();
      showToast("Risk updated");
      setEditingId(null);
    }
  };

  const handleAdd = () => {
    if (!newItem.id || !newItem.risk) return;
    addRisk(admin, newItem);
    refresh();
    showToast("Risk added");
    setShowAdd(false);
    setNewItem({ id: "", category: "Technical", risk: "", score: 6, owner: "", mitigation: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>Risks ({data.risks.length})</h3>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Click any risk card to edit</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
          <Plus className="w-3 h-3" /> Add Risk
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <Input label="ID" value={newItem.id} onChange={(v) => setNewItem({ ...newItem, id: v })} />
            <Select label="Category" value={newItem.category} onChange={(v) => setNewItem({ ...newItem, category: v })} options={["Technical", "Product / Clinical", "Regulatory", "Data / Security", "Compliance", "Clinical Safety", "Team", "Commercial", "Market", "Hardware", "Supplier", "Financial", "Reputational", "IP", "Operational", "Ethical / AI", "Legal", "Content"]} />
            <Input label="Score" value={String(newItem.score)} onChange={(v) => setNewItem({ ...newItem, score: parseInt(v) || 0 })} type="number" />
            <Input label="Owner" value={newItem.owner} onChange={(v) => setNewItem({ ...newItem, owner: v })} />
          </div>
          <Input label="Risk Description" value={newItem.risk} onChange={(v) => setNewItem({ ...newItem, risk: v })} multiline />
          <div className="mt-3">
            <Input label="Mitigation Strategy" value={newItem.mitigation} onChange={(v) => setNewItem({ ...newItem, mitigation: v })} multiline />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}>
              <Save className="w-3 h-3" /> Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}>
        {data.risks.map((r) => (
          <div key={r.id} className="p-4 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", borderTop: `3px solid ${r.score >= 15 ? "var(--danger)" : r.score >= 10 ? "var(--warning)" : "var(--primary)"}` }}>
            {editingId === r.id ? (
              <div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <Select label="Category" value={editForm.category ?? ""} onChange={(v) => setEditForm({ ...editForm, category: v })} options={["Technical", "Product / Clinical", "Regulatory", "Data / Security", "Compliance", "Clinical Safety", "Team", "Commercial", "Market", "Hardware", "Supplier", "Financial", "Reputational", "IP", "Operational", "Ethical / AI", "Legal", "Content"]} />
                  <Input label="Score" value={String(editForm.score ?? 0)} onChange={(v) => setEditForm({ ...editForm, score: parseInt(v) || 0 })} type="number" />
                  <Input label="Owner" value={editForm.owner ?? ""} onChange={(v) => setEditForm({ ...editForm, owner: v })} />
                </div>
                <Input label="Risk" value={editForm.risk ?? ""} onChange={(v) => setEditForm({ ...editForm, risk: v })} multiline />
                <div className="mt-2">
                  <Input label="Mitigation" value={editForm.mitigation ?? ""} onChange={(v) => setEditForm({ ...editForm, mitigation: v })} multiline />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}>
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={() => startEdit(r)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{r.id} • {r.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono" style={{ color: r.score >= 15 ? "var(--danger)" : r.score >= 10 ? "var(--warning)" : "var(--primary)" }}>{r.score}</span>
                    <button onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Delete risk ${r.id}?`, action: () => { deleteRisk(admin, r.id); refresh(); showToast("Risk deleted"); } }); }} className="p-1 rounded" style={{ color: "var(--danger)" }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium mb-1 line-clamp-2" style={{ color: "var(--text-main)" }}>{r.risk}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Owner: {r.owner}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OKRs EDITOR
// ═══════════════════════════════════════════════════════

function OKRsEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<OKR>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<OKR>({ id: "", objective: "", keyResults: [""], owner: "" });

  const startEdit = (o: OKR) => { setEditingId(o.id); setEditForm({ ...o, keyResults: [...o.keyResults] }); };

  const saveEdit = () => {
    if (editingId && editForm) {
      updateOKR(admin, editingId, editForm);
      refresh();
      showToast("OKR updated");
      setEditingId(null);
    }
  };

  const updateKR = (idx: number, value: string) => {
    const krs = [...(editForm.keyResults ?? [])];
    krs[idx] = value;
    setEditForm({ ...editForm, keyResults: krs });
  };

  const addKR = () => {
    setEditForm({ ...editForm, keyResults: [...(editForm.keyResults ?? []), ""] });
  };

  const removeKR = (idx: number) => {
    const krs = [...(editForm.keyResults ?? [])];
    krs.splice(idx, 1);
    setEditForm({ ...editForm, keyResults: krs });
  };

  const updateNewKR = (idx: number, value: string) => {
    const krs = [...newItem.keyResults];
    krs[idx] = value;
    setNewItem({ ...newItem, keyResults: krs });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>OKRs ({data.okrs.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
          <Plus className="w-3 h-3" /> Add OKR
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input label="ID (e.g. O4)" value={newItem.id} onChange={(v) => setNewItem({ ...newItem, id: v })} />
            <Input label="Owner" value={newItem.owner} onChange={(v) => setNewItem({ ...newItem, owner: v })} />
          </div>
          <Input label="Objective" value={newItem.objective} onChange={(v) => setNewItem({ ...newItem, objective: v })} />
          <div className="mt-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Key Results</label>
            {newItem.keyResults.map((kr, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input value={kr} onChange={(e) => updateNewKR(idx, e.target.value)} className="flex-1 px-3 py-2 rounded-lg text-xs outline-none" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid var(--glass-border)", color: "var(--text-main)" }} />
                {newItem.keyResults.length > 1 && (
                  <button onClick={() => setNewItem({ ...newItem, keyResults: newItem.keyResults.filter((_, i) => i !== idx) })} className="p-1.5 rounded-lg" style={{ color: "var(--danger)" }}><Trash2 className="w-3 h-3" /></button>
                )}
              </div>
            ))}
            <button onClick={() => setNewItem({ ...newItem, keyResults: [...newItem.keyResults, ""] })} className="flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: "var(--primary)" }}>
              <Plus className="w-3 h-3" /> Add Key Result
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { if (!newItem.id || !newItem.objective) return; addOKR(admin, newItem); refresh(); showToast("OKR added"); setShowAdd(false); setNewItem({ id: "", objective: "", keyResults: [""], owner: "" }); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {data.okrs.map((okr) => (
          <div key={okr.id} className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", borderLeft: "4px solid var(--primary)" }}>
            {editingId === okr.id ? (
              <div className="space-y-3">
                <Input label="Objective" value={editForm.objective ?? ""} onChange={(v) => setEditForm({ ...editForm, objective: v })} />
                <Input label="Owner" value={editForm.owner ?? ""} onChange={(v) => setEditForm({ ...editForm, owner: v })} />
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Key Results</label>
                  {(editForm.keyResults ?? []).map((kr, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        value={kr}
                        onChange={(e) => updateKR(idx, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: "rgba(255,255,255,0.6)", border: "1px solid var(--glass-border)", color: "var(--text-main)" }}
                      />
                      <button onClick={() => removeKR(idx)} className="p-1.5 rounded-lg" style={{ color: "var(--danger)" }}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addKR} className="flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: "var(--primary)" }}>
                    <Plus className="w-3 h-3" /> Add Key Result
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}>
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => startEdit(okr)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>{okr.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{okr.owner}</span>
                    <button onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Delete OKR "${okr.objective.slice(0, 50)}"?`, action: () => { deleteOKR(admin, okr.id); refresh(); showToast("OKR deleted"); } }); }} className="p-1 rounded" style={{ color: "var(--danger)" }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--text-main)" }}>{okr.objective}</h4>
                <ul className="space-y-1">
                  {okr.keyResults.map((kr, i) => (
                    <li key={i} className="text-[11px] flex items-start gap-1.5" style={{ color: "var(--text-muted)" }}>
                      <span className="opacity-50 mt-0.5">—</span> {kr}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TEAM EDITOR
// ═══════════════════════════════════════════════════════

function TeamEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<TeamMember>({ name: "", role: "", area: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>Team ({data.team.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
          <Plus className="w-3 h-3" /> Add Member
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Name" value={newItem.name} onChange={(v) => setNewItem({ ...newItem, name: v })} />
            <Input label="Role" value={newItem.role} onChange={(v) => setNewItem({ ...newItem, role: v })} />
            <Select label="Area" value={newItem.area} onChange={(v) => setNewItem({ ...newItem, area: v })} options={["Leadership", "VR", "Engineering", "AI/ML", "Clinical", "Legal", "Advisory"]} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { if (!newItem.name) return; addTeamMember(admin, newItem); refresh(); showToast("Team member added"); setShowAdd(false); setNewItem({ name: "", role: "", area: "" }); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}>
              <Save className="w-3 h-3" /> Save
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.team.map((member, idx) => (
          <div key={idx} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
            {editingIdx === idx ? (
              <div className="space-y-2">
                <Input label="Name" value={editForm.name ?? ""} onChange={(v) => setEditForm({ ...editForm, name: v })} />
                <Input label="Role" value={editForm.role ?? ""} onChange={(v) => setEditForm({ ...editForm, role: v })} />
                <Select label="Area" value={editForm.area ?? ""} onChange={(v) => setEditForm({ ...editForm, area: v })} options={["Leadership", "VR", "Engineering", "AI/ML", "Clinical", "Legal", "Advisory"]} />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { updateTeamMember(admin, idx, editForm); refresh(); showToast("Team member updated"); setEditingIdx(null); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white" style={{ background: "var(--success)" }}>
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => setEditingIdx(null)} className="px-2 py-1 rounded text-[10px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => { setEditingIdx(idx); setEditForm({ ...member }); }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>{member.name}</h4>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{member.role}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>
                      {member.area}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Remove ${member.name} from the team?`, action: () => { deleteTeamMember(admin, idx); refresh(); showToast("Team member removed"); } }); }}
                    className="p-1 rounded" style={{ color: "var(--danger)" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SPRINTS EDITOR
// ═══════════════════════════════════════════════════════

function SprintsEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Sprint>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<Sprint>({ sprint: "", theme: "", weeks: "", deliverables: "", exit: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>Sprint Plan ({data.sprints.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
          <Plus className="w-3 h-3" /> Add Sprint
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Input label="Sprint #" value={newItem.sprint} onChange={(v) => setNewItem({ ...newItem, sprint: v })} />
            <Input label="Theme" value={newItem.theme} onChange={(v) => setNewItem({ ...newItem, theme: v })} />
            <Input label="Weeks" value={newItem.weeks} onChange={(v) => setNewItem({ ...newItem, weeks: v })} />
          </div>
          <Input label="Deliverables" value={newItem.deliverables} onChange={(v) => setNewItem({ ...newItem, deliverables: v })} multiline />
          <div className="mt-3"><Input label="Exit Criteria" value={newItem.exit} onChange={(v) => setNewItem({ ...newItem, exit: v })} multiline /></div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { if (!newItem.sprint) return; addSprint(admin, newItem); refresh(); showToast("Sprint added"); setShowAdd(false); setNewItem({ sprint: "", theme: "", weeks: "", deliverables: "", exit: "" }); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {data.sprints.map((s, idx) => (
          <div key={idx} className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", borderLeft: `4px solid ${idx === 0 ? "var(--danger)" : idx < 3 ? "var(--warning)" : "var(--primary)"}` }}>
            {editingIdx === idx ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Sprint #" value={editForm.sprint ?? ""} onChange={(v) => setEditForm({ ...editForm, sprint: v })} />
                  <Input label="Theme" value={editForm.theme ?? ""} onChange={(v) => setEditForm({ ...editForm, theme: v })} />
                  <Input label="Weeks" value={editForm.weeks ?? ""} onChange={(v) => setEditForm({ ...editForm, weeks: v })} />
                </div>
                <Input label="Deliverables" value={editForm.deliverables ?? ""} onChange={(v) => setEditForm({ ...editForm, deliverables: v })} multiline />
                <Input label="Exit Criteria" value={editForm.exit ?? ""} onChange={(v) => setEditForm({ ...editForm, exit: v })} multiline />
                <div className="flex gap-2">
                  <button onClick={() => { updateSprint(admin, idx, editForm); refresh(); showToast("Sprint updated"); setEditingIdx(null); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
                  <button onClick={() => setEditingIdx(null)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="cursor-pointer flex items-start justify-between" onClick={() => { setEditingIdx(idx); setEditForm({ ...s }); }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "var(--primary)" }}>S{s.sprint}</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>{s.weeks}</span>
                  </div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: "var(--text-main)" }}>{s.theme}</h4>
                  <p className="text-[11px] line-clamp-2" style={{ color: "var(--text-muted)" }}>{s.deliverables}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Delete Sprint ${s.sprint}?`, action: () => { deleteSprint(admin, idx); refresh(); showToast("Sprint deleted"); } }); }} className="p-1 rounded" style={{ color: "var(--danger)" }}>
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROADMAP EDITOR
// ═══════════════════════════════════════════════════════

function RoadmapEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RoadmapItem>>({});
  const [addingLane, setAddingLane] = useState<"now" | "next" | "later" | null>(null);
  const [newItem, setNewItem] = useState<RoadmapItem>({ title: "", description: "" });

  const lanes: { key: "now" | "next" | "later"; label: string; range: string; color: string }[] = [
    { key: "now", label: "Now", range: "0-3 mo", color: "var(--danger)" },
    { key: "next", label: "Next", range: "3-6 mo", color: "var(--warning)" },
    { key: "later", label: "Later", range: "6-18 mo", color: "var(--primary)" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-main)" }}>Roadmap</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lanes.map((lane) => (
          <div key={lane.key}>
            <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: `2px solid ${lane.color}` }}>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold uppercase" style={{ color: "var(--text-main)" }}>{lane.label}</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${lane.color}15`, color: lane.color }}>{lane.range}</span>
              </div>
              <button onClick={() => { setAddingLane(lane.key); setNewItem({ title: "", description: "" }); }} className="p-1 rounded" style={{ color: lane.color }}>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {addingLane === lane.key && (
              <div className="mb-3 p-3 rounded-lg" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <Input label="Title" value={newItem.title} onChange={(v) => setNewItem({ ...newItem, title: v })} />
                <div className="mt-2"><Input label="Description" value={newItem.description} onChange={(v) => setNewItem({ ...newItem, description: v })} multiline /></div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { if (!newItem.title) return; addRoadmapItem(admin, lane.key, newItem); refresh(); showToast("Roadmap item added"); setAddingLane(null); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
                  <button onClick={() => setAddingLane(null)} className="px-2 py-1 rounded text-[10px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {data.roadmap[lane.key].map((item, idx) => {
                const key = `${lane.key}-${idx}`;
                return (
                  <div key={key} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)", borderLeft: `3px solid ${lane.color}` }}>
                    {editingKey === key ? (
                      <div className="space-y-2">
                        <Input label="Title" value={editForm.title ?? ""} onChange={(v) => setEditForm({ ...editForm, title: v })} />
                        <Input label="Description" value={editForm.description ?? ""} onChange={(v) => setEditForm({ ...editForm, description: v })} multiline />
                        <div className="flex gap-2">
                          <button onClick={() => { updateRoadmapItem(admin, lane.key, idx, editForm); refresh(); showToast("Roadmap item updated"); setEditingKey(null); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
                          <button onClick={() => setEditingKey(null)} className="px-2 py-1 rounded text-[10px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="cursor-pointer flex items-start justify-between" onClick={() => { setEditingKey(key); setEditForm({ ...item }); }}>
                        <div>
                          <h5 className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>{item.title}</h5>
                          <p className="text-[10px] line-clamp-2 mt-0.5" style={{ color: "var(--text-muted)" }}>{item.description}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Delete "${item.title}"?`, action: () => { deleteRoadmapItem(admin, lane.key, idx); refresh(); showToast("Item deleted"); } }); }} className="p-0.5 rounded flex-shrink-0" style={{ color: "var(--danger)" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// KPIs EDITOR
// ═══════════════════════════════════════════════════════

function KPIsEditor({
  data,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<KPIMetric>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<KPIMetric>({ label: "", value: "", unit: "", target: "", icon: "Gauge", color: "var(--primary)" });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>KPI Targets ({data.kpis.length})</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
          <Plus className="w-3 h-3" /> Add KPI
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input label="Label" value={newItem.label} onChange={(v) => setNewItem({ ...newItem, label: v })} />
            <Input label="Value" value={newItem.value} onChange={(v) => setNewItem({ ...newItem, value: v })} />
            <Input label="Unit" value={newItem.unit} onChange={(v) => setNewItem({ ...newItem, unit: v })} />
            <Input label="Target" value={newItem.target} onChange={(v) => setNewItem({ ...newItem, target: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Select label="Icon" value={newItem.icon} onChange={(v) => setNewItem({ ...newItem, icon: v })} options={["Gauge", "Activity", "Zap", "TrendingUp", "CheckCircle2", "Users", "Shield"]} />
            <Select label="Color" value={newItem.color} onChange={(v) => setNewItem({ ...newItem, color: v })} options={["var(--primary)", "var(--success)", "var(--warning)", "var(--danger)"]} />
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => { if (!newItem.label) return; addKPI(admin, newItem); refresh(); showToast("KPI added"); setShowAdd(false); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "var(--text-muted)" }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.kpis.map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-xl cursor-pointer" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
            {editingIdx === idx ? (
              <div className="space-y-2">
                <Input label="Label" value={editForm.label ?? ""} onChange={(v) => setEditForm({ ...editForm, label: v })} />
                <Input label="Value" value={editForm.value ?? ""} onChange={(v) => setEditForm({ ...editForm, value: v })} />
                <Input label="Unit" value={editForm.unit ?? ""} onChange={(v) => setEditForm({ ...editForm, unit: v })} />
                <Input label="Target" value={editForm.target ?? ""} onChange={(v) => setEditForm({ ...editForm, target: v })} />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { updateKPI(admin, idx, editForm); refresh(); showToast("KPI updated"); setEditingIdx(null); }} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-white" style={{ background: "var(--success)" }}><Save className="w-3 h-3" /> Save</button>
                  <button onClick={() => setEditingIdx(null)} className="px-2 py-1 rounded text-[10px]" style={{ color: "var(--text-muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { setEditingIdx(idx); setEditForm({ ...kpi }); }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{kpi.label}</span>
                  <button onClick={(e) => { e.stopPropagation(); setConfirm({ message: `Delete KPI "${kpi.label}"?`, action: () => { deleteKPI(admin, idx); refresh(); showToast("KPI deleted"); } }); }} className="p-0.5 rounded" style={{ color: "var(--danger)" }}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xl font-light" style={{ color: kpi.color }}>{kpi.value}</span>
                <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>{kpi.unit}</span>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>{kpi.target}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// BRANDING EDITOR
// ═══════════════════════════════════════════════════════

function BrandingEditor({
  data,
  admin,
  refresh,
  showToast,
}: {
  data: DataStoreShape;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
}) {
  const [form, setForm] = useState({ ...data.branding });

  const handleSave = () => {
    updateBranding(admin, form);
    refresh();
    showToast("Branding & dashboard settings updated");
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-main)" }}>Branding & Dashboard Settings</h3>
      
      {/* Sidebar Branding */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Sidebar</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Sidebar Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Input label="Sidebar Subtitle" value={form.subtitle} onChange={(v) => setForm({ ...form, subtitle: v })} />
        </div>
      </div>

      {/* Dashboard Settings */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>Dashboard Page</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input label="Dashboard Title" value={form.dashboardTitle || ""} onChange={(v) => setForm({ ...form, dashboardTitle: v })} />
          <Input label="Dashboard Subtitle" value={form.dashboardSubtitle || ""} onChange={(v) => setForm({ ...form, dashboardSubtitle: v })} />
        </div>
      </div>

      {/* North Star Settings */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--primary)" }}>North Star Metric</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input label="Label" value={form.northStarLabel || ""} onChange={(v) => setForm({ ...form, northStarLabel: v })} />
          <Input label="Metric Name" value={form.northStarMetric || ""} onChange={(v) => setForm({ ...form, northStarMetric: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Target" value={form.northStarTarget || ""} onChange={(v) => setForm({ ...form, northStarTarget: v })} />
        </div>
        <div className="mt-3">
          <Input label="Description" value={form.northStarDescription || ""} onChange={(v) => setForm({ ...form, northStarDescription: v })} multiline />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Preview</p>
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-main)" }}>{form.title || "MoPT"}</h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>{form.subtitle || "Product Roadmap"}</p>
          </div>
          <div style={{ borderLeft: "1px solid var(--glass-border)", paddingLeft: "1.5rem" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--text-main)" }}>{form.dashboardTitle || "Dashboard"}</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{form.dashboardSubtitle || "Version 2.0"}</p>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
        <Save className="w-3 h-3" /> Save Changes
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CHANGELOG VIEWER
// ═══════════════════════════════════════════════════════

function ChangelogViewer() {
  const changelog = getChangelog();
  const [filter, setFilter] = useState("all");

  const entities = ["all", ...Array.from(new Set(changelog.map((c) => c.entity)))];
  const filtered = filter === "all" ? changelog : changelog.filter((c) => c.entity === filter);

  const actionColors: Record<string, string> = {
    create: "var(--success)",
    update: "var(--warning)",
    delete: "var(--danger)",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>
          Changelog ({changelog.length} entries)
        </h3>
        <div className="flex gap-1.5 flex-wrap">
          {entities.map((e) => (
            <button
              key={e}
              onClick={() => setFilter(e)}
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={{
                background: filter === e ? "var(--primary)" : "rgba(0,0,0,0.04)",
                color: filter === e ? "white" : "var(--text-muted)",
              }}
            >
              {e === "all" ? "All" : e}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-8 h-8 mx-auto mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No changes recorded yet</p>
        </div>
      ) : (
        <div style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }} className="space-y-2">
          {filtered.map((entry) => (
            <div key={entry.id} className="p-3 rounded-lg flex gap-3" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
              <div
                className="w-1.5 rounded-full flex-shrink-0"
                style={{ background: actionColors[entry.action] ?? "var(--primary)" }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: `${actionColors[entry.action]}15`, color: actionColors[entry.action] }}>
                    {entry.action}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-main)" }}>{entry.entity}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>by {entry.admin}</span>
                </div>
                <p className="text-xs font-medium truncate" style={{ color: "var(--text-main)" }}>{entry.entityTitle}</p>
                {entry.changes.length > 0 && entry.action !== "delete" && (
                  <div className="mt-1.5 space-y-0.5">
                    {entry.changes.slice(0, 3).map((c, i) => (
                      <p key={i} className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <span className="font-semibold">{c.field}:</span>{" "}
                        {c.field === "all" ? "New item created" : (
                          <>
                            <span style={{ color: "var(--danger)", textDecoration: "line-through" }}>{c.oldValue.slice(0, 40)}</span>
                            {" → "}
                            <span style={{ color: "var(--success)" }}>{c.newValue.slice(0, 40)}</span>
                          </>
                        )}
                      </p>
                    ))}
                    {entry.changes.length > 3 && (
                      <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>+{entry.changes.length - 3} more changes</p>
                    )}
                  </div>
                )}
                <p className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DATA MANAGER
// ═══════════════════════════════════════════════════════

function DataManager({
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mopt-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          await importData(ev.target?.result as string);
          refresh();
          showToast("Data imported & synced to cloud");
        } catch {
          showToast("Import failed — invalid file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    setConfirm({
      message: "Reset ALL data to factory defaults? This will erase all your edits. This CANNOT be undone.",
      action: async () => {
        await resetToDefaults(admin);
        refresh();
        showToast("Data reset to defaults & synced to cloud");
      },
    });
  };

  return (
    <div className="max-w-lg">
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--text-main)" }}>Data Management</h3>

      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
            <div>
              <h4 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Export Data</h4>
              <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
                Download all content + changelog as a JSON file
              </p>
              <button onClick={handleExport} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
                Export JSON
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--glass-border)" }}>
          <div className="flex items-start gap-3">
            <Upload className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} />
            <div>
              <h4 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Import Data</h4>
              <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
                Restore from a previously exported JSON file
              </p>
              <button onClick={handleImport} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--warning)" }}>
                Import JSON
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--danger)" }} />
            <div>
              <h4 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Reset to Defaults</h4>
              <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
                Erase all edits and restore original data. This cannot be undone.
              </p>
              <button onClick={handleReset} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--danger)" }}>
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
