
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Sprout,
  Loader2,
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  CircleSlash,
  Layers3,
} from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/apiClient";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export default function CropCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD CATEGORIES
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/crop-categories`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Categories load failed"
        );
      }

      const list = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.categories)
        ? result.categories
        : Array.isArray(result)
        ? result
        : [];

      setCategories(list);
    } catch (err) {
      setError(err.message || "Categories load नहीं हुईं");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // SEARCH + STATUS FILTER
  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((item) => {
      const matchesSearch = [
        item.name,
        item.slug,
        item.description,
      ].some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // DELETE CATEGORY
  async function handleDelete(item) {
    const confirmed = window.confirm(
      `"${item.name}" category delete करें?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/crop-categories/${item._id}`,
        {
          method: "DELETE",
          headers: getAdminAuthHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Category delete failed"
        );
      }

      setCategories((previous) =>
        previous.filter((category) => category._id !== item._id)
      );

      setSuccess(`"${item.name}" category delete हो गई।`);
    } catch (err) {
      setError(err.message || "Category delete नहीं हुई");
    } finally {
      setDeletingId(null);
    }
  }

  // STATS
  const totalCount = categories.length;

  const activeCount = categories.filter(
    (item) => item.status === "active"
  ).length;

  const inactiveCount = categories.filter(
    (item) => item.status === "inactive"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-semibold text-emerald-600">
            Crop Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Crop Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            फसलों की categories बनाएं, search करें और manage करें।
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadCategories}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/admin/crops/categories/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>
      </div>

      {/* ALERTS */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Categories"
          value={totalCount}
          icon={<Layers3 size={20} />}
        />

        <StatCard
          label="Active Categories"
          value={activeCount}
          icon={<CheckCircle2 size={20} />}
        />

        <StatCard
          label="Inactive Categories"
          value={inactiveCount}
          icon={<CircleSlash size={20} />}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div>
            <label
              htmlFor="category-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search Categories
            </label>

            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="category-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, slug or description..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Filter by Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="all">All Categories</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredCategories.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {categories.length}
            </span>{" "}
            categories
          </p>

          {(search || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY LIST */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-3 text-sm text-slate-500">
              Loading categories...
            </p>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
          <Sprout className="mx-auto h-10 w-10 text-emerald-500" />

          <h2 className="mt-3 font-bold text-slate-900">
            {categories.length === 0
              ? "No Categories Found"
              : "No Matching Categories"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {categories.length === 0
              ? "Add Category पर click करके पहली category बनाएं।"
              : "Search या status filter बदलकर दोबारा कोशिश करें।"}
          </p>

          {categories.length === 0 && (
            <Link
              href="/admin/crops/categories/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <Plus size={17} />
              Add Category
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm"
            >
              {/* CARD HEADER */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Sprout size={22} />
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* DETAILS */}
              <h2 className="mt-4 break-words text-lg font-bold text-slate-900">
                {item.name}
              </h2>

              <p className="mt-1 break-all text-xs text-slate-500">
                Slug: {item.slug}
              </p>

              <p className="mt-3 min-h-10 text-sm leading-5 text-slate-600">
                {item.description || "No description provided."}
              </p>

              {/* ACTIONS */}
              <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                <Link
                  href={`/admin/view/crop-categories/${item._id}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View details
                </Link>
                <Link
                  href={`/admin/crops/categories/${item._id}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <Edit size={16} />
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item._id}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === item._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>

        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}