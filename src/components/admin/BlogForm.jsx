
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { blogApi, unwrapItem, unwrapList } from "@/lib/blogApi";

const EMPTY = {
  title: "",
  slug: "",
  categoryId: "",
  category: "",
  author: "कृषि मित्र",
  authorRole: "",
  authorAvatar: "",
  status: "draft",
  isFeatured: false,
  coverImage: "",
  excerpt: "",
  tagsText: "",
  hasVideo: false,
  hasGallery: false,
  youtubeVideoId: "",
  introduction: "",
  safetyNote: "",
  sections: [{ id: "section-1", title: "", paragraphs: [""], bullets: [""] }],
  faqs: [{ question: "", answer: "" }],
  galleryImages: [{ url: "", title: "" }],
  calculator: {
    enabled: false,
    waterPerAcre: "",
    recommendations: [{ name: "", type: "", quantity: "", unit: "", note: "" }],
  },
  seo: {
    metaTitle: "",
    metaDescription: "",
    keywordsText: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    schemaType: "Article",
    allowIndex: true,
    allowFollow: true,
  },
};

function slugify(value) {
  return value.toLowerCase().trim()
    .normalize("NFKD")
    .replace(/[^\w\u0900-\u097F]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Field({ label, name, value, onChange, placeholder, type = "text", maxLength }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, placeholder, maxLength }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}

function SectionHeading({ children }) {
  return <h2 className="mb-5 text-lg font-black text-slate-900">{children}</h2>;
}

function Panel({ title, children }) {
  return (
    <section className="space-y-4 rounded-2xl border bg-white p-5 sm:p-6">
      <SectionHeading>{title}</SectionHeading>
      {children}
    </section>
  );
}

export default function BlogForm({ blogId }) {
  const editing = Boolean(blogId);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const categoryResponse = await blogApi.getCategories();
        const categoryList = unwrapList(categoryResponse, ["categories", "items"]);

        if (!cancelled) setCategories(categoryList);

        if (blogId) {
          const response = await blogApi.getBlog(blogId);
          const blog = unwrapItem(response, ["blog", "item"]);

          if (!blog) throw new Error("Blog not found");

          const content = blog.content || {};
          const seo = blog.seo || {};
          const calculator = blog.calculator || {};

          if (!cancelled) {
            setForm({
              ...EMPTY,
              ...blog,
              categoryId: blog.categoryId?._id || blog.categoryId || "",
              category: blog.category || "",
              introduction: content.introduction || "",
              safetyNote: content.safetyNote || blog.safetyNote || "",
              sections: content.sections?.length ? content.sections : EMPTY.sections,
              faqs: content.faqs?.length ? content.faqs : EMPTY.faqs,
              galleryImages: blog.galleryImages?.length ? blog.galleryImages : EMPTY.galleryImages,
              tagsText: (blog.tags || []).join(", "),
              calculator: {
                ...EMPTY.calculator,
                ...calculator,
                recommendations: calculator.recommendations?.length
                  ? calculator.recommendations
                  : EMPTY.calculator.recommendations,
              },
              seo: {
                ...EMPTY.seo,
                ...seo,
                keywordsText: (seo.keywords || []).join(", "),
              },
            });
            setSlugEdited(true);
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [blogId]);

  function change(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
  }

  function changeSeo(name, value) {
    setForm((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  }

  function changeCalculator(name, value) {
    setForm((prev) => ({
      ...prev,
      calculator: { ...prev.calculator, [name]: value },
    }));
  }

  function changeSection(index, key, value) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [key]: value } : section
      ),
    }));
  }

  function changeFaq(index, key, value) {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [key]: value } : faq
      ),
    }));
  }

  function changeGallery(index, key, value) {
    setForm((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((image, i) =>
        i === index ? { ...image, [key]: value } : image
      ),
    }));
  }

  function changeRecommendation(index, key, value) {
    setForm((prev) => ({
      ...prev,
      calculator: {
        ...prev.calculator,
        recommendations: prev.calculator.recommendations.map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        ),
      },
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Blog title required है।");
      return;
    }

    const selectedCategory = categories.find(
      (item) => (item._id || item.id) === form.categoryId
    );

    const categoryLabel =
      selectedCategory?.label ||
      selectedCategory?.name ||
      form.category;

    if (!categoryLabel) {
      setError("कृपया category चुनें।");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: (form.slug.trim() || slugify(form.title)).toLowerCase(),
      categoryId: form.categoryId || undefined,
      category: categoryLabel,
      author: form.author.trim(),
      authorRole: form.authorRole.trim(),
      authorAvatar: form.authorAvatar.trim(),
      status: form.status,
      isFeatured: Boolean(form.isFeatured),
      coverImage: form.coverImage.trim(),
      excerpt: form.excerpt.trim(),
      tags: form.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
      hasVideo: Boolean(form.hasVideo),
      hasGallery: Boolean(form.hasGallery),
      youtubeVideoId: form.youtubeVideoId.trim(),
      content: {
        introduction: form.introduction,
        sections: form.sections.map((section, index) => ({
          id: section.id || `section-${index + 1}`,
          title: section.title,
          paragraphs: Array.isArray(section.paragraphs)
            ? section.paragraphs
            : String(section.paragraphs || "").split("\n").filter(Boolean),
          bullets: Array.isArray(section.bullets)
            ? section.bullets
            : String(section.bullets || "").split("\n").filter(Boolean),
        })),
        safetyNote: form.safetyNote,
        faqs: form.faqs.filter((faq) => faq.question.trim() || faq.answer.trim()),
      },
      galleryImages: form.galleryImages.filter((image) => image.url.trim()),
      calculator: {
        enabled: Boolean(form.calculator.enabled),
        waterPerAcre: Number(form.calculator.waterPerAcre) || 0,
        recommendations: form.calculator.recommendations.filter((item) => item.name.trim()),
      },
      seo: {
        metaTitle: form.seo.metaTitle.trim(),
        metaDescription: form.seo.metaDescription.trim(),
        keywords: form.seo.keywordsText.split(",").map((x) => x.trim()).filter(Boolean),
        focusKeyword: form.seo.focusKeyword.trim(),
        canonicalUrl: form.seo.canonicalUrl.trim(),
        ogTitle: form.seo.ogTitle.trim(),
        ogDescription: form.seo.ogDescription.trim(),
        ogImage: form.seo.ogImage.trim(),
        twitterTitle: form.seo.twitterTitle.trim(),
        twitterDescription: form.seo.twitterDescription.trim(),
        twitterImage: form.seo.twitterImage.trim(),
        schemaType: form.seo.schemaType,
        allowIndex: Boolean(form.seo.allowIndex),
        allowFollow: Boolean(form.seo.allowFollow),
      },
    };

    setSaving(true);

    try {
      if (editing) {
        await blogApi.updateBlog(blogId, payload);
      } else {
        await blogApi.createBlog(payload);
      }

      window.location.href = "/admin/blog";
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8">Loading blog...</p>;

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <header className="flex items-center gap-3">
        <Link href="/admin/blog" className="rounded-xl border p-2">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-sm font-semibold text-emerald-700">Blog Management</p>
          <h1 className="text-2xl font-black">{editing ? "Edit Blog" : "Create Blog"}</h1>
        </div>
      </header>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Panel title="Basic Information">
            <Field label="Blog Title *" name="title" value={form.title} onChange={change} placeholder="लहसुन की खेती की पूरी जानकारी" />
            <div>
              <label className="mb-2 block text-sm font-semibold">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setForm((prev) => ({ ...prev, slug: e.target.value }));
                }}
                className="w-full rounded-xl border px-4 py-3"
                placeholder="garlic-farming-guide"
              />
            </div>
            <TextArea label="Excerpt / Summary" value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} rows={3} maxLength={500} />
            <Field label="Cover Image URL" name="coverImage" value={form.coverImage} onChange={change} placeholder="https://example.com/image.jpg" />
            {form.coverImage && (
              <img src={form.coverImage} alt="Cover preview" className="max-h-64 w-full rounded-xl border object-cover" />
            )}
            <Field label="Tags (comma separated)" name="tagsText" value={form.tagsText} onChange={change} placeholder="लहसुन, फसल सुरक्षा, खेती" />
          </Panel>

          <Panel title="Article Content">
            <TextArea label="Introduction" value={form.introduction} onChange={(e) => setForm((p) => ({ ...p, introduction: e.target.value }))} rows={5} placeholder="लेख का परिचय..." />

            {form.sections.map((section, index) => (
              <div key={section.id || index} className="space-y-3 rounded-xl border bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Section {index + 1}</h3>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }))} className="text-red-600">
                    <Trash2 size={17} />
                  </button>
                </div>
                <Field label="Section Heading" value={section.title} onChange={(e) => changeSection(index, "title", e.target.value)} />
                <TextArea label="Paragraphs (one per line)" value={Array.isArray(section.paragraphs) ? section.paragraphs.join("\n") : section.paragraphs} onChange={(e) => changeSection(index, "paragraphs", e.target.value.split("\n"))} rows={5} />
                <TextArea label="Bullet Points (one per line)" value={Array.isArray(section.bullets) ? section.bullets.join("\n") : section.bullets} onChange={(e) => changeSection(index, "bullets", e.target.value.split("\n"))} rows={3} />
              </div>
            ))}

            <button type="button" onClick={() => setForm((p) => ({ ...p, sections: [...p.sections, { id: `section-${Date.now()}`, title: "", paragraphs: [""], bullets: [""] }] }))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold">
              <Plus size={17} /> Add Section
            </button>

            <TextArea label="Safety Note / Disclaimer" value={form.safetyNote} onChange={(e) => setForm((p) => ({ ...p, safetyNote: e.target.value }))} rows={3} />
          </Panel>

          <Panel title="FAQs">
            {form.faqs.map((faq, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">FAQ {index + 1}</h3>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, faqs: p.faqs.filter((_, i) => i !== index) }))} className="text-red-600"><Trash2 size={17} /></button>
                </div>
                <Field label="Question" value={faq.question} onChange={(e) => changeFaq(index, "question", e.target.value)} />
                <TextArea label="Answer" value={faq.answer} onChange={(e) => changeFaq(index, "answer", e.target.value)} rows={3} />
              </div>
            ))}
            <button type="button" onClick={() => setForm((p) => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold">
              <Plus size={17} /> Add FAQ
            </button>
          </Panel>

          <Panel title="Gallery Images">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.hasGallery} onChange={(e) => setForm((p) => ({ ...p, hasGallery: e.target.checked }))} />
              Enable gallery
            </label>
            {form.galleryImages.map((image, index) => (
              <div key={index} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
                <Field label="Image URL" value={image.url} onChange={(e) => changeGallery(index, "url", e.target.value)} />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Image Title" value={image.title} onChange={(e) => changeGallery(index, "title", e.target.value)} />
                  </div>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, galleryImages: p.galleryImages.filter((_, i) => i !== index) }))} className="mb-1 rounded-lg border p-3 text-red-600"><Trash2 size={17} /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setForm((p) => ({ ...p, galleryImages: [...p.galleryImages, { url: "", title: "" }] }))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold">
              <Plus size={17} /> Add Image
            </button>
          </Panel>

          <Panel title="Video">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="hasVideo" checked={form.hasVideo} onChange={change} />
              Enable YouTube video
            </label>
            <Field label="YouTube Video ID" name="youtubeVideoId" value={form.youtubeVideoId} onChange={change} placeholder="YouTube video ID, not full URL" />
          </Panel>

          <Panel title="Calculator / Recommendations">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.calculator.enabled} onChange={(e) => changeCalculator("enabled", e.target.checked)} />
              Enable calculator
            </label>
            <Field label="Water per Acre" type="number" value={form.calculator.waterPerAcre} onChange={(e) => changeCalculator("waterPerAcre", e.target.value)} />
            {form.calculator.recommendations.map((item, index) => (
              <div key={index} className="space-y-3 rounded-xl border p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">Recommendation {index + 1}</h3>
                  <button type="button" onClick={() => setForm((p) => ({ ...p, calculator: { ...p.calculator, recommendations: p.calculator.recommendations.filter((_, i) => i !== index) } }))} className="text-red-600"><Trash2 size={17} /></button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["name", "type", "quantity", "unit", "note"].map((key) => (
                    <Field key={key} label={key} value={item[key]} onChange={(e) => changeRecommendation(index, key, e.target.value)} />
                  ))}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setForm((p) => ({ ...p, calculator: { ...p.calculator, recommendations: [...p.calculator.recommendations, { name: "", type: "", quantity: "", unit: "", note: "" }] } }))} className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 font-semibold">
              <Plus size={17} /> Add Recommendation
            </button>
          </Panel>

          <Panel title="SEO Settings">
            <Field label="Meta Title (max 60 characters)" value={form.seo.metaTitle} maxLength={60} onChange={(e) => changeSeo("metaTitle", e.target.value)} />
            <TextArea label="Meta Description (max 160 characters)" value={form.seo.metaDescription} maxLength={160} rows={3} onChange={(e) => changeSeo("metaDescription", e.target.value)} />
            <Field label="SEO Keywords (comma separated)" value={form.seo.keywordsText} onChange={(e) => changeSeo("keywordsText", e.target.value)} />
            <Field label="Focus Keyword" value={form.seo.focusKeyword} onChange={(e) => changeSeo("focusKeyword", e.target.value)} />
            <Field label="Canonical URL" value={form.seo.canonicalUrl} onChange={(e) => changeSeo("canonicalUrl", e.target.value)} />
            <Field label="Open Graph Title" value={form.seo.ogTitle} onChange={(e) => changeSeo("ogTitle", e.target.value)} />
            <TextArea label="Open Graph Description" value={form.seo.ogDescription} onChange={(e) => changeSeo("ogDescription", e.target.value)} />
            <Field label="Open Graph Image URL" value={form.seo.ogImage} onChange={(e) => changeSeo("ogImage", e.target.value)} />
            <Field label="Twitter Title" value={form.seo.twitterTitle} onChange={(e) => changeSeo("twitterTitle", e.target.value)} />
            <TextArea label="Twitter Description" value={form.seo.twitterDescription} onChange={(e) => changeSeo("twitterDescription", e.target.value)} />
            <Field label="Twitter Image URL" value={form.seo.twitterImage} onChange={(e) => changeSeo("twitterImage", e.target.value)} />

            <div>
              <label className="mb-2 block text-sm font-semibold">Schema Type</label>
              <select value={form.seo.schemaType} onChange={(e) => changeSeo("schemaType", e.target.value)} className="w-full rounded-xl border px-4 py-3">
                <option value="Article">Article</option>
                <option value="BlogPosting">BlogPosting</option>
                <option value="NewsArticle">NewsArticle</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.seo.allowIndex} onChange={(e) => changeSeo("allowIndex", e.target.checked)} /> Allow indexing</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.seo.allowFollow} onChange={(e) => changeSeo("allowFollow", e.target.checked)} /> Allow following links</label>
            </div>
          </Panel>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <Panel title="Publish">
            <div>
              <label className="mb-2 block text-sm font-semibold">Status</label>
              <select name="status" value={form.status} onChange={change} className="w-full rounded-xl border px-4 py-3">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={change} />
              Featured Blog
            </label>
          </Panel>

          <Panel title="Category">
            <div>
              <label className="mb-2 block text-sm font-semibold">Select Category *</label>
              <select
                required
                name="categoryId"
                value={form.categoryId}
                onChange={change}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Choose category</option>
                {categories.map((item) => (
                  <option key={item._id || item.id} value={item._id || item.id}>
                    {item.icon || "📚"} {item.label || item.name}
                  </option>
                ))}
              </select>
            </div>
            <Link href="/admin/blog-categories/new" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Plus size={16} /> Add category
            </Link>
          </Panel>

          <Panel title="Author">
            <Field label="Author Name" name="author" value={form.author} onChange={change} />
            <Field label="Author Role" name="authorRole" value={form.authorRole} onChange={change} />
            <Field label="Author Avatar / Emoji" name="authorAvatar" value={form.authorAvatar} onChange={change} />
          </Panel>

          <button disabled={saving} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-4 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
            <Save size={18} /> {saving ? "Saving..." : editing ? "Update Blog" : "Save Blog"}
          </button>
          <Link href="/admin/blog" className="block rounded-xl border bg-white px-5 py-3 text-center font-semibold">
            Cancel
          </Link>
        </aside>
      </form>
    </main>
  );
}