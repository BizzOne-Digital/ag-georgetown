import Link from "next/link";
import Image from "next/image";
import { FoilSweep } from "./foil-sweep";
import type { SiteImage } from "@/lib/images";

interface CategoryTileProps {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  name: string;
  description: string;
  href: string;
  offset?: "up" | "down" | "none";
  productCount?: number;
}

export function CategoryTile({ Art, image, name, description, href, offset = "none", productCount }: CategoryTileProps) {
  const offsetClass = offset === "up" ? "md:-translate-y-8" : offset === "down" ? "md:translate-y-8" : "";

  return (
    <div className={`transition-transform ${offsetClass}`}>
      <FoilSweep className="block w-full">
        <Link
          href={href}
          className="group relative block p-[1.5px] transition-transform duration-300 hover:-translate-y-1"
        >
          {/* Gradient "border" via the classic padding trick (a gradient
              layer behind a slightly-inset content box) rather than
              animating border-image directly - border-image transitions
              are inconsistently supported across browsers. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-gold-start to-gold-end opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <div className="relative flex flex-col bg-gradient-to-br from-gold-start/15 to-gold-end/25 p-8 shadow-none transition-shadow duration-300 group-hover:shadow-lg">
            <div className="relative flex h-48 items-center justify-center bg-cream">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-contain p-2 transition-transform duration-[400ms] ease-out group-hover:scale-105"
                />
              ) : (
                <Art className="h-40 w-40 transition-transform duration-[400ms] ease-out group-hover:scale-105" />
              )}
            </div>

            <h3 className="mt-6 font-display text-[1.75rem] font-medium leading-tight text-ink">{name}</h3>
            {productCount !== undefined && (
              <span className="mt-1 font-body text-caption font-medium uppercase tracking-label text-ink/50">
                {productCount} Products
              </span>
            )}
            <p className="mt-2 font-body text-sm leading-snug text-ink/70">{description}</p>
            <span className="mt-4 inline-flex items-center gap-1 font-body text-sm font-medium text-rose-deep">
              Explore
              <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </Link>
      </FoilSweep>
    </div>
  );
}
