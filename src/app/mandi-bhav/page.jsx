'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDynamicMandiRates } from '@/services/mandiApi';
import { 
  Search, MapPin, RefreshCw, Calendar, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Download, Filter, IndianRupee 
} from 'lucide-react';

const locationData = {
  'Madhya Pradesh': {
    'Neemuch': ['Neemuch', 'Manasa', 'Jawad'],
    'Mandsaur': ['Mandsaur', 'Piplia Mandi', 'Daloda'],
    'Indore': ['Indore', 'Sanwer', 'Gautampura'],
    'Ujjain': ['Ujjain', 'Khachrod', 'Mahidpur'],
    'Ratlam': ['Ratlam', 'Jaora', 'Sailana']
  },
  'Rajasthan': {
    'Chittorgarh': ['Chittorgarh', 'Nimbahera', 'Bari Sadri'],
    'Kota': ['Kota', 'Ramganj Mandi', 'Etawa'],
    'Pratapgarh': ['Pratapgarh', 'Chhoti Sadri']
  },
  'Gujarat': {
    'Dahod': ['Dahod', 'Jhalod'],
    'Rajkot': ['Rajkot', 'Gondal']
  }
};

const POPULAR_CROPS = ['लहसुन', 'गेहूं', 'सोयाबीन', 'प्याज', 'सरसों', 'धनिया'];

export default function MandiBhavPage() {
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [selectedDistrict, setSelectedDistrict] = useState('Neemuch');
  const [selectedMandi, setSelectedMandi] = useState('Neemuch');
  
  const [mandiRates, setMandiRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRates();
  }, [selectedMandi]);

  const fetchRates = async () => {
    setLoading(true);
    const rates = await getDynamicMandiRates({
      state: selectedState,
      district: selectedDistrict,
      mandi: selectedMandi
    });
    setMandiRates(rates);
    setLoading(false);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const firstDistrict = Object.keys(locationData[newState])[0];
    setSelectedDistrict(firstDistrict);
    const firstMandi = locationData[newState][firstDistrict][0];
    setSelectedMandi(firstMandi);
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    const firstMandi = locationData[selectedState][newDistrict][0];
    setSelectedMandi(firstMandi);
  };

  const filteredRates = useMemo(() => {
    return mandiRates.filter((item) => {
      const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase());
      if (selectedCategory === 'high') return matchesSearch && item.modalPrice >= 5000;
      if (selectedCategory === 'low') return matchesSearch && item.modalPrice < 5000;
      return matchesSearch;
    });
  }, [mandiRates, searchTerm, selectedCategory]);

  const topCrop = useMemo(() => {
    if (!mandiRates.length) return null;
    return [...mandiRates].sort((a, b) => b.modalPrice - a.modalPrice)[0];
  }, [mandiRates]);

  const exportCSV = () => {
    if (!filteredRates.length) return;
    const headers = 'Crop,Unit,Min Price,Max Price,Modal Price\n';
    const rows = filteredRates
      .map((r) => `"${r.crop}","${r.unit}",${r.minPrice},${r.maxPrice},${r.modalPrice}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMandi}_Mandi_Rates.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> कृषि मित्र - लाइव मंडी भाव
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-2">
            {selectedMandi} मंडी भाव ({selectedDistrict}, {selectedState})
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            कृषि उपज मंडी समिति से दैनिक न्यूनतम, अधिकतम और मॉडल भाव।
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>अपडेट तिथि: {new Date().toLocaleDateString('hi-IN')}</span>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      {topCrop && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium">सबसे महंगी फसल (Top Crop)</p>
              <p className="text-lg font-black text-emerald-950">{topCrop.crop}</p>
            </div>
            <span className="text-base font-extrabold text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-xl">
              ₹{topCrop.modalPrice.toLocaleString('hi-IN')}
            </span>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-sky-800 font-medium">कुल पंजीकृत फसलें</p>
              <p className="text-lg font-black text-sky-950">{mandiRates.length} फसलें</p>
            </div>
            <IndianRupee className="w-8 h-8 text-sky-600 opacity-60" />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-900 font-medium">निर्यात / रिपोर्ट डेटा</p>
              <p className="text-xs text-amber-800">CSV में मंडी रिपोर्ट प्राप्त करें</p>
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              <Download className="w-3.5 h-3.5" /> डाउनलोड
            </button>
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <span>मंडी स्थान व फ़िल्टर का चयन करें (Location & Filters)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">राज्य (State)</label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            >
              {Object.keys(locationData).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">जिला (District)</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            >
              {Object.keys(locationData[selectedState]).map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">मंडी (Mandi)</label>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            >
              {locationData[selectedState][selectedDistrict].map((mnd) => (
                <option key={mnd} value={mnd}>{mnd} मंडी</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Crop Search Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> त्वरित खोज:
          </span>
          {POPULAR_CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => setSearchTerm(crop)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                searchTerm === crop
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-red-600 font-bold hover:underline ml-2"
            >
              फ़िल्टर हटाएँ
            </button>
          )}
        </div>

        {/* Search Row & Refresh */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="फसल का नाम लिखें (उदा. लहसुन, गेहूं)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={fetchRates}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              ताज़ा भाव लोड करें
            </button>
          </div>
        </div>
      </div>

      {/* Mandi Rates Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm font-bold">
            मंडी भाव लोड हो रहे हैं...
          </div>
        ) : filteredRates.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm font-bold">
            कोई फसल नहीं मिली। कृपया नाम बदल कर खोजें।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-800 text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4">फसल का नाम</th>
                  <th className="p-4">इकाई</th>
                  <th className="p-4">न्यूनतम भाव (₹)</th>
                  <th className="p-4">अधिकतम भाव (₹)</th>
                  <th className="p-4 font-black bg-emerald-900">मॉडल भाव (₹)</th>
                  <th className="p-4 text-center">ट्रेंड</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredRates.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-extrabold text-emerald-950 flex items-center gap-2">
                      {item.crop}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{item.unit}</td>
                    <td className="p-4 text-slate-700 font-semibold">
                      ₹{item.minPrice.toLocaleString('hi-IN')}
                    </td>
                    <td className="p-4 text-slate-700 font-semibold">
                      ₹{item.maxPrice.toLocaleString('hi-IN')}
                    </td>
                    <td className="p-4 font-black text-emerald-800 bg-emerald-50/60 text-base">
                      ₹{item.modalPrice.toLocaleString('hi-IN')}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" /> बाज़ार मजबूत
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}