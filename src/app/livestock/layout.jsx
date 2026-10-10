import SeoPageFrame from "@/components/SeoPageFrame";
import { getStaticPageLabel, getStaticPageSeo } from "@/lib/seo";

const path = "/livestock";
export const metadata = getStaticPageSeo(path);

export default function LivestockLayout({ children }) {
  return (
    <SeoPageFrame pathname={path} label={getStaticPageLabel(path)}>
      {children}
    </SeoPageFrame>
  );
}
