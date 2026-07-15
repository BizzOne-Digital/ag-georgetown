import type { Metadata } from "next";
import { BannerHero } from "@/components/banner-hero";
import { OffersMarquee } from "@/components/offers-marquee";
import { CategoryTile } from "@/components/category-tile";
import { ProductRow } from "@/components/product-row";
import { BrandStrip } from "@/components/brand-strip";
import { TrustBadgeRow } from "@/components/trust-badge-row";
import { NewsletterBand } from "@/components/newsletter-band";
import { HowItWorks } from "@/components/how-it-works";
import { Accordion } from "@/components/accordion";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { InstagramTeaser } from "@/components/instagram-teaser";
import { VisitUsSection } from "@/components/visit-us-section";
import { SectionHeading } from "@/components/section-heading";
import { PerfumeBottleArt, LipstickArt, SkincareJarArt } from "@/components/placeholder-art";
import { AG_HERO_1, FRAGRANCE_CATEGORY_TILE, MAKEUP_CATEGORY_TILE, SKINCARE_CATEGORY_TILE } from "@/lib/images";
import { getBestSellingProducts, getBundleProducts, getTopVendors } from "@/lib/repositories/product.repository";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE_URL } from "@/lib/site";

// Forces per-request rendering instead of a build-time prerender attempt,
// which would call connectToDatabase() for real and fail the whole build if
// MONGODB_URI isn't configured in that environment yet (see
// app/products/[slug]/page.tsx for the full explanation).
export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const [bestSellers, bundles, vendors] = await Promise.all([
    getBestSellingProducts(12),
    getBundleProducts(12),
    getTopVendors(16),
  ]);

  return (
    <>
      <BannerHero
        eyebrow="Georgetown's Destination for Authentic Beauty"
        title="Luxury Fragrance & Cosmetics. Liquidation Prices."
        subtitle="Authentic, brand-name perfumes, makeup, and skincare for everyday use and special occasions - at prices that make affordable luxury real."
        image={AG_HERO_1}
        primaryCta={{ href: "/offers", label: "Shop the Deals" }}
        secondaryCta={{ href: "/contact", label: "Get Directions" }}
      />

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
              href="/products?category=fragrance"
            />
            <CategoryTile
              Art={LipstickArt}
              image={MAKEUP_CATEGORY_TILE}
              name="Makeup"
              description="Everyday essentials to full-glam, at prices that don't compromise"
              href="/products?category=cosmetics"
            />
            <CategoryTile
              Art={SkincareJarArt}
              image={SKINCARE_CATEGORY_TILE}
              name="Skincare"
              description="Trusted formulas for every skin type and concern"
              href="/products?category=skincare"
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
          <ProductRow products={bestSellers} />
        </div>
      </section>

      {/* Brand strip */}
      <section className="border-y border-ink/10 py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Trusted Names" title="Brands We Carry" align="left" className="mb-8" />
          <BrandStrip vendors={vendors.map((v) => v.vendor)} />
        </div>
      </section>

      <TrustBadgeRow />

      {/* Bundle Deals */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Limited Time" title="This Week's Bundle Deals" />
        </div>
        <div className="mx-auto mt-14 max-w-7xl px-6 lg:px-10">
          <ProductRow products={bundles} />
        </div>
      </section>

      <NewsletterBand />

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
