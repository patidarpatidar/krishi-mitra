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

export default function FarmerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("krishi_mitra_farmer");

    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);

      if (!user?.loggedIn) {
        router.replace("/login");
        return;
      }

      setFarmer(user);
    } catch {
      localStorage.removeItem("krishi_mitra_farmer");
      router.replace("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("krishi_mitra_farmer");
    router.push("/login");
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
    <div className="bg-slate-950 min-h-screen text-white">

      {/* =====================================================
          FARMER PORTAL HEADER
      ====================================================== */}

      <section className="border-b border-slate-800 bg-slate-950">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top Dashboard Header */}

          <div className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs text-emerald-400 font-semibold">
                  किसान पोर्टल
                </p>

                <h1 className="font-bold text-lg sm:text-xl">
                  नमस्ते, {farmer.name?.split(" ")[0]} 👋
                </h1>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-2">

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

          </div>

          {/* =================================================
              DASHBOARD NAVIGATION
          ================================================== */}

          <div className="overflow-x-auto scrollbar-hide">

            <nav className="flex items-center gap-1 min-w-max pb-2">

              {dashboardMenu.map((item) => {
                const Icon = item.icon;

                const active =
                  item.href === "/farmer"
                    ? pathname === "/farmer"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2
                      px-3.5 py-2.5
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

      {/* =====================================================
          DASHBOARD CONTENT
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

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

    </div>
  );
}