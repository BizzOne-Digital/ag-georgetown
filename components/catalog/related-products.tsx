import type { IProduct } from "@/lib/models/Product";
import { ProductCard, toProductCardData } from "./product-card";

export function RelatedProducts({ products }: { products: IProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-ink/10 pt-16">
      <h2 className="font-display text-h3 font-medium text-ink">You may also like</h2>
      <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={toProductCardData(p)} />
        ))}
      </div>
    </section>
  );
}
