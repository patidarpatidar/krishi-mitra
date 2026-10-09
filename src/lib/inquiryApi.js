
import { clearAdminSession, getAdminToken } from "@/lib/apiClient";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function request(path, options = {}) {
  const token = getAdminToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await response.text();

  let result;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = null;
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAdminSession();
    }

    throw new Error(
      result?.message || `Request failed (${response.status})`
    );
  }

  if (result?.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

export const inquiryApi = {
  getInquiries(params = {}) {
    const query = new URLSearchParams(params);
    const queryString = query.toString();

    return request(
      `/inquiries${queryString ? `?${queryString}` : ""}`
    );
  },

  getInquiry(id) {
    return request(`/inquiries/${encodeURIComponent(id)}`);
  },

  createInquiry(data) {
    return request("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateInquiry(id, data) {
    return request(`/inquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteInquiry(id) {
    return request(`/inquiries/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};