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
} from "lucide-react";

export default function FarmerProfile() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("krishi_mitra_farmer");

    if (data) {
      setForm(JSON.parse(data));
    }
  }, []);

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveProfile(e) {
    e.preventDefault();

    localStorage.setItem(
      "krishi_mitra_farmer",
      JSON.stringify(form)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  if (!form) {
    return <p>Profile loading...</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          किसान प्रोफाइल
        </p>

        <h1 className="text-3xl font-bold mt-1">
          मेरी प्रोफाइल
        </h1>

        <p className="text-slate-400 mt-2">
          अपनी खेती और व्यक्तिगत जानकारी अपडेट करें।
        </p>
      </div>

      <form
        onSubmit={saveProfile}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7"
      >

        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">

          <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-2xl font-bold">
            {form.name?.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-bold">
              {form.name}
            </h2>

            <p className="text-sm text-slate-500">
              किसान सदस्य
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <Field
            label="नाम"
            icon={User}
            value={form.name}
            onChange={(v) => update("name", v)}
          />

          <Field
            label="मोबाइल"
            icon={Phone}
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />

          <Field
            label="ईमेल"
            icon={Mail}
            value={form.email}
            onChange={(v) => update("email", v)}
          />

          <Field
            label="गाँव"
            icon={MapPin}
            value={form.village}
            onChange={(v) => update("village", v)}
          />

          <Field
            label="जिला"
            icon={MapPin}
            value={form.district}
            onChange={(v) => update("district", v)}
          />

          <Field
            label="राज्य"
            icon={MapPin}
            value={form.state}
            onChange={(v) => update("state", v)}
          />

          <Field
            label="कुल भूमि (एकड़)"
            icon={Sprout}
            type="number"
            value={form.landArea}
            onChange={(v) => update("landArea", v)}
          />

          <Field
            label="सिंचाई"
            icon={Sprout}
            value={form.irrigation}
            onChange={(v) => update("irrigation", v)}
          />

        </div>

        {saved && (
          <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Profile successfully update हुई।
          </div>
        )}

        <button
          type="submit"
          className="mt-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Profile Save करें
        </button>

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
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
}