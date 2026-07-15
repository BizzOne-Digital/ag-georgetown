import type { Metadata } from "next";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | AG Liquidation Perfume & Cosmetics",
  description: "How AG Liquidation Perfume & Cosmetics collects, uses, and protects your information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-40 md:pt-48">
      <h1 className="font-display text-h2 font-medium text-ink">Privacy Policy</h1>
      <p className="mt-4 font-body text-sm text-ink/50">
        Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="prose-none mt-10 flex flex-col gap-8 font-body text-body text-ink/80">
        <p className="border-l-2 border-gold-start bg-gold-end/10 p-4 text-sm text-ink/70">
          This is a template privacy policy provided as a starting point. It has not been reviewed
          by a lawyer and should not be treated as legal advice. Please have this reviewed by
          qualified legal counsel before launch, to confirm compliance with Canada&apos;s Personal
          Information Protection and Electronic Documents Act (PIPEDA) and any applicable
          provincial legislation.
        </p>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Information We Collect</h2>
          <p className="mt-3">
            When you use the contact form or newsletter sign-up on this website, we collect the
            information you provide directly, which may include your name, email address, phone
            number, and the content of your message.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">How We Use Your Information</h2>
          <p className="mt-3">
            We use the information you provide to respond to your inquiries and, only if you have
            opted in, to send you promotional emails about sales, bundle offers, and new arrivals.
            You may unsubscribe from promotional emails at any time.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Sharing of Information</h2>
          <p className="mt-3">
            We do not sell, rent, or trade your personal information to third parties. Information
            you submit is used solely by AG Liquidation Perfume &amp; Cosmetics - Georgetown for the
            purposes described above.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Data Retention & Security</h2>
          <p className="mt-3">
            We retain contact form and newsletter submissions only as long as needed to respond to
            your inquiry or to fulfill promotional communications you&apos;ve opted into, and take
            reasonable measures to protect this information from unauthorized access.
          </p>
        </div>

        <div>
          <h2 className="font-display text-h3 font-medium text-ink">Contact Us</h2>
          <p className="mt-3">
            For questions about this privacy policy or your personal information, contact us at
            our store, {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.region}{" "}
            {BUSINESS.address.postalCode}, or by phone at {BUSINESS.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}
