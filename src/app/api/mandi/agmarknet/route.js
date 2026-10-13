export const dynamic = "force-dynamic";

const AGMARKNET_URL = "https://api.agmarknet.gov.in/v1/dashboard-data/";
const ALLOWED_DASHBOARD = "marketwise_price_arrival";
const MAX_LIMIT = 250;

function normalizeIdList(value, fallback, allowEmpty = false) {
  if (value === undefined || value === null || value === "") return fallback;

  const values = Array.isArray(value) ? value : [value];
  if (values.length === 0) return allowEmpty ? [] : null;
  if (values.length > 25) return null;

  const ids = values.map(Number);
  return ids.every((id) => Number.isSafeInteger(id) && id > 0) ? ids : null;
}

function normalizeId(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      !isValidDate(body.date) ||
      body.dashboard !== ALLOWED_DASHBOARD
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid mandi query.",
        },
        { status: 400 }
      );
    }

    const group = normalizeIdList(body.group, [100000]);
    const commodity = normalizeIdList(body.commodity, [100001], true);
    const district = normalizeIdList(body.district, [318], true);
    const market = normalizeIdList(body.market, [], true);
    const grades = normalizeIdList(body.grades, [4]);
    const variety = normalizeId(body.variety, 100021);
    const state = normalizeId(body.state, 19);
    const page = body.page === undefined ? 1 : Number(body.page);
    const limit = body.limit === undefined ? MAX_LIMIT : Number(body.limit);

    if (
      !group ||
      !commodity ||
      !district ||
      !market ||
      !grades ||
      variety === null ||
      state === null ||
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return Response.json(
        { success: false, message: "Invalid mandi filters." },
        { status: 400 }
      );
    }

    const payload = {
      dashboard: ALLOWED_DASHBOARD,
      date: body.date,
      group,
      commodity,
      variety,
      state,
      district,
      market,
      grades,
      page,
      limit,
      format: "json",
    };

    const upstream = await fetch(AGMARKNET_URL, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Origin: "https://agmarknet.gov.in",
        Referer: "https://agmarknet.gov.in/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const text = await upstream.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 1000) };
    }

    if (!upstream.ok) {
      return Response.json(
        {
          success: false,
          message: "AGMARKNET request failed.",
        },
        { status: 502 }
      );
    }

    if (data && data.status === false) {
      return Response.json({
        success: true,
        source: "AGMARKNET dashboard-data",
        data: {
          records: [],
          message: data.message || "No data returned",
        },
      });
    }

    return Response.json({
      success: true,
      source: "AGMARKNET dashboard-data",
      data,
    });
  } catch (error) {
    console.error("AGMARKNET route error:", error);

    return Response.json(
      {
        success: false,
        message:
          error.name === "TimeoutError"
            ? "AGMARKNET response timeout."
            : "AGMARKNET server request failed.",
      },
      { status: 502 }
    );
  }
}