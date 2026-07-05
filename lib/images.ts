export interface SiteImage {
  src: string;
  alt: string;
}

// Cycles through a pool by index so a small photo set can cover more slots
// than it has unique images, per section, without leaving any tile empty.
export function pick(pool: SiteImage[], index: number): SiteImage {
  return pool[index % pool.length];
}

export const AG_IMAGES: SiteImage[] = [
  { src: "/images/AG/ag1.jpg", alt: "Gold-capped designer perfume bottle on a soft neutral backdrop" },
  { src: "/images/AG/ag2.jpg", alt: "Frosted glass perfume bottle with a gold cap beside white blossom branches" },
  { src: "/images/AG/ag3.jpg", alt: "Perfume, lipsticks, and blush displayed on rocks amid soft pink and lavender clouds" },
  { src: "/images/AG/ag4.jpg", alt: "Gold vanity brushes, perfume, and cream jars arranged in soft natural light" },
  { src: "/images/AG/ag5.jpg", alt: "Skincare and fragrance bottles nestled among pink and peach garden roses" },
  // Note: ag6.jpg (CBD/cannabis product photography) is deliberately excluded -
  // off-brand for a perfume & cosmetics liquidation store. Swap in a real
  // storefront/interior photo here once the client supplies one.
];

export const FRAGRANCE_IMAGES: SiteImage[] = [
  { src: "/images/fragrance/1.jpg", alt: "Assorted designer perfume bottles arranged on a mirrored marble surface" },
  { src: "/images/fragrance/2.jpg", alt: "Niche fragrance bottles staged on a pastel blue and pink set" },
  { src: "/images/fragrance/3.jpg", alt: "Crystal perfume decanters displayed on lit glass shelving in a fragrance boutique" },
  { src: "/images/fragrance/4.jpg", alt: "Designer perfume bottles grouped together on a reflective vanity tray" },
  { src: "/images/fragrance/5.jpg", alt: "Men's and women's fragrance bottles displayed on a gold boutique shelf" },
  { src: "/images/fragrance/6.jpg", alt: "Perfume bottles staged among dried flowers and botanical branches" },
];

export const MAKEUP_IMAGES: SiteImage[] = [
  { src: "/images/makeup/brush.jpg", alt: "Set of makeup brushes fanned out on a warm cream background" },
  { src: "/images/makeup/brush1.jpg", alt: "Angled makeup brushes and an eye spoolie standing upright on a grey backdrop" },
  { src: "/images/makeup/fac1.jpg", alt: "Foundation bottles in a range of shades on a pink backdrop" },
  { src: "/images/makeup/face.jpg", alt: "Foundation bottles with rose gold caps on a neutral background" },
  { src: "/images/makeup/lip.jpg", alt: "Lipsticks and lip gloss arranged on marble with a white rose" },
];

export const SKINCARE_IMAGES: SiteImage[] = [
  { src: "/images/skincare/1.jpg", alt: "Serum dropper, pump bottle, and cream jar on a warm neutral backdrop" },
  { src: "/images/skincare/2.jpg", alt: "Assorted skincare serum dropper bottles staged against a dark backdrop" },
  { src: "/images/skincare/3.jpg", alt: "Skincare jars and bottles surrounded by strawberries, cucumber, and fresh botanicals" },
  { src: "/images/skincare/4.jpg", alt: "Minimalist cream jar on a warm marble surface" },
  { src: "/images/skincare/skin.jpg", alt: "Serum, moisturizer, and cream jar with pink flowers on a neutral backdrop" },
  { src: "/images/skincare/skin2.jpg", alt: "Cream tube, dropper bottles, and a wooden-lidded jar with white blossoms" },
];

export const INSTAGRAM_IMAGES: SiteImage[] = [
  { src: "/images/instaGallery/1.jpg", alt: "Pink flatlay of lotion, blush, brushes, and a spray bottle with gold star confetti" },
  { src: "/images/instaGallery/2.jpg", alt: "Elegant vanity table with a round mirror, perfume bottles, and fresh flowers" },
  { src: "/images/instaGallery/3.jpg", alt: "Perfume, nail polish, and blush styled on driftwood against a pink backdrop" },
  { src: "/images/instaGallery/4.jpg", alt: "Lipstick, cream jar, and highlighter compact styled among white blossoms" },
];
