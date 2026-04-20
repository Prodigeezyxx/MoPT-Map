/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { LayoutDashboard, ListTodo, Map, AlertTriangle } from "lucide-react";
import { cn } from "./lib/utils";
import DashboardPage from "./components/pages/Dashboard";
import DeliverablesPage from "./components/pages/Deliverables";
import RoadmapPage from "./components/pages/Roadmap";
import RisksPage from "./components/pages/Risks";

type Page = "dashboard" | "deliverables" | "roadmap" | "risks";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roadmap", label: "Roadmap", icon: Map },
    { id: "deliverables", label: "Deliverables", icon: ListTodo },
    { id: "risks", label: "Risks Register", icon: AlertTriangle },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "roadmap":
        return <RoadmapPage />;
      case "deliverables":
        return <DeliverablesPage />;
      case "risks":
        return <RisksPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-full font-sans antialiased overflow-hidden" style={{ background: 'var(--bg-gradient)', color: 'var(--text-main)' }}>
      {/* App Container */}
      <div className="flex flex-1 w-full p-4 gap-4 overflow-hidden h-full">
        {/* Sidebar */}
        <aside className="glass w-64 flex-shrink-0 flex flex-col items-center py-8">
          <div className="px-6 mb-8 w-full">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>MoPT</h1>
            <p className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>Product Roadmap</p>
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
