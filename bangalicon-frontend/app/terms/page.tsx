import LegalPageShell from "@/components/LegalPageShell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  path: "/terms",
  description:
    "Read the Bangalicon terms of use for browsing, downloading, integrating, and using the icon library across websites, products, and client work.",
  keywords: ["terms of use", "icon license terms", "usage terms"],
});

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Use"
      intro="These terms explain how people can browse, download, integrate, and use Bangalicon across websites, products, and design workflows."
      lastUpdated="August 5, 2026"
      sections={[
        {
          title: "Using Bangalicon",
          body: (
            <>
              <p>
                You can browse Bangalicon, copy icon code, and use icons inside personal, freelance,
                and commercial projects as long as you follow the rules on this page.
              </p>
              <p>
                You may not present Bangalicon itself as your own icon library, resell the library as
                a competing asset pack, or redistribute the full collection in a way that replaces the
                need for a Bangalicon visit or subscription.
              </p>
            </>
          ),
        },
        {
          title: "Accounts and access",
          body: (
            <>
              <p>
                Some Bangalicon features require an account, including saved collections, account
                settings, and any future premium tools. You are responsible for keeping your login
                details secure and for activity that happens under your account.
              </p>
              <p>
                If we detect abuse, scraping that harms the service, or account sharing that breaks our
                access model, we may limit or suspend access to protect the product.
              </p>
            </>
          ),
        },
        {
          title: "Project usage",
          body: (
            <>
              <p>
                Icons downloaded or copied from Bangalicon may be used in apps, websites, dashboards,
                presentations, product mockups, and client work. You can style them, resize them, and
                combine them with your own interface system.
              </p>
              <p>
                If you publish a package, template, or builder that includes Bangalicon assets, make
                sure the assets are part of your product experience and not the main value being sold by
                itself.
              </p>
            </>
          ),
        },
        {
          title: "Service updates",
          body: (
            <>
              <p>
                Bangalicon may change icon names, package output, categories, release notes, or delivery
                methods as the library improves. We try to keep changes clear and stable, but some parts
                of the service may evolve over time.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
