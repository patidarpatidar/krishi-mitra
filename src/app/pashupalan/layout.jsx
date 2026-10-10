import { getStaticPageSeo } from "@/lib/seo";

const path = "/pashupalan";
export const metadata = getStaticPageSeo(path);

export default function LivestockLayout({ children }) {
  return children;
}
