'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  Sun, 
  Wind, 
  Droplets, 
  BookOpen,
  ChevronDown,
  Clock,
  Sparkles,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Calculator,
  MessageSquare
} from 'lucide-react';
import { getDynamicMandiRates } from '@/services/mandiApi';
import { getNeemuchWeather } from '@/services/weatherApi';

const PRESET_STATES = [
  'Madhya Pradesh', 
  'Rajasthan', 
  'Gujarat', 
  'Uttar Pradesh', 
  'Maharashtra', 
  'Punjab', 
  'Haryana'
];

const blogPosts = [
  {
    id: 1,
    title: 'लहसुन में थ्रिप्स व पीलापन रोकने के अचूक उपाय',
    excerpt: 'लहसुन की फसल में समय रहते थ्रिप्स और फफूंद जनित रोगों को नियंत्रित करने के वैज्ञानिक तरीके।',
    category: 'फसल सुरक्षा',
    readTime: '4 मिनट',
    date: '28 सित',
    imageBg: 'bg-emerald-100',
    href: '/blog/garlic-thrips-control'
  },
  {
    id: 2,
    title: 'आधुनिक ड्रोन छिड़काव: समय और पैसे दोनों की बचत',
    excerpt: 'कीटनाशकों और तरल उर्वरकों का ड्रोन द्वारा समान छिड़काव करने के फायदे और लागत विश्लेषण।',
    category: 'कृषि तकनीक',
    readTime: '5 मिनट',
    date: '26 सित',
    imageBg: 'bg-sky-100',
    href: '/blog/drone-spraying-guide'
  },
  {
    id: 3,
    title: 'जैविक खाद वर्मीकंपोस्ट घर पर तैयार करने का तरीका',
    excerpt: 'कम लागत में उच्च गुणवत्ता वाली केंचुआ खाद बनाकर मिट्टी की उर्वरा शक्ति कैसे बढ़ाएं।',
    category: 'जैविक खेती',
    readTime: '6 मिनट',
    date: '24 सित',
    imageBg: 'bg-amber-100',
    href: '/blog/vermicompost-guide'
  }
];

const quickTips = [
  {
    id: 1,
    question: 'लहसुन और गेहूं में सिंचाई का सही समय क्या है?',
    answer: 'सिंचाई हमेशा शाम के समय करें। हल्की और नियमित सिंचाई पौधों को तनाव से बचाती है और जड़ों के विकास में सहायक होती है।'
  },
  {
    id: 2,
    question: 'मिट्टी परीक्षण (Soil Testing) क्यों जरूरी है?',
    answer: 'मिट्टी परीक्षण से भूमि में मौजूद पोषक तत्वों की सटीक जानकारी मिलती है, जिससे आप आवश्यकता से अधिक उर्वरक देने से बचते हैं।'
  },
  {
    id: 3,
    question: 'कीटनाशक प्रयोग करते समय क्या सावधानियां रखें?',
    answer: 'हमेशा सुरक्षा मास्क पहनें, हवा के बहाव की दिशा में छिड़काव करें और अनुशंसित मात्रा से अधिक रसायन का प्रयोग न करें।'
  }
];

export default function HomePage() {
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [customState, setCustomState] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState('Neemuch');
  const [customDistrict, setCustomDistrict] = useState('');

  const [selectedMandi, setSelectedMandi] = useState('Neemuch');
  const [customMandi, setCustomMandi] = useState('');

  const [mandiRates, setMandiRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMandi, setLoadingMandi] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Interactive Calculator State
  const [landArea, setLandArea] = useState(1);
  const [selectedCropCalc, setSelectedCropCalc] = useState('wheat');

  const activeState = customState.trim() || selectedState;
  const activeDistrict = customDistrict.trim() || selectedDistrict;
  const activeMandi = customMandi.trim() || selectedMandi;

  const categories = [
    { title: 'सोयाबीन', icon: '🌱', href: '/crops/soyabean', type: 'crop' },
    { title: 'लहसुन', icon: '🧄', href: '/crops/garlic', type: 'crop' },
    { title: 'गेहूं', icon: '🌾', href: '/crops/wheat', type: 'crop' },
    { title: 'चना', icon: '🫘', href: '/crops/gram', type: 'crop' },
    { title: 'मक्का', icon: '🌽', href: '/crops/maize', type: 'crop' },
    { title: 'पशुपालन', icon: '🐄', href: '/livestock', type: 'service' },
    { title: 'जैविक खाद', icon: '🪴', href: '/organic-farming', type: 'service' },
    { title: 'ड्रोन तकनीक', icon: '🚁', href: '/agri-tech', type: 'service' },
  ];

  useEffect(() => {
    async function loadInitialWeather() {
      setLoadingWeather(true);
      const weather = await getNeemuchWeather();
      setWeatherData(weather);
      setLoadingWeather(false);
    }
    loadInitialWeather();
  }, []);

  const fetchMandiRates = useCallback(async () => {
    setLoadingMandi(true);
    const rates = await getDynamicMandiRates({
      state: activeState,
      district: activeDistrict,
      mandi: activeMandi
    });
    setMandiRates(rates || []);
    setLoadingMandi(false);
  }, [activeState, activeDistrict, activeMandi]);

  useEffect(() => {
    fetchMandiRates();
  }, [fetchMandiRates]);

  const filteredRates = mandiRates.filter((item) =>
    item.crop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.cropEnglish?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) => {
    if (activeCategoryTab === 'crops') return cat.type === 'crop';
    if (activeCategoryTab === 'services') return cat.type === 'service';
    return true;
  });

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Simple seed calculator logic (kg/acre estimation)
  const getSeedEstimate = () => {
    const rateMap = { wheat: 40, garlic: 250, soyabean: 30, gram: 30, maize: 8 };
    return (rateMap[selectedCropCalc] || 30) * landArea;
  };

  return (
    <div className="space-y-8 pb-12 bg-slate-50 min-h-screen">
      {/* 1. Hero Section Banner with Weather Preview */}
      <section className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-10 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Main Hero Text */}
          <div className="space-y-4 text-center lg:text-left lg:max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> कृषि मित्र - किसान पोर्टल
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              खेती की हर जानकारी, अब एक ही जगह!
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              सटीक लाइव मौसम पूर्वानुमान, मंडी भाव (Mandi Rates), आधुनिक कृषि तकनीक और कृषि विशेषज्ञों की वैज्ञानिक सलाह।
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/weather"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
              >
                <Sun className="w-4 h-4" /> पूर्ण मौसम पूर्वानुमान
              </Link>
              <a
                href="#mandi-section"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> ताज़ा मंडी भाव
              </a>
            </div>
          </div>

          {/* Integrated Live Weather Widget */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-xl border border-white/20 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider">
                  लाइव मौसम
                </span>
                <h3 className="text-lg font-extrabold mt-1">Neemuch (नीमच)</h3>
                <p className="text-xs text-sky-100">मध्य प्रदेश</p>
              </div>
              <Sun className="w-9 h-9 text-amber-300 animate-spin-slow shrink-0" />
            </div>

            {loadingWeather ? (
              <div className="py-6 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-200" />
                <p className="text-xs text-sky-100">मौसम डेटा लोड हो रहा है...</p>
              </div>
            ) : (
              <>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black">
                    {weatherData?.temperature !== undefined ? `${weatherData.temperature}°C` : '28°C'}
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/30 backdrop-blur-xs text-emerald-100 px-2 py-0.5 rounded-md border border-emerald-400/30">
                    {weatherData?.weatherCode === 0 ? 'साफ़ मौसम' : 'आंशिक बादल'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-xs text-sky-100">
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <Wind className="w-3.5 h-3.5 text-sky-200" />
                    <span>हवा: {weatherData?.windSpeed ?? 12} km/h</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 p-2 rounded-xl">
                    <Droplets className="w-3.5 h-3.5 text-sky-200" />
                    <span>आद्रता: {weatherData?.humidity ?? 45}%</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <Link href="/weather" className="text-[11px] font-bold text-amber-300 hover:underline inline-flex items-center gap-1">
                    स्प्रे सलाह व 5-दिन पूर्वानुमान देखें <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* Main Container Layout (Main Content + Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN (8 Columns on desktop) */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Quick Category Grid */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>🌾</span> मुख्य श्रेणियां (Categories)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">अपनी पसंद के अनुसार फसलें एवं सेवाएं चुनें</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setActiveCategoryTab('all')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeCategoryTab === 'all'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    सभी
                  </button>
                  <button
                    onClick={() => setActiveCategoryTab('crops')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeCategoryTab === 'crops'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    फसलें
                  </button>
                  <button
                    onClick={() => setActiveCategoryTab('services')}
                    className={`px-3 py-1.5 rounded-lg transition ${
                      activeCategoryTab === 'services'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    तकनीक व सेवाएं
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    className="bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/60 hover:border-emerald-300 rounded-2xl p-4 text-center transition flex flex-col items-center justify-center gap-2 shadow-2xs group hover:-translate-y-1"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {cat.icon}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-800">
                      {cat.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Dynamic Flexible Mandi Selector & Live Bhav Table */}
            <section id="mandi-section" className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-black text-slate-900">
                      {activeMandi ? `${activeMandi} मंडी भाव` : 'मंडी भाव'} ({activeDistrict ? `${activeDistrict}, ` : ''}{activeState || 'सभी राज्य'})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    लाइव मंडी भाव एवं आवक (Arrivals) की ताज़ा स्थिति
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-bold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                  </div>
                  <button 
                    onClick={fetchMandiRates}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition"
                    title="रिफ्रेश करें"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingMandi ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Location Selectors & Custom Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">1. राज्य (State)</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setCustomState('');
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">-- राज्य चुनें --</option>
                    {PRESET_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">2. जिला (District)</label>
                  <input
                    type="text"
                    placeholder="जिले का नाम लिखें..."
                    value={customDistrict || selectedDistrict}
                    onChange={(e) => {
                      setCustomDistrict(e.target.value);
                      setSelectedDistrict('');
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">3. मंडी (Mandi)</label>
                  <input
                    type="text"
                    placeholder="मंडी का नाम लिखें..."
                    value={customMandi || selectedMandi}
                    onChange={(e) => {
                      setCustomMandi(e.target.value);
                      setSelectedMandi('');
                    }}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm bg-white font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none shadow-2xs"
                  />
                </div>
              </div>

              {/* Search Filter Input */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="अपनी फसल खोजें (जैसे: लहसुन, सोयाबीन)..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              {/* Mandi Rates Table */}
              {loadingMandi ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-7 h-7 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-600">मंडी भाव लोड हो रहे हैं...</p>
                </div>
              ) : filteredRates.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-xs sm:text-sm text-slate-600">
                  कोई मंडी भाव या आवक डेटा उपलब्ध नहीं है।
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-emerald-800 text-white font-bold">
                      <tr>
                        <th className="p-3.5">फसल / जिंस (Crop)</th>
                        <th className="p-3.5 bg-emerald-900 text-amber-300">कुल आवक (Arrival)</th>
                        <th className="p-3.5">न्यूनतम भाव (Min)</th>
                        <th className="p-3.5">अधिकतम भाव (Max)</th>
                        <th className="p-3.5">मॉडल/औसत भाव</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white font-medium text-slate-800">
                      {filteredRates.map((item, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/50 transition">
                          <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {item.crop}
                          </td>
                          <td className="p-3.5 font-extrabold text-purple-900 bg-purple-50/50">
                            {item.arrivals ? `${item.arrivals.toLocaleString('hi-IN')} बोरी/क्विंटल` : 'उपलब्ध'}
                          </td>
                          <td className="p-3.5 text-slate-600">₹{item.minPrice || item.minRate} / {item.unit || 'क्विंटल'}</td>
                          <td className="p-3.5 text-emerald-700 font-extrabold">₹{item.maxPrice || item.maxRate} / {item.unit || 'क्विंटल'}</td>
                          <td className="p-3.5">
                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold text-xs">
                              ₹{item.modalPrice || item.modalRate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Interactive Calculator Widget */}
            <section className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-md border border-emerald-800/50 space-y-4">
              <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-3">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-amber-300">त्वरित बीज मात्रा कैलकुलेटर (Seed Calculator)</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block mb-1 text-slate-300 font-semibold">फसल चुनें:</label>
                  <select 
                    value={selectedCropCalc}
                    onChange={(e) => setSelectedCropCalc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700 text-white font-bold outline-none"
                  >
                    <option value="wheat">गेहूं (Wheat)</option>
                    <option value="garlic">लहसुन (Garlic)</option>
                    <option value="soyabean">सोयाबीन (Soyabean)</option>
                    <option value="gram">चना (Gram)</option>
                    <option value="maize">मक्का (Maize)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-300 font-semibold">जमीन का क्षेत्रफल (एकड़):</label>
                  <input 
                    type="number" 
                    min="0.5" 
                    step="0.5"
                    value={landArea} 
                    onChange={(e) => setLandArea(Math.max(0.5, parseFloat(e.target.value) || 0))} 
                    className="w-full p-2.5 rounded-xl bg-emerald-900/80 border border-emerald-700 text-white font-bold outline-none"
                  />
                </div>
                <div className="bg-emerald-800/50 p-3 rounded-2xl border border-emerald-700/50 flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] text-emerald-200 uppercase font-semibold">अनुमानित बीज आवश्यकता</span>
                  <span className="text-2xl font-black text-amber-400 mt-0.5">{getSeedEstimate()} किग्रा</span>
                </div>
              </div>
            </section>

          </main>

          {/* SIDEBAR COLUMN (4 Columns on desktop - Latest Blog & Quick Tips Moved Here) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Sidebar Section 1: Latest Blogs */}
            <div id="blogs" className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" /> नवीनतम कृषि ब्लॉग
                </h2>
                <Link href="/blog" className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5">
                  सभी <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <article 
                    key={post.id} 
                    className="border border-slate-100 hover:border-emerald-200 bg-slate-50/50 hover:bg-emerald-50/30 p-3.5 rounded-2xl transition group space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    
                    <h3 className="text-xs font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                      <Link href={post.href}>{post.title}</Link>
                    </h3>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">{post.date}</span>
                      <Link href={post.href} className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        पढ़ें <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar Section 2: Quick Tips / Interactive FAQs */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-slate-900">किसान प्रश्नोत्तरी</h2>
              </div>

              <div className="space-y-2.5">
                {quickTips.map((tip) => (
                  <div key={tip.id} className="border border-slate-200/70 rounded-xl overflow-hidden transition">
                    <button
                      onClick={() => toggleAccordion(tip.id)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs font-extrabold text-slate-800 transition gap-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {tip.question}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${activeAccordion === tip.id ? 'rotate-180' : ''}`} />
                    </button>
                    {activeAccordion === tip.id && (
                      <div className="p-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {tip.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Banner: Expert Consultation CTA */}
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-slate-900" />
                <h3 className="font-black text-sm">विशेषज्ञ सलाह लें</h3>
              </div>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                क्या आपकी फसल में बीमारी या कीट का प्रकोप है? हमारे कृषि वैज्ञानिकों से सीधे सहायता पाएं।
              </p>
              <button className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs">
                निःशुल्क सवाल पूछें
              </button>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}