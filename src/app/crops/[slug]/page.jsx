import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldAlert, Droplets, Sun, Calendar, TrendingUp } from 'lucide-react';

const cropDetailsDatabase = {
  garlic: {
    name: 'लहसुन (Garlic)',
    scientificName: 'Allium sativum',
    category: 'नगदी / मसाला फसल',
    season: 'रबी (Rabi)',
    icon: '🧄',
    overview: 'लहसुन मालवा क्षेत्र (विशेषकर नीमच और मंदसौर) की सबसे प्रमुख नगदी फसलों में से एक है। जी-2, रियावन और ऊंटनी लहसुन की किस्में देश भर की मंडियों में प्रसिद्ध हैं।',
    varieties: ['जी-2 (G-2 Garlic)', 'रियावन सिल्वर', 'ऊंटनी लहसुन', 'यमुना सफेद (G-1)'],
    soilRequirement: 'अच्छे जल निकास वाली बलुई दोमट या मध्यम काली मिट्टी। भूमि का pH मान 6.0 से 7.0 उत्तम माना जाता है।',
    sowingTime: '15 अक्टूबर से 15 नवंबर (उपयुक्त तापमान: 20°C - 25°C)',
    waterRequirement: '8 से 10 सिंचाइयां (मृदा प्रकार के अनुसार 10-12 दिन के अंतराल पर)।',
    diseases: [
      {
        name: 'बैंगनी धब्बा रोग (Purple Blotch)',
        symptoms: 'पत्तियों पर छोटे बैंगनी रंग के धब्बे बनना।',
        solution: 'मैन्कोज़ेब (Mancozeb) 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।'
      },
      {
        name: 'थ्रिप्स (Thrips Pest)',
        symptoms: 'पत्तियों का पीला पड़ना और मुड़ना।',
        solution: 'इमिडाक्लोप्रिड (Imidacloprid) 0.5 ml प्रति लीटर छिड़काव करें।'
      }
    ],
    mandiPrice: {
      min: '₹7,500',
      max: '₹16,200',
      modal: '₹12,500',
      unit: 'क्विंटल (Neemuch Mandi)'
    }
  },
  soyabean: {
    name: 'सोयाबीन (Soyabean)',
    scientificName: 'Glycine max',
    category: 'खरीफ / तिलहन फसल',
    season: 'खरीफ (Kharif)',
    icon: '🌱',
    overview: 'सोयाबीन मध्य प्रदेश को "सोया राज्य" का दर्जा दिलाती है। यह प्रोटीन एवं खाद्य तेल का मुख्य स्रोत है।',
    varieties: ['JS 95-60', 'JS 20-34', 'JS 20-29', 'NRC 86'],
    soilRequirement: 'मध्यम से गहरी काली मिट्टी जिसमें जल निकास की उत्तम व्यवस्था हो।',
    sowingTime: '20 जून से 15 जुलाई (मानसून की पहली पर्याप्त वर्षा के बाद)',
    waterRequirement: 'मुख्यतः मानसूनी वर्षा पर निर्भर; फली बनते समय सिंचाई आवश्यक।',
    diseases: [
      {
        name: 'पीला मोज़ेक वायरस (Yellow Mosaic)',
        symptoms: 'पत्तियों पर पीले रंग के चकत्ते बनना।',
        solution: 'सफेद मक्खी नियंत्रण हेतु थायामेथोक्सम का प्रयोग करें।'
      }
    ],
    mandiPrice: {
      min: '₹4,200',
      max: '₹4,850',
      modal: '₹4,650',
      unit: 'क्विंटल (Neemuch Mandi)'
    }
  }
};

export default function CropDetailPage({ params }) {
  const crop = cropDetailsDatabase[params.slug] || cropDetailsDatabase['garlic'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/crops"
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> फसल निर्देशिका पर लौटें
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-4xl">{crop.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{crop.name}</h1>
              <p className="text-xs text-emerald-200 italic">{crop.scientificName}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 pt-2 leading-relaxed max-w-2xl">
            {crop.overview}
          </p>
        </div>

        {/* Live Rate Card */}
        <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center w-full sm:w-auto shrink-0">
          <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded uppercase">
            नीमच मंडी मॉडल भाव
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">{crop.mandiPrice.modal}</div>
          <span className="text-[11px] text-emerald-100">प्रति {crop.mandiPrice.unit}</span>
        </div>
      </div>

      {/* Key Agronomic Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-500 font-medium">बुआई का समय</span>
          <h4 className="text-sm font-bold text-slate-900">{crop.sowingTime}</h4>
        </div>
        <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-500 font-medium">उपयुक्त मिट्टी</span>
          <h4 className="text-sm font-bold text-slate-900">{crop.soilRequirement}</h4>
        </div>
        <div className="bg-white border border-emerald-100 p-4 rounded-xl space-y-1">
          <span className="text-xs text-slate-500 font-medium">सिंचाई प्रबंधन</span>
          <h4 className="text-sm font-bold text-slate-900">{crop.waterRequirement}</h4>
        </div>
      </div>

      {/* Varieties & Diseases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Improved Varieties */}
        <div className="bg-white border border-emerald-100 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> प्रमुख उन्नत किस्में
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {crop.varieties.map((v) => (
              <li key={v} className="flex items-center gap-2 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 font-medium">
                <span className="text-emerald-700">•</span> {v}
              </li>
            ))}
          </ul>
        </div>

        {/* Disease Control */}
        <div className="bg-white border border-amber-200 rounded-xl p-5 space-y-3">
          <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" /> रोग एवं कीट प्रबंधन
          </h3>
          <div className="space-y-3">
            {crop.diseases.map((d) => (
              <div key={d.name} className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs space-y-1">
                <h4 className="font-bold text-amber-900">{d.name}</h4>
                <p className="text-slate-600"><strong>लक्षण:</strong> {d.symptoms}</p>
                <p className="text-emerald-800"><strong>उपचार:</strong> {d.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}