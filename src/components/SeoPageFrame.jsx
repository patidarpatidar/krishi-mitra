import Link from "next/link";
import {
  getBreadcrumbJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

export default function SeoPageFrame({ children, pathname, label }) {
  const breadcrumbs = [
    { name: "होम", path: "/" },
    { name: label, path: pathname },
  ];
  const breadcrumbSchema = getBreadcrumbJsonLd(breadcrumbs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <nav
        aria-label="ब्रेडक्रम्ब"
        className="mx-auto w-full max-w-7xl px-4 pt-3 text-xs text-slate-500 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-emerald-700">
              होम
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-700">
            {label}
          </li>
        </ol>
      </nav>
      {children}
    </>
  );
}
