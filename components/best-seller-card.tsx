import Image from "next/image";
import { FoilSweep } from "./foil-sweep";
import { ScrollSnapItem } from "./scroll-snap-row";
import type { ProductItem } from "@/lib/products";

export function BestSellerCard({ item }: { item: ProductItem }) {
  const { Art, image, brand, name, price } = item;

  return (
    <ScrollSnapItem className="w-[85vw] sm:w-80">
      <FoilSweep className="block h-full w-full">
        <div className="flex h-full flex-col border border-ink/10 bg-cream p-4">
          <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-gold-start/10 to-rose/10">
            {image ? (
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 85vw, 320px" className="object-contain p-3" />
            ) : (
              <Art className="h-24 w-24" />
            )}
            <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 bg-gold px-2.5 py-1 font-body text-[0.65rem] font-bold uppercase tracking-[0.05em] text-black">
              ★ Best Seller
            </span>
          </div>
          <span className="mt-4 font-body text-caption font-medium uppercase tracking-label text-rose-deep">{brand}</span>
          <h3 className="mt-1 font-display text-base font-medium text-ink">{name}</h3>
          <span className="mt-2 font-body text-sm font-medium text-ink/80">{price}</span>
        </div>
      </FoilSweep>
    </ScrollSnapItem>
  );
}
