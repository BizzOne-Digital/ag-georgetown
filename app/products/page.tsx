import type { Metadata } from "next";
import { getCatalogData } from "@/lib/repositories/product.repository";
import { getCategoryBySlug } from "@/lib/repositories/category.repository";
import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { parseCatalogFilters, type SearchParamValue } from "@/lib/catalog/search-params";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Products | AG Liquidation Georgetown",
  description: "Browse our full catalog of authentic fragrances, cosmetics, and skincare.",
  alternates: { canonical: `${SITE_URL}/products` },
};

interface ProductsPageProps {
  searchParams: Record<string, SearchParamValue>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const filters = parseCatalogFilters(searchParams);

  const [{ products, total, facets }, category] = await Promise.all([
    getCatalogData(filters),
    filters.categorySlug ? getCategoryBySlug(filters.categorySlug) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <h1 className="font-display text-h2 font-medium text-ink">{category ? category.title : "Shop All"}</h1>

      <div className="mt-8">
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
    </div>
  );
}
