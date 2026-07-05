import { OfferBadge } from "./offer-badge";

interface PromotionCardProps {
  Art: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  endsLabel: string;
  badge: string;
}

export function PromotionCard({ Art, title, description, endsLabel, badge }: PromotionCardProps) {
  return (
    <div className="relative flex flex-col gap-6 border-[1.5px] gold-border bg-cream p-8 md:flex-row md:items-center">
      <OfferBadge className="absolute -left-4 -top-4">{badge}</OfferBadge>
      <div className="flex h-40 w-full shrink-0 items-center justify-center bg-gradient-to-br from-gold-start/15 to-gold-end/25 md:w-48">
        <Art className="h-32 w-32" />
      </div>
      <div>
        <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
          Ends {endsLabel}
        </span>
        <h3 className="mt-2 font-display text-h3 font-medium text-ink">{title}</h3>
        <p className="mt-2 font-body text-sm text-ink/70">{description}</p>
      </div>
    </div>
  );
}
