'use client';

import { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  Globe,
  Headphones
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'Neemuch',
    queryType: 'Mandi Bhav',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-emerald-700/40">
        <div className="relative z-10 max-w-3xl space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-400" /> ब्लॉग सहायता एवं संपर्क
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            संपर्क करें एवं सहायता प्राप्त करें
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            यदि आपके पास नीमच मंडी भाव, फसल सलाह या कृषि मित्र ब्लॉग से संबंधित कोई प्रश्न या सुझाव है, तो सीधे संदेश भेजें या हेल्पलाइन नंबर पर संपर्क करें।
          </p>
        </div>
      </div>

      {/* Quick Helpline & Contact Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Actual Kisan Toll-Free Number */}
        <a 
          href="tel:18001801551" 
          className="bg-white border border-slate-200 hover:border-emerald-500 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">किसान कॉल सेंटर (Toll-Free)</span>
            <h4 className="text-base font-extrabold text-slate-900">1800-180-1551</h4>
            <p className="text-[11px] text-emerald-600 font-medium">सुबह 6:00 से रात 10:00 तक</p>
          </div>
        </a>

        {/* WhatsApp Chat Link */}
        <a 
          href="https://wa.me/919826000000?text=नमस्ते%20कृषि%20मित्र,%20मुझे%20मंडी%20भाव%20या%20खेती%20के%20संबंध%20में%20पूछना%20है।" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white border border-slate-200 hover:border-emerald-500 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">व्हाट्सएप सहायता</span>
            <h4 className="text-base font-extrabold text-slate-900">+91 98260 XXXXX</h4>
            <p className="text-[11px] text-emerald-600 font-medium">चैट शुरू करें →</p>
          </div>
        </a>

        {/* Email Support */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">ब्लॉग ईमेल सपोर्ट</span>
            <h4 className="text-sm font-extrabold text-slate-900">contact@krishimitra.in</h4>
            <p className="text-[11px] text-slate-500">निःशुल्क कृषि जानकारी पोर्टल</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Info Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" /> ब्लॉग क्षेत्र एवं जानकारी
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div>
                <p className="font-bold text-white text-base">नीमच व मालवांचल क्षेत्र (म.प्र.)</p>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  यह पोर्टल एक व्यक्तिगत कृषि ब्लॉग है, जहाँ नीमच, मंदसौर और रतलाम जिले की प्रमुख मंडियों के ताज़ा भाव और फसल प्रबंधन सलाह शेयर की जाती है।
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-amber-300 font-medium text-xs flex items-center gap-2">
                  <Headphones className="w-4 h-4" /> सरकारी सलाह के लिए 1800-180-1551 (KCC) पर संपर्क करें।
                </p>
              </div>
            </div>

            {/* Google Map Widget */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 h-48 bg-slate-800">
              <iframe
                title="Neemuch Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14589.654817478051!2d74.871221!3d24.460814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39662b2b1d7d0a27%3A0x6b4f707f4337d1d2!2sNeemuch%20Mandi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right Inquiry / Message Form */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">आपका संदेश प्राप्त हो गया है!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                धन्यवाद! आपके सवाल या सुझाव का उत्तर जल्द ही दिया जाएगा।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition cursor-pointer"
              >
                दूसरा संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">
                  अपना प्रश्न या प्रतिक्रिया भेजें
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">ब्लॉग एडमिन को सीधा संदेश भेजने के लिए फॉर्म भरें</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">आपका नाम *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. रामेश्वर धाकड़"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">मोबाइल नंबर *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10 अंकों का नंबर"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">जिला (District) *</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  >
                    <option value="Neemuch">नीमच (Neemuch)</option>
                    <option value="Mandsaur">मंदसौर (Mandsaur)</option>
                    <option value="Ratlam">रतलाम (Ratlam)</option>
                    <option value="Ujjain">उज्जैन (Ujjain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">विषय (Query Topic) *</label>
                  <select
                    value={formData.queryType}
                    onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  >
                    <option value="Mandi Bhav">मंडी भाव पूछताछ</option>
                    <option value="Crop Advisory">खेती-किसानी जानकारी</option>
                    <option value="Blog Feedback">ब्लॉग फीडबैक / सुझाव</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">अपना संदेश या सवाल लिखें *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="अपना सवाल या विचार लिखें..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10"
              >
                संदेश भेजें <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}