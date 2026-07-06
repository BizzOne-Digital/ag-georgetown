import { PerfumeBottleArt, LipstickArt, SkincareJarArt } from "@/components/placeholder-art";
import {
  FRAGRANCE_BESTSELLER_SAUVAGE,
  FRAGRANCE_BESTSELLER_BLACK_OPIUM,
  MAKEUP_BESTSELLER_GLOSS_BOMB,
  MAKEUP_BESTSELLER_BLUSH,
  SKINCARE_BESTSELLER_CLEANSER,
} from "@/lib/images";
import type { ProductItem } from "@/lib/products";

export const BEST_SELLERS: ProductItem[] = [
  { Art: PerfumeBottleArt, image: FRAGRANCE_BESTSELLER_SAUVAGE, brand: "Dior", name: "Sauvage EDT 100ml", price: "$54.99" },
  { Art: LipstickArt, image: MAKEUP_BESTSELLER_GLOSS_BOMB, brand: "Fenty", name: "Gloss Bomb", price: "$12.99" },
  { Art: SkincareJarArt, image: SKINCARE_BESTSELLER_CLEANSER, brand: "CeraVe", name: "Hydrating Facial Cleanser", price: "$9.99" },
  { Art: PerfumeBottleArt, image: FRAGRANCE_BESTSELLER_BLACK_OPIUM, brand: "YSL", name: "Black Opium 50ml", price: "$64.99" },
  { Art: LipstickArt, image: MAKEUP_BESTSELLER_BLUSH, brand: "Rare Beauty", name: "Soft Pinch Blush", price: "$14.99" },
];
