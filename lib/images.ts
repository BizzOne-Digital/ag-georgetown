export interface SiteImage {
  src: string;
  alt: string;
}

// Every image below is used in exactly ONE place on the site - see the
// per-page comments next to each constant. When a product tile has no
// image assigned to it in lib/products.ts, that's deliberate: real photo
// supply ran out for that slot, so it falls back to the SVG placeholder
// art rather than repeating a photo used elsewhere.

// --- AG (brand/hero photography) ---
// ag6.jpg was replaced by an accidental duplicate of instaGallery/3.jpg
// during a file rename and is not used anywhere; only ag1-ag5 are real.
export const AG_HERO_1: SiteImage = { src: "/images/AG/ag1.jpg", alt: "Gold-capped designer perfume bottle on a soft neutral backdrop" };
export const AG_HOME_HERO: SiteImage = { src: "/images/AG/aghomehero.jpg", alt: "Rose-gold perfume bottle nestled among pink and cream peonies and roses on a marble surface" };
export const AG_HERO_2: SiteImage = { src: "/images/AG/ag2.jpg", alt: "Frosted glass perfume bottle with a gold cap beside white blossom branches" };
export const AG_HERO_3: SiteImage = { src: "/images/AG/ag3.jpg", alt: "Perfume, lipsticks, and blush displayed on rocks amid soft pink and lavender clouds" };
export const AG_ABOUT_HERO: SiteImage = { src: "/images/AG/ag4.jpg", alt: "Gold vanity brushes, perfume, and cream jars arranged in soft natural light" };
export const AG_ABOUT_AUTHENTICITY: SiteImage = { src: "/images/AG/ag5.jpg", alt: "Skincare and fragrance bottles nestled among pink and peach garden roses" };

// --- Fragrance (11 unique images) ---
export const FRAGRANCE_CATEGORY_TILE: SiteImage = { src: "/images/fragrance/1.jpg", alt: "Assorted designer perfume bottles arranged on a mirrored marble surface" };
export const FRAGRANCE_BUNDLE: SiteImage = { src: "/images/fragrance/6.jpg", alt: "Perfume bottles staged among dried flowers and botanical branches" };
export const FRAGRANCE_ABOUT_COMMUNITY: SiteImage = { src: "/images/fragrance/7.jpg", alt: "Perfume, powder compact, and a makeup brush styled inside a rose-gold ring display" };
export const FRAGRANCE_FOR_HER_BANNER: SiteImage = { src: "/images/fragrance/8.jpg", alt: "Gold-capped perfume bottle wrapped in sheer fabric with soft bokeh lighting" };
export const FRAGRANCE_BESTSELLER_BLACK_OPIUM: SiteImage = { src: "/images/fragrance/9.jpg", alt: "Cream perfume bottle with a gold cap on a sunlit stone podium with dried pampas grass" };
export const FRAGRANCE_FOR_HER_1: SiteImage = { src: "/images/fragrance/2.jpg", alt: "Niche fragrance bottles staged on a pastel blue and pink set" };
export const FRAGRANCE_FOR_HER_2: SiteImage = { src: "/images/fragrance/3.jpg", alt: "Crystal perfume decanters displayed on lit glass shelving in a fragrance boutique" };
export const FRAGRANCE_FOR_HER_3: SiteImage = { src: "/images/fragrance/4.jpg", alt: "Designer perfume bottles grouped together on a reflective vanity tray" };
export const FRAGRANCE_FOR_HER_4: SiteImage = { src: "/images/fragrance/5.jpg", alt: "Men's and women's fragrance bottles displayed on a gold boutique shelf" };
export const FRAGRANCE_FOR_HIM_1: SiteImage = { src: "/images/fragrance/10.jpg", alt: "Ribbed glass perfume bottle with a gold cap against a sunlit wall with olive branch shadows" };
export const FRAGRANCE_FOR_HIM_2: SiteImage = { src: "/images/fragrance/11.jpg", alt: "Rectangular perfume bottle lying on a peach backdrop with dried bunny-tail grass" };
export const FRAGRANCE_FOR_HIM_BANNER: SiteImage = { src: "/images/fragrance/12.jpg", alt: "Dark, angular men's cologne bottle staged against a moody backdrop" };

// --- Makeup (9 unique images) ---
export const MAKEUP_CATEGORY_TILE: SiteImage = { src: "/images/makeup/lip.jpg", alt: "Lipsticks and lip gloss arranged on marble with a white rose" };
export const MAKEUP_BUNDLE: SiteImage = { src: "/images/makeup/fac1.jpg", alt: "Foundation bottles in a range of shades on a pink backdrop" };
export const MAKEUP_ABOUT_SELF_EXPRESSION: SiteImage = { src: "/images/makeup/abcd.jpg", alt: "Mascara, lipstick, foundation, compact powder, and eyeliner lined up on a white background" };
export const MAKEUP_BESTSELLER_GLOSS_BOMB: SiteImage = { src: "/images/makeup/22.jpg", alt: "Foundation, lipstick, dropper serum, and a powder compact styled with dried flowers" };
export const MAKEUP_BESTSELLER_BLUSH: SiteImage = { src: "/images/makeup/face3.jpg", alt: "Eyeshadow compact, lipstick, and cream jar displayed on a white pedestal" };
export const MAKEUP_FACE_1: SiteImage = { src: "/images/makeup/face.jpg", alt: "Foundation bottles with rose gold caps on a neutral background" };
export const PROMO_BANNER_IMAGE: SiteImage = { src: "/images/makeup/aaaa.jpg", alt: "Foundation, concealer, and mascara flatlay on beige with a palm leaf and smudged swatches" };
export const MAKEUP_EYES_1: SiteImage = { src: "/images/makeup/brush1.jpg", alt: "Angled makeup brushes and an eye spoolie standing upright on a grey backdrop" };
export const MAKEUP_EYES_2: SiteImage = { src: "/images/makeup/brush.jpg", alt: "Set of makeup brushes fanned out on a warm cream background" };
export const COSMETICS_BANNER: SiteImage = { src: "/images/makeup/cosmetic.jpg", alt: "Gold-toned lipstick, foundation, brushes, and pearl jewelry styled on white faux fur" };

// --- Skincare (9 unique images) ---
export const SKINCARE_CATEGORY_TILE: SiteImage = { src: "/images/skincare/skin2.jpg", alt: "Cream tube, dropper bottles, and a wooden-lidded jar with white blossoms" };
export const SKINCARE_BUNDLE: SiteImage = { src: "/images/skincare/1.jpg", alt: "Serum dropper, pump bottle, and cream jar on a warm neutral backdrop" };
export const SKINCARE_ABOUT_ACCESSIBILITY: SiteImage = { src: "/images/skincare/abccc.jpg", alt: "Six white skincare containers - tubes, jars, and bottles - flatlay with a white flower" };
export const SKINCARE_BESTSELLER_CLEANSER: SiteImage = { src: "/images/skincare/5.jpg", alt: "Lotion, serum, and cream jar arranged on a stone podium with greenery" };
export const SKINCARE_HYDRATION_1: SiteImage = { src: "/images/skincare/2.jpg", alt: "Assorted skincare serum dropper bottles staged against a dark backdrop" };
export const SKINCARE_HYDRATION_2: SiteImage = { src: "/images/skincare/3.jpg", alt: "Skincare jars and bottles surrounded by strawberries, cucumber, and fresh botanicals" };
export const SKINCARE_ANTI_AGING_1: SiteImage = { src: "/images/skincare/4.jpg", alt: "Minimalist cream jar on a warm marble surface" };
export const SKINCARE_ANTI_AGING_2: SiteImage = { src: "/images/skincare/skin.jpg", alt: "Serum, moisturizer, and cream jar with pink flowers on a neutral backdrop" };
export const SKINCARE_ACNE_1: SiteImage = { src: "/images/skincare/aw.jpg", alt: "White skincare tubes, a dropper bottle, and a cream jar styled with dried leaves and a towel" };

// --- Instagram teaser (4 images, unchanged) ---
export const INSTAGRAM_IMAGES: SiteImage[] = [
  { src: "/images/instaGallery/1.jpg", alt: "Pink flatlay of lotion, blush, brushes, and a spray bottle with gold star confetti" },
  { src: "/images/instaGallery/2.jpg", alt: "Elegant vanity table with a round mirror, perfume bottles, and fresh flowers" },
  { src: "/images/instaGallery/3.jpg", alt: "Perfume, nail polish, and blush styled on driftwood against a pink backdrop" },
  { src: "/images/instaGallery/4.jpg", alt: "Lipstick, cream jar, and highlighter compact styled among white blossoms" },
];
