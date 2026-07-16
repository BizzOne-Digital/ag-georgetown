import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  productId: string;
  slug: string;
  title: string;
  vendor: string | null;
  imageSrc: string | null;
  price: number | null;
  compareAtPrice: number | null;
}

interface WishlistState {
  items: WishlistItem[];
  hasHydrated: boolean;
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      hasHydrated: false,

      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === item.productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== item.productId)
              : [...state.items, item],
          };
        }),

      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ag-wishlist",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Same SSR-hydration-mismatch fix as lib/store/cart.ts - skip the
      // automatic rehydrate (no localStorage on the server, and racing the
      // client's first render either way) and trigger it manually after
      // mount via components/wishlist-hydration-boundary.tsx instead.
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function selectIsWishlisted(productId: string) {
  return (state: WishlistState) => state.items.some((i) => i.productId === productId);
}
