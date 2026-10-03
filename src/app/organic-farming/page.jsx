import { Leaf, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function OrganicFarmingPage() {
  const recipes = [
    {
      title: 'जीवामृत (Jeevamrut)',
      type: 'प्राकृतिक तरल खाद',
      ingredients: '200 लीटर पानी, 10 किग्रा देसी गाय का गोबर, 10 लीटर गौमूत्र, 2 किग्रा गुड़, 2 किग्रा बेसन, 1 किग्रा मेड़ की मिट्टी।',
      process: 'सभी सामग्रियों को ड्रम में घोलकर 48-72 घंटे छाया में रखें। दिन में दो बार लकड़ी से चलाएं।',
      usage: 'प्रति एकड़ सिंचाई के पानी के साथ या छिड़काव के रूप में उपयोग करें।'
    },
    {
      title: 'नीमास्त्र (Neemastra)',
      type: 'जैविक कीटनाशक',
      ingredients: '100 लीटर पानी, 5 लीटर गौमूत्र, 5 किग्रा नीम की पत्ती की चटनी, 1 किग्रा गोबर।',
      process: '24 घंटे तक छाया में रखें और फिर छानकर फसल पर छिड़काव करें।',
      usage: 'इल्ली, थ्रिप्स एवं रस चूसक कीटों के नियंत्रण हेतु उपयोगी।'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 sm:p-8 rounded-2xl shadow-md">
        <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase">
          प्राकृतिक एवं जैविक खेती
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold mt-2">
          जैविक खाद एवं कीटनाशक निर्माण गाइड
        </h1>
        <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-2xl">
          बिना रसायन कम लागत में विषमुक्त खेती करें और अपनी मिट्टी की उर्वरक क्षमता बढ़ाएं।
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map((item) => (
          <div key={item.title} className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" /> {item.title}
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                {item.type}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>आवश्यक सामग्री:</strong> {item.ingredients}</p>
              <p><strong>बनाने की विधि:</strong> {item.process}</p>
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-emerald-900 font-medium">
                <strong>उपयोग तरीका:</strong> {item.usage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}