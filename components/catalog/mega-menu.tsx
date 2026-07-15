import Link from "next/link";
import type { CategoryTreeNode } from "@/lib/repositories/category.repository";

// Virtual categories ("Brands", the various "Popular"/"Type" group headers)
// have no real Shopify collection behind them, so they render as plain
// text - a heading/hover-trigger only, not a link to nowhere.
function CategoryLink({ node, className }: { node: CategoryTreeNode; className?: string }) {
  if (node.isVirtual) {
    return <span className={className}>{node.title}</span>;
  }
  return (
    <Link href={`/products?category=${node.slug}`} className={className}>
      {node.title}
    </Link>
  );
}

export function MegaMenu({ items }: { items: CategoryTreeNode[] }) {
  return (
    <nav className="relative z-30 border-b border-ink/10 bg-cream">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-6 lg:px-10">
        {items.map((item) => {
          // Two shapes seen in the real taxonomy: a flat list of leaf links
          // (Brands, Hair Care), or children that are themselves grouping
          // headers with their own children (Fragrance -> Popular -> Bestseller).
          // A group can end up with zero children (e.g. "Featured Brands" -
          // its links were already claimed by the top-level "Brands" menu
          // during normalization's cross-link tie-break) - skip those rather
          // than rendering an empty column.
          const nonEmptyGroups = item.children.filter((child) => child.children.length > 0);
          const isGrouped = nonEmptyGroups.length > 0;

          return (
            <li key={item.slug} className="group/item">
              <CategoryLink
                node={item}
                className="block px-4 py-4 font-body text-sm font-medium uppercase tracking-label text-ink transition-colors group-hover/item:text-rose-deep"
              />
              {item.children.length > 0 && (
                // Positioned relative to <nav> (the only `relative` ancestor
                // here, since this <li> deliberately isn't one) rather than
                // this trigger's own narrow, text-sized <li> - that's what
                // was causing the panel to either overflow the viewport edge
                // or inherit a bizarre width from the trigger's box. Every
                // panel now anchors to the same full-width band under the
                // whole nav bar, matching the page's own content width.
                <div className="invisible absolute inset-x-0 top-full opacity-0 transition-opacity duration-200 group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100 motion-reduce:transition-none">
                  <div className="mx-auto max-w-7xl border border-ink/10 bg-cream p-8 shadow-lg px-6 lg:px-10">
                    {isGrouped ? (
                      <div className="flex flex-wrap gap-x-10 gap-y-6">
                        {nonEmptyGroups.map((group) => (
                          <div key={group.slug} className="w-44">
                            <CategoryLink
                              node={group}
                              className="block font-body text-caption font-medium uppercase tracking-label text-ink/60"
                            />
                            <ul className="mt-3 space-y-2">
                              {group.children.map((leaf) => (
                                <li key={leaf.slug}>
                                  <CategoryLink node={leaf} className="font-body text-sm text-ink/80 hover:text-rose-deep" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="flex max-h-[28rem] flex-wrap gap-x-10 gap-y-2 overflow-y-auto">
                        {item.children.map((leaf) => (
                          <li key={leaf.slug} className="w-40">
                            <CategoryLink node={leaf} className="font-body text-sm text-ink/80 hover:text-rose-deep" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
