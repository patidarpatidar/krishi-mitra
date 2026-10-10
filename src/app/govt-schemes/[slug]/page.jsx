"use client";

export const dynamic = "force-dynamic";

import { use } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Eye,
  FileText,
  Heart,
  Landmark,
  Phone,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Sprout,
} from "lucide-react";

import {
  getOrCreateVisitorId,
  publicApiRequest,
} from "@/lib/publicApi";

const iconMap = {
  sprout: Sprout,
  shield: ShieldIcon,
  credit: CreditCardIcon,
  landmark: Landmark,
};

function ShieldIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CreditCardIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function InfoList({
  items = [],
  icon: Icon = CheckCircle2,
}) {
  return (
    <div className="space-y-3">

      {items.map((item, index) => (

        <div
          key={index}
          className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
        >

          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

          <p className="text-sm leading-6 text-slate-600">
            {item}
          </p>

        </div>

      ))}

    </div>
  );
}

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

      <div className="mb-5 flex items-start gap-3">

        <div className="rounded-xl bg-emerald-50 p-3">
          <Icon className="h-5 w-5 text-emerald-700" />
        </div>

        <div>

          <h2 className="text-lg font-black text-slate-800">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

      {children}

    </section>
  );
}

export default function GovernmentSchemeDetails({
  params,
}) {
  const [scheme, setScheme] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeSubmitting, setLikeSubmitting] = useState(false);
  const [engagementError, setEngagementError] = useState("");

  useEffect(() => {
    setVisitorId(getOrCreateVisitorId());
  }, []);

  useEffect(() => {
    let cancelled = false;
    publicApiRequest(`/schemes/slug/${encodeURIComponent(params.slug)}`)
      .then((result) => {
        if (!cancelled) setScheme(result.data || null);
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || "योजना लोड नहीं हो सकी।");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  useEffect(() => {
    if (!scheme?._id || loading || !visitorId) return undefined;

    let cancelled = false;
    publicApiRequest(`/schemes/${encodeURIComponent(scheme._id)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    })
      .then((result) => {
        if (cancelled) return;
        setScheme((current) =>
          current
            ? {
                ...current,
                views: Number(result.data?.views) || 0,
                likes: Number(result.data?.likes) || 0,
              }
            : current
        );
        setLiked(Boolean(result.data?.liked));
      })
      .catch((trackError) => {
        if (!cancelled) {
          setEngagementError(
            trackError.message || "आंकड़े अपडेट नहीं हो सके।"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loading, scheme?._id, visitorId]);

  const toggleLike = async () => {
    if (!scheme?._id || !visitorId || likeSubmitting) return;

    setLikeSubmitting(true);
    setEngagementError("");
    try {
      const result = await publicApiRequest(
        `/schemes/${encodeURIComponent(scheme._id)}/like`,
        {
          method: liked ? "DELETE" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        }
      );
      setLiked(Boolean(result.data?.liked));
      setScheme((current) =>
        current
          ? { ...current, likes: Number(result.data?.likes) || 0 }
          : current
      );
    } catch (trackError) {
      setEngagementError(
        trackError.message || "लाइक अपडेट नहीं हो सका।"
      );
    } finally {
      setLikeSubmitting(false);
    }
  };

  if (loading) return <main className="min-h-screen p-8 text-center">योजना लोड हो रही है...</main>;
  if (error || !scheme) {
    return (
      <main className="min-h-screen p-8 text-center">
        <p role="alert">{error || "योजना नहीं मिली।"}</p>
        <Link href="/govt-schemes" className="mt-4 inline-block text-emerald-700">सभी योजनाएं देखें</Link>
      </main>
    );
  }

  const Icon =
    iconMap[scheme.icon] || Landmark;

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-800 text-white">

        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

          {/* BACK */}
          <Link
            href="/govt-schemes"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-100 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            सभी सरकारी योजनाएं
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

            {/* LEFT */}
            <div>

              <div className="flex flex-wrap gap-2">

                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold">
                  {scheme.level}
                </span>

                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-bold text-lime-200">
                  {scheme.category}
                </span>

              </div>

              <div className="mt-6 flex items-start gap-4">

                <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                  <Icon className="h-8 w-8 text-lime-300" />
                </div>

                <div>

                  <h1 className="text-3xl font-black leading-tight sm:text-5xl">
                    {scheme.name}
                  </h1>

                  <p className="mt-2 text-lg font-bold text-lime-300">
                    {scheme.shortName}
                  </p>

                </div>

              </div>

              <p className="mt-6 max-w-3xl text-sm leading-8 text-emerald-50/80 sm:text-base">
                {scheme.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-7 flex flex-wrap gap-3">

                {(scheme.importantLinks || []).map(
                  (link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-black transition ${
                        link.type === "official"
                          ? "bg-lime-400 text-emerald-950 hover:bg-lime-300"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {link.title}

                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )
                )}

                <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold">
                  <Eye className="h-4 w-4" />
                  {Number(scheme.views || 0).toLocaleString("hi-IN")} views
                </span>
                <button
                  type="button"
                  onClick={toggleLike}
                  disabled={!visitorId || likeSubmitting}
                  aria-pressed={liked}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-3 text-xs font-bold disabled:cursor-wait disabled:opacity-60 ${
                    liked
                      ? "border-rose-200 bg-rose-100 text-rose-800"
                      : "border-white/15 bg-white/10 text-white"
                  }`}
                >
                  <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
                  {Number(scheme.likes || 0).toLocaleString("hi-IN")}
                </button>
              </div>
              {engagementError && (
                <p className="mt-2 text-sm text-rose-100" role="alert">
                  {engagementError}
                </p>
              )}

            </div>

            {/* QUICK INFO */}
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-lime-300/10 p-3">
                  <Landmark className="h-5 w-5 text-lime-300" />
                </div>

                <div>

                  <p className="text-[10px] text-emerald-100/60">
                    Government
                  </p>

                  <p className="text-sm font-bold">
                    {scheme.government}
                  </p>

                </div>

              </div>

              <div className="my-5 border-t border-white/10" />

              <div>

                <p className="text-[10px] text-emerald-100/60">
                  Department
                </p>

                <p className="mt-1 text-sm leading-6 text-emerald-50/80">
                  {scheme.department}
                </p>

              </div>

              {scheme.helpline && (
                <>
                  <div className="my-5 border-t border-white/10" />

                  <a
                    href={`tel:${scheme.helpline}`}
                    className="flex items-center gap-3 rounded-xl bg-white/10 p-3 hover:bg-white/15"
                  >

                    <Phone className="h-5 w-5 text-lime-300" />

                    <div>
                      <p className="text-[10px] text-emerald-100/60">
                        Helpline
                      </p>

                      <p className="font-black">
                        {scheme.helpline}
                      </p>
                    </div>

                  </a>
                </>
              )}

              <div className="mt-5 flex items-center gap-2 text-[10px] text-emerald-100/60">
                <Clock className="h-3.5 w-3.5" />
                Last verified:{" "}
                {scheme.lastVerifiedAt}
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-2">

          {/* BENEFITS */}
          <SectionCard
            title="योजना के लाभ"
            description="इस योजना से मिलने वाले प्रमुख लाभ"
            icon={CheckCircle2}
          >
            <InfoList
              items={scheme.benefits}
            />
          </SectionCard>

          {/* ELIGIBILITY */}
          <SectionCard
            title="पात्रता"
            description="आवेदन से पहले पात्रता जरूर जांचें"
            icon={ShieldCheck}
          >
            <InfoList
              items={scheme.eligibility}
              icon={ShieldCheck}
            />
          </SectionCard>

          {/* DOCUMENTS */}
          <SectionCard
            title="आवश्यक दस्तावेज"
            description="आवेदन के समय आवश्यक हो सकने वाले documents"
            icon={FileText}
          >
            <InfoList
              items={scheme.documents}
              icon={FileText}
            />
          </SectionCard>

          {/* HOW TO APPLY */}
          <SectionCard
            title="आवेदन कैसे करें?"
            description="सामान्य आवेदन प्रक्रिया"
            icon={ArrowUpRight}
          >

            <div className="space-y-3">

              {scheme.howToApply.map(
                (step, index) => (

                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-black text-white">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {step}
                    </p>

                  </div>

                )
              )}

            </div>

          </SectionCard>

        </div>

        {/* OFFICIAL LINKS */}
        <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">

          <div className="flex items-start gap-3">

            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />

            <div className="flex-1">

              <h2 className="text-lg font-black text-emerald-950">
                Official Government Links
              </h2>

              <p className="mt-1 text-sm leading-6 text-emerald-900/60">
                आवेदन, status और नवीनतम जानकारी के लिए
                संबंधित official portal का उपयोग करें।
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">

                {scheme.importantLinks.map(
                  (link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
                    >

                      <div>

                        <p className="text-sm font-bold text-slate-800">
                          {link.title}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          Official external portal
                        </p>

                      </div>

                      <ExternalLink className="h-4 w-4 text-emerald-600" />

                    </a>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* SOURCE */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <p className="text-xs font-bold text-slate-400">
            INFORMATION SOURCE
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-bold text-slate-800">
                {scheme.sourceName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Last verified:{" "}
                {scheme.lastVerifiedAt}
              </p>

            </div>

            <a
              href={scheme.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800"
            >
              Source Website
              <ExternalLink className="h-4 w-4" />
            </a>

          </div>

        </div>

        {/* TAGS */}
        <div className="mt-6 flex flex-wrap gap-2">

          {(scheme.tags || []).map((tag) => (

            <span
              key={tag}
              className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-500"
            >
              #{tag}
            </span>

          ))}

        </div>

        {/* DISCLAIMER */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">

          <p className="text-xs leading-6 text-slate-600">

            <strong className="text-amber-700">
              महत्वपूर्ण:
            </strong>{" "}
            कृषि मित्र एक व्यक्तिगत कृषि सूचना और ब्लॉग
            प्लेटफॉर्म है। यह सरकारी वेबसाइट, सरकारी कार्यालय
            या official government service centre नहीं है।
            योजनाओं की पात्रता, लाभ, राशि, आवेदन अवधि और नियम
            बदल सकते हैं। आवेदन या आर्थिक निर्णय लेने से पहले
            संबंधित official government portal पर नवीनतम
            जानकारी verify करें।

          </p>

        </div>

      </section>

    </main>
  );
}