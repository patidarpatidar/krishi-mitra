
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function fetchCollection(endpoint) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("krishi_mitra_admin_token")
      : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || `Failed to load ${endpoint}: ${response.status}`
    );
  }

  if (Array.isArray(result)) return result;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.data?.items)) return result.data.items;
  if (Array.isArray(result.items)) return result.items;

  return [];
}

export async function getAdminDashboardData() {
  const endpoints = [
    ["crops", "/crops"],
    ["cropCategories", "/crop-categories"],
    ["schemes", "/schemes"],
    ["livestock", "/livestock/admin"],
    ["blogs", "/blogs/admin"],
    ["blogCategories", "/blog-categories/admin"],
    ["organic", "/organic-recipes"],
    ["organicCategories", "/organic-categories"],
    ["schemeCategories", "/scheme-categories"],
  ];

  const results = await Promise.allSettled(
    endpoints.map(async ([key, endpoint]) => ({
      key,
      data: await fetchCollection(endpoint),
    }))
  );

  const data = {};
  const errors = {};

  results.forEach((result, index) => {
    const key = endpoints[index][0];

    if (result.status === "fulfilled") {
      data[result.value.key] = result.value.data;
    } else {
      data[key] = [];
      errors[key] = result.reason?.message || "API request failed";
    }
  });

  return { data, errors };
}
