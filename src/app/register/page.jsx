"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sprout,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { farmerApi } from "@/lib/farmerApi";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    village: "",
    district: "Neemuch",
    state: "Madhya Pradesh",
    pincode: "",
    landArea: "",
    landUnit: "Acre",
    irrigation: "Borewell",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  }

  async function submit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.village.trim()
    ) {
      setError("कृपया सभी जरूरी जानकारी भरें (नाम, मोबाइल, ईमेल, गाँव, पासवर्ड)।");
      return;
    }

    const cleanPhone = form.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("कृपया सही 10 digit मोबाइल नंबर दर्ज करें।");
      return;
    }

    if (form.password.length < 6) {
      setError("पासवर्ड कम से कम 6 characters का होना चाहिए।");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("दोनों पासवर्ड समान नहीं हैं।");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        phone: cleanPhone,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        village: form.village.trim(),
        district: form.district.trim() || "Neemuch",
        state: form.state.trim() || "Madhya Pradesh",
        pincode: form.pincode.trim(),
        landArea: form.landArea ? Number(form.landArea) : 0,
        landUnit: form.landUnit || "Acre",
        irrigation: form.irrigation.trim(),
      };

      await farmerApi.register(payload);

      setSuccess("किसान रजिस्ट्रेशन सफल रहा! डैशबोर्ड लोड हो रहा है...");

      setTimeout(() => {
        router.push("/farmer");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Farmer register error:", err);
      setError(
        err.message ||
          "रजिस्ट्रेशन के दौरान समस्या हुई। कृपया दोबारा प्रयास करें।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold">किसान रजिस्ट्रेशन</h1>

          <p className="text-slate-400 mt-2">
            अपना किसान प्रोफाइल बनाएं और सरकारी योजनाओं, मौसम व मंडी भाव का लाभ लें
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="किसान का नाम *"
              icon={<User className="w-5 h-5" />}
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="आपका पूरा नाम"
              required
            />

            <Input
              label="मोबाइल नंबर (10 अंक) *"
              icon={<Phone className="w-5 h-5" />}
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="9876543210"
              required
            />

            <Input
              label="ईमेल आईडी *"
              icon={<Mail className="w-5 h-5" />}
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="farmer@example.com"
              required
            />

            <Input
              label="गाँव *"
              icon={<MapPin className="w-5 h-5" />}
              value={form.village}
              onChange={(v) => update("village", v)}
              placeholder="गाँव का नाम"
              required
            />

            <Input
              label="पासवर्ड (कम से कम 6 अंक) *"
              icon={<Lock className="w-5 h-5" />}
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              placeholder="कम से कम 6 characters"
              required
            />

            <Input
              label="पासवर्ड दोबारा पुष्टि करें *"
              icon={<Lock className="w-5 h-5" />}
              type="password"
              value={form.confirmPassword}
              onChange={(v) => update("confirmPassword", v)}
              placeholder="पासवर्ड दोबारा लिखें"
              required
            />

            <Input
              label="जिला"
              icon={<MapPin className="w-5 h-5" />}
              value={form.district}
              onChange={(v) => update("district", v)}
              placeholder="जैसे Neemuch"
            />

            <Input
              label="पिनकोड"
              icon={<MapPin className="w-5 h-5" />}
              value={form.pincode}
              onChange={(v) => update("pincode", v)}
              placeholder="जैसे 458441"
            />

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                कुल भूमि (क्षेत्रफल)
              </label>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.landArea}
                  onChange={(e) => update("landArea", e.target.value)}
                  placeholder="जैसे 5"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500"
                />

                <select
                  value={form.landUnit}
                  onChange={(e) => update("landUnit", e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3.5 outline-none focus:border-emerald-500 text-sm"
                >
                  <option value="Acre">एकड़ (Acre)</option>
                  <option value="Bigha">बीघा (Bigha)</option>
                  <option value="Hectare">हेक्टेयर (Hectare)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                सिंचाई साधन
              </label>

              <select
                value={form.irrigation}
                onChange={(e) => update("irrigation", e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 text-sm"
              >
                <option value="Borewell">ट्यूबवेल / बोरवेल</option>
                <option value="Canal">नहर (Canal)</option>
                <option value="Well">कुआं (Well)</option>
                <option value="Rainfed">वर्षा आधारित (Rainfed)</option>
                <option value="Drip/Sprinkler">ड्रिप / फव्वारा</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3.5 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                रजिस्ट्रेशन हो रहा है...
              </>
            ) : (
              <>
                किसान अकाउंट बनाएं
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-400 mt-5">
            पहले से अकाउंट है?{" "}
            <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
              Login करें
            </Link>
          </p>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>कृषि मित्र सुरक्षित डेटा गोपनीयता नीति के साथ सुरक्षित</span>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition text-sm"
        />
      </div>
    </div>
  );
}