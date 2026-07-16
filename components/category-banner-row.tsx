import Image from "next/image";
import Link from "next/link";
import { FoilSweep } from "@/components/foil-sweep";
import type { SiteImage } from "@/lib/images";

interface BannerTile {
  name: string;
  image: SiteImage;
  href: string;
}

interface CategoryBannerRowProps {
  tiles: BannerTile[];
}

export function CategoryBannerRow({ tiles }: CategoryBannerRowProps) {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 md:grid-cols-3 lg:px-10">
        {tiles.map((tile) => (
          <FoilSweep key={tile.name} className="block w-full">
            <Link href={tile.href} className="group relative block h-[22rem] overflow-hidden bg-ink">
              <Image
                src={tile.image.src}
                alt={tile.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute bottom-6 left-6 font-display text-h3 font-medium text-cream">{tile.name}</span>
            </Link>
          </FoilSweep>
        ))}
      </div>
    </section>
  );
}
