import SeoPageFrame from "@/components/SeoPageFrame";
import { getStaticPageLabel, getStaticPageSeo } from "@/lib/seo";

const path = "/pm-kisan";
export const metadata = getStaticPageSeo(path);

export default function PmKisanLayout({ children }) {
  return (
    <SeoPageFrame pathname={path} label={getStaticPageLabel(path)}>
      {children}
    </SeoPageFrame>
  );
}
