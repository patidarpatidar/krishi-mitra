"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Target,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Sprout,
  Sparkles,
  ChevronDown,
  Calculator,
  MessageSquare,
  CheckCircle2,
  MapPin,
  TrendingUp,
  HelpCircle,
  Send,
  UserCheck,
} from "lucide-react";

const ABOUT_CONTENT = {
  hero: {
    eyebrow: "कृषि मित्र के बारे में",
    title: "किसान तक सही जानकारी, आसान भाषा में",
    description:
      "कृषि मित्र एक व्यक्तिगत कृषि ब्लॉग और डिजिटल सूचना प्लेटफॉर्म है, जिसका उद्देश्य किसानों और खेती से जुड़े लोगों तक उपयोगी कृषि जानकारी सरल हिंदी में पहुँचाना है।",
  },

  transparency: [
    {
      icon: UserCheck,
      title: "Self Managed",
      text: "कृषि मित्र को मैं स्वयं manage करता हूँ। Content, website और digital updates को personally संभाला जाता है।",
    },
    {
      icon: Sparkles,
      title: "100% Online",
      text: "अभी कृषि मित्र का कोई physical office, दुकान या कृषि केंद्र नहीं है। यह online platform के रूप में संचालित है।",
    },
    {
      icon: ShieldCheck,
      title: "Information Platform",
      text: "यह सरकारी वेबसाइट या सरकारी कृषि कार्यालय नहीं है। महत्वपूर्ण जानकारी को official sources से verify करना जरूरी है।",
    },
  ],

  mission: [
    {
      icon: BookOpen,
      title: "सरल जानकारी",
      text: "खेती से जुड़ी कठिन जानकारी को आसान हिंदी में समझाना।",
    },
    {
      icon: TrendingUp,
      title: "बेहतर निर्णय",
      text: "फसल, मंडी, मौसम और खेती की जानकारी को एक जगह उपलब्ध कराना।",
    },
    {
      icon: Sprout,
      title: "किसान केंद्रित",
      text: "जानकारी को practical और किसान की जरूरत के हिसाब से प्रस्तुत करना।",
    },
  ],

  features: [
    {
      icon: TrendingUp,
      title: "मंडी भाव",
      text: "फसलों और कृषि उपज से जुड़े मंडी भाव और बाजार की जानकारी।",
    },
    {
      icon: Sprout,
      title: "फसल जानकारी",
      text: "बुवाई से लेकर कटाई और storage तक उपयोगी कृषि जानकारी।",
    },
    {
      icon: BookOpen,
      title: "कृषि ब्लॉग",
      text: "खेती, जैविक खेती, पशुपालन और ग्रामीण व्यवसाय से जुड़े articles।",
    },
    {
      icon: Award,
      title: "सरकारी योजनाएं",
      text: "किसानों के लिए उपलब्ध योजनाओं और सुविधाओं की जानकारी।",
    },
  ],

  faqs: [
    {
      question: "क्या कृषि मित्र का कोई physical office है?",
      answer:
        "नहीं। वर्तमान में कृषि मित्र का कोई physical office, दुकान या कृषि केंद्र नहीं है। इसे मैं स्वयं online माध्यम से संचालित करता हूँ।",
    },
    {
      question: "क्या कृषि मित्र सरकारी वेबसाइट है?",
      answer:
        "नहीं। कृषि मित्र एक independent agricultural information platform है। यह किसी सरकारी विभाग की official website नहीं है।",
    },
    {
      question: "क्या कृषि मित्र पर दी गई जानकारी अंतिम सलाह है?",
      answer:
        "नहीं। कृषि संबंधी महत्वपूर्ण निर्णय लेने से पहले स्थानीय कृषि विशेषज्ञ, कृषि विभाग, KVK या संबंधित official source से जानकारी verify करें।",
    },
    {
      question: "क्या किसान कृषि मित्र से संपर्क कर सकता है?",
      answer:
        "हाँ। Website के Contact section के माध्यम से feedback, suggestion या सामान्य जानकारी के लिए संपर्क किया जा सकता है।",
    },
  ],
};

const cropData = {
  wheat: {
    name: "गेहूँ",
    savingsPerAcre: 2500,
    yieldIncrease: "15–20%",
  },
  soybean: {
    name: "सोयाबीन",
    savingsPerAcre: 3200,
    yieldIncrease: "18–22%",
  },
  garlic: {
    name: "लहसुन",
    savingsPerAcre: 8500,
    yieldIncrease: "25–30%",
  },
  mustard: {
    name: "सरसों",
    savingsPerAcre: 2800,
    yieldIncrease: "15–18%",
  },
};

export default function AboutPage() {
  const [landAcres, setLandAcres] = useState(5);
  const [cropType, setCropType] = useState("wheat");
  const [openFaq, setOpenFaq] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const crop = cropData[cropType];

  const estimatedSavings =
    Math.max(0, Number(landAcres) || 0) * crop.savingsPerAcre;

  const submitFeedback = (e) => {
    e.preventDefault();

    if (!feedback.trim()) return;

    setSubmitted(true);
    setFeedback("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sprout size={17} />
              {ABOUT_CONTENT.hero.eyebrow}
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {ABOUT_CONTENT.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-green-50 sm:text-xl">
              {ABOUT_CONTENT.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/mandi-bhav"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-900 transition hover:bg-green-50"
              >
                मंडी भाव देखें
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                संपर्क करें
                <MessageSquare size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRANSPARENCY
      ====================================================== */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="mb-8">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Transparency
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              कृषि मित्र के बारे में स्पष्ट जानकारी
            </h2>

            <p className="mt-3 max-w-3xl text-slate-600">
              हम चाहते हैं कि आपको साफ पता हो कि यह platform कैसे संचालित होता
              है।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {ABOUT_CONTENT.transparency.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold">{item.title}</h3>

                  <p className="mt-2 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          STORY
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <UserCheck size={25} />
                </div>

                <span className="font-semibold text-green-700">
                  मेरी कहानी
                </span>
              </div>

              <h2 className="text-3xl font-bold sm:text-4xl">
                एक व्यक्ति द्वारा शुरू किया गया कृषि information platform
              </h2>

              <div className="mt-6 space-y-4 leading-8 text-slate-600">
                <p>
                  कृषि मित्र को इस सोच के साथ बनाया गया है कि किसानों के लिए
                  उपयोगी कृषि जानकारी internet पर आसान हिंदी में उपलब्ध होनी
                  चाहिए।
                </p>

                <p>
                  इस platform को मैं स्वयं manage करता हूँ। Website development,
                  technology, content management और digital updates को personally
                  संभालता हूँ।
                </p>

                <p>
                  वर्तमान में इसका कोई physical कृषि केंद्र, दुकान या office
                  नहीं है। इसका मुख्य माध्यम website और online communication है।
                </p>
              </div>

              <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 shrink-0 text-green-700" size={22} />

                  <div>
                    <h3 className="font-bold text-green-900">
                      महत्वपूर्ण सूचना
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-green-800">
                      कृषि मित्र पर उपलब्ध जानकारी सामान्य educational और
                      informational purpose के लिए है। खेती में आर्थिक या
                      तकनीकी निर्णय लेने से पहले स्थानीय विशेषज्ञ और official
                      sources से जानकारी verify करें।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple visual card */}
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-900 p-8 text-white shadow-2xl">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <Sprout size={34} />
                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  किसान केंद्रित सोच
                </h3>

                <p className="mt-4 leading-8 text-green-50">
                  मेरा लक्ष्य किसी physical center के बजाय digital माध्यम से
                  ज्यादा से ज्यादा किसानों तक उपयोगी और समझने योग्य जानकारी
                  पहुँचाना है।
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-2xl font-bold">Online</div>
                    <div className="mt-1 text-sm text-green-100">
                      मुख्य माध्यम
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-2xl font-bold">Hindi</div>
                    <div className="mt-1 text-sm text-green-100">
                      आसान भाषा
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MISSION
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              हमारा उद्देश्य
            </span>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Agriculture information को सरल बनाना
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              किसान को जरूरी information के लिए अलग-अलग जगहों पर भटकना न पड़े,
              इसी दिशा में कृषि मित्र को बनाया गया है।
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ABOUT_CONTENT.mission.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              कैसे काम करता है?
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              कृषि मित्र पर information कैसे तैयार होती है
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">

            {[
              {
                number: "01",
                title: "Topic Selection",
                text: "किसानों के लिए उपयोगी topic और practical problems को identify किया जाता है।",
              },
              {
                number: "02",
                title: "Research",
                text: "Available information और relevant sources को समझकर content तैयार किया जाता है।",
              },
              {
                number: "03",
                title: "Simple Explanation",
                text: "Technical information को आसान हिंदी और practical examples में प्रस्तुत किया जाता है।",
              },
              {
                number: "04",
                title: "Online Publishing",
                text: "Final information website पर publish की जाती है ताकि किसान कहीं से भी access कर सके।",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative flex gap-5 border-l-2 border-green-200 pb-10 pl-8 last:border-l-0"
              >
                <div className="absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  {item.number}
                </div>

                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CALCULATOR
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Interactive Calculator
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              खेती का अनुमानित लाभ Calculator
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              यह केवल example calculation है। वास्तविक परिणाम crop, मौसम,
              input cost, market price और farming practices पर निर्भर करेंगे।
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8">

            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Calculator size={24} />
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  अपना अनुमान देखें
                </h3>

                <p className="text-sm text-slate-500">
                  जमीन और फसल चुनें
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  जमीन कितने एकड़?
                </label>

                <input
                  type="number"
                  min="0"
                  value={landAcres}
                  onChange={(e) => setLandAcres(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  फसल
                </label>

                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  {Object.entries(cropData).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl bg-green-700 p-6 text-white">
                <div className="text-sm text-green-100">
                  अनुमानित अतिरिक्त बचत
                </div>

                <div className="mt-2 text-3xl font-bold">
                  ₹{estimatedSavings.toLocaleString("en-IN")}
                </div>

                <div className="mt-2 text-sm text-green-100">
                  यह केवल illustrative estimate है।
                </div>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
                <div className="text-sm text-green-700">
                  अनुमानित yield improvement
                </div>

                <div className="mt-2 text-3xl font-bold text-green-900">
                  {crop.yieldIncrease}
                </div>

                <div className="mt-2 text-sm text-green-700">
                  यह crop और farming conditions के अनुसार बदल सकता है।
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Platform Features
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              कृषि मित्र पर क्या मिलेगा?
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_CONTENT.features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATION / ONLINE
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="rounded-3xl border border-green-200 bg-green-50 p-8 sm:p-10">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-5">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-700 text-white">
                  <MapPin size={27} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-green-950">
                    Online Platform
                  </h2>

                  <p className="mt-2 max-w-2xl leading-7 text-green-900/80">
                    कृषि मित्र का कोई physical कृषि केंद्र या office नहीं है।
                    Platform को online माध्यम से manage किया जाता है और
                    जानकारी website के माध्यम से उपलब्ध कराई जाती है।
                  </p>
                </div>

              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                संपर्क करें
                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <HelpCircle size={25} />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {ABOUT_CONTENT.faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <span className="font-semibold">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 leading-7 text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =====================================================
          FEEDBACK
      ====================================================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="rounded-3xl bg-green-950 p-8 text-white sm:p-10">

            <div className="flex items-center gap-3">
              <MessageSquare size={25} />
              <h2 className="text-2xl font-bold">
                आपका सुझाव
              </h2>
            </div>

            <p className="mt-3 text-green-100">
              कृषि मित्र को बेहतर बनाने के लिए आपका feedback महत्वपूर्ण है।
            </p>

            <form onSubmit={submitFeedback} className="mt-6">

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="अपना सुझाव लिखें..."
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-white placeholder:text-green-100/60 outline-none focus:border-white"
              />

              <div className="mt-4 flex flex-wrap items-center gap-4">

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-950 transition hover:bg-green-50"
                >
                  भेजें
                  <Send size={18} />
                </button>

                {submitted && (
                  <div className="flex items-center gap-2 text-green-200">
                    <CheckCircle2 size={18} />
                    धन्यवाद! आपका feedback दर्ज हो गया।
                  </div>
                )}

              </div>
            </form>

          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-800">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center text-white sm:px-6 lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Target size={28} />
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            खेती से जुड़ी जानकारी खोज रहे हैं?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-green-50">
            मंडी भाव, मौसम, फसल, सरकारी योजनाओं और agriculture blogs को
            explore करें।
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">

            <Link
              href="/mandi-bhav"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-green-800 transition hover:bg-green-50"
            >
              मंडी भाव
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              Agriculture Blog
              <BookOpen size={18} />
            </Link>

          </div>
        </div>
      </section>

    </main>
  );
}