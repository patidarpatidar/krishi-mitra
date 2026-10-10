import SeoPageFrame from "@/components/SeoPageFrame";
import { getStaticPageLabel, getStaticPageSeo } from "@/lib/seo";

const path = "/about";
export const metadata = getStaticPageSeo(path);

export default function AboutLayout({ children }) {
  return (
    <SeoPageFrame pathname={path} label={getStaticPageLabel(path)}>
      {children}
    </SeoPageFrame>
  );
}
