import Link from "next/link";

// Deliberately plain/functional - this doesn't need to match the
// customer-facing brand design (Fraunces/gold-gradient/foil-sweep), it's a
// staff-only internal tool. Note: it still inherits the storefront
// Navbar/PromoBar/Footer from the root layout (app/layout.tsx) - Next's App
// Router only allows one root <html>/<body>, so fully opting out would mean
// moving every existing page into a route group, which is disproportionate
// scope for this deliberately minimal admin panel. The plain bar below
// makes it visually clear you're in a different, internal-only area.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar is `fixed top-9 h-20 z-50` (see components/navbar.tsx), and
          PromoBar above it is `fixed top-0 h-9 z-[60]` - without this offset
          this bar renders underneath both at y=0, the same mega-menu-offset
          bug app/products/layout.tsx already documents. */}
      <div className="mt-[7.25rem] border-b border-gray-300 bg-gray-100 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-6">
          <span className="font-mono text-sm font-bold uppercase tracking-wide text-gray-700">AG Admin</span>
          <nav className="flex gap-4 font-mono text-sm">
            <Link href="/admin/orders" className="text-gray-700 underline hover:text-black">
              Orders
            </Link>
            <Link href="/admin/products" className="text-gray-700 underline hover:text-black">
              Inventory
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </div>
  );
}
