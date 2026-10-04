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
  FileSpreadsheet,
  Calendar,
  X,
  CheckCircle2,
  HelpCircle,
  Coins,
  Search,
  Filter,
  Syringe
} from 'lucide-react';

export default function PashupalanSection() {
  const [activeTab, setActiveTab] = useState('dairy');
  
  // 1. Ration Calculator State
  const [milkQuantity, setMilkQuantity] = useState(10);
  const [animalWeight, setAnimalWeight] = useState(400);

  // 2. Milk Rate & Revenue Calculator State (Fat / SNF)
  const [fat, setFat] = useState(6.5);
  const [snf, setSnf] = useState(8.5);
  const [totalMilkLiters, setTotalMilkLiters] = useState(20);
  const baseRatePerFat = 7.2; // Base multiplier per fat point

  // 3. Breeding & Pregnancy Tracker State
  const [aiDate, setAiDate] = useState('');
  const [pregnancyResult, setPregnancyResult] = useState(null);

  // 4. Symptom Checker State
  const [selectedSymptom, setSelectedSymptom] = useState('');

  // 5. Marketplace Search & Filter State
  const [marketSearch, setMarketSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Sample Livestock Data
  const [livestockList, setLivestockList] = useState([
    {
      id: 1,
      title: 'मुरा नस्ल की प्रथम ब्यात भैंस',
      yield: '16 लीटर/दिन',
      location: 'नीमच, म.प्र.',
      price: 75000,
      seller: 'रामेश्वर पाटीदार',
      contact: '98260XXXXX',
      badge: 'सत्यापित विक्रेता',
      category: 'dairy',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      id: 2,
      title: 'गीर नस्ल की शुद्ध गाय (द्वितीय ब्यात)',
      yield: '14 लीटर/दिन',
      location: 'मंदसौर, म.प्र.',
      price: 55000,
      seller: 'विष्णु जाट',
      contact: '94251XXXXX',
      badge: 'टीकाकरण संपन्न',
      category: 'dairy',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 3,
      title: 'सिरोही नस्ल की बकरी (जोड़ी)',
      yield: '3 लीटर/दिन',
      location: 'रतलाम, म.प्र.',
      price: 22000,
      seller: 'दिनेश धाकड़',
      contact: '97530XXXXX',
      badge: 'उत्कृष्ट नस्ल',
      category: 'goat',
      tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
    },
    {
      id: 4,
      title: 'कड़कनाथ मुर्गियां (10 का समूह)',
      yield: 'अंडा व मीट हेतु',
      location: 'झाबुआ, म.प्र.',
      price: 8500,
      seller: 'सुरेश भूरिया',
      contact: '91790XXXXX',
      badge: 'जैविक पालन',
      category: 'poultry',
      tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ]);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    title: '',
    yield: '',
    location: '',
    price: '',
    category: 'dairy',
    contact: ''
  });

  // Ration Calculation Formulas
  const greenFodder = Math.round(animalWeight * 0.05); // ~5% of weight
  const dryFodder = Math.round(animalWeight * 0.015);  // ~1.5% of weight
  const concentrate = (1.5 + (milkQuantity * 0.4)).toFixed(1); // Maintenance + Milk ratio

  // Milk Rate Calculation
  const estimatedRatePerLiter = (fat * baseRatePerFat + (snf - 8.5) * 2).toFixed(2);
  const dailyIncome = (estimatedRatePerLiter * totalMilkLiters).toFixed(0);

  // Pregnancy Calculation
  const calculatePregnancy = (dateStr) => {
    if (!dateStr) return;
    const ai = new Date(dateStr);
    
    // Gestation period for Cow/Buffalo ~ 283 days
    const expectedDelivery = new Date(ai);
    expectedDelivery.setDate(ai.getDate() + 283);

    // Dry period starting ~ 60 days before delivery
    const dryDate = new Date(expectedDelivery);
    dryDate.setDate(expectedDelivery.getDate() - 60);

    setPregnancyResult({
      delivery: expectedDelivery.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      dry: dryDate.toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  };

  // Add Listing Submit
  const handleAddListing = (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) return;

    const newItem = {
      id: Date.now(),
      title: newListing.title,
      yield: newListing.yield || 'उल्लेख नहीं',
      location: newListing.location || 'मध्य प्रदेश',
      price: Number(newListing.price),
      seller: 'किसान मित्र सदस्य',
      contact: newListing.contact || '9800000000',
      badge: 'नई लिस्टिंग',
      category: newListing.category,
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };

    setLivestockList([newItem, ...livestockList]);
    setIsSellModalOpen(false);
    setNewListing({ title: '', yield: '', location: '', price: '', category: 'dairy', contact: '' });
  };

  // Filtered Livestock
  const filteredLivestock = livestockList.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(marketSearch.toLowerCase()) || 
                          item.location.toLowerCase().includes(marketSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" /> स्मार्ट पशुपालन एवं उन्नत डेयरी
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              किसान मित्र <span className="text-emerald-400">डिजिटल पशुधन हब</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              दूध फैट-रेट कैलकुलेटर, पशु खुराक प्रबंधन, प्रसव कैलेंडर, बीमारी सहायता एवं सत्यापन युक्त पशु क्रय-विक्रय मंच।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="tel:18001801551" 
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-900/30 transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" /> पशु हेल्पलाइन (1800-180-1551)
            </a>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
          {[
            { id: 'dairy', label: '🐄 गाय एवं भैंस प्रबंधन' },
            { id: 'goat', label: '🐐 बकरी व भेड़ पालन' },
            { id: 'poultry', label: '🐔 मुर्गी एवं कड़कनाथ' },
            { id: 'aqua', label: '🐟 मत्स्य व झींगा पालन' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedCategory(tab.id);
              }}
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

        {/* Interactive Tools Grid (4 Main Interactive Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Tool 1: Ration Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  संतुलित पशु आहार कैलकुलेटर
                </h2>
                <span className="text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold px-2 py-0.5 rounded-full">
                  स्मार्ट फीड
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-slate-300">पशु का वजन:</span>
                    <span className="text-amber-400 font-bold">{animalWeight} किग्रा</span>
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
                    <span className="text-slate-300">दैनिक दूध उत्पादन:</span>
                    <span className="text-emerald-400 font-bold">{milkQuantity} लीटर/दिन</span>
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
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 mt-4">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> दैनिक संतुलित खुराक सुझाव:
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">हरा चारा</span>
                  <span className="text-sm font-extrabold text-emerald-400">{greenFodder} kg</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">सूखा भूसा</span>
                  <span className="text-sm font-extrabold text-amber-400">{dryFodder} kg</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">दाना / खली</span>
                  <span className="text-sm font-extrabold text-sky-400">{concentrate} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tool 2: Milk Rate & Income Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  दूध फैट व दैनिक आय कैलकुलेटर
                </h2>
                <span className="text-[10px] bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                  डेयरी इनकम
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-slate-300">फैट (Fat %):</span>
                    <span className="text-emerald-400 font-bold">{fat}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="3.0" 
                    max="11.0" 
                    step="0.1" 
                    value={fat} 
                    onChange={(e) => setFat(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer bg-slate-800 rounded-lg h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-slate-300">एस.एन.एफ. (SNF %):</span>
                    <span className="text-sky-400 font-bold">{snf}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="7.5" 
                    max="10.0" 
                    step="0.1" 
                    value={snf} 
                    onChange={(e) => setSnf(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer bg-slate-800 rounded-lg h-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">कुल दैनिक दूध (लीटर):</label>
                  <input 
                    type="number" 
                    value={totalMilkLiters} 
                    onChange={(e) => setTotalMilkLiters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-2 mt-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">अनुमानित प्रति लीटर भाव:</span>
                <span className="text-base font-black text-amber-400">₹{estimatedRatePerLiter} /L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">अनुमानित दैनिक आय:</span>
                <span className="text-lg font-black text-emerald-400">₹{dailyIncome} /दिन</span>
              </div>
            </div>
          </div>

          {/* Tool 3: Pregnancy & AI Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-400" />
                  प्रसव एवं गर्भाधान (A.I.) कैलेंडर
                </h2>
                <span className="text-[10px] bg-sky-400/10 border border-sky-400/30 text-sky-400 font-semibold px-2 py-0.5 rounded-full">
                  ट्रैकर
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <label className="block text-slate-300 font-medium">
                  कृत्रिम गर्भाधान (AI) या पाल दिलाने की तारीख:
                </label>
                <input 
                  type="date" 
                  value={aiDate}
                  onChange={(e) => {
                    setAiDate(e.target.value);
                    calculatePregnancy(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {pregnancyResult ? (
              <div className="bg-slate-950 border border-sky-500/30 rounded-2xl p-4 text-xs space-y-2 mt-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">संभावित प्रसव तिथि (Expected Delivery):</span>
                  <p className="text-sm font-extrabold text-emerald-400">{pregnancyResult.delivery}</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">दूध सुखाने की तारीख (Dry Off Date):</span>
                  <p className="text-xs font-bold text-amber-400">{pregnancyResult.dry}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-500 mt-4">
                तारीख चुनने पर प्रसव की संभावित तिथि यहाँ प्रदर्शित होगी।
              </div>
            )}
          </div>

        </div>

        {/* Diagnostic Symptom Checker & Disease Guide */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                त्वरित रोग पहचान एवं प्राथमिक उपचार गाइड (Symptom Checker)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                पशु में दिख रहे लक्षणों के आधार पर प्राथमिक उपचार सुझाव देखें।
              </p>
            </div>

            <select
              value={selectedSymptom}
              onChange={(e) => setSelectedSymptom(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- लक्षण का चयन करें --</option>
              <option value="fever">अचानक तेज बुखार व सुस्ती</option>
              <option value="mouth">मुंह व खुर में छाले / लार टपकना (FMD)</option>
              <option value="milk_drop">दूध में अचानक कमी व थन में सूजन (Mastitis)</option>
              <option value="bloat">पेट फूलना व अफारा (Bloat)</option>
            </select>
          </div>

          {selectedSymptom ? (
            <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 text-xs space-y-3">
              {selectedSymptom === 'fever' && (
                <>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> संभावित कारण: गलघोंटू (HS) या साधारण बुखार
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>त्वरित प्राथमिक उपचार:</strong> पशु को छायादार व हवादार स्थान पर रखें। ठंडे पानी से सिर व शरीर पोंछें। भोजन में सुपाच्य हरा चारा दें और तुरंत निकटतम पशु चिकित्सक से संपर्क कर एंटीबायोटिक सलाह लें।
                  </p>
                </>
              )}
              {selectedSymptom === 'mouth' && (
                <>
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> संभावित कारण: खुरपका-मुंहपका (FMD)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>त्वरित प्राथमिक उपचार:</strong> बीमार पशु को तुरंत स्वस्थ पशुओं से अलग करें। मुंह के छालों को 1% फिटकरी या लाल दवा (पोटेशियम परमैंगनेट) के पानी से धोएं। खुरों पर नीम के तेल में कपूर मिलाकर लगाएं।
                  </p>
                </>
              )}
              {selectedSymptom === 'milk_drop' && (
                <>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> संभावित कारण: थनेला रोग (Mastitis)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>त्वरित प्राथमिक उपचार:</strong> प्रभावित थन से पूरा दूध निकालकर अलग नष्ट करें। थनों पर गुनगुने पानी में नमक मिलाकर सेकाई करें। थनेला का अंदेशा होते ही बिना देरी किए डॉक्टर से इंट्रा-मेमरी ट्यूब लगवाएं।
                  </p>
                </>
              )}
              {selectedSymptom === 'bloat' && (
                <>
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> संभावित कारण: अफारा (Gas / Bloat)
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>त्वरित प्राथमिक उपचार:</strong> 50ml तारपीन का तेल और 500ml सरसों का तेल मिलाकर दें। पशु को थोड़ा धीरे-धीरे चलाएं। पशु को बाईं करवट लेटने न दें।
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
              ऊपर ड्रॉपडाउन से पशु में दिख रहा लक्षण चुनें। प्राथमिक उपचार गाइड यहाँ दिखाई देगी।
            </div>
          )}
        </div>

        {/* Pashu Bazar / Marketplace Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-sky-400" />
                डिजिटल पशु मेला व क्रय-विक्रय (Pashu Mela)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                आस-पास के किसानों द्वारा बिक्री हेतु सूचीबद्ध पशु देखें या अपना पशु दर्ज करें।
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSellModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-900/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> अपना पशु बेचें
              </button>
            </div>
          </div>

          {/* Search & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="पशु का नाम या स्थान खोजें (उदा. मुरा, नीमच)..."
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">सभी श्रेणियां</option>
                <option value="dairy">गाय व भैंस</option>
                <option value="goat">बकरी व भेड़</option>
                <option value="poultry">मुर्गी व कड़कनाथ</option>
              </select>
            </div>
          </div>

          {/* Marketplace Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLivestock.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:scale-[1.01]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.badge}
                    </span>
                    <span className="text-xs font-black text-amber-400">₹{item.price.toLocaleString('hi-IN')}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400">क्षीर/विशेषता: <strong className="text-slate-200">{item.yield}</strong></p>
                  <p className="text-xs text-slate-400">📍 स्थान: <strong className="text-slate-200">{item.location}</strong></p>
                  <p className="text-xs text-slate-400">विक्रेता: {item.seller}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <a 
                    href={`tel:${item.contact}`}
                    className="w-full bg-slate-900 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> विक्रेता से कॉल करें
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">टीकाकरण रिमाइंडर्स</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">खुरपका व गलघोंटू के सही समय पर एसएमएस अलर्ट।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
            <Syringe className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">कृत्रिम गर्भाधान (A.I.)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">उच्च गुणवत्ता सांडों के सीमन व एआई तकनीशियन विवरण।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-sky-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">डेयरी आय-व्यय खाता</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">दैनिक दूध बिक्री व आहार खर्च का डिजिटल हिसाब।</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-purple-400 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-white">पशु बीमा एवं लोन</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">सरकारी अनुदान व केसीसी (KCC) लोन प्रक्रिया सहायता।</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Popup for Adding Livestock Listing */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setIsSellModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> अपना पशु बिक्री हेतु जोड़ें
            </h3>

            <form onSubmit={handleAddListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">पशु/नस्ल का शीर्षक:</label>
                <input 
                  type="text" 
                  placeholder="उदा. साहीवाल गाय द्वितीय ब्यात"
                  required
                  value={newListing.title}
                  onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">श्रेणी:</label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="dairy">गाय/भैंस</option>
                    <option value="goat">बकरी/भेड़</option>
                    <option value="poultry">मुर्गी</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">मांगी गई कीमत (₹):</label>
                  <input 
                    type="number" 
                    placeholder="65000"
                    required
                    value={newListing.price}
                    onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">दूध क्षमता / विवरण:</label>
                  <input 
                    type="text" 
                    placeholder="12 लीटर/दिन"
                    value={newListing.yield}
                    onChange={(e) => setNewListing({...newListing, yield: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">स्थान (जिला/गांव):</label>
                  <input 
                    type="text" 
                    placeholder="मंदसौर, म.प्र."
                    value={newListing.location}
                    onChange={(e) => setNewListing({...newListing, location: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">संपर्क फोन नंबर:</label>
                <input 
                  type="text" 
                  placeholder="98260XXXXX"
                  required
                  value={newListing.contact}
                  onChange={(e) => setNewListing({...newListing, contact: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition mt-2 cursor-pointer"
              >
                लिस्टिंग प्रकाशित करें
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}