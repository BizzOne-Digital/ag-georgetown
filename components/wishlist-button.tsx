"use client";

import { useWishlistStore, selectIsWishlisted, type WishlistItem } from "@/lib/store/wishlist";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path
        d="M12 20.5s-7.5-4.6-10-9.2C.5 8.1 2 4.5 5.5 3.6c2.2-.6 4.4.3 6.5 2.7 2.1-2.4 4.3-3.3 6.5-2.7 3.5.9 5 4.5 3.5 7.7-2.5 4.6-10 9.2-10 9.2Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistButton({ item, className = "" }: WishlistButtonProps) {
  const isWishlisted = useWishlistStore(selectIsWishlisted(item.productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      aria-label={isWishlisted ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
      aria-pressed={isWishlisted}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-ink shadow-sm transition-colors hover:text-rose-deep ${
        isWishlisted ? "text-rose-deep" : ""
      } ${className}`}
    >
      <HeartIcon filled={isWishlisted} className="h-[18px] w-[18px]" />
    </button>
  );
}
