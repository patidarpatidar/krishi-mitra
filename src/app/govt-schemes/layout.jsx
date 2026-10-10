import { getStaticPageSeo } from "@/lib/seo";

const path = "/govt-schemes";
export const metadata = getStaticPageSeo(path);

export default function SchemesLayout({ children }) {
  return children;
}
