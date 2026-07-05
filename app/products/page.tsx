import type { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { ProductTile } from "@/components/product-tile";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/button";
import { MonogramWatermark } from "@/components/monogram";
import { GiftSetArt } from "@/components/placeholder-art";
import { SITE_URL } from "@/lib/site";
import {
  FRAGRANCES_FOR_HER,
  FRAGRANCES_FOR_HIM,
  MAKEUP_FACE,
  MAKEUP_EYES,
  MAKEUP_LIPS,
  MAKEUP_NAILS,
  SKINCARE_HYDRATION,
  SKINCARE_ANTI_AGING,
  SKINCARE_ACNE,
  SKINCARE_BRIGHTENING,
  ACCESSORIES,
  type ProductItem,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Fragrances, Makeup & Skincare | AG Liquidation Georgetown",
  description:
    "Browse our full collection of authentic perfumes, cosmetics, and self-care essentials - in-store in Georgetown.",
  alternates: { canonical: `${SITE_URL}/products` },
};

function TileGrid({ items }: { items: ProductItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 [&>*:nth-child(even)]:md:translate-y-6">
      {items.map((item) => (
        <ProductTile key={`${item.brand}-${item.name}`} {...item} />
      ))}
    </div>
  );
}

function SubGroup({ label, items }: { label: string; items: ProductItem[] }) {
  return (
    <div>
      <span className="inline-block bg-black px-4 py-1.5 font-body text-caption font-medium uppercase tracking-label text-gold-end">
        {label}
      </span>
      <div className="mt-6">
        <TileGrid items={items} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-start/15 to-gold-end/25 pb-16 pt-32 md:pt-40">
        <MonogramWatermark className="absolute -right-16 -top-16 h-80 w-80" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 text-center lg:px-10">
          <div className="flex h-40 w-40 items-center justify-center clip-facet bg-cream/60">
            <GiftSetArt className="h-28 w-28" />
          </div>
          <h1 className="font-display text-h1 font-medium text-ink">Explore Our Collection</h1>
          <p className="max-w-xl font-body text-body text-ink/70">
            Authentic fragrances, cosmetics, and self-care - all in one place in Georgetown.
          </p>
        </div>
      </section>

      <CategoryTabs />

      {/* Fragrances */}
      <section id="fragrances" className="scroll-mt-36 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Fragrances" title="For Her & For Him" align="left" className="mb-12" />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <SubGroup label="For Her" items={FRAGRANCES_FOR_HER} />
            <SubGroup label="For Him" items={FRAGRANCES_FOR_HIM} />
          </div>
        </div>
      </section>

      {/* Makeup */}
      <section id="makeup" className="scroll-mt-36 bg-black py-20 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Makeup" title="Face, Eyes, Lips & Nails" align="left" className="mb-12 [&_h2]:text-cream" />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <SubGroup label="Face" items={MAKEUP_FACE} />
            <SubGroup label="Eyes" items={MAKEUP_EYES} />
            <SubGroup label="Lips" items={MAKEUP_LIPS} />
            <SubGroup label="Nails" items={MAKEUP_NAILS} />
          </div>
        </div>
      </section>

      {/* Skincare */}
      <section id="skincare" className="scroll-mt-36 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Skincare" title="Shop by Concern" align="left" className="mb-12" />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <SubGroup label="Hydration" items={SKINCARE_HYDRATION} />
            <SubGroup label="Anti-Aging" items={SKINCARE_ANTI_AGING} />
            <SubGroup label="Acne-Prone" items={SKINCARE_ACNE} />
            <SubGroup label="Brightening" items={SKINCARE_BRIGHTENING} />
          </div>
        </div>
      </section>

      {/* Accessories & Self-Care */}
      <section id="accessories" className="scroll-mt-36 bg-black py-20 text-cream">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Accessories" title="Accessories & Self-Care" align="left" className="mb-12 [&_h2]:text-cream" />
          <TileGrid items={ACCESSORIES} />
        </div>
      </section>

      {/* Bottom CTA band */}
      <section className="bg-rose py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-h3 font-medium text-cream">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-3 font-body text-sm text-cream/85">
            Come see our full in-store selection.
          </p>
          <Button href="/contact" variant="ghost" invert className="mt-6">
            Get Directions
          </Button>
        </div>
      </section>
    </>
  );
}
