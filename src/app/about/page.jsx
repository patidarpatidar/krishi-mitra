import Link from 'next/link';
import { Target, HeartHandshake, Award, Users, ShieldCheck, ArrowRight, Sprout, Building2, PhoneCall } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'सक्रिय किसान (Active Farmers)', value: '50,000+' },
    { label: 'मंडी भाव अपडेट्स (Mandi Updates)', value: 'Daily / 24x7' },
    { label: 'कवर किए गए जिले (Districts Covered)', value: '15+' },
    { label: 'कृषि योजनाएं (Govt Schemes)', value: '25+' },
  ];

  const features = [
    {
      icon: Sprout,
      title: 'सटीक मंडी भाव (Real-Time Mandi Rates)',
      description: 'नीमच, मंदसौर, रतलाम सहित मालवांचल की प्रमुख मंडियों के ताज़ा और सटीक भाव हर दिन उपलब्ध कराना।'
    },
    {
      icon: ShieldCheck,
      title: 'प्रमाणित कृषि ज्ञान (Verified Agri Guidance)',
      description: 'कृषि वैज्ञानिकों द्वारा जांची-परखी फसल प्रबंधन सलाह, कीट-रोग नियंत्रण और जैविक खेती गाइड।'
    },
    {
      icon: HeartHandshake,
      title: 'सरकारी योजनाओं का लाभ (Direct Scheme Access)',
      description: 'PM-किसान, फसल बीमा और सब्सिडी योजनाओं की पात्रता, दस्तावेज और आवेदन की सरल जानकारी।'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-10 rounded-2xl shadow-md text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <span className="bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            हमारे बारे में (About Us)
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
            कृषि मित्र (Krishi Mitra): किसानों का सच्चा और डिजिटल साथी
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            हमारा उद्देश्य मध्य प्रदेश और आसपास के किसानों को आधुनिक तकनीक, सटीक मंडी भाव और मौसम आधारित कृषि सलाह से समृद्ध बनाना है।
          </p>
        </div>
        <div className="text-6xl sm:text-8xl shrink-0">🌾</div>
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">हमारा लक्ष्य (Our Mission)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            हर किसान तक सही समय पर सही जानकारी पहुंचाना ताकि उनकी लागत कम हो, फसल उत्पादन बेहतर हो और मंडी में उपज का उच्चतम मूल्य प्राप्त हो सके।
          </p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900">हमारा संकल्प (Our Vision)</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            परंपरागत खेती को डिजिटल तकनीक से जोड़कर देश के हर छोटे-बड़े किसान को आत्मनिर्भर, जागरूक और आर्थिक रूप से सशक्त बनाना।
          </p>
        </div>
      </div>

      {/* Key Stats Counter Grid */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-2xl sm:text-4xl font-extrabold text-amber-400">{stat.value}</p>
            <p className="text-[11px] sm:text-xs text-emerald-200 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Krishi Mitra? */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">कृषि मित्र ही क्यों चुनें?</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            हम किसानों की आवश्यकताओं को ध्यान में रखकर सरल हिंदी भाषा में सभी कृषि सेवाएं प्रदान करते हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs hover:border-emerald-400 transition space-y-3">
              <feat.icon className="w-8 h-8 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call To Action */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-amber-950">क्या आपको कृषि या मंडी भाव से जुड़ा कोई सवाल है?</h3>
          <p className="text-xs text-amber-800 mt-1">हमारे विशेषज्ञों से सीधा संपर्क करें या सहायता केंद्र पर अपनी समस्या दर्ज करें।</p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/contact"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2"
          >
            संपर्क करें <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/mandi-bhav"
            className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition"
          >
            मंडी भाव देखें
          </Link>
        </div>
      </div>
    </div>
  );
}