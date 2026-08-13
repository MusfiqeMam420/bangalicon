import LegalPageShell from "@/components/LegalPageShell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
  description:
    "See what Bangalicon stores, why it is stored, and how your account, collections, and access details are handled.",
  keywords: ["privacy policy", "account privacy", "data policy"],
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This page explains what Bangalicon stores, why it is stored, and how that data supports your account, icon collections, and product access."
      lastUpdated="August 5, 2026"
      sections={[
        {
          title: "What we collect",
          body: (
            <>
              <p>
                When you create an account, we may store your name, email address, profile image,
                login method, and account status. We also store saved collections, subscription state,
                and security details needed to keep your account working.
              </p>
              <p>
                Basic usage information such as page activity, icon interactions, or failed login
                attempts may also be recorded to improve reliability and protect the service.
              </p>
            </>
          ),
        },
        {
          title: "How we use your data",
          body: (
            <>
              <p>
                We use your information to authenticate your account, send verification or reset
                messages, save your preferences, show the right access level, and improve the overall
                Bangalicon experience.
              </p>
              <p>
                We do not use your private account data to claim ownership over your work, designs, or
                product decisions.
              </p>
            </>
          ),
        },
        {
          title: "Sharing and security",
          body: (
            <>
              <p>
                Bangalicon does not sell your personal account data. We may use trusted services for
                login, email delivery, hosting, analytics, or infrastructure when needed to operate the
                product.
              </p>
              <p>
                Reasonable technical steps are used to protect stored data, but no system can promise
                absolute security. If you believe your account is compromised, you should update your
                password right away.
              </p>
            </>
          ),
        },
        {
          title: "Your choices",
          body: (
            <>
              <p>
                You can update your profile information, manage your saved data through your account,
                and request account removal if you no longer want to use Bangalicon.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
