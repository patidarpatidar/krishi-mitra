"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAdminAuthHeaders } from "@/lib/apiClient";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Sprout,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const seasons = [
  { key: "all", label: "सभी" },
  { key: "kharif", label: "खरीफ" },
  { key: "rabi", label: "रबी" },
  { key: "zaid", label: "जायद" },
];

const statuses = [
  { key: "all", label: "सभी" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

export default function CropsPage() {
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [season, setSeason] = useState("all");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadCrops();
    loadCategories();
  }, []);

  // =========================================================
  // LOAD CROPS
  // =========================================================

  async function loadCrops() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "all") {
        params.set("category", category);
      }

      if (season !== "all") {
        params.set("season", season);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      params.set("page", "1");
      params.set("limit", "100");

      const response = await fetch(
        `${API_URL}/crops?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to load crops"
        );
      }

      setCrops(result?.data || []);
    } catch (error) {
      console.error("Load crops error:", error);

      setError(
        error.message ||
          "Crops load नहीं हो पाईं। Backend/API check करें।"
      );

      setCrops([]);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  async function loadCategories() {
    try {
      const response = await fetch(
        `${API_URL}/crop-categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to load categories"
        );
      }

      setCategories(result?.data || []);
    } catch (error) {
      console.error("Load categories error:", error);
      setCategories([]);
    }
  }

  // =========================================================
  // FILTER EFFECT
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCrops();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, season, status]);

  // =========================================================
  // DELETE
  // =========================================================

  async function handleDelete(id) {
    const crop = crops.find(
      (item) => String(item._id) === String(id)
    );

    if (!crop) return;

    const confirmed = window.confirm(
      `क्या आप "${crop.name}" को delete करना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${id}`);

      const response = await fetch(
        `${API_URL}/crops/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || "Crop delete नहीं हो पाई"
        );
      }

      await loadCrops();
    } catch (error) {
      console.error("Delete crop error:", error);

      alert(
        error.message || "Crop delete करते समय error आया"
      );
    } finally {
      setActionLoading(null);
    }
  }

  // =========================================================
  // FEATURED TOGGLE
  // =========================================================

  async function toggleFeatured(crop) {
    const id = crop._id;

    try {
      setActionLoading(`featured-${id}`);

      const response = await fetch(
        `${API_URL}/crops/${id}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          body: JSON.stringify({
            featured: !crop.featured,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Featured status update नहीं हुआ"
        );
      }

      await loadCrops();
    } catch (error) {
      console.error(
        "Toggle featured error:",
        error
      );

      alert(
        error.message ||
          "Featured status update करते समय error आया"
      );
    } finally {
      setActionLoading(null);
    }
  }

  // =========================================================
  // STATUS TOGGLE
  // =========================================================

  async function toggleStatus(crop) {
    const id = crop._id;

    const nextStatus =
      crop.status === "published"
        ? "draft"
        : "published";

    try {
      setActionLoading(`status-${id}`);

      const response = await fetch(
        `${API_URL}/crops/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Status update नहीं हुआ"
        );
      }

      await loadCrops();
    } catch (error) {
      console.error(
        "Toggle status error:",
        error
      );

      alert(
        error.message ||
          "Status update करते समय error आया"
      );
    } finally {
      setActionLoading(null);
    }
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setSeason("all");
    setStatus("all");
  }

  const hasFilters =
    search ||
    category !== "all" ||
    season !== "all" ||
    status !== "all";

  // =========================================================
  // STATS
  // =========================================================

  const stats = useMemo(() => {
    return {
      total: crops.length,

      published: crops.filter(
        (item) => item.status === "published"
      ).length,

      draft: crops.filter(
        (item) => item.status === "draft"
      ).length,

      featured: crops.filter(
        (item) => item.featured
      ).length,
    };
  }, [crops]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-emerald-600">
            <Sprout size={20} />

            <span className="text-sm font-semibold">
              Content Management
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Crops Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            फसलों की जानकारी, category और publishing
            status manage करें।
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              loadCrops();
              loadCategories();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>

          <Link
            href="/admin/crops/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            <Plus size={18} />

            Add Crop
          </Link>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-red-800">
                API Error
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <p className="mt-2 text-xs text-red-500">
                API: {API_URL}/crops
              </p>
            </div>

            <button
              onClick={loadCrops}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Crops"
          value={stats.total}
          icon={<Sprout size={20} />}
        />

        <StatCard
          label="Published"
          value={stats.published}
          icon={<Eye size={20} />}
        />

        <StatCard
          label="Draft"
          value={stats.draft}
          icon={<EyeOff size={20} />}
        />

        <StatCard
          label="Featured"
          value={stats.featured}
          icon={<Star size={20} />}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Filter size={18} />

            Filters
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <X size={15} />

              Clear
            </button>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search crop..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
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

          {/* Season */}
          <select
            value={season}
            onChange={(e) =>
              setSeason(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            {seasons.map((item) => (
              <option
                key={item.key}
                value={item.key}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            {statuses.map((item) => (
              <option
                key={item.key}
                value={item.key}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-3 text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {crops.length}
        </span>{" "}
        crops
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw
                size={28}
                className="animate-spin text-emerald-600"
              />

              <p className="text-sm text-slate-500">
                Crops API से load हो रही हैं...
              </p>
            </div>
          </div>
        ) : crops.length === 0 ? (
          <EmptyState
            search={search}
            onClear={clearFilters}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Crop
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Season
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Featured
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {crops.map((crop) => {
                  const id = crop._id;

                  const isStatusLoading =
                    actionLoading === `status-${id}`;

                  const isFeaturedLoading =
                    actionLoading === `featured-${id}`;

                  const isDeleteLoading =
                    actionLoading === `delete-${id}`;

                  return (
                    <tr
                      key={id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      {/* Crop */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <span className="text-xl">
                              {crop.icon || "🌱"}
                            </span>
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {crop.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {crop.englishName}
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              /{crop.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {crop.category?.label ||
                            crop.category?.key ||
                            "—"}
                        </span>
                      </td>

                      {/* Season */}
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {crop.season?.label ||
                          crop.season?.key ||
                          "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            toggleStatus(crop)
                          }
                          disabled={isStatusLoading}
                          title="Toggle status"
                          className={`rounded-full px-3 py-1 text-xs font-bold disabled:opacity-50 ${
                            crop.status ===
                            "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : crop.status ===
                                  "archived"
                                ? "bg-slate-200 text-slate-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isStatusLoading ? (
                            <RefreshCw
                              size={13}
                              className="animate-spin"
                            />
                          ) : crop.status ===
                            "published" ? (
                            "Published"
                          ) : crop.status ===
                            "archived" ? (
                            "Archived"
                          ) : (
                            "Draft"
                          )}
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            toggleFeatured(crop)
                          }
                          disabled={isFeaturedLoading}
                          title="Toggle featured"
                          className={
                            crop.featured
                              ? "text-amber-500 disabled:opacity-50"
                              : "text-slate-300 hover:text-slate-500 disabled:opacity-50"
                          }
                        >
                          {isFeaturedLoading ? (
                            <RefreshCw
                              size={20}
                              className="animate-spin"
                            />
                          ) : crop.featured ? (
                            <Star
                              size={20}
                              fill="currentColor"
                            />
                          ) : (
                            <StarOff size={20} />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/view/crops/${id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                            title="View details"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/crops/${id}/edit`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(id)
                            }
                            disabled={isDeleteLoading}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeleteLoading ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({ search, onClear }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Sprout size={26} />
      </div>

      <h3 className="font-semibold text-slate-900">
        No crops found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {search
          ? "आपकी search के अनुसार कोई crop नहीं मिला।"
          : "अभी कोई crop उपलब्ध नहीं है।"}
      </p>

      <button
        onClick={onClear}
        className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
      >
        Clear filters
      </button>
    </div>
  );
}