"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { livestockApi } from "@/lib/livestockApi";

const initialForm = {
  title: "",
  slug: "",
  subtitle: "",
  category: "dairy",
  categoryLabel: "डेयरी",
  image: "",
  intro: "",
  facts: [["पशु", "गाय और भैंस"]],
  sections: [
    {
      id: "introduction",
      title: "",
      content: "",
      points: [""],
    },
  ],
  faqs: [{ q: "", a: "" }],
  readTime: "5 min read",
  updatedLabel: "Updated recently",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  status: "draft",
  featured: false,
  sortOrder: 0,
  author: "Krishi Mitra",
};

const categoryOptions = [
  ["dairy", "डेयरी / गाय-भैंस पालन"],
  ["goat", "बकरी पालन"],
  ["poultry", "मुर्गी पालन"],
  ["fodder", "पशु आहार / चारा"],
  ["health", "पशु स्वास्थ्य"],
  ["schemes", "सरकारी योजनाएँ"],
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function LivestockArticleForm({ articleId }) {
  const router = useRouter();
  const isEdit = Boolean(articleId);

  const [form, setForm] = useState(initialForm);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!articleId) return;

    let cancelled = false;

    livestockApi
      .getById(articleId)
      .then((result) => {
        if (!cancelled && result.data) {
          setForm({
            ...initialForm,
            ...result.data,
            facts:
              Array.isArray(result.data.facts) && result.data.facts.length
                ? result.data.facts.map((fact) => [
                    fact?.[0] || "",
                    fact?.[1] || "",
                  ])
                : [["", ""]],
            sections:
              Array.isArray(result.data.sections) &&
              result.data.sections.length
                ? result.data.sections.map((section) => ({
                    id: section.id || `section-${Date.now()}`,
                    title: section.title || "",
                    content: section.content || "",
                    points: Array.isArray(section.points) && section.points.length
                      ? section.points
                      : [""],
                  }))
                : [{ id: "introduction", title: "", content: "", points: [""] }],
            faqs:
              Array.isArray(result.data.faqs) && result.data.faqs.length
                ? result.data.faqs.map((faq) => ({
                    q: faq.q || "",
                    a: faq.a || "",
                  }))
                : [{ q: "", a: "" }],
            keywords: Array.isArray(result.data.keywords)
              ? result.data.keywords.join(", ")
              : result.data.keywords || "",
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateArrayItem(arrayName, index, key, value) {
    setForm((current) => ({
      ...current,
      [arrayName]: current[arrayName].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function updateFact(index, column, value) {
    setForm((current) => ({
      ...current,
      facts: current.facts.map((fact, factIndex) =>
        factIndex === index
          ? fact.map((cell, cellIndex) =>
              cellIndex === column ? value : cell
            )
          : fact
      ),
    }));
  }

  function updatePoint(sectionIndex, pointIndex, value) {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              points: section.points.map((point, i) =>
                i === pointIndex ? value : point
              ),
            }
          : section
      ),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim().toLowerCase(),
      facts: form.facts
        .map(([key, value]) => [key.trim(), value.trim()])
        .filter(([key, value]) => key || value),
      sections: form.sections
        .map((section) => ({
          ...section,
          title: section.title.trim(),
          content: section.content.trim(),
          points: section.points.map((point) => point.trim()).filter(Boolean),
        }))
        .filter((section) => section.title || section.content || section.points.length),
      faqs: form.faqs
        .map((faq) => ({ q: faq.q.trim(), a: faq.a.trim() }))
        .filter((faq) => faq.q && faq.a),
      keywords: form.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      sortOrder: Number(form.sortOrder) || 0,
    };

    try {
      if (!payload.title || !payload.slug || !payload.category) {
        throw new Error("Title, slug और category भरना जरूरी है।");
      }

      if (isEdit) {
        await livestockApi.update(articleId, payload);
      } else {
        await livestockApi.create(payload);
      }

      router.push("/admin/livestock");
      router.refresh();
    } catch (err) {
      setError(err.message || "Article save नहीं हो पाया");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="p-8 text-slate-600">Article loading...</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/admin/livestock")}
          className="mb-5 text-sm font-semibold text-green-700 hover:underline"
        >
          ← Back to articles
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? "Edit Article" : "Add Livestock Article"}
          </h1>
          <p className="mt-2 text-slate-600">
            Article content, facts, FAQs और SEO details manage करें।
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-bold">Basic Details</h2>

            <Field label="Article title *">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((current) => ({
                    ...current,
                    title,
                    ...(!slugManuallyEdited ? { slug: slugify(title) } : {}),
                  }));
                }}
              />
            </Field>

            <Field label="Slug *">
              <input
                required
                className={inputClass}
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setField("slug", slugify(e.target.value));
                }}
                placeholder="gay-bhains-palan"
              />
            </Field>

            <Field label="Subtitle">
              <input
                className={inputClass}
                value={form.subtitle || ""}
                onChange={(e) => setField("subtitle", e.target.value)}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category *">
                <select
                  required
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    const selected = categoryOptions.find(
                      ([value]) => value === category
                    );
                    setForm((current) => ({
                      ...current,
                      category,
                      categoryLabel: selected?.[1] || category,
                    }));
                  }}
                >
                  {categoryOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Category label">
                <input
                  className={inputClass}
                  value={form.categoryLabel || ""}
                  onChange={(e) => setField("categoryLabel", e.target.value)}
                />
              </Field>
            </div>

            <Field label="Cover image URL">
              <input
                className={inputClass}
                value={form.image || ""}
                onChange={(e) => setField("image", e.target.value)}
                placeholder="https://..."
              />
            </Field>

            {form.image && (
              <img
                src={form.image}
                alt="Article preview"
                className="h-48 w-full rounded-lg border object-cover sm:w-80"
              />
            )}

            <Field label="Introduction">
              <textarea
                rows={4}
                className={inputClass}
                value={form.intro || ""}
                onChange={(e) => setField("intro", e.target.value)}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Author">
                <input
                  className={inputClass}
                  value={form.author || ""}
                  onChange={(e) => setField("author", e.target.value)}
                />
              </Field>

              <Field label="Read time">
                <input
                  className={inputClass}
                  value={form.readTime || ""}
                  onChange={(e) => setField("readTime", e.target.value)}
                  placeholder="5 min read"
                />
              </Field>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Quick Facts</h2>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    facts: [...current.facts, ["", ""]],
                  }))
                }
                className="rounded-lg border px-3 py-2 text-sm font-semibold"
              >
                + Add fact
              </button>
            </div>

            {form.facts.map(([key, value], index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                <input
                  className={inputClass}
                  placeholder="Label"
                  value={key}
                  onChange={(e) => updateFact(index, 0, e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="Value"
                  value={value}
                  onChange={(e) => updateFact(index, 1, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setField(
                      "facts",
                      form.facts.filter((_, i) => i !== index)
                    )
                  }
                  className="rounded-lg border border-red-200 px-3 py-2 text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Content Sections</h2>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    sections: [
                      ...current.sections,
                      {
                        id: `section-${Date.now()}`,
                        title: "",
                        content: "",
                        points: [""],
                      },
                    ],
                  }))
                }
                className="rounded-lg border px-3 py-2 text-sm font-semibold"
              >
                + Add section
              </button>
            </div>

            {form.sections.map((section, index) => (
              <div key={section.id || index} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Section {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "sections",
                        form.sections.filter((_, i) => i !== index)
                      )
                    }
                    className="text-sm font-semibold text-red-600"
                  >
                    Remove section
                  </button>
                </div>

                <Field label="Section heading">
                  <input
                    className={inputClass}
                    value={section.title}
                    onChange={(e) =>
                      updateArrayItem("sections", index, "title", e.target.value)
                    }
                  />
                </Field>

                <Field label="Section content">
                  <textarea
                    rows={4}
                    className={inputClass}
                    value={section.content}
                    onChange={(e) =>
                      updateArrayItem("sections", index, "content", e.target.value)
                    }
                  />
                </Field>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Bullet points
                  </p>
                  {section.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="mb-2 flex gap-2">
                      <input
                        className={inputClass}
                        value={point}
                        onChange={(e) =>
                          updatePoint(index, pointIndex, e.target.value)
                        }
                        placeholder="Point"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            sections: current.sections.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    points: item.points.filter(
                                      (_, p) => p !== pointIndex
                                    ),
                                  }
                                : item
                            ),
                          }))
                        }
                        className="rounded-lg border px-3 text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        sections: current.sections.map((item, i) =>
                          i === index
                            ? { ...item, points: [...item.points, ""] }
                            : item
                        ),
                      }))
                    }
                    className="text-sm font-semibold text-green-700"
                  >
                    + Add bullet
                  </button>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">FAQs</h2>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    faqs: [...current.faqs, { q: "", a: "" }],
                  }))
                }
                className="rounded-lg border px-3 py-2 text-sm font-semibold"
              >
                + Add FAQ
              </button>
            </div>

            {form.faqs.map((faq, index) => (
              <div key={index} className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">FAQ {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "faqs",
                        form.faqs.filter((_, i) => i !== index)
                      )
                    }
                    className="text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <Field label="Question">
                  <input
                    className={inputClass}
                    value={faq.q}
                    onChange={(e) =>
                      updateArrayItem("faqs", index, "q", e.target.value)
                    }
                  />
                </Field>

                <Field label="Answer">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={faq.a}
                    onChange={(e) =>
                      updateArrayItem("faqs", index, "a", e.target.value)
                    }
                  />
                </Field>
              </div>
            ))}
          </section>

          <section className="space-y-4 rounded-xl border bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-bold">SEO & Publishing</h2>

            <Field label="Meta title">
              <input
                className={inputClass}
                value={form.metaTitle || ""}
                onChange={(e) => setField("metaTitle", e.target.value)}
              />
            </Field>

            <Field label="Meta description">
              <textarea
                rows={3}
                className={inputClass}
                value={form.metaDescription || ""}
                onChange={(e) => setField("metaDescription", e.target.value)}
              />
            </Field>

            <Field label="Keywords (comma separated)">
              <input
                className={inputClass}
                value={form.keywords || ""}
                onChange={(e) => setField("keywords", e.target.value)}
                placeholder="गाय पालन, पशुपालन, डेयरी"
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status || "draft"}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>

              <Field label="Sort order">
                <input
                  type="number"
                  className={inputClass}
                  value={form.sortOrder ?? 0}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => setField("featured", e.target.checked)}
                className="h-4 w-4 accent-green-700"
              />
              <span className="text-sm font-semibold text-slate-700">
                Featured article
              </span>
            </label>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Article"
                  : "Create Article"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/livestock")}
              className="rounded-lg border bg-white px-6 py-3 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}