import Link from "next/link";
import HomePageClient from "./HomePageClient";
import { fetchSeoList, serializeJsonLd, absoluteUrl, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600;

/* ---------------------------------------------------------
   SEO-critical content fetched server-side so crawlers
   can see page text, links, and structured data even
   before JavaScript executes on the client.
--------------------------------------------------------- */

async function getHomeContent() {
  try {
    const [blogs, crops, schemes] = await Promise.all([
      fetchSeoList("/blogs?status=published&limit=10").catch(() => []),
      fetchSeoList("/crops?status=published&limit=20").catch(() => []),
      fetchSeoList("/schemes?status=active&limit=10").catch(() => []),
    ]);
    return { blogs, crops, schemes };
  } catch {
    return { blogs: [], crops: [], schemes: [] };
  }
}

function getHomePageJsonLd(blogs, crops) {
  const items = [];

  blogs
    .filter((b) => b.slug && b.title)
    .slice(0, 5)
    .forEach((blog, i) => {
      items.push({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/blog/${encodeURIComponent(blog.slug)}`),
        name: blog.title,
      });
    });

  crops
    .filter((c) => c.slug && c.name)
    .slice(0, 5)
    .forEach((crop, i) => {
      items.push({
        "@type": "ListItem",
        position: items.length + 1,
        url: absoluteUrl(`/crops/${encodeURIComponent(crop.slug)}`),
        name: crop.name,
      });
    });

  if (!items.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "किसान मित्र — लोकप्रिय सामग्री",
    itemListElement: items,
  };
}

export default async function HomePage() {
  const { blogs, crops, schemes } = await getHomeContent();
  const itemListJsonLd = getHomePageJsonLd(blogs, crops);

  const recentBlogs = blogs.filter((b) => b.slug && b.title).slice(0, 6);
  const featuredCrops = crops.filter((c) => c.slug && c.name).slice(0, 8);
  const activeSchemes = schemes.filter((s) => s.slug && (s.name || s.title)).slice(0, 6);

  return (
    <>
      {/* Structured data for homepage content list */}
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemListJsonLd) }}
        />
      )}

      {/* ===================================================
          SEO-visible content for crawlers.
          This renders server-side so Google can read it
          even without executing JavaScript.
      =================================================== */}
      <section className="sr-only" aria-label="किसान मित्र मुख्य जानकारी">
        <h1>किसान मित्र — मध्य प्रदेश के किसानों के लिए कृषि जानकारी</h1>
        <p>
          किसान मित्र मध्य प्रदेश के किसानों को फसल गाइड, ताज़ा मंडी भाव,
          मौसम पूर्वानुमान, सरकारी योजनाएं, जैविक खेती और पशुपालन की
          जानकारी एक ही जगह प्रदान करता है।
        </p>

        {/* Key navigation links for crawlers */}
        <nav aria-label="मुख्य अनुभाग">
          <ul>
            <li><Link href="/crops">फसल गाइड</Link></li>
            <li><Link href="/mandi-bhav">मंडी भाव</Link></li>
            <li><Link href="/weather">मौसम पूर्वानुमान</Link></li>
            <li><Link href="/govt-schemes">सरकारी योजनाएं</Link></li>
            <li><Link href="/pashupalan">पशुपालन</Link></li>
            <li><Link href="/organic-farming">जैविक खेती</Link></li>
            <li><Link href="/blog">कृषि ब्लॉग</Link></li>
            <li><Link href="/agri-tech">कृषि तकनीक</Link></li>
            <li><Link href="/pm-kisan">पीएम-किसान</Link></li>
          </ul>
        </nav>

        {/* Recent blog articles — crawlable links */}
        {recentBlogs.length > 0 && (
          <section aria-label="हालिया लेख">
            <h2>हालिया कृषि लेख</h2>
            <ul>
              {recentBlogs.map((blog) => (
                <li key={blog.slug}>
                  <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                    {blog.title}
                  </Link>
                  {blog.excerpt && <p>{blog.excerpt}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Crop guide links — crawlable */}
        {featuredCrops.length > 0 && (
          <section aria-label="फसल गाइड">
            <h2>फसल की जानकारी</h2>
            <ul>
              {featuredCrops.map((crop) => (
                <li key={crop.slug}>
                  <Link href={`/crops/${encodeURIComponent(crop.slug)}`}>
                    {crop.name}
                    {crop.englishName ? ` (${crop.englishName})` : ""}
                  </Link>
                  {crop.description && <p>{crop.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Government schemes — crawlable */}
        {activeSchemes.length > 0 && (
          <section aria-label="सरकारी योजनाएं">
            <h2>किसानों के लिए सरकारी योजनाएं</h2>
            <ul>
              {activeSchemes.map((scheme) => (
                <li key={scheme.slug}>
                  <Link href={`/govt-schemes/${encodeURIComponent(scheme.slug)}`}>
                    {scheme.name || scheme.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>

      {/* ===================================================
          Interactive client-side homepage
      =================================================== */}
      <HomePageClient />
    </>
  );
}