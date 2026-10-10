'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Calculator,
  Droplets,
  Eye,
  Heart,
  Info,
  MapPin,
  MessageCircle,
  RefreshCw,
  Share2,
  ShieldAlert,
  Sprout,
  Sun,
  Calendar,
  TrendingDown,
  TrendingUp,
  Award,
  X,
  BarChart3,
  BookOpen,
  User,
  ThumbsUp,
  Send,
  Link2,
  Leaf,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

import { getDynamicMandiRates } from '@/services/mandiApi';
import {
  getOrCreateVisitorId,
  publicApiRequest,
  unwrapApiItem,
  unwrapApiList,
} from '@/lib/publicApi';

/* =========================================================
   CROP DATABASE
========================================================= */

const emptyCrop = {
  slug: '',
  name: '',
  englishName: '',
  scientificName: '',
  category: '',
  season: '',
  icon: '',
  overview: '',
  author: '',
  publishedAt: '',
  updatedAt: '',
  readTime: '',
  views: 0,
  likes: 0,
  tags: [],
  varieties: [],
  soilRequirement: '',
  sowingTime: '',
  waterRequirement: '',
  seedRate: '',
  harvestingTime: '',
  topDemandMandi: '',
  diseases: [],
  mandiPrice: { min: 0, max: 0, modal: 0, previousModal: 0, unit: 'क्विंटल', mandiName: '' },
  priceHistory: [],
};

const articleSections = [
  {
    id: 'overview',
    label: 'फसल परिचय',
  },
  {
    id: 'market',
    label: 'मंडी भाव',
  },
  {
    id: 'calculator',
    label: 'कमाई कैलकुलेटर',
  },
  {
    id: 'agronomy',
    label: 'कृषि तकनीक',
  },
  {
    id: 'varieties',
    label: 'उन्नत किस्में',
  },
  {
    id: 'diseases',
    label: 'रोग एवं कीट',
  },
  {
    id: 'faq',
    label: 'सामान्य प्रश्न',
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function CropDetailPage({ params }) {
  const slug = params?.slug || '';
  const [crop, setCrop] = useState(emptyCrop);
  const [relatedCrops, setRelatedCrops] = useState([]);
  const [relatedCategories, setRelatedCategories] = useState([]);
  const [relatedCategoryFilter, setRelatedCategoryFilter] = useState('all');
  const [relatedCropsError, setRelatedCropsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [priceError, setPriceError] = useState('');

  const [activeSection, setActiveSection] =
    useState('overview');

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  const [isLiked, setIsLiked] =
    useState(false);

  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [visitorId, setVisitorId] = useState('');
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [engagementError, setEngagementError] = useState('');

  const [showShare, setShowShare] =
    useState(false);

  const likeBaseCount = useRef(0);

  const [chartMode, setChartMode] =
    useState('modal');

  const [landArea, setLandArea] =
    useState(1);

  const [landUnit, setLandUnit] =
    useState('bigha');

  const [yieldPerUnit, setYieldPerUnit] =
    useState(0);

  const [activeTab, setActiveTab] =
    useState('agronomy');

  const [comment, setComment] =
    useState('');

  const [comments, setComments] =
    useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [questionError, setQuestionError] = useState('');
  const [questionNotice, setQuestionNotice] = useState('');

  /* =====================================================
     STORAGE
  ===================================================== */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bookmarkKey = `krishi-bookmark-${slug}`;
    const likeKey = `krishi-like-${slug}`;
    setIsBookmarked(
      localStorage.getItem(bookmarkKey) === 'true'
    );

    setIsLiked(
      localStorage.getItem(likeKey) === 'true'
    );
    setVisitorId(getOrCreateVisitorId());

  }, [slug]);

  /* =====================================================
     LIVE MANDI API
  ===================================================== */

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError('');
    setPriceError('');
    async function loadCrop() {
      try {
        const result = await publicApiRequest(
          `/crops/slug/${encodeURIComponent(slug)}`,
        );
        const record = unwrapApiItem(result, ['crop', 'item', 'record']);
        if (!record || !(record.slug || record._id || record.id)) {
          throw new Error('इस फसल की प्रकाशित जानकारी उपलब्ध नहीं है।');
        }
        const displayValue = (value) =>
          typeof value === 'string'
            ? value
            : value?.label || value?.name || '';
        const apiCrop = {
          ...emptyCrop,
          ...record,
          category: displayValue(record.category),
          season: displayValue(record.season),
          publishedAt: record.publishedAt || '',
          updatedAt: record.updatedAtContent || record.updatedAt || '',
          soilRequirement:
            record.soilRequirement || record.idealSoil || '',
          waterRequirement:
            record.waterRequirement || displayValue(record.water),
          tags: Array.isArray(record.tags) ? record.tags : [],
          varieties: Array.isArray(record.varieties)
            ? record.varieties
            : [],
          diseases: Array.isArray(record.diseases)
            ? record.diseases
            : [],
          views: Number(record.views) || 0,
          likes: Number(record.likes) || 0,
          mandiPrice: {
            ...emptyCrop.mandiPrice,
            ...(record.mandiPrice || {}),
          },
          priceHistory: Array.isArray(record.priceHistory)
            ? record.priceHistory
            : [],
        };
        if (cancelled) return;
        const storedLikeValue =
          typeof window !== 'undefined'
            ? localStorage.getItem(`krishi-crop-like-${apiCrop.slug || slug}`)
            : null;
        const isLikedStored = storedLikeValue === 'true';
        likeBaseCount.current = Number(apiCrop.likes) || 0;
        setCrop(apiCrop);
        setLikes(likeBaseCount.current + (isLikedStored ? 1 : 0));
        setIsLiked(isLikedStored);
        setViews(apiCrop.views);
        setYieldPerUnit(Number(apiCrop.yieldPerUnit) || 0);
        setLoading(false);

        try {
          const rates = await getDynamicMandiRates({ crop: apiCrop.slug });
          if (cancelled) return;
          const matchedRate =
            rates.find(
              (rate) =>
                rate.cropEnglish?.toLowerCase().includes(apiCrop.slug) ||
                rate.crop?.toLowerCase().includes(apiCrop.slug),
            ) || rates[0];

          if (matchedRate) {
            setCrop((previous) => ({
              ...previous,
              mandiPrice: {
                min: matchedRate.minPrice ?? 0,
                max: matchedRate.maxPrice ?? 0,
                modal: matchedRate.modalPrice ?? 0,
                previousModal: previous.mandiPrice.modal,
                unit: matchedRate.unit || previous.mandiPrice.unit,
                mandiName: matchedRate.mandi || '',
              },
            }));
          }
        } catch (error) {
          if (!cancelled) {
            setPriceError(error.message || 'मंडी भाव लोड नहीं हो सके।');
          }
        }
      } catch (error) {
        if (!cancelled) setLoadError(error.message || 'फसल की जानकारी लोड नहीं हो सकी।');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) loadCrop();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      publicApiRequest('/crops?status=published&limit=100'),
      publicApiRequest('/crop-categories?status=active'),
    ])
      .then(([result, categoryResult]) => {
        if (cancelled) return;

        setRelatedCrops(
          unwrapApiList(result, ['crops']).map((item) => ({
            ...item,
            slug: item.slug || item._id || item.id,
            category:
              typeof item.category === 'string'
                ? { key: item.category, label: item.category }
                : item.category || {},
          }))
        );
        setRelatedCategories(
          unwrapApiList(categoryResult).map((category) => ({
            key: category.key || category.slug,
            label: category.name || category.label || category.key,
          })).filter((category) => category.key && category.label),
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setRelatedCropsError(
            error.message || 'संबंधित फसलें लोड नहीं हो सकीं।'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;
    setQuestionsLoading(true);
    setQuestionError('');
    publicApiRequest(`/crops/slug/${encodeURIComponent(slug)}/questions`)
      .then((result) => {
        if (!cancelled) {
          setComments(
            unwrapApiList(result).map((item) => ({
              id: item._id,
              text: item.question,
              name: item.name,
              answer: item.answer || '',
              time: item.createdAt
                ? new Intl.DateTimeFormat('hi-IN', { dateStyle: 'medium' }).format(new Date(item.createdAt))
                : '',
            })),
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setQuestionError(error.message || 'किसान सवाल लोड नहीं हो सके।');
        }
      })
      .finally(() => {
        if (!cancelled) setQuestionsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* =====================================================
     SCROLL SECTION TRACKING
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      const positions = articleSections
        .map((section) => {
          const element = document.getElementById(
            section.id
          );

          if (!element) return null;

          return {
            id: section.id,
            top: Math.abs(
              element.getBoundingClientRect().top - 130
            ),
          };
        })
        .filter(Boolean);

      if (!positions.length) return;

      positions.sort((a, b) => a.top - b.top);

      setActiveSection(positions[0].id);
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  /* =====================================================
     PRICE
  ===================================================== */

  const priceDiff =
    crop.mandiPrice.modal -
    crop.mandiPrice.previousModal;

  const priceChangePercentage =
    crop.mandiPrice.previousModal > 0
      ? (
          (priceDiff /
            crop.mandiPrice.previousModal) *
          100
        ).toFixed(2)
      : '0.00';

  const isPriceUp = priceDiff >= 0;

  /* =====================================================
     YIELD
  ===================================================== */

  const calculatedYield = useMemo(() => {
    const result =
      Number(landArea || 0) *
      Number(yieldPerUnit || 0);

    return result.toFixed(1);
  }, [landArea, yieldPerUnit]);

  const estimatedModalIncome =
    Number(calculatedYield) *
    crop.mandiPrice.modal;

  const estimatedMaxIncome =
    Number(calculatedYield) *
    crop.mandiPrice.max;

  /* =====================================================
     READING PROGRESS
  ===================================================== */

  const [readingProgress, setReadingProgress] =
    useState(0);

  useEffect(() => {
    const handleProgress = () => {
      const scrollTop =
        window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        documentHeight > 0
          ? (scrollTop / documentHeight) * 100
          : 0;

      setReadingProgress(
        Math.min(100, Math.max(0, progress))
      );
    };

    window.addEventListener(
      'scroll',
      handleProgress
    );

    handleProgress();

    return () =>
      window.removeEventListener(
        'scroll',
        handleProgress
      );
  }, []);

  /* =====================================================
     LIKE
  ===================================================== */

  useEffect(() => {
    if (!crop?._id || loading || !visitorId) return undefined;

    let cancelled = false;
    setEngagementError('');
    publicApiRequest(`/crops/${encodeURIComponent(crop._id)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    })
      .then((result) => {
        if (cancelled) return;
        const counts = result.data || {};
        const nextViews = Number(counts.views) || 0;
        const nextLikes = Number(counts.likes) || 0;
        const nextLiked = Boolean(counts.liked);
        setViews(nextViews);
        setLikes(nextLikes);
        setIsLiked(nextLiked);
        setCrop((current) =>
          current
            ? { ...current, views: nextViews, likes: nextLikes }
            : current,
        );
        window.localStorage.setItem(
          `krishi-crop-like-${crop.slug}`,
          String(nextLiked),
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setEngagementError(error.message || 'आंकड़े अपडेट नहीं हो सके।');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [crop?._id, crop?.slug, loading, visitorId]);

  const toggleLike = async () => {
    if (!crop?._id || !visitorId || likeSubmitting) return;

    const next = !isLiked;
    setLikeSubmitting(true);
    setEngagementError('');
    try {
      const result = await publicApiRequest(
        `/crops/${encodeURIComponent(crop._id)}/like`,
        {
          method: next ? 'PUT' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        },
      );
      const counts = result.data || {};
      const nextLiked = Boolean(counts.liked);
      const nextLikes = Number(counts.likes) || 0;
      setIsLiked(nextLiked);
      setLikes(nextLikes);
      setCrop((current) =>
        current ? { ...current, likes: nextLikes } : current,
      );
      window.localStorage.setItem(
        `krishi-crop-like-${crop.slug}`,
        String(nextLiked),
      );
    } catch (error) {
      setEngagementError(error.message || 'लाइक अपडेट नहीं हो सका।');
    } finally {
      setLikeSubmitting(false);
    }
  };

  /* =====================================================
     BOOKMARK
  ===================================================== */

  const toggleBookmark = () => {
    const next = !isBookmarked;

    setIsBookmarked(next);

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `krishi-bookmark-${slug}`,
        String(next)
      );
    }
  };

  /* =====================================================
     SHARE
  ===================================================== */

  const shareArticle = async () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.href
        : '';

    const shareData = {
      title: `${crop.name} - कृषि मित्र`,
      text: `${crop.name} की खेती और मंडी भाव की जानकारी`,
      url,
    };

    if (
      typeof navigator !== 'undefined' &&
      navigator.share
    ) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      setShowShare(true);

      setTimeout(() => {
        setShowShare(false);
      }, 2000);
    } catch {
      alert('लिंक कॉपी नहीं हो सकी।');
    }
  };

  /* =====================================================
     COMMENT
  ===================================================== */

  const submitComment = async () => {
    const text = comment.trim();

    if (!text || questionSubmitting) return;
    setQuestionSubmitting(true);
    setQuestionError('');
    setQuestionNotice('');
    try {
      const result = await publicApiRequest(
        `/crops/slug/${encodeURIComponent(slug)}/questions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text }),
        },
      );
      const item = result.data;
      setComments((previous) => [
        {
          id: item._id,
          text: item.question,
          name: item.name || 'किसान',
          answer: item.answer || '',
          time: 'अभी',
        },
        ...previous,
      ]);
      setComment('');
      setQuestionNotice('आपका सवाल सफलतापूर्वक भेज दिया गया है।');
    } catch (error) {
      setQuestionError(error.message || 'सवाल भेजा नहीं जा सका।');
    } finally {
      setQuestionSubmitting(false);
    }
  };

  /* =====================================================
     FAQ
  ===================================================== */

  const faqData = [
    {
      question: `${crop.name} की बुआई कब की जाती है?`,
      answer: crop.sowingTime,
    },
    {
      question: `${crop.name} के लिए कैसी मिट्टी उपयुक्त है?`,
      answer: crop.soilRequirement,
    },
    {
      question: `${crop.name} में कितने पानी की आवश्यकता होती है?`,
      answer: crop.waterRequirement,
    },
    {
      question: `${crop.name} की कटाई कब होती है?`,
      answer: crop.harvestingTime,
    },
  ];

  if (loading) {
    return <main className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-500">फसल की जानकारी लोड हो रही है...</main>;
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p role="alert" className="mb-5 text-red-700">{loadError}</p>
        <Link href="/crops" className="font-bold text-emerald-700">फसल सूची पर वापस जाएं</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =================================================
          READING PROGRESS
      ================================================= */}

      <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-transparent">
        <div
          className="h-full bg-emerald-500 transition-all duration-100"
          style={{
            width: `${readingProgress}%`,
          }}
        />
      </div>

      {/* =================================================
          TOP ARTICLE BAR
      ================================================= */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/crops"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            <ArrowLeft className="h-4 w-4" />
            फसल निर्देशिका
          </Link>

          <div className="hidden items-center gap-4 text-xs text-slate-500 sm:flex">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {crop.readTime} पढ़ने का समय
            </span>

            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {views.toLocaleString('hi-IN')} views
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLike}
              disabled={!visitorId || likeSubmitting}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
                likeSubmitting
                  ? 'cursor-wait opacity-60'
                  : isLiked
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200'
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              {likes.toLocaleString('hi-IN')}
            </button>

            <button
              type="button"
              onClick={toggleBookmark}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
                isBookmarked
                  ? 'border-amber-300 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isBookmarked ? 'fill-current' : ''
                }`}
              />

              <span className="hidden sm:inline">
                {isBookmarked ? 'सेव किया' : 'सेव'}
              </span>
            </button>

            <button
              type="button"
              onClick={shareArticle}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />

              <span className="hidden sm:inline">
                शेयर
              </span>
            </button>
          </div>
          {engagementError && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {engagementError}
            </p>
          )}
        </div>
      </div>

      {/* =================================================
          SHARE SUCCESS
      ================================================= */}

      {showShare && (
        <div className="fixed right-4 top-20 z-[90] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <Check className="h-4 w-4 text-emerald-400" />
          लिंक कॉपी हो गई
        </div>
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* =================================================
              ARTICLE
          ================================================= */}

          <article>
            {/* HERO */}
            <section
              id="overview"
              className="scroll-mt-28 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white shadow-xl"
            >
              <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-slate-900">
                      {crop.season}
                    </span>

                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                      {crop.category}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-6xl backdrop-blur">
                      {crop.icon}
                    </div>

                    <div>
                      <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        {crop.name}
                      </h1>

                      <p className="mt-1 font-mono text-sm italic text-emerald-200">
                        {crop.scientificName}
                      </p>

                      <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base">
                        {crop.overview}
                      </p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-7 flex flex-wrap gap-4 border-t border-white/10 pt-5 text-xs text-emerald-100">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      {crop.author}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      अपडेट: {crop.updatedAt}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {crop.readTime}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {views.toLocaleString('hi-IN')}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {crop.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ARTICLE INTRO */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Leaf className="h-4 w-4" />
                इस लेख में
              </div>

              <p className="mt-4 text-base leading-8 text-slate-700">
                इस गाइड में {crop.name} की खेती से जुड़ी महत्वपूर्ण
                जानकारी, बुआई का समय, मिट्टी, सिंचाई, बीज दर,
                किस्में, रोग प्रबंधन और वर्तमान मंडी भाव को एक
                जगह समझाया गया है।
              </p>
            </section>

            {/* =================================================
                MARKET
            ================================================= */}

            <section
              id="market"
              className="mt-8 scroll-mt-28"
            >
              <SectionHeading
                icon={<TrendingUp className="h-5 w-5" />}
                title="आज का मंडी भाव"
                subtitle="उपलब्ध मंडी डेटा के आधार पर भाव"
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <MarketCard
                  title="न्यूनतम भाव"
                  value={crop.mandiPrice.min}
                  color="slate"
                />

                <MarketCard
                  title="मॉडल भाव"
                  value={crop.mandiPrice.modal}
                  color="emerald"
                  featured
                />

                <MarketCard
                  title="अधिकतम भाव"
                  value={crop.mandiPrice.max}
                  color="amber"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {crop.mandiPrice.mandiName}
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
                      isPriceUp
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {isPriceUp ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}

                    {isPriceUp ? '+' : ''}
                    {priceChangePercentage}%
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  पिछले उपलब्ध मॉडल भाव की तुलना में परिवर्तन।
                </p>
              </div>

              {/* Chart */}
              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      मंडी भाव ट्रेंड
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      दिन-वार उपलब्ध कीमतों का ग्राफ
                    </p>
                  </div>

                  <div className="flex rounded-xl bg-slate-100 p-1">
                    {[
                      {
                        id: 'modal',
                        label: 'मॉडल',
                      },
                      {
                        id: 'min',
                        label: 'न्यूनतम',
                      },
                      {
                        id: 'max',
                        label: 'अधिकतम',
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setChartMode(item.id)
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          chartMode === item.id
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 h-72 w-full">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={crop.priceHistory}
                      margin={{
                        top: 10,
                        right: 10,
                        left: -15,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="cropPriceGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />

                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 11,
                          fill: '#64748b',
                        }}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{
                          fontSize: 11,
                          fill: '#64748b',
                        }}
                        tickLine={false}
                        domain={['auto', 'auto']}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderRadius: '12px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [
                          `₹${Number(
                            value
                          ).toLocaleString('hi-IN')}`,
                          chartMode === 'modal'
                            ? 'मॉडल भाव'
                            : chartMode === 'min'
                            ? 'न्यूनतम भाव'
                            : 'अधिकतम भाव',
                        ]}
                      />

                      <Area
                        type="monotone"
                        dataKey={chartMode}
                        stroke="#059669"
                        strokeWidth={3}
                        fill="url(#cropPriceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Link
                href={`/mandi-bhav?crop=${crop.slug}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-emerald-800"
              >
                पूरी मंडी भाव जानकारी देखें
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>

            {/* =================================================
                CALCULATOR
            ================================================= */}

            <section
              id="calculator"
              className="mt-10 scroll-mt-28"
            >
              <SectionHeading
                icon={<Calculator className="h-5 w-5" />}
                title="उपज और संभावित कमाई कैलकुलेटर"
                subtitle="अपने खेत के अनुसार अनुमान लगाएं"
              />

              <div className="mt-5 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-7">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      क्षेत्रफल
                    </label>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="0.1"
                        value={landArea}
                        onChange={(event) =>
                          setLandArea(
                            Math.max(
                              0.1,
                              Number(
                                event.target.value
                              )
                            )
                          )
                        }
                        className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400"
                      />

                      <select
                        value={landUnit}
                        onChange={(event) =>
                          setLandUnit(
                            event.target.value
                          )
                        }
                        className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-bold outline-none"
                      >
                        <option value="bigha">
                          बीघा
                        </option>
                        <option value="acre">
                          एकड़
                        </option>
                        <option value="hectare">
                          हेक्टेयर
                        </option>
                      </select>
                    </div>

                    <label className="mt-5 block text-xs font-bold text-slate-700">
                      अनुमानित उपज प्रति इकाई
                    </label>

                    <div className="relative mt-2">
                      <input
                        type="number"
                        min="0"
                        value={yieldPerUnit}
                        onChange={(event) =>
                          setYieldPerUnit(
                            Math.max(
                              0,
                              Number(
                                event.target.value
                              )
                            )
                          )
                        }
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 pr-24 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-400"
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        क्विंटल
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-200 bg-white/70 p-3 text-xs leading-5 text-slate-500">
                      यह केवल अनुमान है। वास्तविक उपज मिट्टी,
                      मौसम, किस्म, सिंचाई और प्रबंधन के अनुसार
                      बदल सकती है।
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <ResultBox
                      title="अनुमानित कुल उपज"
                      value={`${Number(
                        calculatedYield
                      ).toLocaleString('hi-IN')} क्विंटल`}
                    />

                    <ResultBox
                      title="मॉडल भाव पर संभावित सकल आय"
                      value={`₹${estimatedModalIncome.toLocaleString(
                        'hi-IN'
                      )}`}
                      featured
                    />

                    <ResultBox
                      title="अधिकतम भाव पर संभावित सकल आय"
                      value={`₹${estimatedMaxIncome.toLocaleString(
                        'hi-IN'
                      )}`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                AGRONOMY
            ================================================= */}

            <section
              id="agronomy"
              className="mt-10 scroll-mt-28"
            >
              <SectionHeading
                icon={<Sprout className="h-5 w-5" />}
                title="कृषि तकनीक एवं आवश्यकताएं"
                subtitle={`${crop.name} की मुख्य जानकारी`}
              />

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Calendar />}
                  title="बुआई का समय"
                  value={crop.sowingTime}
                />

                <InfoCard
                  icon={<Sprout />}
                  title="बीज दर"
                  value={crop.seedRate}
                />

                <InfoCard
                  icon={<Sun />}
                  title="मिट्टी एवं pH"
                  value={crop.soilRequirement}
                />

                <InfoCard
                  icon={<Droplets />}
                  title="सिंचाई"
                  value={crop.waterRequirement}
                />

                <InfoCard
                  icon={<Award />}
                  title="कटाई"
                  value={crop.harvestingTime}
                />

                <InfoCard
                  icon={<MapPin />}
                  title="प्रमुख मंडियां"
                  value={crop.topDemandMandi}
                />
              </div>
            </section>

            {/* =================================================
                VARIETIES
            ================================================= */}

            <section
              id="varieties"
              className="mt-10 scroll-mt-28"
            >
              <SectionHeading
                icon={<Award className="h-5 w-5" />}
                title="उन्नत किस्में"
                subtitle={`${crop.name} की उपलब्ध किस्मों की जानकारी`}
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {crop.varieties.map((item, index) => (
                  <div
                    key={index}
                    className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-extrabold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            औसत पैदावार
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                      {item.yield}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {item.feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* =================================================
                DISEASES
            ================================================= */}

            <section
              id="diseases"
              className="mt-10 scroll-mt-28"
            >
              <SectionHeading
                icon={<ShieldAlert className="h-5 w-5" />}
                title="रोग एवं कीट प्रबंधन"
                subtitle="पहचान और उचित प्रबंधन"
              />

              <div className="mt-5 space-y-4">
                {crop.diseases.map(
                  (disease, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-sm"
                    >
                      <div className="border-b border-rose-100 bg-rose-50 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
                            <ShieldAlert className="h-5 w-5" />
                          </div>

                          <h3 className="font-extrabold text-rose-900">
                            {disease.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            लक्षण
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {disease.symptoms}
                          </p>
                        </div>

                        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                          <div className="text-xs font-bold text-emerald-700">
                            प्रबंधन
                          </div>

                          <p className="mt-2 text-sm leading-6 text-emerald-900">
                            {disease.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* =================================================
                FARMER QUESTIONS
            ================================================= */}

            <section className="mt-10">
              <SectionHeading
                icon={<MessageCircle className="h-5 w-5" />}
                title="किसान सवाल पूछें"
                subtitle="अपने अनुभव या सवाल साझा करें"
              />

              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <textarea
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  placeholder={`${crop.name} के बारे में अपना सवाल लिखें...`}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />

                {questionError && (
                  <p role="alert" className="mt-2 text-sm text-red-600">
                    {questionError}
                  </p>
                )}
                {questionNotice && (
                  <p role="status" className="mt-2 text-sm text-emerald-700">
                    {questionNotice}
                  </p>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={submitComment}
                    disabled={questionSubmitting || !comment.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                  >
                    {questionSubmitting ? 'भेज रहे हैं...' : 'सवाल पोस्ट करें'}
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {questionsLoading && (
                  <p className="mt-5 text-sm text-slate-500">सवाल लोड हो रहे हैं...</p>
                )}
                {comments.length > 0 && (
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    {comments.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <User className="h-4 w-4" />
                          {item.name || 'किसान'}
                          <span className="font-normal text-slate-400">
                            • {item.time}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {item.text}
                        </p>
                        {item.answer && (
                          <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                            <p className="text-xs font-bold text-emerald-800">कृषि मित्र का जवाब</p>
                            <p className="mt-1 text-sm leading-6 text-emerald-900">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {!questionsLoading && !questionError && comments.length === 0 && (
                  <p className="mt-5 border-t border-slate-100 pt-5 text-sm text-slate-500">
                    अभी तक कोई सवाल नहीं पूछा गया है।
                  </p>
                )}
              </div>
            </section>

            {/* =================================================
                FAQ
            ================================================= */}

            <section
              id="faq"
              className="mt-10 scroll-mt-28"
            >
              <SectionHeading
                icon={<Info className="h-5 w-5" />}
                title="सामान्य प्रश्न"
                subtitle={`${crop.name} से जुड़े सामान्य सवाल`}
              />

              <div className="mt-5 space-y-3">
                {faqData.map((item, index) => (
                  <FAQItem
                    key={index}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </section>

            {/* =================================================
                ARTICLE FOOTER
            ================================================= */}

            <div className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <Info className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-extrabold text-emerald-900">
                    महत्वपूर्ण सूचना
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-emerald-800">
                    कृषि परिस्थितियां क्षेत्र, मिट्टी, मौसम, किस्म
                    और स्थानीय प्रबंधन के अनुसार बदल सकती हैं।
                    किसी भी महत्वपूर्ण कृषि निर्णय से पहले स्थानीय
                    कृषि विशेषज्ञ या संबंधित विभाग की सलाह लें।
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RELATED CROPS
            ================================================= */}

            <section className="mt-10">
              <SectionHeading
                icon={<Leaf className="h-5 w-5" />}
                title="संबंधित फसलें"
                subtitle="कृषि मित्र पर और जानकारी पढ़ें"
              />

              {relatedCropsError && (
                <p role="alert" className="mt-4 text-sm text-amber-700">
                  {relatedCropsError}
                </p>
              )}

              {relatedCategories.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2" aria-label="फसल श्रेणियां">
                  <button
                    type="button"
                    onClick={() => setRelatedCategoryFilter('all')}
                    aria-pressed={relatedCategoryFilter === 'all'}
                    className={`rounded-full px-4 py-2 text-xs font-bold ${
                      relatedCategoryFilter === 'all'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200'
                    }`}
                  >
                    सभी
                  </button>
                  {relatedCategories.map((category) => (
                    <button
                      type="button"
                      key={category.key}
                      onClick={() => setRelatedCategoryFilter(category.key)}
                      aria-pressed={relatedCategoryFilter === category.key}
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        relatedCategoryFilter === category.key
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-slate-600 ring-1 ring-slate-200'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {relatedCrops
                  .filter(
                    (item) =>
                      item.slug &&
                      item.slug !== crop.slug &&
                      (relatedCategoryFilter === 'all' ||
                        item.category?.key === relatedCategoryFilter)
                  )
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/crops/${encodeURIComponent(item.slug)}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                    >
                      <div className="text-3xl">
                        {item.icon || '🌱'}
                      </div>

                      <div className="mt-3 font-extrabold text-slate-900 group-hover:text-emerald-700">
                        {item.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        {item.category?.label || item.category?.name || ''}
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700">
                        पढ़ें
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  ))}
              </div>
              {!relatedCropsError &&
                relatedCrops.filter(
                  (item) =>
                    item.slug &&
                    item.slug !== crop.slug &&
                    (relatedCategoryFilter === 'all' ||
                      item.category?.key === relatedCategoryFilter)
                ).length === 0 && (
                  <p className="mt-4 text-sm text-slate-500">
                    अभी अन्य प्रकाशित फसलें उपलब्ध नहीं हैं।
                  </p>
                )}
            </section>
          </article>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              {/* TOC */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  इस लेख में
                </div>

                <div className="mt-4 space-y-1">
                  {articleSections.map(
                    (section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => {
                          document
                            .getElementById(
                              section.id
                            )
                            ?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                          activeSection ===
                          section.id
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {section.label}

                        {activeSection ===
                          section.id && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Live Price Sidebar */}
              <div className="overflow-hidden rounded-3xl bg-emerald-900 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black text-slate-900">
                    LIVE
                  </span>

                  {loading && (
                    <RefreshCw className="h-4 w-4 animate-spin text-emerald-300" />
                  )}
                </div>

                <div className="mt-5 text-xs text-emerald-300">
                  {crop.mandiPrice.mandiName}
                </div>

                <div className="mt-1 text-3xl font-black text-amber-300">
                  ₹
                  {crop.mandiPrice.modal.toLocaleString(
                    'hi-IN'
                  )}
                </div>

                <div className="mt-1 text-xs text-emerald-200">
                  मॉडल भाव / {crop.mandiPrice.unit}
                </div>

                <Link
                  href={`/mandi-bhav?crop=${crop.slug}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-emerald-900 hover:bg-emerald-50"
                >
                  मंडी भाव देखें
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Share */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-extrabold text-slate-900">
                  किसान तक जानकारी पहुंचाएं
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  इस फसल गाइड को दूसरे किसानों के साथ शेयर करें।
                </p>

                <button
                  type="button"
                  onClick={shareArticle}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Share2 className="h-4 w-4" />
                  लेख शेयर करें
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* =================================================
          MOBILE FLOATING ACTIONS
      ================================================= */}

      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={toggleLike}
          disabled={!visitorId || likeSubmitting}
          className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${
            likeSubmitting
              ? 'cursor-wait opacity-60'
              : isLiked
              ? 'bg-rose-50 text-rose-600'
              : 'text-slate-600'
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? 'fill-current' : ''
            }`}
          />
          {likes}
        </button>

        <button
          type="button"
          onClick={toggleBookmark}
          className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${
            isBookmarked
              ? 'bg-amber-50 text-amber-700'
              : 'text-slate-600'
          }`}
        >
          <Bookmark
            className={`h-4 w-4 ${
              isBookmarked ? 'fill-current' : ''
            }`}
          />
          सेव
        </button>

        <button
          type="button"
          onClick={shareArticle}
          className="flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-slate-600"
        >
          <Share2 className="h-4 w-4" />
          शेयर
        </button>
      </div>

      {/* =================================================
          BACK TO TOP
      ================================================= */}

      {readingProgress > 20 && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }
          className="fixed bottom-20 right-4 z-40 hidden h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xl transition hover:bg-emerald-800 sm:flex lg:bottom-6"
          title="ऊपर जाएं"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  icon,
  title,
  subtitle,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-emerald-700">
        {icon}

        <span className="text-xs font-bold uppercase tracking-wider">
          कृषि मित्र
        </span>
      </div>

      <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   MARKET CARD
========================================================= */

function MarketCard({
  title,
  value,
  color,
  featured = false,
}) {
  const styles = {
    slate: {
      box: 'border-slate-200 bg-white',
      title: 'text-slate-500',
      value: 'text-slate-900',
    },

    emerald: {
      box: 'border-emerald-200 bg-emerald-50',
      title: 'text-emerald-700',
      value: 'text-emerald-900',
    },

    amber: {
      box: 'border-amber-200 bg-amber-50',
      title: 'text-amber-700',
      value: 'text-amber-900',
    },
  };

  const style =
    styles[color] || styles.slate;

  return (
    <div
      className={`rounded-2xl border p-5 ${
        style.box
      } ${featured ? 'ring-2 ring-emerald-200' : ''}`}
    >
      <div
        className={`text-xs font-bold ${style.title}`}
      >
        {title}
      </div>

      <div
        className={`mt-2 text-2xl font-black ${style.value}`}
      >
        ₹{value.toLocaleString('hi-IN')}
      </div>

      <div className="mt-1 text-[11px] text-slate-400">
        प्रति क्विंटल
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm">
      <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </span>

        {title}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   RESULT BOX
========================================================= */

function ResultBox({
  title,
  value,
  featured = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        featured
          ? 'border-emerald-700 bg-emerald-800 text-white'
          : 'border-amber-200 bg-white'
      }`}
    >
      <div
        className={`text-xs font-bold ${
          featured
            ? 'text-emerald-200'
            : 'text-slate-500'
        }`}
      >
        {title}
      </div>

      <div
        className={`mt-2 text-2xl font-black ${
          featured
            ? 'text-amber-300'
            : 'text-slate-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   FAQ ITEM
========================================================= */

function FAQItem({
  question,
  answer,
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-extrabold text-slate-800">
          {question}
        </span>

        <ChevronRight
          className={`h-5 w-5 shrink-0 text-slate-400 transition ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-sm leading-7 text-slate-600">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}