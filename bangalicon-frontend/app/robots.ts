import type { MetadataRoute } from "next";

import { SHOW_PRICING } from "./lib/features";
import { absoluteUrl, siteUrl } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/account",
    "/collections",
    "/login",
    "/signup",
    "/reset-password",
    "/verify-email",
    "/auth",
    "/api",
  ];

  if (!SHOW_PRICING) {
    disallow.push("/pricing");
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
