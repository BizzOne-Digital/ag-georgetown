import type { Metadata } from "next";
import { getCatalogData, getBundleProducts } from "@/lib/repositories/product.repository";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { ProductRow } from "@/components/product-row";
import { NewsletterBand } from "@/components/newsletter-band";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/button";
import { parseCatalogFilters, type SearchParamValue } from "@/lib/catalog/search-params";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Current Deals & Bundle Offers | AG Liquidation Georgetown",
  description:
    "Seasonal sales, bundle deals, and limited-time offers on perfumes and cosmetics in Georgetown, ON.",
  alternates: { canonical: `${SITE_URL}/offers` },
};

interface OffersPageProps {
  searchParams: Record<string, SearchParamValue>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  // Always on-sale here, regardless of what's in the URL - this page's
  // entire premise is "these are the discounted items."
  const filters = parseCatalogFilters(searchParams, { onSale: true });

  const [{ products, total, facets }, bundles] = await Promise.all([
    getCatalogData(filters),
    getBundleProducts(12),
  ]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-40 md:pt-48 lg:px-10">
        <h1 className="font-display text-h2 font-medium text-ink">On Sale</h1>
        <p className="mt-3 max-w-xl font-body text-body text-ink/70">
          Every discounted item in our catalog, updated regularly - filter and sort just like the full shop.
        </p>
      </div>

      {bundles.length > 0 && (
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading eyebrow="Bundle & Save" title="Bundle & Gift Sets" align="left" className="mb-10" />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <ProductRow products={bundles} />
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <CatalogGrid
          facets={facets}
          currentFilters={{
            types: filters.types ?? [],
            availability: filters.availability ?? [],
            brands: filters.brands ?? [],
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          }}
          sort={filters.sort ?? "featured"}
          products={products}
          total={total}
        />
      </div>

      {/* Seasonal spotlight */}
      {/* TODO: swap seasonal imagery/copy quarterly */}
      <section className="bg-cream py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
            Summer Spotlight
          </span>
          <h2 className="mt-4 font-display text-h2 font-medium text-ink">
            Light Scents &amp; Sun-Ready Skincare
          </h2>
          <p className="mt-4 font-body text-body text-ink/70">
            Warm-weather favorites - fresh fragrances, SPF-friendly formulas, and gift sets perfect
            for summer get-togethers.
          </p>
          <Button href="/contact" className="mt-8 inline-block">
            Visit the Store
          </Button>
        </div>
      </section>

      <NewsletterBand />

      <p className="px-6 py-8 text-center font-body text-xs text-ink/40">
        While supplies last. Prices subject to change. See in-store for full terms.
      </p>
    </>
  );
}
