import type { Metadata } from "next";
import { BannerHero } from "@/components/banner-hero";
import { StorefrontArt, PerfumeBottleArt, GiftSetArt, LipstickArt } from "@/components/placeholder-art";
import { ValueRow } from "@/components/value-row";
import { MilestonesTimeline } from "@/components/milestones-timeline";
import { SectionHeading } from "@/components/section-heading";
import { VisitUsSection } from "@/components/visit-us-section";
import {
  AG_ABOUT_HERO,
  AG_ABOUT_AUTHENTICITY,
  SKINCARE_ABOUT_ACCESSIBILITY,
  MAKEUP_ABOUT_SELF_EXPRESSION,
  FRAGRANCE_ABOUT_COMMUNITY,
} from "@/lib/images";
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
      {/* TODO: replace with real storefront/interior photography from the client - using brand product photography as a stand-in for now */}
      <BannerHero title="Real Brands. Real Savings. Real Georgetown." image={AG_ABOUT_HERO} />

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

      {/* Milestones */}
      <section className="bg-cream py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <SectionHeading eyebrow="Our Journey" title="Milestones" className="mb-16" />
          {/* TODO: placeholder milestones - confirm real dates/details with the client before launch */}
          <MilestonesTimeline />
        </div>
      </section>

      {/* Our values */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <ValueRow
            Art={PerfumeBottleArt}
            image={AG_ABOUT_AUTHENTICITY}
            title="Authenticity"
            body="Every product verified and sourced properly, direct from official distributors - never gray-market, never guesswork."
          />
          <ValueRow
            Art={GiftSetArt}
            image={SKINCARE_ABOUT_ACCESSIBILITY}
            title="Accessibility"
            body="Beauty for every age, every budget - luxury made everyday, not reserved for special occasions."
            reverse
          />
          <ValueRow
            Art={LipstickArt}
            image={MAKEUP_ABOUT_SELF_EXPRESSION}
            title="Self-Expression"
            body="Pieces that help you look and feel like yourself, from routine days to special occasions."
          />
          <ValueRow
            Art={StorefrontArt}
            image={FRAGRANCE_ABOUT_COMMUNITY}
            title="Community"
            body="A local, personal shopping experience, not a warehouse aisle - our team gets to know what you love."
            reverse
          />
        </div>
      </section>

      {/* In the Neighborhood */}
      <section className="bg-cream py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-h3 font-medium text-ink">In the Neighborhood</h2>
          <p className="mt-4 font-body text-body text-ink/75">
            Proud to be part of the Georgetown community, right on Guelph St. Stop by, say hello,
            and let us help you find something that makes you feel like yourself.
          </p>
        </div>
      </section>

      <VisitUsSection compact />
    </>
  );
}
