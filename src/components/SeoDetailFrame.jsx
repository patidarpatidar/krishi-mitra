import Link from "next/link";
import { getBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";

const sections = {
  blog: { label: "कृषि ब्लॉग", path: "/blog" },
  crop: { label: "फसलें", path: "/crops" },
  scheme: { label: "सरकारी योजनाएं", path: "/govt-schemes" },
  livestock: { label: "पशुपालन", path: "/pashupalan" },
  organic: { label: "जैविक खेती", path: "/organic-farming" },
};

export default function SeoDetailFrame({ children, kind, pathname, label }) {
  const section = sections[kind];
  const items = [
    { name: "होम", path: "/" },
    ...(section ? [{ name: section.label, path: section.path }] : []),
    { name: label, path: pathname },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(getBreadcrumbJsonLd(items)),
        }}
      />
      <nav
        aria-label="ब्रेडक्रम्ब"
        className="mx-auto w-full max-w-7xl px-4 pt-3 text-xs text-slate-500 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, index) => (
            <li className="flex items-center gap-2" key={item.path}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === items.length - 1 ? (
                <span aria-current="page" className="font-semibold text-slate-700">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-emerald-700">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </>
  );
}
