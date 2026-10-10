import { fetchSeoAll } from "@/lib/seo";

const CONFIG = {
  blog: {
    categoryEndpoint: "/blog-categories?status=active",
    contentEndpoint: "/blogs?status=published",
    categoryPath: "/blog/category",
    itemPath: "/blog",
    contentLabel: "लेख",
  },
  crop: {
    categoryEndpoint: "/crop-categories?status=active",
    contentEndpoint: "/crops?status=published",
    categoryPath: "/crops/category",
    itemPath: "/crops",
    contentLabel: "फसल",
  },
};

function categoryValues(value) {
  if (typeof value === "string" || typeof value === "number") {
    return [String(value).toLocaleLowerCase("hi-IN")];
  }
  if (!value || typeof value !== "object") return [];
  return [value._id, value.id, value.slug, value.name, value.label]
    .filter((item) => item !== undefined && item !== null)
    .flatMap(categoryValues);
}

export function belongsToCategory(record, category) {
  const matches = new Set(categoryValues(category));
  return [
    record?.categoryId,
    record?.category,
    record?.categorySlug,
    record?.categoryName,
  ]
    .flatMap(categoryValues)
    .some((value) => matches.has(value));
}

export async function getCategoryLandingData(kind, slug) {
  const config = CONFIG[kind];
  if (!config) throw new Error(`Unsupported SEO category type: ${kind}`);

  const [categories, records] = await Promise.all([
    fetchSeoAll(config.categoryEndpoint),
    fetchSeoAll(config.contentEndpoint),
  ]);
  const category = categories.find(
    (item) => item.slug === slug && item.status !== "inactive",
  );
  if (!category) return null;

  const items = records.filter(
    (item) => item.slug && belongsToCategory(item, category),
  );
  if (!items.length) return null;

  return { ...config, category, items };
}

export function getCategoryLandingDescription(kind, category) {
  const description =
    typeof category.description === "string" ? category.description.trim() : "";
  if (description) return description;
  const name = category.name || category.label || category.title;
  const contentLabel = CONFIG[kind].contentLabel;
  return `${name} श्रेणी के प्रकाशित ${contentLabel} और मध्य प्रदेश के किसानों के लिए उपयोगी जानकारी पढ़ें।`;
}
