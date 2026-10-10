import Link from "next/link";
import { getCategoryLandingDescription } from "@/lib/categoryLanding";
import { getBreadcrumbJsonLd, serializeJsonLd, stripHtml } from "@/lib/seo";

function getDate(record) {
  const value = record.publishedAt || record.date || record.createdAt;
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  return new Intl.DateTimeFormat("hi-IN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default function CategoryLandingPage({ data, kind, pathname }) {
  const { category, items, itemPath } = data;
  const name = category.name || category.label || category.title;
  const description = getCategoryLandingDescription(kind, category);
  const breadcrumbs = [
    { name: "होम", path: "/" },
    { name: kind === "blog" ? "कृषि ब्लॉग" : "फसलें", path: itemPath },
    { name, path: pathname },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(getBreadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <nav
        aria-label="ब्रेडक्रम्ब"
        className="mx-auto w-full max-w-7xl px-4 pt-3 text-xs text-slate-500 sm:px-6 lg:px-8"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((item, index) => (
            <li className="flex items-center gap-2" key={item.path}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === breadcrumbs.length - 1 ? (
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
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-emerald-50 p-6 sm:p-8">
          <p className="text-sm font-bold text-emerald-800">
            {kind === "blog" ? "कृषि ब्लॉग श्रेणी" : "फसल श्रेणी"}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{name}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-700">
            {description}
          </p>
        </header>
        <section aria-label={`${name} की प्रकाशित सामग्री`}>
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">
            {kind === "blog" ? "इस श्रेणी के लेख" : "इस श्रेणी की फसलें"}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const title = item.title || item.name;
              const href = `${itemPath}/${encodeURIComponent(item.slug)}`;
              const excerpt = stripHtml(
                item.excerpt ||
                  item.shortDescription ||
                  item.overview ||
                  item.description ||
                  "",
              );
              const image = item.coverImage || item.image || item.thumbnail;

              return (
                <li
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  key={item._id || item.id || item.slug}
                >
                  <Link href={href} className="block h-full hover:bg-slate-50">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    ) : null}
                    <div className="p-5">
                      {getDate(item) ? (
                        <time
                          className="text-xs text-slate-500"
                          dateTime={item.publishedAt || item.date || item.createdAt}
                        >
                          {getDate(item)}
                        </time>
                      ) : null}
                      <h3 className="mt-2 text-lg font-bold text-slate-900">
                        {title}
                      </h3>
                      {excerpt ? (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {excerpt}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
