import { revalidatePath } from "next/cache";
import { listAllProductsForAdmin, updateProductPricing } from "@/lib/repositories/product.repository";

export const dynamic = "force-dynamic"; // always show current inventory, never cache

// A Server Action, not a Route Handler - a deliberate, narrow exception to
// this codebase's existing convention (every other mutation is a Route
// Handler called from a client-side fetch() with a stable JSON contract).
// This form has no such requirement: it's a same-origin, server-rendered
// page, one row edited at a time, no client-side JS needed at all.
async function updateProductAction(formData: FormData) {
  "use server";

  const productId = String(formData.get("productId"));
  const priceRaw = formData.get("price");
  const stockRaw = formData.get("stock");

  const fields: { price?: number; stock?: number | null } = {};
  // Blank input must never silently coerce to 0 and re-trigger the $0
  // "contact for pricing" state - only include a field if it was actually
  // typed into.
  if (typeof priceRaw === "string" && priceRaw.trim() !== "") {
    const price = Number(priceRaw);
    if (Number.isFinite(price) && price >= 0) fields.price = price;
  }
  if (typeof stockRaw === "string") {
    if (stockRaw.trim() === "") {
      fields.stock = null; // explicitly cleared - back to "unknown"
    } else {
      const stock = Number(stockRaw);
      if (Number.isFinite(stock) && stock >= 0) fields.stock = Math.floor(stock);
    }
  }

  await updateProductPricing(productId, fields);
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await listAllProductsForAdmin();

  return (
    <div className="font-mono text-sm">
      <h1 className="text-lg font-bold text-gray-900">Inventory ({products.length})</h1>

      <table className="mt-4 w-full border-collapse text-left">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="py-2 pr-4">Product</th>
            <th className="py-2 pr-4">Price</th>
            <th className="py-2 pr-4">Stock</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={String(product._id)} className="border-b border-gray-200 align-top">
              <td className="py-2 pr-4">
                {product.title}
                {product.variants.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Has {product.variants.length} variant(s) - editing here only changes the display default; checkout
                    uses each variant&apos;s own price/stock.
                  </p>
                )}
                {!product.isActive && <p className="mt-1 text-xs text-gray-500">(inactive)</p>}
              </td>
              <td className="py-2 pr-4">
                <form id={`product-form-${product._id}`} action={updateProductAction} className="flex items-center gap-2">
                  <input type="hidden" name="productId" value={String(product._id)} />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    defaultValue={product.price ?? ""}
                    className="w-24 border border-gray-400 px-2 py-1"
                  />
                </form>
              </td>
              <td className="py-2 pr-4">
                <input
                  type="number"
                  step="1"
                  min="0"
                  name="stock"
                  form={`product-form-${product._id}`}
                  defaultValue={product.stock ?? ""}
                  placeholder="unknown"
                  className="w-20 border border-gray-400 px-2 py-1"
                />
              </td>
              <td className="py-2 pr-4">
                <button
                  type="submit"
                  form={`product-form-${product._id}`}
                  className="border border-gray-500 bg-gray-200 px-3 py-1 hover:bg-gray-300"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
