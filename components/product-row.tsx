import { ScrollSnapRow, ScrollSnapItem } from "./scroll-snap-row";
import { ProductCard, toProductCardData } from "./catalog/product-card";
import type { IProduct } from "@/lib/models/Product";

interface ProductRowProps {
  products: IProduct[];
  className?: string;
}

// Shared by Home's Best Sellers, Home's Bundle Deals, and Offers' Bundle &
// Gift Sets row - one horizontally-scrolling real-product row, not a
// separate placeholder card component per section.
export function ProductRow({ products, className = "" }: ProductRowProps) {
  if (products.length === 0) return null;

  return (
    <ScrollSnapRow className={className}>
      {products.map((p) => (
        <ScrollSnapItem key={p.slug} className="w-[70vw] sm:w-64 md:w-72">
          <ProductCard product={toProductCardData(p)} />
        </ScrollSnapItem>
      ))}
    </ScrollSnapRow>
  );
}
