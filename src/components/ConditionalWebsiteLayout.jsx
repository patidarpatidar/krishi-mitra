"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CloudSun, Home, Sprout, TrendingUp, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mobileLinks = [
  { href: "/", label: "होम", icon: Home },
  { href: "/crops", label: "फसलें", icon: Sprout },
  { href: "/mandi-bhav", label: "मंडी", icon: TrendingUp },
  { href: "/weather", label: "मौसम", icon: CloudSun },
  { href: "/farmer", label: "प्रोफ़ाइल", icon: UserRound },
];

export default function ConditionalWebsiteLayout({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isFarmer = pathname?.startsWith("/farmer");

  if (isAdmin || isFarmer) {
    return <>{children}</>;
  }

  return (
    <div className="website-shell min-h-screen min-w-0 overflow-x-clip pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
      <Navbar />
      <main className="min-w-0">{children}</main>
      <Footer />
      <nav
        aria-label="मुख्य मोबाइल नेविगेशन"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobileLinks.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
                  active
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={19} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}