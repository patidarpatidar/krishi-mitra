import { getStaticPageSeo } from "@/lib/seo";

const path = "/crops";
export const metadata = getStaticPageSeo(path);

export default function CropsLayout({ children }) {
  return children;
}
