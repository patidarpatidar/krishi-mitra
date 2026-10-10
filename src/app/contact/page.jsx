"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Headphones,
  ShieldCheck,
  ArrowRight,
  Sprout,
  HelpCircle,
  ChevronDown,
  UserCheck,
  BookOpen,
  Target,
  Loader2,
} from "lucide-react";
import { inquiryApi } from "@/lib/inquiryApi";

/* =========================================================
   CONTACT CONFIG
========================================================= */

const CONTACT_CONFIG = {
  phone: "18001801551",

  whatsapp: {
    number: "919826000000",
    display: "+91 98260 XXXXX",
  },

  email: "contact@krishimitra.in",

  location: "नीमच एवं मालवांचल क्षेत्र, मध्य प्रदेश",

  districts: [
    { value: "Neemuch", label: "नीमच (Neemuch)" },
    { value: "Mandsaur", label: "मंदसौर (Mandsaur)" },
    { value: "Ratlam", label: "रतलाम (Ratlam)" },
    { value: "Ujjain", label: "उज्जैन (Ujjain)" },
  ],

  queryTypes: [
    {
      value: "Mandi Bhav",
      label: "मंडी भाव पूछताछ",
    },
    {
      value: "Crop Advisory",
      label: "खेती-किसानी जानकारी",
    },
    {
      value: "Weather",
      label: "मौसम संबंधी जानकारी",
    },
    {
      value: "Government Scheme",
      label: "सरकारी योजना",
    },
    {
      value: "Blog Feedback",
      label: "ब्लॉग फीडबैक / सुझाव",
    },
    {
      value: "Other",
      label: "अन्य विषय",
    },
  ],
};

/* =========================================================
   WHATSAPP MESSAGE
========================================================= */

const whatsappMessage = encodeURIComponent(
  "नमस्ते कृषि मित्र, मुझे मंडी भाव या खेती के संबंध में जानकारी चाहिए।"
);

const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${whatsappMessage}`;

/* =========================================================
   FAQ DATA
========================================================= */  

const FAQS = [
  {
    question: "क्या कृषि मित्र का कोई physical office या कृषि केंद्र है?",
    answer:
      "नहीं। वर्तमान में कृषि मित्र का कोई physical office, दुकान या कृषि केंद्र नहीं है। इसे मैं स्वयं online माध्यम से संचालित करता हूँ।",
  },
  {
    question: "क्या Contact form से सीधे कृषि सलाह मिलती है?",
    answer:
      "Contact form सामान्य प्रश्न, feedback और information requests के लिए है। गंभीर या फसल से जुड़े महत्वपूर्ण निर्णयों के लिए स्थानीय कृषि विशेषज्ञ, KVK या कृषि विभाग से भी सलाह लेना चाहिए।",
  },
  {
    question: "क्या मंडी भाव रोज update होते हैं?",
    answer:
      "मंडी भाव उपलब्ध data source और update frequency पर निर्भर करते हैं। किसी महत्वपूर्ण व्यापारिक निर्णय से पहले संबंधित मंडी या official source से current rate verify करें।",
  },
  {
    question: "क्या मैं किसी नए topic की मांग कर सकता हूँ?",
    answer:
      "हाँ। आप Contact form के माध्यम से किसी भी कृषि topic, crop, mandi या farming problem के बारे में topic suggestion भेज सकते हैं।",
  },
];

/* =========================================================
   HELP OPTIONS
========================================================= */

const HELP_OPTIONS = [
  {
    icon: TrendingIcon,
    title: "मंडी भाव",
    text: "किसी फसल या मंडी से जुड़े भाव की जानकारी के लिए।",
    query: "Mandi Bhav",
  },
  {
    icon: Sprout,
    title: "फसल जानकारी",
    text: "फसल, खेती और farming practices से जुड़े सामान्य सवाल।",
    query: "Crop Advisory",
  },
  {
    icon: BookOpen,
    title: "ब्लॉग सुझाव",
    text: "नए article या content के लिए अपना सुझाव दें।",
    query: "Blog Feedback",
  },
  {
    icon: Target,
    title: "अन्य जानकारी",
    text: "अन्य किसी विषय के लिए message भेजें।",
    query: "Other",
  },
];

/* =========================================================
   SIMPLE ICON
   यह custom component है ताकि additional lucide icon की
   जरूरत न पड़े।
========================================================= */

function TrendingIcon({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeHelp, setActiveHelp] = useState("");

  const [openFaq, setOpenFaq] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    queryType: "Mandi Bhav",
    message: "",
  });

  /* =======================================================
     INPUT HANDLER
  ======================================================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      await inquiryApi.createInquiry({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        district: formData.district.trim(),
        queryType: formData.queryType,
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error.message || "आपका संदेश भेजा नहीं जा सका। कृपया फिर प्रयास करें।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     RESET FORM
  ======================================================== */

  const resetForm = () => {
    setSubmitted(false);

    setFormData({
      name: "",
      phone: "",
      email: "",
      district: "",
      queryType: "Mandi Bhav",
      message: "",
    });

    setActiveHelp("");
    setSubmitError("");
  };

  /* =======================================================
     QUICK HELP CLICK
  ======================================================== */

  const handleQuickHelp = (query) => {
    setActiveHelp(query);

    setFormData((prev) => ({
      ...prev,
      queryType: query,
    }));

    setTimeout(() => {
      document
        .getElementById("contact-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-emerald-900 to-slate-950 text-white">

        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/10" />

        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-green-400/10" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">

          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur">

              <Sparkles
                size={16}
                className="text-amber-300"
              />

              संपर्क एवं सहायता

            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">

              कृषि मित्र से
              <span className="text-emerald-300">
                {" "}संपर्क करें
              </span>

            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-emerald-50 sm:text-lg">

              मंडी भाव, खेती-किसानी, मौसम, सरकारी योजनाओं या
              कृषि मित्र website से जुड़े किसी सवाल, सुझाव या feedback
              के लिए message भेजें।

            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <a
                href={`tel:${CONTACT_CONFIG.phone}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-green-900 transition hover:bg-green-50"
              >
                <Phone size={18} />
                किसान कॉल सेंटर
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20"
              >
                <MessageSquare size={18} />
                WhatsApp
              </a>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          TRANSPARENCY
      ====================================================== */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-green-100 bg-green-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <UserCheck size={24} />
              </div>

              <h3 className="mt-4 font-bold">
                व्यक्तिगत रूप से संचालित
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                कृषि मित्र को मैं स्वयं manage करता हूँ। Website,
                content और digital updates personally संभाले जाते हैं।
              </p>

            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <MapPin size={24} />
              </div>

              <h3 className="mt-4 font-bold">
                कोई Physical Center नहीं
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                वर्तमान में कृषि मित्र का कोई physical office,
                दुकान या कृषि केंद्र नहीं है।
              </p>

            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck size={24} />
              </div>

              <h3 className="mt-4 font-bold">
                Information Platform
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                कृषि मित्र सरकारी website या सरकारी कृषि कार्यालय
                नहीं है। जरूरी जानकारी official sources से verify करें।
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK CONTACT
      ====================================================== */}

      <section className="bg-slate-50">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-8">

            <span className="text-sm font-bold uppercase tracking-wider text-green-700">
              Quick Contact
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              तुरंत संपर्क करने के विकल्प
            </h2>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* PHONE */}

            <a
              href={`tel:${CONTACT_CONFIG.phone}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-400 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition group-hover:scale-110">
                  <Phone size={25} />
                </div>

                <div>

                  <div className="text-xs font-bold uppercase text-slate-500">
                    किसान कॉल सेंटर
                  </div>

                  <div className="mt-1 text-lg font-extrabold">
                    1800-180-1551
                  </div>

                  <div className="mt-1 text-xs font-medium text-green-700">
                    सुबह 6:00 से रात 10:00
                  </div>

                </div>

              </div>

            </a>

            {/* WHATSAPP */}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-400 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 transition group-hover:scale-110">
                  <MessageSquare size={25} />
                </div>

                <div>

                  <div className="text-xs font-bold uppercase text-slate-500">
                    WhatsApp सहायता
                  </div>

                  <div className="mt-1 text-lg font-extrabold">
                    {CONTACT_CONFIG.whatsapp.display}
                  </div>

                  <div className="mt-1 text-xs font-medium text-green-700">
                    Chat शुरू करें →
                  </div>

                </div>

              </div>

            </a>

            {/* EMAIL */}

            <a
              href={`mailto:${CONTACT_CONFIG.email}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 transition group-hover:scale-110">
                  <Mail size={25} />
                </div>

                <div className="min-w-0">

                  <div className="text-xs font-bold uppercase text-slate-500">
                    Email
                  </div>

                  <div className="mt-1 break-all text-sm font-extrabold">
                    {CONTACT_CONFIG.email}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Email भेजें →
                  </div>

                </div>

              </div>

            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK HELP
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="text-center">

            <span className="text-sm font-bold uppercase tracking-wider text-green-700">
              किस विषय में सहायता चाहिए?
            </span>

            <h2 className="mt-2 text-3xl font-bold">
              अपना विषय चुनें
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              किसी option पर click करने पर contact form में वही विषय
              automatically select हो जाएगा।
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {HELP_OPTIONS.map((item, index) => {

              const Icon = item.icon;

              const active = activeHelp === item.query;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuickHelp(item.query)}
                  className={`group rounded-2xl border p-6 text-left transition hover:-translate-y-1 hover:shadow-xl ${
                    active
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-green-700 text-white"
                        : "bg-green-100 text-green-700 group-hover:bg-green-700 group-hover:text-white"
                    }`}
                  >
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-green-700">
                    प्रश्न भेजें
                    <ArrowRight size={16} />
                  </div>

                </button>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTACT AREA
      ====================================================== */}

      <section
        id="contact-form"
        className="bg-slate-50"
      >

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* =================================================
                LEFT INFORMATION
            ================================================== */}

            <div className="space-y-6">

              <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                    <MapPin size={24} />
                  </div>

                  <div>
                    <div className="text-xs uppercase text-slate-400">
                      क्षेत्र
                    </div>

                    <h3 className="font-bold">
                      {CONTACT_CONFIG.location}
                    </h3>
                  </div>

                </div>

                <p className="mt-6 text-sm leading-7 text-slate-300">
                  कृषि मित्र एक online agricultural information platform
                  है। इसका मुख्य focus नीमच, मंदसौर, रतलाम और आसपास के
                  मालवांचल क्षेत्र की कृषि जानकारी पर है।
                </p>

                <div className="mt-6 border-t border-slate-800 pt-5">

                  <div className="flex gap-3">

                    <Headphones
                      size={20}
                      className="mt-1 shrink-0 text-amber-300"
                    />

                    <div>

                      <div className="font-semibold text-amber-300">
                        कृषि संबंधी सरकारी सहायता
                      </div>

                      <p className="mt-1 text-xs leading-6 text-slate-400">
                        किसान कॉल सेंटर:
                        <span className="font-bold text-white">
                          {" "}1800-180-1551
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ONLINE ONLY CARD */}

              <div className="rounded-3xl border border-green-200 bg-green-50 p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700 text-white">
                  <UserCheck size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-green-950">
                  Online माध्यम से संपर्क
                </h3>

                <p className="mt-3 text-sm leading-7 text-green-900/80">
                  कृषि मित्र का अभी कोई physical office या कृषि केंद्र
                  नहीं है। Contact form, email और available online
                  communication channels के माध्यम से संपर्क किया जा सकता है।
                </p>

              </div>

              {/* DISCLAIMER */}

              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={22}
                    className="mt-1 shrink-0 text-amber-700"
                  />

                  <div>

                    <h3 className="font-bold text-amber-950">
                      जरूरी सावधानी
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-amber-900/80">
                      Contact form पर मिली जानकारी को professional
                      agricultural recommendation न मानें। महत्वपूर्ण
                      crop decisions के लिए local expert और official
                      sources से verification करें।
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <div className="lg:col-span-2">

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                {submitted ? (

                  <div className="flex min-h-[520px] flex-col items-center justify-center text-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">

                      <CheckCircle2 size={44} />

                    </div>

                    <h2 className="mt-6 text-3xl font-bold">
                      संदेश तैयार हो गया!
                    </h2>

                    <p className="mt-3 max-w-md leading-7 text-slate-600">
                      आपका संदेश सफलतापूर्वक दर्ज हो गया है। हमारी टीम
                      आपसे दिए गए संपर्क विवरण पर जवाब देगी।
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">

                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-bold text-white transition hover:bg-green-800"
                      >
                        दूसरा संदेश भेजें
                        <ArrowRight size={18} />
                      </button>

                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        Home पर जाएं
                      </Link>

                    </div>

                  </div>

                ) : (

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >

                    <div className="border-b border-slate-100 pb-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                          <MessageSquare size={24} />
                        </div>

                        <div>

                          <h2 className="text-2xl font-bold">
                            अपना सवाल भेजें
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            नीचे form भरकर अपना message भेजें।
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* NAME + PHONE */}

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          आपका नाम *
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            handleChange("name", e.target.value)
                          }
                          placeholder="उदा. रामेश्वर धाकड़"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          मोबाइल नंबर *
                        </label>

                        <input
                          type="tel"
                          required
                          inputMode="numeric"
                          pattern="[0-9]{10}"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);

                            handleChange("phone", value);
                          }}
                          placeholder="10 अंकों का नंबर"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                      </div>

                    </div>

                    {/* EMAIL + DISTRICT */}

                    <div className="grid gap-5 sm:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          Email (वैकल्पिक)
                        </label>

                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="name@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-sm font-bold text-slate-700">
                          जिला *
                        </label>

                        <select
                          required
                          value={formData.district}
                          onChange={(e) =>
                            handleChange("district", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        >
                          <option value="" disabled>
                            जिला चुनें
                          </option>
                          {CONTACT_CONFIG.districts.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>

                      </div>

                    </div>

                    {/* TOPIC */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        विषय *
                      </label>
                      <select
                        value={formData.queryType}
                        onChange={(e) => {
                          handleChange("queryType", e.target.value);
                          setActiveHelp(e.target.value);
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      >
                        {CONTACT_CONFIG.queryTypes.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* MESSAGE */}

                    <div>

                      <div className="mb-2 flex items-center justify-between">

                        <label className="block text-sm font-bold text-slate-700">
                          अपना सवाल / संदेश *
                        </label>

                        <span className="text-xs text-slate-400">
                          {formData.message.length}/500
                        </span>

                      </div>

                      <textarea
                        rows={6}
                        required
                        maxLength={500}
                        value={formData.message}
                        onChange={(e) =>
                          handleChange(
                            "message",
                            e.target.value
                          )
                        }
                        placeholder="उदाहरण: मुझे सोयाबीन के मंडी भाव और खेती से जुड़ी जानकारी चाहिए..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />

                    </div>

                    {/* PREVIEW */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                      <div className="mb-3 flex items-center gap-2">

                        <CheckCircle2
                          size={18}
                          className="text-green-700"
                        />

                        <span className="text-sm font-bold">
                          Message Summary
                        </span>

                      </div>

                      <div className="grid gap-3 text-sm sm:grid-cols-3">

                        <div>
                          <div className="text-xs text-slate-400">
                            नाम
                          </div>

                          <div className="mt-1 font-semibold">
                            {formData.name || "—"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-slate-400">
                            जिला
                          </div>

                          <div className="mt-1 font-semibold">
                            {formData.district || "—"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-slate-400">
                            विषय
                          </div>

                          <div className="mt-1 font-semibold">
                            {formData.queryType || "—"}
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* SUBMIT */}

                    {submitError && (
                      <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-6 py-4 font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-green-800"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          संदेश भेजा जा रहा है…
                        </>
                      ) : (
                        <>
                          संदेश भेजें
                          <Send
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}

                    </button>

                    <p className="text-center text-xs leading-5 text-slate-500">
                      भेजे गए संदेश Contact Management में सुरक्षित रखे जाएंगे।
                    </p>

                  </form>

                )}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <HelpCircle size={25} />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              Contact से जुड़े सवाल
            </h2>

          </div>

          <div className="mt-10 space-y-3">

            {FAQS.map((faq, index) => {

              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? -1 : index)
                    }
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
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-7 text-slate-600">
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
          FINAL CTA
      ====================================================== */}

      <section className="bg-gradient-to-r from-green-800 to-emerald-900 text-white">

        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Sprout size={28} />
          </div>

          <h2 className="mt-5 text-3xl font-bold">
            खेती की जानकारी के लिए कृषि मित्र explore करें
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-green-50">
            मंडी भाव, मौसम, फसल जानकारी और agriculture blogs को
            explore करें।
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-4">

            <Link
              href="/mandi-bhav"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-green-800 transition hover:bg-green-50"
            >
              मंडी भाव देखें
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/20"
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