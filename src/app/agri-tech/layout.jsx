import SeoPageFrame from "@/components/SeoPageFrame";
import { getStaticPageLabel, getStaticPageSeo } from "@/lib/seo";

const path = "/agri-tech";
export const metadata = getStaticPageSeo(path);

export default function AgriTechLayout({ children }) {
  return (
    <SeoPageFrame pathname={path} label={getStaticPageLabel(path)}>
      {children}
    </SeoPageFrame>
  );
}
