import Image from "next/image";
import type { SiteImage } from "@/lib/images";

interface ValueRowProps {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  title: string;
  body: string;
  reverse?: boolean;
}

export function ValueRow({ Art, image, title, body, reverse }: ValueRowProps) {
  return (
    <div
      className={`grid grid-cols-1 items-center gap-10 py-12 md:grid-cols-2 md:gap-16 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-gold-start/15 to-gold-end/25 clip-facet md:h-72">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-cover" />
        ) : (
          <Art className="h-32 w-32" />
        )}
      </div>
      <div>
        <h3 className="font-display text-h3 font-medium text-ink">{title}</h3>
        <p className="mt-4 font-body text-body text-ink/70">{body}</p>
      </div>
    </div>
  );
}
