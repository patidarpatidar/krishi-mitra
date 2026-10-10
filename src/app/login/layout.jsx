import { getStaticPageSeo } from "@/lib/seo";

export const metadata = getStaticPageSeo("/login");

export default function LoginLayout({ children }) {
  return children;
}
