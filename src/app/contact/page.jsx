'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <span className="bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase">
          किसान सहायता केंद्र
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
          संपर्क करें एवं सहायता प्राप्त करें
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1">
          कृषि संबंधी सलाह, नीमच मंडी भाव पूछताछ या पोर्टल सहायता हेतु हमसे जुड़ें।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information & Helplines */}
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="text-lg font-bold">हेल्पलाइन नंबर (Kisan Toll-Free)</h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold">1800-180-1551</p>
                  <p className="text-emerald-200 text-[11px]">किसान कॉल सेंटर (सुबह 6 से रात 10 बजे)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-emerald-800">
                <MessageSquare className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold">+91 98260 XXXXX</p>
                  <p className="text-emerald-200 text-[11px]">व्हाट्सएप कृषि सहायता हेल्पलाइन</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-emerald-800">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold">कृषि सेवा केंद्र, नीमच मंडी प्रांगण</p>
                  <p className="text-emerald-200 text-[11px]">महू-नसीराबाद रोड, नीमच (म.प्र.) 458441</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Contact Inquiry Form */}
        <div className="md:col-span-2 bg-white border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">आपका संदेश प्राप्त हो गया है!</h3>
              <p className="text-xs text-slate-600">
                हमारे कृषि प्रतिनिधि जल्द ही आपसे संपर्क करेंगे।
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                दूसरा संदेश भेजें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-emerald-100 pb-2">
                अपनी समस्या या प्रश्न दर्ज करें
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">पूरा नाम</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="उदा. रामेश्वर धाकड़"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">मोबाइल नंबर</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10 अंकों का नंबर"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">जिला (District)</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Neemuch">नीमच (Neemuch)</option>
                    <option value="Mandsaur">मंदसौर (Mandsaur)</option>
                    <option value="Ratlam">रतलाम (Ratlam)</option>
                    <option value="Ujjain">उज्जैन (Ujjain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">विषय (Query Type)</label>
                  <select
                    value={formData.queryType}
                    onChange={(e) => setFormData({ ...formData, queryType: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Mandi Bhav">मंडी भाव संबंधी</option>
                    <option value="Crop Advisory">फसल रोग व कीटनाशक सलाह</option>
                    <option value="Govt Scheme">सरकारी योजना / PM-Kisan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">अपना संदेश या सवाल लिखें</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="विस्तृत विवरण लिखें..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
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