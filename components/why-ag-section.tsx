import { SectionHeading } from "./section-heading";
import { ScrollReveal, RevealItem } from "./scroll-reveal";

const ITEMS = [
  {
    title: "100% Authentic",
    body: "Every product sourced directly from official distributors.",
    large: false,
  },
  {
    title: "Liquidation Pricing",
    body: "Real savings, not inflated \"was\" prices.",
    large: true,
  },
  {
    title: "For Every Age Group",
    body: "Style, confidence, and affordability for students, working professionals, and families alike.",
    large: false,
  },
  {
    title: "For Every Occasion",
    body: "From everyday routine to special occasions - pieces that let you express your own style.",
    large: false,
  },
];

export function WhyAGSection() {
  return (
    <section className="bg-black py-24 text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="The AG Difference" title="Why Georgetown Shops With Us" align="center" className="[&_h2]:text-cream" />

        <ScrollReveal className="mt-14 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
          {ITEMS.map((item) => (
            <RevealItem
              key={item.title}
              className={`shrink-0 w-[80%] snap-start border border-white/10 bg-white/5 p-8 md:w-auto ${
                item.large ? "md:col-span-1 md:row-span-1 md:p-12" : ""
              }`}
            >
              <h3 className="font-display text-h3 font-medium text-gold-end">{item.title}</h3>
              <p className="mt-3 font-body text-sm text-cream/75">{item.body}</p>
            </RevealItem>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
