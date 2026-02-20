"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Signup = {
  id: string;
  email: string;
  role: string;
  school: string | null;
  referral: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [storedKey, setStoredKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSignups = useCallback(async (key: string): Promise<{ signups: Signup[] } | { error: string }> => {
    const res = await fetch("/api/waitlist", {
      headers: { "X-Admin-Key": key },
      cache: "no-store",
    });
    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await res.json().catch(() => ({}))
      : {};
    if (res.status === 401) {
      return { error: data.error || "Invalid password" };
    }
    if (res.status === 404) {
      return { error: "API not found. Restart the dev server and try again." };
    }
    if (!res.ok) {
      return { error: data.error || `Failed to fetch (${res.status})` };
    }
    return { signups: Array.isArray(data.signups) ? data.signups : [] };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await fetchSignups(password);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_key", password);
      }
      setStoredKey(password);
      setSignups(result.signups);
    } catch (err) {
      setError("Something went wrong. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_key");
    }
    setStoredKey(null);
    setSignups([]);
    setPassword("");
  };

  useEffect(() => {
    const key = typeof window !== "undefined" ? sessionStorage.getItem("admin_key") : null;
    if (key) {
      setStoredKey(key);
      setLoading(true);
      fetchSignups(key)
        .then((result) => {
          if ("signups" in result) setSignups(result.signups);
          else {
            sessionStorage.removeItem("admin_key");
            setStoredKey(null);
            setError("error" in result ? result.error : "Session expired");
          }
        })
        .catch(() => {
          sessionStorage.removeItem("admin_key");
          setStoredKey(null);
        })
        .finally(() => setLoading(false));
    }
  }, [fetchSignups]);

  useEffect(() => {
    if (!storedKey) return;
    const interval = setInterval(() => {
      fetchSignups(storedKey).then((result) => {
        if ("signups" in result) setSignups(result.signups);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [storedKey, fetchSignups]);

  const refresh = () => {
    if (storedKey) {
      setLoading(true);
      fetchSignups(storedKey)
        .then((result) => {
          if ("signups" in result) {
            setSignups(result.signups);
            setMessage("Refreshed");
            setTimeout(() => setMessage(""), 2e3);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const exportCsv = () => {
    const headers = ["Email", "Role", "School", "Referral", "Signed up"];
    const rows = signups.map((s) => [
      s.email,
      s.role,
      s.school ?? "",
      s.referral ?? "",
      new Date(s.created_at).toLocaleString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compass-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!storedKey) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-[#1a2332] mb-2">Admin Login</h1>
          <p className="text-sm text-[#6b7280] mb-6">
            Enter your admin password to view waitlist signups. Default: <code className="bg-[#f3f4f6] px-1 rounded">compass</code> if ADMIN_PASSWORD is not set.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:outline-none focus:ring-2 focus:ring-[#7c5c9e]/30 focus:border-[#7c5c9e]"
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#5b4b8a] text-white font-medium hover:bg-[#4a3d72] disabled:opacity-70"
            >
              {loading ? "Checking…" : "Log in"}
            </button>
          </form>
          <Link href="/" className="block mt-6 text-center text-sm text-[#6b7280] hover:text-[#1a2332]">
            ← Back to Compass
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="bg-white border-b border-[#e8e8e8] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold text-[#1a2332] hover:text-[#5b4b8a]">
              Compass
            </Link>
            <span className="text-[#6b7280]">/</span>
            <h1 className="text-lg font-semibold text-[#1a2332]">Waitlist Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {message && <span className="text-sm text-green-600">{message}</span>}
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-[#e2e8f0] text-sm font-medium hover:bg-[#f9f9f9] disabled:opacity-70"
            >
              Refresh
            </button>
            <button
              onClick={exportCsv}
              className="px-4 py-2 rounded-lg bg-[#5b4b8a] text-white text-sm font-medium hover:bg-[#4a3d72]"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm text-[#6b7280] hover:text-[#1a2332]"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#e8e8e8] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e8e8e8] flex items-center justify-between">
            <h2 className="font-semibold text-[#1a2332]">
              {signups.length} signup{signups.length !== 1 ? "s" : ""}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#e8e8e8]">
                  <th className="text-left px-6 py-3 font-medium text-[#4a5568]">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-[#4a5568]">Role</th>
                  <th className="text-left px-6 py-3 font-medium text-[#4a5568]">School</th>
                  <th className="text-left px-6 py-3 font-medium text-[#4a5568]">Referral</th>
                  <th className="text-left px-6 py-3 font-medium text-[#4a5568]">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {signups.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[#6b7280]">
                      No signups yet. Make sure Supabase is configured in .env.local.
                    </td>
                  </tr>
                ) : (
                  signups.map((s) => (
                    <tr key={s.id} className="border-b border-[#e8e8e8] hover:bg-[#fafafa]">
                      <td className="px-6 py-4 text-[#1a2332]">{s.email}</td>
                      <td className="px-6 py-4 text-[#4a5568]">{s.role}</td>
                      <td className="px-6 py-4 text-[#4a5568]">{s.school ?? "—"}</td>
                      <td className="px-6 py-4 text-[#4a5568]">{s.referral ?? "—"}</td>
                      <td className="px-6 py-4 text-[#6b7280]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
