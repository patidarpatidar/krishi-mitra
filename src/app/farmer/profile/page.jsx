"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Sprout,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { farmerApi, getFarmerUser } from "@/lib/farmerApi";

export default function FarmerProfile() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const cached = getFarmerUser();
        if (cached) {
          setForm(cached);
        }

        const res = await farmerApi.getProfile();
        if (res.data?.user) {
          setForm(res.data.user);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Profile लोड करने में समस्या हुई।");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  }

  async function saveProfile(e) {
    e.preventDefault();

    if (!form.name?.trim()) {
      setError("किसान का नाम भरना आवश्यक है।");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        phone: form.phone?.trim(),
        email: form.email?.trim(),
        village: form.village?.trim(),
        district: form.district?.trim(),
        state: form.state?.trim(),
        pincode: form.pincode?.trim() || "",
        landArea: form.landArea !== "" ? Number(form.landArea) : 0,
        landUnit: form.landUnit || "Acre",
        irrigation: form.irrigation || "",
      };

      const result = await farmerApi.updateProfile(payload);

      if (result.data?.user) {
        setForm(result.data.user);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3500);
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err.message || "Profile सुरक्षित नहीं हो सकी।");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !form) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
          <p>किसान प्रोफाइल लोड हो रही है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          किसान प्रोफाइल
        </p>

        <h1 className="text-3xl font-bold mt-1">मेरी प्रोफाइल</h1>

        <p className="text-slate-400 mt-2">
          अपनी व्यक्तिगत एवं कृषि से जुड़ी जानकारी डेटाबेस में अपडेट करें।
        </p>
      </div>

      <form
        onSubmit={saveProfile}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl"
      >
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-bold shadow-lg shadow-emerald-500/20">
            {form?.name?.charAt(0) || "क"}
          </div>

          <div>
            <h2 className="text-xl font-bold">{form?.name || "किसान"}</h2>

            <p className="text-sm text-emerald-400 font-medium">
              पंजीकृत किसान सदस्य • {form?.village ? `${form.village}, ` : ""}{form?.district || "नीमच"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          <Field
            label="किसान का पूरा नाम *"
            icon={User}
            value={form?.name}
            onChange={(v) => update("name", v)}
            required
          />

          <Field
            label="मोबाइल नंबर *"
            icon={Phone}
            value={form?.phone}
            onChange={(v) => update("phone", v)}
            required
          />

          <Field
            label="ईमेल आईडी *"
            icon={Mail}
            value={form?.email}
            onChange={(v) => update("email", v)}
            required
          />

          <Field
            label="गाँव *"
            icon={MapPin}
            value={form?.village}
            onChange={(v) => update("village", v)}
            required
          />

          <Field
            label="जिला"
            icon={MapPin}
            value={form?.district}
            onChange={(v) => update("district", v)}
          />

          <Field
            label="राज्य"
            icon={MapPin}
            value={form?.state}
            onChange={(v) => update("state", v)}
          />

          <Field
            label="पिनकोड"
            icon={MapPin}
            value={form?.pincode}
            onChange={(v) => update("pincode", v)}
          />

          {/* Land Area and Unit */}
          <div>
            <label className="text-sm text-slate-400">
              कुल कृषि भूमि
            </label>

            <div className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form?.landArea ?? ""}
                  onChange={(e) => update("landArea", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <select
                value={form?.landUnit || "Acre"}
                onChange={(e) => update("landUnit", e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 outline-none focus:border-emerald-500 text-sm text-slate-300"
              >
                <option value="Acre">एकड़ (Acre)</option>
                <option value="Bigha">बीघा (Bigha)</option>
                <option value="Hectare">हेक्टेयर (Hectare)</option>
              </select>
            </div>
          </div>

          {/* Irrigation */}
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400">
              मुख्य सिंचाई स्रोत
            </label>

            <div className="mt-2">
              <select
                value={form?.irrigation || "Borewell"}
                onChange={(e) => update("irrigation", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-sm text-slate-300"
              >
                <option value="Borewell">ट्यूबवेल / बोरवेल</option>
                <option value="Canal">नहर (Canal)</option>
                <option value="Well">कुआं (Well)</option>
                <option value="Rainfed">वर्षा आधारित (Rainfed)</option>
                <option value="Drip/Sprinkler">ड्रिप / फव्वारा सिंचाई</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 flex items-center gap-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Profile डेटाबेस में सफलतापूर्वक सुरक्षित हो गई।</span>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                सेव हो रहा है...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Profile Save करें
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="text-sm text-slate-400">
        {label}
      </label>

      <div className="relative mt-2">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 text-sm"
        />
      </div>
    </div>
  );
}