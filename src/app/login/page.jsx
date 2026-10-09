"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  AlertCircle,
} from "lucide-react";

import { farmerApi, isFarmerLoggedIn } from "@/lib/farmerApi";

export default function LoginPage() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // CHECK ALREADY LOGGED-IN FARMER
  // =========================================================
  useEffect(() => {
    if (isFarmerLoggedIn()) {
      router.replace("/farmer");
    }
  }, [router]);

  // =========================================================
  // LOGIN SUBMIT (DYNAMIC BACKEND API)
  // =========================================================
  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const loginValue = login.trim();

    if (!loginValue || !password) {
      setError("कृपया मोबाइल/ईमेल और पासवर्ड भरें।");
      return;
    }

    try {
      setLoading(true);
      await farmerApi.login(loginValue, password);

      // Redirect to farmer dashboard
      router.push("/farmer");
      router.refresh();
    } catch (err) {
      console.error("Farmer login error:", err);
      setError(
        err.message ||
          "लॉगिन के दौरान समस्या हुई। कृपया मोबाइल/ईमेल और पासवर्ड चेक करें।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold">किसान लॉगिन</h1>

          <p className="text-slate-400 mt-2">
            अपने कृषि मित्र किसान डैशबोर्ड में प्रवेश करें
          </p>
        </div>

        {/* =====================================================
            LOGIN CARD
        ====================================================== */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* MOBILE / EMAIL */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                मोबाइल नंबर या ईमेल
              </label>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  {login.includes("@") ? (
                    <Mail className="w-5 h-5" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </div>

                <input
                  type="text"
                  value={login}
                  onChange={(e) => {
                    setLogin(e.target.value);
                    setError("");
                  }}
                  placeholder="9876543210 / email@example.com"
                  autoComplete="username"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-slate-300">
                  पासवर्ड
                </label>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="अपना पासवर्ड दर्ज करें"
                  autoComplete="current-password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-11 py-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3.5 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="leading-5">{error}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  लॉगिन हो रहा है...
                </>
              ) : (
                <>
                  लॉगिन करें
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-3">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>किसान अकाउंट नहीं है?</span>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 hover:underline"
            >
              नया किसान रजिस्ट्रेशन करें
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* SECURITY INFO */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>सुरक्षित कृषि मित्र किसान पोर्टल प्रमाणीकरण</span>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← मुख्य वेबसाइट पर वापस जाएं
          </Link>
        </div>
      </div>
    </main>
  );
}