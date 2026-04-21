/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { LayoutDashboard, ListTodo, Map, AlertTriangle, BookOpen, Settings } from "lucide-react";
import { cn } from "./lib/utils";
import { getStore, type DataStoreShape } from "./lib/dataStore";
import DashboardPage from "./components/pages/Dashboard";
import DeliverablesPage from "./components/pages/Deliverables";
import RoadmapPage from "./components/pages/Roadmap";
import RisksPage from "./components/pages/Risks";
import DocumentationPage from "./components/pages/Documentation";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPanel from "./components/admin/AdminPanel";

type Page = "dashboard" | "deliverables" | "roadmap" | "risks" | "documentation" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [data, setData] = useState<DataStoreShape>(getStore());

  // ─── Admin State ──────────────────────────────────────
  const [showLogin, setShowLogin] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  // ─── 5-Click Secret Handler ───────────────────────────
  const clickTimestamps = useRef<number[]>([]);

  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    clickTimestamps.current.push(now);

    // Keep only clicks in the last 3 seconds
    clickTimestamps.current = clickTimestamps.current.filter(
      (t) => now - t < 3000
    );

    if (clickTimestamps.current.length >= 5) {
      clickTimestamps.current = [];
      if (adminUser) {
        // Already logged in — go to admin panel
        setCurrentPage("admin");
      } else {
        setShowLogin(true);
      }
    }
  }, [adminUser]);

  // ─── Restore admin session ────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("mopt_admin");
    if (stored) setAdminUser(stored);
  }, []);

  // ─── Refresh data from store ──────────────────────────
  const refreshData = useCallback(() => {
    setData(getStore());
  }, []);

  const handleLogin = (name: string) => {
    setAdminUser(name);
    setShowLogin(false);
    setCurrentPage("admin");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mopt_admin");
    setAdminUser(null);
    setCurrentPage("dashboard");
  };

  const navItems = [
    { id: "documentation", label: "Documentation", icon: BookOpen },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "deliverables", label: "Deliverables", icon: ListTodo },
    { id: "risks", label: "Risks Register", icon: AlertTriangle },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage data={data} />;
      case "roadmap":
        return <RoadmapPage data={data} />;
      case "deliverables":
        return <DeliverablesPage data={data} />;
      case "risks":
        return <RisksPage data={data} />;
      case "documentation":
        return <DocumentationPage />;
      case "admin":
        return adminUser ? (
          <AdminPanel
            admin={adminUser}
            onDataChange={refreshData}
            onLogout={handleLogout}
          />
        ) : (
          <DashboardPage data={data} />
        );
      default:
        return <DashboardPage data={data} />;
    }
  };

  return (
    <div className="flex h-screen w-full font-sans antialiased overflow-hidden" style={{ background: 'var(--bg-gradient)', color: 'var(--text-main)' }}>
      {/* App Container */}
      <div className="flex flex-1 w-full p-4 gap-4 overflow-hidden h-full">
        {/* Sidebar */}
        <aside className="glass w-64 flex-shrink-0 flex flex-col items-center py-8">
          <div className="px-6 mb-8 w-full">
            <h1
              className="text-xl font-bold tracking-tight cursor-pointer select-none transition-transform active:scale-95"
              style={{ color: 'var(--text-main)' }}
              onClick={handleLogoClick}
            >
              {data.branding.title}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
              {data.branding.subtitle}
            </p>
          </div>
          <nav className="flex flex-col gap-1 px-4 w-full flex-grow">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left",
                  currentPage === item.id
                    ? "font-semibold"
                    : "font-medium hover:bg-white/40"
                )}
                style={{
                  backgroundColor: currentPage === item.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: currentPage === item.id ? 'var(--primary)' : 'var(--text-main)'
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}

            {/* Admin nav item — only visible when logged in */}
            {adminUser && (
              <button
                onClick={() => setCurrentPage("admin")}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left mt-2",
                  currentPage === "admin"
                    ? "font-semibold"
                    : "font-medium hover:bg-white/40"
                )}
                style={{
                  backgroundColor: currentPage === "admin" ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: currentPage === "admin" ? 'var(--primary)' : 'var(--text-main)',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '12px',
                  marginTop: '8px',
                }}
              >
                <Settings className="w-4 h-4" />
                Admin Panel
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <AdminLogin
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  );
}
