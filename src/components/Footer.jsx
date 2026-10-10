"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Send,
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  CheckCircle2,
  MessageCircle,
  ChevronDown,
  ArrowUp,
  Sprout,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Target,
  Loader2,
} from "lucide-react";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

/* =========================================================
   FOOTER CONFIG
   बाद में API / CMS से आसानी से replace किया जा सकता है।
========================================================= */

const FOOTER_CONFIG = {
  brand: {
    name: "कृषि मित्र",
    tagline: "आपका डिजिटल कृषि साथी",
    description:
      "कृषि मित्र एक व्यक्तिगत कृषि information platform है, जहाँ किसानों के लिए मंडी भाव, मौसम, फसल जानकारी, कृषि ब्लॉग और उपयोगी farming information सरल हिंदी में उपलब्ध कराई जाती है।",
  },

  contact: {
    region: "नीमच एवं मालवांचल क्षेत्र, मध्य प्रदेश",
    phone: "18001801551",
    email: "contact@krishimitra.in",
  },

  whatsapp: {
    number: "919340004380",
    display: "+91  9340004380",
  },

  social: [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/919340004380",
      className:
        "hover:bg-emerald-500 hover:text-white hover:border-emerald-500",
    },
    {
      name: "YouTube",
      icon: MessageCircle,
      href: "https://youtube.com",
      className:
        "hover:bg-red-600 hover:text-white hover:border-red-600",
    },
    {
      name: "Facebook",
      icon: MessageCircle,
      href: "https://facebook.com",
      className:
        "hover:bg-blue-600 hover:text-white hover:border-blue-600",
    },
    {
      name: "Instagram",
      icon: MessageCircle,
      href: "https://instagram.com",
      className:
        "hover:bg-pink-600 hover:text-white hover:border-pink-600",
    },
  ],
};

/* =========================================================
   NAVIGATION DATA
========================================================= */

const MAIN_LINKS = [
  {
    label: "मंडी भाव",
    href: "/mandi-bhav",
  },
  {
    label: "मौसम पूर्वानुमान",
    href: "/weather",
  },
  {
    label: "कृषि ब्लॉग",
    href: "/blog",
  },
  {
    label: "फसल जानकारी",
    href: "/crops",
  },
  {
    label: "जैविक खेती",
    href: "/organic-farming",
  },
  {
    label: "पशुपालन",
    href: "/pashupalan",
  },
  {
    label: "सरकारी योजनाएं",
    href: "/govt-schemes",
  },
];

const CROP_LINKS = [
  {
    emoji: "🧄",
    label: "लहसुन खेती",
    href: "/crops/garlic",
  },
  {
    emoji: "🌱",
    label: "सोयाबीन",
    href: "/crops/soyabean",
  },
  {
    emoji: "🌾",
    label: "गेहूं",
    href: "/crops/wheat",
  },
  {
    emoji: "🫘",
    label: "चना",
    href: "/crops/gram",
  },
  {
    emoji: "🌽",
    label: "मक्का",
    href: "/crops/maize",
  },
];

const IMPORTANT_LINKS = [
  {
    label: "हमारे बारे में",
    href: "/about",
  },
  {
    label: "संपर्क करें",
    href: "/contact",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
];

/* =========================================================
   WHATSAPP
========================================================= */

const whatsappMessage = encodeURIComponent(
  "नमस्ते कृषि मित्र, मुझे खेती और मंडी भाव के संबंध में जानकारी चाहिए।"
);

const whatsappUrl = `https://wa.me/${FOOTER_CONFIG.whatsapp.number}?text=${whatsappMessage}`;

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  /* =======================================================
     NEWSLETTER
  ======================================================== */

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) return;

    setSubmitting(true);
    setSubscriptionError("");

    try {
      const response = await fetch(`${API_BASE}/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: emailOrPhone.trim() }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Subscription दर्ज नहीं हो सकी। कृपया फिर प्रयास करें।",
        );
      }

      setSubscribed(true);
      setEmailOrPhone("");
    } catch (error) {
      setSubscriptionError(
        error.message || "Subscription दर्ज नहीं हो सकी। कृपया फिर प्रयास करें।",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     ACCORDION
  ======================================================== */

  const toggleSection = (section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  /* =======================================================
     SCROLL TOP
  ======================================================== */

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t-4 border-emerald-600 bg-slate-950 text-slate-300">

      <div className="mx-auto max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-8">

        {/* =================================================
            TOP UPDATE BANNER
        ================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-emerald-700/50 bg-gradient-to-br from-emerald-900 via-green-900 to-slate-950 p-6 shadow-2xl sm:p-8">

          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/10" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            {/* TEXT */}

            <div className="max-w-2xl">

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">

                <Sprout size={15} />

                किसान अपडेट्स

              </div>

              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                कृषि मित्र से जुड़े रहें
              </h3>

              <p className="mt-3 text-sm leading-7 text-emerald-100">
                मंडी भाव, मौसम, खेती और कृषि से जुड़ी नई जानकारी के
                updates पाने के लिए अपना मोबाइल नंबर या email दर्ज करें।
              </p>

            </div>

            {/* SUBSCRIBE */}

            <div className="w-full lg:max-w-md">

              {subscribed ? (

                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-950/70 p-5">

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={24}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <div>

                      <div className="font-bold text-white">
                        धन्यवाद!
                      </div>

                      <p className="mt-1 text-sm leading-6 text-emerald-200">
                        आपका contact update list में register हो गया है।
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubscribed(false);
                      setSubscriptionError("");
                    }}
                    className="mt-4 text-xs font-semibold text-amber-300 hover:text-amber-200"
                  >
                    दूसरा contact जोड़ें →
                  </button>

                </div>

              ) : (

                <form
                  onSubmit={handleSubscribe}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
                >

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => {
                        setEmailOrPhone(e.target.value)
                        setSubscriptionError("");
                      }}
                      placeholder="Mobile / Email"
                      autoComplete="off"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          भेज रहे हैं…
                        </>
                      ) : (
                        <>
                          जुड़ें
                          <Send size={16} />
                        </>
                      )}
                    </button>

                  </div>

                  {subscriptionError ? (
                    <p role="alert" className="px-1 pt-2 text-xs text-red-300">
                      {subscriptionError}
                    </p>
                  ) : (
                    <p className="px-1 pt-2 text-[10px] text-slate-400">
                      मोबाइल नंबर या email में से कोई एक दर्ज करें।
                    </p>
                  )}

                </form>

              )}

            </div>

          </div>

        </div>

        {/* =================================================
            BRAND + DESKTOP GRID
        ================================================== */}

        <div className="grid gap-10 border-b border-slate-800 py-12 md:grid-cols-2 lg:grid-cols-5">

          {/* BRAND */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-400 bg-emerald-700 text-2xl shadow-lg">
                🌱
              </div>

              <div>

                <h2 className="text-2xl font-extrabold text-white">
                  किसान{" "}
                  <span className="text-emerald-400">
                    मित्र
                  </span>
                </h2>

                <p className="text-[11px] font-medium text-amber-400">
                  {FOOTER_CONFIG.brand.tagline}
                </p>

              </div>

            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              {FOOTER_CONFIG.brand.description}
            </p>

            {/* ONLINE BADGES */}

            <div className="mt-6 grid grid-cols-2 gap-3">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

                <div className="flex items-center gap-2 text-emerald-400">
                  <UserCheck size={17} />
                  <span className="text-xs font-bold">
                    Self Managed
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  व्यक्तिगत रूप से संचालित
                </p>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

                <div className="flex items-center gap-2 text-amber-400">
                  <Target size={17} />
                  <span className="text-xs font-bold">
                    Online
                  </span>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  कोई physical center नहीं
                </p>

              </div>

            </div>

            {/* SOCIAL */}

            <div className="mt-7">

              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">

                <Share2
                  size={17}
                  className="text-emerald-400"
                />

                सोशल मीडिया पर जुड़ें

              </div>

              <div className="flex flex-wrap gap-2">

                {FOOTER_CONFIG.social.map((social) => {

                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      aria-label={social.name}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:-translate-y-1 ${social.className}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}

              </div>

            </div>

          </div>

          {/* MAIN LINKS */}

          <div className="hidden lg:block">

            <h3 className="mb-5 inline-block border-b border-emerald-500/40 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              मुख्य सेवाएं
            </h3>

            <ul className="space-y-3">

              {MAIN_LINKS.map((item) => (
                <li key={item.href}>

                  <Link
                    href={item.href}
                    className="group flex items-center gap-2 text-xs text-slate-400 transition hover:text-emerald-400"
                  >

                    <span className="text-emerald-500 transition group-hover:translate-x-1">
                      ›
                    </span>

                    {item.label}

                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* CROPS */}

          <div className="hidden lg:block">

            <h3 className="mb-5 inline-block border-b border-emerald-500/40 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              फसल गाइड
            </h3>

            <ul className="space-y-3">

              {CROP_LINKS.map((item) => (
                <li key={item.href}>

                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-xs text-slate-400 transition hover:text-emerald-400"
                  >

                    <span>{item.emoji}</span>

                    {item.label}

                  </Link>

                </li>
              ))}

            </ul>

          </div>

          {/* CONTACT */}

          <div className="hidden lg:block">

            <h3 className="mb-5 inline-block border-b border-emerald-500/40 pb-2 text-sm font-bold uppercase tracking-wider text-white">
              संपर्क करें
            </h3>

            <div className="space-y-4">

              <div className="flex items-start gap-3">

                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <div>

                  <div className="text-xs font-semibold text-white">
                    Online Platform
                  </div>

                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    {FOOTER_CONFIG.contact.region}
                  </div>

                </div>

              </div>

              <a
                href={`tel:${FOOTER_CONFIG.contact.phone}`}
                className="flex items-center gap-3 text-xs text-slate-400 transition hover:text-emerald-400"
              >

                <Phone
                  size={17}
                  className="shrink-0 text-emerald-400"
                />

                <span>
                  किसान कॉल सेंटर: 1800-180-1551
                </span>

              </a>

              <a
                href={`mailto:${FOOTER_CONFIG.contact.email}`}
                className="flex items-start gap-3 text-xs text-slate-400 transition hover:text-emerald-400"
              >

                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />

                <span className="break-all">
                  {FOOTER_CONFIG.contact.email}
                </span>

              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-slate-400 transition hover:text-emerald-400"
              >

                <MessageCircle
                  size={17}
                  className="shrink-0 text-emerald-400"
                />

                <span>
                  WhatsApp सहायता
                </span>

              </a>

            </div>

          </div>

        </div>

        {/* =================================================
            MOBILE ACCORDIONS
        ================================================== */}

        <div className="border-b border-slate-800 lg:hidden">

          {/* SERVICES */}

          <div className="border-b border-slate-800">

            <button
              type="button"
              onClick={() => toggleSection("services")}
              className="flex w-full items-center justify-between py-5 text-left"
            >

              <span className="font-bold text-white">
                मुख्य सेवाएं
              </span>

              <ChevronDown
                size={19}
                className={`transition-transform ${
                  openSection === "services"
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {openSection === "services" && (

              <div className="grid grid-cols-2 gap-3 pb-5">

                {MAIN_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl bg-slate-900 px-3 py-3 text-xs text-slate-400 transition hover:text-emerald-400"
                  >
                    {item.label}
                  </Link>
                ))}

              </div>

            )}

          </div>

          {/* CROPS */}

          <div className="border-b border-slate-800">

            <button
              type="button"
              onClick={() => toggleSection("crops")}
              className="flex w-full items-center justify-between py-5 text-left"
            >

              <span className="font-bold text-white">
                फसल गाइड
              </span>

              <ChevronDown
                size={19}
                className={`transition-transform ${
                  openSection === "crops"
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {openSection === "crops" && (

              <div className="grid grid-cols-2 gap-3 pb-5">

                {CROP_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl bg-slate-900 px-3 py-3 text-xs text-slate-400 transition hover:text-emerald-400"
                  >
                    {item.emoji} {item.label}
                  </Link>
                ))}

              </div>

            )}

          </div>

          {/* CONTACT */}

          <div className="border-b border-slate-800">

            <button
              type="button"
              onClick={() => toggleSection("contact")}
              className="flex w-full items-center justify-between py-5 text-left"
            >

              <span className="font-bold text-white">
                संपर्क जानकारी
              </span>

              <ChevronDown
                size={19}
                className={`transition-transform ${
                  openSection === "contact"
                    ? "rotate-180"
                    : ""
                }`}
              />

            </button>

            {openSection === "contact" && (

              <div className="space-y-4 pb-5">

                <div className="flex gap-3">

                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <div>
                    <div className="text-xs font-bold text-white">
                      Online Platform
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {FOOTER_CONFIG.contact.region}
                    </div>
                  </div>

                </div>

                <a
                  href={`tel:${FOOTER_CONFIG.contact.phone}`}
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <Phone
                    size={18}
                    className="text-emerald-400"
                  />
                  1800-180-1551
                </a>

                <a
                  href={`mailto:${FOOTER_CONFIG.contact.email}`}
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <Mail
                    size={18}
                    className="text-emerald-400"
                  />
                  {FOOTER_CONFIG.contact.email}
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-slate-400"
                >
                  <MessageCircle
                    size={18}
                    className="text-emerald-400"
                  />
                  WhatsApp सहायता
                </a>

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            IMPORTANT INFORMATION
        ================================================== */}

        <div className="border-b border-slate-800 py-8">

          <div className="rounded-2xl border border-amber-400/10 bg-amber-400/5 p-5">

            <div className="flex items-start gap-3">

              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-amber-400"
              />

              <div>

                <h3 className="text-sm font-bold text-amber-300">
                  महत्वपूर्ण सूचना
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  कृषि मित्र एक व्यक्तिगत online agricultural information
                  platform है। यह सरकारी website या physical कृषि केंद्र
                  नहीं है। मंडी भाव, मौसम, खेती और कृषि संबंधी जानकारी को
                  महत्वपूर्ण निर्णय लेने से पहले संबंधित official source,
                  कृषि विभाग या स्थानीय विशेषज्ञ से verify करें।
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MOBILE CONTACT CTA
        ================================================== */}

        <div className="grid gap-3 py-7 sm:grid-cols-3">

          <a
            href={`tel:${FOOTER_CONFIG.contact.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            <Phone size={16} />
            किसान कॉल सेंटर
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-600"
          >
            <Send size={16} />
            Contact Form
          </Link>

        </div>

        {/* =================================================
            BOTTOM BAR
        ================================================== */}

        <div className="flex flex-col gap-5 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="flex items-center gap-1 text-center text-xs text-slate-500 sm:text-left">

            © {new Date().getFullYear()} कृषि मित्र।

            <span className="hidden sm:inline">
              सर्वाधिकार सुरक्षित।
            </span>

            <span className="ml-1">
              Made with
            </span>

            <Heart
              size={13}
              className="text-red-500"
              fill="currentColor"
            />

            <span>
              for Farmers
            </span>

          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">

            {IMPORTANT_LINKS.map((item, index) => (
              <div
                key={item.href}
                className="flex items-center gap-4"
              >

                <Link
                  href={item.href}
                  className="transition hover:text-emerald-400"
                >
                  {item.label}
                </Link>

                {index < IMPORTANT_LINKS.length - 1 && (
                  <span className="text-slate-700">
                    •
                  </span>
                )}

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            SCROLL TO TOP
        ================================================== */}

        <div className="flex justify-center pt-7">

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="ऊपर जाएं"
            className="group flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:border-emerald-500 hover:text-emerald-400"
          >

            <ArrowUp
              size={15}
              className="transition-transform group-hover:-translate-y-1"
            />

            ऊपर जाएं

          </button>

        </div>

      </div>

    </footer>
  );
}