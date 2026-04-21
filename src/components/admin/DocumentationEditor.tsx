import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Type,
  List,
  ListOrdered,
  Table,
  AlertTriangle,
  Code,
  Tag,
} from "lucide-react";
import {
  type DataStoreShape,
  type DocSection,
  type DocContentBlock,
  type DocMeta,
  updateDocMeta,
  updateDocSection,
  addDocSection,
  deleteDocSection,
} from "../../lib/dataStore";

// ─── Block Type Icons ────────────────────────────────────
const BLOCK_ICONS: Record<string, React.ElementType> = {
  p: Type,
  ul: List,
  ol: ListOrdered,
  table: Table,
  callout: AlertTriangle,
  code: Code,
  label: Tag,
};

const BLOCK_LABELS: Record<string, string> = {
  p: "Paragraph",
  ul: "Bullet List",
  ol: "Numbered List",
  table: "Table",
  callout: "Callout",
  code: "Code Block",
  label: "Label",
};

// ─── Input Component ────────────────────────────────────
function Input({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
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
          rows={3}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y"
          style={baseStyle}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none"
          style={baseStyle}
        />
      )}
    </div>
  );
}

// ─── Block Editor Component ─────────────────────────────
function BlockEditor({
  block,
  onChange,
  onDelete,
}: {
  block: DocContentBlock;
  onChange: (b: DocContentBlock) => void;
  onDelete: () => void;
}) {
  const Icon = BLOCK_ICONS[block.type] || Type;

  return (
    <div
      className="p-3 rounded-lg mb-2"
      style={{
        background: "rgba(255,255,255,0.4)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3" style={{ color: "var(--primary)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {BLOCK_LABELS[block.type] || block.type}
          </span>
        </div>
        <button
          onClick={onDelete}
          className="p-1 rounded"
          style={{ color: "var(--danger)" }}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Type-specific editor */}
      {(block.type === "p" || block.type === "label") && (
        <textarea
          value={block.text || ""}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={block.type === "label" ? 1 : 3}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y"
          style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-main)",
          }}
        />
      )}

      {(block.type === "ul" || block.type === "ol") && (
        <div className="space-y-1">
          {(block.items || []).map((item, i) => (
            <div key={i} className="flex gap-1.5">
              <span
                className="text-[10px] font-mono mt-2 w-4 text-right flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {block.type === "ol" ? `${i + 1}.` : "•"}
              </span>
              <input
                value={item}
                onChange={(e) => {
                  const newItems = [...(block.items || [])];
                  newItems[i] = e.target.value;
                  onChange({ ...block, items: newItems });
                }}
                className="flex-1 px-2 py-1.5 rounded text-xs outline-none"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-main)",
                }}
              />
              <button
                onClick={() => {
                  const newItems = (block.items || []).filter(
                    (_, idx) => idx !== i
                  );
                  onChange({ ...block, items: newItems });
                }}
                className="p-1"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              onChange({ ...block, items: [...(block.items || []), ""] })
            }
            className="flex items-center gap-1 text-[10px] font-semibold mt-1"
            style={{ color: "var(--primary)" }}
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
      )}

      {block.type === "callout" && (
        <div className="space-y-2">
          <select
            value={block.calloutType || "info"}
            onChange={(e) =>
              onChange({
                ...block,
                calloutType: e.target.value as "info" | "warn" | "danger",
              })
            }
            className="px-2 py-1.5 rounded text-xs outline-none"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-main)",
            }}
          >
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="danger">Danger</option>
          </select>
          <textarea
            value={block.text || ""}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y"
            style={{
              background: "rgba(255,255,255,0.6)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-main)",
            }}
          />
        </div>
      )}

      {block.type === "code" && (
        <textarea
          value={block.text || ""}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          rows={5}
          className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y font-mono"
          style={{
            background: "rgba(15,23,42,0.9)",
            border: "1px solid var(--glass-border)",
            color: "#e2e8f0",
          }}
        />
      )}

      {block.type === "table" && (
        <div className="space-y-2 overflow-x-auto">
          {/* Headers */}
          <div className="flex gap-1">
            {(block.headers || []).map((h, i) => (
              <input
                key={`h-${i}`}
                value={h}
                onChange={(e) => {
                  const newHeaders = [...(block.headers || [])];
                  newHeaders[i] = e.target.value;
                  onChange({ ...block, headers: newHeaders });
                }}
                className="flex-1 min-w-[80px] px-2 py-1.5 rounded text-[10px] font-bold outline-none"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "var(--primary)",
                }}
                placeholder={`Header ${i + 1}`}
              />
            ))}
            <button
              onClick={() =>
                onChange({
                  ...block,
                  headers: [...(block.headers || []), ""],
                  rows: (block.rows || []).map((r) => [...r, ""]),
                })
              }
              className="p-1"
              style={{ color: "var(--primary)" }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          {/* Rows */}
          {(block.rows || []).map((row, ri) => (
            <div key={`r-${ri}`} className="flex gap-1">
              {row.map((cell, ci) => (
                <input
                  key={`c-${ri}-${ci}`}
                  value={cell}
                  onChange={(e) => {
                    const newRows = (block.rows || []).map((r) => [...r]);
                    newRows[ri][ci] = e.target.value;
                    onChange({ ...block, rows: newRows });
                  }}
                  className="flex-1 min-w-[80px] px-2 py-1 rounded text-[10px] outline-none"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-main)",
                  }}
                />
              ))}
              <button
                onClick={() => {
                  const newRows = (block.rows || []).filter(
                    (_, idx) => idx !== ri
                  );
                  onChange({ ...block, rows: newRows });
                }}
                className="p-1"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              onChange({
                ...block,
                rows: [
                  ...(block.rows || []),
                  new Array(block.headers?.length || 1).fill(""),
                ],
              })
            }
            className="flex items-center gap-1 text-[10px] font-semibold"
            style={{ color: "var(--primary)" }}
          >
            <Plus className="w-3 h-3" /> Add Row
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section Editor Component ───────────────────────────
function SectionEditor({
  section,
  admin,
  refresh,
  showToast,
  setConfirm,
}: {
  section: DocSection;
  admin: string;
  refresh: () => void;
  showToast: (msg: string) => void;
  setConfirm: (a: { message: string; action: () => void } | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<DocSection>({ ...section, blocks: section.blocks.map(b => ({ ...b })) });
  const [showAddBlock, setShowAddBlock] = useState(false);

  const handleSave = () => {
    updateDocSection(admin, section.id, editForm);
    refresh();
    showToast("Section updated");
    setEditing(false);
  };

  const updateBlock = (idx: number, block: DocContentBlock) => {
    const newBlocks = [...editForm.blocks];
    newBlocks[idx] = block;
    setEditForm({ ...editForm, blocks: newBlocks });
  };

  const removeBlock = (idx: number) => {
    setEditForm({
      ...editForm,
      blocks: editForm.blocks.filter((_, i) => i !== idx),
    });
  };

  const addBlock = (type: DocContentBlock["type"]) => {
    const newBlock: DocContentBlock = { type };
    if (type === "p" || type === "label" || type === "callout" || type === "code")
      newBlock.text = "";
    if (type === "ul" || type === "ol") newBlock.items = [""];
    if (type === "callout") newBlock.calloutType = "info";
    if (type === "table") {
      newBlock.headers = ["Column 1"];
      newBlock.rows = [[""]];
    }
    setEditForm({ ...editForm, blocks: [...editForm.blocks, newBlock] });
    setShowAddBlock(false);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const newBlocks = [...editForm.blocks];
    const target = idx + dir;
    if (target < 0 || target >= newBlocks.length) return;
    [newBlocks[idx], newBlocks[target]] = [newBlocks[target], newBlocks[idx]];
    setEditForm({ ...editForm, blocks: newBlocks });
  };

  const levelColor =
    section.level === 0 ? "var(--primary)" : "var(--text-muted)";

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--glass-border)",
        borderLeft: `4px solid ${levelColor}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-white/30"
        style={{ background: "rgba(255,255,255,0.5)" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown
              className="w-3.5 h-3.5"
              style={{ color: levelColor }}
            />
          ) : (
            <ChevronRight
              className="w-3.5 h-3.5"
              style={{ color: levelColor }}
            />
          )}
          <span
            className={`text-xs font-semibold ${section.level === 0 ? "uppercase tracking-wider" : ""}`}
            style={{ color: "var(--text-main)" }}
          >
            {section.title}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full"
            style={{
              background: "rgba(99,102,241,0.1)",
              color: "var(--primary)",
            }}
          >
            {section.blocks.length} blocks
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setConfirm({
                message: `Delete section "${section.title}"?`,
                action: () => {
                  deleteDocSection(admin, section.id);
                  refresh();
                  showToast("Section deleted");
                },
              });
            }}
            className="p-1 rounded"
            style={{ color: "var(--danger)" }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 py-3" style={{ background: "rgba(255,255,255,0.25)" }}>
          {!editing ? (
            <div>
              {/* Read-only preview */}
              {section.blocks.length === 0 ? (
                <p
                  className="text-xs italic py-4 text-center"
                  style={{ color: "var(--text-muted)" }}
                >
                  No content blocks yet
                </p>
              ) : (
                <div className="space-y-2 mb-3">
                  {section.blocks.slice(0, 5).map((block, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[10px] py-1 px-2 rounded"
                      style={{
                        background: "rgba(255,255,255,0.3)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {(() => {
                        const BIcon = BLOCK_ICONS[block.type] || Type;
                        return <BIcon className="w-3 h-3 flex-shrink-0" />;
                      })()}
                      <span className="truncate">
                        {block.text?.slice(0, 80) ||
                          block.items?.slice(0, 2).join(", ").slice(0, 80) ||
                          `${block.headers?.join(", ")} (${block.rows?.length || 0} rows)` ||
                          BLOCK_LABELS[block.type]}
                      </span>
                    </div>
                  ))}
                  {section.blocks.length > 5 && (
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      +{section.blocks.length - 5} more blocks
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={() => {
                  setEditing(true);
                  setEditForm({ ...section, blocks: section.blocks.map(b => ({ ...b, items: b.items ? [...b.items] : undefined, headers: b.headers ? [...b.headers] : undefined, rows: b.rows ? b.rows.map(r => [...r]) : undefined })) });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                Edit Section
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Title */}
              <Input
                label="Section Title"
                value={editForm.title}
                onChange={(v) => setEditForm({ ...editForm, title: v })}
              />

              {/* Level */}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Level
                </label>
                <select
                  value={editForm.level}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      level: parseInt(e.target.value),
                    })
                  }
                  className="px-3 py-2 rounded-lg text-xs outline-none"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid var(--glass-border)",
                    color: "var(--text-main)",
                  }}
                >
                  <option value="0">Part Heading (Level 0)</option>
                  <option value="1">Section (Level 1)</option>
                </select>
              </div>

              {/* Content Blocks */}
              <div>
                <label
                  className="block text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Content Blocks ({editForm.blocks.length})
                </label>

                {editForm.blocks.map((block, idx) => (
                  <div key={idx} className="relative">
                    {/* Move buttons */}
                    <div className="absolute -left-6 top-3 flex flex-col gap-0.5">
                      {idx > 0 && (
                        <button
                          onClick={() => moveBlock(idx, -1)}
                          className="p-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <ArrowUp className="w-2.5 h-2.5" />
                        </button>
                      )}
                      {idx < editForm.blocks.length - 1 && (
                        <button
                          onClick={() => moveBlock(idx, 1)}
                          className="p-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <ArrowDown className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <BlockEditor
                      block={block}
                      onChange={(b) => updateBlock(idx, b)}
                      onDelete={() => removeBlock(idx)}
                    />
                  </div>
                ))}
              </div>

              {/* Add Block */}
              {showAddBlock ? (
                <div
                  className="p-3 rounded-lg"
                  style={{
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.15)",
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Choose Block Type
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      Object.keys(BLOCK_LABELS) as DocContentBlock["type"][]
                    ).map((type) => {
                      const BIcon = BLOCK_ICONS[type] || Type;
                      return (
                        <button
                          key={type}
                          onClick={() => addBlock(type)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-colors hover:bg-white/50"
                          style={{
                            background: "rgba(255,255,255,0.6)",
                            border: "1px solid var(--glass-border)",
                            color: "var(--text-main)",
                          }}
                        >
                          <BIcon className="w-3 h-3" />
                          {BLOCK_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowAddBlock(false)}
                    className="mt-2 text-[10px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddBlock(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  <Plus className="w-3 h-3" /> Add Content Block
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "var(--success)" }}
                >
                  <Save className="w-3 h-3" /> Save Section
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN DOCUMENTATION EDITOR
// ═══════════════════════════════════════════════════════

export default function DocumentationEditor({
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
  const [metaForm, setMetaForm] = useState<DocMeta>({ ...data.docMeta });
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSection, setNewSection] = useState<DocSection>({
    id: "",
    title: "",
    level: 1,
    blocks: [],
  });

  const handleSaveMeta = () => {
    updateDocMeta(admin, metaForm);
    refresh();
    showToast("Document metadata updated");
  };

  const handleAddSection = () => {
    if (!newSection.id || !newSection.title) return;
    addDocSection(admin, newSection);
    refresh();
    showToast("Section added");
    setShowAddSection(false);
    setNewSection({ id: "", title: "", level: 1, blocks: [] });
  };

  return (
    <div>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--text-main)" }}
      >
        Documentation CMS
      </h3>

      {/* Document Metadata */}
      <div
        className="mb-6 p-4 rounded-xl"
        style={{
          background: "rgba(99,102,241,0.04)",
          border: "1px solid rgba(99,102,241,0.1)",
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--primary)" }}
        >
          Document Metadata
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            label="Title"
            value={metaForm.title}
            onChange={(v) => setMetaForm({ ...metaForm, title: v })}
          />
          <Input
            label="Version"
            value={metaForm.version}
            onChange={(v) => setMetaForm({ ...metaForm, version: v })}
          />
          <Input
            label="Prepared By"
            value={metaForm.preparedBy}
            onChange={(v) => setMetaForm({ ...metaForm, preparedBy: v })}
          />
          <Input
            label="Date"
            value={metaForm.date}
            onChange={(v) => setMetaForm({ ...metaForm, date: v })}
          />
        </div>
        <button
          onClick={handleSaveMeta}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: "var(--primary)" }}
        >
          <Save className="w-3 h-3" /> Save Metadata
        </button>
      </div>

      {/* Sections Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            Content Sections ({data.docSections.length})
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {data.docSections.length === 0
              ? "No custom sections yet. The default documentation will display. Add sections to override."
              : "Click a section to expand and edit its content blocks."}
          </p>
        </div>
        <button
          onClick={() => setShowAddSection(!showAddSection)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: "var(--primary)" }}
        >
          <Plus className="w-3 h-3" /> Add Section
        </button>
      </div>

      {/* Add Section Form */}
      {showAddSection && (
        <div
          className="mb-4 p-4 rounded-xl"
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Input
              label="Section ID"
              value={newSection.id}
              onChange={(v) => setNewSection({ ...newSection, id: v })}
            />
            <Input
              label="Title"
              value={newSection.title}
              onChange={(v) => setNewSection({ ...newSection, title: v })}
            />
            <div>
              <label
                className="block text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Level
              </label>
              <select
                value={newSection.level}
                onChange={(e) =>
                  setNewSection({
                    ...newSection,
                    level: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-main)",
                }}
              >
                <option value="0">Part Heading</option>
                <option value="1">Section</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddSection}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: "var(--success)" }}
            >
              <Save className="w-3 h-3" /> Save
            </button>
            <button
              onClick={() => setShowAddSection(false)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Section List */}
      <div className="space-y-2">
        {data.docSections.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            admin={admin}
            refresh={refresh}
            showToast={showToast}
            setConfirm={setConfirm}
          />
        ))}
      </div>

      {data.docSections.length === 0 && (
        <div className="text-center py-8">
          <p
            className="text-sm mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            The Documentation page currently uses its default content.
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Add sections above to create custom, editable documentation that replaces the defaults.
          </p>
        </div>
      )}
    </div>
  );
}
