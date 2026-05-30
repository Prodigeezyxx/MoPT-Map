/**
 * Report Store — Manages submitted monthly reports.
 * Combines mock data with user-submitted reports from localStorage.
 * Easy to migrate to Supabase later by swapping the persistence layer.
 */

import { generateMockReports, type TeamReport } from "./reportData";

const STORAGE_KEY = "mopt_submitted_reports";

let _submitted: TeamReport[] | null = null;
let _listeners: Set<() => void> = new Set();

function loadSubmitted(): TeamReport[] {
  if (_submitted) return _submitted;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    _submitted = raw ? JSON.parse(raw) : [];
  } catch {
    _submitted = [];
  }
  return _submitted!;
}

function saveSubmitted(): void {
  if (!_submitted) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_submitted));
  } catch {
    // localStorage might be full or unavailable
  }
}

/** Returns the merged list: mock data first, overridden by submitted reports for matching member+month. */
export function getAllReports(): TeamReport[] {
  const mock = generateMockReports();
  const submitted = loadSubmitted();

  // Build a map keyed by memberId+month so submissions override mocks
  const map = new Map<string, TeamReport>();
  for (const r of mock) {
    map.set(`${r.memberId}-${r.month}`, r);
  }
  for (const r of submitted) {
    map.set(`${r.memberId}-${r.month}`, r);
  }
  return Array.from(map.values());
}

/** Returns only the submitted (user-uploaded) reports. */
export function getSubmittedReports(): TeamReport[] {
  return [...loadSubmitted()];
}

/** Submit (or update) a monthly report. Returns the saved report. */
export function submitReport(report: TeamReport): TeamReport {
  const submitted = loadSubmitted();
  const idx = submitted.findIndex((r) => r.memberId === report.memberId && r.month === report.month);
  const final: TeamReport = { ...report, isSubmitted: true, submittedAt: new Date().toISOString() };
  if (idx >= 0) {
    submitted[idx] = final;
  } else {
    submitted.push(final);
  }
  _submitted = submitted;
  saveSubmitted();
  notify();
  return final;
}

/** Delete a submitted report (revert to mock). */
export function deleteSubmittedReport(memberId: string, month: string): void {
  const submitted = loadSubmitted();
  _submitted = submitted.filter((r) => !(r.memberId === memberId && r.month === month));
  saveSubmitted();
  notify();
}

/** Clear all submitted reports. */
export function clearAllSubmitted(): void {
  _submitted = [];
  saveSubmitted();
  notify();
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function onReportsChange(cb: () => void): () => void {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

function notify(): void {
  for (const cb of _listeners) {
    try { cb(); } catch { /* ignore */ }
  }
}

/** Stats helpers */
export function getSubmissionStats(month: string): { submitted: number; total: number; rate: number } {
  const submitted = loadSubmitted().filter((r) => r.month === month).length;
  const total = 10; // TEAM_ROSTER length — kept in sync manually for simplicity
  return { submitted, total, rate: total > 0 ? (submitted / total) * 100 : 0 };
}
