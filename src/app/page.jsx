"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronDown,
  Clock,
  Sparkles,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Calculator,
  MessageSquare,
  CloudSun,
  Sprout,
  Wheat,
  Leaf,
  Tractor,
  Menu,
  X,
} from "lucide-react";

import HomeCarousel from "@/components/HomeCarousel";
import { homeSlides } from "@/data/homeSlides";

import { getDynamicMandiRates } from "@/services/mandiApi";
import { getNeemuchWeather } from "@/services/weatherApi";

/* =========================================================
   CONSTANTS
========================================================= */

const PRESET_STATES = [
  "Madhya Pradesh",
  "Rajasthan",
  "Gujarat",
  "Uttar Pradesh",
  "Maharashtra",
  "Punjab",
  "Haryana",
];

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

const categories = [
  {
    title: "सोयाबीन",
    icon: "🌱",
    href: "/crops/soyabean",
    type: "crop",
  },
  {
    title: "लहसुन",
    icon: "🧄",
    href: "/crops/garlic",
    type: "crop",
  },
  {
    title: "गेहूं",
    icon: "🌾",
    href: "/crops/wheat",
    type: "crop",
  },
  {
    title: "चना",
    icon: "🫘",
    href: "/crops/gram",
    type: "crop",
  },
  {
    title: "मक्का",
    icon: "🌽",
    href: "/crops/maize",
    type: "crop",
  },
  {
    title: "पशुपालन",
    icon: "🐄",
    href: "/pashupalan",
    type: "service",
  },
  {
    title: "जैविक खाद",
    icon: "🪴",
    href: "/organic-farming",
    type: "service",
  },
  {
    title: "ड्रोन तकनीक",
    icon: "🚁",
    href: "/agri-tech",
    type: "service",
  },
];

const blogPosts = [
  {
    id: 1,
    title: "लहसुन में थ्रिप्स व पीलापन रोकने के अचूक उपाय",
    excerpt:
      "लहसुन की फसल में समय रहते थ्रिप्स और फफूंद जनित रोगों को नियंत्रित करने के वैज्ञानिक तरीके।",
    category: "फसल सुरक्षा",
    readTime: "4 मिनट",
    date: "28 सित",
    emoji: "🧄",
    bg: "bg-emerald-100",
    href: "/blog/garlic-thrips-control",
  },
  {
    id: 2,
    title: "आधुनिक ड्रोन छिड़काव: समय और पैसे दोनों की बचत",
    excerpt:
      "कीटनाशकों और तरल उर्वरकों का ड्रोन द्वारा समान छिड़काव करने के फायदे और लागत विश्लेषण।",
    category: "कृषि तकनीक",
    readTime: "5 मिनट",
    date: "26 सित",
    emoji: "🚁",
    bg: "bg-sky-100",
    href: "/blog/drone-spraying-guide",
  },
  {
    id: 3,
    title: "जैविक खाद वर्मीकंपोस्ट घर पर तैयार करने का तरीका",
    excerpt:
      "कम लागत में उच्च गुणवत्ता वाली केंचुआ खाद बनाकर मिट्टी की उर्वरा शक्ति कैसे बढ़ाएं।",
    category: "जैविक खेती",
    readTime: "6 मिनट",
    date: "24 सित",
    emoji: "🌱",
    bg: "bg-amber-100",
    href: "/blog/vermicompost-guide",
  },
];

const quickTips = [
  {
    id: 1,
    question: "लहसुन और गेहूं में सिंचाई का सही समय क्या है?",
    answer:
      "सिंचाई हमेशा शाम के समय करें। हल्की और नियमित सिंचाई पौधों को तनाव से बचाती है और जड़ों के विकास में सहायक होती है।",
  },
  {
    id: 2,
    question: "मिट्टी परीक्षण क्यों जरूरी है?",
    answer:
      "मिट्टी परीक्षण से भूमि में मौजूद पोषक तत्वों की जानकारी मिलती है, जिससे आवश्यकता से अधिक उर्वरक देने से बच सकते हैं।",
  },
  {
    id: 3,
    question: "कीटनाशक प्रयोग करते समय क्या सावधानियां रखें?",
    answer:
      "सुरक्षा मास्क पहनें, हवा की दिशा का ध्यान रखें और अनुशंसित मात्रा से अधिक रसायन का प्रयोग न करें।",
  },
];

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  /* -------------------------------------------------------
     MANDI STATE
  ------------------------------------------------------- */

  const [selectedState, setSelectedState] =
    useState("Madhya Pradesh");

  const [selectedDistrict, setSelectedDistrict] =
    useState("Neemuch");

  const [selectedMandi, setSelectedMandi] =
    useState("Neemuch");

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

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  const [activeCategoryTab, setActiveCategoryTab] =
    useState("all");

  /* -------------------------------------------------------
     FAQ
  ------------------------------------------------------- */

  const [activeAccordion, setActiveAccordion] =
    useState(null);

  /* -------------------------------------------------------
     CALCULATOR
  ------------------------------------------------------- */

  const [landArea, setLandArea] = useState(1);

  const [selectedCropCalc, setSelectedCropCalc] =
    useState("wheat");

  /* -------------------------------------------------------
     ACTIVE VALUES
  ------------------------------------------------------- */

  const activeDistrict =
    customDistrict.trim() || selectedDistrict;

  const activeMandi =
    customMandi.trim() || selectedMandi;

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
     CATEGORY FILTER
  ========================================================= */

  const filteredCategories = categories.filter((cat) => {
    if (activeCategoryTab === "crops") {
      return cat.type === "crop";
    }

    if (activeCategoryTab === "services") {
      return cat.type === "service";
    }

    return true;
  });

  /* =========================================================
     FAQ
  ========================================================= */

  const toggleAccordion = (id) => {
    setActiveAccordion(
      activeAccordion === id ? null : id
    );
  };

  /* =========================================================
     SEED CALCULATOR
  ========================================================= */

  const rateMap = {
    wheat: 40,
    garlic: 250,
    soyabean: 30,
    gram: 30,
    maize: 8,
  };

  const seedEstimate =
    (rateMap[selectedCropCalc] || 30) * landArea;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

     

      {/* =====================================================
          HERO CAROUSEL
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">

        <HomeCarousel
          slides={homeSlides}
        />

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
                        LIVE WEATHER
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
                          {weatherData?.temperature ?? 28}°
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
                              {weatherData?.windSpeed ?? 12} km/h
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
                              {weatherData?.humidity ?? 45}%
                            </p>
                          </div>
                        </div>

                      </div>

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
                        फसल एवं कृषि सेवाएं
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
                    ["services", "सेवाएं"],
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

                {filteredCategories.map((cat) => (

                  <Link
                    key={cat.title}
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

                ))}

              </div>

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
              {activeMandi || "मंडी"} मंडी भाव
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

        <select
          value={selectedState}
          onChange={(e) =>
            setSelectedState(e.target.value)
          }
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
        >

          {PRESET_STATES.map((state) => (

            <option
              key={state}
              value={state}
            >
              {state}
            </option>

          ))}

        </select>

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
          value={
            customDistrict ||
            selectedDistrict
          }
          onChange={(e) => {

            setCustomDistrict(
              e.target.value
            );

            setSelectedDistrict("");

          }}
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
          value={
            customMandi ||
            selectedMandi
          }
          onChange={(e) => {

            setCustomMandi(
              e.target.value
            );

            setSelectedMandi("");

          }}
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
                      value={selectedCropCalc}
                      onChange={(e) =>
                        setSelectedCropCalc(
                          e.target.value
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
                    >

                      <option value="wheat">
                        गेहूं
                      </option>

                      <option value="garlic">
                        लहसुन
                      </option>

                      <option value="soyabean">
                        सोयाबीन
                      </option>

                      <option value="gram">
                        चना
                      </option>

                      <option value="maize">
                        मक्का
                      </option>

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
                      {seedEstimate}
                      <span className="
                        text-sm
                        ml-1
                      ">
                        kg
                      </span>
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

                {blogPosts.map((post) => (

                  <article
                    key={post.id}
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

                      <div className={`
                        w-12 h-12
                        shrink-0
                        rounded-xl
                        ${post.bg}
                        flex
                        items-center
                        justify-center
                        text-2xl
                      `}>
                        {post.emoji}
                      </div>

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
                            {post.category}
                          </span>

                          <span className="
                            flex
                            items-center
                            gap-1
                          ">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>

                        </div>

                        <Link
                          href={post.href}
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
                      {post.excerpt}
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
                        {post.date}
                      </span>

                      <Link
                        href={post.href}
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

                ))}

              </div>

            </section>

            {/* =================================================
                FAQ
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
                gap-2
                pb-3
                border-b
                border-slate-100
              ">

                <div className="
                  w-8 h-8
                  rounded-lg
                  bg-amber-100
                  flex
                  items-center
                  justify-center
                ">
                  <HelpCircle className="
                    w-4 h-4
                    text-amber-700
                  " />
                </div>

                <div>

                  <h2 className="
                    text-sm
                    font-black
                  ">
                    किसान प्रश्नोत्तरी
                  </h2>

                  <p className="
                    text-[9px]
                    text-slate-400
                  ">
                    खेती से जुड़े सामान्य सवाल
                  </p>

                </div>

              </div>

              <div className="space-y-2 mt-4">

               {quickTips.map((tip) => {
  const active = activeAccordion === tip.id;

  return (
    <div
      key={tip.id}
      className="border border-slate-200 rounded-xl overflow-hidden"
    >
      <button
        type="button"
        onClick={() => toggleAccordion(tip.id)}
        className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-slate-50 transition"
      >
        <span className="flex items-start gap-2 text-[11px] font-bold text-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />

          {tip.question}
        </span>

        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
            active ? "rotate-180" : ""
          }`}
        />
      </button>

      {active && (
        <div className="px-3 pb-3 pt-1 text-[10px] text-slate-600 leading-relaxed border-t border-slate-100">
          {tip.answer}
        </div>
      )}
    </div>
  );
})}

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