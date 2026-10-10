"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Sprout,
  Plus,
  Trash2,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";

export default function MyCropsPage() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    area: "",
    season: "खरीफ",
    status: "बुवाई की तैयारी",
    sowingDate: "",
  });

  const loadCrops = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await farmerApi.getCrops();
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops([]);
      }
    } catch (err) {
      console.error("Load crops error:", err);
      setError("फसलें लोड नहीं हो सकीं।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCrops();
  }, [loadCrops]);

  async function handleAddCrop(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.area) {
      setError("फसल का नाम और भूमि का क्षेत्रफल भरें।");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        area: Number(form.area),
        season: form.season,
        status: form.status,
        sowingDate: form.sowingDate || "",
      };

      const res = await farmerApi.addCrop(payload);
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        await loadCrops();
      }

      setForm({
        name: "",
        area: "",
        season: "खरीफ",
        status: "बुवाई की तैयारी",
        sowingDate: "",
      });

      setShowForm(false);
      setSuccess("फसल सफलतापूर्वक जोड़ दी गई।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Add crop error:", err);
      setError(err.message || "फसल जोड़ने में समस्या हुई।");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCrop(id) {
    const crop = crops.find((c) => String(c._id || c.id) === String(id));
    const confirmed = window.confirm(
      `क्या आप "${crop?.name || "इस फसल"}" को हटाना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const res = await farmerApi.deleteCrop(id);
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops((prev) => prev.filter((c) => String(c._id || c.id) !== String(id)));
      }

      setSuccess("फसल हटा दी गई।");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Delete crop error:", err);
      setError(err.message || "फसल हटाने में समस्या हुई।");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      const res = await farmerApi.updateCrop(id, { status: newStatus });
      if (Array.isArray(res.data)) {
        setCrops(res.data);
      } else {
        setCrops((prev) =>
          prev.map((c) =>
            String(c._id || c.id) === String(id)
              ? { ...c, status: newStatus }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Update crop status error:", err);
      setError("स्थिति बदलने में समस्या हुई।");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-emerald-400 text-sm font-semibold">मेरी खेती</p>
          <h1 className="text-3xl font-bold">मेरी फसलें</h1>
          <p className="text-slate-400 mt-1">
            अपने खेत में बोई गई सभी फसलों का लाइव रिकॉर्ड और स्थिति प्रबंधित करें।
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              फॉर्म बंद करें
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              नई फसल जोड़ें
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3.5 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Add Crop Form */}
      {showForm && (
        <form
          onSubmit={handleAddCrop}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="min-w-0 font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              नई फसल का विवरण दर्ज करें
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                फसल का नाम *
              </label>
              <input
                placeholder="जैसे सोयाबीन, गेहूँ, लहसुन"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                रकबा / भूमि (एकड़) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="जैसे 2.5"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                फसल मौसम
              </label>
              <select
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              >
                <option value="खरीफ">खरीफ (Kharif)</option>
                <option value="रबी">रबी (Rabi)</option>
                <option value="जायद">जायद (Zaid)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                वर्तमान स्थिति
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              >
                <option value="बुवाई की तैयारी">बुवाई की तैयारी</option>
                <option value="बुवाई हो चुकी है">बुवाई हो चुकी है</option>
                <option value="फसल बढ़ रही है">फसल बढ़ रही है</option>
                <option value="फूल/फल आने लगे हैं">फूल/फल आने लगे हैं</option>
                <option value="कटाई के लिए तैयार">कटाई के लिए तैयार</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                बुवाई की तिथि (वैकल्पिक)
              </label>
              <input
                type="date"
                value={form.sowingDate}
                onChange={(e) => setForm({ ...form, sowingDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-emerald-500 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold"
            >
              रद्द करें
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  सुरक्षित हो रहा है...
                </>
              ) : (
                "फसल सुरक्षित करें"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Crops List */}
      {loading && crops.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
          <p className="text-slate-400">आपकी फसलें लोड हो रही हैं...</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-6 sm:p-12 text-center">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 mb-4">
            <Sprout className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white">अभी कोई फसल नहीं जोड़ी गई है</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto text-sm">
            अपनी बुवाई की गई फसलों को जोड़ें ताकि आप उनके अनुसार मौसम सलाह, कीट नियंत्रण और मंडी भाव ट्रैक कर सकें।
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition"
          >
            <Plus className="w-4 h-4" />
            पहली फसल जोड़ें
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {crops.map((crop) => {
            const cropId = crop._id || crop.id;
            const isDeleting = deletingId === cropId;

            return (
              <div
                key={cropId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-emerald-400" />
                    </div>

                    <button
                      onClick={() => handleDeleteCrop(cropId)}
                      disabled={isDeleting}
                      title="फसल हटाएं"
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h2 className="text-xl font-bold mt-4 text-white">
                    {crop.name}
                  </h2>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mt-1">
                    <span>{crop.area} Acre</span>
                    <span>•</span>
                    <span className="text-slate-400 font-normal">
                      {crop.season} मौसम
                    </span>
                  </div>

                  {crop.sowingDate && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                      बुवाई तिथि: {crop.sowingDate}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">स्थिति:</span>

                  <select
                    value={crop.status || "बुवाई की तैयारी"}
                    onChange={(e) => handleStatusChange(cropId, e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-emerald-400 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none focus:border-emerald-500"
                  >
                    <option value="बुवाई की तैयारी">बुवाई की तैयारी</option>
                    <option value="बुवाई हो चुकी है">बुवाई हो चुकी है</option>
                    <option value="फसल बढ़ रही है">फसल बढ़ रही है</option>
                    <option value="फूल/फल आने लगे हैं">फूल/फल आने लगे हैं</option>
                    <option value="कटाई के लिए तैयार">कटाई के लिए तैयार</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}