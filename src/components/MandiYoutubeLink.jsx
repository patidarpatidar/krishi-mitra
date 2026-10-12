import { ArrowUpRight, Youtube } from "lucide-react";

const CHANNEL_URL = "https://www.youtube.com/@ManasaMandi123";

export default function MandiYoutubeLink() {
  return (
    <a
      href={CHANNEL_URL}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 transition hover:border-rose-300 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:px-5"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
          <Youtube className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-slate-900">
            Manasa Mandi पर रोज़ के ताज़ा मंडी भाव
          </span>
          <span className="mt-0.5 block text-xs font-medium text-slate-600">
            प्रमुख फसलों के नवीनतम भाव और बाजार अपडेट के वीडियो देखें।
          </span>
        </span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-rose-700">
        YouTube पर देखें
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </a>
  );
}