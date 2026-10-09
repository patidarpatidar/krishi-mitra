"use client";

import { useState } from "react";
import {
  Bookmark,
  Trash2,
  FileText,
  Landmark,
} from "lucide-react";

import { savedItems } from "@/data/farmerDemo";

export default function SavedPage() {
  const [items, setItems] = useState(savedItems);

  function remove(id) {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <p className="text-emerald-400 text-sm font-semibold">
          Personal Library
        </p>

        <h1 className="text-3xl font-bold">
          सेव की गई जानकारी
        </h1>

        <p className="text-slate-400 mt-2">
          जरूरी कृषि जानकारी बाद में देखने के लिए save करें।
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-10 text-center">

          <Bookmark className="w-10 h-10 mx-auto text-slate-600" />

          <p className="text-slate-400 mt-3">
            अभी कोई information saved नहीं है।
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4"
            >

              <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">

                {item.type === "scheme" ? (
                  <Landmark className="text-emerald-400" />
                ) : (
                  <FileText className="text-emerald-400" />
                )}

              </div>

              <div className="flex-1 min-w-0">

                <p className="font-semibold truncate">
                  {item.title}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {item.category}
                </p>

              </div>

              <button
                onClick={() => remove(item.id)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}