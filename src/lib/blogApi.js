
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("krishi_mitra_admin_token");
}

async function request(path, options = {}) {
  const token = getAdminToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    if (response.status === 401 && token && typeof window !== "undefined") {
      localStorage.removeItem("krishi_mitra_admin_token");
      localStorage.removeItem("krishi_mitra_admin");
    }

    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export function unwrapList(data, keys = []) {
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}

export function unwrapItem(data, keys = []) {
  if (!data) return null;

  for (const key of keys) {
    if (data[key] && typeof data[key] === "object") {
      return data[key];
    }
  }

  if (data.data && !Array.isArray(data.data)) return data.data;

  return data;
}

export const blogApi = {
  // Categories
  getCategories: (admin = false) =>
    request(admin ? "/blog-categories/admin" : "/blog-categories"),

  getCategory: (id, admin = false) =>
    request(
      admin
        ? `/blog-categories/admin/${encodeURIComponent(id)}`
        : `/blog-categories/${encodeURIComponent(id)}`
    ),

  createCategory: (body) =>
    request("/blog-categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCategory: (id, body) =>
    request(`/blog-categories/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteCategory: (id) =>
    request(`/blog-categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  // Blog list
  getBlogs: (params = {}, admin = false) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });

    const queryString = query.toString();
    const path = admin ? "/blogs/admin" : "/blogs";

    return request(`${path}${queryString ? `?${queryString}` : ""}`);
  },

  // Public: fetch a published blog by slug
  getBlogBySlug: (slug) =>
    request(`/blogs/slug/${encodeURIComponent(slug)}`),

  // Admin: fetch a blog by MongoDB ID
  getBlog: (id) =>
    request(`/blogs/admin/${encodeURIComponent(id)}`),

  createBlog: (body) =>
    request("/blogs/admin", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateBlog: (id, body) =>
    request(`/blogs/admin/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteBlog: (id) =>
    request(`/blogs/admin/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  updateStatus: (id, status) =>
    request(`/blogs/admin/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  updateFeatured: (id, isFeatured) =>
    request(`/blogs/admin/${encodeURIComponent(id)}/featured`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured }),
    }),
};