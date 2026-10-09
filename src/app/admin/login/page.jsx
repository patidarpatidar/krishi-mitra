
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Sprout,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("कृपया email और password भरें।");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
        cache: "no-store",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Login failed (${response.status})`
        );
      }

      const { token, user } = result.data || {};

      if (!token || user?.role !== "admin") {
        throw new Error(
          "Backend से valid admin token नहीं मिला।"
        );
      }

      // Save the real backend session.
      localStorage.setItem("krishi_mitra_admin_token", token);
      localStorage.setItem(
        "krishi_mitra_admin",
        JSON.stringify(user)
      );

      // Replace login page in browser history.
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      console.error("Admin login error:", err);

      setError(
        err.message ||
          "Login नहीं हो पाया। Backend server और API URL चेक करें।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold">
            Krishi Mitra Admin
          </h1>

          <p className="text-slate-400 mt-2">
            Content Management Panel
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm mb-2">
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="username"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-11 py-3.5 outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm break-words"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? "Login हो रहा है..." : "Admin Login"}

              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Secure backend authentication
          </div>

          <Link
            href="/"
            className="block text-center mt-5 text-sm text-slate-400 hover:text-white"
          >
            ← Main Website
          </Link>
        </div>
      </div>
    </main>
  );
}