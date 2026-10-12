import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "खोज परिणाम",
  description: "किसान मित्र पर फसल, ब्लॉग और सरकारी योजनाओं से जुड़ी जानकारी खोजें।",
  path: "/search",
  noindex: true,
});

export default function SearchLayout({ children }) {
  return children;
}
