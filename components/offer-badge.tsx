interface OfferBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function OfferBadge({ children, className = "" }: OfferBadgeProps) {
  return (
    <div
      className={`relative flex h-20 w-20 shrink-0 rotate-[-6deg] items-center justify-center rounded-full bg-gold text-center font-body text-xs font-bold uppercase leading-tight tracking-[0.05em] text-black shadow-sm ${className}`}
    >
      <span className="rotate-[6deg] px-2">{children}</span>
    </div>
  );
}
