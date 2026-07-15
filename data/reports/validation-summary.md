# Validation Report

Generated: 2026-07-10T13:13:24.849Z

## Summary

- Products: 510
- Categories: 220
- Pages: 2
- Errors: 0
- Warnings: 45
- Info: 132

**Verdict: no blocking errors found. Structurally safe to import once warnings/info are reviewed.**

## Checks

### duplicate-products (error) - 0 found

Products sharing the same `id`.

### duplicate-slugs (error) - 0 found

Products sharing the same `slug`.

### products-without-images (warning) - 0 found

Products with an empty `images` array.

### products-without-price (error) - 0 found

Products where no variant returned a usable numeric price.

### products-without-description (warning) - 36 found

Products with an empty `description` once HTML tags are stripped.

- slug: charlotte-tilbury-matte-revolution-luminous-modern-matte-lipstick-mini, title: "Charlotte Tilbury Matte Revolution Luminous Modern Matte Lipstick Mini", id: 7590769262659
- slug: armaf-club-de-nuit-for-women-eau-de-parfum, title: "Armaf Club De Nuit For Women Eau De Parfum", id: 7590776995907
- slug: french-avenue-vulcan-feu-unisex-eau-de-parfum, title: "French Avenue Vulcan Feu Unisex Eau de Parfum", id: 7590776963139
- slug: armaf-ombre-oud-intense-black-parfum, title: "Armaf Ombre Oud Intense Black Parfum", id: 7590776897603
- slug: liquid-brun-eau-de-parfum, title: "Liquid Brun Eau De Parfum", id: 7590776832067
- slug: afnan-9-pm-elixir-parfum-intense, title: "Afnan 9 PM Elixir Parfum Intense", id: 7590776799299
- slug: prada-luna-rossa-sport-eau-de-toilette, title: "Prada Luna Rossa Sport Eau De Toilette", id: 7590776635459
- slug: versace-bright-crystal-absolu-w-eau-de-parfum-50ml, title: "Versace Bright Crystal Absolu (W) Eau De Parfum - 50ml", id: 7590776406083
- slug: versace-bright-crystal-absolu-w-eau-de-parfum-100ml, title: "Versace Bright Crystal Absolu (W) Eau De Parfum - 100ml", id: 7590776373315
- slug: prada-luna-rossa-ocean-2pcs-gift-set-100ml-eau-de-parfum-spray-10ml-travel-spray, title: "PRADA LUNA ROSSA OCEAN 2PCS Gift Set - 100ml Eau de Parfum Spray + 10ml Travel Spray", id: 7590774276163
- ...and 26 more (see validation-report.json)

### products-without-category (warning) - 9 found

Products that fell back to `uncategorized` - no product_type/tag matched a known category title.

- slug: rihanna-rebl-fleur-for-women-eau-de-parfum, title: "Rihanna Reb'L Fleur For Women Eau de Parfum", id: 7606540992579, tags: Agcosmetics.ca, Audacious Scent, Canadian Beauty Shop, Fruity Chypre Fragrance, Rihanna Fragrance, Rihanna Reb'L Fleur, Women's Perfume
- slug: ysl-myslf-eau-de-parfum-100ml-10ml, title: "YSL MYSLF Eau de Parfum 2PCS Gift Set - - 100ml Eau de Parfum Spray + 10ml Eau de Parfum Mini Spray", id: 7606539747395, tags: Agcosmetics.ca, Canadian Beauty Shop, Men's Fragrance, YSL Gift Set, YSL MYSLF, Yves Saint Laurent
- slug: cerave-hydrating-mineral-sunscreen-spf-50-body-lotion, title: "CeraVe Hydrating Mineral Sunscreen SPF 50 Body Lotion", id: 7606431809603, tags: Agcosmetics.ca, CeraVe Canada., CeraVe Sunscreen, Mineral SPF 50, Sensitive Skin Sun Protection, Zinc Oxide Sunscreen
- slug: hummer-yellow-eau-de-toilette-spray-for-mens, title: "Hummer Yellow Eau de Toilette Spray for Men", id: 7604145291331, tags: 
- slug: versace-bright-crystal-for-women-eau-de-toilette, title: "Versace Bright Crystal for Women Eau De Toilette", id: 7590774472771, tags: Perfume, Women’s Fragrance
- slug: versace-bright-crystal-absolu-for-women-eau-de-parfum, title: "Versace Bright Crystal Absolu for Women Eau De Parfum", id: 7590774440003, tags: Perfume, Women’s Fragrance
- slug: red-door-2pcs-gift-set-100ml-eau-de-parfum-spray-30ml-eau-de-parfum-spray, title: "RED DOOR 2PCS Gift Set - 100ml Eau de Parfum Spray + 30ml Eau de Parfum Spray", id: 7590773915715, tags: Perfume Gift sets, Women’s Fragrance
- slug: white-diamonds-rouge-2pcs-gift-set-30ml-eau-de-toilette-spray-3-7ml-mini-spray, title: "WHITE DIAMONDS ROUGE 2PCS Gift Set - 30ml Eau de Toilette Spray + 3.7ml Mini Spray", id: 7590773751875, tags: Perfume Gift sets, Women’s Fragrance
- slug: armani-my-way-intense-eau-de-parfum, title: "Armani My Way Intense Eau de Parfum", id: 7590756515907, tags: Perfumes, Women’s Fragrance

### product-category-not-found (error) - 0 found

Products whose `category` slug has no matching entry in categories.json.

### categories-without-slug (error) - 0 found

Categories missing a usable `slug`.

### broken-navigation-links (error) - 0 found

Nav entries whose slug doesn't resolve to a known category/page, or whose href is still an external URL.

### invalid-image-urls (error) - 0 found

Product images whose `src` is missing or not a well-formed http(s) URL.

### categories-needing-manual-mapping (info) - 132 found

Categories flagged for human review: unlinked from nav, UI-only groupings, cross-linked, or empty.

- slug: afnan, title: "Afnan", reasons: reachable from multiple nav branches - current parent may be arbitrary
- slug: ag-perfume-and-cosmetics, title: "Ag perfume and cosmetics", reasons: not linked from the site navigation
- slug: al-haramain, title: "Al Haramain", reasons: not linked from the site navigation
- slug: american-crew, title: "American Crew", reasons: not linked from the site navigation
- slug: antiperspirant-roll-ons, title: "Antiperspirant Roll-ons", reasons: has zero products
- slug: arabiyat-prestige, title: "Arabiyat Prestige", reasons: not linked from the site navigation
- slug: armani, title: "Armani", reasons: not linked from the site navigation
- slug: aura-fragrances, title: "Aura Fragrances", reasons: not linked from the site navigation
- slug: axe, title: "AXE", reasons: not linked from the site navigation
- slug: bath-amp-body-works, title: "Bath &amp; Body Works", reasons: not linked from the site navigation
- ...and 122 more (see validation-report.json)
