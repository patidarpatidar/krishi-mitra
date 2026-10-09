"use client";

import { useEffect, useState } from "react";
import {
  Sprout,
  Plus,
  Trash2,
  CalendarDays,
} from "lucide-react";

export default function MyCropsPage() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    area: "",
    season: "खरीफ",
    status: "बुवाई की तैयारी",
  });

  useEffect(() => {
    const farmer = JSON.parse(
      localStorage.getItem("krishi_mitra_farmer") || "{}"
    );

    setCrops(farmer.crops || []);
  }, []);

  function addCrop(e) {
    e.preventDefault();

    if (!form.name || !form.area) return;

    const newCrop = {
      id: Date.now(),
      name: form.name,
      area: Number(form.area),
      season: form.season,
      status: form.status,
    };

    const updated = [...crops, newCrop];

    setCrops(updated);

    const farmer = JSON.parse(
      localStorage.getItem("krishi_mitra_farmer") || "{}"
    );

    farmer.crops = updated;

    localStorage.setItem(
      "krishi_mitra_farmer",
      JSON.stringify(farmer)
    );

    setForm({
      name: "",
      area: "",
      season: "खरीफ",
      status: "बुवाई की तैयारी",
    });

    setShowForm(false);
  }

  function deleteCrop(id) {
    const updated = crops.filter((crop) => crop.id !== id);

    setCrops(updated);

    const farmer = JSON.parse(
      localStorage.getItem("krishi_mitra_farmer") || "{}"
    );

    farmer.crops = updated;

    localStorage.setItem(
      "krishi_mitra_farmer",
      JSON.stringify(farmer)
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <p className="text-emerald-400 text-sm font-semibold">
            मेरी खेती
          </p>

          <h1 className="text-3xl font-bold">
            मेरी फसलें
          </h1>

          <p className="text-slate-400 mt-2">
            अपनी सभी फसलों का रिकॉर्ड रखें।
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          फसल जोड़ें
        </button>

      </div>

      {showForm && (
        <form
          onSubmit={addCrop}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
        >

          <h2 className="font-bold text-lg">
            नई फसल जोड़ें
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mt-5">

            <input
              placeholder="फसल का नाम"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
            />

            <input
              type="number"
              placeholder="भूमि (एकड़)"
              value={form.area}
              onChange={(e) =>
                setForm({
                  ...form,
                  area: e.target.value,
                })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
            />

            <select
              value={form.season}
              onChange={(e) =>
                setForm({
                  ...form,
                  season: e.target.value,
                })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
            >
              <option>खरीफ</option>
              <option>रबी</option>
              <option>जायद</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3"
            >
              <option>बुवाई की तैयारी</option>
              <option>बुवाई हो चुकी है</option>
              <option>फसल बढ़ रही है</option>
              <option>कटाई के लिए तैयार</option>
            </select>

          </div>

          <button
            type="submit"
            className="mt-5 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-bold"
          >
            Save Crop
          </button>

        </form>
      )}

      {crops.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-10 text-center">
          <Sprout className="w-10 h-10 text-slate-600 mx-auto" />

          <p className="text-slate-400 mt-3">
            अभी कोई फसल नहीं जोड़ी गई है।
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {crops.map((crop) => (
            <div
              key={crop.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >

              <div className="flex justify-between">

                <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Sprout className="text-emerald-400" />
                </div>

                <button
                  onClick={() => deleteCrop(crop.id)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </div>

              <h2 className="text-xl font-bold mt-5">
                {crop.name}
              </h2>

              <p className="text-emerald-400 text-sm mt-1">
                {crop.area} Acre
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                <CalendarDays className="w-4 h-4" />
                {crop.season}
              </div>

              <div className="mt-4 bg-slate-950 rounded-xl px-4 py-3 text-sm">
                {crop.status}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}