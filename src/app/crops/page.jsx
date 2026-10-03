'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Sprout, ArrowRight, Sun, CloudRain, ShieldAlert } from 'lucide-react';

const cropsData = [
  {
    slug: 'soyabean',
    name: 'सोयाबीन (Soyabean)',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🌱',
    description: 'मध्य प्रदेश की मुख्य खरीफ तिलहन फसल। नीमच-मंदसौर जिले का प्रमुख उत्पादन।',
    avgPrice: '₹4,650 / क्विंटल',
    idealSoil: 'काली व दोमट मिट्टी (pH 6.5 - 7.5)',
    duration: '90-105 दिन',
  },
  {
    slug: 'garlic',
    name: 'लहसुन (Garlic)',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🧄',
    description: 'मालवा अंचल की प्रमुख नगदी फसल। जी-2 (G2) व रियावन किस्मों की अत्यधिक मांग।',
    avgPrice: '₹12,500 / क्विंटल',
    idealSoil: 'बलुई दोमट एवं जल निकासी वाली भूमि',
    duration: '130-150 दिन',
  },
  {
    slug: 'wheat',
    name: 'गेहूं (Wheat)',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌾',
    description: 'लोकवान, शरबती और मालवराज किस्में मालवा क्षेत्र में सर्वाधिक लोकप्रिय हैं।',
    avgPrice: '₹2,650 / क्विंटल',
    idealSoil: 'गहरी काली व चिकनी दोमट मिट्टी',
    duration: '115-130 दिन',
  },
  {
    slug: 'gram',
    name: 'चना (Gram / Chickpea)',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🫘',
    description: 'कम पानी में बेहतर पैदावार देने वाली दलहनी फसल। विशाल व काबुली चना किस्में।',
    avgPrice: '₹5,700 / क्विंटल',
    idealSoil: 'हल्की से मध्यम काली मिट्टी',
    duration: '100-110 दिन',
  },
  {
    slug: 'maize',
    name: 'मक्का (Maize)',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🌽',
    description: 'पशु आहार एवं औद्योगिक उपयोग हेतु प्रमुख अनाज फसल।',
    avgPrice: '₹2,100 / क्विंटल',
    idealSoil: 'बलुई दोमट एवं उपजाऊ मिट्टी',
    duration: '85-95 दिन',
  },
  {
    slug: 'coriander',
    name: 'धनिया (Coriander)',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌿',
    description: 'सुगंधित बीजों व हरी पत्तियों हेतु उगाई जाने वाली प्रमुख नकदी मसाला फसल।',
    avgPrice: '₹7,400 / क्विंटल',
    idealSoil: 'दोमट मिट्टी एवं उचित नमी',
    duration: '90-110 दिन',
  },
  {
    slug: 'mustard',
    name: 'सरसों (Mustard)',
    season: 'rabi',
    seasonHi: 'रबी',
    icon: '🌼',
    description: 'कम सिंचाई में अधिक लाभ देने वाली प्रमुख रबी तिलहन फसल।',
    avgPrice: '₹5,450 / क्विंटल',
    idealSoil: 'बलुई एवं हल्की मिट्टी',
    duration: '105-120 दिन',
  },
  {
    slug: 'groundnut',
    name: 'मूंगफली (Groundnut)',
    season: 'kharif',
    seasonHi: 'खरीफ',
    icon: '🥜',
    description: 'हल्की व बलुई दोमट मिट्टी में उत्कृष्ट पैदावार देने वाली फसल।',
    avgPrice: '₹6,100 / क्विंटल',
    idealSoil: 'बलुई दोमट मिट्टी',
    duration: '105-120 दिन',
  },
];

export default function CropsPage() {
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = cropsData.filter((crop) => {
    const matchesSeason = selectedSeason === 'all' || crop.season === selectedSeason;
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeason && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            कृषि ज्ञान केंद्र
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
            फसल निर्देशिका व खेती गाइड
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            मध्य प्रदेश एवं मालवा अंचल की प्रमुख फसलों की बुआई, उन्नत किस्में, बीमारी प्रबंधन व मण्डी भाव।
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-emerald-100 rounded-xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Season Filter Tabs */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'सभी फसलें' },
              { id: 'kharif', label: ' खरीफ (Kharif)' },
              { id: 'rabi', label: ' रबी (Rabi)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSeason(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  selectedSeason === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="फसल खोजें (उदा. लहसुन, सोयाबीन)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCrops.map((crop) => (
          <div
            key={crop.slug}
            className="bg-white border border-emerald-100 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-3xl">{crop.icon}</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                  {crop.seasonHi} फसल
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-3">{crop.name}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {crop.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">औसत मंडी भाव:</span>
                  <span className="font-bold text-emerald-800">{crop.avgPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">फसल अवधि:</span>
                  <span className="font-semibold text-slate-800">{crop.duration}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/crops/${crop.slug}`}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200 py-2.5 rounded-xl text-xs font-bold transition"
            >
              संपूर्ण गाइड पढ़ें <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}