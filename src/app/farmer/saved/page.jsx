"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  FileText,
  Landmark,
  ExternalLink,
  Sprout,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";

import { farmerApi, getFarmerUser } from "@/lib/farmerApi";

export default function SavedPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadSaved = useCallback(async () => {
    try {
      setLoading(true);

      const cached = getFarmerUser();
      if (Array.isArray(cached?.savedItems)) {
        setItems(cached.savedItems);
      }

      const res = await farmerApi.getSavedItems();
      if (Array.isArray(res.data)) {
        setItems(res.data);
      }
    } catch (err) {
      console.error("Load saved items error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  async function remove(id) {
    const item = items.find((x) => String(x._id || x.itemId || x.id) === String(id));
    const confirmed = window.confirm(
      `क्या आप "${item?.title || "इस जानकारी"}" को सेव सूची से हटाना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      const res = await farmerApi.deleteSavedItem(id);

      if (Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems((prev) =>
          prev.filter((x) => String(x._id || x.itemId || x.id) !== String(id))
        );
      }
    } catch (err) {
      console.error("Remove saved item error:", err);
      alert("हटाने में समस्या हुई।");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">पर्सनल लाइब्रेरी</p>
          <h1 className="text-3xl font-bold">सेव की गई जानकारी</h1>
          <p className="text-slate-400 mt-1">
            आपकी पसंदीदा सरकारी योजनाएं, फसल सलाह और लेख एक ही सुरक्षित स्थान पर।
          </p>
        </div>

        <button
          onClick={loadSaved}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-300 transition self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          रिफ्रेश करें
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">सेव की गई जानकारी लोड हो रही है...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 mb-4">
            <Bookmark className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white">अभी कोई जानकारी सेव नहीं है</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
            सरकारी योजनाओं और फसल सलाह के पृष्ठ पर बुकमार्क (🔖) आइकन दबाकर जरूरी जानकारी अपनी पर्सनल लाइब्रेरी में सेव करें।
          </p>

          <div className="flex justify-center gap-3 mt-6">
            <Link
              href="/farmer/schemes"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition"
            >
              योजनाएं देखें
            </Link>

            <Link
              href="/farmer/advisory"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition border border-slate-700"
            >
              फसल सलाह देखें
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const itemId = item._id || item.itemId || item.id;
            const isDeleting = deletingId === itemId;

            return (
              <div
                key={itemId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between gap-4 transition shadow-md"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                    {item.type === "scheme" ? (
                      <Landmark className="text-emerald-400 w-6 h-6" />
                    ) : item.type === "crop" ? (
                      <Sprout className="text-emerald-400 w-6 h-6" />
                    ) : (
                      <FileText className="text-emerald-400 w-6 h-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-white text-base truncate">
                      {item.title}
                    </p>

                    <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                      {item.category || (item.type === "scheme" ? "सरकारी योजना" : "कृषि सलाह")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.url && (
                    item.url.startsWith("http") ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-950 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition"
                        title="वेबसाइट पर देखें"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={item.url}
                        className="p-2.5 rounded-xl bg-slate-950 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition"
                        title="जानकारी देखें"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )
                  )}

                  <button
                    onClick={() => remove(itemId)}
                    disabled={isDeleting}
                    title="लाइब्रेरी से हटाएं"
                    className="p-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}