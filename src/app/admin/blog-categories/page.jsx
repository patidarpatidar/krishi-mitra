
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Tags,
} from "lucide-react";
import { blogApi, unwrapList } from "@/lib/blogApi";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await blogApi.getCategories(true);
      setCategories(unwrapList(response, ["categories", "items"]));
    } catch (err) {
      setError(err.message || "Categories load nahi ho sakin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const query = search.toLowerCase();

      const matchesSearch = [
        category.label,
        category.slug,
        category.description,
      ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        status === "all" || category.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, status]);

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Delete "${category.label}" category?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await blogApi.deleteCategory(category._id || category.id);
      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Category delete nahi hui. Check karein ki is category mein blogs to nahi hain."
      );
    }
  }

  const activeCount = categories.filter(
    (item) => item.status === "active"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Tags size={16} />
              Admin / Blogs / Categories
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Blog Categories
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, edit and manage your blog categories.
            </p>
          </div>

          <Link
            href="/admin/blog-categories/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800"
          >
            <Plus size={18} />
            Add Category
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Categories" value={categories.length} />
          <StatCard label="Active Categories" value={activeCount} />
          <StatCard
            label="Inactive Categories"
            value={categories.length - activeCount}
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by category, slug or description..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-green-600"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-600"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={loadCategories}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center">
              <Tags className="mx-auto mb-3 text-slate-300" size={36} />
              <p className="font-semibold text-slate-700">
                No categories found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add a category or change your search filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Slug</th>
                    <th className="px-4 py-4">Sort Order</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCategories.map((category) => {
                    const id = category._id || category.id;

                    return (
                      <tr
                        key={id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-2xl">
                              {category.icon || "📚"}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {category.label}
                              </p>
                              <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                {category.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {category.slug}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {category.sortOrder ?? 0}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              category.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {category.status || "active"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/view/blog-categories/${id}`}
                              title="View category details"
                              className="rounded-lg border border-slate-200 p-2 text-emerald-700 hover:bg-emerald-50"
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/blog-categories/${id}/edit`}
                              title="Edit category"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-green-50 hover:text-green-700"
                            >
                              <Pencil size={16} />
                            </Link>

                            <button
                              type="button"
                              title="Delete category"
                              onClick={() => handleDelete(category)}
                              className="rounded-lg border border-slate-200 p-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
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

          {!loading && (
            <p className="mt-4 text-xs text-slate-500">
              Showing {filteredCategories.length} of {categories.length} categories
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}