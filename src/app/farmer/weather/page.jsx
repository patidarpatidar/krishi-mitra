"use client";

import {
  CloudSun,
  Droplets,
  Wind,
  Umbrella,
  Sprout,
} from "lucide-react";

import { weatherData } from "@/data/farmerDemo";

export default function FarmerWeatherPage() {
  return (
    <div className="space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          मौसम
        </p>

        <h1 className="text-3xl font-bold">
          खेती के लिए मौसम
        </h1>

        <p className="text-slate-400 mt-2">
          मौसम के अनुसार खेती के काम की planning करें।
        </p>
      </div>

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          <div>
            <p className="text-slate-400">
              वर्तमान स्थान
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {weatherData.location}
            </h2>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-6xl font-bold">
                {weatherData.temperature}°
              </span>

              <span className="text-slate-400">
                {weatherData.condition}
              </span>
            </div>
          </div>

          <CloudSun className="w-24 h-24 text-emerald-400" />

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

          <WeatherCard
            icon={Droplets}
            label="Humidity"
            value={`${weatherData.humidity}%`}
          />

          <WeatherCard
            icon={Wind}
            label="Wind"
            value={`${weatherData.wind} km/h`}
          />

          <WeatherCard
            icon={Umbrella}
            label="Rain Chance"
            value={`${weatherData.rainChance}%`}
          />

          <WeatherCard
            icon={Sprout}
            label="Crop Impact"
            value="सामान्य"
          />

        </div>

      </section>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">

        <h2 className="font-bold">
          किसान के लिए सुझाव
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>• खेत में अनावश्यक पानी जमा न होने दें।</li>
          <li>• मौसम परिवर्तन के अनुसार फसल की निगरानी करें।</li>
          <li>• कीटनाशक/फफूंदनाशक प्रयोग से पहले label और local advisory देखें।</li>
        </ul>

      </div>

    </div>
  );
}

function WeatherCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-slate-950 rounded-2xl p-4">
      <Icon className="w-5 h-5 text-emerald-400" />

      <p className="text-xs text-slate-500 mt-4">
        {label}
      </p>

      <p className="font-bold mt-1">
        {value}
      </p>
    </div>
  );
}