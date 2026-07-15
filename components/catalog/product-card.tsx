import Image from "next/image";
import Link from "next/link";
import { FoilSweep } from "@/components/foil-sweep";
import { OfferBadge } from "@/components/offer-badge";
import { PriceTag } from "./price-tag";
import { isOnSale } from "@/lib/catalog/pricing";
import { isInStock } from "@/lib/catalog/classify";
import type { IProduct, IProductImage, IProductVariant } from "@/lib/models/Product";

// Deliberately narrower than AnnotatedProduct - this card never touches
// `category`, so callers (e.g. related products) don't need to populate or
// fabricate one just to satisfy the prop type.
export interface ProductCardData {
  slug: string;
  title: string;
  vendor: string | null;
  price: number | null;
  compareAtPrice: number | null;
  images: IProductImage[];
  variants: IProductVariant[];
  inStock: boolean;
}

// Shared by every caller that only has a plain IProduct (ProductRow,
// RelatedProducts) - keeps the `inStock` computation from drifting between
// them.
export function toProductCardData(p: IProduct): ProductCardData {
  return {
    slug: p.slug,
    title: p.title,
    vendor: p.vendor,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images,
    variants: p.variants,
    inStock: isInStock(p),
  };
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];
  const onSale = isOnSale(product);
  // A single variant's title is almost always the size ("100ml") - useful as
  // a unit label on the card. With 0 or multiple variants it's ambiguous, so
  // it's left off rather than guessed.
  const unitLabel = product.variants.length === 1 ? product.variants[0].title : null;

  return (
    <FoilSweep className="block w-full">
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative flex aspect-square items-center justify-center bg-cream">
          {onSale && <OfferBadge className="absolute -right-2 -top-2 z-10 h-14 w-14 text-[0.55rem]">Sale</OfferBadge>}
          {!product.inStock && (
            <span className="absolute left-2 top-2 z-10 bg-ink/80 px-2 py-1 font-body text-[0.6rem] font-medium uppercase tracking-label text-cream">
              Out of stock
            </span>
          )}
          {image ? (
            <Image
              src={image.src}
              alt={image.alt ?? product.title}
              fill
              sizes="(max-width: 768px) 45vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="font-body text-xs text-ink/40">No image</span>
          )}
        </div>
        <div className="mt-4">
          {product.vendor && (
            <p className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">{product.vendor}</p>
          )}
          <h3 className="mt-1 line-clamp-2 font-display text-base font-medium text-ink">{product.title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
            {unitLabel && <span className="font-body text-xs text-ink/50">/ {unitLabel}</span>}
          </div>
        </div>
      </Link>
    </FoilSweep>
  );
}
