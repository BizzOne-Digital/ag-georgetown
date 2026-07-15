import { isOnSale } from "@/lib/catalog/pricing";

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

interface PriceTagProps {
  price: number | null;
  compareAtPrice?: number | null;
  size?: "sm" | "lg";
  className?: string;
}

export function PriceTag({ price, compareAtPrice, size = "sm", className = "" }: PriceTagProps) {
  const onSale = isOnSale({ price, compareAtPrice });
  const textSize = size === "lg" ? "text-xl" : "text-sm";

  if (price === null) {
    return <span className={`font-body ${textSize} text-ink/50 ${className}`}>Price unavailable</span>;
  }

  return (
    <span className={`inline-flex items-baseline gap-2 font-body ${className}`}>
      {onSale && <span className={`text-ink/40 line-through ${textSize}`}>{formatPrice(compareAtPrice!)}</span>}
      <span className={`font-medium ${onSale ? "text-rose-deep" : "text-ink"} ${textSize}`}>{formatPrice(price)}</span>
    </span>
  );
}

export { formatPrice };
