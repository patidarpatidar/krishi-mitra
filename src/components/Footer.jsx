'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Heart, 
  Share2, 
  CheckCircle2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle
} from 'lucide-react';

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (phoneOrEmail.trim()) {
      setSubscribed(true);
      setPhoneOrEmail('');
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp Channel',
      icon: MessageCircle,
      href: 'https://whatsapp.com',
      color: 'hover:bg-emerald-500 hover:text-white',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com',
      color: 'hover:bg-red-600 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com',
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com',
      color: 'hover:bg-pink-600 hover:text-white',
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: 'https://twitter.com',
      color: 'hover:bg-sky-500 hover:text-white',
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Interactive Banner: Mandi Rate Alerts */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-400 text-slate-950 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              व्हाट्सएप एवं मंडी भाव अलर्ट
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              किसान मित्र अपडेट्स से जुड़ें!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              अपना मोबाइल नंबर या ईमेल दर्ज करें और सुबह-सुबह नीमच व आसपास की मंडियों के सटीक भाव सीधे प्राप्त करें।
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="bg-emerald-900/80 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                धन्यवाद! आपका नंबर सफलतापूर्वक रजिस्टर हो गया है।
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="मोबाइल नंबर / Email दर्ज करें..."
                  className="bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400 w-full"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0 cursor-pointer"
                >
                  सब्सक्राइब <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Kisan Mitra Branding & Social Links */}
          <div className="space-y-4">
            {/* Kisan Mitra Logo Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-amber-400 flex items-center justify-center text-xl shadow-md shrink-0">
                🌱
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide leading-tight">
                  किसान <span className="text-emerald-400">मित्र</span>
                </h2>
                <p className="text-[10px] text-amber-400 font-medium">आपका सच्चा कृषि साथी</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              किसान मित्र - नीमच मंडी के सटीक भाव, मौसम पूर्वानुमान, फसल सुरक्षा एवं आधुनिक कृषि तकनीकों की सही जानकारी देने वाला भरोसेमंद डिजिटल मंच।
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-emerald-400" /> सोशल मीडिया पर जुड़ें:
              </p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className={`p-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition-all duration-200 hover:-translate-y-1 ${s.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-500/40 pb-2 inline-block">
              मुख्य सेवाएं
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/mandi-bhav" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> लाइव नीमच मंडी भाव
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> मौसम पूर्वानुमान
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> कृषि सलाह व ब्लॉग
                </Link>
              </li>
              <li>
                <Link href="/agri-tech" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> आधुनिक कृषि तकनीक
                </Link>
              </li>
              <li>
                <Link href="/organic-farming" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="text-emerald-500">›</span> जैविक खेती एवं जैविक खाद
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Crops */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-500/40 pb-2 inline-block">
              फसल गाइड
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/crops/garlic" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  🧄 लहसुन खेती एवं भाव
                </Link>
              </li>
              <li>
                <Link href="/crops/soyabean" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  🌱 सोयाबीन प्रबंधन
                </Link>
              </li>
              <li>
                <Link href="/crops/wheat" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  🌾 गेहूं उत्पादन तकनीक
                </Link>
              </li>
              <li>
                <Link href="/crops/gram" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  🫘 चना सुरक्षा टिप्स
                </Link>
              </li>
              <li>
                <Link href="/crops/maize" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  🌽 मक्का खेती गाइड
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-emerald-500/40 pb-2 inline-block">
              संपर्क करें
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>कृषि उपज मंडी रोड, नीमच (म.प्र.) 458441</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>हेल्पलाइन: +91 98260 XXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@kisanmitra.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-2">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {new Date().getFullYear()} किसान मित्र। सर्वाधिकार सुरक्षित। Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Farmers.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition">गोपनीयता नीति</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition">नियम एवं शर्तें</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-300 transition">संपर्क करें</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}