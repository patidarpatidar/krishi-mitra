"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Umbrella,
  Sprout,
  RefreshCw,
  Loader2,
  Thermometer,
  ShieldAlert,
  Sun,
  CloudRain,
} from "lucide-react";

import { getFarmerUser } from "@/lib/farmerApi";
import { getNeemuchWeather } from "@/services/weatherApi";

export default function FarmerWeatherPage() {
  const [farmer] = useState(getFarmerUser() || {});
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const locationName = `${farmer.district || "नीमच"}, ${farmer.state || "मध्य प्रदेश"}`;

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getNeemuchWeather();

      setWeather({
        location: locationName,
        temperature: res.temperature,
        humidity: res.humidity,
        windSpeed: res.windSpeed,
        weatherCode: res.weatherCode,
        maxTemp: res.maxTemp,
        minTemp: res.minTemp,
        rainProb: res.rainProb,
        condition:
          res.weatherCode === 0
            ? "साफ एवं धूप"
            : res.weatherCode <= 3
            ? "आंशिक बादल"
            : res.weatherCode >= 51 && res.weatherCode <= 67
            ? "वर्षा की संभावना"
            : "हल्की धूप व बादल",
      });
    } catch (err) {
      console.error("Load weather error:", err);
      setWeather(null);
      setError(err.message || "मौसम डेटा लोड नहीं हो सका।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [locationName]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  // Dynamic farming advice generated from real live weather parameters
  const generateAdvisories = () => {
    if (!weather) return [];
    const tips = [];

    if (weather.rainProb > 40) {
      tips.push({
        type: "वर्षा चेतावनी",
        text: `बारिश की संभावना ${weather.rainProb}% है। कीटनाशक, फफूंदनाशक या यूरिया का छिड़काव अभी टालें ताकि दवा बह न जाए।`,
      });
      tips.push({
        type: "सिंचाई प्रबंधन",
        text: "खेत में आगामी 2 दिनों तक अतिरिक्त सिंचाई न करें और पानी निकासी के नालों को साफ रखें।",
      });
    } else {
      tips.push({
        type: "सिंचाई सलाह",
        text: `मौसम शुष्क रहने की संभावना है (बारिश मात्र ${weather.rainProb}%)। जरूरत अनुसार फसलों को हल्की सिंचाई दें।`,
      });
    }

    if (weather.humidity > 65) {
      tips.push({
        type: "फफूंद / रोग निगरानी",
        text: `हवा में नमी ${weather.humidity}% अधिक है। लहसुन और दलहनी फसलों में फफूंदजनित रोगों (डाउनी मिल्ड्यू/ब्लाइट) की नियमित जांच करें।`,
      });
    }

    if (weather.windSpeed > 20) {
      tips.push({
        type: "हवा / स्प्रे सलाह",
        text: `हवा की गति ${weather.windSpeed} km/h तेज है। तेज हवा में स्प्रे करने से दवा का बहाव गलत दिशा में हो सकता है। शांत समय में ही स्प्रे करें।`,
      });
    }

    if (weather.maxTemp > 34) {
      tips.push({
        type: "गर्मी प्रबंधन",
        text: `अधिकतम तापमान ${weather.maxTemp}°C तक रहेगा। दोपहर के समय खेत में नमी बनाए रखने हेतु आवश्यकतानुसार शाम के समय सिंचाई करें।`,
      });
    }

    if (tips.length < 3) {
      tips.push({
        type: "सामान्य सलाह",
        text: "सुबह के समय खेतों का निरीक्षण करें तथा कीट या रोग के शुरुआती लक्षण दिखने पर तुरंत स्थानीय कृषि अधिकारी या KVK से संपर्क करें।",
      });
    }

    return tips;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">मौसम अलर्ट</p>
          <h1 className="text-3xl font-bold">खेती के लिए लाइव मौसम</h1>
          <p className="text-slate-400 mt-1">
            मौसम पूर्वानुमान के अनुसार बुवाई, सिंचाई और दवा छिड़काव की योजना बनाएं।
          </p>
        </div>

        <button
          onClick={() => {
            setRefreshing(true);
            loadWeather();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-300 transition self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`}
          />
          मौसम अपडेट करें
        </button>
      </div>

      {loading && !weather ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">मौसम डेटा लोड हो रहा है...</p>
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      ) : weather ? (
        <>
          {/* Main Weather Hero Card */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  लाइव सैटेलाइट पूर्वानुमान • भारत मौसम विज्ञान (IMD)
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-white">
                  {weather.location}
                </h2>

                <div className="flex items-center gap-5 mt-6">
                  <span className="text-6xl sm:text-7xl font-extrabold text-white">
                    {weather.temperature}°C
                  </span>

                  <div>
                    <span className="text-xl font-semibold text-emerald-400 block">
                      {weather.condition}
                    </span>
                    <span className="text-xs text-slate-400">
                      न्यूनतम {weather.minTemp}°C / अधिकतम {weather.maxTemp}°C
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                {weather.rainProb > 40 ? (
                  <CloudRain className="w-16 h-16 text-emerald-400" />
                ) : weather.weatherCode === 0 ? (
                  <Sun className="w-16 h-16 text-yellow-400" />
                ) : (
                  <CloudSun className="w-16 h-16 text-emerald-400" />
                )}

              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
              <WeatherCard
                icon={Droplets}
                label="हवा में नमी (Humidity)"
                value={`${weather.humidity}%`}
                status={weather.humidity > 70 ? "अधिक नमी" : "सामान्य"}
              />

              <WeatherCard
                icon={Wind}
                label="हवा की गति (Wind Speed)"
                value={`${weather.windSpeed} km/h`}
                status={weather.windSpeed > 18 ? "तेज हवा" : "अनुकूल"}
              />

              <WeatherCard
                icon={Umbrella}
                label="बारिश की संभावना"
                value={`${weather.rainProb}%`}
                status={weather.rainProb > 30 ? "वर्षा की संभावना" : "कम संभावना"}
              />

              <WeatherCard
                icon={Sprout}
                label="कृषि कार्य अनुकूलता"
                value={weather.rainProb > 50 ? "मध्यम" : "उत्तम"}
                status="खेती हेतु"
              />
            </div>
          </section>

          {/* Dynamic Weather-Based Farmer Advisory */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
            <h2 className="font-bold text-lg text-emerald-300 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              वर्तमान मौसम अनुसार खेती के सुझाव (AI Advisory)
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {generateAdvisories().map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      {tip.type}
                    </span>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function WeatherCard({ icon: Icon, label, value, status }) {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5 text-emerald-400" />
        {status && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">
            {status}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3">{label}</p>
      <p className="font-bold text-xl text-white mt-1">{value}</p>
    </div>
  );
}