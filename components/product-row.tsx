import { ProductCard, toProductCardData } from "./catalog/product-card";
import type { IProduct } from "@/lib/models/Product";

interface ProductRowProps {
  products: IProduct[];
  className?: string;
}

// Shared by Home's Best Sellers, Home's Bundle Deals, and Offers' Bundle &
// Gift Sets row - one static product grid, not a separate component per
// section.
export function ProductRow({ products, className = "" }: ProductRowProps) {
  if (products.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${className}`}>
      {products.map((p) => (
        <ProductCard key={p.slug} product={toProductCardData(p)} />
      ))}
    </div>
  );
}
