"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Layers3, Loader2, Pencil, Plus, RefreshCw, Save, Search, Trash2, X } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/apiClient";
import { expireAdminSession } from "@/lib/adminAuth";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const MODULES = [
  { key: "crop", label: "फसलें", endpoint: "/crop-categories", defaultIcon: "🌱" },
  { key: "scheme", label: "सरकारी योजनाएँ", endpoint: "/scheme-categories", defaultIcon: "🏛️" },
  { key: "organic", label: "जैविक खेती", endpoint: "/organic-categories", defaultIcon: "🌿" },
  { key: "livestock", label: "पशुपालन", endpoint: "/livestock-categories", defaultIcon: "🐄" },
  { key: "blog", label: "ब्लॉग", endpoint: "/blog-categories", listEndpoint: "/blog-categories/admin", defaultIcon: "📚" },
];

const emptyForm = { name: "", slug: "", icon: "", description: "", status: "active", sortOrder: 0 };

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requestCategory(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...getAdminAuthHeaders(),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) expireAdminSession();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }
  return result;
}

export default function AdminCategoriesPage() {
  const [moduleKey, setModuleKey] = useState("crop");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const activeModule = MODULES.find((item) => item.key === moduleKey) || MODULES[0];

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await requestCategory(activeModule.listEndpoint || activeModule.endpoint);
      setCategories(Array.isArray(result.data)
        ? result.data.map((category) => ({ ...category, name: category.name || category.label || "" }))
        : []);
    } catch (loadError) {
      setError(loadError.message || "श्रेणियाँ लोड नहीं हो सकीं।");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeModule.endpoint]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const requestedType = new URLSearchParams(window.location.search).get("type");
    if (MODULES.some((item) => item.key === requestedType)) {
      setModuleKey(requestedType);
    }
  }, []);

  const visibleCategories = categories.filter((category) => {
    const query = search.trim().toLocaleLowerCase("hi");
    const matchesSearch = !query || [category.name, category.slug, category.description]
      .some((value) => String(value || "").toLocaleLowerCase("hi").includes(query));
    return matchesSearch && (statusFilter === "all" || category.status === statusFilter);
  });

  function beginCreate() {
    setEditingId("");
    setForm({ ...emptyForm, icon: activeModule.defaultIcon });
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function beginEdit(category) {
    setEditingId(category._id || category.id);
    setForm({
      name: category.name || category.label || "",
      slug: category.slug || "",
      icon: category.icon || category.emoji || activeModule.defaultIcon,
      description: category.description || "",
      status: category.status || "active",
      sortOrder: category.sortOrder ?? 0,
    });
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  async function saveCategory(event) {
    event.preventDefault();
    const name = form.name.trim();
    const slug = form.slug.trim() || slugify(name) || `${moduleKey}-${Date.now()}`;
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("नाम भरें और slug में lowercase English अक्षर, अंक या hyphen रखें।");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        ...(moduleKey === "blog" ? { label: name } : { name }),
        slug,
        icon: form.icon.trim() || activeModule.defaultIcon,
        description: form.description.trim(),
        status: form.status,
        sortOrder: Number(form.sortOrder) || 0,
      };
      const path = editingId
        ? `${activeModule.endpoint}/${encodeURIComponent(editingId)}`
        : activeModule.endpoint;
      await requestCategory(path, {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setFormOpen(false);
      setNotice(editingId ? "श्रेणी अपडेट हो गई।" : "नई श्रेणी बन गई।");
      await loadCategories();
    } catch (saveError) {
      setError(saveError.message || "श्रेणी सुरक्षित नहीं हो सकी।");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category) {
    const id = category._id || category.id;
    if (!window.confirm(`“${category.name}” श्रेणी हटाएँ?`)) return;
    try {
      setBusyId(id);
      setError("");
      await requestCategory(`${activeModule.endpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
      setCategories((current) => current.filter((item) => (item._id || item.id) !== id));
      setNotice("श्रेणी हटा दी गई।");
    } catch (deleteError) {
      setError(deleteError.message || "श्रेणी हटाई नहीं जा सकी।");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Layers3 className="h-4 w-4" /> वेबसाइट सामग्री
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">श्रेणी प्रबंधन</h1>
          <p className="mt-1 text-sm text-slate-500">सभी पाँच सेक्शन की श्रेणियाँ, आइकन और विवरण यहाँ प्रबंधित करें।</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={loadCategories} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> ताज़ा करें
          </button>
          <button type="button" onClick={beginCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">
            <Plus className="h-4 w-4" /> नई श्रेणी
          </button>
        </div>
      </header>

      <nav aria-label="श्रेणी प्रकार" className="flex gap-2 overflow-x-auto border-b border-slate-200">
        {MODULES.map((item) => (
          <button key={item.key} type="button" onClick={() => { setModuleKey(item.key); setFormOpen(false); setSearch(""); }} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${moduleKey === item.key ? "border-emerald-700 text-emerald-800" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
            {item.label}
          </button>
        ))}
      </nav>

      {(error || notice) && (
        <div role={error ? "alert" : "status"} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          <span>{error || notice}</span>
          <button type="button" onClick={() => { setError(""); setNotice(""); }} aria-label="बंद करें"><X className="h-4 w-4" /></button>
        </div>
      )}

      {formOpen && (
        <form onSubmit={saveCategory} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-bold text-slate-900">{editingId ? "श्रेणी संपादित करें" : `${activeModule.label} में नई श्रेणी`}</h2>
              <p className="mt-1 text-xs text-slate-500">यह जानकारी वेबसाइट के category cards और filters में दिखेगी।</p>
            </div>
            <button type="button" onClick={() => setFormOpen(false)} aria-label="फॉर्म बंद करें" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="नाम *"><input required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value, slug: editingId ? prev.slug : slugify(event.target.value) }))} className={inputClass} placeholder="जैसे अनाज" /></Field>
            <Field label="Slug *"><input required value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") }))} className={inputClass} placeholder="jaise-anaj" /></Field>
            <Field label="आइकन / Emoji"><div className="flex gap-2"><input value={form.icon} onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))} maxLength={16} className={`${inputClass} min-w-0`} placeholder={activeModule.defaultIcon} /><span className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-2xl">{form.icon || activeModule.defaultIcon}</span></div></Field>
            <Field label="क्रम"><input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))} className={inputClass} /></Field>
            <Field label="स्थिति"><select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className={inputClass}><option value="active">सक्रिय</option><option value="inactive">निष्क्रिय</option></select></Field>
            <div className="sm:col-span-2 lg:col-span-3"><Field label="विवरण"><textarea rows={3} maxLength={500} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} className={inputClass} placeholder="वेबसाइट पर दिखने वाला छोटा विवरण" /></Field></div>
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">रद्द करें</button>
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "सुरक्षित हो रहा है…" : "श्रेणी सुरक्षित करें"}
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-[minmax(0,1fr)_180px]">
          <label className="relative block"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="नाम, slug या विवरण खोजें" className={`${inputClass} pl-10`} /></label>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}><option value="all">सभी स्थितियाँ</option><option value="active">सक्रिय</option><option value="inactive">निष्क्रिय</option></select>
        </div>
        {loading ? <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin text-emerald-700" /></div> : visibleCategories.length ? (
          <div className="divide-y divide-slate-100">
            {visibleCategories.map((category) => {
              const id = category._id || category.id;
              return <article key={id} className="grid gap-3 p-4 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center sm:p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl">{category.icon || activeModule.defaultIcon}</span>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-900">{category.name}</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{category.slug}</span><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${category.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{category.status === "active" ? "सक्रिय" : "निष्क्रिय"}</span></div><p className="mt-1 line-clamp-2 text-xs text-slate-500">{category.description || "कोई विवरण नहीं"}</p></div>
                <div className="flex gap-2 sm:justify-end"><button type="button" onClick={() => beginEdit(category)} title="संपादित करें" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => deleteCategory(category)} disabled={busyId === id} title="हटाएँ" className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50">{busyId === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div>
              </article>;
            })}
          </div>
        ) : <div className="p-10 text-center"><p className="font-semibold text-slate-800">इस प्रकार की कोई श्रेणी नहीं है।</p><p className="mt-1 text-sm text-slate-500">नई श्रेणी जोड़ें; सक्रिय श्रेणियाँ वेबसाइट पर अपने-आप दिखाई देंगी।</p></div>}
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";