"use client";

import { useEffect } from "react";
import { useWishlistStore } from "@/lib/store/wishlist";

// Mounted once near the root (see app/layout.tsx) - see
// lib/store/wishlist.ts's `skipHydration` comment for why this can't just
// happen automatically.
export function WishlistHydrationBoundary() {
  useEffect(() => {
    useWishlistStore.persist.rehydrate();
  }, []);

  return null;
}
