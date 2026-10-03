'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  HeartHandshake, 
  Calculator, 
  Stethoscope, 
  ShoppingBag, 
  ShieldCheck, 
  PlusCircle, 
  PhoneCall, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function PashupalanSection() {
  const [activeTab, setActiveTab] = useState('dairy');
  
  // Interactive Feed Calculator State
  const [milkQuantity, setMilkQuantity] = useState(10);
  const [animalWeight, setAnimalWeight] = useState(400);

  // Interactive Symptom Checker State
  const [selectedSymptom, setSelectedSymptom] = useState('');

  // Sample Livestock Directory
  const livestockList = [
    {
      id: 1,
      title: 'मुरा नस्ल की भैंस (Murrah Buffalo)',
      yield: '16-18 लीटर/दिन',
      location: 'नीमच, म.प्र.',
      price: '₹75,000',
      badge: 'सत्यापित विक्रेता',
      category: 'dairy',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 2,
      title: 'गीर नस्ल की गाय (Gir Cow)',
      yield: '12-14 लीटर/दिन',
      location: 'मंदसौर, म.प्र.',
      price: '₹55,000',
      badge: 'टीकाकरण संपन्न',
      category: 'dairy',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 3,
      title: 'सिरोही नस्ल की बकरी (Sirohi Goat Pair)',
      yield: '2-3 लीटर/दिन',
      location: 'रतलाम, म.प्र.',
      price: '₹22,000',
      badge: 'उत्कृष्ट नस्ल',
      category: 'goat',
      tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
    }
  ];

  // Calculated feed values
  const greenFodder = Math.round(animalWeight * 0.05); // ~5% of weight
  const dryFodder = Math.round(animalWeight * 0.015);  // ~1.5% of weight
  const concentrate = Math.round(1.5 + (milkQuantity * 0.4)); // Maintenance + Milk ratio

  return (
    <section className="bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" /> पशुपालन एवं डेयरी प्रबंधन
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              किसान मित्र <span className="text-emerald-400">पशुधन हब</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              पशु आहार कैलकुलेटर, त्वरित बीमारी पहचान, नस्ल सुधार एवं पशु क्रय-विक्रय हेतु आपका इंटरैक्टिव डिजिटल मंच।
            </p>
          </div>

          {/* Quick Helpline CTA Button */}
          <div className="flex items-center gap-3">
            <a 
              href="tel:18001801551" 
              className="bg-red-600/90 hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" /> आपातकालीन पशु चिकित्सक (24x7)
            </a>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {[
            { id: 'dairy', label: '🐄 गाय एवं भैंस पालन' },
            { id: 'goat', label: '🐐 बकरी व भेड़ पालन' },
            { id: 'poultry', label: '🐔 मुर्गी एवं कड़कनाथ' },
            { id: 'aqua', label: '🐟 मत्स्य व झींगा पालन' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tool 1: Interactive Feed & Feed Ration Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                पशु आहार कैलकुलेटर (Ration Calculator)
              </h3>
              <span className="text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold px-2 py-0.5 rounded">
                स्मार्ट टूल
              </span>
            </div>

            <p className="text-slate-400 text-xs">
              पशु के वजन और दैनिक दूध उत्पादन के अनुसार संतुलित पशु आहार की सटीक मात्रा जानें:
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>पशु का अनुमानित वजन:</span>
                  <span className="text-amber-400 font-bold">{animalWeight} kg</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="700" 
                  step="10" 
                  value={animalWeight} 
                  onChange={(e) => setAnimalWeight(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer bg-slate-800 rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>दैनिक दूध उत्पादन (लीटर/दिन):</span>
                  <span className="text-emerald-400 font-bold">{milkQuantity} Ltr</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="35" 
                  step="1" 
                  value={milkQuantity} 
                  onChange={(e) => setMilkQuantity(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer bg-slate-800 rounded-lg h-2"
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> दैनिक संतुलित खुराक सुझाव:
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">हरा चारा</span>
                  <span className="text-sm font-extrabold text-emerald-400">{greenFodder} kg</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">सूखा भूसा</span>
                  <span className="text-sm font-extrabold text-amber-400">{dryFodder} kg</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">दाना / खली</span>
                  <span className="text-sm font-extrabold text-sky-400">{concentrate} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: Disease Diagnostic Assistant */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                रोग पहचान सहायता (Symptom Checker)
              </h3>
              <span className="text-[10px] bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold px-2 py-0.5 rounded">
                त्वरित सहायता
              </span>
            </div>

            <p className="text-slate-400 text-xs">
              अपने पशु में दिख रहे मुख्य लक्षण को चुनें और प्राथमिक उपचार सुझाव प्राप्त करें:
            </p>

            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- लक्षण का चयन करें --</option>
              <option value="fever">अचानक तेज बुखार व सुस्ती</option>
              <option value="mouth">मुंह व खुर में छाले / लार टपकना (FMD)</option>
              <option value="milk_drop">दूध में अचानक भारी कमी व थन में सूजन (Mastitis)</option>
              <option value="bloat">पेट फूलना व अफारा (Bloat)</option>
            </select>

            {/* Treatment Suggestion Response */}
            {selectedSymptom ? (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-xs space-y-2 animate-fade-in">
                {selectedSymptom === 'fever' && (
                  <>
                    <p className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> संभावित कारण: गलघोंटू या साधारण बुखार
                    </p>
                    <p className="text-slate-300">
                      <strong>त्वरित कार्रवाई:</strong> पशु को छायादार व हवादार स्थान पर रखें। ठंडे पानी से सिर पोंछें और तुरंत नजदीकी पशु चिकित्सक से एंटीबायोटिक परामर्श लें।
                    </p>
                  </>
                )}
                {selectedSymptom === 'mouth' && (
                  <>
                    <p className="font-bold text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> संभावित कारण: खुरपका-मुंहपका (FMD)
                    </p>
                    <p className="text-slate-300">
                      <strong>त्वरित कार्रवाई:</strong> बीमार पशु को अलग करें। मुंह के छालों को फिटकरी के पानी (1%) से धोएं और खुरों पर पोटेशियम परमैंगनेट लगाएं।
                    </p>
                  </>
                )}
                {selectedSymptom === 'milk_drop' && (
                  <>
                    <p className="font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> संभावित कारण: थनेला रोग (Mastitis)
                    </p>
                    <p className="text-slate-300">
                      <strong>त्वरित कार्रवाई:</strong> थन का पूरा दूध निकालकर अलग नष्ट करें। थनों को साफ कपड़े व गुनगुने पानी से साफ करें और पशु चिकित्सक को दिखाएं।
                    </p>
                  </>
                )}
                {selectedSymptom === 'bloat' && (
                  <>
                    <p className="font-bold text-sky-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> संभावित कारण: अफारा (Gas / Indigestion)
                    </p>
                    <p className="text-slate-300">
                      <strong>त्वरित कार्रवाई:</strong> 50ml तारपीन का तेल और 500ml सरसों का तेल मिलाकर दें। पशु को धीरे-धीरे चलाएं और हरा चारा बंद करें।
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                लक्षण चुनने पर उपचार गाइड यहां दिखेगी।
              </div>
            )}
          </div>

          {/* Tool 3: Pashu Bazar / Livestock Trading Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-sky-400" />
                पशु मेला व क्रय-विक्रय (Marketplace)
              </h3>
              <button className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer">
                <PlusCircle className="w-3.5 h-3.5" /> फोटो जोड़ें
              </button>
            </div>

            {/* Trading Item List */}
            <div className="space-y-3">
              {livestockList.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-3 transition">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                    <p className="text-[11px] text-slate-400">क्षीर क्षमता: {item.yield} | 📍 {item.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-amber-400 block">{item.price}</span>
                    <button className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-0.5 mt-1">
                      संपर्क करें <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">टीकाकरण रिमाइंडर</h4>
              <p className="text-[11px] text-slate-400">खुरपका व गलघोंटू के सही समय पर एसएमएस अलर्ट।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">कृत्रिम गर्भाधान (AI)</h4>
              <p className="text-[11px] text-slate-400">उत्कृष्ट सांडों के सीमन व एआई तकनीशियन संपर्क।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-sky-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">डेयरी आय-व्यय रजिस्टर</h4>
              <p className="text-[11px] text-slate-400">दैनिक दूध बिक्री व आहार खर्च का रिकॉर्ड रखें।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">पशु बीमा एवं ऋण</h4>
              <p className="text-[11px] text-slate-400">पशु बीमा व डेयरी लोन संबंधित आवश्यक जानकारी।</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}