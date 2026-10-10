"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  User,
  Sprout,
  TrendingUp,
  CloudSun,
  Lightbulb,
  Landmark,
  Bookmark,
  LogOut,
  ChevronRight,
  Home,
  Menu,
  X,
} from "lucide-react";

const dashboardMenu = [
  {
    name: "डैशबोर्ड",
    href: "/farmer",
    icon: LayoutDashboard,
  },
  {
    name: "मेरी प्रोफाइल",
    href: "/farmer/profile",
    icon: User,
  },
  {
    name: "मेरी फसलें",
    href: "/farmer/crops",
    icon: Sprout,
  },
  {
    name: "मंडी भाव",
    href: "/farmer/mandi",
    icon: TrendingUp,
  },
  {
    name: "मौसम",
    href: "/farmer/weather",
    icon: CloudSun,
  },
  {
    name: "फसल सलाह",
    href: "/farmer/advisory",
    icon: Lightbulb,
  },
  {
    name: "सरकारी योजनाएं",
    href: "/farmer/schemes",
    icon: Landmark,
  },
  {
    name: "सेव की गई जानकारी",
    href: "/farmer/saved",
    icon: Bookmark,
  },
];

const mobileMenu = [
  { name: "होम", href: "/farmer", icon: Home },
  { name: "फसलें", href: "/farmer/crops", icon: Sprout },
  { name: "मंडी भाव", href: "/farmer/mandi", icon: TrendingUp },
  { name: "मौसम", href: "/farmer/weather", icon: CloudSun },
  { name: "प्रोफ़ाइल", href: "/farmer/profile", icon: User },
];

import {
  farmerApi,
  getFarmerToken,
  getFarmerUser,
  clearFarmerSession,
} from "@/lib/farmerApi";

export default function FarmerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMobileMenuOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const token = getFarmerToken();

      if (!token) {
        clearFarmerSession();
        router.replace("/login");
        return;
      }

      // First set cached user so UI loads fast
      const localUser = getFarmerUser();
      if (localUser && mounted) {
        setFarmer(localUser);
        setLoading(false);
      }

      // Verify and refresh with backend
      try {
        const res = await farmerApi.getProfile();
        if (res.data?.user && mounted) {
          setFarmer(res.data.user);
        }
      } catch (err) {
        console.error("Farmer session expired or invalid:", err);
        clearFarmerSession();
        if (mounted) {
          router.replace("/login");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function logout() {
    await farmerApi.logout();
    router.push("/login");
    router.refresh();
  }

  if (!farmer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            किसान पोर्टल लोड हो रहा है...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="farmer-portal min-h-screen min-w-0 overflow-x-clip bg-slate-950 pb-[calc(5.25rem+env(safe-area-inset-bottom))] text-white md:pb-0">

      {/* =====================================================
          FARMER PORTAL HEADER
      ====================================================== */}

      <section
        className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Dashboard Header */}

          <div className="flex items-center justify-between gap-3 py-2 sm:py-4 lg:flex-row lg:gap-4">

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 sm:h-11 sm:w-11">
                <Sprout className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-emerald-400 font-semibold">
                  किसान पोर्टल
                </p>

                <h1 className="truncate font-bold text-base sm:text-xl">
                  नमस्ते, {farmer.name?.split(" ")[0]} 👋
                </h1>
              </div>

            </div>

            <div className="hidden flex-wrap items-center gap-2 md:flex">

              {/* Website */}

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-semibold transition"
              >
                <Home className="w-4 h-4" />
                वेबसाइट पर जाएं
              </Link>

              {/* Profile */}

              <Link
                href="/farmer/profile"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition"
              >
                <div className="w-6 h-6 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center text-xs">
                  {farmer.name?.charAt(0)}
                </div>

                प्रोफाइल
              </Link>

              {/* Logout */}

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="किसान मेन्यू खोलें"
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>

          {/* =================================================
              DASHBOARD NAVIGATION
          ================================================== */}

          <div className="hidden overflow-x-auto scrollbar-hide md:block">

            <nav className="flex items-center gap-1 min-w-max pb-2">

              {dashboardMenu.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/farmer"
                    ? pathname === "/farmer"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`
                      flex items-center gap-2
                      min-h-11 px-3.5 py-2.5
                      rounded-xl
                      text-sm
                      whitespace-nowrap
                      transition
                      ${
                        active
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />

                    {item.name}

                    {active && (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </Link>
                );
              })}

            </nav>

          </div>

        </div>

      </section>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="मेन्यू बंद करें"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/70 md:hidden"
          />
          <nav
            aria-label="किसान पोर्टल मेन्यू"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,calc(100vw-2.5rem))] flex-col overflow-y-auto border-l border-slate-800 bg-slate-950 p-4 shadow-2xl md:hidden"
            style={{
              paddingTop: "max(1rem, env(safe-area-inset-top))",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-semibold text-emerald-400">किसान पोर्टल</p>
                <p className="mt-1 font-bold text-white">{farmer.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="मेन्यू बंद करें"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              {dashboardMenu.map(({ name, href, icon: Icon }) => {
                const active =
                  href === "/farmer"
                    ? pathname === href
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                      active
                        ? "bg-emerald-500 text-slate-950"
                        : "text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{name}</span>
                  </Link>
                );
              })}
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex min-h-12 items-center gap-3 rounded-xl border border-slate-800 px-3 text-sm font-semibold text-slate-300"
            >
              <Home className="h-5 w-5" />
              वेबसाइट पर जाएं
            </Link>
            <button
              type="button"
              onClick={logout}
              className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-red-500/20 px-3 text-left text-sm font-semibold text-red-400"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </>
      )}

      {/* =====================================================
          DASHBOARD CONTENT
      ====================================================== */}

      <main className="mx-auto min-w-0 max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">

        {children}

      </main>

      {/* =====================================================
          SMALL DISCLAIMER
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        <div className="border-t border-slate-800 pt-5 text-xs text-slate-500">
          किसान पोर्टल कृषि जानकारी को आसान बनाने के लिए है। मंडी भाव,
          मौसम और कृषि सलाह जैसी जानकारी को महत्वपूर्ण निर्णय लेने से
          पहले संबंधित आधिकारिक स्रोत या स्थानीय विशेषज्ञ से सत्यापित करें।
        </div>

      </div>

      <nav
        aria-label="किसान मुख्य नेविगेशन"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 pt-1.5 shadow-[0_-8px_24px_rgba(0,0,0,0.28)] backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileMenu.map(({ name, href, icon: Icon }) => {
            const active =
              href === "/farmer"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[10px] font-semibold leading-tight transition ${
                  active
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="truncate">{name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
