import Image from "next/image";
import { Button } from "./button";
import { Monogram } from "./monogram";
import { ParallaxWatermark } from "./parallax-watermark";
import type { SiteImage } from "@/lib/images";

interface BannerHeroCta {
  href: string;
  label: string;
}

interface BannerHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: SiteImage;
  primaryCta?: BannerHeroCta;
  secondaryCta?: BannerHeroCta;
  className?: string;
}

// A single full-bleed banner, deliberately not a carousel - the simpler
// alternative to the old FacetedFrame+HeroCarousel hero. Always used as a
// page's first element, so it owns its own clearance for the fixed
// PromoBar+Navbar stack (7.25rem - see app/products/layout.tsx for the
// same offset and why) rather than relying on each call site to add it.
export function BannerHero({ eyebrow, title, subtitle, image, primaryCta, secondaryCta, className = "" }: BannerHeroProps) {
  return (
    <section
      className={`relative mt-[7.25rem] flex min-h-[32rem] items-center overflow-hidden bg-black md:min-h-[36rem] ${className}`}
    >
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" aria-hidden="true" />

      <ParallaxWatermark className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-20">
        <Monogram variant="cream" className="h-full w-full" />
      </ParallaxWatermark>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-xl">
          {eyebrow && (
            <span className="font-body text-caption font-medium uppercase tracking-label text-gold-end">{eyebrow}</span>
          )}
          <h1 className="mt-3 font-display text-h1 font-medium text-cream">{title}</h1>
          {subtitle && <p className="mt-4 font-body text-body text-cream/85">{subtitle}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && <Button href={primaryCta.href}>{primaryCta.label}</Button>}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="ghost" invert>
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
