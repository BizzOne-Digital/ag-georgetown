import Image from "next/image";
import { OfferBadge } from "./offer-badge";
import { FoilSweep } from "./foil-sweep";
import type { SiteImage } from "@/lib/images";

interface ProductTileProps {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  brand: string;
  name: string;
  price: string;
  badge?: string;
}

export function ProductTile({ Art, image, brand, name, price, badge }: ProductTileProps) {
  return (
    <FoilSweep className="block w-full">
      <div className="group relative flex flex-col bg-gradient-to-br from-gold-start/10 to-gold-end/20 p-6">
        {badge && <OfferBadge className="absolute -right-3 -top-3 h-16 w-16 text-[0.6rem]">{badge}</OfferBadge>}
        <div className="relative flex h-36 items-center justify-center">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 45vw, 20vw"
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Art className="h-28 w-28 transition-transform duration-500 group-hover:scale-105" />
          )}
        </div>
        <span className="mt-5 font-body text-caption font-medium uppercase tracking-label text-rose-deep">
          {brand}
        </span>
        <h3 className="mt-1 font-display text-lg font-medium text-ink">{name}</h3>
        <span className="mt-2 font-body text-sm font-medium text-ink/80">{price}</span>
        <span className="mt-3 font-body text-xs text-ink/50">Visit in-store to purchase</span>
      </div>
    </FoilSweep>
  );
}
