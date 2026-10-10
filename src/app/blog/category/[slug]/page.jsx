import { notFound } from "next/navigation";
import CategoryLandingPage from "@/components/CategoryLandingPage";
import { getCategoryLandingData, getCategoryLandingDescription } from "@/lib/categoryLanding";
import { createMetadata } from "@/lib/seo";

export const revalidate = 3600;

async function getData(slug) {
  return getCategoryLandingData("blog", slug);
}

export async function generateMetadata({ params }) {
  const data = await getData(params.slug);
  if (!data) return { robots: { index: false, follow: false } };
  const name =
    data.category.name || data.category.label || data.category.title;
  return createMetadata({
    title: `${name} के कृषि लेख`,
    description: getCategoryLandingDescription("blog", data.category),
    path: `${data.categoryPath}/${encodeURIComponent(params.slug)}`,
    keywords: [name, "कृषि लेख", "किसान जानकारी"],
  });
}

export default async function BlogCategoryPage({ params }) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const pathname = `${data.categoryPath}/${encodeURIComponent(params.slug)}`;
  return (
    <CategoryLandingPage data={data} kind="blog" pathname={pathname} />
  );
}
