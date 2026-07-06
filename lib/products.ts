// Placeholder catalog copy. TODO: replace with real SKUs, pricing, and
// exact per-product photography once the client supplies current in-store
// inventory. Every real photo on the site is used exactly once (see
// lib/images.ts) - some tiles below intentionally have no `image` because
// real photo supply ran out for that slot; they fall back to the SVG
// placeholder art rather than repeating a photo used elsewhere.
import {
  PerfumeBottleArt,
  LipstickArt,
  SkincareJarArt,
  GiftSetArt,
  BrushArt,
} from "@/components/placeholder-art";
import {
  FRAGRANCE_FOR_HER_1,
  FRAGRANCE_FOR_HER_2,
  FRAGRANCE_FOR_HER_3,
  FRAGRANCE_FOR_HER_4,
  FRAGRANCE_FOR_HIM_1,
  FRAGRANCE_FOR_HIM_2,
  MAKEUP_FACE_1,
  MAKEUP_FACE_2,
  MAKEUP_EYES_1,
  MAKEUP_EYES_2,
  SKINCARE_HYDRATION_1,
  SKINCARE_HYDRATION_2,
  SKINCARE_ANTI_AGING_1,
  SKINCARE_ANTI_AGING_2,
  SKINCARE_ACNE_1,
  type SiteImage,
} from "@/lib/images";

export interface ProductItem {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  brand: string;
  name: string;
  price: string;
  badge?: string;
}

export const FRAGRANCES_FOR_HER: ProductItem[] = [
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HER_1, brand: "Dior", name: "J'adore Eau de Parfum", price: "$59.99", badge: "40% Off" },
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HER_2, brand: "Gucci", name: "Bloom Eau de Parfum", price: "$54.99" },
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HER_3, brand: "Versace", name: "Bright Crystal", price: "$44.99", badge: "New" },
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HER_4, brand: "YSL", name: "Black Opium", price: "$62.99" },
];

export const FRAGRANCES_FOR_HIM: ProductItem[] = [
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HIM_1, brand: "Dior", name: "Sauvage Eau de Toilette", price: "$64.99", badge: "35% Off" },
  { Art: PerfumeBottleArt, image: FRAGRANCE_FOR_HIM_2, brand: "Versace", name: "Eros", price: "$49.99" },
  { Art: PerfumeBottleArt, brand: "Armani", name: "Acqua di Giò", price: "$56.99" },
  { Art: PerfumeBottleArt, brand: "Gucci", name: "Guilty Pour Homme", price: "$47.99", badge: "New" },
];

export const MAKEUP_FACE: ProductItem[] = [
  { Art: LipstickArt, image: MAKEUP_FACE_1, brand: "L'Oréal", name: "Infallible Foundation", price: "$12.99" },
  { Art: LipstickArt, image: MAKEUP_FACE_2, brand: "Maybelline", name: "Fit Me Concealer", price: "$6.99", badge: "Bundle" },
];

export const MAKEUP_EYES: ProductItem[] = [
  { Art: LipstickArt, image: MAKEUP_EYES_1, brand: "NYX", name: "Eyeshadow Palette", price: "$14.99", badge: "New" },
  { Art: LipstickArt, image: MAKEUP_EYES_2, brand: "Maybelline", name: "Lash Sensational Mascara", price: "$8.99" },
];

export const MAKEUP_LIPS: ProductItem[] = [
  { Art: LipstickArt, brand: "MAC", name: "Matte Lipstick", price: "$16.99", badge: "30% Off" },
  { Art: LipstickArt, brand: "Fenty", name: "Gloss Bomb", price: "$18.99" },
];

export const MAKEUP_NAILS: ProductItem[] = [
  { Art: LipstickArt, brand: "OPI", name: "Nail Lacquer", price: "$9.99" },
  { Art: LipstickArt, brand: "Essie", name: "Gel Couture", price: "$10.99", badge: "Bundle" },
];

export const SKINCARE_HYDRATION: ProductItem[] = [
  { Art: SkincareJarArt, image: SKINCARE_HYDRATION_1, brand: "Neutrogena", name: "Hydro Boost Gel Cream", price: "$17.99" },
  { Art: SkincareJarArt, image: SKINCARE_HYDRATION_2, brand: "CeraVe", name: "Moisturizing Cream", price: "$14.99", badge: "New" },
];

export const SKINCARE_ANTI_AGING: ProductItem[] = [
  { Art: SkincareJarArt, image: SKINCARE_ANTI_AGING_1, brand: "Olay", name: "Regenerist Serum", price: "$22.99", badge: "25% Off" },
  { Art: SkincareJarArt, image: SKINCARE_ANTI_AGING_2, brand: "L'Oréal", name: "Revitalift Night Cream", price: "$19.99" },
];

export const SKINCARE_ACNE: ProductItem[] = [
  { Art: SkincareJarArt, image: SKINCARE_ACNE_1, brand: "La Roche-Posay", name: "Effaclar Duo", price: "$24.99" },
  { Art: SkincareJarArt, brand: "Neutrogena", name: "Rapid Clear Gel", price: "$11.99", badge: "Bundle" },
];

export const SKINCARE_BRIGHTENING: ProductItem[] = [
  { Art: SkincareJarArt, brand: "Garnier", name: "Vitamin C Serum", price: "$15.99", badge: "New" },
  { Art: SkincareJarArt, brand: "The Ordinary", name: "Niacinamide 10%", price: "$9.99" },
];

// No dedicated accessories/self-care photo folder was supplied, so this
// section keeps the placeholder line-art until real photography is provided.
export const ACCESSORIES: ProductItem[] = [
  { Art: BrushArt, brand: "Real Techniques", name: "Brush Set", price: "$21.99", badge: "Bundle" },
  { Art: GiftSetArt, brand: "AG Exclusive", name: "Vanity Mirror", price: "$13.99" },
  { Art: BrushArt, brand: "EcoTools", name: "Blending Sponge Duo", price: "$8.99" },
  { Art: GiftSetArt, brand: "AG Exclusive", name: "Travel Pouch Set", price: "$11.99", badge: "New" },
];
