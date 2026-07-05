import { MapEmbed } from "./map-embed";
import { Button } from "./button";
import { SectionHeading } from "./section-heading";
import { BUSINESS } from "@/lib/site";

export function VisitUsSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "py-16" : "py-24"}>
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {!compact && <SectionHeading eyebrow="Come See Us" title="Visit Us in Georgetown" align="left" className="mb-12" />}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <MapEmbed />
          <div>
            <p className="font-display text-xl font-medium text-ink">
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
            </p>
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
            <Button href={BUSINESS.mapsUrl} external className="mt-8 inline-block">
              Get Directions →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
