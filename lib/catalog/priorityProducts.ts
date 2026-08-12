// Hand-picked "hero" perfumes that should always surface first on the Home
// page and the Shop/Products page, ahead of the rest of the catalog. Matched
// by title substring (case-insensitive) since there's no stable slug/id list
// to key off of - order here is the display priority (first = shown first).
export const PRIORITY_PRODUCT_TITLES: string[] = [
  "j'adore",
  "reb'l fleur",
  "black opium",
  "burberry her",
  "dylan tourquoise",
  "montblanc legend",
  "stronger with you absolutely",
  "myslf",
  "sauvage",
  "good girl blush",
  "flora gorgeous gardenia",
  "club de nuit women",
  "club de nuit intense",
  "gentleman boisee",
  "9 pm elixir",
  "hawas ice",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary matchers built once so a short needle like "burberry her"
// can't accidentally match inside a longer word like "Burberry Hero" (plain
// .includes() matched "burberry her" as a prefix of "burberry hero...").
export const PRIORITY_PATTERNS = PRIORITY_PRODUCT_TITLES.map((title) => new RegExp(`\\b${escapeRegExp(title)}\\b`, "i"));

// Returns the priority rank of a product title (lower = higher priority),
// or -1 if the title doesn't match any priority product.
export function getPriorityRank(title: string): number {
  return PRIORITY_PATTERNS.findIndex((pattern) => pattern.test(title));
}

// Stable sort that pulls priority-matched items to the front (in the order
// listed above) while leaving the relative order of everything else intact.
export function sortByPriorityFirst<T extends { title: string }>(items: T[]): T[] {
  return [...items]
    .map((item, index) => ({ item, index, rank: getPriorityRank(item.title) }))
    .sort((a, b) => {
      const aHas = a.rank !== -1;
      const bHas = b.rank !== -1;
      if (aHas && bHas) return a.rank - b.rank;
      if (aHas) return -1;
      if (bHas) return 1;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}
