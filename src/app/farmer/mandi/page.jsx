"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  TrendingUp,
  Star,
  RefreshCw,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";
import {
  fetchAgmarknetFilters,
  formatMandiDateDisplay,
  formatMandiPrice,
  getAgmarknetLocationIds,
  getAgmarknetRates,
  getLocalDate,
} from "@/services/mandiApi";

export default function FarmerMandiPage() {
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [rates, setRates] = useState([]);
  const [farmer, setFarmer] = useState({});
  const [location, setLocation] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [filters, setFilters] = useState({ date: getLocalDate(), market: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRates, setLoadingRates] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewFilter, setViewFilter] = useState("all"); // 'all' or 'watchlist'

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [profileRes, watchRes, filterSource] = await Promise.all([
        farmerApi.getProfile(),
        farmerApi.getWatchlist(),
        fetchAgmarknetFilters(),
      ]);
      const profile = profileRes.data?.user || {};
      const registeredLocation = await getAgmarknetLocationIds(
        profile.state,
        profile.district,
        filterSource
      );

      setFarmer(profile);
      setLocation(registeredLocation);
      setWatchlist(Array.isArray(watchRes.data) ? watchRes.data : []);
      setMarkets(
        (filterSource.market_data || [])
          .filter((market) => {
            const districtId = market.district_id || market.districtId;
            return !districtId || String(districtId) === registeredLocation.districtId;
          })
          .map((market) => ({
            label: market.mkt_name || market.market_name || market.marketName,
            value: String(market.id || market.market_id || market.mkt_id || ""),
          }))
          .filter((market) => market.label && market.value)
      );
    } catch (err) {
      console.error("Load mandi data error:", err);
      setError(err.message || "मंडी भाव लोड नहीं हो सके।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadRates = useCallback(async () => {
    if (!location) return;

    try {
      setLoadingRates(true);
      setError("");
      const result = await getAgmarknetRates({
        date: filters.date,
        state: location.stateId,
        district: location.districtId,
        market: filters.market,
        commodity: "",
        limit: 250,
      });
      setRates(result.data || []);
    } catch (err) {
      setRates([]);
      setError(err.message || "मंडी भाव लोड नहीं हो सके।");
    } finally {
      setLoadingRates(false);
      setRefreshing(false);
    }
  }, [filters.date, filters.market, location]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  async function toggleWatch(commodityName) {
    // Optimistic UI update
    const isWatched = watchlist.includes(commodityName);
    const updated = isWatched
      ? watchlist.filter((x) => x !== commodityName)
      : [...watchlist, commodityName];

    setWatchlist(updated);

    try {
      const result = await farmerApi.toggleWatchlist(commodityName);
      if (Array.isArray(result.data)) setWatchlist(result.data);
    } catch (err) {
      console.error("Toggle watchlist error:", err);
      setWatchlist(
        isWatched
          ? [...updated, commodityName]
          : updated.filter((x) => x !== commodityName)
      );
      setError(err.message || "वॉचलिस्ट अपडेट नहीं हो सकी।");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rates.filter((item) => {
      const cropName = item.crop || item.commodity || "";
      const matchSearch = `${cropName} ${item.market || item.mandi || ""} ${item.district || ""}`
        .toLowerCase()
        .includes(q);

      if (!matchSearch) return false;

      if (viewFilter === "watchlist") {
        return watchlist.includes(cropName);
      }

      return true;
    });
  }, [rates, search, viewFilter, watchlist]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">किसान मार्केट</p>
          <h1 className="text-3xl font-bold">मंडी भाव (लाइव)</h1>
          <p className="text-slate-400 mt-1">
            {farmer.district || "पंजीकृत जिला"}, {farmer.state || "पंजीकृत राज्य"} के भाव और अपनी पसंदीदा फसलों की वॉचलिस्ट।
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            loadRates();
          }}
          disabled={refreshing || loading || loadingRates}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-300 transition"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing || loadingRates ? "animate-spin text-emerald-400" : ""}`}
          />
          ताजा भाव रिफ्रेश करें
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.45fr)_180px]">
        <div className="relative min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="फसल का नाम या मंडी खोजें (उदा. सोयाबीन, लहसुन)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 text-sm text-white"
          />
        </div>

        <label className="relative flex items-center">
          <Filter className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />
          <select
            value={filters.market}
            onChange={(event) => setFilters((prev) => ({ ...prev, market: event.target.value }))}
            disabled={loading || markets.length === 0}
            aria-label="मंडी चुनें"
            className="w-full appearance-none rounded-2xl border border-slate-800 bg-slate-900 py-3.5 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500 disabled:opacity-60"
          >
            <option value="">जिले की सभी मंडियाँ</option>
            {markets.map((market) => (
              <option key={market.value} value={market.value}>{market.label}</option>
            ))}
          </select>
        </label>

        <label className="relative flex items-center">
          <Calendar className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-500" />
          <input
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((prev) => ({ ...prev, date: event.target.value }))}
            aria-label="मंडी भाव की तारीख"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3.5 pl-10 pr-3 text-sm text-white outline-none focus:border-emerald-500"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {location ? `${location.districtName}, ${location.stateName}` : "पंजीकृत स्थान लोड हो रहा है…"}
        </p>
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setViewFilter("all")}
            className={`min-w-0 flex-1 px-2 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              viewFilter === "all"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            सभी फसलें ({rates.length})
          </button>

          <button
            onClick={() => setViewFilter("watchlist")}
            className={`min-w-0 flex-1 justify-center px-2 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewFilter === "watchlist"
                ? "bg-emerald-500 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            मेरी वॉचलिस्ट ({watchlist.length})
          </button>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}
      {(loading || loadingRates) && rates.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">मंडी भाव लोड हो रहे हैं...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-6 sm:p-12 text-center">
          <TrendingUp className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">कोई मंडी भाव नहीं मिला</p>
          <p className="text-slate-500 text-sm mt-1">
            {viewFilter === "watchlist"
              ? "आपकी वॉचलिस्ट में अभी कोई फसल नहीं है। स्टार (★) दबाकर फसलें जोड़ें।"
              : "कृपया अन्य फसल या मंडी नाम से खोजें।"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item, idx) => {
            const cropName = item.crop || item.commodity;
            const watched = watchlist.includes(cropName);

            return (
              <div
                key={item.id || idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-emerald-400 font-semibold">
                        {item.market || item.mandi || location?.districtName} मंडी {item.district ? `(${item.district})` : ""}
                      </p>
                      <h2 className="text-xl font-bold mt-1 text-white">
                        {cropName}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleWatch(cropName)}
                      title={watched ? "वॉचलिस्ट से हटाएं" : "वॉचलिस्ट में जोड़ें"}
                      className={`p-2 rounded-xl transition ${
                        watched
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-slate-600 hover:text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Star
                        className="w-5 h-5"
                        fill={watched ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="mt-6 bg-slate-950 rounded-xl p-4 border border-slate-800/80">
                    <p className="text-xs text-slate-400">मॉडल भाव (औसत दर)</p>
                    <p className="text-3xl font-extrabold text-white mt-1">
                      {formatMandiPrice(item.modalPrice ?? item.price)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      प्रति {item.unit || "क्विंटल"}
                    </p>
                  </div>

                  {(item.minPrice != null || item.maxPrice != null) && (
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="bg-slate-950/60 rounded-lg p-2 text-center border border-slate-800/40">
                        <span className="text-slate-500">न्यूनतम: </span>
                        <span className="font-semibold text-slate-300">
                          {formatMandiPrice(item.minPrice)}
                        </span>
                      </div>
                      <div className="bg-slate-950/60 rounded-lg p-2 text-center border border-slate-800/40">
                        <span className="text-slate-500">उच्चतम: </span>
                        <span className="font-semibold text-emerald-400">
                          {formatMandiPrice(item.maxPrice)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    भाव उपलब्ध: {formatMandiDateDisplay(item.priceDate || item.date)}
                  </span>
                  <span className="text-emerald-500 font-medium">सत्यापित दर</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl p-4 leading-relaxed">
        <strong>सूचना:</strong> मंडी भाव कृषि उपज मंडी समितियों (APMC) के दैनिक आवक और नीलामी डेटा पर आधारित हैं।
        माल की गुणवत्ता, नमी और ग्रेडिंग के आधार पर वास्तविक व्यापार मूल्य भिन्न हो सकता है।
      </div>
    </div>
  );
}