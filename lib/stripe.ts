import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var _stripeClient: Stripe | undefined;
}

function createClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local (or your host's env vars) before creating a Checkout Session.");
  }
  // `Stripe.DEFAULT_API_VERSION` exists at runtime (confirmed against the
  // installed stripe@22.3.1) but isn't in its TS types, so it can't be
  // referenced directly without an `any` cast. Pinning the exact value
  // instead - if `stripe` is ever upgraded, bump this to match the new
  // version's default deliberately, rather than silently drifting.
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia", typescript: true });
}

// Lazy on purpose: Next.js's build step imports every route module to
// collect page data, which would run a top-level `new Stripe(...)` even
// though no request is being handled and STRIPE_SECRET_KEY may not be
// configured in that environment yet (this broke a Vercel build - the
// import alone was enough to throw). Call getStripe() from inside a
// request handler, never at module scope.
export function getStripe(): Stripe {
  return global._stripeClient ?? (global._stripeClient = createClient());
}
