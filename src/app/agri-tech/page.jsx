import { Cpu, Plane, Compass, Wrench } from 'lucide-react';

export default function AgriTechPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase">
          आधुनिक कृषि तकनीक
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
          ड्रोन तकनीक एवं स्मार्ट कृषि उपकरण
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1">
          कम समय, कम लागत और कम पानी में संपूर्ण खेत पर कीटनाशक छिड़काव।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-xs">
          <Plane className="w-8 h-8 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">कृषि ड्रोन छिड़काव</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            1 एकड़ खेत में मात्र 7-10 मिनट में छिड़काव पूर्ण। 90% पानी और 30% रसायन की बचत।
          </p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-xs">
          <Cpu className="w-8 h-8 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">स्मार्ट ड्रिप ऑटोमेशन</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            सेंसर आधारित स्वचालित सिंचाई जो मिट्टी की नमी के अनुसार स्वतः पानी चालू करती है।
          </p>
        </div>
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-xs">
          <Compass className="w-8 h-8 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-base">सोइल टेस्टिंग किट</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            डिजिटल सॉइल टेस्टिंग डिवाइस से 5 मिनट में NPK एवं pH स्तर की जांच करें।
          </p>
        </div>
      </div>
    </div>
  );
}