import { notFound } from "next/navigation";
import SeoDetailFrame from "@/components/SeoDetailFrame";
import LivestockDetailClient from "./LivestockDetailClient";
import { getRecordJsonLd, getRecordSeo, normalizeLivestockRecord } from "@/lib/contentSeo";
import { fetchSeoRecord, serializeJsonLd } from "@/lib/seo";

export const revalidate = 3600;

async function getLivestock(slug) {
  return fetchSeoRecord(`/livestock/slug/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }) {
  const article = await getLivestock(params.slug);
  if (!article) return { robots: { index: false, follow: false } };
  return getRecordSeo(
    article,
    "livestock",
    `/pashupalan/${article.slug || params.slug}`,
  ).metadata;
}

export default async function LivestockDetailPage({ params }) {
  const article = await getLivestock(params.slug);
  if (!article) notFound();

  const pathname = `/pashupalan/${article.slug || params.slug}`;
  const normalizedArticle = normalizeLivestockRecord(article);
  const { title } = getRecordSeo(article, "livestock", pathname);
  const structuredData = getRecordJsonLd(article, "livestock", pathname);

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
        kind="livestock"
        pathname={pathname}
        label={title || normalizedArticle.title}
      >
        <LivestockDetailClient params={params} initialRecord={article} />
      </SeoDetailFrame>
    </>
  );
}
