"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Sprout } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/apiClient";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function parseApiResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const responseText = await response.text();

  let data = {};

  if (contentType.includes("application/json")) {
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error("Backend returned invalid JSON.");
    }
  } else {
    console.error(
      `API returned non-JSON response (${response.status}):`,
      responseText.slice(0, 300)
    );

    throw new Error(
      `API returned HTML/text instead of JSON (HTTP ${response.status}). Check the API URL and backend route.`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

function getCategoryFromResponse(result) {
  return result?.data?.category ||
    result?.data ||
    result?.category ||
    result;
}

function generateSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CropCategoryForm({ categoryId = null }) {
  const isEdit = Boolean(categoryId);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadCategory() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/crop-categories/${encodeURIComponent(categoryId)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const result = await parseApiResponse(response);
        const category = getCategoryFromResponse(result);

        if (!category || !(category._id || category.id || category.name)) {
          throw new Error(
            "Category not found in API response. Check GET /crop-categories/:id."
          );
        }

        setName(category.name || "");
        setSlug(category.slug || "");
        setDescription(category.description || "");
        setStatus(category.status || "active");
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Load crop category error:", err);
        setError(err.message || "Failed to load category.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => controller.abort();
  }, [categoryId]);

  function handleNameChange(value) {
    setName(value);

    // Automatically generate the slug only on the create page.
    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        status,
      };

      const url = isEdit
        ? `${API_URL}/crop-categories/${encodeURIComponent(categoryId)}`
        : `${API_URL}/crop-categories`;

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      await parseApiResponse(response);

      window.location.assign("/admin/crops/categories");
    } catch (err) {
      console.error("Save crop category error:", err);
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
            <p className="text-sm text-gray-500">
              Loading category...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-green-700">
              <Sprout size={22} />
              <span className="text-sm font-medium">
                Crop Management
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Crop Category" : "Add Crop Category"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update crop category details."
                : "Create a new crop category for Krishi Mitra."}
            </p>
          </div>

          <Link
            href="/admin/crops/categories"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="space-y-6 p-5 sm:p-7">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <p className="font-semibold">Something went wrong</p>
                <p className="mt-1 break-words">{error}</p>

                {isEdit && (
                  <p className="mt-2 text-xs">
                    Check that GET /api/crop-categories/:id exists in
                    your backend.
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category Name *
              </label>

              <input
                id="category-name"
                type="text"
                required
                value={name}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                placeholder="e.g. अनाज"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug *
              </label>

              <input
                id="category-slug"
                type="text"
                required
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                      .trimStart()
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                  )
                }
                placeholder="e.g. anaj"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Example: <span className="font-medium">anaj</span>
              </p>
            </div>

            <div>
              <label
                htmlFor="category-description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="category-description"
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Category description..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="category-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="category-status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:justify-end">
            <Link
              href="/admin/crops/categories"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                ? "Update Category"
                : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}