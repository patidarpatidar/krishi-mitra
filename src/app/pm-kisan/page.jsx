import Link from 'next/link';
import { ShieldCheck, UserCheck, CreditCard, HelpCircle, ExternalLink, FileText } from 'lucide-react';

export default function PMKisanPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase">
          PM-Kisan Portal Guide
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-3">
          PM किसान सम्मान निधि योजना गाइड
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
          पात्रता जांच, स्टेटस (Status), e-KYC प्रक्रिया और अगली किस्त की जानकारी प्राप्त करें।
        </p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://pmkisan.gov.in/BeneficiaryStatus_New.aspx"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-emerald-200 p-5 rounded-xl hover:border-emerald-500 hover:shadow-md transition text-center space-y-2 group"
        >
          <CreditCard className="w-8 h-8 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">अपनी किस्त का स्टेटस देखें</h3>
          <p className="text-xs text-slate-500">आधार या मोबाइल नंबर से लाभार्थी स्थिति जांचें</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold pt-2">
            पोर्टल खोलें <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="https://pmkisan.gov.in/aadharekyc.aspx"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-emerald-200 p-5 rounded-xl hover:border-emerald-500 hover:shadow-md transition text-center space-y-2 group"
        >
          <UserCheck className="w-8 h-8 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">e-KYC पूर्ण करें</h3>
          <p className="text-xs text-slate-500">OTP आधारित e-KYC तुरंत घर बैठे करें</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold pt-2">
            e-KYC पोर्टल <ExternalLink className="w-3 h-3" />
          </span>
        </a>

        <a
          href="https://pmkisan.gov.in/RegistrationFormNew.aspx"
          target="_blank"
          rel="noreferrer"
          className="bg-white border border-emerald-200 p-5 rounded-xl hover:border-emerald-500 hover:shadow-md transition text-center space-y-2 group"
        >
          <FileText className="w-8 h-8 text-emerald-600 mx-auto group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-sm">नया किसान पंजीकरण</h3>
          <p className="text-xs text-slate-500">योजना का लाभ लेने हेतु नया आवेदन दर्ज करें</p>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold pt-2">
            नया आवेदन <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      </div>

      {/* Instructions Accordion / Steps */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> e-KYC कैसे पूर्ण करें? (चरणबद्ध प्रक्रिया)
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <li>आधिकारिक PM-Kisan वेबसाइट (pmkisan.gov.in) पर जाएं।</li>
          <li>होमपेज पर दाएं कोने में <strong>'e-KYC'</strong> विकल्प पर क्लिक करें।</li>
          <li>अपना 12 अंकों का <strong>आधार कार्ड नंबर</strong> दर्ज करें और 'Search' पर दबाएं।</li>
          <li>आधार से लिंक मोबाइल नंबर पर प्राप्त <strong>OTP</strong> दर्ज करके सबमिट करें।</li>
          <li>सफलतापूर्वक सत्यापन के बाद e-KYC प्रक्रिया पूर्ण हो जाएगी।</li>
        </ol>
      </div>
    </div>
  );
}