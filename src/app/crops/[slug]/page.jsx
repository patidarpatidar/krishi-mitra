import { notFound } from "next/navigation";
import SeoDetailFrame from "@/components/SeoDetailFrame";
import CropDetailClient from "./CropDetailClient";
import { getRecordJsonLd, getRecordSeo, normalizeCropRecord } from "@/lib/contentSeo";
import { fetchSeoRecord, serializeJsonLd } from "@/lib/seo";

export const revalidate = 3600;

async function getCrop(slug) {
  return fetchSeoRecord(`/crops/slug/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }) {
  const crop = await getCrop(params.slug);
  if (!crop) return { robots: { index: false, follow: false } };
  return getRecordSeo(crop, "crop", `/crops/${crop.slug || params.slug}`).metadata;
}

export default async function CropDetailPage({ params }) {
  const crop = await getCrop(params.slug);
  if (!crop) notFound();

  const pathname = `/crops/${crop.slug || params.slug}`;
  const normalizedCrop = normalizeCropRecord(crop);
  const { title } = getRecordSeo(crop, "crop", pathname);
  const structuredData = getRecordJsonLd(crop, "crop", pathname);

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
        kind="crop"
        pathname={pathname}
        label={title || normalizedCrop.name}
      >
        <CropDetailClient params={params} initialRecord={crop} />
      </SeoDetailFrame>
    </>
  );
}
