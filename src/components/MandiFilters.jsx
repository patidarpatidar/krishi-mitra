"use client";

import { Calendar, Search, RefreshCw, X, ChevronDown, Filter } from "lucide-react";

export default function MandiFilters({
  filters,
  options = {},
  visibleOptions = {},
  date,
  onChangeFilter,
  onChangeDate,
  onSearch,
  onReset,
  loading = false,
  compact = false,
}) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-emerald-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 shadow-xs">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              मंडी एवं दिनांक फ़िल्टर (AGMARKNET)
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              राज्य, जिला, मंडी और फसल चुनकर ताज़ा भाव देखें
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition"
        >
          <X className="h-3.5 w-3.5" />
          फ़िल्टर रीसेट
        </button>
      </div>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 5 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* State */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            राज्य (State)
          </label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => onChangeFilter("state", e.target.value)}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
            >
              <option value="">सभी राज्य (All States)</option>
              {(visibleOptions.state || options.state || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* District */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            जिला (District)
          </label>
          <div className="relative">
            <select
              value={filters.district}
              onChange={(e) => onChangeFilter("district", e.target.value)}
              disabled={loading || !filters.state}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">सभी जिला (All)</option>
              {(visibleOptions.district || options.district || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Market */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            मंडी (Market)
          </label>
          <div className="relative">
            <select
              value={filters.market}
              onChange={(e) => onChangeFilter("market", e.target.value)}
              disabled={loading || !filters.district}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">सभी मंडियाँ (All Markets)</option>
              {(visibleOptions.market || options.market || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Commodity / Crop */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            फसल (Crop)
          </label>
          <div className="relative">
            <select
              value={filters.commodity}
              onChange={(e) => onChangeFilter("commodity", e.target.value)}
              disabled={loading || !options.commodity?.length}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
            >
              <option value="">सभी फसलें (All Crops)</option>
              {(options.commodity || []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            दिनांक (Date)
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => onChangeDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 order-2 sm:order-1">
          <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>भारत सरकार AGMARKNET द्वारा अधिकृत दैनिक भाव</span>
        </p>

        <button
          type="button"
          onClick={onSearch}
          disabled={loading || !date}
          className="order-1 sm:order-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 px-6 py-2.5 text-xs font-black text-white shadow-md hover:from-emerald-700 hover:to-green-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "भाव लोड हो रहे हैं…" : "भाव खोजें (Search Rates)"}
        </button>
      </div>
    </div>
  );
}