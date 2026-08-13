import IconsPageClient from "./icons/IconsPageClient";
import { getPublicApiBase } from "./lib/runtime";
import { createPageMetadata } from "./lib/seo";

const API = getPublicApiBase();

export const metadata = createPageMetadata({
  path: "/",
  description:
    "Browse Bangalicon handcrafted icons, search by tag or category, copy SVG and framework code, and build cleaner interfaces faster.",
  keywords: [
    "handcrafted icons",
    "icon search",
    "copy SVG icons",
    "frontend icon library",
  ],
});

async function getInitialIcons() {
  try {
    const response = await fetch(`${API}/icons`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to preload icons for home page:", error);
    }

    return [];
  }
}

export default async function HomePage() {
  const initialIcons = await getInitialIcons();

  return <IconsPageClient initialIcons={initialIcons} />;
}
