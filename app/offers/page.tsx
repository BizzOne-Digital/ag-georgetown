import type { Metadata } from "next";
import { PromotionCard } from "@/components/promotion-card";
import { BundleCard } from "@/components/bundle-card";
import { EmailCapture } from "@/components/email-capture";
import { RedeemBand } from "@/components/redeem-band";
import { SectionHeading } from "@/components/section-heading";
import { ScrollReveal, RevealItem } from "@/components/scroll-reveal";
import { Button } from "@/components/button";
import { PerfumeBottleArt, LipstickArt, SkincareJarArt, GiftSetArt } from "@/components/placeholder-art";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Current Deals & Bundle Offers | AG Liquidation Georgetown",
  description:
    "Seasonal sales, bundle deals, and limited-time offers on perfumes and cosmetics in Georgetown, ON.",
  alternates: { canonical: `${SITE_URL}/offers` },
};

export default function OffersPage() {
  return (
    <>
      <section className="pb-16 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="font-display text-h1 font-medium text-ink">
            Deals This Good Don&apos;t Last.
          </h1>
          <p className="mt-6 font-body text-body text-ink/70">
            Seasonal sales, bundle deals, and limited-time drops - updated regularly.
          </p>
        </div>
      </section>

      <RedeemBand />

      {/* Current Promotions */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <SectionHeading eyebrow="Right Now" title="Current Promotions" className="mb-14" />
          <ScrollReveal className="grid grid-cols-1 gap-8 lg:grid-cols-2" stagger={0.1}>
            <RevealItem>
              <PromotionCard
                Art={PerfumeBottleArt}
                title="Designer Fragrance Clearance"
                description="Select men's & women's fragrances up to 70% off original retail."
                endsLabel="July 31"
                badge="70% Off"
              />
            </RevealItem>
            <RevealItem>
              <PromotionCard
                Art={LipstickArt}
                title="Makeup From $5"
                description="A rotating selection of everyday makeup essentials, marked down weekly."
                endsLabel="This Sunday"
                badge="From $5"
              />
            </RevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* Bundle Deals */}
      <section className="bg-black py-20 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Bundle & Save" title="Bundle Deals" className="mb-14 [&_h2]:text-cream" />
          <ScrollReveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <RevealItem>
              <BundleCard
                Art={GiftSetArt}
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
                name="Glam Essentials Kit"
                contents="Lipstick + Lip Liner + Mini Mirror"
                price="$19.99"
                originalPrice="$34.99"
                badge="45% Off"
              />
            </RevealItem>
            <RevealItem>
              <BundleCard
                Art={SkincareJarArt}
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

      {/* Seasonal spotlight */}
      {/* TODO: swap seasonal imagery/copy quarterly */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-start/25 to-gold-end/40 py-24 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
            Summer Spotlight
          </span>
          <h2 className="mt-4 font-display text-h2 font-medium text-ink">
            Light Scents & Sun-Ready Skincare
          </h2>
          <p className="mt-4 font-body text-body text-ink/70">
            Warm-weather favorites - fresh fragrances, SPF-friendly formulas, and gift sets perfect
            for summer get-togethers.
          </p>
          <Button href="/contact" className="mt-8 inline-block">
            Visit the Store
          </Button>
        </div>
      </section>

      {/* Email capture */}
      <section className="border-y-[3px] border-transparent bg-cream py-16 [border-image:linear-gradient(135deg,var(--color-gold-start),var(--color-gold-end))_1]">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <h3 className="font-display text-h3 font-medium text-ink">
            Get Deals Before They Sell Out
          </h3>
          <p className="font-body text-sm text-ink/70">
            Join our list for first access to new drops and bundle offers.
          </p>
          <EmailCapture />
        </div>
      </section>

      <p className="px-6 py-8 text-center font-body text-xs text-ink/40">
        While supplies last. Prices subject to change. See in-store for full terms.
      </p>
    </>
  );
}
