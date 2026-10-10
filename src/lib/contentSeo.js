import {
  absoluteUrl,
  createFaqJsonLd,
  getArticleJsonLd,
  createMetadata,
  getText,
  stripHtml,
} from "@/lib/seo";

function firstText(...values) {
  for (const value of values) {
    const text = stripHtml(value);
    if (text) return text;
  }
  return "";
}

function buildDescription(record, seo) {
  const source = firstText(
    seo.metaDescription,
    record.excerpt,
    record.shortDescription,
    record.subtitle,
    record.overview,
    record.intro,
    record.description,
    record.summary,
    record.name,
    record.title,
  );

  if (source.length <= 160) return source;
  const shortened = source.slice(0, 157).replace(/\s+\S*$/, "");
  return `${shortened}…`;
}

export function getRecordSeo(record, kind, pathname) {
  const seo =
    record?.seo && typeof record.seo === "object"
      ? record.seo
      : {
          metaTitle: record?.metaTitle,
          metaDescription: record?.metaDescription,
          keywords: record?.keywords,
          canonicalUrl: record?.canonicalUrl,
          allowIndex: record?.allowIndex,
          allowFollow: record?.allowFollow,
        };
  const name = firstText(record?.name, record?.title, record?.shortName);
  const title = firstText(seo.metaTitle, name);
  const description = buildDescription(record || {}, seo);
  const image =
    seo.ogImage ||
    record?.coverImage ||
    record?.heroImage ||
    record?.image ||
    record?.thumbnail ||
    "";
  const allowIndex = seo.allowIndex !== false && seo.noindex !== true;
  const allowFollow = seo.allowFollow !== false;

  const metadata = createMetadata({
    title: title || "कृषि जानकारी",
    description: description || "कृषि मित्र पर किसान उपयोगी जानकारी पढ़ें।",
    path: pathname,
    canonicalUrl: seo.canonicalUrl,
    image,
    keywords: seo.keywords || record?.keywords,
    noindex: !allowIndex,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    twitterTitle: seo.twitterTitle,
    twitterDescription: seo.twitterDescription,
    twitterImage: seo.twitterImage,
    type: kind === "blog" ? "article" : "website",
  });
  if (!allowFollow) {
    metadata.robots = { ...metadata.robots, follow: false };
  }

  return {
    title,
    description,
    image,
    keywords: seo.keywords || record?.keywords,
    canonicalUrl: seo.canonicalUrl,
    metadata,
    robots: { index: allowIndex, follow: allowFollow },
  };
}

export function getRecordJsonLd(record, kind, pathname) {
  const recordSeo = getRecordSeo(record, kind, pathname);
  const title = recordSeo.title || firstText(record?.title, record?.name);
  const description = recordSeo.description;
  const image = recordSeo.image;
  const category = getText(record?.category || record?.categoryId);
  const author = getText(record?.author?.name || record?.author);
  const url = absoluteUrl(pathname);

  const article = getArticleJsonLd({
    title,
    description,
    url,
    image: image ? absoluteUrl(image) || image : undefined,
    author,
    publishedAt: record?.publishedAt || record?.date || record?.createdAt,
    updatedAt:
      record?.updatedAtContent || record?.updatedAt || record?.modifiedAt,
    category,
    about:
      kind === "crop"
        ? firstText(record?.name, record?.englishName, "फसल की खेती")
        : kind === "livestock"
          ? "पशुपालन"
          : kind === "scheme"
            ? "किसानों के लिए सरकारी योजना"
            : kind === "organic"
              ? "जैविक खेती"
              : undefined,
  });

  const faq = createFaqJsonLd(record?.faqs);
  return [article, faq].filter(Boolean);
}

export function normalizeBlogRecord(record) {
  const dateValue = record?.date || record?.publishedAt;
  return {
    ...record,
    dateLabel: dateValue
      ? new Intl.DateTimeFormat("hi-IN", { dateStyle: "medium" }).format(
          new Date(dateValue),
        )
      : "",
  };
}

export function normalizeCropRecord(record) {
  const emptyCrop = {
    slug: "",
    name: "",
    englishName: "",
    scientificName: "",
    category: "",
    season: "",
    icon: "",
    overview: "",
    author: "",
    publishedAt: "",
    updatedAt: "",
    readTime: "",
    views: 0,
    likes: 0,
    tags: [],
    varieties: [],
    soilRequirement: "",
    sowingTime: "",
    waterRequirement: "",
    seedRate: "",
    harvestingTime: "",
    topDemandMandi: "",
    diseases: [],
    mandiPrice: {
      min: 0,
      max: 0,
      modal: 0,
      previousModal: 0,
      unit: "क्विंटल",
      mandiName: "",
    },
    priceHistory: [],
  };
  const displayValue = (value) =>
    typeof value === "string" ? value : value?.label || value?.name || "";

  return {
    ...emptyCrop,
    ...record,
    category: displayValue(record?.category),
    season: displayValue(record?.season),
    publishedAt: record?.publishedAt || "",
    updatedAt: record?.updatedAtContent || record?.updatedAt || "",
    soilRequirement: record?.soilRequirement || record?.idealSoil || "",
    waterRequirement:
      record?.waterRequirement || displayValue(record?.water),
    tags: Array.isArray(record?.tags) ? record.tags : [],
    varieties: Array.isArray(record?.varieties) ? record.varieties : [],
    diseases: Array.isArray(record?.diseases) ? record.diseases : [],
    views: Number(record?.views) || 0,
    likes: Number(record?.likes) || 0,
    mandiPrice: { ...emptyCrop.mandiPrice, ...(record?.mandiPrice || {}) },
    priceHistory: Array.isArray(record?.priceHistory)
      ? record.priceHistory
      : [],
  };
}

export function normalizeLivestockRecord(record) {
  const category =
    typeof record?.category === "string"
      ? record.category
      : record?.category?.label || record?.category?.name || "";
  const facts = Array.isArray(record?.facts)
    ? record.facts
        .map((fact) =>
          Array.isArray(fact)
            ? [String(fact[0] || ""), String(fact[1] || "")]
            : [String(fact.label || fact.key || ""), String(fact.value || "")],
        )
        .filter(([label, value]) => label || value)
    : [];
  const sections = Array.isArray(record?.sections)
    ? record.sections.map((section) => ({
        ...section,
        points: Array.isArray(section.points) ? section.points : [],
      }))
    : [];

  return {
    ...record,
    category,
    title: record?.title || "",
    subtitle: record?.subtitle || "",
    intro: record?.intro || "",
    image: record?.image || "",
    facts,
    sections,
    faqs: Array.isArray(record?.faqs) ? record.faqs : [],
    readTime: record?.readTime || "",
    updated:
      record?.updatedLabel || record?.updatedAtContent || record?.updatedAt || "",
  };
}
