'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import {
  Search,
  MapPin,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  IndianRupee,
  LineChart as ChartIcon,
  Globe,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BarChart3,
  X,
} from 'lucide-react';

import {
  getDynamicMandiRates,
  getMandiPriceHistory,
  CROP_MAP,
} from '@/services/mandiApi';

/* =========================================================
   RECHARTS
========================================================= */

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

const AreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  { ssr: false }
);

const Area = dynamic(
  () => import('recharts').then((mod) => mod.Area),
  { ssr: false }
);

const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);

const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);

/* =========================================================
   CONSTANTS
========================================================= */

const PRESET_STATES = [
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Uttar Pradesh',
  'Maharashtra',
  'Punjab',
  'Haryana',
];

const POPULAR_CROPS = [
  'लहसुन',
  'गेहूं',
  'सोयाबीन',
  'प्याज',
  'सरसों',
  'धनिया',
];

const CROP_EMOJI = {
  लहसुन: '🧄',
  गेहूं: '🌾',
  सोयाबीन: '🌱',
  प्याज: '🧅',
  सरसों: '🌼',
  धनिया: '🌿',
};

/* =========================================================
   HELPERS
========================================================= */

function safeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatPrice(value) {
  return `₹${safeNumber(value).toLocaleString('hi-IN')}`;
}

/*
  API में date अलग-अलग format में आ सकती है:
  2026-10-07
  2026-10-07T10:30:00
  07/10/2026
  07-10-2026
*/

function parseDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const stringValue = String(value).trim();

  // YYYY-MM-DD / ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) {
    const date = new Date(stringValue);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // DD/MM/YYYY
  const slashMatch = stringValue.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
  );

  if (slashMatch) {
    const [, day, month, year] = slashMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // DD-MM-YYYY
  const dashMatch = stringValue.match(
    /^(\d{1,2})-(\d{1,2})-(\d{4})/
  );

  if (dashMatch) {
    const [, day, month, year] = dashMatch;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(stringValue);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDisplayDate(value) {
  const date = parseDate(value);

  if (!date) {
    return 'तिथि उपलब्ध नहीं';
  }

  return date.toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getRecordDate(item) {
  return (
    item?.arrivalDate ||
    item?.date ||
    item?.arrival_date ||
    item?.createdAt ||
    item?.updatedAt ||
    null
  );
}

function getLatestRecord(records) {
  if (!records?.length) return null;

  return [...records].sort((a, b) => {
    const dateA = parseDate(getRecordDate(a));
    const dateB = parseDate(getRecordDate(b));

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateB.getTime() - dateA.getTime();
  })[0];
}

function getTrend(current, previous) {
  const currentPrice = safeNumber(current);
  const previousPrice = safeNumber(previous);

  if (!previousPrice) {
    return {
      percentage: 0,
      direction: 'neutral',
    };
  }

  const percentage =
    ((currentPrice - previousPrice) / previousPrice) * 100;

  return {
    percentage: Number(percentage.toFixed(2)),
    direction:
      percentage > 0
        ? 'up'
        : percentage < 0
        ? 'down'
        : 'neutral',
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function MandiBhavPage() {
  /* =======================================================
     LOCATION
  ======================================================= */

  const [selectedState, setSelectedState] =
    useState('Madhya Pradesh');

  const [customState, setCustomState] = useState('');

  const [selectedDistrict, setSelectedDistrict] =
    useState('Neemuch');

  const [customDistrict, setCustomDistrict] = useState('');

  const [selectedMandi, setSelectedMandi] =
    useState('Neemuch');

  const [customMandi, setCustomMandi] = useState('');

  /* =======================================================
     SEARCH
  ======================================================= */

  const [selectedCrop, setSelectedCrop] =
    useState('सोयाबीन');

  const [searchTerm, setSearchTerm] =
    useState('');

  /* =======================================================
     DATA
  ======================================================= */

  const [mandiRates, setMandiRates] =
    useState([]);

  const [chartData, setChartData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [lastFetchedAt, setLastFetchedAt] =
    useState(null);

  /* =======================================================
     ACTIVE LOCATION
  ======================================================= */

  const activeState =
    customState.trim() || selectedState;

  const activeDistrict =
    customDistrict.trim() || selectedDistrict;

  const activeMandi =
    customMandi.trim() || selectedMandi;

  /* =======================================================
     FETCH
  ======================================================= */

  const fetchRatesAndHistory = useCallback(
    async () => {
      setLoading(true);
      setError('');

      try {
        const [ratesResult, historyResult] =
          await Promise.all([
            getDynamicMandiRates({
              state: activeState,
              district: activeDistrict,
              mandi: activeMandi,
              crop: selectedCrop,

              /*
                अगर आपकी mandiApi service support करती है
                तो यह cache bypass करने में मदद करेगा।
              */
              forceRefresh: true,
            }),

            getMandiPriceHistory({
              state: activeState,
              district: activeDistrict,
              mandi: activeMandi,
              crop: selectedCrop,

              forceRefresh: true,
            }),
          ]);

        const rates = Array.isArray(ratesResult)
          ? ratesResult
          : [];

        const history = Array.isArray(historyResult)
          ? historyResult
          : [];

        /*
          IMPORTANT:
          Latest date पहले
        */

        const sortedRates = [...rates].sort(
          (a, b) => {
            const dateA = parseDate(
              getRecordDate(a)
            );

            const dateB = parseDate(
              getRecordDate(b)
            );

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return (
              dateB.getTime() -
              dateA.getTime()
            );
          }
        );

        setMandiRates(sortedRates);

        /*
          Chart भी date ascending
        */

        const sortedHistory = [...history].sort(
          (a, b) => {
            const dateA = parseDate(
              a.date ||
                a.arrivalDate
            );

            const dateB = parseDate(
              b.date ||
                b.arrivalDate
            );

            if (!dateA || !dateB) return 0;

            return (
              dateA.getTime() -
              dateB.getTime()
            );
          }
        );

        setChartData(sortedHistory);

        setLastFetchedAt(new Date());

        if (!sortedRates.length) {
          setError(
            'इस स्थान के लिए कोई मंडी भाव उपलब्ध नहीं मिला।'
          );
        }
      } catch (err) {
        console.error(
          'Mandi API Error:',
          err
        );

        setError(
          'मंडी भाव लोड नहीं हो पाए। कृपया कुछ समय बाद फिर प्रयास करें।'
        );

        setMandiRates([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    },
    [
      activeState,
      activeDistrict,
      activeMandi,
      selectedCrop,
    ]
  );

  useEffect(() => {
    fetchRatesAndHistory();
  }, [fetchRatesAndHistory]);

  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredRates = useMemo(() => {
    const query =
      searchTerm.trim().toLowerCase();

    const mappedEnglish =
      CROP_MAP?.[searchTerm.trim()]
        ?.toLowerCase() || '';

    if (!query) {
      return mandiRates;
    }

    return mandiRates.filter((item) => {
      const cropHindi =
        String(item.crop || '').toLowerCase();

      const cropEnglish =
        String(
          item.cropEnglish || ''
        ).toLowerCase();

      return (
        cropHindi.includes(query) ||
        cropEnglish.includes(query) ||
        (
          mappedEnglish &&
          cropEnglish.includes(mappedEnglish)
        )
      );
    });
  }, [
    mandiRates,
    searchTerm,
  ]);

  /* =======================================================
     LATEST RECORD
  ======================================================= */

  const latestRecord = useMemo(() => {
    return getLatestRecord(
      filteredRates
    );
  }, [filteredRates]);

  /* =======================================================
     HIGHEST PRICE
  ======================================================= */

  const highestPriceCrop = useMemo(() => {
    if (!filteredRates.length) {
      return null;
    }

    return [...filteredRates].sort(
      (a, b) =>
        safeNumber(b.modalPrice) -
        safeNumber(a.modalPrice)
    )[0];
  }, [filteredRates]);

  /* =======================================================
     AVERAGE MODAL PRICE
  ======================================================= */

  const averageModalPrice = useMemo(() => {
    if (!filteredRates.length) {
      return 0;
    }

    const total =
      filteredRates.reduce(
        (sum, item) =>
          sum +
          safeNumber(item.modalPrice),
        0
      );

    return Math.round(
      total / filteredRates.length
    );
  }, [filteredRates]);

  /* =======================================================
     LATEST AVAILABLE DATE
  ======================================================= */

  const latestAvailableDate = useMemo(() => {
    if (!latestRecord) {
      return null;
    }

    return getRecordDate(
      latestRecord
    );
  }, [latestRecord]);

  /* =======================================================
     EXPORT
  ======================================================= */

  const exportCSV = () => {
    if (!filteredRates.length) {
      return;
    }

    const headers =
      'Crop,State,District,Mandi,Min Price,Max Price,Modal Price,Available Date\n';

    const rows =
      filteredRates
        .map((item) => {
          return [
            item.crop,
            item.state,
            item.district,
            item.mandi,
            safeNumber(
              item.minPrice
            ),
            safeNumber(
              item.maxPrice
            ),
            safeNumber(
              item.modalPrice
            ),
            getRecordDate(item) || '',
          ]
            .map(
              (value) =>
                `"${String(value).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(',');
        })
        .join('\n');

    const blob = new Blob(
      [headers + rows],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement('a');

    anchor.href = url;

    anchor.download =
      `${activeMandi || 'Mandi'}_Latest_Rates.csv`;

    document.body.appendChild(anchor);

    anchor.click();

    document.body.removeChild(anchor);

    window.URL.revokeObjectURL(url);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleResetFilters = () => {
    setSelectedState(
      'Madhya Pradesh'
    );

    setCustomState('');

    setSelectedDistrict(
      'Neemuch'
    );

    setCustomDistrict('');

    setSelectedMandi(
      'Neemuch'
    );

    setCustomMandi('');

    setSelectedCrop(
      'सोयाबीन'
    );

    setSearchTerm('');
  };

  /* =======================================================
     QUICK CROP
  ======================================================= */

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setSearchTerm(crop);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white shadow-xl">

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="absolute -bottom-28 -left-20 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div className="max-w-3xl">

                <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black mb-4">
                  <TrendingUp className="w-4 h-4" />
                  कृषि मित्र • मंडी भाव
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                  {activeMandi
                    ? `${activeMandi} मंडी भाव`
                    : 'आज के मंडी भाव'}
                </h1>

                <p className="mt-3 text-emerald-100 text-sm sm:text-base">
                  {activeDistrict
                    ? `${activeDistrict}, `
                    : ''}
                  {activeState || 'सभी राज्य'}
                </p>

                <p className="mt-4 max-w-2xl text-emerald-100/90 text-xs sm:text-sm leading-6">
                  किसान भाइयों के लिए उपलब्ध
                  नवीनतम मंडी भाव। राज्य, जिला,
                  मंडी और फसल के अनुसार भाव खोजें।
                </p>

              </div>

              <div className="w-full lg:w-auto">

                <button
                  onClick={
                    fetchRatesAndHistory
                  }
                  disabled={loading}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-5 py-3 rounded-2xl text-sm font-black shadow-lg transition disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      loading
                        ? 'animate-spin'
                        : ''
                    }`}
                  />

                  {loading
                    ? 'भाव अपडेट हो रहे हैं...'
                    : 'नवीनतम भाव देखें'}
                </button>

              </div>

            </div>

            {/* Latest information */}

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <MapPin className="w-4 h-4 text-amber-300" />

                {activeMandi || 'सभी मंडी'}
              </div>

              {latestAvailableDate && (
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />

                  नवीनतम उपलब्ध:
                  {' '}
                  {formatDisplayDate(
                    latestAvailableDate
                  )}
                </div>
              )}

              {lastFetchedAt && (
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs">
                  <RefreshCw className="w-4 h-4 text-sky-300" />

                  अभी डेटा चेक किया गया
                </div>
              )}

            </div>

          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-start gap-3">

              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />

              <div>
                <p className="font-bold text-amber-900 text-sm">
                  डेटा उपलब्ध नहीं
                </p>

                <p className="text-xs text-amber-800 mt-1">
                  {error}
                </p>
              </div>

            </div>

            <button
              onClick={
                fetchRatesAndHistory
              }
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-black"
            >
              दोबारा प्रयास करें
            </button>

          </div>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Filter className="w-5 h-5 text-emerald-700" />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    मंडी खोजें
                  </h2>

                  <p className="text-xs text-slate-500">
                    राज्य, जिला, मंडी और फसल चुनें
                  </p>
                </div>

              </div>

              <button
                onClick={
                  handleResetFilters
                }
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                फ़िल्टर रीसेट
              </button>

            </div>

          </div>

          <div className="p-5 sm:p-6 space-y-5">

            {/* Location */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* State */}

              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">
                  राज्य
                </label>

                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(
                      e.target.value
                    );

                    setCustomState('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {PRESET_STATES.map(
                    (state) => (
                      <option
                        key={state}
                        value={state}
                      >
                        {state}
                      </option>
                    )
                  )}
                </select>

                <input
                  value={customState}
                  onChange={(e) =>
                    setCustomState(
                      e.target.value
                    )
                  }
                  placeholder="या राज्य लिखें..."
                  className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* District */}

              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">
                  जिला
                </label>

                <input
                  value={
                    customDistrict ||
                    selectedDistrict
                  }
                  onChange={(e) => {
                    setCustomDistrict(
                      e.target.value
                    );

                    setSelectedDistrict('');
                  }}
                  placeholder="जैसे Neemuch, Mandsaur..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Mandi */}

              <div>
                <label className="block text-xs font-black text-slate-700 mb-2">
                  मंडी
                </label>

                <input
                  value={
                    customMandi ||
                    selectedMandi
                  }
                  onChange={(e) => {
                    setCustomMandi(
                      e.target.value
                    );

                    setSelectedMandi('');
                  }}
                  placeholder="जैसे Neemuch, Mandsaur..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

            </div>

            {/* Crop chips */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="text-xs font-black text-slate-700">
                  लोकप्रिय फसलें
                </label>

                <span className="text-[10px] text-slate-400">
                  फसल चुनकर भाव देखें
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                {POPULAR_CROPS.map(
                  (crop) => {
                    const active =
                      selectedCrop === crop;

                    return (
                      <button
                        key={crop}
                        onClick={() =>
                          handleCropSelect(
                            crop
                          )
                        }
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border transition ${
                          active
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
                        }`}
                      >
                        <span>
                          {CROP_EMOJI[crop] ||
                            '🌱'}
                        </span>

                        {crop}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* Search */}

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative flex-1">

                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder="फसल खोजें — लहसुन, गेहूं, Soyabean..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {searchTerm && (
                  <button
                    onClick={() =>
                      setSearchTerm('')
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                )}

              </div>

              <button
                onClick={
                  fetchRatesAndHistory
                }
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl text-sm font-black transition disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                भाव अपडेट करें
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        {filteredRates.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Latest */}

            <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-bold text-slate-500">
                    नवीनतम उपलब्ध रिकॉर्ड
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-1">
                    {latestAvailableDate
                      ? formatDisplayDate(
                          latestAvailableDate
                        )
                      : '—'}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>

              </div>

            </div>

            {/* Highest */}

            <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold text-slate-500">
                    सबसे अधिक मॉडल भाव
                  </p>

                  <p className="text-lg font-black text-slate-900 mt-1">
                    {highestPriceCrop?.crop ||
                      '—'}
                  </p>

                  <p className="text-sm font-black text-amber-700 mt-1">
                    {formatPrice(
                      highestPriceCrop?.modalPrice
                    )}
                  </p>

                </div>

                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-amber-700" />
                </div>

              </div>

            </div>

            {/* Records */}

            <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold text-slate-500">
                    कुल रिकॉर्ड
                  </p>

                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {filteredRates.length}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    उपलब्ध फसलें
                  </p>

                </div>

                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-sky-700" />
                </div>

              </div>

            </div>

            {/* Average */}

            <div className="bg-white border border-violet-100 rounded-2xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-bold text-slate-500">
                    औसत मॉडल भाव
                  </p>

                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {formatPrice(
                      averageModalPrice
                    )}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    उपलब्ध रिकॉर्ड का औसत
                  </p>

                </div>

                <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-violet-700" />
                </div>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            SELECTED CROP PRICE
        ================================================= */}

        {latestRecord && (
          <section className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-3xl p-5 sm:p-7 shadow-lg">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-4">

                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl">
                  {CROP_EMOJI[
                    latestRecord.crop
                  ] || '🌾'}
                </div>

                <div>

                  <p className="text-emerald-100 text-xs font-bold">
                    नवीनतम उपलब्ध भाव
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-black mt-1">
                    {latestRecord.crop}
                  </h2>

                  <p className="text-emerald-100 text-xs mt-1">
                    {latestRecord.mandi ||
                      activeMandi ||
                      'मंडी'}
                    {' • '}
                    {latestRecord.district ||
                      activeDistrict}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-3">

                <div className="bg-white/10 rounded-2xl p-4 min-w-[95px]">

                  <p className="text-[10px] text-emerald-100">
                    न्यूनतम
                  </p>

                  <p className="font-black text-lg mt-1">
                    {formatPrice(
                      latestRecord.minPrice
                    )}
                  </p>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 min-w-[95px]">

                  <p className="text-[10px] text-emerald-100">
                    अधिकतम
                  </p>

                  <p className="font-black text-lg mt-1">
                    {formatPrice(
                      latestRecord.maxPrice
                    )}
                  </p>

                </div>

                <div className="bg-amber-400 text-slate-950 rounded-2xl p-4 min-w-[95px]">

                  <p className="text-[10px] font-bold">
                    मॉडल भाव
                  </p>

                  <p className="font-black text-lg mt-1">
                    {formatPrice(
                      latestRecord.modalPrice
                    )}
                  </p>

                </div>

              </div>

            </div>

            {latestAvailableDate && (
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">

                <p className="text-xs text-emerald-100">
                  उपलब्ध डेटा की तारीख:
                  {' '}
                  <strong className="text-white">
                    {formatDisplayDate(
                      latestAvailableDate
                    )}
                  </strong>
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  उपलब्ध नवीनतम रिकॉर्ड
                </span>

              </div>
            )}

          </section>
        )}

        {/* =================================================
            CHART
        ================================================= */}

        <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ChartIcon className="w-4 h-4 text-emerald-700" />
                </div>

                <div>

                  <h2 className="font-black text-slate-900">
                    भाव का रुझान
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedCrop}
                    {' • '}
                    {activeMandi}
                  </p>

                </div>

              </div>

            </div>

            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(
                  e.target.value
                );

                setSearchTerm(
                  e.target.value
                );
              }}
              className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {POPULAR_CROPS.map(
                (crop) => (
                  <option
                    key={crop}
                    value={crop}
                  >
                    {crop}
                  </option>
                )
              )}
            </select>

          </div>

          {loading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-3">

              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />

              <p className="text-xs font-bold text-slate-500">
                नवीनतम भाव और इतिहास लोड हो रहा है...
              </p>

            </div>
          ) : chartData.length > 0 ? (

            <div className="h-72 w-full pt-5">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="priceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#059669"
                        stopOpacity={0.45}
                      />

                      <stop
                        offset="95%"
                        stopColor="#059669"
                        stopOpacity={0}
                      />
                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 10,
                      fill: '#64748b',
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: '#64748b',
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        '#0f172a',
                      color: '#fff',
                      borderRadius:
                        '12px',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [
                      formatPrice(value),
                      'मॉडल भाव',
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="modalPrice"
                    stroke="#047857"
                    strokeWidth={3}
                    fill="url(#priceGradient)"
                    fillOpacity={1}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          ) : (

            <div className="h-64 flex flex-col items-center justify-center text-center">

              <ChartIcon className="w-10 h-10 text-slate-300" />

              <p className="text-sm font-bold text-slate-500 mt-3">
                ऐतिहासिक भाव उपलब्ध नहीं है
              </p>

              <p className="text-xs text-slate-400 mt-1">
                इस फसल और मंडी के लिए अभी chart data नहीं मिला।
              </p>

            </div>

          )}

        </section>

        {/* =================================================
            TABLE
        ================================================= */}

        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="p-5 sm:p-6 border-b border-slate-100">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>

                <h2 className="text-xl font-black text-slate-900">
                  नवीनतम मंडी भाव
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {activeMandi || 'मंडी'}
                  {' • '}
                  {activeDistrict}
                  {' • '}
                  {activeState}
                </p>

              </div>

              <button
                onClick={exportCSV}
                disabled={!filteredRates.length}
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black transition"
              >
                <Download className="w-4 h-4" />
                CSV डाउनलोड
              </button>

            </div>

          </div>

          {loading ? (

            <div className="p-12 text-center">

              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />

              <p className="text-sm font-bold text-slate-600 mt-3">
                नवीनतम मंडी भाव खोजे जा रहे हैं...
              </p>

            </div>

          ) : filteredRates.length === 0 ? (

            <div className="p-12 text-center">

              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-slate-400" />
              </div>

              <h3 className="font-black text-slate-800 mt-4">
                कोई भाव नहीं मिला
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                राज्य, जिला, मंडी या फसल बदलकर दोबारा खोजें।
              </p>

              <button
                onClick={
                  handleResetFilters
                }
                className="mt-4 bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                फ़िल्टर रीसेट करें
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[720px]">

                <thead className="bg-emerald-900 text-white">

                  <tr>
                    <th className="p-4">दिनांक (Date)</th>

                    <th className="p-4 text-left text-xs font-black">
                      फसल
                    </th>

                    <th className="p-4 text-left text-xs font-black">
                      न्यूनतम भाव
                    </th>

                    <th className="p-4 text-left text-xs font-black">
                      अधिकतम भाव
                    </th>

                    <th className="p-4 text-left text-xs font-black">
                      मॉडल भाव
                    </th>

                    <th className="p-4 text-center text-xs font-black">
                      ट्रेंड
                    </th>

                    <th className="p-4 text-center text-xs font-black">
                      विवरण
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredRates.map(
                    (item, index) => {

                      const previous =
                        filteredRates[
                          index + 1
                        ];

                      const trend =
                        getTrend(
                          item.modalPrice,
                          previous?.modalPrice
                        );

                      return (
                        <tr
                          key={
                            item.id ||
                            `${item.crop}-${index}`
                          }
                          className="hover:bg-emerald-50/40 transition"
                        >
<td className="p-4 text-slate-600 font-semibold whitespace-nowrap">
                      {item.arrivalDate}
                    </td>
                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                                {CROP_EMOJI[
                                  item.crop
                                ] || '🌾'}
                              </div>

                              <div>

                                <p className="font-black text-slate-900">
                                  {item.crop}
                                </p>

                                {item.cropEnglish && (
                                  <p className="text-[10px] text-slate-400">
                                    {
                                      item.cropEnglish
                                    }
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="p-4">

                            <span className="font-bold text-slate-700">
                              {formatPrice(
                                item.minPrice
                              )}
                            </span>

                          </td>

                          <td className="p-4">

                            <span className="font-bold text-slate-700">
                              {formatPrice(
                                item.maxPrice
                              )}
                            </span>

                          </td>

                          <td className="p-4">

                            <span className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-black">
                              {formatPrice(
                                item.modalPrice
                              )}
                            </span>

                          </td>

                          <td className="p-4 text-center">

                            {trend.direction ===
                            'up' ? (

                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-full text-[11px] font-black">
                                <TrendingUp className="w-3.5 h-3.5" />
                                +{trend.percentage}%
                              </span>

                            ) : trend.direction ===
                              'down' ? (

                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1.5 rounded-full text-[11px] font-black">
                                <TrendingDown className="w-3.5 h-3.5" />
                                {trend.percentage}%
                              </span>

                            ) : (

                              <span className="text-xs text-slate-400 font-bold">
                                —
                              </span>

                            )}

                          </td>

                          <td className="p-4 text-center">

                            <Link
                              href={`/crops/${String(
                                item.cropEnglish ||
                                  item.crop ||
                                  ''
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  '-'
                                )}`}
                              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 text-xs font-black"
                            >
                              देखें
                              <ChevronRight className="w-4 h-4" />
                            </Link>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =================================================
            FOOT NOTE
        ================================================= */}

        <section className="bg-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5">

          <div className="flex items-start gap-3">

            <AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />

            <div>

              <h3 className="text-xs font-black text-slate-800">
                मंडी भाव के बारे में
              </h3>

              <p className="text-[11px] sm:text-xs text-slate-500 leading-5 mt-1">
                यहां केवल API/source से उपलब्ध नवीनतम
                रिकॉर्ड को दिखाया जाता है। यदि सरकारी या
                source data में आज का नया रिकॉर्ड उपलब्ध
                नहीं है, तो पिछली उपलब्ध तारीख का भाव
                दिखाई दे सकता है। इसलिए ऊपर वास्तविक
                उपलब्ध रिकॉर्ड की तारीख अलग से दिखाई जाती है।
              </p>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}