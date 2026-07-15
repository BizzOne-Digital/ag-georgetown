import { getMegaMenu } from "@/lib/repositories/category.repository";
import { MegaMenu } from "@/components/catalog/mega-menu";

// This layout calls the database directly (getMegaMenu below), so it needs
// the same build-time opt-out as its child pages - see
// app/products/[slug]/page.tsx for the full explanation.
export const dynamic = "force-dynamic";

// Scoped to /products and /products/[slug] only - the mega-menu / functional
// storefront treatment doesn't apply to the rest of the site (home, about,
// offers, contact keep their existing editorial design untouched).
export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const megaMenu = await getMegaMenu();

  return (
    <>
      {/* Navbar is `fixed top-9 h-20 z-50` (see components/navbar.tsx), and
          PromoBar above it is `fixed top-0 h-9 z-[60]` - without this offset
          the mega-menu renders underneath both at y=0, which hides it
          visually and lets their higher z-index intercept every hover/click
          before it reaches the mega-menu's trigger elements. */}
      <div className="mt-[7.25rem]">
        <MegaMenu items={megaMenu} />
      </div>
      {children}
    </>
  );
}
