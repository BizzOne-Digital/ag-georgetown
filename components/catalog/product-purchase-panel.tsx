"use client";

import { useMemo, useState } from "react";
import { PriceTag } from "./price-tag";
import { useCartStore } from "@/lib/store/cart";
import type { IProductVariant } from "@/lib/models/Product";

interface ProductPurchasePanelProps {
  productId: string;
  title: string;
  imageSrc: string | null;
  basePrice: number | null;
  baseCompareAtPrice: number | null;
  baseStock: number | null;
  variants: IProductVariant[];
}

export function ProductPurchasePanel({
  productId,
  title,
  imageSrc,
  basePrice,
  baseCompareAtPrice,
  baseStock,
  variants,
}: ProductPurchasePanelProps) {
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState(hasVariants ? String(variants[0]._id) : "");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = useMemo(
    () => variants.find((v) => String(v._id) === selectedVariantId),
    [variants, selectedVariantId]
  );

  const price = selectedVariant ? selectedVariant.price : basePrice;
  const compareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : baseCompareAtPrice;
  const available = selectedVariant ? selectedVariant.available : true;
  const stock = selectedVariant ? selectedVariant.stock : baseStock;

  // Safety fix: a handful of products carry a genuine $0 price in the
  // source data (never fabricate a real price to paper over it) - those
  // need a human to quote a price, not an "Add to Cart" that would charge
  // nothing.
  const isContactForPricing = price === null || price === 0;

  function handleAddToCart() {
    if (price === null) return; // isContactForPricing already disables the button; defensive no-op
    addItem({
      productId,
      variantId: selectedVariant ? String(selectedVariant._id) : null,
      title,
      variantTitle: selectedVariant?.title ?? null,
      sku: selectedVariant?.sku ?? null,
      imageSrc,
      unitPrice: price,
      maxQuantity: stock,
      quantity,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="mt-6">
      <PriceTag price={price} compareAtPrice={compareAtPrice} size="lg" />

      {hasVariants && (
        <div className="mt-6">
          <label className="block font-body text-caption font-medium uppercase tracking-label text-ink/70" htmlFor="variant-select">
            {variants.length > 1 ? "Size" : "Option"}
          </label>
          <select
            id="variant-select"
            value={selectedVariantId}
            onChange={(e) => setSelectedVariantId(e.target.value)}
            className="mt-2 w-full max-w-xs border-[1.5px] border-ink/15 bg-cream px-3 py-2.5 font-body text-sm text-ink focus:border-rose-deep focus:outline-none"
          >
            {variants.map((v) => (
              <option key={String(v._id)} value={String(v._id)} disabled={!v.available}>
                {v.title}
                {!v.available ? " (Out of stock)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border-[1.5px] border-ink/15">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 font-body text-lg text-ink/70 hover:bg-cream"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2.5rem] text-center font-body text-sm text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => (stock != null ? Math.min(q + 1, stock) : q + 1))}
            className="px-3 py-2 font-body text-lg text-ink/70 hover:bg-cream"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!available || isContactForPricing}
          className="flex-1 bg-rose px-8 py-3.5 font-body text-sm font-medium tracking-[0.02em] text-cream transition-colors duration-300 hover:bg-rose-deep disabled:cursor-not-allowed disabled:bg-ink/20"
        >
          {!available ? "Out of Stock" : isContactForPricing ? "Contact us for pricing" : justAdded ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
      {justAdded && <p className="mt-2 font-body text-xs text-ink/50">Added to your cart.</p>}
      {isContactForPricing && !justAdded && (
        <p className="mt-2 font-body text-xs text-ink/50">
          This item needs a price confirmed by our team - please <a href="/contact" className="underline hover:text-rose-deep">contact us</a>.
        </p>
      )}
    </div>
  );
}
