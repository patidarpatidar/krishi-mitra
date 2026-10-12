import Link from "next/link";

export const metadata = {
  title: "पेज नहीं मिला | किसान मित्र",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-black text-emerald-600">404</p>
      <h1 className="text-2xl font-bold mt-4 text-slate-900">
        यह पेज उपलब्ध नहीं है
      </h1>
      <p className="text-slate-600 mt-2 max-w-md">
        जो पेज आप ढूंढ रहे हैं वह हटा दिया गया है या उपलब्ध नहीं है।
      </p>
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition"
        >
          होम पेज पर जाएं
        </Link>
        <Link
          href="/crops"
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-emerald-300 transition"
        >
          फसल गाइड
        </Link>
        <Link
          href="/blog"
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-emerald-300 transition"
        >
          कृषि ब्लॉग
        </Link>
        <Link
          href="/mandi-bhav"
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-emerald-300 transition"
        >
          मंडी भाव
        </Link>
      </div>
    </div>
  );
}
