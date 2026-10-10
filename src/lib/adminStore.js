
"use client";

const STORAGE_PREFIX = "krishi_mitra_admin_";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

// Collections that now use MongoDB through the backend API.
const API_COLLECTIONS = ["blogs", "blogCategories"];

const DEFAULT_DATA = {
  crops: [
    {
      id: "crop-wheat",
      name: "गेहूँ",
      englishName: "Wheat",
      category: "अनाज",
      season: "रबी",
      status: "published",
      featured: true,
      slug: "wheat",
      description: "मध्य प्रदेश में प्रमुख रबी फसल गेहूँ की खेती, बुवाई, सिंचाई और रोग प्रबंधन की जानकारी।",
      sowingTime: "अक्टूबर - दिसंबर",
      harvestTime: "मार्च - अप्रैल",
      waterRequirement: "मध्यम",
      soil: "दोमट मिट्टी",
    },
    {
      id: "crop-soybean",
      name: "सोयाबीन",
      englishName: "Soybean",
      category: "तिलहन",
      season: "खरीफ",
      status: "published",
      featured: true,
      slug: "soybean",
      description: "सोयाबीन की खेती, बीज उपचार, खाद, रोग एवं कीट प्रबंधन की जानकारी।",
      sowingTime: "जून - जुलाई",
      harvestTime: "सितंबर - अक्टूबर",
      waterRequirement: "वर्षा आधारित",
      soil: "काली मिट्टी",
    },
    {
      id: "crop-garlic",
      name: "लहसुन",
      englishName: "Garlic",
      category: "मसाला",
      season: "रबी",
      status: "draft",
      featured: false,
      slug: "garlic",
      description: "लहसुन की खेती और उत्पादन से जुड़ी उपयोगी जानकारी।",
      sowingTime: "अक्टूबर - नवंबर",
      harvestTime: "मार्च - अप्रैल",
      waterRequirement: "मध्यम",
      soil: "दोमट",
    },
  ],

  cropCategories: [
    { id: "cat-grain", name: "अनाज", slug: "grain", status: "active" },
    { id: "cat-oilseed", name: "तिलहन", slug: "oilseeds", status: "active" },
    { id: "cat-spice", name: "मसाला", slug: "spices", status: "active" },
    { id: "cat-pulse", name: "दलहन", slug: "pulses", status: "active" },
  ],

  schemes: [
    {
      id: "scheme-pm-kisan",
      name: "प्रधानमंत्री किसान सम्मान निधि",
      shortName: "PM-KISAN",
      level: "केंद्र सरकार",
      category: "आय सहायता",
      status: "published",
      summary: "पात्र किसान परिवारों को आय सहायता प्रदान करने वाली केंद्र सरकार की योजना।",
      officialUrl: "https://pmkisan.gov.in/",
      slug: "pm-kisan",
    },
    {
      id: "scheme-pmfby",
      name: "प्रधानमंत्री फसल बीमा योजना",
      shortName: "PMFBY",
      level: "केंद्र सरकार",
      category: "फसल बीमा",
      status: "published",
      summary: "किसानों को प्राकृतिक आपदा और फसल नुकसान के जोखिम से सुरक्षा देने वाली योजना।",
      officialUrl: "https://pmfby.gov.in/",
      slug: "pmfby",
    },
    {
      id: "scheme-kcc",
      name: "किसान क्रेडिट कार्ड",
      shortName: "KCC",
      level: "केंद्र सरकार",
      category: "कृषि ऋण",
      status: "published",
      summary: "कृषि और संबंधित गतिविधियों के लिए किसानों को समय पर ऋण सुविधा उपलब्ध कराने की व्यवस्था।",
      officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
      slug: "kisan-credit-card",
    },
  ],

  organic: [
    {
      id: "organic-1",
      title: "जैविक खेती की शुरुआत कैसे करें?",
      category: "जैविक खेती",
      status: "published",
      summary: "जैविक खेती शुरू करने के लिए मिट्टी, खाद और फसल प्रबंधन की मूल जानकारी।",
      content: "जैविक खेती में रासायनिक इनपुट को कम करते हुए जैविक खाद, कंपोस्ट और उचित फसल प्रबंधन पर ध्यान दिया जाता है।",
      author: "कृषि मित्र",
    },
    {
      id: "organic-2",
      title: "वर्मी कम्पोस्ट बनाने की विधि",
      category: "जैविक खाद",
      status: "draft",
      summary: "किसान अपने खेत पर वर्मी कम्पोस्ट तैयार करने की मूल प्रक्रिया जानें।",
      content: "वर्मी कम्पोस्ट बनाने के लिए उचित जैविक सामग्री, नमी और केंचुओं की आवश्यकता होती है।",
      author: "कृषि मित्र",
    },
  ],

  livestock: [
    {
      id: "livestock-1",
      title: "डेयरी पशुओं का पोषण प्रबंधन",
      category: "डेयरी",
      status: "published",
      description: "दूध देने वाले पशुओं के संतुलित आहार और पोषण से जुड़ी जानकारी।",
      content: "पशुओं के आहार में हरा चारा, सूखा चारा, दाना, खनिज मिश्रण और स्वच्छ पानी महत्वपूर्ण हैं।",
      author: "कृषि मित्र",
    },
    {
      id: "livestock-2",
      title: "बकरी पालन की शुरुआती जानकारी",
      category: "बकरी पालन",
      status: "draft",
      description: "छोटे स्तर पर बकरी पालन शुरू करने से पहले जरूरी जानकारी।",
      content: "बकरी पालन में नस्ल, आवास, आहार, स्वास्थ्य और बाजार की योजना महत्वपूर्ण होती है।",
      author: "कृषि मित्र",
    },
  ],

  livestockListings: [
    {
      id: "listing-1",
      animalType: "गाय",
      breed: "Gir",
      age: "3 वर्ष",
      sellerName: "Demo Farmer",
      phone: "9340004380",
      location: "Neemuch",
      price: "65000",
      description: "स्वस्थ गाय, दूध देने वाली।",
      status: "pending",
    },
  ],

  blogCategories: [
    { id: "blog-cat-1", name: "कृषि सलाह", slug: "krishi-salah", status: "active" },
    { id: "blog-cat-2", name: "मंडी भाव", slug: "mandi-bhav", status: "active" },
    { id: "blog-cat-3", name: "फसल जानकारी", slug: "crop-information", status: "active" },
    { id: "blog-cat-4", name: "सरकारी योजनाएं", slug: "government-schemes", status: "active" },
  ],

  blogs: [
    {
      id: "blog-1",
      title: "सोयाबीन की खेती में किसान किन बातों का ध्यान रखें?",
      slug: "soybean-farming-guide",
      category: "फसल जानकारी",
      author: "कृषि मित्र",
      status: "published",
      featured: true,
      summary: "सोयाबीन की बेहतर खेती के लिए जरूरी प्रबंधन जानकारी।",
      content: "सोयाबीन की खेती में उचित बीज, बुवाई समय, खरपतवार प्रबंधन और रोग नियंत्रण महत्वपूर्ण हैं।",
    },
    {
      id: "blog-2",
      title: "मंडी भाव देखते समय किन बातों का ध्यान रखें?",
      slug: "mandi-bhav-guide",
      category: "मंडी भाव",
      author: "कृषि मित्र",
      status: "draft",
      featured: false,
      summary: "मंडी भाव को समझने और तुलना करने की उपयोगी जानकारी।",
      content: "मंडी भाव में फसल, गुणवत्ता, आवक और स्थानीय बाजार की स्थिति के अनुसार अंतर हो सकता है।",
    },
  ],
};

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function storageKey(collection) {
  return `${STORAGE_PREFIX}${collection}`;
}

function makeId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("krishi_mitra_admin_token");
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("krishi_mitra_admin_token");
  localStorage.removeItem("krishi_mitra_admin");
}

function unwrapList(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.items)) return result.data.items;
  if (Array.isArray(result?.results)) return result.results;
  if (Array.isArray(result?.items)) return result.items;
  return [];
}

function unwrapItem(result) {
  if (!result) return null;
  if (result.data && !Array.isArray(result.data)) return result.data;
  return result;
}

function mapCategoryFromApi(category) {
  if (!category) return null;

  return {
    ...category,
    id: category._id || category.id,
    name: category.label || category.name,
  };
}

function mapCategoryToApi(item = {}) {
  const body = { ...item };

  if (body.name !== undefined && body.label === undefined) {
    body.label = body.name;
  }

  delete body.name;
  delete body.id;
  delete body._id;
  delete body.createdAt;
  delete body.updatedAt;

  return body;
}

function mapBlogFromApi(blog) {
  if (!blog) return null;

  return {
    ...blog,
    id: blog._id || blog.id,
    summary: blog.excerpt ?? blog.summary ?? "",
    featured: blog.isFeatured ?? blog.featured ?? false,
    category: blog.category || "",
  };
}

function mapBlogToApi(item = {}) {
  const body = { ...item };

  if (body.summary !== undefined && body.excerpt === undefined) {
    body.excerpt = body.summary;
  }

  if (body.featured !== undefined && body.isFeatured === undefined) {
    body.isFeatured = body.featured;
  }

  delete body.summary;
  delete body.featured;
  delete body.id;
  delete body._id;
  delete body.createdAt;
  delete body.updatedAt;
  delete body.views;
  delete body.likes;

  return body;
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    if (response.status === 401 && token) {
      clearSession();
    }

    throw new Error(
      result.message || `API request failed (${response.status})`
    );
  }

  return result;
}

function encodeId(id) {
  return encodeURIComponent(String(id));
}

// --------------------------------------------------
// Blog API
// Backend routes must match the routes shown below.
// --------------------------------------------------

export const blogApi = {
  async getCategories({ admin = true } = {}) {
    const path = admin ? "/blog-categories/admin" : "/blog-categories";
    const result = await apiRequest(path);
    return unwrapList(result).map(mapCategoryFromApi);
  },

  async getCategory(id) {
    const result = await apiRequest(`/blog-categories/${encodeId(id)}`);
    return mapCategoryFromApi(unwrapItem(result));
  },

  async createCategory(item) {
    const result = await apiRequest("/blog-categories", {
      method: "POST",
      body: JSON.stringify(mapCategoryToApi(item)),
    });

    return mapCategoryFromApi(unwrapItem(result));
  },

  async updateCategory(id, updates) {
    const result = await apiRequest(`/blog-categories/${encodeId(id)}`, {
      method: "PATCH",
      body: JSON.stringify(mapCategoryToApi(updates)),
    });

    return mapCategoryFromApi(unwrapItem(result));
  },

  async deleteCategory(id) {
    return apiRequest(`/blog-categories/${encodeId(id)}`, {
      method: "DELETE",
    });
  },

  async getBlogs(params = {}, { admin = true } = {}) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });

    const path = admin ? "/blogs/admin" : "/blogs";
    const queryString = query.toString();
    const result = await apiRequest(
      `${path}${queryString ? `?${queryString}` : ""}`
    );

    return {
      ...result,
      data: unwrapList(result).map(mapBlogFromApi),
    };
  },

  async getBlog(id) {
    const result = await apiRequest(`/blogs/admin/${encodeId(id)}`);
    return mapBlogFromApi(unwrapItem(result));
  },

  async getBlogBySlug(slug) {
    const result = await apiRequest(`/blogs/slug/${encodeURIComponent(slug)}`);
    return mapBlogFromApi(unwrapItem(result));
  },

  async createBlog(item) {
    const result = await apiRequest("/blogs/admin", {
      method: "POST",
      body: JSON.stringify(mapBlogToApi(item)),
    });

    return mapBlogFromApi(unwrapItem(result));
  },

  async updateBlog(id, updates) {
    const result = await apiRequest(`/blogs/admin/${encodeId(id)}`, {
      method: "PATCH",
      body: JSON.stringify(mapBlogToApi(updates)),
    });

    return mapBlogFromApi(unwrapItem(result));
  },

  async deleteBlog(id) {
    return apiRequest(`/blogs/admin/${encodeId(id)}`, {
      method: "DELETE",
    });
  },

  async updateStatus(id, status) {
    const result = await apiRequest(
      `/blogs/admin/${encodeId(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );

    return mapBlogFromApi(unwrapItem(result));
  },

  async updateFeatured(id, featured) {
    const result = await apiRequest(
      `/blogs/admin/${encodeId(id)}/featured`,
      {
        method: "PATCH",
        body: JSON.stringify({ isFeatured: featured }),
      }
    );

    return mapBlogFromApi(unwrapItem(result));
  },
};

// --------------------------------------------------
// Local storage functions for collections not migrated
// --------------------------------------------------

function getLocalCollection(collection) {
  if (typeof window === "undefined") {
    return DEFAULT_DATA[collection] || [];
  }

  const key = storageKey(collection);
  const stored = localStorage.getItem(key);

  if (stored !== null) {
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return DEFAULT_DATA[collection] || [];
    }
  }

  const initial = DEFAULT_DATA[collection] || [];
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveLocalCollection(collection, data) {
  if (typeof window === "undefined") {
    throw new Error("localStorage browser में ही उपलब्ध है।");
  }

  localStorage.setItem(storageKey(collection), JSON.stringify(data));
}

// This method is intentionally synchronous for legacy local collections.
// Use blogApi.getBlogs() and blogApi.getCategories() for API collections.
export function getCollection(collection) {
  return getLocalCollection(collection);
}

export function createItem(collection, item) {
  if (API_COLLECTIONS.includes(collection)) {
    throw new Error(
      `Use blogApi for "${collection}". API operations are asynchronous.`
    );
  }

  const data = getLocalCollection(collection);

  const newItem = {
    id: item.id || makeId(collection),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item,
  };

  saveLocalCollection(collection, [newItem, ...data]);
  return newItem;
}

export function updateItem(collection, id, updates) {
  if (API_COLLECTIONS.includes(collection)) {
    throw new Error(
      `Use blogApi for "${collection}". API operations are asynchronous.`
    );
  }

  const data = getLocalCollection(collection);

  const updated = data.map((item) =>
    item.id === id
      ? { ...item, ...updates, updatedAt: new Date().toISOString() }
      : item
  );

  saveLocalCollection(collection, updated);
  return updated.find((item) => item.id === id);
}

export function deleteItem(collection, id) {
  if (API_COLLECTIONS.includes(collection)) {
    throw new Error(
      `Use blogApi for "${collection}". API operations are asynchronous.`
    );
  }

  const data = getLocalCollection(collection);
  saveLocalCollection(
    collection,
    data.filter((item) => item.id !== id)
  );
}

export function updateStatus(collection, id, status) {
  if (API_COLLECTIONS.includes(collection)) {
    throw new Error(
      `Use blogApi.updateStatus() for blogs; update categories through blogApi.updateCategory().`
    );
  }

  return updateItem(collection, id, { status });
}

export function getItem(collection, id) {
  if (API_COLLECTIONS.includes(collection)) {
    throw new Error(
      `Use blogApi.getBlog() or blogApi.getCategory() for API collections.`
    );
  }

  return getLocalCollection(collection).find((item) => item.id === id);
}

export function resetAdminDatabase() {
  if (typeof window === "undefined") return;

  Object.keys(DEFAULT_DATA).forEach((collection) => {
    // This resets local demo collections only. It does not delete MongoDB data.
    localStorage.removeItem(storageKey(collection));
  });

  window.location.reload();
}

export { DEFAULT_DATA };

// Only local collections are returned here.
// Blog data must be fetched asynchronously via blogApi.
export function getAdminDB() {
  return {
    crops: getLocalCollection("crops"),
    cropCategories: getLocalCollection("cropCategories"),
    schemes: getLocalCollection("schemes"),
    organic: getLocalCollection("organic"),
    livestock: getLocalCollection("livestock"),
    livestockListings: getLocalCollection("livestockListings"),
  };
}