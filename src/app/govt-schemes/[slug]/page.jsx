import { notFound } from "next/navigation";
import SeoDetailFrame from "@/components/SeoDetailFrame";
import SchemeDetailClient from "./SchemeDetailClient";
import { getRecordJsonLd, getRecordSeo } from "@/lib/contentSeo";
import { fetchSeoRecord, serializeJsonLd } from "@/lib/seo";

export const revalidate = 3600;

async function getScheme(slug) {
  return fetchSeoRecord(`/schemes/slug/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }) {
  const scheme = await getScheme(params.slug);
  if (!scheme) return { robots: { index: false, follow: false } };
  return getRecordSeo(
    scheme,
    "scheme",
    `/govt-schemes/${scheme.slug || params.slug}`,
  ).metadata;
}

export default async function SchemeDetailPage({ params }) {
  const scheme = await getScheme(params.slug);
  if (!scheme) notFound();

  const pathname = `/govt-schemes/${scheme.slug || params.slug}`;
  const { title } = getRecordSeo(scheme, "scheme", pathname);
  const structuredData = getRecordJsonLd(scheme, "scheme", pathname);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={`${schema["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      ))}
      <SeoDetailFrame
        kind="scheme"
        pathname={pathname}
        label={title || scheme.name || scheme.title}
      >
        <SchemeDetailClient params={params} initialRecord={scheme} />
      </SeoDetailFrame>
    </>
  );
}
