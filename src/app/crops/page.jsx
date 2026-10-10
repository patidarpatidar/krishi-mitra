'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  X,
  Sparkles,
  Filter,
  Calendar,
  Sprout,
  Heart,
  Bookmark,
  Share2,
  Droplets,
  MapPin,
  Clock3,
  TrendingUp,
  ChevronDown,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  getOrCreateVisitorId,
  publicApiRequest,
  unwrapApiList,
} from '@/lib/publicApi';

/* =========================================================
   CROP DATA
========================================================= */

/* =========================================================
   HELPERS
========================================================= */

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-IN').format(number);
};

const getStorageKey = (key) => `krishi-mitra-${key}`;

const getCropStorage = (key) => {
  if (typeof window === 'undefined') return [];

  try {
    const value = JSON.parse(localStorage.getItem(getStorageKey(key)) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

/* =========================================================
   PAGE
========================================================= */

export default function CropsPage() {
  const [cropsData, setCropsData] = useState([]);
  const [cropCategories, setCropCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWater, setSelectedWater] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const [quickViewCrop, setQuickViewCrop] = useState(null);

  const [likedCrops, setLikedCrops] = useState([]);
  const [savedCrops, setSavedCrops] = useState([]);
  const [visitorId, setVisitorId] = useState('');
  const [likeSubmitting, setLikeSubmitting] = useState({});
  const [likeError, setLikeError] = useState('');
  const likeSubmittingRef = useRef(new Set());

  const [showFilters, setShowFilters] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      publicApiRequest('/crops?status=published&limit=100'),
      publicApiRequest('/crop-categories?status=active'),
    ])
      .then(([cropResult, categoryResult]) => {
        if (cancelled) return;
        const loadedCrops = unwrapApiList(cropResult);
        setCropsData(
          loadedCrops.map((crop) => ({
            ...crop,
            id: crop._id || crop.slug,
            nameEn: crop.englishName || '',
            category: crop.category?.key || '',
            categoryLabel: crop.category?.label || '',
            season: crop.season?.key || '',
            seasonLabel: crop.season?.label || '',
            water: crop.water?.key || '',
            waterLabel: crop.water?.label || '',
            cropType: crop.cropType?.key || '',
            cropTypeLabel: crop.cropType?.label || '',
            tags: crop.tags || [],
            regions: crop.regions || [],
            views: crop.views || 0,
            likes: crop.likes || 0,
          })),
        );
        const storedLikes = getCropStorage('liked-crops');
        setLikedCrops(
          loadedCrops.flatMap((crop) => {
            let storedLike = null;
            try {
              storedLike = window.localStorage.getItem(
                `krishi-crop-like-${crop.slug}`,
              );
            } catch {
              storedLike = null;
            }
            const isLiked =
              storedLike === null
                ? Array.isArray(storedLikes) && storedLikes.includes(crop.slug)
                : storedLike === 'true';
            return isLiked ? [crop.slug] : [];
          }),
        );
        setCropCategories(unwrapApiList(categoryResult));
        const requestedCategory = new URLSearchParams(
          window.location.search,
        ).get('category');
        if (requestedCategory) setSelectedCategory(requestedCategory);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message || 'फसलें लोड नहीं हो सकीं।');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => [
      { id: 'all', label: 'सभी श्रेणियां', icon: '🌱' },
      ...cropCategories.map((category) => ({
        id: category.key || category.slug,
        label: category.name,
        icon: category.icon || '🌱',
      })),
    ],
    [cropCategories],
  );
  const seasons = useMemo(
    () => [
      { id: 'all', label: 'सभी मौसम' },
      ...Array.from(new Map(cropsData
        .filter((crop) => crop.season)
        .map((crop) => [crop.season, { id: crop.season, label: crop.seasonLabel }])).values()),
    ],
    [cropsData],
  );
  const waterFilters = useMemo(
    () => [
      { id: 'all', label: 'सभी' },
      ...Array.from(new Map(cropsData
        .filter((crop) => crop.water)
        .map((crop) => [crop.water, { id: crop.water, label: crop.waterLabel }])).values()),
    ],
    [cropsData],
  );
  const regions = useMemo(
    () => [
      { id: 'all', label: 'सभी क्षेत्र' },
      ...Array.from(new Set(cropsData.flatMap((crop) => crop.regions)))
        .map((region) => ({ id: region, label: region })),
    ],
    [cropsData],
  );
  const cropTypes = useMemo(
    () => [
      { id: 'all', label: 'सभी प्रकार' },
      ...Array.from(new Map(cropsData
        .filter((crop) => crop.cropType)
        .map((crop) => [crop.cropType, { id: crop.cropType, label: crop.cropTypeLabel }])).values()),
    ],
    [cropsData],
  );

  /* =====================================================
     LOAD LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    setVisitorId(getOrCreateVisitorId());
    setSavedCrops(getCropStorage('saved-crops'));
  }, []);

  /* =====================================================
     SAVE LIKES
  ===================================================== */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      getStorageKey('liked-crops'),
      JSON.stringify(likedCrops)
    );
  }, [likedCrops]);

  /* =====================================================
     SAVE BOOKMARKS
  ===================================================== */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      getStorageKey('saved-crops'),
      JSON.stringify(savedCrops)
    );
  }, [savedCrops]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const filteredCrops = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    let result = cropsData.filter((crop) => {
      const matchesSearch =
        !search ||
        crop.name.toLowerCase().includes(search) ||
        crop.nameEn.toLowerCase().includes(search) ||
        crop.description.toLowerCase().includes(search) ||
        crop.categoryLabel.toLowerCase().includes(search) ||
        crop.tags.some((tag) => tag.toLowerCase().includes(search));

      const matchesSeason =
        selectedSeason === 'all' || crop.season === selectedSeason;

      const matchesCategory =
        selectedCategory === 'all' ||
        crop.category === selectedCategory;

      const matchesWater =
        selectedWater === 'all' || crop.water === selectedWater;

      const matchesRegion =
        selectedRegion === 'all' ||
        crop.regions.includes(selectedRegion);

      const matchesType =
        selectedType === 'all' || crop.cropType === selectedType;

      const matchesFeatured =
        !showFeaturedOnly || crop.featured === true;

      return (
        matchesSearch &&
        matchesSeason &&
        matchesCategory &&
        matchesWater &&
        matchesRegion &&
        matchesType &&
        matchesFeatured
      );
    });

    result.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.views - a.views;
      }

      if (sortBy === 'likes') {
        return b.likes - a.likes;
      }

      if (sortBy === 'duration-low') {
        return a.durationDays - b.durationDays;
      }

      if (sortBy === 'duration-high') {
        return b.durationDays - a.durationDays;
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'hi');
      }

      return 0;
    });

    return result;
  }, [
    cropsData,
    searchTerm,
    selectedSeason,
    selectedCategory,
    selectedWater,
    selectedRegion,
    selectedType,
    sortBy,
    showFeaturedOnly,
  ]);

  /* =====================================================
     ACTIVE FILTER COUNT
  ===================================================== */

  const activeFilterCount = [
    selectedSeason !== 'all',
    selectedCategory !== 'all',
    selectedWater !== 'all',
    selectedRegion !== 'all',
    selectedType !== 'all',
    showFeaturedOnly,
    searchTerm.trim() !== '',
  ].filter(Boolean).length;

  /* =====================================================
     RESET
  ===================================================== */

  const resetFilters = () => {
    setSelectedSeason('all');
    setSelectedCategory('all');
    setSelectedWater('all');
    setSelectedRegion('all');
    setSelectedType('all');
    setSearchTerm('');
    setSortBy('popular');
    setShowFeaturedOnly(false);
  };

  /* =====================================================
     LIKE
  ===================================================== */

  const toggleLike = async (crop) => {
    const slug = crop.slug;
    const cropId = crop._id;
    if (!cropId || !visitorId || likeSubmittingRef.current.has(slug)) return;

    const nextLiked = !likedCrops.includes(slug);
    likeSubmittingRef.current.add(slug);
    setLikeSubmitting((current) => ({ ...current, [slug]: true }));
    setLikeError('');
    try {
      const result = await publicApiRequest(
        `/crops/${encodeURIComponent(cropId)}/like`,
        {
          method: nextLiked ? 'PUT' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        },
      );
      const counts = result.data || {};
      const serverLiked = Boolean(counts.liked);
      const serverLikes = Number(counts.likes);

      setLikedCrops((current) =>
        serverLiked
          ? current.includes(slug) ? current : [...current, slug]
          : current.filter((item) => item !== slug),
      );
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          `krishi-crop-like-${slug}`,
          String(serverLiked),
        );
      }
      if (Number.isFinite(serverLikes)) {
        setCropsData((current) =>
          current.map((item) =>
            item.slug === slug ? { ...item, likes: serverLikes } : item,
          ),
        );
        setQuickViewCrop((current) =>
          current?.slug === slug
            ? { ...current, likes: serverLikes }
            : current,
        );
      }
    } catch (error) {
      setLikeError(error.message || 'लाइक अपडेट नहीं हो सका।');
    } finally {
      likeSubmittingRef.current.delete(slug);
      setLikeSubmitting((current) => ({ ...current, [slug]: false }));
    }
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const toggleSave = (slug) => {
    setSavedCrops((previous) => {
      if (previous.includes(slug)) {
        return previous.filter((item) => item !== slug);
      }

      return [...previous, slug];
    });
  };

  /* =====================================================
     SHARE
  ===================================================== */

  const shareCrop = async (crop) => {
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/crops/${crop.slug}`
        : `/crops/${crop.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${crop.name} - कृषि मित्र`,
          text: `${crop.name} की खेती की जानकारी कृषि मित्र पर देखें।`,
          url: shareUrl,
        });
      } catch {
        // User closed share popup.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('फसल की लिंक कॉपी हो गई।');
    } catch {
      alert('लिंक कॉपी नहीं हो सकी।');
    }
  };

  /* =====================================================
     OPEN QUICK VIEW
  ===================================================== */

  const openQuickView = (crop) => {
    setQuickViewCrop(crop);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
              <Sprout className="h-4 w-4" />
              कृषि मित्र • फसल गाइड
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              फसल निर्देशिका एवं
              <span className="block text-emerald-100">
                खेती की पूरी जानकारी
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              अपनी फसल खोजें, मौसम और श्रेणी के अनुसार फिल्टर करें, जानकारी
              सेव करें और मंडी भाव से सीधे जुड़ें।
            </p>

            {/* Search */}
            <div className="mt-7 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-700" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="फसल का नाम, जैसे सोयाबीन, गेहूं, लहसुन..."
                  className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-12 text-sm text-slate-800 shadow-xl outline-none ring-0 placeholder:text-slate-400"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Hero stats */}
            <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroStat value={cropsData.length} label="कुल फसलें" />
              <HeroStat
                value={cropsData.filter((item) => item.season === 'rabi').length}
                label="रबी फसलें"
              />
              <HeroStat
                value={cropsData.filter((item) => item.season === 'kharif').length}
                label="खरीफ फसलें"
              />
              <HeroStat
                value={cropsData.filter((item) => item.featured).length}
                label="लोकप्रिय"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FILTER SECTION
      =================================================== */}

      <section className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur md:top-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                aria-controls="crop-filter-panel"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  showFilters
                    ? 'border-emerald-600 bg-emerald-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">फिल्टर</span>
                <span className="sm:hidden">फिल्टर व छांटें</span>

                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden text-sm text-slate-500 sm:block">
                <span className="font-bold text-emerald-700">
                  {filteredCrops.length}
                </span>{' '}
                फसलें मिलीं
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="फसलों को क्रमबद्ध करें"
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500 sm:flex-none sm:px-3 sm:text-sm"
              >
                <option value="popular">लोकप्रिय पहले</option>
                <option value="likes">सबसे ज्यादा पसंद</option>
                <option value="duration-low">कम अवधि</option>
                <option value="duration-high">ज्यादा अवधि</option>
                <option value="name">नाम के अनुसार</option>
              </select>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="hidden items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 sm:flex"
                >
                  <RotateCcw className="h-4 w-4" />
                  रीसेट
                </button>
              )}
            </div>
          </div>

          {/* Mobile count */}
          <div className="pb-3 text-xs text-slate-500 sm:hidden">
            <span className="font-bold text-emerald-700">
              {filteredCrops.length}
            </span>{' '}
            फसलें मिलीं
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div id="crop-filter-panel" className="hidden border-t border-slate-100 py-5 md:block">
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
                {/* Season */}
                <FilterGroup title="मौसम">
                  <div className="flex flex-wrap gap-2">
                    {seasons.map((season) => (
                      <FilterButton
                        key={season.id}
                        active={selectedSeason === season.id}
                        ariaPressed={selectedSeason === season.id}
                        onClick={() => setSelectedSeason(season.id)}
                      >
                        {season.label}
                      </FilterButton>
                    ))}
                  </div>
                </FilterGroup>

                {/* Category */}
                <FilterGroup title="श्रेणी">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <FilterButton
                        key={category.id}
                        active={selectedCategory === category.id}
                        ariaPressed={selectedCategory === category.id}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.icon} {category.label}
                      </FilterButton>
                    ))}
                  </div>
                </FilterGroup>

                {/* Water */}
                <FilterGroup title="पानी की आवश्यकता">
                  <div className="flex flex-wrap gap-2">
                    {waterFilters.map((water) => (
                      <FilterButton
                        key={water.id}
                        active={selectedWater === water.id}
                        ariaPressed={selectedWater === water.id}
                        onClick={() => setSelectedWater(water.id)}
                      >
                        {water.id !== 'all' && (
                          <Droplets className="mr-1 inline h-3.5 w-3.5" />
                        )}
                        {water.label}
                      </FilterButton>
                    ))}
                  </div>
                </FilterGroup>

                {/* Type */}
                <FilterGroup title="फसल का प्रकार">
                  <div className="flex flex-wrap gap-2">
                    {cropTypes.map((type) => (
                      <FilterButton
                        key={type.id}
                        active={selectedType === type.id}
                        ariaPressed={selectedType === type.id}
                        onClick={() => setSelectedType(type.id)}
                      >
                        {type.label}
                      </FilterButton>
                    ))}
                  </div>
                </FilterGroup>
              </div>

              {/* Region */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                <FilterGroup title="क्षेत्र">
                  <div className="flex flex-wrap gap-2">
                    {regions.map((region) => (
                      <FilterButton
                        key={region.id}
                        active={selectedRegion === region.id}
                        ariaPressed={selectedRegion === region.id}
                        onClick={() => setSelectedRegion(region.id)}
                      >
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        {region.label}
                      </FilterButton>
                    ))}
                  </div>
                </FilterGroup>
              </div>

              {/* Featured */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    showFeaturedOnly
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  केवल लोकप्रिय फसलें
                </button>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  सभी फिल्टर हटाएं
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {showFilters && (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="फसल फिल्टर बंद करें"
            onClick={() => setShowFilters(false)}
            className="fixed inset-x-0 top-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[60] bg-slate-950/45"
          />
          <section
            id="crop-filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-filter-title"
            className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-[61] mx-auto flex max-h-[min(78dvh,42rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-4">
              <div>
                <h2 id="crop-filter-title" className="text-lg font-black text-slate-900">
                  फसलें छांटें
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredCrops.length} फसलें मिलेंगी · विकल्प चुनते ही सूची अपडेट होगी
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                aria-label="फिल्टर बंद करें"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
              <FilterGroup title="मौसम">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {seasons.map((season) => (
                    <FilterButton
                      key={season.id}
                      active={selectedSeason === season.id}
                      onClick={() => setSelectedSeason(season.id)}
                    >
                      {season.label}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="श्रेणी">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((category) => (
                    <FilterButton
                      key={category.id}
                      active={selectedCategory === category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.icon} {category.label}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="पानी की आवश्यकता">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {waterFilters.map((water) => (
                    <FilterButton
                      key={water.id}
                      active={selectedWater === water.id}
                      onClick={() => setSelectedWater(water.id)}
                    >
                      {water.label}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="फसल का प्रकार">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {cropTypes.map((type) => (
                    <FilterButton
                      key={type.id}
                      active={selectedType === type.id}
                      onClick={() => setSelectedType(type.id)}
                    >
                      {type.label}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="क्षेत्र">
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <FilterButton
                      key={region.id}
                      active={selectedRegion === region.id}
                      onClick={() => setSelectedRegion(region.id)}
                    >
                      <MapPin className="mr-1 inline h-3.5 w-3.5" />
                      {region.label}
                    </FilterButton>
                  ))}
                </div>
              </FilterGroup>

              <button
                type="button"
                aria-pressed={showFeaturedOnly}
                onClick={() => setShowFeaturedOnly((current) => !current)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold ${
                  showFeaturedOnly
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                केवल लोकप्रिय फसलें
              </button>
            </div>

            <div className="flex gap-2 border-t border-slate-100 bg-white px-4 py-3">
              <button
                type="button"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                साफ करें
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="min-h-12 flex-1 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white"
              >
                {filteredCrops.length} फसलें देखें
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Result heading */}
        {loadError && (
          <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </p>
        )}
        {loading && (
          <p className="mb-5 text-sm text-slate-500">फसलें लोड हो रही हैं...</p>
        )}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Filter className="h-4 w-4" />
              फसल सूची
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              किसान के लिए उपयोगी फसल गाइड
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              बुआई समय, अवधि, पानी, क्षेत्र और अन्य जानकारी एक ही जगह।
            </p>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              <ActiveFilter
                label={
                  selectedSeason !== 'all'
                    ? seasons.find((x) => x.id === selectedSeason)?.label
                    : null
                }
              />

              <ActiveFilter
                label={
                  selectedCategory !== 'all'
                    ? categories.find((x) => x.id === selectedCategory)?.label
                    : null
                }
              />

              <ActiveFilter
                label={
                  selectedWater !== 'all'
                    ? waterFilters.find((x) => x.id === selectedWater)?.label
                    : null
                }
              />

              <ActiveFilter
                label={
                  selectedRegion !== 'all'
                    ? regions.find((x) => x.id === selectedRegion)?.label
                    : null
                }
              />

              <ActiveFilter
                label={
                  selectedType !== 'all'
                    ? cropTypes.find((x) => x.id === selectedType)?.label
                    : null
                }
              />
            </div>
          )}
        </div>

        {/* =================================================
            CARDS
        ================================================= */}

        {filteredCrops.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                isLiked={likedCrops.includes(crop.slug)}
                isSaved={savedCrops.includes(crop.slug)}
                onLike={() => toggleLike(crop)}
                likeSubmitting={Boolean(likeSubmitting[crop.slug])}
                onSave={() => toggleSave(crop.slug)}
                onShare={() => shareCrop(crop)}
                onQuickView={() => openQuickView(crop)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetFilters} />
        )}
        {likeError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {likeError}
          </p>
        )}
      </section>

      {/* ===================================================
          SAVED SECTION
      =================================================== */}

      {savedCrops.length > 0 && (
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
                <Bookmark className="h-5 w-5 fill-current" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  आपकी सेव की गई फसलें
                </h2>
                <p className="text-sm text-slate-500">
                  आपने {savedCrops.length} फसल
                  {savedCrops.length > 1 ? 'ें' : ''} सेव की है।
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {savedCrops.map((slug) => {
                const crop = cropsData.find((item) => item.slug === slug);

                if (!crop) return null;

                return (
                  <Link
                    key={slug}
                    href={`/crops/${slug}`}
                    className="group inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <span className="text-2xl">{crop.icon}</span>

                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-emerald-700">
                        {crop.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {crop.categoryLabel}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          INFORMATION SECTION
      =================================================== */}

      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoBox
              icon={<Calendar className="h-6 w-6" />}
              title="सही समय पर बुआई"
              text="हर फसल के लिए उपयोगी बुआई अवधि की जानकारी देखें।"
            />

            <InfoBox
              icon={<Droplets className="h-6 w-6" />}
              title="पानी की जरूरत"
              text="कम, मध्यम या अधिक पानी वाली फसलों को आसानी से फिल्टर करें।"
            />

            <InfoBox
              icon={<TrendingUp className="h-6 w-6" />}
              title="मंडी भाव से जुड़ें"
              text="फसल की जानकारी के बाद सीधे मंडी भाव सेक्शन पर जाएं।"
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          QUICK VIEW MODAL
      =================================================== */}

      {quickViewCrop && (
        <QuickViewModal
          crop={quickViewCrop}
          isLiked={likedCrops.includes(quickViewCrop.slug)}
          isSaved={savedCrops.includes(quickViewCrop.slug)}
          onLike={() => toggleLike(quickViewCrop)}
          likeSubmitting={Boolean(likeSubmitting[quickViewCrop.slug])}
          onSave={() => toggleSave(quickViewCrop.slug)}
          onShare={() => shareCrop(quickViewCrop)}
          onClose={() => setQuickViewCrop(null)}
        />
      )}
    </main>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

function HeroStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="mt-0.5 text-xs text-emerald-100">{label}</div>
    </div>
  );
}

/* =========================================================
   FILTER GROUP
========================================================= */

function FilterGroup({ title, children }) {
  return (
    <div>
      <div className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({ active, ariaPressed = active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
        active
          ? 'border-emerald-600 bg-emerald-700 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
      }`}
    >
      {active && <Check className="mr-1 inline h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

/* =========================================================
   ACTIVE FILTER
========================================================= */

function ActiveFilter({ label }) {
  if (!label) return null;

  return (
    <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      {label}
    </span>
  );
}

/* =========================================================
   CROP CARD
========================================================= */

function CropCard({
  crop,
  isLiked,
  likeSubmitting,
  isSaved,
  onLike,
  onSave,
  onShare,
  onQuickView,
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">
      {/* Featured */}
      {crop.featured && (
        <div className="absolute left-4 top-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            लोकप्रिय
          </span>
        </div>
      )}

      {/* Crop icon area */}
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-5 top-8 h-16 w-16 rounded-full bg-emerald-200 blur-2xl" />
          <div className="absolute bottom-5 right-5 h-20 w-20 rounded-full bg-lime-200 blur-2xl" />
        </div>

        <div className="relative text-7xl transition duration-300 group-hover:scale-110">
          {crop.icon}
        </div>

        {/* Top actions */}
        <div className="absolute right-3 top-3 flex gap-1.5">
          <IconAction
            active={isLiked}
            title="पसंद करें"
            onClick={onLike}
            disabled={likeSubmitting}
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? 'fill-current' : ''
              }`}
            />
          </IconAction>

          <IconAction
            active={isSaved}
            title="सेव करें"
            onClick={onSave}
          >
            <Bookmark
              className={`h-4 w-4 ${
                isSaved ? 'fill-current' : ''
              }`}
            />
          </IconAction>

          <IconAction title="शेयर करें" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </IconAction>
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm backdrop-blur">
            {crop.categoryLabel}
          </span>
        </div>

        {/* Season */}
        <div className="absolute bottom-3 right-3">
          <span className="rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white">
            {crop.seasonLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {crop.name}
            </h3>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              {crop.nameEn}
            </p>
          </div>

          <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
            {crop.cropTypeLabel}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {crop.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {crop.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Quick info */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <QuickInfo
            icon={<Calendar className="h-3.5 w-3.5" />}
            label="बुआई"
            value={crop.sowing}
          />

          <QuickInfo
            icon={<Clock3 className="h-3.5 w-3.5" />}
            label="अवधि"
            value={crop.duration}
          />

          <QuickInfo
            icon={<Droplets className="h-3.5 w-3.5" />}
            label="पानी"
            value={crop.waterLabel}
          />

          <QuickInfo
            icon={<MapPin className="h-3.5 w-3.5" />}
            label="क्षेत्र"
            value={crop.regionLabel}
          />
        </div>

        {/* Engagement */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(crop.views)}
            </span>

            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {formatNumber(crop.likes)}
            </span>
          </div>

          {isLiked && (
            <span className="text-xs font-semibold text-rose-500">
              पसंद किया
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onQuickView}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Eye className="h-4 w-4" />
            Quick View
          </button>

          <Link
            href={`/crops/${crop.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
          >
            पूरी जानकारी
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mandi */}
        <Link
          href={`/mandi-bhav?crop=${crop.slug}`}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
        >
          <TrendingUp className="h-4 w-4" />
          आज का मंडी भाव देखें
        </Link>
      </div>
    </article>
  );
}

/* =========================================================
   ICON ACTION
========================================================= */

function IconAction({
  children,
  active = false,
  title,
  onClick,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur transition ${
        active
          ? 'bg-rose-500 text-white'
          : 'bg-white/90 text-slate-600 hover:bg-white hover:text-emerald-700'
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   QUICK INFO
========================================================= */

function QuickInfo({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-400">
        {icon}
        {label}
      </div>

      <div className="mt-1 line-clamp-1 text-xs font-bold text-slate-700">
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onReset }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
        <Search className="h-7 w-7 text-emerald-600" />
      </div>

      <h3 className="mt-5 text-xl font-extrabold text-slate-900">
        कोई फसल नहीं मिली
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        आपके द्वारा लगाए गए फिल्टर या सर्च के अनुसार कोई फसल नहीं मिली।
        फिल्टर बदलकर दोबारा प्रयास करें।
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
      >
        <RefreshCw className="h-4 w-4" />
        सभी फिल्टर हटाएं
      </button>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

/* =========================================================
   QUICK VIEW MODAL
========================================================= */

function QuickViewModal({
  crop,
  isLiked,
  likeSubmitting,
  isSaved,
  onLike,
  onSave,
  onShare,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Modal header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-green-600 px-6 py-7 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
              {crop.icon}
            </div>

            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
                  {crop.categoryLabel}
                </span>

                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
                  {crop.seasonLabel}
                </span>
              </div>

              <h2 className="text-2xl font-extrabold">{crop.name}</h2>

              <p className="mt-1 text-sm text-emerald-100">
                {crop.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Engagement */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onLike}
              disabled={likeSubmitting}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${
                isLiked
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              {isLiked ? 'पसंद किया' : 'पसंद करें'}
            </button>

            <button
              type="button"
              onClick={onSave}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${
                isSaved
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 text-slate-600'
              }`}
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isSaved ? 'fill-current' : ''
                }`}
              />
              {isSaved ? 'सेव किया' : 'सेव करें'}
            </button>

            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />
              शेयर
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              फसल के बारे में
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              {crop.description}
            </p>
          </div>

          {/* Information grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailBox
              icon={<Calendar className="h-5 w-5" />}
              title="बुआई का समय"
              value={crop.sowing}
            />

            <DetailBox
              icon={<Clock3 className="h-5 w-5" />}
              title="फसल अवधि"
              value={crop.duration}
            />

            <DetailBox
              icon={<Sprout className="h-5 w-5" />}
              title="बीज दर"
              value={crop.seedRate}
            />

            <DetailBox
              icon={<Droplets className="h-5 w-5" />}
              title="पानी की आवश्यकता"
              value={crop.waterLabel}
            />

            <DetailBox
              icon={<MapPin className="h-5 w-5" />}
              title="प्रमुख क्षेत्र"
              value={crop.regionLabel}
            />

            <DetailBox
              icon={<Eye className="h-5 w-5" />}
              title="देखे गए"
              value={`${formatNumber(crop.views)} views`}
            />
          </div>

          {/* Soil */}
          <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
            <h3 className="font-extrabold text-emerald-900">
              मिट्टी / विशेष जानकारी
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-800">
              {crop.idealSoil}
            </p>
          </div>

          {/* Regulated notice */}
          {crop.regulated && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <div className="mt-0.5 text-xl">⚠️</div>

                <div>
                  <h3 className="font-extrabold text-amber-900">
                    कानूनी / लाइसेंस संबंधी जानकारी
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    इस फसल से संबंधित किसी भी जानकारी को लागू सरकारी
                    लाइसेंस, अनुमति और नियमों के अंतर्गत ही देखें।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href={`/crops/${crop.slug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800"
            >
              पूरी फसल गाइड
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/mandi-bhav?crop=${crop.slug}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-900 hover:bg-amber-400"
            >
              <TrendingUp className="h-4 w-4" />
              मंडी भाव देखें
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL BOX
========================================================= */

function DetailBox({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <span className="text-emerald-600">{icon}</span>
        {title}
      </div>

      <div className="mt-2 text-sm font-extrabold text-slate-800">
        {value}
      </div>
    </div>
  );
}