"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const initialForm = {
  slug: "",
  name: "",
  englishName: "",
  scientificName: "",
  icon: "🌱",

  category: {
    key: "",
    label: "",
  },

  season: {
    key: "",
    label: "",
  },

  cropType: {
    key: "",
    label: "",
  },

  description: "",
  idealSoil: "",
  duration: "",
  durationDays: "",
  sowing: "",
  seedRate: "",

  water: {
    key: "",
    label: "",
  },

  regions: [],
  regionLabel: "",

  overview: "",

  author: "कृषि मित्र टीम",
  publishedAt: "",
  updatedAtContent: "",
  readTime: "",

  varieties: [],

  soilRequirement: "",
  sowingTime: "",
  waterRequirement: "",
  harvestingTime: "",
  topDemandMandi: "",

  diseases: [],

  tags: [],

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
};

const categories = [
  {
    key: "grain",
    label: "अनाज",
  },
  {
    key: "oilseed",
    label: "तिलहन",
  },
  {
    key: "spice",
    label: "मसाला",
  },
  {
    key: "pulse",
    label: "दलहन",
  },
];

const seasons = [
  {
    key: "kharif",
    label: "खरीफ",
  },
  {
    key: "rabi",
    label: "रबी",
  },
  {
    key: "zaid",
    label: "जायद",
  },
];

const cropTypes = [
  {
    key: "commercial",
    label: "व्यावसायिक",
  },
  {
    key: "food",
    label: "खाद्य फसल",
  },
  {
    key: "fodder",
    label: "चारा",
  },
];

const waterOptions = [
  {
    key: "low",
    label: "कम पानी",
  },
  {
    key: "medium",
    label: "मध्यम पानी",
  },
  {
    key: "high",
    label: "अधिक पानी",
  },
  {
    key: "rainfed",
    label: "वर्षा आधारित",
  },
];

export default function CropForm({
  mode = "add",
  cropId,
}) {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(
    mode === "edit"
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // ---------------------------------------
  // LOAD CROP
  // ---------------------------------------

  useEffect(() => {
    if (mode !== "edit" || !cropId) return;

    const loadCrop = async () => {
      try {
        const response = await fetch(
          `${API_URL}/crops/${cropId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Crop not found"
          );
        }

        const crop = result.data;

        setForm({
          ...initialForm,
          ...crop,

          category: {
            ...initialForm.category,
            ...(crop.category || {}),
          },

          season: {
            ...initialForm.season,
            ...(crop.season || {}),
          },

          cropType: {
            ...initialForm.cropType,
            ...(crop.cropType || {}),
          },

          water: {
            ...initialForm.water,
            ...(crop.water || {}),
          },

          seo: {
            ...initialForm.seo,
            ...(crop.seo || {}),
          },

          varieties: crop.varieties || [],

          diseases: crop.diseases || [],

          regions: crop.regions || [],

          tags: crop.tags || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCrop();
  }, [mode, cropId]);

  // ---------------------------------------
  // BASIC FIELD
  // ---------------------------------------

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (
    parent,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // ---------------------------------------
  // SELECT
  // ---------------------------------------

  const handleCategory = (value) => {
    const selected = categories.find(
      (item) => item.key === value
    );

    updateField(
      "category",
      selected || {
        key: "",
        label: "",
      }
    );
  };

  const handleSeason = (value) => {
    const selected = seasons.find(
      (item) => item.key === value
    );

    updateField(
      "season",
      selected || {
        key: "",
        label: "",
      }
    );
  };

  const handleCropType = (value) => {
    const selected = cropTypes.find(
      (item) => item.key === value
    );

    updateField(
      "cropType",
      selected || {
        key: "",
        label: "",
      }
    );
  };

  const handleWater = (value) => {
    const selected = waterOptions.find(
      (item) => item.key === value
    );

    updateField(
      "water",
      selected || {
        key: "",
        label: "",
      }
    );
  };

  // ---------------------------------------
  // ARRAY HELPERS
  // ---------------------------------------

  const addRegion = () => {
    setForm((prev) => ({
      ...prev,
      regions: [...prev.regions, ""],
    }));
  };

  const updateRegion = (index, value) => {
    setForm((prev) => ({
      ...prev,
      regions: prev.regions.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const removeRegion = (index) => {
    setForm((prev) => ({
      ...prev,
      regions: prev.regions.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addTag = () => {
    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const updateTag = (index, value) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  const removeTag = (index) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ---------------------------------------
  // VARIETIES
  // ---------------------------------------

  const addVariety = () => {
    setForm((prev) => ({
      ...prev,
      varieties: [
        ...prev.varieties,
        {
          name: "",
          yield: "",
          feature: "",
        },
      ],
    }));
  };

  const updateVariety = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      varieties: prev.varieties.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const removeVariety = (index) => {
    setForm((prev) => ({
      ...prev,
      varieties: prev.varieties.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ---------------------------------------
  // DISEASES
  // ---------------------------------------

  const addDisease = () => {
    setForm((prev) => ({
      ...prev,
      diseases: [
        ...prev.diseases,
        {
          name: "",
          symptoms: "",
          solution: "",
        },
      ],
    }));
  };

  const updateDisease = (
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      diseases: prev.diseases.map(
        (item, i) =>
          i === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  const removeDisease = (index) => {
    setForm((prev) => ({
      ...prev,
      diseases: prev.diseases.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        ...form,

        durationDays:
          form.durationDays === ""
            ? undefined
            : Number(form.durationDays),

        regions: form.regions.filter(
          Boolean
        ),

        tags: form.tags.filter(Boolean),

        publishedAt:
          form.publishedAt || undefined,

        updatedAtContent:
          new Date().toISOString(),
      };

      const url =
        mode === "edit"
          ? `${API_URL}/crops/${cropId}`
          : `${API_URL}/crops`;

      const method =
        mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors?.length) {
          throw new Error(
            result.errors
              .map(
                (item) =>
                  `${item.field}: ${item.message}`
              )
              .join("\n")
          );
        }

        throw new Error(
          result.message || "Something went wrong"
        );
      }

      setSuccess(
        mode === "edit"
          ? "Crop updated successfully."
          : "Crop created successfully."
      );

      setTimeout(() => {
        router.push("/admin/crops");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading crop...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>
        <h1 className="text-2xl font-bold">
          {mode === "edit"
            ? "Edit Crop"
            : "Add Crop"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Complete crop information और SEO
          details manage करें।
        </p>
      </div>

      {/* ================================= */}
      {/* ALERTS */}
      {/* ================================= */}

      {error && (
        <div className="whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ================================= */}
      {/* BASIC INFORMATION */}
      {/* ================================= */}

      <Section title="Basic Information">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Crop Name *"
            value={form.name}
            onChange={(e) =>
              updateField("name", e.target.value)
            }
            placeholder="लहसुन"
          />

          <Input
            label="English Name *"
            value={form.englishName}
            onChange={(e) =>
              updateField(
                "englishName",
                e.target.value
              )
            }
            placeholder="Garlic"
          />

          <Input
            label="Scientific Name"
            value={form.scientificName}
            onChange={(e) =>
              updateField(
                "scientificName",
                e.target.value
              )
            }
            placeholder="Allium sativum"
          />

          <Input
            label="Icon / Emoji"
            value={form.icon}
            onChange={(e) =>
              updateField(
                "icon",
                e.target.value
              )
            }
            placeholder="🧄"
          />

          <div className="md:col-span-2">
            <Input
              label="SEO Slug *"
              value={form.slug}
              onChange={(e) =>
                updateField(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                )
              }
              placeholder="garlic"
            />

            <p className="mt-1 text-xs text-gray-500">
              Example: /crops/garlic
            </p>
          </div>
        </div>
      </Section>

      {/* ================================= */}
      {/* CLASSIFICATION */}
      {/* ================================= */}

      <Section title="Classification">
        <div className="grid gap-5 md:grid-cols-3">
          <Select
            label="Category *"
            value={form.category.key}
            options={categories}
            onChange={(e) =>
              handleCategory(e.target.value)
            }
          />

          <Select
            label="Season *"
            value={form.season.key}
            options={seasons}
            onChange={(e) =>
              handleSeason(e.target.value)
            }
          />

          <Select
            label="Crop Type"
            value={form.cropType.key}
            options={cropTypes}
            onChange={(e) =>
              handleCropType(e.target.value)
            }
          />
        </div>
      </Section>

      {/* ================================= */}
      {/* BASIC DETAILS */}
      {/* ================================= */}

      <Section title="Crop Details">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Duration"
            value={form.duration}
            onChange={(e) =>
              updateField(
                "duration",
                e.target.value
              )
            }
            placeholder="130-150 दिन"
          />

          <Input
            label="Duration Days"
            type="number"
            value={form.durationDays}
            onChange={(e) =>
              updateField(
                "durationDays",
                e.target.value
              )
            }
            placeholder="140"
          />

          <Input
            label="Sowing"
            value={form.sowing}
            onChange={(e) =>
              updateField(
                "sowing",
                e.target.value
              )
            }
            placeholder="15 अक्टूबर - 15 नवंबर"
          />

          <Input
            label="Seed Rate"
            value={form.seedRate}
            onChange={(e) =>
              updateField(
                "seedRate",
                e.target.value
              )
            }
            placeholder="500-600 किग्रा/हेक्टेयर"
          />

          <Select
            label="Water Requirement"
            value={form.water.key}
            options={waterOptions}
            onChange={(e) =>
              handleWater(e.target.value)
            }
          />

          <Input
            label="Region Label"
            value={form.regionLabel}
            onChange={(e) =>
              updateField(
                "regionLabel",
                e.target.value
              )
            }
            placeholder="नीमच • मंदसौर • मालवा"
          />

          <div className="md:col-span-2">
            <Textarea
              label="Description *"
              value={form.description}
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              rows={4}
              placeholder="Crop का short description..."
            />
          </div>

          <div className="md:col-span-2">
            <Textarea
              label="Ideal Soil"
              value={form.idealSoil}
              onChange={(e) =>
                updateField(
                  "idealSoil",
                  e.target.value
                )
              }
              rows={3}
            />
          </div>
        </div>
      </Section>

      {/* ================================= */}
      {/* REGIONS */}
      {/* ================================= */}

      <Section
        title="Regions"
        action={
          <Button
            type="button"
            onClick={addRegion}
          >
            + Add Region
          </Button>
        }
      >
        <div className="space-y-3">
          {form.regions.map(
            (region, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <Input
                  value={region}
                  onChange={(e) =>
                    updateRegion(
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Neemuch"
                />

                <Button
                  type="button"
                  danger
                  onClick={() =>
                    removeRegion(index)
                  }
                >
                  Remove
                </Button>
              </div>
            )
          )}
        </div>
      </Section>

      {/* ================================= */}
      {/* DETAILED INFORMATION */}
      {/* ================================= */}

      <Section title="Detailed Crop Information">
        <div className="space-y-5">
          <Textarea
            label="Overview"
            value={form.overview}
            onChange={(e) =>
              updateField(
                "overview",
                e.target.value
              )
            }
            rows={5}
          />

          <div className="grid gap-5 md:grid-cols-3">
            <Input
              label="Author"
              value={form.author}
              onChange={(e) =>
                updateField(
                  "author",
                  e.target.value
                )
              }
            />

            <Input
              label="Read Time"
              value={form.readTime}
              onChange={(e) =>
                updateField(
                  "readTime",
                  e.target.value
                )
              }
              placeholder="8 मिनट"
            />

            <Input
              label="Published Date"
              type="date"
              value={form.publishedAt}
              onChange={(e) =>
                updateField(
                  "publishedAt",
                  e.target.value
                )
              }
            />
          </div>

          <Textarea
            label="Soil Requirement"
            value={form.soilRequirement}
            onChange={(e) =>
              updateField(
                "soilRequirement",
                e.target.value
              )
            }
            rows={3}
          />

          <Textarea
            label="Sowing Time"
            value={form.sowingTime}
            onChange={(e) =>
              updateField(
                "sowingTime",
                e.target.value
              )
            }
            rows={3}
          />

          <Textarea
            label="Water Requirement"
            value={form.waterRequirement}
            onChange={(e) =>
              updateField(
                "waterRequirement",
                e.target.value
              )
            }
            rows={3}
          />

          <Textarea
            label="Harvesting Time"
            value={form.harvestingTime}
            onChange={(e) =>
              updateField(
                "harvestingTime",
                e.target.value
              )
            }
            rows={3}
          />

          <Input
            label="Top Demand Mandi"
            value={form.topDemandMandi}
            onChange={(e) =>
              updateField(
                "topDemandMandi",
                e.target.value
              )
            }
            placeholder="नीमच, मंदसौर, पिपलिया मंडी"
          />
        </div>
      </Section>

      {/* ================================= */}
      {/* VARIETIES */}
      {/* ================================= */}

      <Section
        title="Varieties"
        action={
          <Button
            type="button"
            onClick={addVariety}
          >
            + Add Variety
          </Button>
        }
      >
        <div className="space-y-5">
          {form.varieties.map(
            (variety, index) => (
              <div
                key={index}
                className="rounded-xl border bg-gray-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    label="Variety Name"
                    value={variety.name}
                    onChange={(e) =>
                      updateVariety(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="G-2"
                  />

                  <Input
                    label="Yield"
                    value={variety.yield}
                    onChange={(e) =>
                      updateVariety(
                        index,
                        "yield",
                        e.target.value
                      )
                    }
                    placeholder="100-120 क्विंटल/हेक्टेयर"
                  />

                  <Input
                    label="Feature"
                    value={variety.feature}
                    onChange={(e) =>
                      updateVariety(
                        index,
                        "feature",
                        e.target.value
                      )
                    }
                    placeholder="मुख्य विशेषता"
                  />
                </div>

                <Button
                  type="button"
                  danger
                  onClick={() =>
                    removeVariety(index)
                  }
                  className="mt-4"
                >
                  Remove Variety
                </Button>
              </div>
            )
          )}
        </div>
      </Section>

      {/* ================================= */}
      {/* DISEASES */}
      {/* ================================= */}

      <Section
        title="Diseases / Pests"
        action={
          <Button
            type="button"
            onClick={addDisease}
          >
            + Add Disease
          </Button>
        }
      >
        <div className="space-y-5">
          {form.diseases.map(
            (disease, index) => (
              <div
                key={index}
                className="rounded-xl border bg-gray-50 p-4"
              >
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={disease.name}
                    onChange={(e) =>
                      updateDisease(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <Textarea
                    label="Symptoms"
                    value={disease.symptoms}
                    onChange={(e) =>
                      updateDisease(
                        index,
                        "symptoms",
                        e.target.value
                      )
                    }
                    rows={3}
                  />

                  <Textarea
                    label="Solution"
                    value={disease.solution}
                    onChange={(e) =>
                      updateDisease(
                        index,
                        "solution",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>

                <Button
                  type="button"
                  danger
                  onClick={() =>
                    removeDisease(index)
                  }
                  className="mt-4"
                >
                  Remove Disease
                </Button>
              </div>
            )
          )}
        </div>
      </Section>

      {/* ================================= */}
      {/* TAGS */}
      {/* ================================= */}

      <Section
        title="Tags"
        action={
          <Button
            type="button"
            onClick={addTag}
          >
            + Add Tag
          </Button>
        }
      >
        <div className="space-y-3">
          {form.tags.map((tag, index) => (
            <div
              key={index}
              className="flex gap-2"
            >
              <Input
                value={tag}
                onChange={(e) =>
                  updateTag(
                    index,
                    e.target.value
                  )
                }
                placeholder="लहसुन"
              />

              <Button
                type="button"
                danger
                onClick={() =>
                  removeTag(index)
                }
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* ================================= */}
      {/* SEO */}
      {/* ================================= */}

      <Section title="SEO Settings">
        <div className="space-y-5">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-900">
              SEO Preview
            </h3>

            <p className="mt-2 text-sm text-blue-800">
              यह information Google search result,
              social sharing और structured metadata
              के लिए उपयोग होगी।
            </p>
          </div>

          <Input
            label="Meta Title"
            value={form.seo.metaTitle}
            onChange={(e) =>
              updateNestedField(
                "seo",
                "metaTitle",
                e.target.value
              )
            }
            placeholder="लहसुन की खेती | पूरी जानकारी"
          />

          <div className="text-xs text-gray-500">
            {form.seo.metaTitle.length}/70
          </div>

          <Textarea
            label="Meta Description"
            value={form.seo.metaDescription}
            onChange={(e) =>
              updateNestedField(
                "seo",
                "metaDescription",
                e.target.value
              )
            }
            rows={4}
            placeholder="लहसुन की खेती..."
          />

          <div className="text-xs text-gray-500">
            {form.seo.metaDescription.length}/160
          </div>

          <Input
            label="Focus Keyword"
            value={form.seo.focusKeyword}
            onChange={(e) =>
              updateNestedField(
                "seo",
                "focusKeyword",
                e.target.value
              )
            }
            placeholder="लहसुन की खेती"
          />

          <Input
            label="Canonical URL"
            value={form.seo.canonicalUrl}
            onChange={(e) =>
              updateNestedField(
                "seo",
                "canonicalUrl",
                e.target.value
              )
            }
            placeholder="https://example.com/crops/garlic"
          />

          <Input
            label="SEO Keywords"
            value={form.seo.keywords.join(", ")}
            onChange={(e) =>
              updateNestedField(
                "seo",
                "keywords",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
            placeholder="लहसुन की खेती, लहसुन, garlic farming"
          />

          <div className="border-t pt-5">
            <h3 className="mb-4 font-semibold">
              Open Graph
            </h3>

            <div className="space-y-4">
              <Input
                label="OG Title"
                value={form.seo.ogTitle}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "ogTitle",
                    e.target.value
                  )
                }
              />

              <Textarea
                label="OG Description"
                value={form.seo.ogDescription}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "ogDescription",
                    e.target.value
                  )
                }
                rows={3}
              />

              <Input
                label="OG Image URL"
                value={form.seo.ogImage}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "ogImage",
                    e.target.value
                  )
                }
                placeholder="/images/crops/garlic.jpg"
              />
            </div>
          </div>

          <div className="border-t pt-5">
            <h3 className="mb-4 font-semibold">
              Twitter
            </h3>

            <div className="space-y-4">
              <Input
                label="Twitter Title"
                value={form.seo.twitterTitle}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "twitterTitle",
                    e.target.value
                  )
                }
              />

              <Textarea
                label="Twitter Description"
                value={
                  form.seo.twitterDescription
                }
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "twitterDescription",
                    e.target.value
                  )
                }
                rows={3}
              />

              <Input
                label="Twitter Image URL"
                value={form.seo.twitterImage}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "twitterImage",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-t pt-5">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.seo.allowIndex}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "allowIndex",
                    e.target.checked
                  )
                }
              />

              <span className="text-sm">
                Allow Search Engine Indexing
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.seo.allowFollow}
                onChange={(e) =>
                  updateNestedField(
                    "seo",
                    "allowFollow",
                    e.target.checked
                  )
                }
              />

              <span className="text-sm">
                Allow Search Engine Follow
              </span>
            </label>
          </div>
        </div>
      </Section>

      {/* ================================= */}
      {/* PUBLISHING */}
      {/* ================================= */}

      <Section title="Publishing">
        <div className="grid gap-5 md:grid-cols-2">
          <Select
            label="Status"
            value={form.status}
            options={[
              {
                key: "draft",
                label: "Draft",
              },
              {
                key: "published",
                label: "Published",
              },
              {
                key: "archived",
                label: "Archived",
              },
            ]}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value
              )
            }
          />

          <label className="flex items-center gap-3 rounded-lg border p-4">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                updateField(
                  "featured",
                  e.target.checked
                )
              }
            />

            <div>
              <div className="font-medium">
                Featured Crop
              </div>

              <div className="text-xs text-gray-500">
                Public website पर featured section
                में दिखाएं।
              </div>
            </div>
          </label>
        </div>
      </Section>

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="flex flex-wrap gap-3 border-t pt-6">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : mode === "edit"
            ? "Update Crop"
            : "Create Crop"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/crops")
          }
          className="rounded-lg border px-6 py-3 font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// =======================================
// UI COMPONENTS
// =======================================

function Section({
  title,
  children,
  action,
}) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {action}
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
  placeholder = "",
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder = "",
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <textarea
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options = [],
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <select
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      >
        <option value="">
          Select...
        </option>

        {options.map((option) => (
          <option
            key={option.key}
            value={option.key}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Button({
  children,
  type = "button",
  onClick,
  danger = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-gray-300 text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}