import { getStaticPageSeo } from "@/lib/seo";

const path = "/blog";
export const metadata = getStaticPageSeo(path);

export default function BlogLayout({ children }) {
  return children;
}
