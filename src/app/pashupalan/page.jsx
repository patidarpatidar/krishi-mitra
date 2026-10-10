
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Milk,
  HeartPulse,
  Sprout,
  Bird,
  Beef,
  Calculator,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  Wallet,
  Wheat,
  Stethoscope,
  CalendarDays,
  Droplets,
  IndianRupee,
  Tractor,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { publicApiRequest, unwrapApiList } from "@/lib/publicApi";

const livestockCategories = [
  {
    id: "all",
    label: "सभी जानकारी",
    icon: Sprout,
  },
  {
    id: "dairy",
    label: "गाय-भैंस पालन",
    icon: Beef,
  },
  {
    id: "goat",
    label: "बकरी पालन",
    icon: Beef,
  },
  {
    id: "poultry",
    label: "मुर्गी पालन",
    icon: Bird,
  },
  {
    id: "fodder",
    label: "चारा प्रबंधन",
    icon: Wheat,
  },
  {
    id: "health",
    label: "पशु स्वास्थ्य",
    icon: HeartPulse,
  },
];

const livestockArticleIcons = {
  dairy: Beef,
  goat: Beef,
  poultry: Bird,
  fodder: Wheat,
  health: HeartPulse,
  schemes: ShieldCheck,
};

const livestockArticleColors = {
  dairy: "bg-amber-50 text-amber-800",
  goat: "bg-green-50 text-green-800",
  poultry: "bg-orange-50 text-orange-800",
  fodder: "bg-lime-50 text-lime-800",
  health: "bg-rose-50 text-rose-800",
  schemes: "bg-sky-50 text-sky-800",
};

const quickGuides = [
  {
    title: "पशु खरीदने से पहले",
    description:
      "पशु की उम्र, स्वास्थ्य, दूध उत्पादन और उपलब्ध रिकॉर्ड की जाँच करें।",
    icon: CheckCircle2,
  },
  {
    title: "रोजाना का आहार",
    description:
      "पशु की अवस्था, वजन, दूध उत्पादन और स्थानीय चारे के अनुसार आहार तय करें।",
    icon: Wheat,
  },
  {
    title: "दूध का हिसाब",
    description:
      "रोजाना दूध, बिक्री मूल्य और खर्च दर्ज करके वास्तविक लाभ समझें।",
    icon: IndianRupee,
  },
  {
    title: "स्वास्थ्य रिकॉर्ड",
    description:
      "टीकाकरण, कृमिनाशक और पशु चिकित्सक की सलाह का रिकॉर्ड रखें।",
    icon: Stethoscope,
  },
];

const faqs = [
  {
    question: "डेयरी शुरू करने से पहले क्या तैयारी करनी चाहिए?",
    answer:
      "पहले स्थानीय दूध खरीदार, चारा-पानी की उपलब्धता, पशु आवास, शुरुआती खर्च, दैनिक देखभाल और नजदीकी पशु चिकित्सक की व्यवस्था देखें। पशु खरीदने से पहले उसकी स्वास्थ्य जाँच करवाएँ।",
  },
  {
    question: "दूध उत्पादन से रोजाना आय कैसे निकालें?",
    answer:
      "दूध देने वाले पशुओं की संख्या को प्रति पशु औसत दैनिक दूध और प्रति लीटर बिक्री मूल्य से गुणा करें। इसके बाद चारा, दाना, श्रम, दवा, परिवहन और अन्य खर्च घटाकर अनुमानित लाभ निकालें।",
  },
  {
    question: "पशु बीमार दिखाई दे तो क्या करें?",
    answer:
      "भूख कम होना, बुखार, साँस लेने में कठिनाई, दूध में अचानक कमी या असामान्य व्यवहार दिखे तो पशु चिकित्सक से संपर्क करें। बिना सलाह दवा या एंटीबायोटिक न दें।",
  },
  {
    question: "पशुपालन की सरकारी योजनाओं की जानकारी कहाँ मिलेगी?",
    answer:
      "योजना की वर्तमान पात्रता और आवेदन प्रक्रिया के लिए पशुपालन एवं डेयरी विभाग, मध्य प्रदेश सरकार या अपने जिले के पशु चिकित्सा विभाग से पुष्टि करें।",
  },
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-green-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default function PashupalanPage() {
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [faqOpen, setFaqOpen] = useState(0);

  const [animalCount, setAnimalCount] = useState("3");
  const [milkPerAnimal, setMilkPerAnimal] = useState("8");
  const [milkPrice, setMilkPrice] = useState("45");
  const [dailyCost, setDailyCost] = useState("500");

  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
      let cancelled = false;

      publicApiRequest("/livestock?status=published&limit=20")
        .then((result) => {
          if (cancelled) return;

          const publishedArticles = unwrapApiList(result, [
            "articles",
            "livestock",
          ]).map((article) => {
            const category =
              typeof article.category === "string"
                ? article.category
                : article.category?.key || article.category?.slug || "";
            const firstSection = Array.isArray(article.sections)
              ? article.sections.find((section) => section?.content)
              : null;
            const points = [
              ...(Array.isArray(article.facts)
                ? article.facts.map((fact) =>
                    Array.isArray(fact) ? fact.filter(Boolean).join(": ") : ""
                  )
                : []),
              ...(Array.isArray(article.sections)
                ? article.sections.flatMap((section) =>
                    Array.isArray(section.points) ? section.points : []
                  )
                : []),
            ].filter(Boolean);

            return {
              ...article,
              id: article._id || article.id || article.slug,
              category,
              title: article.title || "",
              subtitle: article.subtitle || article.categoryLabel || "",
              description:
                article.intro || firstSection?.content || article.subtitle || "",
              points,
              icon: livestockArticleIcons[category] || Sprout,
              color: livestockArticleColors[category] || "bg-green-50 text-green-800",
              href: `/pashupalan/${encodeURIComponent(article.slug || "")}`,
            };
          });

          setArticles(publishedArticles);
        })
        .catch((error) => {
          if (!cancelled) {
            setArticlesError(error.message || "पशुपालन की जानकारी लोड नहीं हो सकी।");
          }
        })
        .finally(() => {
          if (!cancelled) setLoadingArticles(false);
        });

      return () => {
        cancelled = true;
      };
  }, []);

  const filteredServices = useMemo(() => {
      const query = search.trim().toLowerCase();

      return articles.filter((item) => {
        const categoryMatch =
          activeCategory === "all" ||
          item.category === activeCategory ||
          (activeCategory === "health" && item.category === "schemes");

      const searchMatch = [
        item.title,
        item.subtitle,
        item.description,
        ...item.points,
      ].some((value) => String(value || "").toLowerCase().includes(query));

        return categoryMatch && searchMatch;
      });
  }, [activeCategory, articles, search]);

  const animals = Math.max(0, Number(animalCount) || 0);
  const milk = Math.max(0, Number(milkPerAnimal) || 0);
  const price = Math.max(0, Number(milkPrice) || 0);
  const cost = Math.max(0, Number(dailyCost) || 0);

  const dailyMilk = animals * milk;
  const dailyIncome = dailyMilk * price;
  const dailyProfit = dailyIncome - cost;

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#f4f8ef]">
        <div className="absolute -right-24 -top-20 -z-10 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -bottom-28 left-0 -z-10 h-72 w-72 rounded-full bg-yellow-100/60 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-2 text-xs font-semibold text-green-800 sm:text-sm">
              <Sprout size={16} />
              किसानों के लिए पशुपालन मार्गदर्शिका
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              पशुपालन से
              <span className="block text-green-700">
                बढ़ाएँ अपनी आमदनी
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              गाय-भैंस, बकरी, मुर्गी पालन, चारा प्रबंधन और पशु स्वास्थ्य की
              उपयोगी जानकारी — आसान हिंदी में, आपके खेत और डेयरी के लिए।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#livestock-services"
                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-800"
              >
                जानकारी देखें
                <ArrowRight size={17} />
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowCalculator(true);
                  document
                    .getElementById("dairy-calculator")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3.5 text-sm font-bold text-green-800 transition hover:bg-green-50"
              >
                <Calculator size={17} />
                दूध आय कैलकुलेटर
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                सरल हिंदी जानकारी
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-700" />
                आय-खर्च का हिसाब
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border border-white bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-green-100 p-3 text-green-800">
                  <Milk size={23} />
                </span>
                <div>
                  <p className="text-xs text-slate-500">डेयरी प्रबंधन</p>
                  <p className="text-sm font-bold">बेहतर हिसाब, बेहतर योजना</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl shadow-green-950/10">
              <img
                src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=90"
                alt="भारतीय डेयरी फार्म में गाय"
                className="h-[340px] w-full object-cover sm:h-[440px]"
              />
            </div>

            <div className="absolute -bottom-5 right-3 rounded-2xl border border-green-100 bg-white p-4 shadow-xl sm:right-6 sm:p-5">
              <p className="text-xs text-slate-500">आपकी अगली शुरुआत</p>
              <p className="mt-1 font-bold text-green-800">
                सही जानकारी से करें
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { icon: Beef, label: "गाय-भैंस पालन" },
            { icon: Bird, label: "मुर्गी एवं बकरी पालन" },
            { icon: Wheat, label: "चारा एवं पोषण" },
            { icon: HeartPulse, label: "पशु स्वास्थ्य" },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center gap-3 p-2">
                <span className="rounded-xl bg-green-50 p-3 text-green-800">
                  <Icon size={21} />
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section
        id="livestock-services"
        className="mx-auto max-w-7xl scroll-mt-6 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <SectionHeading
          eyebrow="Livestock Knowledge"
          title="आप किस बारे में जानना चाहते हैं?"
          description="अपनी जरूरत के अनुसार विषय चुनें या खोजकर पशुपालन से जुड़ी जानकारी पाएँ।"
        />

        {articlesError && (
          <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {articlesError}
          </p>
        )}

        {loadingArticles && (
          <p role="status" className="mb-5 text-sm text-slate-500">
            पशुपालन की जानकारी लोड हो रही है...
          </p>
        )}

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
          {livestockCategories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-900/10"
                    : "border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <Icon size={17} />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="relative mb-8 max-w-xl">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="जैसे: दूध, बकरी, चारा, स्वास्थ्य..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
          />
        </div>

        {filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
            <Search className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="font-bold">कोई जानकारी नहीं मिली</p>
            <p className="mt-2 text-sm text-slate-500">
              {loadingArticles
                ? "जानकारी लोड होने तक प्रतीक्षा करें।"
                : "दूसरी category चुनें या search बदलें।"}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="mt-4 text-sm font-bold text-green-700"
            >
              सभी जानकारी दिखाएँ
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-950/5"
                >
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-green-50">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Icon size={56} className="text-green-200" />
                    )}
                    <div
                      className={`absolute left-4 top-4 rounded-xl p-3 shadow-sm ${service.color}`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold text-green-700">
                      {service.subtitle}
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.points.map((point) => (
                        <span
                          key={point}
                          className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600"
                        >
                          {point}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={service.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-800 hover:text-green-600"
                    >
                      पूरी जानकारी देखें
                      <ArrowUpRight size={17} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* DAIRY CALCULATOR */}
      <section
        id="dairy-calculator"
        className="scroll-mt-8 bg-[#f5f8f1] py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="self-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-bold text-green-800">
              <Calculator size={16} />
              Free Dairy Calculator
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              अपनी डेयरी की
              <span className="block text-green-700">
                रोजाना आय का हिसाब करें
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              दूध देने वाले पशुओं की संख्या, औसत दूध, बिक्री भाव और दैनिक खर्च
              डालें। अनुमानित आय और खर्च के बाद बची राशि तुरंत देखें।
            </p>

            <div className="mt-6 space-y-3">
              {[
                "दैनिक दूध उत्पादन का अनुमान",
                "दूध की बिक्री से कुल आय",
                "दैनिक खर्च घटाने के बाद अनुमानित राशि",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-700"
                >
                  <CheckCircle2 size={18} className="shrink-0 text-green-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-green-950/5 sm:p-7">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <Milk size={25} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">दूध आय कैलकुलेटर</h3>
                <p className="text-xs text-slate-500">
                  अपने वास्तविक आँकड़े भरें
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <CalculatorField
                label="दूध देने वाले पशु"
                value={animalCount}
                onChange={setAnimalCount}
                suffix="पशु"
                min="0"
              />

              <CalculatorField
                label="प्रति पशु दूध / दिन"
                value={milkPerAnimal}
                onChange={setMilkPerAnimal}
                suffix="लीटर"
                min="0"
                step="0.5"
              />

              <CalculatorField
                label="दूध का बिक्री भाव"
                value={milkPrice}
                onChange={setMilkPrice}
                suffix="₹ / लीटर"
                min="0"
                step="0.5"
              />

              <CalculatorField
                label="कुल दैनिक खर्च"
                value={dailyCost}
                onChange={setDailyCost}
                suffix="₹ / दिन"
                min="0"
              />
            </div>

            <div className="mt-7 rounded-2xl bg-green-800 p-5 text-white sm:p-6">
              <p className="text-sm text-green-100">
                अनुमानित दैनिक बिक्री आय
              </p>
              <p className="mt-2 text-3xl font-black sm:text-4xl">
                {money(dailyIncome)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div>
                  <p className="text-xs text-green-100">दैनिक दूध</p>
                  <p className="mt-1 text-lg font-bold">
                    {dailyMilk.toLocaleString("en-IN")} लीटर
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-100">
                    खर्च के बाद अनुमान
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {money(dailyProfit)}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              यह केवल अनुमान है, वास्तविक लाभ नहीं। इसमें दूध न देने वाले
              पशु, बदलता उत्पादन, सूखा काल, श्रम, ब्याज, परिवहन, उपकरण,
              पशु खरीद और अन्य खर्च शामिल नहीं हैं, जब तक आप उन्हें दैनिक
              खर्च में शामिल न करें।
            </p>
          </div>
        </div>
      </section>

      {/* PRACTICAL GUIDES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Farmer's Guide"
          title="पशुपालन के जरूरी सुझाव"
          description="छोटी-छोटी अच्छी आदतें पशुओं की देखभाल और व्यवसाय का हिसाब बेहतर करने में मदद करती हैं।"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickGuides.map((guide, index) => {
            const Icon = guide.icon;

            return (
              <div
                key={guide.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-green-50 p-3 text-green-800">
                    <Icon size={22} />
                  </span>
                  <span className="text-sm font-black text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-5 font-extrabold">{guide.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {guide.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SCHEMES CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-green-900 p-6 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-green-100">
                <ShieldCheck size={16} />
                सरकारी योजनाएँ एवं सहायता
              </span>

              <h2 className="mt-5 max-w-2xl text-2xl font-black sm:text-3xl">
                पशुपालन योजनाओं की जानकारी खोज रहे हैं?
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-green-100 sm:text-base">
                पात्रता, जरूरी दस्तावेज और आवेदन प्रक्रिया की जानकारी
                आधिकारिक स्रोतों से सत्यापित करके देखें।
              </p>
            </div>

            <Link
              href="/pashupalan/sarkari-yojana"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-green-900 transition hover:bg-green-50"
            >
              योजनाएँ देखें
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Frequently Asked Questions"
            title="पशुपालन से जुड़े सामान्य सवाल"
            description="डेयरी और पशुपालन शुरू करने से पहले इन उपयोगी सवालों के जवाब पढ़ें।"
          />

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const open = faqOpen === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setFaqOpen(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <span className="font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-green-700 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600 sm:px-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-green-100 bg-green-50 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              पशुपालन से जुड़ा कोई सवाल है?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              अपना सवाल भेजें। बीमारी या आपात स्थिति में सीधे पशु चिकित्सक से संपर्क करें।
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white hover:bg-green-800"
          >
            <MessageCircle size={18} />
            पूछताछ करें
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function CalculatorField({
  label,
  value,
  onChange,
  suffix,
  min = "0",
  step = "1",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 px-3 py-3 text-sm outline-none"
        />
        <span className="flex shrink-0 items-center border-l border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
          {suffix}
        </span>
      </div>
    </label>
  );
}