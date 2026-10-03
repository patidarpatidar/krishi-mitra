export default function MandiWidget({ mandiData }) {
  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-emerald-100 pb-2">
        <div>
          <h3 className="text-lg font-bold text-emerald-900">आज का मंडी भाव (Neemuch)</h3>
          <p className="text-xs text-emerald-600">नीमच कृषि उपज मंडी, मध्य प्रदेश</p>
        </div>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-semibold">
          लाइव अपडेट
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-emerald-50 text-emerald-900">
              <th className="p-2">फ़सल</th>
              <th className="p-2">न्यूनतम</th>
              <th className="p-2">अधिकतम</th>
              <th className="p-2 font-bold text-emerald-700">मॉडल भाव</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {mandiData.slice(0, 4).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-2 font-medium">{item.crop}</td>
                <td className="p-2 text-slate-600">₹{item.minPrice}</td>
                <td className="p-2 text-slate-600">₹{item.maxPrice}</td>
                <td className="p-2 font-bold text-emerald-700">₹{item.modalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}