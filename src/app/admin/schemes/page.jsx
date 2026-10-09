"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Search,
  Landmark,
  ExternalLink,
  Edit,
  Trash2,
  Star,
  Loader2,
  RefreshCw,
} from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function AdminSchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSchemes() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (level !== "all") {
        params.set("level", level);
      }

      if (category !== "all") {
        params.set("categorySlug", category);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      if (featured !== "all") {
        params.set("featured", featured);
      }

      params.set("limit", "100");

      const response = await fetch(
        `${API_URL}/schemes?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Schemes load नहीं हो पाईं"
        );
      }

      setSchemes(data.data || []);
    } catch (error) {
      console.error("Load schemes error:", error);
      setError(
        error.message ||
          "Government schemes load करने में समस्या हुई"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      setCategoryLoading(true);

      const response = await fetch(
        `${API_URL}/scheme-categories?status=active`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Categories load नहीं हुईं"
        );
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error("Load categories error:", error);
    } finally {
      setCategoryLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSchemes();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    level,
    category,
    status,
    featured,
  ]);

  async function updateStatus(scheme, newStatus) {
    try {
      const response = await fetch(
        `${API_URL}/schemes/${scheme._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Status update failed"
        );
      }

      await loadSchemes();
    } catch (error) {
      alert(
        error.message ||
          "Status update करने में समस्या हुई"
      );
    }
  }

  async function toggleFeatured(scheme) {
    try {
      const response = await fetch(
        `${API_URL}/schemes/${scheme._id}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            featured: !scheme.featured,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Featured update failed"
        );
      }

      await loadSchemes();
    } catch (error) {
      alert(
        error.message ||
          "Featured update करने में समस्या हुई"
      );
    }
  }

  async function removeScheme(scheme) {
    const confirmed = confirm(
      `"${scheme.name}" delete करें?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/schemes/${scheme._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Scheme delete नहीं हुई"
        );
      }

      await loadSchemes();
    } catch (error) {
      alert(
        error.message ||
          "Scheme delete करने में समस्या हुई"
      );
    }
  }

  function getOfficialUrl(scheme) {
    if (scheme.sourceUrl) {
      return scheme.sourceUrl;
    }

    const officialLink =
      scheme.importantLinks?.find(
        (link) => link.type === "official"
      );

    return officialLink?.url || "#";
  }

  function getCategoryName(scheme) {
    if (scheme.categoryId?.name) {
      return scheme.categoryId.name;
    }

    return scheme.category || "-";
  }

  const totalSchemes = schemes.length;

  const centralCount = schemes.filter(
    (scheme) =>
      scheme.level === "केंद्र सरकार"
  ).length;

  const mpCount = schemes.filter(
    (scheme) =>
      scheme.level === "मध्य प्रदेश सरकार"
  ).length;

  const activeCount = schemes.filter(
    (scheme) =>
      scheme.status === "active"
  ).length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <p className="text-emerald-600 font-semibold text-sm">
            Government Content
          </p>

          <h1 className="text-3xl font-bold text-slate-900">
            सरकारी योजनाएं
          </h1>

          <p className="text-slate-500 mt-1">
            किसान योजनाओं की जानकारी और official links
            manage करें।
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={loadSchemes}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>

          <Link
            href="/admin/schemes/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            नई योजना
          </Link>

        </div>

      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Stat
          label="Total Schemes"
          value={totalSchemes}
        />

        <Stat
          label="Central Government"
          value={centralCount}
        />

        <Stat
          label="MP Government"
          value={mpCount}
        />

        <Stat
          label="Active"
          value={activeCount}
        />

      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="grid lg:grid-cols-5 gap-3">

          {/* Search */}
          <div className="relative lg:col-span-2">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="योजना खोजें..."
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
            />

          </div>

          {/* Level */}
          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">
              सभी सरकार
            </option>

            <option value="केंद्र सरकार">
              केंद्र सरकार
            </option>

            <option value="मध्य प्रदेश सरकार">
              मध्य प्रदेश सरकार
            </option>
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            disabled={categoryLoading}
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50"
          >
            <option value="all">
              सभी Categories
            </option>

            {categories.map((item) => (
              <option
                key={item._id}
                value={item.slug}
              >
                {item.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">
              सभी Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="archived">
              Archived
            </option>
          </select>

        </div>

        {/* Featured Filter */}
        <div className="mt-3 flex flex-wrap gap-2">

          <button
            onClick={() => setFeatured("all")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              featured === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            सभी
          </button>

          <button
            onClick={() => setFeatured("true")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              featured === "true"
                ? "bg-amber-500 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            ⭐ Featured
          </button>

          <button
            onClick={() => setFeatured("false")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              featured === "false"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            Not Featured
          </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">

          <p className="font-semibold">
            Schemes load नहीं हो पाईं
          </p>

          <p className="text-sm mt-1">
            {error}
          </p>

          <button
            onClick={loadSchemes}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Retry
          </button>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white border rounded-2xl p-12 flex flex-col items-center justify-center">

          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />

          <p className="text-slate-500 mt-3">
            Government schemes load हो रही हैं...
          </p>

        </div>
      )}

      {/* Empty */}
      {!loading && !error && schemes.length === 0 && (
        <div className="bg-white border rounded-2xl p-12 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Landmark className="w-7 h-7" />
          </div>

          <h2 className="font-bold text-xl mt-4">
            कोई योजना नहीं मिली
          </h2>

          <p className="text-slate-500 mt-1">
            Search या filters बदलकर देखें।
          </p>

          <Link
            href="/admin/schemes/new"
            className="inline-flex items-center gap-2 mt-5 bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            नई योजना जोड़ें
          </Link>

        </div>
      )}

      {/* Scheme Cards */}
      {!loading && schemes.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {schemes.map((scheme) => (

            <div
              key={scheme._id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition"
            >

              {/* Top */}
              <div className="flex items-start justify-between gap-3">

                <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      toggleFeatured(scheme)
                    }
                    title={
                      scheme.featured
                        ? "Remove Featured"
                        : "Make Featured"
                    }
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                      scheme.featured
                        ? "bg-amber-50 border-amber-200 text-amber-500"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    <Star
                      className="w-4 h-4"
                      fill={
                        scheme.featured
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                  <StatusBadge
                    status={scheme.status}
                  />

                </div>

              </div>

              {/* Content */}
              <p className="text-xs text-emerald-600 font-semibold mt-5">
                {scheme.shortName || "Government Scheme"}
              </p>

              <h2 className="font-bold text-lg mt-1 text-slate-900 line-clamp-2">
                {scheme.name}
              </h2>

              <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                {scheme.description || "—"}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">

                <span className="text-xs bg-slate-100 rounded-full px-3 py-1">
                  {scheme.level || "—"}
                </span>

                <span className="text-xs bg-slate-100 rounded-full px-3 py-1">
                  {getCategoryName(scheme)}
                </span>

              </div>

              {/* Source */}
              <div className="mt-4 text-xs text-slate-500">

                <span className="font-medium">
                  Source:
                </span>{" "}

                {scheme.sourceName || "Official Source"}

              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-5">

                <Link
                  href={`/admin/schemes/${scheme._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2.5 text-sm font-semibold"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>

                {getOfficialUrl(scheme) !== "#" && (
                  <a
                    href={getOfficialUrl(scheme)}
                    target="_blank"
                    rel="noreferrer"
                    title="Official Website"
                    className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}

                <button
                  onClick={() =>
                    removeScheme(scheme)
                  }
                  title="Delete"
                  className="p-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </div>

              {/* Quick Status */}
              <div className="mt-4 pt-4 border-t border-slate-100">

                <div className="flex items-center justify-between gap-2">

                  <span className="text-xs text-slate-500">
                    Quick Status
                  </span>

                  <select
                    value={scheme.status}
                    onChange={(e) =>
                      updateStatus(
                        scheme,
                        e.target.value
                      )
                    }
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                    <option value="draft">
                      Draft
                    </option>

                    <option value="archived">
                      Archived
                    </option>
                  </select>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="text-3xl font-bold mt-1 text-slate-900">
        {value}
      </p>

    </div>
  );
}