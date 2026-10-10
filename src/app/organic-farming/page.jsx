'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Leaf,
  Calculator,
  Sparkles,
  Filter,
  ChevronDown,
  ChevronUp,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Search,
  Heart,
  Copy,
  Check,
  Droplets,
  Scale,
  FileDown,
  X,
  ShieldCheck,
  IndianRupee,
  FlaskConical,
  BookOpen,
} from 'lucide-react';
import { publicApiRequest, unwrapApiList } from '@/lib/publicApi';

/* =========================================================
   HELPERS
========================================================= */

const UNIT_OPTIONS = [
  {
    value: 'acre',
    label: 'एकड़',
    short: 'Acre',
  },
  {
    value: 'hectare',
    label: 'हेक्टेयर',
    short: 'Hectare',
  },
  {
    value: 'bigha',
    label: 'बीघा',
    short: 'Bigha',
  },
];

/*
  Important:
  Bigha differs by region.
  Here default is configurable.
  Change BIGHA_IN_ACRE according to local measurement.
*/

const BIGHA_IN_ACRE = 0.625;

const convertToAcres = (value, unit) => {
  const number = Number(value) || 0;

  if (unit === 'acre') {
    return number;
  }

  if (unit === 'hectare') {
    return number * 2.47105;
  }

  if (unit === 'bigha') {
    return number * BIGHA_IN_ACRE;
  }

  return number;
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Number(value).toLocaleString('hi-IN', {
    maximumFractionDigits: 2,
  });
};

const formatAmount = (amount, unit) => {
  const value = Number(amount) || 0;

  if (unit === 'ग्राम' && value >= 1000) {
    return `${formatNumber(value / 1000)} किग्रा`;
  }

  if (unit === 'मिलीलीटर' && value >= 1000) {
    return `${formatNumber(value / 1000)} लीटर`;
  }

  return `${formatNumber(value)} ${unit}`;
};

const getCategoryLabel = (category, categories) => {
  return categories.find((item) => item.value === category)?.label || category;
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function OrganicFarmingPage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [landArea, setLandArea] = useState(1);
  const [landUnit, setLandUnit] = useState('acre');

  const [filterCategory, setFilterCategory] =
    useState('all');

  const [searchTerm, setSearchTerm] =
    useState('');

  const [expandedCard, setExpandedCard] =
    useState(null);

  const [savedRecipes, setSavedRecipes] =
    useState([]);

  const [selectedRecipeId, setSelectedRecipeId] =
    useState(null);

  const [copiedRecipe, setCopiedRecipe] =
    useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      publicApiRequest('/organic-recipes?status=active&limit=100'),
      publicApiRequest('/organic-categories?status=active'),
    ])
      .then(([recipeResult, categoryResult]) => {
        if (cancelled) return;

        const nextCategories = unwrapApiList(categoryResult).map((category) => ({
          value: category.slug || category._id || category.id,
          slug: category.slug,
          id: category._id || category.id,
          label: category.name || category.label || '',
        }));
        const nextRecipes = unwrapApiList(recipeResult, [
          'recipes',
          'organicRecipes',
        ]).map((recipe) => {
          const categoryReference =
            recipe.categorySlug ||
            recipe.category?.slug ||
            recipe.category?.key ||
            recipe.categoryId?.slug ||
            recipe.categoryId?._id ||
            recipe.categoryId ||
            (typeof recipe.category === 'string'
              ? recipe.category
              : recipe.category?._id) ||
            '';
          const categoryMatch = nextCategories.find(
            (category) =>
              category.value === categoryReference ||
              category.id === categoryReference ||
              category.slug === categoryReference
          );

          return {
            ...recipe,
            id: recipe._id || recipe.id || recipe.slug,
            title: recipe.title || recipe.name || '',
            type:
              recipe.type ||
              recipe.category?.name ||
              recipe.categoryName ||
              categoryMatch?.label ||
              '',
            category: categoryMatch?.value || categoryReference,
            target: recipe.target || '',
            shelfLife: recipe.shelfLife || '',
            costMin: Number(recipe.costMin) || 0,
            costMax: Number(recipe.costMax) || 0,
            baseArea: Number(recipe.baseArea) || 1,
            baseAreaUnit: recipe.baseAreaUnit || 'acre',
            baseWater: Number(recipe.baseWater) || 0,
            baseIngredients: Array.isArray(recipe.baseIngredients)
              ? recipe.baseIngredients
              : [],
            processSteps: Array.isArray(recipe.processSteps)
              ? recipe.processSteps
              : [],
            usage: recipe.usage || '',
            precautions: recipe.precautions || '',
          };
        });

        setRecipes(nextRecipes);
        setCategories(nextCategories);
        const requestedCategory = new URLSearchParams(
          window.location.search,
        ).get('category');
        if (requestedCategory) setSelectedCategory(requestedCategory);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error.message || 'जैविक खेती की जानकारी लोड नहीं हो सकी।');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    if (categories.length) {
      return [{ value: 'all', label: 'सभी' }, ...categories];
    }

    const recipeCategories = new Map();
    recipes.forEach((recipe) => {
      if (recipe.category) {
        recipeCategories.set(recipe.category, {
          value: recipe.category,
          label: recipe.type || recipe.category,
        });
      }
    });

    return [
      { value: 'all', label: 'सभी' },
      ...Array.from(recipeCategories.values()),
    ];
  }, [categories, recipes]);

  /*
  |--------------------------------------------------------------------------
  | Convert selected land into acre
  |--------------------------------------------------------------------------
  */

  const areaInAcres = useMemo(() => {
    return convertToAcres(
      landArea,
      landUnit
    );
  }, [landArea, landUnit]);

  /*
  |--------------------------------------------------------------------------
  | Filter recipes
  |--------------------------------------------------------------------------
  */

  const filteredRecipes = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return recipes.filter(
      (recipe) => {
        const categoryMatch =
          filterCategory === 'all' ||
          recipe.category ===
            filterCategory;

        const searchMatch =
          !search ||
          recipe.title
            .toLowerCase()
            .includes(search) ||
          recipe.type
            .toLowerCase()
            .includes(search) ||
          recipe.target
            .toLowerCase()
            .includes(search);

        return (
          categoryMatch &&
          searchMatch
        );
      }
    );
  }, [
    filterCategory,
    searchTerm,
    recipes,
  ]);

  const getRecipeScale = (recipe) =>
    areaInAcres /
    convertToAcres(recipe.baseArea, recipe.baseAreaUnit);

  /*
  |--------------------------------------------------------------------------
  | Total cost
  |--------------------------------------------------------------------------
  */

  const totalCost = useMemo(() => {
    return filteredRecipes.reduce(
      (total, recipe) => {
        return (
          total +
          recipe.costMin * getRecipeScale(recipe)
        );
      },
      0
    );
  }, [
    filteredRecipes,
    areaInAcres,
  ]);

  const totalMaxCost = useMemo(() => {
    return filteredRecipes.reduce(
      (total, recipe) => {
        return (
          total +
          recipe.costMax * getRecipeScale(recipe)
        );
      },
      0
    );
  }, [
    filteredRecipes,
    areaInAcres,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Toggle expand
  |--------------------------------------------------------------------------
  */

  const toggleExpand = (id) => {
    setExpandedCard(
      expandedCard === id
        ? null
        : id
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Save recipe
  |--------------------------------------------------------------------------
  */

  const toggleSave = (id) => {
    setSavedRecipes((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Copy recipe
  |--------------------------------------------------------------------------
  */

  const copyRecipe = async (
    recipe
  ) => {
    const lines = [];

    lines.push(recipe.title);
    lines.push(
      `क्षेत्रफल: ${formatNumber(
        areaInAcres
      )} एकड़`
    );
    lines.push(
      `पानी: ${formatNumber(
        recipe.baseWater * getRecipeScale(recipe)
      )} लीटर`
    );

    lines.push('');
    lines.push('आवश्यक सामग्री:');

    recipe.baseIngredients.forEach(
      (ingredient) => {
        lines.push(
          `• ${
            ingredient.name
          }: ${formatAmount(
            ingredient.amount * getRecipeScale(recipe),
            ingredient.unit
          )}`
        );
      }
    );

    lines.push('');
    lines.push('बनाने की विधि:');

    recipe.processSteps.forEach(
      (step, index) => {
        lines.push(
          `${index + 1}. ${step}`
        );
      }
    );

    lines.push('');
    lines.push(
      `उपयोग: ${recipe.usage}`
    );

    lines.push(
      `सावधानी: ${recipe.precautions}`
    );

    try {
      await navigator.clipboard.writeText(
        lines.join('\n')
      );

      setCopiedRecipe(
        recipe.id
      );

      setTimeout(() => {
        setCopiedRecipe(null);
      }, 2000);
    } catch (error) {
      console.error(
        'Copy failed:',
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Print / PDF
  |--------------------------------------------------------------------------
  */

  const handlePrint = () => {
    /*
      CSS below makes every recipe's full details visible
      in print mode, even when accordion is closed.
    */

    window.print();
  };

  /*
  |--------------------------------------------------------------------------
  | Quick land selection
  |--------------------------------------------------------------------------
  */

  const setQuickArea = (
    value,
    unit = 'acre'
  ) => {
    setLandArea(value);
    setLandUnit(unit);
  };

  /*
  |--------------------------------------------------------------------------
  | Selected recipe
  |--------------------------------------------------------------------------
  */

  const selectedRecipe =
    recipes.find(
      (recipe) =>
        recipe.id ===
        selectedRecipeId
    );

  return (
    <>
      {/* ======================================================
          PRINT STYLES
      ====================================================== */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body {
            background: white !important;
          }

          .print-hidden {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          .recipe-card {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #111827 !important;
            margin-bottom: 16px !important;
          }

          .recipe-full-details {
            display: block !important;
          }

          .recipe-toggle {
            display: none !important;
          }

          .print-page-break {
            page-break-before: always;
          }

          .print-no-shadow {
            box-shadow: none !important;
          }

          .print-white {
            background: white !important;
            color: black !important;
          }
        }

        .print-only {
          display: none;
        }
      `}</style>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loadError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </p>
        )}
        {loading && (
          <p role="status" className="text-center text-sm text-slate-500">
            जैविक खेती की जानकारी लोड हो रही है...
          </p>
        )}

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="bg-gradient-to-br from-emerald-900 via-teal-800 to-green-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

          <div className="relative">

            <div className="flex flex-col lg:flex-row justify-between gap-6">

              <div>

                <span className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full">

                  <Sparkles className="w-4 h-4" />

                  कृषि मित्र • जैविक खेती

                </span>

                <h1 className="text-2xl sm:text-4xl font-black mt-3">

                  जैविक खाद एवं प्राकृतिक खेती गाइड

                </h1>

                <p className="text-emerald-100 text-sm mt-2 max-w-3xl leading-relaxed">

                  अपनी जमीन के क्षेत्रफल के अनुसार
                  सामग्री की मात्रा, पानी, अनुमानित लागत
                  और पूरी विधि एक ही जगह देखें।

                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  onClick={handlePrint}
                  className="print-hidden inline-flex items-center gap-2 bg-white text-emerald-900 px-4 py-2.5 rounded-xl text-xs font-black hover:bg-emerald-50"
                >
                  <FileDown className="w-4 h-4" />
                  PDF / प्रिंट
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            CALCULATOR
        ==================================================== */}

        <section className="bg-white border border-emerald-200 rounded-3xl shadow-sm overflow-hidden">

          <div className="bg-emerald-50 p-5 sm:p-6 border-b border-emerald-100">

            <div className="flex flex-col md:flex-row justify-between gap-4">

              <div>

                <div className="flex items-center gap-2">

                  <div className="bg-emerald-700 text-white p-2 rounded-xl">
                    <Calculator className="w-5 h-5" />
                  </div>

                  <div>

                    <h2 className="font-black text-emerald-950">
                      किसान मात्रा कैलकुलेटर
                    </h2>

                    <p className="text-xs text-emerald-700 mt-0.5">
                      जमीन के अनुसार सभी मात्रा अपने आप बदलें
                    </p>

                  </div>

                </div>

              </div>

              <div className="bg-white border border-emerald-200 px-4 py-2 rounded-2xl">

                <p className="text-[10px] text-slate-500">
                  गणना के लिए क्षेत्रफल
                </p>

                <p className="font-black text-emerald-800">
                  {formatNumber(
                    areaInAcres
                  )}{' '}
                  एकड़
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

              {/* Area */}

              <div>

                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  जमीन का क्षेत्रफल
                </label>

                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={landArea}
                  onChange={(e) =>
                    setLandArea(
                      Math.max(
                        0.1,
                        Number(
                          e.target.value
                        ) || 0.1
                      )
                    )
                  }
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl bg-white font-black text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                />

              </div>

              {/* Unit */}

              <div>

                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  जमीन की इकाई
                </label>

                <select
                  value={landUnit}
                  onChange={(e) =>
                    setLandUnit(
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-emerald-200 rounded-xl bg-white font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                >

                  {UNIT_OPTIONS.map(
                    (unit) => (
                      <option
                        key={
                          unit.value
                        }
                        value={
                          unit.value
                        }
                      >
                        {unit.label}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Converted */}

              <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3">

                <p className="text-[10px] text-slate-500">
                  एकड़ में converted area
                </p>

                <p className="text-xl font-black text-emerald-800">
                  {formatNumber(
                    areaInAcres
                  )}{' '}
                  Acre
                </p>

              </div>

            </div>

            {/* Quick buttons */}

            <div className="flex flex-wrap gap-2 mt-4">

              <span className="text-xs font-bold text-slate-500 py-2">
                Quick:
              </span>

              {[0.5, 1, 2, 5, 10].map(
                (value) => (
                  <button
                    key={value}
                    onClick={() =>
                      setQuickArea(
                        value
                      )
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border transition ${
                      landUnit ===
                        'acre' &&
                      landArea ===
                        value
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {value} एकड़
                  </button>
                )
              )}

            </div>

            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex gap-2">

              <Info className="w-4 h-4 shrink-0 text-amber-600" />

              <span>
                <strong>बीघा ध्यान दें:</strong>{' '}
                बीघा का माप क्षेत्र के अनुसार बदलता
                है। यहां calculator में 1 बीघा =
                {BIGHA_IN_ACRE} एकड़ मानकर गणना की गई है।
                अपने स्थानीय राजस्व/कृषि माप के अनुसार
                इसे बदलें।
              </span>

            </div>

          </div>

          {/* Calculator summary */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5">

            <SummaryCard
              icon={<Scale />}
              label="कुल क्षेत्रफल"
              value={`${formatNumber(
                areaInAcres
              )} Acre`}
            />

            <SummaryCard
              icon={<Droplets />}
              label="कुल अनुमानित लागत"
              value={`₹${formatNumber(
                totalCost
              )} – ₹${formatNumber(
                totalMaxCost
              )}`}
            />

            <SummaryCard
              icon={<FlaskConical />}
              label="कुल नुस्खे"
              value={filteredRecipes.length}
            />

            <SummaryCard
              icon={<Heart />}
              label="Saved"
              value={savedRecipes.length}
            />

          </div>

        </section>

        {/* ====================================================
            FILTERS
        ==================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 print-hidden">

          {/* Search */}

          <div className="lg:col-span-2 relative">

            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />

            <input
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="जीवामृत, नीमास्त्र, कीट, खाद खोजें..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {searchTerm && (
              <button
                onClick={() =>
                  setSearchTerm('')
                }
                className="absolute right-4 top-3.5"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}

          </div>

          {/* Category */}

          <div className="relative">

            <Filter className="absolute left-4 top-3.5 w-4 h-4 text-emerald-600" />

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(
                  e.target.value
                )
              }
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            >

              {categoryOptions.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {item.label}
                  </option>
                )
              )}

            </select>

          </div>

        </section>

        {/* ====================================================
            RESULTS INFO
        ==================================================== */}

        <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">

          <div>

            <h2 className="text-xl font-black text-slate-900">
              जैविक नुस्खे
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {filteredRecipes.length} नुस्खे मिले •{' '}
              {formatNumber(
                areaInAcres
              )}{' '}
              एकड़ के अनुसार गणना
            </p>

          </div>

          <button
            onClick={handlePrint}
            className="print-hidden inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            <Printer className="w-4 h-4" />
            पूरी गाइड PDF / Print
          </button>

        </div>

        {/* ====================================================
            RECIPE GRID
        ==================================================== */}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {filteredRecipes.map(
            (recipe) => {
              const isExpanded =
                expandedCard ===
                recipe.id;

              const isSaved =
                savedRecipes.includes(
                  recipe.id
                );

              const scale = getRecipeScale(recipe);
              const scaledWater = recipe.baseWater * scale;
              const scaledCostMin = recipe.costMin * scale;
              const scaledCostMax = recipe.costMax * scale;

              return (
                <article
                  key={recipe.id}
                  className={`recipe-card bg-white border rounded-3xl p-5 sm:p-6 shadow-sm transition ${
                    isExpanded
                      ? 'border-emerald-500 ring-2 ring-emerald-100'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >

                  {/* Header */}

                  <div className="flex justify-between gap-3">

                    <div>

                      <span className="inline-block bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black">
                        {recipe.type}
                      </span>

                      <h3 className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">

                        <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />

                        {recipe.title}

                      </h3>

                    </div>

                    <button
                      onClick={() =>
                        toggleSave(
                          recipe.id
                        )
                      }
                      className={`print-hidden shrink-0 p-2.5 rounded-xl border ${
                        isSaved
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                      title="Save"
                    >

                      <Heart
                        className="w-4 h-4"
                        fill={
                          isSaved
                            ? 'currentColor'
                            : 'none'
                        }
                      />

                    </button>

                  </div>

                  {/* Cost */}

                  <div className="grid grid-cols-2 gap-3 mt-4">

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">

                      <p className="text-[10px] text-amber-700 font-bold">
                        अनुमानित लागत
                      </p>

                      <p className="text-sm font-black text-amber-900 mt-1">
                        ₹
                        {formatNumber(
                          scaledCostMin
                        )}{' '}
                        – ₹
                        {formatNumber(
                          scaledCostMax
                        )}
                      </p>

                    </div>

                    <div className="bg-sky-50 border border-sky-100 rounded-2xl p-3">

                      <p className="text-[10px] text-sky-700 font-bold">
                        पानी
                      </p>

                      <p className="text-sm font-black text-sky-900 mt-1">
                        {formatNumber(
                          scaledWater
                        )}{' '}
                        लीटर
                      </p>

                    </div>

                  </div>

                  {/* Target */}

                  <div className="mt-4 bg-slate-50 rounded-2xl p-3">

                    <p className="text-[10px] text-slate-500 font-bold">
                      मुख्य उपयोग
                    </p>

                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {recipe.target}
                    </p>

                  </div>

                  {/* Ingredients */}

                  <div className="mt-5">

                    <div className="flex justify-between items-center mb-2">

                      <h4 className="text-xs font-black text-slate-900">
                        सामग्री —{' '}
                        {formatNumber(
                          areaInAcres
                        )}{' '}
                        एकड़
                      </h4>

                      <span className="text-[10px] text-emerald-700 font-bold">
                        Auto Calculated
                      </span>

                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-hidden">

                      {recipe.baseIngredients.map(
                        (
                          ingredient,
                          index
                        ) => {
                          const amount = ingredient.amount * scale;

                          return (
                            <div
                              key={
                                index
                              }
                              className="flex justify-between items-center gap-3 px-3 py-2.5 border-b last:border-b-0 border-slate-100 bg-slate-50/50"
                            >

                              <span className="text-xs font-medium text-slate-700">
                                {
                                  ingredient.name
                                }
                              </span>

                              <span className="shrink-0 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-black text-emerald-900">
                                {formatAmount(
                                  amount,
                                  ingredient.unit
                                )}
                              </span>

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                  {/* Details */}

                  <div
                    className={`recipe-full-details ${
                      isExpanded
                        ? 'block'
                        : 'hidden'
                    } mt-5 pt-5 border-t border-slate-100`}
                  >

                    {/* Process */}

                    <div>

                      <h4 className="flex items-center gap-2 text-sm font-black text-slate-900">

                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />

                        बनाने की पूरी विधि

                      </h4>

                      <ol className="mt-3 space-y-2">

                        {recipe.processSteps.map(
                          (
                            step,
                            index
                          ) => (
                            <li
                              key={
                                index
                              }
                              className="flex gap-3 text-xs text-slate-700 leading-relaxed"
                            >

                              <span className="shrink-0 w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-[10px] font-black">
                                {index +
                                  1}
                              </span>

                              <span>
                                {
                                  step
                                }
                              </span>

                            </li>
                          )
                        )}

                      </ol>

                    </div>

                    {/* Usage */}

                    <div className="mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">

                      <h4 className="text-xs font-black text-emerald-900">
                        उपयोग
                      </h4>

                      <p className="text-xs text-emerald-950 mt-1 leading-relaxed">
                        {recipe.usage}
                      </p>

                    </div>

                    {/* Precaution */}

                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">

                      <div className="flex gap-2">

                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />

                        <div>

                          <h4 className="text-xs font-black text-amber-900">
                            सावधानी
                          </h4>

                          <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                            {
                              recipe.precautions
                            }
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Meta */}

                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-[10px] text-slate-500">
                          संरक्षण अवधि
                        </p>

                        <p className="text-xs font-black text-slate-800 mt-1 flex gap-1 items-center">

                          <Clock className="w-3.5 h-3.5 text-emerald-600" />

                          {recipe.shelfLife}

                        </p>

                      </div>

                      <div className="bg-slate-50 rounded-xl p-3">

                        <p className="text-[10px] text-slate-500">
                          श्रेणी
                        </p>

                        <p className="text-xs font-black text-slate-800 mt-1">
                          {getCategoryLabel(recipe.category, categoryOptions)}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="print-hidden flex flex-wrap gap-2 mt-5">

                    <button
                      onClick={() =>
                        toggleExpand(
                          recipe.id
                        )
                      }
                      className="flex-1 min-w-[180px] bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                    >

                      {isExpanded ? (
                        <>
                          संक्षिप्त करें
                          <ChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          पूरी विधि देखें
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}

                    </button>

                    <button
                      onClick={() =>
                        copyRecipe(
                          recipe
                        )
                      }
                      className="px-3 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold flex items-center gap-1.5"
                    >

                      {copiedRecipe ===
                      recipe.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}

                    </button>

                    <button
                      onClick={() =>
                        setSelectedRecipeId(
                          recipe.id
                        )
                      }
                      className="px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold flex items-center gap-1.5"
                    >

                      <BookOpen className="w-4 h-4" />

                      Detail

                    </button>

                  </div>

                </article>
              );
            }
          )}

        </section>

        {/* No result */}

        {filteredRecipes.length ===
          0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">

            <Search className="w-10 h-10 text-slate-300 mx-auto" />

            <h3 className="font-black text-slate-800 mt-3">
              कोई नुस्खा नहीं मिला
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Search या category filter बदलकर देखें।
            </p>

          </div>
        )}

        {/* ====================================================
            COST SUMMARY
        ==================================================== */}

        <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8">

          <div className="flex items-start gap-3">

            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl">

              <IndianRupee className="w-5 h-5" />

            </div>

            <div>

              <h2 className="text-xl font-black">
                आपकी जमीन के लिए लागत सारांश
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                वर्तमान में दिख रहे {filteredRecipes.length}{' '}
                नुस्खों की अनुमानित लागत।
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

              <p className="text-xs text-slate-400">
                क्षेत्रफल
              </p>

              <p className="text-2xl font-black mt-1">
                {formatNumber(
                  areaInAcres
                )}{' '}
                Acre
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

              <p className="text-xs text-slate-400">
                न्यूनतम अनुमान
              </p>

              <p className="text-2xl font-black text-emerald-400 mt-1">
                ₹
                {formatNumber(
                  totalCost
                )}
              </p>

            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

              <p className="text-xs text-slate-400">
                अधिकतम अनुमान
              </p>

              <p className="text-2xl font-black text-amber-400 mt-1">
                ₹
                {formatNumber(
                  totalMaxCost
                )}
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            EDUCATIONAL / SAFETY NOTE
        ==================================================== */}

        <section className="bg-blue-50 border border-blue-200 rounded-3xl p-5">

          <div className="flex gap-3">

            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />

            <div>

              <h3 className="text-sm font-black text-blue-950">
                महत्वपूर्ण किसान सूचना
              </h3>

              <p className="text-xs text-blue-900 leading-relaxed mt-1">

                जैविक या प्राकृतिक घोल भी फसल पर
                प्रतिक्रिया कर सकते हैं। किसी भी नए
                घोल को पहले छोटे क्षेत्र पर परीक्षण करें।
                फसल, रोग/कीट की सही पहचान और स्थानीय
                कृषि विशेषज्ञ/KVK की सलाह के अनुसार
                उपयोग करें। निर्धारित लेबल निर्देशों और
                सुरक्षा उपकरणों का पालन करें।

              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            PRINT HEADER
        ==================================================== */}

        <section className="print-only print-white">

          <div className="border-b-2 border-black pb-4 mb-5">

            <h1 className="text-2xl font-black">
              कृषि मित्र — जैविक खेती गाइड
            </h1>

            <p className="text-sm mt-2">
              जमीन: {formatNumber(
                areaInAcres
              )}{' '}
              एकड़
            </p>

            <p className="text-sm">
              कुल नुस्खे: {
                filteredRecipes.length
              }
            </p>

          </div>

        </section>

      </main>

      {/* ======================================================
          DETAIL MODAL
      ====================================================== */}

      {selectedRecipe && (
        <div className="print-hidden fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">

            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex justify-between items-center">

              <div>

                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full font-black">
                  {selectedRecipe.type}
                </span>

                <h2 className="text-xl font-black text-slate-900 mt-2">
                  {selectedRecipe.title}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedRecipeId(
                    null
                  )
                }
                className="p-2 bg-slate-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="p-5 space-y-5">

              {/* Calculator */}

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">

                <h3 className="text-sm font-black text-emerald-950">
                  आपकी जमीन के लिए गणना
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">

                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] text-slate-500">
                      क्षेत्रफल
                    </p>
                    <p className="font-black text-sm">
                      {formatNumber(
                        areaInAcres
                      )}{' '}
                      Acre
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] text-slate-500">
                      पानी
                    </p>
                    <p className="font-black text-sm">
                      {formatNumber(
                        selectedRecipe.baseWater *
                          getRecipeScale(selectedRecipe)
                      )}{' '}
                      L
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-3">
                    <p className="text-[10px] text-slate-500">
                      लागत
                    </p>
                    <p className="font-black text-sm">
                      ₹
                      {formatNumber(
                        selectedRecipe.costMin *
                          getRecipeScale(selectedRecipe)
                      )}{' '}
                      –
                      ₹
                      {formatNumber(
                        selectedRecipe.costMax *
                          getRecipeScale(selectedRecipe)
                      )}
                    </p>
                  </div>

                </div>

              </div>

              {/* Ingredients */}

              <div>

                <h3 className="font-black text-slate-900">
                  आवश्यक सामग्री
                </h3>

                <div className="mt-3 border border-slate-200 rounded-2xl overflow-hidden">

                  {selectedRecipe.baseIngredients.map(
                    (
                      ingredient,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex justify-between gap-3 p-3 border-b last:border-b-0"
                      >

                        <span className="text-sm">
                          {
                            ingredient.name
                          }
                        </span>

                        <strong className="text-sm text-emerald-800">
                          {formatAmount(
                            ingredient.amount *
                              getRecipeScale(selectedRecipe),
                            ingredient.unit
                          )}
                        </strong>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* Process */}

              <div>

                <h3 className="font-black text-slate-900">
                  बनाने की विधि
                </h3>

                <ol className="mt-3 space-y-2">

                  {selectedRecipe.processSteps.map(
                    (
                      step,
                      index
                    ) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm text-slate-700"
                      >

                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
                          {index +
                            1}
                        </span>

                        {step}

                      </li>
                    )
                  )}

                </ol>

              </div>

              {/* Usage */}

              <div className="bg-emerald-50 rounded-2xl p-4">

                <h3 className="text-sm font-black text-emerald-900">
                  उपयोग
                </h3>

                <p className="text-sm text-emerald-950 mt-1">
                  {
                    selectedRecipe.usage
                  }
                </p>

              </div>

              {/* Safety */}

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">

                <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">

                  <AlertTriangle className="w-4 h-4" />

                  सावधानी

                </h3>

                <p className="text-sm text-amber-950 mt-1">
                  {
                    selectedRecipe.precautions
                  }
                </p>

              </div>

            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex gap-2">

              <button
                onClick={() =>
                  copyRecipe(
                    selectedRecipe
                  )
                }
                className="flex-1 bg-blue-50 text-blue-700 py-3 rounded-xl text-xs font-black"
              >
                <Copy className="w-4 h-4 inline mr-1" />
                Copy
              </button>

              <button
                onClick={() =>
                  setSelectedRecipeId(
                    null
                  )
                }
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-black"
              >
                बंद करें
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

      <div className="flex items-center gap-2">

        <div className="bg-white border border-slate-200 p-2 rounded-xl text-emerald-600">
          {icon}
        </div>

        <div>

          <p className="text-[10px] text-slate-500">
            {label}
          </p>

          <p className="text-sm font-black text-slate-900 mt-0.5">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}