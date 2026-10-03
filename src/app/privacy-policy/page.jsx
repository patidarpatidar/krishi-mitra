'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Bell, RefreshCw, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-950 text-slate-300 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-2xl shadow-2xl">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4" /> गोपनीयता एवं सुरक्षा
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>कृषि मित्र (Krishi Mitra)</strong> पर हम हमारे किसानों और उपयोगकर्ताओं की गोपनीयता का पूर्ण सम्मान करते हैं। यह गोपनीयता नीति यह स्पष्ट करती है कि जब आप हमारी वेबसाइट या मोबाइल एप्लिकेशन का उपयोग करते हैं, तो हम आपकी जानकारी को कैसे एकत्र, उपयोग और सुरक्षित करते हैं।
          </p>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Eye className="w-5 h-5 text-emerald-400" /> 1. हमारे द्वारा एकत्र की जाने वाली जानकारी
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>व्यक्तिगत विवरण:</strong> जब आप व्हाट्सएप अलर्ट या अलर्ट सेवा सबमिट करते हैं, तो आपका नाम, मोबाइल नंबर या ईमेल पता।</li>
              <li><strong>उपयोग डेटा:</strong> आपकी पसंदीदा मंडियां (उदा. नीमच मंडी), खोजी गई फसलें और स्थान संबंधी प्राथमिकताएं।</li>
              <li><strong>तकनीकी जानकारी:</strong> डिवाइस प्रकार, आईपी पता, ब्राउजर प्रकार और कुकीज़ (Cookies) ताकि आपको बेहतर अनुभव मिल सके।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-5 h-5 text-amber-400" /> 2. जानकारी का उपयोग
            </h2>
            <p className="text-slate-400">हम आपकी जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>दैनिक मंडी भाव, मौसम अपडेट और कृषि सलाह की सूचनाएं आपके व्हाट्सएप/ईमेल पर भेजने के लिए।</li>
              <li>पशुपालन कैलकुलेटर, बीमारी पहचानकर्ता और क्रय-विक्रय सेवा को आपके लिए अनुकूलित करने के लिए।</li>
              <li>प्लेटफॉर्म के प्रदर्शन और तकनीकी सुरक्षा में सुधार करने के लिए।</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Bell className="w-5 h-5 text-sky-400" /> 3. डेटा साझाकरण (Data Sharing)
            </h2>
            <p className="text-slate-400">
              हम आपकी व्यक्तिगत जानकारी को किसी भी तीसरे पक्ष (Third Party) को बेचते या किराए पर नहीं देते हैं। आपकी जानकारी केवल कृषि मित्र सेवा प्रदान करने के लिए आवश्यक सुरक्षित सर्वर पर ही संग्रहीत की जाती है।
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <RefreshCw className="w-5 h-5 text-purple-400" /> 4. नीति में परिवर्तन
            </h2>
            <p className="text-slate-400">
              कृषि मित्र समय-समय पर इस गोपनीयता नीति को अद्यतन करने का अधिकार सुरक्षित रखता है। किसी भी बड़े बदलाव की सूचना इस पृष्ठ पर प्रकाशित की जाएगी।
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
            <h3 className="font-bold text-white">गोपनीयता संबंधी संपर्क:</h3>
            <p className="text-slate-400">यदि आपके पास इस गोपनीयता नीति से संबंधित कोई प्रश्न या शिकायत है, तो कृपया हमसे संपर्क करें:</p>
            <p className="text-emerald-400 font-medium">ईमेल: privacy@krishimitra.com | सहायता फ़ोन: +91 98260 XXXXX</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs text-slate-500">
          <Link href="/" className="text-emerald-400 hover:underline">← मुख्य पृष्ठ पर लौटें</Link>
          <Link href="/terms" className="hover:text-slate-300">नियम एवं शर्तें देखें →</Link>
        </div>

      </div>
    </div>
  );
}