'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  Grid3X3,
  List,
  MessageSquare,
  PlayCircle,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Tag,
  ThumbsUp,
  X,
} from 'lucide-react';

import { publicApiRequest, unwrapApiList } from '@/lib/publicApi';

const SORT_OPTIONS = [
  { value: 'latest', label: 'नवीनतम' },
  { value: 'popular', label: 'सबसे लोकप्रिय' },
  { value: 'mostLiked', label: 'सबसे ज्यादा पसंद' },
  { value: 'mostViewed', label: 'सबसे ज्यादा देखे गए' },
];

function formatNumber(value = 0) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value;
}

function formatBlogDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('hi-IN', { dateStyle: 'medium' }).format(new Date(value));
}

export default function BlogListingPage() {
  const [blogsData, setBlogsData] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentsError, setCommentsError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      publicApiRequest('/blogs?limit=100'),
      publicApiRequest('/blog-categories'),
    ])
      .then(([blogResult, categoryResult]) => {
        if (cancelled) return;
      const blogs = unwrapApiList(blogResult);
      setBlogsData(blogs);
      setBlogCategories(unwrapApiList(categoryResult));
      const requestedCategory = new URLSearchParams(
        window.location.search,
      ).get('category');
      if (requestedCategory) setSelectedCategory(requestedCategory);

      const loadCommentCounts = async () => {
        let failedCount = 0;
        for (let index = 0; index < blogs.length; index += 10) {
          const batch = blogs.slice(index, index + 10);
          const results = await Promise.allSettled(
            batch.map(async (blog) => {
              if (!blog.slug) {
                throw new Error('Blog slug is missing.');
              }
              const result = await publicApiRequest(
                `/blogs/slug/${encodeURIComponent(blog.slug)}/comments`,
              );
              const countValue =
                result.count ??
                result.data?.count ??
                result.pagination?.total;
              const count = Number(countValue);
              return {
                slug: blog.slug,
                count: Number.isFinite(count)
                  ? count
                  : unwrapApiList(result).length,
              };
            }),
          );

          if (cancelled) return;
          const countsBySlug = new Map();
          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              countsBySlug.set(result.value.slug, result.value.count);
            } else {
              failedCount += 1;
            }
          });
          if (countsBySlug.size) {
            setBlogsData((current) =>
              current.map((blog) =>
                countsBySlug.has(blog.slug)
                  ? { ...blog, comments: countsBySlug.get(blog.slug) }
                  : blog,
              ),
            );
          }
        }
        if (failedCount && !cancelled) {
          setCommentsError(
            `कुछ लेखों की टिप्पणी संख्या लोड नहीं हो सकी (${failedCount})।`,
          );
        }
      };
      loadCommentCounts();
    })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || 'लेख लोड नहीं हो सके।');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allTags = useMemo(() => {
    const tags = blogsData.flatMap((blog) => blog.tags || []);
    return [...new Set(tags)];
  }, [blogsData]);

  const featuredPost = blogsData.find((post) => post.isFeatured);

  const categoryCounts = useMemo(() => {
    return [
      {
        _id: 'all',
        label: 'सभी विषय',
        icon: '📚',
        count: blogsData.length,
      },
      ...blogCategories.map((category) => ({
      ...category,
        count: blogsData.filter(
          (blog) =>
            blog.categoryId?._id === category._id ||
            blog.categoryId === category._id ||
            blog.category === category.label,
        ).length,
      })),
    ];
  }, [blogCategories, blogsData]);

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const result = blogsData.filter((blog) => {
      const categoryMatch =
        selectedCategory === 'all' ||
        blog.categoryId?._id === selectedCategory ||
        blog.categoryId === selectedCategory ||
        blog.category === blogCategories.find((item) => item._id === selectedCategory)?.label;

      const tagMatch =
        !selectedTag ||
        blog.tags?.some((tag) => tag === selectedTag);

      const searchMatch =
        !query ||
        [
          blog.title,
          blog.excerpt,
          blog.category,
          blog.author,
          ...(blog.tags || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return categoryMatch && tagMatch && searchMatch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.likes || 0) + (b.comments || 0) - ((a.likes || 0) + (a.comments || 0));
      }

      if (sortBy === 'mostLiked') {
        return (b.likes || 0) - (a.likes || 0);
      }

      if (sortBy === 'mostViewed') {
        return (b.views || 0) - (a.views || 0);
      }

      return new Date(b.date || b.publishedAt || 0) - new Date(a.date || a.publishedAt || 0);
    });
  }, [blogsData, blogCategories, searchTerm, selectedCategory, selectedTag, sortBy]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('');
    setSortBy('latest');
    setVisibleCount(6);
  };

  const hasActiveFilters =
    searchTerm.trim() !== '' || selectedCategory !== 'all' || selectedTag;
  const activeFilterCount = [
    searchTerm.trim() !== '',
    selectedCategory !== 'all',
    Boolean(selectedTag),
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-800 text-white shadow-xl">
          <div className="absolute -right-20 -bottom-20 opacity-10">
            <BookOpen className="w-96 h-96" />
          </div>

          <div className="relative z-10 p-7 sm:p-10 lg:p-14 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-4 py-2 rounded-full text-xs font-black mb-5">
              <Sparkles className="w-4 h-4" />
              डिजिटल कृषि ज्ञान केंद्र
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              किसान के लिए कृषि ज्ञान,
              <span className="text-amber-300"> आसान भाषा में</span>
            </h1>

            <p className="mt-5 text-emerald-100 max-w-3xl text-sm sm:text-base leading-7">
              फसल प्रबंधन, फसल सुरक्षा, जैविक खेती, मंडी और कृषि तकनीक से जुड़े
              practical guides पढ़ें।
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <div className="text-xl font-black">{blogsData.length}</div>
                <div className="text-[11px] text-emerald-200">
                  कृषि लेख
                </div>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <div className="text-xl font-black">
                  {formatNumber(
                    blogsData.reduce((sum, blog) => sum + blog.views, 0)
                  )}
              </div>
                <div className="text-[11px] text-emerald-200">
                  कुल views
                </div>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
                <div className="text-xl font-black">
                  {blogCategories.length}
                </div>
                <div className="text-[11px] text-emerald-200">
                  विषय
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {commentsError && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">{commentsError}</p>}
        {loading && <p className="text-sm text-slate-500">लेख लोड हो रहे हैं...</p>}

        {/* SEARCH */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-row lg:gap-3">

            <div className="relative col-span-2 flex-1 lg:col-span-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />

              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(6);
                }}
                aria-label="ब्लॉग खोजें"
                placeholder="लहसुन, सोयाबीन, थ्रिप्स, मंडी, जैविक..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="खोज मिटाएं"
                  className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="blog-filter-panel"
              className={`min-w-0 px-3 py-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 ${
                showFilters
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              फिल्टर
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1.5 text-[11px] font-black text-emerald-950">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="लेख क्रमबद्ध करें"
              className="min-w-0 w-full px-2 py-3 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none sm:px-4 sm:text-sm lg:w-auto"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="hidden sm:flex border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 ${
                  viewMode === 'grid'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-600'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-4 ${
                  viewMode === 'list'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white text-slate-600'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div id="blog-filter-panel" className="hidden mt-4 pt-4 border-t border-slate-100 space-y-5 md:block">

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-black">
                    विषय के अनुसार खोजें
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categoryCounts.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category._id);
                        setVisibleCount(6);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                        selectedCategory === category._id
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      {category.icon || '📚'} {category.label}
                      <span className="ml-1 opacity-70">
                        ({category.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-black">
                    Popular Tags
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        {
                          setSelectedTag(selectedTag === tag ? '' : tag);
                          setVisibleCount(6);
                        }
                      }
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition ${
                        selectedTag === tag
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  सभी filters हटाएं
                </button>
              )}
            </div>
          )}
        </section>

        {showFilters && (
          <div className="md:hidden">
            <button
              type="button"
              aria-label="ब्लॉग फिल्टर बंद करें"
              onClick={() => setShowFilters(false)}
              className="fixed inset-x-0 top-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[60] bg-slate-950/45"
            />
            <section
              id="blog-filter-sheet"
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-filter-title"
              className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[61] mx-auto flex max-h-[min(78dvh,42rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-4">
                <div>
                  <h2 id="blog-filter-title" className="text-lg font-black text-slate-900">
                    लेख छांटें
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {filteredBlogs.length} लेख · विषय और लोकप्रिय टैग चुनें
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  aria-label="फिल्टर बंद करें"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-emerald-700" />
                    <h3 className="text-sm font-black">विषय के अनुसार</h3>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categoryCounts.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        aria-pressed={selectedCategory === category._id}
                        onClick={() => {
                          setSelectedCategory(category._id);
                          setVisibleCount(6);
                        }}
                        className={`min-h-11 shrink-0 rounded-xl border px-3 text-xs font-bold transition ${
                          selectedCategory === category._id
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {category.icon || '📚'} {category.label}
                        <span className="ml-1 opacity-70">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-700" />
                    <h3 className="text-sm font-black">लोकप्रिय टैग</h3>
                  </div>
                  {allTags.length ? (
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={selectedTag === tag}
                          onClick={() => {
                            setSelectedTag(selectedTag === tag ? '' : tag);
                            setVisibleCount(6);
                          }}
                          className={`min-h-10 rounded-full px-3 text-xs font-bold transition ${
                            selectedTag === tag
                              ? 'bg-amber-300 text-amber-950'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">अभी कोई टैग उपलब्ध नहीं है।</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-100 bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  साफ करें
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="min-h-12 flex-1 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white"
                >
                  {filteredBlogs.length} लेख देखें
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ACTIVE FILTER INFO */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {selectedCategory === 'all'
                ? 'नवीनतम कृषि लेख एवं गाइड'
                : blogCategories.find((category) => category._id === selectedCategory)?.label}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {filteredBlogs.length} लेख मिले
              {searchTerm && ` • "${searchTerm}"`}
              {selectedTag && ` • #${selectedTag}`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            किसान उपयोगी सामग्री
          </div>
        </div>

        {/* FEATURED */}
        {featuredPost &&
          selectedCategory === 'all' &&
          !searchTerm &&
          !selectedTag && (
            <section className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-lg">
              <div className="grid lg:grid-cols-12">

                <div className="lg:col-span-7 h-64 sm:h-96 lg:h-[430px] relative overflow-hidden">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                  />

                  <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
                    <span className="bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-full text-xs font-black">
                      ⭐ Featured
                    </span>

                    {featuredPost.hasVideo && (
                      <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" />
                        वीडियो
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg text-xs font-bold">
                      {featuredPost.category}
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-4">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sm text-slate-600 leading-6 mt-4">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {featuredPost.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-6 pt-5">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                          {featuredPost.authorAvatar}
                        </div>

                        <div>
                          <p className="text-xs font-black">
                            {featuredPost.author}
                          </p>

                          <p className="text-[10px] text-slate-500">
                            {featuredPost.authorRole}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                      >
                        पूरा पढ़ें
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

        {/* BLOGS */}
        {visibleBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-14 text-center">
            <Search className="w-12 h-12 mx-auto text-slate-300" />

            <h3 className="font-black text-slate-900 mt-4">
              कोई लेख नहीं मिला
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Search या filter बदलकर फिर प्रयास करें।
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              सभी लेख दिखाएं
            </button>
          </div>
        ) : viewMode === 'grid' ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBlogs.map((blog) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                onCategoryClick={() => {
                  setSelectedCategory(blog.categoryId?._id || blog.categoryId || 'all');
                  setVisibleCount(6);
                }}
              />
            ))}
          </div>

        ) : (

          <div className="space-y-4">
            {visibleBlogs.map((blog) => (
              <BlogListCard
                key={blog.slug}
                blog={blog}
              />
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {visibleCount < filteredBlogs.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md"
            >
              और लेख दिखाएं
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

/* =========================================================
   BLOG GRID CARD
========================================================= */

function BlogCard({ blog, onCategoryClick }) {
  return (
    <article className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-400 hover:shadow-xl transition duration-300 flex flex-col">

      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <button
          onClick={onCategoryClick}
          className="absolute top-3 left-3 bg-slate-950/80 text-white backdrop-blur px-2.5 py-1.5 rounded-lg text-[10px] font-bold"
        >
          {blog.category}
        </button>

        {blog.hasVideo && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
            <PlayCircle className="w-3 h-3" />
            वीडियो
          </span>
        )}

        {blog.isFeatured && (
          <span className="absolute top-3 right-3 bg-amber-400 text-amber-950 px-2 py-1 rounded-md text-[10px] font-black">
            Featured
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">

        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-emerald-600" />
            {formatBlogDate(blog.date || blog.publishedAt)}
          </span>

          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatNumber(blog.views)}
          </span>
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 leading-snug mt-3 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-600 leading-5 mt-3 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {(blog.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 px-2 py-1 rounded-full text-[9px] font-bold text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">

          <div className="flex gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(blog.likes)}
            </span>

            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {formatNumber(blog.comments || 0)}
            </span>
          </div>

          <Link
            href={`/blog/${blog.slug}`}
            className="text-emerald-700 font-black text-xs flex items-center gap-1"
          >
            पढ़ें
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   BLOG LIST CARD
========================================================= */

function BlogListCard({ blog }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-400 hover:shadow-lg transition grid md:grid-cols-12">

      <div className="md:col-span-4 h-56 md:h-auto overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      <div className="md:col-span-8 p-5 sm:p-7">

        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-[10px] font-bold">
            {blog.category}
          </span>

          {blog.hasVideo && (
            <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
              वीडियो
            </span>
          )}
        </div>

        <Link href={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-black text-slate-900 hover:text-emerald-700 mt-3">
            {blog.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 leading-6 mt-3">
          {blog.excerpt}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {(blog.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 mt-6 pt-4 border-t border-slate-100">

          <div className="flex gap-4 text-xs text-slate-500">
            <span>
              📅 {formatBlogDate(blog.date || blog.publishedAt)}
            </span>

            <span>
              👁️ {formatNumber(blog.views)}
            </span>

            <span>
              👍 {formatNumber(blog.likes)}
            </span>

            <span>
              💬 {formatNumber(blog.comments || 0)}
            </span>
          </div>

          <Link
            href={`/blog/${blog.slug}`}
            className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            पूरा लेख
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}