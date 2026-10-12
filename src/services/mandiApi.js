const API_URL = "/api/mandi/agmarknet";
const FILTERS_URL = "/api/mandi/filters";

export const MANDI_FILTER_OPTIONS = {
  states: [{ label: "Madhya Pradesh", value: "19" }],
  districts: [{ label: "Neemuch", value: "318" }],
  markets: [{ label: "Neemuch APMC", value: "182" }],
  groups: [{ label: "All Commodity Groups, Cereals ...more", value: "100000" }],
  commodities: [],
  varieties: [{ label: "All Varieties", value: "100021" }],
  grades: [{ label: "FAQ", value: "4" }],
};

export const DEFAULT_MANDI_FILTERS = {
  state: "19",
  district: "318",
  market: "",
  group: "100000",
  commodity: "",
  variety: "100021",
  grade: "4",
  date: getLocalDate(),
};

export function getLocalDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function extractRows(result) {
  if (Array.isArray(result?.data?.data?.records)) return result.data.data.records;
  if (Array.isArray(result?.data?.records)) return result.data.records;
  if (Array.isArray(result?.records)) return result.records;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.results)) return result.results;
  return [];
}

function getField(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row[key] !== null) {
      return row[key];
    }
  }
  return null;
}

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(number) ? number : null;
}

export function normalizeMandiRow(row, index = 0) {
  const rawModal = getField(row, [
    "as_on_price",
    "modal_price",
    "modalPrice",
    "modalRate",
    "price",
  ]);
  const rawMin = getField(row, ["min_price", "minPrice", "minRate"]);
  const rawMax = getField(row, ["max_price", "maxPrice", "maxRate"]);
  const currentPrice = numberOrNull(rawModal);
  const yesterdayPrice = numberOrNull(row.one_day_ago_price);
  const twoDaysAgoPrice = numberOrNull(row.two_day_ago_price);
  const availablePrices = [currentPrice, yesterdayPrice, twoDaysAgoPrice].filter(
    (price) => price !== null
  );
  const latestPrice = currentPrice ?? yesterdayPrice ?? twoDaysAgoPrice;
  const latestPriceOffset =
    currentPrice !== null ? 0 : yesterdayPrice !== null ? -1 : -2;
  const rawArrival = getField(row, ["as_on_arrival", "arrival"]);
  const cropName =
    getField(row, [
      "cmdt_name",
      "commodity",
      "commodity_name",
      "commodityName",
      "crop",
    ]) ?? "—";

  return {
    id: String(row.id ?? row._id ?? `${cropName}-${index}`),
    date: getField(row, [
      "reported_date",
      "date",
      "arrival_date",
      "arrivalDate",
      "price_date",
    ]),
    state: getField(row, ["state", "state_name"]) ?? "",
    district: getField(row, ["district", "district_name"]) ?? "",
    market: getField(row, ["market", "market_name", "marketName", "mandi"]) ?? "",
    group: getField(row, ["cmdt_grp_name", "commodity_group", "group_name"]) ?? "",
    commodity: cropName,
    crop: cropName,
    cropEnglish: getField(row, ["cropEnglish", "cmdt_eng_name"]) || cropName,
    variety: getField(row, ["variety", "variety_name"]) ?? "—",
    mspPrice: numberOrNull(row.msp_price),
    modalPrice: latestPrice,
    yesterdayPrice,
    twoDaysAgoPrice,
    priceDate: getOffsetMandiDate(
      getField(row, ["reported_date", "date", "arrival_date", "arrivalDate", "price_date"]),
      latestPriceOffset
    ),
    arrival: numberOrNull(rawArrival),
    yesterdayArrival: numberOrNull(row.one_day_ago_arrival),
    twoDaysAgoArrival: numberOrNull(row.two_day_ago_arrival),
    minPrice:
      numberOrNull(rawMin) ??
      (availablePrices.length ? Math.min(...availablePrices) : null),
    maxPrice:
      numberOrNull(rawMax) ??
      (availablePrices.length ? Math.max(...availablePrices) : null),
    trend: row.trend ?? null,
    raw: row,
  };
}

function getOffsetMandiDate(value, offset) {
  const date = parseMandiDate(value);
  if (!date) return value ?? null;

  date.setDate(date.getDate() + offset);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export async function fetchAgmarknetFilters() {
  const response = await fetch(FILTERS_URL, { cache: "no-store" });
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result?.message || "फ़िल्टर लोड नहीं हो सके");
  }
  return result.data?.data ?? result.data;
}

function normalizeLocationName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("en-IN")
    .replace(/[^a-z0-9\u0900-\u097f]/g, "");
}

const LOCATION_ALIASES = {
  "madhya pradesh": ["madhya pradesh", "मध्य प्रदेश", "मध्यप्रदेश"],
  "uttar pradesh": ["uttar pradesh", "उत्तर प्रदेश", "उत्तरप्रदेश"],
  "andhra pradesh": ["andhra pradesh", "आंध्र प्रदेश", "आंध्रप्रदेश"],
  "himachal pradesh": ["himachal pradesh", "हिमाचल प्रदेश", "हिमाचलप्रदेश"],
  "arunachal pradesh": ["arunachal pradesh", "अरुणाचल प्रदेश", "अरुणाचलप्रदेश"],
  "tamil nadu": ["tamil nadu", "तमिलनाडु"],
  "west bengal": ["west bengal", "पश्चिम बंगाल"],
};

function locationNameMatches(value, optionName) {
  const wanted = normalizeLocationName(value);
  const actual = normalizeLocationName(optionName);
  if (!wanted || !actual) return false;
  if (wanted === actual) return true;

  const aliasGroup = Object.values(LOCATION_ALIASES).find((aliases) =>
    aliases.some((alias) => normalizeLocationName(alias) === wanted)
  );
  return Boolean(
    aliasGroup?.some((alias) => normalizeLocationName(alias) === actual)
  );
}

export async function getAgmarknetLocationIds(stateName, districtName, filterSource) {
  const source = filterSource || (await fetchAgmarknetFilters());
  const states = source.state_data || [];
  const districts = source.district_data || [];
  const state = states.find((item) =>
    locationNameMatches(stateName, item.state_name)
  );

  if (!state) {
    throw new Error("प्रोफाइल का राज्य मंडी सूची में नहीं मिला।");
  }

  const district = districts.find(
    (item) =>
      String(item.state_id) === String(state.state_id) &&
      locationNameMatches(districtName, item.district_name)
  );

  if (!district) {
    throw new Error("प्रोफाइल का जिला मंडी सूची में नहीं मिला।");
  }

  return {
    stateId: String(state.state_id),
    districtId: String(district.id || district.district_id),
    stateName: state.state_name,
    districtName: district.district_name,
  };
}

export async function getAgmarknetRates(filters = {}) {
  const date = filters.date || getLocalDate();

  const payload = {
    dashboard: "marketwise_price_arrival",
    date,
    limit: Number(filters.limit) || 250,
    format: "json",
  };

  // Group default to cereals [100000] if not specified, matching Agmarknet requirements
  payload.group = filters.group ? [Number(filters.group)] : [100000];

  payload.commodity =
    filters.commodity === undefined || filters.commodity === null
      ? [100001]
      : filters.commodity === ""
        ? []
        : [Number(filters.commodity)];

  payload.variety =
    filters.variety !== undefined && filters.variety !== ""
      ? Number(filters.variety)
      : 100021;

  payload.state =
    filters.state !== undefined && filters.state !== ""
      ? Number(filters.state)
      : 19;

  if (filters.district) {
    payload.district = [Number(filters.district)];
  } else {
    payload.district = [318]; // Default Neemuch
  }

  if (filters.market) {
    payload.market = [Number(filters.market)];
  } else {
    payload.market = [];
  }

  if (filters.grade) {
    payload.grades = [Number(filters.grade)];
  } else {
    payload.grades = [4];
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.details?.detail ??
      result?.details?.message ??
      result?.message ??
      `AGMARKNET API error (${response.status})`
    );
  }

  const successful =
    result?.success === true ||
    result?.status === "success" ||
    result?.status === true;

  if (!successful) {
    throw new Error(result?.message || "मंडी भाव प्राप्त नहीं हुए।");
  }

  const records = extractRows(result);
  const rows = records.map(normalizeMandiRow);

  return {
    success: true,
    source: result.source ?? "AGMARKNET",
    date,
    total: result.data?.records?.length ?? rows.length,
    pagination: result.pagination ?? null,
    columns: result.data?.columns ?? [],
    data: rows,
    raw: result,
  };
}

/**
 * Backward compatibility helper for existing pages:
 * HomePage, CropDetail, FarmerDashboard
 */
export async function getDynamicMandiRates(params = {}) {
  try {
    const res = await getAgmarknetRates({
      state: params.stateId || params.state || 19,
      district: params.districtId || params.district || 318,
      market: params.marketId || params.mandi || "",
      date: params.date || getLocalDate(),
    });
    return res.data || [];
  } catch (err) {
    console.warn("getDynamicMandiRates fallback error:", err);
    return [];
  }
}

export function filterMandiRates(rows = [], search = "", filters = {}) {
  const query = String(search).trim().toLocaleLowerCase("hi");

  return rows.filter((row) => {
    const searchMatch =
      !query ||
      [
        row.state,
        row.district,
        row.market,
        row.group,
        row.commodity,
        row.crop,
        row.cropEnglish,
        row.variety,
      ].some((value) =>
        String(value ?? "").toLocaleLowerCase("hi").includes(query)
      );

    const stateMatch =
      !filters.state || String(row.state) === String(filters.state);

    const districtMatch =
      !filters.district ||
      String(row.district) === String(filters.district);

    const marketMatch =
      !filters.market || String(row.market) === String(filters.market);

    const commodityMatch =
      !filters.commodity ||
      String(row.commodity) === String(filters.commodity);

    const groupMatch =
      !filters.group || String(row.group) === String(filters.group);

    return (
      searchMatch &&
      stateMatch &&
      districtMatch &&
      marketMatch &&
      commodityMatch &&
      groupMatch
    );
  });
}

export function formatMandiPrice(value) {
  if (value === null || value === undefined) return "—";
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";

  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(num)}`;
}

export function parseMandiDate(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  const raw = String(value).trim();
  // DD-MM-YYYY or DD/MM/YYYY
  const ddmmyyyy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatMandiDateDisplay(value) {
  const parsed = parseMandiDate(value);
  if (!parsed) return value || "तारीख उपलब्ध नहीं";
  return parsed.toLocaleDateString("hi-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
