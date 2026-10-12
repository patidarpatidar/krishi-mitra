
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CalendarDays, RefreshCw, TrendingUp } from "lucide-react";
import { getAgmarknetRates, formatMandiPrice } from "@/services/mandiApi";

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateLabel(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("hi-IN", {
        day: "2-digit",
        month: "short",
      });
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
}

function getPrice(row, keys) {
  for (const key of keys) {
    const value = toNumber(row?.raw?.[key] ?? row?.[key]);
    if (value !== null) return value;
  }
  return null;
}

function getCropName(option) {
  if (typeof option === "string") return option;

  return (
    option?.label ??
    option?.name ??
    option?.commodity_name ??
    option?.cmdt_name ??
    option?.commodityName ??
    ""
  );
}

function getCropId(option) {
  if (typeof option === "string") return "";

  return String(
    option?.value ??
    option?.id ??
    option?.commodity_id ??
    option?.cmdt_id ??
    ""
  );
}

export default function MandiDateTrendChart({
  filters = {},
  commodityOptions = [],
  initialCommodity = "",
}) {
  const [commodity, setCommodity] = useState(
    String(filters.commodity || initialCommodity || "")
  );
  const [days, setDays] = useState("7");
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return getDateString(date);
  });
  const [toDate, setToDate] = useState(getDateString(new Date()));
  const [search, setSearch] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const crops = useMemo(() => {
    return commodityOptions
      .map((option) => ({
        id: getCropId(option),
        name: getCropName(option),
      }))
      .filter((crop) => crop.id && crop.name);
  }, [commodityOptions]);

  const filteredCrops = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("hi");
    if (!query) return crops;

    return crops.filter((crop) =>
      crop.name.toLocaleLowerCase("hi").includes(query)
    );
  }, [crops, search]);

  // Keep the initial crop in sync with the page filters.
  useEffect(() => {
    if (filters.commodity) {
      setCommodity(String(filters.commodity));
    }
  }, [filters.commodity]);

  const loadTrend = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");
    setChartData([]);

    try {
      if (!commodity) {
        throw new Error("पहले फसल चुनें।");
      }

      if (!fromDate || !toDate || fromDate > toDate) {
        throw new Error("कृपया सही तारीख़ की सीमा चुनें।");
      }

      const start = new Date(`${fromDate}T00:00:00`);
      const end = new Date(`${toDate}T00:00:00`);
      const dayCount =
        Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

      if (dayCount > 31) {
        throw new Error("एक बार में अधिकतम 31 दिनों का डेटा चुनें।");
      }

      const dates = [];
      for (let i = 0; i < dayCount; i += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(getDateString(date));
      }

      const rows = [];

      // Small batches avoid sending too many requests simultaneously.
      for (let i = 0; i < dates.length; i += 4) {
        const batch = dates.slice(i, i + 4);

        const results = await Promise.all(
          batch.map(async (date) => {
            try {
              const result = await getAgmarknetRates({
                ...filters,
                date,
                commodity,
                limit: 250,
              });

              if (!result?.success) {
                return { date, row: null };
              }

              // With a selected commodity, use the returned matching row.
              const crop = crops.find((item) => item.id === commodity);
              const matchingRow =
                result.data?.find((row) => {
                  if (!crop) return true;
                  return (
                    String(row.commodity || "").toLowerCase() ===
                      crop.name.toLowerCase() ||
                    String(row.raw?.cmdt_id ?? "") === commodity
                  );
                }) ?? result.data?.[0];

              return { date, row: matchingRow || null };
            } catch {
              return { date, row: null };
            }
          })
        );

        rows.push(...results);
      }

      const points = rows
        .filter(({ row }) => row)
        .map(({ date, row }) => {
          const modalPrice =
            toNumber(row.modalPrice) ??
            getPrice(row, ["as_on_price", "modal_price", "modalPrice"]);

          const minPrice = getPrice(row, [
            "min_price",
            "minPrice",
            "min_price_rs",
          ]);

          const maxPrice = getPrice(row, [
            "max_price",
            "maxPrice",
            "max_price_rs",
          ]);

          return {
            date,
            label: getDateLabel(date),
            modalPrice,
            minPrice,
            maxPrice,
          };
        })
        .filter(
          (point) =>
            point.modalPrice !== null ||
            point.minPrice !== null ||
            point.maxPrice !== null
        );

      setChartData(points);

      if (!points.length) {
        setNotice(
          "चुनी गई तारीख़ों में इस फसल का उपयोग योग्य भाव नहीं मिला। दूसरी तारीख़ या फसल चुनें।"
        );
      } else if (points.length < dates.length) {
        setNotice(
          `${dates.length} दिनों में से ${points.length} दिनों का उपयोग योग्य डेटा मिला। बाकी तारीख़ों के लिए डेटा उपलब्ध नहीं मिला या अनुरोध विफल हुआ।`
        );
      }
    } catch (err) {
      setError(err.message || "Trend डेटा लोड नहीं हो पाया।");
    } finally {
      setLoading(false);
    }
  }, [commodity, fromDate, toDate, filters, crops]);

  useEffect(() => {
    if (commodity) loadTrend();
  }, [loadTrend, refreshKey]);

  function changeRange(value) {
    setDays(value);

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - (Number(value) - 1));

    setFromDate(getDateString(start));
    setToDate(getDateString(end));
  }

  const selectedCrop = crops.find((crop) => crop.id === commodity);

  const latest = chartData.length
    ? chartData[chartData.length - 1]
    : null;

  const firstPrice = chartData.find(
    (point) => point.modalPrice !== null
  )?.modalPrice;

  const lastPrice = [...chartData]
    .reverse()
    .find((point) => point.modalPrice !== null)?.modalPrice;

  const difference =
    firstPrice !== undefined &&
    firstPrice !== null &&
    lastPrice !== undefined &&
    lastPrice !== null
      ? lastPrice - firstPrice
      : null;

  return (
    <section className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              तारीख़वार मंडी भाव ट्रेंड
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            फसल के भाव में समय के साथ होने वाले बदलाव देखें
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            फसल खोजें
          </label>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="सोयाबीन, गेहूँ, प्याज..."
            className="mb-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-green-600"
          />

          <select
            value={commodity}
            onChange={(event) => setCommodity(event.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-green-600"
          >
            <option value="">फसल चुनें</option>
            {filteredCrops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            अवधि
          </label>
          <select
            value={days}
            onChange={(event) => changeRange(event.target.value)}
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <option value="7">पिछले 7 दिन</option>
            <option value="14">पिछले 14 दिन</option>
            <option value="30">पिछले 30 दिन</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            अवधि बदलने पर तारीख़ें अपने आप बदलेंगी।
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            शुरू की तारीख़
          </label>
          <input
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(event) => {
              setDays("custom");
              setFromDate(event.target.value);
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            अंतिम तारीख़
          </label>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            max={getDateString(new Date())}
            onChange={(event) => {
              setDays("custom");
              setToDate(event.target.value);
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {selectedCrop && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
          <div>
            <p className="text-xs text-gray-500">चुनी गई फसल</p>
            <p className="font-semibold text-gray-900">
              {selectedCrop.name}
            </p>
          </div>

          {difference !== null && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                पहली उपलब्ध तारीख़ से बदलाव
              </p>
              <p
                className={`font-bold ${
                  difference > 0
                    ? "text-green-700"
                    : difference < 0
                      ? "text-red-600"
                      : "text-gray-700"
                }`}
              >
                {difference > 0 ? "+" : ""}
                {formatMandiPrice(difference)}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-500">
          <RefreshCw className="h-7 w-7 animate-spin text-green-600" />
          <p className="text-sm">तारीख़वार मंडी डेटा लोड हो रहा है...</p>
        </div>
      ) : chartData.length > 0 ? (
        <>
          <div className="h-72 w-full sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 12, left: 4, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  minTickGap={16}
                />
                <YAxis
                  width={72}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  labelFormatter={(label) => `तारीख़: ${label}`}
                  formatter={(value, name) => [
                    formatMandiPrice(value),
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="modalPrice"
                  name="Modal Price"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="minPrice"
                  name="Min Price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="maxPrice"
                  name="Max Price"
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-3">
              <p className="text-sm text-gray-500">आख़िरी उपलब्ध तारीख़</p>
              <p className="mt-1 font-semibold">
                {latest?.label || "—"}
              </p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-sm text-gray-500">आख़िरी Modal Price</p>
              <p className="mt-1 font-semibold text-green-700">
                {formatMandiPrice(lastPrice)}
              </p>
            </div>
            <div className="rounded-xl border p-3">
              <p className="text-sm text-gray-500">उपलब्ध डेटा पॉइंट</p>
              <p className="mt-1 font-semibold">
                {chartData.length}
              </p>
            </div>
          </div>
        </>
      ) : (
        !error && (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <CalendarDays className="mb-2 h-8 w-8 text-gray-400" />
            <p className="font-medium text-gray-800">
              अभी दिखाने के लिए डेटा नहीं है
            </p>
            <p className="mt-1 max-w-sm px-4 text-sm text-gray-500">
              फसल और तारीख़ की सीमा जाँचें। यदि AGMARKNET ऐतिहासिक डेटा
              नहीं देता, तो इस अवधि का trend उपलब्ध नहीं होगा।
            </p>
          </div>
        )
      )}

      <p className="mt-4 text-xs leading-5 text-gray-500">
        भाव ₹/क्विंटल में हैं। केवल API से प्राप्त डेटा दिखाया जाता है।
        Min/Max price उपलब्ध न होने पर वे chart में नहीं दिखेंगे।
      </p>
    </section>
  );
}
