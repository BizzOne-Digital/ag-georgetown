import type { Metadata } from "next";
import { HeroCarousel } from "@/components/hero-carousel";
import { OffersMarquee } from "@/components/offers-marquee";
import { CategoryTile } from "@/components/category-tile";
import { WhyAGSection } from "@/components/why-ag-section";
import { BundleCard } from "@/components/bundle-card";
import { BestSellerCard } from "@/components/best-seller-card";
import { ScrollSnapRow } from "@/components/scroll-snap-row";
import { HowItWorks } from "@/components/how-it-works";
import { Accordion } from "@/components/accordion";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { InstagramTeaser } from "@/components/instagram-teaser";
import { VisitUsSection } from "@/components/visit-us-section";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/button";
import { ScrollReveal, RevealItem } from "@/components/scroll-reveal";
import { MonogramWatermark } from "@/components/monogram";
import { ParallaxWatermark } from "@/components/parallax-watermark";
import { PerfumeBottleArt, LipstickArt, SkincareJarArt, GiftSetArt } from "@/components/placeholder-art";
import {
  FRAGRANCE_CATEGORY_TILE,
  MAKEUP_CATEGORY_TILE,
  SKINCARE_CATEGORY_TILE,
  FRAGRANCE_BUNDLE,
  MAKEUP_BUNDLE,
  SKINCARE_BUNDLE,
} from "@/lib/images";
import { BEST_SELLERS } from "@/lib/best-sellers";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AG Liquidation Perfume & Cosmetics | Georgetown, ON",
  description:
    "Authentic designer fragrances, makeup & skincare at liquidation prices. Visit our Georgetown store today.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "AG Liquidation Perfume & Cosmetics | Georgetown, ON",
    description:
      "Authentic designer fragrances, makeup & skincare at liquidation prices. Visit our Georgetown store today.",
    url: SITE_URL,
    images: ["/opengraph-image"],
  },
};

const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 4);

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
        <ParallaxWatermark className="absolute -left-24 top-10 h-[28rem] w-[28rem]">
          <MonogramWatermark className="h-full w-full rotate-[-6deg]" />
        </ParallaxWatermark>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-[55%_45%] md:items-center lg:px-10">
          <div>
            <p className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
              Georgetown&apos;s Destination for Authentic Beauty
            </p>
            <h1 className="mt-4 font-display text-h1 font-medium text-ink">
              Luxury Fragrance &amp; Cosmetics. Liquidation Prices.
            </h1>
            <p className="mt-6 max-w-xl font-body text-body text-ink/75">
              Authentic, brand-name perfumes, makeup, and skincare for everyday use and special
              occasions - at prices that make affordable luxury real.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/offers">Shop the Deals →</Button>
              <Button href="/contact" variant="ghost">Get Directions</Button>
            </div>
          </div>
          <HeroCarousel />
        </div>
      </section>

      <OffersMarquee />

      {/* Category showcase */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Browse" title="Shop by Category" />
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            <CategoryTile
              Art={PerfumeBottleArt}
              image={FRAGRANCE_CATEGORY_TILE}
              name="Fragrance"
              description="Designer scents for him & her - Dior, Gucci, Versace and more"
              href="/products#fragrances"
              offset="up"
            />
            <CategoryTile
              Art={LipstickArt}
              image={MAKEUP_CATEGORY_TILE}
              name="Makeup"
              description="Everyday essentials to full-glam, at prices that don't compromise"
              href="/products#makeup"
              offset="down"
            />
            <CategoryTile
              Art={SkincareJarArt}
              image={SKINCARE_CATEGORY_TILE}
              name="Skincare"
              description="Trusted formulas for every skin type and concern"
              href="/products#skincare"
              offset="up"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Fan Favorites" title="What Georgetown Keeps Coming Back For" align="left" />
        </div>
        <div className="mx-auto mt-14 max-w-7xl px-6 lg:px-10">
          <ScrollSnapRow>
            {BEST_SELLERS.map((item) => (
              <BestSellerCard key={`${item.brand}-${item.name}`} item={item} />
            ))}
          </ScrollSnapRow>
        </div>
      </section>

      <WhyAGSection />

      {/* Featured bundles */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Limited Time" title="This Week's Bundle Deals" />
          <ScrollReveal className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <RevealItem className="md:mt-0">
              <BundleCard
                Art={GiftSetArt}
                image={FRAGRANCE_BUNDLE}
                name="Signature Scent Duo"
                contents="1 Designer Perfume + 1 Travel Spray"
                price="$39.99"
                originalPrice="$79.99"
                badge="Bundle"
              />
            </RevealItem>
            <RevealItem className="md:mt-10">
              <BundleCard
                Art={LipstickArt}
                image={MAKEUP_BUNDLE}
                name="Glam Essentials Kit"
                contents="Lipstick + Lip Liner + Mini Mirror"
                price="$19.99"
                originalPrice="$34.99"
                badge="45% Off"
              />
            </RevealItem>
            <RevealItem className="md:mt-0">
              <BundleCard
                Art={SkincareJarArt}
                image={SKINCARE_BUNDLE}
                name="Hydration Gift Set"
                contents="Moisturizer + Serum + Gift Box"
                price="$29.99"
                originalPrice="$52.99"
                badge="New"
              />
            </RevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <SectionHeading eyebrow="Simple by Design" title="How It Works" className="mb-16" />
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-cream to-gold-end/10 py-24">
        <SectionHeading title="Georgetown Loves AG" className="mb-10" />
        <TestimonialCarousel />
      </section>

      <InstagramTeaser />

      {/* FAQ Preview */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-10">
          <SectionHeading title="Good to Know" className="mb-12" />
          <Accordion items={HOME_FAQ_ITEMS} idPrefix="home-faq" />
        </div>
      </section>

      <VisitUsSection />
    </>
  );
}
