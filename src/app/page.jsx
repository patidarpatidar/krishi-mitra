"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";

import {
  Search,
  MapPin,
  RefreshCw,
  Calendar,
  TrendingUp,
  ArrowRight,
  Sun,
  Wind,
  Droplets,
  BookOpen,
  Clock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Calculator,
  MessageSquare,
  CloudSun,
  Sprout,
  Wheat,
  X,
} from "lucide-react";

import HomeCarousel from "@/components/HomeCarousel";

import { getDynamicMandiRates } from "@/services/mandiApi";
import { getNeemuchWeather } from "@/services/weatherApi";
import { publicApiRequest, unwrapApiList } from "@/lib/publicApi";

/* =========================================================
   CONSTANTS
========================================================= */

const quickActions = [
  {
    title: "मंडी भाव",
    subtitle: "आज के ताज़ा भाव",
    icon: TrendingUp,
    href: "#mandi-section",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "मौसम",
    subtitle: "5 दिन का पूर्वानुमान",
    icon: CloudSun,
    href: "/weather",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
  },
  {
    title: "फसल जानकारी",
    subtitle: "खेती की पूरी जानकारी",
    icon: Sprout,
    href: "/crops",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-700",
  },
  {
    title: "कृषि सलाह",
    subtitle: "विशेषज्ञों की सलाह",
    icon: MessageSquare,
    href: "/advisory",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];

function getCategoryLabel(category) {
  if (typeof category === "string") return category;
  return (
    category?.label ||
    category?.name ||
    category?.title ||
    category?.key ||
    category?.slug ||
    ""
  );
}

function getSeedRatePerAcre(seedRate) {
  const value = String(seedRate || "").trim();
  if (!value || !/(?:kg|किग्रा|किलो|किलोग्राम)/i.test(value)) return null;

  const values = [...value.matchAll(/\d+(?:\.\d+)?/g)]
    .map(([number]) => Number(number))
    .filter((number) => Number.isFinite(number) && number > 0);
  if (!values.length) return null;

  const average = values.reduce((sum, number) => sum + number, 0) / values.length;
  if (/(?:\/\s*ha\b|per\s+hectare|hectare|हेक्टेयर)/i.test(value)) {
    return average / 2.47105;
  }
  if (/(?:\/\s*acre\b|per\s+acre|एकड़)/i.test(value)) {
    return average;
  }

  return null;
}

function formatHomeDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("hi-IN", { dateStyle: "medium" }).format(date);
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  /* -------------------------------------------------------
     MANDI STATE
  ------------------------------------------------------- */

  const [selectedState, setSelectedState] = useState("");

  const [customDistrict, setCustomDistrict] = useState("");
  const [customMandi, setCustomMandi] = useState("");

  const [mandiRates, setMandiRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingMandi, setLoadingMandi] = useState(false);

  /* -------------------------------------------------------
     WEATHER
  ------------------------------------------------------- */

  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  /* -------------------------------------------------------
     HOMEPAGE CONTENT
  ------------------------------------------------------- */

  const [homeCategories, setHomeCategories] = useState([]);
  const [homeCrops, setHomeCrops] = useState([]);
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [loadingHomeContent, setLoadingHomeContent] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [blogError, setBlogError] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] =
    useState("all");

  /* -------------------------------------------------------
     CALCULATOR
  ------------------------------------------------------- */

  const [landArea, setLandArea] = useState(1);

  const [selectedCropCalc, setSelectedCropCalc] = useState("");

  /* -------------------------------------------------------
     ACTIVE VALUES
  ------------------------------------------------------- */

  const activeDistrict = customDistrict.trim();

  const activeMandi = customMandi.trim();

  const mandiStates = useMemo(
    () => [...new Set(mandiRates.map((item) => item.state).filter(Boolean))],
    [mandiRates],
  );
  const mandiDistricts = useMemo(
    () =>
      [
        ...new Set(
          mandiRates
            .filter(
              (item) => !selectedState || item.state === selectedState,
            )
            .map((item) => item.district)
            .filter(Boolean),
        ),
      ],
    [mandiRates, selectedState],
  );
  const mandiMarkets = useMemo(
    () =>
      [
        ...new Set(
          mandiRates
            .filter(
              (item) =>
                (!selectedState || item.state === selectedState) &&
                (!activeDistrict || item.district === activeDistrict),
            )
            .map((item) => item.mandi)
            .filter(Boolean),
        ),
      ],
    [mandiRates, selectedState, activeDistrict],
  );

  const homeSlides = useMemo(() => {
    const blogSlides = homeBlogs
      .filter((blog) => blog.slug && blog.title)
      .slice(0, 5)
      .map((blog) => ({
        id: blog._id || blog.slug,
        image: blog.heroImage || blog.coverImage || "",
        badge: blog.categoryLabel ||
          getCategoryLabel(blog.category) ||
          "कृषि ब्लॉग",
        title: blog.title,
        highlight: "",
        description: blog.excerpt || blog.description || "",
        primaryButton: {
          text: "लेख पढ़ें",
          href: `/blog/${encodeURIComponent(blog.slug)}`,
        },
        secondaryButton: { text: "सभी लेख", href: "/blog" },
      }));

    if (blogSlides.length) return blogSlides;

    return homeCrops
      .filter((crop) => crop.slug && crop.name)
      .slice(0, 5)
      .map((crop) => ({
        id: crop._id || crop.slug,
        image: crop.image || crop.coverImage || "",
        badge: getCategoryLabel(crop.category) || crop.name,
        title: crop.name,
        highlight: "",
        description: crop.description || crop.subtitle || "",
        primaryButton: {
          text: "फसल देखें",
          href: `/crops/${encodeURIComponent(crop.slug)}`,
        },
        secondaryButton: { text: "सभी फसलें", href: "/crops" },
      }));
  }, [homeBlogs, homeCrops]);

  const visibleCategories = homeCategories.filter((category) => {
    if (activeCategoryTab === "crops") return category.type === "crop";
    if (activeCategoryTab === "services") return category.type === "service";
    return true;
  });

  const seedRateCrops = useMemo(
    () =>
      homeCrops
        .map((crop) => ({
          ...crop,
          seedRatePerAcre: getSeedRatePerAcre(crop.seedRate),
          id: crop._id || crop.slug,
        }))
        .filter((crop) => crop.id && crop.seedRatePerAcre),
    [homeCrops],
  );
  const selectedSeedCrop =
    seedRateCrops.find((crop) => crop.id === selectedCropCalc) ||
    seedRateCrops[0];
  const seedEstimate = selectedSeedCrop
    ? Number((selectedSeedCrop.seedRatePerAcre * landArea).toFixed(1))
    : null;

  useEffect(() => {
    let cancelled = false;
    const requests = [
      ["crops", "/crops?status=published&limit=100"],
      ["cropCategories", "/crop-categories?status=active"],
      ["blogs", "/blogs?limit=100"],
      ["blogCategories", "/blog-categories"],
      ["organicCategories", "/organic-categories?status=active"],
      ["livestock", "/livestock?status=published&limit=100"],
      ["schemes", "/schemes?status=active&limit=100"],
    ];

    Promise.allSettled(
      requests.map(([, path]) => publicApiRequest(path)),
    )
      .then((results) => {
        if (cancelled) return;

        const records = {};
        const categoryFailures = [];
        let failedBlogs = false;

        results.forEach((result, index) => {
          const [key] = requests[index];
          if (result.status === "fulfilled") {
            records[key] = unwrapApiList(result.value, [
              "articles",
              "recipes",
              "schemes",
            ]);
          } else if (key === "blogs" || key === "blogCategories") {
            failedBlogs = true;
          } else {
            categoryFailures.push(result.reason?.message);
          }
        });

        const crops = records.crops || [];
        const cropCategories = records.cropCategories || [];
        const categories = [];
        const seenCategories = new Set();
        const addCategory = (category, type, href, fallbackIcon) => {
          const title = getCategoryLabel(category);
          if (!title) return;
          const key =
            type === "crop"
              ? category?.key || category?.slug || category?._id || title
              : category?.slug ||
                category?.key ||
                category?._id ||
                category?.id ||
                title;
          const uniqueKey = `${type}:${key}`;
          if (seenCategories.has(uniqueKey)) return;
          seenCategories.add(uniqueKey);
          categories.push({
            id: uniqueKey,
            title,
            icon: category?.icon || category?.emoji || fallbackIcon,
            href:
              type === "crop"
                ? `/crops?category=${encodeURIComponent(key)}`
                : href,
            type,
          });
        };

        cropCategories.forEach((category) =>
          addCategory(category, "crop", "/crops", "🌱"),
        );
        if (!cropCategories.length) {
          const cropCategoryMap = new Map();
          crops.forEach((crop) => {
            const category =
              crop.category && typeof crop.category === "object"
                ? crop.category
                : {
                    key: crop.category,
                    label: crop.categoryLabel || crop.category,
                  };
            if (getCategoryLabel(category)) {
              cropCategoryMap.set(
                category.key || getCategoryLabel(category),
                category,
              );
            }
          });
          cropCategoryMap.forEach((category) =>
            addCategory(category, "crop", "/crops", "🌱"),
          );
        }

        (records.blogCategories || []).forEach((category) => {
          const categoryId =
            category._id || category.id || category.slug;
          addCategory(
            category,
            "service",
            `/blog?category=${encodeURIComponent(categoryId)}`,
            "📚",
          );
        });
        (records.organicCategories || []).forEach((category) => {
          const categoryId =
            category.slug || category._id || category.id;
          addCategory(
            category,
            "service",
            `/organic-farming?category=${encodeURIComponent(categoryId)}`,
            "🌿",
          );
        });

        const livestockCategories = new Map();
        (records.livestock || []).forEach((article) => {
          const category =
            article.category && typeof article.category === "object"
              ? article.category
              : {
                  key: article.category,
                  label: article.categoryLabel || article.category,
                };
          if (getCategoryLabel(category)) {
            livestockCategories.set(
              category.key || getCategoryLabel(category),
              category,
            );
          }
        });
        livestockCategories.forEach((category) =>
          addCategory(category, "service", "/pashupalan", "🐄"),
        );

        const schemeCategories = new Map();
        (records.schemes || []).forEach((scheme) => {
          const category =
            scheme.category && typeof scheme.category === "object"
              ? scheme.category
              : {
                  key: scheme.category,
                  label: scheme.categoryLabel || scheme.category,
                };
          if (getCategoryLabel(category)) {
            schemeCategories.set(
              category.key || getCategoryLabel(category),
              category,
            );
          }
        });
        schemeCategories.forEach((category) =>
          addCategory(category, "service", "/govt-schemes", "🏛️"),
        );

        const blogCategories = records.blogCategories || [];
        const blogs = (records.blogs || []).map((blog) => {
          const categoryId =
            blog.categoryId?._id ||
            blog.categoryId?.id ||
            blog.categoryId?.slug ||
            blog.categoryId;
          const category = blogCategories.find((item) =>
            [item._id, item.id, item.slug].includes(categoryId),
          );
          return {
            ...blog,
            categoryLabel:
              getCategoryLabel(blog.category) ||
              (typeof blog.categoryId === "object"
                ? getCategoryLabel(blog.categoryId)
                : "") ||
              getCategoryLabel(category),
          };
        });

        setHomeCrops(crops);
        setHomeBlogs(blogs);
        setHomeCategories(categories);
        setCategoryError(
          categoryFailures.length
            ? "कुछ श्रेणियां अभी लोड नहीं हो सकीं।"
            : "",
        );
        setBlogError(
          failedBlogs ? "ब्लॉग अभी लोड नहीं हो सके।" : "",
        );
      })
      .finally(() => {
        if (!cancelled) setLoadingHomeContent(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      seedRateCrops.length &&
      !seedRateCrops.some((crop) => crop.id === selectedCropCalc)
    ) {
      setSelectedCropCalc(seedRateCrops[0].id);
    }
  }, [seedRateCrops, selectedCropCalc]);

  /* =========================================================
     WEATHER
  ========================================================= */

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoadingWeather(true);

        const weather = await getNeemuchWeather();

        setWeatherData(weather);
      } catch (error) {
        console.error("Weather error:", error);
        setWeatherError(error.message || "मौसम की जानकारी उपलब्ध नहीं है।");
      } finally {
        setLoadingWeather(false);
      }
    }

    loadWeather();
  }, []);

  /* =========================================================
     MANDI API
  ========================================================= */

 const fetchMandiRates = useCallback(async () => {
  try {
    setLoadingMandi(true);

    const rates = await getDynamicMandiRates({
      state: selectedState,
      district: activeDistrict,
      mandi: activeMandi,
      forceRefresh: true,
    });

    setMandiRates(rates || []);
  } catch (error) {
    console.error("Mandi API error:", error);
    setMandiRates([]);
  } finally {
    setLoadingMandi(false);
  }
}, [
  selectedState,
  activeDistrict,
  activeMandi,
]);
const parseMandiDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const raw = String(value).trim();

  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = raw.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
  );

  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getMandiRecordDate = (item) => {
  return (
    item?.arrivalDate ||
    item?.arrival_date ||
    item?.date ||
    item?.arrivalDateFormatted ||
    item?.updatedAt ||
    null
  );
};

const getFormattedMandiDate = (item) => {
  const date = parseMandiDate(
    getMandiRecordDate(item)
  );

  if (!date) return "तारीख उपलब्ध नहीं";

  return date.toLocaleDateString("hi-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const latestMandiDate = mandiRates.reduce(
  (latest, item) => {
    const currentDate = parseMandiDate(
      getMandiRecordDate(item)
    );

    if (!currentDate) return latest;

    if (!latest || currentDate > latest) {
      return currentDate;
    }

    return latest;
  },
  null
);

const latestMandiDateText = latestMandiDate
  ? latestMandiDate.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  : "डेटा उपलब्ध नहीं";


  useEffect(() => {
    fetchMandiRates();
  }, [fetchMandiRates]);

  /* =========================================================
     MANDI SEARCH
  ========================================================= */

  const filteredRates = mandiRates.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.crop?.toLowerCase().includes(search) ||
      item.cropEnglish?.toLowerCase().includes(search)
    );
  });

  const latestRates = [...filteredRates].sort((a, b) => {
  const dateA = parseMandiDate(
    getMandiRecordDate(a)
  );

  const dateB = parseMandiDate(
    getMandiRecordDate(b)
  );

  return (
    (dateB?.getTime() || 0) -
    (dateA?.getTime() || 0)
  );
});
  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

     

      {/* =====================================================
          HERO CAROUSEL
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">

        {homeSlides.length ? (
          <HomeCarousel slides={homeSlides} />
        ) : loadingHomeContent ? (
          <div className="min-h-[300px] rounded-[2rem] bg-slate-200 animate-pulse" />
        ) : (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
            {blogError || "अभी दिखाने के लिए कोई प्रकाशित लेख या फसल उपलब्ध नहीं है।"}
          </p>
        )}

      </section>

      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="
                  group
                  bg-white
                  border border-slate-200
                  rounded-2xl
                  p-4
                  flex items-center gap-3
                  hover:border-emerald-300
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                "
              >

                <div
                  className={`
                    w-11 h-11
                    rounded-xl
                    flex items-center justify-center
                    shrink-0
                    ${item.iconBg}
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${item.iconColor}`}
                  />
                </div>

                <div className="min-w-0">

                  <h3 className="text-sm font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {item.subtitle}
                  </p>

                </div>

                <ArrowRight
                  className="
                    w-4 h-4
                    ml-auto
                    text-slate-300
                    group-hover:text-emerald-600
                    group-hover:translate-x-1
                    transition
                  "
                />

              </Link>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-14">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

          {/* =================================================
              MAIN COLUMN
          ================================================= */}

          <main className="lg:col-span-8 space-y-7">

            {/* =================================================
                WEATHER + FARMER INFO
            ================================================= */}

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* WEATHER */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-gradient-to-br
                  from-sky-500
                  via-blue-600
                  to-indigo-700
                  text-white
                  p-5
                  shadow-lg
                "
              >

                <div className="absolute -right-10 -top-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div>

                      <span className="
                        inline-flex
                        items-center
                        gap-1
                        px-2.5 py-1
                        bg-white/15
                        rounded-full
                        text-[10px]
                        font-bold
                      ">
                        <CloudSun className="w-3 h-3" />
                        {weatherData ? "LIVE WEATHER" : "मौसम अपडेट"}
                      </span>

                      <h2 className="text-lg font-black mt-3">
                        नीमच का मौसम
                      </h2>

                      <p className="text-xs text-sky-100">
                        मध्य प्रदेश
                      </p>

                    </div>

                    <Sun className="w-9 h-9 text-amber-300" />

                  </div>

                  {loadingWeather ? (

                    <div className="py-8 text-center">

                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />

                      <p className="text-xs mt-2 text-sky-100">
                        मौसम लोड हो रहा है...
                      </p>

                    </div>

                  ) : (

                    <>

                      <div className="flex items-end gap-2 mt-6">

                        <span className="text-4xl font-black">
                          {weatherData?.temperature ?? "—"}°
                        </span>

                        <span className="text-lg font-bold mb-1">
                          C
                        </span>

                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-5">

                        <div className="
                          bg-white/10
                          rounded-xl
                          p-2.5
                          flex items-center gap-2
                        ">
                          <Wind className="w-4 h-4" />

                          <div>
                            <p className="text-[9px] text-sky-200">
                              हवा
                            </p>
                            <p className="text-xs font-bold">
                              {weatherData?.windSpeed ?? "—"} km/h
                            </p>
                          </div>
                        </div>

                        <div className="
                          bg-white/10
                          rounded-xl
                          p-2.5
                          flex items-center gap-2
                        ">
                          <Droplets className="w-4 h-4" />

                          <div>
                            <p className="text-[9px] text-sky-200">
                              आद्रता
                            </p>
                            <p className="text-xs font-bold">
                              {weatherData?.humidity ?? "—"}%
                            </p>
                          </div>
                        </div>

                      </div>
                      {weatherError && (
                        <p className="mt-3 text-[10px] text-sky-100">
                          {weatherError}
                        </p>
                      )}

                      <Link
                        href="/weather"
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          text-xs
                          font-bold
                          text-amber-300
                        "
                      >
                        पूरा मौसम देखें
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                    </>
                  )}

                </div>

              </div>

              {/* FARMER CARD */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  bg-gradient-to-br
                  from-emerald-900
                  to-teal-800
                  text-white
                  p-5
                  shadow-lg
                "
              >

                <div className="absolute right-0 bottom-0 text-[110px] opacity-10">
                  🌾
                </div>

                <div className="relative">

                  <span className="
                    inline-flex
                    items-center
                    gap-1
                    px-2.5 py-1
                    bg-amber-400
                    text-slate-950
                    rounded-full
                    text-[10px]
                    font-black
                  ">
                    <Sparkles className="w-3 h-3" />
                    किसान मित्र
                  </span>

                  <h2 className="text-2xl font-black mt-4 leading-tight">
                    सही जानकारी,
                    <span className="block text-amber-300">
                      बेहतर खेती
                    </span>
                  </h2>

                  <p className="text-xs text-emerald-100 leading-relaxed mt-3 max-w-sm">
                    मंडी भाव, मौसम, फसल जानकारी और खेती की उपयोगी सलाह —
                    किसान के लिए एक ही जगह।
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-5">

                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-lg font-black">
                        🌾
                      </p>
                      <p className="text-[10px] text-emerald-100 mt-1">
                        फसल जानकारी
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-lg font-black">
                        📈
                      </p>
                      <p className="text-[10px] text-emerald-100 mt-1">
                        मंडी भाव
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                CATEGORIES
            ================================================= */}

            <section
              className="
                bg-white
                border border-slate-200
                rounded-3xl
                p-5 sm:p-6
                shadow-sm
              "
            >

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
                border-b
                border-slate-100
                pb-4
              ">

                <div>

                  <div className="flex items-center gap-2">

                    <div className="
                      w-9 h-9
                      rounded-xl
                      bg-emerald-100
                      flex items-center justify-center
                    ">
                      <Sprout className="w-5 h-5 text-emerald-700" />
                    </div>

                    <div>

                      <h2 className="text-lg font-black">
                        कृषि श्रेणियां
                      </h2>

                      <p className="text-[11px] text-slate-500">
                        अपनी जरूरत के अनुसार जानकारी चुनें
                      </p>

                    </div>

                  </div>

                </div>

                {/* TABS */}

                <div className="
                  flex
                  items-center
                  gap-1
                  bg-slate-100
                  p-1
                  rounded-xl
                ">

                  {[
                    ["all", "सभी"],
                    ["crops", "फसलें"],
                    ["services", "अन्य विषय"],
                  ].map(([value, label]) => (

                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setActiveCategoryTab(value)
                      }
                      className={`
                        px-3 py-1.5
                        rounded-lg
                        text-[11px]
                        font-bold
                        transition
                        ${
                          activeCategoryTab === value
                            ? "bg-emerald-700 text-white shadow"
                            : "text-slate-600 hover:text-emerald-700"
                        }
                      `}
                    >
                      {label}
                    </button>

                  ))}

                </div>

              </div>

              <div className="
                grid
                grid-cols-2
                sm:grid-cols-4
                gap-3
                mt-5
              ">

                {loadingHomeContent ? (
                  <p className="col-span-full py-5 text-center text-xs text-slate-500">
                    श्रेणियां लोड हो रही हैं…
                  </p>
                ) : visibleCategories.length ? (
                  visibleCategories.map((cat) => (

                  <Link
                    key={cat.id}
                    href={cat.href}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      text-center
                      hover:bg-emerald-50
                      hover:border-emerald-300
                      hover:-translate-y-1
                      hover:shadow-md
                      transition-all
                    "
                  >

                    <span className="
                      block
                      text-3xl
                      group-hover:scale-110
                      transition-transform
                    ">
                      {cat.icon}
                    </span>

                    <span className="
                      block
                      mt-2
                      text-xs
                      font-black
                      text-slate-800
                      group-hover:text-emerald-800
                    ">
                      {cat.title}
                    </span>

                    <ArrowRight
                      className="
                        w-3.5 h-3.5
                        mx-auto
                        mt-2
                        text-slate-300
                        group-hover:text-emerald-600
                        group-hover:translate-x-1
                        transition
                      "
                    />

                  </Link>

                  ))
                ) : (
                  <p className="col-span-full py-5 text-center text-xs text-slate-500">
                    {categoryError || "अभी कोई श्रेणी उपलब्ध नहीं है।"}
                  </p>
                )}

              </div>
              {!!categoryError && visibleCategories.length > 0 && (
                <p className="mt-3 text-[10px] text-amber-700">
                  {categoryError}
                </p>
              )}

            </section>

            {/* =================================================
                MANDI
            ================================================= */}

           {/* =================================================
    MANDI BHAV
================================================= */}

<section
  id="mandi-section"
  className="
    bg-white
    border border-slate-200
    rounded-3xl
    p-5 sm:p-6
    shadow-sm
    overflow-hidden
  "
>

  {/* =================================================
      HEADER
  ================================================= */}

  <div
    className="
      flex
      flex-col
      lg:flex-row
      lg:items-center
      lg:justify-between
      gap-4
      pb-5
      border-b
      border-slate-100
    "
  >

    {/* TITLE */}

    <div>

      <div className="flex items-start gap-3">

        <div
          className="
            w-11 h-11
            shrink-0
            rounded-2xl
            bg-emerald-100
            flex
            items-center
            justify-center
          "
        >
          <TrendingUp
            className="w-5 h-5 text-emerald-700"
          />
        </div>

        <div>

          <div className="flex flex-wrap items-center gap-2">

            <h2
              className="
                text-xl
                sm:text-2xl
                font-black
                text-slate-900
              "
            >
              {activeMandi ? `${activeMandi} मंडी भाव` : "मंडी भाव"}
            </h2>

            <span
              className="
                inline-flex
                items-center
                gap-1
                px-2
                py-1
                rounded-full
                bg-emerald-100
                text-emerald-700
                text-[9px]
                font-black
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE DATA
            </span>

          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              mt-1
            "
          >

            <p className="text-[11px] text-slate-500">
              {activeDistrict}, {selectedState}
            </p>

            {latestMandiDate && (
              <>
                <span className="text-slate-300">
                  •
                </span>

                <span
                  className="
                    text-[10px]
                    font-bold
                    text-emerald-700
                  "
                >
                  नवीनतम उपलब्ध भाव:{" "}
                  {latestMandiDateText}
                </span>
              </>
            )}

          </div>

        </div>

      </div>

    </div>

    {/* HEADER ACTIONS */}

    <div
      className="
        flex
        items-center
        justify-between
        sm:justify-end
        gap-2
      "
    >

      {/* LATEST DATE */}

      <div
        className="
          flex
          items-center
          gap-2
          px-3
          py-2
          bg-emerald-50
          border
          border-emerald-200
          rounded-xl
        "
      >

        <Calendar
          className="
            w-3.5
            h-3.5
            text-emerald-700
          "
        />

        <div>

          <p
            className="
              text-[8px]
              text-emerald-600
              font-bold
              uppercase
            "
          >
            भाव की तारीख
          </p>

          <p
            className="
              text-[10px]
              text-emerald-900
              font-black
              mt-0.5
            "
          >
            {latestMandiDateText}
          </p>

        </div>

      </div>

      {/* REFRESH */}

      <button
        type="button"
        onClick={fetchMandiRates}
        disabled={loadingMandi}
        className="
          w-10
          h-10
          shrink-0
          flex
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          text-slate-700
          hover:bg-emerald-100
          hover:text-emerald-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
        title="नवीनतम मंडी भाव रिफ्रेश करें"
      >

        <RefreshCw
          className={`
            w-4
            h-4
            ${loadingMandi ? "animate-spin" : ""}
          `}
        />

      </button>

    </div>

  </div>


  {/* =================================================
      SUMMARY CARDS
  ================================================= */}

  {!loadingMandi && filteredRates.length > 0 && (

    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        gap-3
        mt-5
      "
    >

      {/* TOTAL CROPS */}

      <div
        className="
          rounded-2xl
          bg-slate-50
          border border-slate-200
          p-3.5
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              w-8 h-8
              rounded-xl
              bg-emerald-100
              flex
              items-center
              justify-center
            "
          >
            <Wheat
              className="
                w-4
                h-4
                text-emerald-700
              "
            />
          </div>

          <div>

            <p className="text-[9px] text-slate-400">
              उपलब्ध फसलें
            </p>

            <p className="text-lg font-black text-slate-900">
              {filteredRates.length}
            </p>

          </div>

        </div>

      </div>


      {/* LATEST DATE */}

      <div
        className="
          rounded-2xl
          bg-emerald-50
          border border-emerald-100
          p-3.5
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              w-8 h-8
              rounded-xl
              bg-white
              flex
              items-center
              justify-center
            "
          >
            <Calendar
              className="
                w-4
                h-4
                text-emerald-700
              "
            />
          </div>

          <div>

            <p className="text-[9px] text-emerald-600">
              नवीनतम डेटा
            </p>

            <p className="text-sm font-black text-emerald-900">
              {latestMandiDateText}
            </p>

          </div>

        </div>

      </div>


      {/* TOP PRICE */}

      <div
        className="
          col-span-2
          sm:col-span-1
          rounded-2xl
          bg-amber-50
          border border-amber-100
          p-3.5
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              w-8 h-8
              rounded-xl
              bg-amber-100
              flex
              items-center
              justify-center
            "
          >
            <TrendingUp
              className="
                w-4
                h-4
                text-amber-700
              "
            />
          </div>

          <div className="min-w-0">

            <p className="text-[9px] text-amber-700">
              सबसे अधिक मॉडल भाव
            </p>

            <p className="text-sm font-black text-amber-900 truncate">

              {(() => {
                const top = [...filteredRates]
                  .filter(
                    (item) =>
                      Number(
                        item.modalPrice ??
                        item.modalRate
                      ) > 0
                  )
                  .sort(
                    (a, b) =>
                      Number(
                        b.modalPrice ??
                        b.modalRate ??
                        0
                      ) -
                      Number(
                        a.modalPrice ??
                        a.modalRate ??
                        0
                      )
                  )[0];

                if (!top) {
                  return "—";
                }

                return `₹${Number(
                  top.modalPrice ??
                  top.modalRate
                ).toLocaleString("en-IN")}`;

              })()}

            </p>

          </div>

        </div>

      </div>

    </div>

  )}


  {/* =================================================
      LOCATION FILTER
  ================================================= */}

  <div
    className="
      mt-5
      p-4
      rounded-2xl
      bg-slate-50
      border border-slate-200
    "
  >

    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        mb-3
      "
    >

      <div>

        <h3
          className="
            text-xs
            font-black
            text-slate-800
          "
        >
          मंडी चुनें
        </h3>

        <p
          className="
            text-[9px]
            text-slate-400
            mt-0.5
          "
        >
          राज्य, जिला और मंडी के अनुसार भाव देखें
        </p>

      </div>

      <MapPin
        className="
          w-4
          h-4
          text-emerald-600
        "
      />

    </div>


    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-3
      "
    >

      {/* STATE */}

      <div>

        <label
          className="
            block
            text-[10px]
            font-bold
            text-slate-600
            mb-1.5
          "
        >
          राज्य
        </label>

        <input
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setCustomDistrict("");
            setCustomMandi("");
          }}
          list="home-mandi-states"
          placeholder="राज्य का नाम"
          className="
            w-full
            p-2.5
            bg-white
            border border-slate-300
            rounded-xl
            text-xs
            font-bold
            text-slate-800
            outline-none
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-100
          "
        />
        <datalist id="home-mandi-states">
          {mandiStates.map((state) => (
            <option key={state} value={state} />
          ))}
        </datalist>

      </div>


      {/* DISTRICT */}

      <div>

        <label
          className="
            block
            text-[10px]
            font-bold
            text-slate-600
            mb-1.5
          "
        >
          जिला
        </label>

        <input
          value={customDistrict}
          onChange={(e) => {
            setCustomDistrict(e.target.value);
            setCustomMandi("");
          }}
          list="home-mandi-districts"
          placeholder="जैसे: नीमच"
          className="
            w-full
            p-2.5
            bg-white
            border border-slate-300
            rounded-xl
            text-xs
            font-bold
            text-slate-800
            outline-none
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-100
          "
        />
        <datalist id="home-mandi-districts">
          {mandiDistricts.map((district) => (
            <option key={district} value={district} />
          ))}
        </datalist>

      </div>


      {/* MANDI */}

      <div>

        <label
          className="
            block
            text-[10px]
            font-bold
            text-slate-600
            mb-1.5
          "
        >
          मंडी
        </label>

        <input
          value={customMandi}
          onChange={(e) => setCustomMandi(e.target.value)}
          list="home-mandi-markets"
          placeholder="जैसे: नीमच"
          className="
            w-full
            p-2.5
            bg-white
            border border-slate-300
            rounded-xl
            text-xs
            font-bold
            text-slate-800
            outline-none
            focus:border-emerald-500
            focus:ring-2
            focus:ring-emerald-100
          "
        />
        <datalist id="home-mandi-markets">
          {mandiMarkets.map((market) => (
            <option key={market} value={market} />
          ))}
        </datalist>

      </div>

    </div>

  </div>


  {/* =================================================
      SEARCH
  ================================================= */}

  <div className="mt-4">

    <div className="relative">

      <Search
        className="
          absolute
          left-3.5
          top-1/2
          -translate-y-1/2
          w-4
          h-4
          text-slate-400
        "
      />

      <input
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
        placeholder="फसल खोजें — लहसुन, सोयाबीन, गेहूं..."
        className="
          w-full
          pl-10
          pr-4
          py-3
          bg-slate-50
          border border-slate-200
          rounded-xl
          text-xs
          sm:text-sm
          text-slate-800
          outline-none
          focus:bg-white
          focus:border-emerald-500
          focus:ring-2
          focus:ring-emerald-100
          transition
        "
      />

      {searchTerm && (

        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            w-6
            h-6
            rounded-full
            bg-slate-200
            text-slate-500
            flex
            items-center
            justify-center
            hover:bg-slate-300
            transition
          "
          title="खोज हटाएं"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      )}

    </div>

  </div>


  {/* =================================================
      DATA INFO
  ================================================= */}

  {!loadingMandi && filteredRates.length > 0 && (

    <div
      className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-2
        mt-4
        px-1
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          text-[10px]
          text-slate-500
        "
      >

        <CheckCircle2
          className="
            w-3.5
            h-3.5
            text-emerald-600
          "
        />

        <span>
          नवीनतम उपलब्ध मंडी रिकॉर्ड
        </span>

      </div>

      <div
        className="
          flex
          items-center
          gap-1.5
          text-[10px]
          font-bold
          text-emerald-700
        "
      >

        <Calendar className="w-3.5 h-3.5" />

        {latestMandiDateText}

      </div>

    </div>

  )}


  {/* =================================================
      TABLE
  ================================================= */}

  <div className="mt-3">

    {loadingMandi ? (

      <div
        className="
          py-16
          text-center
          bg-slate-50
          border border-slate-200
          rounded-2xl
        "
      >

        <Loader2
          className="
            w-8
            h-8
            animate-spin
            text-emerald-600
            mx-auto
          "
        />

        <p
          className="
            text-xs
            font-black
            text-slate-700
            mt-3
          "
        >
          नवीनतम मंडी भाव लोड हो रहे हैं...
        </p>

        <p
          className="
            text-[10px]
            text-slate-400
            mt-1
          "
        >
          कृपया कुछ सेकंड प्रतीक्षा करें
        </p>

      </div>

    ) : filteredRates.length === 0 ? (

      <div
        className="
          py-14
          px-5
          text-center
          bg-slate-50
          border border-dashed
          border-slate-300
          rounded-2xl
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-white
            border border-slate-200
            mx-auto
            flex
            items-center
            justify-center
          "
        >
          <TrendingUp
            className="
              w-6
              h-6
              text-slate-300
            "
          />
        </div>

        <p
          className="
            text-sm
            font-black
            text-slate-700
            mt-4
          "
        >
          मंडी भाव उपलब्ध नहीं है
        </p>

        <p
          className="
            text-[10px]
            text-slate-400
            mt-1
            max-w-sm
            mx-auto
          "
        >
          मंडी, जिला या फसल का नाम बदलकर दोबारा
          प्रयास करें।
        </p>

        <button
          type="button"
          onClick={fetchMandiRates}
          className="
            mt-4
            inline-flex
            items-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-emerald-700
            hover:bg-emerald-800
            text-white
            text-xs
            font-black
            transition
          "
        >
          <RefreshCw className="w-3.5 h-3.5" />
          दोबारा प्रयास करें
        </button>

      </div>

    ) : (

      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-slate-200
        "
      >

        {/* DESKTOP TABLE */}

        <div className="hidden sm:block overflow-x-auto">

          <table
            className="
              w-full
              text-left
              text-xs
            "
          >

            <thead
              className="
                bg-emerald-800
                text-white
              "
            >

              <tr>

                <th className="p-3.5 font-black">
                  फसल
                </th>

                <th className="p-3.5 font-black">
                  न्यूनतम
                </th>

                <th className="p-3.5 font-black">
                  अधिकतम
                </th>

                <th className="p-3.5 font-black">
                  मॉडल भाव
                </th>

              </tr>

            </thead>

            <tbody
              className="
                divide-y
                divide-slate-100
              "
            >

              {latestRates.map(
                (item, index) => {

                  const minPrice =
                    Number(
                      item.minPrice ??
                      item.minRate ??
                      0
                    );

                  const maxPrice =
                    Number(
                      item.maxPrice ??
                      item.maxRate ??
                      0
                    );

                  const modalPrice =
                    Number(
                      item.modalPrice ??
                      item.modalRate ??
                      0
                    );

                  return (

                    <tr
                      key={
                        item.id ||
                        `${item.crop}-${index}`
                      }
                      className="
                        hover:bg-emerald-50/70
                        transition
                      "
                    >

                      {/* CROP */}

                      <td className="p-3.5">

                        <div
                          className="
                            flex
                            items-center
                            gap-2.5
                          "
                        >

                          <span
                            className="
                              w-2
                              h-2
                              rounded-full
                              bg-emerald-500
                              shrink-0
                            "
                          />

                          <div>

                            <p
                              className="
                                font-black
                                text-slate-900
                              "
                            >
                              {item.crop}
                            </p>

                            {item.cropEnglish && (
                              <p
                                className="
                                  text-[9px]
                                  text-slate-400
                                  mt-0.5
                                "
                              >
                                {item.cropEnglish}
                              </p>
                            )}

                            {getMandiRecordDate(item) && (
                              <p
                                className="
                                  text-[9px]
                                  text-slate-400
                                  mt-1
                                "
                              >
                                भाव:{" "}
                                {getFormattedMandiDate(
                                  item
                                )}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* MIN */}

                      <td
                        className="
                          p-3.5
                          text-slate-600
                          font-semibold
                          whitespace-nowrap
                        "
                      >

                        ₹
                        {minPrice
                          ? minPrice.toLocaleString(
                              "en-IN"
                            )
                          : "—"}

                        <span
                          className="
                            text-[9px]
                            text-slate-400
                            ml-1
                          "
                        >
                          / क्विंटल
                        </span>

                      </td>


                      {/* MAX */}

                      <td
                        className="
                          p-3.5
                          text-emerald-700
                          font-black
                          whitespace-nowrap
                        "
                      >

                        ₹
                        {maxPrice
                          ? maxPrice.toLocaleString(
                              "en-IN"
                            )
                          : "—"}

                        <span
                          className="
                            text-[9px]
                            text-slate-400
                            ml-1
                          "
                        >
                          / क्विंटल
                        </span>

                      </td>


                      {/* MODAL */}

                      <td className="p-3.5">

                        <span
                          className="
                            inline-flex
                            items-center
                            px-2.5
                            py-1.5
                            rounded-lg
                            bg-amber-100
                            text-amber-800
                            font-black
                            whitespace-nowrap
                          "
                        >

                          ₹
                          {modalPrice
                            ? modalPrice.toLocaleString(
                                "en-IN"
                              )
                            : "—"}

                        </span>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>


        {/* MOBILE CARDS */}

        <div className="sm:hidden divide-y divide-slate-100">

          {latestRates.map(
            (item, index) => {

              const minPrice =
                Number(
                  item.minPrice ??
                  item.minRate ??
                  0
                );

              const maxPrice =
                Number(
                  item.maxPrice ??
                  item.maxRate ??
                  0
                );

              const modalPrice =
                Number(
                  item.modalPrice ??
                  item.modalRate ??
                  0
                );

              return (

                <div
                  key={
                    item.id ||
                    `${item.crop}-mobile-${index}`
                  }
                  className="
                    p-4
                    bg-white
                    hover:bg-emerald-50/40
                    transition
                  "
                >

                  {/* CROP */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div className="flex items-start gap-2.5">

                      <span
                        className="
                          w-2
                          h-2
                          mt-1.5
                          rounded-full
                          bg-emerald-500
                        "
                      />

                      <div>

                        <p
                          className="
                            text-sm
                            font-black
                            text-slate-900
                          "
                        >
                          {item.crop}
                        </p>

                        {item.cropEnglish && (
                          <p
                            className="
                              text-[9px]
                              text-slate-400
                              mt-0.5
                            "
                          >
                            {item.cropEnglish}
                          </p>
                        )}

                      </div>

                    </div>

                    <span
                      className="
                        px-2
                        py-1
                        rounded-lg
                        bg-amber-100
                        text-amber-800
                        text-xs
                        font-black
                        whitespace-nowrap
                      "
                    >
                      ₹
                      {modalPrice
                        ? modalPrice.toLocaleString(
                            "en-IN"
                          )
                        : "—"}
                    </span>

                  </div>


                  {/* DATE */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      mt-3
                      text-[9px]
                      text-slate-400
                    "
                  >

                    <Calendar
                      className="
                        w-3
                        h-3
                      "
                    />

                    भाव की तारीख:
                    <span className="font-bold">
                      {getFormattedMandiDate(
                        item
                      )}
                    </span>

                  </div>


                  {/* PRICE GRID */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                      mt-3
                    "
                  >

                    <div
                      className="
                        rounded-xl
                        bg-slate-50
                        p-2.5
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          text-slate-400
                        "
                      >
                        न्यूनतम भाव
                      </p>

                      <p
                        className="
                          text-xs
                          font-black
                          text-slate-700
                          mt-0.5
                        "
                      >
                        ₹
                        {minPrice
                          ? minPrice.toLocaleString(
                              "en-IN"
                            )
                          : "—"}
                      </p>

                    </div>


                    <div
                      className="
                        rounded-xl
                        bg-emerald-50
                        p-2.5
                      "
                    >

                      <p
                        className="
                          text-[9px]
                          text-emerald-600
                        "
                      >
                        अधिकतम भाव
                      </p>

                      <p
                        className="
                          text-xs
                          font-black
                          text-emerald-800
                          mt-0.5
                        "
                      >
                        ₹
                        {maxPrice
                          ? maxPrice.toLocaleString(
                              "en-IN"
                            )
                          : "—"}
                      </p>

                    </div>

                  </div>

                  <p
                    className="
                      text-[8px]
                      text-slate-400
                      mt-2
                    "
                  >
                    सभी भाव ₹/क्विंटल
                  </p>

                </div>

              );

            }
          )}

        </div>

      </div>

    )}

  </div>


  {/* =================================================
      FOOTER ACTION
  ================================================= */}

  <div
    className="
      mt-4
      flex
      flex-col
      sm:flex-row
      gap-2
    "
  >

    <Link
      href="/mandi-bhav"
      className="
        flex-1
        flex
        items-center
        justify-center
        gap-2
        py-3
        rounded-xl
        bg-emerald-700
        hover:bg-emerald-800
        text-white
        text-xs
        font-black
        transition
        shadow-sm
      "
    >
      पूरी मंडी रिपोर्ट देखें
      <ArrowRight className="w-4 h-4" />
    </Link>

    <button
      type="button"
      onClick={fetchMandiRates}
      disabled={loadingMandi}
      className="
        sm:w-auto
        px-4
        py-3
        rounded-xl
        bg-slate-100
        hover:bg-emerald-50
        hover:text-emerald-700
        text-slate-700
        text-xs
        font-black
        transition
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-50
      "
    >

      <RefreshCw
        className={`
          w-3.5
          h-3.5
          ${loadingMandi ? "animate-spin" : ""}
        `}
      />

      रिफ्रेश

    </button>

  </div>


  {/* DATA SOURCE NOTE */}

  <div
    className="
      mt-3
      flex
      items-start
      gap-2
      px-1
    "
  >

    <CheckCircle2
      className="
        w-3.5
        h-3.5
        text-emerald-500
        mt-0.5
        shrink-0
      "
    />

    <p
      className="
        text-[9px]
        leading-relaxed
        text-slate-400
      "
    >
      मंडी भाव उपलब्ध सरकारी/डेटा स्रोत से प्राप्त नवीनतम
      उपलब्ध रिकॉर्ड के आधार पर दिखाए जाते हैं। सभी भाव
      ₹/क्विंटल में हैं। डेटा की उपलब्धता संबंधित मंडी
      रिकॉर्ड पर निर्भर करती है।
    </p>

  </div>

</section>

            {/* =================================================
                SEED CALCULATOR
            ================================================= */}

            <section className="
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-emerald-950
              to-teal-900
              text-white
              p-5 sm:p-6
            ">

              <div className="
                absolute
                -right-16
                -bottom-16
                w-56 h-56
                rounded-full
                bg-emerald-400/10
                blur-3xl
              " />

              <div className="relative">

                <div className="
                  flex
                  items-center
                  gap-3
                  mb-5
                ">

                  <div className="
                    w-10 h-10
                    rounded-xl
                    bg-amber-400
                    text-slate-950
                    flex
                    items-center
                    justify-center
                  ">
                    <Calculator className="w-5 h-5" />
                  </div>

                  <div>

                    <h2 className="
                      text-lg
                      font-black
                      text-amber-300
                    ">
                      बीज मात्रा कैलकुलेटर
                    </h2>

                    <p className="
                      text-[10px]
                      text-emerald-200
                    ">
                      खेत के अनुसार अनुमानित बीज आवश्यकता
                    </p>

                  </div>

                </div>

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                ">

                  <div>

                    <label className="
                      block
                      text-[11px]
                      font-bold
                      text-emerald-200
                      mb-1.5
                    ">
                      फसल
                    </label>

                    <select
                      value={selectedSeedCrop?.id || ""}
                      onChange={(e) =>
                        setSelectedCropCalc(
                          e.target.value
                        )
                      }
                      disabled={!seedRateCrops.length}
                      className="
                        w-full
                        p-3
                        rounded-xl
                        bg-emerald-900
                        border border-emerald-700
                        text-white
                        text-xs
                        font-bold
                        outline-none
                      "
                    >

                      {seedRateCrops.length ? (
                        seedRateCrops.map((crop) => (
                          <option key={crop.id} value={crop.id}>
                            {crop.name}
                          </option>
                        ))
                      ) : (
                        <option value="">
                          {loadingHomeContent
                            ? "फसलें लोड हो रही हैं…"
                            : "प्रति एकड़/हेक्टेयर दर उपलब्ध नहीं"}
                        </option>
                      )}

                    </select>

                  </div>

                  <div>

                    <label className="
                      block
                      text-[11px]
                      font-bold
                      text-emerald-200
                      mb-1.5
                    ">
                      जमीन — एकड़
                    </label>

                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={landArea}
                      onChange={(e) =>
                        setLandArea(
                          Math.max(
                            0.5,
                            Number(e.target.value) || 0.5
                          )
                        )
                      }
                      className="
                        w-full
                        p-3
                        rounded-xl
                        bg-emerald-900
                        border border-emerald-700
                        text-white
                        text-xs
                        font-bold
                        outline-none
                      "
                    />

                  </div>

                  <div className="
                    bg-white/10
                    border border-white/10
                    rounded-2xl
                    p-4
                    flex
                    flex-col
                    justify-center
                    items-center
                  ">

                    <span className="
                      text-[10px]
                      text-emerald-200
                      font-bold
                    ">
                      अनुमानित बीज
                    </span>

                    <span className="
                      text-3xl
                      font-black
                      text-amber-300
                      mt-1
                    ">
                      {seedEstimate === null ? "—" : seedEstimate}
                      {seedEstimate !== null && (
                        <span className="text-sm ml-1">kg</span>
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </section>

          </main>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="lg:col-span-4 space-y-6">

            {/* =================================================
                LATEST BLOG
            ================================================= */}

            <section className="
              bg-white
              border border-slate-200
              rounded-3xl
              p-5
              shadow-sm
            ">

              <div className="
                flex
                items-center
                justify-between
                pb-3
                border-b
                border-slate-100
              ">

                <div className="flex items-center gap-2">

                  <div className="
                    w-8 h-8
                    rounded-lg
                    bg-emerald-100
                    flex items-center justify-center
                  ">
                    <BookOpen className="
                      w-4 h-4
                      text-emerald-700
                    " />
                  </div>

                  <h2 className="
                    text-sm
                    font-black
                  ">
                    नवीनतम कृषि ब्लॉग
                  </h2>

                </div>

                <Link
                  href="/blog"
                  className="
                    text-[10px]
                    font-bold
                    text-emerald-700
                    flex
                    items-center
                    gap-1
                  "
                >
                  सभी
                  <ArrowRight className="w-3 h-3" />
                </Link>

              </div>

              <div className="space-y-3 mt-4">

                {loadingHomeContent ? (
                  <p className="py-5 text-center text-xs text-slate-500">
                    ब्लॉग लोड हो रहे हैं…
                  </p>
                ) : homeBlogs.length ? (
                  [...homeBlogs]
                    .sort(
                      (first, second) =>
                        new Date(second.date || second.publishedAt || 0) -
                        new Date(first.date || first.publishedAt || 0),
                    )
                    .slice(0, 3)
                    .map((post) => {
                      const postHref = post.slug
                        ? `/blog/${encodeURIComponent(post.slug)}`
                        : "/blog";
                      const category =
                        post.categoryLabel ||
                        getCategoryLabel(post.category) ||
                        "कृषि ब्लॉग";
                      const readTime = post.readTime
                        ? `${post.readTime} मिनट`
                        : "";
                      const postDate = formatHomeDate(
                        post.date || post.publishedAt,
                      );

                      return (

                  <article
                    key={post._id || post.slug}
                    className="
                      group
                      border border-slate-200
                      rounded-2xl
                      p-3
                      hover:border-emerald-300
                      hover:bg-emerald-50/30
                      transition
                    "
                  >

                    <div className="flex gap-3">

                      {post.coverImage || post.heroImage ? (
                        <img
                          src={post.coverImage || post.heroImage}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0">

                        <div className="
                          flex
                          items-center
                          gap-2
                          text-[9px]
                          text-slate-400
                        ">

                          <span className="
                            px-2 py-0.5
                            bg-emerald-100
                            text-emerald-700
                            rounded-full
                            font-bold
                          ">
                            {category}
                          </span>

                          {readTime && <span className="
                            flex
                            items-center
                            gap-1
                          ">
                            <Clock className="w-3 h-3" />
                            {readTime}
                          </span>}

                        </div>

                        <Link
                          href={postHref}
                          className="
                            block
                            mt-1.5
                            text-xs
                            font-black
                            leading-snug
                            text-slate-900
                            group-hover:text-emerald-700
                          "
                        >
                          {post.title}
                        </Link>

                      </div>

                    </div>

                    <p className="
                      text-[10px]
                      text-slate-500
                      leading-relaxed
                      mt-2
                      line-clamp-2
                    ">
                      {post.excerpt || post.description || ""}
                    </p>

                    <div className="
                      flex
                      items-center
                      justify-between
                      mt-3
                      pt-2
                      border-t
                      border-slate-100
                    ">

                      <span className="
                        text-[9px]
                        text-slate-400
                      ">
                        {postDate}
                      </span>

                      <Link
                        href={postHref}
                        className="
                          text-[10px]
                          font-bold
                          text-emerald-700
                          flex
                          items-center
                          gap-1
                        "
                      >
                        पढ़ें
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                    </div>

                  </article>

                      );
                    })
                ) : (
                  <p className="py-5 text-center text-xs text-slate-500">
                    {blogError || "अभी कोई प्रकाशित ब्लॉग उपलब्ध नहीं है।"}
                  </p>
                )}

              </div>

            </section>

            {/* =================================================
                EXPERT CTA
            ================================================= */}

            <section className="
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-br
              from-amber-400
              to-yellow-500
              p-5
              text-slate-950
            ">

              <div className="
                absolute
                -right-10
                -bottom-10
                text-[100px]
                opacity-10
              ">
                🌾
              </div>

              <div className="relative">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-white/40
                  flex
                  items-center
                  justify-center
                ">
                  <MessageSquare className="w-5 h-5" />
                </div>

                <h3 className="
                  text-lg
                  font-black
                  mt-3
                ">
                  फसल से जुड़ा सवाल है?
                </h3>

                <p className="
                  text-xs
                  font-medium
                  leading-relaxed
                  mt-2
                ">
                  अपनी फसल, रोग, कीट या खेती से जुड़ा सवाल पूछें।
                </p>

                <Link
                  href="/advisory"
                  className="
                    mt-4
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-slate-950
                    hover:bg-slate-800
                    text-white
                    py-3
                    rounded-xl
                    text-xs
                    font-black
                    transition
                  "
                >
                  कृषि सलाह लें
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </div>
  );
}