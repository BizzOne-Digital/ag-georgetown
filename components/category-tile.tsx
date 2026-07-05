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
}

export function CategoryTile({ Art, image, name, description, href, offset = "none" }: CategoryTileProps) {
  const offsetClass =
    offset === "up" ? "md:-translate-y-8" : offset === "down" ? "md:translate-y-8" : "";

  return (
    <div className={`transition-transform ${offsetClass}`}>
      <FoilSweep className="block w-full">
        <Link
          href={href}
          className="group flex flex-col bg-gradient-to-br from-gold-start/15 to-gold-end/25 p-8"
        >
          <div className="relative flex h-48 items-center justify-center">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <Art className="h-40 w-40 transition-transform duration-500 group-hover:scale-105" />
            )}
          </div>
          <h3 className="mt-6 font-display text-h3 font-medium text-ink">{name}</h3>
          <p className="mt-2 font-body text-sm text-ink/70">{description}</p>
          <span className="mt-4 font-body text-sm font-medium text-rose-deep">Explore →</span>
        </Link>
      </FoilSweep>
    </div>
  );
}
