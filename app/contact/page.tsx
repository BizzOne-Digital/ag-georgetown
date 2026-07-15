import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { MapEmbed } from "@/components/map-embed";
import { Accordion } from "@/components/accordion";
import { SectionHeading } from "@/components/section-heading";
import { BUSINESS, SITE_URL } from "@/lib/site";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Visit Us | AG Liquidation Georgetown",
  description: "Find our Georgetown store - address, hours, directions, and contact form.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <section className="pb-12 pt-40 md:pt-48">
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

      <section className="py-16">
        <div className="mx-auto max-w-[700px] px-6 lg:px-10">
          <SectionHeading title="Common Questions" className="mb-12" />
          <Accordion items={FAQ_ITEMS} idPrefix="contact-faq" />
        </div>
      </section>
    </>
  );
}
