// Placeholder catalog copy. TODO: replace with real SKUs, pricing, and
// exact per-product photography once the client supplies current in-store
// inventory - for now, real category photography is cycled across tiles.
import {
  PerfumeBottleArt,
  LipstickArt,
  SkincareJarArt,
  GiftSetArt,
  BrushArt,
} from "@/components/placeholder-art";
import { FRAGRANCE_IMAGES, MAKEUP_IMAGES, SKINCARE_IMAGES, pick, type SiteImage } from "@/lib/images";

export interface ProductItem {
  Art: React.ComponentType<{ className?: string }>;
  image?: SiteImage;
  brand: string;
  name: string;
  price: string;
  badge?: string;
}

// Images at index 0 (fragrance) / 4 (makeup) / 5 (skincare) are used by the
// homepage category tiles, and index 5 (fragrance) / 2 (makeup) / 0
// (skincare) by the homepage bundle cards - the remaining images are cycled
// across the product tiles below so nothing repeats unnecessarily.
const FRAGRANCE_TILE_IMAGES = [FRAGRANCE_IMAGES[1], FRAGRANCE_IMAGES[2], FRAGRANCE_IMAGES[3], FRAGRANCE_IMAGES[4]];
const MAKEUP_TILE_IMAGES = [MAKEUP_IMAGES[0], MAKEUP_IMAGES[1], MAKEUP_IMAGES[3]];
const SKINCARE_TILE_IMAGES = [SKINCARE_IMAGES[1], SKINCARE_IMAGES[2], SKINCARE_IMAGES[3], SKINCARE_IMAGES[4]];

export const FRAGRANCES_FOR_HER: ProductItem[] = [
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 0), brand: "Dior", name: "J'adore Eau de Parfum", price: "$59.99", badge: "40% Off" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 1), brand: "Gucci", name: "Bloom Eau de Parfum", price: "$54.99" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 2), brand: "Versace", name: "Bright Crystal", price: "$44.99", badge: "New" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 3), brand: "YSL", name: "Black Opium", price: "$62.99" },
];

export const FRAGRANCES_FOR_HIM: ProductItem[] = [
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 4), brand: "Dior", name: "Sauvage Eau de Toilette", price: "$64.99", badge: "35% Off" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 5), brand: "Versace", name: "Eros", price: "$49.99" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 6), brand: "Armani", name: "Acqua di Giò", price: "$56.99" },
  { Art: PerfumeBottleArt, image: pick(FRAGRANCE_TILE_IMAGES, 7), brand: "Gucci", name: "Guilty Pour Homme", price: "$47.99", badge: "New" },
];

export const MAKEUP_FACE: ProductItem[] = [
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 0), brand: "L'Oréal", name: "Infallible Foundation", price: "$12.99" },
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 1), brand: "Maybelline", name: "Fit Me Concealer", price: "$6.99", badge: "Bundle" },
];

export const MAKEUP_EYES: ProductItem[] = [
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 2), brand: "NYX", name: "Eyeshadow Palette", price: "$14.99", badge: "New" },
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 3), brand: "Maybelline", name: "Lash Sensational Mascara", price: "$8.99" },
];

export const MAKEUP_LIPS: ProductItem[] = [
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 4), brand: "MAC", name: "Matte Lipstick", price: "$16.99", badge: "30% Off" },
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 5), brand: "Fenty", name: "Gloss Bomb", price: "$18.99" },
];

export const MAKEUP_NAILS: ProductItem[] = [
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 6), brand: "OPI", name: "Nail Lacquer", price: "$9.99" },
  { Art: LipstickArt, image: pick(MAKEUP_TILE_IMAGES, 7), brand: "Essie", name: "Gel Couture", price: "$10.99", badge: "Bundle" },
];

export const SKINCARE_HYDRATION: ProductItem[] = [
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 0), brand: "Neutrogena", name: "Hydro Boost Gel Cream", price: "$17.99" },
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 1), brand: "CeraVe", name: "Moisturizing Cream", price: "$14.99", badge: "New" },
];

export const SKINCARE_ANTI_AGING: ProductItem[] = [
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 2), brand: "Olay", name: "Regenerist Serum", price: "$22.99", badge: "25% Off" },
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 3), brand: "L'Oréal", name: "Revitalift Night Cream", price: "$19.99" },
];

export const SKINCARE_ACNE: ProductItem[] = [
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 4), brand: "La Roche-Posay", name: "Effaclar Duo", price: "$24.99" },
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 5), brand: "Neutrogena", name: "Rapid Clear Gel", price: "$11.99", badge: "Bundle" },
];

export const SKINCARE_BRIGHTENING: ProductItem[] = [
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 6), brand: "Garnier", name: "Vitamin C Serum", price: "$15.99", badge: "New" },
  { Art: SkincareJarArt, image: pick(SKINCARE_TILE_IMAGES, 7), brand: "The Ordinary", name: "Niacinamide 10%", price: "$9.99" },
];

// No dedicated accessories/self-care photo folder was supplied, so this
// section keeps the placeholder line-art until real photography is provided.
export const ACCESSORIES: ProductItem[] = [
  { Art: BrushArt, brand: "Real Techniques", name: "Brush Set", price: "$21.99", badge: "Bundle" },
  { Art: GiftSetArt, brand: "AG Exclusive", name: "Vanity Mirror", price: "$13.99" },
  { Art: BrushArt, brand: "EcoTools", name: "Blending Sponge Duo", price: "$8.99" },
  { Art: GiftSetArt, brand: "AG Exclusive", name: "Travel Pouch Set", price: "$11.99", badge: "New" },
];
