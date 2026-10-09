"use client";

import { useState } from "react";
import {
  Lightbulb,
  Search,
  ShieldCheck,
} from "lucide-react";

import { advisories } from "@/data/farmerDemo";

export default function AdvisoryPage() {
  const [search, setSearch] = useState("");

  const filtered = advisories.filter((item) =>
    `${item.crop} ${item.title} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          कृषि सलाह
        </p>

        <h1 className="text-3xl font-bold">
          फसल सलाह
        </h1>

        <p className="text-slate-400 mt-2">
          फसल के अनुसार उपयोगी जानकारी और सावधानियां।
        </p>
      </div>

      <div className="relative">

        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="सोयाबीन, गेहूँ, लहसुन..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500"
        />

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        {filtered.map((item) => (
          <article
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >

            <div className="flex gap-4">

              <div className="w-11 h-11 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <span className="text-xs text-emerald-400">
                  {item.crop}
                </span>

                <h2 className="font-bold text-lg mt-1">
                  {item.title}
                </h2>

                <p className="text-sm text-slate-400 mt-3 leading-6">
                  {item.description}
                </p>
              </div>

            </div>

          </article>
        ))}

      </div>

      <div className="flex gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />

        <p className="text-sm text-slate-400">
          कृषि मित्र की सलाह सामान्य जानकारी के लिए है। दवा, खाद,
          बीज या अन्य कृषि इनपुट का प्रयोग करने से पहले product label,
          स्थानीय कृषि विभाग/KVK और योग्य कृषि विशेषज्ञ की सलाह देखें।
        </p>
      </div>

    </div>
  );
}