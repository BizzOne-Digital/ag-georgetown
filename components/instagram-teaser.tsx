import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { BUSINESS } from "@/lib/site";
import { INSTAGRAM_IMAGES } from "@/lib/images";

// TODO: replace these curated shots with a real Instagram feed embed/API once
// the client confirms API access for @agcosmeticsgeorgetown.
export function InstagramTeaser() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading eyebrow="Follow Along" title={`Follow ${BUSINESS.instagramHandle}`} />

        <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
          {INSTAGRAM_IMAGES.map((image) => (
            <div
              key={image.src}
              className="relative h-40 w-40 shrink-0 overflow-hidden bg-gradient-to-br from-gold-start/20 to-gold-end/30"
            >
              <Image src={image.src} alt={image.alt} fill sizes="160px" className="object-contain p-2" />
            </div>
          ))}
        </div>

        <a
          href={BUSINESS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 font-body text-sm font-medium text-rose-deep hover:text-rose"
        >
          View on Instagram →
        </a>
      </div>
    </section>
  );
}
