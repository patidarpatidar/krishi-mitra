'use client';

import { useMemo, useState } from 'react';
import {
  HeartHandshake,
  Calculator,
  Stethoscope,
  ShoppingBag,
  ShieldCheck,
  PlusCircle,
  PhoneCall,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  X,
  HelpCircle,
  Coins,
  Search,
  Filter,
  Syringe,
  IndianRupee,
  Milk,
  Wheat,
  Heart,
  MessageCircle,
  MapPin,
  CheckCircle2,
  Circle,
  RotateCcw,
  Scale,
  Droplets,
  Clock,
  BadgeCheck,
  BarChart3,
  PawPrint,
  ClipboardCheck,
  CalendarDays,
  Percent,
  Wallet,
  Sprout,
} from 'lucide-react';

const TABS = [
  { id: 'dairy', label: '🐄 गाय एवं भैंस' },
  { id: 'goat', label: '🐐 बकरी एवं भेड़' },
  { id: 'poultry', label: '🐔 मुर्गी एवं कड़कनाथ' },
  { id: 'aqua', label: '🐟 मत्स्य पालन' },
];

const LIVESTOCK_DATA = [
  {
    id: 1,
    title: 'मुर्रा नस्ल की प्रथम ब्यात भैंस',
    breed: 'मुर्रा',
    animal: 'भैंस',
    yield: '16 लीटर/दिन',
    location: 'नीमच, म.प्र.',
    price: 75000,
    seller: 'रामेश्वर पाटीदार',
    contact: '9826000001',
    verified: true,
    vaccinated: true,
    category: 'dairy',
    age: '4 वर्ष',
    badge: 'सत्यापित विक्रेता',
  },
  {
    id: 2,
    title: 'गीर नस्ल की शुद्ध गाय',
    breed: 'गीर',
    animal: 'गाय',
    yield: '14 लीटर/दिन',
    location: 'मंदसौर, म.प्र.',
    price: 55000,
    seller: 'विष्णु जाट',
    contact: '9425100002',
    verified: true,
    vaccinated: true,
    category: 'dairy',
    age: '5 वर्ष',
    badge: 'टीकाकरण संपन्न',
  },
  {
    id: 3,
    title: 'साहीवाल गाय द्वितीय ब्यात',
    breed: 'साहीवाल',
    animal: 'गाय',
    yield: '12 लीटर/दिन',
    location: 'जावद, म.प्र.',
    price: 62000,
    seller: 'गोपाल पाटीदार',
    contact: '9753000003',
    verified: true,
    vaccinated: false,
    category: 'dairy',
    age: '5 वर्ष',
    badge: 'अच्छी नस्ल',
  },
  {
    id: 4,
    title: 'सिरोही नस्ल की बकरी जोड़ी',
    breed: 'सिरोही',
    animal: 'बकरी',
    yield: 'प्रजनन हेतु',
    location: 'रतलाम, म.प्र.',
    price: 22000,
    seller: 'दिनेश धाकड़',
    contact: '9753000004',
    verified: true,
    vaccinated: true,
    category: 'goat',
    age: '2 वर्ष',
    badge: 'उत्कृष्ट नस्ल',
  },
  {
    id: 5,
    title: 'जमुनापारी बकरी',
    breed: 'जमुनापारी',
    animal: 'बकरी',
    yield: 'प्रजनन हेतु',
    location: 'मंदसौर, म.प्र.',
    price: 18000,
    seller: 'मोहन गुर्जर',
    contact: '9753000005',
    verified: false,
    vaccinated: true,
    category: 'goat',
    age: '1.5 वर्ष',
    badge: 'नई लिस्टिंग',
  },
  {
    id: 6,
    title: 'कड़कनाथ मुर्गियां 10 का समूह',
    breed: 'कड़कनाथ',
    animal: 'मुर्गी',
    yield: 'अंडा व मीट हेतु',
    location: 'झाबुआ, म.प्र.',
    price: 8500,
    seller: 'सुरेश भूरिया',
    contact: '9179000006',
    verified: true,
    vaccinated: true,
    category: 'poultry',
    age: '6 माह',
    badge: 'जैविक पालन',
  },
];

const MELA_DATA = [
  {
    id: 1,
    date: '15 अक्टूबर',
    place: 'नीमच',
    type: 'गाय • भैंस • बकरी',
    status: 'आगामी',
  },
  {
    id: 2,
    date: '22 अक्टूबर',
    place: 'मंदसौर',
    type: 'गाय • भैंस',
    status: 'आगामी',
  },
  {
    id: 3,
    date: '02 नवंबर',
    place: 'रतलाम',
    type: 'बकरी • भेड़',
    status: 'आगामी',
  },
];

const SYMPTOMS = {
  fever: {
    title: 'अचानक तेज बुखार / सुस्ती',
    color: 'amber',
    possible:
      'संक्रमण, गर्मी का तनाव या अन्य बीमारी का संकेत हो सकता है।',
    action:
      'पशु को छायादार, हवादार स्थान पर रखें, पर्याप्त साफ पानी दें और तापमान/अन्य लक्षण नोट करके पशु चिकित्सक से संपर्क करें।',
  },
  mouth: {
    title: 'मुंह/खुर में छाले या अधिक लार',
    color: 'red',
    possible: 'FMD जैसी संक्रामक बीमारी की संभावना हो सकती है।',
    action:
      'बीमार पशु को अन्य पशुओं से अलग रखें और तुरंत पशु चिकित्सक/स्थानीय पशुपालन विभाग से संपर्क करें। स्वयं दवा या एंटीबायोटिक न दें।',
  },
  milk_drop: {
    title: 'दूध में अचानक कमी / थन में सूजन',
    color: 'amber',
    possible: 'Mastitis सहित कई कारण हो सकते हैं।',
    action:
      'दूध की असामान्यता, थन की गर्माहट/सूजन और पशु की स्थिति देखें तथा जल्द पशु चिकित्सक की जांच करवाएं।',
  },
  bloat: {
    title: 'पेट फूलना / अफारा',
    color: 'sky',
    possible: 'Bloat एक आपात स्थिति बन सकती है।',
    action:
      'पशु को शांत रखें और तुरंत पशु चिकित्सक से संपर्क करें। गंभीर अफारे में घरेलू तेल/दवा जबरन न दें।',
  },
};

export default function PashupalanSection() {
  const [activeTab, setActiveTab] = useState('dairy');

  // Feed calculator
  const [animalType, setAnimalType] = useState('cow');
  const [animalWeight, setAnimalWeight] = useState(400);
  const [milkQuantity, setMilkQuantity] = useState(10);

  // Milk calculator
  const [fat, setFat] = useState(6.5);
  const [snf, setSnf] = useState(8.5);
  const [milkRateBase, setMilkRateBase] = useState(7.2);
  const [totalMilkLiters, setTotalMilkLiters] = useState(20);

  // Profit calculator
  const [monthlyMilk, setMonthlyMilk] = useState(600);
  const [sellingRate, setSellingRate] = useState(48);
  const [feedExpense, setFeedExpense] = useState(8500);
  const [otherExpense, setOtherExpense] = useState(2500);

  // Pregnancy
  const [aiDate, setAiDate] = useState('');
  const [pregnancyDays, setPregnancyDays] = useState(283);

  // Market
  const [marketSearch, setMarketSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [favorites, setFavorites] = useState([]);

  // Sell modal
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Symptom
  const [selectedSymptom, setSelectedSymptom] = useState('');

  // Vaccination
  const [vaccinationDate, setVaccinationDate] = useState('');
  const [vaccinationType, setVaccinationType] = useState('fmd');

  // Daily checklist
  const [checklist, setChecklist] = useState({
    water: false,
    milk: false,
    feed: false,
    health: false,
    vaccination: false,
  });

  // Monthly expense
  const [animalsCount, setAnimalsCount] = useState(5);
  const [monthlyFeed, setMonthlyFeed] = useState(12000);
  const [monthlyMedicine, setMonthlyMedicine] = useState(1500);
  const [monthlyOther, setMonthlyOther] = useState(2000);

  // New listing
  const [newListing, setNewListing] = useState({
    title: '',
    breed: '',
    animal: 'गाय',
    yield: '',
    location: '',
    price: '',
    category: 'dairy',
    contact: '',
  });

  const [livestockList, setLivestockList] = useState(LIVESTOCK_DATA);

  /*
   * ---------------------------------------------------------
   * FEED CALCULATOR
   * ---------------------------------------------------------
   */

  const feedCalculation = useMemo(() => {
    let greenPercent = 0.05;
    let dryPercent = 0.015;

    if (animalType === 'buffalo') {
      greenPercent = 0.055;
      dryPercent = 0.016;
    }

    if (animalType === 'goat') {
      greenPercent = 0.04;
      dryPercent = 0.012;
    }

    if (animalType === 'sheep') {
      greenPercent = 0.04;
      dryPercent = 0.012;
    }

    const greenFodder = animalWeight * greenPercent;
    const dryFodder = animalWeight * dryPercent;

    let concentrate = 1.5 + milkQuantity * 0.4;

    if (animalType === 'goat' || animalType === 'sheep') {
      concentrate = 0.4 + milkQuantity * 0.25;
    }

    return {
      green: greenFodder.toFixed(1),
      dry: dryFodder.toFixed(1),
      concentrate: Math.max(concentrate, 0.5).toFixed(1),
      total: (
        greenFodder +
        dryFodder +
        Math.max(concentrate, 0.5)
      ).toFixed(1),
    };
  }, [animalType, animalWeight, milkQuantity]);

  /*
   * ---------------------------------------------------------
   * MILK RATE
   * ---------------------------------------------------------
   */

  const estimatedRatePerLiter = useMemo(() => {
    const value =
      fat * milkRateBase +
      Math.max(snf - 8.5, 0) * 2;

    return Math.max(value, 0).toFixed(2);
  }, [fat, snf, milkRateBase]);

  const dailyMilkIncome = Math.round(
    Number(estimatedRatePerLiter) * totalMilkLiters
  );

  const monthlyMilkIncome = dailyMilkIncome * 30;

  /*
   * ---------------------------------------------------------
   * DAIRY PROFIT
   * ---------------------------------------------------------
   */

  const monthlyRevenue = monthlyMilk * sellingRate;

  const monthlyProfit =
    monthlyRevenue - feedExpense - otherExpense;

  const yearlyProfit = monthlyProfit * 12;

  /*
   * ---------------------------------------------------------
   * PREGNANCY
   * ---------------------------------------------------------
   */

  const pregnancyResult = useMemo(() => {
    if (!aiDate) return null;

    const ai = new Date(`${aiDate}T00:00:00`);

    const delivery = new Date(ai);
    delivery.setDate(delivery.getDate() + Number(pregnancyDays));

    const dry = new Date(delivery);
    dry.setDate(dry.getDate() - 60);

    const today = new Date();

    const totalDays = Number(pregnancyDays);

    const passedDays = Math.max(
      0,
      Math.min(
        totalDays,
        Math.floor((today - ai) / (1000 * 60 * 60 * 24))
      )
    );

    const progress = Math.round(
      (passedDays / totalDays) * 100
    );

    return {
      delivery: delivery.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      dry: dry.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      passedDays,
      remainingDays: Math.max(totalDays - passedDays, 0),
      progress: Math.min(progress, 100),
    };
  }, [aiDate, pregnancyDays]);

  /*
   * ---------------------------------------------------------
   * VACCINATION
   * ---------------------------------------------------------
   */

  const vaccinationResult = useMemo(() => {
    if (!vaccinationDate) return null;

    const base = new Date(`${vaccinationDate}T00:00:00`);

    const next = new Date(base);

    // General reminder interval only.
    // Actual schedule should follow local veterinary guidance.
    const days =
      vaccinationType === 'fmd'
        ? 180
        : vaccinationType === 'hs'
          ? 180
          : 365;

    next.setDate(next.getDate() + days);

    return next.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [vaccinationDate, vaccinationType]);

  /*
   * ---------------------------------------------------------
   * MARKET FILTER
   * ---------------------------------------------------------
   */

  const filteredLivestock = useMemo(() => {
    const search = marketSearch.trim().toLowerCase();

    return livestockList.filter((item) => {
      const categoryMatch =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      const searchMatch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        item.breed.toLowerCase().includes(search) ||
        item.animal.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search);

      const priceMatch = item.price <= maxPrice;

      return categoryMatch && searchMatch && priceMatch;
    });
  }, [
    livestockList,
    selectedCategory,
    marketSearch,
    maxPrice,
  ]);

  /*
   * ---------------------------------------------------------
   * FAVORITE
   * ---------------------------------------------------------
   */

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  /*
   * ---------------------------------------------------------
   * CHECKLIST
   * ---------------------------------------------------------
   */

  const completedTasks = Object.values(checklist).filter(Boolean)
    .length;

  const checklistPercent = Math.round(
    (completedTasks / Object.keys(checklist).length) * 100
  );

  const toggleChecklist = (key) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /*
   * ---------------------------------------------------------
   * ADD LISTING
   * ---------------------------------------------------------
   */

  const handleAddListing = (e) => {
    e.preventDefault();

    if (!newListing.title || !newListing.price || !newListing.contact) {
      return;
    }

    const newItem = {
      id: Date.now(),
      title: newListing.title,
      breed: newListing.breed || 'उल्लेख नहीं',
      animal: newListing.animal,
      yield: newListing.yield || 'उल्लेख नहीं',
      location: newListing.location || 'मध्य प्रदेश',
      price: Number(newListing.price),
      seller: 'किसान मित्र सदस्य',
      contact: newListing.contact,
      verified: false,
      vaccinated: false,
      category: newListing.category,
      age: 'उल्लेख नहीं',
      badge: 'नई लिस्टिंग',
    };

    setLivestockList((prev) => [newItem, ...prev]);

    setIsSellModalOpen(false);

    setNewListing({
      title: '',
      breed: '',
      animal: 'गाय',
      yield: '',
      location: '',
      price: '',
      category: 'dairy',
      contact: '',
    });
  };

  /*
   * ---------------------------------------------------------
   * RESET CALCULATORS
   * ---------------------------------------------------------
   */

  const resetCalculators = () => {
    setAnimalType('cow');
    setAnimalWeight(400);
    setMilkQuantity(10);

    setFat(6.5);
    setSnf(8.5);
    setMilkRateBase(7.2);
    setTotalMilkLiters(20);

    setMonthlyMilk(600);
    setSellingRate(48);
    setFeedExpense(8500);
    setOtherExpense(2500);

    setAiDate('');
    setPregnancyDays(283);
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <section className="bg-slate-950 text-slate-100 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-800">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-6 sm:p-8">

          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6">

            <div className="space-y-3">

              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-[11px] font-bold">
                <HeartHandshake className="w-4 h-4" />
                स्मार्ट पशुपालन एवं डेयरी प्रबंधन
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white">
                किसान मित्र{' '}
                <span className="text-emerald-400">
                  डिजिटल पशुधन हब
                </span>
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
                पशु आहार, दूध आय, डेयरी मुनाफा, गर्भाधान,
                टीकाकरण, दैनिक रिकॉर्ड और पशु खरीद-बिक्री —
                सभी सुविधाएं एक जगह।
              </p>

              <div className="flex flex-wrap gap-2 pt-2">

                <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  🐄 डेयरी
                </span>

                <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  🌾 Feed Planner
                </span>

                <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  💰 Profit Calculator
                </span>

                <span className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                  🐄 पशु मेला
                </span>

              </div>

            </div>

            <a
              href="tel:18001801551"
              className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5"
            >
              <PhoneCall className="w-4 h-4" />
              पशु हेल्पलाइन
            </a>

          </div>
        </div>


        {/* =====================================================
            DAILY FARMER DASHBOARD
        ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">

          <div className="space-y-6">

            {/* Tabs */}

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">

              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);

                    if (tab.id === 'aqua') {
                      setSelectedCategory('all');
                    } else {
                      setSelectedCategory(tab.id);
                    }
                  }}
                  className={`px-4 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                onClick={resetCalculators}
                className="ml-auto shrink-0 px-3 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
                title="Calculator Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

            </div>


            {/* Daily Checklist */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <h2 className="font-black text-white flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                    आज का पशुपालक चेकलिस्ट
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-1">
                    रोज की जरूरी गतिविधियां दर्ज करें।
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{
                        width: `${checklistPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold text-emerald-400">
                    {checklistPercent}%
                  </span>

                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-5">

                {[
                  ['water', '💧 पानी', 'साफ पानी'],
                  ['milk', '🥛 दूध', 'दूध रिकॉर्ड'],
                  ['feed', '🌾 चारा', 'खुराक'],
                  ['health', '❤️ स्वास्थ्य', 'पशु जांच'],
                  ['vaccination', '💉 टीका', 'रिकॉर्ड'],
                ].map(([key, title, subtitle]) => {

                  const checked = checklist[key];

                  return (
                    <button
                      key={key}
                      onClick={() => toggleChecklist(key)}
                      className={`text-left p-3 rounded-xl border transition ${
                        checked
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">
                          {title}
                        </span>

                        {checked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </div>

                      <span className="text-[9px] text-slate-500">
                        {subtitle}
                      </span>
                    </button>
                  );
                })}

              </div>
            </div>


            {/* =================================================
                CALCULATORS
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* FEED CALCULATOR */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                  <h2 className="font-black text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    पशु आहार कैलकुलेटर
                  </h2>

                  <span className="text-[9px] bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-1 rounded-full">
                    अनुमानित
                  </span>

                </div>

                <div className="space-y-5 mt-5">

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">
                      पशु का प्रकार
                    </label>

                    <select
                      value={animalType}
                      onChange={(e) => setAnimalType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      <option value="cow">🐄 गाय</option>
                      <option value="buffalo">🐃 भैंस</option>
                      <option value="goat">🐐 बकरी</option>
                      <option value="sheep">🐑 भेड़</option>
                    </select>
                  </div>

                  <div>

                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">
                        पशु वजन
                      </span>

                      <strong className="text-amber-400">
                        {animalWeight} kg
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="20"
                      max="700"
                      step="5"
                      value={animalWeight}
                      onChange={(e) =>
                        setAnimalWeight(Number(e.target.value))
                      }
                      className="w-full accent-amber-400"
                    />

                  </div>

                  <div>

                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">
                        दूध उत्पादन
                      </span>

                      <strong className="text-emerald-400">
                        {milkQuantity} L/day
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="35"
                      step="1"
                      value={milkQuantity}
                      onChange={(e) =>
                        setMilkQuantity(Number(e.target.value))
                      }
                      className="w-full accent-emerald-400"
                    />

                  </div>

                  <div className="grid grid-cols-3 gap-2">

                    <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                      <Wheat className="w-4 h-4 mx-auto text-emerald-400" />
                      <p className="text-[9px] text-slate-500 mt-1">
                        हरा चारा
                      </p>
                      <strong className="text-sm text-emerald-400">
                        {feedCalculation.green} kg
                      </strong>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                      <Sprout className="w-4 h-4 mx-auto text-amber-400" />
                      <p className="text-[9px] text-slate-500 mt-1">
                        सूखा चारा
                      </p>
                      <strong className="text-sm text-amber-400">
                        {feedCalculation.dry} kg
                      </strong>
                    </div>

                    <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                      <Scale className="w-4 h-4 mx-auto text-sky-400" />
                      <p className="text-[9px] text-slate-500 mt-1">
                        दाना/खली
                      </p>
                      <strong className="text-sm text-sky-400">
                        {feedCalculation.concentrate} kg
                      </strong>
                    </div>

                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-[10px] text-amber-200 leading-relaxed">
                      ⚠️ यह सामान्य अनुमान है। नस्ल, गर्भावस्था,
                      दूध उत्पादन और पशु स्वास्थ्य के अनुसार वास्तविक
                      आहार अलग हो सकता है।
                    </p>
                  </div>

                </div>
              </div>


              {/* MILK CALCULATOR */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                  <h2 className="font-black text-white flex items-center gap-2">
                    <Milk className="w-5 h-5 text-emerald-400" />
                    दूध भाव कैलकुलेटर
                  </h2>

                  <span className="text-[9px] bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-1 rounded-full">
                    Fat + SNF
                  </span>

                </div>

                <div className="space-y-4 mt-5">

                  <div>

                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">
                        Fat %
                      </span>

                      <strong className="text-emerald-400">
                        {fat.toFixed(1)}%
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="3"
                      max="11"
                      step="0.1"
                      value={fat}
                      onChange={(e) =>
                        setFat(Number(e.target.value))
                      }
                      className="w-full accent-emerald-400"
                    />

                  </div>

                  <div>

                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">
                        SNF %
                      </span>

                      <strong className="text-sky-400">
                        {snf.toFixed(1)}%
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="7.5"
                      max="10"
                      step="0.1"
                      value={snf}
                      onChange={(e) =>
                        setSnf(Number(e.target.value))
                      }
                      className="w-full accent-sky-400"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <label className="text-[10px] text-slate-500">
                        Fat multiplier
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        value={milkRateBase}
                        onChange={(e) =>
                          setMilkRateBase(Number(e.target.value))
                        }
                        className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500">
                        दूध लीटर
                      </label>

                      <input
                        type="number"
                        value={totalMilkLiters}
                        onChange={(e) =>
                          setTotalMilkLiters(Number(e.target.value))
                        }
                        className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>

                  </div>

                  <div className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-4">

                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">
                        अनुमानित भाव
                      </span>

                      <strong className="text-lg text-amber-400">
                        ₹{estimatedRatePerLiter}/L
                      </strong>
                    </div>

                    <div className="flex justify-between mt-3 pt-3 border-t border-slate-800">
                      <span className="text-xs text-slate-500">
                        दैनिक आय
                      </span>

                      <strong className="text-lg text-emerald-400">
                        ₹{dailyMilkIncome.toLocaleString('hi-IN')}
                      </strong>
                    </div>

                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        30 दिन
                      </span>

                      <strong className="text-sm text-white">
                        ₹{monthlyMilkIncome.toLocaleString('hi-IN')}
                      </strong>
                    </div>

                  </div>

                  <p className="text-[9px] text-slate-500">
                    ⚠️ वास्तविक दूध भाव स्थानीय डेयरी/संग्रह केंद्र
                    की Fat-SNF rate chart के अनुसार बदल सकता है।
                  </p>

                </div>
              </div>


              {/* PROFIT CALCULATOR */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                  <h2 className="font-black text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    डेयरी मुनाफा कैलकुलेटर
                  </h2>

                  <BarChart3 className="w-5 h-5 text-purple-400" />

                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <NumberInput
                    label="मासिक दूध (L)"
                    value={monthlyMilk}
                    setValue={setMonthlyMilk}
                  />

                  <NumberInput
                    label="बिक्री भाव ₹/L"
                    value={sellingRate}
                    setValue={setSellingRate}
                  />

                  <NumberInput
                    label="चारा खर्च ₹"
                    value={feedExpense}
                    setValue={setFeedExpense}
                  />

                  <NumberInput
                    label="अन्य खर्च ₹"
                    value={otherExpense}
                    setValue={setOtherExpense}
                  />

                </div>

                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 mt-4 space-y-3">

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      मासिक दूध आय
                    </span>

                    <strong className="text-emerald-400">
                      ₹{monthlyRevenue.toLocaleString('hi-IN')}
                    </strong>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      कुल खर्च
                    </span>

                    <strong className="text-red-400">
                      ₹{(feedExpense + otherExpense).toLocaleString('hi-IN')}
                    </strong>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between">

                    <span className="font-bold text-white">
                      अनुमानित मुनाफा
                    </span>

                    <strong
                      className={`text-xl ${
                        monthlyProfit >= 0
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    >
                      ₹{monthlyProfit.toLocaleString('hi-IN')}
                    </strong>

                  </div>

                  <div className="text-[10px] text-slate-500 text-right">
                    वार्षिक अनुमान: ₹
                    {yearlyProfit.toLocaleString('hi-IN')}
                  </div>

                </div>

              </div>


              {/* PREGNANCY */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                  <h2 className="font-black text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-sky-400" />
                    गर्भाधान / प्रसव ट्रैकर
                  </h2>

                  <span className="text-[9px] bg-sky-400/10 text-sky-400 px-2 py-1 rounded-full">
                    AI Tracker
                  </span>

                </div>

                <div className="mt-5 space-y-4">

                  <div>
                    <label className="text-xs text-slate-400">
                      AI / गर्भाधान की तारीख
                    </label>

                    <input
                      type="date"
                      value={aiDate}
                      onChange={(e) => setAiDate(e.target.value)}
                      className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400">
                      अनुमानित गर्भावधि (दिन)
                    </label>

                    <input
                      type="number"
                      value={pregnancyDays}
                      onChange={(e) =>
                        setPregnancyDays(Number(e.target.value))
                      }
                      className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  {pregnancyResult ? (
                    <div className="bg-slate-950 border border-sky-500/20 rounded-2xl p-4">

                      <div className="flex justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500">
                            संभावित प्रसव
                          </span>

                          <p className="text-sm font-black text-emerald-400 mt-1">
                            {pregnancyResult.delivery}
                          </p>
                        </div>

                        <Calendar className="text-sky-400 w-5 h-5" />
                      </div>

                      <div className="mt-4">

                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-500">
                            अनुमानित प्रगति
                          </span>

                          <span className="text-sky-400">
                            {pregnancyResult.progress}%
                          </span>
                        </div>

                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500"
                            style={{
                              width: `${pregnancyResult.progress}%`,
                            }}
                          />
                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-4">

                        <div>
                          <span className="text-[9px] text-slate-500">
                            बाकी अनुमानित दिन
                          </span>

                          <p className="font-bold text-white">
                            {pregnancyResult.remainingDays}
                          </p>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-500">
                            Dry-off
                          </span>

                          <p className="text-xs font-bold text-amber-400">
                            {pregnancyResult.dry}
                          </p>
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-800 rounded-2xl p-5 text-center text-xs text-slate-600">
                      तारीख चुनें
                    </div>
                  )}

                  <p className="text-[9px] text-slate-500">
                    यह केवल अनुमानित कैलेंडर है। वास्तविक प्रसव
                    अवधि पशु/नस्ल के अनुसार बदल सकती है।
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                VACCINATION + MONTHLY EXPENSE
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Vaccination */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

                <h2 className="font-black text-white flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-amber-400" />
                  टीकाकरण रिमाइंडर
                </h2>

                <div className="space-y-3 mt-5">

                  <select
                    value={vaccinationType}
                    onChange={(e) =>
                      setVaccinationType(e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  >
                    <option value="fmd">
                      खुरपका-मुंहपका (FMD)
                    </option>

                    <option value="hs">
                      गलघोंटू (HS)
                    </option>

                    <option value="other">
                      अन्य टीका
                    </option>
                  </select>

                  <input
                    type="date"
                    value={vaccinationDate}
                    onChange={(e) =>
                      setVaccinationDate(e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />

                  {vaccinationResult && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">

                      <p className="text-[10px] text-amber-300">
                        अनुमानित अगला reminder
                      </p>

                      <strong className="text-white block mt-1">
                        {vaccinationResult}
                      </strong>

                    </div>
                  )}

                  <p className="text-[9px] text-slate-500">
                    टीकाकरण का वास्तविक schedule स्थानीय पशु
                    चिकित्सक/पशुपालन विभाग से confirm करें।
                  </p>

                </div>

              </div>


              {/* Monthly Expense */}

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

                <h2 className="font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-sky-400" />
                  मासिक पशुपालन खर्च
                </h2>

                <div className="grid grid-cols-2 gap-3 mt-5">

                  <NumberInput
                    label="पशुओं की संख्या"
                    value={animalsCount}
                    setValue={setAnimalsCount}
                  />

                  <NumberInput
                    label="चारा ₹"
                    value={monthlyFeed}
                    setValue={setMonthlyFeed}
                  />

                  <NumberInput
                    label="दवा/टीका ₹"
                    value={monthlyMedicine}
                    setValue={setMonthlyMedicine}
                  />

                  <NumberInput
                    label="अन्य ₹"
                    value={monthlyOther}
                    setValue={setMonthlyOther}
                  />

                </div>

                <div className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-800">

                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">
                      कुल मासिक खर्च
                    </span>

                    <strong className="text-xl text-red-400">
                      ₹
                      {(
                        monthlyFeed +
                        monthlyMedicine +
                        monthlyOther
                      ).toLocaleString('hi-IN')}
                    </strong>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-slate-500">
                      प्रति पशु
                    </span>

                    <span className="text-xs text-white">
                      ₹
                      {Math.round(
                        (monthlyFeed +
                          monthlyMedicine +
                          monthlyOther) /
                          Math.max(animalsCount, 1)
                      ).toLocaleString('hi-IN')}
                    </span>
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                SYMPTOM CHECKER
            ================================================== */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>

                  <h2 className="font-black text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    पशु स्वास्थ्य सहायता
                  </h2>

                  <p className="text-[11px] text-slate-500 mt-1">
                    लक्षण के आधार पर प्राथमिक सावधानी देखें।
                  </p>

                </div>

                <select
                  value={selectedSymptom}
                  onChange={(e) =>
                    setSelectedSymptom(e.target.value)
                  }
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white"
                >
                  <option value="">
                    -- लक्षण चुनें --
                  </option>

                  <option value="fever">
                    तेज बुखार / सुस्ती
                  </option>

                  <option value="mouth">
                    मुंह/खुर में छाले
                  </option>

                  <option value="milk_drop">
                    दूध कम / थन सूजन
                  </option>

                  <option value="bloat">
                    पेट फूलना / अफारा
                  </option>
                </select>

              </div>

              {selectedSymptom ? (
                <div className="mt-5 bg-slate-950 border border-amber-500/20 rounded-2xl p-5">

                  <div className="flex gap-3">

                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />

                    <div>

                      <h3 className="text-sm font-bold text-white">
                        {SYMPTOMS[selectedSymptom].title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        <strong className="text-slate-200">
                          संभावित स्थिति:
                        </strong>{' '}
                        {SYMPTOMS[selectedSymptom].possible}
                      </p>

                      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                        <strong className="text-emerald-400">
                          क्या करें:
                        </strong>{' '}
                        {SYMPTOMS[selectedSymptom].action}
                      </p>

                    </div>

                  </div>

                  <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-[10px] text-red-200">
                    ⚠️ यह diagnosis या prescription नहीं है।
                    गंभीर/आपात स्थिति में तुरंत पशु चिकित्सक से
                    संपर्क करें।
                  </div>

                </div>
              ) : (
                <div className="mt-5 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-600">
                  लक्षण चुनने पर प्राथमिक सावधानी यहाँ दिखाई जाएगी।
                </div>
              )}

            </div>

          </div>


          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}

          <aside className="space-y-5">

            {/* TODAY PASHU MELA */}

            <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-950 p-5 border border-emerald-500/30 shadow-xl">

              <div className="flex items-center justify-between">

                <div>

                  <span className="text-[9px] uppercase font-bold text-emerald-200">
                    किसान बाजार
                  </span>

                  <h2 className="text-xl font-black text-white mt-1">
                    🐄 पशु मेला
                  </h2>

                </div>

                <ShoppingBag className="w-8 h-8 text-emerald-200" />

              </div>

              <p className="text-[11px] text-emerald-100 mt-3">
                खरीदने या बेचने के लिए उपलब्ध पशुओं की लिस्टिंग देखें।
              </p>

              <div className="space-y-2 mt-5">

                <SidebarAnimalButton
                  emoji="🐃"
                  title="मुर्रा भैंस"
                  subtitle="दूध देने वाली भैंस"
                  onClick={() => {
                    setSelectedCategory('dairy');
                    setMarketSearch('भैंस');
                  }}
                />

                <SidebarAnimalButton
                  emoji="🐄"
                  title="गाय"
                  subtitle="गिर • साहीवाल • अन्य"
                  onClick={() => {
                    setSelectedCategory('dairy');
                    setMarketSearch('गाय');
                  }}
                />

                <SidebarAnimalButton
                  emoji="🐐"
                  title="बकरी / भेड़"
                  subtitle="सिरोही • जमुनापारी"
                  onClick={() => {
                    setSelectedCategory('goat');
                    setMarketSearch('');
                  }}
                />

              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMarketSearch('');
                }}
                className="w-full mt-4 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs py-3 rounded-xl transition"
              >
                सभी पशु देखें →
              </button>

            </div>


            {/* BUY ANIMAL */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

              <h3 className="font-black text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-sky-400" />
                मुझे पशु खरीदना है
              </h3>

              <p className="text-[10px] text-slate-500 mt-1">
                अपनी जरूरत के अनुसार पशु चुनें।
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">

                {[
                  ['dairy', '🐄 गाय/भैंस'],
                  ['goat', '🐐 बकरी'],
                  ['poultry', '🐔 मुर्गी'],
                  ['all', '🔎 सभी'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSelectedCategory(value);
                      setMarketSearch('');
                    }}
                    className={`rounded-xl p-3 text-[10px] border transition ${
                      selectedCategory === value
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>

              <button
                onClick={() => setIsSellModalOpen(true)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                अपना पशु बेचें
              </button>

            </div>


            {/* UPCOMING MELA */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

              <h3 className="font-black text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                आने वाले पशु मेले
              </h3>

              <div className="space-y-3 mt-4">

                {MELA_DATA.map((mela) => (
                  <div
                    key={mela.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3"
                  >

                    <div className="flex justify-between gap-2">

                      <span className="text-xs font-black text-amber-400">
                        {mela.date}
                      </span>

                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {mela.place}
                      </span>

                    </div>

                    <p className="text-[10px] text-slate-400 mt-2">
                      {mela.type}
                    </p>

                  </div>
                ))}

              </div>

              <p className="text-[9px] text-slate-600 mt-4">
                मेला की तारीख/स्थान स्थानीय आयोजक से सत्यापित करें।
              </p>

            </div>


            {/* QUICK STATS */}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">

              <h3 className="font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                पशु बाजार स्थिति
              </h3>

              <div className="grid grid-cols-2 gap-2 mt-4">

                <StatBox
                  value={livestockList.length}
                  label="कुल लिस्टिंग"
                  icon={<PawPrint className="w-4 h-4" />}
                />

                <StatBox
                  value={favorites.length}
                  label="पसंदीदा"
                  icon={<Heart className="w-4 h-4" />}
                />

                <StatBox
                  value={livestockList.filter((x) => x.verified).length}
                  label="Verified"
                  icon={<BadgeCheck className="w-4 h-4" />}
                />

                <StatBox
                  value={livestockList.filter((x) => x.vaccinated).length}
                  label="Vaccinated"
                  icon={<Syringe className="w-4 h-4" />}
                />

              </div>

            </div>


            {/* HELPLINE */}

            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5">

              <div className="flex gap-3">

                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-red-400" />
                </div>

                <div>

                  <h3 className="text-xs font-bold text-white">
                    पशु चिकित्सा सहायता
                  </h3>

                  <p className="text-[10px] text-slate-500 mt-1">
                    गंभीर स्थिति में विशेषज्ञ से संपर्क करें।
                  </p>

                </div>

              </div>

              <a
                href="tel:18001801551"
                className="block text-center mt-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 rounded-xl"
              >
                📞 1800-180-1551
              </a>

            </div>

          </aside>

        </div>


        {/* =====================================================
            MARKETPLACE
        ====================================================== */}

        <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-5 sm:p-7 shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-800 pb-5">

            <div>

              <div className="inline-flex items-center gap-2 text-sky-400 text-[10px] font-bold uppercase">
                <ShoppingBag className="w-4 h-4" />
                Digital Pashu Bazar
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                पशु खरीदें और बेचें
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                आसपास उपलब्ध पशुओं की जानकारी देखें।
              </p>

            </div>

            <button
              onClick={() => setIsSellModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              अपना पशु बेचें
            </button>

          </div>


          {/* Filters */}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-5">

            <div className="relative md:col-span-5">

              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600" />

              <input
                type="text"
                value={marketSearch}
                onChange={(e) =>
                  setMarketSearch(e.target.value)
                }
                placeholder="मुर्रा, गाय, बकरी, नीमच..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-9 pr-4 text-xs text-white outline-none focus:border-emerald-500"
              />

            </div>

            <div className="md:col-span-3">

              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3 text-xs text-white"
              >
                <option value="all">
                  सभी श्रेणियां
                </option>

                <option value="dairy">
                  गाय / भैंस
                </option>

                <option value="goat">
                  बकरी / भेड़
                </option>

                <option value="poultry">
                  मुर्गी
                </option>
              </select>

            </div>

            <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">

              <div className="flex justify-between text-[9px] text-slate-500">
                <span>अधिकतम कीमत</span>
                <strong className="text-amber-400">
                  ₹{maxPrice.toLocaleString('hi-IN')}
                </strong>
              </div>

              <input
                type="range"
                min="5000"
                max="150000"
                step="5000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
                className="w-full accent-amber-400 mt-1"
              />

            </div>

          </div>


          {/* Result count */}

          <div className="flex justify-between items-center mt-5 mb-3">

            <span className="text-[10px] text-slate-500">
              {filteredLivestock.length} पशु उपलब्ध
            </span>

            <button
              onClick={() => {
                setMarketSearch('');
                setSelectedCategory('all');
                setMaxPrice(150000);
              }}
              className="text-[10px] text-slate-500 hover:text-white"
            >
              Filters Reset
            </button>

          </div>


          {/* Cards */}

          {filteredLivestock.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {filteredLivestock.map((item) => {

                const isFavorite = favorites.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-5 transition group"
                  >

                    <div className="flex justify-between gap-3">

                      <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.badge}
                      </span>

                      <button
                        onClick={() =>
                          toggleFavorite(item.id)
                        }
                        className="text-slate-600 hover:text-red-400"
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={
                            isFavorite
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>

                    </div>


                    <div className="mt-4">

                      <h3 className="font-black text-white text-sm">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap gap-1.5 mt-2">

                        <span className="text-[9px] px-2 py-1 rounded-lg bg-slate-900 text-slate-400">
                          {item.breed}
                        </span>

                        <span className="text-[9px] px-2 py-1 rounded-lg bg-slate-900 text-slate-400">
                          {item.age}
                        </span>

                      </div>

                    </div>


                    <div className="grid grid-cols-2 gap-2 mt-4">

                      <div className="bg-slate-900 rounded-xl p-3">

                        <Milk className="w-4 h-4 text-emerald-400" />

                        <p className="text-[9px] text-slate-600 mt-1">
                          क्षमता
                        </p>

                        <strong className="text-[11px] text-white">
                          {item.yield}
                        </strong>

                      </div>

                      <div className="bg-slate-900 rounded-xl p-3">

                        <IndianRupee className="w-4 h-4 text-amber-400" />

                        <p className="text-[9px] text-slate-600 mt-1">
                          कीमत
                        </p>

                        <strong className="text-[11px] text-amber-400">
                          ₹{item.price.toLocaleString('hi-IN')}
                        </strong>

                      </div>

                    </div>


                    <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>


                    <div className="mt-3 flex flex-wrap gap-2">

                      {item.verified && (
                        <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}

                      {item.vaccinated && (
                        <span className="text-[9px] text-sky-400 flex items-center gap-1">
                          <Syringe className="w-3 h-3" />
                          टीकाकरण
                        </span>
                      )}

                    </div>


                    <div className="grid grid-cols-2 gap-2 mt-5">

                      <a
                        href={`tel:${item.contact}`}
                        className="bg-slate-900 hover:bg-emerald-600 text-emerald-400 hover:text-white py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Call
                      </a>

                      <a
                        href={`https://wa.me/91${item.contact}?text=${encodeURIComponent(
                          `नमस्ते, मुझे आपके पशु "${item.title}" में रुचि है। कीमत और अन्य जानकारी बताएं।`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-900 hover:bg-green-600 text-green-400 hover:text-white py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </a>

                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="border border-dashed border-slate-800 rounded-2xl p-10 text-center">

              <PawPrint className="w-10 h-10 mx-auto text-slate-700" />

              <h3 className="font-bold text-white mt-3">
                कोई पशु नहीं मिला
              </h3>

              <p className="text-xs text-slate-600 mt-1">
                Search या price filter बदलकर दोबारा देखें।
              </p>

            </div>
          )}

        </div>


        {/* =====================================================
            BOTTOM FEATURES
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <FeatureCard
            icon={<ShieldCheck />}
            title="टीकाकरण रिकॉर्ड"
            text="पशुओं के टीकाकरण और reminder का रिकॉर्ड रखें।"
          />

          <FeatureCard
            icon={<Syringe />}
            title="AI / प्रजनन"
            text="गर्भाधान और संभावित प्रसव की तारीख track करें।"
          />

          <FeatureCard
            icon={<FileSpreadsheet />}
            title="डेयरी हिसाब"
            text="दूध आय और चारा खर्च का अनुमान लगाएं।"
          />

          <FeatureCard
            icon={<HelpCircle />}
            title="बीमा एवं KCC"
            text="पशु बीमा और KCC जैसी सुविधाओं की जानकारी रखें।"
          />

        </div>

      </div>


      {/* =======================================================
          SELL MODAL
      ======================================================== */}

      {isSellModalOpen && (

        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsSellModalOpen(false)}
        >

          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-black text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  अपना पशु बिक्री हेतु जोड़ें
                </h2>

                <p className="text-[10px] text-slate-500 mt-1">
                  जानकारी भरने के बाद listing तैयार होगी।
                </p>

              </div>

              <button
                onClick={() => setIsSellModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            <form
              onSubmit={handleAddListing}
              className="space-y-4 mt-6"
            >

              <FormInput
                label="पशु का नाम / शीर्षक"
                placeholder="उदा. साहीवाल गाय द्वितीय ब्यात"
                value={newListing.title}
                setValue={(value) =>
                  setNewListing({
                    ...newListing,
                    title: value,
                  })
                }
              />

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="text-[10px] text-slate-400">
                    पशु
                  </label>

                  <select
                    value={newListing.animal}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        animal: e.target.value,
                      })
                    }
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  >
                    <option>गाय</option>
                    <option>भैंस</option>
                    <option>बकरी</option>
                    <option>भेड़</option>
                    <option>मुर्गी</option>
                  </select>

                </div>

                <div>

                  <label className="text-[10px] text-slate-400">
                    श्रेणी
                  </label>

                  <select
                    value={newListing.category}
                    onChange={(e) =>
                      setNewListing({
                        ...newListing,
                        category: e.target.value,
                      })
                    }
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  >
                    <option value="dairy">
                      गाय / भैंस
                    </option>

                    <option value="goat">
                      बकरी / भेड़
                    </option>

                    <option value="poultry">
                      मुर्गी
                    </option>
                  </select>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-3">

                <FormInput
                  label="नस्ल"
                  placeholder="मुर्रा / गिर / सिरोही"
                  value={newListing.breed}
                  setValue={(value) =>
                    setNewListing({
                      ...newListing,
                      breed: value,
                    })
                  }
                />

                <FormInput
                  label="कीमत ₹"
                  type="number"
                  placeholder="65000"
                  value={newListing.price}
                  setValue={(value) =>
                    setNewListing({
                      ...newListing,
                      price: value,
                    })
                  }
                />

              </div>


              <div className="grid grid-cols-2 gap-3">

                <FormInput
                  label="दूध / विशेषता"
                  placeholder="12 लीटर/दिन"
                  value={newListing.yield}
                  setValue={(value) =>
                    setNewListing({
                      ...newListing,
                      yield: value,
                    })
                  }
                />

                <FormInput
                  label="स्थान"
                  placeholder="गांव, जिला"
                  value={newListing.location}
                  setValue={(value) =>
                    setNewListing({
                      ...newListing,
                      location: value,
                    })
                  }
                />

              </div>


              <FormInput
                label="मोबाइल नंबर"
                type="tel"
                placeholder="9876543210"
                value={newListing.contact}
                setValue={(value) =>
                  setNewListing({
                    ...newListing,
                    contact: value,
                  })
                }
              />


              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[10px] text-amber-200">
                ⚠️ केवल सही और सत्य जानकारी दर्ज करें। पशु खरीदने
                से पहले पशु की स्वास्थ्य स्थिति, दस्तावेज और
                टीकाकरण की जानकारी स्वयं सत्यापित करें।
              </div>


              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition"
              >
                लिस्टिंग प्रकाशित करें
              </button>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}


/* ============================================================
   REUSABLE COMPONENTS
============================================================ */

function NumberInput({
  label,
  value,
  setValue,
}) {
  return (
    <div>

      <label className="text-[10px] text-slate-500">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-emerald-500"
      />

    </div>
  );
}


function FormInput({
  label,
  value,
  setValue,
  placeholder,
  type = 'text',
}) {
  return (
    <div>

      <label className="text-[10px] text-slate-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required
        onChange={(e) =>
          setValue(e.target.value)
        }
        className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-700 outline-none focus:border-emerald-500"
      />

    </div>
  );
}


function SidebarAnimalButton({
  emoji,
  title,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-3 text-left transition border border-transparent hover:border-white/10"
    >

      <div className="flex items-center gap-3">

        <span className="text-xl">
          {emoji}
        </span>

        <div className="flex-1">

          <div className="flex justify-between">

            <span className="text-xs font-black text-white">
              {title}
            </span>

            <ChevronRight className="w-4 h-4 text-emerald-200" />

          </div>

          <p className="text-[9px] text-emerald-100 mt-1">
            {subtitle}
          </p>

        </div>

      </div>

    </button>
  );
}


function StatBox({
  value,
  label,
  icon,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">

      <div className="flex items-center justify-between">

        <span className="text-lg font-black text-white">
          {value}
        </span>

        <span className="text-slate-600">
          {icon}
        </span>

      </div>

      <p className="text-[9px] text-slate-600 mt-1">
        {label}
      </p>

    </div>
  );
}


function FeatureCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">

      <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-emerald-400">
        {icon}
      </div>

      <h3 className="text-xs font-black text-white mt-4">
        {title}
      </h3>

      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
        {text}
      </p>

    </div>
  );
}