import { belongsToCategory } from "@/lib/categoryLanding";
import { fetchSeoAll, SITE_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/crops", priority: 0.9, changeFrequency: "weekly" },
  { path: "/govt-schemes", priority: 0.8, changeFrequency: "weekly" },
  { path: "/pashupalan", priority: 0.7, changeFrequency: "weekly" },
  { path: "/livestock", priority: 0.7, changeFrequency: "weekly" },
  { path: "/organic-farming", priority: 0.7, changeFrequency: "weekly" },
  { path: "/agri-tech", priority: 0.6, changeFrequency: "monthly" },
  { path: "/pm-kisan", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mandi-bhav", priority: 0.9, changeFrequency: "daily" },
  { path: "/weather", priority: 0.8, changeFrequency: "daily" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

function sitemapEntry(path, lastModified, priority, changeFrequency) {
  const date = lastModified ? new Date(lastModified) : null;
  return {
    url: new URL(path, `${SITE_ORIGIN}/`).toString(),
    ...(date && !Number.isNaN(date.getTime())
      ? { lastModified: date }
      : {}),
    ...(priority != null ? { priority } : {}),
    ...(changeFrequency ? { changeFrequency } : {}),
  };
}

function isIndexable(record) {
  const seo =
    record?.seo && typeof record.seo === "object"
      ? record.seo
      : record;
  return seo?.allowIndex !== false && seo?.noindex !== true;
}

function addContentEntries(entries, records, route, priority = 0.6, changeFrequency = "weekly") {
  for (const record of records) {
    if (!record.slug || !isIndexable(record)) continue;
    entries.push(
      sitemapEntry(
        `${route}/${encodeURIComponent(record.slug)}`,
        record.updatedAtContent ||
          record.updatedAt ||
          record.publishedAt ||
          record.date,
        priority,
        changeFrequency,
      ),
    );
  }
}

export default async function sitemap() {
  if (!SITE_ORIGIN) {
    console.error(
      "Sitemap origin missing. Configure NEXT_PUBLIC_SITE_URL or VERCEL_URL in production.",
    );
    return [];
  }

  const [
    blogs,
    blogCategories,
    crops,
    cropCategories,
    schemes,
    livestock,
  ] = await Promise.all([
    fetchSeoAll("/blogs?status=published").catch(() => []),
    fetchSeoAll("/blog-categories?status=active").catch(() => []),
    fetchSeoAll("/crops?status=published").catch(() => []),
    fetchSeoAll("/crop-categories?status=active").catch(() => []),
    fetchSeoAll("/schemes?status=active").catch(() => []),
    fetchSeoAll("/livestock?status=published").catch(() => []),
  ]);

  const entries = STATIC_PATHS.map((item) =>
    sitemapEntry(item.path, undefined, item.priority, item.changeFrequency),
  );

  addContentEntries(entries, blogs, "/blog", 0.7, "weekly");
  addContentEntries(entries, crops, "/crops", 0.7, "monthly");
  addContentEntries(entries, schemes, "/govt-schemes", 0.6, "monthly");
  addContentEntries(entries, livestock, "/pashupalan", 0.6, "monthly");

  for (const category of blogCategories) {
    if (
      category.slug &&
      blogs.some((blog) => belongsToCategory(blog, category))
    ) {
      entries.push(
        sitemapEntry(
          `/blog/category/${encodeURIComponent(category.slug)}`,
          category.updatedAt || category.updatedAtContent,
          0.5,
          "weekly",
        ),
      );
    }
  }
  for (const category of cropCategories) {
    if (
      category.slug &&
      crops.some((crop) => belongsToCategory(crop, category))
    ) {
      entries.push(
        sitemapEntry(
          `/crops/category/${encodeURIComponent(category.slug)}`,
          category.updatedAt || category.updatedAtContent,
          0.5,
          "weekly",
        ),
      );
    }
  }

  return entries;
}
