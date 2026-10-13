export default function LogoSvg({ className = "h-12 w-auto" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Logo Icon: Green Leaf + Golden Rising Sun */}
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="किसान ओजस लोगो"
      >
        {/* Golden Sun Rays */}
        <g
          stroke="#EAB308"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <path d="M50 5V12" />
          <path d="M30 12L35 18" />
          <path d="M70 12L65 18" />
        </g>

        {/* Rising Golden Sun */}
        <path
          d="M27 48C27 35 37 25 50 25C63 25 73 35 73 48Z"
          fill="#FACC15"
        />

        {/* Green Leaf */}
        <path
          d="M48 12C27 18 15 35 18 59C36 57 48 41 48 12Z"
          fill="#16A34A"
        />

        {/* Leaf Vein */}
        <path
          d="M23 51C31 40 39 29 46 20"
          stroke="#166534"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Plant Stem */}
        <path
          d="M50 43V79"
          stroke="#166534"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* New Growth */}
        <path
          d="M50 66C40 53 31 55 29 56C31 65 40 70 50 70Z"
          fill="#22C55E"
        />
        <path
          d="M50 66C60 53 69 55 71 56C69 65 60 70 50 70Z"
          fill="#15803D"
        />

        {/* Green Horizon */}
        <path
          d="M12 70C30 62 70 62 88 70"
          stroke="#16A34A"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Soil */}
        <path
          d="M26 83C39 77 61 77 74 83"
          stroke="#A16207"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Hindi Brand Name */}
      <div className="leading-none whitespace-nowrap">
        <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-800">
          किसान <span className="text-amber-500">ओजस</span>
        </div>

        {/* Hindi Tagline */}
        <p className="text-[9px] sm:text-[10px] font-semibold text-slate-500 tracking-wide mt-1.5">
          किसान की शक्ति, खेती की प्रगति
        </p>
      </div>
    </div>
  );
}