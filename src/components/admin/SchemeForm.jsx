"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const emptyLink = {
  title: "",
  url: "",
  type: "official",
};

const defaultSEO = {
  metaTitle: "",
  metaDescription: "",
  keywords: [],
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
};

const emptyScheme = {
  id: "",
  slug: "",
  name: "",
  shortName: "",

  level: "केंद्र सरकार",
  government: "",
  department: "",

  category: "",
  categoryId: "",
  categorySlug: "",

  icon: "sprout",

  description: "",

  benefits: [""],
  eligibility: [""],
  documents: [""],
  howToApply: [""],

  importantLinks: [
    {
      ...emptyLink,
    },
  ],

  sourceName: "",
  sourceUrl: "",
  helpline: "",

  lastVerifiedAt: "",

  tags: [],

  seo: {
    ...defaultSEO,
  },

  featured: false,
  status: "draft",

  views: 0,
  likes: 0,

  publishedAt: "",
  updatedAtContent: "",
};

export default function SchemeForm({
  mode = "create",
  schemeId = null,
}) {
  const router = useRouter();

  const [form, setForm] = useState(emptyScheme);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(
    mode === "edit"
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEdit = mode === "edit";

  /* =====================================================
     LOAD CATEGORIES
  ===================================================== */

  async function loadCategories() {
    try {
      const response = await fetch(
        `${API_URL}/scheme-categories?status=active`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Categories load नहीं हुईं"
        );
      }

      setCategories(data.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  /* =====================================================
     LOAD SCHEME FOR EDIT
  ===================================================== */

  async function loadScheme() {
    if (!schemeId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/schemes/${schemeId}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Scheme load नहीं हुई"
        );
      }

      const scheme = data.data;

      setForm({
        ...emptyScheme,
        ...scheme,

        categoryId:
          scheme.categoryId?._id ||
          scheme.categoryId ||
          "",

        benefits:
          scheme.benefits?.length
            ? scheme.benefits
            : [""],

        eligibility:
          scheme.eligibility?.length
            ? scheme.eligibility
            : [""],

        documents:
          scheme.documents?.length
            ? scheme.documents
            : [""],

        howToApply:
          scheme.howToApply?.length
            ? scheme.howToApply
            : [""],

        importantLinks:
          scheme.importantLinks?.length
            ? scheme.importantLinks
            : [{ ...emptyLink }],

        tags: scheme.tags || [],

        seo: {
          ...defaultSEO,
          ...(scheme.seo || {}),
          keywords:
            scheme.seo?.keywords || [],
        },

        publishedAt:
          formatDateTimeLocal(
            scheme.publishedAt
          ),

        updatedAtContent:
          formatDateTimeLocal(
            scheme.updatedAtContent
          ),

        lastVerifiedAt:
          scheme.lastVerifiedAt || "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Scheme load करने में समस्या हुई"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      loadScheme();
    }
  }, [schemeId]);

  /* =====================================================
     BASIC CHANGE
  ===================================================== */

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /* =====================================================
     CATEGORY
  ===================================================== */

  function handleCategoryChange(categoryId) {
    const selected = categories.find(
      (item) => item._id === categoryId
    );

    setForm((prev) => ({
      ...prev,
      categoryId,
      category:
        selected?.name || prev.category,
      categorySlug:
        selected?.slug || prev.categorySlug,
    }));
  }

  /* =====================================================
     ARRAY FIELD
  ===================================================== */

  function updateArrayItem(
    field,
    index,
    value
  ) {
    setForm((prev) => {
      const items = [...prev[field]];
      items[index] = value;

      return {
        ...prev,
        [field]: items,
      };
    });
  }

  function addArrayItem(field) {
    setForm((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        "",
      ],
    }));
  }

  function removeArrayItem(
    field,
    index
  ) {
    setForm((prev) => {
      const items = prev[field].filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        [field]:
          items.length ? items : [""],
      };
    });
  }

  /* =====================================================
     TAGS
  ===================================================== */

  function handleTags(value) {
    setForm((prev) => ({
      ...prev,
      tags: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  }

  /* =====================================================
     SEO KEYWORDS
  ===================================================== */

  function handleSEOKeywords(value) {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  }

  function updateSEO(field, value) {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  }

  /* =====================================================
     IMPORTANT LINKS
  ===================================================== */

  function updateLink(
    index,
    field,
    value
  ) {
    setForm((prev) => {
      const links = [...prev.importantLinks];

      links[index] = {
        ...links[index],
        [field]: value,
      };

      return {
        ...prev,
        importantLinks: links,
      };
    });
  }

  function addLink() {
    setForm((prev) => ({
      ...prev,
      importantLinks: [
        ...prev.importantLinks,
        { ...emptyLink },
      ],
    }));
  }

  function removeLink(index) {
    setForm((prev) => {
      const links =
        prev.importantLinks.filter(
          (_, i) => i !== index
        );

      return {
        ...prev,
        importantLinks:
          links.length
            ? links
            : [{ ...emptyLink }],
      };
    });
  }

  /* =====================================================
     VALIDATION
  ===================================================== */

  function validateForm() {
    if (!form.id.trim()) {
      return "Scheme ID required है";
    }

    if (!form.slug.trim()) {
      return "Slug required है";
    }

    if (!form.name.trim()) {
      return "Scheme name required है";
    }

    if (!form.description.trim()) {
      return "Description required है";
    }

    if (!form.categoryId) {
      return "Category select करें";
    }

    if (!form.sourceName.trim()) {
      return "Source name required है";
    }

    if (!form.sourceUrl.trim()) {
      return "Source URL required है";
    }

    return "";
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,

        id: form.id.trim().toLowerCase(),
        slug: form.slug.trim().toLowerCase(),

        category:
          form.category ||
          categories.find(
            (item) =>
              item._id ===
              form.categoryId
          )?.name ||
          "",

        categorySlug:
          form.categorySlug ||
          categories.find(
            (item) =>
              item._id ===
              form.categoryId
          )?.slug ||
          "",

        benefits: cleanArray(
          form.benefits
        ),

        eligibility: cleanArray(
          form.eligibility
        ),

        documents: cleanArray(
          form.documents
        ),

        howToApply: cleanArray(
          form.howToApply
        ),

        tags: form.tags.filter(Boolean),

        importantLinks:
          form.importantLinks.filter(
            (item) =>
              item.title.trim() ||
              item.url.trim()
          ),
      };

      const url = isEdit
        ? `${API_URL}/schemes/${schemeId}`
        : `${API_URL}/schemes`;

      const method = isEdit
        ? "PATCH"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        if (data.errors?.length) {
          throw new Error(
            data.errors
              .map(
                (item) =>
                  `${item.field}: ${item.message}`
              )
              .join("\n")
          );
        }

        throw new Error(
          data.message ||
            "Scheme save नहीं हुई"
        );
      }

      setSuccess(
        isEdit
          ? "Scheme successfully updated."
          : "Scheme successfully created."
      );

      setTimeout(() => {
        router.push("/admin/schemes");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Scheme save करने में समस्या हुई"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">

        <div className="text-center">

          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />

          <p className="text-slate-500 mt-3">
            Scheme load हो रही है...
          </p>

        </div>

      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <Link
            href="/admin/schemes"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            सभी योजनाएं
          </Link>

          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit
              ? "योजना Edit करें"
              : "नई सरकारी योजना"}
          </h1>

          <p className="text-slate-500 mt-1">
            Government scheme की पूरी जानकारी
            manage करें।
          </p>

        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-60"
        >

          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}

          {saving
            ? "Saving..."
            : isEdit
            ? "Update Scheme"
            : "Save Scheme"}

        </button>

      </div>

      {/* ALERTS */}

      {error && (
        <div className="whitespace-pre-line bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4">
          {success}
        </div>
      )}

      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <Section
        title="Basic Information"
        description="Scheme की basic पहचान और government details."
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            label="Scheme ID *"
            value={form.id}
            onChange={(e) =>
              updateField(
                "id",
                e.target.value
              )
            }
            placeholder="pm-kisan"
          />

          <Input
            label="Slug *"
            value={form.slug}
            onChange={(e) =>
              updateField(
                "slug",
                e.target.value
              )
            }
            placeholder="pm-kisan"
          />

          <Input
            label="Scheme Name *"
            value={form.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            placeholder="प्रधानमंत्री किसान सम्मान निधि"
          />

          <Input
            label="Short Name"
            value={form.shortName}
            onChange={(e) =>
              updateField(
                "shortName",
                e.target.value
              )
            }
            placeholder="PM-KISAN"
          />

          <Select
            label="Government Level"
            value={form.level}
            onChange={(e) =>
              updateField(
                "level",
                e.target.value
              )
            }
            options={[
              {
                value: "केंद्र सरकार",
                label: "केंद्र सरकार",
              },
              {
                value:
                  "मध्य प्रदेश सरकार",
                label:
                  "मध्य प्रदेश सरकार",
              },
            ]}
          />

          <Input
            label="Government"
            value={form.government}
            onChange={(e) =>
              updateField(
                "government",
                e.target.value
              )
            }
            placeholder="भारत सरकार"
          />

          <Input
            label="Department"
            value={form.department}
            onChange={(e) =>
              updateField(
                "department",
                e.target.value
              )
            }
            placeholder="कृषि एवं किसान कल्याण मंत्रालय"
          />

          <Input
            label="Icon"
            value={form.icon}
            onChange={(e) =>
              updateField(
                "icon",
                e.target.value
              )
            }
            placeholder="sprout"
          />

        </div>

      </Section>

      {/* =================================================
          CATEGORY
      ================================================= */}

      <Section
        title="Category"
        description="Scheme को category से connect करें।"
      >

        <div className="grid md:grid-cols-3 gap-5">

          <Select
            label="Scheme Category *"
            value={form.categoryId}
            onChange={(e) =>
              handleCategoryChange(
                e.target.value
              )
            }
            options={[
              {
                value: "",
                label: "Category select करें",
              },
              ...categories.map(
                (item) => ({
                  value: item._id,
                  label: item.name,
                })
              ),
            ]}
          />

          <Input
            label="Category Name"
            value={form.category}
            readOnly
          />

          <Input
            label="Category Slug"
            value={form.categorySlug}
            readOnly
          />

        </div>

      </Section>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <Section
        title="Description"
        description="Scheme का मुख्य विवरण।"
      >

        <Textarea
          label="Description *"
          value={form.description}
          onChange={(e) =>
            updateField(
              "description",
              e.target.value
            )
          }
          rows={6}
          placeholder="प्रधानमंत्री किसान सम्मान निधि..."
        />

      </Section>

      {/* =================================================
          BENEFITS
      ================================================= */}

      <ArraySection
        title="Benefits"
        description="योजना से मिलने वाले लाभ।"
        items={form.benefits}
        field="benefits"
        onChange={updateArrayItem}
        onAdd={addArrayItem}
        onRemove={removeArrayItem}
        placeholder="पात्र किसानों को ₹6,000 प्रति वर्ष की सहायता।"
      />

      {/* =================================================
          ELIGIBILITY
      ================================================= */}

      <ArraySection
        title="Eligibility"
        description="योजना की पात्रता।"
        items={form.eligibility}
        field="eligibility"
        onChange={updateArrayItem}
        onAdd={addArrayItem}
        onRemove={removeArrayItem}
        placeholder="योजना के नियमों के अनुसार पात्र किसान..."
      />

      {/* =================================================
          DOCUMENTS
      ================================================= */}

      <ArraySection
        title="Required Documents"
        description="आवेदन के लिए आवश्यक documents।"
        items={form.documents}
        field="documents"
        onChange={updateArrayItem}
        onAdd={addArrayItem}
        onRemove={removeArrayItem}
        placeholder="आधार कार्ड"
      />

      {/* =================================================
          HOW TO APPLY
      ================================================= */}

      <ArraySection
        title="How To Apply"
        description="किसान आवेदन कैसे करें।"
        items={form.howToApply}
        field="howToApply"
        onChange={updateArrayItem}
        onAdd={addArrayItem}
        onRemove={removeArrayItem}
        placeholder="Official portal खोलें।"
      />

      {/* =================================================
          IMPORTANT LINKS
      ================================================= */}

      <Section
        title="Important Links"
        description="Official website, application, status आदि links."
      >

        <div className="space-y-4">

          {form.importantLinks.map(
            (link, index) => (

              <div
                key={index}
                className="border border-slate-200 rounded-xl p-4"
              >

                <div className="grid md:grid-cols-3 gap-4">

                  <Input
                    label="Title"
                    value={link.title}
                    onChange={(e) =>
                      updateLink(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Official Website"
                  />

                  <Input
                    label="URL"
                    value={link.url}
                    onChange={(e) =>
                      updateLink(
                        index,
                        "url",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Link Type
                    </label>

                    <div className="flex gap-2">

                      <select
                        value={link.type}
                        onChange={(e) =>
                          updateLink(
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-3"
                      >
                        <option value="official">
                          Official
                        </option>

                        <option value="apply">
                          Apply
                        </option>

                        <option value="status">
                          Status
                        </option>

                        <option value="calculator">
                          Calculator
                        </option>

                        <option value="login">
                          Login
                        </option>

                        <option value="portal">
                          Portal
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          removeLink(index)
                        }
                        className="px-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                    </div>

                  </div>

                </div>

                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-emerald-600 mt-3"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open link
                  </a>
                )}

              </div>

            )
          )}

          <button
            type="button"
            onClick={addLink}
            className="inline-flex items-center gap-2 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50"
          >
            <Plus className="w-4 h-4" />
            Add Important Link
          </button>

        </div>

      </Section>

      {/* =================================================
          SOURCE
      ================================================= */}

      <Section
        title="Source & Verification"
        description="Official source और verification information."
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            label="Source Name *"
            value={form.sourceName}
            onChange={(e) =>
              updateField(
                "sourceName",
                e.target.value
              )
            }
            placeholder="PM-KISAN Official Portal"
          />

          <Input
            label="Source URL *"
            value={form.sourceUrl}
            onChange={(e) =>
              updateField(
                "sourceUrl",
                e.target.value
              )
            }
            placeholder="https://pmkisan.gov.in/"
          />

          <Input
            label="Helpline"
            value={form.helpline || ""}
            onChange={(e) =>
              updateField(
                "helpline",
                e.target.value
              )
            }
            placeholder="14447"
          />

          <Input
            label="Last Verified At"
            value={
              form.lastVerifiedAt || ""
            }
            onChange={(e) =>
              updateField(
                "lastVerifiedAt",
                e.target.value
              )
            }
            placeholder="08 अक्टूबर 2026"
          />

        </div>

      </Section>

      {/* =================================================
          TAGS
      ================================================= */}

      <Section
        title="Tags"
        description="SEO और search के लिए tags."
      >

        <Input
          label="Tags"
          value={form.tags.join(", ")}
          onChange={(e) =>
            handleTags(e.target.value)
          }
          placeholder="PM-KISAN, किसान सम्मान निधि, DBT"
        />

        <p className="text-xs text-slate-500 mt-2">
          Tags को comma से अलग करें।
        </p>

      </Section>

      {/* =================================================
          SEO
      ================================================= */}

      <Section
        title="SEO"
        description="Google search और social sharing के लिए SEO fields."
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            label="Meta Title"
            value={form.seo.metaTitle}
            onChange={(e) =>
              updateSEO(
                "metaTitle",
                e.target.value
              )
            }
            placeholder="PM-KISAN योजना | किसान सम्मान निधि"
          />

          <Input
            label="Focus Keyword"
            value={form.seo.focusKeyword}
            onChange={(e) =>
              updateSEO(
                "focusKeyword",
                e.target.value
              )
            }
            placeholder="PM-KISAN"
          />

          <div className="md:col-span-2">

            <Textarea
              label="Meta Description"
              value={
                form.seo.metaDescription
              }
              onChange={(e) =>
                updateSEO(
                  "metaDescription",
                  e.target.value
                )
              }
              rows={4}
              placeholder="PM-KISAN योजना की eligibility, benefits और official application information..."
            />

          </div>

          <Input
            label="SEO Keywords"
            value={form.seo.keywords.join(
              ", "
            )}
            onChange={(e) =>
              handleSEOKeywords(
                e.target.value
              )
            }
            placeholder="PM-KISAN, किसान योजना, किसान सम्मान निधि"
          />

          <Input
            label="Canonical URL"
            value={
              form.seo.canonicalUrl
            }
            onChange={(e) =>
              updateSEO(
                "canonicalUrl",
                e.target.value
              )
            }
            placeholder="https://..."
          />

          <Input
            label="OG Title"
            value={form.seo.ogTitle}
            onChange={(e) =>
              updateSEO(
                "ogTitle",
                e.target.value
              )
            }
          />

          <Input
            label="OG Image"
            value={form.seo.ogImage}
            onChange={(e) =>
              updateSEO(
                "ogImage",
                e.target.value
              )
            }
            placeholder="https://..."
          />

          <div className="md:col-span-2">

            <Textarea
              label="OG Description"
              value={
                form.seo.ogDescription
              }
              onChange={(e) =>
                updateSEO(
                  "ogDescription",
                  e.target.value
                )
              }
              rows={3}
            />

          </div>

          <Input
            label="Twitter Title"
            value={
              form.seo.twitterTitle
            }
            onChange={(e) =>
              updateSEO(
                "twitterTitle",
                e.target.value
              )
            }
          />

          <Input
            label="Twitter Image"
            value={
              form.seo.twitterImage
            }
            onChange={(e) =>
              updateSEO(
                "twitterImage",
                e.target.value
              )
            }
            placeholder="https://..."
          />

          <div className="md:col-span-2">

            <Textarea
              label="Twitter Description"
              value={
                form.seo
                  .twitterDescription
              }
              onChange={(e) =>
                updateSEO(
                  "twitterDescription",
                  e.target.value
                )
              }
              rows={3}
            />

          </div>

          <Select
            label="Schema Type"
            value={
              form.seo.schemaType
            }
            onChange={(e) =>
              updateSEO(
                "schemaType",
                e.target.value
              )
            }
            options={[
              {
                value: "Article",
                label: "Article",
              },
              {
                value: "WebPage",
                label: "WebPage",
              },
            ]}
          />

        </div>

        <div className="flex flex-wrap gap-6 mt-5">

          <Checkbox
            label="Allow Index"
            checked={
              form.seo.allowIndex
            }
            onChange={(checked) =>
              updateSEO(
                "allowIndex",
                checked
              )
            }
          />

          <Checkbox
            label="Allow Follow"
            checked={
              form.seo.allowFollow
            }
            onChange={(checked) =>
              updateSEO(
                "allowFollow",
                checked
              )
            }
          />

        </div>

      </Section>

      {/* =================================================
          PUBLISHING
      ================================================= */}

      <Section
        title="Publishing"
        description="Scheme की publishing और visibility settings."
      >

        <div className="grid md:grid-cols-2 gap-5">

          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value
              )
            }
            options={[
              {
                value: "draft",
                label: "Draft",
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
                value: "archived",
                label: "Archived",
              },
            ]}
          />

          <Input
            label="Published At"
            type="datetime-local"
            value={
              form.publishedAt || ""
            }
            onChange={(e) =>
              updateField(
                "publishedAt",
                e.target.value
              )
            }
          />

          <Input
            label="Updated At Content"
            type="datetime-local"
            value={
              form.updatedAtContent || ""
            }
            onChange={(e) =>
              updateField(
                "updatedAtContent",
                e.target.value
              )
            }
          />

          <div className="flex items-center">

            <Checkbox
              label="Featured Scheme"
              checked={
                form.featured
              }
              onChange={(checked) =>
                updateField(
                  "featured",
                  checked
                )
              }
            />

          </div>

        </div>

      </Section>

      {/* =================================================
          ANALYTICS
      ================================================= */}

      {isEdit && (
        <Section
          title="Analytics"
          description="Scheme engagement information."
        >

          <div className="grid md:grid-cols-2 gap-5">

            <Input
              label="Views"
              type="number"
              value={form.views ?? 0}
              onChange={(e) =>
                updateField(
                  "views",
                  Number(e.target.value)
                )
              }
            />

            <Input
              label="Likes"
              type="number"
              value={form.likes ?? 0}
              onChange={(e) =>
                updateField(
                  "likes",
                  Number(e.target.value)
                )
              }
            />

          </div>

        </Section>
      )}

      {/* =================================================
          BOTTOM SAVE
      ================================================= */}

      <div className="flex justify-end gap-3 pb-10">

        <Link
          href="/admin/schemes"
          className="px-5 py-3 border border-slate-200 rounded-xl font-semibold"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60"
        >

          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}

          {isEdit
            ? "Update Scheme"
            : "Save Scheme"}

        </button>

      </div>

    </form>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  description,
  children,
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6">

      <div className="mb-5">

        <h2 className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500 mt-1">
            {description}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  readOnly = false,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 ${
          readOnly
            ? "bg-slate-50 text-slate-500"
            : ""
        }`}
      />

    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = "",
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
      />

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={onChange}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
}

/* =========================================================
   CHECKBOX
========================================================= */

function Checkbox({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
      />

      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

    </label>
  );
}

/* =========================================================
   ARRAY SECTION
========================================================= */

function ArraySection({
  title,
  description,
  items,
  field,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}) {
  return (
    <Section
      title={title}
      description={description}
    >

      <div className="space-y-3">

        {items.map((item, index) => (

          <div
            key={index}
            className="flex gap-2"
          >

            <div className="flex-1">

              <input
                value={item}
                onChange={(e) =>
                  onChange(
                    field,
                    index,
                    e.target.value
                  )
                }
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

            <button
              type="button"
              onClick={() =>
                onRemove(
                  field,
                  index
                )
              }
              className="px-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>

          </div>

        ))}

      </div>

      <button
        type="button"
        onClick={() =>
          onAdd(field)
        }
        className="inline-flex items-center gap-2 mt-4 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50"
      >
        <Plus className="w-4 h-4" />
        Add {title}
      </button>

    </Section>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function cleanArray(items = []) {
  return items
    .map((item) =>
      typeof item === "string"
        ? item.trim()
        : item
    )
    .filter(Boolean);
}

function formatDateTimeLocal(
  value
) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const hours = String(
    date.getHours()
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}