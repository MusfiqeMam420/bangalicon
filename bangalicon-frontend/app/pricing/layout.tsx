import type { Metadata } from "next";

import { SHOW_PRICING } from "../lib/features";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  path: "/pricing",
  description:
    "Compare Bangalicon plan options and understand what each billing level includes for access, downloads, and future premium tools.",
  keywords: ["icon pricing", "subscription plans", "design tool pricing"],
  noIndex: !SHOW_PRICING,
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
