import Link from "next/link";
import { Monogram } from "./monogram";
import { BUSINESS, FOOTER_LINKS } from "@/lib/site";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-white/10 py-4 md:border-none md:py-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between font-body text-caption font-medium uppercase tracking-label text-gold-end md:cursor-default md:pointer-events-none">
        {title}
        <span className="md:hidden group-open:rotate-180 transition-transform">v</span>
      </summary>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </details>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-cream">
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10">
        <div className="h-px w-full bg-gold" />
        <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Monogram className="h-10 w-10" variant="gold" />
              <span className="font-display text-lg font-medium">AG Liquidation</span>
            </Link>
            <p className="mt-4 font-display italic text-sm text-cream/70">
              Authentic Beauty, Honest Prices.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="font-body text-sm text-cream/80 hover:text-gold-end">
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="Visit Us">
            <p className="font-body text-sm text-cream/80">
              {BUSINESS.address.street}
              <br />
              {BUSINESS.address.city}, {BUSINESS.address.region} {BUSINESS.address.postalCode}
            </p>
            <a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`} className="font-body text-sm text-cream/80 hover:text-gold-end">
              {BUSINESS.phone}
            </a>
            <table className="mt-2 font-body text-sm text-cream/70">
              <tbody>
                {BUSINESS.hours.map((h) => (
                  <tr key={h.days}>
                    <td className="pr-3 py-0.5 align-top">{h.days}</td>
                    <td className="py-0.5">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FooterColumn>

          <FooterColumn title="Follow">
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-cream/80 hover:text-gold-end"
            >
              {BUSINESS.instagramHandle}
            </a>
          </FooterColumn>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center font-body text-xs text-cream/50 md:flex-row md:text-left">
          <span>© {new Date().getFullYear()} AG Liquidation Perfume & Cosmetics - Georgetown</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold-end">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-end">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
