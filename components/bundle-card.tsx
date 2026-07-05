import Image from "next/image";
import { OfferBadge } from "./offer-badge";
import { FoilSweep } from "./foil-sweep";
import { Button } from "./button";
import type { SiteImage } from "@/lib/images";

interface BundleCardProps {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  name: string;
  contents: string;
  price: string;
  originalPrice?: string;
  badge: string;
}

export function BundleCard({ Art, image, name, contents, price, originalPrice, badge }: BundleCardProps) {
  return (
    <div className="relative border-[1.5px] gold-border p-8">
      <OfferBadge className="absolute -right-4 -top-4">{badge}</OfferBadge>
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-gold-start/10 to-gold-end/20">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 90vw, 30vw" className="object-contain p-3" />
        ) : (
          <Art className="h-32 w-32" />
        )}
      </div>
      <h3 className="mt-6 font-display text-h3 font-medium text-ink">{name}</h3>
      <p className="mt-2 font-body text-sm text-ink/70">{contents}</p>
      <div className="mt-4 flex items-baseline gap-3">
        {originalPrice && (
          <span className="font-body text-sm text-ink/40 line-through">{originalPrice}</span>
        )}
        <span className="font-display text-xl font-medium text-rose-deep">{price}</span>
      </div>
      <Button href="/contact" variant="ghost" fullWidth className="mt-6">
        Visit to Grab This Deal
      </Button>
    </div>
  );
}
