
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Sprout,
  FileText,
  Landmark,
  Leaf,
  PawPrint,
  MessageCircle,
  ClipboardCheck,
  Eye,
  Heart,
  ArrowRight,
  Plus,
  Clock3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const COLLECTIONS = [
  { key: "crops", label: "Crops", endpoint: "/crops" },
  {
    key: "cropCategories",
    label: "Crop categories",
    endpoint: "/crop-categories",
  },
  { key: "schemes", label: "Government schemes", endpoint: "/schemes" },
  {
    key: "schemeCategories",
    label: "Scheme categories",
    endpoint: "/scheme-categories",
  },
  {
    key: "organic",
    label: "Organic recipes",
    endpoint: "/organic-recipes",
  },
  {
    key: "organicCategories",
    label: "Organic categories",
    endpoint: "/organic-categories",
  },
  { key: "blogs", label: "Blogs", endpoint: "/blogs/admin" },
  {
    key: "blogCategories",
    label: "Blog categories",
    endpoint: "/blog-categories/admin",
  },
  {
    key: "livestock",
    label: "Livestock listings",
    endpoint: "/livestock/admin",
  },
  {
    key: "inquiries",
    label: "Inquiries",
    endpoint: "/inquiries?limit=5&sort=newest",
  },
];

const INITIAL_DATA = Object.fromEntries(
  COLLECTIONS.map(({ key }) => [key, null])
);

function extractArray(payload, depth = 0) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object" || depth > 4) return null;

  // Common API response shapes:
  // { data: [...] }, { results: [...] }, { data: { items: [...] } }
  const keys = [
    "data",
    "items",
    "results",
    "crops",
    "schemes",
    "blogs",
    "recipes",
    "categories",
    "listings",
    "livestock",
    "inquiries",
  ];

  for (const key of keys) {
    if (payload[key] !== undefined) {
      const result = extractArray(payload[key], depth + 1);
      if (result !== null) return result;
    }
  }

  return null;
}

async function fetchCollection(endpoint, token) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `${response.status} ${response.statusText}${
        body ? ` — ${body.slice(0, 180)}` : ""
      }`
    );
  }

  const payload = await response.json();
  const items = extractArray(payload);

  if (items === null) {
    throw new Error("API response में records की array नहीं मिली।");
  }

  return items;
}

function getId(item) {
  return item?._id || item?.id || item?.slug;
}

function getStatus(item) {
  return String(item?.status || "draft").toLowerCase();
}

function getCategory(item) {
  if (typeof item?.category === "string") return item.category;

  return (
    item?.category?.name ||
    item?.category?.title ||
    item?.categoryName ||
    "Uncategorized"
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function getViewsAndLikes(collections) {
  return Object.values(collections)
    .filter(Array.isArray)
    .flat()
    .reduce(
      (totals, item) => ({
        views: totals.views + Number(item?.views || 0),
        likes: totals.likes + Number(item?.likes || 0),
      }),
      { views: 0, likes: 0 }
    );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("krishi_mitra_admin_token")
          : null;

      const results = await Promise.allSettled(
        COLLECTIONS.map(({ endpoint }) =>
          fetchCollection(endpoint, token)
        )
      );

      const nextData = { ...INITIAL_DATA };
      const nextErrors = {};

      results.forEach((result, index) => {
        const collection = COLLECTIONS[index];

        if (result.status === "fulfilled") {
          nextData[collection.key] = result.value;
        } else {
          nextErrors[collection.key] =
            result.reason?.message || "Data load नहीं हो पाया।";
        }
      });

      setData(nextData);
      setErrors(nextErrors);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();

    // Avoid setting state after this page unmounts.
    // Dashboard requests themselves remain independent.
  }, [loadDashboard]);

  const count = (key) =>
    data[key] === null ? "—" : data[key].length;

  const publishedBlogs = useMemo(
    () =>
      data.blogs === null
        ? null
        : data.blogs.filter((item) => getStatus(item) === "published"),
    [data.blogs]
  );

  const draftBlogs = useMemo(
    () =>
      data.blogs === null
        ? null
        : data.blogs.filter((item) => getStatus(item) === "draft"),
    [data.blogs]
  );

  const pendingListings = useMemo(
    () =>
      data.livestock === null
        ? null
        : data.livestock.filter((item) =>
            ["pending", "submitted"].includes(getStatus(item))
          ),
    [data.livestock]
  );

  const recentBlogs = useMemo(() => {
    if (data.blogs === null) return null;

    return [...data.blogs]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [data.blogs]);

  const recentInquiries = useMemo(() => {
    if (data.inquiries === null) return null;

    return [...data.inquiries]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || 0).getTime() -
          new Date(a.createdAt || a.updatedAt || 0).getTime()
      )
      .slice(0, 5);
  }, [data.inquiries]);

  const analytics = useMemo(
    () => getViewsAndLikes(data),
    [data]
  );

  const failedCount = Object.keys(errors).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />
          <p className="text-sm text-slate-500">
            MongoDB से dashboard data load हो रहा है...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-green-600">
            Admin Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 md:text-3xl">
            Welcome back, Admin 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Krishi Mitra platform का content और activity manage करें।
          </p>
          {lastUpdated && (
            <p className="mt-2 text-xs text-slate-400">
              Last checked: {lastUpdated.toLocaleTimeString("en-IN")}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ExternalLink size={16} />
            Website
          </Link>
        </div>
      </div>

      {/* API errors */}
      {failedCount > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-amber-700" size={20} />
            <div className="min-w-0">
              <h2 className="font-semibold text-amber-900">
                कुछ data load नहीं हुआ ({failedCount} endpoint)
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                जिन endpoints में error है, उनकी संख्या — दिखाई जाएगी, गलत
                zero नहीं।
              </p>
              <ul className="mt-3 space-y-1 text-xs text-amber-900">
                {Object.entries(errors).map(([key, message]) => (
                  <li key={key}>
                    <strong>
                      {COLLECTIONS.find((item) => item.key === key)?.label ||
                        key}
                      :
                    </strong>{" "}
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Crops"
          value={count("crops")}
          icon={Sprout}
          href="/admin/crops"
          iconBox="bg-green-50 text-green-700"
        />
        <StatCard
          title="Published Blogs"
          value={publishedBlogs === null ? "—" : publishedBlogs.length}
          icon={FileText}
          href="/admin/blog"
          iconBox="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Government Schemes"
          value={count("schemes")}
          icon={Landmark}
          href="/admin/schemes"
          iconBox="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Inquiries"
          value={count("inquiries")}
          icon={MessageCircle}
          href="/admin/inquiries"
          iconBox="bg-orange-50 text-orange-700"
        />
      </div>

      {/* Secondary statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniStat
          title="Organic Recipes"
          value={count("organic")}
          icon={Leaf}
          href="/admin/organic"
        />
        <MiniStat
          title="Livestock Listings"
          value={count("livestock")}
          icon={PawPrint}
          href="/admin/livestock"
        />
        <MiniStat
          title="Pending Listings"
          value={pendingListings === null ? "—" : pendingListings.length}
          icon={ClipboardCheck}
          href="/admin/livestock-listings"
          highlight={Boolean(pendingListings?.length)}
        />
        <MiniStat
          title="Draft Blogs"
          value={draftBlogs === null ? "—" : draftBlogs.length}
          icon={Clock3}
          href="/admin/blog"
        />
      </div>

      {/* Content analytics and quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">Content Overview</h2>
              <p className="mt-1 text-xs text-slate-500">
                Loaded content performance
              </p>
            </div>
            <TrendingUp size={20} className="text-green-600" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <AnalyticsCard
              title="Total Views"
              value={formatNumber(analytics.views)}
              icon={Eye}
            />
            <AnalyticsCard
              title="Total Likes"
              value={formatNumber(analytics.likes)}
              icon={Heart}
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            {failedCount > 0
              ? "ये totals सिर्फ सफलतापूर्वक load हुए records पर आधारित हैं।"
              : "सभी requested collections सफलतापूर्वक load हुए।"}
          </p>

          <div className="mt-6 space-y-4">
            <ProgressRow
              label="Crops"
              value={data.crops?.length ?? null}
              total={50}
            />
            <ProgressRow
              label="Blogs"
              value={data.blogs?.length ?? null}
              total={50}
            />
            <ProgressRow
              label="Government Schemes"
              value={data.schemes?.length ?? null}
              total={25}
            />
            <ProgressRow
              label="Organic Recipes"
              value={data.organic?.length ?? null}
              total={25}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Quick Actions</h2>
          <p className="mt-1 text-xs text-slate-500">
            Frequently used admin actions
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              href="/admin/crops/new"
              icon={Sprout}
              title="Add Crop"
              description="नई फसल जोड़ें"
            />
            <QuickAction
              href="/admin/schemes/new"
              icon={Landmark}
              title="Add Scheme"
              description="नई सरकारी योजना"
            />
            <QuickAction
              href="/admin/blog/new"
              icon={FileText}
              title="Create Blog"
              description="नया article लिखें"
            />
            <QuickAction
              href="/admin/organic/new"
              icon={Leaf}
              title="Add Organic Article"
              description="जैविक खेती content"
            />
          </div>
        </div>
      </div>

      {/* Pending approvals */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Pending Approvals</h2>
            <p className="mt-1 text-xs text-slate-500">
              Review करने के लिए pending listings
            </p>
          </div>
          <Link
            href="/admin/livestock-listings"
            className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {pendingListings === null ? (
          <DataError message={errors.livestock} />
        ) : pendingListings.length > 0 ? (
          <div className="divide-y">
            {pendingListings.slice(0, 5).map((item, index) => (
              <div
                key={getId(item) || index}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <PawPrint size={19} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.title || item.name || "Livestock Listing"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.location || "Location not available"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/livestock-listings/${getId(item)}`}
                  className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                >
                  Review <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="No pending approvals"
            description="अभी कोई pending listing नहीं मिली।"
          />
        )}
      </div>

      {/* Recent blogs */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Recent Content</h2>
            <p className="mt-1 text-xs text-slate-500">
              Recently created या updated blogs
            </p>
          </div>
          <Link
            href="/admin/blog"
            className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            Manage <ArrowRight size={15} />
          </Link>
        </div>

        {recentBlogs === null ? (
          <DataError message={errors.blogs} />
        ) : recentBlogs.length > 0 ? (
          <div className="divide-y">
            {recentBlogs.map((blog, index) => (
              <div
                key={getId(blog) || index}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {blog.title || "Untitled Blog"}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{getCategory(blog)}</span>
                      <span>•</span>
                      <span>{getStatus(blog)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/blog/${getId(blog)}`}
                  className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-700 hover:text-green-600"
                >
                  Edit <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="No blogs yet"
            description="पहला blog create करके शुरुआत करें।"
            actionHref="/admin/blog/new"
            actionText="Create Blog"
          />
        )}
      </div>

      {/* Recent contact inquiries */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Top 5 Recent Inquiries</h2>
            <p className="mt-1 text-xs text-slate-500">
              नवीनतम contact messages और संपर्क विवरण
            </p>
          </div>
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
          >
            सभी देखें <ArrowRight size={15} />
          </Link>
        </div>

        {recentInquiries === null ? (
          <DataError message={errors.inquiries} />
        ) : recentInquiries.length ? (
          <div className="divide-y">
            {recentInquiries.map((inquiry, index) => (
              <div
                key={getId(inquiry) || inquiry.inquiryNumber || index}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                    <MessageCircle size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {inquiry.subject || inquiry.name || "Contact inquiry"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {inquiry.name || "नाम उपलब्ध नहीं"}
                      {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                      {inquiry.email ? ` · ${inquiry.email}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {inquiry.queryType || "सामान्य संपर्क"}
                      {inquiry.createdAt
                        ? ` · ${new Date(inquiry.createdAt).toLocaleString("hi-IN")}`
                        : ""}
                    </p>
                  </div>
                </div>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    संपर्क करें
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="अभी inquiries नहीं हैं"
            description="नए contact messages यहां दिखाई देंगे।"
          />
        )}
      </div>

      {/* API status */}
      <div
        className={`rounded-2xl border p-5 ${
          failedCount
            ? "border-amber-200 bg-amber-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-2">
            {failedCount ? (
              <AlertCircle size={20} className="text-amber-600" />
            ) : (
              <CheckCircle2 size={20} className="text-green-600" />
            )}
          </div>
          <div>
            <h3
              className={`font-bold ${
                failedCount ? "text-amber-900" : "text-green-900"
              }`}
            >
              {failedCount
                ? "Dashboard partially loaded"
                : "Dashboard API connected"}
            </h3>
            <p
              className={`mt-1 text-sm ${
                failedCount ? "text-amber-800" : "text-green-800"
              }`}
            >
              {failedCount
                ? `${COLLECTIONS.length - failedCount} of ${COLLECTIONS.length} collections loaded. ऊपर दिए गए errors जाँचें।`
                : `${COLLECTIONS.length} API endpoints से data सफलतापूर्वक प्राप्त हुआ।`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, href, iconBox }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${iconBox}`}>
          <Icon size={21} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-green-600">
        Manage <ArrowRight size={13} />
      </div>
    </Link>
  );
}

function MiniStat({ title, value, icon: Icon, href, highlight }) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        highlight ? "border-amber-300 bg-amber-50/50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Link>
  );
}

function AnalyticsCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <Icon size={17} className="text-slate-400" />
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProgressRow({ label, value, total }) {
  const percentage =
    value === null ? 0 : Math.min(100, Math.round((value / total) * 100));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">
          {value === null ? "Unavailable" : value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, title, description }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-3 transition hover:border-green-300 hover:bg-green-50"
    >
      <div className="rounded-lg bg-green-50 p-2 text-green-600">
        <Icon size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ArrowRight size={15} className="text-slate-400" />
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionText,
}) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={22} />
      </div>
      <h3 className="mt-3 text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700"
        >
          <Plus size={14} />
          {actionText}
        </Link>
      )}
    </div>
  );
}

function DataError({ message }) {
  return (
    <div className="px-5 py-8 text-center">
      <AlertCircle size={22} className="mx-auto text-amber-600" />
      <p className="mt-2 text-sm font-semibold text-slate-800">
        Data load नहीं हुआ
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {message || "API endpoint जाँचें और Refresh करें।"}
      </p>
    </div>
  );
}