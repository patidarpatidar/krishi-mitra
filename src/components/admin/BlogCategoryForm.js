
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import {
  blogApi,
  unwrapItem,
} from "@/lib/blogApi";

const initialForm = {
  label: "",
  slug: "",
  icon: "📚",
  description: "",
  status: "active",
  sortOrder: 0,
};

function makeSlug(value) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `category-${Date.now()}`;
}

export default function BlogCategoryForm({ categoryId }) {
  const router = useRouter();
  const isEdit = Boolean(categoryId);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;

    async function loadCategory() {
      setLoading(true);
      setError("");

      try {
        const response = await blogApi.getCategory(categoryId, true);
        const category = unwrapItem(response, ["category"]);

        if (cancelled) return;

        setForm({
          label: category.label || "",
          slug: category.slug || "",
          icon: category.icon || "📚",
          description: category.description || "",
          status: category.status || "active",
          sortOrder: category.sortOrder ?? 0,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Category load nahi hui.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [categoryId]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "sortOrder" ? value : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const label = form.label.trim();
    const slug = form.slug.trim() || makeSlug(label);

    if (!label) {
      setError("Category label required hai.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Slug mein lowercase English letters, numbers aur hyphens use karein.");
      return;
    }

    const payload = {
      label,
      slug,
      icon: form.icon.trim() || "📚",
      description: form.description.trim(),
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };

    setSaving(true);

    try {
      if (isEdit) {
        await blogApi.updateCategory(categoryId, payload);
      } else {
        await blogApi.createCategory(payload);
      }

      router.push("/admin/blog-categories");
      router.refresh();
    } catch (err) {
      setError(err.message || "Category save nahi hui.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading category...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/blog-categories"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700"
        >
          <ArrowLeft size={17} />
          Back to Categories
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h1 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Category" : "Add Category"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage category details for your agriculture blog.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Category Label *">
                <input
                  name="label"
                  value={form.label}
                  onChange={updateField}
                  required
                  placeholder="e.g. फसल सुरक्षा"
                  className={inputClass}
                />
              </Field>

              <Field label="Category Slug *">
                <input
                  name="slug"
                  value={form.slug}
                  onChange={updateField}
                  placeholder="e.g. fasal-suraksha"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">
                  Lowercase English letters, numbers and hyphens.
                </p>
              </Field>

              <Field label="Icon / Emoji">
                <input
                  name="icon"
                  value={form.icon}
                  onChange={updateField}
                  placeholder="🌾"
                  className={inputClass}
                />
              </Field>

              <Field label="Sort Order">
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={updateField}
                  className={inputClass}
                />
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={form.status}
                  onChange={updateField}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                placeholder="Category ke baare mein short description..."
                className={inputClass}
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/admin/blog-categories"
                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : isEdit
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}