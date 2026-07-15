"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectSubtotal } from "@/lib/store/cart";
import { formatPrice } from "@/components/catalog/price-tag";
import { Button } from "@/components/button";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CartPage() {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(selectSubtotal);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(() => isValidEmail(email), [email]);

  async function handleCheckout() {
    setError(null);
    if (!emailValid) {
      setError("Enter a valid email to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lines: lines.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong starting checkout.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong starting checkout.");
      setSubmitting(false);
    }
  }

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 md:pt-48 lg:px-10">
        <p className="font-body text-sm text-ink/50">Loading your cart...</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center md:pt-48 lg:px-10">
        <h1 className="font-display text-h2 font-medium text-ink">Your Cart is Empty</h1>
        <p className="mt-4 font-body text-body text-ink/70">Browse the catalog to find something you&apos;ll love.</p>
        <Button href="/products" className="mt-8 inline-block">
          Shop All Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 md:pt-48 lg:px-10">
      <h1 className="font-display text-h2 font-medium text-ink">Your Cart</h1>

      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {lines.map((line) => (
          <div key={line.key} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 shrink-0 bg-cream">
              {line.imageSrc ? (
                <Image src={line.imageSrc} alt={line.title} fill sizes="96px" className="object-contain p-2" />
              ) : null}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h2 className="font-display text-base font-medium text-ink">{line.title}</h2>
                {line.variantTitle && <p className="font-body text-sm text-ink/60">{line.variantTitle}</p>}
                <p className="mt-1 font-body text-sm text-ink">{formatPrice(line.unitPrice)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border-[1.5px] border-ink/15">
                  <button
                    type="button"
                    onClick={() => setQuantity(line.key, line.quantity - 1)}
                    className="px-3 py-1.5 font-body text-lg text-ink/70 hover:bg-cream"
                    aria-label={`Decrease quantity of ${line.title}`}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center font-body text-sm text-ink">{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(line.key, line.maxQuantity != null ? Math.min(line.quantity + 1, line.maxQuantity) : line.quantity + 1)
                    }
                    className="px-3 py-1.5 font-body text-lg text-ink/70 hover:bg-cream"
                    aria-label={`Increase quantity of ${line.title}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.key)}
                  className="font-body text-xs text-ink/50 underline-offset-2 hover:text-rose-deep hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="font-body text-sm font-medium text-ink">{formatPrice(line.unitPrice * line.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-6">
        <div className="flex items-center gap-4 font-body text-lg text-ink">
          <span className="text-ink/60">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="w-full max-w-sm">
          <label className="block font-body text-caption font-medium uppercase tracking-label text-ink/70" htmlFor="checkout-email">
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full border-[1.5px] border-ink/15 bg-cream px-3 py-2.5 font-body text-sm text-ink focus:border-rose-deep focus:outline-none"
          />
          {error && <p className="mt-2 font-body text-xs text-error">{error}</p>}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!emailValid || submitting}
            className="mt-4 w-full bg-rose px-8 py-3.5 font-body text-sm font-medium tracking-[0.02em] text-cream transition-colors duration-300 hover:bg-rose-deep disabled:cursor-not-allowed disabled:bg-ink/20"
          >
            {submitting ? "Redirecting to checkout..." : "Proceed to Checkout"}
          </button>
          <p className="mt-3 text-center font-body text-xs text-ink/50">
            Checkout is pickup-only for now - orders are ready for pickup at{" "}
            <Link href="/contact" className="underline hover:text-rose-deep">
              our Georgetown store
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
