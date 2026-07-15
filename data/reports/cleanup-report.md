# Cleanup Report

Generated: 2026-07-10T13:20:23.552Z

## Rules applied

- Generate unique slugs if duplicates exist.
- Assign uncategorized/dangling-category products to an 'Uncategorized' category.
- Preserve original Shopify product IDs.
- Preserve original image URLs.
- Do not fabricate prices.
- Do not fabricate stock quantities.

## Summary

- Slugs renamed: 0
- Products reassigned to a category: 9
- "Uncategorized" category: already existed as a real (previously unlinked) Shopify collection - reused instead of duplicating (9 product(s))
- Issues left for manual review: 168

## Slug renames

None - no duplicate slugs were found.

## Category reassignments

- id 7606540992579 "Rihanna Reb'L Fleur For Women Eau de Parfum": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7606539747395 "YSL MYSLF Eau de Parfum 2PCS Gift Set - - 100ml Eau de Parfum Spray + 10ml Eau de Parfum Mini Spray": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7606431809603 "CeraVe Hydrating Mineral Sunscreen SPF 50 Body Lotion": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7604145291331 "Hummer Yellow Eau de Toilette Spray for Men": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7590774472771 "Versace Bright Crystal for Women Eau De Toilette": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7590774440003 "Versace Bright Crystal Absolu for Women Eau De Parfum": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7590773915715 "RED DOOR 2PCS Gift Set - 100ml Eau de Parfum Spray + 30ml Eau de Parfum Spray": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7590773751875 "WHITE DIAMONDS ROUGE 2PCS Gift Set - 30ml Eau de Toilette Spray + 3.7ml Mini Spray": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)
- id 7590756515907 "Armani My Way Intense Eau de Parfum": `uncategorized` -> `uncategorized` (no product_type/tag matched a known category - confirmed fallback)

## Category additions

None.

## Not auto-fixed (needs manual review)

- **products-without-description** (36): Fixing this would mean fabricating an image or description that doesn't exist in the source data.
- **categories-needing-manual-mapping** (132): Taxonomy placement (merge, keep, or drop) requires human judgment, not an automatic fix.

## Guarantees

- Product IDs preserved: true
- Image URLs preserved: true
- Prices fabricated: false
- Stock quantities fabricated: false
