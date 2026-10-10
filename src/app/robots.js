import { SITE_ORIGIN } from "@/lib/seo";

export default function robots() {
  return {
    rules: {
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
        "/*?*",
      ],
    },
    sitemap: SITE_ORIGIN ? `${SITE_ORIGIN}/sitemap.xml` : undefined,
    host: SITE_ORIGIN || undefined,
  };
}
