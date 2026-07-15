import Link from "next/link";
import { FoilSweep } from "./foil-sweep";

interface BrandStripProps {
  vendors: string[];
  className?: string;
}

// No logo assets exist anywhere in the schema (Product.vendor is a plain
// string) - a typographic wordmark row is the honest option here, not a
// row of placeholder logo boxes.
export function BrandStrip({ vendors, className = "" }: BrandStripProps) {
  if (vendors.length === 0) return null;

  return (
    <div className={`flex gap-10 overflow-x-auto pb-2 ${className}`}>
      {vendors.map((vendor) => (
        <FoilSweep key={vendor} className="shrink-0">
          <Link
            href={`/products?brand=${encodeURIComponent(vendor)}`}
            className="font-display text-lg font-medium text-ink/70 transition-colors hover:text-rose-deep"
          >
            {vendor}
          </Link>
        </FoilSweep>
      ))}
    </div>
  );
}
