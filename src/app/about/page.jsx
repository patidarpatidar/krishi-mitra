'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Target, 
  BookOpen, 
  Award, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Sprout, 
  Sparkles, 
  ChevronDown, 
  Calculator, 
  MessageSquare, 
  CheckCircle2, 
  MapPin, 
  TrendingUp,
  HelpCircle,
  Send,
  UserCheck
} from 'lucide-react';

export default function AboutPage() {
  const [landAcres, setLandAcres] = useState(5);
  const [cropType, setCropType] = useState('wheat');

  const cropData = {
    wheat: { name: 'गेहूँ (Wheat)', savingsPerAcre: 2500, yieldIncrease: '15-20%' },
    soybean: { name: 'सोयाबीन (Soybean)', savingsPerAcre: 3200, yieldIncrease: '18-22%' },
    garlic: { name: 'लहसुन (Garlic)', savingsPerAcre: 8500, yieldIncrease: '25-30%' },
    mustard: { name: 'सरसों (Mustard)', savingsPerAcre: 2800, yieldIncrease: '15-18%' }
  };

  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (idx) => setOpenFaq(openFaq === idx ? null : idx);

  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback) return;
    setSubmitted(true);
    setTimeout(() => {
      setFeedback('');
      setSubmitted(false);
    }, 4000);
  };

  const stats = [
    { label: 'दैनिक पाठक (Daily Readers)', value: '10,000+', icon: Users },
    { label: 'मंडी भाव अपडेट्स (Mandi Updates)', value: 'Daily', icon: TrendingUp },
    { label: 'कवर किए गए जिले (Districts)', value: '15+', icon: MapPin },
    { label: 'ब्लॉग आर्टिकल्स (Agri Blogs)', value: '100+', icon: BookOpen },
  ];

  const features = [
    {
      icon: Sprout,
      title: 'दैनिक मंडी भाव अपडेट्स',
      description: 'नीमच, मंदसौर, रतलाम सहित मालवांचल की मंडियों के ताज़ा और सटीक भाव ब्लॉग के माध्यम से साझा करना।',
      tag: 'ब्लॉग अपडेट्स'
    },
    {
      icon: ShieldCheck,
      title: 'खेती-किसानी की जानकारी',
      description: 'फसल प्रबंधन, कीट-रोग नियंत्रण और जैविक खेती से जुड़े व्यावहारिक लेख और अनुभव।',
      tag: 'मार्गदर्शन लेख'
    },
    {
      icon: UserCheck,
      title: 'सरकारी योजनाओं की जानकारी',
      description: 'PM-किसान और कृषि योजनाओं से जुड़ी जानकारी को सरल हिंदी भाषा में पाठकों तक पहुंचाना।',
      tag: 'सरल गाइड'
    },
  ];

  const faqs = [
    {
      q: 'क्या यह कोई सरकारी वेबसाइट या आधिकारिक केंद्र है?',
      a: 'नहीं, यह एक व्यक्तिगत कृषि ब्लॉग (Personal Blog) है। यहाँ साझा की जाने वाली जानकारी केवल किसानों की सहायता और जागरूकता के उद्देश्य से एकत्रित की जाती है।'
    },
    {
      q: 'क्या इस ब्लॉग पर दी गई जानकारी का कोई शुल्क है?',
      a: 'जी नहीं, कृषि मित्र ब्लॉग पर उपलब्ध सभी मंडी भाव, लेख और कृषि संबंधी जानकारियां पाठकों के लिए 100% नि:शुल्क हैं।'
    },
    {
      q: 'क्या मैं अपने ब्लॉग या खेती का अनुभव यहाँ शेयर कर सकता हूँ?',
      a: 'बिल्कुल! आप हमारे संपर्क पृष्ठ के माध्यम से अपने सुझाव या खेती से जुड़े अनुभव हमारे साथ साझा कर सकते हैं।'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Dynamic Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-emerald-700/40">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-400" /> व्यक्तिगत कृषि ब्लॉग एवं सूचना पोर्टल
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              कृषि मित्र <span className="text-emerald-400">(Krishi Mitra Blog)</span>
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
              नमस्कार! यह मेरा व्यक्तिगत ब्लॉग पोर्टल है जहाँ मैं मालवांचल के किसानों के लिए दैनिक मंडी भाव, खेती की तकनीकें और कृषि योजनाओं की उपयोगी जानकारी साझा करता हूँ।
            </p>
          </div>
          <div className="relative shrink-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-44 sm:h-44 bg-emerald-700/40 rounded-full flex items-center justify-center text-7xl sm:text-8xl shadow-inner border border-emerald-500/30 backdrop-blur-sm animate-pulse">
              🌾
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature: Farmer ROI Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2.5 text-emerald-400">
              <Calculator className="w-6 h-6 text-amber-400" /> 
              संभावित बचत कैलकुलेटर (Savings Estimator)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              देखें कि सही समय पर मंडी भाव और वैज्ञानिक कृषि सलाह का पालन करने से अनुमानित कितनी बचत हो सकती है।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-2 text-slate-300">
                <span>कुल कृषि भूमि:</span>
                <span className="text-emerald-400 font-extrabold text-sm">{landAcres} एकड़</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={landAcres} 
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2.5 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-slate-300">मुख्य फसल चुनें:</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {Object.keys(cropData).map((key) => (
                  <option key={key} value={key}>{cropData[key].name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block">संभावित वार्षिक अतिरिक्त बचत</span>
            <p className="text-3xl sm:text-4xl font-black text-amber-400">
              ₹{(landAcres * cropData[cropType].savingsPerAcre).toLocaleString('hi-IN')}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-300">
              <span>उत्पादन में सुधार: <strong className="text-emerald-400">{cropData[cropType].yieldIncrease}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
            <Target className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">ब्लॉग का उद्देश्य (Blog Mission)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            किसानों तक सही समय पर सटीक मंडी भाव और खेती से जुड़े व्यावहारिक लेख पहुँचाना, जिससे उन्हें अपनी फसल का उचित मूल्य और सही दिशा मिल सके।
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-4">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">हमारा विचार (Our Vision)</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            डिजिटल माध्यम और ब्लॉगिंग के ज़रिए मालवांचल एवं मध्य प्रदेश के किसान भाइयों को जागरूक और आत्मनिर्भर बनाना।
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-emerald-950 border border-emerald-900 text-white rounded-3xl p-8 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-2 flex flex-col items-center">
            <div className="w-10 h-10 bg-emerald-900/80 rounded-full flex items-center justify-center text-amber-400 mb-1">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl sm:text-4xl font-black text-amber-400">{stat.value}</p>
            <p className="text-xs text-emerald-200 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Blog Features */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">ब्लॉग की मुख्य विशेषताएं</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            हम सरल हिंदी भाषा में कृषि संबंधी जानकारी नियमित रूप से पोस्ट करते हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <feat.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                  {feat.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" /> सामान्य प्रश्न (FAQs)
        </h2>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Widget */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" /> ब्लॉग के लिए आपका सुझाव
          </h3>
          <p className="text-xs text-emerald-200">
            आप इस ब्लॉग पर और किस विषय पर लेख पढ़ना चाहते हैं? हमें ज़रूर बताएं।
          </p>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          {submitted ? (
            <div className="bg-emerald-800 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" /> आपके सुझाव के लिए धन्यवाद!
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="यहाँ अपना विचार लिखें..."
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-emerald-950/80 border border-emerald-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-emerald-400/60 outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button 
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> भेजें
              </button>
            </div>
          )}
        </form>
      </div>

      {/* CTA */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-lg font-extrabold text-amber-950">मंडी भाव और कृषि ब्लॉग देखना चाहते हैं?</h3>
          <p className="text-xs text-amber-800">ताज़ा ताज़ा अपडेट्स और आर्टिकल्स पढ़ें।</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/contact"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition flex items-center gap-2"
          >
            संपर्क करें <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/mandi-bhav"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-xl transition"
          >
            मंडी भाव देखें
          </Link>
        </div>
      </div>

    </div>
  );
}