"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, Loader2, Clock3, Tag } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/apiClient";
import { unwrapApiItem } from "@/lib/publicApi";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const MODULES = {
  crops: { label: "फसल", endpoint: (id) => `/crops/${id}`, back: "/admin/crops" },
  "crop-categories": { label: "फसल श्रेणी", endpoint: (id) => `/crop-categories/${id}`, back: "/admin/categories?type=crop" },
  blogs: { label: "ब्लॉग", endpoint: (id) => `/blogs/admin/${id}`, back: "/admin/blog" },
  "blog-categories": { label: "ब्लॉग श्रेणी", endpoint: (id) => `/blog-categories/${id}`, back: "/admin/categories?type=blog" },
  livestock: { label: "पशुपालन लेख", endpoint: (id) => `/livestock/admin/${id}`, back: "/admin/livestock" },
  organic: { label: "जैविक खेती लेख", endpoint: (id) => `/organic-recipes/admin/${id}`, back: "/admin/organic" },
  "organic-categories": { label: "जैविक श्रेणी", endpoint: (id) => `/organic-categories/${id}`, back: "/admin/organic" },
  schemes: { label: "सरकारी योजना", endpoint: (id) => `/schemes/${id}`, back: "/admin/schemes" },
  "scheme-categories": { label: "योजना श्रेणी", endpoint: (id) => `/scheme-categories/${id}`, back: "/admin/schemes" },
  farmers: { label: "किसान", endpoint: (id) => `/admin/farmers/${id}`, back: "/admin/farmers" },
  inquiries: { label: "पूछताछ", endpoint: (id) => `/inquiries/${id}`, back: "/admin/inquiries" },
};

const FIELD_LABELS = {
  name: "नाम",
  title: "शीर्षक",
  slug: "Slug",
  englishName: "अंग्रेजी नाम",
  scientificName: "वैज्ञानिक नाम",
  excerpt: "संक्षिप्त विवरण",
  description: "विवरण",
  content: "सामग्री",
  overview: "परिचय",
  category: "श्रेणी",
  categoryId: "श्रेणी",
  season: "मौसम",
  status: "स्थिति",
  featured: "Featured",
  isFeatured: "Featured",
  views: "Views",
  likes: "Likes",
  comments: "टिप्पणियां",
  author: "लेखक",
  publishedAt: "प्रकाशन तिथि",
  createdAt: "बनाने की तिथि",
  updatedAt: "अंतिम अपडेट",
  email: "ईमेल",
  phone: "मोबाइल",
  village: "गांव",
  district: "जिला",
  state: "राज्य",
  landArea: "भूमि क्षेत्र",
  landUnit: "भूमि इकाई",
  irrigation: "सिंचाई",
  isActive: "खाता सक्रिय",
  statusLabel: "स्थिति",
  message: "संदेश",
  queryType: "पूछताछ का प्रकार",
  priority: "प्राथमिकता",
  adminNotes: "Admin notes",
  answer: "जवाब",
  question: "सवाल",
  text: "टिप्पणी",
  image: "चित्र",
  coverImage: "कवर चित्र",
  icon: "आइकन",
  tags: "Tags",
  varieties: "किस्में",
  diseases: "रोग एवं कीट",
  soilRequirement: "मिट्टी की आवश्यकता",
  sowingTime: "बुआई का समय",
  harvestingTime: "कटाई का समय",
  waterRequirement: "पानी की आवश्यकता",
  seedRate: "बीज दर",
  inquiryNumber: "पूछताछ क्रमांक",
  categoryLabel: "श्रेणी का नाम",
  categorySlug: "श्रेणी Slug",
  sortOrder: "दिखाने का क्रम",
  price: "मूल्य",
  amount: "राशि",
  yield: "उत्पादन",
  unit: "इकाई",
  url: "लिंक",
  officialUrl: "आधिकारिक लिंक",
  sourceUrl: "स्रोत लिंक",
  website: "वेबसाइट",
  pincode: "पिनकोड",
  readTime: "पढ़ने का समय",
  metaTitle: "SEO शीर्षक",
  metaDescription: "SEO विवरण",
  ogImage: "Open Graph चित्र",
  twitterImage: "Twitter चित्र",
};

const MODULE_ITEM_KEYS = {
  crops: ["crop"],
  blogs: ["blog"],
  schemes: ["scheme"],
  livestock: ["article", "livestock"],
  organic: ["recipe", "organicRecipe"],
  farmers: ["farmer", "user"],
  inquiries: ["inquiry"],
  "crop-categories": ["category", "cropCategory"],
  "blog-categories": ["category", "blogCategory"],
  "organic-categories": ["category", "organicCategory"],
  "scheme-categories": ["category", "schemeCategory"],
};

const LONG_TEXT_FIELDS = new Set([
  "description",
  "content",
  "excerpt",
  "overview",
  "intro",
  "summary",
  "message",
  "answer",
  "adminNotes",
  "metaDescription",
]);

const IMAGE_FIELDS = new Set([
  "image",
  "coverImage",
  "thumbnail",
  "ogImage",
  "twitterImage",
]);

function labelFor(key) {
  return FIELD_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase());
}

function formatScalar(value) {
  if (typeof value === "boolean") return value ? "हाँ" : "नहीं";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("hi-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
    }
  }
  return String(value);
}

function DetailValue({ value, depth = 0, fieldKey = "" }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    const isImage = IMAGE_FIELDS.has(fieldKey) || /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value);
    return (
      <div className="space-y-2">
        {isImage && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="block w-fit">
            <img src={value} alt={`${labelFor(fieldKey)} preview`} className="max-h-56 max-w-full rounded-xl border border-slate-200 object-contain" />
          </a>
        )}
        <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-emerald-700 hover:underline">
          {value}<ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      </div>
    );
  }
  if (Array.isArray(value)) {
    if (!value.length) return <span className="text-slate-400">—</span>;
    if (value.every((item) => ["string", "number", "boolean"].includes(typeof item))) {
      const isLongText = value.some((item) => typeof item === "string" && item.length > 60);
      return isLongText ? (
        <ul className="list-inside list-disc space-y-1.5 text-sm leading-6 text-slate-700">
          {value.map((item, index) => <li key={`${index}-${String(item).slice(0, 20)}`} className="break-words">{formatScalar(item)}</li>)}
        </ul>
      ) : (
        <div className="flex flex-wrap gap-2">{value.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{formatScalar(item)}</span>)}</div>
      );
    }
    return (
      <div className="space-y-3">
        {value.map((item, index) => (
          <div key={item?._id || index} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            {typeof item === "object" && item !== null
              ? <DetailObject value={item} depth={depth + 1} />
              : <DetailValue value={item} depth={depth + 1} />}
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === "object") return <DetailObject value={value} depth={depth} />;
  return <span className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{formatScalar(value)}</span>;
}

function DetailObject({ value, depth = 0 }) {
  const entries = Object.entries(value || {}).filter(([key, item]) =>
    !["_id", "__v", "password", "passwordHash", "resetToken", "verificationToken"].includes(key) &&
    item !== undefined &&
    !(key === "id" && item === value._id)
  );
  if (!entries.length) return <span className="text-slate-400">—</span>;
  return (
    <dl className={depth === 0 ? "grid gap-4 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2"}>
      {entries.map(([key, item]) => (
        <div key={key} className={`${depth === 0 ? "min-w-0 rounded-xl border border-slate-100 p-4" : "min-w-0"} ${depth === 0 && LONG_TEXT_FIELDS.has(key) ? "sm:col-span-2 bg-slate-50/70" : ""}`}>
          <dt className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">{labelFor(key)}</dt>
          <dd><DetailValue value={item} depth={depth + 1} fieldKey={key} /></dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminRecordViewPage() {
  const params = useParams();
  const moduleKey = params?.module;
  const id = params?.id;
  const config = MODULES[moduleKey];
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!config || !id) {
      setLoading(false);
      setError("यह admin detail page उपलब्ध नहीं है।");
      return undefined;
    }
    let cancelled = false;
    async function loadRecord() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}${config.endpoint(encodeURIComponent(id))}`, {
          headers: { Accept: "application/json", ...getAdminAuthHeaders() },
          cache: "no-store",
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || `विवरण लोड नहीं हुए (${response.status})`);
        }
        const data = unwrapApiItem(result, [
          ...(MODULE_ITEM_KEYS[moduleKey] || []),
          "record",
          "item",
        ]);
        if (!data) throw new Error("रिकॉर्ड उपलब्ध नहीं है।");
        if (!cancelled) setRecord(data);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "विवरण लोड नहीं हो सके।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadRecord();
    return () => { cancelled = true; };
  }, [config, id]);

  const recordTitle = record?.name || record?.title || record?.label || record?.inquiryNumber || config?.label;
  const recordStatus = record?.statusLabel || record?.status || (record?.isActive !== undefined ? (record.isActive ? "सक्रिय" : "निष्क्रिय") : "");
  const recordCategory = record?.categoryLabel || record?.category?.name || record?.category?.label || record?.category || "";

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Link href={config?.back || "/admin"} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
        <ArrowLeft size={16} /> सूची पर वापस जाएं
      </Link>
      <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-white px-5 py-6 sm:px-7">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{config?.label || "Admin record"} · पूरा विवरण</p>
          <h1 className="mt-2 break-words text-2xl font-black text-slate-900 sm:text-3xl">{loading ? "विवरण लोड हो रहे हैं..." : recordTitle}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {recordStatus && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{recordStatus}</span>}
            {recordCategory && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"><Tag className="h-3 w-3" />{typeof recordCategory === "string" ? recordCategory : formatScalar(recordCategory)}</span>}
            {record?.slug && <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">/{record.slug}</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 py-3 text-xs text-slate-500 sm:px-7">
          {(record?.inquiryNumber || record?._id || record?.id) && <span className="font-mono">ID: {record.inquiryNumber || record._id || record.id}</span>}
          {record?.createdAt && <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> बनाया: {formatScalar(record.createdAt)}</span>}
          {record?.updatedAt && <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> अपडेट: {formatScalar(record.updatedAt)}</span>}
        </div>
      </header>
      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border bg-white p-12 text-slate-500">
          <Loader2 className="animate-spin" size={20} /> विवरण लोड हो रहे हैं...
        </div>
      ) : error ? (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>
      ) : record ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <DetailObject value={record} />
        </section>
      ) : null}
    </main>
  );
}
