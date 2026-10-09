"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Eye,
  Heart,
  RefreshCw,
  Filter,
  Loader2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const CATEGORY_OPTIONS = [
  {
    value: "all",
    label: "सभी Categories",
  },
  {
    value: "fertilizer",
    label: "प्राकृतिक खाद",
  },
  {
    value: "pesticide",
    label: "कीट प्रबंधन",
  },
  {
    value: "fungicide",
    label: "फफूंद प्रबंधन",
  },
];

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "सभी Status",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

const getCategoryLabel = (category) => {
  const item = CATEGORY_OPTIONS.find(
    (x) => x.value === category
  );

  return item?.label || category || "-";
};

const getStatusLabel = (status) => {
  const item = STATUS_OPTIONS.find(
    (x) => x.value === status
  );

  return item?.label || status || "-";
};

export default function OrganicAdminPage() {
  const [recipes, setRecipes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [featured, setFeatured] = useState("all");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const fetchRecipes = async (
    page = pagination.page
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", pagination.limit);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (category !== "all") {
        params.set("category", category);
      }

      if (status !== "all") {
        params.set("status", status);
      }

      if (featured !== "all") {
        params.set(
          "featured",
          featured === "true"
        );
      }

      const response = await fetch(
        `${API_URL}/organic-recipes?${params.toString()}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Recipes fetch failed"
        );
      }

      setRecipes(result.data || []);

      setPagination(
        result.pagination || {
          page,
          limit: 10,
          total: result.data?.length || 0,
          pages: 1,
        }
      );
    } catch (error) {
      console.error(error);
      alert(
        error.message ||
          "Organic recipes load नहीं हो पाईं"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(1);
  }, [category, status, featured]);

  const stats = useMemo(() => {
    return {
      total: pagination.total || recipes.length,

      fertilizer: recipes.filter(
        (item) => item.category === "fertilizer"
      ).length,

      pesticide: recipes.filter(
        (item) => item.category === "pesticide"
      ).length,

      fungicide: recipes.filter(
        (item) => item.category === "fungicide"
      ).length,

      featured: recipes.filter(
        (item) => item.featured
      ).length,
    };
  }, [recipes, pagination.total]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "क्या आप इस organic recipe को delete करना चाहते हैं?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`delete-${id}`);

      const response = await fetch(
        `${API_URL}/organic-recipes/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Delete failed"
        );
      }

      await fetchRecipes(
        pagination.page
      );
    } catch (error) {
      alert(
        error.message ||
          "Recipe delete नहीं हुई"
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleStatus = async (
    id,
    currentStatus
  ) => {
    const nextStatus =
      currentStatus === "active"
        ? "inactive"
        : "active";

    try {
      setActionLoading(`status-${id}`);

      const response = await fetch(
        `${API_URL}/organic-recipes/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Status update failed"
        );
      }

      await fetchRecipes(
        pagination.page
      );
    } catch (error) {
      alert(
        error.message ||
          "Status update नहीं हुआ"
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleFeatured = async (
    id,
    currentFeatured
  ) => {
    try {
      setActionLoading(`featured-${id}`);

      const response = await fetch(
        `${API_URL}/organic-recipes/${id}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            featured:
              !currentFeatured,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Featured update failed"
        );
      }

      await fetchRecipes(
        pagination.page
      );
    } catch (error) {
      alert(
        error.message ||
          "Featured update नहीं हुआ"
      );
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            <span>/</span>
            <span>Organic Farming</span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Organic Farming
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            जैविक खाद, कीट एवं फफूंद प्रबंधन
            की recipes manage करें।
          </p>
        </div>

        <Link
          href="/admin/organic/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus size={18} />
          Add Recipe
        </Link>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard
          title="Total"
          value={stats.total}
        />

        <StatCard
          title="प्राकृतिक खाद"
          value={stats.fertilizer}
        />

        <StatCard
          title="कीट प्रबंधन"
          value={stats.pesticide}
        />

        <StatCard
          title="फफूंद प्रबंधन"
          value={stats.fungicide}
        />

        <StatCard
          title="Featured"
          value={stats.featured}
        />
      </div>

      {/* FILTERS */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
          <Filter size={17} />
          Filters
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <form
            onSubmit={handleSearch}
            className="flex gap-2 md:col-span-1"
          >
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search recipe..."
                className="w-full rounded-lg border px-9 py-2.5 text-sm outline-none focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 text-sm text-white"
            >
              Search
            </button>
          </form>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-500"
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-500"
          >
            {STATUS_OPTIONS.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={featured}
            onChange={(e) =>
              setFeatured(e.target.value)
            }
            className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-500"
          >
            <option value="all">
              All Featured
            </option>

            <option value="true">
              Featured
            </option>

            <option value="false">
              Not Featured
            </option>
          </select>
        </div>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="font-semibold text-gray-900">
            Organic Recipes
          </h2>

          <button
            onClick={() =>
              fetchRecipes(
                pagination.page
              )
            }
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2
              className="animate-spin text-green-600"
              size={30}
            />
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-4 text-center">
            <div className="text-4xl">
              🌱
            </div>

            <h3 className="mt-3 font-semibold">
              No recipes found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              कोई organic recipe उपलब्ध नहीं है।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">
                    Recipe
                  </th>

                  <th className="px-4 py-3">
                    Category
                  </th>

                  <th className="px-4 py-3">
                    Cost
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Stats
                  </th>

                  <th className="px-4 py-3">
                    Featured
                  </th>

                  <th className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {recipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-green-50 text-xl">
                          {recipe.coverImage ? (
                            <img
                              src={
                                recipe.coverImage
                              }
                              alt={
                                recipe.title
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "🌱"
                          )}
                        </div>

                        <div>
                          <div className="font-medium text-gray-900">
                            {recipe.title}
                          </div>

                          <div className="text-xs text-gray-500">
                            {recipe.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        {getCategoryLabel(
                          recipe.category
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm">
                      ₹{recipe.costMin || 0} - ₹
                      {recipe.costMax || 0}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() =>
                          handleStatus(
                            recipe._id,
                            recipe.status
                          )
                        }
                        disabled={
                          actionLoading ===
                          `status-${recipe._id}`
                        }
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          recipe.status ===
                          "active"
                            ? "bg-green-100 text-green-700"
                            : recipe.status ===
                              "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {actionLoading ===
                        `status-${recipe._id}` ? (
                          <Loader2
                            size={13}
                            className="animate-spin"
                          />
                        ) : (
                          getStatusLabel(
                            recipe.status
                          )
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={14} />
                          {recipe.views || 0}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Heart size={14} />
                          {recipe.likes || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={() =>
                          handleFeatured(
                            recipe._id,
                            recipe.featured
                          )
                        }
                        disabled={
                          actionLoading ===
                          `featured-${recipe._id}`
                        }
                        className={`rounded-lg p-2 ${
                          recipe.featured
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                        title="Toggle Featured"
                      >
                        {actionLoading ===
                        `featured-${recipe._id}` ? (
                          <Loader2
                            size={17}
                            className="animate-spin"
                          />
                        ) : (
                          <Star
                            size={17}
                            fill={
                              recipe.featured
                                ? "currentColor"
                                : "none"
                            }
                          />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/organic/${recipe._id}`}
                          className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              recipe._id
                            )
                          }
                          disabled={
                            actionLoading ===
                            `delete-${recipe._id}`
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          {actionLoading ===
                          `delete-${recipe._id}` ? (
                            <Loader2
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}

        {!loading &&
          recipes.length > 0 && (
            <div className="flex flex-col gap-3 border-t px-4 py-4 text-sm md:flex-row md:items-center md:justify-between">
              <div className="text-gray-500">
                Page{" "}
                {pagination.page} of{" "}
                {pagination.pages || 1}
              </div>

              <div className="flex gap-2">
                <button
                  disabled={
                    pagination.page <= 1
                  }
                  onClick={() =>
                    fetchRecipes(
                      pagination.page - 1
                    )
                  }
                  className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  disabled={
                    pagination.page >=
                    (pagination.pages || 1)
                  }
                  onClick={() =>
                    fetchRecipes(
                      pagination.page + 1
                    )
                  }
                  className="rounded-lg border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500">
        {title}
      </div>

      <div className="mt-1 text-2xl font-bold text-gray-900">
        {value}
      </div>
    </div>
  );
}