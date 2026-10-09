"use client";

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
} from "lucide-react";

import {
  mandiData,
  weatherData,
  advisories,
  farmerSchemes,
} from "@/data/farmerDemo";

export default function FarmerDashboard() {
  const farmer =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem("krishi_mitra_farmer") || "{}"
        )
      : {};

  return (
    <div className="space-y-6">

      <section>
        <p className="text-emerald-400 text-sm font-semibold">
          किसान डैशबोर्ड
        </p>

        <h1 className="text-2xl sm:text-3xl font-bold mt-1">
          नमस्ते, {farmer.name || "किसान"} 👋
        </h1>

        <p className="text-slate-400 mt-2">
          आपकी खेती से जुड़ी जरूरी जानकारी एक जगह।
        </p>
      </section>

      {/* Quick Stats */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="कुल जमीन"
          value={`${farmer.landArea || 0} Acre`}
          icon={Sprout}
        />

        <StatCard
          title="मेरी फसलें"
          value={farmer.crops?.length || 0}
          icon={Sprout}
        />

        <StatCard
          title="आज का तापमान"
          value={`${weatherData.temperature}°C`}
          icon={CloudSun}
        />

        <StatCard
          title="योजनाएं"
          value={farmerSchemes.length}
          icon={Landmark}
        />

      </section>

      <div className="grid xl:grid-cols-3 gap-6">

        {/* Weather */}

        <div className="xl:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-5">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">
                आज का मौसम
              </p>

              <h2 className="text-xl font-bold mt-1">
                {weatherData.location}
              </h2>
            </div>

            <CloudSun className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-5xl font-bold">
              {weatherData.temperature}°
            </span>

            <span className="text-slate-400 mb-2">
              {weatherData.condition}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">

            <WeatherItem
              icon={Droplets}
              label="नमी"
              value={`${weatherData.humidity}%`}
            />

            <WeatherItem
              icon={Wind}
              label="हवा"
              value={`${weatherData.wind} km/h`}
            />

            <WeatherItem
              icon={CloudSun}
              label="बारिश"
              value={`${weatherData.rainChance}%`}
            />

          </div>

          <Link
            href="/farmer/weather"
            className="mt-5 flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-700 rounded-xl py-3 text-sm font-semibold"
          >
            पूरा मौसम देखें
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mandi */}

        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-slate-400 text-sm">
                मंडी वॉचलिस्ट
              </p>

              <h2 className="text-xl font-bold">
                आज के भाव
              </h2>
            </div>

            <Link
              href="/farmer/mandi"
              className="text-emerald-400 text-sm font-semibold"
            >
              सभी देखें
            </Link>
          </div>

          <div className="space-y-3">

            {mandiData.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-slate-950 rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold">
                    {item.commodity}
                  </p>

                  <p className="text-xs text-slate-500">
                    {item.market}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <p
                    className={`text-xs ${
                      item.change >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.change >= 0 ? "+" : ""}
                    ₹{item.change}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Advisory */}

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-slate-400 text-sm">
              आपकी खेती के लिए
            </p>

            <h2 className="text-xl font-bold">
              आज की सलाह
            </h2>
          </div>

          <Link
            href="/farmer/advisory"
            className="text-emerald-400 text-sm"
          >
            सभी सलाह
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {advisories.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4"
            >
              <span className="text-xs text-emerald-400">
                {item.crop}
              </span>

              <h3 className="font-semibold mt-2">
                {item.title}
              </h3>

              <p className="text-sm text-slate-400 mt-2 line-clamp-3">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Scheme */}

      <section className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">

        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-emerald-400" />

          <div>
            <h2 className="font-bold">
              आपके लिए सरकारी योजनाएं
            </h2>

            <p className="text-sm text-slate-400">
              पात्रता और official website की जानकारी देखें।
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-5">

          {farmerSchemes.map((scheme) => (
            <a
              key={scheme.id}
              href={scheme.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 rounded-xl p-4 hover:border-emerald-500 border border-transparent transition"
            >
              <p className="text-xs text-emerald-400">
                {scheme.shortName}
              </p>

              <h3 className="font-semibold mt-1">
                {scheme.name}
              </h3>

              <p className="text-xs text-slate-500 mt-2">
                Official Website →
              </p>
            </a>
          ))}

        </div>
      </section>

    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <Icon className="w-5 h-5 text-emerald-400" />

      <p className="text-xs text-slate-500 mt-4">
        {title}
      </p>

      <p className="text-xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}

function WeatherItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="w-4 h-4 mx-auto text-slate-500" />

      <p className="text-xs text-slate-500 mt-1">
        {label}
      </p>

      <p className="text-sm font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}