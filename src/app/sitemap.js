import { belongsToCategory } from "@/lib/categoryLanding";
import { fetchSeoAll, SITE_ORIGIN } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/crops",
  "/govt-schemes",
  "/pashupalan",
  "/livestock",
  "/organic-farming",
  "/agri-tech",
  "/pm-kisan",
  "/mandi-bhav",
  "/weather",
];

function sitemapEntry(path, lastModified) {
  const date = lastModified ? new Date(lastModified) : null;
  return {
    url: new URL(path, `${SITE_ORIGIN}/`).toString(),
    ...(date && !Number.isNaN(date.getTime())
      ? { lastModified: date }
      : {}),
  };
}

function isIndexable(record) {
  const seo =
    record?.seo && typeof record.seo === "object"
      ? record.seo
      : record;
  return seo?.allowIndex !== false && seo?.noindex !== true;
}

function addContentEntries(entries, records, route) {
  for (const record of records) {
    if (!record.slug || !isIndexable(record)) continue;
    entries.push(
      sitemapEntry(
        `${route}/${encodeURIComponent(record.slug)}`,
        record.updatedAtContent ||
          record.updatedAt ||
          record.publishedAt ||
          record.date,
      ),
    );
  }
}

export default async function sitemap() {
  if (!SITE_ORIGIN) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL or VERCEL_URL must be configured to generate sitemap.xml.",
    );
  }

  const [
    blogs,
    blogCategories,
    crops,
    cropCategories,
    schemes,
    livestock,
  ] = await Promise.all([
    fetchSeoAll("/blogs?status=published"),
    fetchSeoAll("/blog-categories?status=active"),
    fetchSeoAll("/crops?status=published"),
    fetchSeoAll("/crop-categories?status=active"),
    fetchSeoAll("/schemes?status=active"),
    fetchSeoAll("/livestock?status=published"),
  ]);

  const entries = STATIC_PATHS.map((path) => sitemapEntry(path));
  addContentEntries(entries, blogs, "/blog");
  addContentEntries(entries, crops, "/crops");
  addContentEntries(entries, schemes, "/govt-schemes");
  addContentEntries(entries, livestock, "/pashupalan");

  for (const category of blogCategories) {
    if (
      category.slug &&
      blogs.some((blog) => belongsToCategory(blog, category))
    ) {
      entries.push(
        sitemapEntry(
          `/blog/category/${encodeURIComponent(category.slug)}`,
          category.updatedAt || category.updatedAtContent,
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
        ),
      );
    }
  }

  return entries;
}
