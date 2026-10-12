export const dynamic = "force-dynamic";

const BASE_URL = "https://api.agmarknet.gov.in/v1";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/daily-price-arrival/filters`, {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        Origin: "https://agmarknet.gov.in",
        Referer: "https://agmarknet.gov.in/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON from AGMARKNET" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: "AGMARKNET filters API failed",
        },
        { status: 502 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("AGMARKNET filters proxy error:", error);
    return Response.json(
      {
        success: false,
        message: "Unable to load AGMARKNET filters",
      },
      { status: 502 }
    );
  }
}