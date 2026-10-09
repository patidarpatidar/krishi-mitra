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

import { demoFarmer } from "@/data/farmerDemo";

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
    try {
      const storedFarmer = localStorage.getItem("krishi_mitra_farmer");

      if (!storedFarmer) return;

      const farmer = JSON.parse(storedFarmer);

      if (farmer?.loggedIn) {
        router.replace("/farmer");
      }
    } catch {
      localStorage.removeItem("krishi_mitra_farmer");
    }
  }, [router]);

  // =========================================================
  // NORMALIZE PHONE
  // =========================================================

  function normalizePhone(value) {
    return value.replace(/\D/g, "");
  }

  // =========================================================
  // LOGIN
  // =========================================================

  function handleLogin(e) {
    e.preventDefault();

    setError("");

    const loginValue = login.trim();

    if (!loginValue || !password) {
      setError("कृपया मोबाइल/ईमेल और पासवर्ड भरें।");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const normalizedLogin = loginValue.toLowerCase();

        // =====================================================
        // GET REGISTERED FARMERS
        // =====================================================

        const registeredUsers = JSON.parse(
          localStorage.getItem("krishi_mitra_users") || "[]"
        );

        // =====================================================
        // FIND USER BY EMAIL OR PHONE
        // =====================================================

        const farmer = registeredUsers.find((user) => {
          const userEmail = String(user.email || "").toLowerCase();

          const userPhone = normalizePhone(
            String(user.phone || "")
          );

          const enteredPhone = normalizePhone(loginValue);

          const emailMatch =
            userEmail &&
            userEmail === normalizedLogin;

          const phoneMatch =
            userPhone &&
            userPhone === enteredPhone;

          return emailMatch || phoneMatch;
        });

        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (!farmer) {
          setError(
            "यह मोबाइल नंबर या ईमेल registered नहीं है। पहले किसान registration करें।"
          );

          setLoading(false);
          return;
        }

        // =====================================================
        // PASSWORD CHECK
        // =====================================================

        if (String(farmer.password) !== String(password)) {
          setError("पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें।");

          setLoading(false);
          return;
        }

        // =====================================================
        // CREATE LOGIN SESSION
        // =====================================================

        const loggedInFarmer = {
          ...farmer,
          loggedIn: true,
          loginAt: new Date().toISOString(),
        };

        localStorage.setItem(
          "krishi_mitra_farmer",
          JSON.stringify(loggedInFarmer)
        );

        // =====================================================
        // REDIRECT
        // =====================================================

        router.push("/farmer");
      } catch (err) {
        console.error("Farmer login error:", err);

        setError(
          "लॉगिन के दौरान समस्या हुई। कृपया दोबारा प्रयास करें।"
        );

        setLoading(false);
      }
    }, 500);
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

          <h1 className="text-3xl font-bold">
            किसान लॉगिन
          </h1>

          <p className="text-slate-400 mt-2">
            अपने कृषि मित्र किसान डैशबोर्ड में प्रवेश करें
          </p>

        </div>

        {/* =====================================================
            LOGIN CARD
        ====================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* =================================================
                MOBILE / EMAIL
            ================================================== */}

            <div>

              <label className="block text-sm text-slate-300 mb-2">
                मोबाइल नंबर या ईमेल
              </label>

              <div className="relative">

                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">

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
                  placeholder="9340004380 / email@example.com"
                  autoComplete="username"
                  className="
                    w-full
                    bg-slate-950
                    border border-slate-700
                    rounded-xl
                    px-11
                    py-3.5
                    outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/10
                    transition
                  "
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm text-slate-300">
                  पासवर्ड
                </label>

              </div>

              <div className="relative">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="अपना पासवर्ड"
                  autoComplete="current-password"
                  className="
                    w-full
                    bg-slate-950
                    border border-slate-700
                    rounded-xl
                    px-11
                    pr-12
                    py-3.5
                    outline-none
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/10
                    transition
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-500
                    hover:text-slate-300
                  "
                  aria-label={
                    showPassword
                      ? "पासवर्ड छुपाएं"
                      : "पासवर्ड दिखाएं"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>

              </div>

            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="flex gap-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm">

                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-emerald-500
                hover:bg-emerald-400
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-slate-950
                font-bold
                py-3.5
                rounded-xl
                flex
                items-center
                justify-center
                gap-2
                transition
              "
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

          {/* =====================================================
              REGISTER
          ====================================================== */}

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">

            <div className="flex items-center justify-center gap-2 mb-3">

              <UserPlus className="w-4 h-4 text-emerald-400" />

              <span>
                किसान अकाउंट नहीं है?
              </span>

            </div>

            <Link
              href="/register"
              className="
                inline-flex
                items-center
                gap-2
                text-emerald-400
                font-semibold
                hover:text-emerald-300
                hover:underline
              "
            >
              नया किसान रजिस्ट्रेशन करें

              <ArrowRight className="w-4 h-4" />

            </Link>

          </div>

        </div>

        {/* =====================================================
            SECURITY INFO
        ====================================================== */}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">

          <ShieldCheck className="w-4 h-4 text-emerald-500" />

          <span>
            मोबाइल/ईमेल और पासवर्ड से सुरक्षित लॉगिन
          </span>

        </div>

        {/* =====================================================
            DEVELOPMENT INFO
        ====================================================== */}

        <div className="mt-5 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-500">

          <p className="font-semibold text-slate-300 mb-2">
            Development Authentication
          </p>

          <p>
            अभी registration और login browser localStorage
            पर आधारित है।
          </p>

          <p className="mt-1">
            Production में इसे database + secure backend
            authentication से connect किया जाएगा।
          </p>

        </div>

      </div>

    </main>
  );
}