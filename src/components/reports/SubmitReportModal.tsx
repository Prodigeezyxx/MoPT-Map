import React, { useState, useEffect, useMemo } from "react";
import { X, ChevronRight, ChevronLeft, Check, User, Calendar, Star, Activity, Briefcase, Award, Lightbulb, Zap, Clock as ClockIcon, HeartHandshake, TrendingUp } from "lucide-react";
import { TEAM_ROSTER, EVAL_LABELS, REPORT_MONTHS, ALL_MODULES, type SelfEval, type TeamReport } from "../../lib/reportData";
import { submitReport } from "../../lib/reportStore";

interface SubmitReportModalProps {
  onClose: () => void;
  onSubmitted: () => void;
  defaultMemberId?: string;
}

const STEPS = [
  { id: "identity", label: "Identity", icon: User },
  { id: "eval", label: "Self-Evaluation", icon: Star },
  { id: "activity", label: "Activity Metrics", icon: Activity },
  { id: "modules", label: "Modules", icon: Briefcase },
  { id: "planning", label: "Planning & Wellbeing", icon: TrendingUp },
  { id: "narrative", label: "Achievements", icon: Award },
];

export default function SubmitReportModal({ onClose, onSubmitted, defaultMemberId }: SubmitReportModalProps) {
  const [step, setStep] = useState(0);
  const [memberId, setMemberId] = useState(defaultMemberId || TEAM_ROSTER[0].id);
  const [month, setMonth] = useState(REPORT_MONTHS[REPORT_MONTHS.length - 1]);
  const [year] = useState("2026");

  const member = useMemo(() => TEAM_ROSTER.find((m) => m.id === memberId)!, [memberId]);

  const [selfEval, setSelfEval] = useState<SelfEval>({
    vrModule: 3, vrEnv: 3, haptic: 3, aiFeedback: 3, computerVision: 3,
    skillsIntel: 3, agenticAI: 3, softwareEng: 3, lmsIntegration: 3,
    innovation: 3, collaboration: 3, creativity: 3, codingLearning: 3, professionalDev: 3,
  });

  const [hoursLogged, setHoursLogged] = useState(160);
  const [tasksCompleted, setTasksCompleted] = useState(20);
  const [innovationIdeas, setInnovationIdeas] = useState(2);
  const [experimentsCompleted, setExperimentsCompleted] = useState(1);
  const [meetingsAttended, setMeetingsAttended] = useState(12);
  const [cpHours, setCpHours] = useState(8);
  const [blockersResolved, setBlockersResolved] = useState(3);
  const [crossTeamCollabs, setCrossTeamCollabs] = useState(3);

  const [modulesWorked, setModulesWorked] = useState<string[]>([]);
  const [keyAchievement, setKeyAchievement] = useState("");
  const [nextMonthFocus, setNextMonthFocus] = useState("");
  const [priorities, setPriorities] = useState<string[]>(["", "", ""]);
  const [overallRating, setOverallRating] = useState(3);
  const [wellbeingScore, setWellbeingScore] = useState(4);
  const [blockerNote, setBlockerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ─── Close on Escape ───
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const toggleModule = (m: string) => {
    setModulesWorked((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const report: TeamReport = {
      id: `${memberId}-${month}-${Date.now()}`,
      memberId,
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      team: member.area,
      month,
      year,
      selfEval,
      hoursLogged,
      tasksCompleted,
      modulesWorked,
      innovationIdeas,
      experimentsCompleted,
      meetingsAttended,
      cpHours,
      blockersResolved,
      crossTeamCollabs,
      keyAchievement: keyAchievement || "—",
      nextMonthFocus: nextMonthFocus || "—",
      priorities: priorities.filter((p) => p.trim()),
      overallRating,
      wellbeingScore,
      blockerNote: blockerNote || undefined,
      submittedAt: new Date().toISOString(),
      isSubmitted: true,
    };
    submitReport(report);
    setTimeout(() => {
      setSubmitting(false);
      onSubmitted();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div className="glass w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b" style={{ borderColor: "var(--glass-border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>Submit Monthly Report</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Your input populates the team dashboard</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/40 transition-colors">
              <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center gap-1.5">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex-1 cursor-pointer"
                  style={{
                    background: i === step ? "var(--primary)" : i < step ? "rgba(16,185,129,0.15)" : "rgba(0,0,0,0.04)",
                    color: i === step ? "#fff" : i < step ? "var(--success)" : "var(--text-muted)",
                  }}
                  onClick={() => setStep(i)}
                >
                  {i < step ? <Check className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <Field label="Team Member" icon={User}>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                >
                  {TEAM_ROSTER.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                  ))}
                </select>
              </Field>
              <Field label="Reporting Month" icon={Calendar}>
                <div className="flex gap-2 flex-wrap">
                  {REPORT_MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonth(m)}
                      className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        background: month === m ? "var(--primary)" : "rgba(0,0,0,0.04)",
                        color: month === m ? "#fff" : "var(--text-main)",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Year: {year}</p>
              </Field>
              <div className="p-3 rounded-lg flex items-start gap-2.5" style={{ background: "rgba(99,102,241,0.08)" }}>
                <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                <div className="text-[11px] leading-relaxed" style={{ color: "var(--text-main)" }}>
                  Submitting a report for an existing month <strong>overrides</strong> the mock data for that team member in the dashboard.
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Rate yourself 1 (Not Met) to 5 (Outstanding) across each area.
              </p>
              {EVAL_LABELS.map((l) => (
                <div key={l.key} className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.03)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium" style={{ color: l.color }}>{l.label}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: l.color + "22", color: l.color }}>
                      {l.okr === "TEAM" ? "Team" : l.okr}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelfEval((s) => ({ ...s, [l.key]: v }))}
                        className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all"
                        style={{
                          background: selfEval[l.key] === v ? l.color : "rgba(0,0,0,0.05)",
                          color: selfEval[l.key] === v ? "#fff" : "var(--text-muted)",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Your activity for {month} {year}.</p>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Hours Logged" value={hoursLogged} onChange={setHoursLogged} suffix="h" />
                <NumberField label="Tasks Completed" value={tasksCompleted} onChange={setTasksCompleted} />
                <NumberField label="Innovation Ideas" value={innovationIdeas} onChange={setInnovationIdeas} />
                <NumberField label="Experiments / POCs Completed" value={experimentsCompleted} onChange={setExperimentsCompleted} />
                <NumberField label="Meetings Attended" value={meetingsAttended} onChange={setMeetingsAttended} />
                <NumberField label="CPD / Learning Hours" value={cpHours} onChange={setCpHours} suffix="h" />
                <NumberField label="Blockers Resolved" value={blockersResolved} onChange={setBlockersResolved} />
                <NumberField label="Cross-team Collaborations" value={crossTeamCollabs} onChange={setCrossTeamCollabs} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tick the clinical modules you contributed to this month.</p>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap className="w-3 h-3" style={{ color: "var(--success)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--success)" }}>Active this sprint</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ALL_MODULES.filter((m) => m.stage === "active").map((m) => {
                    const active = modulesWorked.includes(m.name);
                    return (
                      <button
                        key={m.name}
                        onClick={() => toggleModule(m.name)}
                        className="flex items-start gap-2 p-2.5 rounded-lg text-xs text-left transition-all"
                        style={{
                          background: active ? "rgba(16,185,129,0.12)" : "rgba(0,0,0,0.03)",
                          border: active ? "1px solid var(--success)" : "1px solid transparent",
                          color: active ? "var(--success)" : "var(--text-main)",
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: active ? "var(--success)" : "rgba(0,0,0,0.15)", background: active ? "var(--success)" : "transparent" }}>
                          {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>{m.name}</div>
                          <div className="text-[9px] mt-0.5 font-normal" style={{ color: active ? "var(--success)" : "var(--text-muted)" }}>{m.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ClockIcon className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>In pipeline (next sprints)</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {ALL_MODULES.filter((m) => m.stage === "pipeline").map((m) => {
                    const active = modulesWorked.includes(m.name);
                    return (
                      <button
                        key={m.name}
                        onClick={() => toggleModule(m.name)}
                        className="flex items-start gap-2 p-2.5 rounded-lg text-xs text-left transition-all"
                        style={{
                          background: active ? "rgba(99,102,241,0.12)" : "rgba(0,0,0,0.02)",
                          border: active ? "1px solid var(--primary)" : "1px solid transparent",
                          color: active ? "var(--primary)" : "var(--text-muted)",
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        <div className="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5" style={{ borderColor: active ? "var(--primary)" : "rgba(0,0,0,0.15)", background: active ? "var(--primary)" : "transparent" }}>
                          {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>{m.name}</div>
                          <div className="text-[9px] mt-0.5 font-normal" style={{ color: active ? "var(--primary)" : "var(--text-muted)" }}>{m.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{modulesWorked.length} module(s) selected</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Forward planning and wellbeing check (per form §11-12).</p>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <TrendingUp className="w-3 h-3" /> Top 3 Priorities Next Month
                </label>
                {[0, 1, 2].map((i) => (
                  <input
                    key={i}
                    value={priorities[i]}
                    onChange={(e) => {
                      const next = [...priorities];
                      next[i] = e.target.value;
                      setPriorities(next);
                    }}
                    placeholder={`Priority ${i + 1}...`}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 mb-2"
                    style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.03)" }}>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
                    <Star className="w-3 h-3 inline mr-1" /> Overall Performance
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setOverallRating(v)}
                        className="flex-1 py-2 rounded-md text-xs font-semibold transition-all"
                        style={{
                          background: overallRating === v ? "var(--primary)" : "rgba(0,0,0,0.05)",
                          color: overallRating === v ? "#fff" : "var(--text-muted)",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.03)" }}>
                  <label className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
                    <HeartHandshake className="w-3 h-3 inline mr-1" /> Wellbeing
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setWellbeingScore(v)}
                        className="flex-1 py-2 rounded-md text-xs font-semibold transition-all"
                        style={{
                          background: wellbeingScore === v ? "var(--success)" : "rgba(0,0,0,0.05)",
                          color: wellbeingScore === v ? "#fff" : "var(--text-muted)",
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Field label="Known Blockers (optional)" icon={X}>
                <textarea
                  value={blockerNote}
                  onChange={(e) => setBlockerNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Waiting on ITU access sign-off for ETI module"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                />
              </Field>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <Field label="Key Achievement This Month" icon={Award}>
                <textarea
                  value={keyAchievement}
                  onChange={(e) => setKeyAchievement(e.target.value)}
                  rows={3}
                  placeholder="e.g. Shipped Neonatal Resus v1 with clinician sign-off"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                />
              </Field>
              <Field label="Primary Focus Next Month" icon={ChevronRight}>
                <textarea
                  value={nextMonthFocus}
                  onChange={(e) => setNextMonthFocus(e.target.value)}
                  rows={3}
                  placeholder="e.g. Skills Intelligence dashboard API delivery"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                />
              </Field>
              <div className="p-3 rounded-lg" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--success)" }}>Submission Summary</p>
                <div className="text-[11px] space-y-0.5" style={{ color: "var(--text-main)" }}>
                  <div><strong>{member.name}</strong> · {member.role}</div>
                  <div>{month} {year} · {hoursLogged}h logged · {tasksCompleted} tasks · {modulesWorked.length} modules</div>
                  <div>Avg self-eval: <strong>{((Object.values(selfEval) as number[]).reduce((a, b) => a + b, 0) / 14).toFixed(2)}</strong> / 5</div>
                  <div>Overall: <strong>{overallRating}</strong>/5 · Wellbeing: <strong>{wellbeingScore}</strong>/5 · Priorities: {priorities.filter((p) => p.trim()).length}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: "var(--glass-border)" }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/40"
            style={{ color: "var(--text-main)" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors text-white"
              style={{ background: "var(--primary)" }}
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors text-white disabled:opacity-60"
              style={{ background: "var(--success)" }}
            >
              <Check className="w-3.5 h-3.5" /> {submitting ? "Submitting..." : "Submit Report"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
        <Icon className="w-3 h-3" /> {label}
      </label>
      {children}
    </div>
  );
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.03)" }}>
      <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: "var(--text-muted)" }}>{label}</label>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center hover:bg-white/60 transition-colors"
          style={{ background: "rgba(0,0,0,0.06)", color: "var(--text-main)" }}
        >−</button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="flex-1 text-center text-sm font-semibold bg-transparent focus:outline-none"
          style={{ color: "var(--text-main)" }}
        />
        {suffix && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{suffix}</span>}
        <button
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center hover:bg-white/60 transition-colors"
          style={{ background: "rgba(0,0,0,0.06)", color: "var(--text-main)" }}
        >+</button>
      </div>
    </div>
  );
}
