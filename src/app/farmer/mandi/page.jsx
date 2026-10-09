"use client";

import { useMemo, useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";

import { mandiData } from "@/data/farmerDemo";

export default function FarmerMandiPage() {
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([
    "सोयाबीन",
    "लहसुन",
  ]);

  const filtered = useMemo(() => {
    return mandiData.filter((item) =>
      `${item.commodity} ${item.market}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  function toggleWatch(name) {
    setWatchlist((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name]
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          किसान मार्केट
        </p>

        <h1 className="text-3xl font-bold">
          मंडी भाव
        </h1>

        <p className="text-slate-400 mt-2">
          अपनी पसंद की फसलों को watchlist में रखें।
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="फसल या मंडी खोजें..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-emerald-500"
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        {filtered.map((item) => {
          const watched = watchlist.includes(item.commodity);

          return (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {item.market} मंडी
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    {item.commodity}
                  </h2>
                </div>

                <button
                  onClick={() => toggleWatch(item.commodity)}
                  className={watched ? "text-yellow-400" : "text-slate-600"}
                >
                  <Star
                    className="w-6 h-6"
                    fill={watched ? "currentColor" : "none"}
                  />
                </button>

              </div>

              <div className="mt-7">
                <p className="text-3xl font-bold">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <p className="text-xs text-slate-500">
                  प्रति {item.unit}
                </p>
              </div>

              <div
                className={`mt-4 flex items-center gap-2 text-sm ${
                  item.change >= 0
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {item.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}

                {item.change >= 0 ? "+" : ""}
                ₹{item.change}
              </div>

            </div>
          );
        })}

      </div>

      <div className="text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-xl p-4">
        मंडी भाव demo/static data है। वास्तविक व्यापार से पहले संबंधित मंडी,
        आधिकारिक स्रोत या व्यापारी से वर्तमान भाव सत्यापित करें।
      </div>

    </div>
  );
}