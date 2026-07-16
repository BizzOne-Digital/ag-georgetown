"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlist";
import { PriceTag } from "@/components/catalog/price-tag";
import { Button } from "@/components/button";

export default function WishlistPage() {
  const hasHydrated = useWishlistStore((s) => s.hasHydrated);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 md:pt-48 lg:px-10">
        <p className="font-body text-sm text-ink/50">Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center md:pt-48 lg:px-10">
        <h1 className="font-display text-h2 font-medium text-ink">Your Wishlist is Empty</h1>
        <p className="mt-4 font-body text-body text-ink/70">
          Tap the heart on any product to save it here for later.
        </p>
        <Button href="/products" className="mt-8 inline-block">
          Shop All Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-40 md:pt-48 lg:px-10">
      <h1 className="font-display text-h2 font-medium text-ink">Your Wishlist</h1>

      <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 py-6">
            <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 bg-cream">
              {item.imageSrc ? (
                <Image src={item.imageSrc} alt={item.title} fill sizes="96px" className="object-contain p-2" />
              ) : null}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                {item.vendor && (
                  <p className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">{item.vendor}</p>
                )}
                <Link href={`/products/${item.slug}`} className="font-display text-base font-medium text-ink hover:underline">
                  {item.title}
                </Link>
                <div className="mt-1">
                  <PriceTag price={item.price} compareAtPrice={item.compareAtPrice} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(item.productId)}
                className="w-fit font-body text-xs text-ink/50 underline-offset-2 hover:text-rose-deep hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <Button href="/products">Continue Shopping</Button>
      </div>
    </div>
  );
}
