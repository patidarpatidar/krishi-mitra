"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Landmark,
  ExternalLink,
  CheckCircle2,
  Search,
  Bookmark,
  Loader2,
  RefreshCw,
  Sparkles,
  Award,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";

export default function FarmerSchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");

  const loadSchemes = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Fetch published schemes from backend API
      const list = await farmerApi.getSchemes().catch(() => []);

      if (Array.isArray(list) && list.length > 0) {
        setSchemes(list);
      } else {
        // Fallback default government schemes
        setSchemes([
          {
            _id: "pm-kisan",
            name: "प्रधानमंत्री किसान सम्मान निधि",
            shortName: "PM-KISAN",
            category: "आय सहायता",
            description: "पात्र भूमिधारी किसान परिवारों को प्रति वर्ष ₹6,000 की वित्तीय सहायता।",
            officialUrl: "https://pmkisan.gov.in/",
            level: "केंद्र सरकार",
          },
          {
            _id: "pmfby",
            name: "प्रधानमंत्री फसल बीमा योजना",
            shortName: "PMFBY",
            category: "फसल बीमा",
            description: "प्राकृतिक आपदाओं, सूखा, बाढ़ एवं कीट प्रकोप से फसल क्षति की स्थिति में आर्थिक संबल।",
            officialUrl: "https://pmfby.gov.in/",
            level: "केंद्र सरकार",
          },
          {
            _id: "kcc",
            name: "किसान क्रेडिट कार्ड",
            shortName: "KCC",
            category: "कृषि ऋण",
            description: "रियायती ब्याज दर (4%) पर कृषि आदानों, खाद-बीज और खेती संबंधी जरूरतों हेतु ऋण।",
            officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
            level: "केंद्र सरकार",
          },
          {
            _id: "pm-kusum",
            name: "पीएम कुसुम योजना (सोलर पंप)",
            shortName: "PM-KUSUM",
            category: "सौर ऊर्जा सब्सिडी",
            description: "सिंचाई हेतु सौर ऊर्जा पंपों की स्थापना पर केंद्र व राज्य सरकार द्वारा 60% तक का अनुदान।",
            officialUrl: "https://pmkusum.mnre.gov.in/",
            level: "केंद्र सरकार",
          },
        ]);
      }

      // Check already saved items
      const savedRes = await farmerApi.getSavedItems().catch(() => null);
      if (Array.isArray(savedRes?.data)) {
        setSavedIds(new Set(savedRes.data.map((s) => s.itemId || s.title)));
      }
    } catch (err) {
      console.error("Load schemes error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchemes();
  }, [loadSchemes]);

  async function handleSave(scheme) {
    const schemeId = scheme._id || scheme.id || scheme.slug;

    if (savedIds.has(schemeId) || savedIds.has(scheme.name)) {
      setToastMessage("यह योजना पहले से आपकी लाइब्रेरी में सुरक्षित है।");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    try {
      await farmerApi.addSavedItem({
        itemId: schemeId,
        type: "scheme",
        title: scheme.name,
        category: scheme.category || "सरकारी योजना",
        url: scheme.officialUrl || scheme.sourceUrl || "https://pmkisan.gov.in/",
      });

      setSavedIds((prev) => new Set([...prev, schemeId, scheme.name]));
      setToastMessage(`"${scheme.name}" आपकी लाइब्रेरी में सेव हो गई!`);
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Save scheme error:", err);
      setToastMessage(err.message || "सेव करने में समस्या हुई।");
      setTimeout(() => setToastMessage(""), 3000);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return schemes.filter((s) =>
      `${s.name || ""} ${s.shortName || ""} ${s.category || ""} ${s.description || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [schemes, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">सरकारी सहायता एवं अनुदान</p>
          <h1 className="text-3xl font-bold">सरकारी योजनाएं</h1>
          <p className="text-slate-400 mt-1">
            पात्रता, अनुदान विवरण और आधिकारिक पोर्टल्स से सीधा आवेदन।
          </p>
        </div>

        <button
          onClick={loadSchemes}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-300 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          रिफ्रेश करें
        </button>
      </div>

      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="योजना का नाम, सब्सिडी, बीमा या ऋण खोजें..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 text-sm text-white"
        />
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">सरकारी योजनाएं लोड हो रही हैं...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
          <Landmark className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">कोई योजना नहीं मिली</p>
          <p className="text-slate-500 text-sm mt-1">
            कृपया अन्य कीवर्ड डालकर खोजें।
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((scheme) => {
            const schemeId = scheme._id || scheme.id || scheme.slug;
            const isSaved = savedIds.has(schemeId) || savedIds.has(scheme.name);
            const portalUrl = scheme.officialUrl || scheme.sourceUrl || "https://pmkisan.gov.in/";

            return (
              <article
                key={schemeId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Landmark className="w-6 h-6 text-emerald-400" />
                    </div>

                    <button
                      onClick={() => handleSave(scheme)}
                      title={isSaved ? "सेव किया हुआ" : "लाइब्रेरी में सुरक्षित करें"}
                      className={`p-2 rounded-xl transition ${
                        isSaved
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                      {scheme.category || "सरकारी योजना"}
                    </span>
                    {scheme.level && (
                      <span className="text-[11px] text-slate-400">
                        • {scheme.level}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mt-2 text-white">
                    {scheme.name}
                  </h2>

                  <p className="text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-3">
                    {scheme.description || scheme.summary || "योजना विवरण उपलब्ध है।"}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    आधिकारिक पोर्टल उपलब्ध
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition text-sm shadow-md shadow-emerald-500/10"
                  >
                    आधिकारिक वेबसाइट पर जाएं
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
        <strong>महत्वपूर्ण सूचना:</strong> योजना की पात्रता शर्तें, आवश्यक दस्तावेज एवं आवेदन प्रक्रिया केंद्र व राज्य
        सरकारों के नियमों के अनुसार समय-समय पर संशोधित हो सकती हैं। आवेदन से पूर्व आधिकारिक पोर्टल पर दिशानिर्देश जांचें।
      </div>
    </div>
  );
}