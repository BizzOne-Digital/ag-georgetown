import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { MapEmbed } from "@/components/map-embed";
import { Button } from "@/components/button";
import { MonogramWatermark } from "@/components/monogram";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Visit Us | AG Liquidation Georgetown",
  description: "Find our Georgetown store - address, hours, directions, and contact form.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <section className="pb-12 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <h1 className="font-display text-h1 font-medium text-ink">Come Say Hello</h1>
          <p className="mt-6 font-body text-body text-ink/70">
            {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.region}{" "}
            {BUSINESS.address.postalCode}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 md:grid-cols-2 lg:px-10">
          <ContactForm />

          <div className="flex flex-col gap-8">
            <MapEmbed />
            <div>
              <p className="font-display text-lg font-medium text-ink">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
              </p>
              <a
                href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}
                className="mt-3 inline-block font-body text-sm font-medium text-rose-deep hover:text-rose"
              >
                {BUSINESS.phone}
              </a>
              <table className="mt-6 font-body text-sm text-ink/80">
                <tbody>
                  {BUSINESS.hours.map((h) => (
                    <tr key={h.days}>
                      <td className="pr-4 py-1 align-top font-medium">{h.days}</td>
                      <td className="py-1">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 font-body text-xs text-ink/50">
                {/* TODO: confirm real store hours with client */}
                Hours shown are placeholders pending confirmation.
              </p>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-body text-sm font-medium text-ink/70 hover:text-rose-deep"
              >
                {BUSINESS.instagramHandle} on Instagram →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 text-center text-cream">
        <MonogramWatermark className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" />
        <div className="relative mx-auto max-w-xl px-6">
          <h2 className="font-display text-h3 font-medium">Ready to visit?</h2>
          <Button href={BUSINESS.mapsUrl} external className="mt-6 inline-block">
            Get Directions →
          </Button>
        </div>
      </section>
    </>
  );
}
