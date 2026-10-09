"use client";

import { useState } from "react";

import {
  Settings,
  Database,
  ShieldCheck,
  RotateCcw,
  Save,
} from "lucide-react";

import { resetAdminDatabase } from "@/lib/adminStore";

export default function AdminSettingsPage() {
  const [saved, setSaved] =
    useState(false);

  const [settings, setSettings] =
    useState({
      siteName: "कृषि मित्र",
      adminEmail:
        "admin@krishimitra.in",
      defaultDistrict:
        "Neemuch",
      maintenance: false,
      allowLivestockListing: true,
      requireListingApproval: true,
    });

  function saveSettings() {
    localStorage.setItem(
      "krishi_mitra_admin_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(
      () => setSaved(false),
      2000
    );
  }

  function resetDatabase() {
    const ok = confirm(
      "सारा demo admin data reset करना है?"
    );

    if (!ok) return;

    resetAdminDatabase();
  }

  return (
    <div className="max-w-4xl space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-slate-500 mt-1">
          Admin और website configuration।
        </p>

      </div>

      <section className="bg-white border rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-6">

          <Settings className="text-emerald-600" />

          <h2 className="font-bold text-lg">
            General Settings
          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <Field
            label="Site Name"
            value={settings.siteName}
            onChange={(value) =>
              setSettings({
                ...settings,
                siteName: value,
              })
            }
          />

          <Field
            label="Admin Email"
            value={settings.adminEmail}
            onChange={(value) =>
              setSettings({
                ...settings,
                adminEmail: value,
              })
            }
          />

          <Field
            label="Default District"
            value={
              settings.defaultDistrict
            }
            onChange={(value) =>
              setSettings({
                ...settings,
                defaultDistrict: value,
              })
            }
          />

        </div>

      </section>

      <section className="bg-white border rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <ShieldCheck className="text-emerald-600" />

          <h2 className="font-bold text-lg">
            Content Rules
          </h2>

        </div>

        <Toggle
          label="Livestock Listing Allow करें"
          value={
            settings.allowLivestockListing
          }
          onChange={(value) =>
            setSettings({
              ...settings,
              allowLivestockListing:
                value,
            })
          }
        />

        <Toggle
          label="नई Listing के लिए Admin Approval जरूरी"
          value={
            settings.requireListingApproval
          }
          onChange={(value) =>
            setSettings({
              ...settings,
              requireListingApproval:
                value,
            })
          }
        />

      </section>

      <section className="bg-white border rounded-2xl p-6">

        <div className="flex items-center gap-3 mb-5">

          <Database className="text-blue-600" />

          <h2 className="font-bold text-lg">
            Demo Database
          </h2>

        </div>

        <p className="text-sm text-slate-500 mb-4">
          अभी data browser localStorage में save हो रहा है।
          API/MongoDB integration के बाद यह section database tools के लिए उपयोग होगा।
        </p>

        <button
          onClick={resetDatabase}
          className="px-4 py-3 border border-red-200 text-red-600 rounded-xl font-semibold flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Demo Data
        </button>

      </section>

      <div className="flex justify-end">

        <button
          onClick={saveSettings}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />

          {saved
            ? "Saved ✓"
            : "Save Settings"}
        </button>

      </div>

    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block text-sm font-semibold mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500"
      />

    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">

      <span className="text-sm font-medium">
        {label}
      </span>

      <button
        onClick={() =>
          onChange(!value)
        }
        className={`w-12 h-7 rounded-full p-1 transition ${
          value
            ? "bg-emerald-500"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`block w-5 h-5 bg-white rounded-full transition ${
            value
              ? "translate-x-5"
              : ""
          }`}
        />

      </button>

    </div>
  );
}