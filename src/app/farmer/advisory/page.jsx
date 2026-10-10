"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Lightbulb,
  Search,
  ShieldCheck,
  Bookmark,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";

export default function AdvisoryPage() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedIds, setSavedIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState("");

  const loadAdvisories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [dash, crops, savedRes] = await Promise.all([
        farmerApi.getDashboard(),
        farmerApi.getCropsList(),
        farmerApi.getSavedItems(),
      ]);

      let list = [];
      if (Array.isArray(dash?.data?.advisories)) {
        list = dash.data.advisories;
      }

      if (Array.isArray(crops) && crops.length > 0) {
        crops.forEach((crop) => {
          if (Array.isArray(crop.diseases)) {
            crop.diseases.forEach((dis, dIdx) => {
              list.push({
                id: `dis-${crop._id || crop.id}-${dIdx}`,
                crop: crop.name,
                title: `${dis.name} - लक्षण एवं निदान`,
                description: dis.solution
                  ? `उपचार: ${dis.solution}. ${dis.symptoms ? `लक्षण: ${dis.symptoms}` : ""}`
                  : `लक्षण: ${dis.symptoms || "फसल की नियमित निगरानी रखें।"}`,
                type: "रोग प्रबंधन",
              });
            });
          }

          if (crop.waterRequirement || crop.soil) {
            list.push({
              id: `soil-${crop._id || crop.id}`,
              crop: crop.name,
              title: `${crop.name} - मिट्टी व जल प्रबंधन`,
              description: `उपयुक्त मिट्टी: ${crop.soil || "दोमट"}। जल आवश्यकता: ${crop.waterRequirement || "मध्यम"}। ${crop.description || ""}`,
              type: "सिंचाई एवं मृदा",
            });
          }
        });
      }

      // Deduplicate by title
      const seen = new Set();
      const unique = list.filter((item) => {
        const key = `${item.crop}-${item.title}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setAdvisories(unique);

      // Check already saved items
      if (Array.isArray(savedRes?.data)) {
        setSavedIds(new Set(savedRes.data.map((s) => s.title)));
      }
    } catch (err) {
      console.error("Load advisories error:", err);
      setAdvisories([]);
      setError(err.message || "सलाह लोड नहीं हो सकी।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdvisories();
  }, [loadAdvisories]);

  async function handleSave(item) {
    if (savedIds.has(item.title)) {
      setToastMessage("यह सलाह पहले से आपकी लाइब्रेरी में सुरक्षित है।");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    try {
      await farmerApi.addSavedItem({
        itemId: item.id || `adv-${Date.now()}`,
        type: "article",
        title: `${item.crop}: ${item.title}`,
        category: item.type || "कृषि सलाह",
        url: "/farmer/advisory",
      });

      setSavedIds((prev) => new Set([...prev, item.title]));
      setToastMessage("सलाह आपकी पर्सनल लाइब्रेरी में सुरक्षित कर ली गई!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Save advisory error:", err);
      setToastMessage(err.message || "सेव करने में समस्या हुई।");
      setTimeout(() => setToastMessage(""), 3000);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return advisories.filter((item) => {
      const matchSearch = `${item.crop || ""} ${item.title || ""} ${item.description || ""}`
        .toLowerCase()
        .includes(q);

      if (!matchSearch) return false;

      if (activeCategory === "all") return true;
      return (item.type || "").includes(activeCategory);
    });
  }, [advisories, search, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">कृषि विज्ञान केंद्र सलाह</p>
          <h1 className="text-3xl font-bold">वैज्ञानिक फसल सलाह</h1>
          <p className="text-slate-400 mt-1">
            फसलों के रोग, कीट, खाद और बुवाई से संबंधित प्रमाणित कृषि सलाह।
          </p>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={loadAdvisories}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-300 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          रिफ्रेश करें
        </button>
      </div>

      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="सोयाबीन, गेहूँ, लहसुन, इल्ली, फफूंद, खाद आदि खोजें..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-emerald-500 text-sm text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "सभी सलाह", value: "all" },
            { label: "रोग प्रबंधन", value: "रोग" },
            { label: "सिंचाई एवं मृदा", value: "सिंचाई" },
            { label: "फसल प्रबंधन", value: "फसल" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat.value
                  ? "bg-emerald-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advisory Cards */}
      {loading ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">फसल सलाह लोड हो रही है...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-6 sm:p-12 text-center">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">कोई सलाह नहीं मिली</p>
          <p className="text-slate-500 text-sm mt-1">
            कृपया अन्य शब्द खोजें अथवा श्रेणी फ़िल्टर बदलें।
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((item, idx) => {
            const isSaved = savedIds.has(item.title);

            return (
              <article
                key={item.id || idx}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-emerald-400" />
                      </div>

                      <div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                          {item.crop}
                        </span>
                        <span className="text-xs text-slate-500 ml-2 font-medium">
                          {item.type || "कृषि सलाह"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSave(item)}
                      title={isSaved ? "सेव किया हुआ" : "लाइब्रेरी में सेव करें"}
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

                  <h2 className="font-bold text-lg mt-3 text-white leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>प्रमाणित कृषि विज्ञान अनुशंसा</span>
                  {isSaved && (
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      ✓ सेव किया गया
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          कृषि मित्र की सलाह कृषि विश्वविद्यालयों और अनुसंधान संस्थानों के मार्गदर्शन पर आधारित है।
          किसी भी रासायनिक कीटनाशक, खरपतवारनाशक अथवा उर्वरक के प्रयोग से पूर्व उत्पाद के लेबल निर्देश अवश्य पढ़ें
          तथा स्थानीय कृषि विस्तार अधिकारी या KVK विशेषज्ञ से अपनी मिट्टी के अनुसार मात्रा सत्यापित करें।
        </p>
      </div>
    </div>
  );
}