
import { clearAdminSession, getAdminToken } from "@/lib/apiClient";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const token = getAdminToken();
  if (!token) {
    clearAdminSession();
    if (typeof window !== "undefined") {
      window.location.assign("/admin/login");
    }
    throw new Error("Admin session नहीं मिली। कृपया फिर से login करें।");
  }

  const headers = new Headers({
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  });

  // Send JWT token with protected admin requests
  headers.set("Authorization", `Bearer ${token.trim()}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    const validationErrors = Array.isArray(result.errors)
      ? result.errors
          .map((error) => error.message || error.msg)
          .filter(Boolean)
          .join(", ")
      : "";

    if (
      response.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearAdminSession();
      window.location.assign("/admin/login");
    }

    throw new Error(
      validationErrors ||
        result.message ||
        `Request failed: ${response.status}`
    );
  }

  return result;
}

export const livestockApi = {
  // Get admin articles with filters and pagination
  list(params = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (
        value === "" ||
        value === undefined ||
        value === null
      ) {
        return;
      }

      if (key === "category" && value === "all") {
        return;
      }

      query.set(key, String(value));
    });

    const queryString = query.toString();

    const path = queryString
      ? `/livestock/admin?${queryString}`
      : "/livestock/admin";

    return request(path);
  },

  // Get one article
  getById(id) {
    return request(
      `/livestock/admin/${encodeURIComponent(id)}`
    );
  },

  // Create article
  create(payload) {
    return request("/livestock/admin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Update article
  update(id, payload) {
    return request(
      `/livestock/admin/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },

  // Delete article
  remove(id) {
    return request(
      `/livestock/admin/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );
  },
};
