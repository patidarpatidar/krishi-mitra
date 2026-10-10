
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Heart,
  IndianRupee,
  Lightbulb,
  List,
  Milk,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Wallet,
  Wheat,
} from "lucide-react";
import { publicApiRequest, unwrapApiItem } from "@/lib/publicApi";

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-4 shadow-sm">
      <div className="mb-3 inline-flex rounded-xl bg-green-50 p-2 text-green-700">
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function PashupalanArticlePage() {
  const params = useParams();
  const slug = params?.slug;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [openFaq, setOpenFaq] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [animalCount, setAnimalCount] = useState(2);
  const [dailyMilk, setDailyMilk] = useState(8);
  const [milkPrice, setMilkPrice] = useState(50);
  const [monthlyCost, setMonthlyCost] = useState(12000);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);
    setLoadError("");

    publicApiRequest(`/livestock/slug/${encodeURIComponent(slug)}`)
      .then((result) => {
        const record = unwrapApiItem(result, ["article", "livestock", "item"]);
        if (!record || !(record.slug || record._id || record.id)) {
          throw new Error("इस विषय की प्रकाशित जानकारी उपलब्ध नहीं है।");
        }

        const category =
          typeof record.category === "string"
            ? record.category
            : record.category?.label || record.category?.name || "";
        const facts = Array.isArray(record.facts)
          ? record.facts
              .map((fact) =>
                Array.isArray(fact)
                  ? [String(fact[0] || ""), String(fact[1] || "")]
                  : [String(fact.label || fact.key || ""), String(fact.value || "")]
              )
              .filter(([label, value]) => label || value)
          : [];
        const sections = Array.isArray(record.sections)
          ? record.sections.map((section) => ({
              ...section,
              points: Array.isArray(section.points) ? section.points : [],
            }))
          : [];

        if (!cancelled) {
          setArticle({
            ...record,
            category,
            title: record.title || "",
            subtitle: record.subtitle || "",
            intro: record.intro || "",
            image: record.image || "",
            facts,
            sections,
            faqs: Array.isArray(record.faqs) ? record.faqs : [],
            readTime: record.readTime || "",
            updated:
              record.updatedLabel ||
              record.updatedAtContent ||
              record.updatedAt ||
              "",
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message || "पशुपालन का लेख लोड नहीं हो सका।");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sections = article?.sections || [];
  const faqs = article?.faqs || [];

  const estimate = useMemo(() => {
    const revenue = animalCount * dailyMilk * milkPrice * 30;
    const profit = revenue - monthlyCost;

    return {
      revenue,
      profit,
      yearly: profit * 12,
    };
  }, [animalCount, dailyMilk, milkPrice, monthlyCost]);

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number.isFinite(amount) ? amount : 0);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-500">
        पशुपालन की जानकारी लोड हो रही है...
      </main>
    );
  }

  if (loadError || !article) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p role="alert" className="mb-5 text-red-700">
          {loadError || "इस विषय की प्रकाशित जानकारी उपलब्ध नहीं है।"}
        </p>
        <Link href="/pashupalan" className="font-bold text-green-700">
          पशुपालन जानकारी पर वापस जाएं
        </Link>
      </main>
    );
  }

  async function shareArticle() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.subtitle,
          url,
        });
      } catch {
        // User may close the share sheet.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("इस लिंक को कॉपी करें:", url);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7faf7] text-gray-800">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-700">
            होम
          </Link>
          <ChevronRight size={15} />
          <Link href="/pashupalan" className="hover:text-green-700">
            पशुपालन
          </Link>
          <ChevronRight size={15} />
          <span className="font-medium text-green-800">
            {article.category}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800">
            <Sprout size={16} />
            {article.category}
          </span>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            {article.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              {article.readTime} पढ़ने का समय
            </span>
            <span>•</span>
            <span>अपडेट: {article.updated}</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#article-content"
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-green-800"
            >
              जानकारी पढ़ें <ArrowRight size={18} />
            </a>

            <button
              onClick={shareArticle}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold transition hover:border-green-300 hover:text-green-800"
            >
              <Share2 size={18} />
              {copied ? "लिंक कॉपी हो गया" : "शेयर करें"}
            </button>

            <button
              onClick={() => setSaved(!saved)}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold transition ${
                saved
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "सेव किया" : "सेव करें"}
            </button>
          </div>

          {saved && (
            <p className="mt-3 text-sm text-green-700">
              यह चयन अभी इसी पेज की स्थिति में सेव है। स्थायी बुकमार्क के लिए
              ब्राउज़र का Bookmark विकल्प इस्तेमाल करें।
            </p>
          )}
        </div>

        <div className="relative">
          {article.image ? (
            <img
              src={article.image}
              alt={article.title}
              className="h-[300px] w-full rounded-3xl object-cover shadow-lg sm:h-[420px]"
            />
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center rounded-3xl bg-green-100 text-green-700 sm:h-[420px]">
              <Sprout size={64} />
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/50 bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <Lightbulb size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-900">शुरुआती सलाह</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  निवेश से पहले स्थानीय बाजार, वास्तविक लागत और विशेषज्ञ की
                  सलाह जरूर जांचें।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {article.facts.map((fact, index) => {
            const icons = [Sprout, Wallet, TrendingUp, ShieldCheck];
            const Icon = icons[index % icons.length];

            return (
              <InfoCard
                key={fact[0]}
                icon={Icon}
                label={fact[0]}
                value={fact[1]}
              />
            );
          })}
        </div>
      </section>

      {/* Article and sidebar */}
      <section
        id="article-content"
        className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8"
      >
        <article className="min-w-0">
          {/* Intro */}
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-green-100 p-3 text-green-800">
                <BookOpen size={23} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-950">
                इस लेख में क्या जानेंगे?
              </h2>
            </div>
            <p className="text-base leading-8 text-gray-600">{article.intro}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {sections.slice(0, 4).map((section) => (
                <div
                  key={section.id || section.title}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-green-700"
                  />
                  {section.title}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive table of contents */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              aria-expanded={tocOpen}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <span className="flex items-center gap-3 text-lg font-extrabold text-gray-950">
                <List size={22} className="text-green-700" />
                विषय सूची
              </span>
              <ChevronDown
                className={`transition-transform ${
                  tocOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {tocOpen && (
              <nav className="mt-4 space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-800"
                  >
                    {section.title}
                    <ChevronRight size={16} />
                  </a>
                ))}
                <a
                  href="#income-calculator"
                  className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-3 text-sm font-bold text-green-800 hover:bg-green-100"
                >
                  आय का अनुमान कैलकुलेटर
                  <Calculator size={17} />
                </a>
                <a
                  href="#faq"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-800"
                >
                  सामान्य सवाल
                  <ChevronRight size={16} />
                </a>
              </nav>
            )}
          </div>

          {/* Detailed sections */}
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
              >
                <h2 className="text-xl font-extrabold leading-snug text-gray-950 sm:text-2xl">
                  {section.title}
                </h2>

                <p className="mt-4 text-base leading-8 text-gray-600">
                  {section.content}
                </p>

                <div className="mt-5 rounded-xl bg-green-50 p-4 sm:p-5">
                  <p className="mb-3 flex items-center gap-2 font-bold text-green-900">
                    <CheckCircle2 size={19} />
                    ध्यान रखने योग्य बातें
                  </p>
                  <ul className="space-y-3">
                    {section.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm leading-7 text-gray-700"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>

          {/* Interactive income calculator */}
          <section
            id="income-calculator"
            className="mt-8 scroll-mt-24 overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm"
          >
            <div className="bg-green-800 p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/15 p-3">
                  <Calculator size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    आय का अनुमान कैलकुलेटर
                  </h2>
                  <p className="mt-1 text-sm text-green-100">
                    अपनी जानकारी बदलें और अनुमान देखें।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label
                      htmlFor="animalCount"
                      className="font-semibold text-gray-800"
                    >
                      पशुओं की संख्या
                    </label>
                    <span className="rounded-lg bg-green-50 px-3 py-1 font-bold text-green-800">
                      {animalCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setAnimalCount((value) => Math.max(1, value - 1))
                      }
                      aria-label="पशुओं की संख्या कम करें"
                      className="rounded-lg border p-2 hover:bg-gray-50"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      id="animalCount"
                      type="range"
                      min="1"
                      max="50"
                      value={animalCount}
                      onChange={(event) =>
                        setAnimalCount(Number(event.target.value))
                      }
                      className="w-full accent-green-700"
                    />
                    <button
                      onClick={() =>
                        setAnimalCount((value) => Math.min(50, value + 1))
                      }
                      aria-label="पशुओं की संख्या बढ़ाएं"
                      className="rounded-lg border p-2 hover:bg-gray-50"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="dailyMilk"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    प्रति पशु प्रतिदिन बिकने वाला दूध (लीटर)
                  </label>
                  <input
                    id="dailyMilk"
                    type="number"
                    min="0"
                    max="100"
                    value={dailyMilk}
                    onChange={(event) =>
                      setDailyMilk(
                        Math.max(
                          0,
                          Math.min(100, Number(event.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="milkPrice"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    दूध का बिक्री भाव (₹ प्रति लीटर)
                  </label>
                  <input
                    id="milkPrice"
                    type="number"
                    min="0"
                    max="500"
                    value={milkPrice}
                    onChange={(event) =>
                      setMilkPrice(
                        Math.max(
                          0,
                          Math.min(500, Number(event.target.value) || 0)
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="monthlyCost"
                    className="mb-2 block font-semibold text-gray-800"
                  >
                    कुल मासिक खर्च (₹)
                  </label>
                  <input
                    id="monthlyCost"
                    type="number"
                    min="0"
                    max="100000000"
                    value={monthlyCost}
                    onChange={(event) =>
                      setMonthlyCost(
                        Math.max(
                          0,
                          Math.min(
                            100000000,
                            Number(event.target.value) || 0
                          )
                        )
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    चारा, मजदूरी, दवा, बिजली, परिवहन और अन्य खर्च जोड़ें।
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5 sm:p-6">
                <p className="font-bold text-gray-700">आपका अनुमान</p>

                <div className="mt-4 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    अनुमानित मासिक बिक्री
                  </p>
                  <p className="mt-2 text-2xl font-black text-gray-950">
                    {money(estimate.revenue)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    अनुमानित मासिक बचत / घाटा
                  </p>
                  <p
                    className={`mt-2 text-2xl font-black ${
                      estimate.profit >= 0
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {money(estimate.profit)}
                  </p>
                </div>

                <div className="mt-3 rounded-xl border border-green-100 bg-white p-4">
                  <p className="text-sm text-gray-500">
                    12 महीने का सरल अनुमान
                  </p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      estimate.yearly >= 0
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {money(estimate.yearly)}
                  </p>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <Lightbulb className="mt-0.5 shrink-0" size={19} />
                  <p>
                    यह केवल गणितीय अनुमान है, वास्तविक लाभ नहीं। इसमें दूध
                    उत्पादन में बदलाव, सूखा काल, पशु खरीद की लागत, ब्याज,
                    बीमारी और अन्य अप्रत्याशित खर्च शामिल नहीं हैं, जब तक आप
                    उन्हें मासिक खर्च में न जोड़ें।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Helpful tips */}
          <section className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-gray-950">
              <ShieldCheck className="text-amber-700" />
              जरूरी सावधानियां
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
              <li>
                • पशु खरीदने या बड़ा निवेश करने से पहले विशेषज्ञ की सलाह लें।
              </li>
              <li>
                • सरकारी योजना, सब्सिडी या लोन की पात्रता आधिकारिक स्रोत से
                जांचें।
              </li>
              <li>
                • बीमारी के लक्षण दिखने पर पशु चिकित्सक से संपर्क करें।
              </li>
              <li>
                • आय के अनुमान को गारंटी न मानें; स्थानीय बाजार और खर्च बदल
                सकते हैं।
              </li>
            </ul>
          </section>

          {/* FAQs */}
          <section id="faq" className="mt-8 scroll-mt-24">
            <div className="mb-5">
              <p className="text-sm font-bold uppercase tracking-wider text-green-700">
                FAQs
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">
                अक्सर पूछे जाने वाले सवाल
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-gray-900 hover:bg-gray-50"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`shrink-0 text-green-700 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 text-sm leading-7 text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Back */}
          <div className="mt-8">
            <Link
              href="/pashupalan"
              className="inline-flex items-center gap-2 font-bold text-green-800 hover:text-green-950"
            >
              <ArrowLeft size={18} />
              सभी पशुपालन लेख देखें
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="flex items-center gap-2 font-extrabold text-gray-950">
              <BookOpen size={19} className="text-green-700" />
              इस लेख में
            </p>

            <nav className="mt-4 space-y-1">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm leading-6 text-gray-600 hover:bg-green-50 hover:text-green-800"
                >
                  <span className="font-bold text-green-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, "")}
                </a>
              ))}
            </nav>
          </div>

          <div className="rounded-2xl bg-green-800 p-6 text-white shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-white/15 p-3">
              <Wheat size={25} />
            </div>
            <h3 className="text-xl font-black">
              खेती और पशुपालन की जानकारी
            </h3>
            <p className="mt-3 text-sm leading-7 text-green-100">
              कृषि, पशुपालन और ग्रामीण व्यवसाय से जुड़े दूसरे लेख भी पढ़ें।
            </p>
            <Link
              href="/pashupalan"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold text-green-900 hover:bg-green-50"
            >
              और लेख पढ़ें <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-extrabold text-gray-950">
              उपयोगी बातें
            </h3>
            <div className="mt-4 space-y-4 text-sm leading-6 text-gray-600">
              <p className="flex items-start gap-2">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                रोजाना खर्च और बिक्री का रिकॉर्ड रखें।
              </p>
              <p className="flex items-start gap-2">
                <Heart
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                पशु कल्याण और उचित देखभाल को प्राथमिकता दें।
              </p>
              <p className="flex items-start gap-2">
                <Milk
                  size={18}
                  className="mt-0.5 shrink-0 text-green-700"
                />
                बाजार की मांग और वास्तविक उत्पादन के आधार पर योजना बनाएं।
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold text-green-700">
              KRISHI MITRA
            </p>
            <h2 className="mt-2 text-2xl font-black text-gray-950">
              अगला लेख भी पढ़ें
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              पशुपालन से जुड़ी और जानकारी के लिए सभी लेख देखें।
            </p>
          </div>
          <Link
            href="/pashupalan"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white hover:bg-green-800"
          >
            पशुपालन सेक्शन खोलें <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
