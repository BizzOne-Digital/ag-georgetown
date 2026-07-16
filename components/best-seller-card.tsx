import Image from "next/image";
import Link from "next/link";
import { FoilSweep } from "@/components/foil-sweep";
import { WishlistButton } from "@/components/wishlist-button";
import { PriceTag } from "@/components/catalog/price-tag";
import { isOnSale } from "@/lib/catalog/pricing";
import type { IProduct } from "@/lib/models/Product";

export interface BestSellerCardData {
  productId: string;
  slug: string;
  title: string;
  vendor: string | null;
  price: number | null;
  compareAtPrice: number | null;
  // Plain {src, alt} only, not IProductImage - the sub-document's own `_id`
  // is a Mongoose ObjectId, which can't cross the server->client boundary
  // (this component renders inside the "use client" carousel) without a
  // "toJSON methods are not supported" warning.
  images: { src: string; alt: string | null }[];
}

export function toBestSellerCardData(p: IProduct): BestSellerCardData {
  return {
    productId: String(p._id),
    slug: p.slug,
    title: p.title,
    vendor: p.vendor,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.map((img) => ({ src: img.src, alt: img.alt })),
  };
}

export function BestSellerCard({ product }: { product: BestSellerCardData }) {
  const image = product.images[0];
  const onSale = isOnSale(product);

  return (
    <FoilSweep className="block w-full">
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative flex aspect-square items-center justify-center bg-cream">
          {onSale && (
            <span className="absolute left-0 top-0 z-10 bg-rose px-3 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-label text-cream">
              Sale
            </span>
          )}

          <div className="absolute right-2 top-2 z-10 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
            <WishlistButton
              item={{
                productId: product.productId,
                slug: product.slug,
                title: product.title,
                vendor: product.vendor,
                imageSrc: image?.src ?? null,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
              }}
            />
          </div>

          {image ? (
            <Image
              src={image.src}
              alt={image.alt ?? product.title}
              fill
              sizes="(max-width: 768px) 45vw, 20vw"
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
          <div className="mt-2">
            <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
          </div>
        </div>
      </Link>
    </FoilSweep>
  );
}
