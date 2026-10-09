"use client";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const FARMER_TOKEN_KEY = "krishi_mitra_farmer_token";
const FARMER_USER_KEY = "krishi_mitra_farmer";

export function getFarmerToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FARMER_TOKEN_KEY);
}

export function getFarmerUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FARMER_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveFarmerSession(data) {
  if (typeof window === "undefined") return;
  const token = data?.token || data?.data?.token;
  const user = data?.user || data?.data?.user;

  if (token) {
    localStorage.setItem(FARMER_TOKEN_KEY, token);
  }

  if (user) {
    const sessionUser = {
      ...user,
      loggedIn: true,
    };
    localStorage.setItem(FARMER_USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  return null;
}

export function clearFarmerSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(FARMER_TOKEN_KEY);
  localStorage.removeItem(FARMER_USER_KEY);
}

export function isFarmerLoggedIn() {
  if (typeof window === "undefined") return false;
  const token = getFarmerToken();
  const user = getFarmerUser();
  return Boolean(token && user && user.loggedIn);
}

export async function farmerRequest(path, options = {}) {
  const token = getFarmerToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearFarmerSession();
    }

    const message =
      result.message ||
      (Array.isArray(result.errors)
        ? result.errors.map((e) => e.msg || e.message).join(", ")
        : `Request failed (${response.status})`);

    throw new Error(message);
  }

  return result;
}

export const farmerApi = {
  // ------------------------------------
  // AUTH
  // ------------------------------------
  async login(loginValue, password) {
    const result = await farmerRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        login: loginValue,
        password,
      }),
    });

    if (result.data?.token && result.data?.user) {
      saveFarmerSession(result.data);
    }

    return result;
  },

  async register(data) {
    const result = await farmerRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (result.data?.token && result.data?.user) {
      saveFarmerSession(result.data);
    }

    return result;
  },

  async logout() {
    try {
      await farmerRequest("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      clearFarmerSession();
    }
  },

  async getMe() {
    const result = await farmerRequest("/auth/me", { method: "GET" });
    if (result.data?.user) {
      saveFarmerSession({ user: result.data.user });
    }
    return result;
  },

  // ------------------------------------
  // PROFILE
  // ------------------------------------
  async getProfile() {
    const result = await farmerRequest("/farmer/profile", { method: "GET" });
    if (result.data?.user) {
      saveFarmerSession({ user: result.data.user });
    }
    return result;
  },

  async updateProfile(updates) {
    const result = await farmerRequest("/farmer/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    if (result.data?.user) {
      saveFarmerSession({ user: result.data.user });
    }

    return result;
  },

  // ------------------------------------
  // DASHBOARD
  // ------------------------------------
  async getDashboard() {
    return farmerRequest("/farmer/dashboard", { method: "GET" });
  },

  // ------------------------------------
  // CROPS
  // ------------------------------------
  async getCrops() {
    return farmerRequest("/farmer/crops", { method: "GET" });
  },

  async addCrop(cropData) {
    const result = await farmerRequest("/farmer/crops", {
      method: "POST",
      body: JSON.stringify(cropData),
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.crops = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  async updateCrop(id, cropData) {
    const result = await farmerRequest(`/farmer/crops/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(cropData),
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.crops = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  async deleteCrop(id) {
    const result = await farmerRequest(`/farmer/crops/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.crops = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  // ------------------------------------
  // SAVED ITEMS
  // ------------------------------------
  async getSavedItems() {
    return farmerRequest("/farmer/saved", { method: "GET" });
  },

  async addSavedItem(itemData) {
    const result = await farmerRequest("/farmer/saved", {
      method: "POST",
      body: JSON.stringify(itemData),
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.savedItems = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  async deleteSavedItem(id) {
    const result = await farmerRequest(`/farmer/saved/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.savedItems = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  // ------------------------------------
  // WATCHLIST
  // ------------------------------------
  async getWatchlist() {
    return farmerRequest("/farmer/watchlist", { method: "GET" });
  },

  async toggleWatchlist(commodity) {
    const result = await farmerRequest("/farmer/watchlist", {
      method: "POST",
      body: JSON.stringify({ commodity }),
    });

    const user = getFarmerUser();
    if (user && result.data) {
      user.watchlist = result.data;
      localStorage.setItem(FARMER_USER_KEY, JSON.stringify(user));
    }

    return result;
  },

  // ------------------------------------
  // PUBLIC DATA APIS (Dynamic fallback)
  // ------------------------------------
  async getSchemes() {
    const response = await fetch(`${API_BASE}/schemes?status=published`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    return result.data || [];
  },

  async getCropsList() {
    const response = await fetch(`${API_BASE}/crops?status=published`, {
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));
    return result.data || [];
  },
};
