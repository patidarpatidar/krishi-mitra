import SeoPageFrame from "@/components/SeoPageFrame";
import { getStaticPageLabel, getStaticPageSeo } from "@/lib/seo";

const path = "/weather";
export const metadata = getStaticPageSeo(path);

export default function WeatherLayout({ children }) {
  return (
    <SeoPageFrame pathname={path} label={getStaticPageLabel(path)}>
      {children}
    </SeoPageFrame>
  );
}
