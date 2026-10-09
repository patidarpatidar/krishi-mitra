
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Pencil, Trash2, RefreshCw,
  Star, Eye, FileText,
} from "lucide-react";
import { blogApi, unwrapList } from "@/lib/blogApi";

const PAGE_SIZE = 10;

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [blogResponse, categoryResponse] = await Promise.all([
        blogApi.getBlogs({ limit: 1000 }),
        blogApi.getCategories(),
      ]);

      setBlogs(unwrapList(blogResponse, ["blogs", "items"]));
      setCategories(unwrapList(categoryResponse, ["categories", "items"]));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = blogs.filter((blog) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = [
      blog.title, blog.slug, blog.author, blog.excerpt, blog.category,
      ...(blog.tags || []),
    ].filter(Boolean).join(" ").toLowerCase().includes(query);

    const matchesStatus = status === "all" || blog.status === status;
    const matchesCategory =
      categoryId === "all" ||
      String(blog.categoryId?._id || blog.categoryId || "") === categoryId;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function remove(blog) {
    if (!window.confirm(`"${blog.title}" delete करना चाहते हैं?`)) return;

    try {
      await blogApi.deleteBlog(blog._id || blog.id);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function changeStatus(blog, nextStatus) {
    try {
      await blogApi.updateStatus(blog._id || blog.id, nextStatus);
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  async function toggleFeatured(blog) {
    try {
      await blogApi.updateFeatured(
        blog._id || blog.id,
        !blog.isFeatured
      );
      await load();
    } catch (e) {
      alert(e.message);
    }
  }

  const published = blogs.filter((b) => b.status === "published").length;
  const drafts = blogs.filter((b) => b.status === "draft").length;
  const featured = blogs.filter((b) => b.isFeatured).length;

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Content Management</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Blogs</h1>
          <p className="mt-1 text-sm text-slate-500">सभी लेख यहाँ manage करें।</p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800"
        >
          <Plus size={18} /> Create Blog
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Blogs", value: blogs.length, icon: FileText },
          { label: "Published", value: published, icon: Eye },
          { label: "Drafts", value: drafts, icon: FileText },
          { label: "Featured", value: featured, icon: Star },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{item.label}</span>
                <Icon size={19} className="text-emerald-700" />
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900">{item.value}</div>
            </div>
          );
        })}
      </div>

      <section className="grid gap-3 rounded-2xl border bg-white p-4 lg:grid-cols-[1fr_180px_220px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Title, slug, author या tag..."
            className="w-full rounded-xl border py-3 pl-10 pr-3 outline-none focus:border-emerald-500"
          />
        </div>

        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-xl border px-3 py-3 text-sm">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(1); }} className="rounded-xl border px-3 py-3 text-sm">
          <option value="all">All Categories</option>
          {categories.map((item) => (
            <option key={item._id || item.id} value={item._id || item.id}>
              {item.label || item.name}
            </option>
          ))}
        </select>

        <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold">
          <RefreshCw size={16} /> Refresh
        </button>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <section className="overflow-hidden rounded-2xl border bg-white">
        {loading ? (
          <p className="p-10 text-center text-slate-500">Loading blogs...</p>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={32} className="mx-auto text-slate-300" />
            <h2 className="mt-3 font-bold">No blogs found</h2>
            <p className="mt-1 text-sm text-slate-500">Search या filters बदलें।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Blog</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {visible.map((blog) => {
                  const id = blog._id || blog.id;
                  return (
                    <tr key={id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          {blog.coverImage ? (
                            <img src={blog.coverImage} alt="" className="h-14 w-16 rounded-lg border object-cover" />
                          ) : (
                            <div className="flex h-14 w-16 items-center justify-center rounded-lg bg-slate-100"><FileText size={20} /></div>
                          )}
                          <div className="max-w-xs">
                            <div className="font-bold text-slate-900">{blog.title}</div>
                            <div className="mt-1 text-xs text-slate-500">{blog.slug}</div>
                            <div className="mt-1 text-xs text-slate-500">{blog.author || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{blog.category || "—"}</td>
                      <td className="p-4">
                        <select
                          value={blog.status}
                          onChange={(e) => changeStatus(blog, e.target.value)}
                          className="rounded-lg border px-2 py-2 text-xs"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="p-4">{blog.views ?? 0}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleFeatured(blog)}
                          title="Toggle featured"
                          className={`rounded-lg border p-2 ${blog.isFeatured ? "border-amber-300 bg-amber-50 text-amber-700" : "text-slate-400"}`}
                        >
                          <Star size={17} fill={blog.isFeatured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/blog/${id}/edit`} title="Edit" className="rounded-lg border p-2 text-blue-700 hover:bg-blue-50">
                            <Pencil size={16} />
                          </Link>
                          <button onClick={() => remove(blog)} title="Delete" className="rounded-lg border p-2 text-red-600 hover:bg-red-50">
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
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span>{filtered.length} results · Page {currentPage} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button>
        </div>
      </footer>
    </main>
  );
}