import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartLine {
  key: string; // `${productId}:${variantId ?? "base"}` - see addItem for why
  productId: string;
  variantId: string | null;
  title: string;
  variantTitle: string | null;
  sku: string | null;
  imageSrc: string | null;
  // Display snapshot only - the checkout route re-fetches the real price
  // from MongoDB and never trusts this value, same rule as everywhere else
  // in this project that touches price.
  unitPrice: number;
  quantity: number;
  // From the variant/product's known stock at add-time. null = unknown
  // (don't cap), matching the schema's own "null = unknown" convention.
  maxQuantity: number | null;
}

interface CartState {
  lines: CartLine[];
  hasHydrated: boolean;
  addItem: (input: Omit<CartLine, "key" | "quantity"> & { quantity?: number }) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hasHydrated: false,

      addItem: (input) => {
        const key = `${input.productId}:${input.variantId ?? "base"}`;
        const addedQty = input.quantity ?? 1;

        set((state) => {
          const existing = state.lines.find((line) => line.key === key);
          if (existing) {
            const nextQty =
              existing.maxQuantity != null
                ? Math.min(existing.quantity + addedQty, existing.maxQuantity)
                : existing.quantity + addedQty;
            return {
              lines: state.lines.map((line) => (line.key === key ? { ...line, quantity: nextQty } : line)),
            };
          }
          return { lines: [...state.lines, { ...input, key, quantity: addedQty }] };
        });
      },

      removeItem: (key) => set((state) => ({ lines: state.lines.filter((line) => line.key !== key) })),

      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.key !== key)
              : state.lines.map((line) => (line.key === key ? { ...line, quantity } : line)),
        })),

      clear: () => set({ lines: [] }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ag-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // Critical: without this, persist rehydrates at module-eval time - on
      // the server there's no localStorage, on the client that first read
      // races the initial render, and either way produces a hydration
      // mismatch (e.g. a cart-count badge flashing 0 -> real count).
      // components/cart-hydration-boundary.tsx triggers the real rehydrate
      // manually, after mount.
      skipHydration: true,
      partialize: (state) => ({ lines: state.lines }), // hasHydrated itself shouldn't persist
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Plain selector functions over `lines`, not separately-stored state, so
// they can never drift out of sync with it.
export function selectTotalItems(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function selectSubtotal(state: CartState): number {
  return state.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}
