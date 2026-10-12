import { SITE_ORIGIN } from "@/lib/seo";

export default function robots() {
  if (process.env.VERCEL_ENV === "preview") {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/farmer",
          "/farmer/",
          "/login",
          "/register",
          "/search",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/farmer",
          "/farmer/",
          "/login",
          "/register",
          "/api/",
        ],
      },
    ],
    sitemap: SITE_ORIGIN ? `${SITE_ORIGIN}/sitemap.xml` : undefined,
    host: SITE_ORIGIN || undefined,
  };
}
