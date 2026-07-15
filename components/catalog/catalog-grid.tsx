import { SidebarFilters } from "./sidebar-filters";
import { SortDropdown } from "./sort-dropdown";
import { ShowMoreButton } from "./show-more-button";
import { ProductCard } from "./product-card";
import type { AnnotatedProduct, CatalogFacets, CatalogSort } from "@/lib/catalog/types";

interface CatalogGridProps {
  facets: CatalogFacets;
  currentFilters: {
    types: string[];
    availability: string[];
    brands: string[];
    minPrice: number | undefined;
    maxPrice: number | undefined;
  };
  sort: CatalogSort;
  products: AnnotatedProduct[];
  total: number;
}

// Shared by /products and /offers (the latter always scoped to on-sale
// items via CatalogFilters.onSale) - the filter/sort/grid/show-more block
// that used to be hardcoded into app/products/page.tsx alone.
export function CatalogGrid({ facets, currentFilters, sort, products, total }: CatalogGridProps) {
  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <SidebarFilters facets={facets} current={currentFilters} />

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <p className="font-body text-sm text-ink/60">
            {total} product{total === 1 ? "" : "s"}
          </p>
          <SortDropdown current={sort} />
        </div>

        {products.length === 0 ? (
          <p className="mt-12 font-body text-sm text-ink/60">No products match these filters.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.slug}
                product={{
                  slug: p.slug,
                  title: p.title,
                  vendor: p.vendor,
                  price: p.price,
                  compareAtPrice: p.compareAtPrice,
                  images: p.images,
                  variants: p.variants,
                  inStock: p.inStock,
                }}
              />
            ))}
          </div>
        )}

        <ShowMoreButton currentCount={products.length} total={total} />
      </div>
    </div>
  );
}
