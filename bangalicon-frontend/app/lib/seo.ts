import type { Metadata } from "next";
import { getPublicSiteUrl } from "./runtime";

export const siteName = "Bangalicon";
export const defaultTitle = "Bangalicon \u2014 Handcrafted Icons";
export const defaultDescription =
  "Handcrafted icons for web projects, React, Vue, Svelte, and Figma. Browse Bangalicon, copy code, and ship cleaner interfaces faster.";
export const shareImage = "/bangalicon-og-image.png";
export const logoImage = "/auth-login-icon.png";

export const siteUrl = getPublicSiteUrl();

export const siteKeywords = [
  "Bangalicon",
  "icon library",
  "SVG icons",
  "icon font",
  "React icons",
  "Vue icons",
  "Svelte icons",
  "Figma plugin",
  "web icons",
  "UI icons",
  "interface icons",
  "frontend icons",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

type PageSeoOptions = {
  title?: string;
  description?: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  image?: string;
};

export function createPageMetadata({
  title,
  description = defaultDescription,
  path,
  keywords = [],
  noIndex = false,
  type = "website",
  image = shareImage,
}: PageSeoOptions): Metadata {
  const resolvedTitle = title || defaultTitle;
  const resolvedKeywords = Array.from(new Set([...siteKeywords, ...keywords]));

  return {
    title: resolvedTitle,
    description,
    keywords: resolvedKeywords,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title: resolvedTitle,
      description,
      url: path,
      siteName,
      type,
      locale: "en_US",
      images: [
        {
          url: image,
          alt: "Bangalicon social media preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
    },
  };
}

export function getSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: siteName,
        url: siteUrl,
        logo: absoluteUrl(logoImage),
        image: absoluteUrl(shareImage),
        description: defaultDescription,
        sameAs: ["https://www.figma.com/community/plugin/1509149406843135161/bangalicon"],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: siteUrl,
        name: siteName,
        description: defaultDescription,
        publisher: {
          "@id": absoluteUrl("/#organization"),
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl.replace(/\/$/, "")}/?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}
