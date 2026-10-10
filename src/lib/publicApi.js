const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export function getOrCreateVisitorId(storageKey = "krishi-visitor-id") {
  if (typeof window === "undefined") return "";

  let visitorId = window.localStorage.getItem(storageKey);
  if (!visitorId) {
    visitorId =
      window.crypto?.randomUUID?.() ||
      `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
}

export async function publicApiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }

  return result;
}

export function unwrapApiList(result, keys = []) {
  const wrapperKeys = [
    ...keys,
    "data",
    "results",
    "items",
    "crops",
    "schemes",
    "blogs",
    "recipes",
    "organicRecipes",
    "categories",
    "livestock",
    "articles",
  ];
  let value = result;

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];

    const key = wrapperKeys.find(
      (candidate) =>
        Array.isArray(value[candidate]) ||
        (value[candidate] &&
          typeof value[candidate] === "object" &&
          !Array.isArray(value[candidate]))
    );

    if (!key) return [];
    value = value[key];
  }

  return [];
}

export function unwrapApiItem(result, keys = []) {
  let value = result;

  for (let depth = 0; depth < 5; depth += 1) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }

    const key = keys.find(
      (candidate) =>
        value[candidate] &&
        typeof value[candidate] === "object" &&
        !Array.isArray(value[candidate])
    );

    if (key) {
      value = value[key];
      continue;
    }

    if (
      value.data &&
      typeof value.data === "object" &&
      !Array.isArray(value.data)
    ) {
      value = value.data;
      continue;
    }

    return value;
  }

  return null;
}
