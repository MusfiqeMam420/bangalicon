import LegalPageShell from "@/components/LegalPageShell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "License",
  path: "/license",
  description:
    "Learn how Bangalicon icons can be used in products, websites, client work, and design systems while protecting the library itself.",
  keywords: ["icon license", "commercial icon use", "design system license"],
});

export default function LicensePage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="License"
      intro="This license explains how Bangalicon icons can be used inside products, websites, client work, and design systems while still protecting the library itself."
      lastUpdated="August 5, 2026"
      sections={[
        {
          title: "Allowed use",
          body: (
            <>
              <p>
                Bangalicon icons may be used in personal projects, client projects, commercial
                products, internal tools, prototypes, websites, and mobile or desktop interfaces.
              </p>
              <p>
                You can resize icons, recolor them, combine them with your brand system, and export
                them in the formats supported by Bangalicon.
              </p>
            </>
          ),
        },
        {
          title: "Not allowed",
          body: (
            <>
              <p>
                You may not repackage the full Bangalicon library as a standalone icon pack, mirror the
                collection as a competing service, or redistribute the library in a way that replaces
                Bangalicon as the source.
              </p>
            </>
          ),
        },
        {
          title: "Brand and attribution",
          body: (
            <>
              <p>
                Attribution is appreciated but not required for normal product usage unless a specific
                asset or bundle says otherwise in the future.
              </p>
              <p>
                The Bangalicon name, branding, site identity, and product presentation remain part of
                Bangalicon and should not be copied in a misleading way.
              </p>
            </>
          ),
        },
        {
          title: "Library changes",
          body: (
            <>
              <p>
                Bangalicon may add new icons, rename assets, update frameworks, or change delivery
                methods over time. Continued use of the library means using the current version of the
                service and its published rules.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
