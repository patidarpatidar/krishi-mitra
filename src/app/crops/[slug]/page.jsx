'use client';

import { useEffect, useMemo, useState } from 'react';
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

/* =========================================================
   CROP DATABASE
========================================================= */

const cropDetailsDatabase = {
  garlic: {
    slug: 'garlic',
    name: 'लहसुन',
    englishName: 'Garlic',
    scientificName: 'Allium sativum',
    category: 'नगदी / मसाला फसल',
    season: 'रबी (Rabi)',
    icon: '🧄',

    overview:
      'लहसुन मालवा क्षेत्र (विशेषकर नीमच और मंदसौर) की सबसे प्रमुख नगदी फसलों में से एक है। जी-2, रियावन और ऊंटनी लहसुन की किस्में देश भर की मंडियों में प्रसिद्ध हैं।',

    author: 'कृषि मित्र टीम',

    publishedAt: '03 अक्टूबर 2026',

    updatedAt: 'आज',

    readTime: '8 मिनट',

    views: 18320,

    likes: 1260,

    tags: [
      'लहसुन',
      'रबी फसल',
      'नीमच',
      'मंदसौर',
      'मसाला फसल',
      'मंडी भाव',
    ],

    varieties: [
      {
        name: 'जी-2 (G-2 Garlic)',
        yield: '100-120 क्विंटल/हेक्टेयर',
        feature: 'सफेद और मोटे कंद, लंबी भंडारण क्षमता।',
      },
      {
        name: 'रियावन सिल्वर',
        yield: '120-140 क्विंटल/हेक्टेयर',
        feature: 'तीखा गंध, चमकदार सिल्वर रंग, मंडी में उच्चतम दाम।',
      },
      {
        name: 'ऊंटनी लहसुन',
        yield: '130-150 क्विंटल/हेक्टेयर',
        feature: 'अत्यधिक आकार, कम कलियां, निर्यात हेतु उपयुक्त।',
      },
      {
        name: 'यमुना सफेद (G-1)',
        yield: '90-110 क्विंटल/हेक्टेयर',
        feature: 'रोग प्रतिरोधी, सभी मिट्टी प्रकारों हेतु अनुकूल।',
      },
    ],

    soilRequirement:
      'अच्छे जल निकास वाली बलुई दोमट या मध्यम काली मिट्टी। भूमि का pH मान 6.0 से 7.0 उत्तम माना जाता है।',

    sowingTime:
      '15 अक्टूबर से 15 नवंबर (उपयुक्त तापमान: 20°C - 25°C)',

    waterRequirement:
      '8 से 10 सिंचाइयां (मृदा प्रकार के अनुसार 10-12 दिन के अंतराल पर)।',

    seedRate: '500-600 किग्रा कलियां प्रति हेक्टेयर',

    harvestingTime: 'मार्च - अप्रैल',

    topDemandMandi: 'नीमच, मंदसौर, पिपलिया मंडी',

    diseases: [
      {
        name: 'बैंगनी धब्बा रोग (Purple Blotch)',
        symptoms:
          'पत्तियों पर छोटे बैंगनी रंग के धब्बे बनना, जो बाद में सूख जाती हैं।',
        solution:
          'रोग प्रबंधन के लिए स्थानीय कृषि विशेषज्ञ या कृषि विभाग की अनुशंसित विधि अपनाएं।',
      },
      {
        name: 'थ्रिप्स (Thrips Pest)',
        symptoms:
          'पत्तियों का पीला पड़ना और ऊपर की ओर मुड़ना।',
        solution:
          'कीट की पुष्टि के बाद स्थानीय कृषि विशेषज्ञ की अनुशंसा के अनुसार नियंत्रण उपाय अपनाएं।',
      },
    ],

    mandiPrice: {
      min: 7500,
      max: 16200,
      modal: 12500,
      previousModal: 11800,
      unit: 'क्विंटल',
      mandiName: 'नीमच मंडी',
    },

    priceHistory: [
      { date: '28 Sep', min: 7000, max: 15500, modal: 11500 },
      { date: '29 Sep', min: 7200, max: 15800, modal: 11800 },
      { date: '30 Sep', min: 7100, max: 15600, modal: 11600 },
      { date: '01 Oct', min: 7300, max: 16000, modal: 12000 },
      { date: '02 Oct', min: 7400, max: 16100, modal: 12200 },
      { date: '03 Oct', min: 7500, max: 16200, modal: 12500 },
    ],
  },

  soyabean: {
    slug: 'soyabean',
    name: 'सोयाबीन',
    englishName: 'Soyabean',
    scientificName: 'Glycine max',
    category: 'खरीफ / तिलहन फसल',
    season: 'खरीफ (Kharif)',
    icon: '🌱',

    overview:
      'सोयाबीन मध्य प्रदेश को "सोया राज्य" का दर्जा दिलाती है। यह प्रोटीन एवं खाद्य तेल का मुख्य स्रोत है।',

    author: 'कृषि मित्र टीम',

    publishedAt: '03 अक्टूबर 2026',

    updatedAt: 'आज',

    readTime: '7 मिनट',

    views: 12450,

    likes: 842,

    tags: [
      'सोयाबीन',
      'खरीफ',
      'तिलहन',
      'नीमच',
      'मंदसौर',
      'मंडी भाव',
    ],

    varieties: [
      {
        name: 'JS 20-34',
        yield: '20-25 क्विंटल/हेक्टेयर',
        feature: 'कम समय में पकने वाली, सूखा सहनशील।',
      },
      {
        name: 'JS 20-29',
        yield: '25-30 क्विंटल/हेक्टेयर',
        feature: 'रोग प्रतिरोधी, घनी फलियां।',
      },
      {
        name: 'NRC 86',
        yield: '22-26 क्विंटल/हेक्टेयर',
        feature: 'पीला मोज़ेक रोग के प्रति अत्यधिक प्रतिरोधी।',
      },
    ],

    soilRequirement:
      'मध्यम से गहरी काली मिट्टी जिसमें जल निकास की उत्तम व्यवस्था हो। pH मान 6.5 - 7.5।',

    sowingTime:
      '20 जून से 15 जुलाई (मानसून की पहली पर्याप्त वर्षा के बाद)',

    waterRequirement:
      'मुख्यतः मानसूनी वर्षा पर निर्भर; फली बनते समय सिंचाई आवश्यक।',

    seedRate: '75-80 किग्रा प्रति हेक्टेयर',

    harvestingTime: 'सितंबर - अक्टूबर',

    topDemandMandi: 'उज्जैन, नीमच, इंदौर मंडी',

    diseases: [
      {
        name: 'पीला मोज़ेक वायरस (Yellow Mosaic)',
        symptoms:
          'पत्तियों पर पीले रंग के चकत्ते बनना और वृद्धि रुकना।',
        solution:
          'रोग की पुष्टि और नियंत्रण के लिए स्थानीय कृषि विशेषज्ञ या कृषि विभाग की अनुशंसा अपनाएं।',
      },
    ],

    mandiPrice: {
      min: 4200,
      max: 4850,
      modal: 4650,
      previousModal: 4720,
      unit: 'क्विंटल',
      mandiName: 'नीमच मंडी',
    },

    priceHistory: [
      { date: '28 Sep', min: 4100, max: 4750, modal: 4500 },
      { date: '29 Sep', min: 4150, max: 4800, modal: 4580 },
      { date: '30 Sep', min: 4200, max: 4820, modal: 4620 },
      { date: '01 Oct', min: 4250, max: 4900, modal: 4700 },
      { date: '02 Oct', min: 4200, max: 4880, modal: 4720 },
      { date: '03 Oct', min: 4200, max: 4850, modal: 4650 },
    ],
  },
};

/* =========================================================
   RELATED CROPS
========================================================= */

const relatedCrops = [
  {
    slug: 'garlic',
    name: 'लहसुन',
    icon: '🧄',
    category: 'मसाला',
  },
  {
    slug: 'soyabean',
    name: 'सोयाबीन',
    icon: '🌱',
    category: 'तिलहन',
  },
  {
    slug: 'wheat',
    name: 'गेहूं',
    icon: '🌾',
    category: 'अनाज',
  },
  {
    slug: 'gram',
    name: 'चना',
    icon: '🫘',
    category: 'दलहन',
  },
];

/* =========================================================
   ARTICLE SECTIONS
========================================================= */

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
  const slug = params?.slug || 'garlic';

  const initialCrop =
    cropDetailsDatabase[slug] || cropDetailsDatabase.garlic;

  const [crop, setCrop] = useState(initialCrop);

  const [loading, setLoading] = useState(true);

  const [activeSection, setActiveSection] =
    useState('overview');

  const [isBookmarked, setIsBookmarked] =
    useState(false);

  const [isLiked, setIsLiked] =
    useState(false);

  const [likes, setLikes] =
    useState(initialCrop.likes);

  const [views, setViews] =
    useState(initialCrop.views);

  const [showShare, setShowShare] =
    useState(false);

  const [chartMode, setChartMode] =
    useState('modal');

  const [landArea, setLandArea] =
    useState(1);

  const [landUnit, setLandUnit] =
    useState('bigha');

  const [yieldPerUnit, setYieldPerUnit] =
    useState(10);

  const [activeTab, setActiveTab] =
    useState('agronomy');

  const [comment, setComment] =
    useState('');

  const [comments, setComments] =
    useState([]);

  /* =====================================================
     STORAGE
  ===================================================== */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bookmarkKey = `krishi-bookmark-${slug}`;
    const likeKey = `krishi-like-${slug}`;
    const viewKey = `krishi-view-${slug}`;

    setIsBookmarked(
      localStorage.getItem(bookmarkKey) === 'true'
    );

    setIsLiked(
      localStorage.getItem(likeKey) === 'true'
    );

    const viewed = sessionStorage.getItem(viewKey);

    if (!viewed) {
      setViews(initialCrop.views + 1);
      sessionStorage.setItem(viewKey, 'true');
    }
  }, [slug, initialCrop.views]);

  /* =====================================================
     LIVE MANDI API
  ===================================================== */

  useEffect(() => {
    async function fetchLatestPrice() {
      setLoading(true);

      try {
        const rates = await getDynamicMandiRates({
          crop: initialCrop.slug,
        });

        if (rates && rates.length > 0) {
          const matchedRate =
            rates.find(
              (rate) =>
                rate.cropEnglish
                  ?.toLowerCase()
                  .includes(initialCrop.slug) ||
                rate.crop
                  ?.toLowerCase()
                  .includes(initialCrop.slug)
            ) || rates[0];

          if (matchedRate) {
            setCrop((previous) => ({
              ...previous,

              mandiPrice: {
                min:
                  matchedRate.minPrice ||
                  previous.mandiPrice.min,

                max:
                  matchedRate.maxPrice ||
                  previous.mandiPrice.max,

                modal:
                  matchedRate.modalPrice ||
                  previous.mandiPrice.modal,

                previousModal:
                  previous.mandiPrice.modal,

                unit:
                  matchedRate.unit ||
                  previous.mandiPrice.unit,

                mandiName:
                  matchedRate.mandi ||
                  previous.mandiPrice.mandiName,
              },
            }));
          }
        }
      } catch (error) {
        console.error(
          'Failed to update crop price:',
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPrice();
  }, [initialCrop.slug]);

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

  const toggleLike = () => {
    const next = !isLiked;

    setIsLiked(next);

    setLikes((previous) =>
      next
        ? previous + 1
        : Math.max(0, previous - 1)
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `krishi-like-${slug}`,
        String(next)
      );
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

  const submitComment = () => {
    const text = comment.trim();

    if (!text) return;

    setComments((previous) => [
      ...previous,
      {
        id: Date.now(),
        text,
        time: 'अभी',
      },
    ]);

    setComment('');
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
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition ${
                isLiked
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

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={submitComment}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
                  >
                    सवाल पोस्ट करें
                    <Send className="h-4 w-4" />
                  </button>
                </div>

                {comments.length > 0 && (
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    {comments.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-slate-50 p-4"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <User className="h-4 w-4" />
                          किसान
                          <span className="font-normal text-slate-400">
                            • {item.time}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
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

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {relatedCrops
                  .filter(
                    (item) =>
                      item.slug !== crop.slug
                  )
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/crops/${item.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                    >
                      <div className="text-3xl">
                        {item.icon}
                      </div>

                      <div className="mt-3 font-extrabold text-slate-900 group-hover:text-emerald-700">
                        {item.name}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        {item.category}
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700">
                        पढ़ें
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  ))}
              </div>
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
          className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${
            isLiked
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