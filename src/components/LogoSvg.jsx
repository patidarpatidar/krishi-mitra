export default function LogoSvg({ className = "h-12 w-auto" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Logo Icon */}
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Green Leaf */}
        <path
          d="M50 8C25 10 10 28 10 65C30 65 46 50 50 25V8Z"
          fill="#16A34A"
        />

        {/* Yellow Leaf */}
        <path
          d="M50 8C75 10 90 28 90 65C70 65 54 50 50 25V8Z"
          fill="#EAB308"
        />

        {/* Center Stem */}
        <path
          d="M50 12V88"
          stroke="#166534"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Bottom Soil */}
        <path
          d="M22 88C35 80 65 80 78 88"
          stroke="#92400E"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand */}
      <div className="leading-none">
        <div className="flex items-center">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-800">
            किसान 
          </span>

          <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-500 ml-1">
            मित्र
          </span>
        </div>

        <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 tracking-wide mt-1">
          किसान का साथी, हर कदम पर
        </p>
      </div>
    </div>
  );
}