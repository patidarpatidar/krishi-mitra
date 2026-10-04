'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Sun, CloudRain, Wind, Droplets, MapPin, Search, 
  Eye, Loader2, RefreshCw, AlertCircle, Calendar, AreaChart as ChartIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

const PRESET_CITIES = [
  { name: 'Neemuch', hindiName: 'नीमच', lat: 24.4722, lon: 74.8719 },
  { name: 'Mandsaur', hindiName: 'मंदसौर', lat: 24.0721, lon: 75.0692 },
  { name: 'Ratlam', hindiName: 'रतलाम', lat: 23.3315, lon: 75.0367 },
  { name: 'Ujjain', hindiName: 'उज्जैन', lat: 23.1765, lon: 75.7885 },
  { name: 'Indore', hindiName: 'इंदौर', lat: 22.7196, lon: 75.8577 },
];

export default function InteractiveWeatherPage() {
  const [cityName, setCityName] = useState('Neemuch');
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | '5day'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherCondition = (code) => {
    if (code === 0) return 'साफ़ मौसम एवं खिली धूप';
    if (code >= 1 && code <= 3) return 'आंशिक रूप से बादल';
    if (code >= 45 && code <= 48) return 'कोहरा / धुंध';
    if (code >= 51 && code <= 67) return 'हल्की से मध्यम वर्षा';
    if (code >= 80 && code <= 82) return 'तेज बारिश व बौछारें';
    return 'मौसम सामान्य';
  };

  const fetchOpenMeteoFallback = async (queryCity, presetObj) => {
    let lat = presetObj?.lat;
    let lon = presetObj?.lon;
    let displayName = presetObj?.hindiName || queryCity;

    if (!lat || !lon) {
      // Direct search without appended country string to fix API miss
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryCity)}&count=5&language=en`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('शहर नहीं मिला, कृपया सही नाम खोजें (उदा. Neemuch, Indore)');
      }
      
      const match = geoData.results.find(r => r.country_code === 'IN') || geoData.results[0];
      lat = match.latitude;
      lon = match.longitude;
      displayName = match.name;
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata`
    );
    if (!res.ok) throw new Error('मौसम डेटा प्राप्त नहीं हो सका');
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    setWeatherData({
      name: displayName,
      temp: `${Math.round(current.temperature_2m)}°C`,
      minMax: `${Math.round(daily.temperature_2m_max[0])}°C / ${Math.round(daily.temperature_2m_min[0])}°C`,
      condition: getWeatherCondition(current.weather_code),
      humidity: `${current.relative_humidity_2m}%`,
      windSpeed: `${Math.round(current.wind_speed_10m)} km/h`,
      rawWind: current.wind_speed_10m,
      rainProbability: `${daily.precipitation_probability_max[0] || 0}%`,
      visibility: '10.0 km',
    });

    // Generate Chart Data for next 24 Hours
    if (hourly && hourly.time) {
      const formattedHourly = hourly.time.slice(0, 24).map((timeStr, idx) => {
        const hour = new Date(timeStr).getHours();
        return {
          time: `${hour}:00`,
          temp: Math.round(hourly.temperature_2m[idx]),
          rainProb: hourly.precipitation_probability[idx] || 0,
        };
      });
      setChartData(formattedHourly);
    }

    const formattedForecast = daily.time.slice(0, 5).map((dateStr, i) => {
      const dateObj = new Date(dateStr);
      const dayLabel = i === 0 ? 'आज' : dateObj.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return {
        day: dayLabel,
        minMax: `${Math.round(daily.temperature_2m_max[i])}°C / ${Math.round(daily.temperature_2m_min[i])}°C`,
        condition: daily.precipitation_probability_max[i] > 30 ? 'वर्षा की संभावना' : 'साफ़ मौसम',
        rainProb: `${daily.precipitation_probability_max[i] || 0}%`,
        wind: `${Math.round(current.wind_speed_10m)} km/h`,
      };
    });

    setForecastData(formattedForecast);
  };

  const fetchLiveWeather = useCallback(async (queryCity) => {
    setLoading(true);
    setError(null);

    const matchedPreset = PRESET_CITIES.find(
      (c) => c.name.toLowerCase() === queryCity.toLowerCase() || c.hindiName === queryCity
    );

    try {
      if (!API_KEY) {
        await fetchOpenMeteoFallback(queryCity, matchedPreset);
        setLoading(false);
        return;
      }

      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${queryCity},IN&units=metric&lang=hi&appid=${API_KEY}`
      );
      if (!weatherRes.ok) throw new Error('शहर का डेटा प्राप्त नहीं हो सका');
      const current = await weatherRes.json();

      setWeatherData({
        name: current.name,
        temp: `${Math.round(current.main.temp)}°C`,
        minMax: `${Math.round(current.main.temp_max)}°C / ${Math.round(current.main.temp_min)}°C`,
        condition: current.weather[0]?.description || 'साफ़ मौसम',
        humidity: `${current.main.humidity}%`,
        windSpeed: `${Math.round(current.wind.speed * 3.6)} km/h`,
        rawWind: current.wind.speed * 3.6,
        rainProbability: `${current.clouds?.all || 0}%`,
        visibility: `${(current.visibility / 1000).toFixed(1)} km`,
      });

      setLoading(false);
    } catch (err) {
      try {
        await fetchOpenMeteoFallback(queryCity, matchedPreset);
      } catch (fallbackErr) {
        setError(fallbackErr.message || 'मौसम डेटा लोड करने में विफल');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLiveWeather(cityName);
  }, [cityName, fetchLiveWeather]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCityName(searchInput.trim());
      setSearchInput('');
    }
  };

  const getSprayAdvisory = () => {
    if (!weatherData) return null;
    const wind = weatherData.rawWind || 10;

    if (wind > 15) {
      return {
        status: 'सावधानी बरतें (Caution)',
        bg: 'bg-amber-50 border-amber-200 text-amber-950',
        badgeBg: 'bg-amber-200 text-amber-900',
        text: `तेज हवा (${weatherData.windSpeed}) के कारण छिड़काव का घोल उड़ने का डर है। हवा धीमी होने पर शाम को स्प्रे करें।`,
      };
    }
    return {
      status: 'अनुकूल (Safe)',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      badgeBg: 'bg-emerald-200 text-emerald-900',
      text: 'मौसम एवं हवा की गति स्प्रे के लिए बिल्कुल अनुकूल है। कीटनाशक व फफूंदनाशक छिड़काव किया जा सकता है।',
    };
  };

  const advisory = getSprayAdvisory();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-950" /> कृषि मित्र - लाइव मौसम
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2">
              मौसम पूर्वानुमान व कृषि स्प्रे गाइड
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm mt-1">
              लाइव मौसम डेटा के आधार पर सिंचाई एवं कीटनाशक छिड़काव की सही योजना बनाएं।
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="किसी भी शहर/जिले का नाम लिखें..."
              className="w-full pl-10 pr-20 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-sky-200 outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Search className="w-4 h-4 text-sky-200 absolute left-3.5 top-3" />
            <button type="submit" className="absolute right-2 top-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl transition">
              खोजें
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <span className="text-xs text-sky-200 font-medium">लोकप्रिय शहर:</span>
          {PRESET_CITIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCityName(c.name)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                cityName.toLowerCase() === c.name.toLowerCase() || cityName === c.hindiName
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <MapPin className="w-3 h-3" /> {c.hindiName}
            </button>
          ))}
        </div>
      </div>

      {!API_KEY && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-sky-600" />
          <span>
            <strong>सूचना:</strong> वर्तमान में नि:शुल्क Open-Meteo API द्वारा लाइव मौसम प्रदर्शित हो रहा है।
          </span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">लाइव मौसम डेटा लोड हो रहा है...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-3">
          <p className="text-sm font-bold text-red-700">{error}</p>
          <button
            onClick={() => fetchLiveWeather(cityName)}
            className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" /> पुनः प्रयास करें
          </button>
        </div>
      ) : (
        weatherData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-300" />
                      <span className="text-sm font-extrabold tracking-wide text-sky-100 uppercase">
                        {weatherData.name}
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-6xl font-black mt-2 tracking-tight">
                      {weatherData.temp}
                    </h2>
                    <p className="text-xs sm:text-sm text-sky-100 font-medium mt-1">
                      अधिकतम / न्यूनतम: <strong className="text-white">{weatherData.minMax}</strong> — {weatherData.condition}
                    </p>
                  </div>
                  <Sun className="w-16 h-16 sm:w-20 sm:h-20 text-amber-300 shrink-0" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/20 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                    <Droplets className="w-5 h-5 text-sky-200 shrink-0" />
                    <div>
                      <p className="text-sky-200 text-[10px]">आद्रता</p>
                      <p className="font-extrabold text-sm">{weatherData.humidity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                    <Wind className="w-5 h-5 text-sky-200 shrink-0" />
                    <div>
                      <p className="text-sky-200 text-[10px]">हवा की गति</p>
                      <p className="font-extrabold text-sm">{weatherData.windSpeed}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                    <CloudRain className="w-5 h-5 text-sky-200 shrink-0" />
                    <div>
                      <p className="text-sky-200 text-[10px]">वर्षा संभावना</p>
                      <p className="font-extrabold text-sm">{weatherData.rainProbability}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                    <Eye className="w-5 h-5 text-sky-200 shrink-0" />
                    <div>
                      <p className="text-sky-200 text-[10px]">दृश्यता</p>
                      <p className="font-extrabold text-sm">{weatherData.visibility}</p>
                    </div>
                  </div>
                </div>
              </div>

              {advisory && (
                <div className={`${advisory.bg} border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xs`}>
                  <div>
                    <span className={`text-[11px] ${advisory.badgeBg} font-black px-3 py-1 rounded-full uppercase inline-block`}>
                      स्प्रे सलाह: {advisory.status}
                    </span>
                    <h3 className="text-lg font-extrabold mt-3">फसल सुरक्षा एवं स्प्रे परामर्श</h3>
                    <p className="text-xs sm:text-sm mt-2 leading-relaxed">
                      {advisory.text}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 space-y-2 text-xs font-semibold">
                    <div className="flex items-center justify-between">
                      <span>सिंचाई स्थिति:</span>
                      <span className="text-emerald-700 font-bold">मौसम अनुसार अनुकूल</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>हवा की वर्तमान गति:</span>
                      <span className="text-slate-700 font-bold">{weatherData.windSpeed}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Section Tabs */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ChartIcon className="w-5 h-5 text-sky-600" /> 24 घंटे का तापमान एवं वर्षा चार्ट
                </h3>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setActiveTab('chart')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === 'chart' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    24 घंटे ट्रेंड
                  </button>
                  <button
                    onClick={() => setActiveTab('5day')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeTab === '5day' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    5 दिनों का पूर्वानुमान
                  </button>
                </div>
              </div>

              {/* Chart View */}
              {activeTab === 'chart' && chartData.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    आगामी 24 घंटों में तापमान (°C) तथा वर्षा की संभावना (%) का ग्राफ:
                  </p>
                  <div className="h-64 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                          formatter={(val, name) => [name === 'temp' ? `${val}°C` : `${val}%`, name === 'temp' ? 'तापमान' : 'वर्षा संभावना']}
                        />
                        <Area type="monotone" dataKey="temp" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* 5 Day Cards View */}
              {(activeTab === '5day' || chartData.length === 0) && forecastData.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {forecastData.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center space-y-2 hover:border-sky-400 transition">
                      <p className="text-xs font-bold text-slate-700">{item.day}</p>
                      <Sun className="w-7 h-7 text-amber-500 mx-auto" />
                      <p className="text-sm font-black text-slate-900">{item.minMax}</p>
                      <p className="text-[11px] text-slate-600 font-medium capitalize">{item.condition}</p>
                      <div className="pt-2 border-t border-slate-200/60 text-[10px] space-y-1">
                        <p className="text-sky-700 font-bold bg-sky-100 px-2 py-0.5 rounded-full inline-block">
                          वर्षा: {item.rainProb}
                        </p>
                        <p className="text-slate-500 font-semibold block">हवा: {item.wind}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}