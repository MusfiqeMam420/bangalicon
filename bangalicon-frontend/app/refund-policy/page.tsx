import LegalPageShell from "@/components/LegalPageShell";
import { createPageMetadata } from "../lib/seo";

export const metadata = createPageMetadata({
  title: "Refund Policy",
  path: "/refund-policy",
  description:
    "Review how Bangalicon handles billing mistakes, subscription issues, and refund requests with a simple, fair policy.",
  keywords: ["refund policy", "subscription refunds", "billing help"],
});

export default function RefundPolicyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Refund Policy"
      intro="This refund policy explains how Bangalicon handles subscription payments, mistaken purchases, and access issues in a simple and fair way."
      lastUpdated="August 5, 2026"
      sections={[
        {
          title: "General policy",
          body: (
            <>
              <p>
                If Bangalicon introduces paid plans, refund requests will be reviewed fairly based on
                the situation, the billing date, and whether premium access has already been actively
                used.
              </p>
              <p>
                Short accidental purchases, duplicate charges, or clear billing mistakes are the most
                likely cases for a refund review.
              </p>
            </>
          ),
        },
        {
          title: "When refunds may be approved",
          body: (
            <>
              <p>
                Refunds may be approved when a user is charged twice, charged after a cancellation
                error, or unable to access the purchased plan because of a service issue on our side.
              </p>
              <p>
                We also review first-time cases where the purchase was made by mistake and reported
                quickly after the payment date.
              </p>
            </>
          ),
        },
        {
          title: "When refunds may not apply",
          body: (
            <>
              <p>
                Refunds may not apply after long-term active use of premium access, intentional plan
                abuse, repeated refund patterns, or account sharing that breaks the service rules.
              </p>
            </>
          ),
        },
        {
          title: "How to request help",
          body: (
            <>
              <p>
                If you need help with a payment, contact Bangalicon support with your account email,
                the payment date, and a short note about the issue. Clear details help us resolve it
                faster.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
