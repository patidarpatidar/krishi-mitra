"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { livestockApi } from "@/lib/livestockApi";

const categories = [
  ["all", "All categories"],
  ["dairy", "Dairy"],
  ["goat", "Goat farming"],
  ["poultry", "Poultry"],
  ["fodder", "Fodder"],
  ["health", "Animal health"],
  ["schemes", "Schemes"],
];

export default function LivestockAdminPage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [stats, setStats] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await livestockApi.list({
        page,
        limit: 10,
        search,
        category,
        status,
      });

      setArticles(Array.isArray(result.data) ? result.data : []);
      setPagination(
        result.pagination || { page: 1, total: 0, totalPages: 1 }
      );
      setStats(Array.isArray(result.stats) ? result.stats : []);
    } catch (err) {
      setError(err.message || "Articles load नहीं हुए");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  async function handleDelete(article) {
    const confirmed = window.confirm(
      `"${article.title}" को permanently delete करना चाहते हैं?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await livestockApi.remove(article._id);
      setMessage("Article delete हो गया।");
      await loadArticles();
    } catch (err) {
      setError(err.message || "Delete नहीं हो पाया");
    }
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const totalViews = stats.reduce(
    (sum, item) => sum + (item.views || 0),
    0
  );
  const totalLikes = stats.reduce(
    (sum, item) => sum + (item.likes || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
              Krishi Mitra Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Livestock Articles
            </h1>
            <p className="mt-2 text-slate-600">
              पशुपालन से जुड़े articles manage करें।
            </p>
          </div>

          <Link
            href="/admin/livestock/new"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
          >
            + Add Article
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Filtered Articles" value={pagination.total || 0} />
          <StatCard
            title="Published"
            value={stats.find((item) => item._id === "published")?.count || 0}
          />
          <StatCard title="Total Views" value={totalViews} />
          <StatCard title="Total Likes" value={totalLikes} />
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <input
              value={search}
              onChange={(e) => changeFilter(setSearch, e.target.value)}
              placeholder="Search title or slug..."
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <select
              value={category}
              onChange={(e) => changeFilter(setCategory, e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3"
            >
              {categories.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => changeFilter(setStatus, e.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-500">
              Loading articles...
            </p>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-semibold text-slate-700">
                कोई article नहीं मिला।
              </p>
              <p className="mt-2 text-sm text-slate-500">
                नया article बनाने के लिए Add Article पर क्लिक करें।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3">Article</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Views</th>
                    <th className="p-3">Likes</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr key={article._id} className="hover:bg-slate-50">
                      <td className="p-3">
                        <p className="font-semibold text-slate-900">
                          {article.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          /{article.slug}
                        </p>
                      </td>

                      <td className="p-3">
                        {article.categoryLabel || article.category}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            article.status === "published"
                              ? "bg-green-100 text-green-800"
                              : article.status === "draft"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>

                      <td className="p-3">{article.viewsCount || 0}</td>
                      <td className="p-3">{article.likesCount || 0}</td>

                      <td className="p-3">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/view/livestock/${article._id}`}
                            className="font-semibold text-emerald-700 hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/livestock/${article._id}/edit`}
                            className="font-semibold text-blue-700 hover:underline"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(article)}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <p className="text-sm text-slate-600">
              Total: {pagination.total || 0} articles
            </p>

            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {pagination.page || page} of{" "}
                {Math.max(1, pagination.totalPages || 1)}
              </span>

              <button
                disabled={
                  page >= (pagination.totalPages || 1) || loading
                }
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {Number(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}