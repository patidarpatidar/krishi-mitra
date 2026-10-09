"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Sprout,
  TrendingUp,
  CloudSun,
  Landmark,
  ArrowRight,
  Droplets,
  Wind,
  Bookmark,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import { farmerApi, getFarmerUser } from "@/lib/farmerApi";
import { getNeemuchWeather } from "@/services/weatherApi";
import { getDynamicMandiRates } from "@/services/mandiApi";

export default function FarmerDashboard() {
  const [farmer, setFarmer] = useState(getFarmerUser() || {});
  const [stats, setStats] = useState({
    totalLand: "0 Acre",
    cropsCount: 0,
    savedCount: 0,
    watchlistCount: 0,
  });
  const [weather, setWeather] = useState({
    location: "नीमच, मध्य प्रदेश",
    temperature: 28,
    condition: "मौसम डेटा लोड हो रहा है...",
    humidity: 60,
    wind: 12,
    rainChance: 20,
  });
  const [mandiRates, setMandiRates] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      // 1. Load Farmer Dashboard Overview
      const dashRes = await farmerApi.getDashboard().catch(() => null);

      if (dashRes?.data) {
        const d = dashRes.data;
        if (d.farmer) setFarmer(d.farmer);
        if (d.stats) setStats(d.stats);
        if (Array.isArray(d.advisories)) setAdvisories(d.advisories);
        if (Array.isArray(d.schemes)) setSchemes(d.schemes);
      }

      // 2. Load Live Weather
      const weatherRes = await getNeemuchWeather().catch(() => null);
      if (weatherRes) {
        setWeather({
          location: "नीमच, मध्य प्रदेश",
          temperature: weatherRes.temperature,
          condition:
            weatherRes.weatherCode <= 1
              ? "साफ आसमान"
              : weatherRes.weatherCode <= 3
              ? "आंशिक बादल"
              : "हल्की वर्षा की संभावना",
          humidity: weatherRes.humidity,
          wind: weatherRes.windSpeed,
          rainChance: weatherRes.rainProb,
        });
      }

      // 3. Load Dynamic Mandi Rates
      const mandiRes = await getDynamicMandiRates({
        state: "Madhya Pradesh",
        district: "Neemuch",
      }).catch(() => []);

      if (Array.isArray(mandiRes) && mandiRes.length > 0) {
        setMandiRates(mandiRes.slice(0, 4));
      } else {
        // Fallback default commodities
        setMandiRates([
          {
            id: "m-1",
            crop: "सोयाबीन",
            mandi: "नीमच",
            modalPrice: 4850,
            unit: "क्विंटल",
          },
          {
            id: "m-2",
            crop: "लहसुन",
            mandi: "नीमच",
            modalPrice: 7200,
            unit: "क्विंटल",
          },
          {
            id: "m-3",
            crop: "गेहूँ",
            mandi: "नीमच",
            modalPrice: 2580,
            unit: "क्विंटल",
          },
          {
            id: "m-4",
            crop: "चना",
            mandi: "मंदसौर",
            modalPrice: 5900,
            unit: "क्विंटल",
          },
        ]);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">
            किसान डैशबोर्ड
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            नमस्ते, {farmer.name?.split(" ")[0] || "किसान"} 👋
          </h1>

          <p className="text-slate-400 mt-1">
            {farmer.village ? `गाँव: ${farmer.village}` : ""}
            {farmer.district ? `, जिला: ${farmer.district}` : ""}
            {" • "} आपकी खेती से जुड़ी जरूरी जानकारी एक जगह।
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium transition"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? "animate-spin text-emerald-400" : ""}`}
          />
          {refreshing ? "अपडेट हो रहा है..." : "डेटा रिफ्रेश करें"}
        </button>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="कुल जमीन"
          value={`${farmer.landArea || 0} ${farmer.landUnit || "Acre"}`}
          subtitle={farmer.irrigation ? `सिंचाई: ${farmer.irrigation}` : "खेत विवरण"}
          icon={Sprout}
        />

        <StatCard
          title="मेरी फसलें"
          value={stats.cropsCount || farmer.crops?.length || 0}
          subtitle="पंजीकृत फसलें"
          icon={Sprout}
          link="/farmer/crops"
        />

        <StatCard
          title="आज का तापमान"
          value={`${weather.temperature}°C`}
          subtitle={weather.condition}
          icon={CloudSun}
          link="/farmer/weather"
        />

        <StatCard
          title="सरकारी योजनाएं"
          value={schemes.length || 4}
          subtitle="पात्र योजनाएं"
          icon={Landmark}
          link="/farmer/schemes"
        />
      </section>

      {/* Weather & Mandi */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Live Weather Card */}
        <div className="xl:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">आज का मौसम (लाइव)</p>
                <h2 className="text-xl font-bold mt-1">{weather.location}</h2>
              </div>
              <CloudSun className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-5xl font-bold">{weather.temperature}°</span>
              <span className="text-slate-400 mb-2 font-medium">
                {weather.condition}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <WeatherItem
                icon={Droplets}
                label="नमी"
                value={`${weather.humidity}%`}
              />
              <WeatherItem
                icon={Wind}
                label="हवा"
                value={`${weather.wind} km/h`}
              />
              <WeatherItem
                icon={CloudSun}
                label="बारिश"
                value={`${weather.rainChance}%`}
              />
            </div>
          </div>

          <Link
            href="/farmer/weather"
            className="mt-6 flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-700 rounded-xl py-3 text-sm font-semibold transition"
          >
            विस्तृत मौसम पूर्वानुमान देखें
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Mandi Rates */}
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-slate-400 text-sm">मंडी लाइव अपडेट</p>
                <h2 className="text-xl font-bold">मंडी के प्रमुख भाव</h2>
              </div>

              <Link
                href="/farmer/mandi"
                className="text-emerald-400 text-sm font-semibold hover:underline"
              >
                सभी मंडी भाव देखें →
              </Link>
            </div>

            <div className="space-y-3">
              {mandiRates.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between bg-slate-950 rounded-xl p-4 hover:border-slate-700 border border-transparent transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {item.crop?.charAt(0) || "फ"}
                    </div>
                    <div>
                      <p className="font-semibold">{item.crop}</p>
                      <p className="text-xs text-slate-500">
                        {item.mandi || "नीमच"} मंडी {item.district ? `(${item.district})` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ₹{(item.modalPrice || item.price || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400">
                      प्रति {item.unit || "क्विंटल"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>दैनिक मंडी भाव एवं आवक दर</span>
            <Link
              href="/mandi-bhav"
              className="text-emerald-400 hover:underline font-semibold"
            >
              राज्य मंडी पोर्टल →
            </Link>
          </div>
        </div>
      </div>

      {/* Advisory Section (Dynamic from Database crops) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-slate-400 text-sm">आपकी फसलों के लिए</p>
            <h2 className="text-xl font-bold">आज की वैज्ञानिक कृषि सलाह</h2>
          </div>

          <Link
            href="/farmer/advisory"
            className="text-emerald-400 text-sm font-semibold hover:underline"
          >
            सभी सलाह देखें →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {advisories.slice(0, 3).map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                  {item.crop} • {item.type || "फसल सलाह"}
                </span>

                <h3 className="font-semibold text-base mt-3">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 text-xs text-slate-500">
                विशेषज्ञ सलाह आधारित
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schemes Section (Dynamic from Database GovernmentScheme) */}
      <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Landmark className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-bold text-lg">
                आपके लिए महत्वपूर्ण सरकारी योजनाएं
              </h2>
              <p className="text-sm text-slate-400">
                पात्रता, लाभ और आधिकारिक पोर्टल की सीधी जानकारी।
              </p>
            </div>
          </div>

          <Link
            href="/farmer/schemes"
            className="text-sm text-emerald-400 font-semibold hover:underline hidden sm:block"
          >
            सभी योजनाएं देखें →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-5">
          {schemes.slice(0, 3).map((scheme, idx) => (
            <a
              key={scheme.id || idx}
              href={scheme.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 rounded-xl p-4 hover:border-emerald-500/50 border border-slate-800 transition flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-emerald-400 font-semibold">
                  {scheme.shortName || scheme.category}
                </p>

                <h3 className="font-semibold mt-1 text-slate-200">
                  {scheme.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <p className="text-xs text-emerald-400 font-medium mt-4 flex items-center gap-1">
                आधिकारिक पोर्टल पर जाएं <ExternalLink className="w-3.5 h-3.5" />
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, link }) {
  const content = (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition">
      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5 text-emerald-400" />
        {link && <ArrowRight className="w-4 h-4 text-slate-500" />}
      </div>

      <p className="text-xs text-slate-400 mt-4">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 text-white">{value}</p>
      {subtitle && <p className="text-[11px] text-slate-500 mt-1 truncate">{subtitle}</p>}
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
}

function WeatherItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
      <Icon className="w-4 h-4 mx-auto text-emerald-400" />
      <p className="text-xs text-slate-400 mt-1">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );
}