import type { Metadata } from "next";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | AG Liquidation Perfume & Cosmetics",
  description: "Terms of service for the AG Liquidation Perfume & Cosmetics website.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40">
      <h1 className="font-display text-h2 font-medium text-ink">Terms of Service</h1>
      <p className="mt-4 font-body text-sm text-ink/50">
        Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-10 flex flex-col gap-8 font-body text-body text-ink/80">
        <p className="border-l-2 border-gold-start bg-gold-end/10 p-4 text-sm text-ink/70">
          This is a template terms of service provided as a starting point and should be reviewed
          by qualified legal counsel before launch.
        </p>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Site Content</h2>
          <p className="mt-3">
            This website is provided for informational purposes to help you learn about AG
            Liquidation Perfume &amp; Cosmetics - Georgetown, our product categories, and current
            promotions. Content may not be reproduced or used commercially without permission.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">No Online Purchasing</h2>
          <p className="mt-3">
            This site does not support online ordering or checkout. All products are sold
            in-store. Prices, availability, and promotions shown on this website are for reference
            only, subject to change without notice, and should be confirmed in-store.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">No Warranty on Pricing Accuracy</h2>
          <p className="mt-3">
            While we make reasonable efforts to keep pricing and offer information current, we
            make no warranty as to its accuracy. In-store pricing at the time of purchase governs.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Intellectual Property</h2>
          <p className="mt-3">
            The AG Liquidation name, logo, and all associated brand marks are the property of AG
            Liquidation Perfume &amp; Cosmetics - Georgetown. All other trademarks referenced belong
            to their respective owners.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Governing Law</h2>
          <p className="mt-3">
            These terms are governed by the laws of the Province of Ontario and the federal laws
            of Canada applicable therein.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Contact Us</h2>
          <p className="mt-3">
            Questions about these terms can be directed to our store at {BUSINESS.address.street},{" "}
            {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.postalCode}.
          </p>
        </div>
      </div>
    </section>
  );
}
