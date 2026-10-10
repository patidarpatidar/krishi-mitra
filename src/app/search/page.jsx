'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Search,
  Sprout,
  Landmark,
  X,
} from 'lucide-react';

import { publicApiRequest, unwrapApiList } from '@/lib/publicApi';

export const dynamic = 'force-dynamic';

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function getDisplayLabel(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';

  return value.label || value.name || value.title || value.key || value.slug || '';
}

function getItemText(item) {
  return [
    item?.title,
    item?.name,
    item?.nameHi,
    item?.nameEn,
    item?.description,
    item?.excerpt,
    item?.summary,
    item?.category,
    item?.categoryLabel,
    item?.tags,
  ]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean)
    .join(' ');
}

function SearchPageContent() {
  const params = useSearchParams();
  const initialQuery = params.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState({ crops: [], schemes: [], blogs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      publicApiRequest('/crops?status=published&limit=100'),
      publicApiRequest('/schemes?status=active&limit=100'),
      publicApiRequest('/blogs?limit=100'),
    ])
      .then(([cropResult, schemeResult, blogResult]) => {
        if (cancelled) return;

        const crops = unwrapApiList(cropResult).map((crop) => ({
          id: crop._id || crop.slug || crop.name,
          title: crop.name || crop.title || crop.nameEn || 'फसल',
          description: crop.description || crop.summary || '',
          category: getDisplayLabel(crop.categoryLabel) || getDisplayLabel(crop.category) || 'फसल',
          href: crop.slug ? `/crops/${encodeURIComponent(crop.slug)}` : '/crops',
          kind: 'फसल',
        }));

        const schemes = unwrapApiList(schemeResult).map((scheme) => ({
          id: scheme._id || scheme.slug || scheme.title,
          title: scheme.title || scheme.name || 'योजना',
          description: scheme.summary || scheme.description || '',
          category: getDisplayLabel(scheme.category) || getDisplayLabel(scheme.department) || 'सरकारी योजना',
          href: scheme.slug ? `/govt-schemes/${encodeURIComponent(scheme.slug)}` : '/govt-schemes',
          kind: 'योजना',
        }));

        const blogs = unwrapApiList(blogResult).map((blog) => ({
          id: blog._id || blog.slug || blog.title,
          title: blog.title || 'कृषि लेख',
          description: blog.excerpt || blog.summary || blog.description || '',
          category: getDisplayLabel(blog.category) || getDisplayLabel(blog.categoryLabel) || 'कृषि ब्लॉग',
          href: blog.slug ? `/blog/${encodeURIComponent(blog.slug)}` : '/blog',
          kind: 'ब्लॉग',
        }));

        setResults({ crops, schemes, blogs });
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError?.message || 'खोज परिणाम लोड नहीं हो सके।');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const search = normalizeText(query);

    const aggregate = [
      ...results.crops.map((item) => ({ ...item, section: 'फसलें' })),
      ...results.schemes.map((item) => ({ ...item, section: 'योजनाएं' })),
      ...results.blogs.map((item) => ({ ...item, section: 'ब्लॉग' })),
    ];

    if (!search) {
      return { total: aggregate.slice(0, 12), crops: results.crops.slice(0, 4), schemes: results.schemes.slice(0, 4), blogs: results.blogs.slice(0, 4) };
    }

    const matches = aggregate.filter((item) => {
      const haystack = normalizeText(getItemText(item));
      return haystack.includes(search);
    });

    return {
      total: matches,
      crops: matches.filter((item) => item.section === 'फसलें').slice(0, 6),
      schemes: matches.filter((item) => item.section === 'योजनाएं').slice(0, 6),
      blogs: matches.filter((item) => item.section === 'ब्लॉग').slice(0, 6),
    };
  }, [query, results]);

  const sections = [
    { key: 'crops', label: 'फसलें', items: filtered.crops },
    { key: 'schemes', label: 'सरकारी योजनाएं', items: filtered.schemes },
    { key: 'blogs', label: 'कृषि ब्लॉग', items: filtered.blogs },
  ].filter((section) => section.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-r from-emerald-900 via-green-800 to-teal-700 p-6 text-white shadow-xl sm:p-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10">
            <Search className="h-3.5 w-3.5" />
            साइट खोज
          </div>

          <h1 className="text-3xl font-black sm:text-4xl">कृषि जानकारी खोजें</h1>
          <p className="mt-3 max-w-2xl text-sm text-emerald-50 sm:text-base">
            फसलें, योजनाएं और कृषि लेख एक ही जगह से खोजें।
          </p>

          <div className="mt-6 rounded-2xl bg-white/10 p-3 backdrop-blur-sm ring-1 ring-white/10">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-700 shadow-sm">
              <Search className="h-5 w-5 text-emerald-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="फसल, योजना, या विषय लिखें..."
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-slate-500 transition hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
              खोज परिणाम लोड हो रहे हैं...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          ) : sections.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">कोई परिणाम नहीं मिला</h2>
              <p className="mt-2 text-sm text-slate-600">
                अलग शब्द या विषय लिखकर फिर से खोजें।
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {section.key === 'crops' ? <Sprout className="h-5 w-5 text-emerald-600" /> : section.key === 'schemes' ? <Landmark className="h-5 w-5 text-amber-600" /> : <BookOpen className="h-5 w-5 text-sky-600" />}
                      <h2 className="text-lg font-bold text-slate-800">{section.label}</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {section.items.length}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {section.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="group rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/60"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                              {item.kind}
                            </div>
                            <h3 className="text-base font-bold text-slate-800 group-hover:text-emerald-700">
                              {item.title}
                            </h3>
                            {item.category ? (
                              <p className="mt-1 text-xs font-medium text-slate-500">{item.category}</p>
                            ) : null}
                            {item.description ? (
                              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.description}</p>
                            ) : null}
                          </div>

                          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
                            देखें
                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" /> }>
      <SearchPageContent />
    </Suspense>
  );
}
