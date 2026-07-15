import { SectionHeading } from "./section-heading";
import { ScrollReveal, RevealItem } from "./scroll-reveal";

const ITEMS = [
  {
    title: "100% Authentic",
    body: "Every product sourced directly from official distributors.",
  },
  {
    title: "Liquidation Pricing",
    body: "Real savings, not inflated \"was\" prices.",
  },
  {
    title: "For Every Age Group",
    body: "Style, confidence, and affordability for students, working professionals, and families alike.",
  },
  {
    title: "For Every Occasion",
    body: "From everyday routine to special occasions - pieces that let you express your own style.",
  },
];

// Replaces why-ag-section.tsx's dark asymmetric card grid with a flat,
// conventional badge row - same content, simpler presentation.
export function TrustBadgeRow() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="The AG Difference" title="Why Georgetown Shops With Us" align="center" />

        <ScrollReveal className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4" stagger={0.08}>
          {ITEMS.map((item) => (
            <RevealItem key={item.title} className="text-center">
              <span className="mx-auto block h-3 w-3 rounded-full bg-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 font-body text-sm text-ink/70">{item.body}</p>
            </RevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
