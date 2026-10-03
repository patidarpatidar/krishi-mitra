'use client';

import Link from 'next/link';
import { FileText, AlertTriangle, CheckCircle, Scale, ShieldAlert } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="bg-slate-950 text-slate-300 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-400 text-xs font-bold uppercase">
            <Scale className="w-4 h-4" /> नियम एवं शर्तें
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            उपयोग की शर्तें (Terms & Conditions)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>कृषि मित्र (Krishi Mitra)</strong> पोर्टल का उपयोग करने से पहले कृपया इन नियमों और शर्तों को ध्यानपूर्वक पढ़ें। हमारी वेबसाइट, मोबाइल ऐप या सेवाओं का उपयोग करके आप इन शर्तों से बंधने के लिए अपनी सहमति व्यक्त करते हैं।
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> 1. सेवा की प्रकृति
            </h2>
            <p className="text-slate-400">
              कृषि मित्र एक निजी सूचनात्मक डिजिटल मंच है जो किसानों को नीमच एवं आसपास की कृषि उपज मंडियों के लाइव भाव, मौसम पूर्वानुमान, फसल सलाह और पशुपालन संबंधी जानकारी उपलब्ध कराता है।
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> 2. मंडी भाव एवं जानकारी का अस्वीकरण (Disclaimer)
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>हमारे द्वारा प्रदर्शित मंडी भाव, आवक और दरें विभिन्न स्रोतों और मंडी प्रतिनिधियों से प्राप्त की जाती हैं।</li>
              <li>बाजार में भाव हर समय परिवर्तनशील होते हैं। इसलिए, किसी भी प्रकार की फसल खरीद या बिक्री का अंतिम निर्णय लेने से पूर्व स्वयं मंडी परिसर में पुष्टि अवश्य करें।</li>
              <li>कृषि मित्र मंडी भावों के अंतर या किसी व्यावसायिक नुकसान के लिए प्रत्यक्ष या अप्रत्यक्ष रूप से उत्तरदायी नहीं होगा।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> 3. पशु क्रय-विक्रय व बाजार संबंधी नियम
            </h2>
            <p className="text-slate-400">
              पशुपालन हब (Pashu Bazar) के माध्यम से किसान आपस में संपर्क कर सकते हैं। कृषि मित्र केवल एक सूचना मंच है। किसी भी लेन-देन, भुगतान या पशु स्वास्थ्य दावों की पुष्टि खरीददार और विक्रेता को स्वयं करनी होगी।
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileText className="w-5 h-5 text-sky-400" /> 4. बौद्धिक संपदा अधिकार
            </h2>
            <p className="text-slate-400">
              कृषि मित्र के सभी लोगो (Logo), कंटेंट, कोड, डिज़ाइन और टूल (जैसे- पशु आहार कैलकुलेटर) कृषि मित्र की बौद्धिक संपदा हैं। बिना पूर्व अनुमति के इनका व्यावसायिक उपयोग वर्जित है।
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
            <h3 className="font-bold text-white">कानूनी सहायता एवं प्रश्न:</h3>
            <p className="text-slate-400">यदि आपके पास नियमों और शर्तों के संबंध में कोई प्रश्न है, तो संपर्क करें:</p>
            <p className="text-emerald-400 font-medium">ईमेल: legal@krishimitra.com | कृषि उपज मंडी रोड, नीमच (म.प्र.) 458441</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs text-slate-500">
          <Link href="/" className="text-emerald-400 hover:underline">← मुख्य पृष्ठ पर लौटें</Link>
          <Link href="/privacy-policy" className="hover:text-slate-300">गोपनीयता नीति देखें →</Link>
        </div>

      </div>
    </div>
  );
}