import { getStaticPageSeo } from "@/lib/seo";

export const metadata = getStaticPageSeo("/register");

export default function RegisterLayout({ children }) {
  return children;
}
