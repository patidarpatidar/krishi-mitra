export default function WeatherWidget({ weatherData }) {
  const temp = weatherData?.current_weather?.temperature || '28';
  const wind = weatherData?.current_weather?.windspeed || '12';

  return (
    <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-xl p-5 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase font-semibold">
            मौसम पूर्वानुमान
          </span>
          <h3 className="text-xl font-bold mt-1">आज का मौसम (Neemuch)</h3>
          <p className="text-xs text-sky-100">मध्य प्रदेश</p>
        </div>
        <span className="text-4xl">☀️</span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold">{temp}°C</span>
        <span className="text-sm font-medium">साफ़ मौसम</span>
      </div>
      <div className="mt-3 pt-3 border-t border-white/20 flex justify-between text-xs text-sky-100">
        <span>हवा की गति: {wind} km/h</span>
        <span>आद्रता: ~65%</span>
      </div>
    </div>
  );
}