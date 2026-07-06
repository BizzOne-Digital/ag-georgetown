import { Monogram } from "./monogram";

function CheckIcon() {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10" fill="none" aria-hidden="true">
      <path
        d="M14 32 Q22 40 26 44 Q36 26 48 16"
        stroke="url(#redeem-check-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="redeem-check-gradient" x1="14" y1="16" x2="48" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C9A227" />
          <stop offset="1" stopColor="#F0D98C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RedeemBand() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 lg:px-10">
        <div>
          <span className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">
            No Codes, No Catch
          </span>
          <p className="mt-4 font-body text-body text-ink/75">
            Every deal on this page is live in-store, right now. No coupon codes, no online cart,
            no fine-print gymnastics. Just walk in and ask.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 md:justify-start">
          <Monogram className="h-16 w-16" variant="gold" />
          <CheckIcon />
        </div>
      </div>
    </section>
  );
}
