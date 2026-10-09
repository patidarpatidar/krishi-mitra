
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export function saveAdminSession(data) {
  if (!data?.token || data?.user?.role !== "admin") {
    throw new Error("Valid admin session नहीं मिली।");
  }

  localStorage.setItem("krishi_mitra_admin_token", data.token);
  localStorage.setItem(
    "krishi_mitra_admin",
    JSON.stringify(data.user)
  );
}

export function clearAdminSession() {
  localStorage.removeItem("krishi_mitra_admin_token");
  localStorage.removeItem("krishi_mitra_admin");
}

export async function apiRequest(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("krishi_mitra_admin_token")
      : null;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  // Only send a token when one exists.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAdminSession();
    }

    throw new Error(
      result.message || `Request failed (${response.status})`
    );
  }

  return result;
}
export function getAdminToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("krishi_mitra_admin_token");
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("krishi_mitra_admin_token");
  localStorage.removeItem("krishi_mitra_admin");
}