const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const siteOriginValue =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

export const SITE_NAME = "कृषि मित्र";
export const SITE_ORIGIN = normalizeOrigin(siteOriginValue);

const STATIC_PAGE_SEO = {
  "/about": {
    title: "कृषि मित्र के बारे में",
    description:
      "कृषि मित्र के उद्देश्य, किसान-केंद्रित कृषि जानकारी और मंडी, फसल, मौसम व योजनाओं से जुड़ी सेवाओं के बारे में जानें।",
    label: "हमारे बारे में",
  },
  "/blog": {
    title: "कृषि ब्लॉग और खेती के लेख",
    description:
      "मध्य प्रदेश के किसानों के लिए फसल उत्पादन, कृषि तकनीक और खेती के व्यावहारिक सुझावों पर प्रकाशित लेख पढ़ें।",
    label: "कृषि ब्लॉग",
  },
  "/crops": {
    title: "फसल गाइड और खेती की जानकारी",
    description:
      "फसलवार बुवाई, मिट्टी, पानी, किस्मों, रोगों और मंडी से जुड़ी प्रकाशित कृषि जानकारी देखें।",
    label: "फसलें",
  },
  "/govt-schemes": {
    title: "किसानों के लिए सरकारी योजनाएं",
    description:
      "किसानों के लिए उपलब्ध योजनाओं, पात्रता, लाभ और आवेदन से जुड़ी प्रकाशित जानकारी पढ़ें।",
    label: "सरकारी योजनाएं",
  },
  "/pashupalan": {
    title: "पशुपालन और डेयरी गाइड",
    description:
      "पशुपालन, डेयरी प्रबंधन, पशु स्वास्थ्य और चारे पर प्रकाशित किसान उपयोगी लेख पढ़ें।",
    label: "पशुपालन",
  },
  "/contact": {
    title: "कृषि मित्र से संपर्क करें",
    description:
      "कृषि जानकारी, मंडी भाव, फसल और वेबसाइट से जुड़े प्रश्न या सुझाव कृषि मित्र तक भेजें।",
    label: "संपर्क करें",
  },
  "/livestock": {
    title: "पशुपालन और डेयरी जानकारी",
    description:
      "पशु स्वास्थ्य, डेयरी प्रबंधन, चारा और पशुपालन से जुड़ी किसान उपयोगी जानकारी पढ़ें।",
    label: "पशुपालन",
  },
  "/mandi-bhav": {
    title: "मध्य प्रदेश मंडी भाव",
    description:
      "उपलब्ध बाजार डेटा में फसल, राज्य, जिला और मंडी के अनुसार न्यूनतम, अधिकतम और मॉडल भाव देखें।",
    label: "मंडी भाव",
  },
  "/weather": {
    title: "मध्य प्रदेश कृषि मौसम पूर्वानुमान",
    description:
      "मध्य प्रदेश के शहरों और जिलों का वर्तमान मौसम, वर्षा संभावना और पूर्वानुमान देखें।",
    label: "मौसम",
  },
  "/organic-farming": {
    title: "जैविक और प्राकृतिक खेती",
    description:
      "जैविक खेती, प्राकृतिक कृषि इनपुट और खेत में उपयोग की विधियों से जुड़ी प्रकाशित जानकारी पढ़ें।",
    label: "जैविक खेती",
  },
  "/agri-tech": {
    title: "कृषि तकनीक और खेती के डिजिटल उपकरण",
    description:
      "खेती में तकनीक, कृषि उपकरण और उपयोगी डिजिटल साधनों से जुड़ी जानकारी देखें।",
    label: "कृषि तकनीक",
  },
  "/pm-kisan": {
    title: "पीएम-किसान योजना की जानकारी",
    description:
      "पीएम-किसान सम्मान निधि से जुड़ी जानकारी और आधिकारिक स्रोत पर विवरण जांचने के तरीके देखें।",
    label: "पीएम-किसान",
  },
  "/privacy-policy": {
    title: "गोपनीयता नीति",
    description:
      "कृषि मित्र वेबसाइट पर जानकारी के उपयोग और गोपनीयता से जुड़ी नीति पढ़ें।",
    label: "गोपनीयता नीति",
  },
  "/terms": {
    title: "नियम और शर्तें",
    description:
      "कृषि मित्र वेबसाइट की जानकारी और सेवाओं के उपयोग से जुड़े नियम पढ़ें।",
    label: "नियम और शर्तें",
  },
  "/login": {
    title: "किसान लॉगिन",
    description: "कृषि मित्र किसान पोर्टल में सुरक्षित रूप से लॉगिन करें।",
    label: "किसान लॉगिन",
    noindex: true,
  },
  "/register": {
    title: "किसान पंजीकरण",
    description: "कृषि मित्र किसान पोर्टल के लिए किसान प्रोफाइल बनाएं।",
    label: "किसान पंजीकरण",
    noindex: true,
  },
};

function normalizeOrigin(value) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return "";
  }
}

export function absoluteUrl(path = "/") {
  if (!SITE_ORIGIN) return undefined;

  try {
    return new URL(path, `${SITE_ORIGIN}/`).toString();
  } catch {
    return undefined;
  }
}

export function safeCanonicalUrl(value, fallbackPath) {
  if (value && SITE_ORIGIN) {
    try {
      const candidate = new URL(value, `${SITE_ORIGIN}/`);
      if (candidate.origin === SITE_ORIGIN) {
        candidate.search = "";
        candidate.hash = "";
        return candidate.toString();
      }
    } catch {
      // Use the route canonical when API metadata is invalid.
    }
  }

  return absoluteUrl(fallbackPath);
}

export function createMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  canonicalUrl,
  keywords,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) {
  const canonical = safeCanonicalUrl(canonicalUrl, path);
  const imageUrl = image ? safeImageUrl(image) : undefined;
  const openGraphTitle = ogTitle || title;
  const openGraphDescription = ogDescription || description;
  const twitterImageUrl = twitterImage ? safeImageUrl(twitterImage) : imageUrl;
  const robots = noindex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      };

  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.filter(Boolean) : undefined,
    alternates: canonical ? { canonical } : undefined,
    robots,
    openGraph: {
      type,
      locale: "hi_IN",
      siteName: SITE_NAME,
      title: openGraphTitle,
      description: openGraphDescription,
      url: canonical,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: twitterTitle || title,
      description: twitterDescription || description,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
  };
}

export function getStaticPageSeo(path) {
  const page = STATIC_PAGE_SEO[path];
  if (!page) return {};

  return createMetadata({
    title: page.title,
    description: page.description,
    path,
    noindex: page.noindex,
  });
}

export function getStaticPageLabel(path) {
  return STATIC_PAGE_SEO[path]?.label || "";
}

export function createFaqJsonLd(faqs) {
  const questions = (Array.isArray(faqs) ? faqs : [])
    .map((faq) => ({
      question: stripHtml(faq.question || faq.title || faq.q),
      answer: stripHtml(faq.answer || faq.content || faq.a),
    }))
    .filter((faq) => faq.question && faq.answer);

  if (!questions.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function safeImageUrl(value) {
  if (!value) return undefined;
  try {
    return new URL(value, SITE_ORIGIN || undefined).toString();
  } catch {
    return undefined;
  }
}

export function getText(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map(getText).filter(Boolean).join(", ");
  }
  if (value && typeof value === "object") {
    return getText(value.label || value.name || value.title || value.key || value.slug);
  }
  return "";
}

export function stripHtml(value) {
  return getText(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchSeoRecord(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`SEO content request failed (${response.status}): ${endpoint}`);
  }

  const result = await response.json();
  if (result?.success === false) {
    throw new Error(result.message || `SEO content request failed: ${endpoint}`);
  }

  return unwrapApiItem(result);
}

export async function fetchSeoList(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`SEO content request failed (${response.status}): ${endpoint}`);
  }

  const result = await response.json();
  if (result?.success === false) {
    throw new Error(result.message || `SEO content request failed: ${endpoint}`);
  }

  return unwrapApiList(result);
}

export async function fetchSeoAll(endpoint, limit = 100) {
  const allItems = [];

  for (let page = 1; page <= 100; page += 1) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const pageItems = await fetchSeoList(
      `${endpoint}${separator}limit=${limit}&page=${page}`,
    );
    allItems.push(...pageItems);
    if (pageItems.length < limit) break;
  }

  return allItems;
}

export function unwrapApiItem(result, keys = []) {
  let value = result;
  const wrappers = [...keys, "data", "item", "record", "crop", "scheme", "blog", "article"];

  for (let depth = 0; depth < 5; depth += 1) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const key = wrappers.find(
      (candidate) =>
        value[candidate] &&
        typeof value[candidate] === "object" &&
        !Array.isArray(value[candidate]),
    );
    if (!key) return value;
    value = value[key];
  }

  return null;
}

export function unwrapApiList(result, keys = []) {
  let value = result;
  const wrappers = [
    ...keys,
    "data",
    "results",
    "items",
    "blogs",
    "crops",
    "schemes",
    "articles",
    "livestock",
    "categories",
  ];

  for (let depth = 0; depth < 5; depth += 1) {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    const key = wrappers.find(
      (candidate) =>
        Array.isArray(value[candidate]) ||
        (value[candidate] &&
          typeof value[candidate] === "object" &&
          !Array.isArray(value[candidate])),
    );
    if (!key) return [];
    value = value[key];
  }

  return [];
}

export function serializeJsonLd(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function getOrganizationJsonLd() {
  const url = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE_NAME,
    url,
    logo: absoluteUrl("/logo.png"),
    areaServed: { "@type": "AdministrativeArea", name: "Madhya Pradesh, India" },
    knowsLanguage: ["hi-IN", "en-IN"],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: "hi-IN",
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function getArticleJsonLd({
  title,
  description,
  url,
  image,
  author,
  publishedAt,
  updatedAt,
  category,
  about,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    image: image ? [image] : undefined,
    inLanguage: "hi-IN",
    author: author
      ? { "@type": "Person", name: author }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || publishedAt || undefined,
    articleSection: category || undefined,
    about: about ? { "@type": "Thing", name: about } : undefined,
  };
}

export function getBreadcrumbItems(pathname, leafLabel) {
  const sections = {
    "/blog": "कृषि ब्लॉग",
    "/crops": "फसलें",
    "/govt-schemes": "सरकारी योजनाएं",
    "/pashupalan": "पशुपालन",
    "/organic-farming": "जैविक खेती",
  };
  const section = pathname.split("/").slice(0, 2).join("/");
  const sectionName = sections[section];
  return [
    { name: "होम", path: "/" },
    ...(sectionName ? [{ name: sectionName, path: section }] : []),
    ...(leafLabel ? [{ name: leafLabel, path: pathname }] : []),
  ];
}

export function toSlug(value) {
  return String(value || "").trim();
}
