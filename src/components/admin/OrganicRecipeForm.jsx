"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminAuthHeaders } from "@/lib/apiClient";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const EMPTY_RECIPE = {
  id: "",
  slug: "",
  title: "",
  titleEn: "",
  type: "",
  category: "",
  categoryId: "",
  categorySlug: "",
  target: "",
  shelfLife: "",
  costMin: 0,
  costMax: 0,
  baseArea: 1,
  baseAreaUnit: "acre",
  baseWater: 100,
  baseWaterUnit: "लीटर",

  baseIngredients: [
    {
      name: "",
      amount: 0,
      unit: "किग्रा",
    },
  ],

  processSteps: [""],

  usage: "",
  precautions: "",

  coverImage: "",
  shortDescription: "",

  seo: {
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
  },

  featured: false,
  status: "draft",
  views: 0,
  likes: 0,
  publishedAt: "",
  updatedAtContent: "",
};

const UNIT_OPTIONS = [
  "किग्रा",
  "ग्राम",
  "लीटर",
  "मिलीलीटर",
  "ग्राम/लीटर",
  "किग्रा/लीटर",
];

const AREA_OPTIONS = [
  {
    value: "acre",
    label: "एकड़",
  },
  {
    value: "hectare",
    label: "हेक्टेयर",
  },
  {
    value: "bigha",
    label: "बीघा",
  },
];

const STATUS_OPTIONS = [
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
];

function formatDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset() * 60000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

function cleanArray(values) {
  return values
    .map((item) => String(item).trim())
    .filter(Boolean);
}

export default function OrganicRecipeForm({
  recipeId = null,
}) {
  const router = useRouter();

  const isEdit = Boolean(recipeId);

  const [form, setForm] =
    useState(EMPTY_RECIPE);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(isEdit);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fieldErrors, setFieldErrors] =
    useState([]);

  /* =========================
     LOAD CATEGORIES
  ========================= */

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/organic-categories?status=active`
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Categories load failed"
        );
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Categories load failed");
      }
      setCategories(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Categories load नहीं हो सकीं।");
    }
  };

  /* =========================
     LOAD RECIPE
  ========================= */

  useEffect(() => {
    if (isEdit) {
      loadRecipe();
    }
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/organic-recipes/${recipeId}`
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Recipe load failed"
        );
      }

      const recipe = result.data;

      setForm({
        ...EMPTY_RECIPE,
        ...recipe,

        baseIngredients:
          recipe.baseIngredients?.length
            ? recipe.baseIngredients
            : EMPTY_RECIPE.baseIngredients,

        processSteps:
          recipe.processSteps?.length
            ? recipe.processSteps
            : [""],

        seo: {
          ...EMPTY_RECIPE.seo,
          ...(recipe.seo || {}),
        },

        publishedAt:
          formatDateTimeLocal(
            recipe.publishedAt
          ),

        updatedAtContent:
          formatDateTimeLocal(
            recipe.updatedAtContent
          ),
      });
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Recipe load नहीं हुई"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     BASIC FIELD UPDATE
  ========================= */

  const updateField = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSeo = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value,
      },
    }));
  };

  /* =========================
     CATEGORY
  ========================= */

  const handleCategoryChange = (
    value
  ) => {
    const category =
      categories.find(
        (item) =>
          item.slug === value
      );

    setForm((prev) => ({
      ...prev,
      category: value,
      categorySlug: value,
      categoryId:
        category?._id || "",
    }));
  };

  /* =========================
     INGREDIENTS
  ========================= */

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      baseIngredients: [
        ...prev.baseIngredients,
        {
          name: "",
          amount: 0,
          unit: "किग्रा",
        },
      ],
    }));
  };

  const removeIngredient = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,
      baseIngredients:
        prev.baseIngredients.filter(
          (_, i) => i !== index
        ),
    }));
  };

  const updateIngredient = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      baseIngredients:
        prev.baseIngredients.map(
          (item, i) =>
            i === index
              ? {
                  ...item,
                  [field]:
                    field ===
                    "amount"
                      ? Number(
                          value
                        )
                      : value,
                }
              : item
        ),
    }));
  };

  /* =========================
     PROCESS STEPS
  ========================= */

  const addStep = () => {
    setForm((prev) => ({
      ...prev,
      processSteps: [
        ...prev.processSteps,
        "",
      ],
    }));
  };

  const removeStep = (
    index
  ) => {
    setForm((prev) => ({
      ...prev,
      processSteps:
        prev.processSteps.filter(
          (_, i) => i !== index
        ),
    }));
  };

  const updateStep = (
    index,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      processSteps:
        prev.processSteps.map(
          (step, i) =>
            i === index
              ? value
              : step
        ),
    }));
  };

  /* =========================
     VALIDATION
  ========================= */

  const validate = () => {
    const errors = [];

    if (!form.id.trim()) {
      errors.push(
        "Recipe ID is required."
      );
    }

    if (!form.slug.trim()) {
      errors.push(
        "Slug is required."
      );
    }

    if (!form.title.trim()) {
      errors.push(
        "Title is required."
      );
    }

    if (!form.type.trim()) {
      errors.push(
        "Recipe type is required."
      );
    }

    if (!form.target.trim()) {
      errors.push(
        "Target is required."
      );
    }

    if (
      !form.baseIngredients.some(
        (item) =>
          item.name.trim()
      )
    ) {
      errors.push(
        "At least one ingredient is required."
      );
    }

    if (
      !form.processSteps.some(
        (step) =>
          step.trim()
      )
    ) {
      errors.push(
        "At least one process step is required."
      );
    }

    return errors;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setFieldErrors([]);

    const errors = validate();

    if (errors.length) {
      setFieldErrors(errors);

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

        id: form.id.trim(),
        slug: form.slug.trim(),
        title: form.title.trim(),
        titleEn:
          form.titleEn.trim(),
        type: form.type.trim(),
        target: form.target.trim(),
        shelfLife:
          form.shelfLife.trim(),

        costMin: Number(
          form.costMin || 0
        ),

        costMax: Number(
          form.costMax || 0
        ),

        baseArea: Number(
          form.baseArea || 0
        ),

        baseWater: Number(
          form.baseWater || 0
        ),

        baseIngredients:
          form.baseIngredients
            .filter(
              (item) =>
                item.name.trim()
            )
            .map((item) => ({
              name:
                item.name.trim(),
              amount: Number(
                item.amount || 0
              ),
              unit: item.unit,
            })),

        processSteps:
          cleanArray(
            form.processSteps
          ),

        usage:
          form.usage.trim(),

        precautions:
          form.precautions.trim(),

        coverImage:
          form.coverImage.trim(),

        shortDescription:
          form.shortDescription.trim(),

        seo: {
          ...form.seo,

          keywords:
            Array.isArray(
              form.seo.keywords
            )
              ? form.seo.keywords
              : [],

          metaTitle:
            form.seo.metaTitle.trim(),

          metaDescription:
            form.seo.metaDescription.trim(),

          focusKeyword:
            form.seo.focusKeyword.trim(),

          canonicalUrl:
            form.seo.canonicalUrl.trim(),

          ogTitle:
            form.seo.ogTitle.trim(),

          ogDescription:
            form.seo.ogDescription.trim(),

          ogImage:
            form.seo.ogImage.trim(),

          twitterTitle:
            form.seo.twitterTitle.trim(),

          twitterDescription:
            form.seo.twitterDescription.trim(),

          twitterImage:
            form.seo.twitterImage.trim(),
        },

        publishedAt:
          form.publishedAt
            ? new Date(
                form.publishedAt
              ).toISOString()
            : null,

        updatedAtContent:
          form.updatedAtContent
            ? new Date(
                form.updatedAtContent
              ).toISOString()
            : null,
      };

      const url = isEdit
        ? `${API_URL}/organic-recipes/${recipeId}`
        : `${API_URL}/organic-recipes`;

      const response = await fetch(
        url,
        {
          method: isEdit
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
            ...getAdminAuthHeaders(),
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFieldErrors(
            result.errors.map(
              (item) =>
                item.msg ||
                item.message ||
                "Validation error"
            )
          );
        }

        throw new Error(
          result.message ||
            "Recipe save failed"
        );
      }

      router.push(
        "/admin/organic"
      );

      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Recipe save नहीं हुई"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-green-600"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 md:p-6"
    >
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              href="/admin/organic"
              className="hover:text-green-600"
            >
              Organic Farming
            </Link>

            <span>/</span>

            <span>
              {isEdit
                ? "Edit Recipe"
                : "Add Recipe"}
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {isEdit
              ? "Edit Organic Recipe"
              : "Add Organic Recipe"}
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/organic"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : "Save Recipe"}
          </button>
        </div>
      </div>

      {/* ERRORS */}

      {(error ||
        fieldErrors.length > 0) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          {error && (
            <p className="font-medium text-red-700">
              {error}
            </p>
          )}

          {fieldErrors.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
              {fieldErrors.map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      )}

      {/* BASIC INFORMATION */}

      <Section
        title="Basic Information"
        description="Recipe की मुख्य जानकारी"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Recipe ID"
            value={form.id}
            onChange={(value) =>
              updateField(
                "id",
                value
              )
            }
            placeholder="jeevamrut"
            required
          />

          <Input
            label="Slug"
            value={form.slug}
            onChange={(value) =>
              updateField(
                "slug",
                value
              )
            }
            placeholder="jeevamrut"
            required
          />

          <Input
            label="Title"
            value={form.title}
            onChange={(value) =>
              updateField(
                "title",
                value
              )
            }
            placeholder="जीवामृत"
            required
          />

          <Input
            label="English Title"
            value={form.titleEn}
            onChange={(value) =>
              updateField(
                "titleEn",
                value
              )
            }
            placeholder="Jeevamrut"
          />

          <Input
            label="Type"
            value={form.type}
            onChange={(value) =>
              updateField(
                "type",
                value
              )
            }
            placeholder="प्राकृतिक तरल खाद"
            required
          />

          <Select
            label="Category"
            value={form.category}
            onChange={
              handleCategoryChange
            }
            options={
              categories.length
                ? categories.map(
                    (item) => ({
                      value:
                        item.slug,
                      label:
                        item.name,
                    })
                  )
                : []
            }
            disabled={!categories.length}
          />

          <Input
            label="Target"
            value={form.target}
            onChange={(value) =>
              updateField(
                "target",
                value
              )
            }
            placeholder="मृदा स्वास्थ्य, सूक्ष्मजीव वृद्धि..."
            required
          />

          <Input
            label="Shelf Life"
            value={form.shelfLife}
            onChange={(value) =>
              updateField(
                "shelfLife",
                value
              )
            }
            placeholder="10–12 दिन"
          />
        </div>
      </Section>

      {/* COST & APPLICATION */}

      <Section
        title="Cost & Application"
        description="लागत और base quantity"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label="Minimum Cost"
            type="number"
            value={form.costMin}
            onChange={(value) =>
              updateField(
                "costMin",
                value
              )
            }
          />

          <Input
            label="Maximum Cost"
            type="number"
            value={form.costMax}
            onChange={(value) =>
              updateField(
                "costMax",
                value
              )
            }
          />

          <Input
            label="Base Area"
            type="number"
            value={form.baseArea}
            onChange={(value) =>
              updateField(
                "baseArea",
                value
              )
            }
          />

          <Select
            label="Area Unit"
            value={form.baseAreaUnit}
            onChange={(value) =>
              updateField(
                "baseAreaUnit",
                value
              )
            }
            options={AREA_OPTIONS}
          />

          <Input
            label="Base Water"
            type="number"
            value={form.baseWater}
            onChange={(value) =>
              updateField(
                "baseWater",
                value
              )
            }
          />

          <Input
            label="Water Unit"
            value={form.baseWaterUnit}
            onChange={(value) =>
              updateField(
                "baseWaterUnit",
                value
              )
            }
          />
        </div>
      </Section>

      {/* INGREDIENTS */}

      <Section
        title="Ingredients"
        description="सामग्री की मात्रा और unit"
      >
        <div className="space-y-3">
          {form.baseIngredients.map(
            (ingredient, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border bg-gray-50 p-3 md:grid-cols-[1fr_160px_180px_auto]"
              >
                <Input
                  label={
                    index === 0
                      ? "Ingredient"
                      : ""
                  }
                  value={
                    ingredient.name
                  }
                  onChange={(value) =>
                    updateIngredient(
                      index,
                      "name",
                      value
                    )
                  }
                  placeholder="देसी गाय का ताजा गोबर"
                />

                <Input
                  label={
                    index === 0
                      ? "Amount"
                      : ""
                  }
                  type="number"
                  value={
                    ingredient.amount
                  }
                  onChange={(value) =>
                    updateIngredient(
                      index,
                      "amount",
                      value
                    )
                  }
                />

                <Select
                  label={
                    index === 0
                      ? "Unit"
                      : ""
                  }
                  value={
                    ingredient.unit
                  }
                  onChange={(value) =>
                    updateIngredient(
                      index,
                      "unit",
                      value
                    )
                  }
                  options={UNIT_OPTIONS.map(
                    (unit) => ({
                      value: unit,
                      label: unit,
                    })
                  )}
                />

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() =>
                      removeIngredient(
                        index
                      )
                    }
                    disabled={
                      form
                        .baseIngredients
                        .length === 1
                    }
                    className="rounded-lg border border-red-200 p-2.5 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            )
          )}

          <button
            type="button"
            onClick={addIngredient}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            <Plus size={17} />
            Add Ingredient
          </button>
        </div>
      </Section>

      {/* PROCESS */}

      <Section
        title="Process Steps"
        description="Recipe बनाने की step-by-step प्रक्रिया"
      >
        <div className="space-y-3">
          {form.processSteps.map(
            (step, index) => (
              <div
                key={index}
                className="flex gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 font-semibold text-green-700">
                  {index + 1}
                </div>

                <textarea
                  value={step}
                  onChange={(e) =>
                    updateStep(
                      index,
                      e.target.value
                    )
                  }
                  rows={2}
                  placeholder={`Step ${
                    index + 1
                  }`}
                  className="flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-green-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeStep(index)
                  }
                  disabled={
                    form.processSteps
                      .length === 1
                  }
                  className="h-10 rounded-lg border border-red-200 p-2.5 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )
          )}

          <button
            type="button"
            onClick={addStep}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
          >
            <Plus size={17} />
            Add Step
          </button>
        </div>
      </Section>

      {/* USAGE */}

      <Section
        title="Usage & Precautions"
        description="किसान के लिए उपयोग एवं सावधानियां"
      >
        <div className="space-y-4">
          <Textarea
            label="Usage"
            value={form.usage}
            onChange={(value) =>
              updateField(
                "usage",
                value
              )
            }
            placeholder="इस recipe का उपयोग कैसे करें..."
          />

          <Textarea
            label="Precautions"
            value={
              form.precautions
            }
            onChange={(value) =>
              updateField(
                "precautions",
                value
              )
            }
            placeholder="उपयोग के दौरान सावधानियां..."
          />
        </div>
      </Section>

      {/* CONTENT */}

      <Section
        title="Content"
        description="Short description और image"
      >
        <div className="space-y-4">
          <Textarea
            label="Short Description"
            value={
              form.shortDescription
            }
            onChange={(value) =>
              updateField(
                "shortDescription",
                value
              )
            }
            placeholder="Recipe का छोटा description..."
          />

          <Input
            label="Cover Image URL"
            value={form.coverImage}
            onChange={(value) =>
              updateField(
                "coverImage",
                value
              )
            }
            placeholder="/images/organic/jeevamrut.jpg"
          />
        </div>
      </Section>

      {/* SEO */}

      <Section
        title="SEO"
        description="Search engine optimization"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Meta Title"
            value={
              form.seo.metaTitle
            }
            onChange={(value) =>
              updateSeo(
                "metaTitle",
                value
              )
            }
            placeholder="जीवामृत बनाने की विधि | Krishi Mitra"
          />

          <Input
            label="Focus Keyword"
            value={
              form.seo.focusKeyword
            }
            onChange={(value) =>
              updateSeo(
                "focusKeyword",
                value
              )
            }
            placeholder="जीवामृत बनाने की विधि"
          />

          <div className="md:col-span-2">
            <Textarea
              label="Meta Description"
              value={
                form.seo
                  .metaDescription
              }
              onChange={(value) =>
                updateSeo(
                  "metaDescription",
                  value
                )
              }
              placeholder="जीवामृत बनाने की विधि, सामग्री, उपयोग और सावधानियों की जानकारी..."
            />
          </div>

          <Input
            label="Canonical URL"
            value={
              form.seo.canonicalUrl
            }
            onChange={(value) =>
              updateSeo(
                "canonicalUrl",
                value
              )
            }
            placeholder="https://example.com/organic/jeevamrut"
          />

          <Input
            label="OG Image"
            value={
              form.seo.ogImage
            }
            onChange={(value) =>
              updateSeo(
                "ogImage",
                value
              )
            }
            placeholder="https://..."
          />

          <Input
            label="OG Title"
            value={
              form.seo.ogTitle
            }
            onChange={(value) =>
              updateSeo(
                "ogTitle",
                value
              )
            }
          />

          <Input
            label="Twitter Title"
            value={
              form.seo.twitterTitle
            }
            onChange={(value) =>
              updateSeo(
                "twitterTitle",
                value
              )
            }
          />

          <div className="md:col-span-2">
            <Textarea
              label="OG Description"
              value={
                form.seo.ogDescription
              }
              onChange={(value) =>
                updateSeo(
                  "ogDescription",
                  value
                )
              }
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Twitter Description"
              value={
                form.seo
                  .twitterDescription
              }
              onChange={(value) =>
                updateSeo(
                  "twitterDescription",
                  value
                )
              }
            />
          </div>

          <Input
            label="Twitter Image"
            value={
              form.seo.twitterImage
            }
            onChange={(value) =>
              updateSeo(
                "twitterImage",
                value
              )
            }
          />

          <Input
            label="Keywords"
            value={
              form.seo.keywords.join(
                ", "
              )
            }
            onChange={(value) =>
              updateSeo(
                "keywords",
                value
                  .split(",")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean)
              )
            }
            placeholder="जीवामृत, जैविक खाद, प्राकृतिक खेती"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-6 border-t pt-5">
          <Checkbox
            label="Allow Index"
            checked={
              form.seo.allowIndex
            }
            onChange={(value) =>
              updateSeo(
                "allowIndex",
                value
              )
            }
          />

          <Checkbox
            label="Allow Follow"
            checked={
              form.seo.allowFollow
            }
            onChange={(value) =>
              updateSeo(
                "allowFollow",
                value
              )
            }
          />
        </div>
      </Section>

      {/* PUBLISHING */}

      <Section
        title="Publishing"
        description="Status और visibility"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Select
            label="Status"
            value={form.status}
            onChange={(value) =>
              updateField(
                "status",
                value
              )
            }
            options={
              STATUS_OPTIONS
            }
          />

          <Input
            label="Published At"
            type="datetime-local"
            value={
              form.publishedAt
            }
            onChange={(value) =>
              updateField(
                "publishedAt",
                value
              )
            }
          />

          <Input
            label="Updated Content At"
            type="datetime-local"
            value={
              form.updatedAtContent
            }
            onChange={(value) =>
              updateField(
                "updatedAtContent",
                value
              )
            }
          />
        </div>

        <div className="mt-5">
          <Checkbox
            label="Featured Recipe"
            checked={
              form.featured
            }
            onChange={(value) =>
              updateField(
                "featured",
                value
              )
            }
          />
        </div>
      </Section>

      {/* BOTTOM SAVE */}

      <div className="flex justify-end gap-3 border-t pt-4">
        <Link
          href="/admin/organic"
          className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Save size={17} />
          )}

          Save Recipe
        </button>
      </div>
    </form>
  );
}

/* =========================
   UI COMPONENTS
========================= */

function Section({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="font-semibold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
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

function Checkbox({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
      />

      {label}
    </label>
  );
}