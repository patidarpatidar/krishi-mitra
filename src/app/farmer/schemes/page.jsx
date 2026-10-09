"use client";

import {
  Landmark,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import { farmerSchemes } from "@/data/farmerDemo";

export default function FarmerSchemesPage() {
  return (
    <div className="space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          किसान सहायता
        </p>

        <h1 className="text-3xl font-bold">
          सरकारी योजनाएं
        </h1>

        <p className="text-slate-400 mt-2">
          किसान के लिए उपयोगी योजनाओं और official portals के links।
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

        {farmerSchemes.map((scheme) => (
          <article
            key={scheme.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col"
          >

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Landmark className="text-emerald-400" />
            </div>

            <span className="text-xs text-emerald-400 mt-5">
              {scheme.category}
            </span>

            <h2 className="text-xl font-bold mt-1">
              {scheme.name}
            </h2>

            <p className="text-sm text-slate-400 mt-3 leading-6 flex-1">
              {scheme.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Official source available
            </div>

            <a
              href={scheme.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl py-3 flex items-center justify-center gap-2"
            >
              Official Website
              <ExternalLink className="w-4 h-4" />
            </a>

          </article>
        ))}

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-500">
        योजना की पात्रता, आवेदन प्रक्रिया और लाभ समय के साथ बदल सकते हैं।
        आवेदन करने से पहले संबंधित official government portal पर जानकारी
        verify करें।
      </div>

    </div>
  );
}