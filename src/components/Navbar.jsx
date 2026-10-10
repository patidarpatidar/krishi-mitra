"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoSvg from "./LogoSvg";

import {
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  CloudSun,
  TrendingUp,
  Landmark,
  Sprout,
} from "lucide-react";

import { publicApiRequest, unwrapApiList } from "@/lib/publicApi";

const navRoutes = [
  { name: "होम", path: "/" },
  { name: "फ़सलें", path: "/crops" },
  { name: "मंडी भाव", path: "/mandi-bhav" },
  { name: "मौसम", path: "/weather" },
  {
    name: "सरकारी योजनाएं",
    path: "/govt-schemes",
    dropdown: true,
  },
  { name: "जैविक खेती", path: "/organic-farming" },
  { name: "पशुपालन", path: "/pashupalan" },
  { name: "कृषि ब्लॉग", path: "/blog" },
  { name: "हमारे बारे में", path: "/about" },
  { name: "संपर्क करें", path: "/contact" },
];

const iconMap = {
  sprout: Sprout,
  shield: ShieldIcon,
  credit: CreditCardIcon,
  landmark: Landmark,
};

function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CreditCardIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [schemeOpen, setSchemeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [farmerLoggedIn, setFarmerLoggedIn] = useState(false);
  const [activeSchemes, setActiveSchemes] = useState([]);
  const [schemeError, setSchemeError] = useState("");

  const pathname = usePathname();
  const headerRef = useRef(null);

  const featuredSchemes = activeSchemes.filter(
    (scheme) => scheme.featured || scheme.isFeatured
  );
  const navigationSchemes = [
    ...featuredSchemes,
    ...activeSchemes.filter(
      (scheme) => !featuredSchemes.includes(scheme)
    ),
  ].slice(0, 5);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  };

  useEffect(() => {
    let cancelled = false;
    publicApiRequest("/schemes?status=active&limit=100")
      .then((result) => {
        if (!cancelled) setActiveSchemes(unwrapApiList(result));
      })
      .catch((error) => {
        if (!cancelled) setSchemeError(error.message || "योजनाएं लोड नहीं हो सकीं।");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("krishi_mitra_farmer_token") : null;
    const stored = typeof window !== "undefined" ? localStorage.getItem("krishi_mitra_farmer") : null;

    if (token && stored) {
      try {
        const user = JSON.parse(stored);
        setFarmerLoggedIn(Boolean(user?.loggedIn));
      } catch {
        setFarmerLoggedIn(false);
      }
    } else {
      setFarmerLoggedIn(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!headerRef.current || headerRef.current.contains(event.target)) {
        return;
      }

      setIsOpen(false);
      setSearchOpen(false);
      setSchemeOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setSchemeOpen(false);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-emerald-100 bg-white shadow-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >

      {/* Top Announcement */}
      <div className="hidden bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 text-white sm:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-medium">
            <span className="animate-pulse">🌾</span>

            <span>
              मध्य प्रदेश किसानों के लिए मंडी भाव, मौसम और सरकारी योजनाओं की जानकारी
            </span>

            <span className="hidden sm:inline text-amber-300">
              • अपडेटेड जानकारी
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex min-h-14 items-center justify-between gap-2 sm:min-h-[68px] sm:gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 hover:scale-[1.02] transition-transform"
          >
            <LogoSvg />
          </Link>

          {/* Desktop Search */}
          <div className="hidden max-w-xl flex-1 md:block">
            <form action="/search" method="get" role="search" className="group relative">

              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />

              <input
                type="text"
                name="q"
                aria-label="साइट पर खोजें"
                placeholder="फसल, मंडी भाव, सरकारी योजना खोजें..."
                className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                type="submit"
                aria-label="खोजें"
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-emerald-700 transition hover:bg-emerald-50"
              >
                <Search className="h-4 w-4" />
              </button>

              <span className="absolute right-12 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] text-slate-400 lg:flex">
                Search
              </span>

            </form>
          </div>

          {/* Quick Info */}
          <div className="hidden md:flex items-center gap-2">

            <Link
              href="/weather"
              className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-sky-50 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <CloudSun className="w-4 h-4 text-sky-600" />
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  मौसम
                </p>

                <p className="text-xs font-black text-slate-700">
                  नीमच
                </p>
              </div>
            </Link>

            <Link
              href="/mandi-bhav"
              className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-emerald-50 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-[9px] text-slate-400">
                  मंडी
                </p>

                <p className="text-xs font-black text-slate-700">
                  आज के भाव
                </p>
              </div>
            </Link>

           {farmerLoggedIn ? (
  <Link
    href="/farmer"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
  >
    <User className="w-4 h-4" />
    किसान डैशबोर्ड
  </Link>
) : (
  <Link
    href="/login"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
  >
    <User className="w-4 h-4" />
    किसान लॉगिन
  </Link>
)}
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-1">

            <button
              type="button"
              onClick={() =>
                setSearchOpen(!searchOpen)
              }
              aria-label={searchOpen ? "खोज बंद करें" : "साइट पर खोजें"}
              aria-expanded={searchOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-emerald-800 hover:bg-emerald-50"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setIsOpen(!isOpen)
              }
              aria-label={isOpen ? "मेन्यू बंद करें" : "मेन्यू खोलें"}
              aria-expanded={isOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-emerald-800 hover:bg-emerald-50"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="pb-3 md:hidden">

            <form action="/search" method="get" role="search" className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />

              <input
                autoFocus
                type="text"
                name="q"
                aria-label="साइट पर खोजें"
                placeholder="फसल, मंडी, योजना खोजें..."
                className="w-full rounded-xl border border-emerald-200 bg-slate-50 py-3 pl-10 pr-14 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
              />

              <button
                type="submit"
                aria-label="खोजें"
                className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50"
              >
                <Search className="h-5 w-5" />
              </button>

            </form>

          </div>
        )}

      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-emerald-700 text-white">

        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-visible">

          {navRoutes.map((route) => {

            const active = isActive(route.path);

            if (route.dropdown) {

              return (
                <div
                  key={route.path}
                  className="relative"
                  onMouseEnter={() =>
                    setSchemeOpen(true)
                  }
                  onMouseLeave={() =>
                    setSchemeOpen(false)
                  }
                >

                  <Link
                    href={route.path}
                    className={`flex items-center gap-1 px-3 py-3 text-xs lg:text-sm font-semibold whitespace-nowrap transition ${
                      active
                        ? "bg-emerald-900 text-amber-300"
                        : "hover:bg-emerald-800"
                    }`}
                  >

                    <Landmark className="w-4 h-4" />

                    {route.name}

                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        schemeOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />

                  </Link>

                  {/* Government Scheme Dropdown */}
                  {schemeOpen && (
                    <div className="absolute left-0 top-full w-80 bg-white text-slate-800 rounded-b-2xl shadow-2xl border border-emerald-100 overflow-hidden">

                      <div className="p-3 bg-gradient-to-r from-emerald-50 to-lime-50 border-b">

                        <p className="text-sm font-black text-emerald-900">
                          सरकारी योजनाएं
                        </p>

                        <p className="text-[10px] text-slate-500 mt-1">
                          किसानों के लिए उपयोगी योजनाओं की जानकारी
                        </p>

                      </div>

                      <div className="p-2">

                        {/* ALL SCHEMES */}
                        <Link
                          href="/govt-schemes"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 group transition"
                        >

                          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Landmark className="w-4 h-4 text-emerald-700" />
                          </div>

                          <div className="flex-1">

                            <p className="text-xs font-bold">
                              सभी सरकारी योजनाएं
                            </p>

                            <p className="text-[9px] text-slate-400">
                              {activeSchemes.length} योजनाएं देखें
                            </p>

                          </div>

                          <span className="text-emerald-500">
                            →
                          </span>

                        </Link>

                        {schemeError && (
                          <p role="alert" className="px-3 py-2 text-xs text-red-600">
                            {schemeError}
                          </p>
                        )}

                        {navigationSchemes.map((item) => {

                          const Icon =
                            iconMap[item.icon] ||
                            Landmark;

                          return (
                            <Link
                              key={item.slug}
                              href={`/govt-schemes/${item.slug}`}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 group transition"
                            >

                              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200">

                                <Icon className="w-4 h-4 text-emerald-700" />

                              </div>

                              <div className="flex-1 min-w-0">

                                <p className="text-xs font-bold truncate">
                                  {item.shortName ||
                                    item.name}
                                </p>

                                <p className="text-[9px] text-slate-400 truncate">
                                  {item.category}
                                </p>

                              </div>

                              <span className="text-emerald-500">
                                →
                              </span>

                            </Link>
                          );
                        })}

                      </div>

                      <Link
                        href="/govt-schemes"
                        className="block mx-3 mb-3 text-center bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-2.5 text-xs font-bold"
                      >
                        सभी योजनाएं देखें
                      </Link>

                    </div>
                  )}

                </div>
              );
            }

            return (
              <Link
                key={route.path}
                href={route.path}
                className={`px-3 py-3 text-xs lg:text-sm font-semibold whitespace-nowrap transition ${
                  active
                    ? "bg-emerald-900 text-amber-300"
                    : "hover:bg-emerald-800"
                }`}
              >
                {route.name}
              </Link>
            );
          })}

        </div>

      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="max-h-[calc(100dvh_-_3.5rem_-_env(safe-area-inset-top))] overflow-y-auto border-t border-emerald-800 bg-emerald-950 text-white md:hidden">

          <div className="p-4 space-y-1">

            {navRoutes.map((route) => {

              const active = isActive(route.path);

              if (route.dropdown) {

                return (
                  <div key={route.path}>

                    <button
                      type="button"
                      onClick={() =>
                        setSchemeOpen(!schemeOpen)
                      }
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold ${
                        active
                          ? "bg-emerald-800 text-amber-300"
                          : "hover:bg-emerald-900"
                      }`}
                    >

                      <span className="flex items-center gap-2">
                        <Landmark className="w-4 h-4" />
                        सरकारी योजनाएं
                      </span>

                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          schemeOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                    {schemeOpen && (
                      <div className="ml-4 mt-1 border-l border-emerald-700 pl-2">

                        <Link
                          href="/govt-schemes"
                          onClick={() =>
                            setIsOpen(false)
                          }
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-emerald-100 hover:bg-emerald-900"
                        >
                          <Landmark className="w-4 h-4" />
                          सभी सरकारी योजनाएं
                        </Link>

                        {navigationSchemes.map(
                          (item) => {

                            const Icon =
                              iconMap[item.icon] ||
                              Landmark;

                            return (
                              <Link
                                key={item.slug}
                                href={`/govt-schemes/${item.slug}`}
                                onClick={() =>
                                  setIsOpen(false)
                                }
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-emerald-100 hover:bg-emerald-900"
                              >
                                <Icon className="w-4 h-4" />

                                {item.shortName ||
                                  item.name}
                              </Link>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>
                );
              }

              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className={`block min-h-11 px-3 py-3 rounded-xl text-sm font-semibold ${
                    active
                      ? "bg-emerald-800 text-amber-300"
                      : "hover:bg-emerald-900"
                  }`}
                >
                  {route.name}
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-3">

              <Link
                href="/weather"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex items-center justify-center gap-2 bg-sky-600 rounded-xl py-3 text-xs font-bold"
              >
                <CloudSun className="w-4 h-4" />
                मौसम
              </Link>

              <Link
                href="/mandi-bhav"
                onClick={() =>
                  setIsOpen(false)
                }
                className="flex items-center justify-center gap-2 bg-emerald-600 rounded-xl py-3 text-xs font-bold"
              >
                <TrendingUp className="w-4 h-4" />
                मंडी भाव
              </Link>

            </div>

            {farmerLoggedIn ? (
              <Link
                href="/farmer"
                onClick={() =>
                  setIsOpen(false)
                }
                className="mt-2 flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 rounded-xl py-3 text-sm font-black"
              >
                <User className="w-4 h-4" />
                किसान डैशबोर्ड
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() =>
                  setIsOpen(false)
                }
                className="mt-2 flex items-center justify-center gap-2 bg-amber-500 text-slate-950 rounded-xl py-3 text-sm font-black"
            >
              <User className="w-4 h-4" />
              किसान लॉगिन / रजिस्टर
            </Link>

            )}
          </div>

        </div>
      )}

    </header>
  );
}