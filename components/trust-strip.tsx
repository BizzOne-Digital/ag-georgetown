function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.9 6.06 6.6.77-4.9 4.6 1.28 6.57L12 16.9l-5.88 3.6 1.28-6.57-4.9-4.6 6.6-.77L12 2.5Z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M12 21s-6.5-5.8-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.2-6.5 11-6.5 11Z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  { Icon: StarIcon, label: "Loved by Georgetown Shoppers" },
  { Icon: ShieldCheckIcon, label: "100% Authentic" },
  { Icon: PinIcon, label: "In-Store & Online" },
  { Icon: LockIcon, label: "Secure Checkout" },
];

// Compact credibility strip, deliberately below TrustBadgeRow's weight -
// meant to be read in passing near the top of the page, not lingered on.
export function TrustStrip() {
  return (
    <section className="border-y border-ink/10 bg-cream py-7">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-6 sm:grid-cols-4 lg:px-10">
        {ITEMS.map(({ Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-3 sm:justify-start">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-start to-gold-end">
              <Icon className="h-4 w-4 text-ink" />
            </span>
            <span className="font-body text-xs font-medium text-ink/80 sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
