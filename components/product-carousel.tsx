import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/button";
import { BestSellerCard, type BestSellerCardData } from "@/components/best-seller-card";

interface ProductCarouselProps {
  title: string;
  ctaHref?: string;
  ctaLabel?: string;
  // Already-plain data (see toBestSellerCardData) - converted server-side in
  // app/page.tsx.
  products: BestSellerCardData[];
}

// Shared by Home's "Shop Our Best Sellers" and "New Arrivals" rows - one
// static product grid, not a separate component per section.
export function ProductCarousel({ title, ctaHref = "/products", ctaLabel = "Shop All", products }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading title={title} align="center" />

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <BestSellerCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href={ctaHref} variant="ghost">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
