import Image from "next/image";
import { Button } from "@/components/button";
import { ScrollReveal, RevealItem } from "@/components/scroll-reveal";
import type { SiteImage } from "@/lib/images";

interface PromoBannerProps {
  image: SiteImage;
}

// Single lightweight promotional module - a soft blush wash behind the copy
// (not a new color, just the existing rose token at low opacity) paired with
// a full-bleed flatlay on the other side, same fade-up used elsewhere
// (components/trust-badge-row.tsx) rather than anything new.
export function PromoBanner({ image }: PromoBannerProps) {
  return (
    <section className="bg-rose/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2">
        <ScrollReveal className="flex flex-col justify-center px-6 py-16 lg:px-16 lg:py-20">
          <RevealItem>
            <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
              Deals Worth Driving For
            </span>
            <h2 className="mt-3 font-display text-h2 font-medium text-ink">
              Georgetown&apos;s Best-Kept Beauty Secret.
            </h2>
            <p className="mt-4 max-w-md font-body text-sm text-ink/70">
              Come see why locals keep coming back for authentic brands at unbeatable prices.
            </p>
            <Button href="/offers" className="mt-8 inline-block">
              Explore Deals
            </Button>
          </RevealItem>
        </ScrollReveal>

        <div className="relative min-h-[20rem] md:min-h-[26rem]">
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
