"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  Landmark,
  Sprout,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
} from "lucide-react";

import governmentSchemes from "@/data/governmentSchemes";

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

export default function GovernmentSchemesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("सभी");

  const activeSchemes = governmentSchemes.filter(
    (scheme) => scheme.status === "active"
  );

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        activeSchemes.map(
          (scheme) => scheme.category
        )
      ),
    ];

    return ["सभी", ...unique];
  }, [activeSchemes]);

  const filteredSchemes = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return activeSchemes.filter(
      (scheme) => {

        const matchesSearch =
          !query ||
          scheme.name
            .toLowerCase()
            .includes(query) ||
          scheme.shortName
            ?.toLowerCase()
            .includes(query) ||
          scheme.description
            ?.toLowerCase()
            .includes(query) ||
          scheme.tags?.some((tag) =>
            tag.toLowerCase().includes(query)
          );

        const matchesCategory =
          category === "सभी" ||
          scheme.category === category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    activeSchemes,
    search,
    category,
  ]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 text-white">

        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
              <Landmark className="h-4 w-4 text-lime-300" />
              सरकारी योजनाएं
            </div>

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
              किसानों के लिए सरकारी योजनाएं
            </h1>

            <p className="mt-5 text-sm leading-7 text-emerald-50/80 sm:text-base">
              केंद्र सरकार और मध्य प्रदेश सरकार की
              किसान उपयोगी योजनाओं की जानकारी एक जगह।
              लाभ, पात्रता, दस्तावेज, आवेदन प्रक्रिया और
              official government links देखें।
            </p>

          </div>

          {/* SEARCH */}
          <div className="mt-8 max-w-3xl">

            <div className="relative">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="योजना का नाम खोजें..."
                className="w-full rounded-2xl border border-white/20 bg-white py-4 pl-12 pr-4 text-sm text-slate-800 shadow-xl outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/20"
              />

            </div>

          </div>

        </div>

      </section>

      {/* PAGE CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* TOP STATS */}
        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-3">
                <Landmark className="h-5 w-5 text-emerald-700" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  उपलब्ध योजनाएं
                </p>

                <p className="text-2xl font-black text-slate-800">
                  {activeSchemes.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-sky-100 p-3">
                <Sprout className="h-5 w-5 text-sky-700" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  किसान केंद्रित
                </p>

                <p className="text-sm font-bold text-slate-800">
                  कृषि एवं किसान योजनाएं
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-amber-100 p-3">
                <CheckCircle2 className="h-5 w-5 text-amber-700" />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Source
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Official Government Links
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* FILTER */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2">

          <Filter className="h-5 w-5 shrink-0 text-slate-400" />

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                setCategory(item)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                category === item
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        {/* RESULTS */}
        <div className="mt-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-black text-slate-800">
              योजनाओं की सूची
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredSchemes.length} योजना उपलब्ध
            </p>
          </div>

        </div>

        {/* CARDS */}
        {filteredSchemes.length === 0 ? (

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-12 text-center">

            <Search className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              कोई योजना नहीं मिली
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              दूसरा नाम या category search करें।
            </p>

          </div>

        ) : (

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {filteredSchemes.map((scheme) => {

              const Icon =
                iconMap[scheme.icon] ||
                Landmark;

              return (
                <article
                  key={scheme.slug}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >

                  {/* CARD TOP */}
                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                        <Icon className="h-6 w-6 text-emerald-700" />
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                        {scheme.level}
                      </span>

                    </div>

                    <p className="mt-5 text-[11px] font-black uppercase tracking-wide text-emerald-700">
                      {scheme.category}
                    </p>

                    <h3 className="mt-2 text-xl font-black leading-snug text-slate-800">
                      {scheme.name}
                    </h3>

                    {scheme.shortName && (
                      <p className="mt-1 text-xs font-bold text-slate-400">
                        {scheme.shortName}
                      </p>
                    )}

                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-500">
                      {scheme.description}
                    </p>

                    {/* QUICK BENEFITS */}
                    <div className="mt-5 space-y-2">

                      {scheme.benefits
                        .slice(0, 2)
                        .map((benefit, index) => (

                          <div
                            key={index}
                            className="flex gap-2 text-xs text-slate-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                            <span className="line-clamp-2">
                              {benefit}
                            </span>
                          </div>

                        ))}

                    </div>

                  </div>

                  {/* CARD FOOTER */}
                  <div className="mt-auto border-t border-slate-100 p-4">

                    <div className="flex gap-2">

                      <Link
                        href={`/govt-schemes/${scheme.slug}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-black text-white transition hover:bg-emerald-800"
                      >
                        पूरी जानकारी
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </Link>

                      {scheme.sourceUrl && (
                        <a
                          href={scheme.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Official Source"
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        )}

      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">

        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-600" />

          <p className="text-xs leading-6 text-slate-600">

            <strong className="text-amber-700">
              महत्वपूर्ण:
            </strong>{" "}
            कृषि मित्र एक व्यक्तिगत कृषि सूचना प्लेटफॉर्म है,
            सरकारी वेबसाइट या सरकारी कार्यालय नहीं है। योजना की
            पात्रता, राशि, आवेदन अवधि और नियम समय के साथ बदल
            सकते हैं। आवेदन करने से पहले संबंधित official
            government portal पर जानकारी verify करें।

          </p>

        </div>

      </section>

    </main>
  );
}