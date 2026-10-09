
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  Landmark,
  Leaf,
  PawPrint,
  FileText,
  FolderTree,
  Menu,
  X,
  ExternalLink,
  LogOut,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

const TOKEN_KEY = "krishi_mitra_admin_token";
const ADMIN_KEY = "krishi_mitra_admin";
const LOGIN_PATH = "/admin/login";

const menu = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "पंजीकृत किसान",
    href: "/admin/farmers",
    icon: Users,
  },
  {
    title: "Crop Categories",
    href: "/admin/crops/categories",
    icon: FolderTree,
  },
  {
    title: "फसलें",
    href: "/admin/crops",
    icon: Sprout,
  },
  {
    title: "सरकारी योजनाएं",
    href: "/admin/schemes",
    icon: Landmark,
  },
  {
    title: "जैविक खेती",
    href: "/admin/organic",
    icon: Leaf,
  },
  {
    title: "पशुपालन",
    href: "/admin/livestock",
    icon: PawPrint,
  },
  {
    title: "Blog Categories",
    href: "/admin/blog-categories",
    icon: FolderTree,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageCircle,
  },
];

function LoadingScreen({ message = "Admin session verify हो रहा है..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-3 text-slate-600">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-emerald-600" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === LOGIN_PATH;

  useEffect(() => {
    // Login page par admin layout ka auth check nahi chahiye.
    if (isLoginPage) {
      setAdmin(null);
      setCheckingAuth(false);
      return;
    }

    let isMounted = true;

    async function verifySession() {
      setCheckingAuth(true);

      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedAdmin = localStorage.getItem(ADMIN_KEY);

        if (!token || !storedAdmin) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);

          router.replace(LOGIN_PATH);
          return;
        }

        const parsedAdmin = JSON.parse(storedAdmin);

        if (!parsedAdmin || parsedAdmin.role !== "admin") {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);

          router.replace(LOGIN_PATH);
          return;
        }

        if (isMounted) {
          setAdmin(parsedAdmin);
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error("Admin session verification error:", error);

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_KEY);

        if (isMounted) {
          setAdmin(null);
          router.replace(LOGIN_PATH);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, pathname, router]);

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);

    setAdmin(null);
    setMobileOpen(false);

    router.replace(LOGIN_PATH);
    router.refresh();
  }

  function isActive(href) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Login page ko sidebar ke bina render karo.
  if (isLoginPage) {
    return children;
  }

  if (checkingAuth || !admin) {
    return <LoadingScreen />;
  }

  const adminName = admin.name || "Admin";
  const adminEmail = admin.email || "";
  const adminRole = admin.role || "admin";
  const avatarLetter = adminName.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 lg:hidden">
        <Link href="/admin" className="font-bold text-white">
          🌱 कृषि मित्र
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((previous) => !previous)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-white hover:bg-slate-800"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-200 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="shrink-0 border-b border-slate-800 px-6 py-5">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="text-2xl">🌱</span>

            <div>
              <div className="text-lg font-bold">कृषि मित्र</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Admin Profile */}
        <div className="shrink-0 border-b border-slate-800 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-slate-950">
              {avatarLetter}
            </div>

            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">
                {adminName}
              </div>

              <div className="truncate text-xs text-slate-400">
                {adminEmail}
              </div>

              <div className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                <ShieldCheck size={13} />
                {adminRole}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="mb-2 px-4 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </div>

          <div className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Bottom */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-950 p-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink size={18} />
            Website देखें
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-red-300 border-t-transparent" />
            ) : (
              <LogOut size={18} />
            )}

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen pt-16 lg:ml-72 lg:pt-0">
        {/* Desktop Header */}
        <header className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b bg-white px-6 lg:flex">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Krishi Mitra Admin Panel
            </h1>

            <p className="text-xs text-slate-500">
              Content & platform management
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800">
                {adminName}
              </div>
              <div className="text-xs text-slate-500">{adminEmail}</div>
            </div>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              Website
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
