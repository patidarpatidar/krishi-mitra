"use client";

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export default function AdSenseSlot({ slot, className = "" }) {
  const pushedSlot = useRef("");
  const isConfigured =
    IS_PRODUCTION &&
    /^ca-pub-\d{16}$/.test(CLIENT_ID) &&
    /^\d+$/.test(String(slot || ""));

  useEffect(() => {
    if (!isConfigured || pushedSlot.current === slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedSlot.current = slot;
    } catch (error) {
      console.error("AdSense slot failed to initialize:", error);
    }
  }, [isConfigured, slot]);

  if (!isConfigured) return null;

  return (
    <aside aria-label="विज्ञापन" className={`mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 ${className}`}>
      <ins
        className="adsbygoogle block min-h-[90px] w-full overflow-hidden"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}