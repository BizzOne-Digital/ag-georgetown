import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/repositories/product.repository";
import { Breadcrumb } from "@/components/catalog/breadcrumb";
import { ImageGallery } from "@/components/catalog/image-gallery";
import { ProductPurchasePanel } from "@/components/catalog/product-purchase-panel";
import { RelatedProducts } from "@/components/catalog/related-products";
import { SITE_URL } from "@/lib/site";

interface ProductPageProps {
  params: { slug: string };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const description = stripHtml(product.description).slice(0, 160);
  return {
    title: `${product.title} | AG Liquidation Georgetown`,
    description,
    alternates: { canonical: `${SITE_URL}/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description,
      images: product.images[0] ? [product.images[0].src] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category._id, product._id, 4);

  // Mongoose/BSON ObjectId instances can't cross the server->client
  // component boundary as-is - this round-trip coerces them (and Dates) to
  // plain strings, matching what the client components actually receive.
  const plainImages = JSON.parse(JSON.stringify(product.images)) as typeof product.images;
  const plainVariants = JSON.parse(JSON.stringify(product.variants)) as typeof product.variants;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: product.category.title, href: `/products?category=${product.category.slug}` },
          { label: product.title },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ImageGallery images={plainImages} title={product.title} />

        <div>
          {product.vendor && (
            <p className="font-body text-caption font-medium uppercase tracking-label text-rose-deep">{product.vendor}</p>
          )}
          <h1 className="mt-1 font-display text-h3 font-medium text-ink">{product.title}</h1>

          <ProductPurchasePanel
            productId={String(product._id)}
            title={product.title}
            imageSrc={product.images[0]?.src ?? null}
            basePrice={product.price}
            baseCompareAtPrice={product.compareAtPrice}
            baseStock={product.stock}
            variants={plainVariants}
          />
        </div>
      </div>

      {product.description && (
        <div
          className="mt-16 max-w-3xl border-t border-ink/10 pt-10 font-body text-body text-ink/80 [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-display [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-ink [&_strong]:font-semibold [&_strong]:text-ink"
          // Product descriptions come from the merchant's own Shopify store -
          // trusted content, not user input.
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      <RelatedProducts products={related} />
    </div>
  );
}
