'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Landmark, FileText, CheckCircle2, ArrowRight, ExternalLink, Search } from 'lucide-react';

const schemesList = [
  {
    id: 'pm-kisan',
    title: 'PM किसान सम्मान निधि योजना',
    category: 'केंद्र सरकार',
    benefit: '₹6,000 प्रति वर्ष (3 समान किस्तों में)',
    eligibility: 'समस्त सीमांत व छोटे कृषक (2 हेक्टेयर तक योग्य भूमि)',
    documents: ['आधार कार्ड', 'खसरा/खतौनी नकल', 'बैंक पासबुक', 'मोबाइल नंबर'],
    link: '/pm-kisan',
    isExternal: false,
  },
  {
    id: 'pm-fasal-bima',
    title: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    category: 'केंद्र व राज्य',
    benefit: 'प्राकृतिक आपदाओं से फसल नुकसान की शत-प्रतिशत भरपाई',
    eligibility: 'अधिसूचित फसलों के उत्पादक सभी किसान',
    documents: ['फसल बुआई प्रमाण पत्र', 'भू-अधिकार पुस्तिका', 'बैंक खाता विवरण'],
    link: 'https://pmfby.gov.in',
    isExternal: true,
  },
  {
    id: 'mp-kisan-kalyan',
    title: 'मुख्यमंत्री किसान कल्याण योजना (MP)',
    category: 'मध्य प्रदेश सरकार',
    benefit: '₹6,000 अतिरिक्त वार्षिक सहायता (PM किसान के साथ कुल ₹12,000)',
    eligibility: 'MP के मूल निवासी एवं PM-Kisan पात्र किसान',
    documents: ['समान पात्रता विवरण', 'समग्र आईडी'],
    link: 'https://saara.mp.gov.in',
    isExternal: true,
  },
  {
    id: 'krishi-yantra-subsidy',
    title: 'कृषि यंत्र अनुदान योजना (MP)',
    category: 'मध्य प्रदेश सरकार',
    benefit: 'ट्रैक्टर, रोटावेटर एवं ड्रिप सिंचाई पर 40% - 50% सब्सिडी',
    eligibility: 'मध्य प्रदेश के सभी वर्ग के कृषक',
    documents: ['जाति प्रमाण पत्र', 'भूमि दस्तावेज', 'बैंक पासबुक'],
    link: 'https://dmt.mponline.gov.in',
    isExternal: true,
  },
];

export default function GovtSchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchemes = schemesList.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-amber-400 text-slate-900 font-bold text-xs px-3 py-1 rounded-full uppercase">
            सरकारी सहायता पोर्टल
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
            प्रमुख सरकारी कृषि योजनाएं
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            केंद्र एवं मध्य प्रदेश शासन द्वारा संचालित किसान कल्याण योजनाओं की जानकारी और आवेदन लिंक।
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="योजना का नाम खोजें (उदा. PM किसान, फसल बीमा)..."
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-400 transition">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
                  {scheme.category}
                </span>
                <Landmark className="w-5 h-5 text-emerald-700" />
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-3">{scheme.title}</h2>
              <div className="mt-2 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <span className="text-[11px] text-amber-800 font-semibold block">लाभ (Benefit):</span>
                <p className="text-xs font-bold text-amber-950 mt-0.5">{scheme.benefit}</p>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-700">
                <p><strong>पात्रता:</strong> {scheme.eligibility}</p>
                <div>
                  <strong className="block mb-1">आवश्यक दस्तावेज:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {scheme.documents.map(doc => (
                      <span key={doc} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {scheme.isExternal ? (
              <a
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition"
              >
                आधिकारिक पोर्टल पर आवेदन करें <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={scheme.link}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-bold transition"
              >
                विवरण एवं स्टेटस चेक गाइड <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}