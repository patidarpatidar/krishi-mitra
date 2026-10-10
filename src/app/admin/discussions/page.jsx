"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/apiClient";

const SOURCES = {
  questions: {
    label: "फसल के सवाल",
    endpoint: "/crops/admin/questions",
    answerEndpoint: (id) => `/crops/admin/questions/${encodeURIComponent(id)}/answer`,
    removeEndpoint: (id) => `/crops/admin/questions/${encodeURIComponent(id)}`,
    content: (item) => item.question,
    target: (item) => item.cropId,
    targetLabel: "फसल",
    targetHref: (target) => `/crops/${encodeURIComponent(target.slug)}`,
  },
  comments: {
    label: "ब्लॉग टिप्पणियां",
    endpoint: "/blogs/admin/comments",
    answerEndpoint: (id) => `/blogs/admin/comments/${encodeURIComponent(id)}/answer`,
    removeEndpoint: (id) => `/blogs/admin/comments/${encodeURIComponent(id)}`,
    content: (item) => item.text,
    target: (item) => item.blogId,
    targetLabel: "लेख",
    targetHref: (target) => `/blog/${encodeURIComponent(target.slug)}`,
  },
};

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("hi-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminDiscussionsPage() {
  const [source, setSource] = useState("questions");
  const [filter, setFilter] = useState("all");
  const [records, setRecords] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest(SOURCES[source].endpoint);
      const items = Array.isArray(result.data) ? result.data : [];
      setRecords(items);
      setDrafts(Object.fromEntries(items.map((item) => [item._id, item.answer || ""])));
    } catch (loadError) {
      setError(loadError.message || "चर्चा लोड नहीं हो सकी।");
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => records.filter((item) => {
    const answered = Boolean(item.answer?.trim());
    const target = SOURCES[source].target(item);
    const text = `${SOURCES[source].content(item)} ${item.name || ""} ${target?.name || target?.title || ""}`
      .toLowerCase();
    return (
      (filter === "all" || (filter === "answered" ? answered : !answered)) &&
      text.includes(search.trim().toLowerCase())
    );
  }), [records, filter, search, source]);

  async function saveAnswer(item) {
    const answer = (drafts[item._id] || "").trim();
    if (!answer) {
      setError("जवाब लिखना आवश्यक है।");
      return;
    }
    setBusyId(item._id);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest(SOURCES[source].answerEndpoint(item._id), {
        method: "PATCH",
        body: JSON.stringify({ answer }),
      });
      setRecords((previous) => previous.map((record) =>
        record._id === item._id ? result.data : record
      ));
      setNotice("जवाब सेव हो गया और सार्वजनिक पेज पर दिखाई देगा।");
    } catch (saveError) {
      setError(saveError.message || "जवाब सेव नहीं हो सका।");
    } finally {
      setBusyId("");
    }
  }

  async function removeRecord(item) {
    if (!window.confirm("क्या आप इस पोस्ट को स्थायी रूप से हटाना चाहते हैं?")) return;
    setBusyId(item._id);
    setError("");
    setNotice("");
    try {
      await apiRequest(SOURCES[source].removeEndpoint(item._id), { method: "DELETE" });
      setRecords((previous) => previous.filter((record) => record._id !== item._id));
      setNotice("पोस्ट हटा दी गई।");
    } catch (removeError) {
      setError(removeError.message || "पोस्ट हटाई नहीं जा सकी।");
    } finally {
      setBusyId("");
    }
  }

  const unansweredCount = records.filter((item) => !item.answer?.trim()).length;

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Community Management</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">किसान सवाल और चर्चा</h1>
          <p className="mt-1 text-sm text-slate-500">फसल के सवालों और ब्लॉग टिप्पणियों का जवाब दें या अनुपयुक्त पोस्ट हटाएं।</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold">
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="कुल पोस्ट" value={records.length} />
        <SummaryCard label="जवाब बाकी" value={unansweredCount} />
        <SummaryCard label="जवाब दिए गए" value={records.length - unansweredCount} />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(SOURCES).map(([key, item]) => (
          <button
            key={key}
            onClick={() => { setSource(key); setFilter("all"); }}
            aria-pressed={source === key}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold ${source === key ? "bg-emerald-700 text-white" : "border bg-white text-slate-700"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="सवाल, किसान या लेख खोजें..."
          className="min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border px-3 py-2.5 text-sm">
          <option value="all">सभी पोस्ट</option>
          <option value="unanswered">जवाब बाकी</option>
          <option value="answered">जवाब दिए गए</option>
        </select>
      </section>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}

      <section className="space-y-4">
        {loading ? (
          <p className="rounded-2xl border bg-white p-10 text-center text-slate-500">पोस्ट लोड हो रही हैं...</p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border bg-white p-10 text-center text-slate-500">इस फ़िल्टर में कोई पोस्ट नहीं मिली।</p>
        ) : visible.map((item) => {
          const config = SOURCES[source];
          const target = config.target(item);
          return (
            <article key={item._id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name || "किसान"}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
                {target?.slug && (
                  <Link href={config.targetHref(target)} target="_blank" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline">
                    {config.targetLabel}: {target.name || target.title}
                    <ExternalLink size={14} />
                  </Link>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {config.content(item)}
              </p>
              <label className="mt-4 block text-sm font-bold text-slate-800">कृषि मित्र का जवाब</label>
              <textarea
                maxLength={2000}
                rows={3}
                value={drafts[item._id] || ""}
                onChange={(event) => setDrafts((previous) => ({ ...previous, [item._id]: event.target.value }))}
                placeholder="किसान को जवाब लिखें..."
                className="mt-2 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className={`text-xs font-semibold ${item.answer ? "text-emerald-700" : "text-amber-700"}`}>
                  {item.answer ? `जवाब दिया गया · ${formatDate(item.answeredAt)}` : "अभी जवाब नहीं दिया"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveAnswer(item)}
                    disabled={busyId === item._id || !drafts[item._id]?.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <Check size={15} /> {busyId === item._id ? "सेव हो रहा है..." : "जवाब सेव करें"}
                  </button>
                  <button
                    onClick={() => removeRecord(item)}
                    disabled={busyId === item._id}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={15} /> हटाएं
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="flex items-center gap-2 text-sm text-slate-500"><MessageSquare size={16} />{label}</div>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}
