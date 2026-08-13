import type { MetadataRoute } from "next";

import { SHOW_PRICING } from "./lib/features";
import { absoluteUrl } from "./lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: Array<{
    path: string;
    priority: number;
    changeFrequency:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
  }> = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/categories", priority: 0.9, changeFrequency: "weekly" },
    { path: "/usage", priority: 0.9, changeFrequency: "weekly" },
    { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "monthly" },
    { path: "/refund-policy", priority: 0.4, changeFrequency: "monthly" },
    { path: "/license", priority: 0.4, changeFrequency: "monthly" },
  ];

  if (SHOW_PRICING) {
    pages.push({ path: "/pricing", priority: 0.6, changeFrequency: "weekly" });
  }

  return pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
