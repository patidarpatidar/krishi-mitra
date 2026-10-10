import '@/app/globals.css';
import Script from "next/script";
import ConditionalWebsiteLayout from "@/components/ConditionalWebsiteLayout";
import {
  SITE_ORIGIN,
  createMetadata,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

const googleAnalyticsId =
  /^G-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GA_ID || "")
    ? process.env.NEXT_PUBLIC_GA_ID
    : "";

export const metadata = {
  ...createMetadata({
    title: "कृषि मित्र | मध्य प्रदेश के किसानों के लिए कृषि जानकारी",
    description:
      "मध्य प्रदेश के किसानों के लिए फसल गाइड, मंडी भाव, मौसम, सरकारी योजनाएं, जैविक खेती और पशुपालन की जानकारी।",
    path: "/",
  }),
  metadataBase: SITE_ORIGIN ? new URL(SITE_ORIGIN) : undefined,
  title: {
    default: "कृषि मित्र | मध्य प्रदेश के किसानों के लिए कृषि जानकारी",
    template: "%s | कृषि मित्र",
  },
  applicationName: "कृषि मित्र",
  category: "agriculture",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi-IN" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(getOrganizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(getWebsiteJsonLd()),
          }}
        />
        {googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(googleAnalyticsId)}, { anonymize_ip: true });`}
            </Script>
          </>
        )}
         <ConditionalWebsiteLayout>
          {children}
        </ConditionalWebsiteLayout>
      </body>
    </html>
  );
}