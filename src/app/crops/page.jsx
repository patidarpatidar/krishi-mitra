'use client';

import { useEffect, useMemo, useState } from 'react';
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

/* =========================================================
   CROP DATA
========================================================= */

const cropsData = [
  {
    id: 1,
    slug: 'soyabean',
    name: 'सोयाबीन',
    nameEn: 'Soyabean',
    category: 'oilseed',
    categoryLabel: 'तिलहन',
    season: 'kharif',
    seasonLabel: 'खरीफ',
    icon: '🌱',
    description:
      'मध्य प्रदेश की प्रमुख खरीफ तिलहन फसल। नीमच और मालवा क्षेत्र में बड़े स्तर पर इसकी खेती की जाती है।',
    idealSoil:
      'अच्छी जल निकासी वाली दोमट एवं मध्यम काली मिट्टी उपयुक्त मानी जाती है।',
    duration: '90-105 दिन',
    durationDays: 100,
    sowing: '20 जून - 15 जुलाई',
    seedRate: '75-80 किग्रा/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 12450,
    likes: 842,
    featured: true,
    tags: ['सोयाबीन', 'खरीफ', 'तिलहन', 'मालवा', 'नीमच'],
  },

  {
    id: 2,
    slug: 'garlic',
    name: 'लहसुन',
    nameEn: 'Garlic',
    category: 'spice',
    categoryLabel: 'मसाला',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🧄',
    description:
      'नीमच-मंदसौर क्षेत्र की महत्वपूर्ण मसाला फसल। अच्छी गुणवत्ता और भंडारण क्षमता के कारण किसानों के लिए महत्वपूर्ण है।',
    idealSoil:
      'भुरभुरी, उपजाऊ और अच्छी जल निकासी वाली दोमट मिट्टी उपयुक्त रहती है।',
    duration: '130-150 दिन',
    durationDays: 140,
    sowing: '15 अक्टूबर - 15 नवंबर',
    seedRate: '500-600 किग्रा कलियां/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 18320,
    likes: 1260,
    featured: true,
    tags: ['लहसुन', 'मसाला', 'रबी', 'नीमच', 'मंदसौर'],
  },

  {
    id: 3,
    slug: 'wheat',
    name: 'गेहूं',
    nameEn: 'Wheat',
    category: 'cereal',
    categoryLabel: 'अनाज',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌾',
    description:
      'रबी मौसम की प्रमुख खाद्यान्न फसल। सिंचित क्षेत्रों में गेहूं की खेती व्यापक रूप से की जाती है।',
    idealSoil:
      'उपजाऊ दोमट एवं मध्यम काली मिट्टी गेहूं के लिए उपयुक्त रहती है।',
    duration: '115-130 दिन',
    durationDays: 123,
    sowing: '15 नवंबर - 10 दिसंबर',
    seedRate: '100-125 किग्रा/हेक्टेयर',
    water: 'high',
    waterLabel: 'अधिक पानी',
    cropType: 'food',
    cropTypeLabel: 'खाद्यान्न',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 15100,
    likes: 980,
    featured: false,
    tags: ['गेहूं', 'अनाज', 'रबी', 'सिंचाई'],
  },

  {
    id: 4,
    slug: 'gram',
    name: 'चना',
    nameEn: 'Gram',
    category: 'pulse',
    categoryLabel: 'दलहन',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🫘',
    description:
      'कम पानी में भी अच्छी उपज देने वाली प्रमुख दलहनी फसल। मालवा क्षेत्र में इसकी खेती लोकप्रिय है।',
    idealSoil:
      'हल्की से मध्यम काली एवं दोमट मिट्टी उपयुक्त रहती है।',
    duration: '100-110 दिन',
    durationDays: 105,
    sowing: '15 अक्टूबर - 10 नवंबर',
    seedRate: '75-80 किग्रा/हेक्टेयर',
    water: 'low',
    waterLabel: 'कम पानी',
    cropType: 'food',
    cropTypeLabel: 'खाद्यान्न',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 10980,
    likes: 720,
    featured: false,
    tags: ['चना', 'दलहन', 'रबी', 'कम पानी'],
  },

  {
    id: 5,
    slug: 'maize',
    name: 'मक्का',
    nameEn: 'Maize',
    category: 'cereal',
    categoryLabel: 'अनाज',
    season: 'kharif',
    seasonLabel: 'खरीफ',
    icon: '🌽',
    description:
      'खरीफ मौसम की महत्वपूर्ण अनाज फसल। खाद्य और पशु आहार दोनों के लिए इसका उपयोग किया जाता है।',
    idealSoil:
      'उपजाऊ दोमट एवं अच्छी जल निकासी वाली मिट्टी उपयुक्त रहती है।',
    duration: '85-95 दिन',
    durationDays: 90,
    sowing: 'जून - जुलाई',
    seedRate: '20-22 किग्रा/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'food',
    cropTypeLabel: 'खाद्यान्न',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 8420,
    likes: 530,
    featured: false,
    tags: ['मक्का', 'अनाज', 'खरीफ'],
  },

  {
    id: 6,
    slug: 'coriander',
    name: 'धनिया',
    nameEn: 'Coriander',
    category: 'spice',
    categoryLabel: 'मसाला',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌿',
    description:
      'मसाला फसलों में प्रमुख स्थान रखने वाली फसल। बीज और हरी पत्तियों दोनों के लिए उगाई जाती है।',
    idealSoil:
      'हल्की से मध्यम दोमट मिट्टी जिसमें जल निकासी अच्छी हो।',
    duration: '90-110 दिन',
    durationDays: 100,
    sowing: 'अक्टूबर - नवंबर',
    seedRate: '15-20 किग्रा/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 7340,
    likes: 480,
    featured: false,
    tags: ['धनिया', 'मसाला', 'रबी'],
  },

  {
    id: 7,
    slug: 'mustard',
    name: 'सरसों',
    nameEn: 'Mustard',
    category: 'oilseed',
    categoryLabel: 'तिलहन',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌼',
    description:
      'प्रमुख तिलहन फसल। कम अवधि और अपेक्षाकृत कम पानी में उत्पादन के लिए उपयोगी।',
    idealSoil:
      'हल्की से मध्यम दोमट एवं अच्छी जल निकासी वाली मिट्टी।',
    duration: '105-120 दिन',
    durationDays: 112,
    sowing: 'सितंबर - अक्टूबर',
    seedRate: '4-5 किग्रा/हेक्टेयर',
    water: 'low',
    waterLabel: 'कम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 6510,
    likes: 420,
    featured: false,
    tags: ['सरसों', 'तिलहन', 'रबी', 'कम पानी'],
  },

  {
    id: 8,
    slug: 'groundnut',
    name: 'मूंगफली',
    nameEn: 'Groundnut',
    category: 'oilseed',
    categoryLabel: 'तिलहन',
    season: 'kharif',
    seasonLabel: 'खरीफ',
    icon: '🥜',
    description:
      'खरीफ मौसम की प्रमुख तिलहन फसल। अच्छी जल निकासी वाली भूमि में बेहतर प्रदर्शन करती है।',
    idealSoil:
      'हल्की, भुरभुरी एवं अच्छी जल निकासी वाली मिट्टी बेहतर रहती है।',
    duration: '105-120 दिन',
    durationDays: 112,
    sowing: 'जून - जुलाई',
    seedRate: '100-120 किग्रा/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 5900,
    likes: 360,
    featured: false,
    tags: ['मूंगफली', 'तिलहन', 'खरीफ'],
  },

  {
    id: 9,
    slug: 'fenugreek',
    name: 'मेथी',
    nameEn: 'Fenugreek',
    category: 'spice',
    categoryLabel: 'मसाला',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌱',
    description:
      'मसाला और हरी सब्जी दोनों रूपों में उपयोगी फसल। कम अवधि में तैयार होने वाली फसल।',
    idealSoil:
      'उपजाऊ दोमट मिट्टी तथा उचित जल निकासी वाली भूमि।',
    duration: '90-105 दिन',
    durationDays: 98,
    sowing: 'अक्टूबर - नवंबर',
    seedRate: '20-25 किग्रा/हेक्टेयर',
    water: 'low',
    waterLabel: 'कम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 4300,
    likes: 290,
    featured: false,
    tags: ['मेथी', 'मसाला', 'कम पानी'],
  },

  {
    id: 10,
    slug: 'isabgol',
    name: 'इसबगोल',
    nameEn: 'Isabgol',
    category: 'medicinal',
    categoryLabel: 'औषधीय',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌾',
    description:
      'औषधीय उपयोग वाली महत्वपूर्ण फसल। बीज की भूसी के लिए इसका विशेष बाजार है।',
    idealSoil:
      'हल्की एवं अच्छी जल निकासी वाली मिट्टी उपयुक्त रहती है।',
    duration: '110-120 दिन',
    durationDays: 115,
    sowing: 'नवंबर का पहला पखवाड़ा',
    seedRate: '6-8 किग्रा/हेक्टेयर',
    water: 'low',
    waterLabel: 'कम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 3860,
    likes: 260,
    featured: false,
    tags: ['इसबगोल', 'औषधीय', 'रबी'],
  },

  {
    id: 11,
    slug: 'kalonji',
    name: 'कलौंजी',
    nameEn: 'Kalonji',
    category: 'medicinal',
    categoryLabel: 'औषधीय',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🖤',
    description:
      'मसाला एवं औषधीय उपयोग वाली फसल। इसके बीज का उपयोग विभिन्न पारंपरिक उत्पादों में किया जाता है।',
    idealSoil:
      'अच्छी जल निकासी वाली दोमट या हल्की मिट्टी।',
    duration: '130-140 दिन',
    durationDays: 135,
    sowing: 'अक्टूबर - नवंबर',
    seedRate: '7-8 किग्रा/हेक्टेयर',
    water: 'low',
    waterLabel: 'कम पानी',
    cropType: 'commercial',
    cropTypeLabel: 'व्यावसायिक',
    regions: ['Neemuch', 'Mandsaur', 'Malwa'],
    regionLabel: 'नीमच • मंदसौर • मालवा',
    views: 3150,
    likes: 210,
    featured: false,
    tags: ['कलौंजी', 'औषधीय', 'रबी'],
  },

  {
    id: 12,
    slug: 'opium',
    name: 'अफीम',
    nameEn: 'Opium Poppy',
    category: 'medicinal',
    categoryLabel: 'औषधीय',
    season: 'rabi',
    seasonLabel: 'रबी',
    icon: '🌺',
    description:
      'यह फसल केवल अधिकृत लाइसेंस और लागू सरकारी नियमों के अंतर्गत ही उगाई जा सकती है।',
    idealSoil:
      'इस फसल से संबंधित जानकारी केवल अधिकृत एवं कानूनी कृषि व्यवस्था के संदर्भ में देखें।',
    duration: '140-150 दिन',
    durationDays: 145,
    sowing: '15 अक्टूबर - 15 नवंबर',
    seedRate: '7-8 किग्रा/हेक्टेयर',
    water: 'medium',
    waterLabel: 'मध्यम पानी',
    cropType: 'regulated',
    cropTypeLabel: 'नियंत्रित फसल',
    regions: ['Neemuch', 'Mandsaur'],
    regionLabel: 'नीमच • मंदसौर',
    views: 2980,
    likes: 150,
    featured: false,
    tags: ['अफीम', 'लाइसेंस', 'औषधीय'],
    regulated: true,
  },
];

/* =========================================================
   FILTER DATA
========================================================= */

const categories = [
  { id: 'all', label: 'सभी श्रेणियां', icon: '🌱' },
  { id: 'oilseed', label: 'तिलहन', icon: '🌻' },
  { id: 'pulse', label: 'दलहन', icon: '🫘' },
  { id: 'spice', label: 'मसाला', icon: '🧄' },
  { id: 'cereal', label: 'अनाज', icon: '🌾' },
  { id: 'medicinal', label: 'औषधीय', icon: '🌿' },
];

const seasons = [
  { id: 'all', label: 'सभी मौसम' },
  { id: 'kharif', label: '🌧️ खरीफ' },
  { id: 'rabi', label: '❄️ रबी' },
];

const waterFilters = [
  { id: 'all', label: 'सभी' },
  { id: 'low', label: 'कम पानी' },
  { id: 'medium', label: 'मध्यम पानी' },
  { id: 'high', label: 'अधिक पानी' },
];

const regions = [
  { id: 'all', label: 'सभी क्षेत्र' },
  { id: 'Neemuch', label: 'नीमच' },
  { id: 'Mandsaur', label: 'मंदसौर' },
  { id: 'Malwa', label: 'मालवा' },
];

const cropTypes = [
  { id: 'all', label: 'सभी प्रकार' },
  { id: 'commercial', label: 'व्यावसायिक' },
  { id: 'food', label: 'खाद्यान्न' },
  { id: 'regulated', label: 'नियंत्रित' },
];

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
    return JSON.parse(localStorage.getItem(getStorageKey(key)) || '[]');
  } catch {
    return [];
  }
};

/* =========================================================
   PAGE
========================================================= */

export default function CropsPage() {
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

  const [showFilters, setShowFilters] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  /* =====================================================
     LOAD LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    setLikedCrops(getCropStorage('liked-crops'));
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

  const toggleLike = (slug) => {
    setLikedCrops((previous) => {
      if (previous.includes(slug)) {
        return previous.filter((item) => item !== slug);
      }

      return [...previous, slug];
    });
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

      <section className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  showFilters
                    ? 'border-emerald-600 bg-emerald-700 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                फिल्टर

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
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-emerald-500"
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
            <div className="border-t border-slate-100 py-5">
              <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
                {/* Season */}
                <FilterGroup title="मौसम">
                  <div className="flex flex-wrap gap-2">
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

                {/* Category */}
                <FilterGroup title="श्रेणी">
                  <div className="flex flex-wrap gap-2">
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

                {/* Water */}
                <FilterGroup title="पानी की आवश्यकता">
                  <div className="flex flex-wrap gap-2">
                    {waterFilters.map((water) => (
                      <FilterButton
                        key={water.id}
                        active={selectedWater === water.id}
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

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Result heading */}
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
                onLike={() => toggleLike(crop.slug)}
                onSave={() => toggleSave(crop.slug)}
                onShare={() => shareCrop(crop)}
                onQuickView={() => openQuickView(crop)}
              />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetFilters} />
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
          onLike={() => toggleLike(quickViewCrop.slug)}
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

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
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