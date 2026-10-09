'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  Bell,
  RefreshCw,
  FileText,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  Mail,
  ArrowRight,
  UserCheck,
  Database,
  Cookie,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const privacySections = [
  {
    id: 'collection',
    number: '01',
    icon: Eye,
    title: 'हम कौन-सी जानकारी एकत्र कर सकते हैं?',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    content: (
      <>
        <p>
          कृषि मित्र आपकी आवश्यकता के अनुसार सीमित जानकारी एकत्र कर सकता है।
          जानकारी इस बात पर निर्भर करती है कि आप वेबसाइट पर कौन-सी सुविधा का
          उपयोग करते हैं।
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <InfoCard
            icon={UserCheck}
            title="आपकी दी गई जानकारी"
            text="नाम, मोबाइल नंबर, ईमेल या संपर्क फॉर्म में दी गई अन्य जानकारी।"
          />

          <InfoCard
            icon={Database}
            title="तकनीकी जानकारी"
            text="ब्राउज़र, डिवाइस, IP address और वेबसाइट उपयोग से जुड़ी सामान्य जानकारी।"
          />

          <InfoCard
            icon={Cookie}
            title="Cookies"
            text="वेबसाइट अनुभव, analytics और भविष्य में advertising सुविधाओं के लिए cookies का उपयोग हो सकता है।"
          />

          <InfoCard
            icon={Eye}
            title="आपकी पसंद"
            text="यदि कोई preference feature उपलब्ध हो, तो चुनी गई फसल, मंडी या क्षेत्र जैसी जानकारी।"
          />
        </div>
      </>
    ),
  },

  {
    id: 'usage',
    number: '02',
    icon: Lock,
    title: 'आपकी जानकारी का उपयोग कैसे किया जाता है?',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    content: (
      <>
        <p>
          एकत्र की गई जानकारी का उपयोग वेबसाइट को बेहतर, उपयोगी और सुरक्षित
          बनाने के लिए किया जा सकता है।
        </p>

        <ul className="space-y-3 mt-4">
          <PrivacyPoint>
            वेबसाइट की सुविधाओं और user experience को बेहतर बनाने के लिए।
          </PrivacyPoint>

          <PrivacyPoint>
            आपके द्वारा भेजे गए contact/query का जवाब देने के लिए।
          </PrivacyPoint>

          <PrivacyPoint>
            वेबसाइट की performance, security और technical issues को समझने के लिए।
          </PrivacyPoint>

          <PrivacyPoint>
            कृषि, मंडी, मौसम और अन्य जानकारी को बेहतर तरीके से प्रस्तुत करने के लिए।
          </PrivacyPoint>

          <PrivacyPoint>
            यदि भविष्य में newsletter, alerts या अन्य सुविधा उपलब्ध की जाती है,
            तो आपकी अनुमति के अनुसार उसका उपयोग करने के लिए।
          </PrivacyPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'sharing',
    number: '03',
    icon: Bell,
    title: 'क्या आपकी जानकारी किसी के साथ साझा की जाती है?',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    content: (
      <>
        <p>
          कृषि मित्र आपकी व्यक्तिगत जानकारी को बेचने या किराए पर देने का
          उद्देश्य नहीं रखता।
        </p>

        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">
            कुछ परिस्थितियों में जानकारी का उपयोग
          </h3>

          <ul className="space-y-2 text-slate-400">
            <li>• वेबसाइट hosting या technical services के लिए आवश्यक service providers.</li>
            <li>• Analytics या advertising services, यदि वेबसाइट पर भविष्य में इनका उपयोग किया जाए।</li>
            <li>• कानून या वैधानिक आवश्यकता होने पर संबंधित authority.</li>
          </ul>
        </div>

        <p className="mt-4">
          किसी third-party service का उपयोग होने पर उसकी अपनी privacy policy
          और data handling practices भी लागू हो सकती हैं।
        </p>
      </>
    ),
  },

  {
    id: 'cookies',
    number: '04',
    icon: Cookie,
    title: 'Cookies और Analytics',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    content: (
      <>
        <p>
          वेबसाइट बेहतर तरीके से काम करने और visitor experience समझने के लिए
          cookies या analytics technologies का उपयोग कर सकती है।
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <InfoCard
            icon={Cookie}
            title="Essential Cookies"
            text="वेबसाइट की basic functionality के लिए आवश्यक cookies।"
          />

          <InfoCard
            icon={Eye}
            title="Analytics"
            text="Visitors वेबसाइट का उपयोग किस प्रकार करते हैं, यह समझने में सहायता।"
          />
        </div>

        <p className="mt-4 text-slate-400">
          आप अपने browser settings के माध्यम से cookies को नियंत्रित या
          disable कर सकते हैं। हालांकि इससे वेबसाइट की कुछ सुविधाएं प्रभावित
          हो सकती हैं।
        </p>
      </>
    ),
  },

  {
    id: 'security',
    number: '05',
    icon: ShieldCheck,
    title: 'डेटा सुरक्षा',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    content: (
      <>
        <p>
          हम उपलब्ध तकनीकी उपायों के माध्यम से जानकारी को अनधिकृत access,
          misuse या loss से बचाने का प्रयास करते हैं।
        </p>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <SecurityBadge text="Secure Hosting" />
          <SecurityBadge text="Access Protection" />
          <SecurityBadge text="Regular Monitoring" />
        </div>

        <p className="mt-4 text-slate-400">
          फिर भी internet पर कोई भी system 100% सुरक्षित होने की guarantee
          नहीं दे सकता। इसलिए sensitive personal information साझा करते समय
          सावधानी रखें।
        </p>
      </>
    ),
  },

  {
    id: 'agriculture',
    number: '06',
    icon: AlertTriangle,
    title: 'कृषि जानकारी के संबंध में महत्वपूर्ण सूचना',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    content: (
      <>
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <p className="text-slate-300">
            कृषि मित्र पर उपलब्ध मंडी भाव, मौसम, खेती की सलाह, फसल संबंधी
            जानकारी, calculators और अन्य सामग्री सामान्य informational purpose
            के लिए है।
          </p>
        </div>

        <ul className="space-y-3 mt-4">
          <PrivacyPoint>
            किसी भी कृषि निर्णय से पहले स्थानीय परिस्थितियों को ध्यान में रखें।
          </PrivacyPoint>

          <PrivacyPoint>
            दवा, कीटनाशक, fertilizer या अन्य agricultural input का उपयोग करने
            से पहले product label और authorized recommendation देखें।
          </PrivacyPoint>

          <PrivacyPoint>
            महत्वपूर्ण निर्णयों के लिए कृषि विभाग, KVK या स्थानीय कृषि विशेषज्ञ
            से जानकारी verify करें।
          </PrivacyPoint>

          <PrivacyPoint>
            मंडी भाव और मौसम जैसी जानकारी समय के साथ बदल सकती है।
          </PrivacyPoint>
        </ul>
      </>
    ),
  },

  {
    id: 'changes',
    number: '07',
    icon: RefreshCw,
    title: 'Privacy Policy में बदलाव',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    content: (
      <p>
        कृषि मित्र आवश्यकता के अनुसार इस Privacy Policy को समय-समय पर update
        कर सकता है। किसी महत्वपूर्ण बदलाव के बाद इस page पर updated policy
        प्रकाशित की जाएगी। इसलिए users को समय-समय पर इस page को देखने की
        सलाह दी जाती है।
      </p>
    ),
  },
];

const faqs = [
  {
    question: 'क्या कृषि मित्र मेरी personal information बेचता है?',
    answer:
      'नहीं। कृषि मित्र का उद्देश्य आपकी personal information को बेचने या किराए पर देने का नहीं है।',
  },
  {
    question: 'क्या कृषि मित्र का कोई physical office या कृषि केंद्र है?',
    answer:
      'वर्तमान में कृषि मित्र एक online personal agriculture information platform है। इसका कोई physical office, दुकान या कृषि केंद्र नहीं है। इसे व्यक्तिगत रूप से online माध्यम से संचालित किया जाता है।',
  },
  {
    question: 'क्या मेरी जानकारी हमेशा store की जाती है?',
    answer:
      'यह इस बात पर निर्भर करता है कि आपने कौन-सी सुविधा का उपयोग किया है और उस सुविधा के लिए कौन-सी जानकारी आवश्यक है। अनावश्यक जानकारी store करने का उद्देश्य नहीं है।',
  },
  {
    question: 'क्या मैं अपनी जानकारी के बारे में पूछ सकता हूँ?',
    answer:
      'हाँ। यदि आपने contact form या किसी अन्य माध्यम से जानकारी भेजी है, तो आप privacy से संबंधित प्रश्न के लिए हमसे संपर्क कर सकते हैं।',
  },
  {
    question: 'क्या वेबसाइट पर advertisements हो सकते हैं?',
    answer:
      'भविष्य में वेबसाइट पर Google AdSense या अन्य advertising services का उपयोग किया जा सकता है। ऐसी services cookies या similar technologies का उपयोग कर सकती हैं और उनकी अपनी privacy policies लागू हो सकती हैं।',
  },
];

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="group bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm">{title}</h4>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPoint({ children }) {
  return (
    <li className="flex items-start gap-2 text-slate-400">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function SecurityBadge({ text }) {
  return (
    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      <span className="text-xs text-slate-300">{text}</span>
    </div>
  );
}

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('collection');
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-sky-500/5 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              गोपनीयता एवं सुरक्षा
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight text-white">
              गोपनीयता नीति
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              कृषि मित्र आपकी privacy का सम्मान करता है। यहां बताया गया है कि
              website पर उपलब्ध सुविधाओं के दौरान information को किस प्रकार
              collect, use और protect किया जा सकता है।
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <FileText className="w-4 h-4 text-emerald-400" />
                अंतिम अपडेट: {updatedDate}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <UserCheck className="w-4 h-4 text-sky-400" />
                Personal Online Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Platform Notice */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-sky-400" />
            </div>

            <div>
              <h2 className="text-white font-bold">
                कृषि मित्र क्या है?
              </h2>

              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                कृषि मित्र एक व्यक्तिगत online कृषि information platform है।
                वर्तमान में इसका कोई physical office, दुकान या कृषि केंद्र नहीं
                है। Website, content और digital services को online माध्यम से
                व्यक्तिगत रूप से manage किया जाता है।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Privacy Policy के मुख्य भाग
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {privacySections.map((section) => {
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950'
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

      {/* Main Policy */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-5">
          {privacySections.map((section) => {
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

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                सामान्य प्रश्न
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Privacy से जुड़े सामान्य सवालों के जवाब
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
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 rounded-2xl p-5 sm:p-6">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Privacy से संबंधित प्रश्न?
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  हमसे online माध्यम से संपर्क करें।
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              यदि आपको इस Privacy Policy, आपकी जानकारी या website के data
              handling से संबंधित कोई प्रश्न है, तो Contact page के माध्यम से
              हमसे संपर्क कर सकते हैं।
            </p>

            <div className="flex flex-wrap gap-3 mt-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold hover:bg-emerald-400 transition-colors"
              >
                Contact करें
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="mailto:privacy@krishimitra.in"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-sm font-semibold hover:text-white hover:border-slate-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
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
              href="/terms"
              className="text-slate-500 hover:text-white transition-colors"
            >
              नियम एवं शर्तें
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