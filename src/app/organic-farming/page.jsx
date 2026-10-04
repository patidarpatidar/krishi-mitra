'use client';

import { useState } from 'react';
import { 
  Leaf, Calculator, ShieldCheck, Sparkles, Filter, 
  ChevronDown, ChevronUp, Printer, CheckCircle2, Clock, 
  AlertTriangle, DollarSign, Info
} from 'lucide-react';

const ORGANIC_RECIPES = [
  {
    id: 'jeevamrut',
    title: 'जीवामृत (Jeevamrut)',
    type: 'प्राकृतिक तरल खाद',
    category: 'fertilizer',
    target: 'मृदा स्वास्थ्य, सूक्ष्मजीव वृद्धि, फसल पोषण',
    shelfLife: '10-12 दिन',
    costPerAcre: '₹100 - ₹150',
    baseWater: 200, // Base calculation for 1 Acre (200 Liters)
    baseIngredients: [
      { name: 'देसी गाय का ताजा गोबर', amount: 10, unit: 'किग्रा' },
      { name: 'पुराना गौमूत्र', amount: 10, unit: 'लीटर' },
      { name: 'गुड़ (या गन्ने का रस)', amount: 2, unit: 'किग्रा' },
      { name: 'बेसन (दलों का आटा)', amount: 2, unit: 'किग्रा' },
      { name: 'मेड़ या पुराने बरगद के पेड़ की उपजाऊ मिट्टी', amount: 1, unit: 'किग्रा' }
    ],
    processSteps: [
      '200 लीटर प्लास्टिक ड्रम में स्वच्छ पानी भरें।',
      'एक बाल्टी में गोबर और गौमूत्र का अच्छा घोल बनाएं और ड्रम में डालें।',
      'गुड़ और बेसन को अलग पानी में घोलकर ड्रम में मिलाएं।',
      'अंत में उपजाऊ मिट्टी डालकर मिश्रण को लकड़ी के डंडे से दाहिनी ओर (Clockwise) चलाएं।',
      'दुकान या छायादार स्थान में जूट की बोरी से ढककर 48-72 घंटे रखें। दिन में दो बार 1-2 मिनट चलाएं।'
    ],
    usage: 'सिंचाई के पानी के साथ (Flooding / Drip) या छानकर फसल पर 10% घोल का छिड़काव करें।',
    precautions: 'मिश्रण बनाने के 12 दिनों के भीतर उपयोग करें। सीधी धूप से बचाएं।'
  },
  {
    id: 'neemastra',
    title: 'नीमास्त्र (Neemastra)',
    type: 'जैविक कीटनाशक',
    category: 'pesticide',
    target: 'छोटे रसचूसक कीट, थ्रिप्स, सफेद मक्खी, हरी इल्ली',
    shelfLife: '6 माह',
    costPerAcre: '₹50 - ₹80',
    baseWater: 100,
    baseIngredients: [
      { name: 'देशी गाय का गौमूत्र', amount: 5, unit: 'लीटर' },
      { name: 'देशी गाय का ताजा गोबर', amount: 1, unit: 'किग्रा' },
      { name: 'नीम की पत्ती की चटनी (पेस्ट)', amount: 5, unit: 'किग्रा' }
    ],
    processSteps: [
      '100 लीटर पानी में गौमूत्र और गोबर को अच्छी तरह घोलें।',
      'नीम की पत्तियों की बारीक पिसी चटनी डालकर अच्छी तरह मिलाएं।',
      'मिश्रण को छाया में 24 घंटे के लिए रखें। दिन में 3-4 बार डंडे से चलाएं।',
      '24 घंटे बाद बारीक कपड़े से छानकर प्रयोग हेतु तैयार करें।'
    ],
    usage: 'प्रति एकड़ फसल पर सीधे बिना पानी मिलाए छिड़काव करें।',
    precautions: 'छिड़काव शाम के समय करें ताकि कीटों पर अधिकतम असर हो।'
  },
  {
    id: 'brahmastra',
    title: 'ब्रह्मास्त्र (Brahmastra)',
    type: 'तीव्र जैविक कीटनाशक',
    category: 'pesticide',
    target: 'बड़ी इल्लियां, तना छेदक, फल छेदक कीट',
    shelfLife: '6 माह',
    costPerAcre: '₹120 - ₹180',
    baseWater: 100,
    baseIngredients: [
      { name: 'देशी गाय का गौमूत्र', amount: 10, unit: 'लीटर' },
      { name: 'नीम की पत्ती का पेस्ट', amount: 3, unit: 'किग्रा' },
      { name: 'करंज या अरंडी के पत्ते का पेस्ट', amount: 2, unit: 'किग्रा' },
      { name: 'सीताफल (शरीफा) पत्ती पेस्ट', amount: 2, unit: 'किग्रा' },
      { name: 'धतूरा या बेल पत्ती पेस्ट', amount: 2, unit: 'किग्रा' }
    ],
    processSteps: [
      'सभी पत्तियों की चटनी को 10 लीटर गौमूत्र में मिलाएं।',
      'मिश्रण को किसी बर्तन में धीमी आंच पर 4 बार उबाल आने तक गर्म करें।',
      'उबालने के बाद 48 घंटे के लिए छाया में ठंडा होने व सड़ने दें।',
      'दिन में दो बार चलाएं, तत्पश्चात कपड़े से छानकर रख लें।'
    ],
    usage: '100 लीटर पानी में 2 से 3 लीटर तैयार ब्रह्मास्त्र मिलाकर प्रति एकड़ छिड़काव करें।',
    precautions: 'उबालते समय चेहरे पर कपड़ा बांधें और बच्चों से दूर रखें।'
  },
  {
    id: 'agniastra',
    title: 'अग्निअस्त्र (Agniastra)',
    type: 'उग्र कीट-नियंत्रक',
    category: 'pesticide',
    target: 'गुलाबी इल्ली, सूंडी, पत्ती मोड़क एवं गंभीर कीट प्रकोप',
    shelfLife: '3 माह',
    costPerAcre: '₹150 - ₹200',
    baseWater: 100,
    baseIngredients: [
      { name: 'देशी गाय का गौमूत्र', amount: 10, unit: 'लीटर' },
      { name: 'तंबाकू पाउडर या पत्ते पेस्ट', amount: 500, unit: 'ग्राम' },
      { name: 'तीखी हरी मिर्च पेस्ट', amount: 500, unit: 'ग्राम' },
      { name: 'देशी लहसुन पेस्ट', amount: 250, unit: 'ग्राम' },
      { name: 'नीम पत्ती पेस्ट', amount: 2, unit: 'किग्रा' }
    ],
    processSteps: [
      'गौमूत्र में सभी पिसी हुई सामग्री को अच्छी तरह घोलें।',
      'मिश्रण को धीमी आंच पर 4 उबाल आने तक गर्म करें।',
      '48 घंटे तक बर्तन को ढककर रखें और दिन में दो बार चलाएं।',
      'बारीक कपड़े से छानकर सुरक्षित प्लास्टिक या कांच के कंटेनर में रखें।'
    ],
    usage: '100 लीटर पानी में 2 लीटर अग्निअस्त्र मिलाकर प्रति एकड़ छिड़काव करें।',
    precautions: 'छिड़काव करते समय दस्ताने और मास्क अवश्य पहनें।'
  },
  {
    id: 'dashparni',
    title: 'दशपर्णी अर्क (Dashparni Arka)',
    type: 'सर्व-कीट नाशक अर्क',
    category: 'pesticide',
    target: 'समस्त प्रकार के कीट, फफूंद व सूक्ष्मजीव रोग',
    shelfLife: '6 माह',
    costPerAcre: '₹200 - ₹250',
    baseWater: 200,
    baseIngredients: [
      { name: 'स्वच्छ पानी', amount: 200, unit: 'लीटर' },
      { name: 'गौमूत्र', amount: 20, unit: 'लीटर' },
      { name: 'गायों का ताजा गोबर', amount: 2, unit: 'किग्रा' },
      { name: '10 कड़वी व औषधीय पत्तियों का पेस्ट (नीम, धतूरा, करंज, पपीता, बेल, आदि)', amount: 2, unit: 'किग्रा प्रति पत्ती' },
      { name: 'हल्दी पाउडर', amount: 500, unit: 'ग्राम' },
      { name: 'अदरक / सोंठ पेस्ट', amount: 500, unit: 'ग्राम' }
    ],
    processSteps: [
      'पानी व गौमूत्र में गोबर और 10 पत्तियों का पेस्ट घोलें।',
      'हल्दी व अदरक पेस्ट डालकर लकड़ी से अच्छी तरह हिलाएं।',
      '30-45 दिनों तक छाया में जूट की बोरी से ढककर किण्वन (Fermentation) होने दें।',
      'प्रतिदिन सुबह-शाम 2 मिनट चलाएं, तत्पश्चात छानकर उपयोग करें।'
    ],
    usage: '200 लीटर पानी में 6-8 लीटर दशपर्णी अर्क मिलाकर 1 एकड़ में स्प्रे करें।',
    precautions: 'लंबे किण्वन समय की आवश्यकता होती है, पूर्व योजना बनाकर तैयार करें।'
  },
  {
    id: 'sont-astra',
    title: 'सोंठ-दूध अर्क / छाछ फफूंदनाशक',
    type: 'प्राकृतिक फफूंदनाशक (Fungicide)',
    category: 'fungicide',
    target: 'फफूंदजन्य रोग, झुलसा, धब्बा रोग, पाउडर व डाउनी मिल्ड्यू',
    shelfLife: '1 माह',
    costPerAcre: '₹80 - ₹120',
    baseWater: 100,
    baseIngredients: [
      { name: 'देशी गाय का दूध (या खट्टी छाछ)', amount: 5, unit: 'लीटर' },
      { name: 'सोंठ (सूखा अदरक) पाउडर', amount: 200, unit: 'ग्राम' },
      { name: 'पानी', amount: 100, unit: 'लीटर' }
    ],
    processSteps: [
      '5 लीटर दूध में 200 ग्राम सोंठ पाउडर मिलाकर 15 मिनट उबालें।',
      'ठंडा होने पर इसे 2-3 दिन तक जमने / खट्टा होने दें।',
      '100 लीटर पानी में इस तैयार घोल को मिलाकर चलाएं।'
    ],
    usage: 'प्रति एकड़ फसल पर फफूंद के शुरुआती लक्षण दिखते ही स्प्रे करें।',
    precautions: 'छाछ का उपयोग करते समय तांबे के बर्तन में 3-4 दिन रखी खट्टी छाछ सर्वोत्तम परिणाम देती है।'
  }
];

export default function OrganicFarmingPage() {
  const [landArea, setLandArea] = useState(1); // Default 1 Acre
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Filter Logic
  const filteredRecipes = ORGANIC_RECIPES.filter(recipe => {
    if (filterCategory === 'all') return true;
    return recipe.category === filterCategory;
  });

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-green-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden print:bg-none print:text-black print:p-0">
        <div className="relative z-10 space-y-3">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" /> कृषि मित्र - प्राकृतिक एवं जैविक खेती
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            जैविक खाद एवं प्राकृतिक कीटनाशक निर्माण गाइड
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed print:text-slate-700">
            ज़ीरो बजट प्राकृतिक खेती (ZBNF) तकनीकों के आधार पर बिना रसायन कम लागत में विषमुक्त फसल उत्पादन करें और मिट्टी की उर्वरकता बढ़ाएं।
          </p>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        
        {/* Land Area Calculator Input */}
        <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-emerald-950 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-700" /> अपनी जमीन (एकड़) अनुसार मात्रा कैलकुलेटर
            </h3>
            <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2.5 py-1 rounded-full">
              ऑटो-स्केलिंग
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                जमीन का क्षेत्रफल (एकड़ में):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={landArea}
                  onChange={(e) => setLandArea(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-28 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-700">एकड़ (Acre)</span>
              </div>
            </div>

            {/* Quick Select Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-4">
              {[0.5, 1, 2, 5, 10].map((acre) => (
                <button
                  key={acre}
                  onClick={() => setLandArea(acre)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    landArea === acre 
                      ? 'bg-emerald-700 text-white shadow-xs' 
                      : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {acre} एकड़
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            💡 नीचे दिए गए सभी नुस्खों में लगने वाली सामग्री की मात्रा आपके चुने गए <strong>{landArea} एकड़</strong> क्षेत्रफल के अनुसार स्वचालित रूप से बदल गई है।
          </p>
        </div>

        {/* Category Filter & Print Actions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 mb-2">
              <Filter className="w-4 h-4 text-emerald-600" /> श्रेणी चुनें:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">सभी नुस्खे (All Formulations)</option>
              <option value="fertilizer">प्राकृतिक खाद (Fertilizer)</option>
              <option value="pesticide">जैविक कीटनाशक (Pesticides)</option>
              <option value="fungicide">फफूंदनाशक (Fungicide)</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-amber-400" /> गाइड प्रिंट / PDF सेव करें
          </button>
        </div>
      </div>

      {/* Recipes Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecipes.map((item) => {
          const isExpanded = expandedCard === item.id;

          return (
            <div 
              key={item.id} 
              className={`bg-white border transition-all duration-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 print:border-black ${
                isExpanded ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      {item.type}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-600 shrink-0" /> {item.title}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl block">
                      अनुमानित खर्च: {item.costPerAcre}
                    </span>
                  </div>
                </div>

                {/* Target & Shelf Life Metadata */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl text-xs font-semibold text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">मुख्य प्रभाव / लक्षित कीट:</span>
                    <span className="text-slate-900 font-bold">{item.target}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">संरक्षण अवधि (Shelf Life):</span>
                    <span className="text-emerald-800 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" /> {item.shelfLife}
                    </span>
                  </div>
                </div>

                {/* Scaled Ingredients Table */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      आवश्यक सामग्री ({landArea} एकड़ हेतु):
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      पानी: {item.baseWater * landArea} लीटर
                    </span>
                  </div>

                  <ul className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    {item.baseIngredients.map((ing, idx) => {
                      const scaledAmount = (ing.amount * landArea).toLocaleString('hi-IN', { maximumFractionDigits: 2 });
                      return (
                        <li key={idx} className="flex justify-between items-center p-2.5 bg-slate-50/50 hover:bg-emerald-50/50 transition">
                          <span className="font-medium text-slate-800">{ing.name}</span>
                          <span className="font-black text-emerald-950 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                            {scaledAmount} {ing.unit}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Expandable Preparation & Application Steps */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
                    
                    {/* Process Steps */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> बनाने की क्रमबद्ध विधि:
                      </h4>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 pl-1">
                        {item.processSteps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed font-medium">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Usage Method */}
                    <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                      <span className="font-extrabold block text-emerald-900">उपयोग एवं छिड़काव का तरीका:</span>
                      <p className="leading-relaxed font-medium">{item.usage}</p>
                    </div>

                    {/* Precautions */}
                    <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">सावधानी:</span>
                        <p className="font-medium leading-relaxed">{item.precautions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion Toggle Button */}
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 transition print:hidden"
              >
                {isExpanded ? (
                  <>
                    संक्षिप्त करें <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    बनाने की पूरी विधि एवं सावधानियां देखें <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Savings & Educational Impact Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-6 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-6">
          <div>
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              आर्थिक लाभ तुलना
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-2">
              रसायनिक बनाम जैविक खेती: लागत बचत का गणित
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              देसी गाय के गोबर व गौमूत्र से बने जैविक इनपुट का उपयोग करने पर प्रति एकड़ खेती की लागत में भारी कमी आती है।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">रसायनिक खाद व दवा (प्रति एकड़)</span>
            <p className="text-xl font-black text-red-400">₹6,000 - ₹9,000</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium">प्राकृतिक जैविक विकल्प (प्रति एकड़)</span>
            <p className="text-xl font-black text-emerald-400">₹400 - ₹800</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl space-y-1">
            <span className="text-xs text-emerald-300 font-bold">आपकी कुल शुद्ध बचत</span>
            <p className="text-2xl font-black text-amber-400">₹5,000+ / एकड़</p>
          </div>
        </div>
      </div>
    </div>
  );
}