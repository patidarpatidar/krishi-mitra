
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  MessageSquare,
  Clock3,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { inquiryApi } from "@/lib/inquiryApi";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const TYPE_LABELS = {
  "Mandi Bhav": "मंडी भाव पूछताछ",
  "Crop Advisory": "खेती-किसानी जानकारी",
  Weather: "मौसम संबंधी जानकारी",
  "Government Scheme": "सरकारी योजना",
  "Blog Feedback": "ब्लॉग फीडबैक / सुझाव",
  Other: "अन्य विषय",
};

const DISTRICT_LABELS = {
  Neemuch: "नीमच",
  Mandsaur: "मंदसौर",
  Ratlam: "रतलाम",
  Ujjain: "उज्जैन",
};

const inputClass =
  "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600";

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status) {
  const classes = {
    new: "bg-blue-100 text-blue-700",
    "in-progress": "bg-amber-100 text-amber-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-slate-200 text-slate-700",
  };

  return classes[status] || "bg-slate-100 text-slate-600";
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({
    all: 0,
    new: 0,
    "in-progress": 0,
    resolved: 0,
    closed: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [queryType, setQueryType] = useState("all");
  const [district, setDistrict] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await inquiryApi.getInquiries({
        search,
        status,
        queryType,
        district,
        page: String(page),
        limit: "20",
        sort: "newest",
      });

      setItems(response?.data || []);
      setCounts(response?.counts || {
        all: 0,
        new: 0,
        "in-progress": 0,
        resolved: 0,
        closed: 0,
      });
      setPagination(response?.pagination || {
        page: 1,
        total: 0,
        totalPages: 1,
      });
    } catch (err) {
      setError(err.message || "Inquiries load nahi hui.");
    } finally {
      setLoading(false);
    }
  }, [search, status, queryType, district, page]);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  function applySearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function updateStatus(id, nextStatus) {
    setBusyId(id);
    setError("");

    try {
      await inquiryApi.updateInquiry(id, { status: nextStatus });
      await loadInquiries();
    } catch (err) {
      setError(err.message || "Status update nahi hua.");
    } finally {
      setBusyId("");
    }
  }

  async function editNotes(item) {
    const adminNotes = window.prompt(
      "Admin notes:",
      item.adminNotes || ""
    );

    if (adminNotes === null) return;

    setBusyId(item._id);
    setError("");

    try {
      await inquiryApi.updateInquiry(item._id, { adminNotes });
      await loadInquiries();
    } catch (err) {
      setError(err.message || "Notes save nahi hue.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteInquiry(item) {
    if (
      !window.confirm(
        `Delete inquiry ${item.inquiryNumber || item._id} from ${item.name}?`
      )
    ) {
      return;
    }

    setBusyId(item._id);
    setError("");

    try {
      await inquiryApi.deleteInquiry(item._id);
      await loadInquiries();
    } catch (err) {
      setError(err.message || "Inquiry delete nahi hui.");
    } finally {
      setBusyId("");
    }
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Admin / Contact Management
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Inquiries
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage farmer questions, feedback and support requests.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInquiries}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Inquiries"
            value={counts.all}
            icon={<MessageSquare size={20} />}
          />
          <StatCard
            title="New"
            value={counts.new}
            icon={<Clock3 size={20} />}
          />
          <StatCard
            title="In Progress"
            value={counts["in-progress"]}
            icon={<ExternalLink size={20} />}
          />
          <StatCard
            title="Resolved"
            value={counts.resolved}
            icon={<CheckCircle2 size={20} />}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <form
            onSubmit={applySearch}
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"
          >
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, phone, ID or message..."
                className={`${inputClass} w-full pl-9`}
              />
            </div>

            <select
              value={status}
              onChange={(e) => changeFilter(setStatus, e.target.value)}
              className={inputClass}
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={queryType}
              onChange={(e) => changeFilter(setQueryType, e.target.value)}
              className={inputClass}
            >
              <option value="all">All inquiry types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={(e) => changeFilter(setDistrict, e.target.value)}
              className={inputClass}
            >
              <option value="all">All districts</option>
              {Object.entries(DISTRICT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 md:col-span-2 xl:col-span-1"
            >
              Search
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading inquiries...
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare
                size={38}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="font-semibold text-slate-700">
                No inquiries found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search or filter.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-green-200 sm:p-5"
                >
                  <div className="flex flex-col justify-between gap-4 xl:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          {item.inquiryNumber || item._id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                          {TYPE_LABELS[item.queryType] || item.queryType}
                        </span>
                      </div>

                      <h2 className="mt-3 text-lg font-bold text-slate-900">
                        {item.subject || item.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600">
                        {item.name} · {item.phone}
                        {item.email ? ` · ${item.email}` : ""}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {DISTRICT_LABELS[item.district] || item.district}
                        {" · "}
                        {formatDate(item.createdAt)}
                      </p>

                      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {item.message}
                      </p>

                      {item.adminNotes && (
                        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                          <strong>Admin notes:</strong> {item.adminNotes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-start gap-2 xl:w-56 xl:flex-col">
                      <Link
                        href={`/admin/view/inquiries/${item._id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        View full details
                      </Link>
                      <label className="w-full text-xs font-semibold text-slate-500">
                        Update status
                      </label>

                      <select
                        value={item.status}
                        disabled={busyId === item._id}
                        onChange={(e) =>
                          updateStatus(item._id, e.target.value)
                        }
                        className={`${inputClass} w-full`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <a
                        href={`tel:${item.phone}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Call farmer
                      </a>

                      <button
                        type="button"
                        onClick={() => editNotes(item)}
                        disabled={busyId === item._id}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                      >
                        Edit admin notes
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteInquiry(item)}
                        disabled={busyId === item._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && pagination.total > 0 && (
            <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                {" · "}
                {pagination.total} total inquiries
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(pagination.totalPages, value + 1)
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <span className="text-green-700">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}