"use client";
import MandiDateTrendChart from "@/components/MandiDateTrendChart";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Search,
  RefreshCw,
  Wheat,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Info,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import MandiFilters from "@/components/MandiFilters";
import MandiYoutubeLink from "@/components/MandiYoutubeLink";
import { farmerApi, isFarmerLoggedIn } from "@/lib/farmerApi";
import {
  getLocalDate,
  getAgmarknetRates,
  fetchAgmarknetFilters,
  getAgmarknetLocationIds,
  filterMandiRates,
  formatMandiPrice,
  formatMandiDateDisplay,
  parseMandiDate,
} from "@/services/mandiApi";

function normalizeKey(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findArray(source, aliases) {
  if (!source || typeof source !== "object") return [];
  const wanted = new Set(aliases.map(normalizeKey));

  for (const [key, value] of Object.entries(source)) {
    if (wanted.has(normalizeKey(key)) && Array.isArray(value)) return value;
  }

  for (const value of Object.values(source)) {
    if (value && typeof value === "object") {
      const found = findArray(value, aliases);
      if (found.length) return found;
    }
  }
  return [];
}

function firstValue(item, keys) {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  }
  return undefined;
}

function normalizeOptions(items, key) {
  return items
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return { label: String(item), value: String(item), raw: item };
      }
      if (!item || typeof item !== "object") return null;

      const idKeys = {
        state: ["state_id", "stateId", "id", "value", "state_code"],
        district: ["district_id", "districtId", "id", "value", "district_code"],
        market: ["mkt_id", "market_id", "marketId", "apmc_id", "market_code", "id", "value"],
        commodity: ["cmdt_id", "commodity_id", "commodityId", "id", "value"],
      };

      const labelKeys = {
        state: ["state_name", "stateName", "name", "label", "state"],
        district: ["district_name", "districtName", "name", "label", "district"],
        market: ["mkt_name", "market_name", "marketName", "apmc_name", "name", "label", "market"],
        commodity: ["cmdt_name", "commodity_name", "commodityName", "name", "label", "commodity"],
      };

      const value = firstValue(item, idKeys[key] || ["id", "value"]);
      const label = firstValue(item, labelKeys[key] || ["name", "label"]);

      if (value == null || label == null) return null;
      return { value: String(value), label: String(label), raw: item };
    })
    .filter(Boolean);
}

export default function MandiBhavPage() {
  const [options, setOptions] = useState({});
  const [filters, setFilters] = useState({
    state: "19", // Madhya Pradesh default
    district: "318", // Neemuch default
    market: "182", // Neemuch APMC default
    commodity: "100001",
  });
  const [date, setDate] = useState(() => getLocalDate());
  const [search, setSearch] = useState("");
  const [rates, setRates] = useState([]);
  const [selectedChartCrop, setSelectedChartCrop] = useState("Soyabean");
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingRates, setLoadingRates] = useState(false);
  const [filterError, setFilterError] = useState("");
  const [rateError, setRateError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Load filter lists from Agmarknet API
  useEffect(() => {
    let cancelled = false;
    async function loadFilterOptions() {
      setLoadingFilters(true);
      try {
        const source = await fetchAgmarknetFilters();
        if (cancelled) return;

        const nextOptions = {};
        const configs = [
          { key: "state", aliases: ["state_data", "states", "state_list"] },
          { key: "district", aliases: ["district_data", "districts", "district_list"] },
          { key: "market", aliases: ["market_data", "markets", "apmcs"] },
          { key: "commodity", aliases: ["cmdt_data", "commodities", "commodity_data"] },
        ];

        for (const config of configs) {
          const rawItems = findArray(source, config.aliases);
          nextOptions[config.key] = normalizeOptions(rawItems, config.key);
        }

        setOptions(nextOptions);

        if (isFarmerLoggedIn()) {
          try {
            const profileResult = await farmerApi.getProfile();
            const profile = profileResult.data?.user;
            if (profile?.state && profile?.district) {
              const location = await getAgmarknetLocationIds(
                profile.state,
                profile.district,
                source
              );
              if (cancelled) return;
              setFilters((previous) => ({
                ...previous,
                state: location.stateId,
                district: location.districtId,
                market: "",
              }));
            }
          } catch (profileError) {
            console.warn("Could not load farmer mandi location:", profileError);
          }
        }
      } catch (error) {
        if (!cancelled) setFilterError(error.message);
      } finally {
        if (!cancelled) setLoadingFilters(false);
      }
    }
    loadFilterOptions();
    return () => {
      cancelled = true;
    };
  }, []);

  const changeFilter = useCallback((key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "state") {
        next.district = "";
        next.market = "";
      } else if (key === "district") {
        next.market = "";
      }
      return next;
    });
  }, []);

  // Filter cascades based on state / district selections
  const visibleOptions = useMemo(() => {
    const next = {
      state: options.state || [],
      district: options.district || [],
      market: options.market || [],
    };

    if (filters.state) {
      next.district = next.district.filter(
        (opt) => String(opt.raw?.state_id || opt.raw?.stateId) === String(filters.state)
      );
    }
    if (filters.district) {
      next.market = next.market.filter(
        (opt) =>
          String(opt.raw?.district_id || opt.raw?.districtId) === String(filters.district)
      );
    }
    return next;
  }, [options, filters]);

  // Load rates function with 250 limit
  const loadRates = useCallback(async () => {
    setLoadingRates(true);
    setRateError("");
    setHasSearched(true);

    try {
      const result = await getAgmarknetRates({
        date,
        state: filters.state || 19,
        district: filters.district || 318,
        market: filters.market || "",
        commodity: filters.commodity || "",
        limit: 250,
      });

      const rows = result.data || [];
      setRates(rows);

      if (!rows.length) {
        setRateError("चयनित फ़िल्टर के लिए इस दिनांक पर कोई डेटा उपलब्ध नहीं है। कृपया दिनांक या मंडी बदलकर देखें।");
      }
    } catch (error) {
      setRates([]);
      setRateError(error.message || "मंडी भाव लोड नहीं हो सके।");
    } finally {
      setLoadingRates(false);
    }
  }, [date, filters]);

  // Initial fetch on mount
  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const filteredRates = useMemo(() => {
    return filterMandiRates(rates, search, {});
  }, [rates, search]);

  // Find latest available data date across records
  const latestAvailableDate = useMemo(() => {
    if (!rates.length) return null;
    let latest = null;
    for (const r of rates) {
      const parsed = parseMandiDate(r.date);
      if (parsed && (!latest || parsed > latest)) {
        latest = parsed;
      }
    }
    return latest;
  }, [rates]);

  const latestAvailableDateText = latestAvailableDate
    ? latestAvailableDate.toLocaleDateString("hi-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  // Selected names for banner context
  const selectedStateName =
    options.state?.find((s) => String(s.value) === String(filters.state))?.label ||
    "मध्य प्रदेश";
  const selectedDistrictName =
    options.district?.find((d) => String(d.value) === String(filters.district))?.label ||
    "नीमच";
  const selectedMarketName =
    options.market?.find((m) => String(m.value) === String(filters.market))?.label ||
    "नीमच APMC";

  // List of unique crop names for chart selection
  const availableCropsForChart = useMemo(() => {
    const list = [...new Set(rates.map((r) => r.commodity).filter(Boolean))];
    // Put Soyabean first if available
    const soy = list.find((c) => c.toLowerCase().includes("soya"));
    if (soy) {
      return [soy, ...list.filter((c) => c !== soy)];
    }
    return list;
  }, [rates]);

  // If selected crop is not in list, auto fallback to Soyabean or first
  const activeChartCrop = useMemo(() => {
    if (!availableCropsForChart.length) return "Soyabean";
    if (availableCropsForChart.includes(selectedChartCrop)) {
      return selectedChartCrop;
    }
    const soy = availableCropsForChart.find((c) => c.toLowerCase().includes("soya"));
    return soy || availableCropsForChart[0];
  }, [availableCropsForChart, selectedChartCrop]);

  // Current crop record for chart
  const activeCropData = useMemo(() => {
    return rates.find((r) => r.commodity === activeChartCrop) || null;
  }, [rates, activeChartCrop]);

  // Chart data: 3-day price comparison + MSP
  const comparisonChartData = useMemo(() => {
    if (!activeCropData) return [];

    const result = [];
    if (activeCropData.twoDaysAgoPrice) {
      result.push({
        label: "2 दिन पूर्व",
        price: activeCropData.twoDaysAgoPrice,
        msp: activeCropData.mspPrice || 0,
        arrival: activeCropData.twoDaysAgoArrival || 0,
      });
    }
    if (activeCropData.yesterdayPrice) {
      result.push({
        label: "1 दिन पूर्व",
        price: activeCropData.yesterdayPrice,
        msp: activeCropData.mspPrice || 0,
        arrival: activeCropData.yesterdayArrival || 0,
      });
    }
    if (activeCropData.modalPrice) {
      result.push({
        label: "वर्तमान भाव (As-on)",
        price: activeCropData.modalPrice,
        msp: activeCropData.mspPrice || 0,
        arrival: activeCropData.arrival || 0,
      });
    }

    return result;
  }, [activeCropData]);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* ================= HEADER WITH LATEST DATE BANNER ================= */}
      <header className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold tracking-wide text-emerald-200 border border-emerald-400/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                AGMARKNET भारत सरकार आधिकारिक डेटा
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              दैनिक मंडी भाव (Mandi Rates)
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 font-medium max-w-2xl">
              {selectedDistrictName}, {selectedStateName} • {selectedMarketName} — फसलों के नवीनतम न्यूनतम, अधिकतम एवं मॉडल भाव
            </p>
          </div>

          {/* LATEST AVAILABLE DATA DATE TOP BADGE */}
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 sm:p-4 backdrop-blur border border-white/20 shrink-0 self-start sm:self-auto">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/20 text-white shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-emerald-200 uppercase tracking-wide">
                नवीनतम उपलब्ध डेटा दिनांक
              </p>
              <p className="text-sm sm:text-lg font-black text-white">
                {latestAvailableDateText ? latestAvailableDateText : formatMandiDateDisplay(date)}
              </p>
              <span className="text-[9px] text-emerald-200/80">
                (As-On Reported Date)
              </span>
            </div>
          </div>
        </div>
      </header>

      <MandiYoutubeLink />

      {/* ================= FILTER MODULE ================= */}
      <MandiFilters
        filters={filters}
        options={options}
        visibleOptions={visibleOptions}
        date={date}
        onChangeFilter={changeFilter}
        onChangeDate={setDate}
        onSearch={loadRates}
        onReset={() => {
          setFilters({
            state: "19",
            district: "318",
            market: "182",
            commodity: "100001",
          });
          setDate(getLocalDate());
        }}
        loading={loadingRates || loadingFilters}
      />

      {/* ================= QUICK STATS CARDS ================= */}
      {!loadingRates && filteredRates.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Wheat className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold text-slate-500">कुल फसलें</p>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
              {filteredRates.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold text-emerald-700">डेटा दिनांक</p>
            </div>
            <p className="mt-2 text-xs sm:text-base font-black text-emerald-900 truncate">
              {latestAvailableDateText || formatMandiDateDisplay(date)}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold text-amber-800">उच्चतम भाव</p>
            </div>
            <p className="mt-2 text-base sm:text-xl font-black text-amber-900 truncate">
              {(() => {
                const max = Math.max(...filteredRates.map((r) => r.modalPrice || 0));
                return max > 0 ? formatMandiPrice(max) : "—";
              })()}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold text-blue-800">सक्रिय मंडी</p>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-black text-blue-900 truncate">
              {selectedMarketName || selectedDistrictName}
            </p>
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE CROP COMPARISON CHART (Default Soybean) ================= */}
      {!loadingRates && rates.length > 0 && (
        <section className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  फसल भाव तुलना चार्ट (3-Day Price Trend & MSP)
                </h2>
                <p className="text-[11px] text-slate-500">
                  डिफ़ॉल्ट सोयाबीन भाव • फसल बदलकर अन्य फसलों का तुलनात्मक चार्ट देखें
                </p>
              </div>
            </div>

            {/* Crop Selector Pills */}
           
{/* Searchable crop selector */}
<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  <label
    htmlFor="chart-crop-search"
    className="text-sm font-semibold text-slate-700"
  >
    फसल चुनें
  </label>

  <input
    id="chart-crop-search"
    type="search"
    list="chart-crop-options"
    value={selectedChartCrop}
    onChange={(event) => {
      const value = event.target.value;
      setSelectedChartCrop(value);
    }}
    placeholder="सोयाबीन, गेहूँ, लहसुन खोजें..."
    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:max-w-sm"
  />

  <datalist id="chart-crop-options">
    {availableCropsForChart.map((crop) => (
      <option key={crop} value={crop} />
    ))}
  </datalist>
</div>

<p className="mt-2 text-xs text-slate-500">
  उपलब्ध फसल: {availableCropsForChart.length}
</p>

          </div>

          {/* Active Crop Summary Bar */}
          {activeCropData && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-2xl bg-emerald-50/60 p-3.5 border border-emerald-100 text-center">
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase">चयनित फसल</p>
                <p className="text-sm font-black text-emerald-950 mt-0.5">{activeCropData.commodity}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase">वर्तमान मॉडल भाव</p>
                <p className="text-sm font-black text-emerald-800 mt-0.5">{formatMandiPrice(activeCropData.modalPrice)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">MSP समर्थन मूल्य</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{formatMandiPrice(activeCropData.mspPrice)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">ताज़ा आवक</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">
                  {activeCropData.arrival != null ? `${activeCropData.arrival} MT` : "—"}
                </p>
              </div>
            </div>
          )}

          {/* Recharts Bar Comparison Chart */}
          <div className="mt-5 h-64 sm:h-72 w-full">
            {comparisonChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonChartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fontWeight: 600, fill: "#475569" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    formatter={(val, name) => [
                      `₹${Number(val).toLocaleString("en-IN")}`,
                      name === "price" ? "मंडी मॉडल भाव" : "MSP मूल्य",
                    ]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: "10px", fontSize: "11px", fontWeight: "bold" }}
                  />
                  <Bar
                    dataKey="price"
                    name="मंडी मॉडल भाव (₹/क्विंटल)"
                    fill="#059669"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                  <Bar
                    dataKey="msp"
                    name="MSP समर्थन भाव (₹/क्विंटल)"
                    fill="#f59e0b"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                इस फसल के लिए तुलनात्मक ऐतिहासिक डेटा उपलब्ध नहीं है।
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= RESULTS SECTION ================= */}
      <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              मंडी भाव परिणाम ({filteredRates.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              {latestAvailableDateText && (
                <span className="font-bold text-emerald-700">
                  नवीनतम उपलब्ध मंडी रिकॉर्ड: {latestAvailableDateText} •{" "}
                </span>
              )}
              भाव प्रति क्विंटल में हैं
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="फसल खोजें (जैसे: सोयाबीन, गेहूं)..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-2xs"
            />
          </div>
        </div>

        {rateError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p>{rateError}</p>
              <button
                type="button"
                onClick={loadRates}
                className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-200/80 px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-300 transition"
              >
                <RefreshCw className="h-3 w-3" /> दोबारा प्रयास करें
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loadingRates && (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-700">
              मंडी भाव लोड हो रहे हैं…
            </p>
            <p className="text-xs text-slate-400">AGMARKNET सर्वर से ताज़ा डेटा प्राप्त किया जा रहा है</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loadingRates && filteredRates.length === 0 && !rateError && (
          <div className="py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Wheat className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-slate-700">
              {hasSearched ? "कोई रिकॉर्ड नहीं मिला" : "फ़िल्टर चुनकर भाव देखें"}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              कृपया ऊपर फ़िल्टर बदलकर खोजें या रिसेट करें।
            </p>
          </div>
        )}

        {/* ================= RESPONSIVE CARD LIST (Visible below lg) ================= */}
        {!loadingRates && filteredRates.length > 0 && (
          <div className="mt-4 space-y-3 lg:hidden">
            {filteredRates.map((row) => {
              const trendIcon =
                row.trend === "up" ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                ) : row.trend === "down" ? (
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-600" />
                ) : (
                  <Minus className="h-3.5 w-3.5 text-slate-400" />
                );

              return (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-emerald-300"
                >
                  {/* Top Bar: Crop + Trend + Modal Price */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <h3 className="text-base font-black text-slate-900">
                          {row.commodity}
                        </h3>
                        {trendIcon}
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {row.group || "Cereals"} • {row.variety || "सामान्य"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase">
                        मॉडल भाव
                      </span>
                      <span className="inline-block rounded-xl bg-emerald-50 px-2.5 py-1 text-sm font-black text-emerald-800 border border-emerald-100">
                        {formatMandiPrice(row.modalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Price Comparison Grid */}
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <p className="text-[9px] font-bold text-slate-500">MSP</p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">
                        {formatMandiPrice(row.mspPrice)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2">
                      <p className="text-[9px] font-bold text-slate-500">1 दिन पूर्व</p>
                      <p className="text-xs font-black text-slate-800 mt-0.5">
                        {formatMandiPrice(row.yesterdayPrice)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2">
                      <p className="text-[9px] font-bold text-slate-500">आवक (MT)</p>
                      <p className="text-xs font-black text-emerald-700 mt-0.5">
                        {row.arrival != null ? `${row.arrival} MT` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Footer Meta: Date */}
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Calendar className="h-3 w-3" /> {formatMandiDateDisplay(row.date)}
                    </span>
                    <span>प्रति क्विंटल दर</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= DESKTOP TABLE VIEW (Visible on >= lg) ================= */}
        {!loadingRates && filteredRates.length > 0 && (
          <div className="mt-4 hidden w-full min-w-0 overflow-x-auto rounded-2xl border border-slate-200 lg:block">
            <table className="w-full table-fixed border-collapse text-left text-xs">
              <thead>
                <tr className="bg-emerald-900/90 text-white border-b border-emerald-800 text-[11px] uppercase tracking-wider font-bold">
                  <th className="w-[11%] px-2.5 py-3.5">दिनांक (Date)</th>
                  <th className="w-[18%] px-2.5 py-3.5">फसल (Commodity)</th>
                  <th className="w-[12%] px-2.5 py-3.5">ग्रुप</th>
                  <th className="w-[11%] px-2.5 py-3.5">MSP भाव</th>
                  <th className="w-[16%] px-2.5 py-3.5">वर्तमान मॉडल भाव</th>
                  <th className="w-[14%] px-2.5 py-3.5">1 दिन पूर्व भाव</th>
                  <th className="w-[10%] px-2.5 py-3.5">आवक (MT)</th>
                  <th className="w-[8%] px-2.5 py-3.5 text-center">ट्रेंड</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRates.map((row) => (
                  <tr key={row.id} className="hover:bg-emerald-50/50 transition">
                    <td className="whitespace-nowrap px-2.5 py-3.5 font-semibold text-slate-600">
                      {formatMandiDateDisplay(row.date)}
                    </td>
                    <td className="break-words px-2.5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <p className="font-black text-slate-900 text-sm">{row.commodity}</p>
                          <p className="text-[10px] text-slate-400">{row.variety || "सामान्य"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="break-words px-2.5 py-3.5 text-slate-600 font-medium">{row.group}</td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 font-bold text-slate-700">{formatMandiPrice(row.mspPrice)}</td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 font-black text-emerald-800 text-sm">
                      <span className="rounded-xl bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                        {formatMandiPrice(row.modalPrice)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 font-semibold text-slate-600">{formatMandiPrice(row.yesterdayPrice)}</td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 font-bold text-slate-800">{row.arrival != null ? `${row.arrival} MT` : "—"}</td>
                    <td className="px-2.5 py-3.5 text-center">
                      {row.trend === "up" ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                          <ArrowUpRight className="h-3.5 w-3.5" /> वृद्धि
                        </span>
                      ) : row.trend === "down" ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-800">
                          <ArrowDownRight className="h-3.5 w-3.5" /> गिरावट
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          <Minus className="h-3.5 w-3.5" /> स्थिर
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}