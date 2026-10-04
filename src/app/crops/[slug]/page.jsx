'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, ShieldAlert, Droplets, Sun, Calendar, 
  Calculator, Bookmark, Sprout, RefreshCw, TrendingUp, TrendingDown,
  MapPin, Info, ArrowUpRight, Award, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

import { getDynamicMandiRates } from '@/services/mandiApi';

const cropDetailsDatabase = {
  garlic: {
    slug: 'garlic',
    name: 'लहसुन (Garlic)',
    scientificName: 'Allium sativum',
    category: 'नगदी / मसाला फसल',
    season: 'रबी (Rabi)',
    icon: '🧄',
    overview: 'लहसुन मालवा क्षेत्र (विशेषकर नीमच और मंदसौर) की सबसे प्रमुख नगदी फसलों में से एक है। जी-2, रियावन और ऊंटनी लहसुन की किस्में देश भर की मंडियों में प्रसिद्ध हैं।',
    varieties: [
      { name: 'जी-2 (G-2 Garlic)', yield: '100-120 क्विंटल/हेक्टेयर', feature: 'सफेद और मोटे कंद, लंबी भंडारण क्षमता।' },
      { name: 'रियावन सिल्वर', yield: '120-140 क्विंटल/हेक्टेयर', feature: 'तीखा गंध, चमकदार सिल्वर रंग, मंडी में उच्चतम दाम।' },
      { name: 'ऊंटनी लहसुन', yield: '130-150 क्विंटल/हेक्टेयर', feature: 'अत्यधिक आकार, कम कलियां, निर्यात हेतु उपयुक्त।' },
      { name: 'यमुना सफेद (G-1)', yield: '90-110 क्विंटल/हेक्टेयर', feature: 'रोग प्रतिरोधी, सभी मिट्टी प्रकारों हेतु अनुकूल।' }
    ],
    soilRequirement: 'अच्छे जल निकास वाली बलुई दोमट या मध्यम काली मिट्टी। भूमि का pH मान 6.0 से 7.0 उत्तम माना जाता है।',
    sowingTime: '15 अक्टूबर से 15 नवंबर (उपयुक्त तापमान: 20°C - 25°C)',
    waterRequirement: '8 से 10 सिंचाइयां (मृदा प्रकार के अनुसार 10-12 दिन के अंतराल पर)।',
    seedRate: '500-600 किग्रा कलियां प्रति हेक्टेयर',
    harvestingTime: 'मार्च - अप्रैल',
    topDemandMandi: 'नीमच, मंदसौर, पिपलिया मंडी',
    diseases: [
      {
        name: 'बैंगनी धब्बा रोग (Purple Blotch)',
        symptoms: 'पत्तियों पर छोटे बैंगनी रंग के धब्बे बनना, जो बाद में सूख जाती हैं।',
        solution: 'मैन्कोज़ेब (Mancozeb) 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।'
      },
      {
        name: 'थ्रिप्स (Thrips Pest)',
        symptoms: 'पत्तियों का पीला पड़ना और ऊपर की ओर मुड़ना।',
        solution: 'इमिडाक्लोप्रिड (Imidacloprid) 0.5 ml प्रति लीटर पानी में मिलाकर प्रयोग करें।'
      }
    ],
    mandiPrice: {
      min: 7500,
      max: 16200,
      modal: 12500,
      previousModal: 11800, // For price change calculation
      unit: 'क्विंटल',
      mandiName: 'नीमच मंडी'
    },
    // Mock date-wise history (In real app, fetch from backend)
    priceHistory: [
      { date: '28 Sep', min: 7000, max: 15500, modal: 11500 },
      { date: '29 Sep', min: 7200, max: 15800, modal: 11800 },
      { date: '30 Sep', min: 7100, max: 15600, modal: 11600 },
      { date: '01 Oct', min: 7300, max: 16000, modal: 12000 },
      { date: '02 Oct', min: 7400, max: 16100, modal: 12200 },
      { date: '03 Oct', min: 7500, max: 16200, modal: 12500 },
    ]
  },
  soyabean: {
    slug: 'soyabean',
    name: 'सोयाबीन (Soyabean)',
    scientificName: 'Glycine max',
    category: 'खरीफ / तिलहन फसल',
    season: 'खरीफ (Kharif)',
    icon: '🌱',
    overview: 'सोयाबीन मध्य प्रदेश को "सोया राज्य" का दर्जा दिलाती है। यह प्रोटीन एवं खाद्य तेल का मुख्य स्रोत है।',
    varieties: [
      { name: 'JS 20-34', yield: '20-25 क्विंटल/हेक्टेयर', feature: 'कम समय (85-90 दिन) में पकने वाली, सूखा सहनशील।' },
      { name: 'JS 20-29', yield: '25-30 क्विंटल/हेक्टेयर', feature: 'रोग प्रतिरोधी, घनी फलियां।' },
      { name: 'NRC 86', yield: '22-26 क्विंटल/हेक्टेयर', feature: 'पीला मोज़ेक रोग के प्रति अत्यधिक प्रतिरोधी।' }
    ],
    soilRequirement: 'मध्यम से गहरी काली मिट्टी जिसमें जल निकास की उत्तम व्यवस्था हो। pH मान 6.5 - 7.5।',
    sowingTime: '20 जून से 15 जुलाई (मानसून की पहली पर्याप्त वर्षा के बाद)',
    waterRequirement: 'मुख्यतः मानसूनी वर्षा पर निर्भर; फली बनते समय सिंचाई आवश्यक।',
    seedRate: '75-80 किग्रा प्रति हेक्टेयर',
    harvestingTime: 'सितंबर - अक्टूबर',
    topDemandMandi: 'उज्जैन, नीमच, इंदौर मंडी',
    diseases: [
      {
        name: 'पीला मोज़ेक वायरस (Yellow Mosaic)',
        symptoms: 'पत्तियों पर पीले रंग के चकत्ते बनना और वृद्धि रुकना।',
        solution: 'सफेद मक्खी नियंत्रण हेतु थायामेथोक्सम (Thiamethoxam) का प्रयोग करें।'
      }
    ],
    mandiPrice: {
      min: 4200,
      max: 4850,
      modal: 4650,
      previousModal: 4720,
      unit: 'क्विंटल',
      mandiName: 'नीमच मंडी'
    },
    priceHistory: [
      { date: '28 Sep', min: 4100, max: 4750, modal: 4500 },
      { date: '29 Sep', min: 4150, max: 4800, modal: 4580 },
      { date: '30 Sep', min: 4200, max: 4820, modal: 4620 },
      { date: '01 Oct', min: 4250, max: 4900, modal: 4700 },
      { date: '02 Oct', min: 4200, max: 4880, modal: 4720 },
      { date: '03 Oct', min: 4200, max: 4850, modal: 4650 },
    ]
  }
};

export default function CropDetailPage({ params }) {
  const initialCrop = cropDetailsDatabase[params?.slug] || cropDetailsDatabase['garlic'];

  // State Management
  const [crop, setCrop] = useState(initialCrop);
  const [landArea, setLandArea] = useState(1);
  const [landUnit, setLandUnit] = useState('bigha'); // bigha, acre, hectare
  const [activeTab, setActiveTab] = useState('agronomy');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic API Fetching
  useEffect(() => {
    async function fetchLatestPrice() {
      setLoading(true);
      try {
        const rates = await getDynamicMandiRates({ crop: initialCrop.slug });
        
        if (rates && rates.length > 0) {
          const matchedRate = rates.find(
            (r) =>
              r.cropEnglish?.toLowerCase().includes(initialCrop.slug) ||
              r.crop?.toLowerCase().includes(initialCrop.slug)
          ) || rates[0];

          if (matchedRate) {
            setCrop((prev) => ({
              ...prev,
              mandiPrice: {
                min: matchedRate.minPrice || prev.mandiPrice.min,
                max: matchedRate.maxPrice || prev.mandiPrice.max,
                modal: matchedRate.modalPrice || prev.mandiPrice.modal,
                previousModal: prev.mandiPrice.modal,
                unit: matchedRate.unit || prev.mandiPrice.unit,
                mandiName: matchedRate.mandi || prev.mandiPrice.mandiName
              },
            }));
          }
        }
      } catch (err) {
        console.error('Failed to update crop price:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPrice();
  }, [initialCrop.slug]);

  // Price Change Calculation
  const priceDiff = crop.mandiPrice.modal - crop.mandiPrice.previousModal;
  const priceChangePercentage = ((priceDiff / crop.mandiPrice.previousModal) * 100).toFixed(2);
  const isPriceUp = priceDiff >= 0;

  // Land & Yield Calculations
  const calculatedYield = useMemo(() => {
    let multiplier = 10; // Default for 1 Bigha (approx 10 quintal)
    if (landUnit === 'acre') multiplier = 16;
    if (landUnit === 'hectare') multiplier = 40;
    
    return (landArea * multiplier).toFixed(1);
  }, [landArea, landUnit]);

  const estimatedModalIncome = (Number(calculatedYield) * crop.mandiPrice.modal).toLocaleString('hi-IN');
  const estimatedMaxIncome = (Number(calculatedYield) * crop.mandiPrice.max).toLocaleString('hi-IN');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/crops"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" /> फसल निर्देशिका पर लौटें
        </Link>
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
            isBookmarked ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} /> 
          {isBookmarked ? 'सहेजा गया' : 'बुकमार्क करें'}
        </button>
      </div>

      {/* Hero Crop Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl sm:text-5xl p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              {crop.icon}
            </span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">{crop.name}</h1>
              <p className="text-xs text-emerald-200 italic font-mono mt-0.5">{crop.scientificName}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            {crop.overview}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] bg-emerald-950/60 text-emerald-200 px-3 py-1 rounded-full font-semibold border border-emerald-700/50">
              श्रेणी: {crop.category}
            </span>
            <span className="text-[11px] bg-amber-400 text-slate-950 px-3 py-1 rounded-full font-extrabold">
              मौसम: {crop.season}
            </span>
            <span className="text-[11px] bg-white/15 text-white px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-300" /> मुख्य मंडी: {crop.topDemandMandi}
            </span>
          </div>
        </div>

        {/* Live Mandi Rate Highlight Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full lg:w-72 shrink-0 shadow-2xl relative">
          {loading && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs rounded-2xl flex items-center justify-center text-xs text-amber-300 gap-2 font-semibold z-10">
              <RefreshCw className="w-4 h-4 animate-spin" /> अपडेटेड भाव लोड हो रहे हैं...
            </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              ताज़ा मंडी भाव
            </span>
            <span className="text-[10px] text-emerald-200 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {crop.mandiPrice.mandiName}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-300">
              ₹{crop.mandiPrice.modal.toLocaleString('hi-IN')}
            </div>
            <span className="text-xs text-emerald-100">/ {crop.mandiPrice.unit}</span>
          </div>

          {/* Increase / Decrease Rate Badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-md ${
              isPriceUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {isPriceUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPriceUp ? `+₹${priceDiff}` : `-₹${Math.abs(priceDiff)}`} ({priceChangePercentage}%)
            </span>
            <span className="text-[10px] text-emerald-200">कल की तुलना में</span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-black/10 p-2 rounded-lg">
              <span className="text-emerald-300 block text-[10px]">न्यूनतम भाव</span>
              <span className="font-bold text-white">₹{crop.mandiPrice.min.toLocaleString('hi-IN')}</span>
            </div>
            <div className="bg-black/10 p-2 rounded-lg">
              <span className="text-emerald-300 block text-[10px]">अधिकतम भाव</span>
              <span className="font-bold text-amber-300">₹{crop.mandiPrice.max.toLocaleString('hi-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Date-Wise Price Chart Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              दिनांक-वार मंडी भाव ग्राफ (Date-wise Price Trend)
            </h3>
            <p className="text-xs text-slate-500">पिछले कुछ दिनों के मॉडल भाव का उतार-चढ़ाव</p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 self-start sm:self-auto">
            दैनिक अपडेटेड
          </span>
        </div>

        {/* Recharts Area Graph */}
        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crop.priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('hi-IN')}`, 'मॉडल भाव']}
                labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="modal" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Advanced Interactive Income & Yield Estimator */}
      <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-amber-100/30 border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <Calculator className="w-5 h-5 text-amber-700" />
            <h3 className="text-base font-extrabold">संभावित उपज व कमाई कैलकुलेटर</h3>
          </div>
          <span className="text-[11px] font-bold bg-amber-200/60 text-amber-900 px-2.5 py-0.5 rounded-full">
            लाइव भाव आधारित
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">क्षेत्रफल (Area):</label>
              <input
                type="number"
                min="1"
                max="500"
                value={landArea}
                onChange={(e) => setLandArea(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 border border-amber-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">इकाई (Unit):</label>
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value)}
                className="w-full px-3 py-2.5 border border-amber-300 rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="bigha">बीघा (Bigha)</option>
                <option value="acre">एकड़ (Acre)</option>
                <option value="hectare">हेक्टेयर (Hectare)</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 text-center shadow-2xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">अनुमानित कुल उपज</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{calculatedYield} <span className="text-xs font-normal">क्विंटल</span></span>
          </div>

          <div className="bg-emerald-800 text-white p-3.5 rounded-2xl text-center shadow-md">
            <span className="text-[10px] text-emerald-200 font-bold uppercase block">मॉडल भाव पर संभावित आय</span>
            <span className="text-xl font-black text-amber-300 mt-0.5 block">₹{estimatedModalIncome}</span>
          </div>
        </div>

        <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>यदि अधिकतम मंडी भाव (₹{crop.mandiPrice.max}) मिलता है तो संभावित आय: <strong>₹{estimatedMaxIncome}</strong> होगी।</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-6 overflow-x-auto">
        {[
          { id: 'agronomy', label: '🌱 कृषि तकनीक व आवश्यकताएं' },
          { id: 'varieties', label: '🏆 उन्नत किस्में (Varieties)' },
          { id: 'diseases', label: '🛡️ रोग एवं कीट प्रबंधन' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-bold transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'agronomy' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Calendar className="w-4 h-4 text-emerald-600" /> बुआई का उपयुक्त समय
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{crop.sowingTime}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sprout className="w-4 h-4 text-emerald-600" /> बीज दर (Seed Rate)
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{crop.seedRate || 'उपलब्ध नहीं'}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sun className="w-4 h-4 text-emerald-600" /> उपयुक्त मिट्टी एवं pH
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{crop.soilRequirement}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Droplets className="w-4 h-4 text-emerald-600" /> सिंचाई प्रबंधन
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{crop.waterRequirement}</p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Award className="w-4 h-4 text-emerald-600" /> कटाई का समय
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{crop.harvestingTime || 'मौसम अनुसार'}</p>
          </div>
        </div>
      )}

      {activeTab === 'varieties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
          {crop.varieties.map((v, idx) => (
            <div key={idx} className="bg-white border border-emerald-100 p-5 rounded-2xl space-y-2 hover:border-emerald-400 transition shadow-2xs">
              <div className="flex justify-between items-start">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {v.name}
                </h4>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md">
                  औसत पैदावार: {v.yield}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                <strong>विशेषताएं:</strong> {v.feature}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'diseases' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {crop.diseases.map((d, idx) => (
            <div key={idx} className="bg-white border border-rose-200 rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> {d.name}
              </div>
              <p className="text-xs sm:text-sm text-slate-700">
                <strong className="text-slate-900">लक्षण:</strong> {d.symptoms}
              </p>
              <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-900">
                <strong>अनुशंसित उपचार:</strong> {d.solution}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}