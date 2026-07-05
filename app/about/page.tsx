import type { Metadata } from "next";
import Image from "next/image";
import { FacetedFrame } from "@/components/faceted-frame";
import { StorefrontArt, PerfumeBottleArt, GiftSetArt, LipstickArt } from "@/components/placeholder-art";
import { ValueRow } from "@/components/value-row";
import { VisitUsSection } from "@/components/visit-us-section";
import { AG_IMAGES } from "@/lib/images";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story | AG Liquidation Perfume & Cosmetics",
  description: "Authentic beauty, honest prices. Learn about AG Liquidation's Georgetown store.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pb-16 pt-32 md:pt-40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-[45%_55%] md:items-center lg:px-10">
          {/* TODO: replace with real storefront/interior photography from the client - using brand product photography as a stand-in for now */}
          <FacetedFrame className="bg-gradient-to-br from-gold-start/15 to-gold-end/25">
            <Image
              src={AG_IMAGES[1].src}
              alt={AG_IMAGES[1].alt}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-contain p-10"
            />
          </FacetedFrame>
          <h1 className="font-display text-h1 font-medium text-ink">
            Real Brands. Real Savings. Real Georgetown.
          </h1>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2 lg:px-10">
          <p className="font-display text-2xl italic font-medium text-ink">
            &ldquo;Luxury shouldn&apos;t be locked behind a velvet rope - it should be something you can pick
            up on a Tuesday.&rdquo;
          </p>
          <p className="font-body text-body text-ink/75">
            AG Liquidation Perfume &amp; Cosmetics brings authentic, brand-name beauty to
            Georgetown at prices that make sense. We source directly from official distributors so
            every bottle and palette on our shelves is the real thing - just without the markup you&apos;d
            pay at the mall.{" "}
            {/* TODO: replace this draft with the client's real founding story once available */}
          </p>
        </div>
      </section>

      {/* Our values */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <ValueRow
            Art={PerfumeBottleArt}
            image={AG_IMAGES[0]}
            title="Authenticity"
            body="Every product verified and sourced properly, direct from official distributors - never gray-market, never guesswork."
          />
          <ValueRow
            Art={GiftSetArt}
            image={AG_IMAGES[4]}
            title="Accessibility"
            body="Beauty for every age, every budget - luxury made everyday, not reserved for special occasions."
            reverse
          />
          <ValueRow
            Art={LipstickArt}
            image={AG_IMAGES[2]}
            title="Self-Expression"
            body="Pieces that help you look and feel like yourself, from routine days to special occasions."
          />
          <ValueRow
            Art={StorefrontArt}
            image={AG_IMAGES[3]}
            title="Community"
            body="A local, personal shopping experience, not a warehouse aisle - our team gets to know what you love."
            reverse
          />
        </div>
      </section>

      <VisitUsSection compact />
    </>
  );
}
