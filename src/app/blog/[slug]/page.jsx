import { notFound } from "next/navigation";
import SeoDetailFrame from "@/components/SeoDetailFrame";
import BlogDetailClient from "./BlogDetailClient";
import { getRecordJsonLd, getRecordSeo } from "@/lib/contentSeo";
import { fetchSeoRecord, serializeJsonLd } from "@/lib/seo";

export const revalidate = 3600;

async function getBlog(slug) {
  return fetchSeoRecord(`/blogs/slug/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) return { robots: { index: false, follow: false } };
  return getRecordSeo(blog, "blog", `/blog/${blog.slug || params.slug}`).metadata;
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlog(params.slug);
  if (!blog) notFound();

  const pathname = `/blog/${blog.slug || params.slug}`;
  const { title } = getRecordSeo(blog, "blog", pathname);
  const structuredData = getRecordJsonLd(blog, "blog", pathname);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={`${schema["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <SeoDetailFrame kind="blog" pathname={pathname} label={title || blog.title}>
        <BlogDetailClient params={params} initialRecord={blog} />
      </SeoDetailFrame>
    </>
  );
}
