import { ScrollReveal, RevealItem } from "./scroll-reveal";

const STEPS = [
  { num: "1", title: "Browse Online", body: "Explore our collection and current deals from anywhere." },
  { num: "2", title: "Visit In-Store", body: "Come see, smell, and try before you buy at 130 Guelph St." },
  { num: "3", title: "Save on the Spot", body: "Walk out with authentic products at liquidation prices, no waiting for shipping." },
];

export function HowItWorks() {
  return (
    <div className="relative">
      <div className="absolute bottom-0 left-5 top-0 w-px bg-gold opacity-40 sm:hidden" aria-hidden="true" />
      <div className="absolute left-0 right-0 top-8 hidden h-px bg-gold opacity-40 sm:block" aria-hidden="true" />

      <ScrollReveal className="relative flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-6" stagger={0.15}>
        {STEPS.map((step) => (
          <RevealItem
            key={step.num}
            className="relative flex gap-5 sm:flex-1 sm:flex-col sm:items-center sm:gap-4 sm:text-center"
          >
            <span className="gold-text relative z-10 shrink-0 bg-cream font-display text-4xl font-medium sm:px-4">
              {step.num}
            </span>
            <div className="sm:mt-2">
              <h3 className="font-display text-h3 font-medium text-ink">{step.title}</h3>
              <p className="mt-2 max-w-[220px] font-body text-sm text-ink/70 sm:mx-auto">{step.body}</p>
            </div>
          </RevealItem>
        ))}
      </ScrollReveal>
    </div>
  );
}
