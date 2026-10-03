export default function LogoSvg({ className = "h-10 w-auto" }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Leaf Graphic */}
        <path
          d="M50 10 C 20 10, 10 40, 10 70 C 40 70, 50 40, 50 10 Z"
          fill="#16a34a"
        />
        <path
          d="M50 10 C 80 10, 90 40, 90 70 C 60 70, 50 40, 50 10 Z"
          fill="#EAB308"
        />
        <path
          d="M50 10 L50 90"
          stroke="#15803d"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-xl font-extrabold tracking-tight text-emerald-800 leading-tight">
          Krishi Mitra
        </span>
        <span className="text-[10px] font-medium text-amber-600 tracking-wide">
          किसान का साथी, हर कदम पर
        </span>
      </div>
    </div>
  );
}