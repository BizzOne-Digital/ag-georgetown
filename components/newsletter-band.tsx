import { EmailCapture } from "./email-capture";

interface NewsletterBandProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

// Heading deliberately doesn't promise a specific discount ("Unlock 10%
// Off") - there's no mechanism today that issues or lets someone redeem an
// actual code from a newsletter signup (see app/api/newsletter/route.ts,
// which only notifies the store of a new signup). A real welcome-code flow
// is a separate, explicitly scoped follow-up, not implied by this copy.
export function NewsletterBand({
  heading = "Get First Access to New Drops & Deals",
  subheading = "Join our list to hear about new arrivals and bundle offers first.",
  className = "",
}: NewsletterBandProps) {
  return (
    <section className={`border-y-[3px] border-transparent bg-cream py-16 [border-image:linear-gradient(135deg,var(--color-gold-start),var(--color-gold-end))_1] ${className}`}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <h3 className="font-display text-h3 font-medium text-ink">{heading}</h3>
        <p className="font-body text-sm text-ink/70">{subheading}</p>
        <EmailCapture />
      </div>
    </section>
  );
}
