'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ArrowRight, Eye, SlidersHorizontal, 
  RefreshCw, X, Sparkles, Filter, Calendar, Sprout
} from 'lucide-react';

const cropsData = [
  {
    slug: 'soyabean',
    name: 'सोयाबीन (Soyabean)',
    category: 'oilseed',
    categoryHi: 'तिलहन फसल',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🌱',
    description: 'मध्य प्रदेश की मुख्य खरीफ तिलहन फसल। नीमच-मंदसौर जिले का प्रमुख उत्पादन।',
    idealSoil: 'काली व दोमट मिट्टी (pH 6.5 - 7.5)',
    duration: '90-105 दिन',
    sowingTime: '20 जून - 15 जुलाई',
    seedRate: '75-80 किग्रा/हेक्टेयर'
  },
  {
    slug: 'garlic',
    name: 'लहसुन (Garlic)',
    category: 'spice',
    categoryHi: 'नगदी / मसाला',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🧄',
    description: 'मालवा अंचल की प्रमुख नगदी फसल। जी-2 (G2) व रियावन किस्मों की अत्यधिक मांग।',
    idealSoil: 'बलुई दोमट एवं जल निकासी वाली भूमि',
    duration: '130-150 दिन',
    sowingTime: '15 अक्टूबर - 15 नवंबर',
    seedRate: '500-600 किग्रा कलियां/हेक्टेयर'
  },
  {
    slug: 'wheat',
    name: 'गेहूं (Wheat)',
    category: 'cereal',
    categoryHi: 'अनाज फसल',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌾',
    description: 'लोकवान, शरबती और मालवराज किस्में मालवा क्षेत्र में सर्वाधिक लोकप्रिय हैं।',
    idealSoil: 'गहरी काली व चिकनी दोमट मिट्टी',
    duration: '115-130 दिन',
    sowingTime: '15 नवंबर - 10 दिसंबर',
    seedRate: '100-125 किग्रा/हेक्टेयर'
  },
  {
    slug: 'gram',
    name: 'चना (Gram / Chickpea)',
    category: 'pulse',
    categoryHi: 'दलहन फसल',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '𫞩',
    description: 'कम पानी में बेहतर पैदावार देने वाली दलहनी फसल। विशाल व काबुली चना किस्में।',
    idealSoil: 'हल्की से मध्यम काली मिट्टी',
    duration: '100-110 दिन',
    sowingTime: '15 अक्टूबर - 10 नवंबर',
    seedRate: '75-80 किग्रा/हेक्टेयर'
  },
  {
    slug: 'maize',
    name: 'मक्का (Maize)',
    category: 'cereal',
    categoryHi: 'अनाज फसल',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🌽',
    description: 'पशु आहार एवं औद्योगिक उपयोग हेतु प्रमुख अनाज फसल।',
    idealSoil: 'बलुई दोमट एवं उपजाऊ मिट्टी',
    duration: '85-95 दिन',
    sowingTime: 'जून - जुलाई',
    seedRate: '20-22 किग्रा/हेक्टेयर'
  },
  {
    slug: 'coriander',
    name: 'धनिया (Coriander)',
    category: 'spice',
    categoryHi: 'नगदी / मसाला',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌿',
    description: 'सुगंधित बीजों व हरी पत्तियों हेतु उगाई जाने वाली प्रमुख नकदी मसाला फसल।',
    idealSoil: 'दोमट मिट्टी एवं उचित नमी',
    duration: '90-110 दिन',
    sowingTime: 'अक्टूबर - नवंबर',
    seedRate: '15-20 किग्रा/हेक्टेयर'
  },
  {
    slug: 'mustard',
    name: 'सरसों (Mustard)',
    category: 'oilseed',
    categoryHi: 'तिलहन फसल',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌼',
    description: 'कम सिंचाई में अधिक लाभ देने वाली प्रमुख रबी तिलहन फसल।',
    idealSoil: 'बलुई एवं हल्की मिट्टी',
    duration: '105-120 दिन',
    sowingTime: 'सितंबर - अक्टूबर',
    seedRate: '4-5 किग्रा/हेक्टेयर'
  },
  {
    slug: 'groundnut',
    name: 'मूंगफली (Groundnut)',
    category: 'oilseed',
    categoryHi: 'तिलहन फसल',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🥜',
    description: 'हल्की व बलुई दोमट मिट्टी में उत्कृष्ट पैदावार देने वाली फसल।',
    idealSoil: 'बलुई दोमट मिट्टी',
    duration: '105-120 दिन',
    sowingTime: 'जून - जुलाई',
    seedRate: '100-120 किग्रा/हेक्टेयर'
  },
  {
    slug: 'fenugreek',
    name: 'मेथी (Fenugreek)',
    category: 'spice',
    categoryHi: 'नगदी / मसाला',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌱',
    description: 'औषधीय व मसाला गुणों से भरपूर मालवा अंचल की प्रमुख फसल।',
    idealSoil: 'दोमट एवं हल्की काली मिट्टी',
    duration: '90-105 दिन',
    sowingTime: 'अक्टूबर - नवंबर',
    seedRate: '20-25 किग्रा/हेक्टेयर'
  },
  {
    slug: 'isabgol',
    name: 'ईसबगोल (Isabgol)',
    category: 'medicinal',
    categoryHi: 'औषधीय फसल',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌾',
    description: 'उच्च बाजार मूल्य एवं औषधीय निर्यात हेतु उगाई जाने वाली विशेष फसल।',
    idealSoil: 'बलुई दोमट मिट्टी एवं शुष्क मौसम',
    duration: '110-120 दिन',
    sowingTime: 'नवंबर का प्रथम पखवाड़ा',
    seedRate: '6-8 किग्रा/हेक्टेयर'
  },
  {
    slug: 'kalonji',
    name: 'कलौंजी (Nigella / Kalonji)',
    category: 'medicinal',
    categoryHi: 'औषधीय फसल',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🖤',
    description: 'नीमच व मंदसौर मंडी में विशेष मांग वाली प्रीमियम औषधीय फसल।',
    idealSoil: 'अच्छी जल निकासी वाली दोमट भूमि',
    duration: '130-140 दिन',
    sowingTime: 'अक्टूबर - नवंबर',
    seedRate: '7-8 किग्रा/हेक्टेयर'
  },
  {
    slug: 'opium',
    name: 'अफीम / खसखस (Opium Poppy)',
    category: 'medicinal',
    categoryHi: 'नियंत्रित औषधीय',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌺',
    description: 'केंद्रीय नारकोटिक्स ब्यूरो के लाइसेंस के तहत उगाई जाने वाली विशेष फसल।',
    idealSoil: 'उपजाऊ बलुई दोमट भूमि',
    duration: '140-150 दिन',
    sowingTime: '15 अक्टूबर - 15 नवंबर',
    seedRate: '7-8 किग्रा/हेक्टेयर'
  }
];

export default function CropsPage() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewCrop, setQuickViewCrop] = useState(null);

  const categories = [
    { id: 'all', label: 'सभी श्रेणियां' },
    { id: 'oilseed', label: '🌻 तिलहन' },
    { id: 'pulse', label: '𫞩 दलहन' },
    { id: 'spice', label: '🧄 मसाला' },
    { id: 'cereal', label: '🌾 अनाज' },
    { id: 'medicinal', label: '🌿 औषधीय' },
  ];

  const filteredCrops = useMemo(() => {
    return cropsData.filter((crop) => {
      const matchesSeason = selectedSeason === 'all' || crop.season === selectedSeason;
      const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeason && matchesCategory && matchesSearch;
    });
  }, [selectedSeason, selectedCategory, searchTerm]);

  const resetFilters = () => {
    setSelectedSeason('all');
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-emerald-950 font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> संपूर्ण फसल निर्देशिका
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            फसल निर्देशिका व कृषि गाइड
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            मध्य प्रदेश एवं मालवा अंचल की प्रमुख फसलों की बुआई तकनीक, उन्नत किस्मों, मिट्टी एवं सिंचाई प्रबंधन की विस्तृत जानकारी।
          </p>
        </div>

        <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white">
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 uppercase block font-semibold">कुल दर्ज फसलें</span>
            <span className="text-2xl font-black text-amber-300">{cropsData.length}</span>
          </div>
          <div className="h-8 w-[1px] bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-emerald-200 uppercase block font-semibold">क्षेत्र</span>
            <span className="text-2xl font-black text-amber-300">मालवा / म.प्र.</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="फसल का नाम खोजें (उदा. लहसुन, सोयाबीन, कलौंजी)..."
              className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(selectedSeason !== 'all' || selectedCategory !== 'all' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="px-4 py-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> फ़िल्टर रीसेट करें
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> मौसम:
            </span>
            {[
              { id: 'all', label: 'सभी मौसम' },
              { id: 'kharif', label: '🌧 खरीफ (Kharif)' },
              { id: 'rabi', label: '☀️ रबी (Rabi)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSeason(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedSeason === tab.id
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Cards Grid */}
      {filteredCrops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-lg font-bold text-slate-700">कोई फसल नहीं मिली</p>
          <p className="text-xs text-slate-500 mt-1">कृपया अपनी खोज या फ़िल्टर बदलें।</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
          >
            सभी फ़िल्टर हटाएँ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.slug}
              className="bg-white border border-emerald-100/80 hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-4xl p-2 bg-emerald-50/80 rounded-xl group-hover:scale-110 transition-transform">
                    {crop.icon}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md uppercase">
                      {crop.seasonHi}
                    </span>
                    <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {crop.categoryHi}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {crop.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {crop.description}
                  </p>
                </div>

                {/* Agronomy Highlights Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]"><strong>बुआई:</strong> {crop.sowingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]"><strong>बीज दर:</strong> {crop.seedRate}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">फसल अवधि:</span>
                    <span className="font-semibold text-slate-800">{crop.duration}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setQuickViewCrop(crop)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                  title="त्वरित विवरण देखें"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <Link
                  href={`/crops/${crop.slug}`}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  गाइड व भाव देखें <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewCrop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{quickViewCrop.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{quickViewCrop.name}</h3>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    {quickViewCrop.seasonHi} • {quickViewCrop.categoryHi}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setQuickViewCrop(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {quickViewCrop.description}
            </p>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                <span className="text-slate-600">बुआई का उपयुक्त समय:</span>
                <span className="font-bold text-emerald-900">{quickViewCrop.sowingTime}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/60 pb-1.5">
                <span className="text-slate-600">बीज दर (Seed Rate):</span>
                <span className="font-bold text-emerald-900">{quickViewCrop.seedRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">फसल अवधि:</span>
                <span className="font-bold text-emerald-900">{quickViewCrop.duration}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs">
              <span className="text-slate-400 block font-medium">उपयुक्त मिट्टी</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{quickViewCrop.idealSoil}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setQuickViewCrop(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                बंद करें
              </button>
              <Link
                href={`/crops/${quickViewCrop.slug}`}
                className="flex-1 flex items-center justify-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                लाइव भाव व गाइड देखें <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}