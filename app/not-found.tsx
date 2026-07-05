import { MonogramWatermark } from "@/components/monogram";
import { Button } from "@/components/button";
import { FacetedFrame } from "@/components/faceted-frame";
import { PerfumeBottleArt } from "@/components/placeholder-art";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-24">
      <MonogramWatermark className="absolute -right-20 top-10 h-96 w-96" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 lg:px-10">
        <div>
          <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
            404
          </span>
          <h1 className="mt-4 font-display text-h1 font-medium text-ink">This Page Wandered Off</h1>
          <p className="mt-6 max-w-md font-body text-body text-ink/70">
            Even our best-sellers don&apos;t stay in one place for long. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/">Back to Home</Button>
            <Button href="/products" variant="ghost">Shop Products</Button>
          </div>
        </div>
        <FacetedFrame className="mx-auto max-w-sm bg-gradient-to-br from-gold-start/15 to-gold-end/25">
          <div className="flex h-full items-center justify-center p-12">
            <PerfumeBottleArt className="h-full w-full" />
          </div>
        </FacetedFrame>
      </div>
    </section>
  );
}
