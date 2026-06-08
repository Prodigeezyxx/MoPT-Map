import { useState } from "react";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";

const CREDENTIALS = { username: "MoPT", password: "moptteam2025@@$$" };
const STORAGE_KEY = "mopt_auth";

export function getAuth(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function clearAuth(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(getAuth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      username.trim() === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
    } else {
      setError("Invalid username or password");
    }
  };

  if (authed) return <>{children}</>;

  return (
    <div
      className="flex h-screen w-full items-center justify-center p-4"
      style={{ background: "var(--bg-gradient)" }}
    >
      <form
        onSubmit={handleLogin}
        className="glass w-full max-w-sm p-8 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(99,102,241,0.1)" }}
          >
            <Lock className="w-7 h-7" style={{ color: "var(--primary)" }} />
          </div>
          <h1 className="text-2xl font-light tracking-tight" style={{ color: "var(--text-main)" }}>
            MoPT
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Multi-Profession Training Platform
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
              style={{ color: "var(--text-muted)" }}
            >
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
              placeholder="Enter username"
              autoFocus
            />
          </div>

          <div>
            <label
              className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm border bg-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all pr-10"
                style={{ borderColor: "var(--glass-border)", color: "var(--text-main)" }}
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/40 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "var(--danger)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--danger)" }} />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all hover:shadow-md active:scale-[0.98]"
            style={{ background: "var(--primary)" }}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
        </div>

        <p className="text-[10px] text-center mt-6" style={{ color: "var(--text-muted)" }}>
          Shared team access · one account
        </p>
      </form>
    </div>
  );
}
