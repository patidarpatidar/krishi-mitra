'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Scale,
  ShieldAlert,
  ChevronDown,
  Info,
  Sprout,
  UserCheck,
  RefreshCw,
  MessageCircle,
  ArrowRight,
  Lock,
  Copyright,
} from 'lucide-react';

const termsSections = [
  {
    id: 'nature',
    number: '01',
    icon: Sprout,
    title: 'कृषि मित्र की सेवा की प्रकृति',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    content: (
      <>
        <p>
          <strong className="text-white">कृषि मित्र (Krishi Mitra)</strong> एक
          व्यक्तिगत online कृषि information platform है। इसका उद्देश्य किसानों
          और सामान्य users को कृषि से संबंधित उपयोगी जानकारी एक स्थान पर
          उपलब्ध कराना है।
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          <InfoCard
            icon={Sprout}
            title="कृषि जानकारी"
            text="फसल, खेती, जैविक खेती और कृषि संबंधी सामान्य जानकारी।"
          />

          <InfoCard
            icon={FileText}
            title="मंडी जानकारी"
            text="उपलब्ध स्रोतों के आधार पर मंडी भाव और बाजार से जुड़ी जानकारी।"
          />

          <InfoCard
            icon={Info}
            title="मौसम एवं सलाह"
            text="मौसम और कृषि advisory से जुड़ी सामान्य informational content।"
          />

          <InfoCard
            icon={CheckCircle}
            title="Calculators"
            text="खेती से जुड़े अनुमान और गणना के लिए उपयोगी digital tools।"
          />
        </div>

        <div className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
          <p className="text-sm text-slate-400">
            <strong className="text-sky-400">महत्वपूर्ण:</strong> कृषि मित्र
            कोई सरकारी वेबसाइट, सरकारी विभाग, सरकारी कृषि केंद्र या सरकारी
            संस्था नहीं है।
          </p>
        </div>
      </>
    ),
  },

  {
    id: 'information',
    number: '02',
    icon: AlertTriangle,
    title: 'मंडी भाव, मौसम एवं कृषि जानकारी',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    content: (
      <>
        <p>
          वेबसाइट पर उपलब्ध जानकारी विभिन्न public, available या अन्य
          information sources से प्राप्त हो सकती है। जानकारी की accuracy,
          completeness और availability समय के साथ बदल सकती है।
        </p>

        <ul className="space-y-3 mt-5">
          <TermsPoint>
            मंडी भाव बाजार की स्थिति के अनुसार लगातार बदल सकते हैं।
          </TermsPoint>

          <TermsPoint>
            वेबसाइट पर दिखाई गई कीमत को अंतिम खरीद या बिक्री कीमत न मानें।
          </TermsPoint>

          <TermsPoint>
            महत्वपूर्ण व्यापारिक निर्णय लेने से पहले संबंधित मंडी या अधिकृत
            source से जानकारी verify करें।
          </TermsPoint>

          <TermsPoint>
            मौसम संबंधी जानकारी forecast होती है और वास्तविक मौसम इससे अलग
            हो सकता है।
          </TermsPoint>

          <TermsPoint>
            कृषि सलाह सामान्य informational purpose के लिए है और हर खेत,
            मिट्टी, फसल, variety या मौसम की स्थिति पर समान रूप से लागू नहीं हो
            सकती।
          </TermsPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'agriculture-disclaimer',
    number: '03',
    icon: ShieldAlert,
    title: 'कृषि निर्णय एवं Disclaimer',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    content: (
      <>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <h3 className="text-white font-bold">
            कृषि मित्र की जानकारी को अंतिम कृषि सलाह न मानें।
          </h3>

          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            खेती से संबंधित कोई महत्वपूर्ण निर्णय लेने से पहले स्थानीय
            परिस्थितियों, soil condition, crop variety, मौसम और विशेषज्ञ
            सलाह को ध्यान में रखें।
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-5">
          <InfoCard
            icon={AlertTriangle}
            title="दवा / कीटनाशक"
            text="हमेशा product label और authorized recommendation देखें।"
          />

          <InfoCard
            icon={CheckCircle}
            title="कृषि विशेषज्ञ"
            text="जरूरत होने पर KVK, कृषि विभाग या स्थानीय विशेषज्ञ से सलाह लें।"
          />
        </div>
      </>
    ),
  },

  {
    id: 'user-responsibility',
    number: '04',
    icon: UserCheck,
    title: 'User की जिम्मेदारी',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    content: (
      <>
        <p>
          वेबसाइट का उपयोग करते समय user को उपलब्ध जानकारी का जिम्मेदारी से
          उपयोग करना चाहिए।
        </p>

        <ul className="space-y-3 mt-5">
          <TermsPoint>
            गलत, misleading या किसी अन्य व्यक्ति की personal information
            जानबूझकर submit न करें।
          </TermsPoint>

          <TermsPoint>
            वेबसाइट को किसी illegal, harmful या unauthorized activity के लिए
            इस्तेमाल न करें।
          </TermsPoint>

          <TermsPoint>
            Website के server, database या security को नुकसान पहुंचाने का प्रयास
            न करें।
          </TermsPoint>

          <TermsPoint>
            किसी अन्य व्यक्ति या संस्था के रूप में गलत पहचान बनाकर service का
            उपयोग न करें।
          </TermsPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'third-party',
    number: '05',
    icon: Lock,
    title: 'Third-Party Services एवं Links',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    content: (
      <>
        <p>
          कृषि मित्र पर भविष्य में third-party services, external websites,
          analytics tools, maps, advertising platforms या अन्य external
          services के links/features हो सकते हैं।
        </p>

        <div className="mt-5 rounded-xl bg-slate-950 border border-slate-800 p-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            ऐसे third-party platforms की अपनी Terms & Conditions और Privacy
            Policy हो सकती है। कृषि मित्र उन external platforms की policies,
            availability या practices के लिए जिम्मेदार नहीं है।
          </p>
        </div>
      </>
    ),
  },

  {
    id: 'intellectual-property',
    number: '06',
    icon: Copyright,
    title: 'बौद्धिक संपदा (Intellectual Property)',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    content: (
      <>
        <p>
          कृषि मित्र की website का original design, branding, logo, original
          written content, code और अन्य original materials, जहां लागू हो,
          intellectual property rights के अंतर्गत आते हैं।
        </p>

        <ul className="space-y-3 mt-5">
          <TermsPoint>
            Website content को बिना अनुमति commercial purpose के लिए copy या
            reproduce न करें।
          </TermsPoint>

          <TermsPoint>
            Website के design, code या branding को बिना अनुमति duplicate न करें।
          </TermsPoint>

          <TermsPoint>
            अन्य third-party sources से प्राप्त सामग्री उनके respective owners
            के rights के अधीन हो सकती है।
          </TermsPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'availability',
    number: '07',
    icon: RefreshCw,
    title: 'Website Availability',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    content: (
      <>
        <p>
          हम website को उपयोगी और उपलब्ध रखने का प्रयास करते हैं, लेकिन
          website हमेशा बिना interruption के उपलब्ध रहेगी इसकी guarantee नहीं
          दी जा सकती।
        </p>

        <ul className="space-y-3 mt-5">
          <TermsPoint>
            Hosting, server, network या technical issues के कारण temporary
            downtime हो सकता है।
          </TermsPoint>

          <TermsPoint>
            कुछ features समय-समय पर update, modify या remove किए जा सकते हैं।
          </TermsPoint>

          <TermsPoint>
            बिना prior notice के technical maintenance किया जा सकता है।
          </TermsPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'liability',
    number: '08',
    icon: Scale,
    title: 'उत्तरदायित्व की सीमा',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    content: (
      <>
        <p>
          कृषि मित्र पर उपलब्ध information के आधार पर लिए गए किसी कृषि,
          व्यापारिक, financial या अन्य निर्णय की जिम्मेदारी user की स्वयं की
          होगी।
        </p>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <InfoCard
            icon={AlertTriangle}
            title="Market Loss"
            text="बाजार भाव में बदलाव के कारण होने वाले नुकसान के लिए platform जिम्मेदार नहीं है।"
          />

          <InfoCard
            icon={AlertTriangle}
            title="Agriculture Loss"
            text="फसल, मौसम, disease या input-related नुकसान की guarantee नहीं दी जाती।"
          />

          <InfoCard
            icon={AlertTriangle}
            title="Data Accuracy"
            text="Available information में error, delay या incompleteness हो सकती है।"
          />

          <InfoCard
            icon={ShieldAlert}
            title="Third Party"
            text="External websites/services की actions या availability के लिए platform जिम्मेदार नहीं है।"
          />
        </div>
      </>
    ),
  },

  {
    id: 'changes',
    number: '09',
    icon: RefreshCw,
    title: 'Terms में बदलाव',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    content: (
      <p>
        कृषि मित्र आवश्यकता के अनुसार इन Terms & Conditions को समय-समय पर
        update कर सकता है। Updated version इसी page पर प्रकाशित किया जाएगा।
        Website का उपयोग जारी रखने पर updated terms लागू हो सकती हैं।
      </p>
    ),
  },
];

const faqs = [
  {
    question: 'क्या कृषि मित्र सरकारी वेबसाइट है?',
    answer:
      'नहीं। कृषि मित्र एक व्यक्तिगत online agriculture information platform है। यह किसी सरकारी विभाग, सरकारी कार्यालय या सरकारी कृषि केंद्र की official website नहीं है।',
  },
  {
    question: 'क्या कृषि मित्र का physical office है?',
    answer:
      'वर्तमान में नहीं। कृषि मित्र का कोई physical office, दुकान या कृषि केंद्र नहीं है। Platform को online माध्यम से व्यक्तिगत रूप से संचालित किया जाता है।',
  },
  {
    question: 'क्या मंडी भाव बिल्कुल सही और live होते हैं?',
    answer:
      'मंडी भाव की जानकारी available sources के आधार पर प्रस्तुत की जा सकती है। बाजार भाव लगातार बदलते हैं, इसलिए खरीद या बिक्री से पहले संबंधित मंडी या authorized source से अंतिम भाव verify करें।',
  },
  {
    question: 'क्या कृषि मित्र कृषि नुकसान की जिम्मेदारी लेता है?',
    answer:
      'नहीं। Website की कृषि जानकारी सामान्य informational purpose के लिए है। वास्तविक निर्णय लेते समय स्थानीय परिस्थितियों और कृषि विशेषज्ञ की सलाह को ध्यान में रखें।',
  },
  {
    question: 'क्या मैं कृषि मित्र की जानकारी अपने business में इस्तेमाल कर सकता हूँ?',
    answer:
      'Original website content, design, branding और code को बिना अनुमति commercial purpose के लिए copy या reproduce नहीं किया जाना चाहिए। Third-party content पर उनके respective rights लागू हो सकते हैं।',
  },
];

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white">
            {title}
          </h4>

          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsPoint({ children }) {
  return (
    <li className="flex items-start gap-2 text-slate-400">
      <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('nature');
  const [openFaq, setOpenFaq] = useState(null);

  const updatedDate = new Date().toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const scrollToSection = (id) => {
    setActiveSection(id);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-300">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Scale className="w-4 h-4" />
              नियम एवं शर्तें
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-white">
              उपयोग की शर्तें
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              कृषि मित्र वेबसाइट का उपयोग करने से पहले इन Terms & Conditions
              को ध्यान से पढ़ें। Website का उपयोग करने पर आप इन शर्तों को
              स्वीकार करते हैं।
            </p>

            <div className="flex flex-wrap gap-3 mt-6">

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <FileText className="w-4 h-4 text-amber-400" />
                अंतिम अपडेट: {updatedDate}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Online Platform
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Platform Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-white font-bold">
                कृषि मित्र — Online Agriculture Platform
              </h2>

              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                कृषि मित्र एक व्यक्तिगत online platform है। वर्तमान में इसका
                कोई physical office, दुकान या कृषि केंद्र नहीं है। Website,
                content और digital information को online माध्यम से manage किया
                जाता है।
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* Quick Navigation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-amber-400" />

            <h2 className="text-sm font-bold text-white">
              Terms के मुख्य भाग
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">

            {termsSections.map((section) => {
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {section.number}. {section.title}
                </button>
              );
            })}

          </div>
        </div>

      </section>

      {/* Terms Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="space-y-5">

          {termsSections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                key={section.id}
                id={section.id}
                className={`scroll-mt-6 bg-slate-900 border ${section.border} rounded-2xl overflow-hidden`}
              >

                <div className="p-5 sm:p-6">

                  <div className="flex items-start gap-4">

                    <div
                      className={`w-11 h-11 shrink-0 rounded-xl ${section.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>

                    <div className="min-w-0">

                      <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                        Section {section.number}
                      </div>

                      <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                        {section.title}
                      </h2>

                    </div>

                  </div>

                  <div className="mt-5 pl-0 sm:pl-[60px] text-sm text-slate-400 leading-relaxed">
                    {section.content}
                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </section>

      {/* Acceptance */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Terms स्वीकार करना
              </h2>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                कृषि मित्र वेबसाइट का उपयोग जारी रखने पर आप इन Terms &
                Conditions को पढ़ने और समझने की पुष्टि करते हैं। यदि आप इन
                शर्तों से सहमत नहीं हैं, तो कृपया वेबसाइट का उपयोग न करें।
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                सामान्य प्रश्न
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Terms से जुड़े सामान्य सवालों के जवाब
              </p>
            </div>

          </div>

          <div className="space-y-2">

            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="border border-slate-800 rounded-xl overflow-hidden"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    className="w-full flex items-center justify-between gap-4 text-left px-4 py-4 min-h-[52px] hover:bg-slate-950 transition-colors"
                  >

                    <span className="text-sm font-semibold text-slate-200">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />

                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                      {faq.answer}
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* Contact */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">

        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-2xl p-5 sm:p-6">

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-amber-400" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Terms के बारे में प्रश्न?
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Online माध्यम से हमसे संपर्क करें।
                </p>
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              यदि आपको Terms & Conditions, website usage या किसी content के
              संबंध में कोई प्रश्न है, तो Contact page के माध्यम से हमसे
              संपर्क कर सकते हैं।
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 text-sm font-bold hover:bg-amber-300 transition-colors"
            >
              Contact करें
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        </div>

      </section>

      {/* Bottom Navigation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">

          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← मुख्य पृष्ठ पर लौटें
          </Link>

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              href="/privacy-policy"
              className="text-slate-500 hover:text-white transition-colors"
            >
              गोपनीयता नीति
            </Link>

            <Link
              href="/contact"
              className="text-slate-500 hover:text-white transition-colors"
            >
              संपर्क करें
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}