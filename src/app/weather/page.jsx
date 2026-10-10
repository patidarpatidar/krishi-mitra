'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  Search,
  Eye,
  Loader2,
  RefreshCw,
  AlertCircle,
  Sunrise,
  Sunset,
  Gauge,
  Thermometer,
  Umbrella,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  CloudSun,
  CalendarDays,
  Clock3,
  X,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const API_KEY =
  process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

/*
|--------------------------------------------------------------------------
| Preset Cities
|--------------------------------------------------------------------------
*/

const PRESET_CITIES = [
  {
    name: 'Neemuch',
    hindiName: 'नीमच',
    district: 'Neemuch',
    state: 'Madhya Pradesh',
    lat: 24.4722,
    lon: 74.8719,
  },
  {
    name: 'Mandsaur',
    hindiName: 'मंदसौर',
    district: 'Mandsaur',
    state: 'Madhya Pradesh',
    lat: 24.0721,
    lon: 75.0692,
  },
  {
    name: 'Ratlam',
    hindiName: 'रतलाम',
    district: 'Ratlam',
    state: 'Madhya Pradesh',
    lat: 23.3315,
    lon: 75.0367,
  },
  {
    name: 'Ujjain',
    hindiName: 'उज्जैन',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    lat: 23.1765,
    lon: 75.7885,
  },
  {
    name: 'Indore',
    hindiName: 'इंदौर',
    district: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lon: 75.8577,
  },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const weatherCodeText = (code) => {
  if (code === 0) return 'साफ़ आसमान';
  if ([1, 2, 3].includes(code)) return 'आंशिक बादल';
  if ([45, 48].includes(code)) return 'कोहरा / धुंध';
  if ([51, 53, 55].includes(code)) return 'हल्की बूंदाबांदी';
  if ([56, 57].includes(code)) return 'ठंडी बूंदाबांदी';
  if ([61, 63, 65].includes(code)) return 'बारिश';
  if ([66, 67].includes(code)) return 'ठंडी बारिश';
  if ([71, 73, 75, 77].includes(code)) return 'बर्फबारी';
  if ([80, 81, 82].includes(code)) return 'तेज बौछार';
  if ([95, 96, 99].includes(code)) return 'गरज-चमक के साथ बारिश';

  return 'मौसम सामान्य';
};

const getWeatherIcon = (code) => {
  if (code === 0) return Sun;

  if ([1, 2, 3].includes(code)) {
    return CloudSun;
  }

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      code
    )
  ) {
    return CloudRain;
  }

  return CloudSun;
};

const formatTime = (dateValue) => {
  if (!dateValue) return '--';

  return new Date(dateValue).toLocaleTimeString('hi-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDay = (dateValue, index) => {
  if (index === 0) return 'आज';

  return new Date(dateValue).toLocaleDateString('hi-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const getWindDirection = (degree) => {
  if (degree === undefined || degree === null) return '--';

  const directions = [
    'उत्तर',
    'उत्तर-पूर्व',
    'पूर्व',
    'दक्षिण-पूर्व',
    'दक्षिण',
    'दक्षिण-पश्चिम',
    'पश्चिम',
    'उत्तर-पश्चिम',
  ];

  return directions[Math.round(degree / 45) % 8];
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function InteractiveWeatherPage() {
  const [cityName, setCityName] = useState('Neemuch');
  const [searchInput, setSearchInput] = useState('');

  const [locationInfo, setLocationInfo] = useState({
    name: 'Neemuch',
    hindiName: 'नीमच',
    district: 'Neemuch',
    state: 'Madhya Pradesh',
    lat: 24.4722,
    lon: 74.8719,
  });

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [activeTab, setActiveTab] = useState('chart');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dataSource, setDataSource] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Find location
  |--------------------------------------------------------------------------
  */

  const findLocation = async (queryCity) => {
    const cleanQuery = queryCity.trim();

    if (!cleanQuery) {
      throw new Error('कृपया शहर का नाम दर्ज करें');
    }

    /*
    |--------------------------------------------------------------------------
    | 1. First check preset cities
    |--------------------------------------------------------------------------
    */

    const preset = PRESET_CITIES.find(
      (city) =>
        city.name.toLowerCase() === cleanQuery.toLowerCase() ||
        city.hindiName === cleanQuery
    );

    if (preset) {
      return preset;
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Open-Meteo geocoding
    |--------------------------------------------------------------------------
    */

    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(cleanQuery)}` +
      `&count=10` +
      `&language=en` +
      `&format=json`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error('शहर खोजने में समस्या आई');
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(
        `“${cleanQuery}” शहर नहीं मिला। उदाहरण: Neemuch, Mandsaur, Indore`
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Prefer India + Madhya Pradesh
    |--------------------------------------------------------------------------
    */

    const indiaResults = geoData.results.filter(
      (item) =>
        item.country_code === 'IN' ||
        item.country === 'India'
    );

    const mpResult = indiaResults.find(
      (item) =>
        item.admin1?.toLowerCase().includes('madhya') ||
        item.admin1?.toLowerCase().includes('pradesh')
    );

    const match =
      mpResult ||
      indiaResults[0] ||
      geoData.results[0];

    return {
      name: match.name,
      hindiName: match.name,
      district: match.admin2 || '',
      state: match.admin1 || '',
      country: match.country || 'India',
      lat: match.latitude,
      lon: match.longitude,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | OpenWeather using coordinates
  |--------------------------------------------------------------------------
  */

  const fetchOpenWeather = async (location) => {
    if (!API_KEY) {
      throw new Error('OpenWeather API key उपलब्ध नहीं है');
    }

    /*
    IMPORTANT:
    Do NOT use q=Neemuch,IN.
    Use coordinates.
    */

    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${location.lat}` +
      `&lon=${location.lon}` +
      `&units=metric` +
      `&lang=hi` +
      `&appid=${API_KEY}`;

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast` +
      `?lat=${location.lat}` +
      `&lon=${location.lon}` +
      `&units=metric` +
      `&lang=hi` +
      `&appid=${API_KEY}`;

    const [weatherResponse, forecastResponse] =
      await Promise.all([
        fetch(weatherUrl, {
          cache: 'no-store',
        }),
        fetch(forecastUrl, {
          cache: 'no-store',
        }),
      ]);

    if (!weatherResponse.ok) {
      throw new Error(
        `OpenWeather error: ${weatherResponse.status}`
      );
    }

    if (!forecastResponse.ok) {
      throw new Error(
        `Forecast error: ${forecastResponse.status}`
      );
    }

    const current = await weatherResponse.json();
    const forecast = await forecastResponse.json();

    /*
    |--------------------------------------------------------------------------
    | Current weather
    |--------------------------------------------------------------------------
    */

    const weather = current.weather?.[0];

    setWeatherData({
      name: location.name,
      hindiName: location.hindiName,
      district: location.district,
      state: location.state,

      temp: Math.round(current.main.temp),

      feelsLike: Math.round(current.main.feels_like),

      minTemp: Math.round(current.main.temp_min),

      maxTemp: Math.round(current.main.temp_max),

      condition:
        weather?.description || 'मौसम सामान्य',

      humidity: current.main.humidity,

      pressure: current.main.pressure,

      windSpeed: Math.round(
        (current.wind?.speed || 0) * 3.6
      ),

      windDegree: current.wind?.deg || 0,

      rainProbability:
        forecast.list?.[0]?.pop !== undefined
          ? Math.round(forecast.list[0].pop * 100)
          : 0,

      visibility: current.visibility
        ? (current.visibility / 1000).toFixed(1)
        : '--',

      sunrise: current.sys?.sunrise
        ? current.sys.sunrise * 1000
        : null,

      sunset: current.sys?.sunset
        ? current.sys.sunset * 1000
        : null,

      icon: weather?.icon || '01d',
    });

    /*
    |--------------------------------------------------------------------------
    | Hourly chart
    |--------------------------------------------------------------------------
    */

    const formattedChart = (forecast.list || [])
      .slice(0, 8)
      .map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString(
          'hi-IN',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }
        ),

        temp: Math.round(item.main.temp),

        rainProb: Math.round(
          (item.pop || 0) * 100
        ),
      }));

    setChartData(formattedChart);

    /*
    |--------------------------------------------------------------------------
    | 5 day forecast
    |--------------------------------------------------------------------------
    */

    const groupedDays = {};

    (forecast.list || []).forEach((item) => {
      const date = new Date(
        item.dt * 1000
      );

      const key = date.toISOString().split('T')[0];

      if (!groupedDays[key]) {
        groupedDays[key] = [];
      }

      groupedDays[key].push(item);
    });

    const days = Object.entries(groupedDays)
      .slice(0, 5)
      .map(([date, items], index) => {
        const temps = items.map(
          (item) => item.main.temp
        );

        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);

        const rainProb = Math.max(
          ...items.map(
            (item) => Math.round((item.pop || 0) * 100)
          )
        );

        const mainWeather =
          items[Math.floor(items.length / 2)]
            ?.weather?.[0];

        return {
          date,
          day: formatDay(date, index),

          minMax:
            `${Math.round(maxTemp)}°C / ` +
            `${Math.round(minTemp)}°C`,

          maxTemp: Math.round(maxTemp),

          minTemp: Math.round(minTemp),

          condition:
            mainWeather?.description ||
            'मौसम सामान्य',

          rainProb,

          wind:
            Math.round(
              ((items[0]?.wind?.speed || 0) * 3.6)
            ) + ' km/h',

          icon:
            mainWeather?.icon ||
            '01d',
        };
      });

    setForecastData(days);

    setDataSource('OpenWeather');
  };

  /*
  |--------------------------------------------------------------------------
  | Open-Meteo fallback
  |--------------------------------------------------------------------------
  */

  const fetchOpenMeteo = async (location) => {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${location.lat}` +
      `&longitude=${location.lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,weather_code,wind_speed_10m,wind_direction_10m` +
      `&hourly=temperature_2m,precipitation_probability,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset` +
      `&timezone=Asia%2FKolkata` +
      `&forecast_days=5`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(
        'मौसम डेटा प्राप्त नहीं हो सका'
      );
    }

    const data = await response.json();

    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    /*
    |--------------------------------------------------------------------------
    | Current
    |--------------------------------------------------------------------------
    */

    setWeatherData({
      name: location.name,
      hindiName: location.hindiName,
      district: location.district,
      state: location.state,

      temp: Math.round(
        current.temperature_2m
      ),

      feelsLike: Math.round(
        current.apparent_temperature
      ),

      minTemp: Math.round(
        daily.temperature_2m_min[0]
      ),

      maxTemp: Math.round(
        daily.temperature_2m_max[0]
      ),

      condition: weatherCodeText(
        current.weather_code
      ),

      humidity:
        current.relative_humidity_2m,

      pressure: Math.round(
        current.pressure_msl
      ),

      windSpeed: Math.round(
        current.wind_speed_10m
      ),

      windDegree:
        current.wind_direction_10m,

      rainProbability:
        daily.precipitation_probability_max?.[0] ||
        0,

      visibility: '--',

      sunrise:
        daily.sunrise?.[0]
          ? new Date(
              daily.sunrise[0]
            ).getTime()
          : null,

      sunset:
        daily.sunset?.[0]
          ? new Date(
              daily.sunset[0]
            ).getTime()
          : null,

      icon: current.weather_code,
    });

    /*
    |--------------------------------------------------------------------------
    | 24 hour chart
    |--------------------------------------------------------------------------
    */

    const chart = hourly.time
      .slice(0, 24)
      .map((time, index) => ({
        time: new Date(
          time
        ).toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),

        temp: Math.round(
          hourly.temperature_2m[index]
        ),

        rainProb:
          hourly.precipitation_probability?.[
            index
          ] || 0,
      }));

    setChartData(chart);

    /*
    |--------------------------------------------------------------------------
    | 5 day forecast
    |--------------------------------------------------------------------------
    */

    const forecast = daily.time.map(
      (date, index) => ({
        date,

        day: formatDay(
          date,
          index
        ),

        minMax:
          `${Math.round(
            daily.temperature_2m_max[index]
          )}°C / ` +
          `${Math.round(
            daily.temperature_2m_min[index]
          )}°C`,

        maxTemp: Math.round(
          daily.temperature_2m_max[index]
        ),

        minTemp: Math.round(
          daily.temperature_2m_min[index]
        ),

        condition: weatherCodeText(
          daily.weather_code[index]
        ),

        rainProb:
          daily.precipitation_probability_max?.[
            index
          ] || 0,

        wind:
          `${Math.round(
            daily.wind_speed_10m_max[index]
          )} km/h`,

        icon:
          daily.weather_code[index],
      })
    );

    setForecastData(forecast);

    setDataSource('Open-Meteo');
  };

  /*
  |--------------------------------------------------------------------------
  | Main fetch
  |--------------------------------------------------------------------------
  */

  const fetchLiveWeather = useCallback(
    async (queryCity) => {
      setLoading(true);
      setError(null);

      try {
        const location =
          await findLocation(queryCity);

        setLocationInfo(location);

        /*
        |--------------------------------------------------------------------------
        | Try OpenWeather first
        |--------------------------------------------------------------------------
        */

        if (API_KEY) {
          try {
            await fetchOpenWeather(
              location
            );

            setLoading(false);
            return;
          } catch (openWeatherError) {
            console.warn(
              'OpenWeather failed:',
              openWeatherError
            );
          }
        }

        /*
        |--------------------------------------------------------------------------
        | Open-Meteo fallback
        |--------------------------------------------------------------------------
        */

        await fetchOpenMeteo(
          location
        );

        setLoading(false);
      } catch (err) {
        console.error(
          'Weather error:',
          err
        );

        setWeatherData(null);
        setForecastData([]);
        setChartData([]);

        setError(
          err.message ||
            'मौसम डेटा लोड करने में समस्या आई'
        );

        setLoading(false);
      }
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Initial load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchLiveWeather(
      cityName
    );
  }, [
    cityName,
    fetchLiveWeather,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();

    const value =
      searchInput.trim();

    if (!value) return;

    setCityName(value);
    setSearchInput('');
  };

  /*
  |--------------------------------------------------------------------------
  | Spray Advisory
  |--------------------------------------------------------------------------
  */

  const getSprayAdvisory = () => {
    if (!weatherData) return null;

    const wind =
      weatherData.windSpeed || 0;

    const rain =
      weatherData.rainProbability || 0;

    if (rain >= 60) {
      return {
        type: 'warning',

        title:
          'आज छिड़काव से बचें',

        text:
          `वर्षा की संभावना ${rain}% है। ` +
          `बारिश से पहले कीटनाशक या फफूंदनाशक का ` +
          `छिड़काव करने से बचना बेहतर है।`,
      };
    }

    if (wind > 15) {
      return {
        type: 'warning',

        title:
          'तेज हवा के कारण सावधानी',

        text:
          `हवा की गति ${wind} km/h है। ` +
          `तेज हवा में स्प्रे का घोल उड़ सकता है।`,
      };
    }

    return {
      type: 'safe',

      title:
        'छिड़काव के लिए मौसम अनुकूल',

      text:
        `वर्तमान हवा की गति ${wind} km/h और ` +
        `वर्षा संभावना ${rain}% है। ` +
        `मौसम सामान्यतः छिड़काव के लिए अनुकूल है।`,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Irrigation Advisory
  |--------------------------------------------------------------------------
  */

  const getIrrigationAdvisory = () => {
    if (!weatherData) return null;

    const rain =
      weatherData.rainProbability;

    if (rain >= 60) {
      return {
        title:
          'सिंचाई रोकने पर विचार करें',

        text:
          `अगले समय में वर्षा की संभावना ${rain}% है। ` +
          `खेत की मिट्टी की नमी देखकर अतिरिक्त सिंचाई से बचें.`,

        status: 'वर्षा की संभावना अधिक',
      };
    }

    if (rain >= 30) {
      return {
        title:
          'सिंचाई से पहले मौसम देखें',

        text:
          `वर्षा संभावना ${rain}% है। ` +
          `मिट्टी की नमी और फसल की अवस्था देखकर निर्णय लें.`,

        status: 'मध्यम संभावना',
      };
    }

    return {
      title:
        'सिंचाई की योजना बना सकते हैं',

      text:
        `वर्षा संभावना ${rain}% है। ` +
        `फसल की अवस्था और मिट्टी की नमी के अनुसार सिंचाई करें.`,

      status: 'वर्षा संभावना कम',
    };
  };

  const advisory =
    getSprayAdvisory();

  const irrigation =
    getIrrigationAdvisory();

  /*
  |--------------------------------------------------------------------------
  | Weather Icon
  |--------------------------------------------------------------------------
  */

  const CurrentIcon =
    weatherData
      ? dataSource === 'Open-Meteo'
        ? getWeatherIcon(
            weatherData.icon
          )
        : weatherData.icon?.includes('01')
        ? Sun
        : weatherData.icon?.includes('09') ||
          weatherData.icon?.includes('10')
        ? CloudRain
        : CloudSun
      : Sun;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-700 text-white rounded-3xl shadow-xl">

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative p-5 sm:p-8">

          <div className="flex flex-col lg:flex-row justify-between gap-6">

            <div>

              <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full text-xs font-black">

                <Sun className="w-4 h-4" />

                कृषि मित्र • LIVE WEATHER

              </div>

              <h1 className="text-2xl sm:text-4xl font-black mt-3">

                मौसम पूर्वानुमान

              </h1>

              <p className="text-sky-100 text-sm mt-2 max-w-2xl">

                किसान भाइयों के लिए तापमान, बारिश,
                हवा, सिंचाई और स्प्रे सलाह की
                आसान जानकारी।

              </p>

            </div>

            {/* Search */}

            <form
              onSubmit={
                handleSearchSubmit
              }
              className="w-full lg:w-96"
            >

              <div className="relative">

                <Search className="absolute left-4 top-3.5 w-5 h-5 text-sky-200" />

                <input
                  value={searchInput}
                  onChange={(e) =>
                    setSearchInput(
                      e.target.value
                    )
                  }
                  placeholder="शहर या जिला खोजें..."
                  className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl pl-11 pr-24 py-3 text-sm text-white placeholder-sky-200 outline-none focus:ring-2 focus:ring-amber-300"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchInput('')
                    }
                    className="absolute right-16 top-3.5 text-sky-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black"
                >
                  खोजें
                </button>

              </div>

            </form>

          </div>

          {/* Popular Cities */}

          <div className="mt-6 pt-4 border-t border-white/10">

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-xs text-sky-200 font-bold">
                लोकप्रिय:
              </span>

              {PRESET_CITIES.map(
                (city) => (
                  <button
                    key={city.name}
                    onClick={() =>
                      setCityName(
                        city.name
                      )
                    }
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      cityName.toLowerCase() ===
                      city.name.toLowerCase()
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />

                    {city.hindiName}

                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          API INFO
      ========================================================= */}

      <div className="flex flex-col sm:flex-row justify-between gap-3">

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3">

          <CheckCircle2 className="w-4 h-4 text-emerald-600" />

          <div className="text-xs">

            <span className="font-bold text-slate-700">
              Data Source:
            </span>

            <span className="ml-1 text-slate-500">
              {dataSource || 'Loading...'}
            </span>

          </div>

        </div>

        <button
          onClick={() =>
            fetchLiveWeather(
              cityName
            )
          }
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-3 rounded-2xl text-xs font-bold"
        >

          <RefreshCw
            className={`w-4 h-4 ${
              loading
                ? 'animate-spin'
                : ''
            }`}
          />

          मौसम अपडेट करें

        </button>

      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5">

          <div className="flex gap-3">

            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />

            <div>

              <h3 className="font-black text-red-800">
                मौसम डेटा उपलब्ध नहीं
              </h3>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>

              <button
                onClick={() =>
                  fetchLiveWeather(
                    cityName
                  )
                }
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                पुनः प्रयास करें
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================
          LOADING
      ========================================================= */}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center">

          <Loader2 className="w-10 h-10 text-sky-600 animate-spin mx-auto" />

          <p className="mt-4 font-bold text-slate-700">
            {cityName} का लाइव मौसम लोड हो रहा है...
          </p>

          <p className="text-xs text-slate-400 mt-1">
            कृपया कुछ सेकंड प्रतीक्षा करें
          </p>

        </div>
      )}

      {/* =========================================================
          WEATHER CONTENT
      ========================================================= */}

      {!loading &&
        weatherData && (
          <div className="space-y-6">

            {/* =====================================================
                CURRENT WEATHER
            ===================================================== */}

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Main */}

              <div className="lg:col-span-2 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">

                <div className="flex justify-between gap-4">

                  <div>

                    <div className="flex items-center gap-2 text-sky-100 text-sm font-bold">

                      <MapPin className="w-4 h-4 text-amber-300" />

                      {weatherData.name}

                    </div>

                    <p className="text-xs text-sky-200 mt-1">

                      {weatherData.district &&
                        `${weatherData.district}, `}
                      {weatherData.state}

                    </p>

                    <div className="flex items-center gap-3 mt-5">

                      <CurrentIcon className="w-14 h-14 text-amber-300" />

                      <div>

                        <div className="text-5xl sm:text-7xl font-black">

                          {weatherData.temp}°C

                        </div>

                        <p className="text-sm text-sky-100 mt-1">

                          {weatherData.condition}

                        </p>

                      </div>

                    </div>

                    <div className="mt-4 text-sm text-sky-100">

                      महसूस हो रहा है{' '}

                      <strong className="text-white">
                        {weatherData.feelsLike}°C
                      </strong>

                    </div>

                  </div>

                  <div className="hidden sm:block">

                    <span className="inline-flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold">

                      <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />

                      LIVE

                    </span>

                  </div>

                </div>

                {/* Stats */}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-5 border-t border-white/20">

                  <WeatherStat
                    icon={
                      <Droplets />
                    }
                    label="आद्रता"
                    value={`${weatherData.humidity}%`}
                  />

                  <WeatherStat
                    icon={
                      <Wind />
                    }
                    label="हवा"
                    value={`${weatherData.windSpeed} km/h`}
                  />

                  <WeatherStat
                    icon={
                      <CloudRain />
                    }
                    label="बारिश"
                    value={`${weatherData.rainProbability}%`}
                  />

                  <WeatherStat
                    icon={
                      <Eye />
                    }
                    label="दृश्यता"
                    value={`${weatherData.visibility} km`}
                  />

                </div>

              </div>

              {/* Right info */}

              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">

                <h3 className="font-black text-slate-900">
                  आज की मौसम जानकारी
                </h3>

                <div className="space-y-3 mt-4">

                  <InfoRow
                    icon={
                      <Thermometer />
                    }
                    label="अधिकतम तापमान"
                    value={`${weatherData.maxTemp}°C`}
                  />

                  <InfoRow
                    icon={
                      <Thermometer />
                    }
                    label="न्यूनतम तापमान"
                    value={`${weatherData.minTemp}°C`}
                  />

                  <InfoRow
                    icon={
                      <Gauge />
                    }
                    label="वायुदाब"
                    value={`${weatherData.pressure} hPa`}
                  />

                  <InfoRow
                    icon={
                      <Navigation />
                    }
                    label="हवा की दिशा"
                    value={getWindDirection(
                      weatherData.windDegree
                    )}
                  />

                  <InfoRow
                    icon={
                      <Sunrise />
                    }
                    label="सूर्योदय"
                    value={formatTime(
                      weatherData.sunrise
                    )}
                  />

                  <InfoRow
                    icon={
                      <Sunset />
                    }
                    label="सूर्यास्त"
                    value={formatTime(
                      weatherData.sunset
                    )}
                  />

                </div>

              </div>

            </section>

            {/* =====================================================
                AGRICULTURE ADVISORY
            ===================================================== */}

            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Spray */}

              <div
                className={`rounded-3xl border p-6 ${
                  advisory.type ===
                  'safe'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >

                <div className="flex items-start gap-3">

                  {advisory.type ===
                  'safe' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  )}

                  <div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      कृषि सलाह
                    </span>

                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {advisory.title}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed mt-2">
                      {advisory.text}
                    </p>

                  </div>

                </div>

              </div>

              {/* Irrigation */}

              <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6">

                <div className="flex items-start gap-3">

                  <Sprout className="w-6 h-6 text-sky-600 shrink-0" />

                  <div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-600">
                      सिंचाई सलाह
                    </span>

                    <h3 className="text-lg font-black text-slate-900 mt-1">
                      {irrigation.title}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed mt-2">
                      {irrigation.text}
                    </p>

                    <div className="mt-3 inline-flex bg-white px-3 py-1.5 rounded-full text-xs font-bold text-sky-700">
                      {irrigation.status}
                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================================
                FORECAST TABS
            ===================================================== */}

            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm">

              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-100 pb-4">

                <div>

                  <h2 className="font-black text-slate-900">
                    मौसम पूर्वानुमान
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    {weatherData.name} के लिए मौसम ट्रेंड
                  </p>

                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">

                  <button
                    onClick={() =>
                      setActiveTab(
                        'chart'
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      activeTab ===
                      'chart'
                        ? 'bg-white text-sky-700 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    24 घंटे
                  </button>

                  <button
                    onClick={() =>
                      setActiveTab(
                        '5day'
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-xs font-bold ${
                      activeTab ===
                      '5day'
                        ? 'bg-white text-sky-700 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    5 दिन
                  </button>

                </div>

              </div>

              {/* Chart */}

              {activeTab ===
                'chart' &&
                chartData.length >
                  0 && (
                  <div className="mt-5">

                    <div className="flex items-center gap-4 text-xs font-bold mb-3">

                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-sky-500" />
                        तापमान
                      </span>

                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-blue-200" />
                        वर्षा संभावना
                      </span>

                    </div>

                    <div className="h-72 w-full">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <AreaChart
                          data={
                            chartData
                          }
                          margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                          }}
                        >

                          <defs>

                            <linearGradient
                              id="temperatureGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >

                              <stop
                                offset="5%"
                                stopColor="#0284c7"
                                stopOpacity={
                                  0.45
                                }
                              />

                              <stop
                                offset="95%"
                                stopColor="#0284c7"
                                stopOpacity={
                                  0
                                }
                              />

                            </linearGradient>

                          </defs>

                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                          />

                          <XAxis
                            dataKey="time"
                            tick={{
                              fontSize: 10,
                            }}
                          />

                          <YAxis
                            tick={{
                              fontSize: 10,
                            }}
                          />

                          <Tooltip
                            contentStyle={{
                              borderRadius: 14,
                              border:
                                '1px solid #e2e8f0',
                              fontSize: 12,
                            }}
                            formatter={(
                              value,
                              name
                            ) => [
                              name ===
                              'temp'
                                ? `${value}°C`
                                : `${value}%`,
                              name ===
                              'temp'
                                ? 'तापमान'
                                : 'वर्षा',
                            ]}
                          />

                          <Area
                            type="monotone"
                            dataKey="temp"
                            stroke="#0284c7"
                            strokeWidth={3}
                            fill="url(#temperatureGradient)"
                          />

                        </AreaChart>

                      </ResponsiveContainer>

                    </div>

                  </div>
                )}

              {/* 5 Day */}

              {activeTab ===
                '5day' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">

                  {forecastData.map(
                    (
                      item,
                      index
                    ) => {
                      const Icon =
                        dataSource ===
                        'Open-Meteo'
                          ? getWeatherIcon(
                              item.icon
                            )
                          : item.icon?.includes(
                              '01'
                            )
                          ? Sun
                          : item.icon?.includes(
                              '09'
                            ) ||
                            item.icon?.includes(
                              '10'
                            )
                          ? CloudRain
                          : CloudSun;

                      return (
                        <div
                          key={
                            item.date ||
                            index
                          }
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-sky-300 hover:shadow-sm transition"
                        >

                          <p className="text-xs font-black text-slate-700">
                            {item.day}
                          </p>

                          <Icon className="w-9 h-9 text-amber-500 my-3" />

                          <p className="text-sm font-black">
                            {item.minMax}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-1 min-h-8">
                            {item.condition}
                          </p>

                          <div className="mt-3 pt-3 border-t border-slate-200">

                            <p className="text-[10px] font-bold text-sky-700">
                              बारिश: {item.rainProb}%
                            </p>

                            <p className="text-[10px] text-slate-500 mt-1">
                              हवा: {item.wind}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </section>

            {/* =====================================================
                FARMER QUICK SUMMARY
            ===================================================== */}

            <section className="bg-gradient-to-r from-emerald-700 to-green-600 text-white rounded-3xl p-6">

              <div className="flex flex-col md:flex-row justify-between gap-5">

                <div>

                  <div className="flex items-center gap-2">

                    <Sprout className="w-5 h-5" />

                    <span className="text-xs font-black uppercase">
                      किसान के लिए आज का सार
                    </span>

                  </div>

                  <h2 className="text-xl font-black mt-2">
                    {weatherData.name} में आज
                  </h2>

                  <p className="text-emerald-100 text-sm mt-2">
                    तापमान {weatherData.temp}°C,
                    हवा {weatherData.windSpeed} km/h
                    और बारिश की संभावना{' '}
                    {weatherData.rainProbability}% है।
                  </p>

                </div>

                <div className="grid grid-cols-3 gap-3">

                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">

                    <p className="text-[10px] text-emerald-100">
                      तापमान
                    </p>

                    <p className="font-black text-lg">
                      {weatherData.temp}°
                    </p>

                  </div>

                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">

                    <p className="text-[10px] text-emerald-100">
                      बारिश
                    </p>

                    <p className="font-black text-lg">
                      {weatherData.rainProbability}%
                    </p>

                  </div>

                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">

                    <p className="text-[10px] text-emerald-100">
                      हवा
                    </p>

                    <p className="font-black text-lg">
                      {weatherData.windSpeed}
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </div>
        )}

    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Small Components
|--------------------------------------------------------------------------
*/

function WeatherStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-3">

      <div className="flex items-center gap-2">

        <div className="text-sky-100">
          {icon &&
            Object.clone
            ? icon
            : icon}
        </div>

        <div>

          <p className="text-[10px] text-sky-200">
            {label}
          </p>

          <p className="text-sm font-black">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl">

      <div className="flex items-center gap-2">

        <div className="text-sky-600 [&>svg]:w-4 [&>svg]:h-4">
          {icon}
        </div>

        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>

      </div>

      <span className="text-xs font-black text-slate-900">
        {value}
      </span>

    </div>
  );
}