"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cart";

// Mounted once near the root (see app/layout.tsx). Triggers the cart
// store's deferred rehydration after mount - see lib/store/cart.ts's
// `skipHydration` comment for why this can't just happen automatically.
export function CartHydrationBoundary() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
