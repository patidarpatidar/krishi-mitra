'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getDynamicMandiRates, getMandiPriceHistory, CROP_MAP } from '@/services/mandiApi';
import { 
  Search, MapPin, RefreshCw, Calendar, TrendingUp, 
  ArrowUpRight, Download, Filter, IndianRupee, LineChart as ChartIcon, Globe
} from 'lucide-react';

// Dynamically import Recharts to avoid SSR/module resolution issues
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });

const PRESET_STATES = ['Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'Maharashtra', 'Punjab', 'Haryana'];
const POPULAR_CROPS = ['लहसुन', 'गेहूं', 'सोयाबीन', 'प्याज', 'सरसों', 'धनिया'];

export default function MandiBhavPage() {
  // Custom filter states
  const [selectedState, setSelectedState] = useState('Madhya Pradesh');
  const [customState, setCustomState] = useState('');
  
  const [selectedDistrict, setSelectedDistrict] = useState('Neemuch');
  const [customDistrict, setCustomDistrict] = useState('');

  const [selectedMandi, setSelectedMandi] = useState('Neemuch');
  const [customMandi, setCustomMandi] = useState('');

  const [selectedCrop, setSelectedCrop] = useState('सोयाबीन');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [mandiRates, setMandiRates] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute active location values (custom input overrides dropdown if typed)
  const activeState = customState.trim() || selectedState;
  const activeDistrict = customDistrict.trim() || selectedDistrict;
  const activeMandi = customMandi.trim() || selectedMandi;

  const fetchRatesAndHistory = useCallback(async () => {
    setLoading(true);

    const [rates, history] = await Promise.all([
      getDynamicMandiRates({
        state: activeState,
        district: activeDistrict,
        mandi: activeMandi,
      }),
      getMandiPriceHistory({
        state: activeState,
        district: activeDistrict,
        mandi: activeMandi,
        crop: selectedCrop,
      })
    ]);

    setMandiRates(rates);
    setChartData(history);
    setLoading(false);
  }, [activeState, activeDistrict, activeMandi, selectedCrop]);

  useEffect(() => {
    fetchRatesAndHistory();
  }, [fetchRatesAndHistory]);

  const filteredRates = useMemo(() => {
    return mandiRates.filter((item) => {
      const query = searchTerm.trim().toLowerCase();
      const mappedEnglish = CROP_MAP[searchTerm.trim()] ? CROP_MAP[searchTerm.trim()].toLowerCase() : '';
      
      const matchesSearch = 
        !query ||
        item.crop.toLowerCase().includes(query) ||
        item.cropEnglish.toLowerCase().includes(query) ||
        (mappedEnglish && item.cropEnglish.toLowerCase().includes(mappedEnglish));

      const itemDate = item.arrivalDate ? new Date(item.arrivalDate) : null;
      let matchesDate = true;

      if (startDate && itemDate) {
        matchesDate = matchesDate && itemDate >= new Date(startDate);
      }
      if (endDate && itemDate) {
        matchesDate = matchesDate && itemDate <= new Date(endDate);
      }

      return matchesSearch && matchesDate;
    });
  }, [mandiRates, searchTerm, startDate, endDate]);

  const topCrop = useMemo(() => {
    if (!mandiRates.length) return null;
    return [...mandiRates].sort((a, b) => b.modalPrice - a.modalPrice)[0];
  }, [mandiRates]);

  const exportCSV = () => {
    if (!filteredRates.length) return;
    const headers = 'Date,Crop,State,District,Mandi,Unit,Min Price,Max Price,Modal Price\n';
    const rows = filteredRates
      .map((r) => `"${r.arrivalDate}","${r.crop}","${r.state}","${r.district}","${r.mandi}","${r.unit}",${r.minPrice},${r.maxPrice},${r.modalPrice}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMandi || 'Mandi'}_Rates.csv`;
    a.click();
  };

  const handleResetFilters = () => {
    setSelectedState('Madhya Pradesh');
    setCustomState('');
    setSelectedDistrict('Neemuch');
    setCustomDistrict('');
    setSelectedMandi('Neemuch');
    setCustomMandi('');
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
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
            {activeMandi ? `${activeMandi} मंडी भाव` : 'समस्त मंडी भाव'}{' '}
            ({activeDistrict ? `${activeDistrict}, ` : ''}{activeState || 'सभी राज्य'})
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            कस्टम फ़िल्टर द्वारा किसी भी राज्य, जिले और मंडी का लाइव डेटा खोजें
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>आज की तिथि: {new Date().toLocaleDateString('hi-IN')}</span>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      {topCrop && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-800 font-medium">उच्चतम भाव फसल</p>
              <p className="text-lg font-black text-emerald-950">{topCrop.crop}</p>
            </div>
            <span className="text-base font-extrabold text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-xl">
              ₹{topCrop.modalPrice.toLocaleString('hi-IN')}
            </span>
          </div>

          <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-sky-800 font-medium">कुल रिकॉर्ड</p>
              <p className="text-lg font-black text-sky-950">{filteredRates.length} फसलें</p>
            </div>
            <IndianRupee className="w-8 h-8 text-sky-600 opacity-60" />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-900 font-medium">रिपोर्ट डाउनलोड</p>
              <p className="text-xs text-amber-800">CSV फ़ाइल प्राप्त करें</p>
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

      {/* Custom Location & Date Filters */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>कस्टम स्थान चयन (Select Any State, District & Mandi)</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-red-600 font-bold hover:underline"
          >
            फ़िल्टर रीसेट करें
          </button>
        </div>

        {/* Dynamic Location Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Custom State Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">राज्य (State)</label>
            <div className="space-y-2">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setCustomState('');
                }}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
              >
                <option value="">-- कोई भी राज्य चुनें --</option>
                {PRESET_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="या कस्टम राज्य का नाम लिखें..."
                value={customState}
                onChange={(e) => setCustomState(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Custom District Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">जिला (District)</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="जिले का नाम लिखें (उदा. Neemuch, Indore)..."
                value={customDistrict || selectedDistrict}
                onChange={(e) => {
                  setCustomDistrict(e.target.value);
                  setSelectedDistrict('');
                }}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Custom Mandi Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">मंडी (Mandi / Market)</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="मंडी का नाम लिखें (उदा. Neemuch, Sanwer)..."
                value={customMandi || selectedMandi}
                onChange={(e) => {
                  setCustomMandi(e.target.value);
                  setSelectedMandi('');
                }}
                className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Date Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">प्रारंभ तिथि (Start Date)</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">अंतिम तिथि (End Date)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-slate-800"
            />
          </div>
        </div>

        {/* Quick Crop Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> त्वरित खोज:
          </span>
          {POPULAR_CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => {
                setSearchTerm(crop);
                setSelectedCrop(crop);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                searchTerm === crop
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        {/* Search Row & Refresh */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="फसल का नाम लिखें (उदा. लहसुन, Soyabean)..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={fetchRatesAndHistory}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            लाइव भाव खोजें
          </button>
        </div>
      </div>

      {/* Live Data Interactive Chart */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ChartIcon className="w-5 h-5 text-emerald-600" />
            <span>लाइव मूल्य रुझान चार्ट ({selectedCrop} - {activeMandi || 'समस्त'})</span>
          </div>
          
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {POPULAR_CROPS.map((crop) => (
              <option key={crop} value={crop}>
                चार्ट बदलें: {crop}
              </option>
            ))}
          </select>
        </div>

        {chartData.length > 0 ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value) => [`₹${value}`, 'मॉडल भाव']}
                  labelFormatter={(label) => `दिनांक: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="modalPrice" 
                  stroke="#047857" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#priceGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs font-semibold">
            चार्ट प्रदर्शित करने के लिए इस फसल का ऐतिहासिक डेटा उपलब्ध नहीं है।
          </div>
        )}
      </div>

      {/* Date-Wise Mandi Rates Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm font-bold">
            मंडी भाव लोड हो रहे हैं...
          </div>
        ) : filteredRates.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm font-bold">
            चयनित स्थान या दिनांक के लिए कोई रिकॉर्ड उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-800 text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-4">दिनांक (Date)</th>
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
                    <td className="p-4 text-slate-600 font-semibold whitespace-nowrap">
                      {item.arrivalDate}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-950">
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