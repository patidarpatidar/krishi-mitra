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
} from "lucide-react";

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
    landArea: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function submit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.password ||
      !form.village
    ) {
      setError("कृपया सभी जरूरी जानकारी भरें।");
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

    const farmer = {
      id: `farmer-${Date.now()}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      village: form.village,
      district: form.district,
      state: form.state,
      landArea: Number(form.landArea) || 0,
      landUnit: "Acre",
      irrigation: "जानकारी उपलब्ध नहीं",
      crops: [],
    };

   const existingUsers = JSON.parse(
  localStorage.getItem("krishi_mitra_users") || "[]"
);

const duplicate = existingUsers.some(
  (user) =>
    user.phone === farmer.phone ||
    user.email.toLowerCase() === farmer.email.toLowerCase()
);

if (duplicate) {
  setError("यह मोबाइल नंबर या ईमेल पहले से registered है।");
  return;
}

existingUsers.push(farmer);

localStorage.setItem(
  "krishi_mitra_users",
  JSON.stringify(existingUsers)
);

    setSuccess("Registration सफल रहा। अब login करें।");

    setTimeout(() => {
      router.push("/login");
    }, 800);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sprout className="w-7 h-7 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-bold">
            किसान रजिस्ट्रेशन
          </h1>

          <p className="text-slate-400 mt-2">
            अपना किसान प्रोफाइल बनाएं
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8"
        >
          <div className="grid sm:grid-cols-2 gap-5">

            <Input
              label="किसान का नाम"
              icon={<User className="w-5 h-5" />}
              value={form.name}
              onChange={(v) => update("name", v)}
              placeholder="आपका नाम"
            />

            <Input
              label="मोबाइल नंबर"
              icon={<Phone className="w-5 h-5" />}
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="10 digit mobile"
            />

            <Input
              label="ईमेल"
              icon={<Mail className="w-5 h-5" />}
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="farmer@example.com"
            />

            <Input
              label="गाँव"
              icon={<MapPin className="w-5 h-5" />}
              value={form.village}
              onChange={(v) => update("village", v)}
              placeholder="गाँव का नाम"
            />

            <Input
              label="पासवर्ड"
              icon={<Lock className="w-5 h-5" />}
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              placeholder="कम से कम 6 characters"
            />

            <Input
              label="पासवर्ड दोबारा"
              icon={<Lock className="w-5 h-5" />}
              type="password"
              value={form.confirmPassword}
              onChange={(v) => update("confirmPassword", v)}
              placeholder="पासवर्ड दोबारा लिखें"
            />

            <Input
              label="जिला"
              icon={<MapPin className="w-5 h-5" />}
              value={form.district}
              onChange={(v) => update("district", v)}
              placeholder="जिला"
            />

            <Input
              label="कुल भूमि (एकड़)"
              icon={<Sprout className="w-5 h-5" />}
              type="number"
              value={form.landArea}
              onChange={(v) => update("landArea", v)}
              placeholder="जैसे 5"
            />

          </div>

          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            किसान अकाउंट बनाएं
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-sm text-slate-400 mt-5">
            पहले से अकाउंट है?{" "}
            <Link
              href="/login"
              className="text-emerald-400 font-semibold"
            >
              Login करें
            </Link>
          </p>
        </form>
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
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-11 py-3.5 outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
}