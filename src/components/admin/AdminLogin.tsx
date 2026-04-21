import { useState } from "react";
import { X, Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_CREDENTIALS = [
  { username: "admin1", password: "MoPT@2026!", displayName: "Admin 1" },
  { username: "admin2", password: "MoPT@2026!", displayName: "Admin 2" },
];

interface AdminLoginProps {
  onLogin: (adminName: string) => void;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = ADMIN_CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );
    if (match) {
      sessionStorage.setItem("mopt_admin", match.displayName);
      onLogin(match.displayName);
    } else {
      setError("Invalid credentials");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
    >
      <div
        className={`glass p-8 max-w-sm w-full relative ${shake ? "animate-shake" : ""}`}
        style={{
          borderTop: "4px solid var(--primary)",
          animation: shake ? "shake 0.5s ease-in-out" : "fadeScaleIn 0.3s ease-out",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/30 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.12)" }}
          >
            <Lock className="w-5 h-5" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>
              Admin Access
            </h3>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Authorized personnel only
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 px-4 py-2.5 rounded-lg text-xs font-medium"
            style={{
              background: "rgba(239,68,68,0.1)",
              color: "var(--danger)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-main)",
              }}
              placeholder="Enter username"
              autoFocus
              autoComplete="off"
            />
          </div>

          <div>
            <label
              className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-main)",
                }}
                placeholder="Enter password"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                ) : (
                  <Eye className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ background: "var(--primary)" }}
          >
            Sign In
          </button>
        </form>

        <p
          className="text-[10px] text-center mt-4"
          style={{ color: "var(--text-muted)" }}
        >
          Access is logged and monitored
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
